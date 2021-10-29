const StudentBookList = require('../models/StudentBookList')
const Book = require('../models/Book')

const jwtDecode = require('jwt-decode')

exports.getAllOfStudent = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const studentBookList = await StudentBookList.findAll({
        where: {
            student_id: studentInformation.id
        }, 
        include: [
            {
                model: Book
            }
        ]
    })

    return res.status(200).json(studentBookList)
}

exports.add = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const studentBookList = await StudentBookList.create({
        student_id: studentInformation.id,
        book_isbn_number: req.body.isbn_number
    })

    return res.status(200).json(studentBookList)
}

exports.delete = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const studentBookList = await StudentBookList.findOne({
        student_id: studentInformation.id,
        book_isbn_number: req.body.isbn_number
    })

    studentBookList.destroy()

    return res.status(200).json(studentBookList)
}