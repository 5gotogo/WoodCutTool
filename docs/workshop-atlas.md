# Workshop Atlas

New editorial template and content column at `/workshop-atlas/`.

## Authored sources

- `scripts/workshop-atlas-data.mjs`: twelve chapters, each with three sections, a field exercise and a contextual next action.
- `scripts/build-workshop-atlas.mjs`: independent atlas cover, chapter index, layout editor and reading-page templates, with canonical/social metadata, Article/CollectionPage and breadcrumb schemas.
- `assets/workshop-atlas.css`: scoped dark-ink/acid/paper visual system, axonometric cover artwork, numbered chapter rows, responsive reading rail and print styles.
- `assets/workshop-atlas-core.js`: room/station validation and rectangle inspection, separated from DOM/storage operations.
- `assets/workshop-atlas.js`: station editor, browser persistence, reviewed JSON import, JSON/SVG export and printing.

Regenerate with `npm run generate:workshop-atlas`, then `npm run apply:nav-cta` and `npm run sitemap`. The full build includes generation and the atlas regression test. The shared navigation remains authored in `assets/site-chrome.js`; tools-directory entries remain in `scripts/build-tools-hub.mjs`.

## Interaction contract

Coordinates and sizes are millimeters. Origin is the upper-left corner. Room sides accept 500–50,000 mm; station sides accept 50–50,000 mm, up to forty stations. Touching edges are not rectangle overlaps. A station outside the room is preserved and flagged, allowing users to edit an unresolved layout.

Storage uses `woodcuttool.workshop-atlas.v1`. Unreadable storage is preserved; a temporary editable draft can still be exported. Import validates format, unit marker, station IDs and geometry, then presents explicit replacement/cancel controls. No layout is uploaded. JSON is the reusable layout backup; SVG is a drawing export.

Only entered axis-aligned rectangles are assessed. The tool does not infer equipment operating envelopes, door swings, escape/access routes, extraction performance or electrical requirements. The sample is illustrative. Dust context links to HSE primary guidance; all exercises are editorial planning methods.

## Local validation, 2026-10-30

- `npm run check`: passed, including geometry/input checks, generated-route targets, existing tool regressions and site/SEO/navigation/architecture audits.
- Browser: add/edit/rotate/remove station; overlap feedback; save/reload; JSON and SVG downloads; import cancellation and replacement.
- Responsive review: desktop cover; 390 × 844 cover, planner and chapter reading page. Planner and chapter DOM width equalled viewport width, with no horizontal overflow.
- Existing `/sheet-calculator/` sitemap metadata drift and formatting-only construction-hub regeneration were excluded from this change.
- Local implementation only; no deployment performed.
