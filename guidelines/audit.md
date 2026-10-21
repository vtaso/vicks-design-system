# Audit — what the checks found in Vick's Library

Found while building the Tokens page, the guideline files and the CI checks. Nothing here was changed in Figma. These are suggestions for you to decide on, and each one is a real example you can use in an interview.

## Token layering (token lint rule T4) — 14 tokens

These Mapped tokens point straight at Brand primitives and skip Alias, so switching to Brand B or C won't change them:

- Light: `surface.page`, `surface.action-hover`, `surface.action-hover-light`, `border.action-hover`, `text.action-hover`
- Dark: `surface.action-hover`, `surface.action-hover-light`, `border.action`, `border.action-hover`, `border.success`, `border.focus`, `text.heading`, `text.disabled`, `icon.disabled`

Fix: repoint each one to the matching Alias token (for example `Purple/800` → `Primary/800`, `Gray/100` → `Neutral/100`, `Foundation/White` → `Foundations/White`). Then run `npm run lint:token-names -- --update-baseline` to lock in the win.

## Components using non-semantic tokens

- Label: required asterisk uses `Error/600` (Alias) → should be `Text/error`.
- Field: uses `Error/500` and `Error/600` directly → `Border/error`, `Text/error`.
- Menu, Link, Breadcrumb: use `Neutral/200` → `Border/default` (or a new `Border/subtle`).

## Variable data

- `Font weights/*` in Alias hold font family names (Inter, Roboto…) instead of weights. Replace with numbers or remove (Responsive already has numeric weights).
- `Font Family/*` primitives in Brand hold the placeholder "String value".
- Brand B and C hardcode `0` for radius and border width instead of referencing `Scale/0`.
- All Mapped variables use "All scopes". Scope them (Fill for surfaces, Stroke for borders, Text fill for text) so the picker only offers the right tokens.
- Apostrophes in descriptions get stored as `&#39;` by Figma. Avoid apostrophes in variable descriptions, or decode them on export (the Tokens Page plugin already does).

## Component property names (Code Connect hygiene)

- Button: `Icon Left swap` vs `Icon  Right Swap` — different casing and a double space.
- Input: ` Control Hint copy` has a leading space.
- Status values differ: Button `default/hover/focus/disabled`, Field `Default/…`, Link/Breadcrumb `disable`.
- Menu item set is named `.menu item` (hidden, lowercase); others are Title Case.

Fix names before connecting more components. Code Connect templates use exact Figma names, so every rename later becomes a broken mapping.

## Gaps

- No semantic spacing tokens yet (only the Brand scale and three density tokens).
- Dropdown and List item have no states.
- Only Button is connected through Code Connect.
