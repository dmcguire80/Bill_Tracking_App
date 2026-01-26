#!/bin/bash

# Linear Budget - Update Script
# Usage: ./scripts/update.sh

echo "🔄 Starting Update..."

# 1. Pull latest code (Skip if in CI environment)
if [ "$CI" = "true" ]; then
    echo "🤖 Running in CI: Skipping git pull (Runner manages checkout)"
else
    echo "⬇️  Pulling from GitHub..."
    git pull origin main
fi

# 2. Install dependencies
echo "📦 Installing Dependencies..."
npm install

# 3. Build Static App
echo "🏗️  Building Application..."
npm run build

# 4. Deploy to Nginx
WEB_ROOT="/var/www/html"

if [ -d "$WEB_ROOT" ]; then
    echo "🚀 Deploying to $WEB_ROOT..."
    # Ensure dist exists
    if [ ! -d "dist" ]; then
        echo "❌ Error: 'dist' directory not found after build!"
        exit 1
    fi
    
    rm -rf $WEB_ROOT/*
    cp -r dist/* $WEB_ROOT/
    echo "✅ Update Complete! Application is live at $WEB_ROOT"
else
    echo "❌ Error: $WEB_ROOT not found. Cannot deploy."
    echo "   Verify your Nginx root directory."
    exit 1
fi
