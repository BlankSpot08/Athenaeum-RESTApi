const Category = require('../models/Category')

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

exports.getAll = async (req, res) => {
    const category = await  Category.findAll()

    return res.status(200).json(category)
}

