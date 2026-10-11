# Wood Movement Planner

Implemented: 2026-10-11. Method v1; next source review: 2027-04-11.

## Scope and intent

`/wood-movement/` adds a live planning decision that the existing species library, moisture glossary and wood-movement blog do not provide: calculate a measured cross-grain solid-wood width at two entered service endpoints, compare a fixed opening and retain the assumptions for an attachment review.

The hub is a working calculator. Its three field guides own separate input and interpretation decisions:

- `/wood-movement/read-grain-and-coefficients/`: identify the width direction and exact species entry.
- `/wood-movement/moisture-readings-and-service-range/`: retain measured wood MC and endpoint evidence.
- `/wood-movement/clearance-and-attachment-review/`: separate total clearance, reserve, current expansion and edge travel.

## Source and method

Source: [USDA Wood Handbook FPL-GTR-282 (2021), Chapter 13](https://research.fs.usda.gov/download/treesearch/62261.pdf), Table 13–5 (printed page 13–17), Equation 13–3 (page 13–16). Eight specific species entries are transcribed into `assets/wood-movement-core.js`. The 2021 northern-red-oak and white-oak entries differ from the 2010 commercial-oak entries; do not mix editions or generic oak labels.

For each radial or tangential scenario:

```
change = measured width × coefficient × (endpoint MC − current MC)
endpoint width = measured width + change
seasonal swing = wet width − dry width
wet total gap = fixed opening − wet width
reserve balance = wet total gap − user required TOTAL reserve
edge displacement = endpoint change × 0.5 (center reference) or × 1 (one edge reference)
```

The source coefficients are referenced to 10% MC. The tool follows the handbook's approximate starting-dimension equation and requires all MC values to stay within 6–14%, with the current value inside the entered service envelope. A narrower envelope excluding the current reading is deliberately rejected instead of rendering ambiguous “from now” travel.

The opening and locating reference are WoodCutTool drawing assumptions around the source model. The reserve is user supplied. “Compare both” shows two models, not guaranteed limits, an angle interpolation or a statistical confidence interval. The tool does not model engineered sheet goods, along-grain dimensions, warping, restraint, slot length, attachment capacity, acclimation duration or humidity-to-MC conversion.

Reference example: white oak (white), tangential C = 0.00376, 600 mm at 8% MC, endpoints 6% and 12%, fixed opening 612 mm, total reserve 2 mm. Dry width = 595.488 mm; wet width = 609.024 mm; swing = 13.536 mm; wet gap = 2.976 mm; reserve balance = 0.976 mm. Center-reference wet displacement is 4.512 mm per edge.

## Source files and integration

- Generator/data: `scripts/build-wood-movement.mjs`, `scripts/wood-movement-data.mjs`.
- Domain/UI/styles: `assets/wood-movement-core.js`, `assets/wood-movement.js`, `assets/wood-movement.css`.
- Core/browser checks: `scripts/test-wood-movement.mjs`, `scripts/test-wood-movement-browser.mjs`.
- Integrated into home, tools, woodworking tools, species-library hub, shared Tools navigation/footer, tools ItemList schema, workflow performance profile, cache headers, build/check scripts, sitemap and conversion-route allowlist.
- The hub has four contextual inbound surfaces (home, tools, woodworking tools, wood). Each guide has four (hub, two sibling guides, wood).

Draft schema v1 uses canonical millimeters and preserves untouched values during display-unit changes. Valid changes save locally when possible. Invalid inputs clear the live result and disable exports without overwriting the last valid draft. Corrupt stored data is preserved until an explicitly reviewed import replaces it. Unavailable storage retains in-session calculations and exports with an accurate status message.

CSV records always use millimeters and retain species, coefficient, MC inputs, opening, reserve, locating reference, outputs, notes and source. JSON imports validate schema/limits, cap files at 30 KB and expose Apply/Cancel before replacement. User text is escaped in result markup and protected against spreadsheet formula interpretation in CSV. Print includes current inputs, result and a source/method note. Without JavaScript, the generated example, coefficient table, guides and static example CSV remain available.

## Validation commands

```
npm run generate:wood-movement
npm run test:wood-movement
npm run apply:nav-cta
npm run sitemap
npm run check
git diff --check
```

Browser checks use an isolated Chrome profile with CDP port 9341 and local dev server port 4175. Both are configurable using `WCT_CDP_PORT` and `WCT_MOVEMENT_ORIGIN`; screenshots, CSV/JSON, print PDF and results default to `/tmp/wct-movement-qa` (`WCT_MOVEMENT_OUTPUT` overrides it).

```
npm run test:wood-movement-browser
```

The browser check covers live calculations, unit switching, empty/out-of-range inputs, all examples, both directions, reserve deficit, real downloads, import cancel/apply/rejection, corrupt/unavailable storage, text escaping, equal endpoints, 360/390/768/1440 px on all four routes, print and static fallback. Visual review should also inspect the desktop workspace, mobile form/result and a field guide after generation.

Local validation does not constitute deployment or Search Console indexing proof.

## Completed verification, 2026-10-11

- `npm run build` and `npm run check`: passed. 2,512 HTML files validated, 2,412 sitemap URLs; SEO audit returned `{}` and architecture audit reported no unreachable routes.
- Focused core/export checks and the final browser check: passed, including all 16 route/width combinations, mobile Tools navigation, print source note and static fallback.
- Screenshots inspected: desktop hero/workspace, 390 px hero/form/results and a field guide. No horizontal overflow on the four tested widths.
- Contextual inbound links verified: seven source pages for the hub and four for each guide. Shared navigation is additional.
- `git diff --check`: passed. Existing wood-species page changes are shared-footer integration; unrelated generator outputs returned to their existing content after the full pipeline.
- Only the home, tools, woodworking-tools and wood-library hubs plus the four new routes changed sitemap content dates. No deployment or remote push was performed.
