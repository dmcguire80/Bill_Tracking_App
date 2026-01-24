#!/usr/bin/env bash

# Orchestration Script for Proxmox LXC Deployment
# This script runs on the PROXMOX HOST.

set -e

# Default Settings
CT_ID=${1:-$(pvesh get /cluster/nextid)}
CT_PASS=${2:-"password"}
CT_HOSTNAME="bill-tracker"
TEMPLATE_STORAGE="local"
TEMPLATE_NAME="debian-12-standard_12.2-1_amd64.tar.zst"
RAM=1024
SWAP=512
CORES=1
DISK_SIZE="4G"
NET_BRIDGE="vmbr0"
IP_ADDR="dhcp"

# URL to the guest install script
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/scripts/install.sh"

echo "🚀 Creating LXC Container $CT_ID ($CT_HOSTNAME)..."

# Create Container
pct create $CT_ID $TEMPLATE_STORAGE:vztmpl/$TEMPLATE_NAME \
    --hostname $CT_HOSTNAME \
    --password $CT_PASS \
    --memory $RAM \
    --swap $SWAP \
    --cores $CORES \
    --net0 name=eth0,bridge=$NET_BRIDGE,ip=$IP_ADDR \
    --rootfs $TEMPLATE_STORAGE:$DISK_SIZE \
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
echo "📍 Access at: http://<Container-IP>:3000"
