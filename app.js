const express = require('express')
app = express()

require('dotenv').config()

const database = require('./config/database')
database.authenticate()
    .then(() => console.log('Database connected'))
    .catch(error => console.log('Error: ' + error))

const category = require('./controllers/category')
const student = require('./controllers/student')
const admin = require('./controllers/admin')
const bookEntered = require('./controllers/bookEntered')
const book = require('./controllers/book')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/category', category)
app.use('/student', student)
app.use('/admin', admin)
app.use('/bookEntered', bookEntered)
app.use('/book', book)

// const Publisher = require('./models/Publisher')

// Publisher.findAll({ raw: true })
//     .then((publisher) => {
//         console.log(publisher)
//     })
//     .catch(error => {
//         console.log(`Error: ${error}`)
//     })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`)
})