const { STRING, UUIDV4 } = require('sequelize');
const database = require('../config/database')

const BookTag = database.define('book_tag', {
    book_isbn_number: {
        type: STRING(20),
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    },
    
    tag_id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    },
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
})

module.exports = BookTag;
