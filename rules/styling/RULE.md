---
description: "Styling conventions using react-native-size-matters and theme values"
alwaysApply: false
tags: ["styling", "design", "react-native"]
---

# Styling Conventions

## Use Scale Functions for Responsive Design

Always use `react-native-size-matters` scale functions instead of direct pixel values.

### Examples

```typescript
✅ GOOD:
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    gap: scale(2),
    padding: scale(16),
    marginTop: verticalScale(20)
  },
  text: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24)
  }
});

❌ BAD:
const styles = StyleSheet.create({
  container: {
    gap: 2,              // Direct pixel value
    padding: 16,         // Direct pixel value
    marginTop: 20        // Direct pixel value
  },
  text: {
    fontSize: 16,        // Direct pixel value
    lineHeight: 24       // Direct pixel value
  }
});
```

## Reference Theme Values

When possible, reference values from the theme file instead of hardcoding.

```typescript
✅ GOOD:
import { theme } from '@/config/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md
  },
  text: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary
  }
});

❌ BAD:
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8
  },
  text: {
    fontSize: 16,
    color: '#000000'
  }
});
```

## Rules

- ✅ Always use `scale()`, `verticalScale()`, or `moderateScale()` for dimensions
- ✅ Reference theme values for colors, spacing, and typography
- ✅ Use `moderateScale()` for font sizes to prevent excessive scaling
- ✅ Use `verticalScale()` for heights and vertical spacing
- ✅ Use `scale()` for widths and horizontal spacing
- ❌ DO NOT use hardcoded pixel values
- ❌ DO NOT use hardcoded color hex values
