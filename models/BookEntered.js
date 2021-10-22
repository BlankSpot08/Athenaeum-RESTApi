const { STRING, UUIDV4, DATE, TINYINT, SMALLINT } = require('sequelize');
const database = require('../config/database')

const Admin = require('../models/Admin')
const Book = require('../models/Book')

const BookEntered = database.define('book_entered', {
    id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
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

BookEntered.hasOne(Admin, {
    foreignKey: 'id'
})
BookEntered.belongsTo(Book, {
    foreignKey: 'book_isbn_number'
})

module.exports = BookEntered;
