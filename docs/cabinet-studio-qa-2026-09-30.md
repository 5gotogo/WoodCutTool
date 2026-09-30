# Cabinet Studio local verification — 2026-09-30

Route: `/cabinet-studio/`. Generator: `scripts/build-cabinet-studio.mjs`. Pure calculations: `assets/cabinet-studio-core.js`.

## Verified

- `npm run check` passed after final generation, navigation normalization, and sitemap refresh. Site validation, indexability, SEO, architecture, and existing workflow/performance guards passed.
- `npm run test:cabinet-studio` passed known panel geometry, all four starting presets on default stock, item-clearance fitting, parser unit conversion and Chinese input, grain-constrained rotation, invalid inputs, CSV rows, and 180 deterministic randomized packing cases. Each case checks part accounting, stock containment, no overlap, and kerf separation.
- Browser layout inspected at 1440 × 1000 and 390 × 844. Mobile document width equals viewport width (390 px). Compact input styles override the shared calculator input minimum height. Mobile controls include a sticky preview shortcut.
- English/Chinese brief parsing updates dimensions and veneer appearance. Changing dimensions updates the projected model, cut list, stock layouts, budget, and checks.
- Linked selection works across sheet layouts and cut list. Keyboard tab switching and Enter activation of a sheet panel work.
- Exploded view, front/perspective camera, and staged assembly were exercised. Motion is bounded and `prefers-reduced-motion` skips model interpolation; staged views can be stopped.
- Invalid shelf openings disable export and expose a repair action. The shelf-fit action reduces shelf count to meet item clearance when possible.
- Three saved comparisons disable further additions; restoration and persistence across reload were exercised.
- A local JSON fixture imported a 1500 × 600 × 420 mm oak media cabinet successfully. Wide back panels follow their longer grain axis and fit default stock where the physical rectangle allows it.
- A copied settings link restored the media cabinet. Loading a shared design clears the settings fragment so later local edits survive reload.
- CSV, SVG drawing, and JSON backup controls generated file links without browser errors. The in-app browser did not emit a completed download event; actual downloaded-file delivery was not observed in this browser. A visible download link remains available after generation. CSV contents also have automated checks.

## Scope

No deployment or Git commit was performed. Layouts are six-trial greedy guillotine candidates, not a proof of optimality. Geometry describes a butt-jointed open cabinet, removable shelves, and an optional overlay back. The 700 mm shelf-span prompt is a planning heuristic rather than a load rating. Purchase costs cover full modeled sheets using user-entered USD prices. Verify material, loads, edging, fixings, joinery, and safe cutting before building.
