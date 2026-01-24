#!/usr/bin/env bash

# LXC Setup Script
# This script runs INSIDE the LXC container to install system dependencies.

set -e

msg_info() { echo -e "\033[36m[INFO]\033[0m $1"; }
msg_ok() { echo -e "\033[32m[OK]\033[0m $1"; }

msg_info "Updating system..."
apt-get update -qq
apt-get install -y curl git gnupg jq nginx

# Install Node.js 22 (LTS)
if ! command -v node &> /dev/null; then
    msg_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    msg_info "Installing PM2..."
    npm install -g pm2
fi

msg_ok "System dependencies installed."
