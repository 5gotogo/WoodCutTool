# Internal Linking Strategy — woodcuttool.com

Goal: a tight woodworking topic cluster where every money page (tools) and every
authority page (learn articles) sits **≤ 3 clicks from the homepage**, with anchor
text that reinforces target keywords and contextual links placed in body copy — not
just nav/footer boilerplate.

Scope of this strategy: the woodworking cluster only —
`/tools/` hub, the calculators, and `/learn/` articles. (The 30+ productivity apps in
`/apps/` are a separate cluster reached via the tools hub and are out of scope here.)

---

## 1. Current state (audit)

What already works:

- **Hubs are healthy.** `/tools/` and `/learn/` each link out to every tool and every
  article in body grids. Both are 1 click from home (header nav + hero buttons).
- **Every learn article links up** to `/learn/` (3×) and `/tools/` (5–7×), plus to
  CutList and the core calculators via a "Related tools" block.

The three gaps that cap crawl efficiency and link equity:

| # | Gap | Evidence | Impact |
|---|-----|----------|--------|
| G1 | **No tool page links to any deep `/learn/` article** — only to the `/learn/` hub. | `grep href="/learn/<slug>/"` across all 8 tool pages = NONE | Deep articles get equity only from hubs. Tools have no topical/contextual relevance signal to supporting content. |
| G2 | **Learn articles barely cross-link to each other.** | 8 of 10 articles have zero sibling links | Flat cluster. Google sees 10 loosely related pages, not one authoritative topic. No equity sculpting toward the priority "pillar" articles. |
| G3 | **Construction calculators (stair, tile, quiltfit) are orphaned from `/learn/`.** | No article links to `/stair-stringer-calculator/`, `/tile-calculator/`, `/quiltfit/` | These rank only off the hub + sitemap. No contextual support. |

Crawl depth today (from `/`):

```
/  (depth 0)
├─ /tools/                         depth 1   (header nav)
├─ /learn/                         depth 1   (header nav)
├─ /plywood-cut-calculator/        depth 1   (header nav)
├─ /tile-calculator/               depth 1   (header nav)
├─ /apps/cutlist/                  depth 1   (header nav)
├─ /cut-list-calculator/           depth 2   (via /tools/ grid)
├─ /wood-waste-calculator/         depth 2   (via /tools/ grid)
├─ /board-foot-calculator/         depth 2   (via /tools/ grid)
├─ /stair-stringer-calculator/     depth 2   (via /tools/ grid)
├─ /stringer/, /quiltfit/          depth 2   (via /tools/ grid)
└─ /learn/<all 10 articles>/       depth 2   (via /learn/ grid)
```

**Verdict: depth ≤ 2 is already met for the woodworking cluster.** No page is buried.
The work is not "make it shallower" — it's "make the links at depth 1–2 *contextual and
keyword-rich* so equity and relevance flow correctly." The fixes below also add lateral
(sibling) links that don't change depth but strengthen the cluster.

---

## 2. Target link graph

Hub-and-spoke with a designated **pillar** and lateral spokes.

```
                          ┌──────────┐
                          │    /     │  (home)
                          └────┬─────┘
              ┌────────────────┼────────────────┐
         ┌────▼────┐      ┌────▼────┐      core calc pages
         │ /tools/ │◄────►│ /learn/ │      (header-nav: plywood, tile)
         └────┬────┘      └────┬────┘
              │ (grid)         │ (grid)
   ┌──────────┴───────┐   ┌────┴───────────────────────────┐
   ▼     ▼     ▼   ... ▼   ▼        ▼          ▼      ...    ▼
 calculators           PILLAR ──► supporting articles ──► calculators
                  what-is-cut-     (cross-linked         (contextual,
                  list-optim.      sibling spokes)        in body copy)

   ◄──────────────  every calculator links back to 1–2  ──────────────►
                    contextually-matched learn articles
```

### 2.1 Pillar + supporting article roles

Designate **`/learn/what-is-cut-list-optimization/`** as the cluster pillar
(definition-led, broadest intent, already the most-linked article internally).
All other articles link **up to the pillar once** in body copy; the pillar links
**down to each supporting article**.

