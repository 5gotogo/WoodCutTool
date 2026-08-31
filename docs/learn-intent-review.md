# Learn intent overlap review

Updated: 2026-08-31

## Scope

Reviewed 163 Learn routes across 12 topic hubs. Candidate detection compares exact source fields, same-cluster title similarity, shared primary keywords, and high opening-answer overlap paired with the same primary action. Decisions do not authorize redirects without aggregate query/page evidence.

## Result

- Candidate sets: 13
- Pages in candidate sets: 63
- Reviewed sets: 13
- Implemented differentiations: 2
- Redirects approved: 0

## Candidate decisions

| Set | Score | Routes | Decision | Reason |
| --- | ---: | --- | --- | --- |
| LI-001 | 0.882 | `/learn/deck-stair-material-estimate/`<br>`/learn/stair-headroom-measurement-checklist/`<br>`/learn/stair-landing-material-estimate/`<br>`/learn/stair-rise-run-comfort-guide/`<br>`/learn/stair-stringer-calculator-inputs-explained/` | keep | The five stair pages answer different field decisions: calculator inputs, comfort geometry, deck-stair purchasing, landing purchasing, and headroom verification. Their shared calculator destination does not make the intents interchangeable. |
| LI-002 | 0.875 | `/learn/backsplash-tile-measuring-guide/`<br>`/learn/bathroom-tile-layout-measurement-guide/`<br>`/learn/large-format-tile-waste-planning/`<br>`/learn/tile-calculator-inputs-explained/`<br>`/learn/tile-waste-allowance-guide/` | keep | Tile calculator inputs, general waste allowance, backsplash measurement, bathroom layout measurement, and large-format risk each require different measurements and purchasing decisions despite sharing the tile calculator. |
| LI-003 | 0.875 | `/learn/quilt-backing-binding-batting-estimate/`<br>`/learn/quilt-border-yardage-planning/`<br>`/learn/quilt-precut-bundle-planning-guide/`<br>`/learn/quilt-yardage-calculator-inputs/` | keep | Quilt input setup, finishing materials, border yardage, and precut-bundle planning have separate fabric roles and evidence requirements. QuiltFit is a common action rather than a duplicate intent. |
| LI-004 | 0.875 | `/learn/offcut-storage-system-for-sheet-goods/`<br>`/learn/plywood-offcut-inventory-workflow/`<br>`/learn/plywood-offcut-size-guide/` | keep | Offcut storage design, inventory recordkeeping, and keep-or-discard size thresholds are consecutive workflow steps with different outcomes and should remain separately addressable. |
| LI-005 | 0.824 | `/learn/grain-direction-in-plywood-layouts/`<br>`/learn/mdf-cut-list-planning-guide/`<br>`/learn/plywood-delivery-inspection-guide/`<br>`/learn/plywood-sheet-breakdown-for-beginners/`<br>`/learn/track-saw-sheet-breakdown-workflow/` | keep | Material orientation, MDF-specific limits, delivery acceptance, beginner sheet breakdown, and track-saw execution use different evidence and stop conditions; the common plywood calculator is only a shared next action. |
| LI-006 | 0.813 | `/learn/bathroom-linen-cabinet-planning-guide/`<br>`/learn/closet-drawer-tower-material-plan/`<br>`/learn/coffee-bar-cabinet-planning-guide/`<br>`/learn/craft-table-storage-planning-guide/`<br>`/learn/diy-closet-island-planning-guide/`<br>`/learn/garage-shelving-material-estimate/`<br>`/learn/media-console-ventilation-guide/`<br>`/learn/sewing-cabinet-workflow-guide/`<br>`/learn/storage-bed-drawer-planning-guide/`<br>`/learn/storage-bench-hinge-clearance-guide/`<br>`/learn/workbench-height-and-material-guide/` | keep | Each route owns a different furniture type with project-specific clearances, loads, hardware, ventilation, storage, or ergonomic inputs. Similar generated openings and a shared CutList action are template signals, not intent collisions. |
| LI-007 | 0.813 | `/learn/custom-wardrobe-planning-guide/`<br>`/learn/farmhouse-table-material-planning-guide/`<br>`/learn/mudroom-locker-planning-guide/`<br>`/learn/playhouse-plywood-material-guide/` | keep | Wardrobes, farmhouse tables, mudroom lockers, and playhouses have distinct assemblies, exposure conditions, measurements, and material decisions even though all use plywood layout calculations. |
| LI-008 | 0.813 | `/learn/mobile-workbench-caster-planning/`<br>`/learn/router-table-material-planning-guide/`<br>`/learn/workbench-material-planning-guide/` | keep | A mobile workbench caster decision, router-table system, and general workbench material plan produce different parts and verification checks. The shared workbench template is an intentional handoff. |
| LI-009 | 0.800 | `/learn/cabinet-door-overlay-and-inset-guide/`<br>`/learn/closet-shelving-cut-list-workflow/`<br>`/learn/drawer-box-cut-list-basics/`<br>`/learn/edge-banding-allowance-in-cut-lists/`<br>`/learn/kitchen-cabinet-sheet-count-estimate/`<br>`/learn/laundry-room-cabinet-planning-guide/`<br>`/learn/material-list-before-hardware-shopping/`<br>`/learn/melamine-cutting-plan-for-clean-edges/`<br>`/learn/multi-room-plywood-planning-guide/`<br>`/learn/plywood-cut-plan-for-built-ins/`<br>`/learn/plywood-grade-selection-for-cabinets/`<br>`/learn/record-cabinet-shelf-span-guide/`<br>`/learn/toe-kick-cut-list-planning/`<br>`/learn/woodworking-hardware-allowance-guide/` | keep | The cabinet cluster spans grades, part types, hardware, edge treatment, project scopes, and purchasing decisions. Page-specific inputs remain distinct; similarity is driven by a shared generated opening and calculator route. |
| LI-010 | 0.778 | `/learn/cut-list-review-before-cutting-guide/`<br>`/learn/table-saw-cut-sequence-planning/`<br>`/learn/table-saw-repeat-cut-workflow/` | keep | Pre-cut release review, table-saw sequence planning, and repeated-cut control occur at different shop checkpoints and have different observable failure conditions. |
| LI-011 | 0.765 | `/learn/kitchen-island-plywood-planning-guide/`<br>`/learn/plywood-grain-matching-guide/` | keep | Kitchen-island material grouping and cross-panel grain matching are separate decisions; the former plans the assembly while the latter constrains visible-face orientation. |
| LI-012 | 0.722 | `/learn/built-in-bookcase-measurement-guide/`<br>`/learn/under-stair-storage-measurement-guide/` | keep | Built-in bookcase measurement and under-stair storage measurement apply to different opening geometries, downstream parts, and field-fit risks. |
| LI-013 | 0.700 | `/learn/best-woodworking-calculator-workflow/`<br>`/learn/choosing-between-calculator-template-and-app/` | keep | The calculator-workflow page explains a staged estimating process, while the calculator-versus-template-versus-app page selects the appropriate planning surface. They share a keyword but answer different decisions. |

## Implemented differentiations

| Routes | Result |
| --- | --- |
| `/learn/cut-list-revision-workflow/`<br>`/learn/cut-list-version-control-guide/` | Both pages cover controlled cut-list change, but the workflow page should own impact tracing while the version-control page should own naming, release history, and retained exports. Clarify those boundaries before any performance review. |
| `/learn/one-sheet-plywood-furniture-guide/`<br>`/learn/one-sheet-plywood-project-planning/` | The project-planning page should cover the general one-sheet admission workflow, while the furniture page must stay limited to furniture structure, dimensions, and usable offcuts. Strengthen this scope distinction before performance-led consolidation. |

## Decision boundary

- `keep` means the repository currently exposes a distinct decision, evidence path, or next action.
- `differentiate-existing` requires generator-backed copy or metadata clarification; it does not create a new URL.
- `hold-for-performance-data` blocks merge and redirect work until a minimum 90-day aggregate Search Console query/page export is available.
- Low traffic by itself is never a delete or redirect signal.

## Reproduction

```sh
npm run generate:learn-intents
npm run audit:learn-intents
```
