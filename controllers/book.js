const express = require('express')
router = express.Router()

const book = require('../services/book')
const student = require('../services/student')

router.post('/get', book.getByISBN)
router.get('/getAll', book.getAll)

router.post('/getTwentyBookByCategory', book.getTwentyBookByCategory)
router.post('/getAllByCategory', book.getAllByCategory)

module.exports = router