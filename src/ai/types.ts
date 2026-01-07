/**
 * Core AI and website generation type contracts.
 * These are framework-agnostic and safe to import on both server and client
 * for types only. Runtime AI providers must remain server-only.
 */

// Supported AI providers and models
export type AIProvider = 'openai' | 'gemini' | 'anthropic';

export type AIModel =
  | 'auto'
  | 'gpt-4o-mini'
  | 'gpt-4.1'
  | 'gpt-4o'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus';

// Operations used for credit accounting and routing
export type AIOperation =
  | 'generatePage'
  | 'generateComponent'
  | 'contentRewrite'
  | 'designSuggestion'
  | 'codeOptimization';

export type DesignStyle = 'minimal' | 'bold' | 'corporate' | 'creative';
export type ContentTone = 'formal' | 'casual' | 'technical' | 'friendly';
export type PerformancePriority = 'max' | 'balanced' | 'features';

export interface UserPreferences {
  designStyle: DesignStyle;
  contentTone: ContentTone;
  performancePriority: PerformancePriority;
  brand?: {
    name?: string;
    primaryColor?: string;
    secondaryColor?: string;
    typography?: {
      fontFamily?: string;
      scale?: 'majorThird' | 'perfectFourth' | 'goldenRatio' | 'system';
    };
    logoUrl?: string;
  };
}

export interface ThemeTokens {
  colors: Record<string, string>; // e.g., { primary: '#...', text: '#...' }
  typography: {
    fontFamily: string;
    scale: 'majorThird' | 'perfectFourth' | 'goldenRatio' | 'system';
  };
  spacingScale?: number[]; // e.g., [0,4,8,12,16,...]
}

export interface WebsitePageSnapshot {
  id: string;
  path: string; // "/", "/about"
  title?: string;
  // html/css/js used for static variants; for React export we store component descriptors
  html?: string;
  css?: string;
  js?: string;
}

export interface WebsiteAssetsSnapshot {
  images: { path: string; width?: number; height?: number; format?: 'webp' | 'png' | 'jpg' | 'svg' }[];
  fonts?: { family: string; url?: string; weight?: number | string }[];
  other?: { path: string; type: string }[];
}

export interface WebsiteSnapshot {
  pages: WebsitePageSnapshot[];
  assets: WebsiteAssetsSnapshot;
  theme?: ThemeTokens;
  // user overrides applied on top of AI generations
  overrides?: Record<string, unknown>;
}

export type DesignConstraintType = 'a11y' | 'performance' | 'seo' | 'brand' | 'budget';

export interface DesignConstraint {
  type: DesignConstraintType;
  details?: Record<string, unknown>;
}

export interface AIGenerationContext {
  currentDesign: WebsiteSnapshot | null;
  userPreferences: UserPreferences;
  constraints: DesignConstraint[];
}

export interface AIGenerationRequest {
  prompt: string;
  context: AIGenerationContext;
  model: AIModel; // use 'auto' to let router decide
  stream: boolean; // enable streaming for UX
  operation: AIOperation;
}

export type AIResponseChunkType = 'text' | 'json' | 'token' | 'error';

export interface AIResponseChunk {
  type: AIResponseChunkType;
  content: string; // token/text/json-stringified
  done?: boolean;
  tokens?: number; // number of tokens in this chunk
  provider?: AIProvider;
  model?: AIModel;
}

export type AIStream = AsyncIterable<AIResponseChunk>;

// Generated website types (post-parse)
export interface WebsitePage {
  id: string;
  path: string;
  title?: string;
  html?: string;
  css?: string;
  js?: string;
}

export interface WebsiteAssets {
  images: { path: string; width?: number; height?: number; format?: 'webp' | 'png' | 'jpg' | 'svg' }[];
  fonts?: { family: string; url?: string; weight?: number | string }[];
  other?: { path: string; type: string }[];
}

export interface Website {
  pages: WebsitePage[];
  assets: WebsiteAssets;
  theme?: ThemeTokens;
  metadata?: GenerationMetadata;
}

export interface GenerationIssue {
  id: string;
  type: 'html' | 'accessibility' | 'performance' | 'security' | 'seo' | 'cross-browser';
  message: string;
  severity: 'low' | 'medium' | 'high';
  aiFixable?: boolean;
  suggestedFix?: string;
}

export interface ValidationResult {
  passed: boolean;
  issues: GenerationIssue[];
  aiFixesAvailable: string[];
  confidenceScore?: number; // 0..1 heuristic
}

export interface AISuggestion {
  id: string;
  title: string;
  rationale: string;
  alternatives?: string[];
  diffPreview?: string; // textual diff summary
}

export interface GenerationMetadata {
  generatedBy: 'AI' | 'user' | 'mixed';
  model?: AIModel;
  provider?: AIProvider;
  tokensUsed?: number;
  confidence?: number;
  createdAt?: string;
}

// Utility type guards
export const isStreamDone = (c: AIResponseChunk) => c.done === true;
