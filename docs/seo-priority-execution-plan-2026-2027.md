# WoodCutTool SEO priority execution plan, 2026–2027

Updated: 2026-07-26

## Scope and current baseline

This plan begins after the release of 12 indexed Learn topic hubs. It covers the remaining SEO priorities without treating an aspirational page count as permission to publish.

Current planning baseline:

- 163 Learn guides assigned to 12 topic hubs.
- 100 Troubleshooting pages, 70 Checklists, and 60 Worksheets.
- 120 Templates and 75 Examples.
- 8 indexed Research reports plus the Research hub.
- 25 primary calculator and action pages.
- A shared CutList conversion component, conversion-event endpoint, and conversion audit.

The execution order is:

1. Build a comparable Learn intent inventory.
2. Use search-performance evidence to refresh and consolidate.
3. Expand reproducible Research from 8 to 15 report pages.
4. Standardize and measure cluster-to-action conversion.
5. Add URLs only for gaps that survive the first four reviews.

Priorities 1 and 4 can be prepared in parallel because they use repository-owned data. Priority 2 requires Search Console or equivalent performance data. Priority 5 cannot authorize publication until Priorities 1 and 2 have produced evidence.

## Priority 1: Learn intent inventory and overlap review

### Objective

Make all 163 Learn guides comparable in one machine-readable inventory so close keyword variants can be distinguished by actual user decision, evidence, and next action.

### Planned artifacts

- `scripts/build-learn-intent-inventory.mjs`
- `data/seo/learn-intent-inventory.json`
- `docs/learn-intent-review.md`
- `npm run audit:learn-intents`

The inventory should be generated from the same source objects that build Learn pages. Generated HTML may be inspected for words and links, but it must not become the authoritative metadata source.

### Inventory schema

Each guide row must contain:

| Field | Meaning |
| --- | --- |
| `slug`, `route`, `canonical` | Stable identity and public route |
| `title`, `h1`, `description`, `openingAnswer` | Search-result and direct-answer copy |
| `cluster`, `pageRole` | Topic-hub assignment and Learn role |
| `primaryIntent` | One sentence describing the decision the page answers |
| `primaryKeyword`, `supportingKeywords` | Query language, not permission to duplicate |
| `requiredEvidence` | Measurement, test, dataset, specification, or decision needed |
| `primaryAction`, `actionType`, `actionRoute` | The next useful project step |
| `relatedRoutes` | Contextual Learn and cross-surface links |
| `visibleWords`, `inboundSourceCount` | Indexability evidence from generated output |
| `datePublished`, `dateModified` | Source-backed dates only |
| `candidateSet`, `reviewDecision`, `reviewReason` | Consolidation workflow state |

### Candidate detection

The report should flag candidates, not merge them automatically:

1. Exact normalized H1, title, description, or primary-intent collisions.
2. Guides in the same topic hub with title-token Jaccard similarity of at least 0.65.
3. Guides sharing the same declared primary keyword.
4. Guides whose opening answers and primary actions describe the same decision.
5. Once performance data exists, routes receiving impressions for a materially overlapping query set.

### Review decisions

Every candidate set receives one of four decisions:

- **Keep:** same subject, but different decision, evidence, page role, or action.
- **Differentiate:** both URLs remain, but opening answer, title, evidence, or action must be made more explicit.
- **Merge:** one page can completely satisfy both intents and retains the combined useful content.
- **Redirect:** used only after a merge and only when query, link, and performance evidence supports one destination.

`noindex` is not a substitute for resolving a generated duplicate. Deleting or redirecting solely because a page has low traffic is prohibited.

### Batch and exit criteria

- Batch 1: generate and validate all 163 inventory rows.
- Batch 2: manually review the highest-similarity candidate sets, maximum 25 sets.
- Batch 3: implement only evidence-backed differentiations or consolidations.

Priority 1 is complete when:

- All 163 guides have every required inventory field.
- No slug, canonical, primary intent, or cluster assignment is missing.
- Every flagged candidate set has a recorded decision and reason.
- All changed routes preserve valid local links, sitemap coverage, and intended redirects.
- `npm run check`, `audit:learn-intents`, SEO audit, diff check, and representative browser QA pass.

## Priority 2: Search-performance refresh

### Objective

Use observed query and page performance to improve existing URLs before producing new ones.

### Required inputs

