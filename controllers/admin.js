const database = require('../config/database')

const Admin = require('../models/Admin')

exports.getAllAdmins = ((req, res) => {
    Admin.findAll()
        .then(value => {
            console.log(value)
            res.send(value)
        })
        .catch(error => console.log(`Error: ${error}`))
    res.send(402)
})