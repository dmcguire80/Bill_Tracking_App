#!/usr/bin/env bash

# Guest Install/Update Script
# This script runs INSIDE the LXC container to install or update the application.

set -e

# Configuration
APP_NAME="Bill_Tracking_App"
# IMPORTANT: Update this variable to your actual "username/repo"
GITHUB_REPO="dmcguire80/Bill_Tracking_App" 
INSTALL_DIR="/opt/bill-tracker"
SERVICE_NAME="bill-tracker"

# Helper functions
msg_info() { echo -e "\033[36m[INFO]\033[0m $1"; }
msg_ok() { echo -e "\033[32m[OK]\033[0m $1"; }
msg_err() { echo -e "\033[31m[ERROR]\033[0m $1"; }

# Check for root
if [[ $EUID -ne 0 ]]; then
   msg_err "This script must be run as root"
   exit 1
fi

# Install Dependencies
msg_info "Checking dependencies..."
apt-get update -qq
apt-get install -y curl git gnupg jq

# Install Node.js 22 (LTS) if missing
if ! command -v node &> /dev/null; then
    msg_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

# Check for GitHub Release
msg_info "Checking for latest release..."
LATEST_RELEASE=$(curl -sL https://api.github.com/repos/$GITHUB_REPO/releases/latest)
LATEST_TAG=$(echo "$LATEST_RELEASE" | jq -r .tag_name)

if [[ "$LATEST_TAG" == "null" ]]; then
    msg_err "Could not fetch latest release from GitHub. Check GITHUB_REPO or valid releases."
    # Fallback to main branch for first install if no release found?
    # For now, we'll try to proceed with main but warn.
    LATEST_TAG="main"
fi

msg_info "Latest version: $LATEST_TAG"

# Check Local Version
LOCAL_VERSION=""
if [ -f "$INSTALL_DIR/.version" ]; then
    LOCAL_VERSION=$(cat "$INSTALL_DIR/.version")
    msg_info "Installed version: $LOCAL_VERSION"
fi

# Update/Install Logic
if [[ "$LOCAL_VERSION" == "$LATEST_TAG" ]]; then
    msg_ok "App is already up to date!"
    exit 0
fi

if [ -d "$INSTALL_DIR" ]; then
    msg_info "Updating application..."
    cd "$INSTALL_DIR"
    git fetch --all --tags
    git checkout "tags/$LATEST_TAG" 2>/dev/null || git checkout "$LATEST_TAG"
else
    msg_info "Fresh installation..."
    git clone "https://github.com/$GITHUB_REPO.git" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    git checkout "tags/$LATEST_TAG" 2>/dev/null || git checkout "$LATEST_TAG"
fi

# Build
msg_info "Installing project dependencies..."
npm ci
msg_info "Building project..."
npm run build

# Save Version
echo "$LATEST_TAG" > "$INSTALL_DIR/.version"

# Setup Service
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi

SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"
if [ ! -f "$SERVICE_FILE" ]; then
    msg_info "Creating systemd service..."
    cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Bill Tracking App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/serve -s dist -l 3000
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    systemctl daemon-reload
    systemctl enable "$SERVICE_NAME"
fi

msg_info "Restarting service..."
systemctl restart "$SERVICE_NAME"

msg_ok "Success! App is running on version $LATEST_TAG"
msg_ok "Access at: http://<Container-IP>:3000"
