/**
 * Detects if running in ESM mode
 */
export const isESM = (): boolean => {
  try {
    return !!import.meta.url;
  } catch {
    return false;
  }
};

/**
 * Safely loads environment variables
 */
export const loadEnv = async () => {
  if (isESM()) {
    return (await import('@/lib/env-config')).default;
  } else {
    // CJS fallback
    return require('@/lib/env-config');
  }
};

// Type declarations for CJS context
if (typeof module !== 'undefined') {
  module.exports = {
    isESM,
    loadEnv
  };
}