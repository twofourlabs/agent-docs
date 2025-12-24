---
description: "Apply when writing custom hooks or components with useEffect. Prevents async logic directly in useEffect and ensures proper cleanup for subscriptions, timers, and listeners."
alwaysApply: false
tags: ["anti-patterns", "react-hooks", "effects", "useEffect"]
---

# React Hooks Anti-Patterns

## 1. Mixing Async Logic in useEffect

### ❌ ANTI-PATTERN: Async function in useEffect

```typescript
// ❌ BAD - Async function directly in useEffect
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []); // TypeScript error: useEffect can't return Promise
```

### ✅ CORRECT PATTERN: Separate async function

```typescript
// ✅ GOOD - Async function called from useEffect
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  loadData();
}, []);

// ✅ BETTER - Extract to custom hook
const useDataLoader = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      setData(result);
    };

    loadData();
  }, []);

  return data;
};
```

**Why It's Bad:**
- TypeScript error (useEffect expects void return)
- Can't properly handle cleanup
- No proper error handling
- Violates useEffect contract

## 2. Forgetting to Clean Up Effects

### ❌ ANTI-PATTERN: No cleanup in useEffect

```typescript
// ❌ BAD - Event listener never removed
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    console.log(e.key);
  };

  window.addEventListener('keydown', handleKeyPress);
  // Missing cleanup!
}, []);
```

### ✅ CORRECT PATTERN: Cleanup function

```typescript
// ✅ GOOD - Cleanup function removes listener
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    console.log(e.key);
  };

  window.addEventListener('keydown', handleKeyPress);

  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}, []);
```

**Why It's Bad:**
- Memory leaks
- Event listeners pile up
- Unexpected behavior when component unmounts/remounts
- Can cause crashes in production

## Common Cleanup Scenarios

### Subscriptions
```typescript
// ✅ GOOD
useEffect(() => {
  const subscription = messageStream.subscribe(handleMessage);

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Timers
```typescript
// ✅ GOOD
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

### API Requests (with cancel token)
```typescript
// ✅ GOOD
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

  return () => {
    controller.abort();
  };
}, []);
```

## Validation Checklist

Before committing code:
- [ ] No async functions directly in useEffect
- [ ] All effects with subscriptions/listeners have cleanup
- [ ] All timers/intervals are cleared in cleanup
- [ ] API requests are cancelled on unmount when possible
- [ ] No memory leaks from uncleaned effects
