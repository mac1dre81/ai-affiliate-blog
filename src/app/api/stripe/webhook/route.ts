// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyStripeSignature } from '@/billing/stripe';
import { processCheckoutSessionComplete, processChargeRefunded } from '@/billing/webhook-provisioning';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  // Webhooks require raw body and stripe SDK verification; do not run on Edge runtime.
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  const verified = verifyStripeSignature(raw, sig);
  if (!verified.ok) {
    logger.warn({ reason: verified.reason }, 'Stripe webhook signature verification failed');
    return NextResponse.json({ error: verified.reason || 'invalid_signature' }, { status: 400 });
  }

  const evt = (verified as any).event;

  logger.info({ eventType: evt?.type, eventId: evt?.id }, 'Processing Stripe webhook');

  // Handle checkout.session.completed
  if (evt?.type === 'checkout.session.completed') {
    const result = await processCheckoutSessionComplete(evt);
    logger.info({ result }, 'Checkout session completed');
  }

  // Handle charge refunded
  if (evt?.type === 'charge.refunded') {
    const result = await processChargeRefunded(evt);
    logger.info({ result }, 'Charge refunded');
  }

  return NextResponse.json({ received: true });
}

// Do not set edge runtime for webhook — we need Node runtime for stripe constructEvent
export const runtime = 'nodejs';

