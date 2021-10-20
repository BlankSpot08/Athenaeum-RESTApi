const database = require('../config/database')

const Category = require('../models/Category')

exports.getAllCategories = ((req, res) => {
    Category.findAll()
        .then(value => {
            console.log(value)
            res.sendStatus(value)
        })
        .catch(error => console.log(`Error: ${error}`))
    res.send(402)
})