const express = require('express')
router = express.Router()

const student = require('../services/student')
const studentReadAgain = require('../services/studentReadAgain')
const studentBookList = require('../services/studentBookList')
const borrowRequest = require('../services/borrowRequest')
const returnRequest = require('../services/returnRequest')

router.get('/get', student.getById)
router.get('/getAll', student.getAllStudents)

router.get('/login', student.login)
router.post('/register', student.register)
router.put('/update', student.update)

router.get('/getReadAgain', studentReadAgain.getAllOfStudent)
router.get('/getBookList', studentBookList.getAllOfStudent)

router.post('/borrowRequest', borrowRequest.borrowRequest)
router.post('/cancelBorrowRequest', borrowRequest.cancelBorrowRequest)

router.post('/returnRequest', returnRequest.returnRequest)
router.post('/cancelReturnRequest', returnRequest.cancelReturnRequest)

module.exports = router