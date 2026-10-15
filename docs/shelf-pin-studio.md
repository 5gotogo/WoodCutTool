# Shelf Pin Studio

Added 2026-10-15 at `/shelf-pin-layout/`: a browser-local planner plus six distinct field guides for paired cabinet side drilling.

## Source files

- `assets/shelf-pin-core.js`: bounded input parsing, shared grid, whole-circle keep-outs, paired coordinates, drill-tip reserve, CSV and SVG.
- `assets/shelf-pin.js` / `assets/shelf-pin-layout.css`: editable setup, two-panel map, level selection, physical observations, local draft, replacement preview and downloads.
- `scripts/shelf-pin-data.mjs`: six guides covering pitch/setbacks, handed datums, depth coupons, hardware envelopes, jig continuation/print scale and shelf-fit release.
- `scripts/build-shelf-pin.mjs`: static hub, guides and reproducible CSV/JSON/SVG examples.

## Model and boundaries

All dimensions are mm. The sides have equal height/depth/thickness. Grid centers are origin + n × pitch, n ≥ 0. Top/bottom margins apply to the hole rim. Bands exclude complete four-hole elevations on both sides when a circle touches or intersects a band. Rows must remain inside the panel without overlap. Remaining outer skin is measured thickness minus maximum tip penetration; the minimum is a user-entered reserve.

CSV X is from each panel's finished front; Y is from its finished bottom. Both inside-face SVG panels have tops up and fronts outward, so only the right drawing is mirrored. The SVG declares physical mm size with horizontal and vertical 100 mm checks; it does not generate tiled pages or machine toolpaths. A scaled print is an overview. The user must verify physical transfer, pin fit and the actual shelf.

Kreg KMA3232 documentation is the reference for its example 32 mm pitch, 37 mm fence setback and matching hardware. True Position Tools supplies another jig-specific setup reference. Other defaults, exclusion rules and reserves are explicit illustrative/model inputs. No support capacity, shelf span, anchoring, two-face divider boring or moving-hardware simulation is calculated.

Physical observations start unchecked and clear on geometry edits. Import retains the backup's recorded observations as a snapshot and requires an explicit replacement action. Local-storage failure leaves a usable in-memory session. Invalid/incomplete input hides the current map and blocks coordinate exports; an incomplete edit does not replace the last parseable draft. Data does not leave the browser through this feature.

## Regenerate and verify

```sh
npm run generate:shelf-pin
npm run generate:tools
npm run apply:nav-cta
npm run sitemap
npm run check
npm run test:shelf-pin-browser
git diff --check
```

The browser test uses the local preview on port 4175 and an isolated Chrome debugging profile on port 9337, consistent with the other planner tests. It covers edits, evidence clearing, keep-out changes, save/reload, invalid inputs, downloads, replacement preview/cancel/apply, storage fallback, keyboard interaction and responsive pages. Generated pages stay integrated with homepage, shared Tools navigation/footer, both tools hubs, sitemap-tools and conversion route registration.
