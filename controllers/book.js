const express = require('express')
router = express.Router()

const book = require('../services/book')
 
router.get('/', book.getAll)
router.get('/get', book.getByPK)

router.get('/register', book.register)

module.exports = router