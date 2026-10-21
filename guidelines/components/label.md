# Label

Use Label above every Field and Input.
Do not use Label as body text.

**Pairs with:** Field, Input.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Type | Default · required | `required` | boolean | Required shows an asterisk. |

## Tokens used

typography.paragraph-medium.*; alias.font-family.body; required marker currently uses alias.error.600 — should move to color.text.error.

## Do

- Keep labels short and specific.

## Don't

- Do not mark required with color only. Keep the asterisk and say "required" to screen readers.

## Accessibility

- `<label for>` on web.

## Examples

```tsx
// Correct
<Label text="Email" required />

// Wrong
<span style={{ color: "red" }}>*</span>
```

**Code Connect:** Not connected yet.
