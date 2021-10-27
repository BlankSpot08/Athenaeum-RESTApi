const BorrowRequest = require('../models/BorrowRequest')
const BookEntered = require('../models/BookEntered')
const Student = require('../models/Student')

const jwtDecode = require('jwt-decode')

exports.getAllBorrowRequest = async (req, res) => {
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

    res.send(borrowRequests)
    return
}

exports.getById  = async (req, res) => {
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

    const borrowRequests = await BorrowRequest.findAll({
        where: {
            student_id: studentInformation.id
        }
    })

    res.send(borrowRequests)
    return
}