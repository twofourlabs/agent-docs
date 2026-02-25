---
description: Group unstaged and staged files into small, sensible commits
---

# Batch Commit

Analyze all modified files (staged and unstaged) and create small, logical commits grouped by feature, directory, or file type.

## What This Command Does

1. **Analyze**: Check git status for all modified files
2. **Group**: Organize files into logical commit groups
3. **Commit**: Create focused commits for each group
4. **Report**: Show summary of all commits created

## Implementation Steps

When this command is invoked:

### 1. Gather Git State

Run these commands to understand current state:

```bash
git status --porcelain
```

Parse output to identify:

- **Staged files** (lines starting with `M `, `A `, `D `, `R `)
- **Unstaged modified files** (lines starting with ` M`, ` D`)
- **Untracked files** (lines starting with `??`)

Also check recent commit style:

```bash
git log --oneline -5
```

### 2. Group Files Logically

Group files into commit batches using this priority:

1. **By feature/component**: Files that clearly belong together
   - Example: `src/screens/chat/*` → "chat screen changes"
   - Example: `src/components/Button.tsx` + `src/components/Button.styles.ts` → "Button component"

2. **By type of change**:
   - Config files together: `package.json`, `tsconfig.json`, etc.
   - Style/theme files together: `colors.ts`, `theme.ts`, `styles.ts`
   - Test files with their implementations
   - Asset files (images, fonts, SVGs)

3. **By directory** (fallback): If no clear feature grouping

**Grouping rules**:

- Maximum 5-7 files per commit (prefer smaller)
- Keep related files together (component + its styles + its tests)
- Separate unrelated changes into different commits
- Config changes should be their own commit
- Don't mix feature code with formatting-only changes

### 3. Create Commits for Each Group

For each group:

1. Stage only the files for that group:

   ```bash
   git add <file1> <file2> <file3>
   ```

2. Verify staging is correct:

   ```bash
   git status
   ```

   Should show only intended files staged

3. Create commit with descriptive message:
   ```bash
   git commit -m "<type>: <description>"
   ```

**Commit message format**:

- `feat:` - New feature or functionality
- `fix:` - Bug fix
- `style:` - Styling/theme changes
- `refactor:` - Code refactoring
- `chore:` - Config, dependencies, build
- `docs:` - Documentation
- `test:` - Tests

**Example messages**:

- `feat: add dark theme support to ChatHeader`
- `style: update color palette for dark mode`
- `chore: update iOS Podfile.lock`
- `refactor: extract MessageItem styles`

### 4. Handle Edge Cases

**If a file has both staged and unstaged changes**:

- First commit the staged portion
- Then stage and commit the unstaged changes separately
- Or ask user how to handle

**If files are unrelated and can't be grouped**:

- Create individual commits for each file
- Use descriptive messages that explain the specific change

**If all changes are formatting/style only**:

- Group into single commit: `style: format code`

### 5. Report Results

After all commits are created, output summary:

```
## Batch Commit Results

**Commits Created**: [N]

1. `abc1234` - feat: add dark theme to Header components
   - src/components/Header.tsx
   - src/components/chat/ChatHeader.tsx

2. `def5678` - style: update color palette
   - src/shared/theme/colors.ts

3. `ghi9012` - chore: update dependencies
   - ios/Podfile.lock
   - android/app/src/main/res/values/colors.xml

**Status**: All files committed
```

## Important Notes

- **NEVER force push or amend** existing commits
- **Verify each staging** before committing - check `git status` shows correct files
- **Prefer smaller commits** - it's better to have more focused commits than large ones
- **Don't commit secrets** - skip `.env`, credentials, API keys
- **Preserve intent** - read diffs to understand what changed, craft messages accordingly

## Error Handling

If a commit fails:

- Report the specific error
- Show which files were being committed
- Ask user how to proceed

If unable to determine logical grouping:

- Show the files and ask user for grouping preferences
- Default to grouping by directory if user doesn't respond

## Files to Skip

Never commit these patterns:

- `.env*` files
- `*.local` files
- `node_modules/`
- Files containing API keys or secrets
- Build artifacts (unless intentional)

If these files appear in the unstaged list, warn the user but don't stage them.
