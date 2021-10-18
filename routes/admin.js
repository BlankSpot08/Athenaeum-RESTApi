const express = require('express')
router = express.Router()

const admin = require('../controllers/admin')
 
router.get('/', admin.getAllAdmins)

module.exports = router