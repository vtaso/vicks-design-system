# Vick's Library — design system practice repo

Tokens exported from the Figma file **Vick's Library — Tokens and Variables**, built for three platforms, with CI guardrails for token linting and Code Connect.

**Start with [LEARN.md](LEARN.md).** It walks you through every check with hands-on labs.

## What's here

| Path | What it is |
| --- | --- |
| `tokens/` | W3C design-token JSON exported from Figma variables (Brand, Alias ×3 brands, Mapped light/dark, Responsive ×4, Alias-Platform ×4) |
| `scripts/build-tokens.mjs` | Style Dictionary → `build/web/*.css`, `build/android/DesignTokens.kt`, `build/ios/DesignTokens.swift` |
| `scripts/lint-token-names.mjs` | Token lint: kebab-case, layers, color categories, layering, descriptions, mode parity — with a baseline |
| `scripts/lint-hardcoded.mjs` | Rejects raw colors and sizes in React/CSS, Kotlin (Compose) and Swift (SwiftUI) |
| `scripts/check-code-connect.mjs` | Code-side contract: template props must exist on the component |
| `src/components/Button/` | React Button + `Button.figma.ts` Code Connect template (v2 format) |
| `android/`, `ios/` | Compose and SwiftUI Button using generated tokens |
| `guidelines/` | Design system guidelines in Markdown (works as Figma Make guidelines and AI context) |
| `figma/` | Tokens Page generator script and the plugin source |
| `.github/workflows/design-system-ci.yml` | Runs every check on each pull request |

## Commands

```bash
npm ci
npm run ci                 # everything below except Figma-side validation
npm run tokens:build       # BRAND=brand-b npm run tokens:build for another brand
npm run lint:token-names   # add -- --update-baseline after fixing violations
npm run lint:hardcoded
npm run lint:css
npm run typecheck
npm run connect:parse
npm run connect:contract
FIGMA_ACCESS_TOKEN=… npm run connect:validate   # Figma-side check, needs a token
```

## Turn on the guardrail in GitHub

1. Push this repo to GitHub. The workflow runs on every pull request.
2. **Settings → Secrets and variables → Actions → New repository secret:** `FIGMA_ACCESS_TOKEN` (Figma → Settings → Security → Personal access tokens, with Code Connect write and file read scopes). Without it, the Figma-side step is skipped.
3. **Settings → Branches → Add branch protection rule** for `main` → *Require status checks to pass* → select **Token linting layer** and **Code Connect checks**. Now a failing check blocks the merge.
