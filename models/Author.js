const { STRING, UUIDV4  } = require('sequelize');

const database = require('../config/database')

const Author = database.define('author', {
    id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(100),
        allowNull: false,
        unique: true
    },
    email: {
        type: STRING(62),
    },
    contactno: {
        type: STRING(16)
    },
    address: {
        type: STRING(95),
    },
}, {
    freezeTableName: true,
    timestamps: false,
})

module.exports = Author;