# Dropdown

Use Dropdown to pick one value from a list of 5 or more options.
Do not use it for 2–4 options. Show them directly.

**Pairs with:** Label, Menu.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| — | Single component | `value / options` | string · Option[] | No variants yet. Add Status (default, focus, disabled, error) to match Field. |

## Tokens used

Should mirror Field tokens.

## Do

- Default to the most common value.

## Don't

- Do not hide required choices behind a placeholder.

## Accessibility

- Native select or a listbox with full keyboard support.

## Examples

```tsx
// Correct
<Dropdown label="Reason" options={reasons} />

// Wrong
<div class="fake-select">
```

**Code Connect:** Not connected yet.
