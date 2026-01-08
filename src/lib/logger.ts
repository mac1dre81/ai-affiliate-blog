// src/lib/logger.ts
// Structured logging using pino with optional Sentry integration

import pino from 'pino';
import * as Sentry from '@sentry/nextjs';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});

export function logError(err: any, context?: Record<string, any>) {
  logger.error({ err, ...context }, 'Error occurred');
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  }
}

export function logInfo(msg: string, data?: Record<string, any>) {
  logger.info(data, msg);
}

export function logWarn(msg: string, data?: Record<string, any>) {
  logger.warn(data, msg);
}

export function logDebug(msg: string, data?: Record<string, any>) {
  logger.debug(data, msg);
}

export default logger;
