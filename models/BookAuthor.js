const { STRING, UUIDV4  } = require('sequelize');

const database = require('../config/database')

const BookAuthor = database.define('book_author', {
    book_isbn_number: {
        type: STRING(20),
        allowNull: UUIDV4,
        primaryKey: true,
        foreignKey: true
    },
    author_id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
})

module.exports = BookAuthor;