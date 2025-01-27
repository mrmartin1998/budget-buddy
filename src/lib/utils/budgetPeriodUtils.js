export const BUDGET_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export function getStartDateForPeriod(period, date = new Date()) {
  const currentDate = new Date(date);
  
  switch (period) {
    case BUDGET_PERIODS.DAILY:
      currentDate.setHours(0, 0, 0, 0);
      return currentDate;
      
    case BUDGET_PERIODS.WEEKLY:
      currentDate.setDate(currentDate.getDate() - currentDate.getDay());
      currentDate.setHours(0, 0, 0, 0);
      return currentDate;
      
    case BUDGET_PERIODS.MONTHLY:
      currentDate.setDate(1);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate;
      
    case BUDGET_PERIODS.YEARLY:
      currentDate.setMonth(0, 1);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate;
      
    default:
      return currentDate;
  }
}

export function getEndDateForPeriod(period, date = new Date()) {
  const currentDate = new Date(date);
  
  switch (period) {
    case BUDGET_PERIODS.DAILY:
      currentDate.setHours(23, 59, 59, 999);
      return currentDate;
      
    case BUDGET_PERIODS.WEEKLY:
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6);
      currentDate.setHours(23, 59, 59, 999);
      return currentDate;
      
    case BUDGET_PERIODS.MONTHLY:
      currentDate.setMonth(currentDate.getMonth() + 1, 0);
      currentDate.setHours(23, 59, 59, 999);
      return currentDate;
      
    case BUDGET_PERIODS.YEARLY:
      currentDate.setMonth(11, 31);
      currentDate.setHours(23, 59, 59, 999);
      return currentDate;
      
    default:
      return currentDate;
  }
}

export function formatPeriodLabel(period) {
  switch (period) {
    case BUDGET_PERIODS.DAILY:
      return 'per day';
    case BUDGET_PERIODS.WEEKLY:
      return 'per week';
    case BUDGET_PERIODS.MONTHLY:
      return 'per month';
    case BUDGET_PERIODS.YEARLY:
      return 'per year';
    default:
      return '';
  }
} 