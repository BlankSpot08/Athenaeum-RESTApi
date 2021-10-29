const express = require('express')
router = express.Router()

const book = require('../services/book')
 
router.get('/get', book.getByPK)
router.get('/getAll', book.getAll)

router.get('/getTwentyBookByCategory', book.getTwentyBookByCategory)
router.get('/getAllByCategory', book.getAllByCategory)


module.exports = router