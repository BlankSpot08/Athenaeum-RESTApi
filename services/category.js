const database = require('../config/database')

const Category = require('../models/Category')

exports.getAllCategories = (req, res) => {
    Category.findAll()
        .then(value => {
            console.log(value)
            res.sendStatus(value)
        })
        .catch(error => console.log(`Error: ${error}`))
    res.send(402)
    return
}

exports.getByTitle = async (req, res) => {
    const category = await Category.findOne({
        where: {
            name: req.body.name
        }
    })
    console.log(category)

    res.send(200)
}