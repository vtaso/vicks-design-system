# Learn this part — DS Lead technical round

Two topics. Five short sessions. Everything runs in this repo, so you learn it by doing, not by watching.

## Stay in the lane

**Learn:**

1. **Code Connect guardrail in CI.** What each check catches, and why one command isn't enough.
2. **Token linting layer.** One naming and layering convention, enforced on the token source and on React, Kotlin and Swift code.

**Skip for this interview (rabbit holes):**

- Writing GitHub Actions from scratch beyond reading one workflow file
- Style Dictionary internals, custom formats, Tokens Studio plugin setup
- ESLint/Detekt/SwiftLint plugin authoring
- Figma REST API, webhooks, Variables API
- Monorepos, Changesets, semantic-release, npm publishing
- Storybook visual-regression setup
- Code Connect for every framework — know that one template format covers all of them now

If a tutorial goes deep into one of these, stop and come back here.

---

## What's true as of October 2026 (read this first)

Your two bullets are the right ideas. Two details changed, and knowing them makes you sound current:

**1. `npx figma connect parse` alone does not catch drift.**
Code Connect v2.0 (Aug 2026) replaced the React/Swift/Compose parsers with **template files** (`.figma.ts`). Templates are plain JavaScript that return a code string, so `parse` checks that files are found and readable. It doesn't check that the props still exist. I tested this in this repo: renaming `variant` in `Button.tsx` and leaving the template alone, `parse` still exits 0.

So the real guardrail is **four checks**:

| Check | Command in this repo | Catches |
| --- | --- | --- |
| Templates compile | `npm run typecheck` | Syntax errors, wrong Template API calls |
| Templates parse | `npm run connect:parse` (`--exit-on-unreadable-files`) | Files missing or unreadable, bad config |
| **Code-side contract** | `npm run connect:contract` | Engineer renames/removes a prop in code but not in the template |
| **Figma-side validation** | `npm run connect:validate` (`publish --dry-run`, needs `FIGMA_ACCESS_TOKEN`) | Designer renames a property in Figma (e.g. "Type" → "Variant") |

Any red check → the pull request can't merge (with branch protection on).

**2. "Eliminating hardcoded values" is two separate linters.**

- **Token lint** runs on the token source (`tokens/*.json`): names, categories, layering, descriptions, mode parity.
- **Hardcoded-value lint** runs on product code: no raw hex/px in React, no `Color(0x…)`/`16.dp` in Kotlin, no `Color(red:)`/`.padding(16)` in Swift. Stylelint does the same job for CSS.

Teams usually say "token linting" for both. Being able to split them is the senior signal.

---

## The mental model (draw this on the whiteboard)

```
Figma variables ──export──▶ tokens/*.json ──Style Dictionary──▶ CSS vars · Kotlin · Swift
        │                         │                                     │
        │                   TOKEN LINT                          HARDCODED LINT
        │              (names, layers, modes)               (no raw values in code)
        │
Figma components ◀──Code Connect template (.figma.ts)──▶ React / Compose / SwiftUI component
                  FIGMA-SIDE VALIDATE        CODE-SIDE CONTRACT
                                   ↓
                     GitHub Actions on every PR → red = blocked
```

One source, generated outputs, checks at every seam.

---

## Sessions (about 45 minutes each)

### Session 1 — Run it green (setup)

```bash
npm ci
npm run ci
```

Read the output top to bottom. Then open `.github/workflows/design-system-ci.yml` and match each step to a line of output.

✅ You can explain: what runs, in what order, and what a red X means for a PR.

### Session 2 — Break Code Connect on purpose

**Lab A (code-side drift):**

1. In `src/components/Button/Button.tsx`, rename `variant` to `kind` in `ButtonProps`.
2. Run `npm run connect:parse` → passes (this is the trap).
3. Run `npm run connect:contract` → fails: `template passes "variant" but ButtonProps has no "variant"`.
4. Fix it either way: rename back, or update `Button.figma.ts`. Run again.

**Lab B (template syntax):** add a stray `(` to `Button.figma.ts`. `npm run typecheck` fails. Undo.

**Lab C (read the template):** open `Button.figma.ts`. Find the Figma names (`"Type"`, `"Icon  Right Swap"`) and the code props (`variant`, `iconRight`). That mapping is the contract.

✅ You can explain: why parse isn't enough, and the difference between code-side and Figma-side drift.

### Session 3 — Token lint

