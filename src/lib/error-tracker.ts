// Adapter to centralize error reporting. Wraps Sentry (`@sentry/nextjs`) when available,
// otherwise falls back to console logging. This allows swapping providers later.

import * as Sentry from '@sentry/nextjs';

const serverDsn = process.env.GLITCHTIP_DSN || process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.NEXT_PUBLIC_GLITCHTIP_DSN;

export const isEnabled = Boolean(serverDsn);

export function captureException(err: unknown, context?: Record<string, unknown>) {
  if (isEnabled) {
    try {
      Sentry.captureException(err, { extra: context });
    } catch (e) {
      // If Sentry fails for some reason, still log locally
      // eslint-disable-next-line no-console
      console.error('[error-tracker] failed to capture exception', e, err, context);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error('[error-tracker] exception:', err, context || 'no-context');
  }
}

export function captureMessage(message: string, level: Sentry.Severity = 'info') {
  if (isEnabled) {
    try {
      Sentry.captureMessage(message, level);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[error-tracker] failed to capture message', e, message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[error-tracker] message:', level, message);
  }
}

export function setUser(user: { id?: string; email?: string; username?: string } | null) {
  if (!isEnabled) return;
  try {
    if (user) Sentry.setUser(user as any);
    else Sentry.setUser(null);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[error-tracker] failed to set user', e, user);
  }
}

export default {
  isEnabled,
  captureException,
  captureMessage,
  setUser,
};
