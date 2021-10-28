const { STRING, UUIDV4, DATE, DOUBLE } = require('sequelize');
const bcrypt = require('bcrypt')

const database = require('../config/database')

const StudentBook = require('../models/StudentBook')
const BorrowRequest = require('../models/BorrowRequest')
const ReturnRequest = require('../models/ReturnRequest');
const StudentBookList = require('../models/StudentBookList');
const StudentReadAgain = require('../models/StudentReadAgain');

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
            if (student.password) {
                student.password = bcrypt.hashSync(student.password, 10)
            }
        }
    },
})

BorrowRequest.belongsTo(Student, {
    foreignKey: 'student_id'
})
Student.hasMany(BorrowRequest, {
    foreignKey: 'student_id'
})

ReturnRequest.belongsTo(Student, {
    foreignKey: 'student_id'
})
Student.hasMany(ReturnRequest, {
    foreignKey: 'student_id'
})

StudentBook.belongsTo(Student, {
    foreignKey: 'student_id',
})
Student.hasMany(StudentBook, {
    foreignKey: 'student_id',
})

StudentBookList.belongsTo(Student, {
    foreignKey: 'student_id'
})
Student.hasMany(StudentBookList, {
    foreignKey: 'student_id'
})

StudentReadAgain.belongsTo(Student, {
    foreignKey: 'student_id'
})
Student.hasMany(StudentReadAgain, {
    foreignKey: 'student_id'
})

module.exports = Student;