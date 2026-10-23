# Drawer Fit Studio

Added 2026-10-23 at `/drawer-fit/`: one browser-local planner, ten distinct field guides and reproducible CSV, JSON and SVG example downloads. The homepage, shared latest-tools menu/footer, both relevant tools hubs and cabinet/shelf-pin/joinery workflows link to the topic.

## Sources and generation

- `assets/drawer-fit-core.js`: bounded project parser, common side-space interval, box/front calculations, parts CSV and schematic SVG.
- `assets/drawer-fit.js`: form, physical observations, local draft, file import preview/cancel/apply, downloads and print action.
- `assets/drawer-fit.css`: responsive page, planner and print styles; the existing postprocessor inlines it after `workflow-shell.css`.
- `scripts/drawer-fit-data.mjs`: ten chapters with independent worked reviews, four practical stages, stop conditions, FAQ and contextual next actions. Manufacturer references were checked on 2026-10-23.
- `scripts/build-drawer-fit.mjs`: static hub, guide metadata/schema and three downloadable examples. Related routes and guide slugs are validated before generation.
- `scripts/test-drawer-fit.mjs`: arithmetic, boundary, import/export and content contracts, including 240 varied geometry cases.

The hardware references are Accuride's side-space, installation and fixing guidance plus Blum's TANDEM assembly index. The tool does not embed a branded hardware preset. Example dimensions are illustrative. The hardware record is user-supplied and does not alter the construction model.

## Model

All dimensions use millimeters. One project represents equal side-mount drawers in equal bays, with full-length sides, structural front/back between the sides and an applied bottom covering the footprint. Actual wall and bottom thicknesses are explicit inputs. Total outside box height includes the applied bottom. Fronts use an independently entered envelope, edge gaps and uniform internal gaps.

For mounting widths W and allowed per-side gap [a,b], a centered box B must satisfy every interval [W−2b,W−2a]. Their intersection is [max(W)−2b,min(W)−2a]. The chosen width is min(W)−2×target. A feasible intersection does not imply that every target fits it. Depth subtracts box-front setback and outside length; equal-bay height subtracts intermediate rails before division. Both rear and vertical reserves are checked.

The default three-drawer example gives a 474 mm outside box, 450 mm front/back length and 144 mm wall height. Its 18 total finished pieces are six sides, six structural fronts/backs, three applied bottoms and three decorative fronts. Decorative fronts are 532 × 209.333 mm in the displayed schedule.

The centered-gap assumption does not prove each physical side gap, straightness between three stations, alignment, fixing or bottom strength, operating clearance or load capacity. Front geometry does not position boxes or fixing holes. Grooved bottoms and undermount preparation require the selected system's own complete construction schedule. CSV sizes exclude kerf, trimming and edging deductions; SVG drawings are schematic, not drilling or full-size templates.

## Draft and evidence behavior

Geometry, drawer-count and hardware-record edits clear all physical observations. Notes and project-label changes retain them. Import preserves the backup's historical observations and previews replacement before application; cancel retains the current draft. JSON version, text lengths, finite dimensions and drawer count are validated. Unknown properties are discarded. Invalid geometry blocks CSV/SVG output. Incomplete fields retain the previous parseable saved draft. A failed local-storage read or write reports the fallback; calculation and explicit exports remain available in the session. No project data is uploaded by this feature.

## Verification

```sh
npm run generate:drawer-fit
npm run test:drawer-fit
npm run generate:tools
npm run apply:nav-cta
npm run sitemap
npm run check
git diff --check
```

`npm run build` also generates and tests the topic. Review unrelated generated formatting changes after a whole-site build.

Browser QA used the local server on port 4175. Verified startup, example results, impossible taper blocking exports, evidence reset after hardware edits, plan/front switching, saved-draft reload, import preview/cancel/apply and real CSV/JSON/SVG downloads. Inspected the hub at 390 × 844 and full desktop width, plus the guide layout in the in-app browser. Downloads were read back to confirm actual dimensions, quantities, edited hardware and the requested SVG view. This verification is local; no deployment or production indexing claim is made.
