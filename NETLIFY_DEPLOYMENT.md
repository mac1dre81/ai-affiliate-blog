# Netlify Deployment Guide

This guide walks you through deploying the AI Affiliate Blog to Netlify with all required external services.

## 🎯 Overview

Netlify will host your Next.js application, but you'll need external services for:
- **Redis** → Upstash Redis (free tier available)
- **MongoDB** → MongoDB Atlas (free tier available)
- **Error Tracking** → GlitchTip or Sentry (optional)

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account with this repository
- [ ] Netlify account (free at https://netlify.com)
- [ ] OpenAI API key
- [ ] Stripe account (if using billing features)

## 🚀 Quick Deploy (5 minutes)

### Step 1: Set Up External Services

#### A. Redis (Upstash) - Required for Rate Limiting

1. Go to https://upstash.com and create a free account
2. Create a new Redis database:
   - Name: `ai-blog-redis`
   - Region: Choose closest to your target audience
   - Type: Regional (free tier)
3. Copy the `UPSTASH_REDIS_REST_URL` - you'll need this as `REDIS_URL`

#### B. MongoDB Atlas - Required for Database

1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username + password)
4. Whitelist all IP addresses (0.0.0.0/0) for Netlify functions
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://user:pass@cluster.mongodb.net/ai-blog`

#### C. GlitchTip (Optional) - Error Tracking

1. Go to https://glitchtip.com or use self-hosted Sentry
2. Create a new project
3. Copy the DSN URL (looks like: `https://key@glitchtip.com/project-id`)

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "feat: prepare for Netlify deployment"
   git push origin main
   ```

2. **Import to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Show advanced" and add environment variables (see below)

4. **Add Environment Variables**:
   Click "Add environment variable" and add these one by one:

   **Required:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
   APP_URL=https://your-site-name.netlify.app
   SITE_URL=https://your-site-name.netlify.app
   
   # OpenAI
   OPENAI_API_KEY=sk-...your-openai-key...
   ENABLE_OPENAI=true
   
   # Database
   DATABASE_URL=mongodb+srv://...your-mongodb-url...
   DATABASE_NAME=ai-blog
   
   # Redis (from Upstash)
   REDIS_URL=redis://...your-upstash-url...
   
   # Session
   SESSION_SECRET=generate-random-32-char-string-here
   ```

   **Optional (if using Stripe):**
   ```
   ENABLE_STRIPE=true
   STRIPE_SECRET_KEY=sk_test_...or_sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...or_pk_live_...
   ```

   **Optional (if using error tracking):**
   ```
   GLITCHTIP_DSN=https://...your-dsn...
   NEXT_PUBLIC_GLITCHTIP_DSN=https://...your-dsn...
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Wait 2-5 minutes for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize site**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or press Enter for random name)

4. **Set environment variables**:
   ```bash
   # Set all required variables
   netlify env:set OPENAI_API_KEY "sk-your-key"
   netlify env:set DATABASE_URL "mongodb+srv://..."
   netlify env:set REDIS_URL "redis://..."
   netlify env:set NEXT_PUBLIC_APP_URL "https://your-site.netlify.app"
   netlify env:set NODE_ENV "production"
   netlify env:set ENABLE_OPENAI "true"
   netlify env:set SESSION_SECRET "random-32-char-string"
   
   # Add more as needed
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Step 3: Configure Stripe Webhooks (If Using Billing)

1. Go to your Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-site.netlify.app/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `charge.refunded`
4. Copy the webhook signing secret
5. Add to Netlify environment variables:
   ```bash
   netlify env:set STRIPE_WEBHOOK_SECRET "whsec_..."
   ```
6. Redeploy: `netlify deploy --prod`

### Step 4: Post-Deployment Verification

#### A. Test Health Endpoint
```bash
curl https://your-site.netlify.app/api/health
```
Expected response:
```json
{
  "status": "ok",
  "redis": {
    "status": "healthy"
  }
}
```

#### B. Test Homepage
Visit `https://your-site.netlify.app` in your browser - should load without errors.

#### C. Check Netlify Function Logs
1. Go to Netlify Dashboard → Functions
2. Click on a function to see logs
3. Verify no critical errors

#### D. Run Smoke Tests
```bash
# Install dependencies if needed
npm install

# Update NEXT_PUBLIC_APP_URL in your test script
# Then run smoke tests
npm run smoke
```

## ⚙️ Configuration Details

### Custom Domain Setup

1. In Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Update environment variables:
   ```bash
   netlify env:set NEXT_PUBLIC_APP_URL "https://yourdomain.com"
   netlify env:set APP_URL "https://yourdomain.com"
   netlify env:set SITE_URL "https://yourdomain.com"
   ```
5. Redeploy

### Function Timeouts

⚠️ **Important for AI Generation:**

- **Free tier**: 10-second function timeout
- **Pro tier**: 26-second function timeout
- **Background Functions**: Up to 15 minutes (requires Pro)

If your AI generation takes longer than 10 seconds, you have options:
1. Upgrade to Pro tier ($19/month)
2. Use Background Functions for long-running tasks
3. Implement client-side polling instead of SSE
4. Optimize OpenAI prompts to be faster

### Environment Variable Management

View all variables:
```bash
netlify env:list
```

Update a variable:
```bash
netlify env:set VARIABLE_NAME "new-value"
```

Delete a variable:
```bash
netlify env:unset VARIABLE_NAME
```

**Note:** After changing env vars, you must redeploy for changes to take effect.

