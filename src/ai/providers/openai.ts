// src/ai/providers/openai.ts
// Server-only OpenAI adapter with streaming support.

import env from '@/lib/env-config';
import type { AIGenerationRequest, AIResponseChunk, AIStream, AIModel } from '@/ai/types';

const isServer = typeof window === 'undefined';

export const isOpenAIEnabled = (): boolean => {
  return isServer && env.ENABLE_OPENAI === true && !!env.OPENAI_API_KEY;
};

const OPENAI_MODEL_MAP: Record<AIModel, string | null> = {
  auto: 'gpt-4o-mini',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4.1': 'gpt-4.1',
  'gpt-4o': 'gpt-4o',
  'gemini-1.5-flash': null,
  'gemini-1.5-pro': null,
  'claude-3-5-sonnet': null,
  'claude-3-opus': null,
};

function resolveModel(model: AIModel): string {
  const resolved = OPENAI_MODEL_MAP[model] ?? 'gpt-4o-mini';
  if (!resolved) {
    // Model not supported by OpenAI; caller/router should switch provider
    throw new Error(`OpenAI does not support requested model: ${model}`);
  }
  return resolved;
}

function buildMessages(req: AIGenerationRequest) {
  const system = `You are a professional web developer creating production websites.\nRequirements:\n1. Generate valid, modern HTML/CSS/JS\n2. Ensure WCAG 2.1 AA compliance\n3. Mobile-first responsive design\n4. Performance-optimized (LCP < 2.5s)\n5. SEO-friendly structure\n6. Cross-browser compatible\n7. Clean, maintainable code\n\nCurrent project context is provided as JSON.`;
  const contextBlock = JSON.stringify(req.context);
  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `Operation: ${req.operation}\n\nPrompt:\n${req.prompt}\n\nContext JSON:\n\n\n${contextBlock}\n\nReturn incremental output suitable for streaming. End with <!-- COMPLETE --> when done.`,
    },
  ];
}

export async function generateStreamWithOpenAI(req: AIGenerationRequest): Promise<AIStream> {
  if (!isServer) throw new Error('OpenAI adapter must run on server only');
  if (!isOpenAIEnabled()) throw new Error('OpenAI is disabled or not configured');

  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const model = resolveModel(req.model);
  const messages = buildMessages(req) as any[];

  // Create an async generator that yields AIResponseChunk
  async function* stream(): AsyncGenerator<AIResponseChunk> {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        temperature: 0.7,
      } as any);

      // The SDK yields chunks; extract delta content if present
      for await (const chunk of completion as any) {
        const choice = chunk?.choices?.[0];
        const deltaText: string | undefined = choice?.delta?.content || choice?.message?.content || '';
        if (deltaText && deltaText.length > 0) {
          yield {
            type: 'token',
            content: deltaText,
            provider: 'openai',
            model: req.model,
          } satisfies AIResponseChunk;
        }
      }

      // Signal completion
      yield { type: 'text', content: '<!-- COMPLETE -->', done: true, provider: 'openai', model: req.model };
    } catch (error: any) {
      const message = typeof error?.message === 'string' ? error.message : 'OpenAI streaming error';
      yield { type: 'error', content: message, done: true, provider: 'openai', model: req.model };
    }
  }

  return stream();
}

export default generateStreamWithOpenAI;
