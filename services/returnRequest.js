const ReturnRequest = require('../models/ReturnRequest')
const BookEntered = require('../models/BookEntered')
const StudentBook = require('../models/StudentBook')
const Student = require('../models/Student')

const jwtDecode = require('jwt-decode')

exports.getAll = async (req, res) => {
    const returnRequests = await ReturnRequest.findAll({
        include: [
            {
                model: Student
            },
            {
                model: BookEntered
            }
        ]
    })

    
    return res.status(200).json(returnRequests)
}

exports.getById  = async (req, res) => {
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

exports.returnRequest = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        return res.status(400).json({
            message: "No Authentication"
        })
    }

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
    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: req.body.student_id,
            book_entered_id: req.body.book_entered_id
        }
    })

    const bookEntered = await BookEntered.update({
        borrowed: 0
    }, {
        where: {
            id: returnRequest.book_entered_id
        }
    })

    const studentBook = await StudentBook.destroy({
        where: {
            student_id: returnRequest.student_id,
            book_entered_id: returnRequest.book_entered_id
        }
    })

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
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        
        return res.status(400).json({
            message: "No Authentication"
        })
    }

    const returnRequest = await ReturnRequest.findOne({
        where: {
            student_id: studentInformation.id,
            book_entered_id: req.body.book_entered_id
        }
    })

    returnRequest.destroy()

    res.status(200).json()  
}