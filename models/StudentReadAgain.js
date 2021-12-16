const { STRING, UUIDV4, DATE } = require('sequelize');

const database = require('../config/database')

const StudentReadAgain = database.define('student_readagain', {
    student_id: {
        type: String(20),
        allowNull: false,
        primaryKey: true,
        foreignKey: true
    },
    book_id: {
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

module.exports = StudentReadAgain;