# Input

Use Input for a text control with optional hint copy (for example email).
Do not stack Input and Field for the same value.

**Pairs with:** Label, Field.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Type | Default · email | `type` | "text" · "email" |  |
| Show Hint copy | BOOLEAN | `hint` | string | undefined |  |
|  Control Hint copy | TEXT | `hint` | string | Note the leading space in the Figma name. |

## Tokens used

color.surface.default-secondary; color.border.default; alias.border-radius.sm; typography.paragraph-medium.*

## Do

- Use the email type so mobile keyboards show @.

## Don't

- Do not hide hint text that explains format rules.

## Accessibility

- Hint copy linked with `aria-describedby`.

## Examples

```tsx
// Correct
<Input type="email" hint="We send receipts here" />

// Wrong
<input type="text" placeholder="email" />
```

**Code Connect:** Not connected yet.
