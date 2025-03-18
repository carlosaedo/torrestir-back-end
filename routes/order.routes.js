const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authCheckToken = require('../middlewares/authCheckToken.middleware');

router.get('/orders', authCheckToken, orderController.getAllOrders);
router.get('/order/:id', authCheckToken, orderController.getOrderById);
router.post('/order', authCheckToken, orderController.createOrder);
router.get(
  '/order/get/supported-statuses',
  authCheckToken,
  orderController.getOrderUpdateSupportedStatuses,
);
router.put('/order/:id/status/:status', authCheckToken, orderController.updateOrderStatus);
router.put('/order/:id/cancel', authCheckToken, orderController.cancelOrder);

module.exports = router;
