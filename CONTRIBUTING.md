# Contributing to Descent

## Development setup

### Prerequisites
- Node.js 22+
- pnpm 10+ (`npm install -g pnpm` if you don't have it)

### Local development

```bash
# Install dependencies
pnpm install

# Configure Firebase
cp .env.example .env.local
# fill in the VITE_FIREBASE_* values from the Firebase console

# Start the dev server
pnpm dev
```

The dev server runs at `http://localhost:5173`. There is no separate
backend process — the app talks directly to Firebase from the browser.

### Building for production

```bash
pnpm run build
```

The output goes to `./dist`. Cloudflare Pages serves this directory.
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the full pipeline.

## Code style

- **TypeScript** for all new logic. No `.js` source files.
- **TailwindCSS v4** for styling. Avoid one-off CSS files; if a class
  string is getting long, extract a component instead.
- Components stay **small and focused**. Pages compose components, not
  the other way around.
- **`DataContext`** is the source of truth for synced data. Don't wire
  components directly to Firestore.

## Pre-push checklist

Run all of these locally before pushing. CI will fail if you skip them.

```bash
pnpm run format          # Prettier
pnpm run lint            # ESLint (fail on errors, warnings allowed)
pnpm run type-check      # tsc --noEmit
pnpm run test            # Vitest
pnpm run build           # final sanity check
```

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `pnpm run format`      | Auto-format with Prettier                   |
| `pnpm run format:check`| Verify formatting (CI uses this)            |
| `pnpm run lint`        | ESLint                                      |
| `pnpm run lint:fix`    | Auto-fix lint where possible                |
| `pnpm run type-check`  | TypeScript without emitting                 |
| `pnpm run test`        | Vitest unit tests                           |
| `pnpm run test:e2e`    | Playwright end-to-end tests                 |

## Commit style

- One logical change per commit.
- Conventional Commits where it makes sense (`feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:`, `test:`).
- Subject line ≤ 72 chars; body wrapped at ~80.

## Release process

> Follow the **[Global GitHub Standards](.agent/standards/GITHUB_STANDARDS.md)**.

### Summary
1. **Tag format:** `vX.Y.Z`.
2. **Title format:** `v{Version} - {Category}: {Summary}`.
3. **Notes:** standard template with sections for "What's New",
   "Bug Fixes", "Infrastructure", etc.

### Workflow

```bash
# 1. Bump the version
# edit package.json: "version": "X.Y.Z"
git add package.json
git commit -m "chore: release vX.Y.Z"

# 2. Tag and push
git tag vX.Y.Z
git push origin main --tags
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles
the actual deploy. There is no manual `update.sh` script anymore —
deploys happen automatically when `main` is pushed.

`scripts/extract-release-notes.cjs` can pull the relevant section out
of `CHANGELOG.md` for a given tag if you need it for a release body.

## Reporting bugs

Open a GitHub issue with:
- What you expected
- What actually happened
- Steps to reproduce
- Browser + OS
- Screenshot if it's visual

If the bug touches data, **do not paste real user data**. Make up
sample bills.
