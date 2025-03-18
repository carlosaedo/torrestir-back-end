// controllers/order.controller.js
const orderService = require('../services/order.service');

const supportedStatuses = require('../config/orders.supportedStatuses');

const validateInputData = require('../utils/validateInputData.util');

const getAllOrders = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ message: 'OK', orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada' });
    }

    res.status(200).json({ message: 'OK', order });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    const orderData = req.body;

    if (!req?.authorization?.user_id) {
      return res.status(401).json({ message: 'Nao autorizado' });
    }

    if (
      !validateInputData.isValidString(orderData.customer_name) ||
      !validateInputData.isValidString(orderData.address)
    ) {
      return res.status(400).json({ message: 'Nome do cliente e endereço são obrigatórios' });
    }

    const orderDataAndCreatorId = { ...orderData, created_by: req?.authorization?.user_id };

    const newOrder = await orderService.createOrder(orderDataAndCreatorId);
    res.status(201).json({ message: 'Encomenda criada com sucesso', order: newOrder });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    const { id, status } = req.params;
    const statusInt = parseInt(status, 10);

    if (!validateInputData.isValidInteger(statusInt)) {
      return res.status(400).json({ message: 'O estado deve ser um número válido.' });
    }

    if (!supportedStatuses.validateStatus(statusInt)) {
      return res.status(400).json({
        message: 'Status inválido.',
        supportedStatuses: supportedStatuses.supportedStatuses,
      });
    }

    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada.' });
    }

    if (order.status === 3) {
      return res.status(400).json({ message: 'A encomenda já foi entregue.' });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, statusInt);
    if (!updatedOrder) {
      return res.status(500).json({ message: 'Falha ao atualizar o estado da encomenda.' });
    }

    res.status(200).json({ message: 'Estado atualizado com sucesso.', order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

const getOrderUpdateSupportedStatuses = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    res.status(200).json({ message: 'OK', supportedStatuses });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  // #swagger.tags = ['Orders']
  try {
    const { id } = req.params;

    const order = await orderService.cancelOrder(id);

    if (!order) {
      return res.status(404).json({ message: 'Encomenda não encontrada' });
    }

    res.status(200).json({ message: 'Encomenda cancelada com sucesso' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderUpdateSupportedStatuses,
  cancelOrder,
};
