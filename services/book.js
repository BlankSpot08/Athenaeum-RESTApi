const Book = require('../models/Book')
const Tag = require('../models/Tag')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Author = require('../models/Author')
const BookEntered = require('../models/BookEntered')
const BorrowRequest = require('../models/BorrowRequest')
const StudentBook = require('../models/StudentBook')

const jwtDecode = require('jwt-decode')
const { response } = require('express')
const Student = require('../models/Student')
const ReturnRequest = require('../models/ReturnRequest')

exports.getAll = async (req, res) => {
    const books = await Book.findAll({
        include: [
            {
                model: Publisher
            }, 
            {
                model: Category
            }, 
            {
                model: Tag
            }, 
            {
                model: Author
            }, 
            {
                model: BookEntered
            }
        ]
    })

    return res.status(200).json(books)
}

exports.getByPK = async (req, res) => {
    const book = await Book.findByPk(req.body.id, {
        include: [
            {
                model: Publisher
            }, 
            {
                model: Category
            }, 
            {
                model: Tag
            }, 
            {
                model: Author
            }
        ]
    })

    if (!book) {
        return res.status(400)
    }
    return res.status(200).json(book)
}

exports.getTwentyBookByCategory = async (req, res) => {
    const category = await Category.findOne({
        where: {
            name: req.body.category
        }
    })

    const books = await Book.findAll({
        where: {
            category_id: category.id
        },
        include: [
            {
                model: Publisher
            }, 
            {
                model: Category
            }, 
            {
                model: Tag
            }, 
            {
                model: Author
            }
        ],
        limit: 20
    })

    res.status(200).json(books)
}

exports.register = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const admin = jwtDecode(token)

    const requestedCategory = req.body.category
    const category = await Category.findOne({
        where: {
            name: requestedCategory.name
        },
        raw: true
    })

    const requestedPublisher = req.body.publisher
    let publisher = await Publisher.findOne({
        where: {
            name: requestedPublisher.name
        },
        raw: true
    })

    if (!publisher) {
        Publisher.create({
            name: requestedPublisher.name,
            email: requestedPublisher.email,
            contactno: requestedPublisher.contactno,
            address: requestedPublisher.address
        })

        publisher = await Publisher.findOne({
            where: {
                name: requestedPublisher.name
            },
            raw: true
        })
    }

    try {
        let book = await Book.findByPk(req.body.isbn_number)

        if (!book) {
            book = await Book.create({
                isbn_number: req.body.isbn_number,
                category_id: category.id,
                title: req.body.title,
                edition: req.body.edition,
                publisher_id: publisher.id,
                publication_year: req.body.publication_year,
                synopsis: req.body.synopsis,
                price: req.body.price,
                image_path: req.body.image_path,
            }, {
                raw: true
            })
            
            const requestTags = req.body.tag
            let i = 0
            for (i = 0; i < requestTags.length; i++) {
                const temp = requestTags[i]

                let tag = await Tag.findOne({
                    where: {
                        name: temp.name
                    }
                }, {
                    raw: true
                })

                if (!tag) {
                    tag = await Tag.create({
                        name: temp.name
                    })
                }

                book.addTag(tag)
            }

            const requestAuthors = req.body.author
            i = 0
            for (i = 0; i < requestAuthors.length; i++) {
                const temp = requestAuthors[i]

                let author = await Author.findOne({
                    where: {
                        name: temp.name
                    }
                })

                if (!author) {
                    author = await Author.create({
                        name: temp.name,
                        email: temp.email,
                        contactno: temp.contactno,
                        address: temp.address
                    })
                }

                book.addAuthor(author)
            }
        }

        const bookEntered = await BookEntered.create({
            book_isbn_number: book.isbn_number,
            date_created: new Date,
            created_by: admin.id,
            borrowed: 0
        }, {
            raw: true
        })

        return res.status(200)
    } catch(error) {
        console.log(`Error: ${error}`)
        return res.status(400)
    }
}

