# Architecture Documentation

## System Overview
Bill Tracker is a self-hosted personal finance application designed to run in a Linux Container (LXC) on Proxmox, though it can run on any standard Linux server with Node.js.

### Core Stack
- **Frontend**: React (Vite) + TypeScript + TailwindCSS.
- **Backend**: Node.js (Express).
- **Storage**: JSON File System (`data/db.json`).
- **Runtime**: PM2 (Process Manager).
- **Proxy**: Nginx (Reverse Proxy).

## Data Flow
1.  **Source of Truth**: The `data/db.json` file on the server.
2.  **Sync Strategy**:
    - **Load**: On app mount, the frontend fetches `GET /api/data`.
    - **Save**: On valid changes, the frontend sends `POST /api/data`.
    - **State**: The frontend uses a React Context (`DataContext`) to manage state and optimistic updates.
3.  **Cross-Device**: All devices read/write to the same server endpoints. There are no websockets; sync happens on page load or refresh (and saves trigger writes).

## Directory Structure
```
/opt/bill-tracker/
├── dist/               # Static frontend build artifacts
├── data/               # Persistent data storage
│   └── db.json         # Main data file
├── backups/            # Automated JSON backups
├── server.js           # Express backend
├── scripts/            # Installation & maintenance scripts
└── lxc/                # Container configuration (nginx, pm2)
```

## Setup & Deployment
- **Install Script**: `scripts/install.sh` handles the entire lifecycle:
    - Installs system dependencies.
    - Clones/Pulls the repo.
    - Builds the frontend (`npm run build`).
    - Configures Nginx (`lxc/nginx-site.conf`).
    - Starts the backend with PM2 (`lxc/pm2-ecosystem.config.cjs`).
    - Creates the `update` alias.

## Key Features
- **Smart Paydays**: Calls `useCalculations.ts` to project account balances based on paydays and due dates.
- **Automated Backups**: Server-side logic in `server.js` rotates backups (keeps last 30).
- **Mobile Optimization**: Sticky columns and condensed layouts for small screens.
