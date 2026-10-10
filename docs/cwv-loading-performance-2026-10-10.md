# Screenshot route LCP improvements — 2026-10-10

The screenshot shows a 12-hour window with 81% good / 6% needs improvement / 13% poor LCP. Its individual route samples are small, and the labels are truncated. The Baltic birch label is measured as `/compare/baltic-birch-vs-plywood/`; `/compare/baltic-birch-vs-cabinet-grade-plywood/` also exists, and both receive the same family improvements. This is a plausible route match, not access to the underlying analytics export.

Read-only production checks confirmed that Paulownia and Khaya already serve the previous inline Wood stylesheet. These pages were fast in local tests; the screenshot alone does not establish why their field samples were poor. A production fetch used Brotli through the SEA edge; that single observation does not represent users in other regions or devices. No deployment was performed.

## Changes

- Compile a separate 35,836-byte Compare stylesheet rather than requesting the 67,504-byte combined Blog/Compare stylesheet. Inline the complete styles on all 76 Compare pages, preserving mobile, desktop, menu and language states. Give optional language/conversion scripts low request priority. Existing Blog and App bundles remain byte-identical.
- Connect existing 800-pixel image assets on Compare pages using `srcset` and `sizes`, retaining full images for high-density screens. Match the image preload's responsive candidates to the actual image to prevent downloading both sizes. Full-image descriptors reflect 1200-, 1448- or 1600-pixel sources. Content, intrinsic aspect ratios, alt text and image subjects remain unchanged.
- Inline the complete 29,731-byte legal stylesheet on 32 legal pages, including PoolPilot support.
- Compile and inline a 30,789-byte stylesheet for Wood Database, replacing its 54,950-byte general content stylesheet.
- Inline both the 33,647-byte plywood shell and the complete 2,510-byte workflow stylesheet, in their original cascade order. Both blocking CSS requests are removed; the calculator's scripts and behavior remain.
- Add generated CSS freshness, inline completeness, responsive preload matching and cache-lifetime guards. CSS pruning excludes generated style and stylesheet-link tokens, so repeated generation is deterministic.

These changes cover 110 pages. Complete inline CSS increases document size and gives up separate cross-page stylesheet caching on these families. Cold-cache total transfer decreased in the affected measured routes. The site remains styled without JavaScript. Sitemap signatures/dates update for the new responsive image attributes on Compare pages; titles, canonical URLs, text and structured data are preserved.

## Measurements

Dedicated headless Chrome, local gzip preview, English, 390 × 844, DPR 1, cold browser cache, 4× CPU, 150 ms simulated latency, 200 KB/s download. Three runs per route, medians below. These are local synthetic measurements, not Cloudflare field percentiles.

| Route | LCP before → after (ms) | Total transfer before → after (bytes) |
|---|---:|---:|
| `/plywood-cut-calculator/` | 548 → 272 | 50,772 → 49,876 |
| `/legal/PoolPilot/support/` | 484 → 252 | 32,122 → 31,813 |
| `/apps/cutlist/` | 636 → 620 | 104,290 → 104,290 |
| `/wood/chestnut/` | 276 → 276 | 32,137 → 32,137 |
| `/` | 692 → 688 | 49,303 → 49,303 |
| `/wood/honduran-mahogany/` | 268 → 276 | 32,198 → 32,198 |
| `/wood-weight-calculator/` | 668 → 680 | 111,374 → 111,374 |
| `/compare/baltic-birch-vs-plywood/` | 900 → 600 | 113,349 → 55,910 |
| `/wood-database/` | 540 → 272 | 36,952 → 31,713 |
| `/wood/elm/` | 272 → 272 | 32,109 → 32,109 |
| `/wood/paulownia/` | 276 → 268 | 32,155 → 32,155 |
| `/cabinet-cut-list-calculator/` | 716 → 716 | 78,211 → 78,211 |
| `/wood/khaya/` | 260 → 260 | 32,164 → 32,164 |
| `/wood/beech/` | 268 → 264 | 32,088 → 32,088 |
| `/shelf-spacing-calculator/` | 712 → 720 | 76,520 → 76,520 |

Unchanged routes are controls; small timing movements are run-to-run noise, not claimed improvements. All final loads have CLS 0 and no horizontal overflow. Shelf Spacing retains a 57–69 ms task during initialization (the baseline was 57–58 ms); this work does not claim to remove every long task or establish field INP improvement. The changed routes had no observed task over 50 ms.

## Validation

- Full `npm run build` and final `npm run check` passed; `git diff --check` passed.
- `apply:nav-cta` repeated without changing generated output. All 110 changed HTML bodies are identical to HEAD after removing only the added responsive image attributes.
- `scripts/test-cwv-reference-browser.mjs` passed 80 route/viewport checks (20 routes), checking responsive layout and menus at 360/390/430/1440 px, complete styling without JavaScript, image loading, no duplicate lead-image requests at DPR 1/2/3, and on-demand Chinese language switching.
- The existing P0 browser suite passed real bookshelf/garage/base-cabinet imports, calculation, CSV/JSON exports, unit conversion, reload persistence, canceled import preservation, oversized parts, existing component transfer, DNT and denied storage. It observed no console exceptions and 39 local conversion responses with HTTP 204.
- Mobile and desktop screenshots of the affected families were visually inspected.

Raw measurements and final browser results: [cwv-loading-performance-2026-10-10.json](cwv-loading-performance-2026-10-10.json).

## Reproduce

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4191
# Start a dedicated Chrome test profile with --remote-debugging-port=9352.
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4191 --cdp-port=9352 --routes=/plywood-cut-calculator/,/legal/PoolPilot/support/,/apps/cutlist/,/wood/chestnut/,/,/wood/honduran-mahogany/,/wood-weight-calculator/,/compare/baltic-birch-vs-plywood/,/wood-database/,/wood/elm/,/wood/paulownia/,/cabinet-cut-list-calculator/,/wood/khaya/,/wood/beech/,/shelf-spacing-calculator/ --runs=3 --output=/tmp/wct-cwv-performance.json
node scripts/test-cwv-reference-browser.mjs
P0_ORIGIN=http://127.0.0.1:4191 P0_CDP=http://127.0.0.1:9352 node scripts/test-p0-browser.mjs
```

After deployment, verify the new inline styles and responsive image hints are live. Compare Cloudflare LCP P75/P90/P99 using equivalent routes, device types, regions and time windows, with sample counts. Investigate Paulownia and Khaya using those segments and the analytics Element tab; no severe delay was reproduced locally, so the remaining field tail cannot be assigned a proven cause from this screenshot.