exports.update = async (req, res) => {
    const category = await Category.findOne({
        where: {
            name: req.body.category
        }
    })

    requestedPublisher = req.body.publisher
    let publisher = await Publisher.findOne({
        where: {
            name: requestedPublisher.name
        }
    })

    publisher = await Publisher.update({
        name: requestedPublisher.name,
        email: requestedPublisher.email,
        contactno: requestedPublisher.contactno,
        address: requestedPublisher.address
    }, {
        where: {
            name: requestedPublisher.name
        }
    })

    Book.update({
        isbn_number: req.body.isbn_number,
        category_id: category.id,
        title: req.body.title,
        edition: req.body.edition,
        publisher_id: publisher.id,
        publication_year: req.body.publication_year,
        synopsis: req.body.synopsis,
        price: req.body.price,
        image_path: req.body.image_path
    }, {
        where: {
            isbn_number: req.body.isbn_number
        }
    })

    const book = await Book.findByPk(req.body.isbn_number)

    const requestedTags = req.body.tag

    const tags = await Tag.findAll()
    book.removeTags(tags)
    let i = 0;
    for (i = 0; i < requestedTags.length; i++) {
        const temp = requestedTags[i]

        let tag = await Tag.findOne({
            where: {
                name: temp.name
            }
        }, {
            raw: true
        })

        if (!tag) {
            tag = await Tag.create({
                name: temp.name
            })
        }

        book.addTag(tag)
    }

    const authors = await Author.findAll()

    book.removeAuthors(authors)
    const requestedAuthors = req.body.author
    for (i = 0; i < requestedAuthors.length; i++) {
        const temp = requestedAuthors[i]

        let author = await Author.findOne({
            where: {
                name: temp.name
            },
        }, {
            raw: true
        })

        if (!author) {
            author = await Author.create({
                name: temp.name,
                email: temp.email,
                contactno: temp.contactno,
                address: temp.address
            })
        }

        book.addAuthor(author)
    }

    return response.status(200)
}

exports.borrowRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        
        return res.status(400).json({
            message: "No Authentication"
        })
    }
    
    const bookEntered = await BookEntered.findOne({
        where: {
            book_isbn_number: req.body.isbn_number,
            borrowed: 0
        }
    })

    if (!bookEntered) {
        return res.status(400).json({
            message: "No more available book."
        })
    }

    const borrowRequest = await BorrowRequest.create({
        student_id: studentInformation.id,
        book_entered_id: bookEntered.id,
        date_requested: new Date
    })

    await bookEntered.update({
        borrowed: 1
    })

    return res.status(200).json()
}

exports.acceptBorrowRequest = async (req, res) => {
    const borrowRequest = await BorrowRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const date_return = new Date()
    date_return.setDate(date_return.getDate() + 14)

    const studentBook = await StudentBook.create({
        student_id: borrowRequest.student_id,
        book_entered_id: borrowRequest.book_entered_id,
        date_requested: borrowRequest.date_requested,
        date_acquired: new Date,
        date_return: date_return
    })

    borrowRequest.destroy()

    return res.status(200).json()
}

exports.rejectBorrowRequest = async (req, res) => {
    const borrowRequest = await BorrowRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: borrowRequest.book_entered_id
        }
    })

    borrowRequest.destroy()

    return res.status(200).json()
}

exports.returnRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        return res.status(400).json({
            message: "No Authentication"
        })
    }

    const studentBook = await StudentBook.findOne({
        where: {
            student_id: studentInformation.id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const returnRequest = await ReturnRequest.create({
        student_id: studentInformation.id,
        book_entered_id: studentBook.book_entered_id,
        date_requested: new Date
    })

    res.status(200).json()
}

exports.acceptReturnRequest = async (req, res) => {
    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: returnRequest.book_entered_id
        }
    })

    const studentBook = await StudentBook.destroy({
        where: {
            student_id: returnRequest.student_id,
            book_entered_id: returnRequest.book_entered_id
        }
    })

    returnRequest.destroy()

    res.status(200).json()
}

exports.rejectReturnRequest = async (req, res) => {
    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    returnRequest.destroy()

    res.status(200).json()
}