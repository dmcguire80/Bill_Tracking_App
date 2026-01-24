#!/usr/bin/env bash

# Orchestration Script for Proxmox LXC Deployment
# This script runs on the PROXMOX HOST.

set -e

# --- UI Functions (Whiptail) ---

msg_info() {
    echo -e "\033[36m[INFO]\033[0m $1"
}

msg_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

function select_storage() {
  local CLASS=$1
  local CONTENT
  local CONTENT_LABEL
  case $CLASS in
  container)
    CONTENT='rootdir'
    CONTENT_LABEL='Container'
    ;;
  template)
    CONTENT='vztmpl'
    CONTENT_LABEL='Container template'
    ;;
  *) echo "Invalid storage class."; exit 1 ;;
  esac

  # Query all storage locations
  local -a MENU
  while read -r line; do
    local TAG=$(echo $line | awk '{print $1}')
    local TYPE=$(echo $line | awk '{printf "%-10s", $2}')
    local FREE=$(echo $line | numfmt --field 4-6 --from-unit=K --to=iec --format %.2f | awk '{printf( "%9sB", $6)}')
    local ITEM="Type: $TYPE Free: $FREE"
    MENU+=("$TAG" "$ITEM" "OFF")
  done < <(pvesm status -content $CONTENT | awk 'NR>1')

  # If no storage found
  if [ ${#MENU[@]} -eq 0 ]; then
    msg_error "No valid storage found for $CONTENT_LABEL."
    exit 1
  fi

  # Select storage location
  local STORAGE
  STORAGE=$(whiptail --title "Storage Selection" --radiolist \
    "Select storage for $CONTENT_LABEL:\n" \
    16 60 6 \
    "${MENU[@]}" 3>&1 1>&2 2>&3) || exit 1
  
  echo "$STORAGE"
}

function input_box() {
    local TITLE=$1
    local TEXT=$2
    local DEFAULT=$3
    whiptail --title "$TITLE" --inputbox "$TEXT" 10 60 "$DEFAULT" 3>&1 1>&2 2>&3
}

# --- Main Logic ---

# 1. Welcome
whiptail --title "Bill Tracking App Installer" --msgbox \
"Welcome to the automated installer for Bill Tracking App.\n\n\
This wizard will guide you through creating the LXC container.\n\n\
Please ensure you have internet connectivity." 12 60

# 2. Container ID
NEXTID=$(pvesh get /cluster/nextid)
CT_ID=$(input_box "Container ID" "Enter the LXC Container ID:" "$NEXTID") || exit 1

# 3. Password
CT_PASS=$(input_box "Password" "Enter the root password for the container:" "password") || exit 1

# 4. Template Storage
TEMPLATE_STORAGE=$(select_storage template) || exit 1

# 5. Template Selection
msg_info "Updating template list..."
pveam update >/dev/null

# Filter for Debian 12 templates
local -a TEMPLATE_MENU
while read -r TAG; do
  TEMPLATE_MENU+=("$TAG" "" "OFF")
done < <(pveam available -section system | grep "debian-12-standard" | awk '{print $2}' | sort -r)

if [ ${#TEMPLATE_MENU[@]} -eq 0 ]; then
    # Fallback if specific search fails
    TEMPLATE_NAME="debian-12-standard_12.2-1_amd64.tar.zst"
else
    TEMPLATE_NAME=$(whiptail --title "Template Selection" --radiolist \
    "Select Debian 12 Template:\n" \
    16 60 6 \
    "${TEMPLATE_MENU[@]}" 3>&1 1>&2 2>&3) || exit 1
fi
# Remove quotes if present
TEMPLATE_NAME=$(echo "$TEMPLATE_NAME" | tr -d '"')

# 6. Disk Storage
DISK_STORAGE=$(select_storage container) || exit 1

# 7. Confirmation
whiptail --title "Confirm Settings" --yesno \
"Container ID: $CT_ID\n\
Hostname:     bill-tracker\n\
Password:     $CT_PASS\n\
Template:     $TEMPLATE_NAME\n\
Storage:      $TEMPLATE_STORAGE\n\
Disk:         $DISK_STORAGE\n\n\
Proceed with installation?" 16 60 || exit 1

# --- Execution ---

# Download Template
if ! pveam list $TEMPLATE_STORAGE | grep -q "$TEMPLATE_NAME"; then
     msg_info "Downloading template $TEMPLATE_NAME to $TEMPLATE_STORAGE..."
     pveam download $TEMPLATE_STORAGE $TEMPLATE_NAME
else
     msg_info "Template already exists."
fi

# Create Container
msg_info "Creating LXC Container..."
pct create $CT_ID $TEMPLATE_STORAGE:vztmpl/$TEMPLATE_NAME \
    --hostname "bill-tracker" \
    --password "$CT_PASS" \
    --memory 1024 \
    --swap 512 \
    --cores 1 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --rootfs $DISK_STORAGE:4 \
    --features nesting=1 \
    --unprivileged 1 \
    --start 1

msg_info "Container started. Waiting for network..."
sleep 10

# Run Guest Script
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/scripts/install.sh"
msg_info "Running installation script..."
pct exec $CT_ID -- bash -c "curl -fsSL $INSTALL_SCRIPT_URL -o /root/install.sh"
pct exec $CT_ID -- chmod +x /root/install.sh
pct exec $CT_ID -- bash -c "/root/install.sh"

msg_info "Setup Complete! Access at http://<Container-IP>"
