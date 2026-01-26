# Retroactive Release Fixes

Use this guide to update your GitHub Releases to match the new global standards.

| Tag | Current State (Log) | **NEW Standard Title** | **Notes Content** (Copy & Paste) |
| :--- | :--- | :--- | :--- |
| `v0.9.25` | `fix(ui): standardize settings layout` | `v0.9.25 - Fix: Settings Page Layout` | `### 🐛 Bug Fixes<br>- Fixed inconsistent margins on Settings pages.<br>- Standardized layout width to match Dashboard/Analytics.` |
| `v0.9.24` | `fix(nav): remove redundant navs` | `v0.9.24 - Fix: Navigation & Header` | `### 🐛 Bug Fixes<br>- Removed side navigation.<br>- Restored global header consistency.` |
| `v0.9.23` | `fix(ux): success toasts` | `v0.9.23 - Polish: UX Feedback` | `### 🛠️ Polish<br>- Added success toasts for settings changes.<br>- Improved visual feedback.` |
| `v0.9.22` | `feat: Advanced Settings` | `v0.9.22 - Feat: Advanced Settings` | `### 🚀 Features<br>- Added Profile, Theme, and Security settings pages.` |
| `v0.9.21` | `chore: integrate gh secrets` | `v0.9.21 - Infrastructure: Secrets` | `### 🛠️ Infrastructure<br>- Integrated GitHub Secrets for production build.` |
| `v0.9.20` | `fix: revert env vars` | `v0.9.20 - Hotfix: Revert Env Vars` | `### 🐛 Bug Fixes<br>- Temporary revert of environment variables to fix build.` |
| `v0.9.19` | `chore: standardization & security` | `v0.9.19 - Chore: Standards & Security` | `### 🔒 Security<br>- Moved Firebase config to .env.<br><br>### 📘 Documentation<br>- Added NEW_APP_PLAYBOOK.md.<br>- Added INFRASTRUCTURE_STACK.md.<br>- Added TEAM_ROLES.md.` |
| `v0.9.18` | `style: fix formatting in Layout.tsx` | `v0.9.18 - Polish: Fix Layout Formatting` | `### 🛠️ Polish<br>- Fixed linting/formatting errors in Layout.tsx.` |
| `v0.9.17` | `fix: correct header syntax in Layout.tsx` | `v0.9.17 - Fix: Layout Header Syntax` | `### 🐛 Bug Fixes<br>- Resolved syntax error in Layout header (missing tag).` |
| `v0.9.16` | `style: move app version to header` | `v0.9.16 - Polish: App Header Versioning` | `### 🚀 What's New<br>- Moved app version display to the main header for better visibility.<br>- Removed duplicate version from Data Management footer.` |
| `v0.9.15` | `feat: use dynamic app version` | `v0.9.15 - Infrastructure: Dynamic Versioning` | `### 🛠️ Infrastructure<br>- Implemented dynamic version injection from package.json.<br>- Fixed stale version display in UI.` |
| `v0.9.14` | `chore: bump version to 0.9.14` | `v0.9.14 - Infrastructure: CI Pipeline Fixes` | `### 🛠️ Infrastructure<br>- Validated full deployment pipeline.<br>- Fixed end-to-end tests.` |
| `v0.9.13` | `chore: bump version to 0.9.13` | `v0.9.13 - Fix: CI/CD Test Runner` | `### 🐛 Bug Fixes<br>- Resolved "No test files found" error.<br>- Excluded E2E tests from Unit Test runner.<br>- Removed Codecov dependency.` |
| `v0.9.12` | `fix: v0.9.12 - Strict update script` | `v0.9.12 - Infrastructure: Strict Update Logic` | `### 🛠️ Infrastructure<br>- Hardened update.sh to target /var/www/html explicitly.<br>- Prevented updates to manual clone folders.` |
| `v0.9.11` | `chore: v0.9.11 - Force runner update` | `v0.9.11 - Infrastructure: Runner Force Update` | `### 🛠️ Infrastructure<br>- Forced self-hosted runner to pull latest changes.<br>- Debugging deployment directory paths.` |
| `v0.9.10` | `feat: v0.9.10 - Clean Release Notes` | `v0.9.10 - Infrastructure: Release Note Automation` | `### 🚀 What's New<br>- Cleaned up automated release note generation.<br>- Improved GitHub Actions styling.` |
| `v0.9.9` | `feat: v0.9.9 - Auto-create Releases` | `v0.9.9 - Infrastructure: Auto-Releases` | `### 🛠️ Infrastructure<br>- Enabled automatic GitHub Release creation on tag push.<br>- Streamlined CI/CD feedback loop.` |

### How to Apply
1.  Go to **GitHub > Releases**.
2.  Click **Edit** on each release (or "Draft a new release" if missing).
3.  Copy the **Title** and **Notes** from the table above.
4.  Save.
