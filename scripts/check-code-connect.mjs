#!/usr/bin/env node
// Code Connect contract check (code side).
// Fails the build when a Code Connect template passes a prop the component no longer has,
// or when a required component prop is never mapped from Figma.
//
// Why this exists: Code Connect v2 templates (.figma.ts) are plain template strings.
// `figma connect parse` and TypeScript can't see that `variant` on <Button> must match ButtonProps.
// This script reads both files and compares them.
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'figma.config.json'), 'utf8'))
const globs = config.codeConnect?.include ?? ['src/**/*.figma.ts']

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.figma\.(ts|js)$/.test(e.name)) out.push(p)
  }
  return out
}
const templates = walk(path.join(ROOT, globs[0].split('/**')[0] || 'src'))

function propsOf(sourceFile, componentName) {
  const src = ts.createSourceFile(sourceFile, fs.readFileSync(sourceFile, 'utf8'), ts.ScriptTarget.Latest, true)
  const wanted = [`${componentName}Props`]
  const props = new Map() // name -> required?
  src.forEachChild(function visit(node) {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && wanted.includes(node.name.text)) {
      const members = ts.isInterfaceDeclaration(node) ? node.members : (node.type.members || [])
      for (const m of members) if (m.name) props.set(m.name.getText(src), !m.questionToken)
    }
    ts.forEachChild(node, visit)
  })
  return props
}

let errors = 0, warnings = 0
for (const file of templates) {
  const text = fs.readFileSync(file, 'utf8')
  const rel = path.relative(ROOT, file)
  const component = (text.match(/^\/\/\s*component=(\S+)/m) || [])[1]
  const imp = text.match(new RegExp(`import \\{[^}]*\\b${component}\\b[^}]*\\} from ['"](.+?)['"]`))
  if (!component || !imp) { console.log(`⚠️  ${rel}: no "// component=" comment or import — skipped`); warnings++; continue }
  const base = path.resolve(path.dirname(file), imp[1])
  const source = ['.tsx', '.ts', '.jsx', '.js'].map(x => base + x).find(fs.existsSync)
  if (!source) { console.log(`❌ ${rel}: component source for ${component} not found at ${imp[1]}`); errors++; continue }
  const props = propsOf(source, component)
  if (!props.size) { console.log(`⚠️  ${rel}: no ${component}Props interface found in ${path.relative(ROOT, source)}`); warnings++; continue }

  const used = new Set([...text.matchAll(/renderProp\(\s*["'`]([\w-]+)["'`]/g)].map(m => m[1]))
  for (const m of text.matchAll(new RegExp(`<${component}\\b([^>]*)`, 'g')))
    for (const a of m[1].matchAll(/\s([a-zA-Z][\w-]*)=/g)) used.add(a[1])

  for (const p of used) {
    if (!props.has(p)) { console.log(`❌ ${rel}: template passes "${p}" but ${component}Props has no "${p}". Rename it in the template or restore the prop.`); errors++ }
  }
  for (const [p, required] of props) {
    if (required && !used.has(p)) { console.log(`❌ ${rel}: required prop "${p}" on ${component} is never mapped from Figma.`); errors++ }
  }
  if (!errors) console.log(`✅ ${rel} ↔ ${path.relative(ROOT, source)}: ${used.size} props in sync`)
}
console.log(`\nCode Connect contract: ${templates.length} template(s), ${errors} error(s), ${warnings} warning(s)`)
process.exit(errors ? 1 : 0)
