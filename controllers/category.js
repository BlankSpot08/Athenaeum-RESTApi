const express = require('express')
router = express.Router()

const category = require('../services/category')
 
router.get('/', category.getAllCategories)

module.exports = router