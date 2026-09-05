# P0 implementation and deployment

## Delivered behavior

- Bookshelf and base-cabinet example and template pages transfer their source-backed parts; the garage-shelving template transfers its plywood shelves and cleats.
- Existing component detail and combined-project pages also offer a sheet-calculator handoff. Named sheet-panel materials retain their actual thickness; different thicknesses form separate groups. Lumber, ambiguous stock and unresolved vertical/project-specific grain rules produce a visible refusal to transfer, with no loss of the source project.
- Transfer uses a versioned, tab-local sessionStorage payload. Incoming lists require an explicit scope review and replacement choice; cancelling preserves the active draft. Active inputs persist locally, with visible storage-denied fallbacks.
- Material groups have independent thickness, sheet size, price, kerf, edge trim and rotation. Per-panel rotation locks are preserved. Unit changes convert existing values. Every material group is packed separately.
- Results include all sheet previews, rejected panels, material-specific counts, current CSV, project JSON, selected-sheet image and printable summary. Inputs invalidate stale exports. An incomplete layout is labelled explicitly.
- The garage list excludes four 72-inch 2x4 uprights and eight 16 × 13-inch cross braces whose material requires review. These exclusions appear before acceptance, in results and in exported files. The linear lumber calculator remains linked.
- The bookshelf and cabinet benchmarks have no thickness metadata. Their drafts explicitly assume 3/4 inch for body and back, separately grouped, with locked grain and zero trim. The user must review this and may change it; the resulting count can differ from the published unrestricted benchmark.

## Daily conversion collection

`functions/api/conversion-event.js` atomically increments D1 counters, keyed by UTC date, registered public route, pilot scenario, registered event, device class and coarse placement. Only counters and these dimensions persist. Client details, input values, labels, project contents, identifiers, IPs and query strings are not stored or logged by this endpoint.

- Existing events are reused; additions are `example_open`, `calculator_import`, `cut_list_export`.
- `example_open` means a supported source page loaded, including a template. `calculator_import` fires after acceptance, not merely on clicking the source button.
- Plywood `calculator_submit` counts a browser-valid submission; `calculator_complete` counts a successfully computed result, including an explicitly incomplete layout. The auto-generated demonstration no longer counts as a completed calculation.
- Export counts mean the browser prepared a CSV or JSON download; they do not prove the file was saved or used. Print and image actions are not counted as CSV/JSON exports.
- Reloading a source page counts again; recalculating or exporting again counts again. CTA impressions count once per displayed CTA DOM instance; re-rendering a result may produce another impression.
- The report groups pilot scenarios across source and calculator routes. Unassigned traffic remains page-specific. Completion/submission and export/completion are event ratios, not session funnels or unique-user conversion. The result App Store ratio matches only result placements. A zero denominator is `null`, and event ratios can exceed 1.
- DNT stops client submission and is also honored by the endpoint. Events are best effort; failed transmissions are not retried. The public collector can receive bot traffic, so these reports are operational evidence, not billing or installation attribution.
- Database absence or failure returns 503, never a false success. The calculator and exports continue to work.
- `/api/conversion-report` requires a bearer secret, returns JSON counts plus ratios or CSV rows, supports at most 31 UTC dates and fails rather than truncating over 100,000 rows. It never embeds the secret in URLs.

## Local use

Node 22.13+ or 24+ is needed for the built-in SQLite adapter used in tests/local preview. Production uses the D1 binding, not Node SQLite.

```sh
export CONVERSION_REPORT_TOKEN='choose-a-local-test-token'
npm run dev
```

The preview keeps daily counters in `woodcuttool-conversion-dev.sqlite` under the operating system temporary directory, outside the served repository. Set `CONVERSION_DB_PATH` to another private path if needed. Restarting the preview preserves counts while that file exists.

```sh
npm run report:conversion -- http://127.0.0.1:4175 2026-09-05 2026-09-05 json
npm run report:conversion -- http://127.0.0.1:4175 2026-09-05 2026-09-05 csv > /tmp/conversion-daily.csv
```

