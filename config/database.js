const { Sequelize } = require('sequelize');

module.exports = new Sequelize('postgres://postgres:bh2236@localhost:5432/athenaeum')

// module.exports = new Sequelize('athenaeum', 'postgres', 'bh2236', {
//     host: 'localhost',
//     dialect: 'postgres',
//     operatorsAliases: false,

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     },
// })