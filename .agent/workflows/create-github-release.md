---
description: Create GitHub Release using gh CLI
---

# Creating GitHub Releases with gh CLI

This workflow uses the GitHub CLI (`gh`) to create releases programmatically. This is the preferred method because it properly handles authentication and formatting.

## Prerequisites

- GitHub CLI installed (`gh --version`)
- Authenticated with GitHub (`gh auth status`)
- Version updated in `package.json`
- Changes committed and pushed
- Git tag created and pushed

## Steps

// turbo-all

### 1. Verify gh CLI is installed and authenticated

```bash
gh --version
gh auth status
```

### 2. Create or update a release

**Option A: Create a new release from scratch**

```bash
gh release create v0.9.27 \
  --title "v0.9.27 - Fix: Critical Bug Fixes and UX Enhancements" \
  --notes-file /Users/dmcguire/.gemini/antigravity/brain/81e88511-da95-4240-92e4-9b07d1042e7a/release_notes_v0.9.27.md
```

**Option B: Update an existing release**

```bash
gh release edit v0.9.27 \
  --title "v0.9.27 - Fix: Critical Bug Fixes and UX Enhancements" \
  --notes-file /Users/dmcguire/.gemini/antigravity/brain/81e88511-da95-4240-92e4-9b07d1042e7a/release_notes_v0.9.27.md
```

### 3. Verify the release

```bash
gh release view v0.9.27
```

## Notes

- The `--notes-file` flag reads the release notes from a file, preserving all formatting
- **Do not include the version/title as a header** in the notes file - it's already in the release title field
- Use `--draft` flag if you want to create a draft release first
- Use `--prerelease` flag for pre-release versions
- The browser subagent cannot create releases because it requires GitHub authentication

## Release Notes Format

Release notes should start directly with sections (no duplicate title):

```markdown
### 🐛 Bug Fixes
- **Feature**: Description

### 🚀 What's New
- **Feature**: Description

### 🛠️ Infrastructure & Polish
- **Change**: Description
```

**Don't do this:**
```markdown
# v0.9.27 - Fix: Title  ← This duplicates the release title field
### 🐛 Bug Fixes
```

## Why Browser Subagent Fails

The browser subagent approach fails because:
1. It opens an unauthenticated browser session
2. GitHub requires login to create/edit releases
3. The subagent cannot access your stored credentials
4. Even if it could log in, it would require 2FA

The `gh` CLI is the correct tool because:
- It uses your authenticated session
- It properly handles API tokens
- It preserves markdown formatting
- It's designed for automation
