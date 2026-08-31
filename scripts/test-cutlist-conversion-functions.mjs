import assert from "node:assert/strict";
import { onRequest as redirectCutList } from "../functions/go/cutlist.js";
import { onRequest as recordConversion } from "../functions/api/conversion-event.js";

const redirect = redirectCutList({
  request: new Request("https://woodcuttool.com/go/cutlist/?source=Template%20Detail&placement=Hero"),
  env: { APPLE_PROVIDER_TOKEN: "123456" },
});

assert.equal(redirect.status, 302);
const destination = new URL(redirect.headers.get("location"));
assert.equal(destination.hostname, "apps.apple.com");
assert.equal(destination.searchParams.get("ct"), "template-detail");
assert.equal(destination.searchParams.get("pt"), "123456");
assert.equal(destination.searchParams.get("mt"), "8");

const accepted = await recordConversion({
  request: new Request("https://woodcuttool.com/api/conversion-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "calculator_complete",
      source: "Plywood Calculator",
      path: "/plywood-cut-calculator/",
      device: "desktop",
      details: {
        calculator: "plywood",
        sheets: 3,
        yield_percent: 87.4321,
      },
      timestamp: "2026-07-23T00:00:00.000Z",
    }),
  }),
});

assert.equal(accepted.status, 204);
assert.equal(accepted.headers.get("cache-control"), "no-store");

const trackedTopicAction = await recordConversion({
  request: new Request("https://woodcuttool.com/api/conversion-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "topic_action_click",
      source: "learn",
      path: "/learn/topics/layout-optimization/",
      device: "desktop",
      details: {
        cluster: "layout-optimization",
        source_route: "/learn/topics/layout-optimization/",
        placement: "topic-action-1",
        destination_type: "calculator",
        destination_route: "/plywood-cut-calculator/"
      }
    }),
  }),
});
assert.equal(trackedTopicAction.status, 204);

const unsafeDimension = await recordConversion({
  request: new Request("https://woodcuttool.com/api/conversion-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "calculator_complete",
      details: { calculator: "plywood", raw_measurements: "private project input" }
    }),
  }),
});
assert.equal(unsafeDimension.status, 400);

const rejected = await recordConversion({
  request: new Request("https://woodcuttool.com/api/conversion-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: "unknown_event" }),
  }),
});

assert.equal(rejected.status, 400);

console.log("CutList redirect attribution and privacy-safe conversion endpoint tests passed.");
