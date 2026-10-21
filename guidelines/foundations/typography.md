# Typography

Type sizes live in the **Responsive** collection, with one mode per platform: Desktop, Mobile Android, Mobile iOS, POS. Set the platform mode on the frame; every text style bound to these variables resizes on its own.

**IMPORTANT:** Always use a type role. Never set `font-size` or `line-height` directly.

## Roles

| Role | Desktop size / line | Use for |
| --- | --- | --- |
| H1 | 61 / 72 | Page title, one per screen |
| H2 | 49 / 60 | Major section |
| H3 | 39 / 48 | Section |
| H4 | 31 / 36 | Sub-section, card title on large layouts |
| H5 | 25 / 32 | Card and dialog titles |
| H6 | 20 / 24 | Small headings, table group titles |
| Paragraph Large | 20 / 24 | Intro and lead text |
| Paragraph Medium | 16 / 20 | Default body, button and input text |
| Paragraph Small | 13 / 16 | Dense tables, secondary details |
| Caption | 10 / 12 | Captions and metadata only |

POS steps every role up so text reads at arm's length on a counter display. Mobile steps headings down one size.

Each role also has `paragraph-spacing`, `font-weight` (H1–H2 700, H3–H6 600, paragraphs 400) and `letter-spacing` (tight on large headings, slightly open on Caption).

## Font family

`alias.font-family.heading` and `alias.font-family.body` switch per brand (Brand A: Inter / Roboto · Brand B: Roboto / Inter · Brand C: Arial / Aptos).

## Rules

- Use Paragraph Medium as the default text size in components.
- Do not use Caption for anything a user must read to complete a task.
- Do not skip heading levels for visual size. Pick the level for structure, then the role follows.
- Text color comes from `color.text.*`, never from the type token.

```css
/* Correct */
.card__title { font-size: var(--typography-h5-font-size); line-height: var(--typography-h5-line-height); font-weight: var(--typography-h5-font-weight); }

/* Wrong */
.card__title { font-size: 25px; line-height: 32px; font-weight: 600; }
```
