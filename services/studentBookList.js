const StudentBookList = require('../models/StudentBookList')
const Book = require('../models/Book')

const jwtDecode = require('jwt-decode')
const { findAll, findOne } = require('../models/StudentBookList')

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

    const book = await Book.findOne(
        {
            where: {
                isbn: req.body.isbn_number
            }
        }
    )

    const studentBookList = await StudentBookList.create({
        student_id: studentInformation.id,
        book_id: book.id
    })

    return res.status(200).json(studentBookList)
}

exports.delete = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    console.log(req.body.isbn_number)
    const book = await Book.findOne(
        {
            where: {
                isbn: req.body.isbn_number
            }
        }
    )

    const studentBookList = await StudentBookList.findOne({
        where: {
            student_id: studentInformation.id,
            book_id: book.id
        }
    })

    studentBookList.destroy()

    return res.status(200).json(studentBookList)
}

exports.isFavorite = async (req, res) => {
    const authHeader = req.headers['authorization']

    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const list = await StudentBookList.findAll({
        where: {
            student_id: studentInformation.id
        }
    })

    const book = await Book.findOne(
        {
            where: {
                isbn: req.body.isbn_number
            }
        }
    )

    console.log('test')
    console.log(book)

    let i
    for (i = 0; i < list.length; i++) {
        if (list[i].book_id === book.id) {
            return res.status(200).json(true)
        }
    }

    return res.status(400).json(false)
}