The export command uses `CONVERSION_REPORT_TOKEN` from its environment. Use the actual dates of your test traffic. Do not commit tokens or reports containing private infrastructure information.

## Production configuration — pending account access

This session has no callable Cloudflare management connector or installed Wrangler CLI. Production log drains, database bindings, provider token and current deployment could not be inspected. No production resources were created and no deployment was performed.

1. Inspect any existing production aggregate/log destination before creating another database. If no suitable D1 database exists, create one using an authenticated Cloudflare dashboard or Wrangler.
2. Apply `migrations/0001_conversion_daily.sql` to that database. It is an idempotent table creation, not a drop/reset.
3. Configure the Pages production D1 binding as `CONVERSION_DB`. Use a separate preview database. When using repository-managed Wrangler configuration, add a `[[d1_databases]]` block with `binding = "CONVERSION_DB"`, the real database name, actual database ID and `migrations_dir = "migrations"`. Do not commit a fabricated ID. Run `npx wrangler d1 migrations apply <actual-name> --remote` only against the verified intended database.
4. Set `CONVERSION_REPORT_TOKEN` as a Pages secret with a strong random value. Keep it out of `wrangler.toml`, HTML, URLs and public CI logs. Configure `APPLE_PROVIDER_TOKEN` from the actual App Store Connect account if available; an empty repository value does not prove the production value is absent.
5. Deploy, then exercise one source → accept → calculate → export flow with DNT off. Verify every collector response is 204 and the authenticated report includes the correct day's counters. Recheck DNT and an unauthenticated report (401).
6. Keep the deployment timestamp and baseline. No historical log counts are backfilled automatically. Decide a retention period for the aggregate table before long-term operation; a periodic date-based prune can be run using authenticated D1 maintenance tooling.

[Cloudflare Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases) and [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) informed the binding and atomic SQL implementation.

## Maintenance and verification

Authoritative sources are `scripts/plywood-benchmark-data.mjs` plus explicit pilot assumptions in `scripts/cut-handoff-data.mjs`. The garage template is an authored legacy page; `generate:handoffs` refreshes only its marked transfer section. Example and template generators embed their own transfer controls. Public routing allowlists are regenerated from sitemaps and must stay in sync.

```sh
npm run generate:examples
npm run generate:templates
npm run generate:handoffs
npm run generate:components
npm run apply:cutlist-ctas
npm run generate:schemas
npm run generate:meta
npm run apply:nav-cta
npm run sitemap
npm run check
git diff --check
```

`test:p0` runs actual packing and SQL behavior: all three pilots, metric conversion, per-part locks, group isolation, non-overlap and bounds, invalid inputs, unsupported constraints, oversize pieces, CSV formula neutralization, concurrent increments, server-assigned dates, bounded routes, DNT, report authorization, date validation, backend failures and event ratios.

`node scripts/test-p0-browser.mjs` targets an isolated Chrome debugging session at `P0_CDP` (default `http://127.0.0.1:9337`) and local preview at `P0_ORIGIN` (default `http://127.0.0.1:4186`). Use a disposable profile: the test clears local storage on its test origin. It writes downloads, screenshots and QA JSON outside the repo at `P0_OUTPUT` (default `/tmp/woodcuttool-p0-browser`).

## Recorded validation (2026-09-05)

- Full `npm run build` passed after correcting the existing landing-page/app-library generation order, which had overwritten the CutList comparison links. Those links remain unchanged in the final diff.
- `npm run check` and component tests passed: 2,470 HTML files, 2,368 Sitemap routes, no SEO audit findings and 17 registered events.
- Chrome exercised all three pilot paths plus an existing fixed-shelf component; CSV and JSON contents were checked after each scenario. It verified acceptance, cancellation, reload restoration, real unit switching, oversize rejection, DNT and denied storage.
- Browser collector responses: 39 successful HTTP 204 responses in the final run; no JavaScript exceptions. Result layouts at 360/390/430/1440px had no page-level horizontal overflow. Mobile result screenshots were visually reviewed.
- Daily JSON and CSV were exported from the actual local collector database using the report CLI. These are local test events, not production conversion evidence.
- Production database binding, secret configuration, deployment and live verification remain pending account access.
