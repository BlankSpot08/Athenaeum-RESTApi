const express = require('express')
router = express.Router()

const adminRequest = require('../services/adminRequest')

router.post('/register', adminRequest.register)

module.exports = router