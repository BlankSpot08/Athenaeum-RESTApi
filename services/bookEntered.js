const BookEntered = require('../models/BookEntered')

exports.getAll = async (req, res) => {
    const bookEntered = await BookEntered.findAll({ raw: true }) 
    
    res.send(bookEntered)
}