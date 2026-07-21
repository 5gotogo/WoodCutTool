import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkMethod,
  benchmarkVersion,
  packSheets,
  projectBenchmarks,
  projectResult,
} from "./plywood-benchmark-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const publishedDate = "2026-07-19";
const kerf = 0.125;

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
const pct = (value) => `${value.toFixed(1)}%`;
const plural = (count, singular, pluralValue = `${singular}s`) => count === 1 ? singular : pluralValue;
const titleCase = (value) => String(value).split(" ").map((word, index) => {
  const lower = word.toLowerCase();
  if (index > 0 && ["and", "or", "for", "of", "the", "with"].includes(lower)) return lower;
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}).join(" ");

const projectConsiderations = {
  "base-cabinet": ["Verify the finished cabinet width and side-to-bottom joinery before using the 30 inch bottom.", "Keep the back in a separate material group when it uses thinner stock.", "Reserve filler, toe-kick, door, drawer, and finished-end parts that are outside this carcass example."],
  "wall-cabinet": ["Confirm cabinet depth against plates, doors, crown, and appliance clearances.", "Decide whether the back is applied or captured before calculating case depth.", "Lock the grain direction on visible sides even if free rotation gives a convenient layout."],
  "bathroom-vanity": ["Confirm plumbing, sink, and drawer clearances before releasing the bottom and shelf.", "Use moisture-appropriate material and protect exposed plywood edges.", "Add finished ends, fillers, toe-kick parts, and fronts to the project list when required."],
  "pantry-cabinet": ["Measure ceiling stand-up clearance before assembling an 84 inch case.", "Check long shelf span and load before accepting the example thickness.", "Separate adjustable shelves, pull-outs, backs, doors, fillers, and finished panels by material."],
  "laundry-cabinet": ["Use the appliance cut sheet for doors, hoses, vents, vibration, and service access.", "Do not let countertop or filler dimensions consume the appliance opening.", "Plan moisture exposure and wall anchoring before choosing the final sheet material."],
  "shop-cabinet": ["Rotation reduces this modeled layout by one sheet, so decide which faces can actually turn.", "Check shelf span under tools, fasteners, and consumables rather than empty-cabinet weight.", "Keep doors, drawer boxes, cleats, and a structural hanging system in the complete project list."],
  "bookshelf": ["Check shelf span against book weight and add edging or a center support when required.", "Choose the back construction before calculating finished depth and squareness.", "Lock visible grain and sequence any matched side panels before optimization."],
  "cube-storage": ["Test the real bin dimensions plus hand clearance before fixing each opening.", "Repeated dividers multiply small thickness and dado-position errors.", "Plan wall anchoring and base details for a tall or heavily loaded unit."],
  "mudroom-bench": ["Set finished seat height after accounting for a cushion and shoe-storage opening.", "Check the long seat for load, span, and front-edge reinforcement.", "Add locker uprights, hooks, backs, fillers, and wall anchoring when expanding the bench."],
  "window-seat": ["Measure the opening at several heights and reserve scribe material for uneven walls.", "Check drawer, lid, curtain, trim, and HVAC movement before fixing the front.", "Design the seat and dividers for the expected live load rather than storage alone."],
  "utility-closet": ["Verify utility shutoff and service clearances before allocating shelves.", "Confirm that an 84 inch case can pass through the room and stand below the ceiling.", "Use removable panels where future equipment or plumbing access is required."],
  "under-bed-drawers": ["Measure the lowest rail and center support across an uneven floor.", "Include loaded caster or glide height, rug transitions, and bedding overhang.", "Calculate drawer-box width from the selected hardware instead of nominal bed width."],
  "coffee-table": ["Rotation is the difference between one and two modeled sheets in this example.", "Lock rotation if the top, shelf, or leg-panel grain must align visually.", "Confirm joinery, edge treatment, apron structure, and top overhang before cutting."],
  "console-table": ["Check wall trim and floor level when the table is intended to fit a fixed location.", "Size the long shelf and back stretcher for expected load and racking resistance.", "Add drawer, door, face-frame, or edge-building parts not represented here."],
  "record-cabinet": ["Vinyl records create a dense load, so shorten or reinforce unsupported shelf spans.", "Use a structural back and wall restraint to control racking and tipping.", "Confirm record height, sleeve depth, finger clearance, and divider spacing."],
  "media-cabinet": ["Inventory equipment heat, cable connectors, plugs, and service paths before locating dividers.", "Provide intake and exhaust openings without weakening loaded shelves.", "Mock door and drawer travel around screens, speakers, and adjacent walls."],
  "folding-craft-table": ["Verify leaf hardware, leg swing, and support clearances with a full-size motion sketch.", "Rotation is allowed in the benchmark, but visible top grain may need to remain aligned.", "Check the folded footprint and caster or wall clearance before final dimensions."],
  "kids-table": ["Use age-appropriate finished height and avoid sharp or trapping details.", "Design leg and stretcher joinery for climbing and lateral loads, not only tabletop weight.", "Confirm the finish and fasteners are appropriate for the intended use."],
  "mobile-workbench": ["Add the actual tool, vise, and workholding loads before approving the top and shelf.", "Use caster ratings based on the complete loaded bench with a safety margin.", "Check doorways, aisle width, handle position, and wheel locks at the finished size."],
  "assembly-table": ["The three-sheet result is driven by two large top layers and broad leg panels.", "Check torsion-box, apron, or frame parts that are not represented in this panel-only list.", "Set height, overhang, clamping access, and flatness requirements before cutting."],
  "miter-saw-stand": ["Mock the saw through full miter and bevel travel before fixing the deck and wings.", "Set wing surfaces from the actual saw-table height and leveling method.", "Preserve long-stock paths, dust collection, fence adjustment, and wall clearance."],
  "french-cleat-wall": ["Rotation saves one modeled sheet, but plywood face and cleat grain still require review.", "Fasten the wall panels and cleats into verified structure for the expected tool load.", "Plan holder modules and safe spacing instead of treating the back panel as the complete system."],
  "rolling-cart": ["Choose caster capacity from the fully loaded cart and include impact during movement.", "Check handle, shelf lip, door, and aisle clearances before fixing overall width.", "Add bracing or a structural back when the open case can rack under movement."],
  "outdoor-storage-box": ["Slope and overhang the lid so water sheds beyond panel edges.", "Raise the bottom, provide drainage and ventilation, and seal every exposed edge.", "Size hinges and lid supports for the real lid weight and wind exposure."],
  "kitchen-island": ["Tape the finished countertop footprint and test occupied seating and appliance doors.", "Coordinate end panels, back treatment, electrical work, fillers, and countertop support.", "Use the floor high point and anchoring plan before locking cabinet height."],
  "appliance-garage": ["Mock the selected door hardware through its full movement above real appliances.", "Check plugs, steam, heat, ventilation, lids, and service access inside the opening.", "Preserve usable counter depth while keeping the cabinet aligned with adjacent uppers."],
  "microwave-shelf-cabinet": ["Use the exact model manual for enclosure clearances and ventilation.", "Check the loaded shelf span, power-cord path, controls, door swing, and safe reach.", "Do not assume a countertop microwave is approved for a tight built-in opening."],
  "closet-tower": ["Confirm ceiling stand-up clearance before assembling the 84 inch sides.", "Plan drawer hardware, hanging clothes, shelf-pin zones, baseboard, and wall fillers together.", "Anchor the tower and keep heavy storage within a stable reachable zone."],
  "entryway-locker": ["Mock coats and bags so hooks do not block the seat or adjacent bays.", "Set bench and cubby sizes from real users, footwear, and baskets.", "Reserve baseboard and wall scribes, then anchor the tall unit into structure."],
  "laundry-folding-table": ["Set the top from appliance height, vibration clearance, and comfortable folding posture.", "Preserve hose, vent, valve, plug, and service access behind the installation.", "Check the long shelf and top layers for support, moisture, and finished-edge needs."],
  "craft-storage-cabinet": ["Measure paper, bins, machines, rolls, and hand clearance before equalizing cubbies.", "Check shelf span and load where supplies are dense or machines are stored.", "Use adjustable zones for changing inventory and label fixed project-specific openings."],
  "sewing-table": ["Rotation saves one modeled sheet, but the visible top may require directional grain.", "Trace the exact sewing machine, lift, insert, cables, controls, and knee envelope.", "Prototype the top opening before cutting the most visible finished panel."],
  "sheet-goods-storage-cart": ["The four-sheet estimate is driven by large base and divider panels.", "Calculate full loaded weight and use casters, axle spacing, and handles rated for it.", "Check doorway, aisle, loading angle, tip resistance, and parking footprint."],
  "cutoff-storage-bin": ["Set compartments from the offcut policy and recurring stock sizes, not arbitrary symmetry.", "Keep narrow pieces visible and removable without unloading the whole bin.", "Control loaded center of gravity and anchor or widen the base when needed."],
  "sanding-station": ["Lay out actual sanders, dust ports, hoses, abrasives, and power before shelf positions.", "Separate dust-producing equipment from clean consumable storage.", "Check tool access, ventilation, cord routing, and a stable loaded base."],
  "small-parts-drawer-cabinet": ["Choose drawer heights from real fasteners, bins, and hand access rather than one repeated opening.", "Calculate box width from the selected slides and the finished case opening.", "Reserve clear label zones and growth capacity so the system remains searchable."],
  ...Object.fromEntries(projectBenchmarks
    .filter((entry) => Array.isArray(entry.considerations))
    .map((entry) => [entry.slug, entry.considerations])),
};

