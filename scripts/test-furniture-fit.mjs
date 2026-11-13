import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { emptyStop, evaluateStop, formatDimension, orientations, routeCsv, samplePlan, validPlan } from "../assets/furniture-fit-core.js";
import { chapters } from "./furniture-fit-data.mjs";

const plan = samplePlan();
assert.ok(validPlan(plan));
assert.deepEqual(plan.stops.map(stop => evaluateStop(plan, stop).status), ["clear", "clear", "clear", "review", "tight"]);
assert.deepEqual(evaluateStop(plan, plan.stops[2]).checks.map(check => check.reserve), [640, 700, 460]);
assert.deepEqual(evaluateStop(plan, plan.stops[4]).checks.map(check => check.reserve), [15, 20, -5]);
assert.equal(evaluateStop(plan, { ...plan.stops[0], orientation: "face" }).status, "blocked");
assert.equal(evaluateStop(plan, emptyStop()).status, "pending");
assert.equal(evaluateStop(plan, { ...plan.stops[0], width: 460 }).status, "clear");
assert.equal(evaluateStop(plan, { ...plan.stops[0], width: 440 }).status, "contact");
assert.equal(evaluateStop({ ...plan, allowance: 0 }, { ...plan.stops[0], width: 440 }).status, "contact");
assert.equal(evaluateStop({ ...plan, allowance: null }, plan.stops[0]).status, "pending");
assert.equal(evaluateStop({ ...plan, allowance: null }, { ...plan.stops[0], width: 430 }).status, "blocked");
assert.equal(new Set(Object.values(orientations).map(({ axes }) => axes.join(","))).size, 6);
assert.deepEqual(evaluateStop(plan, { ...plan.stops[2], orientation: "backEnd" }).checks.map(check => check.piece), [1480, 440, 920]);
assert.equal(formatDimension(25.4, "in"), "1");
assert.equal(formatDimension(null, "mm"), "");
assert.equal(formatDimension(0, "mm"), "0");
assert.equal(validPlan({ ...plan, width: -1 }), false);
assert.equal(validPlan({ ...plan, stops: [{ ...emptyStop(), kind: "constructor" }] }), false);
assert.equal(validPlan({ ...plan, stops: [{ ...emptyStop(), orientation: "diagonal" }] }), false);
assert.equal(validPlan({ ...plan, stops: Array(31).fill(emptyStop()) }), false);
assert.ok(validPlan({ ...plan, width: null, stops: [] }));
assert.match(routeCsv(plan), /"depth","440","455","15","-5","Below allowance"/);
assert.match(routeCsv(plan), /"Field review"/);
assert.match(routeCsv({ ...plan, name: ' =a"b' }), /^"' =a""b"/m);

const root = new URL("../", import.meta.url);
const hub = readFileSync(new URL("furniture-fit/index.html", root), "utf8");
for (const { slug } of chapters) {
  const route = "/furniture-fit/" + slug + "/";
  assert.ok(hub.includes('href="' + route + '"'));
  const html = readFileSync(new URL(route.slice(1) + "index.html", root), "utf8");
  assert.ok(html.includes('rel="canonical" href="https://woodcuttool.com' + route + '"'));
  assert.ok(html.includes('href="/furniture-fit/#planner"'));
  for (const [, target] of html.matchAll(/href="(\/(?!\/)[^"#?]*\/)(?:[#?][^"]*)?"/g)) {
    assert.ok(existsSync(new URL(target.slice(1) + "index.html", root)), target);
  }
}
console.log("Furniture Fit clearance, orientation, validation, CSV, and generated guide checks passed.");
