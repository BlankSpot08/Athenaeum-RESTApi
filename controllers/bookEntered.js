const express = require('express')
router = express.Router()

const bookEntered = require('../services/bookEntered')
 
router.get('/', bookEntered.getAllBookEntered)

module.exports = router