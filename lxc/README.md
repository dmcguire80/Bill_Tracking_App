# Proxmox LXC Deployment

This project follows a streamlined "scripted infrastructure" approach for Proxmox deployment, consistent with our architectural standards.

## 🚀 One-Command Install (Recommended)

Run this command directly on your **Proxmox Host** shell (SSH or Web Console):

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/proxmox-install.sh)"
```

**Note on Storage:**
If you get an error like `storage 'local' does not support container directories`, it means your Proxmox `local` storage is restricted to ISOs. The script now attempts to **auto-detect** a valid storage (like `local-lvm` or `local-zfs`), but you can manually override it by downloading and running the script with arguments:

```bash
# Usage: ./proxmox-install.sh [CT_ID] [PASSWORD] [DISK_STORAGE]
./proxmox-install.sh 105 your_secure_password local-lvm
```

## 📂 Deployment Structure

The deployment logic is organized as follows:

- **`proxmox-install.sh`**: The master orchestration script (runs on Proxmox Host).
- **`lxc/`**: Configuration files for the container environment.
  - `setup-lxc.sh`: Installs system dependencies (Node 22, Nginx, PM2).
  - `nginx-site.conf`: Nginx reverse proxy configuration.
  - `pm2-ecosystem.config.js`: PM2 process management.
- **`scripts/`**: Deployment and maintenance scripts.
  - `install.sh`: The internal guest installation script.

## 🛠️ Configuration Details

- **OS**: Debian 12 (standard template)
- **Port**: 80 (via Nginx reverse proxy)
- **Process Manager**: PM2
- **Node.js**: v22 LTS

## 🔄 Maintenance

### Updating the Application
To update an existing installation to the latest version, run this command inside the LXC container:

```bash
/root/install.sh
```

### Checking Logs
Use PM2 to monitor the application logs:

```bash
pm2 logs bill-tracker
```

### Service Management

```bash
pm2 status          # Check status
pm2 restart all      # Restart application
pm2 stop all         # Stop application
```
