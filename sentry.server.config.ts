// sentry.server.config.ts
// Sentry error tracking server-side initialization

import * as Sentry from '@sentry/nextjs';

// Prefer GLITCHTIP_DSN (for GlitchTip compatibility) and fall back to SENTRY_DSN
const serverDsn = process.env.GLITCHTIP_DSN || process.env.SENTRY_DSN;

if (serverDsn) {
  Sentry.init({
    dsn: serverDsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}
