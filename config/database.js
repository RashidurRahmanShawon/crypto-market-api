const sequelize = require('sequelize');

const db =  new sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    loggig: false
});

module.exports = db;