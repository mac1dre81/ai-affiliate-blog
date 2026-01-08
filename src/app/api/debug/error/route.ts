import { NextResponse } from 'next/server';
import errorTracker from '../../../../lib/error-tracker';

// Protect this debug endpoint with an environment flag. Set `DEBUG_ERROR_ROUTE=true`
// to enable the route. Optionally set `DEBUG_ERROR_ROUTE_SECRET` and provide the
// same value in the `x-debug-secret` request header to further restrict access.
const DEBUG_ENABLED = process.env.DEBUG_ERROR_ROUTE === 'true';
const DEBUG_SECRET = process.env.DEBUG_ERROR_ROUTE_SECRET;

export async function GET(request: Request) {
  if (!DEBUG_ENABLED) {
    return NextResponse.json({ ok: false, message: 'Debug route disabled' }, { status: 404 });
  }

  if (DEBUG_SECRET) {
    const header = request.headers.get('x-debug-secret');
    if (!header || header !== DEBUG_SECRET) {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
    }
  }

  const err = new Error('Test error from /api/debug/error');
  // Capture via adapter (this will use Sentry if DSN present, otherwise console)
  errorTracker.captureException(err, { route: '/api/debug/error' });

  return NextResponse.json({ ok: false, message: 'Error captured (if configured).' }, { status: 500 });
}
