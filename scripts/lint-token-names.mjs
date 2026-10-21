#!/usr/bin/env node
// Token linting layer — enforces ONE naming convention and layering for every team.
// Runs on tokens/**/*.json (the single source React, Kotlin and Swift are generated from).
//
// Rules
//  T1 kebab-case: every path segment is lowercase kebab-case (or a number like 500).
//  T2 known layer: top level is one of brand · alias · color · typography · density.
//  T3 color category: color.<surface|border|text|icon>.<name>.
//  T4 layering: color.* may reference alias.* only; alias.* may reference brand.* only.
//               (Skipping a layer breaks brand switching — the brand mode never applies.)
//  T5 description: every color.* token explains when to use it.
//  T6 mode parity: every mode file in a folder (light/dark, brand-a/b/c, platforms) has the same token paths.
//
// Baseline: known violations live in .token-lint-baseline.json. They print as warnings so the
// build stays green while you burn them down. Anything NEW fails the build.
// Update the baseline on purpose only:  node scripts/lint-token-names.mjs --update-baseline
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIR = path.join(ROOT, 'tokens')
const BASELINE = path.join(ROOT, '.token-lint-baseline.json')
const LAYERS = ['brand', 'alias', 'color', 'typography', 'density']
const COLOR_CATS = ['surface', 'border', 'text', 'icon']
const KEBAB = /^([a-z0-9]+)(-[a-z0-9]+)*$/
const ALLOWED_REF = { color: ['alias'], alias: ['brand'], typography: ['brand', 'alias'], density: ['brand', 'alias'] }

const files = []
;(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : p.endsWith('.json') && files.push(p) } })(DIR)

function leaves(obj, prefix = [], out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue
    if (v && typeof v === 'object' && '$value' in v) out.push([[...prefix, k], v])
    else if (v && typeof v === 'object') leaves(v, [...prefix, k], out)
  }
  return out
}

const found = []
const add = (rule, file, token, msg) => found.push({ id: `${rule}:${path.relative(DIR, file)}:${token}`, rule, file: path.relative(ROOT, file), token, msg })
const pathsByFolder = {}

for (const f of files) {
  const tokens = leaves(JSON.parse(fs.readFileSync(f, 'utf8')))
  const folder = path.dirname(path.relative(DIR, f))
  ;(pathsByFolder[folder] ||= {})[path.basename(f)] = new Set(tokens.map(([p]) => p.join('.')))
  for (const [p, t] of tokens) {
    const name = p.join('.')
    const bad = p.find((seg) => !KEBAB.test(seg))
    if (bad) add('T1', f, name, `segment "${bad}" is not kebab-case`)
    if (!LAYERS.includes(p[0])) add('T2', f, name, `unknown layer "${p[0]}" (allowed: ${LAYERS.join(', ')})`)
    if (p[0] === 'color' && !COLOR_CATS.includes(p[1])) add('T3', f, name, `color category must be one of ${COLOR_CATS.join(', ')}`)
    const ref = typeof t.$value === 'string' && t.$value.match(/^\{([^.}]+)\./)
    if (ref && ALLOWED_REF[p[0]] && !ALLOWED_REF[p[0]].includes(ref[1]))
      add('T4', f, name, `${p[0]} token references ${ref[1]}.* (${t.$value}); must reference ${ALLOWED_REF[p[0]].join(' or ')}.*`)
    if (p[0] === 'color' && !t.$description) add('T5', f, name, 'missing $description')
  }
}
for (const [folder, modes] of Object.entries(pathsByFolder)) {
  const names = Object.keys(modes); if (names.length < 2) continue
  const all = new Set(names.flatMap((n) => [...modes[n]]))
  for (const tok of all) for (const n of names) if (!modes[n].has(tok)) add('T6', path.join(DIR, folder, n), tok, `missing in ${folder}/${n} but present in another mode`)
}

if (process.argv.includes('--update-baseline')) {
  fs.writeFileSync(BASELINE, JSON.stringify(found.map((f) => f.id).sort(), null, 2) + '\n')
  console.log(`Baseline updated with ${found.length} known violation(s).`)
  process.exit(0)
}
const baseline = new Set(fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : [])
const known = found.filter((f) => baseline.has(f.id))
const fresh = found.filter((f) => !baseline.has(f.id))
for (const f of known) console.log(`⚠️  [${f.rule}] ${f.file} → ${f.token}: ${f.msg} (baseline)`)
for (const f of fresh) console.log(`❌ [${f.rule}] ${f.file} → ${f.token}: ${f.msg}`)
const fixed = [...baseline].filter((id) => !found.some((f) => f.id === id))
if (fixed.length) console.log(`🎉 ${fixed.length} baseline violation(s) fixed — run with --update-baseline to lock in the win.`)
console.log(`\nToken lint: ${files.length} files · ${fresh.length} new error(s) · ${known.length} baseline warning(s)`)
process.exit(fresh.length ? 1 : 0)
