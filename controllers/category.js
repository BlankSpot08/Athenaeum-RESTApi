const express = require('express')
router = express.Router()

const category = require('../services/category')
 
router.post('/get', category.getByTitle)
router.get('/getAll', category.getAll)

module.exports = router