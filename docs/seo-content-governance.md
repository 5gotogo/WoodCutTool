# WoodCutTool SEO content governance

Updated: 2026-07-26

## Purpose

WoodCutTool publishes a connected planning system, not a collection of interchangeable keyword pages. Every indexed URL must have one primary search intent, one page role, a reproducible next action, and a clear place in the site link graph.

Page count is a capacity measure. It is never sufficient evidence that a batch should be published.

## Page-role contract

| Surface | Primary question | Required outcome |
| --- | --- | --- |
| Topic hub | Where should I start within this subject? | Map the intent, name the pillar, expose all supporting guides, and route to practical actions |
| Glossary | What does this term mean? | Define the term and connect it to a method |
| Learn guide | How does this method or decision work? | Explain inputs, sequence, evidence, limits, and next action |
| Troubleshooting | Why did this result fail or disagree? | Isolate causes, tests, fixes, stop conditions, and prevention |
| Checklist | Can this irreversible step be released? | Provide observable checks, pass criteria, owner, and stop condition |
| Worksheet | What project-specific evidence must be retained? | Record values with source, owner, date, and revision |
| Template | What parts and checks start this project? | Provide a complete project-specific input set |
| Example | What does a complete input and result look like? | Publish inspectable inputs and downloadable evidence |
| Research or calculator | What does the data or project input produce? | Provide reproducible rows, explicit assumptions, or an actionable result |

Two pages may share a subject only when their primary questions and outcomes differ. A glossary definition must not repeat a Learn guide; a topic hub must not imitate its pillar article; a checklist must not become a tutorial; and a worksheet must not approve the value it records.

## Learn topic-hub standard

Every indexed Learn topic hub must:

1. Use a unique `/learn/topics/<topic>/` route and self-canonical.
2. Answer one broad navigation question in the hero.
3. Name exactly one existing pillar guide.
4. Publish a four-stage workflow, evidence requirement, and stop condition.
5. Link to all guides assigned to the topic.
6. Link to four practical surfaces such as a calculator, app, checklist, worksheet, template, example, troubleshooting page, or research report.
7. Include `CollectionPage`, `ItemList`, `FAQPage`, and breadcrumb structured data.
8. Receive at least five independent internal-link sources.
9. Contain at least 650 visible words and remain readable at 390px and desktop widths.

Every generated Learn guide must link back to its topic hub. The Learn homepage must expose all topic hubs directly; anchor-only topic navigation is not considered a complete cluster route.

## Batch release standard

Before generation:

- Inventory existing slugs, titles, opening answers, and intended actions.
- Reject exact intent collisions and define why close subjects need separate page roles.
- Verify all local routes from generator data.
- State the minimum page count, content depth, inbound-link count, and downloadable-evidence requirement for the surface.

During generation:

- Edit generator or data modules, never generated HTML as the source of truth.
- Fail on duplicate slugs, missing pillar assignments, malformed profile data, or missing local actions.
- Generate the focused surface before shared post-processors.
- Inspect representative output before applying the same template to the full batch.

Before release:

1. Run the focused generator.
2. Apply the required navigation and conversion post-processors.
3. Regenerate sitemap files while preserving content-hash-based `lastmod` values.
4. Run `npm run check`.
5. Run the surface-specific audit and `node scripts/audit-seo.mjs`.
6. Run `git diff --check`.
7. Inspect a representative hub and detail page at 390px and desktop width.
8. Review generated churn and retain only changes belonging to the batch.

## Consolidation and refresh rules

Do not redirect or delete a page only because its traffic is low. Consolidate when two URLs answer the same decision with the same evidence and next action. Preserve distinct project, material, diagnostic, or release intents even when their titles share keywords.

When search-performance data is available, prioritize:

1. High impressions with weak click-through: improve the title and direct answer.
2. Multiple URLs receiving impressions for the same query: compare intent and consolidate only genuine overlap.
3. Traffic without a practical transition: add a relevant calculator, app, worksheet, checklist, example, or dataset.
4. Stale product, price, standard, or workflow claims: verify and update before changing `dateModified`.
5. Pages with no distinct input, evidence, diagnostic, or decision: improve, merge, or remove them from future generation.

## Planned sequence after the 12 topic hubs

| Priority | Direction | Release condition |
| --- | --- | --- |
| 1 | Learn intent inventory and overlap review | All 163 guide titles, openings, clusters, actions, and inbound sources are comparable in one report |
| 2 | Search-performance refresh | Search Console or equivalent evidence identifies real high-impression/low-click or cannibalized queries |
| 3 | Research moat expansion | A reproducible method and downloadable raw rows support each new report |
| 4 | Cluster conversion improvement | Topic hubs expose measurable transitions to the correct tools, apps, worksheets, and downloads |
| 5 | Selective URL expansion | A documented intent gap remains after consolidation and cannot be answered by improving an existing page |

The complete implementation order, schemas, scoring rules, Research backlog, event taxonomy, batch limits, and exit criteria are maintained in [SEO priority execution plan, 2026–2027](./seo-priority-execution-plan-2026-2027.md).
