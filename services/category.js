const Category = require('../models/Category')

exports.getAll = async (req, res) => {
    Category.findAll()
        .then(value => {
            console.log(value)
            return res.sendStatus(value)
        })
        .catch(error => console.log(`Error: ${error}`))

    const category = await  Category.findAll()

    return res.status(200).json(category)
}

exports.getByTitle = async (req, res) => {
    const category = await Category.findOne({
        where: {
            name: req.body.name
        }
    })

    if (category) {
        return res.status(200).json(category)
    }
    return res.status(400).json()
}