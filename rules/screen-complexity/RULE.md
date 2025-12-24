---
description: "Apply when creating or refactoring screens/components that exceed 200 lines, or when extracting components/hooks. Enforces file size limits and complexity thresholds for maintainability."
alwaysApply: false
tags: ["complexity", "refactoring", "code-quality", "screens", "components"]
---

# Screen Complexity and Code Organization

## File Size Limits

Enforce these limits to maintain code readability and testability:

| File Type | Max Lines | Action When Exceeded |
|-----------|-----------|---------------------|
| Components | 200 lines | Extract to subcomponents or hooks |
| Screens | 250 lines | Create modular structure with hooks/ and components/ |
| Hooks | 150 lines | Split into multiple focused hooks |
| Store Actions | 300 lines | Split into multiple action files by domain |
| Services | 500 lines | Split by domain or endpoint group |

**Why These Limits:**
- Easier to understand and review
- Better testability
- Improved reusability
- Faster IDE performance

## When to Make a Screen Modular

### Single File → Modular Transition Triggers

Create a modular screen structure when ANY of these conditions are met:

1. **Custom Hooks**: Screen has 2+ custom hooks
2. **Local Components**: Screen has 3+ local/helper components
3. **File Size**: Screen file exceeds 200 lines
4. **Complexity**: Screen has complex state management or business logic
5. **Platform-Specific**: Screen needs platform-specific implementations

**Current Examples:**

✅ **Well-Structured (Modular):**
```
MessageScreen/
├── index.tsx                          # 180 lines - orchestrator
├── styles.ts
├── components/                        # 5 local components
│   ├── MessageScreenHeader.tsx
│   ├── MessageScreenContent.tsx
│   ├── MessageScreenModals.tsx
│   ├── MessageList.tsx
│   └── ScrollToBottomButton.tsx
└── hooks/                            # 3 custom hooks
    ├── useMessageScreenHandlers.ts
    ├── useMessageScreenScroll.ts
    └── useMessageScreenBackHandler.ts
```

❌ **Should Be Refactored:**
```
ChatListScreen.tsx                    # Complex screen as single file
PremiumTabScreen.tsx                  # Should extract hooks/components
```

## Component Extraction Guidelines

### When to Extract a Component

Extract to a separate component when:

1. **Logical Block**: Represents a distinct UI section
2. **Reusability**: Used in multiple places (even if just 2x)
3. **Complexity**: Has its own state or complex logic
4. **Length**: Parent component exceeds 200 lines
5. **Conditional Rendering**: Large blocks of conditional JSX

**Example - Before (BAD):**
```typescript
// ❌ 350-line screen with everything inline
const ChatListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (query: string) => { ... };
  const handleFilter = (filter: string) => { ... };
  const handleRefresh = async () => { ... };
  const handleChatPress = (chatId: string) => { ... };

  return (
    <View style={styles.container}>
      {/* 50 lines of header JSX */}
      <View style={styles.header}>
        <TextInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search chats..."
        />
        {/* More header code... */}
      </View>

      {/* 100 lines of filter JSX */}
      <View style={styles.filters}>
        {/* Complex filter UI... */}
      </View>

      {/* 200 lines of chat list JSX */}
      <FlatList
        data={filteredChats}
        renderItem={({ item }) => (
          <View>
            {/* Inline chat item rendering... */}
          </View>
        )}
      />
    </View>
  );
};
```

**Example - After (GOOD):**
```typescript
// ✅ Refactored to modular structure
// ChatListScreen/index.tsx (120 lines - orchestrator)
const ChatListScreen = () => {
  const {
    searchQuery,
    selectedFilter,
    handleSearch,
    handleFilter,
    handleRefresh
  } = useChatListHandlers();

  const { handleChatPress } = useChatNavigation();

  return (
    <View style={styles.container}>
      <ChatListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      <ChatListFilters
        selectedFilter={selectedFilter}
        onFilterChange={handleFilter}
      />

      <ChatListContent
        onChatPress={handleChatPress}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

// ChatListScreen/components/ChatListHeader.tsx (40 lines)
export const ChatListHeader = ({ searchQuery, onSearchChange }) => {
  return (
    <View style={styles.header}>
      <TextInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Search chats..."
      />
    </View>
  );
};

// ChatListScreen/hooks/useChatListHandlers.ts (60 lines)
export const useChatListHandlers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  // More logic...

  return { searchQuery, selectedFilter, handleSearch, handleFilter };
};
```

## Hook Extraction Guidelines

### When to Extract Logic to a Hook

Extract to a custom hook when:

1. **Event Handlers**: Screen has 3+ event handler functions
2. **Side Effects**: Complex useEffect logic (>10 lines)
3. **State Management**: Multiple related useState calls
4. **Derived State**: Complex calculations based on state/props
5. **Reusability**: Logic used in multiple screens
6. **Testing**: Logic needs to be tested independently

