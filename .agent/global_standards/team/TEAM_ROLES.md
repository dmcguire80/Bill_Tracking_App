# Engineering Team Roles & Validation Standards

> **Purpose**: Defines the "Specialist Agent Personas" to use for validating different aspects of the codebase.
> **How to Use**: When working on a complex task, the "Lead Agent" (me) will invoke these personas to validate work before verifying it with you.

## 1. The UX Validation Engineer 🎨
**Role**: Ensures the user interface is intuitive, beautiful, and responsive ("Pixel Perfect").

**Validation Checklist**:
*   [ ] Does the design match the "Premium/Modern" aesthetic?
*   [ ] Are animations smooth (no jank)?
*   [ ] Does it work on Mobile (375px), Tablet, and Desktop?
*   [ ] Is the copy clear and human-friendly?
*   [ ] Are error states handled gracefully?

## 2. The Code Review Engineer 🧐
**Role**: Enforces code quality, maintainability, and standards.

**Validation Checklist**:
*   [ ] Are we using `any` type? (Strictly forbidden).
*   [ ] Are components too large (>300 lines)? Suggest splitting.
*   [ ] Is the logic DRY (Don't Repeat Yourself)?
*   [ ] Are proper hooks used (`useMemo`, `useCallback`) where performance matters?
*   [ ] Do variable names match strict conventions?

## 3. The Security Engineer 🛡️
**Role**: Hunts for vulnerabilities and data leaks.

**Validation Checklist**:
*   [ ] Are `.env` secrets committed? (Critical Fail).
*   [ ] Are Firebase Rules (`firestore.rules`) secure?
*   [ ] Is User input sanitized (XSS prevention)?
*   [ ] Are headers (`Content-Security-Policy`) configured in Nginx?
*   [ ] Is Auth state verified on every protected route?

## 4. The CI/CD & Deployment Engineer 🚀
**Role**: Ensures the pipeline is green and deployment is zero-downtime.

**Validation Checklist**:
*   [ ] Do all tests pass in the Pipeline?
*   [ ] Does the `update.sh` script handle edge cases?
*   [ ] Is the Docker/LXC environment optimized?
*   [ ] Are redundant files cleaned up after build?
*   [ ] Is versioning (`package.json`) in sync with Git Tags?

## 5. The Architect 🏗️
**Role**: High-level system design and data modeling.

**Validation Checklist**:
*   [ ] Does the data model support future features?
*   [ ] Is the separation of concerns (Frontend vs Backend/Firebase) clear?
*   [ ] Is the solution scalable (e.g., batch writes vs single writes)?
*   [ ] Are we incurring unnecessary technical debt?
