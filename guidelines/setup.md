# Setup

## Web (React)

Import the generated variables once at the app root:

```css
@import 'build/web/tokens-light.css'; /* :root — Brand A, light, desktop, web density */
@import 'build/web/tokens-dark.css';  /* [data-theme="dark"] — overrides color.* only */
```

Switch theme on the root element:

```html
<html data-theme="dark">
```

Use tokens as CSS variables. Names are the token path in kebab-case:

```css
/* Correct */
.card { background-color: var(--color-surface-default); border: var(--alias-border-width-thin) solid var(--color-border-default); }

/* Wrong — hardcoded values fail CI */
.card { background-color: #f4f3f3; border: 1px solid #e8e7e6; }
```

## Android (Jetpack Compose)

```kotlin
import com.vick.designsystem.DesignTokens

Text("Paid", color = DesignTokens.colorTextSuccess, fontSize = DesignTokens.typographyParagraphMediumFontSize)
```

## iOS (SwiftUI)

```swift
Text("Paid")
  .font(.system(size: DesignTokens.typographyParagraphMediumFontSize))
  .foregroundColor(Color(DesignTokens.colorTextSuccess))
```

## Rebuilding tokens

1. Change variables in Figma.
2. Export to `tokens/` (Tokens Studio, Figma REST API, or the export script).
3. Run `npm run tokens:build`. Set another brand with `BRAND=brand-b npm run tokens:build`.
4. Open a pull request. CI runs the token lint before anything merges.
