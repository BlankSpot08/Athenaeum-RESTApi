const express = require('express')
router = express.Router()

const returnRequest = require('../services/returnRequest')

router.get('/get', returnRequest.getById)
router.get('/getAll', returnRequest.getAll)

module.exports = router
