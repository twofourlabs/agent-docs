---
description: "File naming conventions for components, screens, hooks, stores, and other code artifacts"
alwaysApply: false
tags: ["naming", "conventions", "file-structure"]
---

# File Naming Conventions

## File Naming by Type

| File Type | Convention | Extension | Examples |
|-----------|-----------|-----------|----------|
| Components | PascalCase | `.tsx` | `ChatInput.tsx`, `MessageItem.tsx` |
| Screens | PascalCase + "Screen" | `.tsx` | `ChatListScreen.tsx`, `MessageScreen/index.tsx` |
| Hooks | camelCase + "use" prefix | `.ts` or `.tsx` | `useAuth.ts`, `useMessageHandlers.ts` |
| Stores | camelCase + "Store" suffix | Folder | `authStore/`, `chatStore/` |
| Services | camelCase | `.ts` | `api.ts`, `googleAuth.ts`, `tokenManager.ts` |
| Utils | camelCase | `.ts` | `dateHelpers.ts`, `formatMessage.ts` |
| Types | camelCase | `.ts` | `types.ts`, `navigation.ts` |
| Styles | camelCase | `.ts` | `styles.ts` |
| Config | camelCase | `.ts` or `.json` | `index.ts`, `babel.config.js` |
| Tests | Match source + ".test" | `.ts` or `.tsx` | `ChatInput.test.tsx`, `useAuth.test.ts` |

## Components

**Convention:** PascalCase

```
✅ GOOD:
ChatInput.tsx
MessageItem.tsx
ScrollToBottomButton.tsx
PremiumFeatureCard.tsx

❌ BAD:
chatInput.tsx          // Wrong case
chat-input.tsx         // Kebab case
chat_input.tsx         // Snake case
ChatInputComponent.tsx // Redundant suffix
```

**Rules:**
- ✅ Use PascalCase for all component files
- ✅ Name matches the component function/class name
- ✅ Use descriptive names (not generic like `Item.tsx`, `Card.tsx`)
- ❌ DO NOT use redundant suffixes like "Component"

### Platform-Specific Components

**Convention:** `[ComponentName].[platform].tsx`

```
✅ GOOD:
ChatInput.tsx          // Selector file or shared implementation
ChatInput.ios.tsx      // iOS-specific
ChatInput.android.tsx  // Android-specific
ChatInput.web.tsx      // Web-specific
ChatInput.native.tsx   // Native (iOS + Android)

❌ BAD:
ChatInput-ios.tsx      // Wrong separator
ChatInputIOS.tsx       // Platform in name
iOSChatInput.tsx       // Platform prefix
```

**Rules:**
- ✅ Use dot notation: `Component.platform.tsx`
- ✅ Platform suffix: `ios`, `android`, `web`, `native`
- ✅ Keep base name consistent across platforms
- ❌ DO NOT include platform in the component name itself

## Hooks

**Convention:** camelCase with `use` prefix

```
✅ GOOD:
useAuth.ts
useMessageHandlers.ts
useMessageScreenScroll.ts
useChatNavigation.ts

❌ BAD:
UseAuth.ts                 // Wrong case
auth.ts                    // Missing "use" prefix
authHook.ts                // Wrong suffix
use-auth.ts                // Kebab case
messageHandlers.ts         // Missing "use" prefix
```

**Rules:**
- ✅ ALWAYS start with `use` prefix
- ✅ Use camelCase for the rest of the name
- ✅ Name describes what the hook does or provides
- ❌ DO NOT use "Hook" suffix (redundant with "use" prefix)

**File Extension:**
- Use `.ts` if hook doesn't return JSX
- Use `.tsx` if hook returns JSX elements

## Stores

**Convention:** camelCase with `Store` suffix (folder name)

```
✅ GOOD:
authStore/
  ├── types.ts
  ├── actions.ts
  └── index.ts

chatStore/
  ├── types.ts
  ├── actions.ts
  └── index.ts

audioPlaybackStore.ts  // Simple store (single file)

❌ BAD:
AuthStore/             // Wrong case
auth/                  // Missing "Store" suffix
auth-store/            // Kebab case
```

**Rules:**
- ✅ Folder name: camelCase + "Store" suffix
- ✅ For complex stores, use folder with multiple files
- ✅ For simple stores, single file is acceptable
- ❌ DO NOT use PascalCase for store folders

**Store Files:**
```
types.ts          ✅ Lowercase, plural if needed
actions.ts        ✅ Lowercase, plural
index.ts          ✅ Always "index.ts"
selectors.ts      ✅ Lowercase, plural
initialState.ts   ✅ camelCase
middleware.ts     ✅ Lowercase, singular
persistence.ts    ✅ Lowercase, singular
```

## Services

**Convention:** camelCase

```
✅ GOOD:
api.ts
googleAuth.ts
firebaseAuth.ts
otpAuth.ts
tokenManager.ts
uploadQueue.ts

❌ BAD:
API.ts                 // Wrong case
GoogleAuth.ts          // Wrong case
google-auth.ts         // Kebab case
googleAuthService.ts   // Redundant suffix (already in services/)
```

**Rules:**
- ✅ Use camelCase
- ✅ Descriptive names indicating purpose
- ❌ DO NOT use "Service" suffix (already in `services/` folder)
- ❌ DO NOT use PascalCase or kebab-case

