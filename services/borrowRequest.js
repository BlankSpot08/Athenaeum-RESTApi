const BorrowRequest = require('../models/BorrowRequest')
const BookEntered = require('../models/BookEntered')
const Book = require('../models/Book')
const Student = require('../models/Student')
const StudentBook = require('../models/StudentBook')

const jwtDecode = require('jwt-decode')
const axios = require('axios')
const { Op } = require('sequelize')

const baseURL = 'http://localhost:3001/'

exports.getAll = async (req, res) => {
    const borrowRequests = await BorrowRequest.findAll({
        include: [
            {
                model: Student
            },
            {
                model: BookEntered,
                include: [
                    {
                        model: Book
                    }
                ]
            }
        ]
    })

    return res.status(200).json(borrowRequests)
}

exports.getById = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const borrowRequests = await BorrowRequest.findOne({
        where: {
            student_id: studentInformation.id
        }
    })

    if (borrowRequests) {
        return res.status(200).json(borrowRequests)
    }

    return res.status(400).json()
}

exports.search = async (req, res) => {
    const id = req.body.id.toLowerCase()
    const isbn = req.body.isbn.toLowerCase()
    const title = req.body.title.toLowerCase()

    let dateRequested = req.body.date_requested
    dateRequested = dateRequested ? new Date(dateRequested).toISOString() : ''

    const conditions = [
        {
            student_id: {
                [Op.iLike]: `%${id}%`
            },
        },
        {
            '$book_entered.book.isbn$': {
                [Op.iLike]: `%${isbn}%`
            }
        },
        {
            '$book_entered.book.title$': {
                [Op.iLike]: `%${title}%`
            }
        },
    ]

    if (dateRequested) {
        conditions.push(
            {
                date_requested: dateRequested
            }
        )
    }

    const borrowRequests = await BorrowRequest.findAll({
        include: [
            {
                model: Student,
                as: 'student'
            },
            {
                model: BookEntered,
                as: 'book_entered',
                include: [
                    {
                        model: Book,
                        as: 'book'
                    }
                ]
            }
        ],
        where: {
            [Op.and]: conditions
        }
    })

    return res.status(200).json(borrowRequests)
}

exports.borrowRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const book = await Book.findOne({
        where: {
            isbn: req.body.isbn_number
        }
    })

    const bookEntered = await BookEntered.findOne({
        where: {
            book_id: book.id,
            borrowed: 0
        }
    })

    if (!bookEntered) {
        return res.status(400).json({
            message: "No more available book."
        })
    }

    const borrowRequest = await BorrowRequest.create({
        student_id: studentInformation.id,
        book_entered_id: bookEntered.id,
        date_requested: new Date().toISOString()
    })

    await bookEntered.update({
        borrowed: 1
    })

    return res.status(200).json()
}

exports.acceptBorrowRequest = async (req, res) => {
    const borrowRequest = await BorrowRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const dateReturn = new Date()
    dateReturn.setDate(dateReturn.getDate() + 7)
    console.log(dateReturn)

    const studentBook = await StudentBook.create({
        student_id: borrowRequest.student_id,
        book_entered_id: borrowRequest.book_entered_id,
        date_requested: borrowRequest.date_requested,
        date_acquired: new Date().toISOString(),
        date_return: dateReturn
    })

    borrowRequest.destroy()

    return res.status(200).json()
}

exports.rejectBorrowRequest = async (req, res) => {
    const borrowRequest = await BorrowRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: borrowRequest.book_entered_id
        }
    })

    borrowRequest.destroy()

    return res.status(200).json()
}

exports.cancelBorrowRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    console.log(req.body)

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const borrowRequest = await BorrowRequest.findOne({
        where: {
            student_id: studentInformation.id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: borrowRequest.book_entered_id
        }
    })

    borrowRequest.destroy()

    return res.status(200).json()
}