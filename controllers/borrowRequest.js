const express = require('express')
router = express.Router()

const borrowRequest = require('../services/borrowRequest')

router.get('/get', borrowRequest.getById)
router.get('/getAll', borrowRequest.getAll)

module.exports = router
