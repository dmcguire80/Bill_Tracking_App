#!/usr/bin/env bash

# Guest Install/Update Script (LXC Container)
# This script runs INSIDE the LXC container.

set -e

# Configuration
APP_NAME="Bill_Tracking_App"
GITHUB_REPO="dmcguire80/Bill_Tracking_App" 
INSTALL_DIR="/opt/bill-tracker"
SERVICE_NAME="bill-tracker"

# Helper functions
msg_info() { echo -e "\033[36m[INFO]\033[0m $1"; }
msg_ok() { echo -e "\033[32m[OK]\033[0m $1"; }
msg_err() { echo -e "\033[31m[ERROR]\033[0m $1"; }

# 1. System Setup
msg_info "Initial system setup..."
curl -fsSL https://raw.githubusercontent.com/$GITHUB_REPO/main/lxc/setup-lxc.sh | bash

# 2. Checkout Code
msg_info "Checking for latest release..."
LATEST_TAG=$(curl -sL https://api.github.com/repos/$GITHUB_REPO/releases/latest | jq -r .tag_name)

if [[ "$LATEST_TAG" == "null" ]]; then
    LATEST_TAG="main"
fi

msg_info "Deploying version: $LATEST_TAG"

if [ -d "$INSTALL_DIR" ]; then
    msg_info "Updating application..."
    cd "$INSTALL_DIR"
    git fetch --all --tags
    git checkout -f "tags/$LATEST_TAG" 2>/dev/null || git checkout -f "$LATEST_TAG"
else
    msg_info "Fresh installation..."
    git clone "https://github.com/$GITHUB_REPO.git" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    git checkout -f "tags/$LATEST_TAG" 2>/dev/null || git checkout -f "$LATEST_TAG"
fi

# 3. Build App
msg_info "Installing dependencies..."
npm ci
msg_info "Building application..."
npm run build

# 4. Configure Nginx
msg_info "Configuring Nginx..."
cp "$INSTALL_DIR/lxc/nginx-site.conf" /etc/nginx/sites-available/bill-tracker
ln -sf /etc/nginx/sites-available/bill-tracker /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 5. Start with PM2
msg_info "Starting application with PM2..."
cd "$INSTALL_DIR"
msg_info "Debug: Listing lxc directory content:"
ls -la lxc/

pm2 start "$INSTALL_DIR/lxc/pm2-ecosystem.config.cjs"
pm2 save
# Explicitly set startup for systemd on Debian (avoids fragile pipe/tail method)
pm2 startup systemd -u root --hp /root

msg_ok "Success! App is running on version $LATEST_TAG"
msg_ok "Access via Nginx on port 80 at: http://<Container-IP>"
