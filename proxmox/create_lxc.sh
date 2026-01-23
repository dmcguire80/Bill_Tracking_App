#!/usr/bin/env bash

# Host Creation Script
# This script runs on the PROXMOX NODE to create the container.

set -e

# Default Settings
CT_ID=${1:-105}
CT_PASS=${2:-"password"}
CT_HOSTNAME="bill-tracker"
TEMPLATE_STORAGE="local"
TEMPLATE_NAME="debian-12-standard_12.2-1_amd64.tar.zst" # Adjust based on available templates
RAM=1024
SWAP=512
CORES=1
DISK_SIZE="4G"
NET_BRIDGE="vmbr0"
IP_ADDR="dhcp"

# URL to the guest install script (Raw GitHub URL)
# IMPORTANT: Update this to point to your repository's raw install.sh
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/proxmox/install.sh"

echo " Creating LXC Container $CT_ID..."

# Download Template if needed (basic check)
# pveam download $TEMPLATE_STORAGE $TEMPLATE_NAME

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

echo "Container started. Waiting for network..."
sleep 10

echo "Downloading and running install script inside container..."
# Download install script to container
pct exec $CT_ID -- bash -c "curl -fsSL $INSTALL_SCRIPT_URL -o /root/install.sh"
pct exec $CT_ID -- chmod +x /root/install.sh

# Run install script
pct exec $CT_ID -- bash -c "/root/install.sh"

echo "Container Setup Complete!"
echo "Access at: http://<Container-IP>:3000"
