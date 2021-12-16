const jwt = require('jsonwebtoken');

require('dotenv').config()

exports.generateAccessToken = (id, role) => {
    return jwt.sign({ id: id, role: role }, process.env.ACCESS_TOKEN_SECRET);
}

exports.generateResetToken = (id, role) => {
    return jwt.sign({ id: id, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
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
            if (user.role.localeCompare(role[i]) === 0) {
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

authorizeResetToken = (req, res, next, role) => {
    const token = req.body.token

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err.name)
            return res.status(403).json({
                message: err,
                status: err.name.localeCompare('TokenExpiredError') === 0 ? 'expired' : 'missing'
            })
        }

        if (user.role.localeCompare(role) !== 0) {
            return res.status(403).json({ status: 'failed' })
        }

        return res.status(200).json({ status: 'active' })
    })
}

exports.authorizeStudentResetToken = (req, res, next) => {
    return authorizeResetToken(req, res, next, 'student')
}
exports.authorizeAdminResetToken = (req, res, next) => {
    return authorizeResetToken(req, res, next, 'admin')
}