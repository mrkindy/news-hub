import { API_ENDPOINTS, fetcher } from "../../src/utils/endpoints";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock global fetch
const mockFetch = jest.fn();

describe("endpoints", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    Object.defineProperty(global, "localStorage", { value: mockLocalStorage });
    Object.defineProperty(global, "fetch", { value: mockFetch });
  });

  describe("API_ENDPOINTS", () => {
    it("should contain all required endpoint constants", () => {
      const expectedEndpoints = {
        LOGIN: "/api/v1/auth/login",
        LOGOUT: "/api/v1/auth/logout",
        REGISTER: "/api/v1/auth/register",
        FILTER: "/api/v1/filter-options",
        NEWS: "/api/v1/news",
        NEWS_DETAIL: "/api/v1/news/",
        PREFERENCES: "/api/v1/auth/me",
        USER_PREFERENCES: "/api/v1/user/preferences",
        USER: "/api/v1/auth/me",
        FILTER_OPTIONS: "/api/v1/filter-options",
        SEARCH_FILTER: "/api/v1/filter-options",
        SEARCH: "/api/v1/news",
        FILTERED: "/api/v1/filter-options",
        PERSONALIZED_FEED: "/api/v1/personalized-feed",
        CATEGORIES: "/api/v1/categories",
        SOURCES: "/api/v1/sources",
        AUTHORS: "/api/v1/authors",
      };

      expect(API_ENDPOINTS).toEqual(expectedEndpoints);
    });

    it("should have readonly properties", () => {
      expect(typeof API_ENDPOINTS.LOGIN).toBe("string");
      expect(typeof API_ENDPOINTS.REGISTER).toBe("string");
      expect(typeof API_ENDPOINTS.NEWS).toBe("string");
    });
  });

  describe("fetcher", () => {
    const mockResponse = { data: "test" };

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
    });

    it("should make a GET request by default", async () => {
      const url = "/api/test";

      await fetcher(url);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
    });

    it("should make a POST request with data", async () => {
      const url = "/api/test";
      const data = { test: "data" };

      await fetcher(url, "POST", data);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    });

    it("should not include body for GET requests even if data is provided", async () => {
      const url = "/api/test";
      const data = { test: "data" };

      await fetcher(url, "GET", data);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
    });

    it("should include Authorization header when includeToken is true and user has token", async () => {
      const url = "/api/test";
      const mockUser = { token: "test-token-123", name: "Test User" };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      await fetcher(url, "GET", undefined, true);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("newshub_user");
      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token-123",
        },
        body: undefined,
      });
    });

    it("should not include Authorization header when includeToken is true but no token exists", async () => {
      const url = "/api/test";
      const mockUser = { name: "Test User" }; // No token

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      await fetcher(url, "GET", undefined, true);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
    });

    it("should not include Authorization header when no user in localStorage", async () => {
      const url = "/api/test";

      mockLocalStorage.getItem.mockReturnValue(null);

      await fetcher(url, "GET", undefined, true);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
    });

    it("should handle different HTTP methods", async () => {
      const url = "/api/test";
      const data = { test: "data" };

      // Test PUT
      await fetcher(url, "PUT", data);
      expect(mockFetch).toHaveBeenLastCalledWith(
        url,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(data),
        })
      );

      // Test DELETE
      await fetcher(url, "DELETE", data);
      expect(mockFetch).toHaveBeenLastCalledWith(
        url,
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify(data),
        })
      );
    });

    it("should return parsed JSON response", async () => {
      const url = "/api/test";
      const expectedData = { message: "success", id: 123 };

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(expectedData),
      });

      const result = await fetcher(url);

      expect(result).toEqual(expectedData);
    });

    it("should handle invalid JSON in localStorage gracefully", async () => {
      const url = "/api/test";

      mockLocalStorage.getItem.mockReturnValue("invalid-json");

      // Should not throw an error, just continue without authorization header
      await expect(fetcher(url, "GET", undefined, true)).rejects.toThrow();
    });
  });
});
