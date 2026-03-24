import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Validation middleware helpers for API routes
 */

/**
 * Validates request body against a Zod schema
 * @param {Object} body - Request body to validate
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Object} - { success: boolean, data?: any, error?: NextResponse }
 */
export function validateRequestBody(body, schema) {
  try {
    const validated = schema.parse(body);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      };
    }
    
    // Unexpected error
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    };
  }
}

/**
 * Validates query parameters against a Zod schema
 * @param {URLSearchParams} searchParams - URL search params
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Object} - { success: boolean, data?: any, error?: NextResponse }
 */
export function validateQueryParams(searchParams, schema) {
  try {
    // Convert URLSearchParams to plain object
    const params = Object.fromEntries(searchParams.entries());
    
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      };
    }
    
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    };
  }
}

/**
 * Validates a MongoDB ObjectId
 * @param {string} id - ID to validate
 * @param {string} fieldName - Name of field for error message
 * @returns {Object} - { success: boolean, error?: NextResponse }
 */
export function validateObjectId(id, fieldName = 'ID') {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!id || !objectIdRegex.test(id)) {
    return {
      success: false,
      error: NextResponse.json(
        { error: `Invalid ${fieldName} format` },
        { status: 400 }
      )
    };
  }
  
  return { success: true };
}
