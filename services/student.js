const Student = require('../models/Student')

const token = require('../security/token')
const bcrypt = require('bcrypt')

require('dotenv').config()


exports.getAllStudents = async (req, res) => {
    const students = await Student.findAll({raw: true})

    res.send(students)
}   

exports.login = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student && student.password.localeCompare(hashedPassword)) {
        const accessToken = token.generateAccessToken(student.id, student.role)

        res.send({ accessToken: accessToken })
        return
    }

    res.sendStatus(400)
}

exports.register = (req, res) => {
    Student.create({
        id: req.body.id,
        password: req.body.password,
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        emailaddress: req.body.emailaddress,
        contactno: req.body.contactno,
        guardiancontactno: req.body.guardiancontactno,
        balance: `0`,
        role: `student`,
    })

    res.send(200)
    return
}

exports.getById = async (req, res) => {
    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student) {
        res.send(student)
        return
    }

    res.sendStatus(400)
}