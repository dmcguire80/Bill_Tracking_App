# Architecture

## System overview

Descent is a static React + Vite single-page application backed entirely by Firebase for runtime services. There is no Node.js backend in this repository, no Express server, and no container.

```
                     ┌─────────────────────────────┐
  Cloudflare Pages   │  Static SPA bundle (Vite)   │
  (descent.thors-    │  - /assets/*  cached 1y     │
   home.xyz)         │  - / → index.html (SPA)     │
                     └──────────────┬──────────────┘
                                    │
                       Firebase JS  │
                       SDK (HTTPS)  │
                                    ▼
                     ┌──────────────────────────────┐
                     │  Firebase project            │
                     │  - Auth (Email + Google)     │
                     │  - Firestore (per-user docs) │
                     └──────────────────────────────┘
```

## Core stack

| Concern        | Choice                                           |
| -------------- | ------------------------------------------------ |
| Language       | TypeScript                                       |
| UI             | React 19                                         |
| Routing        | React Router v7                                  |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)            |
| Build          | Vite 7                                           |
| State          | React Context (`AuthContext`, `DataContext`)     |
| Auth           | Firebase Auth                                    |
| Persistence    | Firestore (`onSnapshot` for real-time sync)      |
| Test runner    | Vitest                                           |
| E2E            | Playwright                                       |
| Hosting        | Cloudflare Pages (production + preview deploys)  |

## Data model

All user data lives under top-level Firestore collections, scoped per
user via a `userId` field. Security rules enforce isolation.

```
firestore/
├── accounts/            # checking / savings / credit accounts
├── entries/             # individual bills and paydays as they materialise
├── templates/           # recurring bill templates
└── paydayTemplates/     # recurring payday templates
```

Each document carries `userId == request.auth.uid` and rules require it
on every read, write, create, and delete. See `firestore.rules` for the
full policy.

### Sync model

The client is *streaming*, not request/response:

1. On login (`AuthContext` resolves a `User`), `DataContext` opens four
   `onSnapshot` subscriptions — one per top-level collection — filtered
   to the current user.
2. Snapshots stream into local React state. Components render from
   that state and are reactive by default.
3. On logout, `DataContext` tears down the subscriptions and clears
   cached arrays in the cleanup function. There is no manual refresh
   button anywhere in the app.

Because Firestore handles conflict resolution and optimistic local
writes, every device sees a consistent view within a few hundred ms of
any mutation.

## Calculations

Financial projections are pure functions in `src/hooks/useCalculations.ts`
and `src/utils/`. They take the current snapshot arrays and produce:

- **Running balance** per account, projected forward through future
  paydays and bills.
- **Year-to-date** totals: paid vs planned per category.
- **Bill amount changes**: detects when a recurring bill's amount has
  shifted between months.

These are computed in render, memoised with `useMemo`. There is no
server-side calculation step.

## Directory structure

```
src/
├── components/       # Reusable UI: tables, forms, layout, navigation
├── config/           # Firebase initialisation
├── context/          # AuthContext, DataContext
├── data/             # Seed data and constants
├── hooks/            # useCalculations, useAuth wrappers
├── pages/            # Route-level components
├── types/            # Shared TypeScript types
├── utils/            # Pure helpers (analytics, generators, dates)
├── App.tsx           # Routes + provider tree
└── main.tsx          # Entry point
```

## Deployment

- **Hosting**: Cloudflare Pages, project name `descent`. The build
  output is `./dist`. SPA fallback and cache headers live in
  `public/_redirects` and `public/_headers`.
- **CI**: `.github/workflows/deploy.yml` runs type-check → lint →
  build → deploy on every push and PR.
- **Domain**: `descent.thorshome.xyz`, bound in the Cloudflare dashboard.
  The `thorshome.xyz` zone is on the same Cloudflare account so the
  CNAME is created automatically.

The full pipeline is documented in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Why this shape?

- **Why Firebase for data?** Firestore's real-time subscriptions and
  per-user rules give us most of "the backend" for free. There is no
  business logic that needs server-side enforcement beyond what rules
  can express.
- **Why Cloudflare Pages for hosting?** Unlimited bandwidth on the
  free tier, edge caching, and instant rollbacks. Firebase Hosting's
  10 GB/month bandwidth cap is the only place it would have eventually
  bitten us, and Pages doesn't have one.
- **Why not migrate auth + data to Cloudflare D1 + Workers?** The cost
  of doing so (rewriting subscriptions as SSE / Durable Objects,
  re-implementing per-user policy, finding a real auth provider) is
  much higher than what we gain. Hosting was the only piece worth
  moving.

## Future considerations

- **Workers for shared logic.** If we ever add features that have to
  run on the server (e.g. scheduled email reminders, admin views), a
  Cloudflare Worker is the natural place to add it. Bindings would
  live in `wrangler.toml`.
- **Code splitting.** The current bundle is ~685 kB (gzip ~204 kB),
  dominated by the Firebase SDK. If first-paint becomes a concern,
  split Firestore behind a dynamic import on routes that need it.
- **Service worker.** None currently. Worth adding if we want the
  shell to be installable as a PWA or to mediate stale-while-
  revalidate for the SPA shell.
