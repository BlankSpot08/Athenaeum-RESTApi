const database = require('../config/database')

const BookEntered = require('../models/BookEntered')

exports.getAllBookEntered = ((req, res) => {
    BookEntered.findAll()
        .then(value => {
            console.log(value)
            res.send(value)
        })
        .catch(error => console.log(`Error: ${error}`))
    res.send(402)
})