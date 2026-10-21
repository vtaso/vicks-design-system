# Button Icon

Use Button Icon for compact, icon-only actions: close, edit, more options.
Do not use it when the icon meaning is not universal. Use Button with a label.

**Pairs with:** Button, Menu (overflow trigger), Field (clear/search actions).

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Icon | INSTANCE_SWAP | `icon` | ReactNode | Required. |
| Label | TEXT | `ariaLabel` | string | Required accessible name, not shown visually. |
| Type | Default · Outline · Transparent | `variant` | "primary" · "outline" · "transparent" |  |
| Status | default · hover · focus · disabled | `disabled` | boolean |  |

## Tokens used

Same surface/border tokens as Button; alias.border-radius.md; density.height-button for the square size.

## Do

- Always set an accessible label ("Close dialog").
- Use Transparent inside dense rows and toolbars.

## Don't

- Do not rely on a tooltip as the only label.
- Do not make the target smaller than `density.height-button`.

## Accessibility

- `aria-label` on web, `contentDescription` on Android, `accessibilityLabel` on iOS.

## Examples

```tsx
// Correct
<ButtonIcon icon={<CloseIcon />} ariaLabel="Close dialog" variant="transparent" />

// Wrong
<div onClick={close}><CloseIcon /></div>
```

**Code Connect:** Not connected yet.
