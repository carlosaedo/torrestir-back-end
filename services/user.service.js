// services/user.service.js
const User = require('../models/user.model');

class UserService {
  static async getAllUsers() {
    try {
      return User.findAll();
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async createUser(userData) {
    try {
      return User.create(userData);
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async updateUser(id, userData) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }
      return User.update(id, userData);
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }
      return User.delete(id);
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }
}

module.exports = UserService;
