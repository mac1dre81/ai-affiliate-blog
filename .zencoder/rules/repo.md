---
description: Repository Information Overview
alwaysApply: true
---

# AI Affiliate Blog Information

## Summary
A modern blog platform built with **Next.js 15** (App Router), featuring **autonomous article generation** via OpenAI and **affiliate marketing** with **automated price tracking**. It uses **MongoDB** with Mongoose for data persistence and **Tailwind CSS** for styling.

## Structure
- `src/app/`: Next.js App Router pages, including API routes (`/api/ai`, `/api/posts`).
- `src/components/`: Reusable UI components (e.g., `BlogEditor`, `AffiliateProductCard`).
- `src/lib/`: Core logic for AI generation, blog management, and database connection.
- `src/models/`: Mongoose schemas for `Post` and `AffiliateProduct`.
- `src/types/`: TypeScript type definitions.
- `scripts/`: Utility and automation scripts (`automate.ts`, `smoke-test.js`).
- `public/`: Static assets.

## Language & Runtime
**Language**: TypeScript  
**Version**: Node.js >=20.0.0  
**Build System**: Next.js (SWC)  
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- `next`: ^15.4.4
- `react` & `react-dom`: ^19.1.0
- `mongoose`: ^8.16.5
- `openai`: ^5.10.2
- `tailwindcss`: ^3.4.17
- `react-hook-form`: ^7.61.1

**Development Dependencies**:
- `typescript`: ^5.8.3
- `eslint` & `eslint-config-next`: ^15.4.4
- `jest`: ^29.7.0
- `ts-node`: ^10.9.2
- `tsc-alias`: ^1.8.7

## Build & Installation
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Multi-target TypeScript build (library output)
npm run build:full
```

## Autonomous Operations
- **Automation Script**: `npm run automate` triggers `scripts/automate.ts` which:
  1. Updates prices for all tracked `AffiliateProduct` models.
  2. Generates a new blog post featuring products from a random category.
- **Standalone Output**: Configured in `next.config.mjs` for optimized deployment (e.g., Docker).
- **Environment**: Requires `OPENAI_API_KEY`, `DATABASE_URL`, and `DATABASE_NAME`.
- **Vercel**: Configuration present in `vercel.json`.

## Testing & Validation
**Framework**: Jest (installed but not fully configured with a `test` script).
**Validation**: Basic endpoint checks via `scripts/smoke-test.js`.
**Linting**: ESLint configured with Next.js defaults.

**Run Automation Task**:
```bash
npm run automate
```

**Run Smoke Tests**:
```bash
# Requires local server running
npm run smoke
```

**Run Linting**:
```bash
npm run lint
```
