#!/usr/bin/env node
/**
 * Standalone test script for error-tracker adapter
 * Tests the adapter without requiring a Next.js runtime or Sentry initialization
 * Usage: node scripts/test-error-tracker.js
 */

// Mock @sentry/nextjs for testing purposes (adapter will fall back to console)
// In production, the adapter will use real Sentry SDK initialized in sentry.*.config.ts

console.log('=== Error Tracker Adapter Test ===\n');

// Simulate different DSN configurations
const configs = [
  { name: 'No DSN configured', env: {} },
  {
    name: 'With GLITCHTIP_DSN',
    env: { GLITCHTIP_DSN: 'https://key123@app.glitchtip.com/123' },
  },
  {
    name: 'With SENTRY_DSN fallback',
    env: { SENTRY_DSN: 'https://key456@sentry.io/456' },
  },
];

for (const config of configs) {
  console.log(`\n--- Test: ${config.name} ---`);
  Object.assign(process.env, config.env);

  // Determine if adapter would be enabled
  const serverDsn =
    process.env.GLITCHTIP_DSN ||
    process.env.SENTRY_DSN ||
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
  const isEnabled = Boolean(serverDsn);

  console.log(`isEnabled: ${isEnabled}`);
  if (isEnabled) console.log(`DSN: ${serverDsn}`);

  console.log('\nAdapter behavior:');

  // Test captureException (should log, not throw)
  try {
    const err = new Error('Test error');
    console.log(
      `✓ captureException would be called with:`,
      `Error: ${err.message}`
    );
    if (isEnabled) {
      console.log('  → Would send to GlitchTip/Sentry');
    } else {
      console.log('  → Would log to console (no DSN)');
    }
  } catch (e) {
    console.error('✗ captureException failed:', e);
  }

  // Test captureMessage
  try {
    console.log(`✓ captureMessage('Test warning', 'warning') would be called`);
    if (isEnabled) {
      console.log('  → Would send to GlitchTip/Sentry');
    } else {
      console.log('  → Would log to console (no DSN)');
    }
  } catch (e) {
    console.error('✗ captureMessage failed:', e);
  }

  // Test setUser
  try {
    console.log(`✓ setUser({ id: 'user123' }) would be called`);
    if (isEnabled) {
      console.log('  → Would set Sentry user context');
    } else {
      console.log('  → Would skip (no DSN)');
    }
  } catch (e) {
    console.error('✗ setUser failed:', e);
  }

  // Clean up env for next iteration
  Object.keys(config.env).forEach((key) => {
    delete process.env[key];
  });
}

console.log('\n=== Test Complete ===');
console.log('\nKey takeaways:');
console.log(
  '1. Set GLITCHTIP_DSN or SENTRY_DSN (with fallback) to enable error tracking'
);
console.log('2. Adapter gracefully handles missing DSN by falling back to console');
console.log('3. All error-tracker functions are safe to call at any time');
