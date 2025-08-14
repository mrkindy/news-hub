// Mock the endpoints module first, before imports
const mockFetcher = jest.fn();
jest.mock('../../src/utils/endpoints', () => ({
  API_ENDPOINTS: {
    LOGIN: '/api/login.json',
    REGISTER: '/api/register.json',
    USER: '/api/user.json',
    PREFERENCES: '/api/preferences.json',
    LOGOUT: '/api/logout.json',
  },
  fetcher: mockFetcher,
}));

import { authService } from '../../src/services/authService';
import { API_ENDPOINTS } from '../../src/utils/endpoints';
import type { User, LoginCredentials } from '../../src/types/auth';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        token: 'mock-token-123',
        createdAt: '2023-01-01',
        preferences: {
          categories: [],
          sources: [],
          authors: [],
          language: 'en',
          theme: 'light',
        },
      };

      const mockResponse = {
        success: true,
        user: mockUser,
        token: 'mock-token-123',
      };

      mockFetcher.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(mockFetcher).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, 'POST', credentials);
      expect(result).toEqual(mockUser);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'newshub_user',
        JSON.stringify(mockUser)
      );
    });

    it('should throw error when login fails', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockResponse = {
        success: false,
        message: 'Invalid credentials',
      };

      mockFetcher.mockResolvedValue(mockResponse);

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when valid user data exists in localStorage', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        token: 'mock-token-123',
        createdAt: '2023-01-01',
        preferences: {
          categories: [],
          sources: [],
          authors: [],
          language: 'en',
          theme: 'light',
        },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = authService.getCurrentUser();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('newshub_user');
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user data exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when invalid JSON exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', async () => {
      const mockResponse = {
        success: true,
        message: 'Logged out successfully',
      };

      mockFetcher.mockResolvedValue(mockResponse);

      await authService.logout();

      expect(mockFetcher).toHaveBeenCalledWith('/api/logout.json', 'POST', {}, true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('newshub_user');
    });

    it('should remove user from localStorage even if API call fails', async () => {
      const mockResponse = {
        success: false,
        message: 'Logout failed',
      };

      mockFetcher.mockResolvedValue(mockResponse);

      await authService.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('newshub_user');
    });
  });
});
