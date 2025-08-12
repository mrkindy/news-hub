import { useQuery, useInfiniteQuery, UseQueryResult, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Article, NewsFilters } from '../types/news';
import { fetcher, API_ENDPOINTS } from '../utils/endpoints';
import { buildApiQueryString } from '../utils/filterUtils';

interface NewsResponse {
  success: boolean;
  articles: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Laravel Pagination Structure (flexible for both 'data' and 'articles' fields)
export interface LaravelPaginatedResponse {
  success: boolean;
  data?: Article[];
  articles?: Article[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

interface SearchResponse extends NewsResponse {
  query: Partial<NewsFilters>;
}

interface FilteredResponse extends NewsResponse {
  filters: Partial<NewsFilters>;
}

interface PersonalizedFeedResponse extends NewsResponse {
  preferences: {
    categories: Array<{ id: string; name: string; slug: string }>;
    sources: Array<{ id: string; name: string; slug: string }>;
    authors: Array<{ id: string; name: string; slug: string }>;
  };
}

// Hook for fetching all articles
export const useArticles = (
  page: number = 1, 
  limit: number = 10, 
  enabled: boolean = true
): UseQueryResult<NewsResponse> => {
  const queryString = buildApiQueryString({ page, limit });
  const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: () => fetcher(url) as Promise<NewsResponse>,
    enabled: Boolean(enabled),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for searching articles
export const useSearchArticles = (
  q: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<SearchResponse> => {
  const queryString = buildApiQueryString({ q, page, limit });
  const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['search', q, page, limit],
    queryFn: () => fetcher(url) as Promise<SearchResponse>,
    enabled: Boolean(enabled) && Boolean(q?.trim()),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for filtering articles
export const useFilteredArticles = (
  filters: Partial<NewsFilters>,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<FilteredResponse> => {
  const queryString = buildApiQueryString({ ...filters, page, limit });
  const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['filtered-articles', filters, page, limit],
    queryFn: () => fetcher(url) as Promise<FilteredResponse>,
    enabled: Boolean(enabled),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for personalized feed
export const usePersonalizedFeed = (
  preferences: {
    categories: string[];
    sources: string[];
    authors: string[];
  },
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<PersonalizedFeedResponse> => {
  const queryString = buildApiQueryString({ 
    categories: preferences.categories.join(','),
    sources: preferences.sources.join(','),
    authors: preferences.authors.join(','),
    page, 
    limit 
  });
  const url = `${API_ENDPOINTS.PERSONALIZED_FEED}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['personalized-feed', preferences, page, limit],
    queryFn: () => fetcher(url, "GET", {}, true) as Promise<PersonalizedFeedResponse>,
    enabled: Boolean(enabled),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for combined search and filter
export const useSearchAndFilter = (
  q: string,
  filters: Partial<NewsFilters>,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<SearchResponse> => {
  const queryString = buildApiQueryString({ q, ...filters, page, limit });
  const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: ['search-and-filter', q, filters, page, limit],
    queryFn: () => fetcher(url) as Promise<SearchResponse>,
    enabled: Boolean(enabled),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// INFINITE QUERY HOOKS FOR PAGINATION

// Infinite query for all articles with pagination
export const useInfiniteArticles = (
  limit: number = 10,
  enabled: boolean = true
): UseInfiniteQueryResult<LaravelPaginatedResponse> => {
  return useInfiniteQuery({
    queryKey: ['articles-infinite', limit],
    queryFn: ({ pageParam = 1 }) => {
      const queryString = buildApiQueryString({ page: pageParam, per_page: limit });
      const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;
      return fetcher(url) as Promise<LaravelPaginatedResponse>;
    },
    enabled: Boolean(enabled),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.next_page_url ? lastPage.pagination.current_page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite query for search results with pagination
export const useInfiniteSearchArticles = (
  q: string,
  limit: number = 10,
  enabled: boolean = true
): UseInfiniteQueryResult<LaravelPaginatedResponse> => {
  return useInfiniteQuery({
    queryKey: ['search-infinite', q, limit],
    queryFn: ({ pageParam = 1 }) => {
      const queryString = buildApiQueryString({ q, page: pageParam, per_page: limit });
      const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;
      return fetcher(url) as Promise<LaravelPaginatedResponse>;
    },
    enabled: Boolean(enabled) && Boolean(q?.trim()),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_url ? lastPage.current_page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Infinite query for filtered articles with pagination
export const useInfiniteFilteredArticles = (
  filters: Partial<NewsFilters>,
  limit: number = 10,
  enabled: boolean = true
): UseInfiniteQueryResult<LaravelPaginatedResponse> => {
  return useInfiniteQuery({
    queryKey: ['filtered-articles-infinite', filters, limit],
    queryFn: ({ pageParam = 1 }) => {
      const queryString = buildApiQueryString({ ...filters, page: pageParam, per_page: limit });
      const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;
      return fetcher(url) as Promise<LaravelPaginatedResponse>;
    },
    enabled: Boolean(enabled),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_url ? lastPage.current_page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Infinite query for personalized feed with pagination
export const useInfinitePersonalizedFeed = (
  preferences: {
    categories: string[];
    sources: string[];
    authors: string[];
  },
  limit: number = 10,
  enabled: boolean = true
): UseInfiniteQueryResult<LaravelPaginatedResponse> => {
  return useInfiniteQuery({
    queryKey: ['personalized-feed-infinite', preferences, limit],
    queryFn: ({ pageParam = 1 }) => {
      const queryString = buildApiQueryString({ 
        categories: preferences.categories.join(','),
        sources: preferences.sources.join(','),
        authors: preferences.authors.join(','),
        page: pageParam, 
        per_page: limit 
      });
      const url = `${API_ENDPOINTS.PERSONALIZED_FEED}${queryString ? `?${queryString}` : ''}`;
      return fetcher(url, "GET", {}, true) as Promise<LaravelPaginatedResponse>;
    },
    enabled: Boolean(enabled),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_url ? lastPage.current_page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Infinite query for combined search and filter with pagination
export const useInfiniteSearchAndFilter = (
  q: string,
  filters: Partial<NewsFilters>,
  limit: number = 10,
  enabled: boolean = true
): UseInfiniteQueryResult<LaravelPaginatedResponse> => {
  return useInfiniteQuery({
    queryKey: ['search-and-filter-infinite', q, filters, limit],
    queryFn: ({ pageParam = 1 }) => {
      const queryString = buildApiQueryString({ q, ...filters, page: pageParam, per_page: limit });
      const url = `${API_ENDPOINTS.NEWS}${queryString ? `?${queryString}` : ''}`;
      return fetcher(url) as Promise<LaravelPaginatedResponse>;
    },
    enabled: Boolean(enabled),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page_url ? lastPage.current_page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
