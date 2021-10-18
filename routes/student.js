const express = require('express')
router = express.Router()

const student = require('../controllers/student')
 
router.get('/', student.getAllStudents)

module.exports = router