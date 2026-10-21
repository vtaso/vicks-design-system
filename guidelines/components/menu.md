# Menu

Use Menu for a short list of actions or options opened from a trigger.
Do not use Menu for site navigation.

**Pairs with:** Button Icon (trigger), Dropdown.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Label | TEXT | `label` | string |  |
| Status | unselected · selected | `selected` | boolean |  |
| Icon + Icon swap | BOOLEAN + INSTANCE_SWAP | `icon` | ReactNode |  |

## Tokens used

color.surface.default-secondary · action · action-hover · action-hover-light · disabled; color.text.heading · on-action · action-hover · disabled; color.border.action · focus; divider currently alias.neutral.200 — should be color.border.default.

## Do

- Keep items to one line.

## Don't

- Do not nest menus more than one level.

## Accessibility

- Arrow-key navigation, Escape closes, focus returns to the trigger.

## Examples

```tsx
// Correct
<Menu items={[{label:"Refund"},{label:"Void"}]} />

// Wrong
A div list without keyboard support
```

**Code Connect:** Not connected yet.
