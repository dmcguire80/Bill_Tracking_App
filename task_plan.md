# Task Plan: Bill Tracker Web App
<!-- 
  WHAT: This is your roadmap for the entire task. Think of it as your "working memory on disk."
  WHY: After 50+ tool calls, your original goals can get forgotten. This file keeps them fresh.
  WHEN: Create this FIRST, before starting any work. Update after each phase completes.
-->

## Goal
<!-- 
  WHAT: One clear sentence describing what you're trying to achieve.
  WHY: This is your north star. Re-reading this keeps you focused on the end state.
  EXAMPLE: "Create a Python CLI todo app with add, list, and delete functionality."
-->
Build a modern, efficient web-based bill tracking application inspired by the user's Apple Numbers spreadsheet, featuring a list view, paid status tracking, amount tracking, and paydate management.

## Current Phase
<!-- 
  WHAT: Which phase you're currently working on (e.g., "Phase 2: Project Setup & Structure", "Phase 3").
  WHY: Quick reference for where you are in the task. Update this as you progress.
-->
Phase 1

## Phases
<!-- 
  WHAT: Break your task into 3-7 logical phases. Each phase should be completable.
  WHY: Breaking work into phases prevents overwhelm and makes progress visible.
  WHEN: Update status after completing each phase: pending → in_progress → complete
-->

### Phase 1: Requirements & Discovery
<!-- 
  WHAT: Understand what needs to be done and gather initial information.
  WHY: Starting without understanding leads to wasted effort. This phase prevents that.
-->
- [x] Analyze screenshots to understand data model and logic
- [x] Define the data structure (Bills, Paydays, Accounts)
- [x] Document specific features and requirements (Recurring bills? One-off?)
- [x] Document findings in findings.md
- **Status:** complete
<!-- 
  STATUS VALUES:
  - pending: Not started yet
  - in_progress: Currently working on this
  - complete: Finished this phase
-->

### Phase 2: Project Setup & Structure
<!-- 
  WHAT: Decide how you'll approach the problem and what structure you'll use.
  WHY: Good planning prevents rework. Document decisions so you remember why you chose them.
-->
- [x] Initialize React + Vite project
- [x] Setup Tailwind CSS
- [x] Create basic folder structure (components, hooks, data)
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation - Core UI & Data
<!-- 
  WHAT: Actually build/create/write the solution.
  WHY: This is where the work happens. Break into smaller sub-tasks if needed.
-->
- [x] Create data mock/store based on spreadsheet logic
- [x] Implement Main Table View (Bills & Paydays)
- [x] Implement "Paid" toggle functionality
- [x] Implement Account Columns and Totals
- [x] Implement Account Columns and Totals
- **Status:** complete

### Phase 4: Admin & Automation
<!--
  WHAT: Admin pages and auto-generation.
-->
- [x] Install React Router & Setup Layout
- [x] Define BillTemplate Data Model
- [x] Create Manage Bills Page
- [x] Implement Generation Logic (Bi-weekly/Monthly/Yearly)
- [x] Integrate Generator with Dashboard
- **Status:** complete

### Phase 5: CRUD Features
<!--
  WHAT: Add ability to create, edit, delete data.
  WHY: User needs to manage data, not just view it.
-->
- [x] Implement Add/Edit Bill Modal
- [x] Implement Add/Edit Payday Modal
- [x] Implement Manage Accounts Modal
- [x] Implement "Auto-fill" or "Template" feature for bulk entry
- **Status:** complete

### Phase 6: Documentation & Handoff
<!-- 
  WHAT: Create comprehensive documentation for future developers and users.
-->
- [x] Standardize Release Notes in CHANGELOG.md
- [x] Create ARCHITECTURE.md
- [x] Create CONTRIBUTING.md
- [x] Create DEPLOYMENT_GUIDE.md
- [x] Update README.md with links to new docs
- **Status:** complete

### Phase 7: Delivery & Polish
<!-- 
  WHAT: Final review and handoff to user.
  WHY: Ensures nothing is forgotten and deliverables are complete.
