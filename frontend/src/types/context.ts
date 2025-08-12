import { NewsState, NewsFilters, Category, Source, Author } from './news';
import { AuthState, User, RegisterData, UserPreferences, LoginCredentials } from './auth';
import { Article } from './news';

// News Context Types
export interface NewsContextType extends NewsState {
  fetchArticles: () => Promise<void>;
  searchArticles: (keyword: string) => Promise<void>;
  applyFilters: (filters: Partial<NewsFilters>) => Promise<void>;
  getPersonalizedFeed: (preferences: { categories: Category[]; sources: Source[]; authors: Author[] }) => Promise<void>;
  clearError: () => void;
}

export type NewsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_FILTERED_ARTICLES'; payload: Article[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<NewsFilters> }
  | { type: 'APPLY_FILTERS'; payload: { filters: Partial<NewsFilters>; articles: Article[] } }
  | { type: 'CLEAR_ERROR' };

// Auth Context Types
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  clearError: () => void;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };
