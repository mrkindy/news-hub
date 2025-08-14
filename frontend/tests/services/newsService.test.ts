import { newsService } from '../../src/services/newsService';
import { fetcher } from '../../src/utils/endpoints';

// Mock the fetcher function
jest.mock('../../src/utils/endpoints', () => ({
  fetcher: jest.fn(),
  API_ENDPOINTS: {
    NEWS: '/api/v1/news',
    NEWS_DETAIL: '/api/v1/news/',
    FILTER: '/api/v1/filter-options',
  }
}));

const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('NewsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getArticles', () => {
    test('should fetch and return articles array', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          content: 'Test content',
          author: { id: '1', name: 'Test Author', slug: 'test-author' },
          publishedAt: '2024-01-01',
          imageUrl: 'test-image.jpg',
          category: { id: '1', name: 'Tech', slug: 'tech' },
          source: { id: '1', name: 'Test Source', slug: 'test-source' },
          tags: ['test'],
          excerpt: 'Test excerpt',
          slug: 'test-article'
        }
      ];

      mockFetcher.mockResolvedValue({ articles: mockArticles });

      const result = await newsService.getArticles();

      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/news', 'GET', {}, true);
      expect(result).toEqual(mockArticles);
    });

    test('should return empty array when no articles', async () => {
      mockFetcher.mockResolvedValue({ articles: null });

      const result = await newsService.getArticles();

      expect(result).toEqual([]);
    });

    test('should handle missing articles property', async () => {
      mockFetcher.mockResolvedValue({});

      const result = await newsService.getArticles();

      expect(result).toEqual([]);
    });
  });

  describe('getArticleById', () => {
    test('should fetch and return article with related articles', async () => {
      const mockArticle = {
        title: 'Test Article',
        content: 'Test content',
        author: { id: '1', name: 'Test Author', slug: 'test-author' },
        publishedAt: '2024-01-01',
      };

      const mockRelatedArticles = [
        {
          id: '2',
          title: 'Related Article',
          content: 'Related content',
          author: { id: '2', name: 'Another Author', slug: 'another-author' },
          publishedAt: '2024-01-02',
        }
      ];

      mockFetcher.mockResolvedValue({
        article: mockArticle,
        relatedArticles: mockRelatedArticles
      });

      const result = await newsService.getArticleById('1');

      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/news/1');
      expect(result.article).toEqual({ ...mockArticle, id: '1' });
      expect(result.relatedArticles).toEqual(mockRelatedArticles);
    });

    test('should return null article when not found', async () => {
      mockFetcher.mockResolvedValue({
        article: null,
        relatedArticles: []
      });

      const result = await newsService.getArticleById('nonexistent');

      expect(result.article).toBeNull();
      expect(result.relatedArticles).toEqual([]);
    });

    test('should handle missing relatedArticles property', async () => {
      mockFetcher.mockResolvedValue({
        article: { title: 'Test Article' }
      });

      const result = await newsService.getArticleById('1');

      expect(result.relatedArticles).toEqual([]);
    });
  });

  describe('getFilterOptions', () => {
    test('should fetch and return filter options', async () => {
      const mockFilters = {
        categories: ['Tech', 'Sports', 'Politics'],
        sources: ['BBC', 'CNN', 'Reuters'],
        authors: ['John Doe', 'Jane Smith']
      };

      mockFetcher.mockResolvedValue({ filters: mockFilters });

      const result = await newsService.getFilterOptions();

      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/filter-options');
      expect(result).toEqual(mockFilters);
    });

    test('should handle empty filter options', async () => {
      const mockFilters = {
        categories: [],
        sources: [],
        authors: []
      };

      mockFetcher.mockResolvedValue({ filters: mockFilters });

      const result = await newsService.getFilterOptions();

      expect(result).toEqual(mockFilters);
    });
  });

  describe('service instance', () => {
    test('should be defined and have all methods', () => {
      expect(newsService).toBeDefined();
      expect(typeof newsService.getArticles).toBe('function');
      expect(typeof newsService.getArticleById).toBe('function');
      expect(typeof newsService.getFilterOptions).toBe('function');
    });
  });

  describe('error handling', () => {
    test('should propagate errors from fetcher', async () => {
      const error = new Error('Network error');
      mockFetcher.mockRejectedValue(error);

      await expect(newsService.getArticles()).rejects.toThrow('Network error');
    });
  });
});
