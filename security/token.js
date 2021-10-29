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

        let i = 0
        for (i = 0; i < role.length; i++) {
            if (user.role.localeCompare(role[i])) {
                req.user = user
                return next()
            }
        }

        return res.status(403).json({
            message: "Authorization failed"
        })
     })
}

exports.authenticateStudentAuthorization = (req, res, next) => {
    const role = ['student', 'admin']

    return authenticateRoleToken(req, res, next, role)
}

exports.authenticateAdminAuthorization = (req, res, next) => {
    const role = ['admin']

    return authenticateRoleToken(req, res, next, role)
}