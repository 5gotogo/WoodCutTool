# Material and cost planning topic

Implemented 2026-09-12 at /estimating/: one hub, six scenario planners and eight integrated reference sections. Sources are scripts/estimating-data.mjs and scripts/build-estimating-content.mjs; calculation logic is assets/estimating-model.js, separate from DOM behavior.

## Product boundary

The web estimate handles one repeated rectangular part in one stock group, area allowance, whole-sheet rounding and a partial material/labor subtotal. No new project storage, full quotation system, OCR, export or subscription gate. Existing web tools remain available. Prices are explicitly illustrative and editable. No structural advice, live prices, automatic nesting or guaranteed purchasing count is claimed.

CutList is the primary destination after results. The CTA explains free basic layouts and Pro AI Scan, PDF, AirPrint and unlimited projects. Capability evidence: repository data/app-store-apps.json, scripts/build-cutlist-landing.mjs, and read-only inspection of the local Cutlist application directory (ContentView and exporting implementation). Subscription marketing follows the stored App Store description; no App code or entitlements changed. No automatic web-to-app import is implemented or claimed. Users must recreate and review their parts; Pro OCR can scan their own paper lists.

Stringer detail link is limited to under-stair storage, explicitly for a separate stair job. TileFit links appear only for kitchen and laundry tile scope. Their descriptions follow the repository App Store metadata. They do not imply that either app calculates cabinetry.

## Calculation contract

Net area = part length × width × quantity, converted to square meters. Allowed area = net × (1 + allowance/100). Area-based sheet minimum = ceil(allowed / sheet area). Cost subtotal = sheet minimum × entered sheet price + hours × entered hourly cost. A single part that cannot fit either permitted orientation suppresses purchase and cost recommendations. A successful fit check does not prove multi-part packing. Currency changes only the price label, never applies an exchange rate. Units convert the physical dimensions. Grain is locked unless rotation is explicitly enabled. Inputs changing hide stale results.

## Measurement and release

Existing conversion runtime records calculator_submit, calculator_complete, CTA impressions and CutList store clicks. Completion sends only calculator and result classification; dimensions, prices and labor are not transmitted. New public routes are registered by the sitemap generation. estimating-result source keeps result impressions and clicks in the result placement bucket. DNT behavior and aggregate-only persistence reuse the existing pipeline. Local API success is not deployed D1 or subscription evidence. Stringer/TileFit link to app detail pages, whose existing store CTAs handle the next step; this release does not claim cross-app subscription attribution.

Validation: npm run test:estimating; node scripts/test-estimating-browser.mjs (local preview 4192 and isolated CDP 9337, overridable with P1_ORIGIN/P0_CDP/P1_OUTPUT); npm run check; git diff --check. Browser suite covers seven routes at 360/390/430/1440px, results, unit switching, stale-result hiding, impossible fit, CutList links and local conversion responses.

Regenerate: npm run generate:estimating; npm run generate:tools when the directory changes; npm run generate:schemas; npm run generate:meta; npm run apply:nav-cta; npm run sitemap; npm run check. Inspect generated diffs before publication. Local implementation is not deployed until the site's normal deployment runs.
