import { z } from 'zod';

/**
 * Validation schemas for API request validation
 * Uses Zod for runtime type checking and data validation
 */

// ============================================
// TRANSACTION SCHEMAS
// ============================================

export const transactionSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number"
  })
    .positive("Amount must be positive")
    .max(10000000, "Amount exceeds maximum allowed value")
    .finite("Amount must be a finite number"),
  
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" })
  }),
  
  category: z.string({
    required_error: "Category is required"
  })
    .min(1, "Category cannot be empty")
    .max(50, "Category name too long (max 50 characters)")
    .trim(),
  
  description: z.string()
    .max(500, "Description too long (max 500 characters)")
    .trim()
    .optional(),
  
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format"
  })
    .max(new Date(), "Date cannot be in the future"),
  
  accountId: z.string({
    required_error: "Account ID is required"
  })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid account ID format")
});

// For updating transactions (all fields optional except what's provided)
export const transactionUpdateSchema = transactionSchema.partial();

// ============================================
// ACCOUNT SCHEMAS
// ============================================

const ACCOUNT_TYPES = [
  'cash',
  'bank',
  'credit',
  'savings',
  'investment',
  'crypto',
  'loan',
  'other'
];

export const accountSchema = z.object({
  name: z.string({
    required_error: "Account name is required"
  })
    .min(1, "Account name cannot be empty")
    .max(50, "Account name too long (max 50 characters)")
    .trim(),
  
  type: z.enum(ACCOUNT_TYPES, {
    errorMap: () => ({ 
      message: `Account type must be one of: ${ACCOUNT_TYPES.join(', ')}` 
    })
  }),
  
  balance: z.number({
    invalid_type_error: "Balance must be a number"
  })
    .finite("Balance must be a finite number")
    .default(0),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g., #3B82F6)")
    .optional()
    .default('#3B82F6')
});

export const accountUpdateSchema = z.object({
  name: z.string()
    .min(1, "Account name cannot be empty")
    .max(50, "Account name too long")
    .trim()
    .optional(),
  
  type: z.enum(ACCOUNT_TYPES)
    .optional(),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
    .optional()
});

// ============================================
// BUDGET SCHEMAS
// ============================================

const BUDGET_PERIODS = ['daily', 'weekly', 'monthly', 'yearly'];

export const budgetSchema = z.object({
  category: z.string({
    required_error: "Category is required"
  })
    .min(1, "Category cannot be empty")
    .max(50, "Category name too long")
    .trim(),
  
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" })
  })
    .default('expense'),
  
  limit: z.number({
    required_error: "Budget limit is required",
    invalid_type_error: "Limit must be a number"
  })
    .positive("Budget limit must be positive")
    .max(100000000, "Budget limit exceeds maximum")
    .finite("Budget limit must be a finite number"),
  
  period: z.enum(BUDGET_PERIODS, {
    errorMap: () => ({ 
      message: `Budget period must be one of: ${BUDGET_PERIODS.join(', ')}` 
    })
  })
    .default('monthly')
});

export const budgetUpdateSchema = budgetSchema.partial();

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  name: z.string({
    required_error: "Category name is required"
  })
    .min(1, "Category name cannot be empty")
    .max(50, "Category name too long")
    .trim(),
  
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" })
  }),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color")
    .optional()
    .default('#4B5563'),
  
  icon: z.string()
    .max(50, "Icon name too long")
    .optional()
});

// ============================================
// AUTH SCHEMAS
// ============================================

export const registerSchema = z.object({
  email: z.string({
    required_error: "Email is required"
  })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  
  password: z.string({
    required_error: "Password is required"
  })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long (max 100 characters)")
});

export const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required"
  })
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
  
  password: z.string({
    required_error: "Password is required"
  })
    .min(1, "Password is required")
});

// ============================================
// QUERY PARAMETER SCHEMAS
// ============================================

export const dateRangeSchema = z.object({
  start: z.coerce.date({
    invalid_type_error: "Invalid start date"
  }).optional(),
  
  end: z.coerce.date({
    invalid_type_error: "Invalid end date"
  }).optional()
}).refine(
  (data) => {
    if (data.start && data.end) {
      return data.start <= data.end;
    }
    return true;
  },
  {
    message: "Start date must be before or equal to end date"
  }
);

export const paginationSchema = z.object({
  page: z.coerce.number()
    .int("Page must be an integer")
    .positive("Page must be positive")
    .default(1),
  
  limit: z.coerce.number()
    .int("Limit must be an integer")
    .positive("Limit must be positive")
    .max(100, "Limit cannot exceed 100")
    .default(50)
});

// ============================================
// MONGODB OBJECTID VALIDATION
// ============================================

export const objectIdSchema = z.string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const objectIdArraySchema = z.array(objectIdSchema)
  .optional();
