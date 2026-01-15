---
name: react-native-migration-0.79.x-to-latest
description: This skill provides a migration guide for react native from 0.79.x to latest 0.83.x version. 
---

# React Native 0.79.x to 0.83.x Migration Assistant

## Description

Expert guidance for migrating React Native projects from version 0.79.x to 0.83.x. This skill provides automated detection of breaking changes, step-by-step migration assistance, code fixes, and validation specific to this version upgrade.

## When to Use

Use this skill when:
- Upgrading React Native from 0.79.x to 0.83.x (or minor/patch versions within these ranges)
- Encountering build errors after RN upgrade
- Updating Android native modules for RN 0.83.x compatibility
- Migrating MMKV storage code
- Refactoring MainApplication.kt for new architecture
- Validating migration completeness

## Triggers

- "migrate react native to 0.83"
- "upgrade from RN 0.79"
- "fix RN 0.83 build errors"
- "update native modules for RN 0.83"
- "MainApplication.kt errors after upgrade"
- "MMKV migration"

---

## Migration Workflow

When invoked, follow this systematic approach:

### Phase 1: Pre-Migration Analysis

1. **Detect Current Version**
   ```bash
   grep "react-native" package.json
   ```

2. **Scan for Breaking Change Patterns**
   - Android native modules using `currentActivity`
   - Android modules with `onNewIntent(Intent?)`
   - MainApplication.kt structure
   - MMKV usage (`new MMKV()`, `.delete()`)
   - Dependency versions

3. **Create Migration Checklist**
   Use TodoWrite to track:
   - [ ] Dependency updates
   - [ ] Android native module fixes
   - [ ] MainApplication.kt refactoring
   - [ ] MMKV API updates
   - [ ] Clean build
   - [ ] Testing

### Phase 2: Automated Detection

Run parallel searches to find affected code:

```bash
# Find native modules with currentActivity
grep -r "currentActivity" android/app/src/main/java

# Find onNewIntent with nullable Intent
grep -r "onNewIntent(intent: Intent?)" android/app/src/main/java

# Find MMKV usage
grep -r "new MMKV\|storage\.delete" src/

# Find MainApplication
find android/app/src/main/java -name "MainApplication.kt"
```

### Phase 3: Guided Fixes

For each breaking change detected, provide:

#### 3.1 Android Native Module - currentActivity Fix

**Detection Pattern:**
```kotlin
val activity = currentActivity
// or
val activity: Activity? = currentActivity
```

**Required Fix:**
```kotlin
val activity: Activity? = reactApplicationContext.currentActivity
```

**Action:**
- Use Edit tool to replace pattern
- **IMPORTANT: Add `import android.app.Activity` at the top of the file if not present**
- Files affected: `*Module.kt`
- In some modules, you may need to explicitly add the type annotation: `val activity: Activity? = ...`

#### 3.2 Android Native Module - onNewIntent Fix

**Detection Pattern:**
```kotlin
override fun onNewIntent(intent: Intent?) {
```

**Required Fix:**
```kotlin
override fun onNewIntent(intent: Intent) {
    // Not needed for this implementation
}
```

**Action:**
- Use Edit tool to remove `?` nullable operator
- Update implementation to handle non-null Intent
- If the method body was empty or had `= Unit`, replace with a proper implementation or comment

#### 3.3 MainApplication.kt Refactoring

**Detection:** Check if file contains `ReactNativeHost` or `DefaultReactNativeHost`

**Required Changes:**
1. Remove `reactNativeHost` property
2. Update `reactHost` to use lazy initialization
3. Replace `SoLoader.init()` with `loadReactNative(this)`
4. Update imports

**Template:**
```kotlin
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Add custom packages
          add(YourCustomPackage())
          // Note: RazorpayPackage() may need to be replaced with RazorpayCustomPackage()
          // depending on your razorpay-react-native version
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    // Your custom initialization
  }
}
```

#### 3.4 MMKV Storage Migration

**Detection Patterns:**
```typescript
import { MMKV } from 'react-native-mmkv'
new MMKV({
storage.delete(key)
```

**Required Fixes:**
```typescript
import { createMMKV } from 'react-native-mmkv'
createMMKV({
storage.remove(key)
```

**Action:**
- Use Edit tool for each occurrence
- Typically affects: `src/utils/storage.ts`

### Phase 4: Dependency Updates

Provide exact npm commands:

```bash
# Core dependencies
npm install react@19.2.0 react-native@0.83.0

# Updated dependencies with verified versions
npm install react-native-mmkv@4.1.0
npm install @react-native-async-storage/async-storage@2.2.0
npm install react-native-gesture-handler@2.30.0
npm install react-native-reanimated@4.2.1
npm install react-native-safe-area-context@5.6.2
npm install react-native-svg@15.15.1
npm install react-native-screens@4.19.0
npm install react-native-svg-transformer@1.5.2
npm install react-native-customui@2.2.6
npm install react-native-device-info@15.0.1
npm install react-native-nitro-modules@0.31.10
npm install react-native-nitro-sound@0.2.10
npm install react-native-otp-entry@1.8.5
npm install react-native-worklets@0.7.1

# Updated Firebase dependencies (if using)
npm install @react-native-firebase/app@23.7.0
npm install @react-native-firebase/analytics@23.7.0
npm install @react-native-firebase/auth@23.7.0
npm install @react-native-firebase/crashlytics@23.7.0
npm install @react-native-firebase/installations@23.7.0
npm install @react-native-firebase/messaging@23.7.0

# Updated navigation dependencies (if using)
npm install @react-navigation/native@7.1.26
npm install @react-navigation/bottom-tabs@7.9.0
npm install @react-navigation/native-stack@7.9.0
npm install @react-navigation/stack@7.6.13

# Other updated dependencies
npm install @react-native-google-signin/google-signin@16.0.0
npm install @tanstack/react-query@5.90.12
npm install react-native-video@6.18.0
npm install socket.io-client@4.8.3

# Dev dependencies
npm install --save-dev @react-native-community/cli@20.0.0
npm install --save-dev @react-native-community/cli-platform-android@20.0.0
npm install --save-dev @react-native-community/cli-platform-ios@20.0.0
npm install --save-dev @react-native/babel-preset@0.83.0
npm install --save-dev @react-native/metro-config@0.83.0
npm install --save-dev @types/react@19.2.0
npm install --save-dev react-test-renderer@19.2.0
npm install --save-dev jest@29.2.1
```

