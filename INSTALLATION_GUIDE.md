# Installation & Environment Setup Guide

## Issue: npm install permissions error

If you encounter an EPERM error when running `npm install` or `npm ci`, the npm cache and node_modules are likely corrupted.

### Solution

Run these commands in PowerShell (Administrator mode recommended):

```powershell
# 1. Stop any running Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Navigate to project directory
cd "c:\Users\mac1d\aiblog\ai-affiliate-blog.vercel.app"

# 3. Clear npm cache (aggressive)
npm cache clean --force

# 4. Delete node_modules and lock file (use Shift+Delete for permanent deletion)
rmdir node_modules -Recurse -Force -ErrorAction Continue
Remove-Item package-lock.json -Force -ErrorAction Continue

# 5. Fresh install
npm install

# 6. Verify installation
npm test
npm run typecheck
```

### If PowerShell still has permission issues

Try using Command Prompt (cmd) in Administrator mode instead:

```cmd
cd c:\Users\mac1d\aiblog\ai-affiliate-blog.vercel.app
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
npm test
```

### Expected Output

After successful install:

```bash
npm install
# (installs ~500+ dependencies)

npm test
# Test Suites: 4 passed, 4 total
# Tests: 17 passed, 17 total

npm run typecheck
# No type errors
```

---

## Environment Requirements

- **Node.js**: >=20.0.0 (verify with `node --version`)
- **npm**: >=9.0.0 (verify with `npm --version`)
- **Git**: For version control (optional for local dev)

## Running the Application

```powershell
# Development server (hot reload)
npm run dev
# Visit http://localhost:3000

# Visual Editor demo
# Visit http://localhost:3000/demo/visual-editor

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build
npm start
```

---

## Troubleshooting

### Issue: "Cannot find module 'pino'"
**Solution**: `npm install` didn't complete. Try the cleanup steps above.

### Issue: Antivirus blocking .node files
**Solution**: 
- Temporarily disable real-time scanning during install
- Or add node_modules to antivirus exclusions
- Or use Windows Defender exclusion: `Add-MpPreference -ExclusionPath "C:\Users\mac1d\aiblog"`

### Issue: "ENOTEMPTY: directory not empty"
**Solution**: Use `rm -r node_modules -Force` instead of `rmdir`

---

## Deployment Environment

The application is ready to deploy to:
- **(recommended for Next.js)
- **AWS Amplify**
- **Netlify**
- **Docker/Kubernetes**

Set these environment variables before deploying:

```bash
# Required
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=...

# Optional but recommended
SENTRY_DSN=https://...        # Can point to GlitchTip DSN (Sentry-compatible)
NEXT_PUBLIC_SENTRY_DSN=https://...  # For client-side monitoring (optional)
LOG_LEVEL=info
NODE_ENV=production
```

---

## Next Steps

1. ✅ Run `npm install` in a clean terminal
2. ✅ Verify with `npm test` (17 tests passing)
3. ✅ Start dev server with `npm run dev`
4. ✅ Visit `/demo/visual-editor` to test the UI
5. ✅ Review `PRODUCTION_HARDENING.md` for security features
6. ✅ Review `DEPLOYMENT.md` for deployment checklist
7. ✅ Deploy to your hosting platform

---

**Using GlitchTip (Sentry-compatible) instead of Sentry**

- Overview: GlitchTip implements the Sentry ingestion API and can accept events from existing Sentry SDKs. This repository currently initializes the official `@sentry/nextjs` SDK in `sentry.server.config.ts` and `sentry.client.config.ts`. To send events to GlitchTip you can either use GlitchTip's hosted offering or self-host it and point the DSN at your GlitchTip instance.

- Quick steps (no code changes required):
	1. Sign up for GlitchTip hosted at `https://glitchtip.com` or self-host using their Docker images.
	2. Create a new project in GlitchTip and copy the DSN (it looks like a Sentry DSN: `https://<key>@sentry.example.com/<project>`).
	3. Set the environment variables in your hosting platform or `.env` files:

```bash
# Point existing Sentry SDK to GlitchTip
SENTRY_DSN=https://<key>@glitchtip.example.com/<project>
NEXT_PUBLIC_SENTRY_DSN=https://<key>@glitchtip.example.com/<project>
```

	4. Restart the app. The existing `@sentry/nextjs` initialization will send errors to GlitchTip via the Sentry-compatible endpoint.

- Optional: If you prefer to rename environment variables to `GLITCHTIP_DSN`, update `src/lib/env-config.ts` or `sentry.*.config.ts` to read from `process.env.GLITCHTIP_DSN` and fallback to `SENTRY_DSN`.

- Notes:
  - This approach keeps all current error-capture calls (e.g., `Sentry.captureException`) unchanged.
  - If you later decide to migrate to a different provider (Rollbar/Honeybadger), we can add a small adapter (`src/lib/error-tracker.ts`) to centralize calls and swap providers without changing application code.

**Verifying GlitchTip Integration**

- Start your dev server with the GlitchTip DSN and enable the debug route:

```powershell
$env:GLITCHTIP_DSN='https://your-glitchtip-dsn-here'
$env:DEBUG_ERROR_ROUTE='true'
npm run dev
```

- You should see a console log on startup:
  - `[sentry] initialized with DSN=https://...`

- Call the test endpoint from another terminal:

```powershell
# Without secret (if DEBUG_ERROR_ROUTE_SECRET is not set):
Invoke-RestMethod -Uri 'http://localhost:3001/api/debug/error' -TimeoutSec 10

# With optional secret (if DEBUG_ERROR_ROUTE_SECRET is set):
Invoke-RestMethod -Uri 'http://localhost:3001/api/debug/error' `
  -Headers @{ 'x-debug-secret' = 'your-secret-here' } -TimeoutSec 10
```

- The endpoint returns HTTP 500 with:
  - `{"ok":false,"message":"Error captured (if configured)."}`

- Visit your GlitchTip project dashboard: https://app.glitchtip.com/
  - Look for a new "Test error from /api/debug/error" event (may take a few seconds to appear).

- To run a standalone test of the error-tracker adapter (no Next runtime required):

```powershell
node scripts/test-error-tracker.js
```

This will verify the adapter can capture exceptions and messages.If you'd like, I can: add a short `src/lib/error-tracker.ts` adapter now, or update the repo to read `GLITCHTIP_DSN` as the preferred env var. Which would you prefer?

See `PRODUCTION_READY.md` for complete feature summary.