if (Object.keys(projectConsiderations).length !== projectBenchmarks.length) {
  throw new Error(`Expected project notes for ${projectBenchmarks.length} examples, received ${Object.keys(projectConsiderations).length}`);
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value, null, 2)}</script>`;
}

function breadcrumbSchema(name, route = null) {
  const trail = route
    ? [["Home", "/"], ["Cut List Examples", "/examples/"], [name, route]]
    : [["Home", "/"], ["Cut List Examples", "/examples/"]];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([label, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: label,
      item: `${siteUrl}${path}`,
    })),
  };
}

function pageShell({ title, description, route, schemas, body }) {
  const canonical = `${siteUrl}${route}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="stylesheet" href="/assets/styles.css">
  ${schemas.map(jsonLd).join("\n  ")}
  <style>.mega-menu{display:none}</style>
  <script defer src="/assets/site-chrome.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  ${body}
  <div data-site-footer></div>
</body>
</html>\n`;
}

function compactTitle(name, sheetCount) {
  return `${titleCase(name)} Cut List: ${sheetCount} ${plural(sheetCount, "Sheet")} | WoodCutTool`;
}

function pageDescription(row) {
  const sheetLabel = `${row.allowedSheets} ${plural(row.allowedSheets, "4×8 sheet")}`;
  return `See a ${row.name.toLowerCase()} cut list with ${row.partCount} parts packed on ${sheetLabel} at ${pct(row.allowedYield)} yield. View the layout, download the CSV, and compare rotation.`;
}

function metric(label, value, note) {
  return `<div class="research-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
}