Use a minimum 90-day query/page export, with 16 months preferred when available:

- Page
- Query
- Clicks
- Impressions
- Click-through rate
- Average position
- Device
- Country
- Date range

Join only aggregate performance data to the local route inventory. Do not store user-level search or analytics records in the repository.

### Prioritization model

Create a refresh score from 0–100:

| Signal | Weight | Rule |
| --- | ---: | --- |
| Impression opportunity | 25 | Higher impressions receive higher priority |
| CTR gap | 25 | Compare CTR with pages in a similar average-position band |
| Query overlap | 20 | Multiple local URLs compete for the same decision-shaped queries |
| Action gap | 15 | Search traffic reaches the page but lacks a relevant tool or evidence transition |
| Freshness risk | 15 | Product, price, standard, source, or workflow claims may be stale |

The score ranks review work; it does not select a fix automatically.

### Refresh playbooks

1. **High impressions, low CTR**
   - Rewrite the title and meta description around the verified query intent.
   - Put the direct answer in the opening paragraph.
   - Preserve the canonical and avoid changing body scope without evidence.

2. **Position 4–15 with strong engagement**
   - Improve the answer structure, evidence, internal links, and topic-hub path.
   - Add a relevant example, checklist, worksheet, calculator, or dataset.

3. **Multiple pages for one query**
   - Compare intent-inventory rows.
   - Keep distinct decisions; differentiate ambiguous openings.
   - Merge only when the same evidence and action fully satisfy both routes.

4. **Traffic with weak action transition**
   - Add one context-matched primary action.
   - Do not send tile, quilt, stair, or general estimating readers to CutList when another tool is the correct next step.

5. **Stale factual claims**
   - Verify against current primary sources.
   - Change `dateModified` only when the substantive page content was actually reviewed and updated.

### Cadence and measurement

- Review 10–20 URLs per monthly batch.
- Record a pre-change 28-day baseline.
- Compare the next full 28-day period, while noting ranking and seasonality changes.
- Do not reverse a useful content improvement solely because one short window is noisy.

Report by topic hub:

- Indexed pages
- Impressions and clicks
- CTR
- Query coverage
- Average position bands
- Tool transitions
- CSV downloads
- App Store outbound clicks

### Missing-data fallback

If Search Console data is unavailable, complete only local inventory, content freshness, broken-path, and action-gap reviews. Do not perform query-cannibalization redirects without observed query evidence.

Priority 2 is complete for a quarter when every selected URL has:

- A recorded signal, chosen playbook, and before snapshot.
- A generator-backed change or a documented no-change decision.
- A 28-day follow-up result.
- No canonical, sitemap, schema, or responsive regression.

## Priority 3: Research moat expansion

### Objective

Grow from 8 to 15 indexed Research report pages through reproducible modeled datasets. Every report must publish raw rows, method version, complete-layout state, and limitations.

### Seven-report backlog

| Batch | Report | Core method and evidence |
| --- | --- | --- |
| R1 | Offcut remake feasibility | For each existing example layout, test whether retained rectangular offcuts can reproduce selected project parts; publish part IDs, offcut sizes, fit result, and completion flag |
| R1 | Defect-zone sensitivity | Apply explicit corner, edge, and bounded rectangular defect zones to the shared project set; record usable geometry, rejected parts, sheets, and completion |
| R2 | Visible-panel rotation constraints | Compare unrestricted, visible-parts-locked, and all-parts-locked scenarios using declared face/grain classes |
| R2 | Normalized sheet-price break-even | Compare sheet formats using price ratios rather than live market prices; publish the cost-ratio thresholds at which the preferred format changes |
| R3 | Dimension-rounding sensitivity | Compare documented millimeter and fractional-inch rounding policies without claiming one convention is universally correct |
| R3 | Mixed-format stock allocation | Test explicitly limited combinations of 4×8, 5×5, 4×10, or other modeled formats; require a complete-layout flag for every result |
| R4 | Layout fragmentation and reusable remainder | Classify retained rectangles by declared minimum reusable sizes and compare useful remainder with total unused area |

The first six reports use modeled project inputs. The seventh measures a declared offcut classification, not observed shop reuse.

### Research data contract

Every CSV row must include:

