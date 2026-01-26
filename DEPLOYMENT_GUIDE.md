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

### 3. Continuous Deployment (Self-Hosted Runner)
This method allows the server to "pull" updates automatically without exposing SSH to the internet.

**1. Create the Runner on your Server:**
Go to your GitHub Repo -> **Settings** -> **Actions** -> **Runners** -> **New self-hosted runner**.
Select **Linux** and run the provided commands on your server.

*Tip: If running as root (which you probably are), use this command to configure:*
```bash
export RUNNER_ALLOW_RUNASROOT=1
./config.sh --url https://github.com/dmcguire80/Bill_Tracking_App --token <YOUR_TOKEN>
```

**2. Install as a Service:**
Once configured, install it so it runs automatically on boot:
```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

**3. Global vs Local Runners:**
*   **Local**: Installed inside *this* container. Can only deploy *this* app.
*   **Global**: To manage *all* your LXCs, you would install the runner on a central "DevOps" container and give it SSH access to the others. For now, stick to **Local**.

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

    # API Proxy (Optional - Only if running a backend)
    # location /api {
    #     proxy_pass http://localhost:3000;
    #     ...
    # }
    ```
