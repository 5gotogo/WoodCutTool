# Loading remediation, 2026-10-27

The local fixes reduce the Sheet Calculator's default loading cost and the site's cold tab-icon transfer. They **do not establish a fix for the production LCP tail**. No production deployment or Cloudflare configuration change was performed.

## Diagnosis

The open Cloudflare Web Analytics panel matches the supplied screenshot: past 24 hours, GMT+8, bots excluded; LCP P50/P75/P90/P99 are 1,020 / 4,836 / 14,288 / 23,256 ms. Its P75 subparts show 2,893 ms TTFB (80%) and 725 ms render delay (20%). These are independent subpart percentiles, not numbers to sum into the overall P75. The 58 visits and 63 pageviews are not the LCP sample count.

Visible country samples include United States (10 good), China (3 needs improvement, 1 poor), Brazil (2 poor), Argentina (2 poor), and Malaysia (2 good). These are small, top-five groups and do not establish a stable regional distribution or identify a network cause. The debug view has no slow-element rows. The cache rules screen has zero active custom cache rules.

Public HTTP probes returned compressed HTML with `CF-Cache-Status: DYNAMIC` on the custom domain. Cold-connection TTFB was 837–1,049 ms across the four sampled routes; the same curl process's second transfer reused its connection and took 254–276 ms. The Pages domain also showed large connection-dependent differences: 587–1,460 ms cold versus 198–264 ms reused. These probes ran sequentially from one client; they are not a controlled regional experiment. `DYNAMIC` alone does not prove that static routes still invoke Functions.

Three production browser runs per route, 390×844, 4× CPU, 150 ms configured latency and 200 KB/s download, gave median LCP of 780 ms (home), 1,256 ms (Acacia), and 992 ms (Sheet Calculator). They did not reproduce the 14–23 second field tail. Production CLS was 0–0.00684, with no horizontal page overflow. Production probes use the existing live version; none measure the new code deployed.

Cloudflare recommends retaining Pages' built-in caching; adding custom domain caching can serve stale content and interfere with redirects or Functions. There is insufficient evidence to justify a broad HTML caching override. See [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Changes

- Generate `assets/sheet.js` from the existing calculation, formatting and CTA functions in `assets/app.js`. The default English page uses the 5,739-byte dedicated runtime, instead of eagerly requesting the 289,871-byte full app. Gzip size is about 2.2 KB versus 72 KB. Language selection and saved non-English preferences continue to load the existing full translation runtime; this change does not claim to speed up that path or add missing translations.
- Guard Sheet Calculator initialization so loading translations after the small runtime cannot install a second submit handler. Numerical results, CTA destinations and the area-estimate boundary remain the same.
- Retain the original 16/32/48px ICO frames byte-for-byte and remove larger tab-icon frames: `favicon.ico` falls from 81,540 to 5,535 bytes. Separate touch and install icons retain their existing sizes. `scripts/compact-favicon.mjs` reproduces the compaction; `_headers` gives the tab icon a one-day browser cache lifetime.
- Fix intrinsic minimum widths on the Sheet Calculator's form, fieldsets and results. Mobile inputs were cropped despite a zero document-overflow measurement because the body hides horizontal overflow. The browser test now checks the actual input and panel bounds.
- Preserve failed HTTP probes when curl produces timing output without a response body; a connection failure now remains an inspectable failed result instead of being masked by `ENOENT`.

The shared interactive stylesheet is regenerated on its existing 20 routes; the new width rule is scoped to the Sheet Calculator body class. Unrelated full-build formatting/schema churn was removed from the final changes.

## Verification

Local gzip preview, cold browser cache, English, 390×844 / DPR 1, 4× CPU, 150 ms latency and 200 KB/s download. Three runs per route. Baseline uses Git HEAD's original Sheet HTML, app script and favicon through an otherwise identical preview server.

| Sheet Calculator | Before | Final |
| --- | ---: | ---: |
| Median LCP | 288 ms | 284 ms |
| Median load | 774 ms | 434 ms |
| HTML + resource transfer | 98,390 B | 29,259 B |

The load-time reduction is about 44%; LCP is effectively unchanged. Home and Acacia control-page timings were essentially unchanged. The first homepage run transferred 117,052 B before versus 41,047 B after, primarily from the favicon change; later homepage runs did not request the favicon again even with browser cache disabled, so their transfer did not change. These measurements are synthetic loading evidence, not a field P75 or INP improvement.

Validation completed:

- Full `npm run build`; `npm run check` on the final output; `git diff --check`.
- `test-sheet-runtime-browser.mjs`: 360/390/430/1440px menus and input/panel bounds, two numerical cases, 11 language selections, saved Chinese preference, retained result/CTA behavior, one render per submission, no runtime exceptions. Mobile and desktop screenshots visually inspected.
- `test:lcp-entry-browser`: 24 entry-page layout/menu checks, 9 DPR image/preload checks, calculator edits, home presets, Blog search, no-script styles and Chinese switching.
- All retained ICO frames compared with the originals; failed network probes verified to return failure records without `ENOENT`.

Raw evidence: [loading-remediation-2026-10-27.json](loading-remediation-2026-10-27.json).

## Production follow-through

Deploy the reviewed source changes through the existing Pages workflow, then check the live Sheet runtime, tab icon, calculations and language switching. Compare equivalent post-deployment windows by route, country, device and LCP sample count. First-byte waiting remains unresolved; if slow regions retain the tail, capture their actual request timing and redirect/security behavior before changing delivery settings. The local improvements must not be presented as eliminating that delay.

To repeat focused QA against a gzip preview and dedicated Chrome debugging port:

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4198
WCT_PERF_ORIGIN=http://127.0.0.1:4198 WCT_CDP_PORT=9357 node scripts/test-sheet-runtime-browser.mjs
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4198 --cdp-port=9357 --routes=/,/sheet-calculator/,/wood/acacia/ --runs=3 --output=/tmp/wct-loading.json
```
