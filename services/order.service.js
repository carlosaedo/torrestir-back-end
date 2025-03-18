// services/order.service.js
const Order = require('../models/order.model');
const supportedStatuses = require('../config/orders.supportedStatuses');
const validateInputData = require('../utils/validateInputData.util');

class OrderService {
  static async getAllOrders() {
    try {
      return Order.getAll();
    } catch (err) {
      console.error(`Service error on ${id}:`, err);
      throw err;
    }
  }

  static async getOrderById(id) {
    try {
      const order = await Order.getById(id);
      return order;
    } catch (err) {
      console.error(`Service:`, err);
      throw err;
    }
  }

  static async createOrder(orderData) {
    try {
      orderData.status = orderData.status ?? 0;
      return Order.create(orderData);
    } catch (err) {
      console.error(`Service error on:`, err);
      throw err;
    }
  }

  static async updateOrderStatus(id, status) {
    try {
      if (!supportedStatuses.validateStatus(status)) {
        throw new Error('Invalid status');
      }
      const order = await this.getOrderById(id);
      if (!order) {
        return null;
      }

      if (order.status === 3) {
        throw new Error('Order is already delivered');
      }
      return Order.updateStatus(id, status);
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async cancelOrder(id) {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        return null;
      }
      return Order.cancel(id);
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }
}

module.exports = OrderService;
