#!/bin/bash

# Linear Budget - Update Script
# Usage: ./scripts/update.sh

echo "🔄 Starting Update..."

# 1. Pull latest code
echo "⬇️  Pulling from GitHub..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing Dependencies..."
npm install

# 3. Build Static App
echo "🏗️  Building Application..."
npm run build

# 4. Deploy to Nginx (Modify path if needed)
WEB_ROOT="/var/www/html"

if [ -d "$WEB_ROOT" ]; then
    echo "🚀 Deploying to $WEB_ROOT..."
    rm -rf $WEB_ROOT/*
    cp -r dist/* $WEB_ROOT/
    echo "✅ Update Complete! Application is live."
else
    echo "⚠️  Warning: $WEB_ROOT not found. Build is in 'dist/' but was not deployed."
fi
