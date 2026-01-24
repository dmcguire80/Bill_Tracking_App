#!/usr/bin/env bash

# Orchestration Script for Proxmox LXC Deployment
# This script runs on the PROXMOX HOST.

set -e

# --- Configuration & Defaults ---
# Usage: ./proxmox-install.sh [CT_ID] [PASSWORD]
CT_ID=${1:-$(pvesh get /cluster/nextid)}
CT_PASS=${2:-"password"}
CT_HOSTNAME="bill-tracker"
# Using a widely available Debian 12 template
TEMPLATE_NAME="debian-12-standard_12.2-1_amd64.tar.zst"

# --- Helper Functions ---

# Function to verify if a specific storage supports a specific content type
verify_storage() {
    local STORAGE=$1
    local CONTENT=$2
    if pvesm status -storage "$STORAGE" -content "$CONTENT" &>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to auto-detect valid storage for a content type
detect_storage() {
    local CONTENT=$1
    local FALLBACK=$2
    # Get the first available storage offering this content type
    local STORAGE=$(pvesm status -content "$CONTENT" | awk 'NR>1 {print $1}' | head -n 1)
    
    if [ -n "$STORAGE" ]; then
        echo "$STORAGE"
    else
        echo "$FALLBACK"
    fi
}

# --- Storage Detection ---

# 1. Detect Template Storage
if verify_storage "local" "vztmpl"; then
    TEMPLATE_STORAGE="local"
else
    TEMPLATE_STORAGE=$(detect_storage "vztmpl" "local")
fi

# 2. Detect Container Disk Storage
if verify_storage "local-lvm" "rootdir"; then
    DISK_STORAGE="local-lvm"
elif verify_storage "local-zfs" "rootdir"; then
    DISK_STORAGE="local-zfs"
else
    DISK_STORAGE=$(detect_storage "rootdir" "local")
fi

# --- Container Settings ---
RAM=1024
SWAP=512
CORES=1
DISK_SIZE="4" # Size in GB (integer only for some storages)
NET_BRIDGE="vmbr0"
IP_ADDR="dhcp"

# URL to the guest install script
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/scripts/install.sh"

echo "🚀 Creating LXC Container $CT_ID ($CT_HOSTNAME)..."
echo "📊 Storage Detected:"
echo "   - Template: $TEMPLATE_STORAGE"
echo "   - Disk:     $DISK_STORAGE"

# --- Execution ---

# Update template list to ensure we can find the template
echo "📥 Updating template list..."
pveam update

# Check if template is already downloaded
AVAILABLE_TEMPLATE=$(pveam available -section system | grep "debian-12-standard" | head -n 1 | awk '{print $2}')
if [ -z "$AVAILABLE_TEMPLATE" ]; then
    echo "⚠️  Could not find specific Debian 12 template in list. Using 'debian-12-standard' generic name."
    TEMPLATE_NAME="debian-12-standard" 
else
    TEMPLATE_NAME="$AVAILABLE_TEMPLATE"
fi

if ! pveam list $TEMPLATE_STORAGE | grep -q "$TEMPLATE_NAME"; then
     echo "📥 Downloading template $TEMPLATE_NAME to $TEMPLATE_STORAGE..."
     pveam download $TEMPLATE_STORAGE $TEMPLATE_NAME
else
     echo "✅ Template $TEMPLATE_NAME already exists on $TEMPLATE_STORAGE."
fi

# Create Container
echo "🛠️  Creating container..."
pct create $CT_ID $TEMPLATE_STORAGE:vztmpl/$TEMPLATE_NAME \
    --hostname $CT_HOSTNAME \
    --password $CT_PASS \
    --memory $RAM \
    --swap $SWAP \
    --cores $CORES \
    --net0 name=eth0,bridge=$NET_BRIDGE,ip=$IP_ADDR \
    --rootfs $DISK_STORAGE:$DISK_SIZE \
    --features nesting=1 \
    --unprivileged 1 \
    --start 1

echo "⏳ Container started. Waiting for network..."
sleep 10

echo "📥 Downloading and running install script inside container..."
pct exec $CT_ID -- bash -c "curl -fsSL $INSTALL_SCRIPT_URL -o /root/install.sh"
pct exec $CT_ID -- chmod +x /root/install.sh
pct exec $CT_ID -- bash -c "/root/install.sh"

echo "✅ Container Setup Complete!"
echo "📍 Access via Nginx on port 80 at: http://<Container-IP>"
