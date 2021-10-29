const express = require('express')
router = express.Router()

const image = require('../services/image')
 
router.get('/get/:image_path', image.getByFilename)

module.exports = router