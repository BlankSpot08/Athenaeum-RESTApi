const express = require('express')
router = express.Router()

const admin = require('../services/admin')
const student = require('../services/student')

router.post('/adminLogin', admin.login)
router.post('/studentLogin', student.login)

module.exports = router