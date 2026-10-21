# Button

Use Button for all interactive actions — form submissions, confirming, saving, opening a flow.
Do not use Button for navigation to another page. Use Link.

**Pairs with:** Button Icon (icon-only actions), Field (forms), Menu (overflow actions).

## API — Figma ↔ code

| Figma property | Figma type / values | Code prop | Code type | Notes |
| --- | --- | --- | --- | --- |
| Label | TEXT | `label` | string | Verb first: "Save changes", "Refund payment". |
| Type | Default · Outline · Transparent | `variant` | "primary" · "outline" · "transparent" | Default = primary. One primary per view. |
| Status | default · hover · focus · disabled | `disabled` | boolean | Hover and focus are runtime states, not props. |
| Icon left / Icon Left swap | BOOLEAN + INSTANCE_SWAP | `iconLeft` | ReactNode | Optional. |
| Icon right / Icon  Right Swap | BOOLEAN + INSTANCE_SWAP | `iconRight` | ReactNode | Note the double space in the Figma name. |

## Tokens used

color.surface.action · action-hover · action-hover-light · default-secondary · disabled; color.text.on-action · action · action-hover · disabled; color.border.action · action-hover · focus · disabled; alias.border-radius.md; alias.border-width.thin/medium; typography.paragraph-medium.*; density.height-button · padding-touch · gap-container

## Do

- Use one Default (primary) button per view for the main action.
- Use Outline for secondary actions next to a primary.
- Use Transparent for low-emphasis actions in toolbars and dense rows.

## Don't

- Do not put two primary buttons side by side.
- Do not disable a button without telling the user why.
- Do not use Button with only an icon. Use Button Icon with an accessible label.

## Accessibility

- Native `<button type="button">` on web.
- Visible focus ring (`color.border.focus`, 2px).
- Minimum height `density.height-button` (44 iOS, 48 Android, 64 POS).

## Examples

```tsx
// Correct
<Button label="Refund payment" variant="primary" />
<Button label="Cancel" variant="outline" />

// Wrong
<button style={{ background: "#873db8" }}>Refund</button>
```

**Code Connect:** Connected (Button.figma.ts).
