# Screenshot route loading fixes — 2026-10-08

The screenshots show degraded LCP, with P75 at 3,252 ms in the 24-hour window. INP is mostly healthy. Route names are truncated and the short-window route counts are small; the charts alone do not establish a root cause. Local measurements reproduced a substantial image-loading delay on DuctLab. These changes have not been deployed.

## Changes

- Request responsive screenshots from Apple's existing thumbnail service on 42 generated App detail pages, instead of loading the original 1290-pixel-wide images. Preserve aspect ratios, intrinsic dimensions, existing screenshot content, and lazy loading for supporting screenshots. Supply 240/360/540/720/1080-pixel candidates for different display widths and pixel densities. Resize generated directory and detail icons to 160 pixels.
- Inline the complete 34,137-byte generated Wood stylesheet on 201 text-led Wood pages. This eliminates a blocking CSS request while keeping responsive, menu, and language states. The compressed cold-load transfer stays approximately unchanged; the complete styling also works without JavaScript. The tradeoff is including the small stylesheet in each document rather than reusing a separately cached file.
- Generate scoped styles for the plywood calculator (33,647 bytes), checklists (36,598 bytes, 71 pages), and legal content (29,731 bytes, 32 pages), replacing their previous 62,904-byte content bundle. Give optional language and conversion scripts low request priority on these page families and App pages. Keep calculator functionality loaded normally.
- Add positive browser cache lifetimes for the new styles and plywood workflow resources. Keep all authored CSS in `assets/styles.css`; generated bundles and inline CSS are rebuilt by `apply:nav-cta`.
- Make the performance harness reject non-200 route responses before measuring, and explicitly select the language (`--lang=en` by default) so saved language settings cannot silently change the baseline.

## Measurements

Dedicated headless Chrome, gzip preview, English, 390 × 844, DPR 1, cold browser cache, 4× CPU, 150 ms simulated latency, 200 KB/s download. Three runs per route; medians below. External App images use the real Apple CDN. These are local synthetic measurements, not Cloudflare field percentiles or a promise about every connection. The first baseline navigation included a favicon transfer; medians exclude that outlier.

| Route | LCP before → after (ms) | Total transfer before → after (bytes) |
|---|---:|---:|
| `/apps/ductlab-hvac-duct-layout/` | 5,168 → 1,008 | 1,038,059 → 209,121 |
| `/wood/beech/` | 476 → 264 | 32,334 → 32,025 |
| `/wood/east-indian-rosewood/` | 488 → 276 | 32,448 → 32,145 |
| `/wood/elm/` | 480 → 264 | 32,359 → 32,046 |
| `/plywood-cut-calculator/` | 532 → 540 | 56,326 → 50,709 |
| `/checklists/plywood-order-release/` | 552 → 508 | 40,261 → 35,087 |
| `/legal/Casework/privacy/` | 536 → 472 | 38,985 → 32,569 |
| `/blog/plywood-thickness-chart-guide/` | 624 → 624 | 49,009 → 49,009 |
| `/blog/upper-cabinet-depth-planning/` | 624 → 624 | 58,350 → 58,350 |

The plywood calculator transfers less data, but its LCP change is within run-to-run noise. The two Blog pages already preload responsive hero images and serve scoped CSS; they are unchanged controls. All measured final loads had CLS 0 and no observed long tasks over 50 ms.

## Validation

- Full `npm run build`, final `npm run check`, syntax checks, and `git diff --check` passed.
- Scoped regeneration is idempotent. Performance guards verify current generated styles, image sizing, lightweight runtimes, and cache rules.
- `scripts/test-cwv-loading-browser.mjs`: 32 route/viewport checks at 360/390/430/1440 pixels; no horizontal overflow, working mobile/desktop menus, correctly loaded and proportioned screenshot images, complete Wood styling without JavaScript, and on-demand Chinese language switching.
- The first screenshot selects a 720-pixel candidate on a 2× screen and 1080 pixels on a 3× screen, covering its measured 274-pixel display width. Mobile and desktop screenshots were visually inspected.
- `scripts/test-p0-browser.mjs`: three real plywood import workflows, calculation, CSV/JSON exports, unit conversion, reload persistence, cancel-import preservation, oversized-panel handling, existing component transfer, DNT, and denied-storage behavior. No console exceptions; 39 local conversion responses returned 204.
- The performance harness correctly refuses an HTTP 404 route.

Raw measurements and browser results: [cwv-loading-performance-2026-10-08.json](cwv-loading-performance-2026-10-08.json).

## Reproduce and verify after deployment

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4188
# Start a dedicated test Chrome with --remote-debugging-port=9348.
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4188 --cdp-port=9348 --routes=/wood/beech/,/wood/east-indian-rosewood/,/wood/elm/,/plywood-cut-calculator/,/apps/ductlab-hvac-duct-layout/,/blog/plywood-thickness-chart-guide/,/blog/upper-cabinet-depth-planning/,/checklists/plywood-order-release/,/legal/Casework/privacy/ --runs=3 --output=/tmp/wct-cwv-performance.json
node scripts/test-cwv-loading-browser.mjs
P0_ORIGIN=http://127.0.0.1:4188 P0_CDP=http://127.0.0.1:9348 node scripts/test-p0-browser.mjs
```

After deployment, confirm the new HTML/image candidates are live, then compare Cloudflare LCP P75/P90/P99 for the same routes, device types, and regions, retaining sample counts and comparable time windows. An improvement in local measurements does not establish that the production field distribution has improved.
