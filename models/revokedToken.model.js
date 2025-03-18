// models/user.model.js
const knex = require('../db');

class RevokedToken {
  static tableName = 'revoked_tokens';

  static async findByToken(token) {
    return knex(this.tableName).where({ token }).select('*').first();
  }

  static async create(data) {
    return knex(this.tableName).insert(data).returning('*');
  }
}

module.exports = RevokedToken;
