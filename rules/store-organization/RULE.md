---
description: "Zustand store file structure, action patterns, selector optimization, and persistence configuration. Auto-applies when working with store files."
alwaysApply: false
globs: ["**/stores/**/*", "**/authStore/**/*", "**/chatStore/**/*"]
tags: ["zustand", "state-management", "stores"]
---

# Zustand Store Organization Rules

## Store Structure

All Zustand stores MUST follow this file organization pattern:

```
stores/
└── [storeName]/
    ├── types.ts          # Type definitions (REQUIRED)
    ├── actions.ts        # Business logic (REQUIRED)
    ├── index.ts          # Store creation + public API (REQUIRED)
    ├── initialState.ts   # Default values (OPTIONAL)
    ├── selectors.ts      # Memoized selectors (OPTIONAL)
    ├── middleware.ts     # Custom middleware (OPTIONAL)
    └── persistence.ts    # Persistence config (OPTIONAL)
```

**Good Example in Codebase:**
- `src/authentication/stores/authStore/` - Perfect structure

**Rules:**
1. **REQUIRED files**: `types.ts`, `actions.ts`, `index.ts`
2. **OPTIONAL files**: Only create if actually needed (no placeholder/stub files)
3. Store folder name MUST end with `Store` (e.g., `authStore`, `chatStore`)
4. Each file has a single, clear responsibility

## types.ts - Type Definitions

**Purpose:** Define all TypeScript interfaces and types for the store.

**Must Include:**
- State interface
- Action method signatures
- Domain types (User, Message, etc.)

**Example:**
```typescript
// ✅ GOOD - Clear type definitions
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
```

## actions.ts - Business Logic

**Purpose:** Implement all business logic, side effects, and state mutations.

**Must Follow:**
- Actions receive `set` and `get` parameters
- Actions handle errors with try/catch
- Actions call services, not components or hooks
- Actions are async if they have side effects
- Actions update loading/error states appropriately

**Example:**
```typescript
// ✅ GOOD - Action with proper structure
import { googleAuth } from '../../services/auth/googleAuth';
import { analytics } from '@/services/analytics';
import type { AuthState } from './types';

export const createActions = (
  set: (partial: Partial<AuthState>) => void,
  get: () => AuthState
) => ({
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { user, token } = await googleAuth.signIn(email, password);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });

      // Side effects
      analytics.track('user_signed_in', { userId: user.id });
      await socket.connect(token);

    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error; // Re-throw for component error handling
    }
  },

  signOut: async () => {
    const { user } = get();

    set({ isLoading: true });

    try {
      await googleAuth.signOut();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });

      analytics.track('user_signed_out', { userId: user?.id });
      socket.disconnect();

    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
});
```

**Rules for Actions:**
- ✅ Always wrap in try/catch for async operations
- ✅ Set loading state at start, clear at end (use finally if needed)
- ✅ Clear error state at start of operation
- ✅ Use `get()` to access current state, NEVER import store directly
- ✅ Use `set()` with partial state updates
- ❌ NEVER call other actions directly, use `get().actionName()`
- ❌ NEVER import React, hooks, or components

## index.ts - Store Creation & Public API

**Purpose:** Create the Zustand store and export optimized selectors.

**Must Include:**
- Store creation with create()
- Persistence configuration (if needed)
- Optimized selector exports
- Action method wiring

**Example:**
```typescript
// ✅ GOOD - Store with persistence and selectors
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/utils/storage';
import { createActions } from './actions';
import type { AuthState, User } from './types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      ...createActions(set, get)
    }),
    {
      name: 'auth-storage',
      storage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
        // Exclude: isLoading, error (transient state)
      })
    }
  )
);

// Optimized selectors - Prevent unnecessary re-renders
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);

// Action selectors
export const useSignIn = () => useAuthStore(state => state.signIn);
export const useSignOut = () => useAuthStore(state => state.signOut);
```

**Rules for index.ts:**
- ✅ Export the main store hook (e.g., `useAuthStore`)
- ✅ Export optimized selectors for common state slices
- ✅ Use `partialize` to exclude transient state from persistence
- ✅ Use custom storage adapter (MMKV via `@/utils/storage`)
- ❌ NEVER persist loading or error state
- ❌ NEVER include all state in components (use selectors)

## Selector Best Practices

**Bad - Causes unnecessary re-renders:**
```typescript
// ❌ Component re-renders on ANY state change
const ChatScreen = () => {
  const chatStore = useChatStore();
  const messages = chatStore.messages;
};
```

**Good - Only re-renders when messages change:**
```typescript
// ✅ Component only re-renders when messages change
const ChatScreen = () => {
  const messages = useMessages(); // Optimized selector
};

// In store index.ts
export const useMessages = () => useChatStore(state => state.messages);
```

## Optional Files

### initialState.ts (Optional)
Only create if you need to share initial state or have complex defaults:

```typescript
// ✅ GOOD - Complex initial state
import type { AuthState } from './types';

export const initialAuthState: Omit<AuthState, 'signIn' | 'signOut'> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};
```

**When to create:**
- Initial state is complex or reused (tests, reset logic)
- When NOT to create: Simple state that's clear in index.ts

### selectors.ts (Optional)
Only create for complex derived state with memoization:

```typescript
// ✅ GOOD - Complex derived selector
import { createSelector } from 'reselect';
import type { ChatState } from './types';

export const selectUnreadCount = createSelector(
  (state: ChatState) => state.messages,
  (state: ChatState) => state.lastReadTimestamp,
  (messages, lastRead) =>
    messages.filter(m => m.timestamp > lastRead).length
);
```

**When to create:**
- Derived state requires expensive computation
- When NOT to create: Simple state access (use inline selectors in index.ts)

### middleware.ts (Optional)
Only create for custom Zustand middleware:

```typescript
// ✅ GOOD - Custom logging middleware
export const loggerMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('State before:', get());
      set(...args);
      console.log('State after:', get());
    },
    get,
    api
  );
```

**When to create:**
- Custom middleware for debugging, validation, or side effects
- When NOT to create: Using built-in middleware only