function partsTable(project) {
  return project.parts.map((part) => `<tr><th scope="row">${esc(part.label)}</th><td>${part.length}</td><td>${part.width}</td><td>${part.qty}</td><td>${(part.length * part.width * part.qty).toFixed(1)}</td></tr>`).join("");
}

function layoutSvg(project, packed) {
  const scale = 5;
  const sheetW = 96 * scale;
  const sheetH = 48 * scale;
  const gap = 54;
  const top = 34;
  const height = top + packed.sheets.length * (sheetH + gap);
  const colors = ["#d9e7da", "#eadfc5", "#cdded5", "#e8d4c2", "#d8d9b9", "#c7d6e5", "#e2c9c2", "#d9d2e7"];
  const groups = packed.sheets.map((sheet, sheetIndex) => {
    const y = top + sheetIndex * (sheetH + gap);
    const pieces = sheet.placements.map((piece, pieceIndex) => {
      const x = 38 + piece.y * scale;
      const py = y + piece.x * scale;
      const width = piece.h * scale;
      const heightValue = piece.w * scale;
      const label = width >= 88 && heightValue >= 34
        ? `<text x="${x + 7}" y="${py + 18}">${esc(piece.label)}</text><text class="example-layout-size" x="${x + 7}" y="${py + 34}">${piece.length}×${piece.width}</text>`
        : "";
      return `<g><rect class="example-layout-part" x="${x}" y="${py}" width="${width}" height="${heightValue}" fill="${colors[pieceIndex % colors.length]}"/>${label}</g>`;
    }).join("");
    return `<g><text class="example-layout-sheet-label" x="38" y="${y - 10}">Sheet ${sheetIndex + 1}</text><rect class="example-layout-sheet" x="38" y="${y}" width="${sheetW}" height="${sheetH}"/>${pieces}</g>`;
  }).join("");
  return `<div class="example-layout-wrap"><svg class="example-layout" viewBox="0 0 556 ${height}" role="img" aria-labelledby="layout-title-${project.slug} layout-desc-${project.slug}"><title id="layout-title-${project.slug}">${esc(project.name)} example plywood layout</title><desc id="layout-desc-${project.slug}">${packed.sheets.length} modeled 4 by 8 plywood sheets containing ${project.parts.reduce((sum, part) => sum + part.qty, 0)} rectangular parts with a one-eighth inch kerf.</desc>${groups}</svg></div>`;
}

