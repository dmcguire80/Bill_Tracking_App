# New App Playbook & Order of Operations

> **Purpose**: A step-by-step master guide for initializing, building, and deploying a new application within our ecosystem.
> **Scope**: Covers Project Setup, Infrastructure, CI/CD, and Handover.

## Phase 1: Pre-Code & Infrastructure
**Goal**: Ensure the environment is ready before writing a single line of feature code.

1.  **Repository Setup**
    *   [ ] Create GitHub Repository (Private).
    *   [ ] Clone to local machine.
    *   [ ] Initialize `.agent/` directory with `GITHUB_STANDARDS.md`.

2.  **Domain & Network (Cloudflare & Unifi)**
    *   [ ] **Cloudflare**: Create DNS A record pointing to your WAN IP.
        *   Example: `newapp.dmcguire.net` -> `1.2.3.4`
        *   Enable "Proxied" (Orange Cloud) for DDoS/SSL protection.
    *   [ ] **Unifi (Router)**: Ensure Port Forwarding is active.
        *   Port 80/443 -> Proxmox Reverse Proxy (Nginx).

3.  **Hosting (Proxmox LXC)**
    *   [ ] Create new LXC Container (Debian/Ubuntu).
    *   [ ] Install Node.js, Nginx, Git.
    *   [ ] Configure Runner User (non-root) or set `RUNNER_ALLOW_RUNASROOT=1`.

## Phase 2: Project Initialization
**Goal**: Create a standardized codebase foundation.

1.  **Tech Stack Init**
    *   [ ] Run `npm create vite@latest .`
    *   [ ] Select **React** + **TypeScript**.
    *   [ ] Install **TailwindCSS** (Follow `v4` or standard guide).
    *   [ ] Install **Firebase** SDK.

2.  **Essential Libraries (Standard Kit)**
    *   `react-router-dom`: Routing.
    *   `lucide-react`: Icons.
    *   `clsx` & `tailwind-merge`: Class management.
    *   `vitest` & `playwright`: Testing.

3.  **Secrets Management**
    *   [ ] Create `.env.example` (No real secrets).
    *   [ ] Add `.env` to `.gitignore` IMMEDIATELY.
    *   [ ] Configure GitHub Secrets (`FIREBASE_CONFIG`, `CODECOV_TOKEN`).

## Phase 3: CI/CD Pipeline
**Goal**: Automation from Day 1.

1.  **GitHub Actions Runner**
    *   [ ] Install **Self-Hosted Runner** on the LXC Container.
    *   [ ] Configure as service (`./svc.sh install`).

2.  **Workflow Files (`.github/workflows/`)**
    *   [ ] `ci.yml`: Format, Lint, Test, Audit.
    *   [ ] `deploy.yml`: Triggers on `v*` tag. Builds and copies to `/var/www/html`.

## Phase 4: Implementation Loop
**Goal**: Rapid iterative development.

*   Follow **Phase 1-11** pattern from Bill Tracker `task_plan.md`.
*   **Standards**:
    *   Use `GITHUB_STANDARDS.md` file for all commits/releases.
    *   Use `TEAM_ROLES.md` to validate architectural decisions.

## Phase 5: Verification & Launch
1.  **E2E Testing**: Run Playwright against the production URL.
2.  **Security Scan**: Run `npm audit`.
3.  **Docs**: Generate `DEPLOYMENT_GUIDE.md` specific to this app.
