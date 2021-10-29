const express = require('express')
router = express.Router()

const student = require('../services/student')
const studentReadAgain = require('../services/studentReadAgain')
const studentBookList = require('../services/studentBookList')
const borrowRequest = require('../services/borrowRequest')
const returnRequest = require('../services/returnRequest')
const imageUploader = require('../helper/imageUploader')

router.get('/get', student.getById)
router.get('/getAll', student.getAllStudents)

router.get('/login', student.login)
router.post('/register', student.register)

router.put('/updateFirstname', student.updateFirstname)
router.put('/updateMiddlename', student.updateMiddlename)
router.put('/updateLastname', student.updateLastname)
router.put('/updateContactNo', student.updateContactNo)
router.put('/updateGuardianContactNo', student.updateGuardianContactNo)
router.put('/updateBalance', student.updateBalance)

router.put('/updateProfilePicture', imageUploader.upload.single('image'), student.updateProfilePicture)
router.put('/updatePassword', student.updatePassword)

router.get('/getReadAgain', studentReadAgain.getAllOfStudent)
router.get('/getBookList', studentBookList.getAllOfStudent)

router.post('/addToBookList', studentBookList.add)
router.post('/deleteFromBookList', studentBookList.delete)

router.post('/borrowRequest', borrowRequest.borrowRequest)
router.post('/cancelBorrowRequest', borrowRequest.cancelBorrowRequest)

router.post('/returnRequest', returnRequest.returnRequest)
router.post('/cancelReturnRequest', returnRequest.cancelReturnRequest)



module.exports = router