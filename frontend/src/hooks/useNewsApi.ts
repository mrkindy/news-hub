import { useQuery } from '@tanstack/react-query';
import { Article } from '../types/news';
import { newsService } from '../services/newsService';

/**
 * Hook to fetch all articles
 */
export function useArticles() {
  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: () => newsService.getArticles(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch a single article with related articles
 */
export function useArticleDetail(id: string) {
  return useQuery<{ article: Article | null; relatedArticles: Article[] }>({
    queryKey: ['article-detail', id],
    queryFn: () => newsService.getArticleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch filter options
 */
export function useFilterOptions() {
  return useQuery<{ categories: string[]; sources: string[]; authors: string[] }>({
    queryKey: ['filter-options'],
    queryFn: () => newsService.getFilterOptions(),
    staleTime: 1000 * 60 * 10, // 10 minutes - filter options don't change often
  });
}
