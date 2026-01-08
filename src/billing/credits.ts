// src/billing/credits.ts
// Simple credits service for demo/testing. Replace with DB-backed implementation.

import type { AIOperation } from '@/ai/types';
import Redis from 'ioredis';

// Use a Redis-backed credits store when REDIS_URL is provided. Otherwise fall back
// to the in-memory Map for local development.

const REDIS_URL = process.env.REDIS_URL || process.env.REDIS_CONNECTION || '';
let redis: Redis | null = null;
if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL);
  } catch (e) {
    // If redis cannot be constructed, continue with fallback
    // eslint-disable-next-line no-console
    console.warn('Redis connection failed, falling back to in-memory credits store', e);
    redis = null;
  }
}

type CreditsRecord = { userId: string; credits: number };
const store = new Map<string, CreditsRecord>();

function ensureUserLocal(userId: string) {
  if (!store.has(userId)) store.set(userId, { userId, credits: 100 });
  return store.get(userId)!;
}

// Atomic Lua script for reserve: checks balance and decrements if enough
const RESERVE_LUA = `
  local key = KEYS[1]
  local amt = tonumber(ARGV[1])
  local cur = tonumber(redis.call('GET', key) or '0')
  if cur >= amt then
    redis.call('DECRBY', key, amt)
    return 1
  end
  return 0
`;

export async function ensureUserRecord(userId: string) {
  if (redis) {
    const key = `credits:${userId}`;
    const exists = await redis.exists(key);
    if (!exists) {
      await redis.set(key, '100');
    }
    const credits = parseInt((await redis.get(key)) || '0', 10);
    return { userId, credits };
  }

  return ensureUserLocal(userId);
}

export async function getCredits(userId: string) {
  if (redis) {
    const val = await redis.get(`credits:${userId}`);
    return parseInt(val || '0', 10);
  }
  const r = store.get(userId);
  return r ? r.credits : 0;
}

export async function reserveCredits(userId: string, amount: number): Promise<boolean> {
  if (redis) {
    const key = `credits:${userId}`;
    try {
      const ok = await redis.eval(RESERVE_LUA, 1, key, String(amount));
      return !!ok;
    } catch (e) {
      // fallback to optimistic multi
      try {
        await redis.watch(key);
        const cur = parseInt((await redis.get(key)) || '0', 10);
        if (cur >= amount) {
          const tx = redis.multi();
          tx.decrby(key, amount);
          const res = await tx.exec();
          return !!res;
        }
        return false;
      } catch (err) {
        return false;
      }
    }
  }

  const rec = ensureUserLocal(userId);
  if (rec.credits >= amount) {
    rec.credits -= amount;
    return true;
  }
  return false;
}

export async function refundCredits(userId: string, amount: number) {
  if (redis) {
    const key = `credits:${userId}`;
    await redis.incrby(key, amount);
    return;
  }
  const rec = ensureUserLocal(userId);
  rec.credits += amount;
}

export async function consumeCredits(userId: string, amount: number): Promise<boolean> {
  // For Redis-backed flow, reserveCredits already decreased the balance.
  // This function exists for symmetry and potential auditing.
  return true;
}

export async function chargeForOperation(userId: string, op: AIOperation, units: number) {
  const costPerUnit = 1; // placeholder pricing
  const cost = Math.max(1, Math.ceil(units * costPerUnit));
  if (redis) {
    const key = `credits:${userId}`;
    const cur = parseInt((await redis.get(key)) || '0', 10);
    if (cur >= cost) {
      await redis.decrby(key, cost);
      return { success: true, charged: cost };
    }
    return { success: false, charged: 0 };
  }

  const rec = ensureUserLocal(userId);
  if (rec.credits >= cost) {
    rec.credits -= cost;
    return { success: true, charged: cost };
  }
  return { success: false, charged: 0 };
}

export async function debugDump() {
  if (redis) {
    // list keys may be expensive; only for debugging
    const keys = await redis.keys('credits:*');
    const out: CreditsRecord[] = [];
    for (const k of keys) {
      const val = parseInt((await redis.get(k)) || '0', 10);
      out.push({ userId: k.replace(/^credits:/, ''), credits: val });
    }
    return out;
  }
  return Array.from(store.values());
}

/**
 * Grant credits to a user (used by webhook provisioning).
 */
export async function grantCredits(userId: string, amount: number) {
  try {
    await refundCredits(userId, amount); // refundCredits adds to balance
    return { success: true, granted: amount };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export default { ensureUserRecord, getCredits, reserveCredits, refundCredits, consumeCredits, chargeForOperation, grantCredits };

