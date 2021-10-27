const express = require('express')
router = express.Router()

const book = require('../services/book')
 
router.get('/get', book.getByPK)
router.get('/getAll', book.getAll)

router.get('/getTwentyBookByCategory', book.getTwentyBookByCategory)

router.post('/register', book.register)
router.put('/update', book.update)

router.post('/borrowRequest', book.borrowRequest)
router.post('/acceptBorrowRequest', book.acceptBorrowRequest)
router.post('/rejectBorrowRequest', book.rejectBorrowRequest)

router.post('/returnRequest', book.returnRequest)
router.post('/acceptReturnRequest', book.acceptReturnRequest)
router.post('/rejectReturnRequest', book.rejectReturnRequest)

module.exports = router