# Firebase Hosting Deployment Standards

## Overview

This document defines the standards and best practices for deploying applications to Firebase Hosting across all projects.

## Project Structure

### Required Files

```
project-root/
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project mapping
├── .github/
│   └── workflows/
│       └── deploy.yml     # Deployment workflow
└── dist/                  # Build output directory
```

### Firebase Configuration (`firebase.json`)

**Standard configuration:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [{"key": "Cache-Control", "value": "no-cache, no-store, must-revalidate"}]
      }
    ]
  }
}
```

**Key points:**
- `public`: Always use `dist` for Vite projects, `build` for CRA
- Include caching headers for performance
- Enable SPA routing with rewrites

## GitHub Actions Workflow

### Standard Workflow Structure

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- Tag pushes (`v*`) for production deployments
- Optional: Main branch pushes for continuous deployment

**Jobs:**
1. Checkout code
2. Setup Node.js (version 20)
3. Install dependencies (`npm ci`)
4. Build application
5. Deploy to Firebase Hosting

### Required Secrets

All projects must have these GitHub secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON or CI token | `firebase login:ci` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console |
| Environment variables | App-specific env vars | Varies by project |

## Deployment Process

### Manual Deployment

```bash
# 1. Build the application
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting
```

### Automated Deployment

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically deploy
```

## Environment Variables

### Build-Time Variables

**Vite projects:**
- Prefix: `VITE_`
- Example: `VITE_API_URL`, `VITE_API_KEY`

**Create React App:**
- Prefix: `REACT_APP_`
- Example: `REACT_APP_API_URL`

**In GitHub Actions:**
```yaml
- name: Build Application
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
  run: npm run build
```

## Custom Domains

### DNS Configuration

**Standard setup:**
1. Add custom domain in Firebase Console
2. Get DNS records (A or CNAME)
3. Add to DNS provider
4. **Critical:** Set proxy to "DNS only" (not proxied)
5. Wait for SSL provisioning (15-30 minutes)

### Naming Convention

- Production: `app.domain.com` or `domain.com`
- Staging: `staging.domain.com`
- Preview: `preview.domain.com`

## Security Standards

### Firestore Rules

Always deploy security rules with hosting:

```json
{
  "hosting": {...},
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### Environment Variables

- ✅ **DO:** Store secrets in GitHub Secrets
- ✅ **DO:** Use build-time environment variables
- ❌ **DON'T:** Commit secrets to repository
- ❌ **DON'T:** Hardcode API keys

### CORS Configuration

If using Firebase Functions:

```javascript
const cors = require('cors')({
  origin: [
    'https://your-app.web.app',
    'https://your-app.firebaseapp.com',
    'https://your-custom-domain.com'
  ]
});
```

## Performance Standards

### Build Optimization

**Target metrics:**
- Initial bundle size: < 500 KB
- Time to Interactive: < 3 seconds
- Lighthouse score: > 90

**Optimization techniques:**
- Code splitting
- Lazy loading
- Tree shaking
- Asset compression

### Caching Strategy

**Static assets (JS, CSS, images):**
- Cache-Control: `max-age=31536000` (1 year)
- Immutable filenames (hash-based)

**HTML files:**
- Cache-Control: `no-cache, no-store, must-revalidate`
- Always fetch fresh

## Monitoring & Alerts

### Firebase Console

Monitor these metrics:
- Bandwidth usage
- Storage usage
- Request count
- Error rate

### Budget Alerts

Set up billing alerts:
- Warning: 50% of expected usage
- Critical: 80% of expected usage

### Uptime Monitoring

Use external monitoring:
- UptimeRobot
- Pingdom
- Firebase Performance Monitoring

## Cost Management

### Free Tier Limits

- Storage: 10 GB
- Bandwidth: 360 MB/day (~10.8 GB/month)
- Custom domain: Unlimited
- SSL: Free

### Cost Optimization

1. **Optimize bundle size** - Reduce bandwidth
2. **Enable caching** - Reduce requests
3. **Compress assets** - Reduce bandwidth
4. **Monitor usage** - Catch spikes early

## Rollback Procedures

### Via Firebase Console

1. Go to Hosting → Release history
2. Find previous version
3. Click "Rollback"
4. Confirm rollback

### Via CLI

```bash
# View release history
firebase hosting:releases:list

# Rollback not directly supported
# Deploy previous version instead
git checkout <previous-tag>
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on routes | Missing rewrites | Add SPA rewrite rule |
| SSL error | Proxy enabled | Disable proxy in DNS |
| Build fails | Missing env vars | Add to GitHub Secrets |
| Deployment fails | Invalid service account | Regenerate token |

### Debug Commands

```bash
# Check Firebase project
firebase use

# View deployment logs
firebase hosting:releases:list

# Test locally
firebase serve

# Validate firebase.json
firebase deploy --only hosting --dry-run
```

## Migration Checklist

When migrating from self-hosted to Firebase:

- [ ] Create Firebase project
- [ ] Install Firebase CLI
- [ ] Initialize Firebase Hosting
- [ ] Configure firebase.json
- [ ] Set up GitHub Actions
- [ ] Add GitHub Secrets
- [ ] Test deployment at .web.app URL
- [ ] Configure custom domain
- [ ] Update DNS records
- [ ] Wait for SSL provisioning
- [ ] Verify production deployment
- [ ] Decommission old infrastructure

## Best Practices

### Development Workflow

1. **Local development:** Use Vite/CRA dev server
2. **Testing:** Deploy to preview channel
3. **Staging:** Deploy to staging domain
4. **Production:** Deploy via tags

### Version Control

- Tag all production releases
- Use semantic versioning (v1.0.0)
- Include release notes
- Document breaking changes

### Documentation

Each project should have:
- README with deployment instructions
- Environment variable documentation
- Custom domain setup guide
- Troubleshooting section

## Templates

All templates are available in:
`.agent/skills/firebase-hosting-deployment/templates/`

- `deploy.yml` - GitHub Actions workflow
- `firebase.json` - Firebase configuration
- `.firebaserc` - Project mapping
- `setup-firebase.sh` - Automated setup script

## Quick Start

For new projects:

```bash
# Copy setup script
cp .agent/skills/firebase-hosting-deployment/templates/setup-firebase.sh .

# Run setup
chmod +x setup-firebase.sh
./setup-firebase.sh your-project-id

# Follow the prompts
```

## Support Resources

- **Internal:** `.agent/skills/firebase-hosting-deployment/SKILL.md`
- **Firebase Docs:** https://firebase.google.com/docs/hosting
- **GitHub Actions:** https://github.com/FirebaseExtended/action-hosting-deploy
- **Cloudflare DNS:** `.agent/skills/firebase-hosting-deployment/cloudflare-dns-setup.md`

## Approval & Updates

**Last Updated:** 2026-02-02
**Approved By:** dmcguire80
**Next Review:** As needed

**Change Log:**
- 2026-02-02: Initial standards document created based on Bill Tracker migration
