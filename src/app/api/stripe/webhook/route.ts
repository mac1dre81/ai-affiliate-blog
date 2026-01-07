// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyStripeSignature } from '@/billing/stripe';

export async function POST(req: NextRequest) {
  // Webhooks require raw body and stripe SDK verification; do not run on Edge runtime.
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  const verified = verifyStripeSignature(raw, sig);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.reason || 'invalid_signature' }, { status: 400 });
  }

  const evt = (verified as any).event;

  // Handle a couple of event types (stubbed)
  if (evt && evt.type === 'checkout.session.completed') {
    // unlock credits / provision
    // TODO: implement provisioning logic based on evt.data.object
  }

  return NextResponse.json({ received: true });
}

// Do not set edge runtime for webhook — we need Node runtime for stripe constructEvent
export const runtime = 'nodejs';

export default POST;
