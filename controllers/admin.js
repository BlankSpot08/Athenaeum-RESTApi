const express = require('express')
router = express.Router()

const student = require('../services/student')
const admin = require('../services/admin')
const book = require('../services/book')
const adminRequest = require('../services/adminRequest')
const borrowRequest = require('../services/borrowRequest')
const returnRequest = require('../services/returnRequest')
const imageUploader = require('../helper/imageUploader')

router.get('/get', admin.getByID)
router.get('/getAllAdmins', admin.getAllAdmins)
router.get('/getAllStudents', student.getAllStudents)

router.get('/login', admin.login)

router.post('/studentSearch', student.search)
router.put('/studentPay', student.pay)

router.get('/getAllAdminRequests', adminRequest.getAll)
router.post('/acceptAdminRequest', adminRequest.acceptRegistration)
router.delete('/rejectAdminRequest', adminRequest.rejectRegistration)

router.put('/updateFirstname', admin.updateFirstname)
router.put('/updateMiddlename', admin.updateMiddlename)
router.put('/updateLastname', admin.updateLastname)
router.put('/updateContactNo', admin.updateContactNo)

router.put('/updateProfilePicture', imageUploader.upload.single('image'), admin.updateProfilePicture)
router.put('/updatePassword', admin.updatePassword)

router.get('/getAllBorrowRequests', borrowRequest.getAll)
router.post('/borrowRequestSearch', borrowRequest.search)
router.post('/acceptBorrowRequest', borrowRequest.acceptBorrowRequest)
router.delete('/rejectBorrowRequest', borrowRequest.rejectBorrowRequest)

router.get('/getAllReturnRequests', returnRequest.getAll)
router.post('/returnRequestSearch', returnRequest.search)
router.post('/acceptReturnRequest', returnRequest.acceptReturnRequest)
router.delete('/rejectReturnRequest', returnRequest.rejectReturnRequest)

router.get('/getAllBooks', book.getAll)
router.post('/getBook', book.getByISBN)
router.post('/bookSearch', book.microSearch)
router.post('/bookRegister', imageUploader.upload.single('image'), book.register)
router.put('/bookUpdate', imageUploader.upload.single('image'), book.update)

router.post('/authorize', admin.authorizeToken)

module.exports = router