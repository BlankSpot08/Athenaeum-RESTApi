const nodemailer = require('nodemailer');
require('dotenv').config()

module.exports = transporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}