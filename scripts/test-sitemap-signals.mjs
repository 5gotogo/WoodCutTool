import assert from "node:assert/strict";
import { sitemapContentSignature } from "./sitemap-content-signature.mjs";

const baseline = `<!doctype html><html><head>
  <title>Cabinet Cut List</title>
  <meta name="description" content="Plan a cabinet cut list.">
  <link rel="canonical" href="https://woodcuttool.com/example/">
  <link rel="stylesheet" href="/assets/styles.css?v=1">
  <script defer src="/assets/app.js?v=1"></script>
</head><body>
  <header class="site-header"><a href="/old-nav/">Old nav</a></header>
  <main><h1>Cabinet Cut List</h1><p>Plan the sheet layout before cutting.</p>
    <img src="/assets/example.webp" loading="lazy" decoding="async" fetchpriority="low" alt="Cut layout">
  </main>
  <footer class="site-footer">Old footer</footer>
</body></html>`;

const technicalRelease = baseline
  .replace("styles.css?v=1", "styles.css?v=2")
  .replace("app.js?v=1", "app.js?v=2")
  .replace("Old nav", "New nav")
  .replace("Old footer", "New footer")
  .replace('loading="lazy" decoding="async" fetchpriority="low"', 'loading="eager" decoding="sync" fetchpriority="high"');

assert.equal(
  sitemapContentSignature(technicalRelease),
  sitemapContentSignature(baseline),
  "technical asset, chrome, and loading-hint changes must not refresh sitemap lastmod"
);

assert.notEqual(
  sitemapContentSignature(baseline.replace("Plan the sheet layout before cutting.", "Plan, label, and verify every panel before cutting.")),
  sitemapContentSignature(baseline),
  "visible editorial changes must refresh sitemap lastmod"
);

assert.notEqual(
  sitemapContentSignature(baseline.replace("Plan a cabinet cut list.", "Build a cabinet cut list with sheet estimates.")),
  sitemapContentSignature(baseline),
  "meta description changes must refresh sitemap lastmod"
);

assert.notEqual(
  sitemapContentSignature(baseline.replace("/assets/example.webp", "/assets/revised-example.webp")),
  sitemapContentSignature(baseline),
  "page-specific image changes must refresh sitemap lastmod"
);

const photo = baseline.replace("/assets/example.webp", "/assets/images/woodworking/example.webp");
const encodedPhoto = photo.replace(/(<img[^>]*>)/, '<picture style="display:contents"><source type="image/avif" srcset="/assets/images/woodworking/example-480.avif 480w">$1</picture>')
  .replace("</head>", '<link rel="preconnect" href="https://is1-ssl.mzstatic.com"></head>');
assert.equal(sitemapContentSignature(encodedPhoto), sitemapContentSignature(photo), "photo encoding and image connections must not refresh lastmod");
const template = baseline.replace(/(<img[^>]*>)/, '<picture><source type="image/webp" srcset="/assets/images/templates/example.webp">$1</picture>');
const templateAvif = template.replace('<picture>', '<picture><source type="image/avif" srcset="/assets/images/templates/example-960.avif 960w">');
assert.equal(sitemapContentSignature(template), sitemapContentSignature(templateAvif), "additional template encoding must not refresh lastmod");
const compact = '<head><meta name="viewport" content="width=device-width"><title>Plan</title></head><main>Plan</main>';
const hinted = compact.replace('<title>', '\n  <link rel="preload" data-site-bootstrap as="script" href="/assets/site-chrome.js" fetchpriority="low"><title>');
assert.equal(sitemapContentSignature(compact), sitemapContentSignature(hinted), "bootstrap hint whitespace must not refresh compact pages");

console.log("Sitemap signal tests passed.");