function articleSchema(project, row, description, route) {
  const projectPublishedDate = project.publishedDate ?? publishedDate;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${titleCase(project.name)} Cut List Example: ${row.partCount} Parts on ${row.allowedSheets} ${plural(row.allowedSheets, "Sheet")}`,
    description,
    url: `${siteUrl}${route}`,
    mainEntityOfPage: `${siteUrl}${route}`,
    datePublished: projectPublishedDate,
    dateModified: benchmarkVersion,
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    about: ["cut list", "plywood layout", project.category, project.name],
    mainEntity: {
      "@type": "ItemList",
      name: `${project.name} example parts list`,
      numberOfItems: row.partCount,
      itemListElement: project.parts.map((part, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${part.label}: ${part.qty} at ${part.length} × ${part.width} inches`,
      })),
    },
  };
}

function examplePage(project) {
  const row = projectResult(project, kerf);
  const packed = packSheets(project.parts, 96, 48, kerf, true);
  const route = `/examples/${project.slug}-cut-list/`;
  const csvPath = `/examples/data/${project.slug}-cut-list.csv`;
  const description = pageDescription(row);
  const sheetText = `${row.allowedSheets} ${plural(row.allowedSheets, "sheet")}`;
  const lockedDifference = row.lockedSheets - row.allowedSheets;
  const rotationFinding = lockedDifference > 0
    ? `Locking every part orientation increased the modeled result from ${row.allowedSheets} to ${row.lockedSheets} sheets and reduced whole-project yield from ${pct(row.allowedYield)} to ${pct(row.lockedYield)}. That is a useful cost signal, not permission to rotate visible grain: classify each part before releasing orientation.`
    : `The rotation-allowed and fully locked scenarios both used ${row.allowedSheets} ${plural(row.allowedSheets, "sheet")}. In this parts list, orientation did not change sheet count, but it can still change placement order, offcut shape, grain continuity, and cut sequence.`;
  const considerations = projectConsiderations[project.slug];
  const projectPublishedDate = project.publishedDate ?? publishedDate;
  const troubleshootingNote = project.troubleshootingPath
    ? `      <section class="research-note"><h2>Diagnose a related build problem</h2><p>If the physical project no longer matches the released parts, use <a href="${project.troubleshootingPath}">${esc(project.troubleshootingLabel)}</a> before changing dimensions at the saw. Preserve the original input, test one cause at a time, and regenerate the layout after the source list is corrected.</p></section>\n\n`
    : "";
  const h1 = `${titleCase(project.name)} Cut List Example: ${row.partCount} Parts on ${row.allowedSheets} ${plural(row.allowedSheets, "Sheet")}`;

  return pageShell({
    title: compactTitle(project.name, row.allowedSheets),
    description,
    route,
    schemas: [articleSchema(project, row, description, route), breadcrumbSchema(project.name, route)],
    body: `<main id="main" class="article-shell research-shell example-shell">
    <article class="article-body research-article example-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/examples/">Cut List Examples</a> / ${esc(titleCase(project.name))}</p>
      <p class="eyebrow">Cut List Example · ${esc(project.category)}</p>
      <h1>${esc(h1)}</h1>
      <p class="lead">This reproducible example packs a ${esc(project.name.toLowerCase())} parts list on standard 96 × 48 inch plywood with a 1/8 inch kerf. It publishes the input rows, modeled layout, rotation comparison, and CSV so you can inspect the estimate instead of trusting a sheet-count claim without evidence.</p>
      <p class="article-byline">Published ${projectPublishedDate} by <a href="/about/">WoodCutTool Editorial Team</a> · Benchmark ${benchmarkVersion}, method <code>${benchmarkMethod}</code></p>

      <section class="research-metrics" aria-label="Example result">
        ${metric("Parts", String(row.partCount), `${project.parts.length} named part groups`)}
        ${metric("4×8 sheets", String(row.allowedSheets), "Rotation allowed")}
        ${metric("Material yield", pct(row.allowedYield), `${pct(100 - row.allowedYield)} unfilled area`)}
        ${metric("Grain locked", String(row.lockedSheets), `${row.allowedComplete && row.lockedComplete ? "Complete" : "Review"} · ${lockedDifference > 0 ? `+${lockedDifference} sheet` : "Same sheet count"}`)}
      </section>

      <section><h2>The answer first: how much plywood does this example use?</h2><p>The modeled ${esc(project.name.toLowerCase())} uses <strong>${sheetText} of 4×8 plywood</strong> for ${row.partCount} rectangular parts at ${pct(row.allowedYield)} material yield. Total finished-part area is ${row.partArea.toFixed(1)} square inches. Dividing that area by 4,608 square inches gives an area-only lower bound of ${row.theoreticalSheets} ${plural(row.theoreticalSheets, "sheet")}, but the layout still has to solve part geometry, kerf, and orientation.</p><p>This is a planning example, not a guaranteed purchase quantity or a construction drawing. It excludes joinery allowance, damaged-edge trimming, defects, test cuts, replacement pieces, hardware, face selection, and any project components not shown in the parts table.</p></section>

      <section class="research-note"><h2>Download the exact input</h2><p><a class="button" href="${csvPath}" download>Download ${esc(titleCase(project.name))} cut list CSV</a></p><p>The file contains the same part names, finished dimensions, quantities, source template, kerf, sheet size, benchmark version, and modeled result shown on this page. Edit a copy for your project rather than treating these example dimensions as a finished plan.</p></section>

      <section><h2>${esc(project.name)} example parts list</h2><p>Dimensions are finished rectangular planning sizes in inches. Quantity is expanded before packing, so repeated parts occupy their own positions. Confirm material thickness and construction method separately because a rectangle layout does not calculate joinery.</p><div class="research-table-wrap"><table class="research-table"><thead><tr><th>Part group</th><th>Length (in)</th><th>Width (in)</th><th>Qty.</th><th>Area (sq. in.)</th></tr></thead><tbody>${partsTable(project)}</tbody></table></div></section>

      <section><h2>Modeled 4×8 sheet layout</h2><p>The diagram is generated from the published input with a deterministic MaxRects-style placement heuristic. It is useful for inspecting whether large panels dominate a sheet and where smaller repeated parts land. It is not a saw sequence: review support, reference edges, grain, and safe first cuts before taking it to the shop.</p>${layoutSvg(project, packed)}</section>

      <section><h2>What changes when rotation is locked?</h2><p>${rotationFinding}</p><p>The benchmark's “locked” run keeps every entered rectangle in its original orientation. A real project can be more selective: lock matched doors, finished ends, long-grain shelves, and visible panels while allowing hidden backs, stretchers, or non-directional parts to rotate when their structure and edge treatment permit it.</p></section>

      <section><h2>Three project checks before you use these dimensions</h2><ol>${considerations.map((item) => `<li>${esc(item)}</li>`).join("")}</ol><p>Resolve these checks in the drawing and hardware specifications before optimizing. If a choice changes a finished width, material group, grain arrow, or quantity, update the parts list and regenerate the layout rather than adjusting pieces at the saw.</p></section>

${troubleshootingNote}      <section><h2>How to adapt this example to your project</h2><ol><li>Open the linked <a href="${project.templatePath}">${esc(project.name)} template</a> and define the finished outside dimensions and construction method.</li><li>Replace every example row with your finished part dimensions, quantity, material code, and grain rule.</li><li>Separate backs, drawer bottoms, doors, finished panels, and other thicknesses into their own purchasable material groups.</li><li>Measure the real sheet and blade, then enter usable sheet size, edge trim, and kerf in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</li><li>Inspect the last sheet, useful offcuts, first cuts, narrow strips, labels, and replacement risk before ordering.</li></ol></section>

      <section><h2>Why this title uses a sheet count and yield</h2><p>Searchers asking for a ${esc(project.name.toLowerCase())} cut list usually want an immediate scale check: number of parts, likely sheets, and whether the list is available. Those numbers are placed in the heading and description because they are computed from the visible input, not added as clickbait. The page then exposes the assumptions that can make the number change.</p><p>Yield is finished-part area divided by purchased sheet area. It does not claim that every remaining square inch is avoidable waste. Kerf, edge trim, defects, safe handling, offcut shape, and project-specific constraints determine what the shop can actually reuse.</p></section>

      <section><h2>Method, limitations, and reproducibility</h2><p>The generator expands each quantity into individual rectangles, sorts by area and long side, and places pieces with the same deterministic heuristic used in WoodCutTool's open plywood benchmarks. Standard sheets are modeled at 96 × 48 inches with a 0.125 inch kerf. The method is versioned as <code>${benchmarkMethod}</code> and does not claim a globally optimal nesting result.</p><p>Before purchasing, compare the example with the <a href="/research/plywood-project-yield-benchmarks/">${projectBenchmarks.length}-project plywood yield dataset</a> and run your own dimensions in <a href="/apps/cutlist/">CutList</a>. Preserve a contingency when a damaged visible part, supplier variation, or field measurement would be expensive to recover from.</p></section>

      <section><h2>Frequently asked questions</h2><h3>Is this a complete ${esc(project.name.toLowerCase())} plan?</h3><p>No. It is a transparent plywood parts and layout example. Joinery, hardware, structure, installation, finish, local requirements, and omitted components must be designed and verified separately.</p><h3>Does ${sheetText} guarantee how much plywood I should buy?</h3><p>No. It is the output for the published dimensions and assumptions. Your measurements, sheet condition, grain, trim, kerf, replacement policy, and construction details can increase or decrease the result.</p><h3>Can I rotate every part to match the lower sheet count?</h3><p>Only when appearance, structure, machining, and edge treatment permit it. Use the rotation comparison to identify cost pressure, then classify individual parts instead of releasing every orientation.</p><h3>Can I download the list?</h3><p>Yes. The CSV above contains the visible input and result metadata so the example can be audited and adapted.</p></section>

      <section class="research-note"><h2>Next step</h2><p><a class="button" href="${project.templatePath}">Open the ${esc(titleCase(project.name))} template</a> <a class="button secondary" href="/apps/cutlist/">Plan it in CutList</a></p><p>Use the template to define the project, then replace every example input before generating a purchase-ready layout.</p></section>
    </article>
  </main>`,
  });
}

