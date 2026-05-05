# Deployment Guide

Descent is a static React + Vite SPA. The production deploy target is
**Cloudflare Pages**; the data layer (Auth + Firestore) stays on Firebase.

## Architecture at a glance

```
            ┌─────────────────────────────┐
            │  Browser (descent.<host>)   │
            └──────────────┬──────────────┘
                           │
                  HTTPS    │
                           ▼
        ┌──────────────────────────────────┐
        │  Cloudflare Pages                │
        │  - static SPA bundle (Vite dist) │
        │  - SPA fallback to /index.html   │
        │  - long-cache for hashed assets  │
        └──────────────┬───────────────────┘
                       │
                       │ Firebase JS SDK
                       ▼
        ┌──────────────────────────────────┐
        │  Firebase                        │
        │  - Auth (Email + Google)         │
        │  - Firestore (per-user docs)     │
        └──────────────────────────────────┘
```

No server-side code lives in this repo. There is no Express server, no
LXC container, no Cloud Function. Everything the app does at runtime is
either static (served by Cloudflare) or talks straight to Firebase via
the SDK.

## Production URL

- `https://descent.thorshome.xyz` — main branch
- `https://<branch>.descent.pages.dev` — preview deploys per branch

## Required secrets

Set these once in **GitHub → Settings → Secrets and variables → Actions**.
They are consumed by `.github/workflows/deploy.yml`:

| Secret                              | Where to find it                                                       |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`              | Cloudflare dashboard → My Profile → API Tokens → Pages: Edit template  |
| `CLOUDFLARE_ACCOUNT_ID`             | Cloudflare dashboard → right sidebar of any account page               |
| `VITE_FIREBASE_API_KEY`             | Firebase console → Project settings → Web app config                   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | same                                                                   |
| `VITE_FIREBASE_PROJECT_ID`          | same                                                                   |
| `VITE_FIREBASE_STORAGE_BUCKET`      | same                                                                   |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same                                                                   |
| `VITE_FIREBASE_APP_ID`              | same                                                                   |
| `VITE_FIREBASE_MEASUREMENT_ID`      | same (only present if Analytics is enabled)                            |

> Firebase web API keys are not actually secret. Security is enforced by
> Firestore rules (`firestore.rules`) and Auth providers. They live in
> GitHub secrets purely so they don't get committed to the repo.

## Deploy flow

1. Push to a feature branch → CI runs `type-check`, `lint`, and `build`.
2. CI deploys the build artifact to a **preview** Pages URL named after
   the branch.
3. Open a PR → Cloudflare leaves a comment with the preview URL.
4. Merge to `main` → CI deploys to the production project, which is
   bound to `descent.thorshome.xyz`.

The deploy is idempotent. If a build fails, the previous deploy stays
live; Cloudflare only flips traffic after a successful upload.

## First-time setup (already done, kept as runbook)

These steps were performed once when the project was bootstrapped. They
are documented here so the next person (probably future Dave or Zola)
knows what state Cloudflare is in.

1. **Create the Pages project.** From a clean checkout:

   ```sh
   pnpm run build
   wrangler pages project create descent \
     --production-branch=main
   ```

2. **First manual deploy** (so the project exists before CI tries to use it):

   ```sh
   wrangler pages deploy ./dist --project-name=descent --branch=main
   ```

3. **Bind the custom domain** in the Cloudflare dashboard:
   Pages → `descent` → Custom domains → `descent.thorshome.xyz`.
   Cloudflare auto-creates the CNAME because the zone is on the same
   account.

4. **Add Firebase env vars to the Pages project** (production +
   preview) so client-side rebuilds inside the dashboard also work.
   GitHub Actions builds use the same values from GitHub secrets, so
   this step is only required if someone clicks "Retry deploy" from
   inside the Cloudflare dashboard.

## Local development

```sh
pnpm install
cp .env.example .env.local
# fill in the VITE_FIREBASE_* values from the Firebase console
pnpm dev
```

## Rolling back

Cloudflare Pages keeps every prior deployment. To roll back:

1. Cloudflare dashboard → Pages → `descent` → Deployments.
2. Find the last good deploy → ⋯ → "Rollback to this deployment".

This is instant and does not invalidate caches; users on stale tabs may
keep seeing the bad deploy until they refresh, which is unavoidable for
SPAs unless you wire a service-worker version check.

## What does *not* belong on Cloudflare

- **Firestore rules.** Stay where they are. Deploy with
  `firebase deploy --only firestore:rules` from a machine with
  `firebase` CLI installed. Rules-only deploys do not touch hosting.
- **Auth providers.** Configure in the Firebase console. The Cloudflare
  side just consumes the public config.

## When to revisit this guide

- If we ever move auth to Workers + a real auth provider (WorkOS,
  Clerk, Better-Auth), update the architecture diagram and add a
  Workers section.
- If we add an API surface (Workers route, D1, R2), add the bindings to
  `wrangler.toml` and document them here.
- If the project is renamed, search-and-replace `descent` everywhere.
