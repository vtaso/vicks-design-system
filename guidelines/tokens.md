# Tokens

## The layers

```
Brand (primitives)  →  Alias (brand modes)  →  Mapped (semantic, light/dark)  →  Components
brand.purple.500       alias.primary.500       color.surface.action             Button background
```

| Layer | Collection | Code prefix | Who uses it |
| --- | --- | --- | --- |
| Primitive | Brand | `brand.*` | Alias only |
| Brand | Alias | `alias.*` | Mapped only (plus border width, radius, font family in components) |
| Semantic | Mapped | `color.*` | Components and screens |
| Type scale | Responsive | `typography.*` | Text styles |
| Density | Alias-Platform | `density.*` | Component sizing per platform |

**IMPORTANT:** Each layer references only the layer directly below it. If a Mapped token points straight at a Brand color, switching brand won't change it. The token lint (rule T4) catches this.

## Naming

- Path segments are lowercase kebab-case: `color.surface.action-hover-light`.
- Mapped colors follow `color.<category>.<intent>[-<state>]`.
  - Categories: `surface`, `border`, `text`, `icon`.
  - Intents: `default`, `action`, `success`, `error`, `warning`, `information`, `disabled`, `focus`, `placeholder`, `heading`, `body`, `caption`.
  - States: `-hover`, `-light`, `-secondary`.
  - Pairing: `on-action` means "sits on the action surface".
- Name by intent, never by appearance. `color.surface.error`, not `color.red-bg`.

## Adding a token

1. Check that an existing token doesn't already cover the intent.
2. Add it in Figma in the right collection, with a value for every mode and a description.
3. Reference the layer below it. Never hardcode.
4. Re-run the Tokens Page plugin, export, and open a pull request.
