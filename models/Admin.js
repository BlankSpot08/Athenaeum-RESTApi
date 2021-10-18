const { STRING, UUIDV4, DATE, DOUBLE } = require('sequelize');
const database = require('../config/database')

const Admin = database.define('admin', {
    id: {
        type: STRING,
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: STRING(50),
        allowNull: false
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
        allowNull: false
    },
    emailaddress: {
        type: STRING(62),
        allowNull: false,
        unique: true
    },
    contactno: {
        type: STRING(16)
    },
    role: {
        type: STRING(16),
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = Admin;


