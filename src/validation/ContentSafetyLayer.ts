// src/validation/ContentSafetyLayer.ts
// Safety and quality checks for AI-generated content.

import type { GenerationIssue, ValidationResult } from '@/ai/types';

export type SafetyLevel = 'strict' | 'moderate' | 'minimal';

export interface SafetyResult extends ValidationResult {}

const INLINE_SCRIPT_RE = /<script[\s>]|on[a-z]+\s*=\s*(["']).*?\1/gi;
const JS_URL_RE = /\b(?:javascript:|data:text\/html)/i;
const EXTERNAL_UNSAFE_RE = /https?:\/\/[^\s"']+\.(?:exe|js|bat|cmd|sh)(?:\?.*)?\b/i;

const A11Y_ISSUES_RE = [
  { re: /<img\b(?![^>]*\balt=)/i, message: 'Image missing alt attribute' },
  { re: /<button\b(?![^>]*\baria-label=|[^>]*>\s*[^<]+)/i, message: 'Button lacks accessible label' },
  { re: /<a\b(?![^>]*\bhref=)/i, message: 'Anchor tag missing href' },
];

const SEO_ISSUES_RE = [
  { re: /<title>\s*<\/title>/i, message: 'Empty <title>' },
  { re: /<meta\s+name=["']description["']\s*(?![^>]*content=)/i, message: 'Meta description missing content' },
];

export class ContentSafetyLayer {
  constructor(public safetyLevel: SafetyLevel = 'strict') {}

  async validateGeneration(content: string): Promise<SafetyResult> {
    const issues: GenerationIssue[] = [];

    // 1) Malicious code detection
    const malicious = await this.checkForMaliciousCode(content);
    issues.push(...malicious);

    // 2) Policy moderation placeholder (extensible)
    const policy = await this.moderateContentPolicy(content);
    issues.push(...policy);

    // 3) Copyright heuristics placeholder
    const copyright = await this.ensureCopyrightCompliance(content);
    issues.push(...copyright);

    // 4) Accessibility & SEO heuristics
    const a11y = await this.verifyAccessibility(content);
    issues.push(...a11y);

    const passed = issues.every((i) => i.severity === 'low');
    const aiFixable = issues.filter((i) => i.aiFixable).map((i) => i.suggestedFix || i.message);

    return {
      passed,
      issues,
      aiFixesAvailable: aiFixable,
      confidenceScore: passed ? 0.9 : 0.6,
    };
  }

  async checkForMaliciousCode(content: string): Promise<GenerationIssue[]> {
    const issues: GenerationIssue[] = [];

    if (INLINE_SCRIPT_RE.test(content)) {
      issues.push({
        id: 'unsafe-inline',
        type: 'security',
        message: 'Inline <script> or event handlers detected. Disallowed under CSP.',
        severity: 'high',
        aiFixable: true,
        suggestedFix: 'Remove inline scripts and on* handlers. Use external scripts with nonce/CSP and add listeners via JS.'
      });
    }

    if (JS_URL_RE.test(content)) {
      issues.push({
        id: 'js-url',
        type: 'security',
        message: 'javascript: or data:text/html URLs detected. These are unsafe.',
        severity: 'high',
        aiFixable: true,
        suggestedFix: 'Replace javascript: links with proper event handlers and safe URLs.'
      });
    }

    if (EXTERNAL_UNSAFE_RE.test(content)) {
      issues.push({
        id: 'external-exe',
        type: 'security',
        message: 'Links to potentially dangerous binary or script files detected.',
        severity: 'high',
        aiFixable: true,
        suggestedFix: 'Remove unsafe external links and host vetted assets only.'
      });
    }

    return issues;
  }

  async moderateContentPolicy(_content: string): Promise<GenerationIssue[]> {
    // Placeholder for provider moderation APIs; this returns no issues at this time.
    return [];
  }

  async ensureCopyrightCompliance(_content: string): Promise<GenerationIssue[]> {
    // Placeholder: In a real system, scan for embedded copyrighted text/images without license.
    return [];
  }

  async verifyAccessibility(content: string): Promise<GenerationIssue[]> {
    const issues: GenerationIssue[] = [];

    for (const rule of A11Y_ISSUES_RE) {
      if (rule.re.test(content)) {
        issues.push({
          id: `a11y-${rule.message.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'accessibility',
          message: rule.message,
          severity: this.safetyLevel === 'strict' ? 'medium' : 'low',
          aiFixable: true,
          suggestedFix: `Fix accessibility issue: ${rule.message}`,
        });
      }
    }

    for (const rule of SEO_ISSUES_RE) {
      if (rule.re.test(content)) {
        issues.push({
          id: `seo-${rule.message.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'seo',
          message: rule.message,
          severity: 'low',
          aiFixable: true,
          suggestedFix: `Fix SEO issue: ${rule.message}`,
        });
      }
    }

    return issues;
  }
}

export default ContentSafetyLayer;
