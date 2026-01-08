import { ensureUserRecord, getCredits, reserveCredits, refundCredits, chargeForOperation } from '../../src/billing/credits';

describe('billing credits (in-memory scaffold)', () => {
  const user = 'test-user';

  test('ensureUserRecord initializes credits', async () => {
    const rec = await ensureUserRecord(user);
    expect(rec.userId).toBe(user);
    expect(rec.credits).toBeGreaterThanOrEqual(0);
  });

  test('getCredits returns a number', async () => {
    const c = await getCredits(user);
    expect(typeof c).toBe('number');
  });

  test('reserveCredits decreases credits when available', async () => {
    await ensureUserRecord(user);
    const before = await getCredits(user);
    const ok = await reserveCredits(user, 1);
    const after = await getCredits(user);
    if (before >= 1) {
      expect(ok).toBe(true);
      expect(after).toBe(before - 1);
    } else {
      expect(ok).toBe(false);
    }
  });

  test('refundCredits increases credits', async () => {
    const before = await getCredits(user);
    await refundCredits(user, 5);
    const after = await getCredits(user);
    expect(after).toBe(before + 5);
  });

  test('chargeForOperation charges appropriately or fails', async () => {
    const result = await chargeForOperation(user, 'generate_site' as any, 2);
    expect(typeof result.success).toBe('boolean');
    expect(typeof result.charged).toBe('number');
  });
});
