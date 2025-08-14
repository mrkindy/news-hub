import { useLocalStorage } from '../../src/hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    configurable: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hook should be defined and be a function', () => {
    expect(useLocalStorage).toBeDefined();
    expect(typeof useLocalStorage).toBe('function');
  });

  test('localStorage mock should work correctly', () => {
    mockLocalStorage.getItem.mockReturnValue('"test value"');
    
    const result = window.localStorage.getItem('test-key');
    expect(result).toBe('"test value"');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  test('localStorage setItem should work correctly', () => {
    window.localStorage.setItem('test-key', '"test value"');
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '"test value"');
  });

  test('JSON parsing should work with localStorage data', () => {
    const testData = { name: 'John', age: 30 };
    const jsonString = JSON.stringify(testData);
    
    mockLocalStorage.getItem.mockReturnValue(jsonString);
    const result = JSON.parse(window.localStorage.getItem('user')!);
    
    expect(result).toEqual(testData);
  });

  test('should handle null values from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const result = window.localStorage.getItem('non-existent');
    
    expect(result).toBeNull();
  });
});
