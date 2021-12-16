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
const StudentBookList = require('../models/StudentBookList')

const axios = require('axios')
const token = require('../security/token')
const jwtDecode = require('jwt-decode')
const bcrypt = require('bcrypt')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken');
const emailSender = require('../config/emailSender')
require('dotenv').config()

const baseURL = 'http://localhost:3001/'

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
                model: BorrowRequest,
                include: [
                    {
                        model: BookEntered,
                        include: [
                            {
                                model: Book
                            }
                        ]
                    }
                ]
            },
            {
                model: ReturnRequest,
                include: [
                    {
                        model: BookEntered,
                        include: [
                            {
                                model: Book
                            }
                        ]
                    }
                ]
            }
        ],
    })

    const studentExtraInformation = await axios.post(`${baseURL}student/getById`, { id: student.id })

    if (student) {
        return res.status(200).json(Object.assign(student.dataValues, studentExtraInformation.data || {}))
    }

    return res.status(400).json({
        message: "Error"
    })
}

exports.getAllStudents = async (req, res) => {
    const students = await Student.findAll()

    const studentsID = []

    let i
    for (i = 0; i < students.length; i++) {
        studentsID.push(students[i].id)
    }

    const studentsExtraInformation = await axios.post(`${baseURL}student/getAll`, { studentsID: studentsID })

    const temp = []

    for (i = 0; i < students.length; i++) {
        temp.push(Object.assign(students[i].dataValues, studentsExtraInformation.data[i]))
    }

    return res.status(200).json(temp)
}

exports.search = async (req, res) => {
    const students = await Student.findAll()

    const studentsID = []

    let i;
    for (i = 0; i < students.length; i++) {
        studentsID.push(students[i].id)
    }

    const tempStudents = await axios.post(`${baseURL}student/search`,
        {
            id: req.body.id, name: req.body.name,
            email: req.body.email, contactno: req.body.contactno,
            guardiancontactno: req.body.guardiancontactno,
            studentsID: studentsID
        }
    )

    const temp = []

    for (i = 0; i < students.length; i++) {
        temp.push(Object.assign(students[i].dataValues, tempStudents.data[i]))
    }

    return res.status(200).json(temp)
}

exports.getPenalty = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const student = await Student.findOne({
        where: {
            id: studentInformation.id
        }
    })

    return res.status(200).json(student.balance)
}

exports.login = async (req, res) => {
    const student = await Student.findByPk(req.body.id, { raw: true })

    if (student && await bcrypt.compare(req.body.password, student.password) === true) {
        const accessToken = token.generateAccessToken(student.id, student.role)

        return res.status(200).json({ accessToken: accessToken })
    }

    return res.status(400).json({
        message: "Login failed"
    })
}

exports.register = async (req, res) => {
    const id = req.body.id
    const studentExtraInformation = await axios.post(`${baseURL}student/getById`, { id: id })

    try {
        if (studentExtraInformation.data) {
            const student = await Student.create({
                id: req.body.id,
                password: req.body.password,
                balance: `0`,
                role: `student`,
            })

            return res.status(200).json({})
        }

    } catch (error) {
        console.log(`Error: ${error}`)
    }

    return res.status(400).json({ message: 'Student ID not registered' })
}

updateStudentInformation = async (req, res, column, newValue, id) => {
    try {
        const student = await Student.update({
            [column]: newValue,
        }, {
            where: {
                id: id
            }
        })

        const temp = await Student.findByPk(id)

        return res.status(200).json(temp)
    } catch (error) {
        console.log(`Error: ${error}`)

        return res.status(400).json({
            message: error
        })
    }
}

exports.pay = async (req, res) => {
    let temp = await Student.findByPk(req.body.studentId)

    const newBalance = parseInt(temp.balance) - parseInt(req.body.amount)

    console.log(newBalance)

    return updateStudentInformation(req, res, 'balance', newBalance, req.body.studentId)
}

exports.updateProfilePicture = async (req, res) => {
    const authHeader = req.headers['authorization']

    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)
    const studentId = studentInformation.id

    let temp = await Student.findByPk(studentId)

    if (temp.image_path.localeCompare(req.body.image_path) !== 0) {
        fs.unlinkSync(`images/${temp.image_path}`, { root: '.' })
    }

    return updateStudentInformation(req, res, 'image_path', req.body.image_path, studentId)
}

exports.updatePassword = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)
    const studentId = studentInformation.id

    let temp = await Student.findByPk(studentId)

    if (await bcrypt.compare(req.body.currentPassword, temp.password) === false) {
        return res.status(406).json({ message: 'Current password failed' })
    }

    return updateStudentInformation(req, res, 'password', req.body.password, studentId)
}

exports.authorizeToken = async (req, res) => {
    const token = req.body.token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: err
            })
        }

        if (user.role.localeCompare('student') === 0) {
            return res.status(200).json(true)
        }

        return res.status(403).json(false)
    })
}

exports.forgotPassword = async (req, res) => {
    const email = req.body.email

    const student = await axios.post(`${baseURL}student/getByEmail`, { email: email })

    if (student.data) {
        const temp = emailSender()

        const resetToken = token.generateResetToken(student.data.id, 'student')

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your Athenaeum password',
            text: `You're receiving this e-mail because you or someone else has requested a password reset for your user account at.\n\nClick the link below to reset your password:\nhttp://localhost:8080/?#/student/account/reset-password/token/${resetToken}\n\nNote: The link is only valid for 10 minutes.\nIf you did not request a password reset you can safely ignore this email.`
        }

        temp.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({})
    }

    return res.status(400).json({})
}

exports.resetPassword = async (req, res) => {
    const token = req.body.token
    const newPassword = req.body.newPassword

    console.log(newPassword)

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({
                message: err
            })
        }

        await Student.update(
            {
                password: newPassword
            },
            {
                where: {
                    id: user.id
                }
            })

        return res.status(200).json({})
    })
}

