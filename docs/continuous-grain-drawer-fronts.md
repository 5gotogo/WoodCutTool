# Continuous-grain drawer front feature

Published date: October 26, 2026 (Asia/Shanghai). English editorial content follows the existing blog language.

Route: `/blog/continuous-grain-drawer-fronts-master-blank/`

This feature distinguishes installed front dimensions, a squared master blank, outside cleanup stock, blade kerf, and installed reveals. It adds ten original sections (about 1,230 words), a coordinate table, a field checklist, four FAQs, and a checked manufacturer reference. It extends the general grain-matching guide with a specific, reproducible subdivision example.

## Worked example

All values are illustrative millimeters, not hardware clearance recommendations or observed shop results. Vertical grain and a face-A top-left datum are assumed. No projecting edge treatment or inter-part cleanup is modeled.

- Installation envelope: 600 × 720.
- Perimeter gaps: 2 on each side; two internal reveals: 3 each.
- Finished fronts: 596 × 160, 596 × 240, and 596 × 310, top to bottom.
- Squared master: 596 × 716.4, including two 3.2 kerfs.
- Rough reservation with 10 outside cleanup on each edge: 616 × 736.4.
- Source top coordinates: 0, 163.2, 406.4; installed top coordinates: 2, 165, 408.
- Once the first pattern is aligned, the third pattern shifts upward by 0.4 because each reveal is 0.2 smaller than the extraction kerf.

The SVG uses one scale for both outlines, including the narrow gaps. Decorative grain paths illustrate shared source coordinates; they are not a scanned veneer. The CSV is a reference schedule, not a direct-import contract. A layout workflow reserves the master once and retains the child sequence separately.

## Sources and maintenance

- Content, geometry, SVG and CSV writer: `scripts/blog-feature-2026-10-26.mjs`.
- Registration and inbound link: `scripts/build-blog-content.mjs`.
- Outputs: `assets/continuous-grain/` and the blog route above.
- Primary reference checked October 26, 2026: [WalzCraft Design Options](https://walzcraft.com/wp-content/uploads/2011/07/Chapter-G-WalzCraft-Design-Options-Cabinet-Doors-17.2-4.pdf), sections G.17.1–G.17.9, for matching terminology, elevation drawings and orientation tracking. All numerical geometry is original.

Regenerate with `npm run generate:blog`, then the existing CTA/schema/meta/nav post-processors and `npm run sitemap`. Review generated churn: older blog pages may be normalized incidentally by the current template, so retain only intended content and related-link changes.

## Local verification

- Independently reconciled the front total, both kerfs, installed envelope, coordinate intervals and cumulative pattern shift; checked every local source link.
- Chrome at 1440 and 390 px: image loaded, no page overflow, no browser exceptions; visually reviewed screenshots.
- CSV and SVG returned successfully with expected contents; blog search found the feature by its subject terms.
- Full `npm run check` passed, including 2,581 HTML pages and 2,481 sitemap URLs; `git diff --check` passed. No deployment or remote push was performed.
