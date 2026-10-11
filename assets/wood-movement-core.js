// USDA Wood Handbook FPL-GTR-282 (2021), Chapter 13, Table 13-5 and Eq. 13-3.
export const SOURCE = 'https://research.fs.usda.gov/download/treesearch/62261.pdf';
export const STORAGE_KEY = 'wct.wood-movement.v1';
export const SPECIES = [
  { id: 'white-oak', name: 'White oak (white)', radial: 0.00194, tangential: 0.00376 },
  { id: 'red-oak', name: 'Red oak (northern red)', radial: 0.00137, tangential: 0.00304 },
  { id: 'sugar-maple', name: 'Sugar maple', radial: 0.00165, tangential: 0.00353 },
  { id: 'black-walnut', name: 'Black walnut', radial: 0.00190, tangential: 0.00274 },
  { id: 'black-cherry', name: 'Black cherry', radial: 0.00126, tangential: 0.00248 },
  { id: 'yellow-poplar', name: 'Yellow-poplar', radial: 0.00158, tangential: 0.00289 },
  { id: 'eastern-white-pine', name: 'Eastern white pine', radial: 0.00071, tangential: 0.00212 },
  { id: 'coast-douglas-fir', name: 'Douglas-fir (Coast-type)', radial: 0.00165, tangential: 0.00267 },
];
export const EXAMPLES = [
  { label: 'White oak tabletop', species: 'white-oak', direction: 'tangential', width: 600, current: 8, low: 6, high: 12, opening: 612, reserve: 2, anchor: 'center', notes: 'Example only: fixed 612 mm envelope; verify the actual attachment detail.' },
  { label: 'Sugar maple panel', species: 'sugar-maple', direction: 'radial', width: 400, current: 10, low: 7, high: 13, opening: 405, reserve: 2, anchor: 'center', notes: 'Example only: radial width scenario, not an approved groove or joinery dimension.' },
  { label: 'Walnut shelf', species: 'black-walnut', direction: 'both', width: 300, current: 9, low: 6, high: 12, opening: 305, reserve: 1, anchor: 'edge', notes: 'Example only: compare both directions before confirming the real stock.' },
];
export const sampleProject = (index = 0) => ({ version: 1, unit: 'mm', ...EXAMPLES[index] });
export function validateProject(p) {
  if (!p || p.version !== 1 || !['mm', 'in'].includes(p.unit)) throw Error('Unsupported project or display units.');
  if (!SPECIES.some(s => s.id === p.species)) throw Error('Choose one of the listed species.');
  if (!['radial', 'tangential', 'both'].includes(p.direction) || !['center', 'edge'].includes(p.anchor)) throw Error('Choose a width direction and locating reference.');
  for (const key of ['label', 'notes']) if (typeof p[key] !== 'string' || p[key].length > (key === 'label' ? 120 : 2000)) throw Error('Project label or notes are too long.');
  for (const key of ['width', 'opening', 'reserve', 'current', 'low', 'high']) if (typeof p[key] !== 'number' || !Number.isFinite(p[key])) throw Error('Enter a finite number in every numeric field.');
  if (p.width <= 0 || p.width > 10000 || p.opening <= 0 || p.opening > 20000 || p.reserve < 0 || p.reserve > 1000) throw Error('Width and opening must be positive; reserve cannot be negative. Maximums: width 10,000 mm, opening 20,000 mm, reserve 1,000 mm.');
  if ([p.current, p.low, p.high].some(n => n < 6 || n > 14)) throw Error('This model supports 6–14% wood moisture content only. Values outside this range need a different method.');
  if (p.low > p.high) throw Error('Dry-season moisture content must not exceed wet-season moisture content.');
  if (p.current < p.low || p.current > p.high) throw Error('Current moisture content must lie inside the entered service range. Broaden the range to include it.');
  return Object.fromEntries(['version', 'unit', 'label', 'species', 'direction', 'width', 'current', 'low', 'high', 'opening', 'reserve', 'anchor', 'notes'].map(k => [k, p[k]]));
}
export function calculate(project) {
  const p = validateProject(project), species = SPECIES.find(s => s.id === p.species);
  const directions = p.direction === 'both' ? ['radial', 'tangential'] : [p.direction];
  const rows = directions.map(direction => {
    const coefficient = species[direction];
    const dryChange = p.width * coefficient * (p.low - p.current);
    const wetChange = p.width * coefficient * (p.high - p.current);
    const dryWidth = p.width + dryChange, wetWidth = p.width + wetChange;
    const wetGap = p.opening - wetWidth, reserveBalance = wetGap - p.reserve;
    const fraction = p.anchor === 'center' ? 0.5 : 1;
    return { direction, coefficient, dryChange, wetChange, dryWidth, wetWidth, swing: wetWidth - dryWidth, wetGap, reserveBalance, dryTravel: -dryChange * fraction, wetTravel: wetChange * fraction };
  });
  return { species, rows };
}
export const unitFactor = unit => unit === 'in' ? 25.4 : 1;
export function exportCSV(project) {
  const p = validateProject(project), { species, rows } = calculate(p);
  const headers = ['Project', 'Species', 'Direction', 'Coefficient per MC point', 'Measured width mm', 'Current MC %', 'Dry MC %', 'Wet MC %', 'Dry width mm', 'Wet width mm', 'Seasonal swing mm', 'Opening mm (fixed)', 'Wet total gap mm', 'Required total reserve mm', 'Reserve balance mm', 'Locating reference', 'Dry travel mm per moving edge', 'Wet travel mm per moving edge', 'Notes', 'Method', 'Source'];
  const cell = v => { let s = typeof v === 'number' ? String(Number(v.toPrecision(12))) : String(v); if (typeof v === 'string' && /^[\s]*[=+@-]/.test(s)) s = "'" + s; return '"' + s.replaceAll('"', '""') + '"'; };
  const records = rows.map(r => [p.label, species.name, r.direction, r.coefficient, p.width, p.current, p.low, p.high, r.dryWidth, r.wetWidth, r.swing, p.opening, r.wetGap, p.reserve, r.reserveBalance, p.anchor, r.dryTravel, r.wetTravel, p.notes, 'FPL-GTR-282 Table 13-5; Eq. 13-3; 6-14% MC; approximate unrestrained solid wood', SOURCE]);
  return '\ufeff' + [headers, ...records].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
