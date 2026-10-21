// Tokens Page — rebuilds a documentation page from the file's live variables.
// Re-run any time variables change: new tokens, groups, modes and collections show up automatically.

const PANEL_WIDTH = 300

type Settings = { pageName: string; include: string[]; darkModes: string; previewMode: string }
type UiMessage =
  | { type: 'resize'; height: number }
  | { type: 'ready' }
  | { type: 'run'; settings: Settings }

const INTROS: { [k: string]: string } = {
  Mapped: 'Semantic color tokens. Components use these — never Brand or Alias colors directly. Light/Dark are modes.',
  Alias: 'Brand layer. Each brand mode points to Brand primitives. Mapped tokens reference these.',
  Responsive: 'Type scale per platform mode. Bind text styles to these so one style adapts to Desktop, Android, iOS and POS.',
  'Alias-Platform': 'Density per platform — touch padding, button height and container gaps.',
  Brand: 'Primitive values. Raw palette and scale — referenced by Alias, never used directly in components.',
}
const DEFAULTS: Settings = { pageName: 'Tokens', include: ['Mapped', 'Alias', 'Responsive', 'Alias-Platform'], darkModes: 'Dark', previewMode: 'Brand A' }
const KEY = 'tokens-page-settings-v1'

const hx = (x: string): RGB => ({ r: parseInt(x.slice(1, 3), 16) / 255, g: parseInt(x.slice(3, 5), 16) / 255, b: parseInt(x.slice(5, 7), 16) / 255 })
const C = { ink: hx('#1E1E1E'), sub: hx('#6B6B6B'), line: hx('#E3E3E3'), head: hx('#0E0D0D'), white: hx('#FFFFFF'), pill: hx('#F2F2F2'), group: hx('#FAFAFA'), muted: hx('#BDBDBD'), swLine: hx('#444444') }
const FONTS: FontName[] = [
  { family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Medium' },
  { family: 'Inter', style: 'Semi Bold' }, { family: 'Inter', style: 'Bold' },
]
let MONO: FontName = { family: 'Roboto Mono', style: 'Regular' }

function readSettings(): Settings {
  try {
    const raw = figma.root.getPluginData(KEY)
    if (raw) return Object.assign({}, DEFAULTS, JSON.parse(raw))
  } catch (_e) { /* ignore old or broken data */ }
  return DEFAULTS
}

const decode = (s: string) => (s || '').replace(/&#39;/g, '’').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
function text(str: string, o: { size?: number; w?: number; color?: RGB; width?: number; mono?: boolean } = {}): TextNode {
  const t = figma.createText()
  t.fontName = o.mono ? MONO : FONTS[o.w || 0]
  t.fontSize = o.size || 13
  t.characters = str || ' '
  t.fills = [{ type: 'SOLID', color: o.color || C.ink }]
  if (o.width) { t.textAutoResize = 'HEIGHT'; t.resize(o.width, t.height) }
  return t
}
function al(dir: 'HORIZONTAL' | 'VERTICAL', o: { name?: string; gap?: number; px?: number; py?: number; fill?: RGB; center?: boolean } = {}): FrameNode {
  const f = figma.createFrame()
  f.name = o.name || 'frame'
  f.layoutMode = dir
  f.primaryAxisSizingMode = 'AUTO'
  f.counterAxisSizingMode = 'AUTO'
  f.itemSpacing = o.gap || 0
  f.paddingLeft = f.paddingRight = o.px || 0
  f.paddingTop = f.paddingBottom = o.py || 0
  f.fills = o.fill ? [{ type: 'SOLID', color: o.fill }] : []
  f.clipsContent = false
  if (o.center) f.counterAxisAlignItems = 'CENTER'
  return f
}
function fixedW(node: FrameNode, w: number) { node.resize(w, node.height); node.layoutSizingHorizontal = 'FIXED' }
function bottomLine(node: FrameNode) {
  node.strokes = [{ type: 'SOLID', color: C.line }]
  node.strokeTopWeight = 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0; node.strokeBottomWeight = 1
}

async function build(s: Settings): Promise<{ rows: number; page: string }> {
  await Promise.all(FONTS.map(f => figma.loadFontAsync(f)))
  try { await figma.loadFontAsync(MONO) } catch (_e) { MONO = FONTS[0] }

  const all = await figma.variables.getLocalVariablesAsync()
  const byId: { [id: string]: Variable } = {}
  for (const v of all) byId[v.id] = v
  const cols = await figma.variables.getLocalVariableCollectionsAsync()
  const colByName: { [n: string]: VariableCollection } = {}
  for (const c of cols) colByName[c.name.trim()] = c
  const darkModes = s.darkModes.split(',').map(x => x.trim()).filter(Boolean)

  const hex = (c: RGB) => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
  const fmt = (v: Variable, modeId: string): string => {
    const x = v.valuesByMode[modeId] as VariableValue
    if (x && typeof x === 'object' && 'type' in x && x.type === 'VARIABLE_ALIAS') return byId[x.id] ? byId[x.id].name.toLowerCase() : 'alias'
    if (typeof x === 'number') return String(Math.round(x * 100) / 100)
    if (x && typeof x === 'object' && 'r' in x) return hex(x as RGB)
    return String(x)
  }

  let page = figma.root.children.find(p => p.name === s.pageName) as PageNode | undefined
  if (!page) {
    page = figma.createPage(); page.name = s.pageName
    figma.root.insertChild(Math.min(2, figma.root.children.length - 1), page)
  }
  await figma.setCurrentPageAsync(page)
  for (const n of [...page.children]) n.remove()

  const W = 1600, TOKW = 320, DESCW = 460
  const root = al('VERTICAL', { name: 'Tokens Documentation', fill: C.white })
  page.appendChild(root); root.x = 0; root.y = 0
  fixedW(root, W); root.layoutSizingVertical = 'HUG'

  // Preview mode for any collection that has it (e.g. "Brand A" on Alias) so Mapped swatches resolve
  for (const c of cols) {
    const m = c.modes.find(m => m.name === s.previewMode)
    if (m) root.setExplicitVariableModeForCollection(c, m.modeId)
  }

  const hdr = al('VERTICAL', { name: 'Header', fill: C.head, px: 56, py: 56, gap: 12 })
  root.appendChild(hdr); hdr.layoutSizingHorizontal = 'FILL'
  hdr.appendChild(text(figma.root.name, { size: 14, w: 2, color: C.white }))
  hdr.appendChild(text('Tokens', { size: 48, w: 1, color: C.white }))
  const stamp = new Date().toISOString().slice(0, 10)
  hdr.appendChild(text(`Generated from live Figma variables · Preview mode: ${s.previewMode} · Last refresh ${stamp}. Re-run the "Tokens Page" plugin to update — do not edit this page by hand.`, { size: 14, color: C.muted, width: 1200 }))

  let rows = 0
  for (const name of s.include) {
    const col = colByName[name]
    if (!col) continue
    figma.ui.postMessage({ type: 'status', text: `Building ${name}…` })
    const sec = al('VERTICAL', { name })
    root.appendChild(sec); sec.layoutSizingHorizontal = 'FILL'
    const sh = al('VERTICAL', { name: 'Collection header', px: 24, py: 28, gap: 6 })
    sec.appendChild(sh); sh.layoutSizingHorizontal = 'FILL'
    sh.appendChild(text(name + ' collection', { size: 22, w: 2 }))
    sh.appendChild(text((INTROS[name] || `Tokens from the ${name} collection.`) + `  ·  Modes: ${col.modes.map(m => m.name).join(', ')}`, { size: 13, color: C.sub, width: 1400 }))

    const modeW = Math.floor((W - TOKW - DESCW) / col.modes.length)
    const ch = al('HORIZONTAL', { name: 'Column header' }); sec.appendChild(ch); ch.layoutSizingHorizontal = 'FILL'
    const hcell = (label: string, w: number, dark: boolean) => {
      const c = al('HORIZONTAL', { px: 12, py: 10, fill: dark ? C.head : C.white, center: true })
      ch.appendChild(c); fixedW(c, w); bottomLine(c)
      c.appendChild(text(label, { size: 12, w: 2, color: dark ? C.white : C.ink }))
    }
    hcell('Token', TOKW, false)
    for (const m of col.modes) hcell(m.name, modeW, darkModes.indexOf(m.name) >= 0)
    hcell('Description', DESCW, false)

    const groups = new Map<string, Variable[]>()
    for (const id of col.variableIds) {
      const v = byId[id]; if (!v) continue
      const parts = v.name.split('/')
      const g = parts.length > 1 ? parts.slice(0, -1).join(' / ') : 'General'
      if (!groups.has(g)) groups.set(g, [])
      groups.get(g)!.push(v)
    }
    for (const [g, list] of groups) {
      const gr = al('HORIZONTAL', { name: 'Group ' + g, px: 12, py: 10, fill: C.group })
      sec.appendChild(gr); gr.layoutSizingHorizontal = 'FILL'
      gr.appendChild(text(g, { size: 13, w: 2 }))
      for (const v of list) {
        const row = al('HORIZONTAL', { name: v.name }); sec.appendChild(row); row.layoutSizingHorizontal = 'FILL'; bottomLine(row)
        const tc = al('HORIZONTAL', { px: 12, py: 10, center: true }); row.appendChild(tc); fixedW(tc, TOKW); tc.layoutSizingVertical = 'FILL'
        const pill = al('HORIZONTAL', { px: 8, py: 3, fill: C.pill }); pill.cornerRadius = 4; tc.appendChild(pill)
        pill.appendChild(text(v.name.split('/').pop() || v.name, { size: 11, mono: true }))
        for (const m of col.modes) {
          const dark = darkModes.indexOf(m.name) >= 0
          const mc = al('HORIZONTAL', { px: 12, py: 10, gap: 8, center: true, fill: dark ? C.head : undefined })
          row.appendChild(mc); fixedW(mc, modeW); mc.layoutSizingVertical = 'FILL'
          mc.setExplicitVariableModeForCollection(col, m.modeId)
          if (v.resolvedType === 'COLOR') {
            const sw = figma.createRectangle(); sw.resize(16, 16); sw.cornerRadius = 3
            sw.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)]
            sw.strokes = [{ type: 'SOLID', color: dark ? C.swLine : C.line }]
            mc.appendChild(sw)
          }
          mc.appendChild(text(fmt(v, m.modeId), { size: 12, color: dark ? C.white : C.ink }))
        }
        const dc = al('HORIZONTAL', { px: 12, py: 10 }); row.appendChild(dc); fixedW(dc, DESCW); dc.layoutSizingVertical = 'FILL'
        dc.appendChild(text(decode(v.description) || '—', { size: 12, color: C.sub, width: DESCW - 24 }))
        rows++
      }
    }
    const gap = figma.createFrame(); gap.name = 'spacer'; gap.fills = []; sec.appendChild(gap); gap.resize(10, 40); gap.layoutSizingHorizontal = 'FILL'
  }
  root.setRelaunchData({ edit: 'Rebuild this page from live variables' })
  figma.viewport.scrollAndZoomIntoView([root])
  return { rows, page: page.name }
}

