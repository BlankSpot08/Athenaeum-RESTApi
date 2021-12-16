const express = require('express')
router = express.Router()

const student = require('../services/student')
const admin = require('../services/admin')

router.post('/student', student.resetPassword)
router.post('/admin', admin.resetPassword)

module.exports = router