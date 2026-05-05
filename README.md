# Descent

> A mobile-friendly personal finance tracker for managing bills, paydays, and account projections.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/dmcguire80/Bill_Tracking_App.svg)](https://github.com/dmcguire80/Bill_Tracking_App/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/dmcguire80/Bill_Tracking_App.svg)](https://github.com/dmcguire80/Bill_Tracking_App/pulls)

📘 **[Architecture](ARCHITECTURE.md)** &nbsp;|&nbsp; 🛠 **[Contributing](CONTRIBUTING.md)** &nbsp;|&nbsp; 🚀 **[Deployment](DEPLOYMENT_GUIDE.md)** &nbsp;|&nbsp; 📝 **[Changelog](CHANGELOG.md)**

Live at **[descent.thorshome.xyz](https://descent.thorshome.xyz)**.

---

## What is Descent?

Descent is a single-page web app for tracking month-to-month cash flow. It models the way bills *actually* land — paydays push the balance up, recurring bills pull it down — and shows the running balance per account so you can see what every paycheck has to cover.

## Features

### 🔐 Authentication & data
- Email / password and Google sign-in via **Firebase Auth**
- Per-user data isolation enforced by **Firestore security rules**
- Real-time sync across devices

### 📊 Dashboard
- Running balance across multiple accounts
- Bill and payment management with sortable, filterable table
- One-time payments and deposits

### 📅 Templates
- Recurring bill templates (weekly, bi-weekly, monthly, semi-monthly, yearly)
- Payday schedule templates
- Active / inactive status with optional end date
- Auto-generates entries from templates

### 📈 Analytics
- Year-to-date paid vs planned
- Bill amount change detection
- Historical year comparison

### 🎨 UX
- Responsive (mobile + desktop)
- Dark theme with gradient accents

## Tech stack

| Layer        | Tool                                     |
| ------------ | ---------------------------------------- |
| UI           | React 19 + TypeScript                    |
| Routing      | React Router v7                          |
| Styling      | Tailwind CSS v4                          |
| Icons        | Lucide React                             |
| Build        | Vite 7                                   |
| Tests        | Vitest + Testing Library + Playwright    |
| State        | React Context                            |
| Auth + Data  | Firebase Auth + Cloud Firestore          |
| Hosting      | **Cloudflare Pages**                     |
| CI / Deploy  | GitHub Actions + `wrangler-action`       |

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the full pipeline.

## Local development

```bash
# Clone
git clone git@github.com:dmcguire80/Bill_Tracking_App.git
cd Bill_Tracking_App

# Install (uses pnpm; install with `npm i -g pnpm` if you don't have it)
pnpm install

# Configure Firebase
cp .env.example .env.local
# fill in the VITE_FIREBASE_* values from the Firebase console

# Run
pnpm dev
```

The dev server is at `http://localhost:5173`.

### Other scripts

```bash
pnpm run build         # production build into ./dist
pnpm run type-check    # TypeScript only, no emit
pnpm run lint          # ESLint
pnpm run test          # Vitest unit tests
pnpm run test:e2e      # Playwright end-to-end
pnpm run preview       # serve ./dist locally
```

## Project structure

```
src/
├── components/       # Reusable UI components
├── config/           # Firebase initialisation
├── context/          # React Context providers (Auth, Data)
├── data/             # Constants and seed data
├── hooks/            # Custom React hooks
├── pages/            # Route components
├── types/            # TypeScript type definitions
├── utils/            # Pure helpers (analytics, generators, dates)
├── App.tsx           # Routes + providers
└── main.tsx          # Entry point
```

## Usage

### Bill templates
Settings → Manage Bills → **New Template**. Set the recurrence, day of month, amount, and account. Active templates auto-generate entries onto the dashboard.

### Paydays
Settings → Manage Paydays. Templates here drive the running-balance math; entries are projected forward and you can adjust the actual amount when a paycheck lands.

### Tracking payments
On the Dashboard:
- check a row to mark a bill paid
- **One-time Payment** for non-recurring outflows
- **Add Deposit** for non-payday inflows

### Analytics
Pick a year, see paid vs planned and amount-change deltas across categories.

## Roadmap

### Done
- [x] Email + Google auth
- [x] Per-user Firestore isolation
- [x] Local → Cloud migration tool
- [x] Real-time sync
- [x] Batch-write performance pass
- [x] Migrate hosting to Cloudflare Pages

### Considering
- [ ] Budget categories with spending limits
- [ ] Spending charts (already have `recharts` available in the family)
- [ ] CSV / PDF export
- [ ] Recurring payment reminders (email or push)
- [ ] Mobile app shell (likely Capacitor before React Native)

## Contributing

PRs welcome. Please:
1. Run `pnpm run type-check && pnpm run lint && pnpm run build` before pushing.
2. If you add a new feature flag or env var, update both `.env.example` and the deploy guide.
3. Keep commits scoped — one logical change per commit.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more.

## License

MIT.
