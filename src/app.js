const express = require('express');
const config = require('./config');
const routes = require('./routes');
const app = express();
app.use(express.json());
app.use('', routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
