const dbConfig = require('./database');
const Sequelize = require('sequelize');
require('dotenv').config();
const connectionPoolOptions = {
  max: 300,
  idle: 30000,
  acquire: 60000,
};
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: connectionPoolOptions,
    logging: false,
  }
);

module.exports = sequelize;
