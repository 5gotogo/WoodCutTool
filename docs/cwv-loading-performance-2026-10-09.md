# Screenshot route loading improvements — 2026-10-09

The screenshot's 24-hour distribution is 67% good / 19% needs improvement / 14% poor LCP; INP and CLS are healthy. Individual URL counts are small and several labels are truncated. The matching 15 local routes were measured; the edge-banding label is treated as `/edge-banding/finished-size-to-cut-size/`. This is a plausible match, not access to the underlying analytics export.

Current production HTML was checked read-only: Wood Alder already has inline Wood styles, while Countersink and Finishing Planner still reference the general content stylesheet. Existing Wood/App-image optimizations are retained. No deployment was performed.

## Changes

- Generate a 31,015-byte glossary stylesheet instead of the 54,950-byte general content stylesheet. Inline it on all 201 glossary pages to remove the blocking stylesheet request.
- Generate a 29,598-byte shared workflow stylesheet for Cabinet Studio, Edge Banding, Finishing Planner and their guides (9 pages). Inline it before each page's complete custom CSS, preserving the original cascade. Remove both external stylesheet requests. Total inline styles are about 38–51 KB; authored custom CSS remains unchanged.
- Preload calculator module dependencies from the authoritative generators, including Edge Banding's transitive cut-handoff dependency. Reduce optional language/conversion request priority and add positive cache lifetimes for workflow resources.
- Exclude stylesheet link tokens when pruning CSS, so a filename such as `workflow-shell.css` cannot retain an unused class on one build and disappear on the next. Generated output is identical on repeated runs.

The inline approach includes CSS in every HTML response and gives up separate cross-page stylesheet caching on these small page families. In the cold-cache measurements, total transferred bytes decrease despite the larger document.

## Measurements

Dedicated headless Chrome, gzip preview, English, 390 × 844, DPR 1, cold browser cache, 4× CPU, 150 ms simulated latency, 200 KB/s download. Three runs per route, medians below. External App images use the real Apple CDN. These are local synthetic measurements, not Cloudflare field percentiles. Workflow pages were measured again after the final deterministic CSS-generation repair.

| Route | LCP before → after (ms) | Total transfer before → after (bytes) |
|---|---:|---:|
| `/` | 700 → 692 | 49,303 → 49,303 |
| `/cabinet-studio/` | 668 → 284 | 59,041 → 52,655 |
| `/apps/ductlab-hvac-duct-layout/` | 964 → 992 | 209,184 → 209,184 |
| `/wood/norway-spruce/` | 276 → 260 | 32,154 → 32,154 |
| `/finishing-planner/` | 580 → 252 | 46,133 → 40,148 |
| `/wood/east-indian-rosewood/` | 280 → 264 | 32,208 → 32,208 |
| `/edge-banding/finished-size-to-cut-size/` | 536 → 280 | 38,623 → 32,623 |
| `/glossary/countersink/` | 520 → 252 | 35,576 → 30,414 |
| `/wood/alder/` | 264 → 260 | 32,140 → 32,140 |
| `/wood/osage-orange/` | 280 → 272 | 32,157 → 32,157 |
| `/wood/maple/` | 260 → 256 | 32,829 → 32,829 |
| `/wood/oak/` | 276 → 264 | 32,113 → 32,113 |
| `/wood/port-orford-cedar/` | 268 → 272 | 32,186 → 32,186 |
| `/legal/cutlist/privacy/` | 492 → 476 | 30,489 → 30,489 |
| `/glossary/trim-allowance/` | 524 → 252 | 35,406 → 30,230 |

Unchanged Home, Wood, DuctLab and legal routes serve as controls: their small timing changes are measurement noise, not claimed improvements. Every measured load has CLS 0, no horizontal overflow and no observed task over 50 ms. Navigation, content and calculator functionality are preserved.

## Validation

- Full `npm run build` and final `npm run check` passed. Generated CSS freshness, byte budgets, inline completeness, module preloads and cache rules are guarded by `test-core-web-vitals.mjs`.
- `apply:nav-cta` repeated without changing any output. All 210 changed HTML files retain byte-identical bodies relative to HEAD.
- `scripts/test-cwv-route-browser.mjs`: 64 route/viewport checks at 360/390/430/1440 px, working menus, no horizontal overflow, initialized calculators, Cabinet Studio edit/save/reload and exploded view, styles without JavaScript, and on-demand Chinese language switching. No console exceptions.
- Existing Finishing and Edge Banding browser suites passed: 16 responsive cases each, real edits, unit conversion, save/reload, CSV/JSON exports, canceled and confirmed imports, invalid backup/draft preservation, denied storage and Edge Banding layout handoff. Total responsive cases across all three suites: 96.
- Mobile and desktop screenshots visually inspected. `git diff --check` passed.

Raw measurements and browser results: [cwv-loading-performance-2026-10-09.json](cwv-loading-performance-2026-10-09.json).

## Reproduce

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4189
# Start a dedicated test Chrome profile with --remote-debugging-port=9350.
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4189 --cdp-port=9350 --routes=/,/cabinet-studio/,/apps/ductlab-hvac-duct-layout/,/wood/norway-spruce/,/finishing-planner/,/wood/east-indian-rosewood/,/edge-banding/finished-size-to-cut-size/,/glossary/countersink/,/wood/alder/,/wood/osage-orange/,/wood/maple/,/wood/oak/,/wood/port-orford-cedar/,/legal/cutlist/privacy/,/glossary/trim-allowance/ --runs=3 --output=/tmp/wct-cwv-performance.json
node scripts/test-cwv-route-browser.mjs
WCT_FINISHING_ORIGIN=http://127.0.0.1:4189 WCT_CDP_PORT=9350 node scripts/test-finishing-browser.mjs
WCT_EDGE_ORIGIN=http://127.0.0.1:4189 WCT_CDP_PORT=9350 node scripts/test-edge-banding-browser.mjs
```

After deployment, confirm the new inline styles and module preloads are live, then compare Cloudflare LCP P75/P90/P99 for equivalent routes, devices, regions and time windows with sample counts. This local result does not establish a production field improvement.
