// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authCheckToken = require('../middlewares/authCheckToken.middleware');

router.get('/users', authCheckToken, userController.getAllUsers);
router.get('/user/:idOrEmail', authCheckToken, userController.getUserByIdOrEmail);
router.put('/user/:id', authCheckToken, userController.updateUser);
router.delete('/user/:id', authCheckToken, userController.deleteUser);

module.exports = router;
