// models/order.model.js
const knex = require('../db');

class Orders {
  static tableName = 'orders';

  static async create(data) {
    return knex(this.tableName).insert(data).returning('*');
  }

  static async getAll() {
    return knex(this.tableName).where({ is_deleted: false }).select('*');
  }

  static async getById(id) {
    return knex(this.tableName).where({ id, is_deleted: false }).select('*').first();
  }

  static async updateStatus(id, status) {
    return knex(this.tableName)
      .where({ id, is_deleted: false })
      .update({ status, updated_at: knex.fn.now() })
      .returning('*');
  }

  static async cancel(id) {
    return knex(this.tableName)
      .where({ id, is_deleted: false })
      .update({ is_deleted: true, updated_at: knex.fn.now() })
      .returning('*');
  }
}

module.exports = Orders;
