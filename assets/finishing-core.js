export const STORAGE_KEY = 'woodcuttool.finishing.v1';
export const GAL_L = 3.785411784;
export const SQFT_M2 = 0.09290304;
export const SURFACES = ['front', 'back', 'top', 'bottom', 'left', 'right'];
export function sampleProject() {
  return { version: 1, unit: 'metric', products: [
    { label: 'Topcoat — example only', coverage: 10, coats: 2, waste: 15, pack: 0.75, stock: 0 },
    { label: 'Stain — example only', coverage: 12, coats: 1, waste: 10, pack: 0.5, stock: 0 }
  ], parts: [
    { label: 'Shelf', length: 600, width: 300, thickness: 18, qty: 4, surfaces: ['front', 'back', 'top'], products: [true, false] },
    { label: 'Door', length: 720, width: 400, thickness: 18, qty: 2, surfaces: [...SURFACES], products: [true, false] }
  ] };
}
const fail = message => { throw new Error(message); };
const number = (v, min, max, label, integer = false) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max || (integer && !Number.isInteger(v))) fail(`${label} must be ${integer ? 'a whole number' : 'a number'} from ${min} to ${max}.`);
  return v;
};
const label = (v, name) => { if (typeof v !== 'string' || !v.trim() || v.length > 100) fail(`${name} needs a label of 1–100 characters.`); return v.trim(); };
export function validateProject(p) {
  if (!p || p.version !== 1 || !['metric', 'us'].includes(p.unit) || !Array.isArray(p.products) || p.products.length !== 2 || !Array.isArray(p.parts) || p.parts.length < 1 || p.parts.length > 100) fail('Use a version 1 project with two products and 1–100 part rows.');
  return { version: 1, unit: p.unit, products: p.products.map((s, i) => {
    if (!s) fail(`Product ${i + 1} is missing.`);
    return { label: label(s.label, `Product ${i + 1}`), coverage: number(s.coverage, 0.01, 1000, 'Coverage (m²/L)'), coats: number(s.coats, 1, 20, 'Coats', true), waste: number(s.waste, 0, 300, 'Extra allowance (%)'), pack: number(s.pack, 0.001, 1000, 'Pack size (L)'), stock: number(s.stock, 0, 10000, 'Usable stock (L)') };
  }), parts: p.parts.map((r, i) => {
    if (!r) fail(`Part ${i + 1} is missing.`);
    if (!Array.isArray(r.surfaces) || !r.surfaces.length || new Set(r.surfaces).size !== r.surfaces.length || r.surfaces.some(s => !SURFACES.includes(s))) fail(`Part ${i + 1}: select at least one distinct surface.`);
    if (!Array.isArray(r.products) || r.products.length !== 2 || r.products.some(v => typeof v !== 'boolean') || !r.products.some(Boolean)) fail(`Part ${i + 1}: select at least one product stage.`);
    return { label: label(r.label, `Part ${i + 1}`), length: number(r.length, 0.01, 10000, `Part ${i + 1} length (mm)`), width: number(r.width, 0.01, 10000, `Part ${i + 1} width (mm)`), thickness: number(r.thickness, 0.01, 1000, `Part ${i + 1} thickness (mm)`), qty: number(r.qty, 1, 10000, `Part ${i + 1} quantity`, true), surfaces: [...r.surfaces], products: [...r.products] };
  }) };
}
export function surfaceAreas(r) {
  return { front: r.length * r.width / 1e6, back: r.length * r.width / 1e6, top: r.length * r.thickness / 1e6, bottom: r.length * r.thickness / 1e6, left: r.width * r.thickness / 1e6, right: r.width * r.thickness / 1e6 };
}
export function calculate(project) {
  const p = validateProject(project);
  const rows = p.parts.map(r => {
    const areas = surfaceAreas(r);
    const faces = r.surfaces.filter(s => s === 'front' || s === 'back').reduce((sum, s) => sum + areas[s], 0) * r.qty;
    const edges = r.surfaces.filter(s => s !== 'front' && s !== 'back').reduce((sum, s) => sum + areas[s], 0) * r.qty;
    return { ...r, faces, edges, area: faces + edges };
  });
  const products = p.products.map((s, i) => {
    const area = rows.filter(r => r.products[i]).reduce((sum, r) => sum + r.area, 0);
    const coatArea = area * s.coats, base = coatArea / s.coverage, demand = base * (1 + s.waste / 100);
    const shortage = Math.max(0, demand - s.stock);
    const ratio = shortage / s.pack;
    // Remove arithmetic noise at an exact package boundary, not real shortage.
    const packs = Math.max(0, Math.ceil(ratio - Number.EPSILON * Math.max(1, ratio) * 8));
    return { ...s, area, coatArea, base, demand, shortage, packs, purchase: packs * s.pack, surplus: s.stock + packs * s.pack - demand };
  });
  return { rows, products, area: rows.reduce((sum, r) => sum + r.area, 0) };
}
export function displayFactors(unit) {
  return unit === 'us' ? { length: 25.4, volume: GAL_L, area: SQFT_M2, coverage: SQFT_M2 / GAL_L, lengthLabel: 'in', volumeLabel: 'US gal', areaLabel: 'ft²', coverageLabel: 'ft²/US gal' } : { length: 1, volume: 1, area: 1, coverage: 1, lengthLabel: 'mm', volumeLabel: 'L', areaLabel: 'm²', coverageLabel: 'm²/L' };
}
export const csvCell = value => `"${String(value).replace(/^[\s]*[=+@-]/, "'$&").replaceAll('"', '""')}"`;
export function exportCSV(project) {
  const result = calculate(project);
  const lines = [['Finishing purchase list — metric basis'], ['Product', 'Surface area m2', 'Coats', 'Coverage m2/L per coat', 'Allowance %', 'Demand L', 'Usable stock L', 'Pack L', 'Packs to buy', 'Purchase L', 'Surplus L'], ...result.products.map(s => [s.label, s.area, s.coats, s.coverage, s.waste, s.demand, s.stock, s.pack, s.packs, s.purchase, s.surplus]), [], ['Part', 'Length mm', 'Width mm', 'Thickness mm', 'Qty', 'Surfaces', 'Product A', 'Product B', 'Face area m2', 'Edge area m2', 'Total area m2'], ...result.rows.map(r => [r.label, r.length, r.width, r.thickness, r.qty, r.surfaces.join(' / '), r.products[0] ? project.products[0].label : '', r.products[1] ? project.products[1].label : '', r.faces, r.edges, r.area])];
  return lines.map(line => line.map(v => csvCell(typeof v === 'number' ? Number(v.toFixed(8)) : v)).join(',')).join('\r\n') + '\r\n';
}
