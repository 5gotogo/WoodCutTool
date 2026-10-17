# Joinery Lab

Added 2026-10-18 at `/joinery-lab/`: one topic hub, six independently useful interactive planners, eighteen authored field guides and thirteen static reference downloads.

## Sources and regeneration

- `assets/joinery-core.js`: bounded input schema, six geometry models, SVG schematics and dimension CSVs.
- `assets/joinery-lab.js` and `.css`: guide search/filtering, live forms, mm/in display, shared local project, physical observations, replacement previews and downloads.
- `scripts/joinery-data.mjs`: three distinct guides per joint family, authored examples, release checks, stop conditions and scoped references.
- `scripts/build-joinery-lab.mjs`: all 25 pages, Article/WebApplication/CollectionPage, breadcrumb/FAQ markup, example SVG/CSV and shared JSON project.

```sh
npm run generate:joinery-lab
npm run test:joinery-lab
npm run generate:tools
npm run apply:nav-cta
npm run sitemap
npm run check
git diff --check
```

The build and check pipelines include the generator and model tests. Shared navigation/footer, homepage, both tool hubs, runtime profiling, sitemap-tools and conversion route registration expose the new surface. The generator requires six families, three distinct guides per family, collision-free routes and at least 350 authored words per guide.

## Model contracts

All internal dimensions and exported lengths use millimeters. Decimal-inch display divides by 25.4 without changing stored geometry. Input ranges are software bounds rather than design recommendations. All default dimensions and allowances are illustrative, independently authored examples.

- Dado: one straight through housing; width = mating thickness + total allowance; floor = host thickness − recess depth; both walls remain inside the entered span.
- Rabbet: one open far-edge recess; shoulder = span − seat width; remaining lip must be positive. Its entered axes must match the physical section.
- Half-lap: two rectangular members at 90 degrees; depth B balances the entered stack after depth A. Each member retains positive material. Widths receive the crossing member plus one total allowance.
- Mortise/tenon: one centered rectangular tenon with four positive shoulders and a centered blind rectangular pocket with positive receiving walls. A single total allowance is applied independently to thickness and width. Round corners, haunches and offsets are separate details.
- Dowels: one equally spaced row on two identical opposing rectangular faces, with at least two whole holes. The full circles fit within the faces without touching neighbors. Usable cylindrical depth and additional point penetration are separate. The model does not transform coordinates for an edge-to-face jig configuration.
- Box joint: nominal complementary intervals across a common span. A keeps even-index intervals; B keeps odd-index intervals. A partial final interval remains visible. Cut depth in each panel receives the other panel thickness plus an explicit extra depth. Cutter kerf, fit compensation and jig indexing are excluded.

SVGs are labeled schematics, not full-size templates or machine programs. Models do not select mechanical joint capacity or establish a structural rating. Manufacturer references describe their own systems; the USDA chapter and Titebond FAQ supply general bonding/product context. References are scoped on the pages and do not endorse sample dimensions.

## Local project behavior

One versioned project contains six separate dimension sets and evidence arrays, with shared name, revision, display unit and notes. Dimension edits clear only that joint's observations. Invalid geometry hides the drawing/register and blocks geometry exports. Incomplete or out-of-range inputs do not overwrite the last parseable saved draft. Storage failure leaves a usable in-memory calculator and downloads.

JSON import validates the complete bounded schema and previews replacement of all six records before applying. Cancel leaves the current project intact. Reset previews replacement of the active joint only. Imported observations remain a snapshot and must be checked against current physical parts. JSON backups are the portable editable format; CSV/SVG are reference outputs.

## Browser QA

Use the local preview with the supported browser tooling. Verify guide search and family filters, live numerical changes, mm/in round trips, evidence clearing, invalid-output hiding, cross-tool persistence, actual CSV/SVG/JSON downloads, import preview/cancel/apply, reset scope, storage fallback and print output. Inspect the hub, every planner and representative guides at narrow and wide viewport sizes; verify all 25 routes for horizontal overflow and runtime errors.

### Verified on 2026-10-18

- Full `npm run build` passed. Unrelated regeneration churn was removed, then shared chrome and sitemap were regenerated and final `npm run check` passed.
- All 25 routes passed horizontal-overflow inspection at 320, 390, 768 and 1440 px (100 route/viewport checks). Desktop workspace and mobile mortise/tenon output were visually inspected.
- Browser interactions passed: family/search filtering and empty results; live calculations; mm/in changes; evidence clearing; invalid drawing/export blocking; incomplete-input save protection; reload recovery; reset preview/cancel/apply; invalid import rejection; import preview/cancel/apply; shared project persistence; unequal half-lap depth; dowel tip boundary; box-joint remainder and keyboard observation toggles.
- Actual CSV, SVG and JSON downloads were read back and their dimensions/project payload verified. The clean example project was restored after QA.
- Final preview error log was empty. Eighteen guides contain 7,658 authored words in total, with at least 410 per guide before the shared page furniture.
- Print invoked a blocking native interface. It was closed by closing the temporary test tab; printed pagination was not visually verified. Browser-storage denial was not forced during this browser session; the fallback is implemented but remains outside this session's browser evidence.
- No deployment or remote push was performed.
