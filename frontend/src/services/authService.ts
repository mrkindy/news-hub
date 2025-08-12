import { User, LoginCredentials, RegisterData, PreferencesRequest, PreferencesResponse } from "../types/auth";
import { API_ENDPOINTS, fetcher } from "../utils/endpoints";
import { STORAGE_KEYS } from "../utils/constants";

/**
 * Authentication service using static JSON endpoints
 * This replaces the mock service and uses React Query for data fetching
 */
class AuthService {
  /**
   * user login
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = (await fetcher(
      API_ENDPOINTS.LOGIN,
      "POST",
      credentials
    )) as { user: User; success: boolean; token?: string } ;

    if (!response.success) {
      throw new Error("Login failed");
    }
    // Update the response with the provided user data
    const newUser = {
      ...response.user,
      email: response.user.email,
      first_name: response.user.first_name,
      last_name: response.user.last_name,
      token: response.token || response.user.token,
    };


    // Store current user
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  }

  /**
   * User registration
   */
  async register(userData: RegisterData): Promise<User> {
    // For demo purposes, we'll just return the mock registration response
    const response = (await fetcher(
      API_ENDPOINTS.REGISTER,
      "POST",
      userData
    )) as { user: User; success: boolean; token: string};

    if (!response.success) {
      throw new Error("Registration failed");
    }
    // Update the response with the provided user data
    const newUser = {
      ...response.user,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      token: response.token,
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

    return newUser;
  }

  /**
   * Fetches user data
   */
  async getUserData(): Promise<User> {
    const response = (await fetcher(API_ENDPOINTS.USER)) as {
      success: boolean;
      user: User;
    };

    if (!response.success) {
      throw new Error("Failed to fetch user data");
    }

    return response.user;
  }

  /**
   * Updates user preferences
   */
  async updatePreferences(
    preferences: Partial<User["preferences"]>
  ): Promise<User["preferences"]> {
    // Send a PUT/PATCH request to the server
    const response = (await fetcher(API_ENDPOINTS.PREFERENCES)) as {
      success: boolean;
      preferences: User["preferences"];
    };

    if (!response.success) {
      throw new Error("Failed to update preferences");
    }

    const updatedPreferences = { ...response.preferences, ...preferences };

    // Update the stored user with new preferences
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        preferences: updatedPreferences,
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }

    return updatedPreferences;
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      const response = (await fetcher(API_ENDPOINTS.LOGOUT, "POST", {}, true)) as {
        success: boolean;
        message: string;
      };

      if (!response.success) {
        throw new Error("Failed to Logout: " + response.message);
      }
    } catch {
      // If logout API call fails, still remove user from localStorage
    }

    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Gets current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }

  /**
   * Save user preferences to API
   */
  async savePreferences(preferences: PreferencesRequest): Promise<PreferencesResponse> {
    const response = await fetcher(
      API_ENDPOINTS.USER_PREFERENCES,
      "PUT",
      preferences,
      true // include token
    ) as PreferencesResponse;

    if (!response.success) {
      throw new Error("Failed to save preferences");
    }

    // Update localStorage with the new preferences
    const currentUser = this.getCurrentUser();
    if (currentUser && response.data && response.data.preferences) {
      const updatedUser = {
        ...currentUser,
        preferences: {
          categories: response.data.preferences.categories || [],
          sources: response.data.preferences.sources || [],
          authors: response.data.preferences.authors || [],
          language: response.data.preferences.language || 'en',
          theme: response.data.preferences.theme || 'light'
        }
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } else {
      // Failed to update localStorage: Missing data in response
    }

    return response;
  }
}

export const authService = new AuthService();
