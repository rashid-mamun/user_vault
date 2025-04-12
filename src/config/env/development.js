require('dotenv').config()
class Config {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.PORT = process.env.PORT || 3000;
    this.API_BASE = '/api';
    this.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
    this.DATABASE_PORT = process.env.DATABASE_PORT || 3306;
    this.DATABASE = process.env.DATABASE;
    this.DATABASE_USERNAME = process.env.DATABASE_USERNAME;
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.IMAGE_FOLDER = process.env.image_folder || './Uploads';
    const required = [
      'DATABASE',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'JWT_SECRET',
    ];
    required.forEach((key) => {
      if (!this[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    });
  }
}

module.exports = new Config();
