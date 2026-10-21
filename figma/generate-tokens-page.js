// Tokens documentation page generator — rebuilds the "Tokens" page from live variables.
// Safe to re-run: it clears the page and regenerates. New variables, groups and modes appear automatically.
const CONFIG = {
  pageName: 'Tokens',
  include: [ // collection name → intro shown on the page (order = page order)
    ['Mapped', 'Semantic color tokens. Components use these — never Brand or Alias colors directly. Light/Dark are modes.'],
    ['Alias', 'Brand layer. Each brand mode points to Brand primitives. Mapped tokens reference these.'],
    ['Responsive', 'Type scale per platform mode. Bind text styles to these so one style adapts to Desktop, Android, iOS and POS.'],
    ['Alias-Platform', 'Density per platform — touch padding, button height and container gaps.'],
  ],
  darkModes: ['Dark'],
  previewBrandMode: 'Brand A', // Alias mode used to resolve Mapped swatches
};
const h = x => ({ r: parseInt(x.slice(1, 3), 16) / 255, g: parseInt(x.slice(3, 5), 16) / 255, b: parseInt(x.slice(5, 7), 16) / 255 });
const C = { ink: h('#1E1E1E'), sub: h('#6B6B6B'), line: h('#E3E3E3'), head: h('#0E0D0D'), white: h('#FFFFFF'), pill: h('#F2F2F2'), group: h('#FAFAFA') };
const FONTS = [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Medium' }, { family: 'Inter', style: 'Semi Bold' }, { family: 'Inter', style: 'Bold' }];
await Promise.all(FONTS.map(f => figma.loadFontAsync(f)));
let MONO = { family: 'Roboto Mono', style: 'Regular' };
try { await figma.loadFontAsync(MONO); } catch (e) { MONO = FONTS[0]; }

const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v => [v.id, v]));
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const colByName = Object.fromEntries(cols.map(c => [c.name.trim(), c]));
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const fmt = (v, modeId) => {
  const x = v.valuesByMode[modeId];
  if (x && typeof x === 'object' && x.type === 'VARIABLE_ALIAS') return byId[x.id] ? byId[x.id].name.toLowerCase() : 'alias';
  if (typeof x === 'number') return String(Math.round(x * 100) / 100);
  if (x && typeof x === 'object' && 'r' in x) return hex(x);
  return String(x);
};

// ---- page ----
let page = figma.root.children.find(p => p.name === CONFIG.pageName);
if (!page) { page = figma.createPage(); page.name = CONFIG.pageName; figma.root.insertChild(Math.min(2, figma.root.children.length - 1), page); }
await figma.setCurrentPageAsync(page);
for (const n of [...page.children]) n.remove();

const decode = s => (s || '').replace(/&#39;/g, '’').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function text(str, o = {}) {
  const t = figma.createText();
  t.fontName = o.mono ? MONO : FONTS[o.w || 0];
  t.fontSize = o.size || 13; t.characters = str || ' ';
  t.fills = [{ type: 'SOLID', color: o.color || C.ink }];
  if (o.width) { t.textAutoResize = 'HEIGHT'; t.resize(o.width, t.height); }
  return t;
}
function al(dir, o = {}) {
  const f = figma.createAutoLayout(dir, { name: o.name || 'frame', itemSpacing: o.gap || 0 });
  f.paddingLeft = f.paddingRight = o.px ?? 0; f.paddingTop = f.paddingBottom = o.py ?? 0;
  f.fills = o.fill ? [{ type: 'SOLID', color: o.fill }] : [];
  if (o.align) f.counterAxisAlignItems = o.align;
  return f;
}
function bindFill(node, v) { node.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)]; }
function fixedW(node, w) { node.resize(w, node.height); node.layoutSizingHorizontal = 'FIXED'; }

const W = 1600, TOKW = 320, DESCW = 460;
const root = al('VERTICAL', { name: 'Tokens Documentation', fill: C.white });
page.appendChild(root); root.x = 0; root.y = 0; fixedW(root, W); root.layoutSizingVertical = 'HUG';
// Resolve Mapped → Alias with a chosen brand mode
const alias = colByName['Alias'];
if (alias) { const m = alias.modes.find(m => m.name === CONFIG.previewBrandMode) || alias.modes[0]; root.setExplicitVariableModeForCollection(alias, m.modeId); }

// header
const hdr = al('VERTICAL', { name: 'Header', fill: C.head, px: 56, py: 56, gap: 12 });
root.appendChild(hdr); hdr.layoutSizingHorizontal = 'FILL';
hdr.appendChild(text("Vick's Library", { size: 14, w: 2, color: C.white }));
hdr.appendChild(text('Tokens', { size: 48, w: 1, color: C.white }));
const stamp = new Date().toISOString().slice(0, 10);
hdr.appendChild(text(`Generated from live Figma variables · Brand preview: ${CONFIG.previewBrandMode} · Last refresh ${stamp}. Re-run the "Tokens Page" plugin to update — do not edit this page by hand.`, { size: 14, color: h('#BDBDBD'), width: 1200 }));

