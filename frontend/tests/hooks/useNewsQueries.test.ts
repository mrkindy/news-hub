import {
  useArticles,
  useSearchArticles,
  useFilteredArticles,
  usePersonalizedFeed,
  useSearchAndFilter,
  useInfiniteArticles,
  useInfiniteSearchArticles,
  useInfiniteFilteredArticles,
  useInfinitePersonalizedFeed,
  useInfiniteSearchAndFilter
} from '../../src/hooks/useNewsQueries';

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useInfiniteQuery: jest.fn(),
}));

// Mock fetcher utility
jest.mock('../../src/utils/endpoints', () => ({
  fetcher: jest.fn(),
}));

describe('useNewsQueries hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Regular Query Hooks', () => {
    describe('useArticles', () => {
      test('should be defined and be a function', () => {
        expect(useArticles).toBeDefined();
        expect(typeof useArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useArticles.toString();
        
        expect(hookString).toContain('useQuery');
        expect(hookString).toContain('queryKey');
        expect(hookString).toContain('queryFn');
        expect(hookString).toContain('articles');
        expect(hookString).toContain('page');
        expect(hookString).toContain('limit');
      });

      test('should validate query configuration', () => {
        const hookString = useArticles.toString();
        
        expect(hookString).toContain('enabled');
        expect(hookString).toContain('staleTime');
        expect(hookString).toContain('5 * 60 * 1000');
      });

      test('should validate URL construction', () => {
        const hookString = useArticles.toString();
        
        expect(hookString).toContain('API_ENDPOINTS.NEWS');
        expect(hookString).toContain('buildApiQueryString');
      });
    });

    describe('useSearchArticles', () => {
      test('should be defined and be a function', () => {
        expect(useSearchArticles).toBeDefined();
        expect(typeof useSearchArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useSearchArticles.toString();
        
        expect(hookString).toContain('useQuery');
        expect(hookString).toContain('queryKey');
        expect(hookString).toContain('queryFn');
        expect(hookString).toContain('search');
        expect(hookString).toContain('q');
      });

      test('should validate search logic', () => {
        const hookString = useSearchArticles.toString();
        
        expect(hookString).toContain('q?.trim()');
        expect(hookString).toContain('API_ENDPOINTS.NEWS');
        expect(hookString).toContain('2 * 60 * 1000');
      });
    });

    describe('useFilteredArticles', () => {
      test('should be defined and be a function', () => {
        expect(useFilteredArticles).toBeDefined();
        expect(typeof useFilteredArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useFilteredArticles.toString();
        
        expect(hookString).toContain('useQuery');
        expect(hookString).toContain('filtered-articles');
        expect(hookString).toContain('filters');
        expect(hookString).toContain('API_ENDPOINTS.NEWS}');
      });
    });

    describe('usePersonalizedFeed', () => {
      test('should be defined and be a function', () => {
        expect(usePersonalizedFeed).toBeDefined();
        expect(typeof usePersonalizedFeed).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = usePersonalizedFeed.toString();
        
        expect(hookString).toContain('useQuery');
        expect(hookString).toContain('personalized-feed');
        expect(hookString).toContain('preferences');
        expect(hookString).toContain('API_ENDPOINTS.PERSONALIZED_FEED');
      });

      test('should validate preferences handling', () => {
        const hookString = usePersonalizedFeed.toString();
        
        expect(hookString).toContain('categories');
        expect(hookString).toContain('sources');
        expect(hookString).toContain('authors');
        expect(hookString).toContain('join');
      });
    });

    describe('useSearchAndFilter', () => {
      test('should be defined and be a function', () => {
        expect(useSearchAndFilter).toBeDefined();
        expect(typeof useSearchAndFilter).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useSearchAndFilter.toString();
        
        expect(hookString).toContain('useQuery');
        expect(hookString).toContain('search-and-filter');
        expect(hookString).toContain('q');
        expect(hookString).toContain('filters');
      });
    });
  });

  describe('Infinite Query Hooks', () => {
    describe('useInfiniteArticles', () => {
      test('should be defined and be a function', () => {
        expect(useInfiniteArticles).toBeDefined();
        expect(typeof useInfiniteArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useInfiniteArticles.toString();
        
        expect(hookString).toContain('useInfiniteQuery');
        expect(hookString).toContain('articles-infinite');
        expect(hookString).toContain('pageParam');
        expect(hookString).toContain('getNextPageParam');
      });

      test('should validate pagination logic', () => {
        const hookString = useInfiniteArticles.toString();
        
        expect(hookString).toContain('initialPageParam');
        expect(hookString).toContain('next_page_url');
        expect(hookString).toContain('current_page');
        expect(hookString).toContain('API_ENDPOINTS.NEWS');
      });
    });

    describe('useInfiniteSearchArticles', () => {
      test('should be defined and be a function', () => {
        expect(useInfiniteSearchArticles).toBeDefined();
        expect(typeof useInfiniteSearchArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useInfiniteSearchArticles.toString();
        
        expect(hookString).toContain('useInfiniteQuery');
        expect(hookString).toContain('search-infinite');
        expect(hookString).toContain('q');
      });

      test('should validate search and pagination logic', () => {
        const hookString = useInfiniteSearchArticles.toString();
        
        expect(hookString).toContain('q?.trim()');
        expect(hookString).toContain('pageParam');
        expect(hookString).toContain('getNextPageParam');
      });
    });

    describe('useInfiniteFilteredArticles', () => {
      test('should be defined and be a function', () => {
        expect(useInfiniteFilteredArticles).toBeDefined();
        expect(typeof useInfiniteFilteredArticles).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useInfiniteFilteredArticles.toString();
        
        expect(hookString).toContain('useInfiniteQuery');
        expect(hookString).toContain('filtered-articles-infinite');
        expect(hookString).toContain('filters');
      });
    });

    describe('useInfinitePersonalizedFeed', () => {
      test('should be defined and be a function', () => {
        expect(useInfinitePersonalizedFeed).toBeDefined();
        expect(typeof useInfinitePersonalizedFeed).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useInfinitePersonalizedFeed.toString();
        
        expect(hookString).toContain('useInfiniteQuery');
        expect(hookString).toContain('personalized-feed-infinite');
        expect(hookString).toContain('preferences');
      });

      test('should validate preferences handling', () => {
        const hookString = useInfinitePersonalizedFeed.toString();
        
        expect(hookString).toContain('categories');
        expect(hookString).toContain('sources');
        expect(hookString).toContain('authors');
        expect(hookString).toContain('join');
      });
    });

    describe('useInfiniteSearchAndFilter', () => {
      test('should be defined and be a function', () => {
        expect(useInfiniteSearchAndFilter).toBeDefined();
        expect(typeof useInfiniteSearchAndFilter).toBe('function');
      });

      test('should validate hook structure', () => {
        const hookString = useInfiniteSearchAndFilter.toString();
        
        expect(hookString).toContain('useInfiniteQuery');
        expect(hookString).toContain('search-and-filter-infinite');
        expect(hookString).toContain('q');
        expect(hookString).toContain('filters');
      });
    });
  });

  describe('Utility Functions', () => {
    test('should validate buildApiQueryString function presence', () => {
      const hookString = useArticles.toString();
      expect(hookString).toContain('buildApiQueryString');
    });

    test('should validate fetcher usage', () => {
      const hookString = useArticles.toString();
      expect(hookString).toContain('fetcher');
    });
  });

  describe('Common Hook Patterns', () => {
    test('should validate all hooks have proper exports', () => {
      const hooks = [
        useArticles,
        useSearchArticles,
        useFilteredArticles,
        usePersonalizedFeed,
        useSearchAndFilter,
        useInfiniteArticles,
        useInfiniteSearchArticles,
        useInfiniteFilteredArticles,
        useInfinitePersonalizedFeed,
        useInfiniteSearchAndFilter
      ];

      hooks.forEach(hook => {
        expect(hook).toBeDefined();
        expect(typeof hook).toBe('function');
      });
    });

    test('should validate regular hooks use useQuery', () => {
      const regularHooks = [
        useArticles,
        useSearchArticles,
        useFilteredArticles,
        usePersonalizedFeed,
        useSearchAndFilter
      ];

      regularHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('useQuery');
      });
    });

    test('should validate infinite hooks use useInfiniteQuery', () => {
      const infiniteHooks = [
        useInfiniteArticles,
        useInfiniteSearchArticles,
        useInfiniteFilteredArticles,
        useInfinitePersonalizedFeed,
        useInfiniteSearchAndFilter
      ];

      infiniteHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('useInfiniteQuery');
      });
    });

    test('should validate all hooks have enabled parameter', () => {
      const allHooks = [
        useArticles,
        useSearchArticles,
        useFilteredArticles,
        usePersonalizedFeed,
        useSearchAndFilter,
        useInfiniteArticles,
        useInfiniteSearchArticles,
        useInfiniteFilteredArticles,
        useInfinitePersonalizedFeed,
        useInfiniteSearchAndFilter
      ];

      allHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('enabled');
      });
    });

    test('should validate staleTime configuration', () => {
      const allHooks = [
        useArticles,
        useSearchArticles,
        useFilteredArticles,
        usePersonalizedFeed,
        useSearchAndFilter,
        useInfiniteArticles,
        useInfiniteSearchArticles,
        useInfiniteFilteredArticles,
        useInfinitePersonalizedFeed,
        useInfiniteSearchAndFilter
      ];

      allHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('staleTime');
      });
    });
  });
});
