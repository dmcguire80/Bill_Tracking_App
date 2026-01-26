# Infrastructure & Technology Stack

> **Purpose**: Defines the standardized technology choices for all applications. Deviating from this list requires Architecture Review.

## 1. Hosting & Network
| Component | Standard | Notes |
| :--- | :--- | :--- |
| **Hypervisor** | **Proxmox VE** | LXC Containers preferred over VMs for web apps. |
| **DNS / CDN** | **Cloudflare** | Use "Full (Strict)" SSL mode. |
| **Network** | **Unifi** | Manage VLANs and Port Forwarding here. |
| **Web Server** | **Nginx** | Reverse Proxy termination. Serves static assets (`/var/www/html`). |
| **CI Runner** | **GitHub Actions** | **Self-Hosted** on the deployment target (LXC). |

## 2. Frontend Stack
| Component | Standard | Notes |
| :--- | :--- | :--- |
| **Framework** | **React 19+** | Functional components + Hooks only. |
| **Language** | **TypeScript** | Strict mode enabled. No `any`. |
| **Build Tool** | **Vite** | Fast HMR. |
| **Styling** | **TailwindCSS** | Utility-first. Use `tailwind-merge` for components. |
| **Icons** | **Lucide React** | Consistent, clean icon set. |
| **State** | **React Context** | Use Context for global state (Auth, Data). Avoid Redux unless massive. |

## 3. Backend & Data
| Component | Standard | Notes |
| :--- | :--- | :--- |
| **BaaS** | **Firebase** | Firestore (NoSQL), Auth, Hosting (optional backup). |
| **Database** | **Firestore** | Collection-heavy design. |
| **Auth** | **Firebase Auth** | Email/Password default. |
| **Migration** | **Manual/Script** | Use `scripts/` folder for data migrations. |

## 4. Testing & Quality
| Component | Standard | Notes |
| :--- | :--- | :--- |
| **Unit Test** | **Vitest** | `npm run test:coverage`. |
| **E2E Test** | **Playwright** | `npm run test:e2e`. |
| **Linting** | **ESLint** | Standard TypeScript config. |
| **Formatting** | **Prettier** | Run on commit. |

## 5. Security Standards
1.  **Secrets**: NEVER commit `.env`. Use GitHub Secrets for CI.
2.  **Access**: Nginx runs as `www-data`. Runner runs as `actions-runner` (or constrained root).
3.  **Headers**: Nginx must serve Security Headers (`Content-Security-Policy`, `X-Frame-Options`).
