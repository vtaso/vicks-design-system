# List item

Use List item for rows in lists and simple tables.
Do not use it for data that needs sorting or columns. Use a table.

**Pairs with:** Menu, Button Icon (row actions).

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| State | Default | `—` | — | Only one state today. Add hover, selected and disabled. |

## Tokens used

density.gap-container · padding-touch

## Do

- Keep row height at or above the touch target.

## Don't

- Do not put more than one primary action in a row.

## Accessibility

- Use `<ul>/<li>` or a role="list" container.

## Examples

```tsx
// Correct
<ListItem title="Order #1042" />

// Wrong
<div><div>Order #1042</div></div>
```

**Code Connect:** Not connected yet.
