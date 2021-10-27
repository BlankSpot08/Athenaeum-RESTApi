const { STRING, UUIDV4, DATE } = require('sequelize');

const database = require('../config/database')

const ReturnRequest = database.define('return_request', {
    student_id: {
        type: String(20),
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    },
    book_entered_id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    },
    date_requested: {
        type: DATE,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
})

module.exports = ReturnRequest;