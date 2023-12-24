try {
    require('dotenv').config();
} catch (error) {
    console.error('Error loading .env file:', error);
}

const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    // port: 3306,
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;