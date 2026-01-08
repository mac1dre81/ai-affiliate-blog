// src/app/api/health/route.ts
// Health check endpoint for observability

import { getRedisHealth } from '@/lib/redis-health';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const redisHealth = await getRedisHealth();

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      redis: redisHealth,
    };

    logger.debug({ health }, 'Health check');

    return NextResponse.json(health);
  } catch (err) {
    logger.error({ err }, 'Health check failed');
    return NextResponse.json(
      { status: 'error', message: String(err) },
      { status: 503 }
    );
  }
}

export const runtime = 'nodejs';
