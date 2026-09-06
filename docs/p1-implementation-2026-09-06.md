# P1 implementation — 2026-09-06

## Delivered behavior

- The existing homepage project section now starts with bookshelf, garage shelves and base cabinet. The hero links directly to that section. On phones all three project starts are in a vertical list, with no horizontal swipe needed to discover them.
- The homepage interactive board and static before/after graphics are explicitly labelled illustrative. Their figures remain simulations; no savings or sheet counts are represented as calculations from the visitor's actual parts. The demo form is excluded from calculator submission events.
- The five pilot source pages place one primary customization action near the opening answer. Their anchors work from homepage cards. Existing detailed parts, worked layouts, limitations and supporting links are preserved.
- The plywood form uses compact two-column numeric fields, a sticky calculation button and keyboard Done/Enter submission. Custom errors focus a visible summary; native invalid fields retain browser validation. Material groups, unit conversion, local drafts and P0 storage protections remain intact.
- A completed calculation focuses the result and presents CSV export as the primary action. An incomplete layout instead prioritizes review of unplaced panels. JSON/print and previously reviewed assumptions remain accessible in disclosures. Results link to shelf-span guidance, garage lumber/material planning or cabinet squaring according to the active project.
- The calculator loads an 11,291-byte core generated from its existing authoritative implementation instead of the 288,910-byte full app bundle. Language code still loads on demand, and switching language preserves the current list. Two pilot templates and the garage template also use the existing lightweight content runtime.

## Five existing pages refined

Selection is based on their role in the three project workflows, not an unverified traffic ranking. No current Search Console export was available.

| Existing route | Purpose of the revision |
| --- | --- |
| `/examples/bookshelf-cut-list/` | Separate the worked benchmark from the editable body/back material groups; clarify customization and export |
| `/examples/base-cabinet-cut-list/` | Explain which cabinet panels are included and which joinery/hardware decisions precede use |
| `/templates/bookshelf-cut-list/` | Put shelf span, thickness and the editable list before the project illustration |
| `/templates/base-cabinet-cut-list/` | Make assembly review and grouping by actual stock the next action |
| `/templates/garage-shelving-cut-list/` | Clarify positive-kerf limits and the lumber supports excluded from the panel layout |

Titles, descriptions and opening answers are changed in their generators (or the authored legacy garage template and its metadata source). Canonicals are preserved; no pages were merged, redirected or newly noindexed. Source-backed workflow edits update the two example Article modification dates without changing benchmark dataset dates.

## Local performance evidence

Three cold HTTP-cache runs before and three after, using the same local gzip preview and Chrome 152. Viewport 390 × 844, CPU 4× slower, 150ms network latency, 200,000 bytes/s download and 100,000 bytes/s upload. Before and after phases were sequential, not alternating; renderer/JIT state and normal timing noise are not eliminated. These are synthetic observations, not production P75 or INP.

| Surface | LCP median before → after | First-party asset CSS/JS encoded bytes before → after |
| --- | --- | --- |
| Homepage | 1000 → 1008 ms | 127,257 → 127,415 |
| Plywood calculator | 1004 → 800 ms | 136,443 → 69,956 |
| Bookshelf example | 772 → 728 ms | 58,419 → 58,831 |

Calculator LCP improved about 20.3% in this experiment; encoded CSS/JS bytes fell 48.7%. Homepage timing is essentially unchanged. All measured CLS values were zero. The source page's opening text changed, so its timing is not evidence of a runtime-only optimization. The raw measurements, element labels, resource rows and long-task samples are in [p1-performance-2026-09-06.json](p1-performance-2026-09-06.json).

The generator verifies that the lightweight core matches the existing implementation. A 16 KB core budget and the calculator's script references are enforced by `test:core-web-vitals`. This does not remove the full app runtime from other interactive calculators or change their calculations.

## Live checks and outstanding external evidence

Read-only public HTTP checks on 2026-09-06 confirmed that `/apps/`, `/apps/cutlist/`, and `/apps/compare/cutlist-vs-paper-parts-list/` reference `apps.css`, `site-chrome.js`, `conversion.js` and `content-page.js`, with no eager `app.js`. This confirms the earlier App resource work is visible online on those samples; it does not mean this P1 change has been deployed.

Cloudflare RUM and Search Console account data were unavailable. There is no claim here about production LCP/INP/CLS percentiles, regional performance, indexing improvement or conversion gains. After deployment record its timestamp, compare like route/device/region cohorts with sample counts, and retain the pre-change 28-day search baseline for a full 28-day follow-up. Production deployment and that follow-up remain pending.

## Validation and maintenance

- Full `npm run build` passed, with the existing 2,470 HTML files and 2,368 sitemap URLs. The focused P0 browser regression passed all three project paths and component import.
- `scripts/test-p1-browser.mjs` checked the homepage, five source pages and calculator at 360/390/430/1440px: no page-level horizontal overflow, mobile/desktop menu toggles and Escape, actual numeric keyboard input and Enter, visible focused errors, primary export visible after calculation, actual CSV/JSON download actions, scenario-specific next steps and lazy language loading without draft loss. No JavaScript exceptions were observed.
- Mobile screenshots of the project entries and result hierarchy were visually reviewed. Browser evidence is written outside the repository to `/tmp/woodcuttool-p1-browser` by default.
- Garage handoff regeneration was checked twice for idempotence; it does not accumulate extra blocks or blank lines.

Edit `assets/app.js` for the shared calculation implementation; do not edit the generated `assets/plywood-core.js`. `npm run apply:nav-cta` regenerates the core and App CSS. Source-page handoffs come from `scripts/cut-handoff-data.mjs`, and focused copy from `scripts/pilot-editorial.mjs`. The homepage remains an authored page; its existing App-library update preserves these project entries.

```sh
npm run generate:examples
npm run generate:templates
npm run generate:handoffs
npm run generate:meta
npm run apply:nav-cta
npm run sitemap
npm run check
git diff --check
```

For the reproducible browser tests, use an isolated Chrome debugging profile on port 9337, and a local preview on port 4190. `WCT_PREVIEW_GZIP=1` enables gzip in the local preview. `node scripts/measure-p1-performance.mjs /tmp/measurement.json` runs the measurement; `node scripts/test-p1-browser.mjs` runs UI QA. The scripts use only the local preview; data in their isolated local storage is test data.
