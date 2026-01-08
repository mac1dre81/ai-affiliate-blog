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
- **Vercel** (recommended for Next.js)
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
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
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

See `PRODUCTION_READY.md` for complete feature summary.
