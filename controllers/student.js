const express = require('express')
router = express.Router()

const student = require('../services/student')
const studentReadAgain = require('../services/studentReadAgain')
const studentBookList = require('../services/studentBookList')
const borrowRequest = require('../services/borrowRequest')
const returnRequest = require('../services/returnRequest')
const book = require('../services/book')

const imageUploader = require('../helper/imageUploader')

router.get('/get', student.getById)
router.get('/getPenalty', student.getPenalty)

router.put('/updateProfilePicture', imageUploader.upload.single('image'), student.updateProfilePicture)
router.put('/updatePassword', student.updatePassword)

router.get('/getReadAgain', studentReadAgain.getAllOfStudent)
router.get('/getBookList', studentBookList.getAllOfStudent)

router.post('/addToBookList', studentBookList.add)
router.delete('/deleteFromBookList', studentBookList.delete)

router.post('/borrowRequest', borrowRequest.borrowRequest)
router.delete('/cancelBorrowRequest', borrowRequest.cancelBorrowRequest)

router.post('/returnRequest', returnRequest.returnRequest)
router.delete('/cancelReturnRequest', returnRequest.cancelReturnRequest)

router.post('/isBookFavorite', studentBookList.isFavorite)

router.post('/bookSearch', book.generalSearch)
router.get('/getAllBooks', book.getAll)

router.post('/authorize', student.authorizeToken)

module.exports = router