const UserService = require('../services/user.service');
const User = require('../models/user.model');

// Mocking the User model methods
jest.mock('../models/user.model');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllUsers should return all users', async () => {
    const users = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
      { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com' },
    ];

    // Mock the findAll method to return a list of users
    User.findAll.mockResolvedValue(users);

    const result = await UserService.getAllUsers();

    expect(result).toEqual(users);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  test('getUserById should return a user by id', async () => {
    const user = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };

    // Mock the findById method to return a user
    User.findById.mockResolvedValue(user);

    const result = await UserService.getUserById(1);

    expect(result).toEqual(user);
    expect(User.findById).toHaveBeenCalledWith(1);
  });

  test('getUserById should return toBeNull() if user does not exist', async () => {
    // Mock the findById method to return null (user not found)
    User.findById.mockResolvedValue(null);

    const result = await UserService.getUserById(999);

    expect(result).toBeNull();
    expect(User.findById).toHaveBeenCalledWith(999);
  });

  test('getUserByEmail should return a user by email', async () => {
    const user = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };

    // Mock the findByEmail method to return a user
    User.findByEmail.mockResolvedValue(user);

    const result = await UserService.getUserByEmail('john.doe@example.com');

    expect(result).toEqual(user);
    expect(User.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
  });

  test('createUser should create and return a user', async () => {
    const userData = { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };
    const newUser = { id: 1, ...userData };

    // Mock the create method to return the newly created user
    User.create.mockResolvedValue(newUser);

    const result = await UserService.createUser(userData);

    expect(result).toEqual(newUser);
    expect(User.create).toHaveBeenCalledWith(userData);
  });

  test('updateUser should update and return the user', async () => {
    const userData = { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };
    const updatedUser = { id: 1, ...userData };

    // Mock the findById method to return a user
    User.findById.mockResolvedValue({ id: 1 });

    // Mock the update method to return the updated user
    User.update.mockResolvedValue(updatedUser);

    const result = await UserService.updateUser(1, userData);

    expect(result).toEqual(updatedUser);
    expect(User.update).toHaveBeenCalledWith(1, userData);
  });

  test('updateUser should return toBeNull() if user does not exist', async () => {
    const userData = { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };

    // Mock the findById method to return null (user not found)
    User.findById.mockResolvedValue(null);

    const result = await UserService.updateUser(999, userData);

    expect(result).toBeNull();
    expect(User.update).not.toHaveBeenCalled();
  });

  test('deleteUser should delete a user', async () => {
    const user = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };

    // Mock the findById method to return a user
    User.findById.mockResolvedValue(user);

    // Mock the delete method to return 1 (indicating the user was deleted)
    User.delete.mockResolvedValue(1);

    const result = await UserService.deleteUser(1);

    expect(result).toBe(1);
    expect(User.delete).toHaveBeenCalledWith(1);
  });

  test('deleteUser should return toBeNull() if user does not exist', async () => {
    // Mock the findById method to return null (user not found)
    User.findById.mockResolvedValue(null);

    const result = await UserService.deleteUser(999);

    expect(result).toBeNull();
    expect(User.delete).not.toHaveBeenCalled();
  });
});
