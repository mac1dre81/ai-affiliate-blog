#!/bin/bash
# Netlify Deployment Preparation Script
# This script helps prepare your application for Netlify deployment

set -e

echo "🚀 Preparing AI Affiliate Blog for Netlify Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required files exist
echo "📋 Checking required files..."
REQUIRED_FILES=("package.json" "next.config.mjs" "netlify.toml")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        exit 1
    fi
done
echo ""

# Check if .env.local exists and warn
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local found${NC}"
    echo "   This file should NOT be committed to git."
    echo "   Make sure it's in .gitignore"
    echo ""
fi

# Check Node version
echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -ge 20 ]; then
    echo -e "${GREEN}✓${NC} Node.js version: v$NODE_VERSION (OK)"
else
    echo -e "${RED}✗${NC} Node.js version: v$NODE_VERSION (Need v20+)"
    exit 1
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Run linting
echo "🔍 Running linter..."
if npm run lint; then
    echo -e "${GREEN}✓${NC} Linting passed"
else
    echo -e "${RED}✗${NC} Linting failed - fix errors before deploying"
    exit 1
fi
echo ""

# Type checking
echo "🔍 Running type check..."
if npm run typecheck; then
    echo -e "${GREEN}✓${NC} Type checking passed"
else
    echo -e "${RED}✗${NC} Type checking failed - fix errors before deploying"
    exit 1
fi
echo ""

# Run tests
echo "🧪 Running tests..."
if npm test; then
    echo -e "${GREEN}✓${NC} Tests passed"
else
    echo -e "${YELLOW}⚠️${NC} Some tests failed - review before deploying"
fi
echo ""

# Test build
echo "🏗️  Testing production build..."
if npm run build; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed - fix errors before deploying"
    exit 1
fi
echo ""

# Security audit
echo "🔒 Running security audit..."
if npm audit --audit-level=high; then
    echo -e "${GREEN}✓${NC} No high-severity vulnerabilities"
else
    echo -e "${YELLOW}⚠️${NC} Vulnerabilities found - review npm audit output"
fi
echo ""

# Check for secrets in code
echo "🔐 Checking for potential secrets in code..."
SECRET_PATTERNS=("sk-" "pk_" "whsec_" "mongodb+srv://" "redis://")
FOUND_SECRETS=0
for pattern in "${SECRET_PATTERNS[@]}"; do
    if git grep -n "$pattern" -- ':!*.md' ':!*.example' ':!*.sample' ':!scripts/*' 2>/dev/null; then
        FOUND_SECRETS=1
        echo -e "${RED}⚠️  Potential secret found: $pattern${NC}"
    fi
done
if [ $FOUND_SECRETS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No obvious secrets found in code"
else
    echo -e "${RED}✗${NC} Potential secrets detected - review before deploying"
    echo "   Secrets should be in environment variables, not code"
fi
echo ""

# Summary
echo "=================================================="
echo "✅ Pre-deployment checks complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Set up external services (if not done):"
echo "      • Upstash Redis: https://upstash.com"
echo "      • MongoDB Atlas: https://mongodb.com/atlas"
echo "   "
echo "   2. Push to GitHub:"
echo "      git add ."
echo "      git commit -m 'feat: prepare for Netlify deployment'"
echo "      git push origin main"
echo "   "
echo "   3. Import to Netlify:"
echo "      • Go to https://app.netlify.com"
echo "      • Click 'Add new site' → 'Import an existing project'"
echo "      • Select your repository"
echo "      • Add environment variables (see NETLIFY_DEPLOYMENT.md)"
echo "      • Deploy!"
echo ""
echo "📖 Full deployment guide: NETLIFY_DEPLOYMENT.md"
echo ""
echo "🎉 Ready to deploy to Netlify!"
echo "=================================================="
