# Deployment & Infrastructure Guide

This application has been migrated to a **Static Single Page Application (SPA)** architecture backed by Firebase.
Legacy server-side code (Node.js/Express) has been removed.

## Infrastructure Stack
1.  **Host**: Proxmox VE (LXC Container)
2.  **Web Server**: Nginx (serving static files)
3.  **Backend**: Firebase (Cloud Firestore & Auth)

## Deployment Instructions (Updating the App)

Because the old auto-update scripts were removed, use these commands to update your server:

### 1. Manual Update Command
Run this on your server (inside the application directory, e.g., `/opt/bill-tracker`):

```bash
# 1. Get latest code
git pull origin main

# 2. Install dependencies (only if package.json changed)
npm install

# 3. Build the static app
npm run build

# 4. Deploy to Nginx
# (Assuming your nginx root is /var/www/html or similar)
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/
```

### 2. Creating a new 'update' alias
You can recreate your `update` alias by adding this to your `~/.bashrc`:

```bash
alias update='git pull && npm install && npm run build && rm -rf /var/www/html/* && cp -r dist/* /var/www/html/ && echo "Update Complete!"'
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
