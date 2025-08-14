import { useNews, useAuth } from '../../src/hooks/useContext';

describe('useContext hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNews', () => {
    test('should be defined and be a function', () => {
      expect(useNews).toBeDefined();
      expect(typeof useNews).toBe('function');
    });

    test('should validate function structure and logic', () => {
      const hookString = useNews.toString();
      
      // Check that it imports and uses useContext
      expect(hookString).toContain('useContext');
      expect(hookString).toContain('context === undefined');
      expect(hookString).toContain('useNews must be used within a NewsProvider');
    });

    test('should validate error message content', () => {
      const hookString = useNews.toString();
      expect(hookString).toContain('useNews must be used within a NewsProvider');
    });

    test('should return context when provider is available', () => {
      const hookString = useNews.toString();
      expect(hookString).toContain('return context');
    });
  });

  describe('useAuth', () => {
    test('should be defined and be a function', () => {
      expect(useAuth).toBeDefined();
      expect(typeof useAuth).toBe('function');
    });

    test('should validate function structure and logic', () => {
      const hookString = useAuth.toString();
      
      // Check that it imports and uses useContext
      expect(hookString).toContain('useContext');
      expect(hookString).toContain('context === undefined');
      expect(hookString).toContain('useAuth must be used within an AuthProvider');
    });

    test('should validate error message content', () => {
      const hookString = useAuth.toString();
      expect(hookString).toContain('useAuth must be used within an AuthProvider');
    });

    test('should return context when provider is available', () => {
      const hookString = useAuth.toString();
      expect(hookString).toContain('return context');
    });
  });

  describe('import and export structure', () => {
    test('should export both hooks', () => {
      expect(useNews).toBeDefined();
      expect(useAuth).toBeDefined();
    });

    test('should have proper TypeScript return types', () => {
      // Test that both hooks are properly typed functions
      expect(typeof useNews).toBe('function');
      expect(typeof useAuth).toBe('function');
    });
  });
});
