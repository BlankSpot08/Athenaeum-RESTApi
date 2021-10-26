const Book = require('../models/Book')
const Tag = require('../models/Tag')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Author = require('../models/Author')
const BookEntered = require('../models/BookEntered')

const jwtDecode = require('jwt-decode')
const Student = require('../models/Student')
const { findByPk } = require('../models/Publisher')
const BookAuthor = require('../models/BookAuthor')

// const token = require('../security/token')
// const bcrypt = require('bcrypt')

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
            }, {
                model: BookEntered
            }
        ]
    })

    res.send(books)
    return
}

exports.getByPK = async (req, res) => {
    const book = await Book.findByPk(req.body.id, {
        include: [{
            model: Publisher
        }, {
            model: Category
        }, {
            model: Tag
        }, {
            model: Author
        }]
    })

    console.log(book)

    res.send(book)
    return
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
                // tag: req.body.tag,
                // author: req.body.author
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

        res.send(200)
    } catch(error) {
        console.log(`Error: ${error}`)
        res.sendStatus(400)
    } finally {
        return
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

    res.sendStatus(200)
}