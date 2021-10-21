const jwt = require('jsonwebtoken');
    
require('dotenv').config()

exports.generateAccessToken = (id, role) => {
    return jwt.sign({id: id, role: role}, process.env.ACCESS_TOKEN_SECRET);
}

exports.authenticateToken = (req, res, next) => {
    console.log('sad')
    next('route')
    //  const authHeader = req.headers['authorization']
    //  const token = authHeader && authHeader.split(' ')[1]

    //  if (token == null) {
    //      res.sendStatus(401)
    //  }

    //  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //      if (err) {
    //         res.sendStatus(403)
    //      }

    //      req.user = user
    //      next()
    //  })
}