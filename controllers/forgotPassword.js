const express = require('express')
router = express.Router()

const student = require('../services/student')
const admin = require('../services/admin')

router.post('/student', student.forgotPassword)
router.post('/admin', admin.forgetPassword)

module.exports = router