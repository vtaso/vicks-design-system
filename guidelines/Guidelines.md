# Vick's Library — Design System Guidelines

**MUST READ before designing or writing any UI code.**

Vick's Library is a multi-brand, multi-platform design system. One set of Figma variables feeds React (web), Jetpack Compose (Android), SwiftUI (iOS) and POS. Every visual decision is a token. Every component is defined once and connected to code through Code Connect.

## Reading order

1. [setup.md](setup.md) — how tokens get into code, themes and modes.
2. [tokens.md](tokens.md) — the token layers and the one rule that matters most.
3. Foundations, read the file for what you're touching:
   - [foundations/color.md](foundations/color.md)
   - [foundations/typography.md](foundations/typography.md)
   - [foundations/spacing-density.md](foundations/spacing-density.md)
   - [foundations/borders-radius.md](foundations/borders-radius.md)
4. [components/overview-components.md](components/overview-components.md), then the component file you need.

## Rules

- **IMPORTANT:** Use Mapped (semantic) tokens in components and screens: `color.surface.*`, `color.border.*`, `color.text.*`, `color.icon.*`. Never use Brand or Alias colors directly.
- **IMPORTANT:** Never hardcode a hex, rgb, px, dp, sp or pt value. If a token doesn't exist, ask for one. Don't invent a value.
- Use an existing component before composing a new one. Compose from components before creating new primitives.
- Pair surfaces with their "on" tokens: text on `color.surface.action` is `color.text.on-action`.
- Color is never the only signal. Status always has an icon and text too.
- Every interactive element shows `color.border.focus` on keyboard focus.
- Pick the platform mode (Desktop, Android, iOS, POS) for type and density. Don't resize by hand.

## Modes

| Collection | Modes | What switches |
| --- | --- | --- |
| Alias | Brand A · Brand B · Brand C | Brand palette, font families, radius, border width |
| Mapped | Light · Dark | Every semantic color |
| Responsive | Desktop · Mobile Android · Mobile iOS · POS | Type scale |
| Alias-Platform | Web · iOS · Android · POS | Touch padding, button height, container gap |

## Source of truth

- Figma file: Vick's Library — Tokens and Variables (Tokens page is generated; don't edit by hand).
- Code: `tokens/*.json` (exported from Figma) → `npm run tokens:build`.
- Checks: token lint, hardcoded-value lint and Code Connect checks run on every pull request.
