const express = require('express')
router = express.Router()

const admin = require('../services/admin')
const student = require('../services/student')

router.get('/adminLogin', admin.login)
router.get('/studentLogin', student.login)

module.exports = router