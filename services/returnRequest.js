const ReturnRequest = require('../models/ReturnRequest')
const BookEntered = require('../models/BookEntered')
const StudentBook = require('../models/StudentBook')
const StudentReadAgain = require('../models/StudentReadAgain')
const Book = require('../models/Book')
const Student = require('../models/Student')

const jwtDecode = require('jwt-decode')
const { Op } = require('sequelize')

exports.getAll = async (req, res) => {
    const returnRequests = await ReturnRequest.findAll({
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

    return res.status(200).json(returnRequests)
}

exports.getById = async (req, res) => {
    const authHeader = req.headers['authorization']
    let studentInformation
    let token

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: studentInformation.id
        }
    })

    if (returnRequest) {
        return res.status(200).json(returnRequest)
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
            }

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
        }
    ]

    if (dateRequested) {
        conditions.push(
            {
                date_requested: dateRequested
            }
        )
    }

    const returnRequests = await ReturnRequest.findAll({
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

    return res.status(200).json(returnRequests)
}

exports.returnRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const studentBook = await StudentBook.findOne({
        where: {
            student_id: studentInformation.id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const returnRequest = await ReturnRequest.create({
        student_id: studentInformation.id,
        book_entered_id: studentBook.book_entered_id,
        date_requested: new Date
    })

    res.status(200).json()
}

exports.acceptReturnRequest = async (req, res) => {
    console.log('nope')
    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.findOne({
        where: {
            id: req.body.book_entered_id
        }
    })

    bookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: returnRequest.book_entered_id
        }
    })

    const studentBook = await StudentBook.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const return_date = new Date(studentBook.date_return);

    const currentDate = new Date()
    let penalty = 0

    while (currentDate > return_date) {
        currentDate.setDate(currentDate.getDate() - 6)

        penalty += 20
    }

    const student = await Student.findOne({
        where: {
            id: req.body.student_id
        }
    })

    const newBalance = parseInt(student.balance) + penalty

    student.update({
        balance: newBalance
    })

    studentBook.destroy({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const studentReadAgain = await StudentReadAgain.findOne({
        where: {
            student_id: req.body.student_id,
            book_id: bookEntered.book_id
        }
    })

    if (!studentReadAgain) {
        await StudentReadAgain.create({
            student_id: req.body.student_id,
            book_id: bookEntered.book_id
        })
    }

    returnRequest.destroy()

    res.status(200).json()
}

exports.rejectReturnRequest = async (req, res) => {
    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    returnRequest.destroy()

    res.status(200).json()
}

exports.cancelReturnRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation

    token = authHeader.split(' ')[1]
    studentInformation = jwtDecode(token)

    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: studentInformation.id,
            book_entered_id: req.body.book_entered_id
        }
    })

    returnRequest.destroy()

    res.status(200).json()
}