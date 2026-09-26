import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const site = "https://woodcuttool.com";
const date = "2026-09-26";
const guides = [
  {
    slug: "measure-and-label",
    title: "Measure and Label a Reusable Offcut",
    description: "Record the usable rectangle, material, thickness, grain, and defects before a plywood offcut goes back on the rack.",
    intro: "A leftover sheet is useful only when the next builder can identify its real cutting envelope. Measure the largest clean rectangle, not the outer silhouette, and put the label where it remains visible in storage.",
    sections: [
      ["Start with a clean rectangle", "Lay the piece flat and identify damaged corners, splintered edges, screw holes, stains, warp, and areas where the veneer or core is unsuitable. Draw or imagine one rectangle fully inside the usable region. Measure its length and width to the precision your shop normally cuts. If the offcut is L shaped, record two separate rectangles only if they can genuinely be separated without counting the same area twice. The planner accepts one rectangle per inventory entry."],
      ["Record what a later cut needs", "Mark the material type and measured thickness. Nominal plywood thickness may differ from actual thickness, so measure a representative clean edge with calipers where fit matters. Identify face quality, finish, species or grade in the notes. If visible grain or face direction constrains a future part, mark grain along the recorded length. Write a label on tape or a tag rather than obscuring a show face."],
      ["Keep the record attached to the stock", "A useful label includes a short piece ID, usable length × width, thickness, material, grain arrow, and known defect boundary. Put the same ID in the browser inventory. Re-measure after every cut and edit the piece by removing the old entry and adding the new usable rectangle. Export a JSON backup before clearing browser data or moving to another device."],
      ["Release check", "Before reuse, inspect the physical piece again. A dimension record cannot certify flatness, internal voids, moisture condition, structural capacity, or suitability for a finish. If the clean rectangle is smaller than recorded, correct the inventory before using a fit result."],
    ],
    links: [["Open the offcut fit checker", "/offcut-planner/#fit-checker"], ["Read about plywood grain direction", "/learn/grain-direction-in-plywood-layouts/"]],
  },
  {
    slug: "fit-check-method",
    title: "Check Whether One Part Fits an Offcut",
    description: "Use exact material and thickness, a conservative kerf and trim allowance, and grain rules to screen one rectangular part against saved offcuts.",
    intro: "A fit check answers a narrow question: can one rectangular part be cut from the clean rectangular envelope of a recorded offcut? It does not calculate an entire sheet layout or promise that the remainder will have a useful shape.",
    sections: [
      ["Prepare the part", "Enter the finished length and width from the approved cut list. Select the same material and measured thickness as the stored piece. If the part has a visible grain or face direction, turn on the grain requirement and enter length along that direction. That setting prevents a 90-degree rotation during matching."],
      ["Reserve cutting space", "The checker adds twice the edge-trim allowance plus one kerf to each part axis. This is intentionally conservative: the blank must be larger than the finished part even when a clean stock edge might save one cut. Use a trim allowance that covers rough edges or squaring; use the kerf of the actual blade. Do not enter zero simply to make a piece appear to fit if cleanup cuts are planned."],
      ["Read the candidates", "Candidates are ranked by the area remaining after the reserved blank, smallest first. Ranking is a starting point for conserving large stock, not a cut sequence. The displayed remaining area is arithmetic only. A long narrow strip and a compact rectangle with the same area can have very different reuse value. If the displayed orientation says rotated, verify that no grain, face, pattern, or hardware constraint blocks rotation."],
      ["Verify at the saw", "Place the real part outline and allowance on the offcut. Check defects, clamps, saw support, safe handling, grain, and the order of cuts. Stop when the blank crosses a defect or when support would be unsafe. Replan with a larger piece or a new sheet instead of forcing a tight match."],
    ],
    links: [["Run a fit check", "/offcut-planner/#fit-checker"], ["Open the kerf calculator", "/kerf-calculator/"]],
  },
  {
    slug: "reuse-or-buy",
    title: "Decide When to Reuse an Offcut or Buy a New Sheet",
    description: "Use a measured fit, condition check, and project release gate to choose between stored stock and a fresh sheet.",
    intro: "A matching rectangle can save a purchase, but the decision is bigger than area. The stored piece must meet the project material specification, the required face and grain, the safe cutting sequence, and the quality expected at handoff.",
    sections: [
      ["Use an offcut when the constraints align", "First confirm material and measured thickness. Then confirm the clean rectangle includes the finished part, the chosen edge trim, and the planned kerf. Check that the show face, core, finish history, and grain direction suit the part. If the piece has a known defect, keep the part outline clear of it. A small part cut from a suitable remnant may preserve a full sheet for a later project."],
      ["Buy or reserve new stock when evidence is weak", "Choose new material when the available offcut is warped, cracked, wet, unidentifiable, too short after squaring, or only fits if a needed allowance is removed. Also consider a new sheet when several parts must share a consistent face or batch, when replacement parts are likely, or when the cut order would leave an unsafe unsupported strip. Do not rely on a simple one-part fit check for structural, fire-rated, exterior, or code-controlled applications."],
      ["Close the loop after cutting", "When the part is cut, remove the old inventory entry. Measure any new clean rectangle and record it as a new piece with a new label. If the remainder is irregular, too damaged, or too small for your normal work, do not preserve an optimistic rectangle in the inventory. Export a backup of the updated list so another device can import the same measured stock without an account."],
      ["Use the right next tool", "For multiple parts on one sheet, use the plywood calculator or CutList to model an actual layout and cutting constraints. For a project specific material allowance, use the estimating guides. The Offcut Planner is a quick, local gate for one part against your measured rack inventory."],
    ],
    links: [["Open the offcut inventory", "/offcut-planner/#inventory"], ["Plan multiple parts", "/plywood-cut-calculator/"]],
  },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const schema = (value) => `<script type="application/ld+json">${JSON.stringify(value).replaceAll("<", "\\u003c")}</script>`;

function shell({ title, description, route, main, extraScript = "", type = "WebPage" }) {
  const fullTitle = `${title} | WoodCutTool`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site}${route}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${site}${route}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
<link rel="stylesheet" href="/assets/content.css"><link rel="stylesheet" href="/assets/offcut-planner.css">
${schema({ "@context": "https://schema.org", "@type": type, name: title, description, url: `${site}${route}`, datePublished: date, dateModified: date })}
${schema({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${site}/` }, { "@type": "ListItem", position: 2, name: "Offcut Planner", item: `${site}/offcut-planner/` }, ...(route === "/offcut-planner/" ? [] : [{ "@type": "ListItem", position: 3, name: title, item: `${site}${route}` }])] })}
${extraScript}</head><body><a class="skip-link" href="#main">Skip to content</a><div data-site-header></div>${main}<div data-site-footer></div></body></html>`;
}

function guidePage(guide) {
  const route = `/offcut-planner/${guide.slug}/`;
  const main = `<main id="main" class="offcut-page offcut-guide"><nav class="offcut-crumb"><a href="/">Home</a> / <a href="/offcut-planner/">Offcut Planner</a> / ${esc(guide.title)}</nav><header class="offcut-guide-hero"><p class="offcut-eyebrow">Offcut Planner · Field guide</p><h1>${esc(guide.title)}</h1><p>${esc(guide.intro)}</p><small>By <a href="/about/">WoodCutTool editorial team</a> · Updated ${date}</small></header><div class="offcut-guide-body">${guide.sections.map(([heading, body], index) => `<section><span class="offcut-step">0${index + 1}</span><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join("")}</div><aside class="offcut-next"><h2>Put this into practice</h2><div>${guide.links.map(([label, href]) => `<a href="${href}">${esc(label)} →</a>`).join("")}</div></aside><section class="offcut-related"><h2>Continue the workflow</h2>${guides.filter((item) => item.slug !== guide.slug).map((item) => `<a href="/offcut-planner/${item.slug}/">${esc(item.title)} →</a>`).join("")}</section></main>`;
  return shell({ title: guide.title, description: guide.description, route, main, type: "Article" });
}

function hubPage() {
  const description = "Record usable plywood and sheet-good offcuts in your browser, screen one rectangular part against the inventory, and export the results with a practical reuse guide.";
  const main = `<main id="main" class="offcut-page" data-offcut-planner><nav class="offcut-crumb"><a href="/">Home</a> / Offcut Planner</nav>
  <header class="offcut-hero"><div><p class="offcut-eyebrow">The missing step between sheet layouts and the next build</p><h1>Give useful offcuts a second job.</h1><p>Record the clean rectangle that is really available. Check one part against your local inventory with material, thickness, grain, trim, and kerf in view. Carry a measured candidate to the saw, not a guess based on leftover area.</p><div class="offcut-hero-actions"><a class="offcut-primary" href="#inventory">Add an offcut</a><a class="offcut-secondary" href="#fit-checker">Check a part</a></div><small>Private in this browser · no account or upload · measurements in inches</small></div><div class="offcut-visual" aria-hidden="true"><div class="offcut-sheet"><span class="offcut-block one">A</span><span class="offcut-block two">B</span><span class="offcut-block three">C</span></div><span class="offcut-visual-caption">Measure → Match → Verify</span></div></header>
  <div class="offcut-metrics"><span><strong>01</strong> Measure the clean rectangle</span><span><strong>02</strong> Check one part</span><span><strong>03</strong> Verify before cutting</span></div>
  <section class="offcut-workspace" id="inventory"><div class="offcut-heading"><p class="offcut-eyebrow">Your rack, recorded</p><h2>Offcut inventory</h2><p>Enter usable dimensions after excluding damaged edges. Each item represents one clean rectangle, not an irregular shape or a complete sheet layout.</p></div><div class="offcut-workspace-grid"><form data-inventory-form class="offcut-panel"><h3>Add a measured piece</h3><label>Piece label<input name="label" required maxlength="80" placeholder="e.g. Baltic birch A-12"></label><div class="offcut-fields"><label>Material<select name="material"><option>Plywood</option><option>MDF</option><option>Solid wood</option><option>Other sheet goods</option></select></label><label>Thickness (in)<input name="thickness" type="number" required min="0.001" max="1200" step="any" value="0.75"></label><label>Usable length (in)<input name="length" type="number" required min="0.001" max="1200" step="any" placeholder="24"></label><label>Usable width (in)<input name="width" type="number" required min="0.001" max="1200" step="any" placeholder="18"></label></div><label class="offcut-checkbox"><input type="checkbox" name="grain"> Grain direction is along recorded length</label><label>Condition or location note<input name="note" maxlength="240" placeholder="e.g. Rack 2; clean face on top"></label><button class="offcut-primary" type="submit">Save piece</button></form><div class="offcut-panel offcut-inventory"><div class="offcut-panel-top"><h3>Recorded pieces</h3><span data-inventory-count>0 saved pieces</span></div><ul data-inventory-list></ul><div class="offcut-file-actions"><button type="button" data-export-inventory>Export JSON backup</button><label class="offcut-import">Import JSON backup<input type="file" accept="application/json,.json" data-import-inventory></label></div></div></div></section>
  <section class="offcut-workspace" id="fit-checker"><div class="offcut-heading"><p class="offcut-eyebrow">A single-part screen</p><h2>Find a measured fit</h2><p>The checker reserves trim on both edges and one kerf on each axis. Material and measured thickness must match exactly; a grain-required part cannot rotate.</p></div><div class="offcut-workspace-grid"><form data-part-form class="offcut-panel"><h3>Part and cutting allowances</h3><div class="offcut-fields"><label>Material<select name="material"><option>Plywood</option><option>MDF</option><option>Solid wood</option><option>Other sheet goods</option></select></label><label>Thickness (in)<input name="thickness" type="number" required min="0.001" max="1200" step="any" value="0.75"></label><label>Finished length (in)<input name="length" type="number" required min="0.001" max="1200" step="any" placeholder="16"></label><label>Finished width (in)<input name="width" type="number" required min="0.001" max="1200" step="any" placeholder="10"></label><label>Trim per edge (in)<input name="trim" type="number" required min="0" max="12" step="any" value="0.125"></label><label>Kerf (in)<input name="kerf" type="number" required min="0" max="2" step="any" value="0.125"></label></div><label class="offcut-checkbox"><input type="checkbox" name="rotate" checked> Allow 90° rotation</label><label class="offcut-checkbox"><input type="checkbox" name="grain"> Grain direction must follow part length</label><button class="offcut-primary" type="submit">Check inventory</button></form><div class="offcut-panel offcut-results"><div class="offcut-panel-top"><h3>Candidate pieces</h3><button type="button" data-export-matches>Download match CSV</button></div><ul data-matches-list></ul><p class="offcut-status" role="status" aria-live="polite" data-offcut-status>Enter a part and check your recorded pieces.</p></div></div></section>
  <section class="offcut-explain"><div><p class="offcut-eyebrow">What a match means</p><h2>One rectangle fits by the recorded numbers.</h2><p>Results rank candidates by remaining area after the reserved blank. That is a screening measure, not a nesting layout or a prediction of reusable remainder. The physical stock still needs a defect, face, grain, support, and safe cutting check. Remove an old record after cutting and measure the new clean rectangle before saving it again.</p><a href="/offcut-planner/fit-check-method/">Read the fit-check method →</a></div><div class="offcut-rule"><strong>Release gate</strong><p>If defects, grain, trim, or safe support invalidate the blank, stop and choose another piece or new stock.</p></div></section>
  <section class="offcut-guides"><div class="offcut-heading"><p class="offcut-eyebrow">The full reuse workflow</p><h2>Three field guides</h2></div><div class="offcut-guide-grid">${guides.map((guide, index) => `<a href="/offcut-planner/${guide.slug}/"><span>0${index + 1} / Guide</span><h3>${esc(guide.title)}</h3><p>${esc(guide.description)}</p><strong>Read guide →</strong></a>`).join("")}</div></section><section class="offcut-links"><h2>Continue with a full layout</h2><p>When the job has multiple parts or sheet purchasing decisions, move from this one-part screen to the full cut planning tools.</p><div><a href="/one-sheet-projects/">Explore verified one-sheet examples →</a><a href="/plywood-cut-calculator/">Open the plywood calculator →</a><a href="/learn/how-to-reduce-plywood-waste/">Read the waste reduction guide →</a></div></section></main>`;
  return shell({ title: "Offcut Planner: Record and Reuse Wood Scraps", description, route: "/offcut-planner/", main, type: "CollectionPage", extraScript: '<script type="module" src="/assets/offcut-planner.js"></script>' });
}

await mkdir(join(root, "offcut-planner"), { recursive: true });
await writeFile(join(root, "offcut-planner", "index.html"), hubPage());
for (const guide of guides) {
  const dir = join(root, "offcut-planner", guide.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), guidePage(guide));
}
console.log(`Built Offcut Planner hub and ${guides.length} guides.`);
