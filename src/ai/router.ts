// src/ai/router.ts
// Provider-agnostic AI stream router with resilience and fallback.

import env from '@/lib/env-config';
import type { AIGenerationRequest, AIModel, AIStream, AIResponseChunk } from '@/ai/types';
import { AIRobustnessLayer } from '@/ai/recovery';
import { isOpenAIEnabled, generateStreamWithOpenAI } from '@/ai/providers/openai';

const isServer = typeof window === 'undefined';

// Lazy provider check to avoid importing packages when disabled
async function isGeminiEnabled(): Promise<boolean> {
  return isServer && env.ENABLE_GEMINI === true && !!env.GOOGLE_API_KEY;
}

async function generateStreamWithGemini(req: AIGenerationRequest): Promise<AIStream> {
  if (!(await isGeminiEnabled())) throw new Error('Gemini is disabled or not configured');
  // Avoid importing provider SDK before dependencies are added.
  // This is a placeholder that should be replaced with a real streaming adapter.
  async function* stream() {
    yield { type: 'error', content: 'Gemini adapter not yet implemented', done: true } as AIResponseChunk;
  }
  return stream();
}

function isModelOpenAI(model: AIModel): boolean {
  return (
    model === 'auto' ||
    model === 'gpt-4o-mini' ||
    model === 'gpt-4.1' ||
    model === 'gpt-4o'
  );
}

function isModelGemini(model: AIModel): boolean {
  return model === 'gemini-1.5-flash' || model === 'gemini-1.5-pro';
}

// Create a safe fallback stream to keep UX responsive when providers fail
function createFallbackStream(message: string): AIStream {
  async function* stream() {
    yield { type: 'text', content: '<!-- FALLBACK START -->\n' } as AIResponseChunk;
    yield { type: 'text', content: '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n<title>AI Generation Unavailable</title>\n</head>\n<body>\n<main>\n<h1>AI generation temporarily unavailable</h1>\n<p>' + message.replace(/</g, '&lt;') + '</p>\n</main>\n</body>\n</html>\n' } as AIResponseChunk;
    yield { type: 'text', content: '<!-- COMPLETE -->', done: true } as AIResponseChunk;
  }
  return stream();
}

export async function generateStream(req: AIGenerationRequest): Promise<AIStream> {
  if (!isServer) throw new Error('AI router must run on server only');

  const providerOp = async () => {
    // Provider selection
    if (isModelOpenAI(req.model) && isOpenAIEnabled()) {
      return await generateStreamWithOpenAI(req);
    }
    if (isModelGemini(req.model) && (await isGeminiEnabled())) {
      return await generateStreamWithGemini(req);
    }

    // Auto routing: prefer OpenAI if enabled, else Gemini
    if (req.model === 'auto') {
      if (isOpenAIEnabled()) return await generateStreamWithOpenAI(req);
      if (await isGeminiEnabled()) return await generateStreamWithGemini(req);
    }

    throw new Error('No AI provider available for requested model');
  };

  const fallback = async () => createFallbackStream('No provider available or provider failure. Please retry.');

  // Integrate recovery for provider selection/initialization. Note that errors during iteration must be handled by adapters.
  return AIRobustnessLayer.withAIRecovery<AIStream>(providerOp, fallback, {
    maxRetries: 2,
    onDowngrade: async () => {
      // Downgrade policy: if requested model isn't available, force auto and retry selection
      const downgraded: AIGenerationRequest = { ...req, model: 'auto' };
      try {
        return await providerOp.apply(null, [downgraded] as any);
      } catch (_) {
        return fallback();
      }
    },
    findSimilarCachedResult: async () => null, // hook into KV cache here later
    logAIError: (error, attempt) => {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`[AI Router] attempt ${attempt} error:`, error);
      }
    },
  });
}

export default generateStream;
