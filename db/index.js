// db/db.js
const knex = require('knex');
const knexfile = require('../knexfile');
const environment = process.env.NODE_ENV || 'development';
const connectionConfig = knexfile[environment];
const db = knex(connectionConfig);

module.exports = db;
