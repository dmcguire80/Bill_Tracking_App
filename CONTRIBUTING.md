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
1.  **Bump Version**: Update `package.json` version.
2.  **Update Navigation**: Update displayed version in `src/pages/DataManagement.tsx` (or `Navigation.tsx` in older versions).
3.  **Tag & Push**:
    ```bash
    git commit -am "chore: release v0.X.X"
    git tag v0.X.X
    git push origin main --tags
    ```
4.  **Deploy**: Run `update` on the server.

## Code Style
- Use **TypeScript** for all new logic.
- Use **TailwindCSS** for styling.
- Keep components small and focused.
- Use `DataContext` for global state.
