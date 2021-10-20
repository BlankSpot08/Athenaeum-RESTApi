const express = require('express')
router = express.Router()

const admin = require('../services/admin')
 
router.get('/', admin.getAllAdmins)

module.exports = router