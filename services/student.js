const Student = require('../models/Student')

const token = require('../security/token')
const jwtDecode = require('jwt-decode')
const bcrypt = require('bcrypt')

const StringTool = require('../helper/StringTool')

require('dotenv').config()


exports.getAllStudents = async (req, res) => {
    const students = await Student.findAll({raw: true}, {
        
    })

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
    return
}

exports.register = async (req, res) => {
    try {
        const student = await Student.create({
            id: req.body.id,
            password: req.body.password,
            firstname: StringTool.capitalize(req.body.firstname),
            middlename: StringTool.capitalize(req.body.middlename),
            lastname: StringTool.capitalize(req.body.lastname),
            emailaddress: req.body.emailaddress,
            contactno: req.body.contactno,
            guardiancontactno: req.body.guardiancontactno,
            balance: `0`,
            role: `student`,
        })

        res.sendStatus(200)
    } catch(error) {
        console.log(`Error: ${error}`)
        
        res.sendStatus(400)
    } finally {
        return
    }
}

exports.update = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token;
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        res.sendStatus(400)
        return
    }
    
    try {
        const student = await Student.update({
            firstname: StringTool.capitalize(req.body.firstname),
            middlename: StringTool.capitalize(req.body.middlename),
            lastname: StringTool.capitalize(req.body.lastname),
            contactno: req.body.contactno,
            guardiancontactno: req.body.guardiancontactno,
            balance: req.body.balance,
        }, {
            where: {
                id: "dummy"
            }
        })

        res.sendStatus(200)
    } catch (error) {
        console.log(`Error: ${error}`)

        res.sendStatus(400)
    } finally {
        return
    }
}

exports.getById = async (req, res) => {
    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student) {
        res.send(student)
        return
    }

    res.sendStatus(400)
}