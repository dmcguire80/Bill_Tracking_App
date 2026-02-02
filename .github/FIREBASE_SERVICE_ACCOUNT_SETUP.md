# Firebase Service Account Setup

## Quick Steps

### 1. Create Service Account

**Option A: Using Firebase CLI (Easiest)**
```bash
firebase login:ci
```

This will output a token like:
```
1//0abc123def...
```

**Copy this entire token** - you'll add it to GitHub Secrets.

---

**Option B: Using Firebase Console (More Secure)**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear icon → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. Copy the **entire contents** of the JSON file

---

### 2. Add to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: 
   - **Option A**: Paste the token from `firebase login:ci`
   - **Option B**: Paste the entire JSON file contents
6. Click **Add secret**

---

### 3. Verify Setup

After adding the secret, the deployment workflow will be able to deploy to Firebase Hosting automatically when you push a tag.

**Test it:**
```bash
git tag v0.9.28-firebase-test
git push origin v0.9.28-firebase-test
```

Watch the GitHub Actions workflow run and deploy to Firebase!

---

## What This Secret Does

- Allows GitHub Actions to authenticate with Firebase
- Enables automated deployments without manual intervention
- Scoped to your Firebase project only

## Security

- ✅ Secret is encrypted in GitHub
- ✅ Only visible to repository admins
- ✅ Only used during deployment workflow
- ✅ Can be rotated anytime

## Troubleshooting

### "Invalid service account"
- Make sure you copied the entire JSON or token
- No extra spaces or newlines
- Try regenerating the key

### "Permission denied"
- Service account needs "Firebase Hosting Admin" role
- Check Firebase Console → IAM & Admin

### "Project not found"
- Verify `VITE_FIREBASE_PROJECT_ID` secret matches your Firebase project ID
