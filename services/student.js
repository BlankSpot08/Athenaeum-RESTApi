const Student = require('../models/Student')
const Book = require('../models/Book')
const Category = require('../models/Category')
const Publisher = require('../models/Publisher')
const Tag = require('../models/Tag')
const Author = require('../models/Author')
const BookEntered = require('../models/BookEntered')
const BorrowRequest = require('../models/BorrowRequest')
const ReturnRequest = require('../models/ReturnRequest')
const StudentBook = require('../models/StudentBook')

const jwtDecode = require('jwt-decode')
const bcrypt = require('bcrypt')
const stringTool = require('../helper/stringTool')
const path = require('path')
const fs = require('fs')

require('dotenv').config()

exports.getById = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const student = await Student.findByPk(studentInformation.id, {
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

    return res.status(200).json(students)
} 

exports.login = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student && student.password.localeCompare(hashedPassword)) {
        const accessToken = token.generateAccessToken(student.id, student.role)

        return res.status(200).json({ accessToken: accessToken })
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
            firstname: stringTool.capitalize(req.body.firstname),
            middlename: stringTool.capitalize(req.body.middlename),
            lastname: stringTool.capitalize(req.body.lastname),
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

updateInformation = async (req, res, column, newValue) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)
    
    try {
        const student = await Student.update({
           [column] : newValue,
        }, {
            where: {
                id: studentInformation.id
            }
        })

        const temp = await Student.findByPk(studentInformation.id)

        return res.status(200).json(temp)
    } catch (error) {
        console.log(`Error: ${error}`)

        return res.status(400).json({
            message: error
        })
    }
}

exports.updateFirstname = async (req, res) => {
    return updateInformation(req, res, 'firstname', stringTool.capitalize(req.body.firstname))
}

exports.updateMiddlename = async (req, res) => {
    return updateInformation(req, res, 'middlename', stringTool.capitalize(req.body.middlename))
}

exports.updateLastname = async (req, res) => {
    return updateInformation(req, res, 'lastname', stringTool.capitalize(req.body.lastname))
}

exports.updateContactNo = async (req, res) => {
    return updateInformation(req, res, 'contactno', req.body.contactno)
}

exports.updateGuardianContactNo = async (req, res) => {
    return updateInformation(req, res, 'guardiancontactno', req.body.guardiancontactno)
}

exports.updateBalance = async (req, res) => {
    return updateInformation(req, res, 'balance', req.body.balance)
}

exports.updateProfilePicture = async (req, res) => {
    return updateInformation(req, res, 'image_path', req.body.image_path)
}

exports.updatePassword = async (req, res) => {
    return updateInformation(req, res, 'password', req.body.password)
}