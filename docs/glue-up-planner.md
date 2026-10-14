# Glue-Up Planner

Reviewed and locally validated: 2026-10-14 (Asia/Shanghai).

## Scope and source

`/glue-up/` fills the gap between the existing dry-fit / glue-up release checklists and the glue-up record worksheet. Three generator-backed field guides cover the two assembly deadlines, rehearsing and splitting independent batches, and release evidence / revision records.

Source data and copy: `scripts/glue-up-data.mjs`. HTML generator: `scripts/build-glue-up.mjs`. Calculation and backup validation: `assets/glue-up-core.js`. Browser persistence, row controls, evidence checks, import preview and exports: `assets/glue-up.js`. Styles: `assets/glue-up.css`.

Manufacturer reference examples:

- [Titebond Original](https://www.titebond.com/product/glues/d4d28015-603f-4dfc-a7d9-f684acc71207): open 4–6 minutes, total 10–15 minutes at 70°F / 50% RH; load 4 and 10.
- [Titebond III](https://titebond.com/product/glues/e8d40b45-0ab3-49f7-8a9c-b53970f736af): open 8–10 minutes, total 20–25 minutes at 70°F / 50% RH; load 8 and 20.
- [Titebond FAQ](https://www.titebond.com/resources/use/glues/faqs): clamp holding and drying require separate review.

The lower endpoints are an explicit planning choice. Actual adhesive instructions and shop conditions must support entered limits. Edited reference values normalize to a custom reference. Product choices are examples, not suitability recommendations.

## Method v1

Open used = spreading + mating all joints. Total used = open used + applying final pressure. Both start at the first adhesive in the batch. Each margin subtracts the requested reserve as well as its used duration. Negative margins ask for timing revision; exact zero is a planning boundary. The three user evidence checks remain separate from the timing result.

Setup occurs before first adhesive. Independent batches run serially, with the next batch starting after the preceding final-pressure endpoint plus its own setup. A shared wet joint cannot reset its adhesive clock by moving to another row. The model does not allocate clamps, solve parallel staffing, calculate adhesive volume / clamp force / bond capacity, or schedule clamp removal, cure, handling or machining.

The sample has two batches with 1.5 minutes spreading, 1 minute mating and 2 minutes applying pressure each. Setup takes 2 and 3 minutes. The second first-adhesive offset is 9.5 minutes and its final-pressure endpoint is 14 minutes. With 4 / 10 limits and a 1 minute reserve, each batch has 0.5 / 4.5 minutes remaining.

## Integration and generation

`generate:glue-up` and `test:glue-up` are registered in package scripts and in the build/check sequences. The tools hub, woodworking hub, navigation/footer, Cabinet Studio and Assembly Check link the topic. The sitemap puts all four routes in the tools sitemap; conversion route registration is regenerated. Topic pages use the small workflow stylesheet profile and retain their own module and scoped stylesheet.

Generate with `npm run generate:glue-up`, `npm run generate:tools`, `npm run generate:schemas`, `npm run generate:meta`, `npm run apply:nav-cta`, `npm run sitemap`, then `npm run check` and `git diff --check`. The tools generator now emits BreadcrumbList before the richer schema postprocessor runs, preventing a focused regeneration from dropping the primary hub’s breadcrumb schema.

Shared footer changes on the 200 Wood Species pages and the generated wood menu are intentional navigation updates. Existing lastmod dates on 23 unchanged calculator pages were preserved while reconciling their stale content signatures.

## Local verification

- Core tests: sample arithmetic, serial offsets, setup exclusion, shared start for both limits, reserve boundary / overrun, invalid backups and non-finite values, numeric and text CSV cells, editable backup round trip, custom-reference normalization.
- Full `npm run check`: passed, including indexability, SEO, architecture and conversion audits. 2,517 HTML files; 2,417 sitemap URLs across 10 sitemaps.
- Browser: sample calculation, negative margin, exact boundary, blank numeric input disables exports and clears results, reference switching, adding/removing a batch, persistence after reload, evidence invalidation after a row edit, CSV download, import preview, cancel, replace and invalid-backup rejection. No observed browser console warnings/errors.
- Responsive QA: 1,440 px desktop; 390 px hub and first guide. At 390 px, document scroll width equals viewport width. Screenshots inspected for hero, controls, evidence and results, and guide typography.
- Print action is implemented through the native print dialog and print CSS; a paper/PDF printout was not inspected. Storage recovery/failure paths are implemented but browser storage denial/corruption was not injected during QA.

This task changed local source and generated output. Production deployment was not performed.
