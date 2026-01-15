---
description: "Apply when writing or refactoring components, hooks, stores, services, or utils. Ensures proper data flow: Components → Hooks → Stores → Services, preventing wrong-layer access."
alwaysApply: false
tags: ["architecture", "separation-of-concerns", "layers", "data-flow"]
---

# Separation of Concerns Rules

## Architecture Layers

Your application MUST follow this data flow:

```
Components → Hooks → Stores → Services → External APIs
```

**Layer Responsibilities:**

1. **Components** (.tsx files in components/ or screens/)
   - Rendering UI
   - Event delegation to hooks
   - Minimal local UI state (modals, form inputs)
   - NO business logic or API calls

2. **Hooks** (use*.ts files in hooks/)
   - React-specific adapters
   - UI event handlers
   - Component-specific state management
   - Navigation logic
   - Calls store actions, NOT services directly

3. **Stores** (Zustand stores in stores/)
   - Global state management
   - Business logic orchestration
   - Side effects (analytics, socket connections)
   - Error handling
   - Calls services for data

4. **Services** (files in services/)
   - API calls and external integrations
   - Data transformation
   - Pure async functions
   - NO state management or React dependencies

5. **Utils** (files in utils/)
   - Pure functions (no side effects)
   - Testable in isolation
   - NO imports from React, hooks, stores, or services

## Component Rules

Components MUST NOT:
- ❌ Make direct API calls
- ❌ Import from `services/` directly
- ❌ Contain business logic (move to hooks or store actions)
- ❌ Exceed 200 lines (extract to subcomponents or hooks)
- ❌ Have complex useEffect logic (extract to custom hooks)

Components SHOULD:
- ✅ Delegate events to hooks
- ✅ Use store selectors for global state
- ✅ Keep render logic simple
- ✅ Use local state only for UI concerns (isOpen, selectedTab, etc.)

**Example - BAD:**
```typescript
// ❌ Component making direct API call
const ChatScreen = () => {
  const handleSend = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    // ...
  };
};
```

**Example - GOOD:**
```typescript
// ✅ Component delegates to hook
const ChatScreen = () => {
  const { handleSend } = useChatHandlers();

  return <ChatInput onSend={handleSend} />;
};

// Hook calls store action
const useChatHandlers = () => {
  const sendMessage = useChatStore(state => state.sendMessage);

  const handleSend = useCallback((message: string) => {
    sendMessage(message);
  }, [sendMessage]);

  return { handleSend };
};
```

## Hook Rules

Hooks MUST:
- ✅ Start with `use` prefix
- ✅ Return stable references (use `useCallback`, `useMemo`)
- ✅ Handle only React-specific concerns
- ✅ Call store actions, NOT services directly

Hooks MUST NOT:
- ❌ Call services directly (use store actions)
- ❌ Exceed 150 lines (split into multiple hooks)
- ❌ Contain pure business logic (move to store actions or utils)
- ❌ Return new object/function references on every render

**Example - BAD:**
```typescript
// ❌ Hook calling service directly
const useAuth = () => {
  const login = async (email: string, password: string) => {
    const token = await authService.login(email, password);
    // ...
  };
};
```

**Example - GOOD:**
```typescript
// ✅ Hook calls store action
const useAuth = () => {
  const login = useAuthStore(state => state.login);

  return { login };
};
```

## Store Action Rules

Store actions MUST:
- ✅ Handle all business logic and side effects
- ✅ Be defined in `actions.ts` files
- ✅ Receive `set` and `get` parameters
- ✅ Handle errors gracefully with try/catch
- ✅ Call services for external data

Store actions MUST NOT:
- ❌ Import from React or hooks
- ❌ Access store state directly (use `get()` parameter)

**Example - GOOD (from your authStore):**
```typescript
// ✅ Action with proper error handling and service call
const signIn = async (email: string, password: string) => {
  set({ isLoading: true, error: null });

  try {
    const { user, token } = await googleAuth.signIn(email, password);
    set({ user, token, isAuthenticated: true });
    analytics.track('user_signed_in');
  } catch (error) {
    set({ error: error.message });
  } finally {
    set({ isLoading: false });
  }
};
```

## Service Rules

Services MUST:
- ✅ Be pure async functions
- ✅ Return data or throw errors
- ✅ Handle only external integrations

Services MUST NOT:
- ❌ Manage state
- ❌ Import from React, hooks, or stores
- ❌ Have side effects beyond the API call

**Example - GOOD:**
```typescript
// ✅ Pure service function
export const googleAuth = {
  signIn: async (email: string, password: string) => {
    const result = await GoogleSignin.signIn();
    return {
      user: result.user,
      token: result.idToken
    };
  }
};
```

## Utils Rules

Utils MUST:
- ✅ Be pure functions (no side effects)
- ✅ Be testable in isolation
- ✅ Have clear input/output

Utils MUST NOT:
- ❌ Import from React, hooks, stores, or services
- ❌ Make API calls or have side effects
- ❌ Manage state

**Example - GOOD:**
```typescript
// ✅ Pure utility function
export const formatChatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};
```