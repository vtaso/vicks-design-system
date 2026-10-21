#!/usr/bin/env node
// Hardcoded-value check — one rule set across React (ts/tsx/css), Kotlin (Compose) and Swift (SwiftUI).
// Fails when product code uses a raw color or size instead of a generated token.
// Escape hatch (needs a reason in review):  // token-lint-disable-line <reason>
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SCAN = ['src', 'android', 'ios']
const SKIP = /(node_modules|build|\.figma\.(ts|js)$)/
const RULES = {
  web: [
    [/#[0-9a-fA-F]{3,8}\b/, 'raw hex color — use var(--color-…)'],
    [/\brgba?\(|\bhsla?\(/, 'raw rgb/hsl color — use var(--color-…)'],
    [/(?<![\w-])(?!0px)\d+(\.\d+)?px\b/, 'raw px value — use a density/alias/typography token'],
  ],
  kotlin: [
    [/Color\(0x[0-9a-fA-F]+\)/, 'raw Compose Color — use DesignTokens.color…'],
    [/\b\d+(\.\d+)?\.(dp|sp)\b/, 'raw dp/sp — use DesignTokens.density… / typography…'],
  ],
  swift: [
    [/Color\(\s*red:|UIColor\(\s*red:|Color\(hex:/, 'raw Swift color — use DesignTokens.color…'],
    [/\.(padding|cornerRadius|frame)\([^)]*\b\d+(\.\d+)?\b/, 'raw number in layout modifier — use DesignTokens.density…'],
    [/\.system\(size:\s*\d+/, 'raw font size — use DesignTokens.typography…'],
  ],
}
const kind = (f) => (/\.(tsx?|jsx?|css)$/.test(f) ? 'web' : f.endsWith('.kt') ? 'kotlin' : f.endsWith('.swift') ? 'swift' : null)

const files = []
for (const d of SCAN) {
  const abs = path.join(ROOT, d); if (!fs.existsSync(abs)) continue
  ;(function walk(p) { for (const e of fs.readdirSync(p, { withFileTypes: true })) { const q = path.join(p, e.name); if (SKIP.test(q)) continue; e.isDirectory() ? walk(q) : kind(q) && files.push(q) } })(abs)
}
let errors = 0
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes('token-lint-disable-line')) return
    const code = line.replace(/\/\/.*$|\/\*.*?\*\//g, '')
    for (const [re, msg] of RULES[kind(f)]) if (re.test(code)) { console.log(`❌ ${path.relative(ROOT, f)}:${i + 1}  ${msg}\n     ${line.trim()}`); errors++ }
  })
}
console.log(`\nHardcoded-value check: ${files.length} file(s) · ${errors} violation(s)`)
process.exit(errors ? 1 : 0)
