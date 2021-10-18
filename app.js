const express = require('express'),
app = express()

require('dotenv').config()

const database = require('./config/database')
database.authenticate()
    .then(() => console.log('Database connected'))
    .catch(error => console.log('Error: ' + error))

const category = require('./routes/category')
const student = require('./routes/student')
const admin = require('./routes/admin')

app.use('/category', category)
app.use('/student', student)
app.use('/admin', admin)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`)
})