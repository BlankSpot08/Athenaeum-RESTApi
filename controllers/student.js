const express = require('express')
router = express.Router()

const student = require('../services/student')
const jauth = require('../security/token')
 
router.get('/', student.getAllStudents)

router.get('/get', student.getById)

router.get('/login', student.login)
router.post('/register', student.register)

module.exports = router