// src/billing/middleware.ts
import { NextRequest } from 'next/server';
import { reserveCredits, refundCredits, getCredits } from './credits';

// Simple middleware-style helper to enforce credits for API handlers.
export async function enforceCredits(req: NextRequest, userId: string, estimate = 10) {
  // Ensure user has enough credits and reserve them
  const credits = await getCredits(userId);
  if (credits <= 0) {
    return { ok: false, reason: 'insufficient_credits', credits };
  }
  const reserved = await reserveCredits(userId, estimate);
  if (!reserved) {
    return { ok: false, reason: 'insufficient_credits', credits };
  }
  return { ok: true, reserved: estimate, credits: await getCredits(userId) };
}

export async function refundReservation(userId: string, amount: number) {
  await refundCredits(userId, amount);
}
