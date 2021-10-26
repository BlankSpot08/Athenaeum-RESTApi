const { STRING, UUIDV4, DATE, FLOAT } = require('sequelize');
const database = require('../config/database')

const Publisher = require('../models/Publisher')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const BookTag = require('../models/BookTag')
const Author = require('../models/Author')
const BookAuthor = require('../models/BookAuthor');

const Book = database.define('book', {
    isbn_number: {
        type: STRING(20),
        allowNull: false,
        primaryKey: true,
    },
    category_id: {
        type: UUIDV4,
        allowNull: false,
        foreignKey: true,
    },
    title: {
        type: STRING(50),
        allowNull: false,
        unique: true,
    },
    edition: {
        type: STRING(20),
        allowNull: false
    },
    publisher_id: {
        type: UUIDV4,
        allowNull: false,
        foreignKey: true
    },
    publication_year: {
        type: DATE
    },
    synopsis: {
        type: STRING(255),
        allowNull: false
    },
    price: {
        type: FLOAT,
        allowNull: false
    },
    image_path: {
        type: STRING(255),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
})

Book.belongsTo(Publisher, {
    foreignKey: 'publisher_id'
})
Publisher.hasOne(Book, {
    foreignKey: 'publisher_id'
})

Book.belongsTo(Category, {
    foreignKey: 'category_id'
})
Category.hasOne(Book, {
    foreignKey: 'category_id'
})

Book.belongsToMany(Tag, {
    foreignKey: 'book_isbn_number',
    through: {
        model: BookTag
    }
})
Tag.belongsToMany(Book, {
    foreignKey: 'tag_id',
    through: {
        model: BookTag
    }
})
BookTag.belongsTo(Book)
BookTag.belongsTo(Tag)

Book.belongsToMany(Author, {
    foreignKey: 'book_isbn_number',
    through: {
        model: BookAuthor
    }
})
Author.belongsToMany(Book, {
    foreignKey: 'author_id',
    through: {
        model: BookAuthor
    }
})
BookAuthor.belongsTo(Book)
BookAuthor.belongsTo(Author)

module.exports = Book;
