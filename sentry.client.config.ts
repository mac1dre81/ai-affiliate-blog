// sentry.client.config.ts
// Sentry error tracking client-side initialization

import * as Sentry from '@sentry/nextjs';

// Prefer NEXT_PUBLIC_GLITCHTIP_DSN (for GlitchTip compatibility) and fall back to NEXT_PUBLIC_SENTRY_DSN
const clientDsn = process.env.NEXT_PUBLIC_GLITCHTIP_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (clientDsn) {
  Sentry.init({
    dsn: clientDsn,
    environment: process.env.NODE_ENV,
    integrations: [
      // Sentry.replayIntegration() can be added if @sentry/replay is installed
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}
