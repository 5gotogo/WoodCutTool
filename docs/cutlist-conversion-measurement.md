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
npm run build
```
