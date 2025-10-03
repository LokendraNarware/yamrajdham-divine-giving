#!/bin/bash

# Deployment Script for yamrajdham.com
# This script helps deploy the Next.js application to production

echo "🚀 Starting deployment process for yamrajdham.com..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it with production credentials."
    echo "📝 See PRODUCTION_DEPLOYMENT_GUIDE.md for details."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Type check
echo "🔍 Running type check..."
pnpm type-check

# Lint check
echo "🧹 Running lint check..."
pnpm lint

# Build the application
echo "🏗️  Building the application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "📝 Vercel CLI not found. Please install it first:"
    echo "   npm i -g vercel"
    echo "   Then run: vercel --prod"
fi

echo "🎉 Deployment process completed!"
echo "📋 Next steps:"
echo "   1. Configure your domain in Vercel dashboard"
echo "   2. Update DNS settings"
echo "   3. Test the live site"
echo "   4. Verify payment integration"
