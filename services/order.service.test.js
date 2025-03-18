const OrderService = require('./order.service');
const Order = require('../models/order.model');
const supportedStatuses = require('../config/orders.supportedStatuses');

// Mock the Order model methods
jest.mock('../models/order.model');

// Mock the supportedStatuses module
jest.mock('../config/orders.supportedStatuses', () => ({
  validateStatus: jest.fn(),
}));

describe('OrderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        { id: 1, status: 0, is_deleted: false },
        { id: 2, status: 1, is_deleted: false },
      ];

      // Mock the return value of Order.getAll
      Order.getAll.mockResolvedValue(mockOrders);

      const result = await OrderService.getAllOrders();
      expect(result).toEqual(mockOrders);
      expect(Order.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrderById', () => {
    it('should return a single order by ID', async () => {
      const mockOrder = { id: 1, status: 0, is_deleted: false };

      // Mock the return value of Order.getById
      Order.getById.mockResolvedValue(mockOrder);

      const result = await OrderService.getOrderById(1);
      expect(result).toEqual(mockOrder);
      expect(Order.getById).toHaveBeenCalledWith(1);
      expect(Order.getById).toHaveBeenCalledTimes(1);
    });

    it('should return null if order does not exist', async () => {
      // Mock the return value of Order.getById for a non-existing order
      Order.getById.mockResolvedValue(null);

      const result = await OrderService.getOrderById(999); // Non-existent ID
      expect(result).toBeNull();
    });
  });

  describe('createOrder', () => {
    it('should create an order with provided data', async () => {
      const orderData = { status: 1, some_field: 'data' };
      const mockCreatedOrder = { id: 1, ...orderData };

      // Mock the return value of Order.create
      Order.create.mockResolvedValue([mockCreatedOrder]);

      const result = await OrderService.createOrder(orderData);
      expect(result).toEqual([mockCreatedOrder]);
      expect(Order.create).toHaveBeenCalledWith(orderData);
      expect(Order.create).toHaveBeenCalledTimes(1);
    });

    it('should set default status if no status is provided', async () => {
      const orderData = { some_field: 'data' };
      const mockCreatedOrder = { id: 1, status: 0, ...orderData };

      // Mock the return value of Order.create
      Order.create.mockResolvedValue([mockCreatedOrder]);

      const result = await OrderService.createOrder(orderData);
      expect(result).toEqual([mockCreatedOrder]);
      expect(Order.create).toHaveBeenCalledWith({ ...orderData, status: 0 });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status by ID', async () => {
      const orderData = { id: 1, status: 0 };
      const updatedOrder = { id: 1, status: 2 };

      // Mock validateStatus to return true
      supportedStatuses.validateStatus.mockReturnValue(true);

      // Mock the return value of Order.getById and Order.updateStatus
      Order.getById.mockResolvedValue(orderData);
      Order.updateStatus.mockResolvedValue([updatedOrder]);

      const result = await OrderService.updateOrderStatus(1, 2);
      expect(result).toEqual([updatedOrder]);
      expect(supportedStatuses.validateStatus).toHaveBeenCalledWith(2);
      expect(Order.getById).toHaveBeenCalledWith(1);
      expect(Order.updateStatus).toHaveBeenCalledWith(1, 2);
    });

    it('should throw an error if status is invalid', async () => {
      supportedStatuses.validateStatus.mockReturnValue(false);

      await expect(OrderService.updateOrderStatus(1, 999)).rejects.toThrow('Invalid status');

      expect(supportedStatuses.validateStatus).toHaveBeenCalledWith(999);
    });

    it('should not update status if order does not exist', async () => {
      // Mock validateStatus to return true
      supportedStatuses.validateStatus.mockReturnValue(true);

      // Mock the return value of Order.getById for a non-existing order
      Order.getById.mockResolvedValue(null);

      const result = await OrderService.updateOrderStatus(999, 2); // Non-existent ID
      expect(result).toBeNull();
      expect(Order.getById).toHaveBeenCalledWith(999);
    });

    it('should throw an error if trying to update a delivered order', async () => {
      const orderData = { id: 1, status: 3 }; // Delivered status

      // Mock validateStatus to return true
      supportedStatuses.validateStatus.mockReturnValue(true);

      // Mock the return value of Order.getById
      Order.getById.mockResolvedValue(orderData);

      await expect(OrderService.updateOrderStatus(1, 2)).rejects.toThrow(
        'Order is already delivered',
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order by ID', async () => {
      const orderData = { id: 1, status: 0, is_deleted: false };
      const canceledOrder = { id: 1, status: 0, is_deleted: true };

      // Mock the return value of Order.getById and Order.cancel
      Order.getById.mockResolvedValue(orderData);
      Order.cancel.mockResolvedValue([canceledOrder]);

      const result = await OrderService.cancelOrder(1);
      expect(result).toEqual([canceledOrder]);
      expect(Order.getById).toHaveBeenCalledWith(1);
      expect(Order.cancel).toHaveBeenCalledWith(1);
    });

    it('should not cancel an order if it does not exist', async () => {
      // Mock the return value of Order.getById for a non-existing order
      Order.getById.mockResolvedValue(null);

      const result = await OrderService.cancelOrder(999); // Non-existent ID
      expect(result).toBeNull();
      expect(Order.getById).toHaveBeenCalledWith(999);
    });
  });
});
