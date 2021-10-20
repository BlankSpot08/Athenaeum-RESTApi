const Student = require('../models/Student')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

require('dotenv').config()


exports.getAllStudents = (req, res) => {
    Student.findAll()
        .then(value => {
            console.log(value)
            // res.send("Hello World")
            res.send("Hello")
        })
        .catch(error => console.log(`Error: ${error}`))
    // res.send(402)
}

exports.login = (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    Student.findByPk(req.body.id)
        .then((student) => {
            if (student !== null) {
                if (student.password.localeCompare(hashedPassword)) {
                    const { id, password, firstname, lastname, emailaddress, contactno, guardiancontactno, balance, role } = student
                    const temp = { id, password, firstname, lastname, emailaddress, contactno, guardiancontactno, balance, role }

                    const accessToken = jwt.sign(temp, process.env.ACCESS_TOKEN_SECRET)

                    res.send({accessToken: accessToken})
                }
            }
        })
        .catch(error => {
            console.log(`Error: ${error}`)

            res.sendStatus(400)
        })
}

exports.registerStudent = (req, res) => {
    Student.create({
        id: req.body.id,
        password: req.body.password,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        emailaddress: req.body.emailaddress,
        contactno: req.body.contactno,
        guardiancontactno: req.body.guardiancontactno,
        balance: '0',
        role: 'student',
    })

    res.send(200)
}

exports.helloWorld = (req, res) => {
    res.send("Hello World")
}