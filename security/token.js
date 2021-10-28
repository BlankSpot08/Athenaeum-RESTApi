const jwt = require('jsonwebtoken');
    
require('dotenv').config()

exports.generateAccessToken = (id, role) => {
    return jwt.sign({id: id, role: role}, process.env.ACCESS_TOKEN_SECRET);
}

authenticateRoleToken = (req, res, next, role) => {
     const authHeader = req.headers['authorization']
     const token = authHeader && authHeader.split(' ')[1]

     if (token == null) {
        return res.status(401).json({
            message: "Token is null"
        })
     }

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         if (err) {
            return res.status(403).json({
                message: err
            })
         }

         if (user.role.localeCompare(role)) {
            return res.status(403).json({
                message: "Authorization failed"
            })
         }

         req.user = user
         next()
     })
}

exports.authenticateStudentToken = (req, res, next) => {
    const role = 'student'

    authenticateRoleToken(req, res, next, role)
}

exports.authenticateAdminToken = (req, res, next) => {
    const role = 'admin'

    authenticateRoleToken(req, res, next, role)
}