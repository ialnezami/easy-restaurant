import { describe, it, expect } from 'vitest';
import { generateSlug, formatPrice } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('generateSlug', () => {
    it('should convert text to lowercase slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Menu #1!')).toBe('menu-1');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('should handle underscores and hyphens', () => {
      expect(generateSlug('test_underscore-hyphen')).toBe('test-underscore-hyphen');
    });

    it('should trim leading and trailing spaces', () => {
      expect(generateSlug('  trimmed  ')).toBe('trimmed');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('formatPrice', () => {
    it('should format price as USD currency', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1000)).toBe('$1,000.00');
    });

    it('should handle decimal prices', () => {
      expect(formatPrice(9.99)).toBe('$9.99');
    });
  });
});

