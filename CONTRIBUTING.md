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

## Release Process

We enforce a strict standard for release notes. All releases **must** act as a snapshot of the `CHANGELOG.md`.

### 1. Update Changelog
Before tagging a release, you **must** add an entry to `CHANGELOG.md` following this exact format:

```markdown
## vX.X.X - <Core Change Summary>
### <Type> (e.g., Fixed, Added, Changed)
- **<Component>**: <Description of change>
```

**Example:**
```markdown
## v0.8.4 - Performance Patch
### Fixed
- **Optimized Import**: Switched Data Migration tool...
```

### 2. Tag & Push
When you push the tag, the CI workflow will automatically read the `CHANGELOG.md` entry for that version and use it to populate the Release Title and Body.

1.  **Bump Version**: Update `package.json` version.
2.  **Update Navigation**: Update displayed version in `src/pages/DataManagement.tsx`.
3.  **Commit, Tag & Push**:
    ```bash
    git commit -am "chore: release vX.X.X"
    git tag vX.X.X
    git push origin main --tags
    ```

## Code Style
- Use **TypeScript** for all new logic.
- Use **TailwindCSS** for styling.
- Keep components small and focused.
- Use `DataContext` for global state.
