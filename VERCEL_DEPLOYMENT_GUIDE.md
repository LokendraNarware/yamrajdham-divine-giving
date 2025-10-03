# Vercel Deployment Guide for Yamraj Dham Divine Giving

## 🚀 Quick Deployment Commands

### Framework Preset Configuration
- **Framework**: Next.js
- **Build Command**: `pnpm build` or `next build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next` (default)
- **Node.js Version**: 20.x

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Before deploying, ensure you have the following environment variables configured in Vercel:

#### Required Environment Variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Cashfree Configuration
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
CASHFREE_ENVIRONMENT=production
CASHFREE_WEBHOOK_SECRET=your_production_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yamrajdham.com
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# System Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Preview Environment Variables (for testing):
```bash
# Use sandbox/test credentials for preview deployments
CASHFREE_ENVIRONMENT=sandbox
CASHFREE_APP_ID=your_test_app_id
CASHFREE_SECRET_KEY=your_test_secret_key
CASHFREE_WEBHOOK_SECRET=your_test_webhook_secret
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

## 🛠️ Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Method 2: Git Integration (Automatic)

1. **Connect your GitHub repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

2. **Automatic deployments**:
   - `main` branch → Production
   - Other branches → Preview deployments

### Method 3: Manual Upload

1. **Build the project locally**:
   ```bash
   pnpm install
   pnpm build
   ```

2. **Upload to Vercel**:
   - Go to Vercel dashboard
   - Click "Deploy"
   - Upload the `.next` folder

## 🔧 Build Configuration

### Package.json Scripts
Your project includes these build scripts:
```json
{
  "scripts": {
    "dev": "rimraf .next && next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "type-check": "tsc --noEmit"
  }
}
```

### Vercel Configuration
The `vercel.json` file includes:
- Framework detection
- Build and install commands
- Security headers
- Caching rules
- Redirects and rewrites

## 🌐 Domain Configuration

### Custom Domain Setup
1. **Add domain in Vercel dashboard**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Update environment variables**:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yamrajdham.com
   ```

## 🔒 Security Configuration

### Headers Applied
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000`

### Caching Rules
- Static assets: 1 year cache
- Next.js assets: 1 year cache

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in performance monitoring
- Real-time analytics
- Error tracking

### Custom Monitoring
- Supabase dashboard for database metrics
- Cashfree dashboard for payment analytics

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build locally
   pnpm build
   
   # Check for TypeScript errors
   pnpm type-check
   
   # Check for linting errors
   pnpm lint
   ```

2. **Environment Variable Issues**:
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no trailing spaces

3. **API Route Issues**:
   - Check function runtime (Node.js 20.x)
   - Verify API routes are in `src/app/api/`
   - Check for proper error handling

### Debug Commands
```bash
# Local development
pnpm dev

# Production build test
pnpm build && pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 📝 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test donation flow end-to-end
- [ ] Check payment processing
- [ ] Verify email notifications
- [ ] Test admin dashboard access
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test all redirects
- [ ] Check performance metrics
- [ ] Verify security headers

## 🔄 Continuous Deployment

### Branch Strategy
- `main` → Production deployment
- `develop` → Preview deployment
- Feature branches → Preview deployments

### Environment Promotion
1. Test in preview environment
2. Merge to `main` branch
3. Automatic production deployment
4. Monitor deployment status

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test locally with production settings
4. Contact Vercel support if needed

---

**Note**: Always test your deployment in preview mode before promoting to production!