figma.showUI(__html__, { width: PANEL_WIDTH, height: 360 })
figma.root.setRelaunchData({ open: 'Rebuild the Tokens documentation page' })

figma.ui.onmessage = async (message: UiMessage) => {
  if (message.type === 'resize') {
    figma.ui.resize(PANEL_WIDTH, Math.max(120, Math.min(900, Math.round(message.height))))
    return
  }
  if (message.type === 'ready') {
    const cols = await figma.variables.getLocalVariableCollectionsAsync()
    figma.ui.postMessage({ type: 'init', collections: cols.map(c => ({ name: c.name.trim(), count: c.variableIds.length })), settings: readSettings() })
    return
  }
  if (message.type === 'run') {
    const s = message.settings
    if (!s.pageName.trim()) { figma.ui.postMessage({ type: 'error', text: 'Add a page name.' }); return }
    if (!s.include.length) { figma.ui.postMessage({ type: 'error', text: 'Pick at least one collection.' }); return }
    try {
      figma.root.setPluginData(KEY, JSON.stringify(s))
      const r = await build(s)
      figma.ui.postMessage({ type: 'done', text: `Done — ${r.rows} tokens on "${r.page}".` })
    } catch (e) {
      figma.ui.postMessage({ type: 'error', text: 'Could not build the page: ' + String(e) })
    }
  }
}