- Dataset and method version
- Source example or template route
- Input stock dimensions and units
- Kerf, trim, rotation, grain, and defect assumptions where applicable
- Scenario identifier
- Estimated sheet count
- Rejected-piece count
- `complete_layout`
- Report route
- Limitation or interpretation class when the row can be misunderstood

Every report must include:

- A plain-language direct answer
- Method and version
- Input population
- Downloadable raw CSV
- Summary table or visualization
- At least one complete worked example
- Limitations and non-claims
- Links to the relevant calculator, Learn hub, troubleshooting page, and source examples
- `Dataset`, `DataCatalog`, `DataDownload`, breadcrumb, and report schema

### Prohibited claims

- Do not describe modeled layouts as observed customer behavior or actual shop waste.
- Do not publish live price comparisons without dated primary price sources.
- Do not claim structural, safety, or code conclusions from layout simulations.
- Do not publish “planned versus actual” benchmarks without consented, consistently defined, de-identified closeout records.

### Batch and exit criteria

Ship four Research batches: 2 + 2 + 2 + 1 reports. Each batch must:

- Use one shared generator/data source.
- Assert expected scenario and row counts.
- Pass `audit:research-data`.
- Preserve source-template references and complete-layout flags.
- Pass site, SEO, sitemap, diff, 390px, desktop, table-overflow, and dark-mode checks.

Priority 3 exits at 15 indexed report pages, not 15 including the Research hub.

## Priority 4: Cluster conversion improvement

### Objective

Make every topic cluster lead to the correct next action and measure the transition without misleading readers or collecting sensitive data.

### Event taxonomy

Extend the existing conversion system with aggregate, non-personal events:

| Event | Required dimensions |
| --- | --- |
| `topic_action_click` | `cluster`, `source_route`, `placement`, `destination_type`, `destination_route` |
| `pillar_guide_click` | `cluster`, `source_route`, `destination_route` |
| `worksheet_download` | `cluster`, `source_route`, `asset_route` |
| `checklist_download` | `cluster`, `source_route`, `asset_route` |
| `example_download` | `cluster`, `source_route`, `asset_route` |
| `research_download` | `cluster`, `source_route`, `dataset`, `version` |
| `calculator_start` | `cluster`, `source_route`, `calculator` |
| `calculator_result` | `cluster`, `source_route`, `calculator`, non-sensitive result class |
| `app_store_outbound` | `cluster`, `source_route`, `placement`, `app` |

Do not send entered project dimensions, document contents, personal identifiers, contact details, or full referrer/query strings.

### Transition contract

Each of the 12 topic hubs must expose:

- One pillar-guide route.
- One immediate calculator, app, or tool action.
- One evidence route such as a Worksheet, Example, or Research report.
- One release or diagnostic route such as a Checklist or Troubleshooting page.

Each Learn guide must expose one primary action matching its assigned cluster. Additional links may support the workflow but must not compete visually with the primary next step.

### Implementation sequence

1. Inventory existing `data-conversion-*`, App Store, download, and calculator-result placements.
2. Define the event schema and reject unknown event names or dimensions.
3. Add cluster IDs from the Learn profile source rather than duplicating mappings in HTML.
4. Instrument topic hubs first, then Learn guides, downloads, and calculator results.
5. Extend the conversion audit to require source, placement, destination, and privacy-safe payloads.
6. Produce a monthly cluster-transition report.

### Metrics

- Topic-hub-to-pillar rate
- Topic-hub-to-action rate
- Guide-to-tool rate
- Download rate by asset type
- Calculator start-to-result rate
- Result-to-app outbound rate
- Destination mismatch rate
- Broken or untagged action count

These are navigation and product-transition measures, not proof that a project result was correct or that an App Store install occurred.

### Guardrails and exit criteria

- No forced redirects, countdowns, interstitials, or misleading “transfer to app” claims.
- Clearly state when browser inputs are not transferred automatically.
- Use the correct app or calculator for tile, quilt, stairs, construction, and woodworking contexts.
- Preserve useful non-commercial actions such as downloads and diagnostics.

Priority 4 is complete when:

- All 12 topic hubs and their four primary actions use validated event metadata.
- All CSV downloads and App Store outbound links are classified.
- The conversion audit reports zero missing, unknown, or privacy-unsafe event fields.
- One full monthly report can be grouped by cluster, route, placement, and destination type.

## Priority 5: Selective URL expansion

### Objective

