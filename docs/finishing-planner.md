# Finishing Planner

Implemented locally on 2026-10-08 at `/finishing-planner/`, with three generated guides: surface area from a cut list, coverage/coats/package sizes, and finishing before assembly.

The feature extends the cabinet → cut planning → edge banding workflow with a purchase estimate for rectangular panel finishing. It accepts finished outside dimensions. No cut-list handoff is added because a coating schedule needs selected surfaces and exact product specifications that the existing geometry transfer does not contain.

## Model and boundaries

Canonical data uses millimetres, square metres and litres. Metric and US displays convert dimensions, area, coverage and package/stock volumes together. US gallons use 3.785411784 L; square feet use 0.09290304 m².

Each part selects front/back faces and top/bottom/left/right edges. Length runs horizontally; top/bottom area is length × thickness and left/right area is width × thickness. Selected areas multiply by physical quantity. Each row assigns one or both of two independent product stages to those surfaces. Use disjoint rows for surfaces requiring different products; the model cannot detect duplicate physical surfaces across differently labelled rows.

For each product:

`base litres = selected area × coats / coverage per coat`

`demand litres = base litres × (1 + extra allowance / 100)`

`packages = ceil(max(0, demand litres − usable stock litres) / package litres)`

Rounding for display and CSV does not drive the package calculation. Machine arithmetic noise at an exact package boundary is removed at a relative floating-point tolerance; a real shortage above that tolerance rounds up. Products never pool stock or volumes. The estimate uses one editable package size per product, not a mixed-package cost optimizer.

Defaults are illustrative and have no manufacturer identity. Coverage must be for one coat of the exact selected product. Extra allowance adds volume; it is not spray-transfer efficiency. Manufacturer references in the guides were read on 2026-10-08 to verify the distinction between coverage/coat count and drying/curing milestones.

The model does not deduct openings, add routed or curved surfaces, model partial masking, prescribe compatibility or calculate drying/cure/assembly readiness. A label specification and representative test panel remain part of the purchase review.

## Ownership and persistence

- `assets/finishing-core.js`: validated domain model, surface areas, product demand, units and CSV cell safety.
- `assets/finishing-planner.js`: editing, selected-surface diagrams, local storage and reviewed imports.
- `assets/finishing-planner.css`: scoped responsive UI.
- `scripts/finishing-data.mjs`: three substantial field guides and source references.
- `scripts/build-finishing-planner.mjs`: four routes, metadata and structured data.

Storage key: `woodcuttool.finishing.v1`. Only valid edits are saved. An unreadable stored draft is preserved while the example remains usable in memory; applying a validated imported backup explicitly replaces that draft. Storage failures leave editing and download paths available. JSON imports require a review and Replace action; a canceled or invalid import leaves current work intact. JSON size is limited to 1 MB; projects support 1–100 rows.

CSV exports use metric basis with units in the column headings. They include part/surface/product assignments and purchase assumptions, and quote text while guarding spreadsheet formula prefixes. JSON restores the editable project. No project network service is added; existing shared site conversion instrumentation is retained.

## Regeneration and verification

1. `npm run generate:finishing`
2. When changing tools-directory or edging cross-links: `npm run generate:tools`, `npm run generate:edge-banding`, and `npm run generate:schemas`.
3. `npm run apply:nav-cta`, then `npm run sitemap`.
4. `npm run check` and `git diff --check`.

The feature generator and core tests are included in `npm run build` and `npm run check`.

`npm run test:finishing-browser` runs against the local preview and an isolated Chrome profile with CDP port 9337. Override using `WCT_FINISHING_ORIGIN`, `WCT_CDP_PORT` and `WCT_FINISHING_OUTPUT`. The script resets only this feature's draft in that isolated profile; never target a personal browser profile. Default evidence directory: `/tmp/wct-finishing-qa`.

The local browser run exercises real clicks/text entry, surfaces/stages, add/remove, invalid quantities, unit switching, save/reload, CSV/JSON downloads, invalid/canceled/applied imports, malformed-draft preservation and unavailable storage. All four new routes are checked at 320, 390, 768 and 1440 px. Screenshots of desktop/mobile forms, results and guides are inspected separately. Deployment is a separate action.
