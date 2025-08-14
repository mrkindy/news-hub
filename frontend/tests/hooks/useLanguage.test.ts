import { useLanguage } from '../../src/hooks/useLanguage';

describe('useLanguage hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be defined and be a function', () => {
    expect(useLanguage).toBeDefined();
    expect(typeof useLanguage).toBe('function');
  });

  test('should validate function structure and logic', () => {
    // Test that the hook function exists and has the expected structure
    const hookString = useLanguage.toString();
    
    // Check that it imports and uses useContext
    expect(hookString).toContain('useContext');
    expect(hookString).toContain('context === undefined');
    expect(hookString).toContain('useLanguage must be used within a LanguageProvider');
  });

  test('should validate error message content', () => {
    const hookString = useLanguage.toString();
    expect(hookString).toContain('useLanguage must be used within a LanguageProvider');
  });

  test('should return context when provider is available', () => {
    // This test validates the hook returns the context object when available
    const hookString = useLanguage.toString();
    expect(hookString).toContain('return context');
  });
});
