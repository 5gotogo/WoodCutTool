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

console.log("Sitemap signal tests passed.");
