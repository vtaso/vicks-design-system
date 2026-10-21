# Link

Use Link to navigate to another page or open a resource.
Do not use Link to submit or change data. Use Button.

**Pairs with:** Breadcrumb, body text.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Label | TEXT | `children` | string |  |
| Status | Default · hover · focus · disable | `disabled` | boolean | Figma says "disable"; code says disabled. |
| Icon left / right + swaps | BOOLEAN + INSTANCE_SWAP | `iconLeft / iconRight` | ReactNode |  |

## Tokens used

color.text.action · information · disabled; color.border.focus; alias.border-radius.sm; alias.border-width.medium

## Do

- Write link text that makes sense alone ("View refund policy").

## Don't

- Do not write "click here".

## Accessibility

- Underline or another non-color cue in body text.

## Examples

```tsx
// Correct
<Link href="/refunds">View refund policy</Link>

// Wrong
<a style={{ color: "#264be2" }}>click here</a>
```

**Code Connect:** Not connected yet.
