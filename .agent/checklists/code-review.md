# Code Review Checklist

## Pre-Review

- [ ] PR has clear title following conventional commits format
- [ ] PR description explains what and why
- [ ] All CI checks pass (lint, tests, build)
- [ ] No merge conflicts
- [ ] Branch is up to date with main

## Code Quality

### General
- [ ] Code follows project style guidelines
- [ ] No commented-out code
- [ ] No console.log or debugging statements
- [ ] No TODO comments without issue reference
- [ ] Functions are small and focused (<50 lines)
- [ ] Variable and function names are descriptive

### TypeScript
- [ ] No use of `any` type (use `unknown` if needed)
- [ ] Proper type definitions for all functions
- [ ] No type assertions unless absolutely necessary
- [ ] Interfaces used for object shapes
- [ ] Enums or union types for constants

### React
- [ ] Components are functional (no class components)
- [ ] Hooks follow rules (top-level, React functions only)
- [ ] Props have proper TypeScript interfaces
- [ ] No prop drilling (use Context if needed)
- [ ] Keys used correctly in lists (not index)
- [ ] useEffect dependencies are correct
- [ ] No inline object/array literals in dependencies

## Security

- [ ] No hardcoded secrets or API keys
- [ ] User input is validated and sanitized
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication checks in place
- [ ] Authorization checks for sensitive operations
- [ ] HTTPS enforced for external requests
- [ ] Dependencies have no known vulnerabilities

## Performance

- [ ] No unnecessary re-renders
- [ ] Expensive calculations use useMemo
- [ ] Event handlers use useCallback when needed
- [ ] Images are optimized
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Lazy loading for large components

## Testing

- [ ] Unit tests for new functions/components
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable
- [ ] No flaky tests
- [ ] Coverage meets threshold (80%+)
- [ ] E2E tests for critical user flows

## Accessibility

- [ ] Semantic HTML elements used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Alt text for images
- [ ] Form labels properly associated

## Documentation

- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc comments
- [ ] README updated if needed
- [ ] ADR created for architectural decisions
- [ ] CHANGELOG updated

## Git

- [ ] Commits are atomic and logical
- [ ] Commit messages follow conventional commits
- [ ] No merge commits (use rebase)
- [ ] No large files committed
- [ ] .gitignore updated if needed

## Final Checks

- [ ] Manually tested the changes
- [ ] Tested on different browsers (if UI change)
- [ ] Tested on mobile (if applicable)
- [ ] No breaking changes (or documented)
- [ ] Migration path for breaking changes
- [ ] Performance impact acceptable

## Approval

- [ ] Code reviewed by at least one team member
- [ ] All feedback addressed
- [ ] Ready to merge
