---
description: "Apply when organizing feature modules, creating new screens, or refactoring code structure. Defines how to structure feature modules and complex screens with proper separation of technical concerns."
alwaysApply: false
tags: ["architecture", "modules", "structure", "organization"]
---

# Module Structure Rules

## Feature Modules

Feature modules (like `authentication/`, `onboarding/`) MUST follow this structure:

```
feature-module/
├── hooks/              # React hooks specific to this feature
├── services/           # API and external integrations
│   └── [domain]/      # Grouped by domain (e.g., auth/)
├── stores/            # Zustand state management (if needed)
│   └── [storeName]/   # Individual store folder
├── utils/             # Pure utility functions
│   └── [domain]/      # Grouped by domain
└── components/        # Feature-specific UI (only if needed)
```

**Good Examples in Codebase:**
- `src/authentication/` - Perfect feature module structure
- `src/onboarding/` - Consistent with the pattern

**Rules:**
1. Each folder represents a technical concern (hooks, services, stores, utils)
2. Services and utils SHOULD be grouped in domain subfolders
3. DO NOT mix concerns - hooks stay in hooks/, services in services/, etc.
4. Components folder is OPTIONAL - only create if feature has dedicated UI

## Screen Modules

Screens with complex logic (>1 custom hook OR >2 local components) MUST be organized as modules:

```
ScreenName/
├── index.tsx          # Main screen component (orchestrator)
├── styles.ts          # Screen-specific styles
├── components/        # Screen-local components
│   └── [Component].tsx
└── hooks/             # Screen-specific logic hooks
    └── use[Hook].ts
```

**Good Example in Codebase:**
- `src/screens/chat/MessageScreen/` - Well-structured with hooks/ and components/

**Bad Examples (should be refactored):**
- `src/screens/chat/ChatListScreen.tsx` - Complex screen as single file
- `src/screens/premium/PremiumTabScreen.tsx` - Should be modular

**Rules:**
1. Main component MUST be in `index.tsx` (orchestrator pattern)
2. Extract complex logic to custom hooks in `hooks/` folder
3. Co-locate screen-specific components in `components/` folder
4. Use `styles.ts` for styles (avoid large inline StyleSheet.create)

## When to Create a Module vs Single File

**Create a Module When:**
- Screen has 1+ custom hooks
- Screen has 1+ local components
- File exceeds 200 lines
- Logic can be extracted and tested separately

**Keep as Single File When:**
- Simple screen with minimal logic
- No custom hooks needed
- File under 150 lines
- Just renders shared components

## Validation Checklist

Before creating new code, check:
- [ ] Does this feature have a clear domain boundary?
- [ ] Are technical concerns separated (hooks vs services vs stores)?
- [ ] Is the module self-contained (minimal external dependencies)?
- [ ] Do folder names match the pattern (hooks/, services/, stores/, utils/)?
- [ ] Are services and utils grouped by domain when there are multiple?
