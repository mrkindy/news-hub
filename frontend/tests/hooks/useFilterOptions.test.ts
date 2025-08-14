import { 
  useFilterOptions, 
  useSearchFilterOptions, 
  useCategories, 
  useSources, 
  useAuthors 
} from '../../src/hooks/useFilterOptions';

// Mock the filterOptionsService
jest.mock('../../src/services/filterOptionsService', () => ({
  filterOptionsService: {
    getFilterOptions: jest.fn(),
    searchFilterOptions: jest.fn(),
    getCategories: jest.fn(),
    getSources: jest.fn(),
    getAuthors: jest.fn(),
  }
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useCallback: jest.fn(),
}));

describe('useFilterOptions hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCategories', () => {
    it('should be defined and be a function', () => {
      expect(useCategories).toBeDefined();
      expect(typeof useCategories).toBe('function');
    });
  });

  describe('useSources', () => {
    it('should be defined and be a function', () => {
      expect(useSources).toBeDefined();
      expect(typeof useSources).toBe('function');
    });
  });

  describe('useAuthors', () => {
    it('should be defined and be a function', () => {
      expect(useAuthors).toBeDefined();
      expect(typeof useAuthors).toBe('function');
    });
  });

  describe('useFilterOptions', () => {
    it('should be defined and be a function', () => {
      expect(useFilterOptions).toBeDefined();
      expect(typeof useFilterOptions).toBe('function');
    });
  });

  describe('useSearchFilterOptions', () => {
    it('should be defined and be a function', () => {
      expect(useSearchFilterOptions).toBeDefined();
      expect(typeof useSearchFilterOptions).toBe('function');
    });
  });
});
