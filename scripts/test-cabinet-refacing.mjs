import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calculateFronts, sample, scheduleCsv } from "../assets/cabinet-refacing-core.js";
import { chapters } from "./cabinet-refacing-data.mjs";

const pair = calculateFronts(sample);
assert.equal(pair.width, 624);
assert.deepEqual(pair.leaves, [
  { name: "Left", x: -12, y: -10, width: 310.5, height: 718 },
  { name: "Right", x: 301.5, y: -10, width: 310.5, height: 718 }
]);

const inset = calculateFronts({
  ...sample, mode: "inset", layout: "single", width: 400, height: 600, left: 2, right: 3, top: 2, bottom: 3, gap: NaN
});
assert.deepEqual(inset.leaves, [{ name: "Single", x: 2, y: 2, width: 395, height: 595 }]);
assert.equal(inset.record.gap, 0);

const fractional = calculateFronts({
  ...sample, unit: "in", width: 23.3333, height: 25, left: 0.5, right: 0.5, top: 0.25, bottom: 0.25, gap: 0.125
});
assert.equal(fractional.leaves[0].width, 12.10415);
assert.equal(fractional.leaves[0].height, 25.5);

for (const patch of [
  { label: " " }, { mode: "auto" }, { width: NaN }, { width: "600" }, { left: -0.001 },
  { width: 10000.001 }, { width: 1.00001 }, { mode: "inset", left: 600 }, { gap: 624 }, { gap: 0 }
]) {
  assert.ok(calculateFronts({ ...sample, ...patch }).error, JSON.stringify(patch));
}

const csv = scheduleCsv([sample, { ...inset.record, label: '=LEFT("A")' }]);
const lines = csv.trimEnd().split("\r\n");
assert.equal(lines.length, 4);
assert.match(lines[1], /^"B03","Left","mm","overlay",.*,"310.5","718","Mock-up required"$/);
assert.match(lines[2], /^"B03","Right","mm","overlay",.*,"310.5","718","Mock-up required"$/);
assert.match(lines[3], /^"'=LEFT\(""A""\)","Single","mm","inset",.*,"395","595","Mock-up required"$/);

const routes = ["/cabinet-refacing/", ...chapters.map(({ slug }) => `/cabinet-refacing/${slug}/`)];
assert.equal(routes.length, 9);
assert.equal(new Set(routes).size, routes.length);
for (const route of routes) {
  const html = readFileSync(new URL(".." + route + "index.html", import.meta.url), "utf8");
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, route);
  assert.ok(html.includes('rel="canonical" href="https://woodcuttool.com' + route + '"'), route);
}
console.log("Cabinet refacing geometry, schedule CSV and published routes passed.");
