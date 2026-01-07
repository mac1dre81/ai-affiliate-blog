import { ensureUserRecord, getCredits, reserveCredits, refundCredits, chargeForOperation } from '../../src/billing/credits';

describe('billing credits (in-memory scaffold)', () => {
  const user = 'test-user';

  test('ensureUserRecord initializes credits', () => {
    const rec = ensureUserRecord(user);
    expect(rec.userId).toBe(user);
    expect(rec.credits).toBeGreaterThanOrEqual(0);
  });

  test('getCredits returns a number', () => {
    const c = getCredits(user);
    expect(typeof c).toBe('number');
  });

  test('reserveCredits decreases credits when available', () => {
    ensureUserRecord(user);
    const before = getCredits(user);
    const ok = reserveCredits(user, 1);
    const after = getCredits(user);
    if (before >= 1) {
      expect(ok).toBe(true);
      expect(after).toBe(before - 1);
    } else {
      expect(ok).toBe(false);
    }
  });

  test('refundCredits increases credits', () => {
    const before = getCredits(user);
    refundCredits(user, 5);
    const after = getCredits(user);
    expect(after).toBe(before + 5);
  });

  test('chargeForOperation charges appropriately or fails', () => {
    const result = chargeForOperation(user, 'generate_site' as any, 2);
    expect(typeof result.success).toBe('boolean');
    expect(typeof result.charged).toBe('number');
  });
});
