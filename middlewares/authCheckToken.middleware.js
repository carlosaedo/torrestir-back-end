require('dotenv').config();
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');

const revokeToken = async (token) => {
  try {
    await authService.revokeToken(token);
  } catch (err) {
    console.error(err);
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 'AUTH_ERROR_AUTH_HEADER',
        message: 'Falha na autenticação.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        code: 'AUTH_ERROR_TOKEN_UNDEFINED',
        message: 'Falha na autenticação.',
      });
    }

    if (await authService.isTokenRevoked(token)) {
      return res.status(401).json({
        code: 'AUTH_ERROR_TOKEN_REVOKED',
        message: 'Falha na autenticação. Token revogado.',
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      return res
        .status(401)
        .json({ code: 'AUTH_ERROR_TOKEN', message: 'Falha na autenticação. Token inválido.' });
    }

    const userFromDb = await userService.getUserByEmail(decodedToken.email);

    if (!userFromDb) {
      await revokeToken(token);

      return res.status(404).json({
        code: 'AUTH_ERROR_USER_NOT_FOUND',
        message: 'Falha na autenticação. User não encontrado.',
      });
    }

    req.authorization = decodedToken;
    req.authorization.user_group = userFromDb.user_group;
    req.authorization.user_id = userFromDb.id;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 'AUTH_ERROR_TOKEN_EXPIRED',
        message: 'Falha na autenticação. Token expirado.',
      });
    }
    next(err);
  }
};

module.exports = authenticateToken;
