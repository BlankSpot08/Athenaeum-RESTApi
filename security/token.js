const jwt = require('jsonwebtoken');
    
require('dotenv').config()

exports.generateAccessToken = (username, role) => {
    return jwt.sign(username, process.env.TOKEN_SECRET);
}