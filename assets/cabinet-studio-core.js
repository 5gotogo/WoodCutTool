// All geometry is in millimeters. UI, storage, and drawing stay outside this module.
export const DEFAULTS = Object.freeze({ width: 900, height: 1800, depth: 360, thickness: 18, shelves: 4, bays: 1, back: true, material: 'birch', target: 300, sheetLength: 2440, sheetWidth: 1220, kerf: 3.2, trim: 10, price: 85, backPrice: 38, grain: true });
export const LIMITS = Object.freeze({ width: [300, 2400], height: [300, 2400], depth: [180, 800], thickness: [12, 30], shelves: [0, 8], bays: [1, 3], target: [80, 800], sheetLength: [600, 3600], sheetWidth: [400, 1800], kerf: [0, 10], trim: [0, 50], price: [0, 2000], backPrice: [0, 2000] });
export const PRESETS = Object.freeze({ bookcase: { width: 900, height: 1800, depth: 360, shelves: 4, bays: 1, target: 300 }, media: { width: 1500, height: 600, depth: 420, shelves: 1, bays: 3, target: 200 }, pantry: { width: 800, height: 2000, depth: 500, shelves: 5, bays: 1, target: 280 }, display: { width: 1200, height: 1400, depth: 300, shelves: 3, bays: 2, target: 280 } });
export function normalize(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Project settings must be an object.');
  const c = { ...DEFAULTS };
  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    if (raw[key] !== undefined) {
      const n = Number(raw[key]);
      if (!Number.isFinite(n) || n < min || n > max) throw Error(`${key}: enter a number from ${min} to ${max}.`);
      if (['shelves', 'bays'].includes(key) && !Number.isInteger(n)) throw Error(`${key} must be a whole number.`);
      c[key] = n;
    }
  }
  for (const key of ['back', 'grain']) if (raw[key] !== undefined) { if (typeof raw[key] !== 'boolean') throw Error(`${key} must be true or false.`); c[key] = raw[key]; }
  if (raw.material !== undefined) { if (!['birch', 'oak', 'walnut'].includes(raw.material)) throw Error('Choose birch, oak, or walnut.'); c.material = raw.material; }
  return c;
}
export function buildCabinet(raw) {
  const c = normalize(raw), { width: w, height: h, thickness: t, shelves: n, bays } = c;
  const d = c.depth - (c.back ? 6 : 0), inside = w - 2 * t, bay = (inside - (bays - 1) * t) / bays;
  const opening = (h - (n + 2) * t) / (n + 1);
  const parts = [];
  const add = (id, label, length, width, thickness, box, offset, edge) => parts.push({ id, label, length, width, thickness, box, offset, edge });
  add('left', 'Left side', h, d, t, [0, 0, 0, t, h, d], [-1, 0, 0], h);
  add('right', 'Right side', h, d, t, [w - t, 0, 0, t, h, d], [1, 0, 0], h);
  add('bottom', 'Bottom', inside, d, t, [t, 0, 0, inside, t, d], [0, -0.6, 0], inside);
  add('top', 'Top', inside, d, t, [t, h - t, 0, inside, t, d], [0, 0.6, 0], inside);
  for (let b = 1; b < bays; b++) add(`divider-${b}`, `Divider ${b}`, h - 2 * t, d, t, [t + b * bay + (b - 1) * t, t, 0, t, h - 2 * t, d], [0, 0, -0.6], h - 2 * t);
  for (let b = 0; b < bays; b++) for (let s = 1; s <= n; s++) add(`shelf-${b}-${s}`, `Bay ${b + 1} · shelf ${s}`, bay - 2, d - 12, t, [t + b * (bay + t) + 1, t + s * opening + (s - 1) * t, 12, bay - 2, t, d - 12], [0, 0, 0.5 + s * 0.1], bay - 2);
  if (c.back) add('back', 'Overlay back', Math.max(h, w), Math.min(h, w), 6, [0, 0, d, w, h, 6], [0, 0, -1], 0);
  const issues = [];
  if (opening < 60) issues.push({ kind: 'error', title: 'Too many shelves', detail: `Only ${Math.round(opening)} mm remains per opening. Reduce the shelf count or increase the height.`, action: 'fit' });
  else if (opening < c.target) issues.push({ kind: 'warning', title: 'Your items need more room', detail: `${Math.round(opening)} mm clear height is below your ${c.target} mm item target.`, action: 'fit' });
  if (bay - 2 > 700) issues.push({ kind: 'warning', title: 'Review the shelf span', detail: `${Math.round(bay - 2)} mm unsupported width. Add a bay divider, then check actual shelf loads and deflection. The 700 mm trigger is a planning heuristic, not a load rating.`, action: bays < 3 ? 'divide' : null });
  if (!c.back) issues.push({ kind: 'warning', title: 'Plan resistance to racking', detail: 'An open back needs a verified bracing and fastening detail before assembly.', action: 'back' });
  if (h > 1200) issues.push({ kind: 'note', title: 'Include a fixing plan', detail: 'Verify wall type, anchors, floor level, and anti-tip restraint for the actual installation.' });
  const groups = [t, ...(c.back ? [6] : [])].map(thickness => packParts(parts.filter(p => p.thickness === thickness), c, thickness));
  for (const g of groups) if (g.unplaced.length) issues.push({ kind: 'error', title: `${g.unplaced.length} part(s) do not fit stock`, detail: `${g.thickness} mm stock is too small after trim and grain constraints. Increase stock dimensions or revise the cabinet.` });
  const area = parts.reduce((v, p) => v + p.length * p.width, 0);
  const sheetArea = groups.reduce((v, g) => v + g.sheets.length * c.sheetLength * c.sheetWidth, 0);
  return { config: c, parts, groups, issues, opening, bay, area, sheetArea, utilization: sheetArea ? area / sheetArea * 100 : 0, edge: parts.reduce((v, p) => v + p.edge, 0) / 1000, cost: groups.reduce((v, g) => v + g.sheets.length * (g.thickness === 6 ? c.backPrice : c.price), 0), valid: !issues.some(i => i.kind === 'error') };
}
// Guillotine rectangles remain disjoint. Search six deterministic orders/splits;
// retain the lowest sheet count, then the most compact final sheet. Not a global optimum.
export function packParts(parts, c, thickness) {
  const L = c.sheetLength - 2 * c.trim, W = c.sheetWidth - 2 * c.trim;
  const trials = [];
  for (const order of ['area', 'length', 'width']) for (const split of ['length', 'width']) {
    const sorted = [...parts].sort((a, b) => order === 'area' ? b.length * b.width - a.length * a.width : b[order] - a[order]);
    const sheets = [], unplaced = [];
    for (const p of sorted) {
      const orientations = [{ l: p.length, w: p.width, rotated: false }, ...(!c.grain && p.length !== p.width ? [{ l: p.width, w: p.length, rotated: true }] : [])];
      if (!orientations.some(o => o.l <= L && o.w <= W)) { unplaced.push(p); continue; }
      let best;
      for (let si = 0; si < sheets.length; si++) for (let ri = 0; ri < sheets[si].free.length; ri++) for (const o of orientations) {
        const r = sheets[si].free[ri];
        if (o.l <= r.l + 1e-7 && o.w <= r.w + 1e-7) {
          const score = r.l * r.w - o.l * o.w;
          if (!best || score < best.score) best = { si, ri, o, score };
        }
      }
      if (!best) { sheets.push({ free: [{ x: c.trim, y: c.trim, l: L, w: W }], placed: [] }); best = { si: sheets.length - 1, ri: 0, o: orientations.find(o => o.l <= L && o.w <= W) }; }
      const sheet = sheets[best.si], r = sheet.free.splice(best.ri, 1)[0], o = best.o, k = c.kerf;
      sheet.placed.push({ ...p, x: r.x, y: r.y, l: o.l, w: o.w, rotated: o.rotated });
      const rest = split === 'length' ? [
        { x: r.x + o.l + k, y: r.y, l: r.l - o.l - k, w: r.w },
        { x: r.x, y: r.y + o.w + k, l: o.l, w: r.w - o.w - k }
      ] : [
        { x: r.x + o.l + k, y: r.y, l: r.l - o.l - k, w: o.w },
        { x: r.x, y: r.y + o.w + k, l: r.l, w: r.w - o.w - k }
      ];
      sheet.free.push(...rest.filter(v => v.l > 0 && v.w > 0));
    }
    const last = sheets.at(-1), used = last ? Math.max(...last.placed.map(p => p.x + p.l)) * Math.max(...last.placed.map(p => p.y + p.w)) : 0;
    trials.push({ thickness, sheets, unplaced, score: sheets.length * c.sheetLength * c.sheetWidth + used });
  }
  return trials.sort((a, b) => a.score - b.score)[0];
}
export function fitShelves(c) {
  return Math.max(0, Math.min(8, Math.floor((c.height - 2 * c.thickness - c.target) / (c.target + c.thickness))));
}
// An intentionally bounded brief parser: known furniture intents and dimensions.
// No cloud model, silent guesses about joinery, or generated engineering claims.
export function parseBrief(text, current = DEFAULTS) {
  const brief = String(text).slice(0, 500).toLowerCase(), changes = {}, recognized = [];
  const intents = [['bookcase', /book|书柜|书架/], ['media', /media|tv|电视|影音/], ['pantry', /pantry|kitchen|食品|储物|厨房/], ['display', /display|展示/]];
  const intent = intents.find(([, re]) => re.test(brief));
  if (intent) { Object.assign(changes, PRESETS[intent[0]]); recognized.push(`${intent[0]} preset`); }
  const scale = unit => /cm|厘米/.test(unit || '') ? 10 : /in|inch|英寸/.test(unit || '') ? 25.4 : 1;
  const triple = brief.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(mm|cm|inches|inch|in|毫米|厘米|英寸)?/);
  if (triple) { const factor = scale(triple[4]); ['width', 'height', 'depth'].forEach((key, i) => changes[key] = Math.round(Number(triple[i + 1]) * factor * 10) / 10); recognized.push('width × height × depth'); }
  const names = { width: 'width|wide|宽', height: 'height|high|tall|高', depth: 'depth|deep|深' };
  for (const [key, words] of Object.entries(names)) {
    const a = brief.match(new RegExp(`(?:${words})\\s*[:：=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(mm|cm|inches|inch|in|毫米|厘米|英寸)?`));
    const b = brief.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(mm|cm|inches|inch|in|毫米|厘米|英寸)?\\s*(?:${words})(?:\\b|$)`));
    const m = a || b; if (m) { changes[key] = Math.round(Number(m[1]) * scale(m[2]) * 10) / 10; recognized.push(key); }
  }
  const shelves = brief.match(/(\d+)\s*(?:shelves|shelf|块层板|层板)/) || brief.match(/(?:shelves|层板)\s*[:：=]?\s*(\d+)/);
  if (shelves) { changes.shelves = Number(shelves[1]); recognized.push('shelves'); }
  for (const [m, re] of [['walnut', /walnut|胡桃/], ['oak', /oak|橡木/], ['birch', /birch|桦木/]]) if (re.test(brief)) { changes.material = m; recognized.push(m + ' finish'); }
  if (!recognized.length) throw Error('Try a furniture type and W × H × D, for example: bookcase 900 × 1800 × 360 mm, 4 shelves.');
  return { config: normalize({ ...current, ...changes }), recognized };
}
export function csvCutList(model) {
  const quote = v => '"' + String(v).replaceAll('"', '""') + '"';
  return ['Part,Length mm,Width mm,Thickness mm,Quantity,Grain along length,Front edge m', ...model.parts.map(p => [p.label, p.length.toFixed(1), p.width.toFixed(1), p.thickness, 1, model.config.grain ? 'Yes' : 'No', (p.edge / 1000).toFixed(3)].map(quote).join(','))].join('\r\n');
}
