# Deployment & Infrastructure Guide

This document outlines the standard deployment architecture for our self-hosted applications. It enables external secure access via Cloudflare Zero Trust while maintaining internal routing speeds via local DNS.

## Infrastructure Stack
1.  **Host**: Proxmox VE (LXC Container)
2.  **Internal Proxy**: Nginx Proxy Manager (NPM)
3.  **External Access**: Cloudflare Zero Trust (Tunnel)
4.  **Internal DNS**: Unifi Network (Local DNS Record)

## 1. Application Container (Proxmox LXC)
*   **OS**: Debian/Ubuntu
*   **Internal Server**: Node.js + Express (Port 3000)
*   **Local Proxy**: Nginx (Port 80)
*   **Configuration**:
    *   Nginx listens on Port 80.
    *   Proxies API requests (`/api`) to `localhost:3000`.
    *   Serves static frontend files (`/dist`) directly.

## 2. Nginx Proxy Manager (NPM) Configuration
This is the "Bridge" between your network and the application container.

*   **Scheme**: `http`
*   **Forward Hostname / IP**: `<Container_IP>` (e.g., `10.10.x.x`)
*   **Forward Port**: `80` (Points to Container's Nginx, NOT the Node app)
*   **SSL**:
    *   **Force SSL**: **DISABLED** (Critical: Cloudflare handles SSL; enabling this causes redirect loops).
    *   **HTTP/2 Support**: Enabled.
*   **Advanced**:
    *   **Websockets Support**: Disabled (unless app uses WS).
    *   **Block Common Exploits**: Enabled.

## 3. Cloudflare Zero Trust (External Access)
Secure remote access without opening router ports.

*   **Tunnel Config**:
    *   **Service**: `http://<NPM_IP>:80`
    *   **Host Header**: `<app>.<your-domain>.com` (Matches the domain in NPM)
*   **Public Hostname**:
    *   **Subdomain**: `<app>` (e.g., `bills`)
    *   **Domain**: `<your-domain>.com`
*   **Result**: Cloudflare sends traffic to NPM, which routes to the Container.

## 4. Unifi / Local DNS (Internal Access)
Ensures local devices connect directly to NPM instead of looping out to Cloudflare.

*   **Type**: A Record (Host)
*   **Hostname**: `<app>`
*   **Domain**: `<your-domain>.com`
*   **IP Address**: `<NPM_IP>` (The IP of the Nginx Proxy Manager container)

## Summary Data Flow
*   **External User** -> Cloudflare (HTTPS) -> Tunnel -> NPM (HTTP) -> Container Nginx (HTTP) -> App
*   **Internal User** -> Local DNS -> NPM (HTTP) -> Container Nginx (HTTP) -> App
