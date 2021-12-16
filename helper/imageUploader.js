const path = require('path')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },

    filename: (req, file, cb) => {
        req.body.image_path = file.originalname
                
        cb(null, file.originalname)
    }
})

exports.upload = multer({storage: storage})
