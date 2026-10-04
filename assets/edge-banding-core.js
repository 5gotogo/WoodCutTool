import { validateProject as validateLayout } from './cut-handoff-model.js';

export const EDGES = ['left', 'right', 'top', 'bottom'];
export const STORAGE_KEY = 'woodcuttool.edge-banding.v1';
const number = (v, min, max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const name = v => typeof v === 'string' && v.trim().length > 0 && v.length <= 100;
const only = (v, keys) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every(k => keys.includes(k));

export function sampleProject() {
  return { version: 1, unit: 'mm', mode: 'finished', settings: { preMill: 0, endTrim: 20, faceTrim: 1, waste: 10, sheetLength: 2440, sheetWidth: 1220, kerf: 3.2, sheetTrim: 10 },
    profiles: [{ id: 'A', label: 'Birch ABS', thickness: 1, width: 22, rollLength: 25000 }, { id: 'B', label: 'White ABS', thickness: 2, width: 22, rollLength: 25000 }],
    parts: [{ label: 'Shelf', material: 'Birch plywood', length: 600, width: 300, thickness: 18, qty: 3, grain: true, edges: { left: '', right: '', top: 'A', bottom: '' } },
      { label: 'Door', material: 'White panel', length: 720, width: 400, thickness: 18, qty: 2, grain: true, edges: { left: 'B', right: 'B', top: 'B', bottom: 'B' } }] };
}

export function validateProject(value) {
  if (!only(value, ['version', 'unit', 'mode', 'settings', 'profiles', 'parts']) || value.version !== 1 || !['mm', 'in'].includes(value.unit) || !['finished', 'blank'].includes(value.mode)) throw Error('Unsupported project version, units, input basis or fields.');
  const s = value.settings;
  if (!only(s, ['preMill', 'endTrim', 'faceTrim', 'waste', 'sheetLength', 'sheetWidth', 'kerf', 'sheetTrim']) || !number(s.preMill, 0, 10) || !number(s.endTrim, 0, 500) || !number(s.faceTrim, 0, 20) || !number(s.waste, 0, 100) || !number(s.sheetLength, 1, 10000) || !number(s.sheetWidth, 1, 10000) || !number(s.kerf, 0, 20) || !number(s.sheetTrim, 0, 500) || 2 * s.sheetTrim >= Math.min(s.sheetLength, s.sheetWidth) || s.kerf >= Math.min(s.sheetLength, s.sheetWidth)) throw Error('Check allowances and sheet dimensions. Trim must leave usable stock.');
  if (!Array.isArray(value.profiles) || value.profiles.length !== 2) throw Error('A project needs edging profiles A and B.');
  const ids = new Set();
  for (const p of value.profiles) {
    if (!only(p, ['id', 'label', 'thickness', 'width', 'rollLength']) || !['A', 'B'].includes(p.id) || ids.has(p.id) || !name(p.label) || !number(p.thickness, 0.01, 10) || !number(p.width, 0.1, 200) || !number(p.rollLength, 1, 1000000)) throw Error('Check edging names, positive thickness, width and roll length.');
    ids.add(p.id);
  }
  if (!Array.isArray(value.parts) || !value.parts.length || value.parts.length > 100) throw Error('Use 1–100 part rows.');
  let count = 0;
  for (const p of value.parts) {
    if (!only(p, ['label', 'material', 'length', 'width', 'thickness', 'qty', 'grain', 'edges']) || !name(p.label) || !name(p.material) || !number(p.length, 0.01, 10000) || !number(p.width, 0.01, 10000) || !number(p.thickness, 0.1, 100) || !Number.isInteger(p.qty) || p.qty < 1 || typeof p.grain !== 'boolean' || !only(p.edges, EDGES) || !EDGES.every(e => ['', 'A', 'B'].includes(p.edges[e]))) throw Error('Check every part: label, material, dimensions, whole quantity and four edge choices are required.');
    count += p.qty;
  }
  if (count > 500) throw Error('Use at most 500 physical parts; split larger jobs into batches.');
  const project = structuredClone(value);
  project.profiles.sort((a, b) => a.id.localeCompare(b.id));
  return project;
}

export function calculateProject(value) {
  const project = validateProject(value), s = project.settings;
  const profiles = new Map(project.profiles.map(p => [p.id, p]));
  const supplies = project.profiles.map(p => ({ ...p, strips: 0, net: 0, allowance: 0, longest: 0 }));
  const issues = [];
  const parts = project.parts.map((p, index) => {
    const thickness = e => profiles.get(p.edges[e])?.thickness || 0;
    const mill = e => p.edges[e] ? s.preMill : 0;
    const lengthDelta = thickness('left') + thickness('right') - mill('left') - mill('right');
    const widthDelta = thickness('top') + thickness('bottom') - mill('top') - mill('bottom');
    const sawLength = project.mode === 'finished' ? p.length - lengthDelta : p.length;
    const sawWidth = project.mode === 'finished' ? p.width - widthDelta : p.width;
    const finishedLength = project.mode === 'finished' ? p.length : p.length + lengthDelta;
    const finishedWidth = project.mode === 'finished' ? p.width : p.width + widthDelta;
    const substrateLength = sawLength - mill('left') - mill('right');
    const substrateWidth = sawWidth - mill('top') - mill('bottom');
    if (Math.min(sawLength, sawWidth, substrateLength, substrateWidth, finishedLength, finishedWidth) < 0.01) issues.push({ kind: 'error', part: index, message: `${p.label}: edging or pre-milling leaves no usable rectangle.` });
    for (const e of EDGES) {
      if (!p.edges[e]) continue;
      const profile = profiles.get(p.edges[e]), supply = supplies.find(v => v.id === profile.id);
      if (profile.width < p.thickness + 2 * s.faceTrim) issues.push({ kind: 'error', part: index, message: `${p.label}, ${e}: profile ${profile.id} is too narrow for ${p.thickness} mm panel plus ${s.faceTrim} mm trimming per face.` });
      // Reserve the larger envelope so this estimate does not depend on banding order.
      const net = ['top', 'bottom'].includes(e) ? Math.max(sawLength, finishedLength) : Math.max(sawWidth, finishedWidth);
      const strip = net + 2 * s.endTrim;
      supply.strips += p.qty; supply.net += net * p.qty; supply.allowance += strip * p.qty; supply.longest = Math.max(supply.longest, strip);
      if (strip > profile.rollLength) issues.push({ kind: 'error', part: index, message: `${p.label}, ${e}: one strip exceeds profile ${profile.id}'s roll length. Choose longer stock.` });
    }
    return { ...p, sawLength, sawWidth, substrateLength, substrateWidth, finishedLength, finishedWidth };
  });
  for (const supply of supplies) {
    supply.purchase = supply.allowance * (1 + s.waste / 100);
    supply.rolls = Math.ceil(Number((supply.purchase / supply.rollLength).toFixed(10)));
  }
  return { project, parts, supplies: supplies.filter(v => v.strips), issues, valid: !issues.some(v => v.kind === 'error'), count: parts.reduce((v, p) => v + p.qty, 0) };
}

const cell = value => { let s = String(value); if (/^\s*[=+@-]/.test(s)) s = "'" + s; return `"${s.replaceAll('"', '""')}"`; };
const csv = rows => rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
const precision = v => Number(v.toFixed(6));
export function partsCsv(result) {
  if (!result.valid) throw Error('Resolve the project errors before exporting.');
  const { project } = result, scale = project.unit === 'in' ? 1 / 25.4 : 1;
  const dim = v => precision(v * scale);
  return csv([['Part', 'Material', 'Quantity', 'Unit', 'Panel thickness', 'Saw length', 'Saw width', 'Finished length', 'Finished width', 'Left profile', 'Right profile', 'Top profile', 'Bottom profile', 'Grain along length', 'Pre-mill per banded edge', 'Profile A', 'Profile B'], ...result.parts.map(p => [p.label, p.material, p.qty, project.unit, dim(p.thickness), dim(p.sawLength), dim(p.sawWidth), dim(p.finishedLength), dim(p.finishedWidth), ...EDGES.map(e => p.edges[e] || 'None'), p.grain, dim(project.settings.preMill), ...project.profiles.map(v => `${v.id}: ${v.label}; ${dim(v.thickness)} ${project.unit} thick; ${dim(v.width)} ${project.unit} wide`)])]);
}
export function suppliesCsv(result) {
  if (!result.valid) throw Error('Resolve the project errors before exporting.');
  return csv([['Profile', 'Label', 'Thickness mm', 'Width mm', 'Strips', 'Envelope length m', 'Including end trim m', 'Waste percent', 'Purchase length m', 'Roll length m', 'Rolls minimum by length', 'Longest strip m', 'Note'], ...result.supplies.map(s => [s.id, s.label, s.thickness, s.width, s.strips, precision(s.net / 1000), precision(s.allowance / 1000), result.project.settings.waste, precision(s.purchase / 1000), precision(s.rollLength / 1000), s.rolls, precision(s.longest / 1000), 'Length-based lower bound; verify individual strip allocation per roll.'])]);
}
export function layoutProject(result) {
  if (!result.valid) throw Error('Resolve the project errors before sending the cut list.');
  const groups = [], keys = new Map(), s = result.project.settings;
  const parts = result.parts.map(p => {
    const key = JSON.stringify([p.material.trim(), p.thickness]);
    if (!keys.has(key)) {
      const id = `edge-${groups.length + 1}`; keys.set(key, id);
      groups.push({ id, material: p.material.trim(), thickness: p.thickness, sheetLength: s.sheetLength, sheetWidth: s.sheetWidth, kerf: s.kerf, trim: s.sheetTrim, price: 0, allowRotate: true });
    }
    return { label: p.label, length: p.sawLength, width: p.sawWidth, qty: p.qty, group: keys.get(key), allowRotate: !p.grain };
  });
  return validateLayout({ version: 1, scenario: 'none', unit: 'mm', groups, parts, exclusions: ['Saw-cut blanks from Edge Banding Planner. Pre-milling is already included; do not deduct edging again.', 'Edging profiles and edge maps remain in the source planner and CSV. Sheet layout covers rectangles only; verify face, grain, process and hardware before cutting.'] });
}
