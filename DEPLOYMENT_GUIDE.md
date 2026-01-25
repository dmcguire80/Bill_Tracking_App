# Deployment & Infrastructure Guide

This application has been migrated to a **Static Single Page Application (SPA)** architecture backed by Firebase.
Legacy server-side code (Node.js/Express) has been removed.

## Infrastructure Stack
1.  **Host**: Proxmox VE (LXC Container)
2.  **Web Server**: Nginx (serving static files)
3.  **Backend**: Firebase (Cloud Firestore & Auth)

## Deployment Instructions (Updating the App)

Because the old auto-update scripts were removed, use these commands to update your server:

### 1. The Easy Way (Script)
We have included an update script in the repository.

```bash
# Run manually
./scripts/update.sh
```

### 2. Auto-Update (Cron Job)
To check for updates automatically every night at 4am:

**Option A: The One-Liner (Easiest)**
Run this single command:
```bash
(crontab -l 2>/dev/null; echo "0 4 * * * cd /opt/bill-tracker && ./scripts/update.sh >> /var/log/bill-tracker-update.log 2>&1") | crontab -
```

**Option B: Manual Editor**
1. Run `crontab -e`
2. Paste this line at the bottom:
   `0 4 * * * cd /opt/bill-tracker && ./scripts/update.sh >> /var/log/bill-tracker-update.log 2>&1`
3. Save and exit (`Esc` -> `:wq` for vim, or `Ctrl+X` -> `Y` for nano).

### 3. Continuous Deployment (GitHub Actions)
Fully automated "Push-to-Deploy". When you push a new tag (e.g., `v0.9.6`), GitHub will log into your server and run the update for you.

**Setup Instructions:**
1.  Go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Add the following secrets:
    *   `SSH_HOST`: Your server's public IP or hostname (e.g., `home.dmcguire.com`).
    *   `SSH_USERNAME`: The user to log in as (e.g., `root`).
    *   `SSH_KEY`: Your private SSH key (contents of `~/.ssh/id_rsa`).
        *   *Note: This key must authorize access to the server without a password.*

**How to trigger:**
```bash
git tag v0.9.6
git push origin v0.9.6
# GitHub Action will start automatically
```

## Application Container (Proxmox LXC)
*   **OS**: Debian/Ubuntu
*   **Port**: 80 (Nginx)
*   **Proxying**: None required (App connects directly to Firebase).

## Troubleshooting
*   **404 on Refresh**: Ensure Nginx is configured to redirect all 404s to `index.html` (SPA routing).
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
