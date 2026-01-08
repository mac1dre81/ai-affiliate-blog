// src/lib/redis-health.ts
// Redis connection health checks and observability

import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || process.env.REDIS_CONNECTION || '';
let redis: Redis | null = null;
let healthStatus: 'healthy' | 'unhealthy' | 'unknown' = 'unknown';

export async function initRedis(): Promise<Redis | null> {
  if (!REDIS_URL) {
    logger.info('No REDIS_URL configured; skipping Redis initialization');
    healthStatus = 'healthy'; // in-memory fallback is ok
    return null;
  }

  if (redis) {
    return redis;
  }

  try {
    redis = new Redis(REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    // Set up event listeners
    redis.on('connect', () => {
      logger.info('Redis connected');
      healthStatus = 'healthy';
    });

    redis.on('error', (err) => {
      logger.error({ err }, 'Redis error');
      healthStatus = 'unhealthy';
    });

    redis.on('close', () => {
      logger.info('Redis connection closed');
      healthStatus = 'unhealthy';
    });

    // Perform an initial ping
    await redis.ping();
    healthStatus = 'healthy';
    logger.info('Redis health check passed');
    return redis;
  } catch (err) {
    logger.error({ err }, 'Failed to initialize Redis');
    healthStatus = 'unhealthy';
    redis = null;
    return null;
  }
}

export async function getRedisHealth(): Promise<{ status: string; details?: string }> {
  if (!REDIS_URL) {
    return { status: 'not-configured', details: 'Redis not configured; using in-memory fallback' };
  }

  if (!redis) {
    return { status: 'not-initialized', details: 'Redis client not initialized' };
  }

  try {
    await redis.ping();
    return { status: 'healthy' };
  } catch (err) {
    return { status: 'unhealthy', details: String(err) };
  }
}

export function getRedisClient(): Redis | null {
  return redis;
}

export function getHealthStatus(): string {
  return healthStatus;
}

export default { initRedis, getRedisHealth, getRedisClient, getHealthStatus };
