# Global GitHub Standards

> **STATUS: NON-NEGOTIABLE**
> This document defines the absolute standards for all GitHub interactions, release management, and version control for our applications. These rules must be followed by every agent and developer.

## 1. Versioning Strategy (Semantic Versioning)
We follow strictly **Semantic Versioning 2.0.0** (`MAJOR.MINOR.PATCH`).

-   **MAJOR**: Incompatible API changes or complete rewrites.
-   **MINOR**: Backwards-compatible functionality (new features).
-   **PATCH**: Backwards-compatible bug fixes.

### Tag Format
-   **ALWAYS** use the `v` prefix.
-   **Correct**: `v1.0.0`, `v0.9.15`
-   **Incorrect**: `1.0.0`, `v1.0`, `ver1.0`

---

## 2. Release Titles
Release titles must be **Categorized** and **Descriptive**. They must tell the user *what* happened at a glance.

**Format:** `v{Version} - {Category}: {Short Summary}`

### Categories
-   **Feature**: New functionality.
-   **Fix**: Bug fixes.
-   **Polish**: UI/UX improvements, formatting, styling.
-   **Infrastructure**: CI/CD, Docker, scripts, hosting changes.
-   **Refactor**: Code cleanup without behavior change.
-   **Docs**: Documentation updates only.

### Examples
-   ✅ `v0.9.16 - Polish: Move App Version to Header`
-   ✅ `v0.9.15 - Infrastructure: Implement Dynamic Versioning`
-   ✅ `v0.9.12 - Fix: Resolve Mobile Viewport Issue`
-   ❌ `v0.9.12` (Too vague)
-   ❌ `Update stuff` (Unprofessional)
-   ❌ `Fixed the bug` (Which bug?)

---

## 3. Release Notes (The "What" and "Why")
Every release must have a description body. **Do not leave it empty.** Use the following template:

```markdown
### 🚀 What's New
-   **Feature Name**: Description of the feature.
-   **Another Change**: Description of the change.

### 🐛 Bug Fixes
-   Fixed an issue where [Problem] caused [Effect].
-   Resolved crash when clicking [Button].

### 🛠️ Infrastructure & Polish
-   Updated CI/CD pipeline to [Action].
-   Refactored [Component] for better performance.
```

### Golden Rules for Notes:
1.  **Use Bullet Points**: No walls of text.
2.  **Bold Keywords**: Highlight the affected component/feature.
3.  **Human Causal**: Explain *why* it matters (e.g., "Added dynamic versioning **to prevent stale UI cache visibility**").

---

## 4. Commit Messages (Conventional Commits)
We generally follow **Conventional Commits** for git log cleanliness.

**Format:** `{type}: {description}`

### Types
-   `feat`: New feature
-   `fix`: Bug fix
-   `chore`: Maintenance, version bumps, dependency updates
-   `docs`: Documentation only
-   `style`: Formatting, missing semi-colons, etc.
-   `refactor`: Code change that neither fixes a bug nor adds a feature
-   `test`: Adding missing tests

**Examples:**
-   `feat: add dark mode toggle`
-   `fix: resolve null pointer in user auth`
-   `chore: bump version to v0.9.15`

---

## 5. Workflow Checklist (Agent Instructions)
Before pushing any code or creating a release, the Agent MUST:
1.  [ ] **Update `package.json` version**.
2.  [ ] **Create a Git Tag** matching the version (`git tag vX.Y.Z`).
3.  [ ] **Push Tag** (`git push origin main --tags`).
4.  [ ] **Draft Release Notes** immediately using the template above.
