# Edge Banding Planner

Implemented locally on 2026-10-04 at `/edge-banding/`, with three generated field guides.

The planner fills the step between approved finished panel sizes and saw-cut nesting. Cabinet Studio currently describes unfinished panels; its new link leads to this separate planner so an existing design is never silently changed by a tape deduction.

## Model

All editable project lengths are stored in millimeters. Display units can be millimeters or inches. Input reading normalizes to six decimal places in millimeters so converting displayed units repeatedly does not accumulate floating-point drift at shop precision. The reversible input basis converts values to keep the same modeled physical part.

Length runs left to right. Left/right edging changes length; top/bottom changes width. For either axis:

`saw size = finished size - effective added tape thicknesses + selected-edge pre-milling removals`

Only banded edges receive the global pre-milling removal. The post-milling substrate and the final outside rectangle must remain positive. Profile tape width must cover panel thickness plus twice the selected face-trim allowance. Geometry, tape width and single-strip roll failures block CSV exports and nesting handoff.

Two editable tape profiles remain distinct by A/B identity, including color/reference labels. Strip demand uses the larger saw/finished envelope along each selected edge plus twice the end allowance. Quantity multiplies strips. Extra waste is then added per profile. Minimum roll counts divide this length by roll length; this is **not** strip packing across rolls. Continuous long strips may require additional rolls. Stock and process defaults are example inputs, not manufacturer specifications.

The model does not include curved edges, face laminates, joinery, hardware clearances or fastening/strength calculations. Effective added tape thickness should be calibrated with a finished test piece.

## Ownership and persistence

- `assets/edge-banding-core.js`: validation, reversible geometry, supply demand, CSV exports and receiving layout contract.
- `assets/edge-banding.js`: editing, interactive edge maps, saving, reviewed JSON replacement and downloads.
- `assets/edge-banding.css`: scoped responsive styles and a native code illustration.
- `scripts/edge-banding-data.mjs`: field-guide source.
- `scripts/build-edge-banding.mjs`: HTML, metadata and structured data.

Browser storage uses `woodcuttool.edge-banding.v1`. Unreadable saved records are preserved rather than overwritten. Storage failures leave a working in-memory flow and export path. Imported JSON is validated and requires an explicit Replace action. No project network service is added.

Sheet handoff uses the existing session-local contract. Saw dimensions, material/thickness grouping, grain locks and the entered sheet/kerf/trim are carried into the plywood calculator. Its review and scope confirmation precede draft replacement. Edge maps and profiles stay in this planner and its CSV; they are not silently interpreted as nesting constraints. The receiving calculator supports at most 10 material groups, 100 part rows and 500 physical parts; its contract rejects unsupported transfers with a visible message.

## Regenerate and verify

1. `npm run generate:edge-banding`
2. For changed tool-directory sources, `npm run generate:tools` and `npm run generate:schemas` restore directory schema.
3. `npm run apply:nav-cta` then `npm run sitemap`.
4. `npm run check` and `git diff --check`.

`npm run build` includes the new generator and core tests. `npm run test:edge-banding` exercises worked geometry, pre-milling, asymmetric edges, quantity, supply boundaries, units, CSV cell safety and receiving-layout validation.

Browser QA uses an isolated Chrome profile with CDP enabled and the local dev server:

`npm run test:edge-banding-browser`

Defaults: preview `http://127.0.0.1:4175`, CDP port `9337`, evidence `/tmp/wct-edge-banding-qa`. Override with `WCT_EDGE_ORIGIN`, `WCT_CDP_PORT` and `WCT_EDGE_OUTPUT`. This script resets only this feature's draft and the plywood draft in the isolated test profile; do not run it against a personal browsing profile.

The 2026-10-04 local run verified real mouse/text editing, edge cycles, unit and input-basis conversion, add/remove, save/reload, current CSV/JSON downloads, invalid/canceled/applied imports, unavailable storage, preserved malformed drafts and reviewed handoff acceptance with grain retention. All four new pages passed overflow checks at 320, 390, 768 and 1440 px; mobile and desktop screenshots were inspected. No deployment was performed.
