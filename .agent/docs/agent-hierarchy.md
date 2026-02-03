# Agent Hierarchy System - User Guide

## Overview

This project uses a hierarchical agent system that mirrors real software development teams. Different agents have different expertise levels, use appropriate AI models, and handle tasks suited to their capabilities.

## Agent Hierarchy

```
Team Lead (Opus 4.5)
├── Senior Frontend Engineer (Opus 4.5)
├── Senior Backend Engineer (Opus 4.5)
├── DevOps Engineer (Sonnet 4.5)
├── Security Engineer (Sonnet 4.5)
└── Junior Engineer (Haiku)
```

## Available Agents

### Team Lead
- **Model:** Opus 4.5
- **Expertise:** Full-stack architecture, delegation, strategic decisions
- **Use for:** Complex features, architectural decisions, coordination
- **Skills:** All skills
- **File:** `.agent/agents/team-lead.md`

### Senior Frontend Engineer
- **Model:** Opus 4.5
- **Expertise:** React, TypeScript, UI/UX, design systems
- **Use for:** Complex UI features, component architecture, performance optimization
- **Skills:** react-typescript-dev, web-ui-design-system, project-setup-standards
- **File:** `.agent/agents/senior-frontend-engineer.md`

### DevOps Engineer
- **Model:** Sonnet 4.5
- **Expertise:** CI/CD, deployment, automation, cost optimization
- **Use for:** Deployment setup, GitHub Actions, Firebase configuration
- **Skills:** firebase-hosting-deployment, github-actions-cicd, project-setup-standards
- **File:** `.agent/agents/devops-engineer.md`

### Junior Engineer
- **Model:** Haiku
- **Expertise:** Simple, well-defined tasks
- **Use for:** Formatting, documentation, simple fixes
- **Skills:** None (follows patterns)
- **File:** `.agent/agents/junior-engineer.md`

## How to Use Agents

### Method 1: Direct Invocation (Claude Code)

```bash
# Use a specific agent
Use the senior-frontend-engineer agent to create a new dashboard component

# Let Team Lead delegate
Use the team-lead agent to implement user authentication
```

### Method 2: Let Antigravity Choose

Simply describe your task and Antigravity will:
1. Assess the complexity
2. Choose the appropriate agent
3. Delegate if needed

```
"Add a new bill management feature"
→ Team Lead assesses → Delegates to Senior Frontend Engineer
```

## Task Routing Guide

| Task Type | Recommended Agent |
|-----------|------------------|
| New feature (complex) | Team Lead |
| UI component | Senior Frontend Engineer |
| Data model | Senior Backend Engineer |
| Deployment setup | DevOps Engineer |
| Security review | Security Engineer |
| Code formatting | Junior Engineer |
| Documentation | Junior Engineer |

## Cost Optimization

The hierarchy is designed for cost efficiency:

- **Haiku** (~$0.25/M tokens) - Simple tasks
- **Sonnet 4.5** (~$3/M tokens) - Standard work
- **Opus 4.5** (~$15/M tokens) - Complex work only

**Example cost savings:**
- Formatting 100 files: Haiku vs Opus = 60x cheaper
- Standard deployment: Sonnet vs Opus = 5x cheaper

## Skills System

Agents have access to specialized skills:

### Core Skills
- `react-typescript-dev` - React and TypeScript patterns
- `firebase-auth` - Firebase Authentication
- `firebase-hosting-deployment` - Firebase Hosting deployment

### New Skills
- `web-ui-design-system` - Design system and UI patterns
- `firestore-data-modeling` - Firestore data patterns
- `project-setup-standards` - ESLint, Prettier, TypeScript

## Example Workflows

### New Feature Development

```
User Request: "Add bill templates feature"

1. Team Lead:
   - Analyzes requirements
   - Creates architectural plan
   - Delegates tasks

2. Senior Frontend Engineer:
   - Builds UI components
   - Implements form handling
   - Adds validation

3. Senior Backend Engineer:
   - Designs Firestore schema
   - Creates security rules
   - Implements queries

4. DevOps Engineer:
   - Updates CI/CD if needed
   - Ensures deployment works

5. Team Lead:
   - Reviews all work
   - Integrates components
   - Approves deployment
```

### Bug Fix

```
User Request: "Fix bill sorting bug"

1. Team Lead assesses severity:
   - Simple bug → Delegate to Junior Engineer
   - Complex bug → Handle or delegate to specialist

2. Assigned agent fixes bug

3. Team Lead reviews fix
```

### Deployment Setup

```
User Request: "Set up Firebase Hosting"

1. Team Lead delegates to DevOps Engineer

2. DevOps Engineer:
   - Uses firebase-hosting-deployment skill
   - Sets up GitHub Actions
   - Configures Firebase
   - Tests deployment

3. Team Lead approves
```

## Best Practices

### For Users

1. **Be specific** - Clear requirements get better results
2. **Trust the hierarchy** - Let agents delegate appropriately
3. **Review agent work** - Especially from junior agents
4. **Provide feedback** - Help agents learn and improve

### For Agents

1. **Know your limits** - Escalate when appropriate
2. **Use skills** - Reference skill documentation
3. **Communicate clearly** - Explain your approach
4. **Follow standards** - Consistency is key

## Adding New Agents

To add a specialist agent:

1. Create agent file in `.agent/agents/`
2. Define expertise and skills
3. Set appropriate model
4. Document when to use
5. Update this guide

## Troubleshooting

### Agent not found
- Check `.agent/agents/` directory
- Verify file has `.md` extension
- Ensure frontmatter is correct

### Wrong agent chosen
- Be more specific in your request
- Explicitly request an agent
- Update agent descriptions

### Task too complex for agent
- Agent should escalate to Team Lead
- Team Lead will reassign

## Future Enhancements

Potential additions:
- Project Manager agent (task planning)
- Senior Backend Engineer (Firestore, APIs)
- Security Engineer (AppSec, audits)
- QA Engineer (testing, quality)
- Technical Writer (documentation)

## Resources

- **Agent definitions:** `.agent/agents/`
- **Skills:** `.agent/skills/`
- **Implementation plan:** See artifacts
- **Claude Code docs:** https://code.claude.com/docs/en/sub-agents
