const { STRING, UUIDV4, DATE, TINYINT, SMALLINT } = require('sequelize');

const database = require('../config/database')

const Admin = require('../models/Admin')
const Book = require('../models/Book')
const StudentBook = require('../models/StudentBook')
const BorrowRequest = require('../models/BorrowRequest')
const ReturnRequest = require('../models/ReturnRequest')

const BookEntered = database.define('book_entered', {
    id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    book_isbn_number: {
        type: STRING(20),
        allowNull: false,
        foreignKey: true
    },
    date_created: {
        type: DATE,
        allowNull: false
    },
    created_by: {
        type: STRING(20),
        allowNull: false,
        foreignKey: true
    },
    borrowed: {
        type: SMALLINT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
})

BookEntered.belongsTo(Admin, {
    foreignKey: 'created_by'
})
Admin.hasMany(BookEntered, {
    foreignKey: 'created_by'
})

BookEntered.belongsTo(Book, {
    foreignKey: "book_isbn_number"
})
Book.hasMany(BookEntered, {
    foreignKey: "book_isbn_number"
})

BorrowRequest.belongsTo(BookEntered, {
    foreignKey: 'book_entered_id'
})
BookEntered.hasMany(BorrowRequest, {
    foreignKey: 'book_entered_id'
})

ReturnRequest.belongsTo(BookEntered, {
    foreignKey: 'book_entered_id'
})
BookEntered.hasMany(ReturnRequest, {
    foreignKey: 'book_entered_id'
})

StudentBook.belongsTo(BookEntered, {
    foreignKey: 'book_entered_id',
})
BookEntered.hasMany(StudentBook, {
    foreignKey: 'book_entered_id',
})

module.exports = BookEntered;
