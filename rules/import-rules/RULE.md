---
description: "Import organization rules and layer dependency guidelines to prevent wrong-layer access and circular dependencies"
alwaysApply: false
tags: ["imports", "dependencies", "architecture"]
---

# Import Rules and Organization

## Import Order

Imports MUST be organized in this order (enforce with ESLint/Prettier):

```typescript
// 1. React and React Native core
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. External libraries (alphabetical)
import { create } from 'zustand';
import { useNavigation } from '@react-navigation/native';

// 3. Internal absolute imports (by layer, then alphabetical)
// Services first
import { apiService } from '@/services/api';
// Stores second
import { useAuthStore, useIsAuthenticated } from '@/authentication/stores';
// Components third
import { Button, Toast } from '@/components/ui';
import { ChatInput } from '@/components/chat';
// Utils fourth
import { formatTimestamp } from '@/utils/date';

// 4. Relative imports from same module (alphabetical)
import { MessageListItem } from './components/MessageListItem';
import { useMessageHandlers } from './hooks/useMessageHandlers';
import { styles } from './styles';

// 5. Type-only imports (at the end)
import type { Message } from '@/types/chat';
import type { User } from '@/authentication/stores/authStore/types';
```

**Rules:**
- ✅ Group by category (React → External → Internal → Relative → Types)
- ✅ Sort alphabetically within each group
- ✅ Use type-only imports (`import type`) when importing only types
- ✅ Separate groups with blank lines
- ❌ DO NOT mix import styles (named vs default) inconsistently

## Forbidden Imports (Prevent Wrong-Layer Access)

### Components MUST NOT Import:

```typescript
// ❌ Components importing services directly
import { googleAuth } from '@/authentication/services/auth/googleAuth';
import { apiService } from '@/services/api';

// ✅ Components should use hooks or store actions
import { useAuth } from '@/authentication/hooks/useAuth';
import { useSignIn } from '@/authentication/stores';
```

**Why:** Components should be presentational. Business logic belongs in stores/hooks.

### Hooks MUST NOT Import:

```typescript
// ❌ Hooks importing services directly
import { apiService } from '@/services/api';

// ✅ Hooks should call store actions
import { useChatStore } from '@/stores/chatStore';

const useSendMessage = () => {
  const sendMessage = useChatStore(state => state.sendMessage);
  return { sendMessage };
};
```

**Why:** Hooks are React adapters. Services should be called by store actions.

### Utils MUST NOT Import:

```typescript
// ❌ Utils importing from React, hooks, stores, or services
import React from 'react';
import { useAuth } from '@/authentication/hooks';
import { apiService } from '@/services/api';

// ✅ Utils should be pure functions
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};
```

**Why:** Utils should be pure, reusable functions without side effects.

### Stores MUST NOT Import:

```typescript
// ❌ Stores importing from React or hooks
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// ✅ Stores can import services and utils
import { apiService } from '@/services/api';
import { formatMessage } from '@/utils/chat';
```

**Why:** Stores are framework-agnostic. They shouldn't depend on React.

### Services MUST NOT Import:

```typescript
// ❌ Services importing from React, hooks, or stores
import React from 'react';
import { useAuthStore } from '@/authentication/stores';

// ✅ Services can import other services and utils
import { storage } from '@/utils/storage';
import { API_BASE_URL } from '@/config';
```

**Why:** Services should be pure async functions. No state management.

## Layer Dependency Rules

Valid dependency flow (can only import from layers below):

```
Components
    ↓ (can import)
Hooks
    ↓ (can import)
Stores
    ↓ (can import)
Services
    ↓ (can import)
Utils
```

**Allowed:**
- ✅ Components → Hooks, Stores (via selectors), Components, Utils
- ✅ Hooks → Stores, Utils
- ✅ Stores → Services, Utils
- ✅ Services → Utils, other Services
- ✅ Utils → other Utils (pure functions only)

**Forbidden:**
- ❌ Services → Stores, Hooks, Components
- ❌ Stores → Hooks, Components
- ❌ Hooks → Services (use Store actions instead)
- ❌ Utils → Any layer above (React, Hooks, Stores, Services)

## Circular Dependency Prevention

### Barrel Exports (index.ts)

Barrel exports can cause circular dependencies. Use carefully:

**Safe Pattern:**
```typescript
// components/chat/index.ts
export { ChatInput } from './ChatInput';
export { MessageList } from './MessageList';
export { MessageItem } from './MessageItem';
```

**Unsafe Pattern:**
```typescript
// ❌ Circular dependency risk
// components/chat/index.ts
export * from './ChatInput';  // ChatInput imports from MessageItem
export * from './MessageItem'; // MessageItem imports from ChatInput
```

**Rules:**
- ✅ Use named exports in barrel files
- ✅ Export only public API (not internal components)
- ❌ Avoid `export *` when components import from each other
- ❌ Never import from a barrel file that exports the current file

### Module Cross-Imports

Feature modules SHOULD NOT import from each other:

**Bad:**
```typescript
// ❌ Feature modules depending on each other
// src/authentication/hooks/useAuth.ts
import { useChatStore } from '@/chat/stores';

// src/chat/stores/chatStore/actions.ts
import { useAuthStore } from '@/authentication/stores';
```

**Good:**
```typescript
// ✅ Shared code extracted to common location
// src/stores/appStore.ts - Shared store
export const useAppStore = create(...);

// Both features import from shared location
import { useAppStore } from '@/stores/appStore';
```

**Rules:**
- ✅ Extract shared code to common locations (`@/components`, `@/hooks`, `@/utils`)
- ✅ Use composition over cross-imports
- ❌ Avoid direct feature-to-feature imports

## Path Alias Usage

Use path aliases consistently:

```typescript
// ✅ GOOD - Using path aliases
import { Button } from '@/components/ui';
import { useAuth } from '@/authentication/hooks';
import { apiService } from '@/services/api';

// ❌ BAD - Relative paths for cross-module imports
import { Button } from '../../../components/ui';
import { useAuth } from '../../authentication/hooks';
```

**Rules:**
- ✅ Use `@/` alias for absolute imports across modules
- ✅ Use relative imports only within the same module/folder
- ❌ Avoid deep relative paths (`../../../`)

**Within Same Module:**
```typescript
// ✅ Relative paths are fine within same module
// src/screens/chat/MessageScreen/index.tsx
import { MessageList } from './components/MessageList';
import { useMessageHandlers } from './hooks/useMessageHandlers';
import { styles } from './styles';
```

## Type-Only Imports

Use `import type` for TypeScript types to prevent runtime bloat:

```typescript
// ✅ GOOD - Type-only import
import type { User } from '@/authentication/stores/authStore/types';
import type { Message } from '@/types/chat';

// ❌ BAD - Regular import for types only
import { User } from '@/authentication/stores/authStore/types';
```

**Why:** Type-only imports are removed during compilation, reducing bundle size.

**Rules:**
- ✅ Always use `import type` when importing only TypeScript types
- ✅ Use regular imports when importing values (functions, objects)
- ✅ Can mix: `import { Component, type Props } from './Component';`

## Validation Checklist

Before committing code:
- [ ] Are imports organized in the correct order?
- [ ] Am I importing from the correct layer (following dependency rules)?
- [ ] Am I using `import type` for type-only imports?
- [ ] Am I using path aliases (`@/`) for cross-module imports?
- [ ] Have I avoided circular dependencies?
- [ ] Do my feature modules avoid cross-importing?
- [ ] Are barrel exports (index.ts) used safely?
