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
const authentication = require('./controllers/authentication')
const registration = require('./controllers/registration')
const image = require('./controllers/image')

const security = require('./security/token')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/student', security.authenticateStudentAuthorization, student)
app.use('/admin', security.authenticateAdminAuthorization, admin)
app.use('/authentication', authentication)
app.use('/category', category)
app.use('/book', book)

app.use('/image', image)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`)
})