function exampleCsv(project) {
  const row = projectResult(project, kerf);
  const header = ["project", "category", "part_group", "length_in", "width_in", "quantity", "sheet_length_in", "sheet_width_in", "kerf_in", "rotation_allowed_sheets", "rotation_allowed_yield_pct", "rotation_allowed_rejected_piece_count", "rotation_allowed_complete_layout", "grain_locked_sheets", "grain_locked_yield_pct", "grain_locked_rejected_piece_count", "grain_locked_complete_layout", "source_template", "benchmark_version", "method"];
  const rows = project.parts.map((part) => [project.name, project.category, part.label, part.length, part.width, part.qty, 96, 48, kerf, row.allowedSheets, row.allowedYield.toFixed(3), row.allowedRejected, row.allowedComplete, row.lockedSheets, row.lockedYield.toFixed(3), row.lockedRejected, row.lockedComplete, project.templatePath, benchmarkVersion, benchmarkMethod]);
  return `${[header, ...rows].map((values) => values.map(csvCell).join(",")).join("\n")}\n`;
}

const rows = projectBenchmarks.map((project) => ({ project, result: projectResult(project, kerf) }));
const categoryCounts = Object.entries(rows.reduce((map, { project }) => ({ ...map, [project.category]: (map[project.category] || 0) + 1 }), {}));
const hubDescription = `Browse ${rows.length} downloadable cut list examples with real part dimensions, 4×8 sheet counts, material yield, rotation comparisons, and plywood layouts.`;
const categoryOrder = ["Cabinets", "Storage", "Furniture", "Shop", "Outdoor", "Small Projects"];
const categoryDescriptions = {
  Cabinets: "Carcasses, appliance openings, islands, and shop cabinets with explicit panel geometry.",
  Storage: "Shelves, benches, carts, closets, and organizers sized around real storage constraints.",
  Furniture: "Tables, seating, media furniture, and compact builds with visible-grain decisions.",
  Shop: "Workstations, tool storage, and mobile fixtures with machine and loaded-use checks.",
  Outdoor: "Exterior storage and planting projects with moisture and drainage assumptions kept visible.",
  "Small Projects": "Desktop builds that make material thickness, clear openings, and repeat cuts easy to inspect.",
};
const categoryId = (category) => category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
const categoryNav = categoryOrder
  .filter((category) => rows.some(({ project }) => project.category === category))
  .map((category) => `<a href="#${categoryId(category)}">${esc(category)}</a>`)
  .join("");
