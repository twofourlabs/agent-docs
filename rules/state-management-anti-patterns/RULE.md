---
description: "State management anti-patterns including direct state mutation and improper store access patterns. Auto-applies when working with store files."
alwaysApply: false
globs: ["**/stores/**/*", "**/authStore/**/*", "**/chatStore/**/*"]
tags: ["anti-patterns", "state-management", "zustand"]
---

# State Management Anti-Patterns

## 1. Direct State Mutation

### ❌ ANTI-PATTERN: Mutating state directly

```typescript
// ❌ BAD - Direct mutation
const addMessage = (message: Message) => {
  const state = get();
  state.messages.push(message); // Direct mutation!
  set(state); // Zustand won't detect the change
};
```

### ✅ CORRECT PATTERN: Immutable updates

```typescript
// ✅ GOOD - Immutable update
const addMessage = (message: Message) => {
  set(state => ({
    messages: [...state.messages, message]
  }));
};

// ✅ GOOD - Using immer (if configured)
const addMessage = (message: Message) => {
  set(produce(draft => {
    draft.messages.push(message);
  }));
};
```

**Why It's Bad:**
- Zustand/React won't detect changes
- Components won't re-render
- Difficult to debug state issues
- Breaks state immutability contract

## 2. Accessing Store State Directly

### ❌ ANTI-PATTERN: Importing store to access state

```typescript
// ❌ BAD - Accessing store state outside React
import { useAuthStore } from '@/authentication/stores';

const isUserAuthenticated = () => {
  const state = useAuthStore.getState();
  return state.isAuthenticated; // Not reactive!
};
```

### ✅ CORRECT PATTERN: Use get() in actions

```typescript
// ✅ GOOD - Using get() parameter in actions
const checkAuthentication = () => {
  const { isAuthenticated } = get();
  return isAuthenticated;
};

// ✅ GOOD - Using selectors in components
const MyComponent = () => {
  const isAuthenticated = useIsAuthenticated();
  // Component re-renders when isAuthenticated changes
};
```

**Why It's Bad:**
- Non-reactive outside React components
- Breaks the unidirectional data flow
- Hard to track state dependencies
- Can lead to stale data