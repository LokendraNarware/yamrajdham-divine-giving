#!/bin/bash

# Vercel Deployment Preparation Script
# This script ensures a clean build before deployment

echo "🧹 Cleaning build artifacts..."

# Remove Next.js build cache
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Removed .next directory"
fi

# Remove TypeScript build info
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm -f tsconfig.tsbuildinfo
    echo "✅ Removed tsconfig.tsbuildinfo"
fi

# Remove node_modules and reinstall (optional - uncomment if needed)
# echo "🔄 Reinstalling dependencies..."
# rm -rf node_modules
# pnpm install

echo "🔨 Running type check..."
pnpm run type-check

echo "🔨 Running build..."
pnpm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for Vercel deployment."
    echo ""
    echo "Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Fix: Clear build cache'"
    echo "2. Push to main: git push origin main"
    echo "3. Vercel will automatically redeploy"
    echo ""
    echo "If deployment still fails:"
    echo "1. Go to Vercel dashboard"
    echo "2. Clear build cache in project settings"
    echo "3. Redeploy with 'Use existing Build Cache' unchecked"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
