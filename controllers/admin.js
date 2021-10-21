const express = require('express')
router = express.Router()

const admin = require('../services/admin')
 
router.get('/', admin.getAllAdmins)

router.get('/login', admin.login)
router.post('/register', admin.register)

router.get('/get', admin.getByID)

module.exports = router