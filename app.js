const express = require('express')
app = express()

require('dotenv').config()

const database = require('./config/database')
database.authenticate()
    .then(() => console.log('Database connected'))
    .catch(error => console.log('Error: ' + error))

const student = require('./controllers/student')
const admin = require('./controllers/admin')
const category = require('./controllers/category')
const book = require('./controllers/book')
const bookEntered = require('./controllers/bookEntered')
const authentication = require('./controllers/authentication')
const authorization = require('./controllers/authorization')
const registration = require('./controllers/registration')
const forgotPassword = require('./controllers/forgotPassword')
const resetPassword = require('./controllers/resetPassword')
const image = require('./controllers/image')

const security = require('./security/token')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/student', security.authenticateStudentAuthorization, student)
app.use('/admin', security.authenticateAdminAuthorization, admin)

app.use('/authentication', authentication)
app.use('/authorization', authorization)

app.use('/forgotPassword', forgotPassword)
app.use('/resetPassword', resetPassword)

app.use('/registration', registration)
app.use('/category', category)
app.use('/book', book)
app.use('/bookEntered', bookEntered)

app.use('/image', image)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`)
})