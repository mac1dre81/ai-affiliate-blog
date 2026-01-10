# Production Hardening & Observability

## Summary

This document outlines the production-grade security, billing, and observability features added to the AI affiliate blog platform.

---

## 1. Content Safety Layer (DOMPurify + axe-core)

**Location**: `src/validation/ContentSafetyLayer.ts`

### Features
- **DOMPurify sanitization**: Removes unsafe HTML elements, attributes, and inline scripts
- **Sanitization impact detection**: Flags if >20% of content is removed during sanitization
- **axe-core accessibility audit**: Validates generated HTML against WCAG 2.1 standards
- **Malicious code detection**: Scans for inline scripts, javascript: URLs, and unsafe external links
- **Accessibility & SEO checks**: Validates alt text, form labels, meta tags, etc.

### Usage
```typescript
const validator = new ContentSafetyLayer('strict');
const result = await validator.validateGeneration(html);
console.log(result.issues); // array of issues with fixes
```

---

## 2. Rate Limiting (Redis-backed Sliding Window)

**Location**: `src/lib/rate-limiter.ts`

### Features
- **Sliding window algorithm**: Uses Redis ZSET for O(1) lookups
- **Graceful degradation**: Falls back to allow-all if Redis is unavailable
- **Configurable**: window size and max requests per window

### Usage
```typescript
import { createRateLimiter } from '@/lib/rate-limiter';
const limiter = createRateLimiter(redis, { windowMs: 60000, maxRequests: 100 });
const { allowed, remaining } = await limiter.check(userId);
```

### Typical Configuration
- API endpoints: 100 requests/minute per user
- Generation API: 10 requests/minute per user
- Public endpoints: 1000 requests/minute per IP

---

## 3. Redis Connection Health & Observability

**Location**: `src/lib/redis-health.ts`, `src/app/api/health/route.ts`

### Features
- **Health check endpoint**: GET `/api/health` returns Redis, service status
- **Connection lifecycle logging**: Logs connect, error, close events
- **Automatic retry logic**: Exponential backoff on connection failure
- **Health status tracking**: Reports `healthy`, `unhealthy`, `not-configured`

### Health Endpoint Response
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T10:00:00Z",
  "redis": {
    "status": "healthy"
  }
}
```

---

## 4. Webhook Credit Provisioning

**Location**: `src/billing/webhook-provisioning.ts`

### Features
- **Stripe event handling**: `checkout.session.completed` grants credits
- **Configurable credit packages**: Map Stripe product IDs to credit amounts
- **Refund handling**: Logs refunds for manual audit and adjustment
- **Atomic operations**: Uses Redis transactions for credit grants

### Credit Packages
```typescript
{
  'prod-starter': { creditAmount: 1000, label: 'Starter Pack' },
  'prod-pro': { creditAmount: 5000, label: 'Pro Pack' },
  'prod-enterprise': { creditAmount: 20000, label: 'Enterprise Pack' },
}
```

### Implementation
- Webhook receives `checkout.session.completed` event
- Extracts `userId` and `productId` from session metadata
- Calls `grantCredits(userId, amount)` to add credits to user account
- Logs the operation for audit trail

---

## 5. Structured Logging

**Location**: `src/lib/logger.ts`

### Features
- **Pino logging library**: High-performance JSON logger
- **Sentry integration**: Errors logged to Sentry for alerting
- **Environment-based formatting**: Pretty print in dev, JSON in prod
- **Structured context**: Pass structured data alongside messages

### Usage
```typescript
import { logger, logError, logInfo, logWarn } from '@/lib/logger';

logInfo('User created', { userId, email });
logWarn('High latency detected', { endpoint: '/api/generate-site', latencyMs: 5000 });
logError(err, { context: 'webhook processing', eventId });
```

---

## 6. Sentry Error Tracking

**Files**: `sentry.client.config.ts`, `sentry.server.config.ts`

### Features
- **Client-side**: Captures UI errors, session replays, and client events
- **Server-side**: Captures backend errors and API failures
- **Sampling**: 10% in production, 100% in development
- **Session replays**: Records user interactions for debugging

### Environment Variables
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## 7. Integration Tests (SSE Flow)

**Location**: `tests/integration/sse-flow.test.ts`

### Test Coverage
- Reserved/credits/progress events
- Multiple events in sequence
- HTML fragments and validation
- Error handling
- CRLF vs LF line endings
- Incomplete event handling

### Example Test
```typescript
test('parseSSEChunk handles reserved event correctly', () => {
  const chunk = 'event: reserved\ndata: {"reserved":10}\n\n';
  const events: any[] = [];
  parseSSEChunk(chunk, (type, data) => {
    events.push({ type, data });
  });
  expect(events[0].type).toBe('reserved');
  expect(events[0].data).toEqual({ reserved: 10 });
});
```

---

## Environment Variables

Add these to your deployment environment (CI/CD, hosting platform):

```bash
# Redis (for persistent credits and rate limiting)
REDIS_URL=redis://username:password@host:6379/0

# Sentry
SENTRY_DSN=https://your-key@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project-id

# Logging
LOG_LEVEL=info
NODE_ENV=production

# Stripe (existing)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Database and AI keys (existing)
DATABASE_URL=...
OPENAI_API_KEY=...
```

---

## Deployment Checklist

- [ ] Redis instance provisioned and `REDIS_URL` set
- [ ] Sentry project created and DSN configured
- [ ] Stripe webhook endpoint configured with correct signing secret
- [ ] Environment variables set in CI/CD (GitHub Actions, etc.)
- [ ] Health check monitored: `GET /api/health`
- [ ] Error logs reviewed in Sentry dashboard
- [ ] Rate limiting limits tuned for expected load
- [ ] Backup and recovery procedures documented

---

## Monitoring & Alerting

### Key Metrics to Monitor
1. **Redis health**: Check `/api/health` endpoint periodically
2. **Error rate**: Sentry error count and types
3. **Rate limit hits**: Log lines matching "rate limit exceeded"
4. **Credit grants**: Log lines from webhook provisioning
5. **Generation latency**: P95/P99 latency on `/api/generate-site`

### Sample Monitoring Queries
```bash
# Check Redis connectivity
curl https://your-app.com/api/health

# View recent errors in logs
LOG_LEVEL=debug npm run dev
```

---

## Testing

Run the full test suite:
```bash
npm test
```

Tests include:
- 4 test suites
- 17 test cases
- SSE parsing, billing, API, and hook unit tests
- Integration tests for client/server SSE flow

---

## References

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Redis Sliding Window Rate Limiting](https://redis.io/commands/zadd/)
- [Sentry NextJS Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Pino Logger](https://getpino.io/)
