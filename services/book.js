const Book = require('../models/Book')
const Tag = require('../models/Tag')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Author = require('../models/Author')
const BookEntered = require('../models/BookEntered')
const BorrowRequest = require('../models/BorrowRequest')
const { Op } = require("sequelize")

const jwtDecode = require('jwt-decode')
const BookAuthor = require('../models/BookAuthor')

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
            }
        ],
    })

    return res.status(200).json(books)
}

exports.microSearch = async (req, res) => {
    const isbn = req.body.isbn.toLowerCase()
    const title = req.body.title.toLowerCase()
    const authorName = req.body.author_name.toLowerCase()
    const publisherName = req.body.publisher_name.toLowerCase()
    const category = req.body.category.toLowerCase()

    const books = await Book.findAll({
        include: [
            {
                model: Category,
                as: 'category'
            },
            {
                model: Author,
                as: 'authors'
            },
            {
                model: Tag,
                as: 'tags'
            },
            {
                model: Publisher,
                as: 'publisher'
            }
        ],
        where: {
            [Op.and]: [
                {
                    isbn: {
                        [Op.iLike]: `%${isbn}%`
                    },
                    title: {
                        [Op.iLike]: `%${title}%`
                    },
                },
                {
                    '$category.name$': {
                        [Op.iLike]: `%${category}%`
                    }
                },
                {
                    '$authors.name$': {
                        [Op.iLike]: `%${authorName}%`
                    }
                },
                {
                    '$publisher.name$': {
                        [Op.iLike]: `%${publisherName}%`
                    }
                }
            ]
        }
    })

    return res.status(200).json(books)
}

exports.generalSearch = async (req, res) => {
    const query = req.body.query.toLowerCase()

    const books = await Book.findAll({
        include: [
            {
                model: Category,
                as: 'category'
            },
            {
                model: Author,
                as: 'authors'
            },
            {
                model: Tag,
                as: 'tags'
            },
            {
                model: Publisher,
                as: 'publisher'
            }
        ],
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: `%${query}%`
                    },

                },
                {
                    '$category.name$': {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    '$authors.name$': {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    '$publisher.name$': {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    '$tags.name$': {
                        [Op.iLike]: `%${query}%`
                    }
                }
            ]
        }
    })

    return res.status(200).json(books)
}


exports.getByISBN = async (req, res) => {
    const book = await Book.findOne(
        {
            where: {
                isbn: req.body.isbn_number
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
            ]
        }
    )

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

exports.getAllByCategory = async (req, res) => {
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
        ]
    })

    res.status(200).json(books)
}

exports.register = async (req, res) => {
    console.log(req.body)

    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const admin = jwtDecode(token)

        const category = await Category.findOne({
            where: {
                name: req.body.category_name
            }
        })

        let publisher = await Publisher.findOne({
            where: {
                name: req.body.publisher_name
            }
        })

        if (!publisher) {
            await Publisher.create({
                name: req.body.publisher_name,
                email: req.body.publisher_email,
                contactno: req.body.publisher_contactno,
                address: req.body.publisher_address
            })
        }

        publisher = await Publisher.findOne({
            where: {
                name: req.body.publisher_name
            }
        })

        let book = await Book.findOne({ where: { isbn: req.body.isbn_number } })

        if (!book) {
            book = await Book.create({
                isbn: req.body.isbn_number,
                category_id: category.id,
                title: req.body.title,
                edition: req.body.edition,
                publisher_id: publisher.id,
                publication_year: req.body.publication_year,
                synopsis: req.body.synopsis,
                price: req.body.price,
                image_path: req.body.image_path,
            })

            const requestTags = req.body.tags.split(',')

            let i = 0
            for (i = 0; i < requestTags.length; i++) {
                const temp = requestTags[i]

                let tag = await Tag.findOne({
                    where: {
                        name: temp
                    }
                })

                if (!tag) {
                    tag = await Tag.create({
                        name: temp
                    })
                }

                book.addTag(tag)
            }

            const requestAuthors = req.body.authors

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
            book_id: book.id,
            date_created: new Date,
            created_by: admin.id,
            borrowed: 0
        })

        return res.status(200).json({})
    } catch (error) {
        console.log(`Error: ${error}`)
        return res.status(400).json({})
    }
}

exports.update = async (req, res) => {
    // Edit category
    const category = await Category.findOne({
        where: {
            name: req.body.category_name
        }
    })

    let publisher_name

    // Edit publisher
    if (req.body.old_publisher_name.localeCompare(req.body.new_publisher_name) === 0) {
        const old_publisher = req.body.old_publisher_name

        await Publisher.update({
            email: req.body.publisher_email,
            contactno: req.body.publisher_contactno,
            address: req.body.publisher_address
        }, {
            where: {
                name: old_publisher
            }
        })

        publisher_name = old_publisher
    }

    // New publisher
    else {
        await Publisher.create({
            name: req.body.new_publisher_name,
            email: req.body.publisher_email,
            contactno: req.body.publisher_contactno,
            address: req.body.publisher_address
        })

        publisher_name = req.body.new_publisher_name
    }

    const publisher = await Publisher.findOne({
        where: {
            name: publisher_name
        }
    })

    // Edit book
    await Book.update({
        isbn: req.body.new_isbn_number,
        category_id: category.id,
        title: req.body.title,
        edition: req.body.edition,
        publisher_id: publisher.id,
        publication_year: req.body.publication_year,
        synopsis: req.body.synopsis,
        price: req.body.price || 0,
        image_path: req.body.image_path
    }, {
        where: {
            isbn: req.body.old_isbn_number
        }
    })

    const book = await Book.findOne({
        where: {
            isbn: req.body.new_isbn_number
        }
    })

    // Edit tags
    const requestedTags = req.body.tags.split(',')

    const tags = await Tag.findAll()
    book.removeTags(tags)

    let i = 0;
    for (i = 0; i < requestedTags.length; i++) {
        const temp = requestedTags[i]

        let tag = await Tag.findOne({
            where: {
                name: temp
            }
        }, {
            raw: true
        })

        if (!tag) {
            tag = await Tag.create({
                name: temp
            })
        }

        book.addTag(tag)
    }

    // Edit authors
    const authors = await Author.findAll()
    book.removeAuthors(authors)

    const requestedAuthors = req.body.authors

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
        } else {
            author.update(
                {
                    name: temp.name,
                    email: temp.email,
                    contactno: temp.contactno,
                    address: temp.address
                }
            )
        }

        book.addAuthor(author)
    }

    // Handle old publisher

    const oldPublisher = await Publisher.findOne({
        where: {
            name: req.body.old_publisher_name
        }
    })

    const oldPublisherBooks = await Book.findOne({
        where: {
            publisher_id: oldPublisher.id
        }
    })

    if (!oldPublisherBooks) {
        oldPublisher.destroy()
    }


    // Handle old authors
    const oldRequestedAuthors = req.body.old_authors

    for (i = 0; i < oldRequestedAuthors.length; i++) {
        const temp = oldRequestedAuthors[i]

        const author = await Author.findOne({
            where: {
                name: temp.name
            }
        })

        const book_author = await BookAuthor.findOne({
            where: {
                author_id: author.id
            }
        })

        if (!book_author) {
            author.destroy()
        }
    }

    return res.status(200).json({})
}