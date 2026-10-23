# Navigation download CTA audit

Checked locally on 2026-10-23. This records source and local-browser validation; it does not establish a production deployment.

## Coverage

| HTML category | Pages | Result |
| --- | ---: | --- |
| Shared navigation runtime | 2,339 | Download CutList App → /apps/cutlist/ |
| Wood navigation runtime | 201 | Download CutList App → /apps/cutlist/ |
| Redirect documents | 25 | No website navigation; existing redirects retained |
| Standalone page without website navigation | 1 | No navigation CTA to replace |
| Total | 2,566 | All documents classified |

Before this change, 2,520 navigation pages already used the CutList landing-page CTA. The remaining 20 pages used app-specific header CTAs, listed below. All 2,540 navigation pages now use the same CutList destination and label. App download links inside page content retain their original destinations.

## Replaced header CTAs

| Page | Previous header label |
| --- | --- |
| /apps/moodloop-mood-tracker-journal/ | Get MoodLoop |
| /apps/quiltfit/ | Download QuiltFit |
| /apps/snaplabel-photo-text-label/ | Download SnapLabel |
| /apps/stringer/ | Download Stringer |
| /apps/tilefit-tile-layout-planner/ | Download TileFit |
| /apps/tinnitus-relief-sound-masking/ | Download Tinnitus |
| /legal/MoodLoop/privacy/ | Get MoodLoop |
| /legal/MoodLoop/support/ | Get MoodLoop |
| /legal/Stringer/privacy/ | Download Stringer |
| /legal/Stringer/support/ | Download Stringer |
| /legal/TileFit/privacy/ | Download TileFit |
| /legal/TileFit/support/ | Download TileFit |
| /legal/Tinnitus/privacy/ | Download Tinnitus |
| /legal/Tinnitus/support/ | Download Tinnitus |
| /legal/quiltfit/privacy/ | Download QuiltFit |
| /legal/quiltfit/support/ | Download QuiltFit |
| /quiltfit/ | Download QuiltFit |
| /stringer/ | Download Stringer |
| /tile-calculator/ | Download TileFit |
| /tinnitus/ | Download Tinnitus |

## Verification

- `npm run audit:navigation` inventories every HTML file, renders its shared header, checks exactly one download CTA, and verifies that the navigation and Wood browser runtimes match their generator sources.
- The audit is included in `npm run check` and `npm run build`.
- All 20 replaced routes were opened in the local browser at desktop width and 375px. Each showed the correct label and destination, with no horizontal overflow or clipped CTA text.
- The CutList landing-page handoff was checked by clicking the header button.
- Four legacy page generators now emit the shared header mount instead of duplicating navigation markup.