-->
- [x] Review UI aesthetics (Modern, Premium look)
- [x] Ensure persistence (Firestore Cloud Sync)
- [x] Final walkthrough
- **Status:** complete

### Phase 8: Hosting & Security (SaaS Foundation)
<!-- 
  WHAT: Secure the app, branding, and prepare for public hosting.
-->
- [x] Configure Firebase Hosting (`firebase.json`)
- [x] Implement Strict Schema Validation in `firestore.rules` (Hardened)
- [x] Design & Add Logo/Favicon
- **Status:** complete

### Phase 9: Mobile & UX Polish
<!-- 
  WHAT: Quality of life improvements requested by user.
-->
- [x] Maximize Mobile Experience (Sticky headers, font sizing)
- [x] "Scroll to Today" Feature
- [x] "Hide Old Data" Settings Option
- **Status:** complete

### Phase 10: SaaS & Advanced Settings
<!-- 
  WHAT: Subscription model and advanced user management.
-->
- [x] Cleanup Legacy Code (server.js, LXC)
- [x] "Delete Account" Feature (GDPR compliance)
- [x] Advanced Settings (Profile, Theme, Security) - v0.9.22
- [ ] Biometric/MFA Login Options
- **Status:** complete

### Phase 11: Standardization & Cleanup (Post-Release)
<!--
  WHAT: Enforce standards and clean up technical debt.
-->
- [x] Define Global GitHub Standards (Releases, Titles, Notes)
- [x] Create RELEASE_FIXES guide for retroactive updates
- [x] Remove legacy backend dependencies (Express, CORS)
- [x] Update DEPLOYMENT_GUIDE with Nginx architecture lessons
- **Status:** complete

### Phase 12: Future / Deferred
- [ ] Setup Stripe Integration (Firebase Extension)

## Key Questions
<!-- 
  WHAT: Important questions you need to answer during the task.
  WHY: These guide your research and decision-making. Answer them as you go.
  EXAMPLE: 
    1. Should tasks persist between sessions? (Yes - need file storage)
    2. What format for storing tasks? (JSON file)
-->
1. How does the "Payday" row logic work exactly? (RESOLVED: Reset point for running balance).
2. What are the specific rules for the account columns? (RESOLVED: Separate payment accounts).
3. Should data persist to a backend? (RESOLVED: Yes, Firestore per user).

## Decisions Made
<!-- 
  WHAT: Technical and design decisions you've made, with the reasoning behind them.
  WHY: You'll forget why you made choices. This table helps you remember and justify decisions.
  WHEN: Update whenever you make a significant choice (technology, approach, structure).
  EXAMPLE:
    | Use JSON for storage | Simple, human-readable, built-in Python support |
-->
| Decision | Rationale |
|----------|-----------|
| React + Vite | Fast, modern, standard for web apps. |
| Tailwind CSS | Rapid styling, modern utility-first approach requested by guidelines. |

## Errors Encountered
<!-- 
  WHAT: Every error you encounter, what attempt number it was, and how you resolved it.
  WHY: Logging errors prevents repeating the same mistakes. This is critical for learning.
  WHEN: Add immediately when an error occurs, even if you fix it quickly.
  EXAMPLE:
    | FileNotFoundError | 1 | Check if file exists, create empty list if not |
    | JSONDecodeError | 2 | Handle empty file case explicitly |
-->
| Error | Attempt | Resolution |
|-------|---------|------------|
| Deployment Crash | 1 | Production runner missing `.env` variables. Reverted to hardcoded keys for hotfix. |
|       | 1       |            |

## Notes
<!-- 
  REMINDERS:
  - Update phase status as you progress: pending → in_progress → complete
  - Re-read this plan before major decisions (attention manipulation)
  - Log ALL errors - they help avoid repetition
  - Never repeat a failed action - mutate your approach instead
-->
- Update phase status as you progress: pending → in_progress → complete
- Re-read this plan before major decisions (attention manipulation)
- Log ALL errors - they help avoid repetition
