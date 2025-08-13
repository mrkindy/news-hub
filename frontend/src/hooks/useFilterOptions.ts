import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { filterOptionsService } from '../services/filterOptionsService';
import { FilterOption, SearchFilterRequest } from '../types/filter-options';

// Hook for individual filter types
export const useCategories = (query?: string) => {
  return useQuery({
    queryKey: ['categories', query],
    queryFn: () => filterOptionsService.getCategories(query),
    select: (data) => data?.data.categories || [],
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useSources = (query?: string) => {
  return useQuery({
    queryKey: ['sources', query],
    queryFn: () => filterOptionsService.getSources(query),
    select: (data) => data?.data.sources || [],
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useAuthors = (query?: string) => {
  return useQuery({
    queryKey: ['authors', query],
    queryFn: () => filterOptionsService.getAuthors(query),
    select: (data) => data?.data.authors || [],
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Legacy hook for backward compatibility
export const useFilterOptions = () => {
  const {
    data: filterOptions,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => filterOptionsService.getFilterOptions(),
    select: (data) => data?.data || { categories: [], sources: [], authors: [] },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    filterOptions,
    isLoading,
    error,
    isError
  };
};

export const useSearchFilterOptions = () => {
  const [searchResults, setSearchResults] = useState<Record<string, FilterOption[]>>({});
  const [isSearching, setIsSearching] = useState(false);

  const searchOptions = useCallback(async (type: 'categories' | 'sources' | 'authors', query: string) => {
    if (!query.trim()) {
      setSearchResults(prev => ({ ...prev, [type]: [] }));
      return;
    }

    setIsSearching(true);
    try {
      const request: SearchFilterRequest = { type, query, limit: 10 };
      const response = await filterOptionsService.searchFilterOptions(request);
      
      if (response.success) {
        setSearchResults(prev => ({ ...prev, [type]: response.data }));
      }
    } catch {
      // Error searching filter options - silently handled
      setSearchResults(prev => ({ ...prev, [type]: [] }));
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearchResults = useCallback((type?: 'categories' | 'sources' | 'authors') => {
    if (type) {
      setSearchResults(prev => ({ ...prev, [type]: [] }));
    } else {
      setSearchResults({});
    }
  }, []);

  return {
    searchResults,
    isSearching,
    searchOptions,
    clearSearchResults
  };
};
