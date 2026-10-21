# Spacing and density

## Scale

Spacing comes from one scale (Brand collection): `0 · 1 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32`. Every gap, padding and margin is a step on this scale.

## Density by platform

The **Alias-Platform** collection sets touch-driven sizes per platform. Components use these instead of fixed numbers.

| Token | Web | iOS | Android | POS | Use for |
| --- | --- | --- | --- | --- | --- |
| `density.padding-touch` | 12 | 16 | 16 | 24 | Inner horizontal padding of controls |
| `density.height-button` | 36 | 44 | 48 | 64 | Minimum height of buttons and inputs |
| `density.gap-container` | 8 | 12 | 16 | 24 | Gap between items in a container |

## Rules

- **IMPORTANT:** Touch targets are at least 44pt on iOS and 48dp on Android. POS uses 64 because people tap fast, one-handed, sometimes with gloves.
- Do not shrink `density.height-button` to fit a layout. Change the layout.
- Use `density.gap-container` for gaps between sibling items. Use the scale for layout margins.
- Use 4 and 8 for tight internal spacing (icon to label). Use 16+ between sections.
