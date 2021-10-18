const database = require('../config/database')

const Student = require('../models/Student')

exports.getAllStudents = ((req, res) => {
    Student.findAll()
        .then(value => {
            console.log(value)
            res.send(value)
        })
        .catch(error => console.log(`Error: ${error}`))
    res.send(402)
})