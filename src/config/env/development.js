require('dotenv').config()
class Config {
  constructor() {
    this.env = 'development';
    this.PORT = process.env.PORT || 3000;
    this.API_BASE = '/api';
    this.DATABASE_HOST =process.env.host;
    this.DATABASE_PORT = process.env.DATABASE_PORT || 5432;
    this.DATABASE = process.env.database;
    this.DATABASE_USERNAME = process.env.username;
    this.DATABASE_PASSWORD = process.env.password;
    this.JWT_SECRET = process.env.JWT_SECRET;
   
  }
}

module.exports = new Config();
