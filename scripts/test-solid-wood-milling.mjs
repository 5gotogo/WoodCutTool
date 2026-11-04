import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { plan, sample } from "../assets/solid-wood-milling-core.js";
import { chapters } from "./solid-wood-milling-data.mjs";

const example = plan(sample);
assert.deepEqual(example, {
  blankLength: 450, blankWidth: 73, usableLength: 1740, usableWidth: 160,
  cleanThickness: 26, thicknessMargin: 2, lengthRemainder: 381, widthRemainder: 8,
  positions: 3, lanes: 2, candidates: 6, yieldCount: 6, shortfall: 0, surplus: 2
});
const narrower = plan({ ...sample, edges: 30 });
assert.equal(narrower.yieldCount, 3);
assert.equal(narrower.shortfall, 1);
const thin = plan({ ...sample, removal: 9 });
assert.equal(thin.candidates, 6);
assert.equal(thin.yieldCount, 0);
assert.equal(thin.shortfall, 4);
assert.equal(plan({ ...sample, removal: 8 }).yieldCount, 6);
assert.equal(plan({ ...sample, length: 1419, width: 172 }).yieldCount, 6);
assert.equal(plan({ ...sample, length: 1418.999, width: 172 }).yieldCount, 4);
assert.equal(plan({ ...sample, length: 1418.999, width: 172, kerf: 0 }).yieldCount, 6);
assert.equal(plan({ ...sample, width: 20 }).yieldCount, 0);
assert.throws(() => plan({ ...sample, width: 19 }), /loss/);
assert.throws(() => plan({ ...sample, kerf: 0.0001 }), /decimal/);
assert.throws(() => plan({ ...sample, partLength: NaN }), /part length/);
assert.throws(() => plan({ ...sample, quantity: 1.5 }), /whole number/);
assert.equal(plan({
  unit: "in", length: 6.3, width: 2.2, thickness: 1,
  partLength: 2, partWidth: 1, partThickness: 0.75, quantity: 6,
  ends: 0, edges: 0, removal: 0.25, extraLength: 0, extraWidth: 0, kerf: 0.1
}).yieldCount, 6);
assert.equal(new Set(chapters.map((chapter) => chapter.slug)).size, 8);
for (const chapter of chapters) {
  assert.equal(chapter.sections.length, 3);
  assert.ok(existsSync(new URL(`..${chapter.link.split("#")[0]}index.html`, import.meta.url)), chapter.link);
}
console.log("Solid Wood Milling arithmetic and editorial link checks passed.");
