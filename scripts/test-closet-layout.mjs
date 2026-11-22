import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { formatDimension, partsCsv, planCloset, presets } from "../assets/closet-layout-core.js";
import { examples, guides, stages } from "./closet-layout-data.mjs";

const sample = presets["reach-in"];
const plan = planCloset(sample);
assert.equal(plan.opening, 1810);
assert.equal(plan.panelBudget, 72);
assert.equal(plan.clearBudget, 1670);
assert.equal(plan.unallocated, 0);
assert.deepEqual(plan.bays.map(bay => bay.width), [620, 450, 600]);
assert.deepEqual(plan.parts.map(part => [part.quantity, part.length, part.depth, part.thickness]), [
  [4, 2100, 520, 18], [1, 618, 500, 18], [5, 448, 500, 18], [1, 598, 500, 18]
]);
assert.deepEqual(planCloset(presets["walk-in"]).bays.map(bay => bay.width), [700, 480, 590.5, 590.5]);
assert.deepEqual(planCloset(presets.linen).bays.map(bay => bay.width), [335, 475]);
assert.deepEqual(planCloset(presets["bypass-doors"]).bays.map(bay => bay.width), [700, 762]);
const single = { ...sample, bays: [{ type: "single", width: 1000, shelves: 0 }] };
assert.equal(planCloset(single).unallocated, 706);
assert.equal(planCloset(single).parts.length, 1);
assert.equal(planCloset({ ...single, bays: [{ ...single.bays[0], width: 1706 }] }).unallocated, 0);
assert.equal(planCloset({ ...single, bays: Array(8).fill({ type: "single", width: null, shelves: 0 }) }).parts[0].quantity, 9);
assert.deepEqual(planCloset({ ...sample, left: 0, right: 0, shelfGap: 0, setback: 0 }).parts[2], {
  part: "Bay 2 shelf blank", quantity: 5, length: 450, depth: 520, thickness: 18
});
for (const changes of [
  { widths: [0, 10, 10] }, { widths: [NaN, 10, 10] }, { widths: [10, 10, 10] }, { left: -1 },
  { maxHeight: 10 }, { maxDepth: 10 }, { thickness: 520 }, { height: 60 }, { setback: 520 },
  { shelfGap: 450 }, { left: 1800 }, { bays: [] }, { bays: Array(9).fill(sample.bays[0]) },
  { bays: [ { ...sample.bays[0], type: "unknown" } ] }, { bays: [ { ...sample.bays[0], width: 0 } ] },
  { bays: [ { ...sample.bays[0], shelves: 1.5 } ] }, { bays: [ { ...sample.bays[0], width: 9999 } ] }
]) assert.ok(planCloset({ ...sample, ...changes }).error, JSON.stringify(changes));

assert.equal(formatDimension(25.4, "in"), "1");
assert.match(partsCsv(plan.parts, "mm"), /Bay 2 shelf blank,5,448,500,18/);
assert.match(partsCsv(plan.parts, "in"), /^Part,Quantity,Length \(in\),Depth \(in\),Thickness \(in\)/);

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const hub = read("closet-layout/index.html");
assert.equal(guides.length, 18);
assert.deepEqual(stages.map(stage => guides.filter(guide => guide.stage === stage.id).length), [4, 5, 5, 4]);
assert.equal(examples.length, 4);
for (const item of [...guides, ...examples]) {
  const slug = item.slug ?? "example-" + item.key;
  const href = "/closet-layout/" + slug + "/";
  const page = read(href.slice(1) + "index.html");
  assert.ok(hub.includes(`href="${href}"`), href);
  assert.ok(page.includes(`rel="canonical" href="https://woodcuttool.com${href}"`), href);
  assert.ok(page.includes('id="field-check"'), href);
  if (item.slug) {
    const [label, target] = item.related;
    assert.ok(page.includes(`href="${target}"`), label);
    if (target.startsWith("/")) assert.ok(existsSync(new URL(target.slice(1) + "index.html", root)), target);
  } else {
    assert.ok(page.includes(`href="/closet-layout/?example=${item.key}#planner"`), href);
    assert.equal(read(href.slice(1) + "panels.csv"), partsCsv(planCloset(presets[item.key]).parts, "mm").replaceAll("\r\n", "\n"));
  }
}
console.log("Closet width budget, validation, CSV and 22 linked editorial pages passed.");
