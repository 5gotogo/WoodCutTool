# Interaction and SEO work — 2026-09-21

## Input and scope

The supplied Cloudflare Web Analytics screenshot covers the past 21 days. It reports referrers and visited paths, not search queries, impressions, average position, or CTR. The work therefore used the visible paths to select existing pages, without claiming that they are the highest-volume Google queries.

Selected paths:

- `/blog/`
- `/wood-weight-calculator/`
- `/wood/maple/`
- `/wood/red-oak/`
- `/cabinet-door-calculator/`

## Wednesday: interaction performance

Added `scripts/test-interaction-browser.mjs` for repeatable real-input browser checks. It uses CDP mouse and keyboard input instead of calling handlers directly, applies 4× CPU throttling at 390 × 844, records Event Timing and long tasks, and saves a trace for the 500-panel calculation.

The calculator did not justify a Worker rewrite. Across three final post-build runs, median completion was 22 ms for 2 panels, 34 ms for 50 panels, and 63 ms for 100 rows / 500 individual panels. The highest observed event duration was 80 ms and no long task was recorded. These are local laboratory results, not field INP.

Implemented two bounded responsiveness repairs:

- Coalesced plywood canvas redraws to one animation frame during resize bursts. The regression test sent 50 resize events and observed one redraw cycle, represented by two canvas dimension mutations.
- Avoided replacing the plywood “needs calculation” result repeatedly during continuous input.

The Blog interaction audit found functional problems rather than a slow search:

- Clearing a query left stale result links in the result container.
- A failed first index request remained cached as a rejected Promise and could not retry.
- Rapid new input could leave an obsolete asynchronous response eligible to render.

The Blog runtime now clears stale results while keeping a crawlable complete-archive fallback, resets a failed request for retry, rejects obsolete responses, normalizes each index item once per load, and updates results with one document fragment. Network failure and recovery are covered by deterministic request interception.

Additional verified flows: last-sheet selection, incomplete-layout warning, CSV content and status, mobile menu, Chinese language switch, and four page widths. The CSV check confirms the exported incomplete-layout marker rather than only checking that a click occurred.

## Thursday: existing-page SEO improvements

### Wood weight calculator

Updated the title, description, visible introduction, software schema description, and source metadata. Added the formula, a reproducible 96 × 48 × 0.75 inch example at 36 lb/ft³, density-selection guidance, boundaries around structural/load claims, and contextual links to the relevant species and plywood workflow.

### Cabinet door calculator

Rewrote the opening answer to distinguish overlay and inset arithmetic. Added a worked two-door example: `(30 + 2 × 0.5 − 0.125) ÷ 2 = 15.4375`, displayed as 15.44 inches, with a 25-inch finished height. The calculator output is checked against that example.

### Maple and red oak

Added a small source-backed editorial layer to the wood-species generator so only reviewed high-interest routes receive deeper copy.

- Maple now distinguishes hard maple from the soft-maple trade group, explains that the 1,450 lbf reference applies to hard maple, includes a board-weight example, and links to the hard/soft profiles and cabinet-door workflow.
- Red oak now identifies northern red oak as the page reference, distinguishes the USDA 12%-moisture and green-weight values, includes a worked board-weight example, and separates finished-door dimensions from component cut sizes.
- Article and FAQ structured data use the reviewed page-specific copy.

Primary references:

- USDA Forest Products Laboratory, *Hardwoods of North America*: https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr83.pdf
- USDA Forest Service, red maple characteristics: https://research.fs.usda.gov/silvics/red-maple
- Maple Flooring Manufacturers Association, sugar maple properties: https://www.maplefloor.org/en/physical-properties-and-characteristics/

### Crawlability

Added visible links from the privacy page to the five policy pages that previously depended on JavaScript-rendered shared navigation. The architecture audit now reports and enforces both raw-HTML reachability and rendered-navigation reachability. All 2,385 sitemap routes are reachable in raw HTML; raw maximum click depth is 5, while the rendered navigation model remains at maximum depth 3.

## Verification

- `npm run build`
- `npm run check`
- `git diff --check`
- `npm run test:interaction-browser` with the local gzip preview and isolated Chrome profile
- 16 responsive checks over Maple, Red Oak, Wood Weight Calculator, and Cabinet Door Calculator at 360, 390, 430, and 1,440 px
- Mobile and desktop screenshots inspected

No deployment was performed. Search impact must be evaluated against a future Search Console query/page export and a complete post-change comparison window; Cloudflare path counts alone cannot show query intent or CTR improvement.
