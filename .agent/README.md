# .agent Directory

## Purpose

This directory contains reusable standards, skills, and templates for development. These resources reduce context usage, standardize practices, and accelerate project setup.

## Structure

```
.agent/
├── adr/            # Architecture Decision Records
├── checklists/     # Testing and review checklists
├── guides/         # Implementation guides
├── skills/         # Reusable agent skills
├── standards/      # Development standards
└── templates/      # Project templates
```

## Skills

Skills are specialized knowledge modules that can be referenced in new conversations:

- **react-typescript-dev** - React + TypeScript best practices
- **firebase-auth** - Firebase authentication implementation
- **testing-qa** - Testing strategies and frameworks
- **security-audit** - Security review checklist

## Standards

- **git-workflow.md** - Git commit conventions and branching strategy
- **security.md** - NIST-aligned security standards
- **code-quality.md** - Code review and quality standards

## Usage

Reference skills in new conversations:
```
"Use the react-typescript-dev skill to build this component"
"Follow the firebase-auth skill to add authentication"
"Apply the security standards from .agent/standards/security.md"
```

## Maintenance

- Review quarterly
- Update based on learnings
- Add new skills as needed
- Keep documentation concise
