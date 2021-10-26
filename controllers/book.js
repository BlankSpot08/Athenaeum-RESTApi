const express = require('express')
router = express.Router()

const book = require('../services/book')
 
router.get('/', book.getAll)
router.get('/get', book.getByPK)

router.post('/register', book.register)
router.put('/update', book.update)

module.exports = router