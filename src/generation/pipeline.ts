// src/generation/pipeline.ts
// Core website generation flow: prompt -> stream -> parse -> validate -> return

import env from '@/lib/env-config';
import generateAIStream from '@/ai/router';
import ContentSafetyLayer from '@/validation/ContentSafetyLayer';
import type {
  AIGenerationRequest,
  AIModel,
  AIOperation,
  AIStream,
  AIResponseChunk,
  UserPreferences,
  WebsiteSnapshot,
  Website,
  ValidationResult,
  GenerationIssue,
} from '@/ai/types';

function buildWebsitePrompt(description: string, preferences: UserPreferences): string {
  const reqs = [
    'Generate valid, modern HTML/CSS/JS',
    'Ensure WCAG 2.1 AA compliance',
    'Mobile-first responsive design',
    'Performance-optimized (LCP < 2.5s)',
    'SEO-friendly structure',
    'Cross-browser compatible',
    'Clean, maintainable code',
  ];

  const pref = `\nUser Preferences:\n- Design Style: ${preferences.designStyle}\n- Content Tone: ${preferences.contentTone}\n- Performance Priority: ${preferences.performancePriority}`;
  const brand = preferences.brand
    ? `\nBrand:\n- Name: ${preferences.brand.name ?? 'n/a'}\n- Primary: ${preferences.brand.primaryColor ?? 'n/a'}\n- Secondary: ${preferences.brand.secondaryColor ?? 'n/a'}\n- Font: ${preferences.brand.typography?.fontFamily ?? 'system'}`
    : '';

  return `You are a professional web developer creating production websites.\nRequirements:\n- ${reqs.join('\n- ')}\n\nProject Description:\n${description}\n${pref}${brand}\n\nOutput HTML/CSS/JS suitable for immediate use. Include <!-- COMPLETE --> at the end.`;
}

async function parseAIResponse(stream: AIStream): Promise<{ html: string; tokenCount: number }> {
  let html = '';
  let tokenCount = 0;

  for await (const chunk of stream) {
    if (chunk.type === 'error') {
      // Surface the error into the HTML to avoid silent failures (safe-escaped in router fallback).
      html += `\n<!-- ERROR: ${chunk.content} -->`;
      break;
    }
    if (chunk.type === 'token' || chunk.type === 'text') {
      // Accumulate tokens and text into a single HTML output buffer.
      html += chunk.content ?? '';
      tokenCount += (chunk.tokens ?? 1);
      // Stop on explicit completion marker if present
      if (chunk.content?.includes('<!-- COMPLETE -->') || chunk.done) break;
    }
  }

  // Basic cleanup: ensure we don't keep the completion marker in final output
  html = html.replace(/<!-- COMPLETE -->/g, '').trim();

  // If the AI did not return a full document, wrap with a minimal HTML scaffold
  const hasHtml = /<html[\s>]/i.test(html);
  if (!hasHtml) {
    html = [
      '<!doctype html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="utf-8"/>',
      '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
      '<title>Generated Site</title>',
      '</head>',
      '<body>',
      '<main>',
      html || '<h1>New Site</h1><p>No content produced.</p>',
      '</main>',
      '</body>',
      '</html>',
    ].join('\n');
  }

  return { html, tokenCount };
}

export interface GenerateWebsiteOptions {
  model?: AIModel;
  operation?: AIOperation; // default generatePage
  safetyLevel?: 'strict' | 'moderate' | 'minimal';
}

export interface GenerateWebsiteResult {
  website: Website;
  validation: ValidationResult;
  issues: GenerationIssue[];
}

export async function generateWebsiteWithAI(
  description: string,
  preferences: UserPreferences,
  snapshot: WebsiteSnapshot | null = null,
  options: GenerateWebsiteOptions = {}
): Promise<GenerateWebsiteResult> {
  const { model = 'auto', operation = 'generatePage', safetyLevel = 'strict' } = options;

  const prompt = buildWebsitePrompt(description, preferences);

  const req: AIGenerationRequest = {
    prompt,
    context: {
      currentDesign: snapshot,
      userPreferences: preferences,
      constraints: [
        { type: 'a11y' },
        { type: 'performance', details: { budget: 'LCP<2.5s' } },
        { type: 'seo' },
        { type: 'brand', details: { preserve: true } },
        { type: 'budget', details: { tokens: 'auto' } },
      ],
    },
    model,
    stream: true,
    operation,
  };

  const stream = await generateAIStream(req);
  const { html, tokenCount } = await parseAIResponse(stream);

  const website: Website = {
    pages: [
      {
        id: 'index',
        path: '/',
        title: 'Home',
        html,
      },
    ],
    assets: { images: [] },
    theme: snapshot?.theme,
    metadata: {
      generatedBy: 'AI',
      model,
      tokensUsed: tokenCount,
      confidence: 0.8,
      createdAt: new Date().toISOString(),
    },
  };

  const validator = new ContentSafetyLayer(safetyLevel);
  const validation: ValidationResult = await validator.validateGeneration(html);

  return {
    website,
    validation,
    issues: validation.issues,
  };
}

export default generateWebsiteWithAI;
