# Cloudflare DNS Setup for Firebase Hosting

## Overview

This guide walks you through pointing `bills.thorshome.com` to Firebase Hosting and removing Cloudflare Access to achieve single-login authentication.

---

## Prerequisites

- ✅ App deployed to Firebase Hosting (https://linear-budgeting.web.app)
- ✅ Access to Cloudflare account
- ✅ Access to Firebase Console
- ✅ Domain `thorshome.com` managed in Cloudflare

---

## Part 1: Add Custom Domain in Firebase

### Step 1: Open Firebase Console

1. Go to https://console.firebase.google.com
2. Select project: **Linear Budgeting** (`linear-budgeting`)
3. Click **Hosting** in the left sidebar

### Step 2: Add Custom Domain

1. Click **"Add custom domain"** button
2. Enter domain: `bills.thorshome.com`
3. Click **"Continue"**

### Step 3: Get DNS Records

Firebase will provide DNS records. You'll see one of two options:

**Option A: A Records (Most Common)**
```
Type: A
Name: bills
Value: 151.101.1.195
Value: 151.101.65.195
```

**Option B: CNAME Record**
```
Type: CNAME
Name: bills
Value: linear-budgeting.web.app
```

**📝 Copy these records** - you'll need them for Cloudflare!

---

## Part 2: Remove Cloudflare Access

### Step 1: Find Cloudflare Access Rules

1. Log into Cloudflare Dashboard: https://dash.cloudflare.com
2. Select domain: **thorshome.com**
3. Go to **Zero Trust** → **Access** → **Applications**

### Step 2: Locate Bill Tracker Application

Look for an application named:
- "Bill Tracker"
- "bills.thorshome.com"
- Or similar

### Step 3: Remove or Disable Access Policy

**Option A: Delete the Application**
1. Click the **three dots** (⋮) next to the application
2. Select **"Delete"**
3. Confirm deletion

**Option B: Disable the Application**
1. Click on the application name
2. Toggle **"Enable application"** to **OFF**
3. Click **"Save"**

**⚠️ Important:** This removes the Cloudflare Access + Duo authentication layer!

---

## Part 3: Update DNS Records in Cloudflare

### Step 1: Navigate to DNS Settings

1. In Cloudflare Dashboard
2. Select domain: **thorshome.com**
3. Click **DNS** in the left sidebar

### Step 2: Find Existing Record for `bills`

Look for a DNS record with:
- **Name:** `bills` or `bills.thorshome.com`
- **Type:** A, AAAA, or CNAME

### Step 3: Delete Old Record (if exists)

1. Click **"Edit"** on the existing `bills` record
2. Click **"Delete"**
3. Confirm deletion

### Step 4: Add New Firebase DNS Records

#### If Firebase gave you A Records:

1. Click **"Add record"**
2. Fill in:
   - **Type:** `A`
   - **Name:** `bills`
   - **IPv4 address:** `151.101.1.195`
   - **Proxy status:** 🔴 **DNS only** (click to toggle off orange cloud)
   - **TTL:** Auto
3. Click **"Save"**

4. Click **"Add record"** again
5. Fill in:
   - **Type:** `A`
   - **Name:** `bills`
   - **IPv4 address:** `151.101.65.195`
   - **Proxy status:** 🔴 **DNS only**
   - **TTL:** Auto
6. Click **"Save"**

#### If Firebase gave you a CNAME Record:

1. Click **"Add record"**
2. Fill in:
   - **Type:** `CNAME`
   - **Name:** `bills`
   - **Target:** `linear-budgeting.web.app`
   - **Proxy status:** 🔴 **DNS only** (CRITICAL!)
   - **TTL:** Auto
3. Click **"Save"**

### ⚠️ CRITICAL: Proxy Status Must Be "DNS Only"

**Why?**
- Firebase needs direct DNS resolution to provision SSL
- Cloudflare proxy (orange cloud) will break Firebase SSL setup
- You can enable proxy AFTER SSL is provisioned (optional)

**How to verify:**
- The cloud icon should be **gray** (DNS only)
- NOT **orange** (Proxied)

---

## Part 4: Verify DNS in Firebase

### Step 1: Return to Firebase Console

1. Go back to Firebase Console → Hosting → Custom domains
2. You should see `bills.thorshome.com` with status:
   - **"Pending"** or **"Verifying"**

### Step 2: Wait for Verification

Firebase will:
1. Check DNS records (usually 5-30 minutes)
2. Provision SSL certificate (usually 15-30 minutes)
3. Activate the domain

**Status progression:**
```
Pending → Verifying → Provisioning SSL → Connected
```

### Step 3: Check Status

Refresh the Firebase Console page every few minutes to see progress.

**When complete, you'll see:**
- ✅ Status: **Connected**
- 🔒 SSL: **Active**

---

## Part 5: Test the Setup

### Step 1: Wait for DNS Propagation

DNS changes can take 5-30 minutes to propagate globally.

**Check DNS propagation:**
```bash
# Check if DNS is updated
dig bills.thorshome.com

# Should show Firebase IP addresses
```

Or use online tool: https://dnschecker.org

### Step 2: Test HTTP Access

1. Open browser
2. Visit: `http://bills.thorshome.com`
3. Should redirect to HTTPS automatically

### Step 3: Test HTTPS Access

1. Visit: `https://bills.thorshome.com`
2. Should load your app
3. Check SSL certificate (click padlock icon)
   - Should show valid certificate
   - Issued by: Google Trust Services

### Step 4: Test Authentication

1. Click **"Sign In"**
2. Should see **ONLY Firebase login**
3. **NO Cloudflare Access prompt**
4. **NO Duo 2FA prompt**
5. Enter Firebase credentials
6. Should log in successfully

---

## Troubleshooting

### Issue: "This site can't be reached"

**Cause:** DNS not propagated yet

**Solution:**
- Wait 5-30 minutes
- Check DNS with `dig bills.thorshome.com`
- Verify DNS records in Cloudflare

---

### Issue: "Your connection is not private" (SSL error)

**Cause:** SSL certificate not provisioned yet

**Solution:**
- Wait up to 24 hours for SSL provisioning
- Check Firebase Console for SSL status
- Ensure Cloudflare proxy is **OFF** (gray cloud)

---

### Issue: Still seeing Cloudflare Access prompt

**Cause:** Cloudflare Access rule still active

**Solution:**
1. Go to Cloudflare → Zero Trust → Access
2. Verify application is deleted or disabled
3. Clear browser cache and cookies
4. Try incognito/private browsing

---

### Issue: DNS shows old IP address

**Cause:** DNS cache or wrong record

**Solution:**
1. Verify Cloudflare DNS records are correct
2. Check TTL hasn't expired
3. Flush local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### Issue: Firebase says "DNS verification failed"

**Cause:** DNS records not set correctly

**Solution:**
1. Double-check DNS records in Cloudflare match Firebase exactly
2. Ensure proxy status is **DNS only** (gray cloud)
3. Wait 5-10 minutes and try again
4. Use `dig bills.thorshome.com` to verify DNS

---

## DNS Record Examples

### Example 1: A Records (Recommended)

**In Cloudflare DNS:**
```
Type    Name    Content           Proxy    TTL
A       bills   151.101.1.195     DNS only Auto
A       bills   151.101.65.195    DNS only Auto
```

### Example 2: CNAME Record

**In Cloudflare DNS:**
```
Type    Name    Content                      Proxy    TTL
CNAME   bills   linear-budgeting.web.app     DNS only Auto
```

---

## Timeline

**Expected timeline for complete setup:**

| Step | Time |
|------|------|
| Add custom domain in Firebase | 2 minutes |
| Remove Cloudflare Access | 2 minutes |
| Update DNS in Cloudflare | 3 minutes |
| DNS propagation | 5-30 minutes |
| SSL provisioning | 15-30 minutes |
| **Total** | **~30-60 minutes** |

---

## Before and After

### Before (Current Setup)

**URL:** `bills.thorshome.com`

**Authentication flow:**
1. 🔐 Cloudflare Access (username/password)
2. 🔐 Duo 2FA (two-factor)
3. 🔐 Firebase Auth (app login)

**Hosting:** Self-hosted Nginx server

---

### After (New Setup)

**URL:** `bills.thorshome.com` (same!)

**Authentication flow:**
1. 🔐 Firebase Auth (app login only!)

**Hosting:** Firebase Hosting (Google infrastructure)

---

## Verification Checklist

After completing all steps, verify:

- [ ] Firebase Console shows domain as "Connected"
- [ ] SSL certificate is active
- [ ] `https://bills.thorshome.com` loads the app
- [ ] No Cloudflare Access prompt
- [ ] No Duo 2FA prompt
- [ ] Firebase login works
- [ ] All app features work
- [ ] SSL certificate is valid (check padlock)

---

## Rollback Plan

If something goes wrong, you can revert:

### Rollback DNS

1. Go to Cloudflare DNS
2. Delete Firebase DNS records
3. Add back old DNS record pointing to self-hosted server
4. Wait 5-30 minutes for propagation

### Re-enable Cloudflare Access

1. Go to Cloudflare → Zero Trust → Access
2. Re-enable or recreate the application
3. Configure authentication rules

### Keep Both Running

**Alternative:** Keep self-hosted running during migration
- Test Firebase at `linear-budgeting.web.app`
- Keep `bills.thorshome.com` pointing to self-hosted
- Switch DNS only when confident

---

## Additional Notes

### Can I use Cloudflare Proxy?

**After SSL is provisioned:** Yes, you can enable it

1. Wait for Firebase SSL to be fully active
2. Go to Cloudflare DNS
3. Click the gray cloud to turn it orange (Proxied)
4. Test that everything still works

**Benefits:**
- DDoS protection
- Cloudflare CDN (on top of Firebase CDN)
- Analytics

**Downsides:**
- Adds complexity
- May cause SSL issues if not set up correctly

**Recommendation:** Start with DNS only, enable proxy later if needed

---

## Support Resources

- **Firebase Hosting Docs:** https://firebase.google.com/docs/hosting
- **Custom Domain Guide:** https://firebase.google.com/docs/hosting/custom-domain
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns
- **DNS Checker Tool:** https://dnschecker.org

---

## Summary

**What you're doing:**
1. Telling Firebase you want to use `bills.thorshome.com`
2. Removing Cloudflare Access authentication
3. Updating DNS to point to Firebase servers
4. Waiting for SSL certificate

**Result:**
- Same URL (`bills.thorshome.com`)
- Single authentication (Firebase only)
- Hosted on Firebase (not self-hosted)
- Free SSL certificate
- Global CDN

**Time required:** ~1 hour (mostly waiting)
