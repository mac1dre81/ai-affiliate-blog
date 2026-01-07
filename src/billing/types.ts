// src/billing/types.ts
// Credit system contracts and plan definitions for AI monetization.

import type { AIOperation } from '@/ai/types';

export type PlanId = 'free' | 'starter' | 'pro';

export interface AICreditPlan {
  id: PlanId;
  name: string;
  monthlyCredits: number; // base monthly credits
  features: string[];
  fasterAI?: boolean;
  priorityQueue?: boolean;
  watermarkOnExport?: boolean; // typically true on free tier
}

export interface AICreditSystem {
  operations: Record<AIOperation, number>; // cost per operation
  notifyBeforeCharge: boolean;
  freeTier: {
    dailyLimits: Record<AIOperation, number>;
    watermarkOnExport: boolean;
  };
  plans: Record<PlanId, AICreditPlan>;
}

export interface CreditAccount {
  userId: string;
  planId: PlanId;
  // Remaining credits in current billing cycle
  balance: number;
  // Track daily usage for free-tier limits and abuse detection
  dailyUsage: Partial<Record<AIOperation, number>>;
  // ISO date when the balance resets (start of next billing cycle)
  nextResetAt: string;
}

export interface Entitlements {
  fasterAI?: boolean;
  priorityQueue?: boolean;
  features: string[];
  watermarkOnExport?: boolean;
}

export const DEFAULT_CREDIT_COSTS: Record<AIOperation, number> = {
  generatePage: 10,
  generateComponent: 4,
  contentRewrite: 2,
  designSuggestion: 2,
  codeOptimization: 3,
};

export const DEFAULT_DAILY_LIMITS: Record<AIOperation, number> = {
  generatePage: 2,
  generateComponent: 5,
  contentRewrite: 10,
  designSuggestion: 10,
  codeOptimization: 5,
};

export const PLANS: Record<PlanId, AICreditPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyCredits: 0,
    features: ['basic-generation'],
    watermarkOnExport: true,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyCredits: 500,
    features: ['basic-generation', 'templates', 'exports'],
    fasterAI: false,
    priorityQueue: false,
    watermarkOnExport: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyCredits: 3000,
    features: ['advanced-models', 'brand-training', 'priority', 'custom-domains'],
    fasterAI: true,
    priorityQueue: true,
    watermarkOnExport: false,
  },
};

export const CREDIT_SYSTEM: AICreditSystem = {
  operations: DEFAULT_CREDIT_COSTS,
  notifyBeforeCharge: true,
  freeTier: {
    dailyLimits: DEFAULT_DAILY_LIMITS,
    watermarkOnExport: true,
  },
  plans: PLANS,
};

export default {
  DEFAULT_CREDIT_COSTS,
  DEFAULT_DAILY_LIMITS,
  PLANS,
  CREDIT_SYSTEM,
};
