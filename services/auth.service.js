// services/auth.service.js
const User = require('../models/user.model');
const RevokedToken = require('../models/revokedToken.model');
const validateInputData = require('../utils/validateInputData.util');

class AuthService {
  static async getAuthUserByEmail(email) {
    try {
      if (!validateInputData.isValidEmail(email)) {
        throw new Error('Invalid email');
      }
      const user = await User.findByEmailWithPassword(email);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async isTokenRevoked(token) {
    try {
      const revokedToken = await RevokedToken.findByToken(token);
      return !!revokedToken;
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }

  static async revokeToken(token) {
    try {
      const revokedToken = await RevokedToken.create({ token });
      return !!revokedToken;
    } catch (err) {
      console.error(`Service error:`, err);
      throw err;
    }
  }
}

module.exports = AuthService;
