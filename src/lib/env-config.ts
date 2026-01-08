// src/lib/env-config.ts
// Strict, dependency-free environment loader with feature-gated validation.

export type FeatureFlags = {
  ENABLE_OPENAI: boolean;
  ENABLE_GEMINI: boolean;
  ENABLE_ANTHROPIC: boolean;
  ENABLE_STRIPE: boolean;
  ENABLE_GCP_DEPLOY: boolean;
};

export type Env = FeatureFlags & {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string; // canonical server URL
  NEXT_PUBLIC_APP_URL: string; // safe for client

  // AI provider keys (server-only)
  OPENAI_API_KEY?: string;
  GOOGLE_API_KEY?: string; // Gemini (Google AI Studio)
  ANTHROPIC_API_KEY?: string;

  // Stripe
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;

  // Google Cloud
  GCP_PROJECT_ID?: string;
  GCP_REGION?: string;
  GCS_BUCKET?: string;

  // Security
  SESSION_SECRET?: string;
};

const toBool = (v: string | undefined, def = false) =>
  v === undefined ? def : /^(1|true|yes|on)$/i.test(v);

const assertPresent = (name: string, value: string | undefined) => {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
};

const assertIf = (cond: boolean, name: string, value: string | undefined) => {
  if (!cond) return;
  assertPresent(name, value);
};

function readEnv(): Env {
  const NODE_ENV = (process.env.NODE_ENV as Env['NODE_ENV']) || 'development';

  const flags: FeatureFlags = {
    ENABLE_OPENAI: toBool(process.env.ENABLE_OPENAI, false),
    ENABLE_GEMINI: toBool(process.env.ENABLE_GEMINI, false),
    ENABLE_ANTHROPIC: toBool(process.env.ENABLE_ANTHROPIC, false),
    ENABLE_STRIPE: toBool(process.env.ENABLE_STRIPE, false),
    ENABLE_GCP_DEPLOY: toBool(process.env.ENABLE_GCP_DEPLOY, false),
  };

  const APP_URL = process.env.APP_URL || 'http://localhost:3000';
  const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || APP_URL;

  const env: Env = {
    NODE_ENV,
    APP_URL,
    NEXT_PUBLIC_APP_URL,
    ...flags,

    // AI providers
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    // Google Cloud
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_REGION: process.env.GCP_REGION,
    GCS_BUCKET: process.env.GCS_BUCKET,

    // Security
    SESSION_SECRET: process.env.SESSION_SECRET,
  };

  // Base requirements
  assertPresent('APP_URL', APP_URL);

  // Feature-gated requirements
  assertIf(flags.ENABLE_OPENAI, 'OPENAI_API_KEY', env.OPENAI_API_KEY);
  assertIf(flags.ENABLE_GEMINI, 'GOOGLE_API_KEY', env.GOOGLE_API_KEY);
  assertIf(flags.ENABLE_ANTHROPIC, 'ANTHROPIC_API_KEY', env.ANTHROPIC_API_KEY);
  assertIf(flags.ENABLE_STRIPE, 'STRIPE_SECRET_KEY', env.STRIPE_SECRET_KEY);
  assertIf(flags.ENABLE_STRIPE, 'STRIPE_WEBHOOK_SECRET', env.STRIPE_WEBHOOK_SECRET);
  assertIf(flags.ENABLE_GCP_DEPLOY, 'GCP_PROJECT_ID', env.GCP_PROJECT_ID);
  assertIf(flags.ENABLE_GCP_DEPLOY, 'GCP_REGION', env.GCP_REGION);
  assertIf(flags.ENABLE_GCP_DEPLOY, 'GCS_BUCKET', env.GCS_BUCKET);

  return Object.freeze(env);
}

const env = readEnv();
export default env;
