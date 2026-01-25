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

```bash
crontab -e
# Add this line:
0 4 * * * cd /opt/bill-tracker && ./scripts/update.sh >> /var/log/bill-tracker-update.log 2>&1
```

### 3. Manual Commands (Under the hood)

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
