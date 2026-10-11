import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPECIES, SOURCE, sampleProject, calculate, validateProject, unitFactor, exportCSV } from '../assets/wood-movement-core.js';
import { movementGuides } from './wood-movement-data.mjs';
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
// Independently transcribed 2021 Table 13-5 entries. In particular, avoid 2010 commercial-oak values.
assert.deepEqual(SPECIES.map(s => [s.id, s.radial, s.tangential]), [
  ['white-oak', 0.00194, 0.00376], ['red-oak', 0.00137, 0.00304],
  ['sugar-maple', 0.00165, 0.00353], ['black-walnut', 0.00190, 0.00274],
  ['black-cherry', 0.00126, 0.00248], ['yellow-poplar', 0.00158, 0.00289],
  ['eastern-white-pine', 0.00071, 0.00212], ['coast-douglas-fir', 0.00165, 0.00267],
]);
const p = sampleProject();
let r = calculate(p).rows[0];
near(r.dryWidth, 595.488); near(r.wetWidth, 609.024); near(r.swing, 13.536);
near(r.wetChange, 9.024); near(r.wetGap, 2.976); near(r.reserveBalance, 0.976);
near(r.wetTravel, 4.512); near(r.dryTravel, 2.256);
const edge = calculate({ ...p, anchor: 'edge' }).rows[0]; near(edge.wetTravel, 9.024);
const radial = calculate({ ...p, direction: 'radial' }).rows[0]; near(radial.swing, 6.984);
const both = calculate({ ...p, direction: 'both' }); assert.equal(both.rows.length, 2);
near(both.rows[0].swing, radial.swing); near(both.rows[1].swing, r.swing);
near(calculate({ ...p, width: 1200 }).rows[0].swing, 2 * r.swing);
near(calculate({ ...p, current: p.high }).rows[0].wetTravel, 0);
near(calculate({ ...p, current: p.low }).rows[0].dryTravel, 0);
r = calculate({ ...p, low: 10, high: 10, current: 10 }).rows[0]; near(r.swing, 0); near(r.dryWidth, 600);
assert.ok(calculate({ ...p, opening: 600 }).rows[0].reserveBalance < 0);
for (const current of [6, 14]) calculate({ ...p, low: 6, high: 14, current });
for (const [key, values] of Object.entries({ width: [0, -1, NaN, Infinity, '600', null, 10001], current: [5.999, 14.001, 13, NaN], low: [5, 11, 15], high: [5, 7, 15], reserve: [-1, 1001], opening: [0, Infinity, 20001], species: ['oak', '__proto__'], unit: ['cm'], direction: ['longitudinal'], anchor: ['floating'], version: [2], label: [null, 'a'.repeat(121)], notes: ['a'.repeat(2001)] })) {
  for (const value of values) assert.throws(() => calculate({ ...p, [key]: value }), `${key}: ${value}`);
}
near((p.width / unitFactor('in')) * unitFactor('in'), p.width);
assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))), p);
assert.equal(Object.hasOwn(validateProject({ ...p, extra: 'discard me' }), 'extra'), false);
const csv = exportCSV({ ...p, direction: 'both', label: '=HYPERLINK("x")', notes: ' @SUM(A1)\nquoted,"text"' });
assert.ok(csv.includes("'=HYPERLINK")); assert.ok(csv.includes("' @SUM")); assert.ok(csv.includes(SOURCE)); assert.equal(csv.split('FPL-GTR-282 Table').length - 1, 2);
assert.equal(readFileSync('wood-movement/example-review.csv', 'utf8'), exportCSV(p).replaceAll('\r\n', '\n'));
for (const guide of movementGuides) {
  const html = readFileSync(`wood-movement/${guide.slug}/index.html`, 'utf8');
  const words = guide.sections.map(([, text]) => text).join(' ').split(/\s+/).length;
  assert.ok(words >= 550, `${guide.slug}: substantive guide required (${words})`);
  assert.ok(html.includes('href="/about/"')); assert.ok(html.includes('name="twitter:card"'));
}
console.log('Wood movement: source entries, endpoint arithmetic, travel, units, validation, exports and guide checks passed.');
