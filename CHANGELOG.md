# Changelog

All notable changes to this project will be documented in this file.

## v0.9.3 - Privacy & Cleanup
### Added
- **Delete Account**: Users can now permanently delete their account and all data (GDPR compliance).
### Removed
- **Legacy Backups**: Removed the legacy self-hosted automated backup system in favor of Firebase Cloud Sync.

## v0.9.2 - Bug Fixes
### Fixed
- **Settings Navigation**: Fixed missing navigation menu on Preferences page.

## v0.9.1 - Mobile & UX Polish
### Added
- **Scroll to Today**: New button in dashboard header to jump to current date.
- **Preferences**: New Settings tab with "Hide Old Data" toggle.
- **Mobile**: Sticky table headers and improved touch targets.

## v0.9.0 - Linear Budget Rebrand & Security
### Changed
- **Rebrand**: Application renamed to **Linear Budget**. New logo and branding applied.
- **Security**: Added strict `firestore.rules` to enforce user-data isolation.
- **Hosting**: Added `firebase.json` configuration for firebase hosting.

## v0.8.5 - Cleanup Release
### Removed
- **Migration Tool**: Removed the legacy "Migrate to Cloud" tool and component as migration is complete.

## v0.8.4 - Performance Patch
### Fixed
- **Optimized Import**: Switched Data Migration tool to use Firestore Batch Writes (limit 500 ops). This resolves the timeout/hanging issue during the "Creating..." step of setup, making migration nearly instant.

## v0.8.3 - Data Reliability Patch
### Fixed
- **Setup Reliability**: Added data sanitization to prevent Firestore from rejecting `undefined` values during Setup/Migration.
- **Error Reporting**: Detailed alert messages are now shown if the Setup Wizard encounters an error, rather than failing silently.

## v0.8.2 - UX & Setup Fixes
### Fixed
- **Setup Wizard**: Fixed "Start Tracking" button click handler which was failing to await the async cloud create operation.
- **UX**: Added "Creating..." loading state to the Setup finish button to provide visual feedback.

## v0.8.1 - Critical Hotfix
### Fixed
- **Startup Crash**: Resolved a "Solid Blue Screen" startup crash caused by incorrect React Context nesting (`AuthProvider` vs `DataProvider`).

## v0.8.0 - Security & Cloud Release
### Added
- **Authentication**: Added secure Login, Signup, and Forgot Password flows.
- **Cloud Sync**: Migrated from local JSON storage to Google Cloud Firestore (Real-time sync).
- **Multi-User Support**: Data is now isolated per user account.
- **Migration Tool**: Added utility to migrate legacy server data to the cloud.

### Changed
- **Protected Routes**: Dashboard and Settings are now guarded by authentication.
- **Firebase Integration**: Full SDK setup with Auth and Firestore.

## v0.7.13 - Maintenance Release
### Added
- **Update Command**: Created a shell alias `update` that runs the full installation/update script. Check `/usr/local/bin/update` in the container.

## v0.7.12 - UI Polish
### Changed
- **Mobile Table**: Enabled horizontal scrolling for all account columns on mobile while keeping "Month" and "Date" columns frozen.
- **UI Tweaks**: Relocated version tag from main navigation to the footer of the Data Management page.
- **Data Management**: Added display of the local backup path (`/opt/bill-tracker/backups`).

## v0.7.11 - Mobile Optimizations
### Changed
- **Mobile Layout**: Condensed the "Bill Tracker" main header and "Dashboard" page header on mobile to save vertical space.
- **Navigation**: Switched to icon-only navigation links on mobile devices.
- **Bill Table**: Implemented sticky columns for Month/Date and optimized column widths for mobile.

## v0.7.10 - Server Process Fix
### Fixed
- **Server Execution**: Updated `install.sh` to forcefully restart the PM2 process, ensuring the application switches from the static `serve` fallback to the full `server.js` backend. This resolves API 404 errors preventing cross-device sync.

## v0.7.9 - Backup Restoration
### Added
- **Restore from Backup**: Added a file upload option to the Setup Wizard's welcome screen, allowing users to restore a `bill-tracker-data.json` backup immediately on a new device.
- **Setup Route**: Moved the Setup Wizard to a dedicated `/setup` route with automatic redirection logic based on data availability.

## v0.7.8 - Critical Fix
### Fixed
- **Setup Loop**: Fixed an issue where the Setup Wizard would persist on new devices by changing the completion check to rely on server-side data (`accounts.length > 0`) instead of `localStorage`.

## v0.7.4 - Server-Side Storage
### Added
- **Server-Side Storage**: Migrated data source of truth from `localStorage` to `server.js` (JSON file storage).
- **Automated Backups**: Added a backend system to create daily/weekly JSON backups in `/opt/bill-tracker/backups`.
- **Sync**: Implemented `GET/POST /api/data` endpoints for cross-device synchronization.

## v0.7.2 - Installation Fix
### Fixed
- **Installation**: Improved `install.sh` git tag fetching to handle detached states and force updates.

## v0.3.0 - UX & Navigation
### Added
- **Active Status**: Added active/inactive template status.
- **Auto-Deactivation**: Implemented end month for automatic deactivation.
- **Unified Navigation**: Created unified navigation system for improved UX consistency.

## v0.2.0 - Analytics Release
### Added
- **Bill Analytics**: Year-to-date paid vs planned tracking.
- **Amount Change Detection**: Visual indicators for bill amount changes with percentages.
- **Historical Analysis**: Year selector for historical financial review.
- **Insights**: Status badges (All Paid, In Progress, None Paid) and change notifications.

## v0.1.0 - Initial Release
### Added
- **Core Tracking**: Bill and payday tracking.
- **Templates**: Recurring bill template management.
- **Balances**: Running balance calculations.
- **Accounts**: Multiple payment account management.
