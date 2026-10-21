# Color

Color tokens describe **what a color is for**, not what it looks like. Components only use the Mapped collection (`color.*`). Light and Dark are modes of the same token, so a component never needs to know which theme it's in.

## Surface — backgrounds

| Token | Use for |
| --- | --- |
| `color.surface.page` | Root background of every screen |
| `color.surface.default` | Cards, panels, containers on the page |
| `color.surface.default-secondary` | Grouped or layered content inside a default surface; input and outline-button fill |
| `color.surface.action` | Primary buttons and other high-emphasis actions |
| `color.surface.action-hover` | Hover/pressed for primary actions |
| `color.surface.action-hover-light` | Hover for low-emphasis actions (outline, transparent buttons, menu rows) |
| `color.surface.success` · `error` · `warning` · `information` | Status banners and messages |
| `color.surface.disabled` | Disabled controls |

## Border

| Token | Use for |
| --- | --- |
| `color.border.default` | Inputs, cards, dividers |
| `color.border.action` · `action-hover` | Outline buttons, selected inputs |
| `color.border.focus` | Keyboard focus ring — required on every interactive element |
| `color.border.success` · `error` · `warning` · `information` | Status borders (never the only signal) |
| `color.border.disabled` | Disabled controls |

## Text and icon

`color.text.*` and `color.icon.*` share intents: `heading` (text only), `body` (text), `caption` (text), `default` (icon), `placeholder`, `action`, `action-hover`, `on-action`, `on-action-hover`, `success`, `error`, `warning`, `information`, `disabled`.

## Pairing rules

- Text or icon on `color.surface.action` → `color.text.on-action` / `color.icon.on-action`.
- Text on `color.surface.error` → `color.text.error`. Same pattern for success, warning, information.
- Disabled surface → disabled text, disabled border, disabled icon. Don't mix.

## Do and don't

```css
/* Correct */
.banner--error { background-color: var(--color-surface-error); color: var(--color-text-error); border-color: var(--color-border-error); }

/* Wrong — skips the semantic layer, breaks dark mode and brand switching */
.banner--error { background-color: var(--alias-error-50); color: var(--brand-red-800); }
```

- Do not use color alone to show status. Add an icon and a text label.
- Do not use `color.text.placeholder` for labels or helper text. Use `color.text.caption`.
- Do not create one-off colors. Request a token.

## Accessibility

- Body text and icons need 4.5:1 contrast against their surface. Large text (24px+, or 18.66px+ bold) needs 3:1.
- Focus rings and input borders need 3:1 against adjacent colors (WCAG 1.4.11).
- Check every new pair in both Light and Dark before release.
