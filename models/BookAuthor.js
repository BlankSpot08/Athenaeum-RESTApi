const { STRING, UUIDV4  } = require('sequelize');

const database = require('../config/database')

const BookAuthor = database.define('book_author', {
    book_isbn_number: {
        type: STRING(20),
        allowNull: UUIDV4,
        primaryKey: true,
    },
    name: {
        type: STRING(100),
        allowNull: false,
        unique: true
    },
    email: {
        type: STRING(62),
    },
    contactNo: {
        type: STRING(16)
    },
    address: {
        type: STRING(95),
    },
}, {
    freezeTableName: true,
    timestamps: false,
})

module.exports = BookAuthor;