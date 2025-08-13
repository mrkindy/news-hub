import { NewsFilters } from '../types/news';

/**
 * Build query string from filters for API calls
 * Maps frontend filter structure to backend API expectations
 */
export const buildApiQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && value && 'id' in value) {
        // For category, source, author objects, use the slug for API call
        const objValue = value as { id: string; slug?: string; name?: string };
        if (objValue.slug) {
          // Map filter keys to match API expectations
          const apiKey = key === 'category' ? 'categories' : 
                        key === 'source' ? 'sources' : 
                        key === 'author' ? 'authors' : key;
          searchParams.append(apiKey, objValue.slug);
        }
      } else {
        // Handle other parameters
        if (key === 'keyword') {
          searchParams.append('q', String(value)); // API expects 'q' for search
        } else if (key === 'dateFrom') {
          searchParams.append('date_from', String(value)); // API expects 'date_from'
        } else if (key === 'dateTo') {
          searchParams.append('date_to', String(value)); // API expects 'date_to'
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString;
};

/**
 * Check if filters have any active values
 */
export const hasActiveFilters = (filters: NewsFilters): boolean => {
  return Boolean(
    filters.keyword?.trim() ||
    filters.category?.id ||
    filters.source?.id ||
    filters.author?.id ||
    filters.dateFrom ||
    filters.dateTo
  );
};

/**
 * Get filter priorities for determining which query to use
 */
export const getFilterPriority = (filters: NewsFilters, hasPersonalization: boolean) => {
  const hasKeyword = Boolean(filters.keyword?.trim());
  const hasFilters = Boolean(
    filters.category?.id || 
    filters.source?.id || 
    filters.author?.id || 
    filters.dateFrom || 
    filters.dateTo
  );

  return {
    hasKeyword,
    hasFilters,
    hasPersonalization,
    useSearch: hasKeyword,
    useFilter: !hasKeyword && hasFilters,
    usePersonalized: !hasKeyword && !hasFilters && hasPersonalization,
    useAll: !hasKeyword && !hasFilters && !hasPersonalization
  };
};
