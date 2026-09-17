# Screenshot route loading fixes — 2026-09-18

The screenshot shows LCP distribution, not failed HTTP loads. Its route labels are truncated; the five matching local routes below were used. The production worksheet returned HTTP 200 and referenced the same pre-change content.css. No deployment was performed.

## Changes

- Split the shared 72,086-byte content stylesheet into generated planning (40,723 bytes), template (37,022 bytes), and construction (31,682 bytes) bundles, covering 306 pages. The authored source remains assets/styles.css.
- Give optional language and conversion scripts low request priority on these pages. Preserve high-priority hero images and the existing shared header.
- Load component-builder.js only when Add to component project is clicked on the cabinet, drawer, and cabinet-door calculators. Keep a single pending request, prevent duplicate pending clicks, and support retry after a failed request.
- Add cache rules and regression guards for the new resources.

## Local measurements

Chrome headless, gzip preview, 390 × 844, DPR 1, cold cache, 4× CPU, 150 ms simulated latency, 200 KB/s download, three runs per route. Values are medians. Browser profiles had no saved non-English language. This excludes production server/network latency and is not Cloudflare field P75. The first baseline navigation included a favicon transfer; CSS/JS measurements exclude it.

| Route | LCP before → after (ms) | CSS/JS transfer before → after (bytes) |
|---|---:|---:|
| `/worksheets/project-closeout-record/` | 580 → 524 | 33628 → 27755 |
| `/cabinet-door-calculator/` | 796 → 732 | 53549 → 38006 |
| `/templates/plywood-chair-cut-list/` | 704 → 676 | 33628 → 27100 |
| `/blog/french-cleat-wall-plywood-layout/` | 636 → 648 | 29635 → 29635 |
| `/troubleshooting/finished-parts-chip-during-handling/` | 608 → 512 | 33628 → 27755 |

The French-cleat article was already using scoped CSS and prioritized images. It is an unchanged control; its small timing difference is run-to-run noise. All final runs had CLS 0.

## Validation

- `npm run build`, `npm run check`, and `git diff --check` passed.
- `scripts/test-loading-browser.mjs`: 20 responsive checks at 360/390/430/1440 px, loaded CSS/images, working mobile menu, no horizontal overflow.
- Three calculators: initial parts result, no eager component script, network-failure retry, duplicate pending click prevention, saved parts and persistence after navigation. Cabinet-door output changes from 15.44 to 20.44 inches when opening width changes from 30 to 40 inches.
- Mobile and desktop screenshots inspected under `/tmp/wct-loading-qa/`.

## Reproduce

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4188
# Start a dedicated Chrome test profile with --remote-debugging-port=9337.
node scripts/test-loading-browser.mjs
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4188 --routes=/worksheets/project-closeout-record/,/cabinet-door-calculator/,/templates/plywood-chair-cut-list/,/blog/french-cleat-wall-plywood-layout/,/troubleshooting/finished-parts-chip-during-handling/ --runs=3 --output=/tmp/wct-loading-performance.json
```

Raw before/after measurements: [loading-performance-2026-09-18.json](loading-performance-2026-09-18.json). After deployment, compare Cloudflare LCP P75/P90/P99 by the same routes, device and region, retaining sample counts. The screenshot uses a six-hour window with few LCP samples, so it cannot establish the root cause or prove a field improvement by itself.
