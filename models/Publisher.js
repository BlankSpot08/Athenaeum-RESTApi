const { STRING, UUIDV4  } = require('sequelize');

const Book = require('../models/Book')
const database = require('../config/database')

const Publisher = database.define('publisher', {
    id: {
        type: UUIDV4,
        allowNull: false,
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

// Publisher.associations((model) => {
//     this.hasOne = () => {
//         s
//     }
// })

module.exports = Publisher;