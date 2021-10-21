const { STRING, UUIDV4, DATE, DOUBLE } = require('sequelize');
const bcrypt = require('bcrypt')

const database = require('../config/database')

const Student = database.define('student', {
    id: {
        type: STRING,
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: STRING(50),
        allowNull: false,
    },
    firstname: {
        type: STRING(50),
        allowNull: false
    },
    middlename: {
        type: STRING(50),
    },
    lastname: {
        type: STRING(50),
        allowNull: false,
    },
    emailaddress: {
        type: STRING(62),
        allowNull: false,
        unique: true
    },
    contactno: {
        type: STRING(16)
    },
    guardiancontactno: {
        type: STRING(16)
    },
    balance: {
        type: STRING(255),
    },
    role: {
        type: STRING(16),
    }
}, {
    freezeTableName: true,
    timestamps: false,
    hooks: {
        afterValidate: (student) => {
            student.password = bcrypt.hashSync(student.password, 10)
        }
    },
})

module.exports = Student;