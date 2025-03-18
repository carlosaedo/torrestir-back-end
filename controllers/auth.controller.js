// controllers/user.controller.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 12;
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const validateInputData = require('../utils/validateInputData.util');

const authLogin = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password } = req.body;

    const user = await authService.getAuthUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user?.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          email: email.toLowerCase(),
          firstName: user.first_name,
          lastName: user.last_name,
          userId: user.id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      const refreshToken = jwt.sign(
        {
          email: email.toLowerCase(),
          firstName: user.first_name,
          lastName: user.last_name,
          userGroup: user.userGroup,
          userId: user._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
      );

      const issued = new Date().toUTCString();
      const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60;
      const expiresInSecondsRefresh = parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60;
      const expires = new Date(Date.now() + expiresInSeconds * 1000).toUTCString();
      const expiresRefresh = new Date(Date.now() + expiresInSecondsRefresh * 1000).toUTCString();
      const returnUserGroup = user.user_group;
      const returnUserEmail = user.email;
      const returnName = `${user.first_name} ${user.last_name}`;
      const returnFirstName = user.first_name;
      const returnLastName = user.last_name;
      return res.status(200).json({
        message: 'OK',
        token,
        userId: user.id,
        returnName,
        returnFirstName,
        returnLastName,
        returnUserEmail,
        returnUserGroup,
        tokenType: 'bearer',
        expires_in: expiresInSeconds,
        issued,
        expires,
        refreshToken: {
          refreshToken,
          expires_in: expiresInSecondsRefresh,
          issued,
          expires: expiresRefresh,
        },
      });
    }
    res.status(500).json({ message: 'Ups, algo correu mal no servidor.' });
  } catch (err) {
    next(err);
  }
};

const authCreateUser = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!validateInputData.isValidString(first_name)) {
      return res.status(400).json({ message: 'Primeiro nome inválido' });
    }

    if (!validateInputData.isValidString(last_name)) {
      return res.status(400).json({ message: 'Último nome inválido' });
    }

    if (!validateInputData.isValidEmail(email.toLowerCase())) {
      return res.status(400).json({ message: 'Email inválido', errorCode: 'INVALID_EMAIL' });
    }

    if (!validateInputData.isValidString(password)) {
      return res.status(400).json({
        message: 'Por favor fornece uma palavra-passe.',
        errorCode: 'INVALID_PASSWORD',
      });
    }

    const user = await authService.getAuthUserByEmail(email.toLowerCase());

    if (user) {
      return res.status(400).json({ message: 'O email já existe' });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    if (hash) {
      const userData = {
        email: email.toLowerCase(),
        first_name,
        last_name,
        password: hash,
      };
      const newUser = await userService.createUser(userData);

      //GENERATE TOKEN FOR FAST LOGIN
      const token = jwt.sign(
        {
          email: email.toLowerCase(),
          firstName: newUser?.first_name,
          lastName: newUser?.last_name,
          userGroup: newUser?.user_group,
          userId: newUser?.id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );
      const issued = new Date().toUTCString();
      const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60;
      const expires = new Date(Date.now() + expiresInSeconds * 1000).toUTCString();

      const returnUserGroup = newUser?.user_group;
      const returnUserEmail = newUser?.email;
      const returnName = `${newUser?.first_name} ${newUser?.last_name}`;
      const returnFirstName = newUser?.first_name;
      const returnLastName = newUser?.last_name;

      return res.status(200).json({
        message: 'OK',
        token,
        userId: newUser.id,
        returnName,
        returnFirstName,
        returnLastName,
        returnUserEmail,
        returnUserGroup,
        tokenType: 'bearer',
        expires_in: expiresInSeconds,
        issued,
        expires,
      });
    }
    res.status(500).json({ message: 'Ups, algo correu mal no servidor.' });
  } catch (err) {
    next(err);
  }
};

const authUpdateUserPassword = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  try {
    const { password } = req.body;
    if (!req?.authorization?.user_id) {
      return res.status(401).json({ message: 'Nao autorizado' });
    }

    if (!validateInputData.isValidString(password)) {
      return res.status(400).json({
        message: 'Por favor fornece uma palavra-passe.',
        errorCode: 'INVALID_PASSWORD',
      });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    if (hash) {
      const userData = {
        password: hash,
      };
      await userService.updateUser(req?.authorization?.user_id, userData);

      return res.status(200).json({
        message: 'OK',
      });
    }
    res.status(500).json({ message: 'Ups, algo correu mal no servidor.' });
  } catch (err) {
    next(err);
  }
};

const authLogout = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  try {
    const { token } = req.body;

    const revoked = await authService.revokeToken(token);
    if (revoked) {
      return res.status(200).json({ message: 'OK' });
    }

    res.status(500).json({ message: 'Ups, algo correu mal no servidor.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authLogin,
  authCreateUser,
  authLogout,
  authUpdateUserPassword,
};
