# Field

Use Field for single-line text entry with a label, optional icons and validation.
Do not use Field for long text or choosing from a list. Use a text area or Dropdown.

**Pairs with:** Label (above), Input (helper/hint), Button (submit).

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Label | TEXT | `placeholder` | string | Placeholder only. The visible label comes from Label. |
| Type | Default · filled · error | `state` | "default" · "filled" · "error" | Error needs a message. |
| Status | Default · hover · focus · disabled | `disabled` | boolean |  |
| Icon left / right + swaps | BOOLEAN + INSTANCE_SWAP | `iconLeft / iconRight` | ReactNode |  |

## Tokens used

color.surface.default-secondary · error · disabled; color.border.default · action · focus · error · disabled; color.text.heading · placeholder · action; alias.border-radius.sm/md; alias.border-width.medium; typography.paragraph-medium.*

## Do

- Always pair with a visible Label.
- Show the error message under the field, linked to it.

## Don't

- Do not use placeholder as the label.
- Do not show error with a red border only.

## Accessibility

- Error message connected with `aria-describedby` and announced.
- Focus stays in the field after an error.

## Examples

```tsx
// Correct
<Label text="Card number" required />
<Field placeholder="1234 5678 9012 3456" state="error" />

// Wrong
<input placeholder="Card number" style={{ borderColor: "red" }} />
```

**Code Connect:** Not connected yet. Next one to connect.
