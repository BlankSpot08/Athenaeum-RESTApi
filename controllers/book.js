const express = require('express')
router = express.Router()

const book = require('../services/book')
const imageUploader = require('../helper/imageUploader')
 
router.get('/get', book.getByPK)
router.get('/getAll', imageUploader.upload.single('image'), book.getAll)

router.get('/getTwentyBookByCategory', book.getTwentyBookByCategory)
router.get('/getAllByCategory', book.getAllByCategory)


module.exports = router