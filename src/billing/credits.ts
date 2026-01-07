// src/billing/credits.ts
// Simple credits service for demo/testing. Replace with DB-backed implementation.

import type { CreditOperation } from './types';

type CreditsRecord = {
  userId: string;
  credits: number;
};

const store = new Map<string, CreditsRecord>();

export function ensureUserRecord(userId: string) {
  if (!store.has(userId)) {
    store.set(userId, { userId, credits: 100 }); // starter credits
  }
  return store.get(userId)!;
}

export function getCredits(userId: string) {
  const r = store.get(userId);
  return r ? r.credits : 0;
}

export function reserveCredits(userId: string, amount: number): boolean {
  const rec = ensureUserRecord(userId);
  if (rec.credits >= amount) {
    rec.credits -= amount; // optimistic reserve
    return true;
  }
  return false;
}

export function refundCredits(userId: string, amount: number) {
  const rec = ensureUserRecord(userId);
  rec.credits += amount;
}

export function consumeCredits(userId: string, amount: number): boolean {
  // In this simple store, reserve already deducted; this is a noop for now.
  return true;
}

export function chargeForOperation(userId: string, op: CreditOperation, units: number) {
  const costPerUnit = 1; // placeholder pricing
  const cost = Math.max(1, Math.ceil(units * costPerUnit));
  const rec = ensureUserRecord(userId);
  if (rec.credits >= cost) {
    rec.credits -= cost;
    return { success: true, charged: cost };
  }
  return { success: false, charged: 0 };
}

export function debugDump() {
  return Array.from(store.values());
}

export default { ensureUserRecord, getCredits, reserveCredits, refundCredits, consumeCredits, chargeForOperation };
