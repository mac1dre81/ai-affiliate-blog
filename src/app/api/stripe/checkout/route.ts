// src/app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createCheckoutSession } from '@/billing/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const customerId = body.customerId || 'guest';
  const priceId = body.priceId || 'price_test';
  try {
    const session = await createCheckoutSession(customerId, priceId);
    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 });
  }
}

export const runtime = 'edge';
