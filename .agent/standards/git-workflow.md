# Git Workflow Standards

## Overview

This document defines the Git workflow standards for all projects. These standards ensure consistent commit history, clear communication, and efficient collaboration.

## Commit Message Format

### Conventional Commits

All commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, missing semi-colons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts

### Examples

```bash
feat(auth): add password reset functionality

fix(dashboard): correct balance calculation for negative amounts

docs: update README with deployment instructions

refactor(utils): simplify date formatting logic

test(components): add unit tests for BillForm

chore(deps): update dependencies to latest versions
```

### Scope

The scope should be the name of the affected module, component, or feature:
- `auth`, `dashboard`, `analytics`
- `components`, `utils`, `hooks`
- `api`, `database`, `config`

## Branch Naming

### Branch Types

- `main` - Production-ready code
- `develop` - Integration branch (optional, for larger teams)
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Emergency production fixes
- `release/` - Release preparation

### Naming Convention

```
<type>/<short-description>
```

Examples:
```
feature/user-authentication
feature/bill-analytics
bugfix/calculation-error
hotfix/security-patch
release/v1.2.0
```

## Workflow

### Feature Development

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat(scope): add new feature"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Push to remote
git push origin feature/new-feature

# 5. Create Pull Request
# (via GitHub/GitLab UI)

# 6. After review and approval, merge to main
# (squash commits if multiple small commits)
```

### Hotfix Process

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-fix

# 2. Make fix and commit
git commit -m "fix(critical): resolve security vulnerability"

# 3. Push and create PR
git push origin hotfix/critical-fix

# 4. After approval, merge to main
# 5. Tag the release
git tag -a v1.2.1 -m "Hotfix: security patch"
git push --tags
```

## Semantic Versioning

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Examples

- `v1.0.0` → `v2.0.0` - Breaking API changes
- `v1.0.0` → `v1.1.0` - New feature added
- `v1.0.0` → `v1.0.1` - Bug fix

## Release Tags

### Creating Annotated Tags

```bash
git tag -a v1.2.0 -m "Release v1.2.0

Features:
- Add user authentication
- Implement bill analytics
- Add export functionality

Bug Fixes:
- Fix calculation errors
- Resolve UI rendering issues"

git push --tags
```

### Tag Format

- Use `v` prefix: `v1.2.0`
- Include release notes in tag message
- List features, bug fixes, and breaking changes

## Pull Request Guidelines

### PR Title

Follow same format as commit messages:
```
feat(auth): implement OAuth login
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Self-review** - Review your own PR first
2. **Automated checks** - Ensure CI passes
3. **Peer review** - At least one approval required
4. **Address feedback** - Make requested changes
5. **Merge** - Squash and merge or rebase

## Commit Organization

### Small, Focused Commits

Each commit should:
- Address one logical change
- Be atomic (can be reverted independently)
- Have a clear, descriptive message
- Pass all tests

### Squashing Commits

Before merging, consider squashing:
- "WIP" commits
- "Fix typo" commits
- Multiple commits for same feature

```bash
# Interactive rebase to squash last 3 commits
git rebase -i HEAD~3
```

## Best Practices

### DO

✅ Write clear, descriptive commit messages
✅ Commit frequently with logical changes
✅ Keep commits focused and atomic
✅ Update branch regularly from main
✅ Test before committing
✅ Use meaningful branch names
✅ Tag releases with semantic versions

### DON'T

❌ Commit directly to main (use PRs)
❌ Use vague messages like "fix stuff" or "updates"
❌ Commit large, unrelated changes together
❌ Commit commented-out code
❌ Commit secrets or sensitive data
❌ Force push to shared branches
❌ Merge without review

## Git Hooks

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint

# Run tests
npm run test

# Check for secrets
git diff --cached --name-only | xargs grep -l "API_KEY\|SECRET\|PASSWORD" && {
    echo "⚠️  Warning: Possible secret detected"
    exit 1
}
```

### Commit Message Hook

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Validate commit message format
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Invalid commit message format"
    echo "Format: <type>(<scope>): <description>"
    exit 1
fi
```

## GitHub Actions Integration

### Automated Checks

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate commit messages
        run: |
          # Validate conventional commits
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm run test
```

## Changelog

Maintain a `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [Unreleased]

## [1.2.0] - 2026-01-24

### Added
- User authentication system
- Bill analytics dashboard

### Fixed
- Balance calculation errors
- UI rendering issues

### Changed
- Updated navigation structure

## [1.1.0] - 2026-01-20
...
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
