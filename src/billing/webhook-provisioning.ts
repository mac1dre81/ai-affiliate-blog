// src/billing/webhook-provisioning.ts
// Logic to grant credits when Stripe payment succeeds

import { grantCredits } from './credits';
import { logger } from '@/lib/logger';

export interface CreditPackage {
  stripeProductId: string;
  creditAmount: number;
  label: string;
}

// Map Stripe product IDs to credit packages
export const CREDIT_PACKAGES: Record<string, CreditPackage> = {
  'prod-starter': {
    stripeProductId: 'prod-starter',
    creditAmount: 1000,
    label: 'Starter Pack',
  },
  'prod-pro': {
    stripeProductId: 'prod-pro',
    creditAmount: 5000,
    label: 'Pro Pack',
  },
  'prod-enterprise': {
    stripeProductId: 'prod-enterprise',
    creditAmount: 20000,
    label: 'Enterprise Pack',
  },
};

/**
 * Process a successful Stripe checkout session payment.
 * Grants credits to the user based on the purchased package.
 */
export async function processCheckoutSessionComplete(event: any): Promise<{ success: boolean; message: string }> {
  const session = event.data.object;

  // Extract user ID from session metadata
  const userId = session.metadata?.userId || session.customer_email;
  if (!userId) {
    logger.warn({ session }, 'No user ID found in Stripe session');
    return { success: false, message: 'No user ID in session' };
  }

  try {
    // Get the line items to determine which product was purchased
    // Note: in production, you'd need to fetch line_items via Stripe API
    const productId = session.metadata?.productId;
    if (!productId) {
      logger.warn({ session }, 'No product ID in session metadata');
      return { success: false, message: 'No product ID' };
    }

    const pkg = CREDIT_PACKAGES[productId];
    if (!pkg) {
      logger.warn({ productId }, 'Unknown product ID');
      return { success: false, message: 'Unknown product' };
    }

    // Grant credits to user
    const result = await grantCredits(userId, pkg.creditAmount);

    if (result.success) {
      logger.info({ userId, creditAmount: pkg.creditAmount, packageLabel: pkg.label }, 'Credits granted');
      return { success: true, message: `Granted ${pkg.creditAmount} credits` };
    } else {
      logger.error({ userId }, 'Failed to grant credits');
      return { success: false, message: 'Failed to grant credits' };
    }
  } catch (err) {
    logger.error({ err, userId }, 'Error processing checkout session');
    return { success: false, message: String(err) };
  }
}

/**
 * Handle a refund: deduct credits from user if refunded.
 * For simplicity, this is optional; you may log and alert instead.
 */
export async function processChargeRefunded(event: any): Promise<{ success: boolean; message: string }> {
  const charge = event.data.object;
  const userId = charge.metadata?.userId;

  if (!userId) {
    logger.warn({ charge }, 'No user ID in refund charge');
    return { success: true, message: 'No user ID to refund' };
  }

  try {
    // Optionally: deduct credits if a refund occurs
    // For now, we log it and let ops handle it
    logger.info({ userId, chargeId: charge.id }, 'Charge refunded; credits may need adjustment');
    return { success: true, message: 'Refund logged' };
  } catch (err) {
    logger.error({ err, userId }, 'Error processing refund');
    return { success: false, message: String(err) };
  }
}

export default { processCheckoutSessionComplete, processChargeRefunded, CREDIT_PACKAGES };
