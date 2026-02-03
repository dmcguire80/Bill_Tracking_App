#!/bin/bash

# Firebase Hosting Quick Setup Script
# Usage: ./setup-firebase.sh <project-id>

set -e

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
    echo "Usage: ./setup-firebase.sh <firebase-project-id>"
    echo "Example: ./setup-firebase.sh my-awesome-app"
    exit 1
fi

echo "🚀 Setting up Firebase Hosting for project: $PROJECT_ID"
echo ""

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
fi

# Create .firebaserc
echo "📝 Creating .firebaserc..."
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF

# Create firebase.json if it doesn't exist
if [ ! -f firebase.json ]; then
    echo "📝 Creating firebase.json..."
    cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
EOF
else
    echo "⚠️  firebase.json already exists, skipping..."
fi

# Create GitHub Actions workflow directory
mkdir -p .github/workflows

# Create deploy workflow if it doesn't exist
if [ ! -f .github/workflows/deploy.yml ]; then
    echo "📝 Creating .github/workflows/deploy.yml..."
    cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Firebase Hosting

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  deploy:
    name: Deploy to Firebase Hosting
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        env:
          # Add your environment variables here
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
EOF
else
    echo "⚠️  .github/workflows/deploy.yml already exists, skipping..."
fi

echo ""
echo "✅ Firebase Hosting setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Add GitHub Secrets:"
echo "   - FIREBASE_SERVICE_ACCOUNT (run: firebase login:ci)"
echo "   - FIREBASE_PROJECT_ID (value: $PROJECT_ID)"
echo "   - Any environment variables your app needs"
echo ""
echo "2. Test deployment:"
echo "   npm run build"
echo "   firebase deploy --only hosting"
echo ""
echo "3. Push to GitHub and create a tag:"
echo "   git add ."
echo "   git commit -m 'feat: add Firebase Hosting deployment'"
echo "   git push"
echo "   git tag v1.0.0"
echo "   git push origin v1.0.0"
echo ""
echo "🎉 Your app will be deployed to: https://$PROJECT_ID.web.app"
