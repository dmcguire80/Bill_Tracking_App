---
name: Firebase Hosting Deployment
description: Complete guide for deploying React/Vite applications to Firebase Hosting with GitHub Actions CI/CD, including migration from self-hosted setups
---

# Firebase Hosting Deployment Skill

## Overview

This skill provides step-by-step guidance for deploying web applications to Firebase Hosting, setting up automated deployments with GitHub Actions, and migrating from self-hosted infrastructure.

## When to Use This Skill

- Deploying a new React/Vite/static web application
- Migrating from self-hosted (Nginx, Apache) to Firebase Hosting
- Setting up CI/CD for Firebase deployments
- Eliminating authentication layers (like Cloudflare Access)
- Reducing hosting costs to $0/month

## Prerequisites

- Firebase project created
- GitHub repository for your application
- Node.js application with build script
- (Optional) Custom domain

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## Step 2: Initialize Firebase Hosting

In your project directory:

```bash
firebase init hosting
```

**Prompts:**
- Use existing project? **Yes** → Select your Firebase project
- Public directory? **dist** (or `build` for Create React App)
- Single-page app? **Yes**
- Set up automatic builds? **No** (we'll use GitHub Actions)
- Overwrite index.html? **No**

## Step 3: Configure firebase.json

Create or update `firebase.json` with optimized caching:

```json
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
```

**Key points:**
- `public`: Directory containing built files
- `rewrites`: Enable client-side routing
- `headers`: Optimize caching (1 year for assets, no cache for HTML)

## Step 4: Test Local Deployment

```bash
npm run build
firebase deploy --only hosting
```

You'll get a URL like: `https://your-project.web.app`

Test the deployment to ensure everything works.

## Step 5: Set Up GitHub Actions

### Create Firebase Service Account

**Option A: CI Token (Quick)**
```bash
firebase login:ci
```
Copy the entire token output.

**Option B: Service Account (Recommended)**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download JSON file
4. Copy entire JSON contents

### Add GitHub Secret

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Paste token or JSON
5. Click "Add secret"

### Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    tags:
      - 'v*'
  # Optional: deploy on push to main
  # push:
  #   branches: [main]

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
          # Add more as needed
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

### Add Project ID Secret

1. Go to GitHub repo → Settings → Secrets
2. Add `FIREBASE_PROJECT_ID` with your Firebase project ID

## Step 6: Add Custom Domain (Optional)

### In Firebase Console

1. Go to Hosting → Add custom domain
2. Enter your domain (e.g., `app.yourdomain.com`)
3. Copy the DNS records provided

### In DNS Provider (e.g., Cloudflare)

**For A Records:**
```
Type: A
Name: app (or subdomain)
Value: [Firebase IP from console]
Proxy: DNS only (gray cloud, not orange)
```

**For CNAME:**
```
Type: CNAME
Name: app
Value: your-project.web.app
Proxy: DNS only
```

**Critical:** Proxy must be OFF (DNS only) for SSL provisioning

### Wait for SSL

- DNS propagation: 5-30 minutes
- SSL provisioning: 15-30 minutes
- Check Firebase Console for status

## Common Patterns

### Environment Variables

**Build-time variables (Vite):**
```bash
# .env
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-key
```

**In GitHub Actions:**
```yaml
- name: Build Application
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
  run: npm run build
```

### Multiple Environments

**Preview deployments:**
```yaml
- name: Deploy to Preview Channel
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: '${{ secrets.GITHUB_TOKEN }}'
    firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
    channelId: preview-${{ github.event.pull_request.number }}
    projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

**Production vs Staging:**
Use different Firebase projects and conditionally deploy based on branch.

## Migration from Self-Hosted

### Before Migration

1. **Test Firebase deployment** at `your-project.web.app`
2. **Verify all features work**
3. **Keep self-hosted running** during migration

### DNS Migration

1. **Update DNS** to point to Firebase
2. **Wait for propagation** (5-30 minutes)
3. **Verify** custom domain works
4. **Decommission** self-hosted server

### Rollback Plan

If issues occur:
1. Revert DNS to self-hosted IP
2. Wait for propagation
3. Self-hosted is back online

## Troubleshooting

### "No currently active project"

```bash
firebase use your-project-id
```

Or add `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### "Invalid service account"

- Verify `FIREBASE_SERVICE_ACCOUNT` secret is set correctly
- Ensure entire token/JSON was copied
- Try regenerating the service account

### "DNS verification failed"

- Check DNS records match Firebase exactly
- Ensure proxy is OFF (DNS only)
- Wait 5-10 minutes and retry
- Use `dig your-domain.com` to verify DNS

### "SSL certificate pending"

- Can take up to 24 hours
- Ensure proxy is OFF in DNS settings
- Check Firebase Console for status

### GitHub Actions runner issues

If you have a self-hosted runner registered:
```bash
# List runners
gh api repos/OWNER/REPO/actions/runners

# Remove runner
gh api -X DELETE repos/OWNER/REPO/actions/runners/RUNNER_ID
```

## Cost Analysis

### Firebase Hosting Free Tier
- Storage: 10 GB
- Bandwidth: 360 MB/day (~10.8 GB/month)
- Custom domain: Included
- SSL: Free

### Typical Usage (Small App)
- App size: 2-5 MB
- Daily visits: 10-100 users
- Monthly bandwidth: 100 MB - 5 GB
- **Cost: $0/month**

### If You Exceed Free Tier
- Storage: $0.026/GB
- Bandwidth: $0.15/GB
- Even with 1000 users/day: ~$5-10/month

## Best Practices

### 1. Optimize Build Size

```bash
# Analyze bundle
npm run build -- --analyze

# Code splitting
import { lazy } from 'react';
const Component = lazy(() => import('./Component'));
```

### 2. Use Caching Headers

Already included in firebase.json template above.

### 3. Enable Compression

Firebase automatically serves gzipped content.

### 4. Security Rules

If using Firestore/Storage, set proper security rules:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Monitor Usage

- Firebase Console → Usage and billing
- Set up budget alerts
- Monitor bandwidth usage

## Quick Reference

### Manual Deployment
```bash
npm run build
firebase deploy --only hosting
```

### Deploy Specific Project
```bash
firebase deploy --only hosting --project your-project-id
```

### Deploy to Preview Channel
```bash
firebase hosting:channel:deploy preview-name
```

### View Deployment History
```bash
firebase hosting:releases:list
```

### Rollback Deployment
```bash
# In Firebase Console → Hosting → Release history
# Click "Rollback" on previous version
```

## Example Projects

### React + Vite + Firebase Auth

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

**deploy.yml:**
```yaml
name: Deploy
on:
  push:
    tags: ['v*']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

## Resources

- **Firebase Hosting Docs:** https://firebase.google.com/docs/hosting
- **GitHub Action:** https://github.com/FirebaseExtended/action-hosting-deploy
- **Custom Domains:** https://firebase.google.com/docs/hosting/custom-domain
- **CLI Reference:** https://firebase.google.com/docs/cli

## Summary

Firebase Hosting provides:
- ✅ Free hosting for small apps
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Easy CI/CD with GitHub Actions
- ✅ Custom domains
- ✅ Rollback support
- ✅ Zero maintenance

Perfect for:
- React/Vue/Angular apps
- Static sites
- JAMstack applications
- Personal projects
- Small business apps
