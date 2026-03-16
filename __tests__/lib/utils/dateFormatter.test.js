import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/utils/dateFormatter';

describe('Date Formatter Utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-03-15T10:30:00');
      const result = formatDate(date);
      
      expect(result).toBe('Mar 15, 2026');
    });

    it('should handle string date input', () => {
      const result = formatDate('2026-01-01T00:00:00');
      
      expect(result).toBe('Jan 1, 2026');
    });

    it('should handle timestamp input', () => {
      const timestamp = new Date('2026-12-25T15:30:00').getTime();
      const result = formatDate(timestamp);
      
      expect(result).toBe('Dec 25, 2026');
    });

    it('should handle different months', () => {
      const dates = [
        { input: '2026-01-15', expected: 'Jan 15, 2026' },
        { input: '2026-02-15', expected: 'Feb 15, 2026' },
        { input: '2026-06-15', expected: 'Jun 15, 2026' },
        { input: '2026-12-15', expected: 'Dec 15, 2026' },
      ];

      dates.forEach(({ input, expected }) => {
        expect(formatDate(input)).toBe(expected);
      });
    });

    it('should handle leap year dates', () => {
      const leapYearDate = '2024-02-29T00:00:00';
      const result = formatDate(leapYearDate);
      
      expect(result).toBe('Feb 29, 2024');
    });
  });
});
