# Contributing to Bill Tracker

## Development Setup

### Prerequisites
- Node.js v18+
- npm

### Local Development
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    *Note: The dev server runs only the frontend. To test API interactions, you may need to run `node server.js` locally and configure a proxy, or mock the API.*

### Building for Production
```bash
npm run build
```
This generates the `dist/` folder served by Nginx/Express.

## Release Process & Standards

> **⚠️ NON-NEGOTIABLE**: strictly follow the **[Global GitHub Standards](.agent/standards/GITHUB_STANDARDS.md)**.

### Summary of Standards
1.  **Tag Format**: Always use `vX.Y.Z` (e.g., `v0.9.15`).
2.  **Titles**: Must use `v{Version} - {Category}: {Summary}` format (e.g., `v0.9.16 - Polish: Move App Version to Header`).
3.  **Notes**: Must use the standard template with bullet points for "What's New", "Bug Fixes", etc.

Refer to `.agent/standards/GITHUB_STANDARDS.md` for the full template and rules.

### Workflow
1.  **Bump Version**: Update `package.json`.
2.  **Commit & Tag**:
    ```bash
    git commit -am "chore: release vX.X.X"
    git tag vX.X.X
    git push origin main --tags
    ```
3.  **Create Release**: Use the GitHub UI or CLI to draft the release using the standard template.

## Code Style
- Use **TypeScript** for all new logic.
- Use **TailwindCSS** for styling.
- Keep components small and focused.
- Use `DataContext` for global state.

## Pre-Push Checklist

**CRITICAL**: Run these commands before every commit to prevent CI failures:

```bash
# 1. Format all code
npm run format

# 2. Fix auto-fixable linting issues
npm run lint:fix

# 3. Verify type safety
npm run type-check

# 4. Run tests
npm run test
```

### Why This Matters
- The CI pipeline runs `npm run format:check` and will **fail** if code is not formatted
- Running `npm run format` locally ensures your code passes CI checks
- This saves time and keeps the commit history clean

### Quick Command Reference
| Command | Purpose |
|---------|---------|
| `npm run format` | Auto-format all code with Prettier |
| `npm run format:check` | Check if code is formatted (CI uses this) |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run type-check` | Verify TypeScript types |
