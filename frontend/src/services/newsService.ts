import { Article } from '../types/news';
import { API_ENDPOINTS, fetcher } from '../utils/endpoints';

class NewsService {
  async getArticles(): Promise<Article[]> {
    const response = await fetcher(API_ENDPOINTS.NEWS, "GET", {}, true);
    return (response as { articles: Article[] }).articles || [];
  }

  async getArticleById(id: string): Promise<{ article: Article | null; relatedArticles: Article[] }> {
    const response = await fetcher(API_ENDPOINTS.NEWS_DETAIL+id);
    const article = (response as { article: Article }).article ? 
      { ...(response as { article: Article }).article, id } : null;
    
    return {
      article,
      relatedArticles: (response as { relatedArticles: Article[] }).relatedArticles || []
    };
  }

  async getFilterOptions(): Promise<{
    categories: string[];
    sources: string[];
    authors: string[];
  }> {
    const response = await fetcher(API_ENDPOINTS.FILTER);
    return (response as { filters: { categories: string[]; sources: string[]; authors: string[] } }).filters;
  }
}

export const newsService = new NewsService();
