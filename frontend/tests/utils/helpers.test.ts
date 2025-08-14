import { formatDate, truncateText, generateId, isValidEmail, debounce } from '../../src/utils/helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format a valid date string correctly', () => {
      const dateString = '2023-12-25T10:30:00Z';
      const result = formatDate(dateString);
      
      // Test that the result contains expected parts (allowing for timezone differences)
      expect(result).toMatch(/December 25, 2023/);
      expect(typeof result).toBe('string');
    });

    it('should handle different date formats', () => {
      const dateString = '2023-01-01T00:00:00Z';
      const result = formatDate(dateString);
      
      expect(result).toMatch(/January 1, 2023/);
    });

    it('should handle invalid date strings gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toMatch(/Invalid Date|NaN/);
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result.length).toBeLessThanOrEqual(maxLength + 3); // +3 for ellipsis
      expect(result.endsWith('...')).toBe(true);
      expect(result).toBe('This is a very long...'); // No space before ... due to trim()
    });

    it('should return original text if shorter than max length', () => {
      const text = 'Short text';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result).toBe(text);
      expect(result.endsWith('...')).toBe(false);
    });

    it('should return original text if equal to max length', () => {
      const text = 'Exactly twenty chars';
      const maxLength = 20;
      const result = truncateText(text, maxLength);
      
      expect(result).toBe(text);
      expect(result.endsWith('...')).toBe(false);
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });

    it('should handle zero max length', () => {
      const result = truncateText('test', 0);
      expect(result).toBe('...');
    });
  });

  describe('generateId', () => {
    it('should generate a string in the correct format', () => {
      const id = generateId();
      
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should generate IDs of consistent length', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1.length).toBe(19); // xxxx-xxxx-xxxx-xxxx = 19 characters
      expect(id2.length).toBe(19);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first_name+last_name@example.org',
        'test-email@example-domain.com',
        // Note: The simple regex allows these
        'test..test@example.com', // Double dots allowed by simple regex
        'test@example.co', // Simple TLD
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test @example.com', // space
        '',
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(99);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls when called multiple times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should work with different delay times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 200);

      debouncedFn();
      jest.advanceTimersByTime(199);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
