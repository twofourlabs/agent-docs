---
description: "Apply when writing or reviewing any code for quality issues. Prevents placeholder files, missing error handling, large conditionals, and improper TypeScript usage (any types)."
alwaysApply: false
tags: ["anti-patterns", "code-quality", "typescript", "error-handling"]
---

# Code Quality Anti-Patterns

## 1. Placeholder/Stub Files

### ❌ ANTI-PATTERN: Empty or stub files

```typescript
// ❌ BAD - File exists but serves no purpose
// src/authentication/stores/authStore/selectors.ts
export {};

// ❌ BAD - Placeholder implementation
// src/authentication/hooks/useAuth.ts
export { useAuthStore as useAuth } from '../stores';
```

### ✅ CORRECT PATTERN: Remove or implement

```typescript
// ✅ GOOD - Either implement it properly
export const selectUserEmail = (state: AuthState) => state.user?.email;
export const selectIsLoading = (state: AuthState) => state.isLoading;

// ✅ OR remove the file entirely and export from index.ts
```

**Why It's Bad:**
- Confusing for developers
- Adds noise to codebase
- Suggests incomplete implementation
- Makes maintenance harder

## 2. Missing Error Handling

### ❌ ANTI-PATTERN: No error handling

```typescript
// ❌ BAD - Unhandled promise rejection
const signIn = async (email: string, password: string) => {
  const result = await googleAuth.signIn(email, password);
  set({ user: result.user, token: result.token });
  // What if googleAuth.signIn fails?
};
```

### ✅ CORRECT PATTERN: Proper error handling

```typescript
// ✅ GOOD - Comprehensive error handling
const signIn = async (email: string, password: string) => {
  set({ isLoading: true, error: null });

  try {
    const result = await googleAuth.signIn(email, password);
    set({
      user: result.user,
      token: result.token,
      isLoading: false
    });
  } catch (error) {
    console.error('Sign in error:', error);
    set({
      error: error.message || 'Sign in failed',
      isLoading: false
    });

    // Optionally re-throw for component handling
    throw error;
  }
};
```

**Why It's Bad:**
- App crashes on errors
- No user feedback
- Difficult to debug production issues
- Poor user experience

## 3. Large Switch/If-Else Chains

### ❌ ANTI-PATTERN: Long conditional chains

```typescript
// ❌ BAD - Long if-else chain
const getStatusColor = (status: string) => {
  if (status === 'pending') {
    return '#FFA500';
  } else if (status === 'approved') {
    return '#00FF00';
  } else if (status === 'rejected') {
    return '#FF0000';
  } else if (status === 'cancelled') {
    return '#808080';
  } else {
    return '#000000';
  }
};
```

### ✅ CORRECT PATTERN: Object lookup

```typescript
// ✅ GOOD - Object lookup (cleaner, faster)
const STATUS_COLORS = {
  pending: '#FFA500',
  approved: '#00FF00',
  rejected: '#FF0000',
  cancelled: '#808080'
} as const;

const getStatusColor = (status: string) => {
  return STATUS_COLORS[status] || '#000000';
};
```

**Why It's Bad:**
- Hard to read and maintain
- Slower execution (O(n) vs O(1))
- Difficult to add/remove cases
- Prone to bugs with nested conditions

## 4. Not Using TypeScript Properly

### ❌ ANTI-PATTERN: Using 'any' type

```typescript
// ❌ BAD - Loses type safety
const handleData = (data: any) => {
  console.log(data.user.email); // No autocomplete, no errors
};
```

### ✅ CORRECT PATTERN: Proper types

```typescript
// ✅ GOOD - Type safety
interface UserData {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const handleData = (data: UserData) => {
  console.log(data.user.email); // Autocomplete + type checking
};
```

**Why It's Bad:**
- Loses type safety benefits
- No autocomplete
- Runtime errors not caught at compile time
- Makes refactoring dangerous

### Common TypeScript Fixes

**Instead of `any`, use:**

```typescript
// ✅ For unknown types that need checking
const handleData = (data: unknown) => {
  if (isUserData(data)) {
    console.log(data.user.email);
  }
};

// ✅ For generic types
function identity<T>(arg: T): T {
  return arg;
}

// ✅ For partial types
type PartialUser = Partial<User>;

// ✅ For union types
type Status = 'pending' | 'approved' | 'rejected';
```