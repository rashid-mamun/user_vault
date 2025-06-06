const app = require('./src/app');
const config = require('./src/config');
const { sequelize } = require('./src/models');

sequelize.sync().then(() => {
  app.listen(config.PORT, () => {
    console.log(`App listening at http://localhost:${config.PORT}`);
  });
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});