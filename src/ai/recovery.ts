/*
 * Robust AI operation wrapper with retries, backoff, downgrade, and cached fallback.
 * No external dependencies; safe for server-only usage.
 */

export interface RecoveryOptions<T> {
  maxRetries?: number; // total attempts = maxRetries + 1
  initialDelayMs?: number; // base backoff delay
  jitter?: boolean; // add +/- 20% jitter to backoff
  // If provider/model downgrade is available, run this when classified as provider/model issue
  onDowngrade?: () => Promise<T>;
  // Optional cache lookup for similar result when provider fails
  findSimilarCachedResult?: () => Promise<T | null>;
  // Logging and classification hooks
  logAIError?: (error: unknown, attempt: number) => void;
  isAIServiceError?: (error: unknown) => boolean;
}

export class AIRobustnessLayer {
  static defaultIsAIServiceError(error: unknown): boolean {
    if (!error) return false;
    const msg = String((error as any)?.message ?? error);
    // Heuristics for network/provider errors. Adjust as needed per provider.
    return (
      /timeout|ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|429|rate limit|overloaded|Service Unavailable|Gateway Timeout/i.test(
        msg
      ) ||
      (typeof (error as any)?.status === 'number' &&
        [408, 409, 425, 429, 500, 502, 503, 504].includes((error as any).status))
    );
  }

  static async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static computeBackoff(attempt: number, base: number, jitter: boolean): number {
    const exp = Math.min(2 ** attempt, 32);
    let delay = base * exp;
    if (jitter) {
      const delta = delay * 0.2;
      delay = delay + (Math.random() * 2 - 1) * delta; // +/-20%
    }
    return Math.max(0, Math.floor(delay));
  }

  static async withAIRecovery<T>(
    operation: () => Promise<T>,
    fallback: () => Promise<T>,
    options: RecoveryOptions<T> = {}
  ): Promise<T> {
    const {
      maxRetries = 2,
      initialDelayMs = 250,
      jitter = true,
      onDowngrade,
      findSimilarCachedResult,
      logAIError,
      isAIServiceError = AIRobustnessLayer.defaultIsAIServiceError,
    } = options;

    let attempt = 0;
    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt += 1;
        logAIError?.(error, attempt);

        // If provider issue: try cached, downgrade, then retry with backoff
        if (isAIServiceError(error)) {
          if (findSimilarCachedResult) {
            try {
              const cached = await findSimilarCachedResult();
              if (cached) return cached;
            } catch (_) {
              // ignore cache errors; continue recovery
            }
          }

          if (onDowngrade) {
            try {
              return await onDowngrade();
            } catch (e) {
              // downgrade attempt failed; fall through to retry
              logAIError?.(e, attempt);
            }
          }

          if (attempt <= maxRetries) {
            const delay = AIRobustnessLayer.computeBackoff(attempt, initialDelayMs, jitter);
            await AIRobustnessLayer.sleep(delay);
            continue; // retry
          }

          // Exhausted retries -> fallback
          return await fallback();
        }

        // Non-provider errors: do not retry endlessly
        if (attempt <= Math.min(1, maxRetries)) {
          const delay = AIRobustnessLayer.computeBackoff(attempt, initialDelayMs, jitter);
          await AIRobustnessLayer.sleep(delay);
          continue;
        }

        // Rethrow non-provider error after minimal retry
        throw error;
      }
    }
  }
}

export default AIRobustnessLayer;
