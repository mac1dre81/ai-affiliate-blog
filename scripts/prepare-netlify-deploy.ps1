# Netlify Deployment Preparation Script (PowerShell)
# This script helps prepare your application for Netlify deployment

$ErrorActionPreference = "Stop"

Write-Host "🚀 Preparing AI Affiliate Blog for Netlify Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if required files exist
Write-Host "📋 Checking required files..." -ForegroundColor Yellow
$requiredFiles = @("package.json", "next.config.mjs", "netlify.toml")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Check if .env.local exists and warn
if (Test-Path ".env.local") {
    Write-Host "⚠️  Warning: .env.local found" -ForegroundColor Yellow
    Write-Host "   This file should NOT be committed to git." -ForegroundColor Yellow
    Write-Host "   Make sure it's in .gitignore" -ForegroundColor Yellow
    Write-Host ""
}

# Check Node version
Write-Host "🔍 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = (node -v) -replace 'v', '' -split '\.' | Select-Object -First 1
    if ([int]$nodeVersion -ge 20) {
        Write-Host "✓ Node.js version: v$nodeVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js version: v$nodeVersion (Need v20+)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Node.js not found or error checking version" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm ci
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    Write-Host "   Try running: npm install" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Run linting
Write-Host "🔍 Running linter..." -ForegroundColor Yellow
try {
    npm run lint
    Write-Host "✓ Linting passed" -ForegroundColor Green
} catch {
    Write-Host "✗ Linting failed - fix errors before deploying" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Type checking
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
try {
    npm run typecheck
    Write-Host "✓ Type checking passed" -ForegroundColor Green
} catch {
    Write-Host "✗ Type checking failed - fix errors before deploying" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
try {
    npm test
    Write-Host "✓ Tests passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Some tests failed - review before deploying" -ForegroundColor Yellow
}
Write-Host ""

# Test build
Write-Host "🏗️  Testing production build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✓ Build successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Build failed - fix errors before deploying" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Security audit
Write-Host "🔒 Running security audit..." -ForegroundColor Yellow
try {
    npm audit --audit-level=high
    Write-Host "✓ No high-severity vulnerabilities" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vulnerabilities found - review npm audit output" -ForegroundColor Yellow
}
Write-Host ""

# Check for secrets in code
Write-Host "🔐 Checking for potential secrets in code..." -ForegroundColor Yellow
$secretPatterns = @("sk-", "pk_", "whsec_", "mongodb+srv://", "redis://")
$foundSecrets = $false
foreach ($pattern in $secretPatterns) {
    $results = git grep -n $pattern -- ':!*.md' ':!*.example' ':!*.sample' ':!scripts/*' 2>$null
    if ($results) {
        $foundSecrets = $true
        Write-Host "⚠️  Potential secret found: $pattern" -ForegroundColor Red
    }
}
if (-not $foundSecrets) {
    Write-Host "✓ No obvious secrets found in code" -ForegroundColor Green
} else {
    Write-Host "✗ Potential secrets detected - review before deploying" -ForegroundColor Red
    Write-Host "   Secrets should be in environment variables, not code" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Set up external services (if not done):" -ForegroundColor White
Write-Host "      • Upstash Redis: https://upstash.com" -ForegroundColor White
Write-Host "      • MongoDB Atlas: https://mongodb.com/atlas" -ForegroundColor White
Write-Host "   " -ForegroundColor White
Write-Host "   2. Push to GitHub:" -ForegroundColor White
Write-Host "      git add ." -ForegroundColor Gray
Write-Host "      git commit -m 'feat: prepare for Netlify deployment'" -ForegroundColor Gray
Write-Host "      git push origin main" -ForegroundColor Gray
Write-Host "   " -ForegroundColor White
Write-Host "   3. Import to Netlify:" -ForegroundColor White
Write-Host "      • Go to https://app.netlify.com" -ForegroundColor White
Write-Host "      • Click 'Add new site' → 'Import an existing project'" -ForegroundColor White
Write-Host "      • Select your repository" -ForegroundColor White
Write-Host "      • Add environment variables (see NETLIFY_DEPLOYMENT.md)" -ForegroundColor White
Write-Host "      • Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full deployment guide: NETLIFY_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Ready to deploy to Netlify!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
