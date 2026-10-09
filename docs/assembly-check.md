# Assembly Check

Implemented locally on 2026-10-09 at `/assembly-check/`, with three generator-backed field guides:

- `/assembly-check/measure-diagonals/`: reference face, endpoint labels, equal-side checks, repeat readings and twist boundaries.
- `/assembly-check/tolerance-and-repeatability/`: project limit, individual bounded uncertainty, worked decisions and unit conversions.
- `/assembly-check/dry-fit-release/`: parts, dry-fit seating, plane, measurement review, trial fit and before/after snapshots.

This column fills the inspection step between the existing cabinet design / edging tools and the next fixing operation. The tool records a physical measurement comparison. It does not prescribe a universal tolerance, clamp force or correction displacement, or assess strength, installation adequacy or three-dimensional geometry.

## Model

Saved lengths use millimeters, with millimeter and inch displays. Width and height describe the intended rectangle and calculate the comparison reference `hypot(width, height)`; they do not certify measured side dimensions.

For diagonal readings A and B, individual bounded uncertainty ±u, and a user-chosen diagonal-difference limit t:

- Observed gap: `g = abs(A - B)`.
- Possible absolute gap: `[max(0, g - 2u), g + 2u]`.
- Within: upper bound ≤ t.
- Outside: lower bound > t.
- Borderline: the range crosses t.

A 600 × 800 mm reference rectangle has a 1,000 mm diagonal. A = 1,000 mm, B = 1,002 mm, u = 0.5 mm, t = 2 mm gives a 1–3 mm possible gap and a borderline result. The sample is explicitly an editable illustration, not a saved inspection or a manufacturer tolerance.

Four user-confirmed physical checks remain independent: opposite sides/corners/overall size, plane/support/opposite faces, endpoint references/repeat readings, and seating/downstream trial fit. Only a within reading with all four checks yields a completed review. Editing width, height or either diagonal clears the checks. A result does not verify an isosceles trapezoid, twist, hardware or a changed assembly. Uncertainty is a worst-case input bound, not a statistical confidence interval.

## Ownership and persistence

- `assets/assembly-check-core.js`: bounded comparison, validation, backup contract, sample and CSV encoding.
- `assets/assembly-check.js`: form, unit switching, snapshot history, storage, reviewed imports, downloads and print.
- `assets/assembly-check.css`: responsive layout, code-native diagonal diagram and print styles.
- `scripts/assembly-check-data.mjs`: substantive guide content and descriptions.
- `scripts/build-assembly-check.mjs`: hub, guides, metadata and structured data.

Storage key: `woodcuttool.assembly-check.v1`. Up to 200 snapshots are allowed. Invalid edits block snapshot/backup actions while preserving the last valid draft. Unreadable stored data is preserved until an explicit reviewed import replaces it. Storage failures are surfaced; the current tab and exports remain usable. JSON import validates the full draft and record list, enforces a 1 MB input limit, and requires a Replace or Cancel action. Record deletion has a named confirmation. CSV always records canonical millimeter values, uncertainty bounds, status, timestamps and check states, with escaped cells and formula-leading text protection. Repeated unit switches preserve canonical values rather than feeding rounded display values back into the model.

No account, remote project storage or project upload is added. Existing site conversion runtime behavior is unchanged.

## Integration and regeneration

Entries are present on the homepage, shared Tools navigation and footer, Tools hub, Woodworking tools hub, Cabinet Studio, Edge Banding Planner and Finishing Planner. The hub and its three guides cross-link and lead back into the existing design/parts/checklist workflows. New routes are included in the tools sitemap and generated conversion route registry.

Regenerate the affected surfaces with `generate:assembly-check`, `generate:tools`, `generate:cabinet-studio`, `generate:edge-banding` and `generate:finishing`, followed by `generate:schemas`, `apply:nav-cta` and `sitemap`. The full build includes the new generator and model tests.

## Local validation

`npm run test:assembly-check` verifies bounded comparisons, inclusive decision boundaries, uncertainty, physical gates, invalid values, backup validation, CSV safety and unit-equivalent decisions.

`npm run test:assembly-check-browser` uses an isolated Chrome profile and the local preview, with configurable `WCT_CDP_PORT`, `WCT_ASSEMBLY_ORIGIN` and `WCT_ASSEMBLY_OUTPUT`. It verified editing, all three reading states, physical gates, stale-check clearing, repeated unit switching, save/reload, loading snapshots, CSV and JSON downloads, invalid/canceled/applied imports, canceled/confirmed deletion, corrupt-storage preservation, storage failure fallback and print styling. All four routes passed no-overflow checks at 320, 390, 768 and 1440 pixels with zero runtime exceptions. Screenshots were visually inspected at desktop and 390 pixels, including the form and print styling.

`npm run check` passed the complete site suite: calculation/workflow guards, schema and local-link validation, sitemap signals, SEO, indexability, architecture reachability and conversion checks. The final site contains 2,506 HTML files and 2,406 sitemap URLs. `git diff --check` also passed.

Method references are linked within the guides: WOOD Magazine's authored assembly demonstration and Kreg's measurement/layout reference. The bounded uncertainty comparison is explicitly this tool's model. Deployment and live search indexing are separate from local validation.