| Role | Article | Primary keyword it owns |
|------|---------|-------------------------|
| **Pillar** | what-is-cut-list-optimization | "cut list optimization" |
| Supporting | how-to-reduce-plywood-waste | "reduce plywood waste" |
| Supporting | plywood-cutting-optimization | "plywood cutting optimization" |
| Supporting | sheet-layout-optimization | "sheet layout optimization" |
| Supporting | cut-list-planner | "cut list planner" |
| Supporting | best-woodworking-calculator-workflow | "woodworking calculator workflow" |
| Supporting | woodworking-material-calculator | "woodworking material calculator" |
| Supporting | material-estimation-for-carpentry | "material estimation for carpentry" |
| Supporting | diy-wood-project-estimation | "diy wood project estimation" |
| Supporting | diy-workshop-planning-guide | "diy workshop planning" |

### 2.2 Tool ↔ article pairing (fixes G1 + G3)

Each calculator gets a contextual in-body link to the 1–2 articles that explain its
job, and each of those articles links back to the calculator. Bidirectional pairing:

| Calculator | Pair with article(s) |
|------------|----------------------|
| /plywood-cut-calculator/ | plywood-cutting-optimization · how-to-reduce-plywood-waste |
| /cut-list-calculator/ | cut-list-planner · what-is-cut-list-optimization |
| /wood-waste-calculator/ | how-to-reduce-plywood-waste · sheet-layout-optimization |
| /board-foot-calculator/ | material-estimation-for-carpentry · woodworking-material-calculator |
| /stair-stringer-calculator/ | diy-workshop-planning-guide · material-estimation-for-carpentry |
| /tile-calculator/ | material-estimation-for-carpentry (+ blog: tile-layout-planning) |
| /quiltfit/ | best-woodworking-calculator-workflow (maker-workflow angle) |
| /stringer/ | diy-workshop-planning-guide |

---

## 3. Anchor text & SEO linking phrases

**Rules:**
- Use **descriptive, keyword-bearing** anchors — never "click here" / "read more" /
  bare URLs.
- **Vary** anchors to the same target across pages (avoid 1 exact-match string sitewide;
  mix exact, partial, and natural-phrase variants).
- Keep article→tool anchors **action-oriented** ("run the…", "plan your…"); keep
  article→article anchors **topical** ("learn how…", "see our guide on…").

### 3.1 Anchors TO each tool (use varied forms across linking pages)

| Target | Exact-match anchor | Partial / natural variants |
|--------|--------------------|----------------------------|
| /plywood-cut-calculator/ | "plywood cut calculator" | "plan the cuts in our plywood calculator" · "free plywood sheet cutting calculator" |
| /cut-list-calculator/ | "cut list calculator" | "build a board cut list" · "our woodworking cut list calculator" |
| /wood-waste-calculator/ | "wood waste calculator" | "estimate your scrap and waste cost" · "material waste calculator" |
| /board-foot-calculator/ | "board foot calculator" | "calculate board feet and lumber cost" · "lumber material calculator" |
| /stair-stringer-calculator/ | "stair stringer calculator" | "lay out rise, run, and stringer length" · "DIY stair stringer tool" |
| /tile-calculator/ | "tile calculator" | "estimate tile, boxes, and grout" · "tile material calculator" |
| /quiltfit/ | "QuiltFit calculator" | "plan fabric, blocks, and cutting lists" |
| /apps/cutlist/ | "CutList app" | "save plywood layouts in the CutList iPhone app" · "cut list optimizer app" |
| /tools/ | "all WoodCutTool tools" | "browse the full tools hub" |

### 3.2 Anchors TO each learn article (from tools & siblings)

| Target | Recommended anchors |
|--------|---------------------|
| what-is-cut-list-optimization | "what cut list optimization is" · "learn how cut list optimization works" |
| how-to-reduce-plywood-waste | "how to reduce plywood waste" · "cut plywood waste before you buy sheets" |
| plywood-cutting-optimization | "plywood cutting optimization guide" · "optimize your plywood cutting layout" |
| sheet-layout-optimization | "sheet layout optimization" · "lay out sheet goods with less waste" |
| cut-list-planner | "build a cut list plan" · "our cut list planner workflow" |
| best-woodworking-calculator-workflow | "the best woodworking calculator workflow" · "which calculator to use when" |
| woodworking-material-calculator | "woodworking material calculator workflow" |
| material-estimation-for-carpentry | "estimating carpentry materials" · "material estimation for carpentry" |
| diy-wood-project-estimation | "estimate a DIY wood project" |
| diy-workshop-planning-guide | "plan your DIY workshop" · "DIY workshop planning guide" |

