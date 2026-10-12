import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { onRequest } from "../functions/_middleware.js";

const config = JSON.parse(readFileSync(new URL("../_routes.json", import.meta.url), "utf8"));
assert.equal(config.version, 1);
assert(config.include.length + config.exclude.length <= 100);
function matches(pattern, path) {
  return new RegExp(`^${pattern.split("*").map(part => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`).test(path);
}
function invokes(path) {
  return config.include.some(pattern => matches(pattern, path)) && !config.exclude.some(pattern => matches(pattern, path));
}
for (const path of ["/assets/home.js", "/assets/images/tools/tools-measurement.webp", "/assets/blog-translations/index.json", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/feed.xml", "/site.webmanifest"]) assert.equal(invokes(path), false, path);
// Include every current endpoint, including trailing-slash forms. A new handler
// must not silently become a static route when invocation rules are narrowed.
for (const file of readdirSync(new URL("../functions", import.meta.url), { recursive: true })) {
  if (!/^(?:api|go)\/.+\.js$/.test(file)) continue;
  const path = "/" + file.replace(/\.js$/, "");
  assert(invokes(path) && invokes(path + "/"), path);
}
// Every generated page except the root must be served without a Function.
// Keep this exhaustive so new page families cannot regress to worker delivery.
const root = new URL("../", import.meta.url);
let staticPages = 0;
for (const file of readdirSync(root, { recursive: true })) {
  if (!file.endsWith(".html") || /^(?:node_modules|\.git|\.codex|\.agents)\//.test(file)) continue;
  const path = file === "index.html" ? "/" : "/" + file.replace(/index\.html$/, "");
  assert.equal(invokes(path), path === "/", path);
  if (path !== "/") staticPages++;
}
const redirects = readFileSync(new URL("../_redirects", import.meta.url), "utf8")
  .split("\n").map(line => line.trim()).filter(line => line && !line.startsWith("#"));
assert(redirects.every(line => line.split(/\s+/)[0].startsWith("/")), "Pages does not support domain-level redirect sources");
const edgeRedirect = JSON.parse(readFileSync(new URL("../config/cloudflare-canonical-redirect.json", import.meta.url), "utf8"));
assert.equal(edgeRedirect.phase, "http_request_dynamic_redirect");
const [canonical] = edgeRedirect.rules;
assert.equal(canonical.expression, '(http.host eq "www.woodcuttool.com")');
assert.equal(canonical.action, "redirect");
assert.equal(canonical.enabled, true);
assert.deepEqual(canonical.action_parameters.from_value, {
  status_code: 301,
  target_url: { expression: 'concat("https://woodcuttool.com", http.request.uri.path)' },
  preserve_query_string: true,
});
assert(redirects.includes("/index.html / 301"));
assert(redirects.includes("/*/index.html /:splat/ 301"));
assert(readFileSync(new URL("../404.html", import.meta.url), "utf8").includes("<title>"), "Keep a real 404 instead of Pages SPA fallback");
for (const path of ["/", "/api/conversion-event", "/go/cutlist/"]) {
  assert.equal(invokes(path), true, `Keep dynamic middleware: ${path}`);
  const response = await onRequest({ request: new Request(`https://www.woodcuttool.com${path}?source=test`), next() { throw new Error("www must redirect before static handling"); } });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), `https://woodcuttool.com${path}?source=test`);
}
const invalid = await onRequest({ request: new Request("https://woodcuttool.com/?q=%7Bsearch_term_string%7D"), next() { throw new Error("Invalid template URL must stay gone"); } });
assert.equal(invalid.status, 410);
assert.equal(invalid.headers.get("x-robots-tag"), "noindex");
const sentinel = new Response("static HTML");
assert.equal(await onRequest({ request: new Request("https://woodcuttool.com/wood/oak/"), next: () => sentinel }), sentinel);
console.log(`Pages routing guards passed: ${staticPages} HTML paths and static resources bypass Functions; edge redirect manifest, dynamic www redirects, template 410 and endpoint invocation validated.`);