const categorySections = categoryOrder.map((category) => {
  const group = rows.filter(({ project }) => project.category === category);
  if (!group.length) return "";
  const cards = group.map(({ project, result }) => `<a class="research-card example-card" href="/examples/${project.slug}-cut-list/"><span>${esc(project.category)} · ${result.partCount} parts</span><h3>${esc(titleCase(project.name))} Cut List</h3><p><strong>${result.allowedSheets} ${plural(result.allowedSheets, "sheet")}</strong> at ${pct(result.allowedYield)} modeled yield with a 1/8 inch kerf.</p><strong>View parts and layout →</strong></a>`).join("");
  return `<section class="template-category-section" id="${categoryId(category)}"><div class="template-category-heading"><div><p class="eyebrow">${esc(category)}</p><h2>${esc(category)} cut list examples</h2></div><span>${group.length} examples</span></div><p>${esc(categoryDescriptions[category])}</p><div class="research-card-grid example-card-grid">${cards}</div></section>`;
}).join("");
const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Cut List Examples",
  description: hubDescription,
  url: `${siteUrl}/examples/`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: rows.length,
    itemListElement: rows.map(({ project, result }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${project.name}: ${result.partCount} parts on ${result.allowedSheets} ${plural(result.allowedSheets, "sheet")}`,
      url: `${siteUrl}/examples/${project.slug}-cut-list/`,
    })),
  },
};
const hubHtml = pageShell({
  title: "Cut List Examples With Plywood Layouts | WoodCutTool",
  description: hubDescription,
  route: "/examples/",
  schemas: [hubSchema, breadcrumbSchema("Cut List Examples")],
  body: `<main id="main" class="article-shell research-shell example-shell">
    <article class="article-body research-article example-article">
      <p class="breadcrumb"><a href="/">Home</a> / Cut List Examples</p>
      <p class="eyebrow">New · Downloadable project examples</p>
      <h1>Cut List Examples With Real Parts and Plywood Layouts</h1>
      <p class="lead">Start with a transparent example instead of a blank spreadsheet. Every page publishes the parts, 4×8 sheet estimate, material yield, rotation comparison, layout diagram, source template, limitations, and downloadable CSV.</p>
      <section class="research-metrics" aria-label="Example library summary">
        ${metric("Examples", String(rows.length), "One reproducible project per page")}
        ${metric("Categories", String(categoryCounts.length), categoryCounts.map(([name]) => name).join(", "))}
        ${metric("Download files", String(rows.length), "One editable CSV per example")}
        ${metric("Hidden inputs", "0", "Parts and assumptions stay visible")}
      </section>
      <section><h2>Choose a project example</h2><p>Titles show the project rather than a generic keyword, while every card exposes the modeled sheet count and yield before the click. Open a result to inspect exactly why the number is plausible and what must change for your project.</p><nav class="template-category-nav" aria-label="Browse cut list example categories">${categoryNav}</nav></section>
      ${categorySections}
      <section><h2>Why examples are different from templates</h2><p>A <a href="/templates/">template</a> helps define the parts a project may need. An example goes one step further by running a declared parts list through a versioned layout method and publishing the result. Use the template for design structure, the example for scale and assumptions, and <a href="/apps/cutlist/">CutList</a> for your saved project dimensions.</p></section>
      <section><h2>What the numbers mean</h2><p>Each result uses nominal 96 × 48 inch plywood, a 1/8 inch kerf, and a deterministic rectangle-packing heuristic. Material yield is finished-part area divided by total sheet area. It is not a promise of optimal nesting or usable offcut value, and it does not include defects, trim, joinery, replacement parts, or omitted components.</p></section>
      <section><h2>Built for answer-first search results</h2><p>Project name, part count, sheet count, and modeled yield are kept close to the title and description because they answer the first purchasing question quickly. The pages earn those numbers by exposing every input, linking the source template, and providing a CSV rather than repeating an unexplained estimate across thin pages.</p></section>
      <section class="research-note"><h2>Something does not fit or cut correctly?</h2><p>Use the <a href="/troubleshooting/">woodworking troubleshooting library</a> to diagnose layout, kerf, grain, repeated-cut, cabinet, material, and revision problems before changing these example dimensions.</p></section>
      <section class="research-note"><h2>Need the full comparison dataset?</h2><p>The <a href="/research/plywood-project-yield-benchmarks/">plywood project yield benchmark</a> compares all ${rows.length} examples in one report. Use this library when you want the complete part list and layout for a single project.</p></section>
    </article>
  </main>`,
});

await mkdir(join(root, "examples", "data"), { recursive: true });
await writeFile(join(root, "examples", "index.html"), hubHtml);
for (const project of projectBenchmarks) {
  const dir = join(root, "examples", `${project.slug}-cut-list`);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), examplePage(project));
  await writeFile(join(root, "examples", "data", `${project.slug}-cut-list.csv`), exampleCsv(project));
}

console.log(`Generated ${projectBenchmarks.length} cut list example pages and ${projectBenchmarks.length} CSV files.`);
