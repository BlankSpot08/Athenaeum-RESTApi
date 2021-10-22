const BookEntered = require('../models/BookEntered')

const Book = require('../models/Book')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Tag = require('../models/Tag')
const Author = require('../models/Author')

exports.getAll = async (req, res) => {
    const bookEntered = await BookEntered.findAll({
        include: [
            {
                model: Book,
                include: [
                    {
                        model: Category 
                    },
                    {
                        model: Publisher 
                    },
                    {
                        model: Tag 
                    },
                    {
                        model: Author 
                    },
                ]
            }
        ]
    }) 
    
    res.send(bookEntered)
}