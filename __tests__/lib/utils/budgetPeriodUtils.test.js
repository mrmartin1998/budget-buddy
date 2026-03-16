import { describe, it, expect } from 'vitest';
import {
  BUDGET_PERIODS,
  getStartDateForPeriod,
  getEndDateForPeriod,
  formatPeriodLabel,
} from '@/lib/utils/budgetPeriodUtils';

describe('Budget Period Utilities', () => {
  describe('BUDGET_PERIODS constants', () => {
    it('should have all required period types', () => {
      expect(BUDGET_PERIODS.DAILY).toBe('daily');
      expect(BUDGET_PERIODS.WEEKLY).toBe('weekly');
      expect(BUDGET_PERIODS.MONTHLY).toBe('monthly');
      expect(BUDGET_PERIODS.YEARLY).toBe('yearly');
    });
  });

  describe('getStartDateForPeriod', () => {
    const testDate = new Date('2026-03-15T15:30:00'); // Saturday, March 15, 2026

    it('should return start of day for daily period', () => {
      const result = getStartDateForPeriod(BUDGET_PERIODS.DAILY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should return start of week (Sunday) for weekly period', () => {
      const result = getStartDateForPeriod(BUDGET_PERIODS.WEEKLY, testDate);
      
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(15); // Week starts on March 15
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return start of month for monthly period', () => {
      const result = getStartDateForPeriod(BUDGET_PERIODS.MONTHLY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should return start of year for yearly period', () => {
      const result = getStartDateForPeriod(BUDGET_PERIODS.YEARLY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('should use current date when no date provided', () => {
      const result = getStartDateForPeriod(BUDGET_PERIODS.DAILY);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe('getEndDateForPeriod', () => {
    const testDate = new Date('2026-03-15T10:30:00'); // Saturday, March 15, 2026

    it('should return end of day for daily period', () => {
      const result = getEndDateForPeriod(BUDGET_PERIODS.DAILY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should return end of week (Saturday) for weekly period', () => {
      const result = getEndDateForPeriod(BUDGET_PERIODS.WEEKLY, testDate);
      
      expect(result.getDay()).toBe(6); // Saturday
      expect(result.getDate()).toBe(21); // Week ends on March 21
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it('should return end of month for monthly period', () => {
      const result = getEndDateForPeriod(BUDGET_PERIODS.MONTHLY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(31); // March has 31 days
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it('should return end of year for yearly period', () => {
      const result = getEndDateForPeriod(BUDGET_PERIODS.YEARLY, testDate);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it('should handle February correctly for monthly period', () => {
      const febDate = new Date('2026-02-15T10:00:00');
      const result = getEndDateForPeriod(BUDGET_PERIODS.MONTHLY, febDate);
      
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(28); // 2026 is not a leap year
    });
  });

  describe('formatPeriodLabel', () => {
    it('should format period labels correctly', () => {
      expect(formatPeriodLabel(BUDGET_PERIODS.DAILY)).toBe('per day');
      expect(formatPeriodLabel(BUDGET_PERIODS.WEEKLY)).toBe('per week');
      expect(formatPeriodLabel(BUDGET_PERIODS.MONTHLY)).toBe('per month');
      expect(formatPeriodLabel(BUDGET_PERIODS.YEARLY)).toBe('per year');
    });

    it('should handle unknown period gracefully', () => {
      const result = formatPeriodLabel('unknown');
      expect(result).toBeDefined();
    });
  });
});
