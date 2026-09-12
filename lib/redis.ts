/**
 * Upstash Redis client (REST-based, edge/serverless friendly).
 *
 * Degrades gracefully: when the environment variables are absent the client is
 * `null` and callers fall back to the in-memory limiter. This keeps local dev
 * and unconfigured deployments working without Redis.
 *
 * Required env:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from '@upstash/redis'

let cachedRedis: Redis | null | undefined

export function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    cachedRedis = null
    return null
  }

  cachedRedis = new Redis({ url, token })
  return cachedRedis
}

export function isRedisConfigured(): boolean {
  return getRedis() !== null
}
