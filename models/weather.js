const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    // set up db info
  host: process.env.DB_HOST,
  dialect: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

const weatherData = sequelize.define('weather', {
    current:{
        type: Sequelize.STRING
    },
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
})

sequelize.sync()

exports.sequelize = sequelize
exports.weatherData = weatherData
