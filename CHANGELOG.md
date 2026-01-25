# Changelog

All notable changes to this project will be documented in this file.

## v0.8.0 (2026-01-25)
### Major Features
- **Authentication**: Added secure Login, Signup, and Forgot Password flows.
- **Cloud Sync**: Migrated from local JSON storage to Google Cloud Firestore (Real-time sync).
- **Multi-User Support**: Data is now isolated per user account.
- **Migration Tool**: Added utility to migrate legacy server data to the cloud.

### Infrastructure
- **Protected Routes**: Dashboard and Settings are now guarded by authentication.
- **Firebase Integration**: Full SDK setup with Auth and Firestore.

## v0.7.13 (2026-01-24)
### Added
- **Update Command**: Created a shell alias `update` that runs the full installation/update script. Check `/usr/local/bin/update` in the container.

## [v0.7.12] - 2026-01-24
### Changed
- **Mobile Table**: Enabled horizontal scrolling for all account columns on mobile while keeping "Month" and "Date" columns frozen.
- **UI**: Relocated version tag from main navigation to the footer of the Data Management page.
- **Data Management**: Added display of the local backup path (`/opt/bill-tracker/backups`).

## [v0.7.11] - 2026-01-24
### Changed
- **Mobile Layout**: Condensed the "Bill Tracker" main header and "Dashboard" page header on mobile to save vertical space.
- **Navigation**: Switched to icon-only navigation links on mobile devices.
- **Bill Table**: Implemented sticky columns for Month/Date and optimized column widths for mobile.

## [v0.7.10] - 2026-01-24
### Fixed
- **Server Execution**: Updated `install.sh` to forcefully restart the PM2 process, ensuring the application switches from the static `serve` fallback to the full `server.js` backend. This resolved API 404 errors preventing cross-device sync.

## [v0.7.9] - 2026-01-24
### Added
- **Restore from Backup**: Added a file upload option to the Setup Wizard's welcome screen, allowing users to restore a `bill-tracker-data.json` backup immediately on a new device.
- **Setup Route**: Moved the Setup Wizard to a dedicated `/setup` route with automatic redirection logic based on data availability.

## [v0.7.8] - 2026-01-24
### Fixed
- **Setup Loop**: Fixed an issue where the Setup Wizard would persist on new devices by changing the completion check to rely on server-side data (`accounts.length > 0`) instead of `localStorage`.

## [v0.7.4] - 2026-01-24
### Added
- **Server-Side Storage**: Migrated data source of truth from `localStorage` to `server.js` (JSON file storage).
- **Automated Backups**: Added a backend system to create daily/weekly JSON backups in `/opt/bill-tracker/backups`.
- **Sync**: Implemented `GET/POST /api/data` endpoints for cross-device synchronization.

## [v0.7.2] - 2026-01-24
### Fixed
- **Installation**: Improved `install.sh` git tag fetching to handle detached states and force updates.