1. Run `npm run lint:token-names`. You'll see 14 ⚠️ baseline warnings. Those are real issues from your Figma file (see `guidelines/audit.md`).
2. **Lab D:** in `tokens/color/light.json`, rename `"action-hover"` under `surface` to `"actionHover"`. Run again → ❌ T1 kebab-case, T6 because dark.json no longer matches, and T4 resurfaces as a *new* error because the renamed token isn't in the baseline. Undo.
3. **Lab E:** add `"brandPurple": { "$type": "color", "$value": "{brand.purple.500}" }` under `color.surface`. Run → ❌ T1 and T4 (skips the Alias layer). Undo.
4. Open `.token-lint-baseline.json`. This is how you add a linter to an existing system without breaking every build on day one.

✅ You can explain: the rules, why layering matters for multi-brand, and the baseline strategy.

### Session 4 — Hardcoded values across three platforms

1. **Lab F:** add `.x { color: #ec352f; padding: 12px; }` to `Button.css`. Run `npm run lint:hardcoded` and `npm run lint:css`. Both fail.
2. **Lab G:** add `val c = Color(0xffec352f)` to `android/Button.kt` and `.padding(16)` to `ios/Button.swift`. Run `npm run lint:hardcoded`. Both fail with the token to use instead.
3. Run `npm run tokens:build` and open `build/android/DesignTokens.kt` and `build/ios/DesignTokens.swift`. Same tokens, native syntax: `48.dp` on Android, `CGFloat(44)` on iOS.

✅ You can explain: one rule set, three languages, and where the replacement value comes from.

### Session 5 — Rehearse out loud

Say each 60-second answer below twice, once while drawing the mental model. Then answer the follow-ups without looking.

---

## Interview answers (60 seconds each)

**"How do you keep Figma and code in sync?"**

> "I treat it as a contract with checks on both sides. Each component has a Code Connect template that maps Figma properties to code props. On every pull request, CI checks that the templates compile, that they parse, and that every prop a template passes still exists on the component. That catches an engineer renaming a prop. A dry-run publish with a Figma token catches the other direction, a designer renaming a property. If any check fails, the PR is blocked. One thing I'd call out: since Code Connect v2 moved to template files, `figma connect parse` on its own doesn't catch drift anymore, so I add the contract check explicitly."

**"How do you stop hardcoded values across React, Kotlin and Swift?"**

> "Two layers. First, the tokens themselves: one JSON source exported from Figma, linted for naming, category, layering and mode parity. For example, a semantic color can only reference the brand layer, never a raw primitive, or brand switching breaks. Second, product code: a lint step that rejects raw hex and pixel values in React and CSS, `Color(0x…)` and literal dp in Compose, and raw colors and numbers in SwiftUI modifiers. Style Dictionary generates CSS variables, a Kotlin object and a Swift enum from the same tokens, so the fix is always 'use the generated token'."

**"How would you roll this out without blocking every team?"**

> "Baseline first. I run the linters in report-only mode, record existing violations as a baseline, and only fail on new ones. That keeps every team green on day one. Then I burn the baseline down with owners and dates, the same way I'd handle any migration. I'd also allow a disable comment with a required reason, and review those in the weekly triage so exceptions stay visible."

---

## Follow-ups they may ask

- **What if the linter blocks a real need?** That's signal the system is missing a token. The fix is a token request, not a disable comment. The exception path exists, but it's tracked.
- **Who owns the rules?** The DS team owns the rule set. Changes go through the same PR review as components. Engineering owns the CI plumbing.
- **What about false positives?** Scope the linter to product code (skip generated files and templates), keep the baseline, and allow line-level exceptions with a reason.
- **What tools would you use natively?** Stylelint (`declaration-strict-value`) and ESLint for web, Detekt or Android Lint custom rules for Kotlin, SwiftLint `custom_rules` for Swift. The single script here shows the idea in one place.
- **Where does the Figma token come from?** A repo secret (`FIGMA_ACCESS_TOKEN`). Figma recommends a plan access token for CI because it can last up to a year. Personal tokens max out at 90 days.
- **How do you measure success?** Baseline count trending to zero, number of components with Code Connect, PRs blocked by drift (should drop over time), and "Figma doesn't match production" support questions.

---

## Words to use naturally

**contract** · **drift** (code-side / Figma-side) · **single source of truth** · **semantic vs primitive tokens** · **layering** · **mode parity** · **baseline** · **branch protection** · **template file** · **dry run** · **generated, not hand-written**

## Your real example

Your own file gave you a story: "When I added a token linter to my library, it found 14 semantic tokens skipping the brand layer. They looked fine in Brand A and would have silently broken Brand B. I baselined them so builds stayed green and fixed them as a tracked burn-down." Use it.
