const express = require('express')
router = express.Router()

const book = require('../services/book')
 
router.get('/', book.getAll)
router.get('/get', book.getByPK)

module.exports = router