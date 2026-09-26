import assert from "node:assert/strict";
import { cleanOffcut, cleanPart, matchOffcut, rankedMatches } from "../assets/offcut-core.js";

const stock = cleanOffcut({ id: "a", label: "Rack A", material: "Plywood", thickness: 0.75, length: 20, width: 12, grain: true });
const wider = cleanOffcut({ id: "b", label: "Rack B", material: "Plywood", thickness: 0.75, length: 30, width: 20, grain: true });
const part = cleanPart({ material: "Plywood", thickness: 0.75, length: 18, width: 10, trim: 0.125, kerf: 0.125, rotate: true, grain: true });

assert.ok(stock && wider && part);
assert.equal(matchOffcut(stock, part)?.orientation, "As entered");
assert.equal(matchOffcut(stock, { ...part, thickness: 0.5 }), null);
assert.equal(matchOffcut({ ...stock, grain: false }, part), null);
assert.equal(matchOffcut(stock, { ...part, trim: 1 }), null);
assert.equal(matchOffcut({ ...stock, length: 12, width: 20 }, { ...part, grain: false })?.orientation, "Rotated 90°");
assert.equal(matchOffcut({ ...stock, length: 12, width: 20 }, part), null);
assert.deepEqual(rankedMatches([wider, stock], part).map((item) => item.id), ["a", "b"]);
assert.equal(cleanOffcut({ ...stock, width: 0 }), null);
assert.equal(cleanPart({ ...part, kerf: -1 }), null);
console.log("Offcut Planner geometry and validation checks passed.");
