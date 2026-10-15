// Shelf Pin Studio v1. Pure geometry; all dimensions are millimeters.
export const VERSION = 1;
export const STORAGE_KEY = 'woodcuttool.shelf-pin.v1';
export const SOURCES = [
  { title: 'Kreg KMA3232: 32 mm pitch, 37 mm fence setback and matching pins', url: 'https://www.kregtool.com/shop/cabinet-solutions/cabinet-drawer-shelf-jigs/shelf-pin-jig-5-mm/KMA3232.html' },
  { title: 'True Position Tools: shelf-pin drilling setup and reference holes', url: 'https://truepositiontools.com/learn/cabinet-hardware-jig-instructions/cabinet-shelf-pin-hole-drilling/' }
];
export const FIELDS = [
  ['height', 'Finished panel height', 100, 3000], ['depth', 'Finished panel depth', 60, 1200],
  ['thickness', 'Measured panel thickness', 6, 60], ['pitch', 'Vertical hole pitch', 10, 100],
  ['origin', 'Grid start above bottom', 0, 3000], ['bottom', 'Bottom clearance to hole rim', 0, 500],
  ['top', 'Top clearance to hole rim', 0, 500], ['front', 'Front row center setback', 3, 600],
  ['rear', 'Rear row center setback', 3, 600], ['diameter', 'Hole diameter', 1, 15],
  ['bore', 'Maximum drill-tip penetration', 1, 50], ['skin', 'Required remaining outer skin', 1, 30]
];
export const CHECKS = [
  ['datum', 'Both inside faces, finished fronts and bottom datums are labeled.'],
  ['coupon', 'A same-thickness test piece proves tip depth and actual pin fit.'],
  ['hardware', 'Actual hinge, back, joint and fixing envelopes are checked.'],
  ['paired', 'Four installed supports carry a test shelf without rocking.']
];
const clean = (v, max) => typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, max).trim() : '';
export function sampleProject() {
  return { version: VERSION, name: 'Workshop cabinet · paired sides', revision: 'A', height: 720, depth: 560,
    thickness: 18, pitch: 32, origin: 64, bottom: 50, top: 50, front: 37, rear: 37,
    diameter: 5, bore: 12, skin: 3, zones: [{ label: 'Example hinge envelope — replace with measured limits', from: 300, to: 360 }],
    checks: Object.fromEntries(CHECKS.map(([key]) => [key, false])), notes: '' };
}
export function parseProject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== VERSION) throw Error('Unsupported project format or version.');
  const p = { version: VERSION, name: clean(value.name, 100), revision: clean(value.revision, 40), notes: clean(value.notes, 2000) };
  for (const [key, label, min, max] of FIELDS) {
    if (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || value[key] < min || value[key] > max) throw Error(`${label} must be ${min}–${max} mm.`);
    p[key] = value[key];
  }
  if (!Array.isArray(value.zones) || value.zones.length > 12) throw Error('Use at most 12 full-width keep-out bands.');
  p.zones = value.zones.map((z, i) => {
    if (!z || typeof z !== 'object' || typeof z.from !== 'number' || typeof z.to !== 'number' || !Number.isFinite(z.from) || !Number.isFinite(z.to) || z.from < 0 || z.to > p.height || z.to <= z.from) throw Error(`Keep-out ${i + 1}: enter bottom < top within the panel height.`);
    return { label: clean(z.label, 120) || `Keep-out ${i + 1}`, from: z.from, to: z.to };
  });
  p.checks = Object.fromEntries(CHECKS.map(([key]) => [key, value.checks?.[key] === true]));
  return p;
}
export function calculate(value) {
  let p;
  try { p = parseProject(value); } catch (e) { return { ok: false, errors: [e.message], levels: [], holes: [] }; }
  const errors = [], radius = p.diameter / 2;
  if (p.front < radius || p.rear < radius) errors.push('A row crosses a front or rear panel edge. Increase its center setback.');
  if (p.depth - p.rear - p.front <= p.diameter) errors.push('Front and rear hole circles overlap or touch. Separate the two rows.');
  if (p.bore + p.skin > p.thickness + 1e-8) errors.push('Drill-tip penetration leaves less than the required outer skin. Reduce depth or review the actual panel.');
  if (p.bottom + p.top + p.diameter > p.height) errors.push('Top and bottom rim clearances leave no usable panel height.');
  const levels = [], holes = [];
  if (!errors.length) {
    const first = Math.max(0, Math.ceil((p.bottom + radius - p.origin - 1e-8) / p.pitch));
    const last = Math.floor((p.height - p.top - radius - p.origin + 1e-8) / p.pitch);
    for (let n = first; n <= last; n++) {
      const y = Number((p.origin + n * p.pitch).toFixed(8));
      const blockedBy = p.zones.filter(z => y + radius >= z.from - 1e-8 && y - radius <= z.to + 1e-8).map(z => z.label);
      levels.push({ index: n, y, blockedBy, usable: !blockedBy.length });
      if (!blockedBy.length) for (const panel of ['Left', 'Right']) for (const [row, x] of [['Front', p.front], ['Rear', p.depth - p.rear]]) {
        holes.push({ panel, row, level: n, xFromFront: x, xOnDrawing: panel === 'Left' ? x : p.depth - x, yFromBottom: y, diameter: p.diameter, tipDepth: p.bore });
      }
    }
    if (!holes.length) errors.push('No complete four-hole level remains. Review the grid start, margins and keep-outs.');
  }
  return { ok: !errors.length, errors, project: p, levels, holes, usable: levels.filter(l => l.usable).length,
    skipped: levels.filter(l => !l.usable).length, remainingSkin: p.thickness - p.bore,
    evidence: CHECKS.filter(([key]) => p.checks[key]).length };
}
export const fmt = n => Number(n.toFixed(3)).toString();
export const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const csvCell = v => '"' + String(v).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""') + '"';
export function exportCSV(value) {
  const r = calculate(value); if (!r.ok) throw Error(r.errors.join(' '));
  const p = r.project;
  return [['Project','Revision','Panel','Row','Grid index','X from finished front mm','Y from finished bottom mm','Hole diameter mm','Maximum tip depth mm','Remaining skin mm','Physical checks recorded of 4'],
    ...r.holes.map(h => [p.name,p.revision,h.panel,h.row,h.level,fmt(h.xFromFront),fmt(h.yFromBottom),fmt(h.diameter),fmt(h.tipDepth),fmt(r.remainingSkin),r.evidence])].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
export function renderSVG(value, selected = null) {
  const r = calculate(value); if (!r.ok) return '';
  const p = r.project, pad = 32, gap = 50, width = 2 * p.depth + 2 * pad + gap, height = p.height + 110;
  const panels = ['Left','Right'].map((panel, i) => {
    const left = pad + i * (p.depth + gap), top = 30;
    return `<g><text x="${left}" y="18" font-size="10" fill="#164f48">${panel.toUpperCase()} · INSIDE FACE · TOP ↑</text><rect x="${left}" y="${top}" width="${p.depth}" height="${p.height}" fill="#f4eddd" stroke="#9c947f" stroke-width="1"/>${p.zones.map(z => `<rect x="${left}" y="${top+p.height-z.to}" width="${p.depth}" height="${z.to-z.from}" fill="#bc6a4d" fill-opacity=".2"/>`).join('')}${r.levels.filter(l => l.usable && l.y === selected).map(l => `<rect x="${left}" y="${top+p.height-l.y-6}" width="${p.depth}" height="12" fill="#e3ad40" fill-opacity=".5"/>`).join('')}${r.holes.filter(h => h.panel === panel).map(h => `<circle cx="${left+h.xOnDrawing}" cy="${top+p.height-h.yFromBottom}" r="${p.diameter/2}" fill="#195d55"/><path d="M${left+h.xOnDrawing-4} ${top+p.height-h.yFromBottom}h8m-4 -4v8" stroke="#195d55" stroke-width=".5"/>`).join('')}<text x="${left}" y="${top+p.height+16}" font-size="9" fill="#164f48">${panel === 'Left' ? '← FINISHED FRONT' : 'REAR ←'} · BOTTOM DATUM · ${panel === 'Right' ? 'FINISHED FRONT →' : '→ REAR'}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="sp-svg-title sp-svg-desc"><title id="sp-svg-title">Paired inside-face shelf-pin map</title><desc id="sp-svg-desc">${esc(p.name)}. ${p.height} by ${p.depth} mm panels. ${r.usable} available levels, ${r.holes.length} holes. Both tops up; finished fronts face outward. Red bands are omitted on both panels.</desc>${panels}<path d="M32 ${height-35}h100m-100 -3v6m100 -6v6" stroke="#164f48" stroke-width="1"/><text x="32" y="${height-20}" font-size="9">100 mm scale check · verify printed size in BOTH axes</text><path d="M${width-25} ${height-105}v100m-3 -100h6m-6 100h6" stroke="#164f48" stroke-width="1"/><text x="${width/2}" y="${height-35}" font-size="9">${esc(p.name)} · Rev ${esc(p.revision)} · v1 · ${r.evidence}/4 checks recorded</text><text x="${width/2}" y="${height-20}" font-size="9">GEOMETRY REVIEW · No CNC code · Verify coupon, hardware and shelf fit</text></svg>`;
}
