import React, { createContext, useReducer, useCallback } from 'react';
import { NewsState, NewsFilters } from '../types/news';
import { NewsContextType, NewsAction } from '../types/context';
import { NewsProviderProps } from '../types/layout';

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

const initialState: NewsState = {
  articles: [],
  filteredArticles: [],
  isLoading: false,
  error: null,
  filters: {
    keyword: '',
    category: null,
    source: null,
    author: null,
    dateFrom: '',
    dateTo: '',
  },
};

const newsReducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload, filteredArticles: action.payload, error: null };
    case 'SET_FILTERED_ARTICLES':
      return { ...state, filteredArticles: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'APPLY_FILTERS': {
      const updatedFilters = { ...state.filters, ...action.payload.filters };
      return { 
        ...state, 
        filters: updatedFilters,
        filteredArticles: action.payload.articles,
        error: null 
      };
    }
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  // These methods are now deprecated - components should use React Query hooks directly
  const fetchArticles = useCallback(async (): Promise<void> => {
    // NewsContext.fetchArticles is deprecated. Use useArticles hook directly in your components.
    // Keep for backward compatibility but don't actually implement
  }, []);

  const searchArticles = useCallback(async (keyword: string): Promise<void> => {
    // NewsContext.searchArticles is deprecated. Use useSearchArticles hook directly in your components.
    dispatch({ type: 'SET_FILTERS', payload: { keyword } });
  }, []);

  const applyFilters = useCallback(async (filters: Partial<NewsFilters>): Promise<void> => {
    // NewsContext.applyFilters is deprecated. Use useFilteredArticles hook directly in your components.
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const getPersonalizedFeed = useCallback(async (preferences: { 
    categories: { id: string; name: string; slug: string }[]; 
    sources: { id: string; name: string; slug: string }[]; 
    authors: { id: string; name: string; slug: string }[] 
  }): Promise<void> => {
    // NewsContext.getPersonalizedFeed is deprecated. Use usePersonalizedFeed hook directly in your components.
    // Keep for backward compatibility but don't actually implement
    void preferences; // Mark as used
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: NewsContextType = {
    ...state,
    fetchArticles,
    searchArticles,
    applyFilters,
    getPersonalizedFeed,
    clearError,
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};