let rows = 0;
for (const [name, intro] of CONFIG.include) {
  const col = colByName[name]; if (!col) continue;
  const sec = al('VERTICAL', { name: name, px: 0, py: 0 });
  root.appendChild(sec); sec.layoutSizingHorizontal = 'FILL';
  const sh = al('VERTICAL', { name: 'Collection header', px: 24, py: 28, gap: 6 });
  sec.appendChild(sh); sh.layoutSizingHorizontal = 'FILL';
  sh.appendChild(text(name + ' collection', { size: 22, w: 2 }));
  sh.appendChild(text(intro + `  ·  Modes: ${col.modes.map(m => m.name).join(', ')}`, { size: 13, color: C.sub, width: 1400 }));
  const modeW = Math.floor((W - TOKW - DESCW) / col.modes.length);
  // column header row
  const ch = al('HORIZONTAL', { name: 'Column header' }); sec.appendChild(ch); ch.layoutSizingHorizontal = 'FILL';
  const hcell = (label, w, dark) => { const c = al('HORIZONTAL', { px: 12, py: 10, fill: dark ? C.head : C.white, align: 'CENTER' }); ch.appendChild(c); fixedW(c, w); c.strokes = [{ type: 'SOLID', color: C.line }]; c.strokeBottomWeight = 1; c.strokeTopWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0; c.appendChild(text(label, { size: 12, w: 2, color: dark ? C.white : C.ink })); };
  hcell('Token', TOKW); col.modes.forEach(m => hcell(m.name, modeW, CONFIG.darkModes.includes(m.name))); hcell('Description', DESCW);
  // group variables by path prefix
  const vars = col.variableIds.map(id => byId[id]).filter(Boolean);
  const groups = new Map();
  for (const v of vars) { const parts = v.name.split('/'); const g = parts.length > 1 ? parts.slice(0, -1).join(' / ') : 'General'; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(v); }
  for (const [g, list] of groups) {
    const gr = al('HORIZONTAL', { name: 'Group ' + g, px: 12, py: 10, fill: C.group }); sec.appendChild(gr); gr.layoutSizingHorizontal = 'FILL';
    gr.appendChild(text(g, { size: 13, w: 2 }));
    for (const v of list) {
      const row = al('HORIZONTAL', { name: v.name }); sec.appendChild(row); row.layoutSizingHorizontal = 'FILL';
      row.strokes = [{ type: 'SOLID', color: C.line }]; row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0; row.strokeBottomWeight = 1;
      const tc = al('HORIZONTAL', { px: 12, py: 10, align: 'CENTER' }); row.appendChild(tc); fixedW(tc, TOKW); tc.layoutSizingVertical = 'FILL';
      const pill = al('HORIZONTAL', { px: 8, py: 3, fill: C.pill }); pill.cornerRadius = 4; tc.appendChild(pill);
      pill.appendChild(text(v.name.split('/').pop(), { size: 11, mono: true }));
      for (const m of col.modes) {
        const dark = CONFIG.darkModes.includes(m.name);
        const mc = al('HORIZONTAL', { px: 12, py: 10, gap: 8, align: 'CENTER', fill: dark ? C.head : null }); row.appendChild(mc); fixedW(mc, modeW); mc.layoutSizingVertical = 'FILL';
        mc.setExplicitVariableModeForCollection(col, m.modeId);
        if (v.resolvedType === 'COLOR') { const sw = figma.createRectangle(); sw.resize(16, 16); sw.cornerRadius = 3; bindFill(sw, v); sw.strokes = [{ type: 'SOLID', color: dark ? h('#444444') : C.line }]; mc.appendChild(sw); }
        mc.appendChild(text(fmt(v, m.modeId), { size: 12, color: dark ? C.white : C.ink }));
      }
      const dc = al('HORIZONTAL', { px: 12, py: 10 }); row.appendChild(dc); fixedW(dc, DESCW); dc.layoutSizingVertical = 'FILL';
      dc.appendChild(text(decode(v.description) || '—', { size: 12, color: C.sub, width: DESCW - 24 }));
      rows++;
    }
  }
  const gap = figma.createFrame(); gap.name = 'spacer'; gap.fills = []; sec.appendChild(gap); gap.resize(10, 40); gap.layoutSizingHorizontal = 'FILL';
}
figma.viewport.scrollAndZoomIntoView([root]);
return { page: page.id, root: root.id, rows };