**Example - Before (BAD):**
```typescript
// ❌ All logic inline in component
const MessageScreen = () => {
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollButton(offsetY > 500);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleContentSizeChange = () => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  };

  // 50+ more lines of component code...
};
```

**Example - After (GOOD):**
```typescript
// ✅ Logic extracted to custom hook
// MessageScreen/index.tsx
const MessageScreen = () => {
  const {
    flatListRef,
    showScrollButton,
    handleScroll,
    scrollToBottom
  } = useMessageScreenScroll();

  // Clean, focused component
};

// MessageScreen/hooks/useMessageScreenScroll.ts
export const useMessageScreenScroll = () => {
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowScrollButton(offsetY > 500);
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  return {
    flatListRef,
    showScrollButton,
    handleScroll,
    scrollToBottom
  };
};
```

## Function Complexity Limits

### Function Size Rules

| Metric | Limit | Action When Exceeded |
|--------|-------|---------------------|
| Lines per function | 50 lines | Extract to smaller functions |
| Nesting levels | 3 levels | Refactor to reduce nesting |
| Parameters | 5 parameters | Use object parameter or context |
| Cyclomatic complexity | 10 | Simplify logic or extract functions |

**Example - Before (BAD):**
```typescript
// ❌ 80-line function with deep nesting
const handleMessageSend = async (
  message: string,
  chatId: string,
  userId: string,
  metadata: Metadata,
  attachments: File[],
  replyTo?: string
) => {
  if (message.trim()) {
    if (chatId) {
      if (userId) {
        try {
          if (attachments.length > 0) {
            // Upload attachments...
            for (const file of attachments) {
              if (file.size < MAX_SIZE) {
                // Upload logic...
              } else {
                // Error handling...
              }
            }
          }
          // More nested logic...
        } catch (error) {
          // Error handling...
        }
      }
    }
  }
};
```

**Example - After (GOOD):**
```typescript
// ✅ Broken into focused functions
const handleMessageSend = async (params: SendMessageParams) => {
  if (!isValidMessage(params)) {
    return;
  }

  const uploadedAttachments = await uploadAttachments(params.attachments);
  await sendMessage({ ...params, attachments: uploadedAttachments });
};

const isValidMessage = (params: SendMessageParams): boolean => {
  return Boolean(
    params.message.trim() &&
    params.chatId &&
    params.userId
  );
};

const uploadAttachments = async (files: File[]): Promise<string[]> => {
  const validFiles = files.filter(file => file.size < MAX_SIZE);
  return Promise.all(validFiles.map(uploadFile));
};
```

## Component Props Limit

**Max Props Per Component: 7**

If a component needs more than 7 props, consider:

1. **Group Related Props**: Use object parameter
2. **Context**: Move shared state to context
3. **Composition**: Break into smaller components
4. **Store**: Use global state (Zustand)

**Example - Before (BAD):**
```typescript
// ❌ Too many props
<ChatInput
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  onFocus={handleFocus}
  onBlur={handleBlur}
  placeholder="Type a message..."
  disabled={isLoading}
  showAttachment={true}
  onAttachmentPress={handleAttachment}
  maxLength={500}
  autoFocus={false}
/>
```

**Example - After (GOOD):**
```typescript
// ✅ Grouped props + context
<ChatInput
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  config={{
    placeholder: "Type a message...",
    maxLength: 500,
    autoFocus: false
  }}
  features={{
    showAttachment: true,
    onAttachmentPress: handleAttachment
  }}
/>

// Or use context for shared state
<ChatInputProvider>
  <ChatInput
    value={message}
    onChange={setMessage}
    onSend={handleSend}
  />
</ChatInputProvider>
```

## Refactoring Checklist

When refactoring a complex file:

### Step 1: Analyze
- [ ] Measure file line count
- [ ] Count custom hooks and local components
- [ ] Identify logical sections
- [ ] List all event handlers and state

### Step 2: Plan
- [ ] Decide: single file or modular?
- [ ] Identify components to extract
- [ ] Identify hooks to extract
- [ ] Plan folder structure

### Step 3: Extract
- [ ] Create folder if modular
- [ ] Extract local components first
- [ ] Extract hooks second
- [ ] Update imports
- [ ] Test functionality

### Step 4: Validate
- [ ] File sizes within limits?
- [ ] Components under 200 lines?
- [ ] Hooks under 150 lines?
- [ ] Functions under 50 lines?
- [ ] Max 7 props per component?
- [ ] No deep nesting (max 3 levels)?

## Validation Checklist

Before committing new screens or components:
- [ ] Is the file under the size limit for its type?
- [ ] If over 200 lines, have I extracted components/hooks?
- [ ] Are functions under 50 lines?
- [ ] Is nesting limited to 3 levels?
- [ ] Do components have max 7 props?
- [ ] Have I used custom hooks for complex logic?
- [ ] Is the code testable and maintainable?
