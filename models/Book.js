const { STRING, UUIDV4, DATE, FLOAT } = require('sequelize');
const database = require('../config/database')

const Publisher = require('../models/Publisher')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const BookTag = require('../models/BookTag')
const Author = require('../models/Author')
const BookAuthor = require('../models/BookAuthor');
const StudentBookList = require('../models/StudentBookList');
const StudentReadAgain = require('../models/StudentReadAgain');

const Book = database.define('book', {
    id: {
        type: UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    isbn: {
        type: STRING(20),
        allowNull: false,
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
    foreignKey: 'book_id',
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
    foreignKey: 'book_id',
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

Book.hasMany(StudentBookList, {
    foreignKey: 'book_id'
})
StudentBookList.belongsTo(Book, {
    foreignKey: 'book_id'
})

Book.hasMany(StudentReadAgain, {
    foreignKey: 'book_id'
})
StudentReadAgain.belongsTo(Book, {
    foreignKey: 'book_id'
})

module.exports = Book;