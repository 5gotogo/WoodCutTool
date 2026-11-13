import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assessSurvey, blankSurvey, display, emptyStation, exampleSurvey, surveyCsv, unitScale, validSurvey } from "../assets/built-in-scribe-core.js";
import { guides } from "./built-in-scribe-data.mjs";

const sample = exampleSurvey();
assert.ok(validSurvey(sample));
assert.ok(validSurvey(blankSurvey()));
const { min, max, range, required, reserve, status } = assessSurvey(sample);
assert.deepEqual([min, max, range, required, reserve, status], [33, 45, 12, 50, -2, "short"]);
assert.equal(assessSurvey({ ...sample, blank: 50 }).status, "covered");
assert.equal(assessSurvey({ ...sample, blank: 52 }).reserve, 2);
assert.equal(assessSurvey({ ...sample, trim: 0, uncertainty: 0 }).required, 45);
assert.equal(assessSurvey({ ...sample, trim: null }).status, "pending");
assert.equal(assessSurvey({ ...sample, stations: sample.stations.slice(0, -1) }).status, "pending");
assert.equal(assessSurvey({ ...sample, stations: [...sample.stations, { position: 721, gap: 20 }] }).status, "pending");
assert.equal(assessSurvey({ ...sample, stations: [...sample.stations, { position: 310, gap: 20 }] }).status, "pending");
assert.equal(assessSurvey({ ...sample, stations: [...sample.stations, { position: null, gap: 20 }] }).status, "pending");
assert.equal(assessSurvey({ ...sample, stations: [...sample.stations.toReversed(), emptyStation()] }).reserve, -2);
assert.equal(assessSurvey({ ...sample, length: 0 }).status, "pending");
assert.equal(validSurvey({ ...sample, stations: [null, null] }), false);
assert.equal(validSurvey({ ...sample, stations: Array(25).fill(emptyStation()) }), false);
assert.equal(validSurvey({ ...sample, blank: -1 }), false);
assert.equal(validSurvey({ ...sample, blank: Infinity }), false);
assert.equal(display(25.4, "in"), "1");
assert.ok(Math.abs(Number(display(720, "in")) * unitScale("in") - 720) < 1e-7);
assert.equal(surveyCsv(blankSurvey()), "");
assert.match(surveyCsv(sample), /"720","310","45","48","4","1","50","-2"/);
assert.match(surveyCsv({ ...sample, name: ' =a"b' }), /^"' =a""b"/m);

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const hub = read("built-in-scribe/index.html");
assert.equal(guides.length, 10);
assert.equal(new Set(guides.map(guide => guide.slug)).size, guides.length);
for (const { slug, related } of guides) {
  const path = "/built-in-scribe/" + slug + "/";
  assert.ok(hub.includes('href="' + path + '"'));
  const html = read(path.slice(1) + "index.html");
  assert.ok(html.includes('rel="canonical" href="https://woodcuttool.com' + path + '"'));
  assert.ok(html.includes('href="/built-in-scribe/#planner"'));
  assert.ok(html.includes('href="' + related[0] + '"'));
  assert.ok(existsSync(new URL(related[0].slice(1) + "index.html", root)), related[0]);
}
console.log("Cabinet scribing worksheet math, validation, CSV and ten generated guides passed.");
