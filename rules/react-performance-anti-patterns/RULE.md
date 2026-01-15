---
description: "Apply when optimizing React performance, working with hooks, or debugging re-render issues. Prevents unstable dependencies, inefficient store access, and unnecessary re-renders."
alwaysApply: false
tags: ["anti-patterns", "performance", "react", "optimization", "hooks"]
---

# React Performance Anti-Patterns

## 1. Unstable Hook Dependencies

### ❌ ANTI-PATTERN: New function reference every render

```typescript
// ❌ BAD - handlePress is a new function every render
const ChatScreen = () => {
  const handlePress = () => {
    console.log('Pressed');
  };

  // This effect runs on EVERY render because handlePress changes
  useEffect(() => {
    console.log('Effect running');
  }, [handlePress]);

  // Child re-renders unnecessarily
  return <ChatInput onPress={handlePress} />;
};
```

### ✅ CORRECT PATTERN: Stable references with useCallback

```typescript
// ✅ GOOD - Stable function reference
const ChatScreen = () => {
  const handlePress = useCallback(() => {
    console.log('Pressed');
  }, []); // Empty deps - function never changes

  // Effect only runs once
  useEffect(() => {
    console.log('Effect running');
  }, [handlePress]);

  // Child doesn't re-render unnecessarily
  return <ChatInput onPress={handlePress} />;
};
```

**Why It's Bad:**
- Causes unnecessary re-renders
- Effects run more than needed
- Performance degradation
- Difficult to debug

## 2. Store Access Without Selectors

### ❌ ANTI-PATTERN: Accessing entire store state

```typescript
// ❌ BAD - Component re-renders on ANY auth state change
const Header = () => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Re-renders even when isLoading or error changes!
  return <Text>{isAuthenticated ? 'Logged In' : 'Guest'}</Text>;
};
```

### ✅ CORRECT PATTERN: Optimized selectors

```typescript
// ✅ GOOD - Component only re-renders when isAuthenticated changes
const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  return <Text>{isAuthenticated ? 'Logged In' : 'Guest'}</Text>;
};

// In authStore/index.ts
export const useIsAuthenticated = () =>
  useAuthStore(state => state.isAuthenticated);
```

**Why It's Bad:**
- Component re-renders on unrelated state changes
- Poor performance with large stores
- Difficult to optimize

## 3. Over-Rendering Due to New Objects/Arrays

### ❌ ANTI-PATTERN: Creating new references every render

```typescript
// ❌ BAD - New array every render
const ChatScreen = () => {
  const options = ['Option 1', 'Option 2']; // New array every time!

  return <Dropdown options={options} />;
};
```

### ✅ CORRECT PATTERN: Memoized or constant values

```typescript
// ✅ GOOD - Constant outside component
const OPTIONS = ['Option 1', 'Option 2'];

const ChatScreen = () => {
  return <Dropdown options={OPTIONS} />;
};

// ✅ GOOD - Memoized inside component
const ChatScreen = () => {
  const options = useMemo(
    () => ['Option 1', 'Option 2'],
    []
  );

  return <Dropdown options={options} />;
};
```

**Why It's Bad:**
- Causes child components to re-render
- Breaks React.memo optimization
- Poor performance in lists
- Wasteful computation