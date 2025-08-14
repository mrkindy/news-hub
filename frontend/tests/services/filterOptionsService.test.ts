import { filterOptionsService } from '../../src/services/filterOptionsService';
import { fetcher } from '../../src/utils/endpoints';
import { SearchFilterRequest } from '../../src/types/filter-options';

// Mock the fetcher
jest.mock('../../src/utils/endpoints', () => ({
  API_ENDPOINTS: {
    FILTER_OPTIONS: '/api/filter-options',
    SEARCH_FILTER: '/api/search-filter',
    CATEGORIES: '/api/v1/categories',
    SOURCES: '/api/v1/sources',
    AUTHORS: '/api/v1/authors',
  },
  fetcher: jest.fn(),
}));

const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('FilterOptionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'Technology', slug: 'technology', description: 'Technology related news' },
          { id: '2', name: 'Politics', slug: 'politics', description: 'Political news' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getCategories();

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/categories', 'GET');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch categories with search query', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'Technology', slug: 'technology', description: 'Technology related news' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getCategories('tech');

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/categories?q=tech', 'GET');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSources', () => {
    it('should fetch sources successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'BBC News', slug: 'bbc-news', url: 'https://www.bbc.com/news' },
          { id: '2', name: 'CNN', slug: 'cnn', url: 'https://www.cnn.com' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getSources();

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/sources', 'GET');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch sources with search query', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'BBC News', slug: 'bbc-news', url: 'https://www.bbc.com/news' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getSources('bbc');

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/sources?q=bbc', 'GET');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAuthors', () => {
    it('should fetch authors successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'John Smith', slug: 'john-smith', bio: 'Technology journalist' },
          { id: '2', name: 'Jane Doe', slug: 'jane-doe', bio: 'Political correspondent' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getAuthors();

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/authors', 'GET');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch authors with search query', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [
          { id: '1', name: 'John Smith', slug: 'john-smith', bio: 'Technology journalist' },
        ]
      };
      mockFetcher.mockResolvedValue(mockResponse);

      // Act
      const result = await filterOptionsService.getAuthors('john');

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/authors?q=john', 'GET');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getFilterOptions', () => {
    it('should fetch filter options successfully', async () => {
      // Arrange
      const mockCategoriesResponse = {
        success: true,
        data: {
          categories: [
            { id: '1', name: 'Politics', slug: 'politics', count: 15 },
            { id: '2', name: 'Technology', slug: 'technology', count: 30 },
          ]
        }
      };
      
      const mockSourcesResponse = {
        success: true,
        data: {
          sources: [
            { id: '1', name: 'BBC News', slug: 'bbc-news', count: 25 },
            { id: '2', name: 'CNN', slug: 'cnn', count: 20 },
          ]
        }
      };
      
      const mockAuthorsResponse = {
        success: true,
        data: {
          authors: [
            { id: '1', name: 'John Smith', slug: 'john-smith', count: 10 },
            { id: '2', name: 'Jane Doe', slug: 'jane-doe', count: 12 },
          ]
        }
      };

      mockFetcher
        .mockResolvedValueOnce(mockCategoriesResponse)
        .mockResolvedValueOnce(mockSourcesResponse)
        .mockResolvedValueOnce(mockAuthorsResponse);

      // Act
      const result = await filterOptionsService.getFilterOptions();

      // Assert
      expect(mockFetcher).toHaveBeenCalledTimes(3);
      expect(mockFetcher).toHaveBeenNthCalledWith(1, '/api/v1/categories', 'GET');
      expect(mockFetcher).toHaveBeenNthCalledWith(2, '/api/v1/sources', 'GET');
      expect(mockFetcher).toHaveBeenNthCalledWith(3, '/api/v1/authors', 'GET');
      
      expect(result).toEqual({
        success: true,
        data: {
          categories: mockCategoriesResponse.data.categories,
          sources: mockSourcesResponse.data.sources,
          authors: mockAuthorsResponse.data.authors,
        }
      });
    });

    it('should handle errors when fetching filter options', async () => {
      // Arrange
      mockFetcher.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(filterOptionsService.getFilterOptions()).rejects.toThrow('Network error');
    });
  });

  describe('searchFilterOptions', () => {
    it('should search categories successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          categories: [
            { id: '1', name: 'Technology', slug: 'technology', description: 'Technology related news' },
          ]
        }
      };
      mockFetcher.mockResolvedValue(mockResponse);

      const request: SearchFilterRequest = {
        type: 'categories',
        query: 'tech',
        limit: 10
      };

      // Act
      const result = await filterOptionsService.searchFilterOptions(request);

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/categories?q=tech', 'GET');
      expect(result).toEqual({
        success: true,
        data: mockResponse.data.categories
      });
    });

    it('should search sources successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          sources: [
            { id: '1', name: 'BBC News', slug: 'bbc-news', url: 'https://www.bbc.com/news' },
          ]
        }
      };
      mockFetcher.mockResolvedValue(mockResponse);

      const request: SearchFilterRequest = {
        type: 'sources',
        query: 'bbc',
        limit: 10
      };

      // Act
      const result = await filterOptionsService.searchFilterOptions(request);

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/sources?q=bbc', 'GET');
      expect(result).toEqual({
        success: true,
        data: mockResponse.data.sources
      });
    });

    it('should search authors successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          authors: [
            { id: '1', name: 'John Smith', slug: 'john-smith', bio: 'Technology journalist' },
          ]
        }
      };
      mockFetcher.mockResolvedValue(mockResponse);

      const request: SearchFilterRequest = {
        type: 'authors',
        query: 'john',
        limit: 10
      };

      // Act
      const result = await filterOptionsService.searchFilterOptions(request);

      // Assert
      expect(mockFetcher).toHaveBeenCalledWith('/api/v1/authors?q=john', 'GET');
      expect(result).toEqual({
        success: true,
        data: mockResponse.data.authors
      });
    });

    it('should throw error for unknown filter type', async () => {
      // Arrange
      const request = {
        type: 'unknown' as 'categories' | 'sources' | 'authors',
        query: 'test',
        limit: 10
      };

      // Act & Assert
      await expect(filterOptionsService.searchFilterOptions(request)).rejects.toThrow('Unknown filter type: unknown');
    });
  });
});
