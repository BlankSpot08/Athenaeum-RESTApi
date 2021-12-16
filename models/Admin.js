const { STRING, UUIDV4, DATE, DOUBLE } = require('sequelize');
const database = require('../config/database')

const bcrypt = require('bcrypt')

const Admin = database.define('admin', {
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
    },
    image_path: {
        type: STRING(255)
    }
}, {
    freezeTableName: true,
    timestamps: false,
    hooks: {
        afterValidate: (admin_request) => {
            if (admin_request.password) {
                admin_request.password = bcrypt.hashSync(admin_request.password, 10)
            }
        }
    },
})

module.exports = Admin;