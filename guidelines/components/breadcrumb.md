# Breadcrumb

Use Breadcrumb to show where a page sits in a hierarchy, three levels or deeper.
Do not use it as primary navigation.

**Pairs with:** Link.

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Label | TEXT | `label` | string |  |
| Icon right | BOOLEAN | `—` | — | Separator. |
| Status | Default · hover · focus · disable | `current` | boolean |  |

## Tokens used

Same as Link.

## Do

- Make the last item the current page, not a link.

## Don't

- Do not truncate the first item.

## Accessibility

- `<nav aria-label="Breadcrumb">` and `aria-current="page"` on the last item.

## Examples

```tsx
// Correct
<Breadcrumb items={[{label:"Orders",href:"/orders"},{label:"#1042"}]} />

// Wrong
Orders > #1042 as plain text
```

**Code Connect:** Not connected yet.
