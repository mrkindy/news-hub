import { STORAGE_KEYS } from "./constants";

export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  REGISTER: '/api/v1/auth/register',
  FILTER: '/api/v1/filter-options',
  NEWS: '/api/v1/news',
  NEWS_DETAIL: '/api/v1/news/',
  PREFERENCES: '/api/v1/auth/me',
  USER_PREFERENCES: '/api/v1/user/preferences',
  USER: '/api/v1/auth/me',
  FILTER_OPTIONS: '/api/v1/filter-options',
  SEARCH_FILTER: '/api/v1/filter-options',
  SEARCH: '/api/v1/news',
  FILTERED: '/api/v1/filter-options',
  PERSONALIZED_FEED: '/api/v1/personalized-feed',
  CATEGORIES: '/api/v1/categories',
  SOURCES: '/api/v1/sources',
  AUTHORS: '/api/v1/authors'
} as const;

// Generic fetcher function for React Query
export const fetcher = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  includeToken: boolean = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  // If includeToken is true, add the token to headers
  if (includeToken) {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  }

  const backendUrl = process.env.VITE_BACKEND_URL || '';
  const fullUrl = backendUrl + url;

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: data && method !== "GET" ? JSON.stringify(data) : undefined,
  });

  return response.json();
};
