// models/user.model.js
const knex = require('../db');

class User {
  static SAFE_COLUMNS = [
    'id',
    'first_name',
    'last_name',
    'email',
    'created_at',
    'updated_at',
    'user_group',
  ];

  static AUTH_COLUMNS = [...this.SAFE_COLUMNS, 'password'];

  static tableName = 'users';

  static async findAll() {
    try {
      return knex(this.tableName).select(this.SAFE_COLUMNS);
    } catch (err) {
      console.error(`Model error:`, err);
      throw err;
    }
  }

  static async findById(id) {
    return knex(this.tableName).where({ id }).select(this.SAFE_COLUMNS).first();
  }

  static async findByEmail(email) {
    return knex(this.tableName).where({ email }).select(this.SAFE_COLUMNS).first();
  }

  static async create(data) {
    return knex(this.tableName).insert(data).returning(this.SAFE_COLUMNS);
  }

  static async update(id, data) {
    data.updated_at = knex.fn.now();
    return knex(this.tableName).where({ id }).update(data).returning(this.SAFE_COLUMNS);
  }

  static async delete(id) {
    return knex(this.tableName).where({ id }).del();
  }

  // Special method for authentication only
  static async findByEmailWithPassword(email) {
    return knex(this.tableName).where({ email }).select(this.AUTH_COLUMNS).first();
  }
}

module.exports = User;
