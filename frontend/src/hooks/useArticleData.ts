import { useMemo } from 'react';
import { NewsFilters, Article } from '../types/news';
import { getFilterPriority } from '../utils/filterUtils';
import { 
  useInfiniteArticles, 
  useInfiniteSearchArticles, 
  useInfiniteFilteredArticles, 
  useInfinitePersonalizedFeed
} from './useNewsQueries';

interface User {
  preferences?: {
    categories: string[];
    sources: string[];
    authors: string[];
  };
}

export const useArticleData = (filters: NewsFilters, user: User | null) => {
  const hasPersonalization = Boolean(
    user?.preferences && (
      user.preferences.categories.length > 0 || 
      user.preferences.sources.length > 0 || 
      user.preferences.authors.length > 0
    )
  );

  const { hasKeyword, hasFilters, useSearch, useFilter, usePersonalized, useAll } = getFilterPriority(filters, hasPersonalization);

  // Infinite query hooks
  const allArticles = useInfiniteArticles(10, useAll);
  const searchResults = useInfiniteSearchArticles(filters.keyword, 10, useSearch);
  const filteredResults = useInfiniteFilteredArticles(filters, 10, useFilter);
  const personalizedResults = useInfinitePersonalizedFeed(
    user ? {
      categories: user.preferences?.categories || [],
      sources: user.preferences?.sources || [],
      authors: user.preferences?.authors || []
    } : { categories: [], sources: [], authors: [] },
    10,
    usePersonalized
  );

  return useMemo(() => {
    let activeQuery;

    if (hasKeyword) {
      activeQuery = searchResults;
    } else if (hasFilters) {
      activeQuery = filteredResults;
    } else if (hasPersonalization) {
      activeQuery = personalizedResults;
    } else {
      activeQuery = allArticles;
    }

    // Extract articles from infinite query pages
    const articles: Article[] = [];
    
    // Handle the data extraction more safely
    try {
      if (activeQuery.data?.pages) {
        for (const page of activeQuery.data.pages) {
          // Laravel pagination response can have either 'data' or 'articles' field
          const pageArticles = page.data || page.articles || [];
          if (Array.isArray(pageArticles)) {
            articles.push(...pageArticles);
          }
        }
      }
    } catch {
      // Error extracting articles from pages - silently handled
    }

    return {
      articles,
      isLoading: activeQuery.isLoading,
      fetchNextPage: activeQuery.fetchNextPage,
      hasNextPage: activeQuery.hasNextPage || false,
      isFetchingNextPage: activeQuery.isFetchingNextPage,
      error: activeQuery.error
    };
  }, [hasKeyword, hasFilters, hasPersonalization, allArticles, searchResults, filteredResults, personalizedResults]);
};
