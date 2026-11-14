import assert from "node:assert/strict";
import { onRequest as redirectAppStore } from "../functions/go/app-store.js";
import { onRequest as redirectCutList } from "../functions/go/cutlist.js";
import { onRequest as recordConversion } from "../functions/api/conversion-event.js";

import { openConversionDb } from "./local-conversion-db.mjs";
const db = openConversionDb();
const redirect = await redirectCutList({
  request: new Request("https://woodcuttool.com/go/cutlist/?source=Template%20Detail&placement=Hero"),
  env: { APPLE_PROVIDER_TOKEN: "123456" },
});

assert.equal(redirect.status, 302);
const destination = new URL(redirect.headers.get("location"));
assert.equal(destination.hostname, "apps.apple.com");
assert.equal(destination.searchParams.get("ct"), "template-detail");
assert.equal(destination.searchParams.get("pt"), "123456");
assert.equal(destination.searchParams.get("mt"), "8");

const chinaRequest = new Request("https://woodcuttool.com/go/cutlist/?source=app-page");
chinaRequest.cf = { country: "CN" };
const productParams = new URLSearchParams({ product: "/us/app/id6812760878", query: "?uo=4" });
const productRequest = new Request(`https://woodcuttool.com/go/app-store/?${productParams}`);
const originalFetch = globalThis.fetch;
let probeStatus = 200;
const probes = [];
try {
  globalThis.fetch = async (url) => {
    probes.push(url.href);
    if (probeStatus === null) throw new Error("Network unavailable");
    return new Response("Apple", { status: probeStatus });
  };
  for (const [status, storefront] of [[200, "cn"], [404, "us"], [503, "cn"], [null, "cn"]]) {
    probeStatus = status;
    productRequest.cf = { country: "CN" };
    const response = await redirectAppStore({ request: productRequest });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), `https://apps.apple.com/${storefront}/app/id6812760878?uo=4`);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }

  probeStatus = 404;
  const chinaCutList = await redirectCutList({ request: chinaRequest, env: {} });
  const cutListDestination = new URL(chinaCutList.headers.get("location"));
  assert.equal(cutListDestination.pathname, "/us/app/cutlist-plywood-optimizer/id6768171871");
  assert.equal(cutListDestination.searchParams.get("ct"), "app-page");

  for (const country of ["HK", "US"]) {
    productRequest.cf = { country };
    const response = await redirectAppStore({ request: productRequest });
    assert.equal(response.headers.get("location"), "https://apps.apple.com/us/app/id6812760878?uo=4");
  }
  const ductLabRequest = new Request("https://woodcuttool.com/go/app-store/?product=/us/app/ductlab-hvac-duct-layout/id6804225465");
  ductLabRequest.cf = { country: "CN" };
  const ductLabChinaUrl = "https://apps.apple.com/cn/app/ductlab-%E9%A3%8E%E7%AE%A1%E6%94%BE%E6%A0%B7%E4%B8%8E%E4%BC%B0%E7%AE%97/id6804225465";
  probeStatus = 200;
  const ductLabRedirect = await redirectAppStore({ request: ductLabRequest });
  assert.equal(ductLabRedirect.status, 302);
  assert.equal(ductLabRedirect.headers.get("location"), ductLabChinaUrl);
  assert.deepEqual(probes, [
    ...Array(4).fill("https://apps.apple.com/cn/app/id6812760878"),
    "https://apps.apple.com/cn/app/cutlist-plywood-optimizer/id6768171871",
    ductLabChinaUrl,
  ]);
} finally {
  globalThis.fetch = originalFetch;
}

const invalidProduct = new Request("https://woodcuttool.com/go/app-store/?product=//example.com");
assert.equal(redirectAppStore({ request: invalidProduct }).status, 400);

const accepted = await recordConversion({
  env: { CONVERSION_DB: db },
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
  env: { CONVERSION_DB: db },
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
  env: { CONVERSION_DB: db },
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
  env: { CONVERSION_DB: db },
  request: new Request("https://woodcuttool.com/api/conversion-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: "unknown_event" }),
  }),
});

assert.equal(rejected.status, 400);

console.log("CutList redirect attribution and privacy-safe conversion endpoint tests passed.");

db.close();
