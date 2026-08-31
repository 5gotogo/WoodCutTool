# CutList conversion measurement

The website uses first-party, aggregate events to measure the path from a useful
page or calculator result to the CutList App Store listing. It does not send
part names, raw measurements, email addresses, account identifiers, or project
contents.

## Event path

1. `/assets/conversion.js` records CTA impressions, App Store clicks, calculator
   submissions/completions, and saved preview images.
2. `/api/conversion-event` validates a small allowlist, bounds the payload, and
   writes one structured JSON record to the Cloudflare Pages Functions log.
3. `/go/cutlist/` records the page source and CTA placement, then redirects to
   the App Store with an Apple campaign token.
4. Browser `Do Not Track` disables client-side event submission.

Useful funnel rates are:

- calculator completion to result CTA impression;
- result CTA impression to App Store click;
- contextual CTA impression to App Store click, grouped by source;
- desktop QR click versus mobile direct click.

## Topic-cluster transitions

Learn topic hubs use the same first-party endpoint with a strict shared event
registry. Every one of the 12 hubs records one pillar-guide link and four
practical action links with only these routing dimensions:

- `cluster`;
- `source_route`;
- `placement`;
- `destination_type`;
- `destination_route`.

The registry also reserves privacy-safe events for worksheet, checklist,
example, and research downloads; calculator starts and non-sensitive result
classes; and App Store outbound links. Unknown event names and unknown,
missing, or privacy-unsafe dimensions are rejected by the endpoint instead of
being logged. Project dimensions, raw measurements, notes, full queries,
referrers, document contents, and local-storage values are prohibited.

A monthly cluster report can group counts by cluster, source route, placement,
destination type, and destination route. It can report navigation and action
rates, but it must not claim that a project result was correct, that a download
was used, or that an App Store visit became an install.

## Apple campaign attribution

Set `APPLE_PROVIDER_TOKEN` to the numeric provider token from App Store Connect
in the production Cloudflare Pages environment. Without it, the redirect,
source campaign token (`ct`), Smart App Banner, and first-party events still
work; the Apple provider token (`pt`) is simply omitted.

The build-time environment may also provide `APPLE_PROVIDER_TOKEN` so generated
Smart App Banner metadata includes the same token.

## Verification

Run:

```sh
npm run test:cutlist-conversion
npm run audit:cutlist-conversion
npm run audit:learn-intents
npm run build
```
