const express = require('express')
router = express.Router()

const bookEntered = require('../services/bookEntered')
 
router.get('/', bookEntered.getAll)

router.post('/getTotalAvailable', bookEntered.getTotalAvailable)

module.exports = router