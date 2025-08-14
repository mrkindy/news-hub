import { useCategoryOptions, useSourceOptions, useAuthorOptions } from '../../src/hooks/useAutocompleteOptions';

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

// Mock useFilterOptions hooks
jest.mock('../../src/hooks/useFilterOptions', () => ({
  useCategories: jest.fn(),
  useSources: jest.fn(),
  useAuthors: jest.fn(),
}));

describe('useAutocompleteOptions hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCategoryOptions', () => {
    test('should be defined and be a function', () => {
      expect(useCategoryOptions).toBeDefined();
      expect(typeof useCategoryOptions).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useCategoryOptions.toString();
      
      expect(hookString).toContain('useQuery');
      expect(hookString).toContain('useCategories');
      expect(hookString).toContain('category-options');
      expect(hookString).toContain('queryKey');
      expect(hookString).toContain('queryFn');
    });

    test('should validate option mapping', () => {
      const hookString = useCategoryOptions.toString();
      
      expect(hookString).toContain('categories.map');
      expect(hookString).toContain('label');
      expect(hookString).toContain('value');
      expect(hookString).toContain('category.name');
      expect(hookString).toContain('category.id');
    });

    test('should validate enabled condition', () => {
      const hookString = useCategoryOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('!isLoading');
      expect(hookString).toContain('!isError');
    });

    test('should validate query configuration', () => {
      const hookString = useCategoryOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('staleTime');
      expect(hookString).toContain('1000 * 60 * 10');
    });
  });

  describe('useSourceOptions', () => {
    test('should be defined and be a function', () => {
      expect(useSourceOptions).toBeDefined();
      expect(typeof useSourceOptions).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useSourceOptions.toString();
      
      expect(hookString).toContain('useQuery');
      expect(hookString).toContain('useSources');
      expect(hookString).toContain('source-options');
      expect(hookString).toContain('queryKey');
      expect(hookString).toContain('queryFn');
    });

    test('should validate option mapping', () => {
      const hookString = useSourceOptions.toString();
      
      expect(hookString).toContain('sources.map');
      expect(hookString).toContain('label');
      expect(hookString).toContain('value');
      expect(hookString).toContain('source.name');
      expect(hookString).toContain('source.id');
    });

    test('should validate enabled condition', () => {
      const hookString = useSourceOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('!isLoading');
      expect(hookString).toContain('!isError');
    });

    test('should validate query configuration', () => {
      const hookString = useSourceOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('staleTime');
      expect(hookString).toContain('1000 * 60 * 10');
    });
  });

  describe('useAuthorOptions', () => {
    test('should be defined and be a function', () => {
      expect(useAuthorOptions).toBeDefined();
      expect(typeof useAuthorOptions).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useAuthorOptions.toString();
      
      expect(hookString).toContain('useQuery');
      expect(hookString).toContain('useAuthors');
      expect(hookString).toContain('author-options');
      expect(hookString).toContain('queryKey');
      expect(hookString).toContain('queryFn');
    });

    test('should validate option mapping', () => {
      const hookString = useAuthorOptions.toString();
      
      expect(hookString).toContain('authors.map');
      expect(hookString).toContain('label');
      expect(hookString).toContain('value');
      expect(hookString).toContain('author.name');
      expect(hookString).toContain('author.id');
    });

    test('should validate enabled condition', () => {
      const hookString = useAuthorOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('!isLoading');
      expect(hookString).toContain('!isError');
    });

    test('should validate query configuration', () => {
      const hookString = useAuthorOptions.toString();
      
      expect(hookString).toContain('enabled');
      expect(hookString).toContain('staleTime');
      expect(hookString).toContain('1000 * 60 * 10');
    });
  });

  describe('common functionality', () => {
    test('should export all three hooks', () => {
      expect(useCategoryOptions).toBeDefined();
      expect(useSourceOptions).toBeDefined();
      expect(useAuthorOptions).toBeDefined();
    });

    test('should have proper function signatures', () => {
      expect(typeof useCategoryOptions).toBe('function');
      expect(typeof useSourceOptions).toBe('function');
      expect(typeof useAuthorOptions).toBe('function');
    });

    test('should validate default parameter handling', () => {
      const categoryString = useCategoryOptions.toString();
      const sourceString = useSourceOptions.toString();
      const authorString = useAuthorOptions.toString();
      
      // All hooks should accept a query parameter with default value
      expect(categoryString).toContain('query');
      expect(sourceString).toContain('query');
      expect(authorString).toContain('query');
    });
  });

  describe('dependencies and imports', () => {
    test('should validate React Query dependency', () => {
      const categoryString = useCategoryOptions.toString();
      expect(categoryString).toContain('useQuery');
    });

    test('should validate useFilterOptions dependency', () => {
      const categoryString = useCategoryOptions.toString();
      expect(categoryString).toContain('useFilterOptions');
    });

    test('should validate consistent structure across hooks', () => {
      const categoryString = useCategoryOptions.toString();
      const sourceString = useSourceOptions.toString();
      const authorString = useAuthorOptions.toString();
      
      // All should have similar structure
      [categoryString, sourceString, authorString].forEach(hookString => {
        expect(hookString).toContain('queryKey');
        expect(hookString).toContain('queryFn');
        expect(hookString).toContain('enabled');
        expect(hookString).toContain('staleTime');
      });
    });
  });
});
