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
    
    res.status(200).json(bookEntered)
}


exports.getTotalAvailable = async (req, res) => {
    const totalCount = await BookEntered.count({where: {
        book_id: req.body.book_id,
    }})

    const notBorrowedCount = await BookEntered.count({where: {
        book_id: req.body.book_id,
        borrowed: 0
    }})
    
    res.status(200).json({total: totalCount, borrowed: notBorrowedCount})
}