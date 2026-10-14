export const SOURCES = {
  original: { label: 'Titebond Original · reference example', open: 4, total: 10, url: 'https://www.titebond.com/product/glues/d4d28015-603f-4dfc-a7d9-f684acc71207', range: 'Open 4–6 min; total 10–15 min at 70°F / 50% RH.' },
  iii: { label: 'Titebond III · reference example', open: 8, total: 20, url: 'https://titebond.com/product/glues/e8d40b45-0ab3-49f7-8a9c-b53970f736af', range: 'Open 8–10 min; total 20–25 min at 70°F / 50% RH.' },
};
export function sampleProject() {
  return { version: 1, product: 'original', adhesive: SOURCES.original.label, open: 4, total: 10, reserve: 1,
    notes: 'Reference times only. Confirm the actual adhesive, stock and shop conditions before applying glue.',
    conditions: false, rehearsal: false, resources: false,
    rows: [{ label: 'Frame A', setup: 2, spread: 1.5, mate: 1, clamp: 2 }, { label: 'Frame B · separate glue-up', setup: 3, spread: 1.5, mate: 1, clamp: 2 }] };
}
export function validateProject(input) {
  if (!input || input.version !== 1 || !['original', 'iii', 'custom'].includes(input.product)) throw Error('Unsupported Glue-Up Planner backup.');
  const text = (v, max, name) => { if (typeof v !== 'string' || v.length > max) throw Error(name + ' is missing or too long.'); return v; };
  const number = (v, min, max, name) => { if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw Error(name + ' must be ' + min + '–' + max + ' minutes.'); return v; };
  const p = { version: 1, product: input.product, adhesive: text(input.adhesive, 160, 'Adhesive reference'), open: number(input.open, 0.01, 240, 'Open limit'), total: number(input.total, 0.01, 240, 'Total limit'), reserve: number(input.reserve, 0, 240, 'Reserve'), notes: text(input.notes, 3000, 'Notes') };
  if (!p.adhesive.trim()) throw Error('Name the adhesive or source reference.');
  if (p.total < p.open) throw Error('Total assembly limit must be at least the open assembly limit.');
  if (p.reserve >= p.open) throw Error('Reserve must be less than the open assembly limit.');
  const reference = SOURCES[p.product];
  if (reference && (p.open !== reference.open || p.total !== reference.total || p.adhesive !== reference.label)) p.product = 'custom';
  for (const key of ['conditions', 'rehearsal', 'resources']) { if (typeof input[key] !== 'boolean') throw Error('Invalid physical-check state.'); p[key] = input[key]; }
  if (!Array.isArray(input.rows) || input.rows.length < 1 || input.rows.length > 20) throw Error('Use 1–20 independent glue-up batches.');
  p.rows = input.rows.map((row, i) => {
    if (!row || typeof row !== 'object') throw Error('Invalid batch.');
    const r = { label: text(row.label, 120, 'Batch label') };
    if (!r.label.trim()) throw Error('Name batch ' + (i + 1) + '.');
    for (const key of ['setup', 'spread', 'mate', 'clamp']) r[key] = number(row[key], key === 'setup' ? 0 : 0.01, 120, r.label + ' / ' + key);
    return r;
  });
  return p;
}
export function calculateProject(input) {
  const project = validateProject(input);
  let cursor = 0;
  const rows = project.rows.map(row => {
    const start = cursor + row.setup, openUsed = row.spread + row.mate, totalUsed = openUsed + row.clamp;
    const openMargin = project.open - project.reserve - openUsed, totalMargin = project.total - project.reserve - totalUsed;
    const fits = openMargin >= -1e-9 && totalMargin >= -1e-9;
    const status = !fits ? 'Revise timing' : Math.min(openMargin, totalMargin) <= 1e-9 ? 'At planning boundary' : 'Inside planned limits';
    cursor = start + totalUsed;
    return { ...row, start, spreadEnd: start + row.spread, mateEnd: start + openUsed, pressureEnd: cursor, openDeadline: start + project.open - project.reserve, totalDeadline: start + project.total - project.reserve, openUsed, totalUsed, openMargin, totalMargin, fits, status };
  });
  return { project, rows, duration: cursor, fits: rows.every(r => r.fits), checks: project.conditions && project.rehearsal && project.resources };
}
export function exportCSV(input) {
  const r = calculateProject(input);
  const cell = v => { const s = String(v); return '"' + (typeof v === 'string' && /^[\s]*[=+@-]/.test(s) ? "'" : '') + s.replaceAll('"', '""') + '"'; };
  const headings = ['Batch', 'Adhesive reference', 'Elapsed first glue min', 'All joints mated min', 'Final pressure min', 'Open used min', 'Total used min', 'Open limit min', 'Total limit min', 'Reserve min', 'Open margin min', 'Total margin min', 'Timing status', 'Conditions confirmed', 'Dry run confirmed', 'Clamps and access confirmed', 'Notes', 'Method'];
  return [headings, ...r.rows.map(row => [row.label, r.project.adhesive, row.start, row.mateEnd, row.pressureEnd, row.openUsed, row.totalUsed, r.project.open, r.project.total, r.project.reserve, row.openMargin, row.totalMargin, row.status, r.project.conditions, r.project.rehearsal, r.project.resources, r.project.notes, 'v1 / serial independent batches / timing only; no clamp-release or cure schedule'])].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
