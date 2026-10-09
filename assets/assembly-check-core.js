export const STORAGE_KEY = 'woodcuttool.assembly-check.v1';
export const fields = ['width', 'height', 'diagonalA', 'diagonalB', 'tolerance', 'uncertainty'];
export const gates = ['sides', 'plane', 'references', 'fit'];
export function sampleReading() {
  return { name: 'Cabinet front · dry fit', width: 600, height: 800, diagonalA: 1000, diagonalB: 1002, tolerance: 2, uncertainty: 0.5, checks: { sides: false, plane: false, references: false, fit: false } };
}
export function validateReading(value) {
  if (!value || typeof value !== 'object' || typeof value.name !== 'string' || value.name.length > 160) throw Error('Use a record name of up to 160 characters.');
  const result = { name: value.name, checks: {} };
  for (const key of fields) {
    const n = value[key];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 100000 || (['width', 'height', 'diagonalA', 'diagonalB'].includes(key) && n === 0)) throw Error('Enter positive dimensions and diagonals, and non-negative tolerance and uncertainty (maximum 100,000 mm).');
    result[key] = n;
  }
  if (value.uncertainty >= Math.min(value.diagonalA, value.diagonalB)) throw Error('Reading uncertainty must be smaller than both diagonals.');
  for (const gate of gates) {
    if (typeof value.checks?.[gate] !== 'boolean') throw Error('The four physical check values must be true or false.');
    result.checks[gate] = value.checks[gate];
  }
  return result;
}
export function assessReading(input) {
  const r = validateReading(input);
  const ideal = Math.hypot(r.width, r.height);
  const gap = Math.abs(r.diagonalA - r.diagonalB);
  const lower = Math.max(0, gap - 2 * r.uncertainty), upper = gap + 2 * r.uncertainty;
  // Small floating point slack prevents exact unit conversions from changing a boundary decision.
  const epsilon = 1e-9;
  const status = upper <= r.tolerance + epsilon ? 'within' : lower > r.tolerance + epsilon ? 'outside' : 'borderline';
  return { ideal, gap, lower, upper, status, checksComplete: gates.every(g => r.checks[g]), ready: status === 'within' && gates.every(g => r.checks[g]) };
}
export function validateProject(value) {
  if (!value || value.version !== 1 || !['mm', 'in'].includes(value.unit) || !Array.isArray(value.records) || value.records.length > 200) throw Error('Use a version 1 Assembly Check backup with no more than 200 records.');
  return { version: 1, unit: value.unit, draft: validateReading(value.draft), records: value.records.map(r => {
    if (typeof r.created !== 'string' || !/^\d{4}-\d\d-\d\dT/.test(r.created) || !Number.isFinite(Date.parse(r.created))) throw Error('A saved record has an invalid date.');
    return { ...validateReading(r), created: r.created };
  }) };
}
export function sampleProject() { return { version: 1, unit: 'mm', draft: sampleReading(), records: [] }; }
const csvCell = v => '"' + String(v).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""') + '"';
export function recordsCSV(records) {
  const header = ['Record', 'Saved UTC', 'Width mm', 'Height mm', 'Diagonal A mm', 'Diagonal B mm', 'Tolerance mm', 'Reading uncertainty ±mm', 'Reference diagonal mm', 'Observed gap mm', 'Gap lower mm', 'Gap upper mm', 'Reading status', 'Opposite sides checked', 'Plane checked', 'References checked', 'Fit checked', 'Review complete'];
  const rows = records.map(r => { const a = assessReading(r); return [r.name, r.created, ...fields.map(k => r[k]), a.ideal, a.gap, a.lower, a.upper, a.status, ...gates.map(k => r.checks[k]), a.ready]; });
  return [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
