# Cursor Rules

This folder contains all project-specific rules for Cursor AI, optimized to minimize context bloat.

## Structure

Each rule is in its own folder with a `RULE.md` file containing:
- **Frontmatter metadata** (description, alwaysApply, globs, tags)
- **Focused, actionable guidance** (all rules under 500 lines)
- **Concrete examples** with good/bad patterns
- **Validation checklists**

## Rule Application Strategy

### 🔴 Always Apply (18 lines total)
**Loaded in every chat session - keep minimal!**

- **project-rules** (18 lines) - Critical workflow: lint/typecheck, never start dev server

### 🟡 Apply Intelligently (1,047 lines - agent picks relevant ones)
**Agent decides based on task context and description**

- **module-structure** (83 lines) - When organizing feature modules or creating screens
- **separation-of-concerns** (220 lines) - When writing components, hooks, stores, services
- **screen-complexity** (436 lines) - When creating/refactoring screens >200 lines
- **component-anti-patterns** (172 lines) - When writing/reviewing React components
- **react-performance-anti-patterns** (136 lines) - When optimizing performance or working with hooks
- **react-hooks-anti-patterns** (155 lines) - When writing custom hooks or using useEffect
- **code-quality-anti-patterns** (194 lines) - When writing/reviewing any code

### 🟢 Apply to Specific Files (397 lines - only when files match pattern)
**Auto-applies based on glob patterns**

- **store-organization** (308 lines) - `**/stores/**/*`
- **state-management-anti-patterns** (89 lines) - `**/stores/**/*`

### ⚪ Apply Manually (743 lines - @-mention when needed)
**Use @rule-name in chat to apply**

- **file-naming** (385 lines) - `@file-naming` when creating new files
- **import-rules** (271 lines) - `@import-rules` when organizing imports
- **styling** (87 lines) - `@styling` when adding CSS styles

## Context Optimization

### Before Optimization
- **10 rules with `alwaysApply: true`**
- **~1,462 lines loaded in every chat** 🔴
- Significant context bloat for simple tasks

### After Optimization
- **1 rule with `alwaysApply: true`** (18 lines)
- **7 rules with intelligent application** (agent decides)
- **2 rules with file pattern matching** (auto-apply to stores)
- **3 rules with manual application** (@-mention)

**Context saved per chat: ~1,444 lines (98.7% reduction!)** 🎉

### Typical Context Usage by Task Type

| Task Type | Rules Applied | Total Lines | Savings |
|-----------|---------------|-------------|---------|
| Simple fix/update | project-rules | ~18 lines | 98.7% ✅ |
| Create component | project-rules + component-anti-patterns + separation-of-concerns | ~410 lines | 71.9% ✅ |
| Refactor screen | project-rules + screen-complexity + module-structure + separation-of-concerns | ~757 lines | 48.2% ✅ |
| Work on stores | project-rules + store-organization + state-management-anti-patterns + (auto-applied via globs) | ~415 lines | 71.6% ✅ |
| Code review | project-rules + code-quality + intelligent picks | ~400-600 lines | 58.9% ✅ |

## Best Practices Followed

✅ **All rules under 500 lines**
- Large anti-pattern file (586 lines) split into 5 focused rules
- Each rule has a clear, single purpose

✅ **Folder-based structure**
- Each rule in its own folder with `RULE.md`
- Room for additional scripts/prompts

✅ **Smart application strategy**
- `alwaysApply`: Only critical workflow (18 lines)
- `description`: Clear triggers for intelligent application
- `globs`: Pattern matching for store-specific rules
- Manual (@-mention): For conventions/reference

✅ **Clear, actionable descriptions**
- Describes WHEN to apply the rule
- Includes what the rule prevents/ensures
- Agent can intelligently decide relevance

✅ **Concrete examples**
- ✅/❌ patterns from actual codebase
- Referenced files and line numbers
- Validation checklists

## How to Use Rules

### Always Applied
These load automatically - no action needed.
- ✅ **project-rules** is always active

### Intelligently Applied
The agent picks these based on your task:
- 💬 "Create a new chat screen" → `module-structure`, `separation-of-concerns`, `component-anti-patterns`
- 💬 "Optimize this component" → `react-performance-anti-patterns`, `screen-complexity`
- 💬 "Review this code" → `code-quality-anti-patterns` + others based on code type

### File Pattern Applied
These auto-apply when you work with matching files:
- 📁 Open/edit `src/stores/authStore/actions.ts` → Both store rules auto-apply
- 📁 Open/edit `src/authentication/stores/chatStore/index.ts` → Both store rules auto-apply

### Manually Applied
Reference these when needed:
- 📝 "@file-naming I'm creating new components" → Loads naming conventions
- 📝 "@import-rules help organize my imports" → Loads import rules
- 📝 "@styling adding new styles" → Loads styling conventions

## Rule Categories

### 🏗️ Architecture (4 rules - Intelligent + Manual)
- module-structure (Intelligent)
- separation-of-concerns (Intelligent)
- screen-complexity (Intelligent)
- import-rules (Manual)

### ⚠️ Anti-Patterns (5 rules - Intelligent + File Pattern)
- component-anti-patterns (Intelligent)
- react-performance-anti-patterns (Intelligent)
- state-management-anti-patterns (File Pattern: stores)
- react-hooks-anti-patterns (Intelligent)
- code-quality-anti-patterns (Intelligent)

### 📋 Conventions (3 rules - Manual)
- file-naming (Manual)
- import-rules (Manual)
- styling (Manual)

### ⚙️ Workflow (1 rule - Always)
- project-rules (Always)

### 🗃️ State Management (1 rule - File Pattern)
- store-organization (File Pattern: stores)

## Total Stats
- **13 rules** (was 9 .mdc files)
- **2,554 total lines** across all rules
- **All rules < 500 lines** ✅
- **98.7% context reduction** for typical tasks ✅

## Migration & Optimization Notes

**Phase 1: Structure Migration**
- Split `no-antipatterns.mdc` (586 lines) → 5 focused anti-pattern rules
- Converted all `.mdc` files to folder-based `RULE.md` structure
- Each rule under 500 lines with clear purpose

**Phase 2: Context Optimization**
- Analyzed all `alwaysApply: true` rules (10 rules, 1,462 lines)
- Kept only critical workflow as always-apply (1 rule, 18 lines)
- Converted 7 rules to intelligent application (agent decides)
- Added glob patterns to 2 store-specific rules
- Result: **98.7% reduction in always-loaded context**
