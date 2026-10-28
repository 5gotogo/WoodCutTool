import assert from "node:assert/strict";
import { deferStructuredData } from "./loading-hints.mjs";
import { sitemapContentSignature } from "./sitemap-content-signature.mjs";

const first = '<script id="article" type="application/ld+json">{"@type":"Article"}</script>';
const second = "<script type='application/ld+json'>[{}]</script>";
const executable = '<script defer src="/assets/site-navigation.js"></script>';
const html = `<html><head>\n<title>Plan</title>\n${first}\n${executable}\n${second}\n</head><body>\n<main><h1>Plan</h1></main>\n</body></html>`;
const result = deferStructuredData(html);
assert(result.indexOf(first) > result.indexOf("</main>"));
assert(result.indexOf(second) > result.indexOf(first));
assert(result.indexOf(executable) < result.indexOf("</head>"));
assert.equal(deferStructuredData(result), result, "Reruns must not duplicate schemas");
assert.equal(sitemapContentSignature(result), sitemapContentSignature(html));
assert.equal(deferStructuredData(html.replace("</main>", "")), html.replace("</main>", ""));
console.log("Structured data loading guards passed: exact objects, attributes, order, idempotence and editorial signature.");