## 🔧 Troubleshooting

### Issue: Build Fails with "Module not found"

**Solution:** Ensure all dependencies are in `package.json`:
```bash
npm install --save [missing-package]
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Issue: "Redis connection failed"

**Solutions:**
1. Verify `REDIS_URL` is correct in Netlify environment variables
2. Check Upstash dashboard - ensure database is active
3. Test connection:
   ```bash
   curl -X POST https://your-site.netlify.app/api/health
   ```
4. The app gracefully degrades if Redis is unavailable (rate limiting disabled)

### Issue: "Database connection timeout"

**Solutions:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check `DATABASE_URL` format: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
3. Test connection from MongoDB Compass using same URL
4. Ensure cluster is not paused (Atlas free tier auto-pauses after inactivity)

### Issue: Function Timeout on AI Generation

**Solutions:**
1. Upgrade to Netlify Pro for 26-second timeout
2. Use Background Functions:
   ```javascript
   // In your API route
   export const config = {
     type: 'background'
   };
   ```
3. Optimize OpenAI settings:
   - Reduce `max_tokens`
   - Use `gpt-3.5-turbo` instead of `gpt-4` for speed
   - Implement streaming with smaller chunks

### Issue: Stripe Webhooks Not Working

**Solutions:**
1. Verify webhook endpoint URL in Stripe dashboard
2. Check `STRIPE_WEBHOOK_SECRET` in Netlify env vars
3. Test webhook delivery in Stripe dashboard → Webhooks → Test
4. Check Netlify function logs for errors
5. Ensure webhook events are enabled: `checkout.session.completed`

### Issue: Build Succeeds but Site Shows 404

**Solutions:**
1. Check Netlify build logs for warnings
2. Verify `netlify.toml` is in repository root
3. Ensure Next.js plugin is installed:
   ```bash
   npm install --save-dev @netlify/plugin-nextjs
   ```
4. Check publish directory is set to `.next`

### Issue: Environment Variables Not Working

**Solutions:**
1. Variables must be prefixed with `NEXT_PUBLIC_` for client-side access
2. After adding/changing env vars, trigger a new deploy
3. Clear Netlify cache: Deploy settings → Clear cache and retry deploy
4. Check for typos in variable names (case-sensitive)

## 📊 Monitoring & Maintenance

### Netlify Analytics
Enable in Dashboard → Analytics to track:
- Page views
- Top pages
- Traffic sources
- Function invocations

### Uptime Monitoring
Set up external monitoring (free options):
- **UptimeRobot**: https://uptimerobot.com
- **Better Uptime**: https://betteruptime.com
- **Netlify Deploy Notifications**: Settings → Build & deploy → Deploy notifications

### Error Tracking
Monitor GlitchTip/Sentry dashboard for:
- Server errors
- Client errors
- Performance issues
- User impact

### Cost Monitoring
Monitor usage to stay within free tier limits:
- **Netlify Free Tier**:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - 125k function invocations/month
- **Upstash Redis Free**:
  - 10,000 commands/day
- **MongoDB Atlas M0**:
  - 512MB storage
  - Shared CPU

## 🔄 Continuous Deployment

Every push to `main` branch automatically triggers a new deployment:

1. **Make changes locally**:
   ```bash
   git add .
   git commit -m "feat: your feature"
   git push origin main
   ```

2. **Netlify automatically**:
   - Detects the push
   - Runs CI checks
   - Builds the site
   - Deploys to production

3. **Preview deployments**:
   - Every PR gets a unique preview URL
   - Test changes before merging
   - Automatic cleanup after merge

## 🔐 Security Best Practices

1. **Rotate Secrets Regularly**:
   - Change `SESSION_SECRET` quarterly
   - Rotate API keys if exposed

2. **Enable HTTPS**:
   - Netlify provides free SSL certificates
   - Automatically enabled for custom domains

3. **Set Security Headers**:
   - Already configured in `netlify.toml`
   - Test with: https://securityheaders.com

4. **Monitor Access**:
   - Review Netlify team access
   - Use role-based permissions
   - Enable 2FA for Netlify account

5. **Backup Database**:
   - MongoDB Atlas provides automated backups (Pro tier)
   - Manual export: `mongodump --uri="mongodb+srv://..."`

## 📈 Scaling Considerations

### When to Upgrade Netlify Pro ($19/month)
- Need longer function timeouts (26s vs 10s)
- Exceed 300 build minutes/month
- Need background functions (15min timeout)
- Want advanced analytics

### When to Upgrade Redis
- Exceed 10,000 commands/day
- Need higher availability (>99.9%)
- Want Redis clustering

### When to Upgrade MongoDB
- Exceed 512MB storage
- Need dedicated resources
- Want automated backups
- Need higher IOPS

## 📞 Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Forums**: https://answers.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/integrations/frameworks/next-js
- **Upstash Docs**: https://docs.upstash.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

## ✅ Deployment Checklist

Before going live:
- [ ] All environment variables set in Netlify
- [ ] Redis (Upstash) configured and tested
- [ ] MongoDB Atlas configured and tested
- [ ] Health endpoint returns 200
- [ ] Stripe webhooks configured (if using billing)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error tracking configured
- [ ] Uptime monitoring set up
- [ ] Team access reviewed
- [ ] Backups configured
- [ ] Smoke tests passing
- [ ] Security headers verified

---

## 🎉 You're Ready to Deploy!

Follow the steps above, and you'll have your AI Affiliate Blog live on Netlify in minutes. Good luck! 🚀