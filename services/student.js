const Student = require('../models/Student')
const Book = require('../models/Book')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Tag = require('../models/Tag')
const Author = require('../models/Author')
const BookEntered = require('../models/BookEntered')
const BorrowRequest = require('../models/BorrowRequest')
const ReturnRequest = require('../models/ReturnRequest')

const token = require('../security/token')
const jwtDecode = require('jwt-decode')
const bcrypt = require('bcrypt')

const StringTool = require('../helper/StringTool')
const StudentBook = require('../models/StudentBook')

require('dotenv').config()

exports.getById = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        res.sendStatus(400)
        return
    }

    const student = await Student.findByPk(studentInformation.id, {
        include: [
            {
                model: BookEntered
            },
            {
                model: BorrowRequest
            },
            {
                model: ReturnRequest
            },
        ]
    })

    if (student) {
       return res.send(student)
    }   

    return res.status(400).json({
        message: "Error"
    })
}

exports.getAllStudents = async (req, res) => {
    const students = await Student.findAll(
        {
            include: [
                {
                    model: StudentBook,
                    include: [
                        {
                            model: BookEntered,
                            include: [
                                {
                                    model: Book,
                                    include: [
                                        {
                                            model: Category 
                                        },
                                        {
                                            model: Publisher 
                                        },
                                        {
                                            model: Tag 
                                        },
                                        {
                                            model: Author 
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: BorrowRequest
                },
                {
                    model: ReturnRequest
                },
            ]
        }
    )

    res.send(students)
} 

exports.login = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student && student.password.localeCompare(hashedPassword)) {
        const accessToken = token.generateAccessToken(student.id, student.role)

        res.status(200).json({ accessToken: accessToken })
        return
    }

    return res.status(400).json({
        message: "Login failed"
    })
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

        return res.status(200).json()
    } catch(error) {
        console.log(`Error: ${error}`)
        
        return res.status(400).json()
    } 
}

exports.update = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        return res.status(400).json()
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
                id: studentInformation.id
            }
        })

        return res.status(200).json()
    } catch (error) {
        console.log(`Error: ${error}`)

        res.status(400).json()
    }
}