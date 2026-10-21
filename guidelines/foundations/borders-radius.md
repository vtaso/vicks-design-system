# Borders and corner radius

Both live in the **Alias** collection, so each brand can be sharper or softer without touching components.

## Border width

| Token | Brand A | Use for |
| --- | --- | --- |
| `alias.border-width.none` | 0 | No border |
| `alias.border-width.thin` | 1 | Default inputs, cards, dividers, outline buttons |
| `alias.border-width.medium` | 2 | Selected and focused states, focus ring |
| `alias.border-width.thick` | 4 | High-emphasis outlines |

## Corner radius

| Token | Brand A | Use for |
| --- | --- | --- |
| `alias.border-radius.none` | 0 | Tables, full-bleed areas |
| `alias.border-radius.xs` | 2 | Tags, small chips |
| `alias.border-radius.sm` | 4 | Inputs, fields, link focus outline |
| `alias.border-radius.md` | 8 | Buttons, cards |
| `alias.border-radius.lg` | 12 | Panels, modals |
| `alias.border-radius.xl` | 16 | Sheets, large containers |
| `alias.border-radius.full` | 32 | Pills, avatars, round icon buttons |

Brand B and Brand C use square corners (0) by design.

## Rules

- Nested corners: inner radius = outer radius − padding. If that goes below 0, use `none`.
- The focus ring uses `alias.border-width.medium` + `color.border.focus` and sits outside the element.
- Do not use border color alone for error. Pair `color.border.error` with an icon and message.
