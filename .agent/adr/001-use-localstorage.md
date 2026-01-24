# ADR-001: Use localStorage for Data Persistence

## Status
Accepted

## Context
The Bill Tracker app needs to persist user data (bills, paydays, accounts, entries) between sessions. We need a simple, fast solution for the initial release (v0.1-v0.3) before implementing authentication.

## Decision
Use browser localStorage for data persistence with JSON serialization.

## Consequences

### Positive
- **Zero setup** - No backend required
- **Fast** - Instant read/write operations
- **Simple** - Easy to implement and debug
- **Offline-first** - Works without internet connection
- **Free** - No hosting costs

### Negative
- **Single device** - Data not synced across devices
- **No collaboration** - Single user only
- **Storage limit** - 5-10MB limit per domain
- **No backup** - Data lost if browser data cleared
- **Security** - Data visible in browser dev tools

## Alternatives Considered

### 1. IndexedDB
- More storage capacity
- Better for large datasets
- More complex API
- **Rejected**: Overkill for current needs

### 2. Backend API + Database
- Multi-device sync
- Better security
- Requires server setup
- **Deferred**: Planned for v0.4+ with authentication

## Migration Path
When implementing authentication (v0.4+):
1. Read existing localStorage data
2. Migrate to Firestore/Supabase
3. Keep localStorage as offline cache
4. Sync on connection

## Notes
- Data stored under key: `bill-tracker-data`
- Includes version field for future migrations
- Automatic migration on data structure changes
