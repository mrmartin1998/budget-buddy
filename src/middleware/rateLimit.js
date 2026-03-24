import { NextResponse } from 'next/server';

// In-memory store for rate limiting
// Note: In production with multiple serverless instances, use Redis/Upstash
const rateLimitStore = new Map();

/**
 * Clean up old entries from the rate limit store
 * Runs periodically to prevent memory leaks
 */
function cleanupStore() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupStore, 5 * 60 * 1000);

/**
 * Rate limiting middleware for Next.js API routes
 * 
 * @param {Request} request - The incoming request
 * @param {Object} options - Rate limit configuration
 * @param {number} options.limit - Maximum number of requests
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {string} options.message - Error message when limit exceeded
 * @returns {Object} - { success: boolean, error?: NextResponse }
 */
export function rateLimit(request, options = {}) {
  const {
    limit = 100,
    windowMs = 15 * 60 * 1000, // 15 minutes default
    message = 'Too many requests, please try again later.'
  } = options;

  // Get identifier (IP address or use a fallback)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown';

  // Create unique key for this IP and endpoint
  const url = new URL(request.url);
  const key = `${ip}:${url.pathname}`;

  const now = Date.now();
  const resetTime = now + windowMs;

  // Get or create rate limit data for this key
  let data = rateLimitStore.get(key);

  if (!data || now > data.resetTime) {
    // First request or window has reset
    data = {
      count: 1,
      resetTime
    };
    rateLimitStore.set(key, data);
    return { success: true };
  }

  // Increment request count
  data.count++;

  // Check if limit exceeded
  if (data.count > limit) {
    const retryAfter = Math.ceil((data.resetTime - now) / 1000);
    
    return {
      success: false,
      error: NextResponse.json(
        { 
          error: message,
          retryAfter: `${retryAfter} seconds`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': data.resetTime.toString()
          }
        }
      )
    };
  }

  // Update the store
  rateLimitStore.set(key, data);

  return { 
    success: true,
    remaining: limit - data.count 
  };
}

/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes
 */
export function authRateLimit(request) {
  return rateLimit(request, {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.'
  });
}

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export function apiRateLimit(request) {
  return rateLimit(request, {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP. Please try again later.'
  });
}
