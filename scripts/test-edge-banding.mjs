import assert from 'node:assert/strict';
import { sampleProject, validateProject, calculateProject, partsCsv, suppliesCsv, layoutProject } from '../assets/edge-banding-core.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
let p = sampleProject(), r = calculateProject(p);
assert.equal(r.valid, true);
assert.equal(r.count, 5);
assert.deepEqual([r.parts[0].sawLength, r.parts[0].sawWidth], [600, 299]);
assert.deepEqual([r.parts[1].sawLength, r.parts[1].sawWidth], [716, 396]);
close(r.supplies[0].net, 1800); close(r.supplies[0].allowance, 1920); close(r.supplies[0].purchase, 2112);
assert.equal(r.supplies[0].strips, 3);
assert.equal(r.supplies[1].strips, 8);
close(r.supplies[1].allowance, 4800); close(r.supplies[1].purchase, 5280);
assert.equal(r.supplies[1].rolls, 1);
// 0.5 mm on each banded edge: explicit saw and post-milling sizes.
p.settings.preMill = 0.5; r = calculateProject(p);
assert.deepEqual([r.parts[1].sawLength, r.parts[1].sawWidth, r.parts[1].substrateLength, r.parts[1].substrateWidth], [717, 397, 716, 396]);
assert.deepEqual([r.parts[0].sawLength, r.parts[0].sawWidth], [600, 299.5]);
// The same physical parts round-trip from blank basis with asymmetric edging.
p = sampleProject(); p.parts[0].edges = { left: 'A', right: 'B', top: 'B', bottom: '' };
r = calculateProject(p); assert.deepEqual([r.parts[0].sawLength, r.parts[0].sawWidth], [597, 298]);
const blank = structuredClone(p); blank.mode = 'blank'; blank.parts.forEach((v, i) => { v.length = r.parts[i].sawLength; v.width = r.parts[i].sawWidth; });
const roundTrip = calculateProject(blank);
assert.deepEqual(roundTrip.parts.map(v => [v.finishedLength, v.finishedWidth]), [[600, 300], [720, 400]]);
// No edging: no deduction, no milling, and zero supply demand.
p = sampleProject(); p.settings.preMill = 2; p.parts.forEach(v => { v.edges = { left: '', right: '', top: '', bottom: '' }; });
r = calculateProject(p); assert.deepEqual(r.supplies, []); assert.equal(r.parts[0].sawWidth, 300);
// Exports and handoff stop on geometry, width and individual roll errors.
for (const modify of [p => { p.parts[1].length = 3; }, p => { p.profiles[0].width = 19; }, p => { p.profiles[0].rollLength = 639; }]) {
  p = sampleProject(); modify(p); r = calculateProject(p); assert.equal(r.valid, false);
  for (const exportFn of [partsCsv, suppliesCsv, layoutProject]) assert.throws(() => exportFn(r), /Resolve/);
}
// Width boundary and roll division: equality passes and does not round to an extra roll.
p = sampleProject(); p.profiles[0].width = 20; p.settings.waste = 0; p.profiles[0].rollLength = 1920;
r = calculateProject(p); assert.equal(r.valid, true); assert.equal(r.supplies[0].rolls, 1);
// Grain and material groups survive the full supported receiving contract.
p = sampleProject(); p.parts[1].grain = false; p.settings.preMill = 0.5;
r = calculateProject(p); const transfer = layoutProject(r);
assert.equal(transfer.parts[0].allowRotate, false); assert.equal(transfer.parts[1].allowRotate, true);
assert.equal(transfer.parts[1].length, 717); assert.equal(transfer.parts[1].width, 397);
assert.equal(transfer.groups.length, 2); assert.equal(transfer.groups[0].kerf, 3.2); assert.equal(transfer.groups[0].trim, 10);
assert.equal(transfer.groups[0].sheetLength, 2440); assert.equal(transfer.groups[0].thickness, 18);
assert.equal(transfer.unit, 'mm'); assert.ok(transfer.exclusions[0].includes('Pre-milling is already included'));
// Inches are a display and export choice; the internal geometry remains canonical mm.
p.unit = 'in'; r = calculateProject(p);
assert.equal(r.parts[1].sawLength, 717); assert.ok(partsCsv(r).includes('"28.228346"'));
// Reversed profile input normalizes A/B CSV definitions; untrusted names are safe cells.
p = sampleProject(); p.profiles.reverse(); p.parts[0].label = '=HYPERLINK("bad")';
r = calculateProject(p); assert.equal(r.project.profiles[0].id, 'A');
assert.ok(partsCsv(r).includes('"\'=HYPERLINK(""bad"")"')); assert.ok(suppliesCsv(r).includes('Length-based lower bound'));
// Reject malformed backups, non-finite numbers, fractional quantities and unknown constraints.
for (const modify of [p => { p.version = 2; }, p => { p.parts[0].qty = 0.5; }, p => { p.parts[0].qty = 500; }, p => { p.parts[0].length = NaN; }, p => { p.parts[0].edges.left = 'C'; }, p => { p.parts[0].joinery = 'ignored'; }, p => { p.profiles[1].id = 'A'; }, p => { p.settings.sheetTrim = 700; }, p => { p.settings.endTrim = -1; }, p => { p.parts[0].material = ' '; }]) {
  const invalid = sampleProject(); modify(invalid); assert.throws(() => validateProject(invalid));
}
const original = sampleProject(); calculateProject(original); assert.deepEqual(original, sampleProject());
console.log('Edge banding checks passed: geometry, pre-milling, supplies, units, invalid backups, CSV and layout handoff.');
