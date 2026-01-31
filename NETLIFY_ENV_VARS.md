# Netlify Environment Variables Checklist

Copy and paste these into Netlify's environment variables section.
Replace placeholder values with your actual credentials.

## 🔴 Required Variables

### Application URLs
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
APP_URL=https://your-site-name.netlify.app
SITE_URL=https://your-site-name.netlify.app
```

### OpenAI (Required for AI generation)
```
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Database (MongoDB Atlas)
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ai-blog?retryWrites=true&w=majority
DATABASE_NAME=ai-blog
```

### Redis (Upstash - for rate limiting)
```
REDIS_URL=rediss://default:your-password@your-endpoint.upstash.io:6379
```

### Session Security
```
SESSION_SECRET=generate-a-random-32-character-string-here
```

## 🟡 Optional Variables (Stripe Billing)

Only add these if you're using the billing features:

```
ENABLE_STRIPE=true
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🟡 Optional Variables (Error Tracking)

Add these if you want error tracking with GlitchTip or Sentry:

```
GLITCHTIP_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@glitchtip.com/1
NEXT_PUBLIC_GLITCHTIP_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@glitchtip.com/1
```

Or for Sentry:
```
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o0.ingest.sentry.io/0000000
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o0.ingest.sentry.io/0000000
```

## 🟢 Optional Variables (Other AI Providers)

Only add if you want to use additional AI providers:

### Google Gemini
```
ENABLE_GEMINI=true
GOOGLE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Anthropic Claude
```
ENABLE_ANTHROPIC=true
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📝 How to Add Variables in Netlify

### Method 1: Netlify UI
1. Go to your site dashboard
2. Click "Site settings"
3. Click "Environment variables" in the left sidebar
4. Click "Add a variable" for each one
5. Enter the key and value
6. Click "Create variable"

### Method 2: Netlify CLI
```bash
netlify env:set VARIABLE_NAME "variable_value"
```

Example:
```bash
netlify env:set NODE_ENV "production"
netlify env:set OPENAI_API_KEY "sk-proj-abc123..."
netlify env:set DATABASE_URL "mongodb+srv://user:pass@cluster.mongodb.net/ai-blog"
netlify env:set REDIS_URL "rediss://default:pass@endpoint.upstash.io:6379"
netlify env:set NEXT_PUBLIC_APP_URL "https://your-site.netlify.app"
netlify env:set ENABLE_OPENAI "true"
netlify env:set SESSION_SECRET "your-random-32-char-string"
```

### Method 3: Bulk Import
1. Create a file with all variables (one per line, KEY=VALUE format)
2. In Netlify UI, click "Import from a .env file"
3. Paste or upload your file
4. Review and save

## 🔐 Security Notes

1. **Never commit these values to Git**
   - Keep `.env.local` in `.gitignore`
   - Use `.env.sample` for documentation only

2. **Use production keys**
   - Replace all `test` keys with `live` keys for production
   - Keep test keys for preview deployments

3. **Rotate secrets regularly**
   - Change `SESSION_SECRET` every 3-6 months
   - Rotate API keys if exposed

4. **Limit access**
   - Only add team members who need access
   - Use Netlify's role-based permissions

## 🧪 Testing Variables

After adding variables, test that they're accessible:

1. Deploy your site
2. Visit: `https://your-site.netlify.app/api/health`
3. Should return:
   ```json
   {
     "status": "ok",
     "redis": {
       "status": "healthy"
     }
   }
   ```

If you see errors:
- Check variable names (case-sensitive)
- Verify values are correct
- Ensure no extra spaces or quotes
- Redeploy after changes

## 📋 Quick Checklist

Before deploying, verify you have:
- [ ] All 7 required variables set
- [ ] URLs point to correct domain
- [ ] OpenAI API key is valid
- [ ] MongoDB connection string works
- [ ] Redis URL is correct
- [ ] SESSION_SECRET is random and secure
- [ ] Stripe keys (if using billing)
- [ ] Error tracking DSN (if using)

## 🔗 Where to Get These Values

| Service | Where to Get It | Free Tier? |
|---------|----------------|------------|
| **MongoDB Atlas** | https://cloud.mongodb.com → Connect → Connection String | ✅ Yes (512MB) |
| **Upstash Redis** | https://console.upstash.com → Your DB → REST API | ✅ Yes (10k/day) |
| **OpenAI** | https://platform.openai.com/api-keys | ❌ Pay-per-use |
| **Stripe** | https://dashboard.stripe.com/apikeys | ✅ Test mode free |
| **GlitchTip** | https://glitchtip.com → Projects → Settings | ✅ Yes (self-hosted) |
| **Sentry** | https://sentry.io → Settings → Projects → Client Keys | ✅ Yes (5k events/mo) |

## 🆘 Troubleshooting

### "Environment variable not found"
- Variable names are case-sensitive
- Ensure no typos
- Redeploy after adding variables

### "Invalid database connection"
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
- Verify username and password in connection string
- Ensure database name is at the end of URL

### "Redis connection failed"
- Verify Upstash Redis URL format
- Check if database is active in Upstash dashboard
- App will work without Redis (rate limiting disabled)

### "OpenAI API error"
- Verify API key is valid
- Check if you have credits in OpenAI account
- Ensure key has correct permissions

---

**Need help?** See `NETLIFY_DEPLOYMENT.md` for full deployment guide.