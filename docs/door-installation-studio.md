# Door Installation Studio

`/door-installation/` adds a multi-door installation record and 12 distinct field guides. It complements the existing `/cabinet-door-calculator/`, which retains the opening-to-door sizing intent and canonical URL.

The three working views cover a finished-door survey, cup geometry and physical fit observations. Up to 30 doors share one drilling setup. Different hinge or drilling families should use separate project backups.

## Model

- All stored and exported physical lengths use millimeters; the UI offers mm or decimal-inch display.
- Maps show the **back face, top up**. X increases from the left, Y increases downward from the top. Handing names the hinge edge in this view.
- Cup center setback = edge-to-rim distance + diameter / 2. Right-edge X = width − setback.
- The default proposal interpolates the selected count between top and height − bottom. An explicit list of 2–8 centers replaces the proposal. Neither chooses a sufficient hinge quantity.
- Full cup circles must remain within the rectangle. Contact with a full-width entered keep-out band or another cup is a conflict. No blocked hinge is silently removed.
- Remaining skin = actual thickness − maximum tip penetration. The reserve is entered by the user and is not a strength criterion.
- A gap is within the entered band when absolute(reading − target) ≤ tolerance. Missing readings remain null, and detailed tapers require additional field records.

The model does not select hinges, determine support or screw capacity, size doors from openings, locate mounting plates, produce fixing-hole patterns or calculate swept operating clearance. The references in the tool and guides are manufacturer context; interpolation and inspection comparisons are stated studio conventions.

## State and exports

The localStorage key is `wct-door-installation-v1`. Only schema-valid state is saved. A temporarily invalid input keeps the last valid browser draft, blocks exports and explains why. Geometry conflicts remain visible and can be saved as JSON for review; they block drilling CSV/SVG downloads. Storage failure leaves calculation and export available in the current session.

Per-door geometry changes clear that door's physical evidence and gap measurements. Shared drilling settings or hardware reference changes clear all doors' observations. Unit display changes preserve geometry. Target/tolerance changes preserve measured readings and recalculate comparisons.

JSON import has a schema/size check and replacement preview with cancel/apply. It clears imported physical observations. Example replacement and door deletion also require a concrete preview. CSV contains all doors; SVG contains the selected door, with a labeled view and physical scale bar. These are reference files, not machine instructions. Print styling includes the selected map and complete schedule.

## Sources and generation

- `assets/door-installation-core.js`: pure validation, geometry, evidence invalidation and exports.
- `assets/door-installation.js` / `.css`: local UI and responsive layout.
- `scripts/door-installation-data.mjs`: 12 original field methods, worked examples, exercises, stop conditions, FAQs and verified related routes.
- `scripts/build-door-installation.mjs`: hub, guides, metadata/schema and static CSV/SVG/JSON examples.

```sh
npm run generate:door-installation
npm run generate:tools
npm run apply:nav-cta
npm run sitemap
npm run check
```

`npm run test:door-installation` checks coordinate conventions, full-circle containment, contact boundaries, skin reserve, observed gaps, import isolation, export escaping and guide links. `npm run test:door-installation-browser` uses the local preview and an isolated Chrome CDP session (`WCT_CDP_PORT`, default 9341) for interaction, downloads, persistence, errors and responsive route QA.
