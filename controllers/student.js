const express = require('express')
router = express.Router()

const student = require('../services/student')
const jauth = require('../security/token')

router.get('/get', student.getById)
router.get('/getAll', student.getAllStudents)

router.get('/login', student.login)
router.post('/register', student.register)
router.put('/update', student.update)

module.exports = router