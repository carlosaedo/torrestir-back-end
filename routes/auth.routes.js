// routes/user.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authCheckToken = require('../middlewares/authCheckToken.middleware');
const authUserGroup = require('../middlewares/authUserGroup.middleware');

router.post('/auth/login', authController.authLogin);

router.post(
  '/auth/create-user',
  authCheckToken,
  authUserGroup('superuser', 'administrator'),
  authController.authCreateUser,
);

router.put('/auth/update-user-password', authCheckToken, authController.authUpdateUserPassword);

router.post('/auth/logout', authController.authLogout);

module.exports = router;
