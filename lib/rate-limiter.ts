/**
 * Rate Limiting Middleware
 * Simple in-memory rate limiter (for small projects)
 * For production, use Upstash Redis
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple rate limiter
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (entry.count < limit) {
    entry.count++;
    return {
      success: true,
      remaining: limit - entry.count,
      reset: entry.resetTime,
    };
  }

  return {
    success: false,
    remaining: 0,
    reset: entry.resetTime,
  };
}

/**
 * Middleware to check rate limit and return response
 */
export function checkRateLimit(
  request: NextRequest,
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): NextResponse | null {
  const result = rateLimit(identifier, limit, windowMs);

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : (request.headers.get('x-real-ip') || 'unknown');
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
