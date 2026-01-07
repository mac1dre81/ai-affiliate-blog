// src/ai/providers/gemini.ts
// Server-only Gemini adapter with safe dynamic import.

import env from '@/lib/env-config';
import type { AIGenerationRequest, AIResponseChunk, AIStream, AIModel } from '@/ai/types';

const isServer = typeof window === 'undefined';

export const isGeminiEnabled = (): boolean => {
  return isServer && env.ENABLE_GEMINI === true && !!env.GOOGLE_API_KEY;
};

const GEMINI_MODEL_MAP: Record<AIModel, string | null> = {
  auto: 'gemini-1.5-flash',
  'gpt-4o-mini': null,
  'gpt-4.1': null,
  'gpt-4o': null,
  'gemini-1.5-flash': 'gemini-1.5-flash',
  'gemini-1.5-pro': 'gemini-1.5-pro',
  'claude-3-5-sonnet': null,
  'claude-3-opus': null,
};

function resolveModel(model: AIModel): string {
  const resolved = GEMINI_MODEL_MAP[model] ?? 'gemini-1.5-flash';
  if (!resolved) throw new Error(`Gemini does not support requested model: ${model}`);
  return resolved;
}

function buildPrompt(req: AIGenerationRequest): string {
  const system = `You are a professional web developer creating production websites.\nRequirements:\n1. Generate valid, modern HTML/CSS/JS\n2. Ensure WCAG 2.1 AA compliance\n3. Mobile-first responsive design\n4. Performance-optimized (LCP < 2.5s)\n5. SEO-friendly structure\n6. Cross-browser compatible\n7. Clean, maintainable code`;
  const context = JSON.stringify(req.context);
  return `${system}\n\nOperation: ${req.operation}\n\nPrompt:\n${req.prompt}\n\nContext JSON:\n${context}\n\nReturn incremental output suitable for streaming. End with <!-- COMPLETE --> when done.`;
}

export async function generateStreamWithGemini(req: AIGenerationRequest): Promise<AIStream> {
  if (!isServer) throw new Error('Gemini adapter must run on server only');
  if (!isGeminiEnabled()) throw new Error('Gemini is disabled or not configured');

  async function* errorStream(msg: string) {
    yield { type: 'error', content: msg, done: true, provider: 'gemini', model: req.model } as AIResponseChunk;
  }

  try {
    // Dynamic import so the project builds without the SDK installed
    const mod = await import('google-generative-ai').catch(() => null);
    if (!mod) return errorStream('Gemini SDK not installed');

    const { GoogleGenerativeAI } = mod as any;
    const client = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
    const modelId = resolveModel(req.model);
    const model = client.getGenerativeModel({ model: modelId });

    const prompt = buildPrompt(req);

    if (req.stream && typeof model?.generateContentStream === 'function') {
      // Streaming path if SDK supports it
      const result = await model.generateContentStream({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      // result.stream is an async iterator of chunks
      // Yield tokens as they arrive
      for await (const chunk of (result as any).stream) {
        const text = chunk?.text ? chunk.text() : chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) {
          yield {
            type: 'token',
            content: text,
            provider: 'gemini',
            model: req.model,
          } as AIResponseChunk;
        }
      }
      yield { type: 'text', content: '<!-- COMPLETE -->', done: true, provider: 'gemini', model: req.model } as AIResponseChunk;
      return;
    }

    // Fallback non-streaming path
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const text = result?.response?.text?.() ?? (result as any)?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (text) {
      yield { type: 'text', content: text, provider: 'gemini', model: req.model } as AIResponseChunk;
    }
    yield { type: 'text', content: '<!-- COMPLETE -->', done: true, provider: 'gemini', model: req.model } as AIResponseChunk;
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Gemini streaming error';
    return errorStream(message);
  }
}

export default generateStreamWithGemini;
