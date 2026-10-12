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
for (const path of ["/", "/wood/oak/", "/blog/", "/learn/sheet-good-edge-quality-acceptance/", "/crown-molding-angle-calculator/", "/404.html"]) {
  assert.equal(invokes(path), true, `Keep HTML canonical redirect middleware: ${path}`);
  const response = await onRequest({ request: new Request(`https://www.woodcuttool.com${path}?source=test`), next() { throw new Error("www must redirect before static handling"); } });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), `https://woodcuttool.com${path}?source=test`);
}
const invalid = await onRequest({ request: new Request("https://woodcuttool.com/?q=%7Bsearch_term_string%7D"), next() { throw new Error("Invalid template URL must stay gone"); } });
assert.equal(invalid.status, 410);
assert.equal(invalid.headers.get("x-robots-tag"), "noindex");
const sentinel = new Response("static HTML");
assert.equal(await onRequest({ request: new Request("https://woodcuttool.com/wood/oak/"), next: () => sentinel }), sentinel);
console.log("Pages routing guards passed: static resources bypass Functions; HTML canonical redirects, template 410 and endpoint invocation remain.");
