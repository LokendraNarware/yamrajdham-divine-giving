# Production Deployment Guide for yamrajdham.com

## Environment Variables for Production

Create a `.env.production` file (never commit this to git):

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://dxdfgaymlhcqxjsuwhoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZGZnYXltbGhjcXhqc3V3aG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjA1NzYsImV4cCI6MjA3NDIzNjU3Nn0.nqFqNySt2GMN-LAqfDUiW-UtcpeF1iDAsF_T8SJeMSE

# Cashfree API Credentials (Production)
# Replace with your actual production credentials
CASHFREE_APP_ID=your_production_cashfree_app_id
CASHFREE_SECRET_KEY=your_production_cashfree_secret_key
CASHFREE_ENVIRONMENT=production
CASHFREE_WEBHOOK_SECRET=your_production_webhook_secret

# Site Configuration (Production)
NEXT_PUBLIC_SITE_URL=https://yamrajdham.com
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# Additional Production Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## DNS Configuration

### For Vercel Deployment:

1. **Add Domain in Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add `yamrajdham.com`
   - Add `www.yamrajdham.com`

2. **DNS Records to Add:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### For Custom Hosting:

1. **Point DNS to your hosting provider**
2. **Configure SSL certificate**
3. **Set up redirects from www to non-www (or vice versa)**

## Pre-Deployment Checklist

- [ ] Update Cashfree credentials to production
- [ ] Test payment flow in sandbox mode
- [ ] Verify all environment variables
- [ ] Check Supabase production settings
- [ ] Test admin dashboard functionality
- [ ] Verify email configurations
- [ ] Test donation flow end-to-end

## Post-Deployment Steps

1. **Verify Domain:**
   - Test https://yamrajdham.com loads correctly
   - Check SSL certificate is active
   - Test all major pages

2. **Payment Testing:**
   - Test donation flow with small amount
   - Verify webhook endpoints work
   - Check admin dashboard shows transactions

3. **SEO Setup:**
   - Submit sitemap to Google Search Console
   - Verify meta tags and structured data
   - Test page speed and Core Web Vitals

4. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor payment success rates
   - Track user analytics

## Security Considerations

- [ ] Enable HTTPS only
- [ ] Set secure headers (already configured in next.config.ts)
- [ ] Validate all user inputs
- [ ] Secure admin routes
- [ ] Regular security updates

## Backup Strategy

- [ ] Database backups (Supabase handles this)
- [ ] Code repository backups
- [ ] Environment variable backups (secure storage)
- [ ] Payment transaction logs
