const { STRING, UUIDV4 } = require('sequelize');
const database = require('../config/database')

const Category = database.define('category', {
    id: {
        type: UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: STRING(30),
        allowNull: false,
        unique: true
    },
    description: {
        type: STRING(1000),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

// Category.hasOne(Book, {
//     foreignKey: 'category_id'
// })

module.exports = Category;