### Phase 4.1: Node.js Version Check

React Native 0.83.0 requires Node.js >= 20. Verify your Node version:

```bash
node --version  # Should be v20.x.x or higher
```

If you need to upgrade Node.js, use nvm or your preferred Node version manager.

### Phase 5: Clean Build

Execute build cleanup:

```bash
# Clean node_modules
rm -rf node_modules package-lock.json
npm install

# Clean Android
cd android && ./gradlew clean && cd ..

# Clean iOS (if applicable)
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Reset Metro cache
npx react-native start --reset-cache
```

### Phase 6: Validation

Run validation checks:

1. **Build Validation**
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios
   ```

2. **Code Pattern Validation**
   ```bash
   # Should return 0 results:
   grep -r "currentActivity[^.]" android/app/src/main/java
   grep -r "Intent?" android/app/src/main/java
   grep -r "new MMKV" src/
   grep -r "storage\.delete" src/
   grep -r "ReactNativeHost" android/
   grep -r "SoLoader\.init" android/
   ```

3. **Functional Testing Checklist**
   - [ ] App launches without crashes
   - [ ] Storage read/write works (MMKV)
   - [ ] Native modules function correctly
   - [ ] Navigation works
   - [ ] Third-party integrations work
   - [ ] No console warnings

### Phase 7: Documentation

After successful migration:

1. **Update CHANGELOG** (if exists)
2. **Document custom changes** (if any project-specific modifications were needed)
3. **Reference main migration guide**: `docs/solutions/migration-guides/react-native-0.79.x-to-0.83.x.md`

---

## Common Issues & Solutions

### Issue: "Cannot find symbol: currentActivity"

**Quick Fix:**
```kotlin
// Replace all occurrences in native modules
currentActivity → reactApplicationContext.currentActivity
```

### Issue: "Type mismatch: onNewIntent"

**Quick Fix:**
```kotlin
// Remove nullable operator
override fun onNewIntent(intent: Intent?) { }
↓
override fun onNewIntent(intent: Intent) { }
```

### Issue: "Property 'delete' does not exist on type 'MMKV'"

**Quick Fix:**
```typescript
storage.delete(key) → storage.remove(key)
```

### Issue: "Cannot resolve symbol 'ReactNativeHost'"

**Quick Fix:**
Refactor entire MainApplication.kt using the template in Phase 3.3

---

## Files Typically Modified

Track these files during migration:

**Android Native Code:**
- `android/app/src/main/java/*/MainApplication.kt` (major refactoring)
- `android/app/src/main/java/*/*Module.kt` (all custom modules)

**JavaScript/TypeScript:**
- `src/utils/storage.ts` (MMKV changes)
- Any file directly using MMKV

**Configuration:**
- `package.json` (dependency versions)
- `package-lock.json` (regenerated)

---

## Rollback Strategy

If migration fails:

```bash
# Revert all changes
git checkout HEAD -- package.json package-lock.json android/ ios/

# Clean install
rm -rf node_modules
npm install

# Clean build
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
```

---

## Success Criteria

Migration is complete when:

✅ All breaking change patterns have been fixed
✅ App builds successfully on Android
✅ App builds successfully on iOS
✅ No runtime crashes on launch
✅ Storage operations work correctly
✅ All native modules function properly
✅ No deprecated API warnings in console
✅ Tests pass

---

## Additional Resources

Reference the comprehensive migration guide:
- **Location**: `docs/solutions/migration-guides/react-native-0.79.x-to-0.83.x.md`
- **Contains**: Detailed explanations, full code examples, testing strategy

External resources:
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.79.2&to=0.83.0)
- [React Native 0.83 Release Notes](https://github.com/facebook/react-native/releases/tag/v0.83.0)
- [MMKV v4 Migration](https://github.com/mrousavy/react-native-mmkv)

---

## Execution Strategy

When user invokes this skill:

1. **Assess current state** - Check if already on 0.83.x or migrating
2. **Create todo list** - Track all migration phases
3. **Run automated detection** - Find all breaking change patterns
4. **Present findings** - Show user what needs to be fixed
5. **Execute fixes** - Apply changes systematically with user approval
6. **Validate** - Run all validation checks
7. **Document** - Update any project-specific documentation

Always use TodoWrite to track progress and keep user informed of migration status.

---

## Version Scope

This skill is optimized for:
- **Source versions**: React Native 0.79.0 through 0.79.x
- **Target versions**: React Native 0.83.0 through 0.83.x
- **Compatibility**: Minor and patch versions within these ranges

For migrations to/from other major versions, refer to official React Native upgrade guides.
