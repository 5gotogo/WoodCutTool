import assert from 'node:assert/strict';
import { sampleProject, validateProject, calculateProject, exportCSV } from '../assets/glue-up-core.js';
let p = sampleProject(), r = calculateProject(p);
assert.equal(r.duration, 14); assert.equal(r.rows[0].start, 2); assert.equal(r.rows[1].start, 9.5);
assert.equal(r.rows[0].openMargin, 0.5); assert.equal(r.rows[0].totalMargin, 4.5);
assert.equal(r.fits, true); assert.equal(r.checks, false);
// Total time begins at first adhesive, and is not another window after mating.
p.rows[0].clamp = 7; r = calculateProject(p); assert.equal(r.rows[0].totalMargin, -0.5); assert.equal(r.rows[0].fits, false);
p = sampleProject(); p.rows[0].mate = 1.5; r = calculateProject(p); assert.equal(r.rows[0].status, 'At planning boundary');
p.rows[0].mate = 1.51; assert.equal(calculateProject(p).fits, false);
assert.ok(exportCSV(p).includes('"-0.')); assert.ok(!exportCSV(p).includes('"\'-0.'));
// Setup before first glue shifts both deadlines without consuming the open budget.
p = sampleProject(); p.rows[0].setup = 100; r = calculateProject(p); assert.equal(r.rows[0].openMargin, 0.5); assert.equal(r.rows[0].openDeadline, 103);
p.conditions = p.rehearsal = p.resources = true; assert.equal(calculateProject(p).checks, true);
p.rows[0].label = '=HYPERLINK("bad")'; assert.ok(exportCSV(p).includes('"\'=HYPERLINK(""bad"")"'));
for (const mutate of [p => p.open = NaN, p => p.total = 3, p => p.reserve = 4, p => p.rows = [], p => p.rows[0].spread = '2', p => p.rows[0].label = '', p => p.conditions = 1, p => p.rows[0].clamp = -1, p => p.product = 'unknown']) {
  p = sampleProject(); mutate(p); assert.throws(() => validateProject(p)); assert.throws(() => exportCSV(p));
}
assert.deepEqual(validateProject(JSON.parse(JSON.stringify(sampleProject()))), sampleProject());
p = sampleProject(); p.open = 5; assert.equal(validateProject(p).product, 'custom');
console.log('Glue-Up timing, serial schedule, boundary, validation and export checks passed.');
