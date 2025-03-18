const path = require('path');
// db/knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      database: 'torrestir_orders',
      user: 'YOUR_USER',
      password: 'YOUR_PASSWORD',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      database: 'torrestir_orders',
      user: 'YOUR_USER',
      password: 'YOUR_PASSWORD',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      database: 'torrestir_orders',
      user: 'YOUR_USER',
      password: 'YOUR_PASSWORD',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },
};
