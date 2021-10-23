const express = require('express')
router = express.Router()

const category = require('../services/category')
 
router.get('/', category.getAllCategories)
router.get('/get', category.getByTitle)

module.exports = router