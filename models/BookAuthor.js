const { STRING, UUIDV4  } = require('sequelize');

const database = require('../config/database')

const BookAuthor = database.define('book_author', {
    book_id: {
        type: UUIDV4,
        allowNull: false,
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