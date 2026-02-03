# Firebase Hosting Deployment Skill

Complete guide and templates for deploying web applications to Firebase Hosting with GitHub Actions CI/CD.

## What's Included

### Documentation
- **SKILL.md** - Complete deployment guide with step-by-step instructions
- **STANDARDS.md** - Deployment standards and best practices
- **cloudflare-dns-setup.md** - Detailed Cloudflare DNS configuration guide

### Templates
All templates are in the `templates/` directory:

- **deploy.yml** - GitHub Actions workflow for automated deployment
- **firebase.json** - Firebase Hosting configuration with optimized caching
- **.firebaserc** - Firebase project mapping
- **setup-firebase.sh** - Automated setup script

## Quick Start

### For New Projects

```bash
# 1. Copy the setup script to your project
cp .agent/skills/firebase-hosting-deployment/templates/setup-firebase.sh .

# 2. Make it executable
chmod +x setup-firebase.sh

# 3. Run the setup
./setup-firebase.sh your-firebase-project-id

# 4. Follow the instructions to add GitHub Secrets
```

### Manual Setup

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools
firebase login

# 2. Copy templates
cp .agent/skills/firebase-hosting-deployment/templates/firebase.json .
cp .agent/skills/firebase-hosting-deployment/templates/.firebaserc .
cp .agent/skills/firebase-hosting-deployment/templates/deploy.yml .github/workflows/

# 3. Update .firebaserc with your project ID

# 4. Set up GitHub Secrets:
#    - FIREBASE_SERVICE_ACCOUNT (run: firebase login:ci)
#    - FIREBASE_PROJECT_ID

# 5. Deploy
npm run build
firebase deploy --only hosting
```

## When to Use This Skill

- ✅ Deploying React, Vue, Angular, or static web apps
- ✅ Migrating from self-hosted infrastructure
- ✅ Setting up automated CI/CD deployments
- ✅ Reducing hosting costs to $0/month
- ✅ Eliminating authentication layers (Cloudflare Access, etc.)
- ✅ Adding custom domains with free SSL

## What You'll Get

- **Free hosting** - Firebase free tier is generous
- **Global CDN** - Fast worldwide performance
- **Automatic SSL** - Free HTTPS certificates
- **Easy deployments** - One command or automated via GitHub Actions
- **Rollback support** - Easy to revert deployments
- **Zero maintenance** - Google handles infrastructure

## File Structure

```
.agent/skills/firebase-hosting-deployment/
├── README.md                    # This file
├── SKILL.md                     # Complete deployment guide
├── STANDARDS.md                 # Deployment standards
├── cloudflare-dns-setup.md      # DNS configuration guide
└── templates/
    ├── deploy.yml               # GitHub Actions workflow
    ├── firebase.json            # Firebase configuration
    ├── .firebaserc              # Project mapping
    └── setup-firebase.sh        # Automated setup script
```

## Key Learnings from Bill Tracker Migration

This skill was created based on the successful migration of the Bill Tracking App from self-hosted Nginx to Firebase Hosting:

### Results
- ✅ Eliminated triple authentication (Cloudflare Access + Duo + Firebase Auth → Firebase Auth only)
- ✅ Reduced costs from $5-20/month to $0/month
- ✅ Simplified deployment from multi-step process to single command
- ✅ Improved global performance with CDN
- ✅ Zero maintenance required

### Challenges Solved
- Self-hosted runner conflicts in GitHub Actions
- DNS configuration with Cloudflare
- SSL certificate provisioning
- Environment variable management
- Caching optimization

## Common Use Cases

### 1. New Project Deployment
Use the automated setup script for fastest setup.

### 2. Migration from Self-Hosted
Follow the migration checklist in STANDARDS.md to safely migrate.

### 3. Multiple Environments
Use different Firebase projects for staging/production.

### 4. Custom Domains
Follow the Cloudflare DNS setup guide for custom domain configuration.

## Cost Expectations

### Firebase Hosting Free Tier
- Storage: 10 GB
- Bandwidth: 360 MB/day (~10.8 GB/month)
- Custom domains: Unlimited
- SSL certificates: Free

### Typical Small App
- App size: 2-5 MB
- Daily visits: 10-100 users
- **Expected cost: $0/month**

### If You Exceed Free Tier
- Storage: $0.026/GB
- Bandwidth: $0.15/GB
- Even with 1000 users/day: ~$5-10/month

## Support

### Documentation
- Read SKILL.md for complete guide
- Check STANDARDS.md for best practices
- See cloudflare-dns-setup.md for DNS help

### Troubleshooting
Common issues and solutions are documented in SKILL.md under the "Troubleshooting" section.

### External Resources
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [GitHub Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [Custom Domains Guide](https://firebase.google.com/docs/hosting/custom-domain)

## Updates

**Last Updated:** 2026-02-02
**Based On:** Bill Tracking App Firebase migration
**Maintained By:** dmcguire80

## License

These templates and guides are free to use for all your projects.
