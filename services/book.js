const Book = require('../models/Book')
const Tag = require('../models/Tag')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Author = require('../models/Author')

// const token = require('../security/token')
// const bcrypt = require('bcrypt')

exports.getAll = async (req, res) => {
    const books = await Book.findAll()

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