Publish only search-intent gaps that cannot be satisfied by improving, differentiating, or consolidating an existing route.

### Eligibility score

Every candidate receives a 0–100 release score:

| Dimension | Weight | Required evidence |
| --- | ---: | --- |
| Distinct search decision | 25 | Does not duplicate an existing primary intent |
| Unique evidence | 25 | New measurements, parts, checks, dataset rows, comparison boundary, or diagnostic tests |
| Practical action | 20 | Real tool, app, download, checklist, worksheet, or reproducible method |
| Internal-link position | 15 | Named topic hub, pillar, sibling routes, and at least four planned inbound sources |
| Search or workflow evidence | 15 | Query data, support pattern, missing project workflow, or documented cluster gap |

A candidate must score at least 80 and cannot score zero in any dimension.

### Preferred expansion order

1. Improve an existing guide or hub.
2. Add evidence to an existing Troubleshooting, Checklist, Worksheet, Template, Example, or Research route.
3. Add a new page inside an existing surface.
4. Add a new surface only when the page-role contract cannot represent the user need.

### Approved batch shapes

- 5–10 high-detail Learn, Compare, or Troubleshooting pages.
- 10–20 structured Templates, Examples, Checklists, or Worksheets with genuinely different inputs.
- 5–12 Component models with independent formulas, static default output, test-piece gates, and a merged browser-local project export.
- One Research dataset and report, or one tightly connected two-report batch.
- No open-ended blog batch until its routes, intents, and durable destinations are defined.

### Candidate disposition

Each proposed URL is marked:

- `improve-existing`
- `differentiate-existing`
- `research-first`
- `approved-new-url`
- `hold-for-performance-data`
- `reject-duplicate`

Only `approved-new-url` enters a generator batch.

### Exit criteria for each batch

- The inventory confirms no same-intent collision.
- Source data enforces unique inputs or evidence.
- Every new route has a topic-hub assignment and at least four real inbound sources.
- Titles, canonicals, descriptions, schema, sitemap, and local links pass.
- Surface-specific word, diagnostic, download, or data-row gates pass.
- Representative 390px, desktop, overflow, dark-mode, and console checks pass.
- A six-month review date is recorded.

## Cross-priority schedule

| Window | Primary output | Publication boundary |
| --- | --- | --- |
| Jul–Aug 2026 | Learn intent inventory and conversion-event inventory | No automatic merges or new Learn batch |
| Sep 2026 | First search-performance refresh and R1 Research batch | Requires query export for consolidation decisions |
| Oct–Dec 2026 | Monthly refreshes, R2, topic-hub event coverage | New URLs only when inventory score is at least 80 |
| Jan–Mar 2027 | Formal Learn consolidation review, R3 | Redirects require content and performance evidence |
| Apr–Jun 2027 | R4, Research reaches 15 reports, cluster conversion review | Do not substitute page volume for missing evidence |
| Quarterly | Checklists, Worksheets, Examples, Templates gap review | Add only distinct release, record, or project inputs |

## Master status record

Maintain one status table in this document or a generated companion report:

| Work item | Priority | Owner/source | Status | Entry evidence | Exit evidence | Review date |
| --- | --- | --- | --- | --- | --- | --- |
| Learn intent inventory | P1 | Learn generator | Planned | 163 guides + 12 hubs | 163 complete rows and reviewed candidate sets | 2026-08 |
| Search refresh batch | P2 | Performance export | Blocked on data | 90-day query/page export | 28-day follow-up | Monthly |
| Research R1–R4 | P3 | Research generator | Planned | Shared examples and declared methods | 15 report pages | 2027-06 |
| Cluster event coverage | P4 | Conversion components | Planned | Existing endpoint and CTA audit | Validated monthly cluster report | 2026-12 |
| Selective URL batch | P5 | Surface generator | Gated | Inventory + performance or workflow gap | Score ≥80 and full release QA | Per batch |

## Global definition of done

No priority or batch is complete until:

- Its source and generated artifacts are reproducible.
- Required counts and schemas are asserted.
- Local routes and canonicals resolve.
- Sitemap `lastmod` changes are limited to substantive content changes.
- `npm run check`, relevant audits, SEO audit, and `git diff --check` pass.
- Representative 390px and desktop browser checks show no page-level overflow or console errors.
- Measurement, caveats, and the next review date are recorded.
