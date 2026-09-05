import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { validateProject, componentHandoff, convertProject, calculateProject, cutListCsv } from '../assets/cut-handoff-model.js';
import { pilotProjects } from './cut-handoff-data.mjs';
import { openConversionDb } from './local-conversion-db.mjs';
import { onRequest as eventRequest } from '../functions/api/conversion-event.js';
import { onRequest as reportRequest } from '../functions/api/conversion-report.js';
import { aggregateRecord } from '../functions/lib/conversion-daily.js';
const app = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(app.slice(app.indexOf('function summarizeParts('), app.indexOf('function optimizeLinearCuts(')) + app.slice(app.indexOf('function packSheets('), app.indexOf('function drawSheet(')), context);
const pack = context.packSheets;
for (const pilot of pilotProjects) {
  const result = calculateProject(pilot, pack);
  assert.equal(result.complete, true, pilot.scenario);
  const count = result.groups.reduce((n, g) => n + g.plan.sheets.reduce((n, sheet) => n + sheet.placements.length, 0), 0);
  assert.equal(count, pilot.parts.reduce((n, p) => n + p.qty, 0));
  assert.equal(calculateProject(convertProject(pilot, 'mm'), pack).sheets, result.sheets);
  const roundtrip = convertProject(convertProject(pilot, 'mm'), 'in');
  assert.ok(Math.abs(roundtrip.parts[0].length - pilot.parts[0].length) < 1e-9);
  assert.ok(cutListCsv(pilot, result).includes('layout_status'));
  for (const g of result.groups) for (const sheet of g.plan.sheets) {
    for (const p of sheet.placements) {
      assert.equal(p.group, g.group.id);
      assert.equal(p.rotated, false);
      assert.ok(p.x >= 0 && p.y >= 0 && p.x + p.w <= g.width + 1e-9 && p.y + p.h <= g.length + 1e-9);
      for (const q of sheet.placements) if (p !== q) assert.ok(p.x + p.w <= q.x || q.x + q.w <= p.x || p.y + p.h <= q.y || q.y + q.h <= p.y, 'panels overlap');
    }
  }
}
const componentPart = { name: 'Shelf', quantity: 2, thickness: .75, length: 30, width: 12, materialGroup: 'Shelf panel', grain: 'Lengthwise' };
const component = componentHandoff([{ parts: [componentPart, { ...componentPart, thickness: .5 }] }]);
assert.equal(component.groups.length, 2);
assert.equal(component.parts[0].allowRotate, false);
assert.throws(() => componentHandoff([{ parts: [{ ...componentPart, grain: 'Vertical' }] }]));
assert.throws(() => componentHandoff([{ parts: [{ ...componentPart, materialGroup: 'Face-frame stock' }] }]));
const modified = () => structuredClone(pilotProjects[0]);
let p = modified(); p.parts[0].length = 1000; assert.equal(calculateProject(p, pack).complete, false);
p = modified(); p.parts[0].qty = 1.5; assert.throws(() => validateProject(p));
p = modified(); p.parts[0].length = NaN; assert.throws(() => validateProject(p));
p = modified(); p.parts[0].qty = 501; assert.throws(() => validateProject(p));
p = modified(); p.groups[0].trim = 24; assert.throws(() => validateProject(p));
p = modified(); p.parts[0].grainAxis = 'width'; assert.throws(() => validateProject(p), /constraints/);
p = modified(); p.parts[0].group = 'missing'; assert.throws(() => validateProject(p));
p = modified(); p.parts[0].label = '=HYPERLINK("bad")'; assert.ok(cutListCsv(p, calculateProject(p, pack)).includes("'=HYPERLINK"));
let orientation = pack([{ label: 'Locked', length: 40, width: 60, qty: 1, allowRotate: false }], 96, 48, .125, true);
assert.equal(orientation.rejected.length, 1);
orientation = pack([{ label: 'Free', length: 40, width: 60, qty: 1, allowRotate: true }], 96, 48, .125, true);
assert.equal(orientation.rejected.length, 0);
// Generated payloads must match source and cannot disappear on a future rebuild.
for (const [route, scenario] of [['examples/bookshelf-cut-list', 'bookshelf'], ['examples/base-cabinet-cut-list', 'base-cabinet'], ['templates/garage-shelving-cut-list', 'garage-shelves']]) {
  const html = readFileSync(new URL(`../${route}/index.html`, import.meta.url), 'utf8');
  const match = html.match(/<script type="application\/json" data-handoff-payload>(.*?)<\/script>/s);
  assert.ok(match, route);
  const payload = validateProject(JSON.parse(match[1]));
  assert.deepEqual(payload, pilotProjects.find(p => p.scenario === scenario));
}
const db = openConversionDb();
const env = { CONVERSION_DB: db, CONVERSION_REPORT_TOKEN: 'test-only' };
const today = new Date().toISOString().slice(0, 10);
function event(name, details = {}, overrides = {}, options = {}) {
  return eventRequest({ env: options.env || env, request: new Request('https://woodcuttool.com/api/conversion-event', {
    method: 'POST', headers: { 'content-type': 'application/json', ...options.headers },
    body: JSON.stringify({ event: name, path: '/plywood-cut-calculator/', device: 'desktop', timestamp: '2000-01-01T00:00:00Z', details: { scenario: 'bookshelf', ...details }, ...overrides }),
  }) });
}
for (const [name, details] of [['example_open', {}], ['calculator_import', {}], ['calculator_submit', { calculator: 'plywood' }], ['calculator_complete', { calculator: 'plywood', result_class: 'complete' }], ['cut_list_export', { format: 'csv' }], ['cta_impression', { source: 'plywood-result' }], ['app_store_click', { source: 'plywood-result', placement: 'plywood-result' }]]) assert.equal((await event(name, details)).status, 204);
await Promise.all(Array.from({ length: 20 }, () => event('cut_list_export', { format: 'json' })));
assert.equal((await event('example_open', {}, { path: '/private-person/' })).status, 400);
assert.equal((await event('example_open', {}, { path: '/plywood-cut-calculator/?email=secret' })).status, 400);
assert.equal((await event('example_open', { scenario: 'customer-name' })).status, 400);
assert.equal((await event('example_open', { notes: 'secret' })).status, 400);
assert.equal((await event('example_open', {}, {}, { headers: { DNT: '1' } })).status, 204);
assert.equal((await event('example_open', {}, {}, { headers: { Origin: 'https://evil.test' } })).status, 403);
assert.equal((await event('example_open', {}, { extra: 'x'.repeat(5000) })).status, 413);
assert.equal((await event('toString')).status, 400);
assert.equal((await event('example_open', {}, {}, { env: {} })).status, 503);
assert.equal((await event('example_open', {}, {}, { env: { CONVERSION_DB: { prepare() { throw new Error('offline'); } } } })).status, 503);
assert.equal(aggregateRecord({ path: '/', event: 'example_open', details: {}, device: 'a-private-device' }).device, 'unknown');
async function report(query = '', authorization = 'Bearer test-only', reportEnv = env) {
  return reportRequest({ env: reportEnv, request: new Request(`https://woodcuttool.com/api/conversion-report?from=${today}&to=${today}${query}`, { headers: { authorization } }) });
}
assert.equal((await report('', '')).status, 401);
assert.equal((await report('', 'Bearer test-only', {})).status, 503);
assert.equal((await reportRequest({ env, request: new Request('https://woodcuttool.com/api/conversion-report?from=2026-02-30&to=2026-03-01', { headers: { authorization: 'Bearer test-only' } }) })).status, 400);
const json = await (await report()).json();
assert.equal(json.rows.find(r => r.event === 'cut_list_export').count, 21);
assert.ok(json.rows.every(r => r.date === today));
assert.equal(json.summary[0].completionPerSubmit, 1);
assert.equal(json.summary[0].exportPerCompletion, 21);
assert.equal(json.summary[0].resultAppClickPerImpression, 1);
assert.ok(!(await (await report('&format=csv')).text()).includes('notes'));
db.close();
console.log('P0 checks passed: 3 pilots, units, groups, orientation, geometry, invalid inputs, CSV safety, daily SQL, privacy, DNT, report authentication and ratios.');
