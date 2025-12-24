---
description: "Critical workflow rules: always run lint/typecheck after changes, never start dev server"
alwaysApply: true
tags: ["workflow", "testing", "quality", "critical"]
---

# Project Rules

## Quality Checks

- Always run the LINT and TYPESCHECK scripts after completing your changes. This is to check for any issues.
- NEVER start the dev server yourself. If you need something from the terminal, ask the user to provide it to you.

## Workflow

- Run linting: `npm run lint`
- Run type checking: `npm run typecheck`
- These checks must pass before committing code
