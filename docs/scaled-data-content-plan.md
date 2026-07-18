# Scaled Incremental Data and Deep Content Plan

Updated: 2026-07-18

## Goal

Grow WoodCutTool through original, reproducible woodworking evidence rather than large numbers of keyword-swapped pages. The scalable unit is a declared scenario row in a downloadable dataset. A small number of canonical research reports explain those rows, and a controlled number of Learn guides translate the findings into practical search answers.

The near-term target is:

- 10-15 canonical research reports;
- 50,000-150,000 auditable scenario rows;
- 30-50 genuinely distinct deep guides linked to those reports;
- no per-row or per-keyword landing-page explosion.

This creates more useful indexable content, more citable assets, and more long-tail coverage without manufacturing thousands of near-duplicate URLs.

## Current baseline

The research generator starts from 36 source-linked project parts lists and a deterministic MaxRects-style packing heuristic. Existing datasets isolate project yield, kerf, orientation, sheet format, and edge trim. The first combined dataset adds a 2,520-row robustness matrix:

`36 projects × 7 kerfs × 5 edge-trim margins × 2 orientation modes`.

Every canonical report must retain a visible method, version, source-template URL, limitations, completion status, rejected-piece count, downloadable CSV, Dataset/DataDownload schema, and CC BY 4.0 license.

## Content architecture

### 1. Input layer

Maintain human-reviewed project definitions as the durable source of truth. Each project needs a unique slug, category, public source URL, named parts, dimensions, and quantities. New project inputs should arrive in dated batch modules so additions are reviewable and reversible.

Target expansion:

- 36 → 60 projects: cover the strongest existing template categories;
- 60 → 100 projects: add meaningful dimension variants only when they represent a different construction or purchasing problem;
- avoid changing only a project name while reusing the same parts list.

### 2. Scenario layer

Generate declared factorial datasets around questions users can act on:

| Axis | Initial values | Why it matters |
| --- | --- | --- |
| Sheet format | 5×5, 4×8, 4×10, 5×10 | Fit, handling, sheet count |
| Kerf | 0 to 1/4 inch, seven values | Exact-fit and blade sensitivity |
| Edge trim | 0 to 1 inch, five values | Usable stock and damaged edges |
| Orientation | allowed, locked | Grain and face constraints |
| Quantity multiplier | 1×, 2×, 3×, 5× | Repeated cabinets and production runs |
| Stock allowance | finished, +1/16, +1/8, +1/4 inch | Rough cutting and final sizing |

Do not build one uncontrolled Cartesian product. Partition the axes into datasets that answer one clear question. This keeps files interpretable and reports focused while still allowing tens of thousands of rows.

### 3. Evidence layer

Publish one canonical report per analytical question, not one page per scenario. A report earns an indexable URL only when it has:

- a distinct decision or search intent;
- enough rows to support a real comparison;
- a visible summary table and non-obvious finding;
- method, provenance, limitations, and safe-use guidance;
- a CSV download and machine-readable Dataset metadata;
- links to the calculator, CutList, relevant templates, and deep guides.

Recommended next reports:

1. Quantity scaling and repeat-production sheet efficiency.
2. Rough-cut oversize allowance sensitivity.
3. Sheet format × grain-direction interaction.
4. Replacement-part capacity from modeled offcuts.
5. Cost-per-complete-layout scenarios using declared, user-editable price inputs.
6. Project-family comparisons for cabinets, storage, furniture, and shop fixtures.

### 4. Deep guide layer

Each research report may support two to four Learn guides, but only where the query and recommendation differ. Guides should be 800-1,400 useful words and explain how to apply the data to a real project. They must not paraphrase the same report under several titles.

Good guide types:

- a measurement or input guide;
- a troubleshooting guide;
- a purchase decision guide;
- an interpretation guide;
- a workflow checklist.

The research report links upward to methods and raw data; guides link laterally to related decisions and downward to calculators, templates, and CutList.

## Scale model

A controlled expansion can create substantial data without excessive URLs:

- 60 projects × 7 kerfs × 5 trims × 2 modes = 4,200 robustness rows;
- 60 projects × 4 sheet formats × 7 kerfs × 2 modes = 3,360 format/kerf rows;
- 60 projects × 5 quantity multipliers × 2 modes = 600 production rows;
- 60 projects × 4 oversize allowances × 7 kerfs × 2 modes = 3,360 allowance rows.

That is 11,520 useful rows from four focused datasets, represented by four canonical reports rather than 11,520 pages. Expanding to 100 reviewed projects raises the same set to 19,200 rows without changing the URL model.

## Publication gates

Every batch must pass all of these gates before it is published:

1. Input slugs and scenario keys are unique.
2. Every source URL resolves to an existing local page.
3. Numeric fields contain no NaN, Infinity, undefined, or percentages outside 0-100.
4. `complete_layout` agrees with `rejected_piece_count`.
5. Incomplete rows remain in the data and are never summarized as successful layouts.
6. Scenario dimensions match the declared factorial design.
7. The report has one canonical URL, one title, one description, Dataset/DataDownload schema, visible CSV, license, version, and limitations.
8. Local links, sitemap coverage, SEO audit, and responsive layout pass.
9. A result is labeled as a heuristic estimate, never a guaranteed optimum, construction drawing, or purchase quantity.
10. Generated diffs remain focused; unrelated full-site churn is investigated before acceptance.

Run the focused pipeline:

```bash
npm run generate:research
npm run audit:research-data
npm run generate:learn
npm run apply:nav-cta
npm run sitemap
npm run check
node scripts/audit-seo.mjs
git diff --check
```

## Release sequence

### Phase 0 — implemented foundation

- Publish the 2,520-row plywood layout robustness matrix.
- Add the generic CSV/data integrity audit to the normal research workflow.
- Connect the report to the new kerf, trim, usable-size, and layout-troubleshooting guides.

### Phase 1 — expand source diversity

- Add 24 reviewed project definitions to reach 60.
- Prioritize project families already supported by the template library.
- Require new part geometry, not only renamed copies.
- Regenerate all existing reports so their conclusions update from the larger source set.

### Phase 2 — add production decisions

- Generate quantity-multiplier and rough-cut-allowance datasets.
- Publish one deep report for each decision.
- Add four to six supporting Learn guides only after the reports expose meaningful thresholds.

### Phase 3 — add stock and cost context

- Separate material geometry from optional price inputs.
- Publish cost-per-complete-layout examples with explicit dates, currency, and user-editable assumptions.
- Never present regional price examples as current universal market prices.

### Phase 4 — measured iteration

- Use Search Console impressions and queries to decide which report deserves the next guide.
- Improve titles and explanations on pages receiving impressions but weak clicks.
- Expand datasets when users need more inputs; do not add URLs only to increase page count.

## Operating cadence

- Weekly: one input batch or one scenario dataset, plus audit and regeneration.
- Every two weeks: one canonical deep report if the dataset supports a distinct finding.
- Monthly: review Search Console, internal links, CSV download visibility, and stale assumptions.
- Quarterly: consolidate overlapping guides, update versions, and retire weak or redundant ideas before adding more.

The controlling principle is simple: scale rows faster than URLs, and scale evidence faster than prose.
