const config = require('./index');

module.exports = {
  dialect: 'mysql',
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  logging: false,
};
