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

function cleanupExpiredEntries(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

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
  cleanupExpiredEntries(now);
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
 * Get client IP from request.
 *
 * Security: the leftmost entry of X-Forwarded-For is client-supplied and can be
 * spoofed. We therefore prefer Cloudflare's cf-connecting-ip (set by the edge,
 * not spoofable when traffic passes through Cloudflare) and otherwise take the
 * LAST entry of X-Forwarded-For, which is appended by the closest trusted proxy.
 */
export function getClientIp(request: Request | NextRequest): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Distributed rate limiter backed by Upstash Redis.
 *
 * Uses an atomic INCR + EXPIRE sliding fixed-window counter that is shared
 * across all instances. When Redis is not configured (or errors), it falls back
 * to the process-local in-memory limiter so behaviour degrades gracefully.
 *
 * @param identifier - Unique key (e.g. `login:1.2.3.4`)
 * @param limit - Maximum requests allowed within the window
 * @param windowMs - Time window in milliseconds
 */
export async function rateLimitDistributed(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const { getRedis } = await import('./redis');
  const redis = getRedis();

  if (!redis) {
    return rateLimit(identifier, limit, windowMs);
  }

  const key = `rl:${identifier}`;
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    const ttl = await redis.ttl(key);
    const reset = Date.now() + (ttl > 0 ? ttl * 1000 : windowMs);

    if (count > limit) {
      return { success: false, remaining: 0, reset };
    }
    return { success: true, remaining: Math.max(0, limit - count), reset };
  } catch {
    // Redis unavailable -> fail open to the in-memory limiter
    return rateLimit(identifier, limit, windowMs);
  }
}

/**
 * Async middleware variant of {@link checkRateLimit} using the distributed
 * (Redis) limiter with in-memory fallback.
 */
export async function checkRateLimitDistributed(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<NextResponse | null> {
  const result = await rateLimitDistributed(identifier, limit, windowMs);

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
