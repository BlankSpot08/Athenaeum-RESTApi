const express = require('express')
router = express.Router()

const adminRequest = require('../services/adminRequest')
const student = require('../services/student')

router.post('/studentRegister', student.register)
router.post('/adminRegister', adminRequest.register)

module.exports = router