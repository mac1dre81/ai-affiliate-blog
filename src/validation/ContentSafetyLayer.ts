// src/validation/ContentSafetyLayer.ts
// Safety and quality checks for AI-generated content.

import type { GenerationIssue, ValidationResult } from '@/ai/types';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import * as axe from 'axe-core';

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

// Initialize DOMPurify with a DOM implementation for Node.js
const window = new JSDOM('').window;
const domPurify = DOMPurify(window as any);

export class ContentSafetyLayer {
  constructor(public safetyLevel: SafetyLevel = 'strict') {}

  async validateGeneration(content: string): Promise<SafetyResult> {
    const issues: GenerationIssue[] = [];

    // 1) Sanitize with DOMPurify (removes unsafe elements/attributes)
    const sanitized = this.sanitizeWithDOMPurify(content);
    const sanitizationIssues = await this.checkSanitizationDifference(content, sanitized);
    issues.push(...sanitizationIssues);

    // 2) Malicious code detection
    const malicious = await this.checkForMaliciousCode(sanitized);
    issues.push(...malicious);

    // 3) Axe-core accessibility checks
    const a11yFromAxe = await this.checkAccessibilityWithAxe(sanitized);
    issues.push(...a11yFromAxe);

    // 4) Policy moderation placeholder (extensible)
    const policy = await this.moderateContentPolicy(sanitized);
    issues.push(...policy);

    // 5) Copyright heuristics placeholder
    const copyright = await this.ensureCopyrightCompliance(sanitized);
    issues.push(...copyright);

    // 6) Additional accessibility & SEO regex heuristics
    const a11y = await this.verifyAccessibility(sanitized);
    issues.push(...a11y);

    const passed = issues.every((i) => i.severity !== 'high');
    const aiFixable = issues.filter((i) => i.aiFixable).map((i) => i.suggestedFix || i.message);

    return {
      passed,
      issues,
      aiFixesAvailable: aiFixable,
      confidenceScore: passed ? 0.95 : (issues.filter((i) => i.severity === 'high').length === 0 ? 0.75 : 0.4),
    };
  }

  /**
   * Sanitize HTML with DOMPurify to remove unsafe elements and attributes.
   */
  sanitizeWithDOMPurify(content: string): string {
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span',
        'button', 'form', 'input', 'label', 'select', 'textarea', 'section', 'article',
        'header', 'footer', 'nav', 'aside', 'main'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'id', 'class', 'style', 'data-*', 'aria-label',
        'aria-labelledby', 'aria-describedby', 'role', 'type', 'name', 'placeholder',
        'disabled', 'required', 'readonly'
      ],
      KEEP_CONTENT: true,
    };
    return domPurify.sanitize(content, config);
  }

  /**
   * Check if sanitization removed significant content.
   */
  async checkSanitizationDifference(original: string, sanitized: string): Promise<GenerationIssue[]> {
    if (original === sanitized) {
      return [];
    }

    // If more than 20% of content was removed, flag it
    const originalLen = original.length;
    const sanitizedLen = sanitized.length;
    const removedPercent = ((originalLen - sanitizedLen) / originalLen) * 100;

    if (removedPercent > 20) {
      return [
        {
          id: 'sanitization-removed-content',
          type: 'security',
          message: `Sanitization removed ~${Math.round(removedPercent)}% of content (likely unsafe elements).`,
          severity: 'medium',
          aiFixable: true,
          suggestedFix: 'Review and remove unsafe HTML elements. Rebuild the content safely.',
        }
      ];
    }

    return [];
  }

  /**
   * Run axe-core accessibility audit on generated HTML.
   */
  async checkAccessibilityWithAxe(content: string): Promise<GenerationIssue[]> {
    const issues: GenerationIssue[] = [];

    try {
      const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`);
      const doc = dom.window.document;

      // axe.run is async and requires a configuration
      const results = await new Promise<any>((resolve, reject) => {
        axe.run(doc as any, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      // Process violations
      if (results?.violations?.length) {
        for (const violation of results.violations) {
          issues.push({
            id: `axe-${violation.id}`,
            type: 'accessibility',
            message: `[axe-core] ${violation.description}`,
            severity: violation.impact === 'critical' || violation.impact === 'serious' ? 'high' : 'medium',
            aiFixable: true,
            suggestedFix: `Fix accessibility violation: ${violation.help}`,
          });
        }
      }
    } catch (e) {
      // If axe fails, skip this check and log (don't fail the whole validation)
      // eslint-disable-next-line no-console
      console.warn('axe-core validation error:', e);
    }

    return issues;
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
