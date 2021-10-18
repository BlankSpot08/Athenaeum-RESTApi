const express = require('express')
router = express.Router()

const category = require('../controllers/category')
 
router.get('/', category.getAllCategories)

module.exports = router