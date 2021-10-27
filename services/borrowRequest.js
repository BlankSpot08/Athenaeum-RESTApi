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

    
    return res.status(200).json(borrowRequests)
}

exports.getById  = async (req, res) => {
    const authHeader = req.headers['authorization']
    let token
    let studentInformation
    if (authHeader) {
        token = authHeader.split(' ')[1]
        studentInformation = jwtDecode(token)
    } else {
        return res.status(400).json()
    }

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