const { STRING, UUIDV4, DATE, TINYINT, SMALLINT } = require('sequelize');
const database = require('../config/database')

const Admin = require('../models/Admin')
const Book = require('../models/Book')

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

module.exports = BookEntered;
