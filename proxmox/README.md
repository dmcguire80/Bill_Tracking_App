# Proxmox Installation Guide

This directory contains scripts to automate the deployment of the Bill Tracking App as a Proxmox LXC container.

## Overview

The deployment is split into two parts:
1. **`create_lxc.sh`**: Runs on your **Proxmox Host**. It creates the LXC container and triggers the installation.
2. **`install.sh`**: Runs **inside the LXC container**. It installs Node.js, clones the repository, builds the app, and sets up a systemd service.

## Prerequisites

- Access to a Proxmox VE shell (SSH or Web Console).
- A Debian 12 standard template available in your Proxmox storage.
- Internet access for the container to download Node.js and dependencies.

## Installation Steps

### 1. Download the Creation Script
On your **Proxmox Host** (not the container), download the creation script:

```bash
curl -fsSL https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/proxmox/create_lxc.sh -o create_lxc.sh
chmod +x create_lxc.sh
```

### 2. Run the Script
Execute the script to create and set up the container. You can optionally provide a Container ID and Password:

```bash
# Usage: ./create_lxc.sh [CT_ID] [PASSWORD]
./create_lxc.sh 105 your_secure_password
```

**What the script does:**
- Creates a Debian 12 LXC container (default ID 105).
- Configures 1 CPU core, 1GB RAM, and 4GB Disk.
- Sets up networking (DHCP by default).
- Downloads and executes the `install.sh` script inside the container.

### 3. Access the Application
Once the script completes, the container IP will be displayed. You can access the app at:

`http://<Container-IP>:3000`

## Manual Installation inside Container
If you already have a container and just want to install the app, you can run the guest install script manually inside the container:

```bash
curl -fsSL https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/proxmox/install.sh | bash
```

## Maintenance

### Updating the App
The `install.sh` script is designed to handle updates. To update to the latest version, simply run the install script inside the container again:

```bash
/root/install.sh
```
It will check for the latest GitHub release, pull changes, and rebuild the application automatically.

### Checking logs
You can check the application logs via systemd:

```bash
journalctl -u bill-tracker -f
```

### Service Management
The app runs as a systemd service called `bill-tracker`.

```bash
systemctl status bill-tracker   # Check status
systemctl restart bill-tracker  # Restart app
systemctl stop bill-tracker     # Stop app
```
