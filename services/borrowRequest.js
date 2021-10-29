const BorrowRequest = require('../models/BorrowRequest')
const BookEntered = require('../models/BookEntered')
const Student = require('../models/Student')

const jwtDecode = require('jwt-decode')

exports.getAll = async (req, res) => {
    const borrowRequests = await BorrowRequest.findAll({
        include: [
            {
                model: Student
            },
            {
                model: BookEntered
            }
        ]
    })

    
    return res.status(200).json(borrowRequests)
}

exports.getById  = async (req, res) => {
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

exports.borrowRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)
    
    const bookEntered = await BookEntered.findOne({
        where: {
            book_isbn_number: req.body.isbn_number,
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
        date_requested: new Date
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

    const date_return = new Date()
    date_return.setDate(date_return.getDate() + 14)

    const studentBook = await StudentBook.create({
        student_id: borrowRequest.student_id,
        book_entered_id: borrowRequest.book_entered_id,
        date_requested: borrowRequest.date_requested,
        date_acquired: new Date,
        date_return: date_return
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