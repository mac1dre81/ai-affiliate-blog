# 🚀 Quick Start: Deploy to Netlify in 10 Minutes

This is the fastest way to get your AI Affiliate Blog live on Netlify.

## Prerequisites (2 minutes)

1. ✅ GitHub account with this repository
2. ✅ Netlify account (free signup at https://netlify.com)
3. ✅ OpenAI API key (get at https://platform.openai.com/api-keys)

## Step 1: Set Up Free External Services (5 minutes)

### A. Upstash Redis (Required - 2 minutes)
1. Go to https://console.upstash.com/login
2. Sign up/login with GitHub
3. Click "Create Database"
   - Name: `ai-blog-redis`
   - Type: Regional
   - Region: (choose closest to you)
4. Copy the connection string (looks like: `rediss://default:xxx@xxx.upstash.io:6379`)

### B. MongoDB Atlas (Required - 3 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google/GitHub for speed)
3. Create FREE cluster:
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region closest to you
   - Click "Create Cluster"
4. Create database user:
   - Security → Database Access → Add New User
   - Username: `aiuser`
   - Password: (generate and save it)
   - Click "Add User"
5. Whitelist all IPs:
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere"
   - Add `0.0.0.0/0`
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the string (looks like: `mongodb+srv://aiuser:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at end: `mongodb+srv://aiuser:yourpass@cluster.mongodb.net/ai-blog`

## Step 2: Generate Session Secret (30 seconds)

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - you'll need it as `SESSION_SECRET`.

## Step 3: Deploy to Netlify (3 minutes)

### A. Import Your Repository
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify (if first time)
5. Select your repository: `ai-affiliate-blog`
6. Keep default settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### B. Add Environment Variables

Click "Show advanced" → "Add environment variable" and add these:

**Required (7 variables):**

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `NEXT_PUBLIC_APP_URL` | Your Netlify URL | `https://your-site.netlify.app` |
| `APP_URL` | Same as above | `https://your-site.netlify.app` |
| `SITE_URL` | Same as above | `https://your-site.netlify.app` |
| `OPENAI_API_KEY` | Your OpenAI key | `sk-proj-abc123...` |
| `DATABASE_URL` | Your MongoDB URL | `mongodb+srv://user:pass@...` |
| `REDIS_URL` | Your Upstash URL | `rediss://default:xxx@...` |
| `SESSION_SECRET` | Generated secret | `abc123def456...` |
| `ENABLE_OPENAI` | `true` | `true` |

**Quick Copy Format:**
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
APP_URL=https://your-site.netlify.app
SITE_URL=https://your-site.netlify.app
OPENAI_API_KEY=sk-proj-your-key-here
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/ai-blog
REDIS_URL=rediss://default:password@endpoint.upstash.io:6379
SESSION_SECRET=your-generated-secret-here
ENABLE_OPENAI=true
```

### C. Deploy!
1. Click "Deploy [your-site-name]"
2. Wait 2-5 minutes
3. Your site will be live! 🎉

## Step 4: Verify Deployment (1 minute)

1. Visit your site: `https://your-site-name.netlify.app`
2. Test health endpoint: `https://your-site-name.netlify.app/api/health`
3. Should see:
   ```json
   {
     "status": "ok",
     "redis": { "status": "healthy" }
   }
   ```

✅ **Success!** Your site is live.

## Next Steps

### Update Site URL (After First Deploy)
1. Note your actual Netlify URL: `https://[random-name].netlify.app`
2. Go to Site Settings → Environment Variables
3. Update these three variables with your actual URL:
   - `NEXT_PUBLIC_APP_URL`
   - `APP_URL`
   - `SITE_URL`
4. Trigger new deploy: Deploys → Trigger deploy → Deploy site

### Add Custom Domain (Optional)
1. Site Settings → Domain management → Add custom domain
2. Follow DNS instructions
3. Update environment variables with new domain
4. Redeploy

### Enable Billing Features (Optional)
If you want to use Stripe billing:
1. Get Stripe keys from https://dashboard.stripe.com/apikeys
2. Add to Netlify environment variables:
   ```
   ENABLE_STRIPE=true
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Set up webhook: Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://your-site.netlify.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `charge.refunded`
4. Copy webhook secret and update `STRIPE_WEBHOOK_SECRET`
5. Redeploy

## Troubleshooting

### Build Failed
- Check Netlify build logs for specific error
- Most common: Missing environment variables
- Solution: Add all required variables and redeploy

### Site Shows 404
- Clear cache: Deploy Settings → Clear cache and retry
- Check `netlify.toml` is committed to repository

### "Cannot connect to database"
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `DATABASE_URL` format and password
- Test connection with MongoDB Compass

### "Redis connection failed"
- The app works without Redis (rate limiting disabled)
- Verify `REDIS_URL` from Upstash dashboard
- Check if database is active

### Function Timeout (AI Generation)
- Free tier has 10-second timeout
- Solutions:
  - Upgrade to Pro ($19/mo) for 26s timeout
  - Use faster AI model (gpt-3.5-turbo)
  - Reduce max_tokens in generation settings

## Costs

**Free Tier Limits:**
- Netlify: 100GB bandwidth/month, 300 build minutes
- Upstash Redis: 10,000 commands/day
- MongoDB Atlas: 512MB storage
- OpenAI: Pay per use (~$0.002 per request)

**Typical Monthly Costs (small site):**
- Netlify: $0 (free tier)
- Upstash: $0 (free tier)
- MongoDB: $0 (free tier)
- OpenAI: $5-20 (depends on usage)
- **Total: $5-20/month**

## Monitoring

Set up basic monitoring:
1. **Uptime**: Use https://uptimerobot.com (free)
   - Add monitor: `https://your-site.netlify.app/api/health`
2. **Errors**: Check Netlify function logs daily
3. **Usage**: Monitor Netlify dashboard for bandwidth

## Support

- 📖 Full guide: `NETLIFY_DEPLOYMENT.md`
- 📋 Environment variables: `NETLIFY_ENV_VARS.md`
- 🔧 Troubleshooting: See full deployment guide
- 💬 Netlify Support: https://answers.netlify.com

---

## 🎉 That's It!

Your AI Affiliate Blog is now live on Netlify. Share your site and start creating content!

**Site URL**: `https://your-site-name.netlify.app`

For continuous deployment, every push to `main` branch will automatically deploy. 🚀