const AuthService = require('./auth.service');
const User = require('../models/user.model');
const RevokedToken = require('../models/revokedToken.model');

// Mock the User and RevokedToken models
jest.mock('../models/user.model');
jest.mock('../models/revokedToken.model');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthUserByEmail', () => {
    it('should return a user with email and password', async () => {
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        created_at: '2022-01-01',
        updated_at: '2022-01-01',
        user_group: 'admin',
      };

      // Mock the return value of User.findByEmailWithPassword
      User.findByEmailWithPassword.mockResolvedValue(mockUser);

      const result = await AuthService.getAuthUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(User.findByEmailWithPassword).toHaveBeenCalledWith('test@example.com');
      expect(User.findByEmailWithPassword).toHaveBeenCalledTimes(1);
    });

    it('should return null if no user is found', async () => {
      // Mock the return value of User.findByEmailWithPassword for a non-existing user
      User.findByEmailWithPassword.mockResolvedValue(null);

      const result = await AuthService.getAuthUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
      expect(User.findByEmailWithPassword).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });

  describe('isTokenRevoked', () => {
    it('should return true if the token is revoked', async () => {
      const mockRevokedToken = { token: 'revoked-token' };

      // Mock the return value of RevokedToken.findByToken
      RevokedToken.findByToken.mockResolvedValue(mockRevokedToken);

      const result = await AuthService.isTokenRevoked('revoked-token');
      expect(result).toBe(true);
      expect(RevokedToken.findByToken).toHaveBeenCalledWith('revoked-token');
    });

    it('should return false if the token is not revoked', async () => {
      // Mock the return value of RevokedToken.findByToken for a non-revoked token
      RevokedToken.findByToken.mockResolvedValue(null);

      const result = await AuthService.isTokenRevoked('valid-token');
      expect(result).toBe(false);
      expect(RevokedToken.findByToken).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('revokeToken', () => {
    it('should revoke the token successfully', async () => {
      const mockRevokedToken = { token: 'revoked-token' };

      // Mock the return value of RevokedToken.create
      RevokedToken.create.mockResolvedValue(mockRevokedToken);

      const result = await AuthService.revokeToken('revoked-token');
      expect(result).toBe(true);
      expect(RevokedToken.create).toHaveBeenCalledWith({ token: 'revoked-token' });
    });

    it('should return false if token revocation fails', async () => {
      // Mock the return value of RevokedToken.create for failure scenario
      RevokedToken.create.mockResolvedValue(null);

      const result = await AuthService.revokeToken('invalid-token');
      expect(result).toBe(false);
      expect(RevokedToken.create).toHaveBeenCalledWith({ token: 'invalid-token' });
    });
  });
});
