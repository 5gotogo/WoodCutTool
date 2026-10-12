import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

if (process.argv.includes("--prepare")) {
  const fixture = mkdtempSync(join(tmpdir(), "wct-delivery-"));
  const source = new URL("../", import.meta.url);
  for (const file of ["_routes.json", "_redirects", "_headers", "index.html", "404.html", "wood/oak/index.html", "learn/material-substitution-approval-workflow/index.html", "crown-molding-angle-calculator/index.html", "legal/TileFit/privacy/index.html", "assets/wood-page.js"]) {
    const target = join(fixture, file);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(new URL(file, source), target);
  }
  cpSync(new URL("functions", source), join(fixture, "functions"), { recursive: true });
  const middleware = join(fixture, "functions/_middleware.js");
  writeFileSync(join(fixture, "functions/lib/original-middleware.js"), readFileSync(middleware));
  writeFileSync(middleware, `import { onRequest as realMiddleware } from "./lib/original-middleware.js";
export async function onRequest(context) {
  // Localhost-only adapter for the real production hostname condition.
  const url = new URL(context.request.url);
  if (context.request.headers.get("x-wct-test-host")) url.hostname = context.request.headers.get("x-wct-test-host");
  const response = await realMiddleware({ ...context, request: new Request(url, context.request) });
  const marked = new Response(response.body, response);
  marked.headers.set("x-wct-test-function", "invoked");
  return marked;
}
`);
  console.log(fixture);
  process.exit(0);
}

// Run against an isolated Pages fixture whose middleware adds this marker.
// Do not install the marker in production: it exists only to prove invocation.
const origin = process.env.WCT_DELIVERY_FIXTURE_ORIGIN || "http://127.0.0.1:4201";
const rows = [];
async function request(path, options = {}) {
  const response = await fetch(origin + path, { redirect: "manual", ...options });
  rows.push({ path, status: response.status, functionInvoked: response.headers.get("x-wct-test-function"), location: response.headers.get("location") });
  return response;
}
for (const path of ["/wood/oak/", "/learn/material-substitution-approval-workflow/", "/crown-molding-angle-calculator/", "/legal/TileFit/privacy/", "/assets/wood-page.js"]) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("x-wct-test-function"), null, `${path}: static delivery must bypass middleware`);
  assert(response.headers.get("etag"), `${path}: static asset validator missing`);
  const repeated = await request(path, { headers: { "If-None-Match": response.headers.get("etag") } });
  assert.equal(repeated.status, 304, path);
}
const root = await request("/");
assert.equal(root.status, 200);
assert.equal(root.headers.get("x-wct-test-function"), "invoked");
const invalid = await request("/?q=%7Bsearch_term_string%7D", { headers: { "x-wct-test-host": "woodcuttool.com" } });
assert.equal(invalid.status, 410);
assert.equal(invalid.headers.get("x-robots-tag"), "noindex");
assert.equal(invalid.headers.get("x-wct-test-function"), "invoked");
for (const path of ["/api/conversion-event", "/api/conversion-event/"]) {
  const response = await request(path, { method: "POST", headers: { DNT: "1" } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("x-wct-test-function"), "invoked");
}
const report = await request("/api/conversion-report");
assert.equal(report.status, 503); // Fixture intentionally has no report secret.
assert.equal(report.headers.get("x-wct-test-function"), "invoked");
for (const path of ["/go/cutlist?source=test", "/go/cutlist/?source=test"]) {
  const response = await request(path);
  assert.equal(response.status, 302);
  assert.equal(new URL(response.headers.get("location")).hostname, "apps.apple.com");
  assert.equal(new URL(response.headers.get("location")).searchParams.get("ct"), "test");
  assert.equal(response.headers.get("x-wct-test-function"), "invoked");
}
for (const [path, destination] of [["/tools/crown-molding-angle-calculator/", "/crown-molding-angle-calculator/"], ["/wood/oak/index.html", "/wood/oak/"], ["/index.html", "/"]]) {
  const response = await request(path + "?source=test");
  assert.equal(response.status, 301);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, destination);
  assert.equal(new URL(response.headers.get("location"), origin).searchParams.get("source"), "test");
  assert.equal(response.headers.get("x-wct-test-function"), null);
}
const missing = await request("/missing-page-for-delivery-test/");
assert.equal(missing.status, 404);
assert.equal(missing.headers.get("x-wct-test-function"), null);
writeFileSync(process.env.WCT_DELIVERY_OUTPUT || "/tmp/wct-pages-delivery.json", JSON.stringify({ origin, rows }, null, 2) + "\n");
console.log(`Passed ${rows.length} official Pages fixture requests: static/304 bypass, root/410, API/go handlers, aliases and 404.`);
