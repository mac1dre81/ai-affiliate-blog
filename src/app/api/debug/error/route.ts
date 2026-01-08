import { NextResponse } from 'next/server';
import errorTracker from '../../../../lib/error-tracker';

export async function GET() {
  const err = new Error('Test error from /api/debug/error');
  // Capture via adapter (this will use Sentry if DSN present, otherwise console)
  errorTracker.captureException(err, { route: '/api/debug/error' });

  return NextResponse.json({ ok: false, message: 'Error captured (if configured).' }, { status: 500 });
}
