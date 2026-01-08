// src/lib/rate-limiter.ts
// Redis-backed sliding window rate limiter

import Redis from 'ioredis';
import { logger } from './logger';

export interface RateLimitConfig {
  windowMs: number; // milliseconds
  maxRequests: number; // max requests per window
  keyPrefix?: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'ratelimit:',
};

/**
 * Create a rate limiter using Redis sliding window algorithm.
 * Tracks requests per key and enforces max requests per window.
 */
export function createRateLimiter(redis: Redis | null, config: Partial<RateLimitConfig> = {}) {
  const { windowMs, maxRequests, keyPrefix } = { ...DEFAULT_CONFIG, ...config };

  const INCR_SCRIPT = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])
    local oldest = now - window

    redis.call('ZREMRANGEBYSCORE', key, 0, oldest)
    local count = redis.call('ZCARD', key)

    if count < limit then
      redis.call('ZADD', key, now, now)
      redis.call('EXPIRE', key, window / 1000)
      return { 1, limit - count - 1 }
    end

    return { 0, 0 }
  `;

  async function check(identifier: string): Promise<{ allowed: boolean; remaining: number; resetAt?: number }> {
    if (!redis) {
      // Fallback: if no Redis, allow all (not rate limited)
      logger.warn('Rate limiter: Redis not available, allowing request');
      return { allowed: true, remaining: maxRequests };
    }

    try {
      const key = `${keyPrefix}${identifier}`;
      const now = Date.now();
      const result = await redis.eval(INCR_SCRIPT, 1, key, String(maxRequests), String(windowMs), String(now));

      if (Array.isArray(result) && result.length >= 2) {
        const [allowed, remaining] = result;
        return {
          allowed: !!allowed,
          remaining: Number(remaining) || 0,
          resetAt: allowed ? now + windowMs : now,
        };
      }

      return { allowed: false, remaining: 0, resetAt: now + windowMs };
    } catch (err) {
      logger.error({ err }, 'Rate limiter error');
      // Fail open: if rate limiter fails, allow the request
      return { allowed: true, remaining: maxRequests };
    }
  }

  return { check };
}

export default { createRateLimiter };
