// src/billing/stripe.ts
// Stripe integration using official SDK. Webhook verification uses stripe.webhooks.constructEvent.
import Stripe from 'stripe';
import env from '@/lib/env-config';

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' }) : null;

export function verifyStripeSignature(rawBody: string | Buffer, sigHeader: string | null) {
  if (!env.ENABLE_STRIPE) return { ok: false, reason: 'stripe_disabled' };
  if (!env.STRIPE_WEBHOOK_SECRET) return { ok: false, reason: 'missing_webhook_secret' };
  if (!sigHeader) return { ok: false, reason: 'missing_signature' };

  try {
    // stripe.webhooks.constructEvent expects a Buffer
    const payload = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody;
    const event = stripe!.webhooks.constructEvent(payload, sigHeader, env.STRIPE_WEBHOOK_SECRET!);
    return { ok: true, event };
  } catch (err: any) {
    return { ok: false, reason: err?.message || 'invalid_signature' };
  }
}

export async function createCheckoutSession(customerId: string, priceId: string) {
  if (!env.ENABLE_STRIPE || !stripe) throw new Error('Stripe disabled or not configured');
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: customerId,
    success_url: `${env.NEXT_PUBLIC_APP_URL}/account/billing?status=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/account/billing?status=cancel`,
  });
  return { url: session.url, id: session.id };
}

export default { verifyStripeSignature, createCheckoutSession };
