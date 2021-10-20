const express = require('express')
router = express.Router()

const student = require('../services/student')
 
router.get('/', student.getAllStudents)
router.get('/login', student.login)
router.get('/helloWorld', student.helloWorld)
router.post('/register', student.registerStudent)

module.exports = router