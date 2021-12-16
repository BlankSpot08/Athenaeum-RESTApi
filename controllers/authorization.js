const express = require('express')
router = express.Router()

const token = require('../security/token')

router.post('/studentResetToken', token.authorizeStudentResetToken)
router.post('/adminResetToken', token.authorizeAdminResetToken)

module.exports = router