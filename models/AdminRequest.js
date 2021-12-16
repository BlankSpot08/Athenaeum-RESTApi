const { STRING, UUIDV4, DATE, DOUBLE } = require('sequelize');
const database = require('../config/database')

const bcrypt = require('bcrypt')

const AdminRequest = database.define('admin_request', {
    id: {
        type: STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
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
    timestamps: false,
})

module.exports = AdminRequest;