const { STRING, UUIDV4 } = require('sequelize');
const database = require('../config/database')

const Tag = database.define('tag', {
    id: {
        type: UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = Tag;
