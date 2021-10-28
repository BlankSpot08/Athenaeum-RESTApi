const express = require('express')
router = express.Router()

const admin = require('../services/admin')
const book = require('../services/book')
const borrowRequest = require('../services/borrowRequest')
const returnRequest = require('../services/returnRequest')

router.get('/get', admin.getByID)
router.get('/getAll', admin.getAllAdmins)

router.get('/login', admin.login)
router.post('/register', admin.register)

router.post('/acceptBorrowRequest', borrowRequest.acceptBorrowRequest)
router.post('/rejectBorrowRequest', borrowRequest.rejectBorrowRequest)      

router.post('/acceptReturnRequest', returnRequest.acceptReturnRequest)
router.post('/rejectReturnRequest', returnRequest.rejectReturnRequest)

router.post('/bookRegister', book.register)
router.put('/update', book.update)

module.exports = router