---

## 4. Contextual placement strategy

Where each link type lives on the page. Body-copy links carry more weight than
nav/footer; the priority is moving links **into the first/second paragraph and into a
"next step" callout**, not just the boilerplate "Related tools" grid.

### On every CALCULATOR page
1. **Intro paragraph (1 contextual link):** in the lead copy, link the matched primary
   article. e.g. on the plywood calculator: *"For the theory behind these layouts, see
   our [plywood cutting optimization guide]."*
2. **After the result / CTA (1 link):** a "Next step" line to the sibling calculator in
   the same workflow (already partly present — keep/standardize).
3. **"Related guides" block (new, mirrors the existing "Related tools" block):** 2–3
   article links using §3.2 anchors. This is the main fix for **G1**.
4. Keep header-nav + footer as-is (hub access).

### On every LEARN article
1. **Body link UP to pillar (1×):** every supporting article links once to
   what-is-cut-list-optimization in its opening section. Pillar instead links DOWN to
   2–3 supporting articles in body. Fixes **G2**.
2. **Body link to 1–2 sibling articles (lateral):** placed where topically natural
   ("…which pairs with [how to reduce plywood waste]"). Fixes **G2**.
3. **Body link to the matched calculator (1–2×):** the conversion link — action anchor
   from §3.1, placed at the point of intent ("…then [run the numbers in the plywood cut
   calculator]").
4. Keep the existing "Related tools" grid (good) and add the matched calculator if
   missing (covers **G3** for stair/tile).

### On the HUBS (/tools/, /learn/)
- Already correct. One enhancement: in the `/tools/` hero/intro, add an inline link to
  the **pillar article**, and in the `/learn/` hero add an inline link to the
  **`/tools/` hub** with an action anchor (the secondary CTA button is fine, but an
  in-prose link adds a body-copy signal).

### Anchor hygiene (sitewide)
- Max ~1 exact-match anchor per target per page; vary the rest.
- Don't exceed ~3–4 contextual woodworking links per 500 words — keep it natural.
- All internal links use root-relative paths (`/path/`) with trailing slash — matches
  existing convention and avoids redirect hops that waste crawl budget.

---

## 5. Crawl-depth guarantee (≤ 3)

| Page type | Depth from `/` | Path |
|-----------|----------------|------|
| /tools/, /learn/, plywood, tile, /apps/cutlist/ | 1 | header nav |
| all other calculators | 2 | /tools/ grid |
| all learn articles | 2 | /learn/ grid |
| pillar article | 1–2 | new inline link from /tools/ hero (→ depth 1) |
| supporting articles | ≤ 2 | /learn/ grid (depth 2); also reachable via pillar |

Every woodworking page is **depth ≤ 2** — comfortably under the ≤ 3 target. The new
contextual and sibling links add redundant paths (resilience if a hub link is missed)
without ever pushing a page past depth 3. No orphan pages remain after §2.2 + §4.

---

## 6. Implementation checklist

- [ ] **G1** — add a "Related guides" block + 1 intro contextual link to each of the 8
      calculator pages (pairings in §2.2, anchors in §3.2).
- [ ] **G2** — add pillar up-link + 1–2 sibling links to each of the 10 learn articles;
      add down-links to 2–3 supporting articles on the pillar.
- [ ] **G3** — add matched-calculator link to stair / tile / stringer / quiltfit from
      their paired articles (and the reverse on the tool pages, covered by G1).
- [ ] Add inline pillar link in `/tools/` hero; inline `/tools/` link in `/learn/` hero.
- [ ] Verify no internal link hits `_redirects` (avoid redirect hops).
- [ ] Re-crawl (e.g. `npx @screaming-frog` or a quick link-graph script) to confirm
      0 orphans and max depth ≤ 2 for the woodworking cluster.
```
```
