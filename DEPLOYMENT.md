# Deployment Readiness & Runbook

This document captures the deployment checklist, commands, CI example, smoke tests, and rollback procedures for this project.

**Checklist**

- **Code Quality:**
  - Passed tests: false — add/enable tests and CI.
  - TypeScript compiles: run `npm run build:full` or `npm run build` to verify.
  - Linting passed: run `npm run lint`.
  - No critical vulnerabilities: run `npm audit` and remediate.

- **Performance:**
  - Lighthouse score: run Lighthouse locally or CI (target: >= 90 for key pages).
  - Bundle size: measure via `next build` output or `next-bundle-analyzer` (target depends on feature set).
  - Image optimization: ensure `next/image` usage and remote patterns in `next.config.mjs`.

- **Security:**
  - Env variables secured: ensure no secrets are committed; use platform secrets (Vercel, GitHub Actions secrets).
  - Secrets not committed: remove `.env.local` from git and rotate any exposed keys.
  - Dependency audit clean: run `npm audit` regularly.

## Pre-Deployment Commands (PowerShell)

Install dependencies (clean):
```powershell
npm ci
```

Run lint:
```powershell
npm run lint
```

Run production build (Next.js):
```powershell
npm run build
```

Run multi-target TypeScript build (library output):
```powershell
npm run build:full
```

Audit dependencies:
```powershell
npm audit
npm audit fix
```

Quick smoke checks (local server must be running via `npm run dev` or after `npm start`):
```powershell
# Homepage
Invoke-WebRequest -UseBasicParsing http://localhost:3000
# Posts API
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/posts
# AI generation endpoint (use test key or mock)
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/ai/generate
```

## Remove local env from git (if present) and ignore it

If `.env.local` is committed or tracked, remove it from the index and add to `.gitignore`:

```powershell
# stop tracking .env.local and add to .gitignore
git rm --cached .env.local
Add-Content -Path .gitignore -Value ".env.local"
git add .gitignore
git commit -m "chore: remove .env.local from repo and add to .gitignore"
```

If any real secrets were committed, rotate them immediately at the provider (OpenAI key, DB credentials).

## Smoke Tests (post-deploy)

- `GET /` — homepage returns 200 and expected title.
- `GET /api/posts` — returns 200 and JSON array.
- `POST /api/ai/generate` — returns 200 and generation result (use staging key).
- Render sample post page: `GET /posts/<example-slug>` — returns 200.

Create a small script (optional) to run these checks as part of release verification.

## Rollback Procedures

- Preferred: use hosting provider rollback (Vercel: promote previous deployment).
- Alternative: Git revert deploy commit and re-deploy:

```powershell
# revert last deploy commit locally and push
git revert <deploy-commit-sha>
git push origin main
```

- If database migrations are involved:
  - Keep backups prior to running migrations.
  - Design forward/backward compatible migrations when possible.

## CI / Example GitHub Actions (minimal)

Create `.github/workflows/ci.yml` (example):

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm audit --audit-level=moderate || true
```

Add relevant secrets to repository settings (e.g., `OPENAI_API_KEY`, `DATABASE_URL`) and do not put them in code or `.env` files.

## Monitoring & Observability (recommended)

- Error tracking: Sentry or similar (integrate server + client).
- Uptime checks: UptimeRobot, Upptime, or provider built-ins.
- Performance: Lighthouse CI and Vercel Analytics.

## Post-Deployment Validation

- Run smoke tests and sample user flows (create post, run AI generation, verify affiliate links).
- Monitor errors and key metrics for a few hours after deploy.

## Contacts & Notes

- Use provider docs for deployment-specific steps (Vercel, Netlify, or custom host).
- For Next.js standalone output, verify Docker or server start commands if not using Vercel.

---

If you'd like, I can also:
- Add the `.github/workflows/ci.yml` file configured above.
- Add a small `scripts/smoke-test.js` script and a `package.json` `smoke` script.
- Remove `.env.local` from git history (requires force-push; I can show steps).
