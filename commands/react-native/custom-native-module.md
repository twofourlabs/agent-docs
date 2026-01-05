---
description: Create a native module using the reference npm module github link
---

Use the $githhub link provided by the user, traverse the android/* and ios/* folders to see the native module implementation. 

Parse each file, and create a implementation-plan.md for creating a custom native module with all the same features in the current project.

**Create implementation-plan.md**
   - Split the implementation into phases
   - Create actionable tasks for each phase
   - Each task should have a checkbox: `[ ] Task description`
   - Tasks should be specific enough for an agent to implement independently
   - Include dependencies between tasks where relevant
   - Mark complex tasks with `[complex]` suffix (these will get their own GitHub issue when published)
   - **Add a `### Technical Details` section after each phase's tasks**
   - **Capture ALL technical specifics from the planning conversation**: CLI commands, database schemas, code snippets, file paths, configuration values
   - **This is the single source of truth** - anything not captured here is lost


