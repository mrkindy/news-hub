export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferences: UserPreferences;
  createdAt: string;
  token: string;
}

export interface UserPreferences {
  categories: string[];
  sources: string[];
  authors: string[];
  language: string;
  theme: 'light' | 'dark';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

export interface PreferencesRequest {
  categories: string[];
  sources: string[];
  authors: string[];
  language: string;
  theme: string;
}

export interface PreferencesResponse {
  success: boolean;
  data: {
    success: boolean;
    preferences: {
      categories: string[];
      sources: string[];
      authors: string[];
      language: string;
      theme: string;
    };
  };
}