## Utils

**Convention:** camelCase, descriptive of functionality

```
✅ GOOD:
dateHelpers.ts
formatMessage.ts
tokenRefresh.ts
authHelpers.ts
storage.ts

❌ BAD:
DateHelpers.ts         // Wrong case
date-helpers.ts        // Kebab case
dateUtils.ts           // Redundant suffix (already in utils/)
utils.ts               // Too generic
helpers.ts             // Too generic
```

**Rules:**
- ✅ Use camelCase
- ✅ Name describes the utility domain or function
- ❌ DO NOT use "Utils" or "Helpers" suffix (already in `utils/` folder)
- ❌ Avoid generic names like `utils.ts`, `helpers.ts`

## Screens

**Convention:** PascalCase + "Screen" suffix

**Single File:**
```
✅ GOOD:
ChatListScreen.tsx
PremiumTabScreen.tsx
SettingsScreen.tsx

❌ BAD:
ChatList.tsx           // Missing "Screen" suffix
chatListScreen.tsx     // Wrong case
chat-list-screen.tsx   // Kebab case
```

**Modular (Folder):**
```
✅ GOOD:
MessageScreen/
  ├── index.tsx        // Main screen component
  ├── styles.ts
  ├── components/
  └── hooks/

❌ BAD:
MessageScreen/
  ├── MessageScreen.tsx  // Redundant name
  ├── styles.ts
  ...

message-screen/          // Wrong case
  ├── index.tsx
  ...
```

**Rules:**
- ✅ Always use "Screen" suffix
- ✅ Folder name matches screen name
- ✅ Main component in `index.tsx` (for modular screens)
- ❌ DO NOT repeat screen name inside its folder

## Types

**Convention:** camelCase, usually `types.ts`

```
✅ GOOD:
types.ts               // In feature modules or components
navigation.ts          // Specific type domains
api.ts                 // API-related types

❌ BAD:
Types.ts               // Wrong case
type.ts                // Singular (use plural)
interfaces.ts          // Prefer "types.ts"
models.ts              // Prefer "types.ts"
```

**Rules:**
- ✅ Use `types.ts` as the standard name
- ✅ Use domain-specific names for specialized types
- ✅ Place types.ts at the appropriate level (module, store, etc.)
- ❌ Avoid generic names at the root (creates import confusion)

## Styles

**Convention:** Always `styles.ts`

```
✅ GOOD:
styles.ts              // Standard name
theme.ts               // For theme definitions

❌ BAD:
Styles.ts              // Wrong case
style.ts               // Singular
componentStyles.ts     // Redundant prefix
ChatInput.styles.ts    // Prefer colocation
```

**Rules:**
- ✅ Always use `styles.ts` as the filename
- ✅ Co-locate with the component (in same folder)
- ❌ DO NOT include component name in style filename

## Barrel Exports (index files)

**Convention:** Always `index.ts` or `index.tsx`

```
✅ GOOD:
components/chat/index.ts    // Exports chat components
stores/authStore/index.ts   // Store public API
hooks/index.ts              // Exports all hooks

❌ BAD:
components/chat/exports.ts
components/chat/public.ts
stores/authStore/main.ts
```

**Rules:**
- ✅ Always name barrel files `index.ts` or `index.tsx`
- ✅ Use `.tsx` only if the index file contains JSX
- ✅ Use `.ts` for pure re-exports
- ❌ DO NOT use alternative names for barrel files

## Tests

**Convention:** Match source file + `.test` or `.spec`

```
✅ GOOD:
ChatInput.test.tsx          // Tests for ChatInput.tsx
useAuth.test.ts             // Tests for useAuth.ts
formatMessage.test.ts       // Tests for formatMessage.ts
api.spec.ts                 // Alternative (spec)

❌ BAD:
ChatInputTest.tsx
ChatInput.tests.tsx
test-ChatInput.tsx
ChatInput-test.tsx
```

**Rules:**
- ✅ Match the source file name exactly
- ✅ Add `.test` or `.spec` before extension
- ✅ Use same extension as source (`.ts` or `.tsx`)
- ❌ DO NOT change the base filename

## Config Files

**Convention:** Varies by ecosystem (follow standard)

```
✅ GOOD:
babel.config.js
metro.config.js
tsconfig.json
package.json
.eslintrc.js
.prettierrc.js

❌ BAD:
babelConfig.js         // Non-standard
Babel.config.js        // Wrong case
```

**Rules:**
- ✅ Follow ecosystem conventions
- ✅ Use lowercase for standard config files
- ✅ Use extensions as expected by tools

## Folder Naming

**Convention:** Lowercase or camelCase

```
✅ GOOD:
src/
  authentication/      // Feature module
  components/          // Lowercase
  screens/
    chat/              // Lowercase domain
  stores/
    authStore/         // camelCase with suffix

❌ BAD:
src/
  Authentication/      // Wrong case for feature
  Components/          // Wrong case
  Screens/
```

**Rules:**
- ✅ Use lowercase for standard folders (components, screens, hooks, etc.)
- ✅ Use camelCase for feature modules and stores
- ❌ DO NOT use PascalCase for folders