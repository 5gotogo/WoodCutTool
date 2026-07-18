import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkMethod,
  benchmarkVersion,
  kerfPatterns,
  projectBenchmarks,
  projectResult,
  scenarioResult,
  standardSheet
} from "./plywood-benchmark-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const licenseUrl = "https://creativecommons.org/licenses/by/4.0/";
const kerfs = [0, 0.0625, 0.09375, 0.125];
const matrixKerfs = [0, 0.03125, 0.0625, 0.09375, 0.125, 0.1875, 0.25];
const sheetFormats = [
  { slug: "5x5", label: "5 × 5 ft", length: 60, width: 60 },
  { slug: "4x8", label: "4 × 8 ft", length: 96, width: 48 },
  { slug: "4x10", label: "4 × 10 ft", length: 120, width: 48 },
  { slug: "5x10", label: "5 × 10 ft", length: 120, width: 60 }
];
const trimMargins = [0, 0.125, 0.25, 0.5, 1];
const robustnessVersion = "2026-07-18";
const projectRows = projectBenchmarks.map((project) => projectResult(project));
const kerfRows = kerfPatterns.flatMap((pattern) => kerfs.map((kerf) => ({ ...projectResult(pattern, kerf), kerf })));
const projectKerfRows = projectBenchmarks.flatMap((project) => matrixKerfs.flatMap((kerf) => [true, false].map((allowRotate) =>
  scenarioResult(project, { kerf, allowRotate })
)));
const sheetFormatRows = projectBenchmarks.flatMap((project) => sheetFormats.flatMap((format) => [true, false].map((allowRotate) => ({
  ...scenarioResult(project, {
    sheetLength: format.length,
    sheetWidth: format.width,
    kerf: 0.125,
    allowRotate
  }),
  formatSlug: format.slug,
  formatLabel: format.label
}))));
const trimRows = projectBenchmarks.flatMap((project) => trimMargins.flatMap((trimMargin) => [true, false].map((allowRotate) => ({
  ...scenarioResult(project, {
    sheetLength: standardSheet.length - (trimMargin * 2),
    sheetWidth: standardSheet.width - (trimMargin * 2),
    kerf: 0.125,
    allowRotate
  }),
  trimMargin,
  nominalSheetLength: standardSheet.length,
  nominalSheetWidth: standardSheet.width
}))));
const robustnessRows = projectBenchmarks.flatMap((project) => trimMargins.flatMap((trimMargin) => matrixKerfs.flatMap((kerf) => [true, false].map((allowRotate) => ({
  ...scenarioResult(project, {
    sheetLength: standardSheet.length - (trimMargin * 2),
    sheetWidth: standardSheet.width - (trimMargin * 2),
    kerf,
    allowRotate
  }),
  trimMargin,
  nominalSheetLength: standardSheet.length,
  nominalSheetWidth: standardSheet.width
})))));

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const pct = (value) => `${value.toFixed(1)}%`;
const num = (value, digits = 1) => Number(value.toFixed(digits));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
const csv = (headers, rows) => [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";

const projectCsvPath = "/research/data/plywood-project-yield-benchmarks.csv";
const kerfCsvPath = "/research/data/saw-kerf-sheet-count-impact.csv";
const projectKerfCsvPath = "/research/data/project-kerf-sensitivity-matrix.csv";
const sheetFormatCsvPath = "/research/data/plywood-sheet-format-comparison.csv";
const trimCsvPath = "/research/data/edge-trim-allowance-impact.csv";
const robustnessCsvPath = "/research/data/plywood-layout-robustness-matrix.csv";

const projectCsv = csv([
  "benchmark_version", "method", "project_slug", "project_name", "category", "part_count",
  "part_area_sq_in", "area_only_min_sheets", "rotation_allowed_sheets", "rotation_allowed_yield_pct",
  "grain_locked_sheets", "grain_locked_yield_pct", "rejected_piece_count", "source_template_url"
], projectRows.map((row) => [
  benchmarkVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), row.theoreticalSheets, row.allowedSheets, num(row.allowedYield),
  row.lockedSheets, num(row.lockedYield), row.rejected, `${siteUrl}${row.templatePath}`
]));

const kerfCsv = csv([
  "benchmark_version", "method", "pattern_slug", "pattern_name", "category", "part_count",
  "part_area_sq_in", "kerf_in", "rotation_allowed_sheets", "yield_pct", "source_url"
], kerfRows.map((row) => [
  benchmarkVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), row.kerf, row.allowedSheets, num(row.allowedYield), `${siteUrl}${row.templatePath}`
]));

const projectKerfCsv = csv([
  "benchmark_version", "method", "project_slug", "project_name", "category", "part_count",
  "requested_part_area_sq_in", "placed_part_area_sq_in", "kerf_in", "orientation_mode", "sheet_length_in", "sheet_width_in",
  "estimated_sheets", "yield_pct", "waste_pct", "rejected_piece_count", "source_template_url"
], projectKerfRows.map((row) => [
  benchmarkVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), num(row.placedArea), row.kerf, row.allowRotate ? "rotation_allowed" : "orientation_locked",
  row.sheetLength, row.sheetWidth, row.sheets, num(row.yield), num(row.waste), row.rejected,
  `${siteUrl}${row.templatePath}`
]));

const sheetFormatCsv = csv([
  "benchmark_version", "method", "project_slug", "project_name", "category", "part_count",
  "requested_part_area_sq_in", "placed_part_area_sq_in", "sheet_format", "sheet_length_in", "sheet_width_in", "orientation_mode",
  "estimated_sheets", "yield_pct", "waste_pct", "rejected_piece_count", "complete_layout", "source_template_url"
], sheetFormatRows.map((row) => [
  benchmarkVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), num(row.placedArea), row.formatSlug, row.sheetLength, row.sheetWidth,
  row.allowRotate ? "rotation_allowed" : "orientation_locked", row.sheets, num(row.yield),
  num(row.waste), row.rejected, row.rejected === 0, `${siteUrl}${row.templatePath}`
]));

const trimCsv = csv([
  "benchmark_version", "method", "project_slug", "project_name", "category", "part_count",
  "requested_part_area_sq_in", "placed_part_area_sq_in", "trim_margin_each_edge_in", "nominal_sheet_length_in", "nominal_sheet_width_in",
  "usable_sheet_length_in", "usable_sheet_width_in", "orientation_mode", "estimated_sheets",
  "usable_area_yield_pct", "usable_area_waste_pct", "rejected_piece_count", "source_template_url"
], trimRows.map((row) => [
  benchmarkVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), num(row.placedArea), row.trimMargin, row.nominalSheetLength, row.nominalSheetWidth,
  row.sheetLength, row.sheetWidth, row.allowRotate ? "rotation_allowed" : "orientation_locked",
  row.sheets, num(row.yield), num(row.waste), row.rejected, `${siteUrl}${row.templatePath}`
]));

const robustnessCsv = csv([
  "dataset_version", "method", "project_slug", "project_name", "category", "part_count",
  "requested_part_area_sq_in", "placed_part_area_sq_in", "trim_margin_each_edge_in", "kerf_in",
  "nominal_sheet_length_in", "nominal_sheet_width_in", "usable_sheet_length_in", "usable_sheet_width_in",
  "orientation_mode", "estimated_sheets", "usable_area_yield_pct", "usable_area_waste_pct",
  "rejected_piece_count", "complete_layout", "source_template_url"
], robustnessRows.map((row) => [
  robustnessVersion, benchmarkMethod, row.slug, row.name, row.category, row.partCount,
  num(row.partArea), num(row.placedArea), row.trimMargin, row.kerf,
  row.nominalSheetLength, row.nominalSheetWidth, row.sheetLength, row.sheetWidth,
  row.allowRotate ? "rotation_allowed" : "orientation_locked", row.sheets, num(row.yield), num(row.waste),
  row.rejected, row.rejected === 0, `${siteUrl}${row.templatePath}`
]));

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, route], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${route}`
    }))
  };
}

function datasetSchema({
  name,
  description,
  route,
  csvPath,
  variables,
  datePublished = benchmarkVersion,
  measurementTechnique = "Deterministic MaxRects-style rectangle-packing heuristic",
  version = benchmarkVersion
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${siteUrl}${route}`,
    sameAs: `${siteUrl}${route}`,
    identifier: `woodcuttool:${route.split("/").filter(Boolean).at(-1)}:${version}`,
    creator: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    datePublished,
    dateModified: version,
    version,
    license: licenseUrl,
    isAccessibleForFree: true,
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "WoodCutTool Research and Open Datasets",
      url: `${siteUrl}/research/`
    },
    measurementTechnique,
    variableMeasured: variables,
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${siteUrl}${csvPath}`,
      encodingFormat: "text/csv"
    }
  };
}

function page({ route, title, description, eyebrow, h1, lead, schemas, content, published = benchmarkVersion, version = benchmarkVersion }) {
  const canonical = `${siteUrl}${route}`;
  const jsonLd = schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`).join("\n  ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${jsonLd}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main" class="article-shell research-shell">
    <article class="article-body research-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/research/">Research</a>${route === "/research/" ? "" : ` / ${esc(h1)}`}</p>
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h1>${esc(h1)}</h1>
      <p class="lead">${esc(lead)}</p>
      <p class="article-byline">Published ${published} by <a href="/about/">WoodCutTool Editorial Team</a> · Dataset version ${version}</p>
      ${content}
    </article>
  </main>
  <div data-site-footer></div>
</body>
</html>\n`;
}

function metric(label, value, note) {
  return `<div class="research-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
}

const affectedByRotation = projectRows.filter((row) => row.lockedSheets > row.allowedSheets);
const avgAllowedYield = average(projectRows.map((row) => row.allowedYield));
const totalAllowedSheets = projectRows.reduce((sum, row) => sum + row.allowedSheets, 0);
const totalLockedSheets = projectRows.reduce((sum, row) => sum + row.lockedSheets, 0);
const kerfAffectedPatterns = kerfPatterns.filter((pattern) => projectResult(pattern, 0).allowedSheets !== projectResult(pattern, 0.125).allowedSheets);

const hubDescription = "Original open woodworking datasets on plywood yield, saw kerf, sheet formats, trim allowance, and grain-direction constraints.";
const hubDatasets = [
  ["Plywood project yield benchmarks", `${projectRows.length} common project parts lists tested on standard 4×8 sheets, with area-only minimums and heuristic sheet counts.`, "/research/plywood-project-yield-benchmarks/", `${projectRows.length} projects`],
  ["Saw kerf and sheet-count impact", "Ten repeated-cut patterns compared at zero, 1/16, 3/32, and 1/8 inch kerf to expose exact-fit failures.", "/research/saw-kerf-sheet-count-impact/", `${kerfRows.length} runs`],
  ["Grain direction and panel rotation", `The same ${projectRows.length} projects tested with rotation allowed and locked, plus practical guidance for visible plywood faces.`, "/research/grain-direction-rotation-sheet-count-impact/", "2 rotation modes"],
  ["Project kerf sensitivity matrix", `${projectRows.length} projects tested across ${matrixKerfs.length} kerf settings and two orientation modes, with a row for every scenario.`, "/research/project-kerf-sensitivity-matrix/", `${projectKerfRows.length} runs`],
  ["Plywood sheet format comparison", `${projectRows.length} project inputs compared on 5×5, 4×8, 4×10, and 5×10 panels, including parts that do not fit a format.`, "/research/plywood-sheet-size-comparison/", `${sheetFormatRows.length} runs`],
  ["Edge trim allowance impact", `${projectRows.length} project inputs tested with five per-edge trim margins and two orientation modes on nominal 4×8 sheets.`, "/research/edge-trim-allowance-impact/", `${trimRows.length} runs`],
  ["Plywood layout robustness matrix", `${projectRows.length} projects tested across kerf, edge-trim, and orientation combinations to detect fragile layouts and incomplete scenarios when they occur.`, "/research/plywood-layout-robustness-matrix/", `${robustnessRows.length.toLocaleString()} runs`]
];
const hubCards = hubDatasets.map(([title, copy, href, label]) => `<a class="research-card" href="${href}"><span>${label}</span><h2>${title}</h2><p>${copy}</p><strong>Read the report →</strong></a>`).join("");

const hubHtml = page({
  route: "/research/",
  title: "Woodworking Research and Open Datasets | WoodCutTool",
  description: hubDescription,
  eyebrow: "WoodCutTool Research",
  h1: "Woodworking Research and Open Datasets",
  lead: "Use reproducible benchmark data to understand plywood sheet yield before buying material. Every report publishes its inputs, assumptions, limitations, and downloadable CSV rather than presenting an unexplained headline number.",
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "WoodCutTool Research and Open Datasets",
      description: hubDescription,
      url: `${siteUrl}/research/`,
      mainEntity: {
        "@type": "DataCatalog",
        name: "WoodCutTool Research and Open Datasets",
        url: `${siteUrl}/research/`
      },
      hasPart: {
        "@type": "ItemList",
        numberOfItems: hubDatasets.length,
        itemListElement: hubDatasets.map(([name, , route], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          url: `${siteUrl}${route}`
        }))
      }
    },
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"]])
  ],
  content: `
      <section class="research-card-grid" aria-label="Available research reports">${hubCards}</section>
      <section><h2>What makes these datasets useful</h2><p>The reports answer narrow planning questions with explicit inputs. Project dimensions come from WoodCutTool’s public template library, and every layout uses the same deterministic MaxRects-style heuristic while one declared variable changes. The raw CSV files make it possible to inspect individual rows, reproduce summaries, or compare the estimates with another optimizer.</p></section>
      <section><h2>Provenance and production</h2><p>These datasets are computed from WoodCutTool’s own planning examples; they are not scraped product specifications, copyrighted plans, customer files, or claims about market-wide outcomes. The generator, method version, input template URL, and limitations remain visible so automated production does not hide how a result was made.</p></section>
      <section><h2>What the results do not prove</h2><p>These are planning benchmarks, not guaranteed purchase quantities or proof of a globally optimal layout. Real sheets can have damaged edges, voids, bow, trim loss, and defects. Joinery, hardware, test cuts, replacement pieces, face quality, and cut sequence can also increase material needs. Measure the stock and blade, validate every project dimension, and review the actual layout before purchasing or cutting.</p></section>
      <section class="research-note"><h2>Reuse and attribution</h2><p>The downloadable datasets are licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. You may share and adapt them with attribution to WoodCutTool, a link to the source report, and an indication of changes.</p></section>`
});

const projectTableRows = projectRows.map((row) => `<tr>
  <th scope="row"><a href="${row.templatePath}">${esc(row.name)}</a></th>
  <td>${esc(row.category)}</td><td>${row.partCount}</td><td>${row.theoreticalSheets}</td>
  <td>${row.allowedSheets}</td><td>${pct(row.allowedYield)}</td><td>${row.lockedSheets}</td>
</tr>`).join("");

const projectDescription = `Benchmark data for ${projectRows.length} plywood project parts lists, comparing area-only minimum sheets with heuristic layouts and grain-direction constraints.`;
const projectHtml = page({
  route: "/research/plywood-project-yield-benchmarks/",
  title: `Plywood Yield Benchmark: ${projectRows.length} Projects | WoodCutTool`,
  description: projectDescription,
  eyebrow: "Open dataset · Plywood planning",
  h1: "Plywood Project Yield Benchmarks",
  lead: `We tested ${projectRows.length} common project parts lists on 96 × 48 inch sheets with a 1/8 inch kerf. The results show why area alone cannot reliably predict sheet count and where rotation constraints change the estimate.`,
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Project Yield Benchmarks",
      description: projectDescription,
      route: "/research/plywood-project-yield-benchmarks/",
      csvPath: projectCsvPath,
      datePublished: "2026-07-16",
      variables: ["project category", "part count", "part area", "area-only minimum sheet count", "rotation-allowed sheet count", "grain-locked sheet count", "material yield"]
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Plywood yield benchmarks", "/research/plywood-project-yield-benchmarks/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects tested", String(projectRows.length), "Five project categories")}
        ${metric("Heuristic sheets", String(totalAllowedSheets), "Rotation allowed")}
        ${metric("Mean material yield", pct(avgAllowedYield), "Unweighted project mean")}
        ${metric("Rotation-sensitive", String(affectedByRotation.length), "Projects using more sheets when locked")}
      </section>
      <section class="research-note"><h2>Download the data</h2><p><a class="button" href="${projectCsvPath}" download>Download project benchmark CSV</a></p><p>The CSV contains one row per project, the benchmark version and method, source template, part area, theoretical area minimum, heuristic sheet counts, yield percentages, and rejected-piece count.</p></section>
      <section><h2>Results for ${projectRows.length} common plywood projects</h2><p>The area-only minimum is a lower bound: it divides total part area by 4,608 square inches and rounds up. It does not account for part shape, kerf, or orientation. “Rotation allowed” lets the heuristic turn rectangles 90 degrees. “Grain locked” keeps the entered orientation.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th><th>Category</th><th>Parts</th><th>Area min.</th><th>Rotate</th><th>Yield</th><th>Locked</th></tr></thead><tbody>${projectTableRows}</tbody></table></div>
      </section>
      <section><h2>Findings</h2><p>Across these inputs, the rotation-allowed heuristic used ${totalAllowedSheets} sheets and produced an average project-level yield of ${pct(avgAllowedYield)}. ${affectedByRotation.length} of ${projectRows.length} projects—${affectedByRotation.map((row) => esc(row.name)).join(", ")}—required an additional sheet when rotation was locked. That does not mean those parts should be rotated: visible faces may require a consistent grain direction.</p><p>The widest gap between the area-only lower bound and the heuristic estimate comes from geometry. Large rectangles can leave substantial total area unused even when no remaining part fits its shape. Sheet count should therefore be checked with a real layout, not estimated from square footage alone.</p></section>
      <section><h2>Method</h2><ol><li>Expand each named parts list into individual rectangles.</li><li>Sort pieces by area, then by longest and shortest side.</li><li>Place each rectangle with a deterministic MaxRects-style free-rectangle heuristic.</li><li>Reserve a 1/8 inch kerf between adjacent cuts where space remains.</li><li>Repeat once with 90-degree rotation allowed and once with orientation locked.</li></ol><p>Every tested part fit within a standard sheet; the dataset records zero rejected pieces. Source dimensions are planning examples based on the linked templates, not construction drawings.</p></section>
      <section><h2>Limitations and safe use</h2><p>The algorithm is a heuristic and does not prove a global optimum. Results exclude trim loss, defects, face selection, joinery, hardware, test cuts, replacement parts, and stock variation. Theoretical one-sheet patterns may also be impractical if a real cutting sequence cannot preserve the modeled rectangles. Use the <a href="/plywood-cut-calculator/">plywood cut calculator</a> with your actual dimensions, then inspect the layout before buying material.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Plywood Project Yield Benchmarks, ${benchmarkVersion}.”</p></section>`
});

const kerfTableRows = kerfPatterns.map((pattern) => {
  const rows = kerfs.map((kerf) => projectResult(pattern, kerf));
  return `<tr><th scope="row">${esc(pattern.name)}</th><td>${rows[0].partCount}</td>${rows.map((row) => `<td>${row.allowedSheets}</td>`).join("")}</tr>`;
}).join("");

const kerfDescription = "A reproducible benchmark of ten plywood cutting patterns at four saw-kerf settings, showing when a small blade width changes total sheet count.";
const kerfHtml = page({
  route: "/research/saw-kerf-sheet-count-impact/",
  title: "Saw Kerf Impact on Plywood Sheet Count | WoodCutTool",
  description: kerfDescription,
  eyebrow: "Open dataset · Saw kerf",
  h1: "How Saw Kerf Changes Plywood Sheet Count",
  lead: "A blade removes material on every cut. We compared ten repeated-part patterns at zero, 1/16, 3/32, and 1/8 inch kerf to show when an exact-fit digital plan stops fitting on a real sheet.",
  schemas: [
    datasetSchema({
      name: "WoodCutTool Saw Kerf and Plywood Sheet Count Benchmark",
      description: kerfDescription,
      route: "/research/saw-kerf-sheet-count-impact/",
      csvPath: kerfCsvPath,
      datePublished: "2026-07-16",
      variables: ["part pattern", "part count", "part area", "saw kerf in inches", "estimated sheet count", "material yield"]
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Saw kerf impact", "/research/saw-kerf-sheet-count-impact/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Patterns tested", "10", "Repeated rectangular parts")}
        ${metric("Kerf settings", "4", "0 to 1/8 inch")}
        ${metric("Benchmark runs", "40", "Same heuristic and sheet size")}
        ${metric("Sheet-count changes", String(kerfAffectedPatterns.length), "Zero vs 1/8 inch")}
      </section>
      <section class="research-note"><h2>Download the data</h2><p><a class="button" href="${kerfCsvPath}" download>Download saw kerf benchmark CSV</a></p><p>Each row records the pattern, part count and area, kerf setting, estimated sheet count, yield, source page, version, and method.</p></section>
      <section><h2>Sheet count at four kerf settings</h2><p>Zero kerf is included only as a counterfactual baseline. A saw blade has nonzero width, so do not use the zero column as a cutting plan. Measure a test cut with the actual blade and machine.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Repeated-part pattern</th><th>Parts</th><th>0 in</th><th>1/16 in</th><th>3/32 in</th><th>1/8 in</th></tr></thead><tbody>${kerfTableRows}</tbody></table></div>
      </section>
      <section><h2>The exact-fit effect</h2><p>${kerfAffectedPatterns.length} of the ten patterns changed sheet count between the zero-kerf baseline and a 1/8 inch kerf. The most sensitive patterns divide a 48 × 96 inch sheet exactly: eight 12 × 48 shelves, eight 24 × 24 panels, four 48 × 24 panels, and twelve 32 × 16 shelves. Once blade width is reserved between adjacent pieces, the exact grid no longer fits.</p><p>This does not imply that kerf always adds a sheet. Six patterns had enough geometric slack to keep the same estimated count across the tested settings. Sensitivity depends on the full layout, not only the number of cuts.</p></section>
      <section><h2>Method and interpretation</h2><p>All patterns use a 96 × 48 inch sheet, allow 90-degree rotation, and run through the same deterministic packing heuristic. Only the kerf value changes. Yield is part area divided by the total area of the estimated sheets, so it excludes the physical area of defects and trim.</p><p>Kerf is not simply “number of parts multiplied by blade width.” A shared cut, cutting sequence, edge trim, rough breakdown, and machine setup affect how material is consumed. The benchmark isolates spacing in a rectangle layout; it is not a shop-ready cut sequence.</p></section>
      <section><h2>Practical planning rule</h2><p>Enter the measured kerf before trusting a tight layout. If parts exactly divide the nominal sheet width or length, leave room for blade loss and damaged-edge trimming. Review <a href="/learn/saw-kerf-explained/">saw kerf explained</a>, then test your own list in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Saw Kerf and Sheet Count Benchmark, ${benchmarkVersion}.”</p></section>`
});

const rotationTableRows = projectRows.map((row) => {
  const delta = row.lockedSheets - row.allowedSheets;
  return `<tr><th scope="row"><a href="${row.templatePath}">${esc(row.name)}</a></th><td>${row.allowedSheets}</td><td>${row.lockedSheets}</td><td>${delta ? `+${delta}` : "0"}</td><td>${delta ? "Sensitive" : "No change"}</td></tr>`;
}).join("");

const rotationDescription = `Comparison of plywood sheet estimates with panel rotation allowed versus grain direction locked across ${projectRows.length} woodworking projects.`;
const rotationHtml = page({
  route: "/research/grain-direction-rotation-sheet-count-impact/",
  title: "Grain Direction and Plywood Sheet Yield | WoodCutTool",
  description: rotationDescription,
  eyebrow: "Benchmark report · Grain direction",
  h1: "Grain Direction, Panel Rotation, and Plywood Yield",
  lead: `Rotating rectangles can improve a digital layout, but visible plywood faces often need consistent grain direction. This comparison shows how frequently locking orientation changed the estimated sheet count in ${projectRows.length} project parts lists.`,
  schemas: [
    datasetSchema({
      name: "WoodCutTool Grain Direction and Panel Rotation Benchmark",
      description: rotationDescription,
      route: "/research/grain-direction-rotation-sheet-count-impact/",
      csvPath: projectCsvPath,
      datePublished: "2026-07-16",
      variables: ["project", "rotation-allowed sheet count", "grain-locked sheet count", "rotation-allowed yield", "grain-locked yield"]
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Grain direction and rotation", "/research/grain-direction-rotation-sheet-count-impact/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Benchmark summary">
        ${metric("Projects tested", String(projectRows.length), "Same source parts lists")}
        ${metric("Rotation-sensitive", String(affectedByRotation.length), `${num(affectedByRotation.length / projectRows.length * 100)}% of tested projects`)}
        ${metric("Rotate-mode sheets", String(totalAllowedSheets), "Across all test inputs")}
        ${metric("Locked-mode sheets", String(totalLockedSheets), `+${totalLockedSheets - totalAllowedSheets} across test inputs`)}
      </section>
      <section class="research-note"><h2>Download the underlying data</h2><p><a class="button" href="${projectCsvPath}" download>Download project benchmark CSV</a></p><p>The shared project dataset includes both rotation modes, yield percentages, source templates, inputs, version, and method.</p></section>
      <section><h2>Rotation allowed versus orientation locked</h2><p>“Allowed” means any rectangle may turn 90 degrees. “Locked” means every piece retains the entered long-side and short-side orientation. A zero delta does not prove the placements are identical; it only means both modes used the same number of sheets.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th><th>Rotate</th><th>Locked</th><th>Difference</th><th>Result</th></tr></thead><tbody>${rotationTableRows}</tbody></table></div>
      </section>
      <section><h2>What changed</h2><p>${affectedByRotation.map((row) => esc(row.name)).join(", ")} used one additional sheet with orientation locked. Across all ${projectRows.length} test inputs, the heuristic estimated ${totalAllowedSheets} sheets when rotation was allowed and ${totalLockedSheets} when it was locked. The difference is specific to these dimensions and this heuristic; another parts list or packing method can produce a different result.</p></section>
      <section><h2>When grain direction should win</h2><p>Do not rotate a visible cabinet side, door, drawer front, tabletop, or matched panel solely to improve a yield number. Face veneer direction affects appearance, and panel orientation can matter to the project specification. Mark visible faces and required direction in the cut list before optimizing. Hidden backs, jigs, or paint-grade internal parts may allow more flexibility, but that is a design decision—not an automatic optimizer setting.</p></section>
      <section><h2>Method and limitations</h2><p>Both modes use 96 × 48 inch sheets, a 1/8 inch kerf, identical sorted rectangles, and the same deterministic MaxRects-style heuristic. The test does not model veneer matching, structural panel ratings, face defects, trim, joinery, cut order, or replacement parts. It estimates rectangular nesting and is not proof of a globally optimal or code-compliant layout.</p><p>For project-specific planning, read <a href="/learn/grain-direction-in-plywood-layouts/">grain direction in plywood layouts</a> and test the final orientation rules in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Grain Direction and Panel Rotation Benchmark, ${benchmarkVersion}.”</p></section>`
});

const kerfLabels = new Map([
  [0, "0"],
  [0.03125, "1/32"],
  [0.0625, "1/16"],
  [0.09375, "3/32"],
  [0.125, "1/8"],
  [0.1875, "3/16"],
  [0.25, "1/4"]
]);
const projectKerfImpact = projectBenchmarks.filter((project) => {
  const zero = scenarioResult(project, { kerf: 0, allowRotate: true });
  const quarter = scenarioResult(project, { kerf: 0.25, allowRotate: true });
  return zero.sheets !== quarter.sheets;
});
const projectKerfTableRows = projectBenchmarks.map((project) => {
  const rows = matrixKerfs.map((kerf) => scenarioResult(project, { kerf, allowRotate: true }));
  return `<tr><th scope="row"><a href="${project.templatePath}">${esc(project.name)}</a></th>${rows.map((row) => `<td>${row.sheets}</td>`).join("")}</tr>`;
}).join("");
const projectKerfDescription = `A ${projectKerfRows.length}-run matrix testing ${projectRows.length} plywood project parts lists across seven kerf settings and two orientation modes.`;
const projectKerfHtml = page({
  route: "/research/project-kerf-sensitivity-matrix/",
  title: "Plywood Project Kerf Sensitivity Matrix | WoodCutTool",
  description: projectKerfDescription,
  eyebrow: "Open dataset · Kerf sensitivity",
  h1: "Plywood Project Kerf Sensitivity Matrix",
  lead: `This matrix applies seven kerf assumptions and two orientation modes to ${projectRows.length} project parts lists. It shows which complete projects keep the same sheet estimate and which cross a layout threshold as spacing grows.`,
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Project Kerf Sensitivity Matrix",
      description: projectKerfDescription,
      route: "/research/project-kerf-sensitivity-matrix/",
      csvPath: projectKerfCsvPath,
      variables: ["project", "saw kerf in inches", "orientation mode", "estimated sheet count", "material yield", "material waste", "rejected piece count"],
      measurementTechnique: "Deterministic MaxRects-style rectangle-packing heuristic on 96 by 48 inch sheets while varying kerf and orientation mode"
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Project kerf sensitivity", "/research/project-kerf-sensitivity-matrix/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects", String(projectRows.length), "Public planning examples")}
        ${metric("Kerf settings", String(matrixKerfs.length), "0 to 1/4 inch")}
        ${metric("Orientation modes", "2", "Rotation allowed and locked")}
        ${metric("Benchmark runs", String(projectKerfRows.length), "One CSV row per scenario")}
      </section>
      <section class="research-note"><h2>Download the full matrix</h2><p><a class="button" href="${projectKerfCsvPath}" download>Download project kerf matrix CSV</a></p><p>Each row includes the input project, kerf, orientation mode, sheet estimate, yield, waste, rejected-piece count, version, method, and source template URL.</p></section>
      <section><h2>Rotation-allowed sheet count by kerf</h2><p>The visible table keeps orientation constant so the kerf comparison remains readable. The downloadable dataset also includes every orientation-locked run.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th>${matrixKerfs.map((kerf) => `<th>${kerfLabels.get(kerf)} in</th>`).join("")}</tr></thead><tbody>${projectKerfTableRows}</tbody></table></div>
      </section>
      <section><h2>What the matrix shows</h2><p>${projectKerfImpact.length} of ${projectRows.length} projects changed estimated sheet count between the zero-kerf counterfactual and a 1/4 inch spacing assumption with rotation allowed. The other projects retained the same count, although their available free rectangles and cutting options still changed.</p><p>A sheet-count change is a threshold result, not a universal blade recommendation. Actual kerf depends on the blade, tooth geometry, runout, machine, material, and measurement method.</p></section>
      <section><h2>Method and safe use</h2><ol><li>Use the same named parts list in every run.</li><li>Hold the nominal sheet at 96 × 48 inches.</li><li>Run seven declared spacing values from 0 to 1/4 inch.</li><li>Repeat with rotation allowed and orientation locked.</li></ol><p>Zero kerf is a mathematical baseline and cannot represent a real saw cut. The heuristic does not model a shop cutting sequence, shared cuts, edge trim, defects, grain matching, joinery, or replacement parts, and it does not prove a global optimum. Measure the actual blade with a test cut before using the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Plywood Project Kerf Sensitivity Matrix, ${benchmarkVersion}.”</p></section>`
});

const sheetFormatSummary = sheetFormats.map((format) => {
  const rows = sheetFormatRows.filter((row) => row.formatSlug === format.slug && row.allowRotate);
  const complete = rows.filter((row) => row.rejected === 0);
  return {
    ...format,
    completeProjects: complete.length,
    rejectedPieces: rows.reduce((sum, row) => sum + row.rejected, 0),
    totalSheets: complete.reduce((sum, row) => sum + row.sheets, 0),
    averageYield: complete.length ? average(complete.map((row) => row.yield)) : 0
  };
});
const fiveByFiveFailures = sheetFormatRows
  .filter((row) => row.formatSlug === "5x5" && row.allowRotate && row.rejected > 0)
  .map((row) => row.name);
const sheetFormatTableRows = sheetFormatSummary.map((row) => `<tr><th scope="row">${row.label}</th><td>${row.length} × ${row.width}</td><td>${row.completeProjects}/${projectRows.length}</td><td>${row.rejectedPieces}</td><td>${row.totalSheets}</td><td>${pct(row.averageYield)}</td></tr>`).join("");
const sheetFormatDescription = `A ${sheetFormatRows.length}-run comparison of ${projectRows.length} project parts lists on four nominal plywood sheet formats and two orientation modes.`;
const sheetFormatHtml = page({
  route: "/research/plywood-sheet-size-comparison/",
  title: "Plywood Sheet Size Comparison Dataset | WoodCutTool",
  description: sheetFormatDescription,
  eyebrow: "Open dataset · Sheet formats",
  h1: "Plywood Sheet Size Comparison",
  lead: "Nominal panel area alone does not determine whether a project fits. This benchmark compares four foot-named sheet formats modeled in inches while recording every overlength or overwidth rejection.",
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Sheet Format Comparison",
      description: sheetFormatDescription,
      route: "/research/plywood-sheet-size-comparison/",
      csvPath: sheetFormatCsvPath,
      variables: ["project", "sheet format", "sheet length", "sheet width", "orientation mode", "estimated sheet count", "material yield", "rejected piece count", "complete layout"],
      measurementTechnique: "Deterministic MaxRects-style rectangle-packing heuristic while varying nominal sheet length, sheet width, and orientation mode"
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Plywood sheet size comparison", "/research/plywood-sheet-size-comparison/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects", String(projectRows.length), "Same parts in every format")}
        ${metric("Sheet formats", String(sheetFormats.length), "5×5 through 5×10")}
        ${metric("Orientation modes", "2", "Rotation allowed and locked")}
        ${metric("Benchmark runs", String(sheetFormatRows.length), "Includes incomplete layouts")}
      </section>
      <section class="research-note"><h2>Download the full comparison</h2><p><a class="button" href="${sheetFormatCsvPath}" download>Download sheet format comparison CSV</a></p><p>The CSV explicitly records rejected pieces and a complete-layout flag. Do not interpret a low sheet count as a valid result when <code>complete_layout</code> is false.</p></section>
      <section><h2>Rotation-allowed format summary</h2><p>Totals include only complete project layouts. Availability varies by product, species, grade, thickness, supplier, and region; these nominal dimensions are comparison scenarios, not a claim that a format is sold for every material.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Format</th><th>Modeled size (in)</th><th>Complete projects</th><th>Rejected parts</th><th>Sheets for complete projects</th><th>Mean yield</th></tr></thead><tbody>${sheetFormatTableRows}</tbody></table></div>
      </section>
      <section><h2>Why the 5 × 5 result needs a fit check</h2><p>${fiveByFiveFailures.length} project inputs contain at least one part that does not fit a 60 × 60 inch panel even when rotation is allowed: ${fiveByFiveFailures.map(esc).join(", ")}. Those rows remain in the dataset with rejected-piece counts so a partial packing result cannot masquerade as a successful layout.</p></section>
      <section><h2>Method and limitations</h2><p>Every scenario uses the same source parts, 1/8 inch kerf, deterministic packing order, and declared orientation mode. It changes only nominal panel dimensions. The comparison does not model price, local stock, transport, panel grade, face quality, structural rating, defects, trim, cutting sequence, or whether a larger sheet can be handled safely.</p><p>Verify the supplier’s actual panel dimensions and your machine, workspace, lifting, and transport limits. Then enter the real stock size in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>; do not choose a panel from this benchmark alone.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Plywood Sheet Format Comparison, ${benchmarkVersion}.”</p></section>`
});

const trimSummary = trimMargins.map((trimMargin) => {
  const rows = trimRows.filter((row) => row.trimMargin === trimMargin && row.allowRotate);
  return {
    trimMargin,
    totalSheets: rows.reduce((sum, row) => sum + row.sheets, 0),
    averageYield: average(rows.map((row) => row.yield)),
    rejectedPieces: rows.reduce((sum, row) => sum + row.rejected, 0)
  };
});
const trimBaseline = new Map(trimRows.filter((row) => row.trimMargin === 0 && row.allowRotate).map((row) => [row.slug, row.sheets]));
const oneInchTrimAffected = trimRows.filter((row) => row.trimMargin === 1 && row.allowRotate && row.sheets > trimBaseline.get(row.slug));
const trimTableRows = trimSummary.map((row) => `<tr><th scope="row">${row.trimMargin} in</th><td>${standardSheet.length - (row.trimMargin * 2)} × ${standardSheet.width - (row.trimMargin * 2)}</td><td>${row.totalSheets}</td><td>${pct(row.averageYield)}</td><td>${row.rejectedPieces}</td></tr>`).join("");
const trimDescription = `A ${trimRows.length}-run matrix measuring how five per-edge trim allowances affect ${projectRows.length} plywood project layouts in two orientation modes.`;
const trimHtml = page({
  route: "/research/edge-trim-allowance-impact/",
  title: "Plywood Edge Trim Allowance Impact Dataset | WoodCutTool",
  description: trimDescription,
  eyebrow: "Open dataset · Edge allowance",
  h1: "How Edge Trim Allowance Changes Plywood Yield",
  lead: "Nominal sheet dimensions are not always fully usable. This benchmark reserves the same margin on all four edges of a 96 × 48 inch panel and measures when that smaller usable rectangle changes a project estimate.",
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Edge Trim Allowance Impact Matrix",
      description: trimDescription,
      route: "/research/edge-trim-allowance-impact/",
      csvPath: trimCsvPath,
      variables: ["project", "trim margin on each edge", "nominal sheet dimensions", "usable sheet dimensions", "orientation mode", "estimated sheet count", "usable-area yield", "rejected piece count"],
      measurementTechnique: "Deterministic MaxRects-style rectangle-packing heuristic on nominal 96 by 48 inch sheets while reducing every edge by a declared trim margin"
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Edge trim allowance impact", "/research/edge-trim-allowance-impact/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects", String(projectRows.length), "Same named parts lists")}
        ${metric("Trim margins", String(trimMargins.length), "0 to 1 inch per edge")}
        ${metric("Orientation modes", "2", "Rotation allowed and locked")}
        ${metric("Benchmark runs", String(trimRows.length), "One CSV row per scenario")}
      </section>
      <section class="research-note"><h2>Download the full matrix</h2><p><a class="button" href="${trimCsvPath}" download>Download edge trim impact CSV</a></p><p>Each row records nominal and usable dimensions separately, preventing the margin from being confused with saw kerf or material waste.</p></section>
      <section><h2>Rotation-allowed summary</h2><p>“Yield” here uses the modeled usable rectangle, not the full nominal panel area. The zero-margin row is a comparison baseline, not a recommendation to cut from an unchecked factory edge.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Margin on each edge</th><th>Usable area (in)</th><th>Total sheets</th><th>Mean usable-area yield</th><th>Rejected parts</th></tr></thead><tbody>${trimTableRows}</tbody></table></div>
      </section>
      <section><h2>Where a larger trim margin crossed a threshold</h2><p>At a one-inch margin on every edge, ${oneInchTrimAffected.length} of ${projectRows.length} rotation-allowed project inputs used more sheets than the zero-margin baseline${oneInchTrimAffected.length ? `: ${oneInchTrimAffected.map((row) => esc(row.name)).join(", ")}` : ""}. Other projects kept the same count but still had less placement flexibility.</p></section>
      <section><h2>Method and safe use</h2><p>The generator subtracts twice the declared margin from both nominal dimensions, then applies a 1/8 inch kerf and the same placement heuristic. It does not inspect a real panel or decide which edges need trimming. Bow, edge damage, factory squareness, veneer defects, joinery, cutting sequence, and replacement pieces are outside the model.</p><p>Inspect and measure each panel before planning. Reserve only the edge loss your material and workflow require, and preserve an additional project contingency when a failed part would be costly. Test final dimensions in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Plywood Edge Trim Allowance Impact Matrix, ${benchmarkVersion}.”</p></section>`
});

const robustnessAllowedRows = robustnessRows.filter((row) => row.allowRotate);
const robustnessCompleteRows = robustnessRows.filter((row) => row.rejected === 0);
const robustnessBaseline = new Map(robustnessAllowedRows
  .filter((row) => row.trimMargin === 0 && row.kerf === 0.125)
  .map((row) => [row.slug, row]));
const robustnessAffectedProjects = projectBenchmarks.filter((project) => {
  const baseline = robustnessBaseline.get(project.slug);
  return robustnessAllowedRows.some((row) => row.slug === project.slug && row.rejected === 0 && row.sheets > baseline.sheets);
});
const robustnessIncompleteProjects = projectBenchmarks.filter((project) =>
  robustnessAllowedRows.some((row) => row.slug === project.slug && row.rejected > 0)
);
const robustnessStableProjects = projectBenchmarks.filter((project) => {
  const baseline = robustnessBaseline.get(project.slug);
  const rows = robustnessAllowedRows.filter((row) => row.slug === project.slug);
  return rows.every((row) => row.rejected === 0 && row.sheets === baseline.sheets);
});
const robustnessMaxExtraSheets = Math.max(...robustnessAllowedRows.map((row) => {
  const baseline = robustnessBaseline.get(row.slug);
  return row.rejected === 0 ? row.sheets - baseline.sheets : 0;
}));
const robustnessScenario = (slug, trimMargin, kerf) => robustnessAllowedRows.find((row) =>
  row.slug === slug && row.trimMargin === trimMargin && row.kerf === kerf
);
const robustnessCell = (row) => row.rejected
  ? `Incomplete (${row.rejected} rejected)`
  : `${row.sheets} ${row.sheets === 1 ? "sheet" : "sheets"}`;
const robustnessTableRows = projectBenchmarks.map((project) => {
  const baseline = robustnessScenario(project.slug, 0, 0.125);
  const quarterTrim = robustnessScenario(project.slug, 0.25, 0.125);
  const halfTrim = robustnessScenario(project.slug, 0.5, 0.125);
  const extreme = robustnessScenario(project.slug, 1, 0.25);
  const changed = [quarterTrim, halfTrim, extreme].some((row) => row.rejected > 0 || row.sheets > baseline.sheets);
  return `<tr><th scope="row"><a href="${project.templatePath}">${esc(project.name)}</a></th><td>${robustnessCell(baseline)}</td><td>${robustnessCell(quarterTrim)}</td><td>${robustnessCell(halfTrim)}</td><td>${robustnessCell(extreme)}</td><td>${changed ? "Sensitive" : "Stable in selected cases"}</td></tr>`;
}).join("");
const robustnessDescription = `A ${robustnessRows.length.toLocaleString()}-run matrix testing ${projectRows.length} plywood projects across seven kerfs, five edge-trim margins, and two orientation modes.`;
const robustnessHtml = page({
  route: "/research/plywood-layout-robustness-matrix/",
  title: "Plywood Cut Layout Robustness Matrix | WoodCutTool",
  description: robustnessDescription,
  eyebrow: "Open dataset · Layout risk",
  h1: "Plywood Cut Layout Robustness Matrix",
  lead: `A cut layout can look efficient under one optimistic input and fail when real edge loss, blade width, or grain rules are applied. This ${robustnessRows.length.toLocaleString()}-scenario matrix tests those constraints together so fragile plans are visible before material is purchased.`,
  published: robustnessVersion,
  version: robustnessVersion,
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Cut Layout Robustness Matrix",
      description: robustnessDescription,
      route: "/research/plywood-layout-robustness-matrix/",
      csvPath: robustnessCsvPath,
      datePublished: robustnessVersion,
      version: robustnessVersion,
      variables: ["project", "trim margin on each edge", "saw kerf", "orientation mode", "usable sheet dimensions", "estimated sheet count", "material yield", "rejected piece count", "complete layout"],
      measurementTechnique: "Deterministic MaxRects-style rectangle-packing heuristic while jointly varying edge trim, saw kerf, and orientation mode"
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Plywood layout robustness", "/research/plywood-layout-robustness-matrix/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects", String(projectRows.length), "Source-linked parts lists")}
        ${metric("Scenario rows", robustnessRows.length.toLocaleString(), "7 kerfs × 5 trims × 2 modes")}
        ${metric("Complete layouts", robustnessCompleteRows.length.toLocaleString(), `${num(robustnessCompleteRows.length / robustnessRows.length * 100)}% of all runs`)}
        ${metric("Stable projects", String(robustnessStableProjects.length), "No change across rotation-allowed range")}
      </section>
      <section class="research-note"><h2>Download the full robustness matrix</h2><p><a class="button" href="${robustnessCsvPath}" download>Download robustness CSV</a></p><p>Every row declares the project, usable dimensions, trim margin, kerf, orientation mode, estimated sheet count, yield, rejected pieces, completion flag, version, method, and source template URL.</p></section>
      <section><h2>Why combined constraints matter</h2><p>Kerf and edge trim both reduce placement freedom, but they do so differently. Edge trim shrinks the outside rectangle before any part is placed. Kerf reserves space between placements. Orientation rules remove otherwise valid 90-degree rotations. Studying each variable separately is useful for explanation; studying them together reveals layouts that are only feasible when every assumption is optimistic.</p><p>The matrix is a sensitivity test, not a prediction of how every shop will perform. A stable sheet count means the heuristic retained the same number of panels across the declared range. It does not mean the placements, offcut shapes, or cutting sequence stayed unchanged.</p></section>
      <section><h2>Selected rotation-allowed scenarios</h2><p>The baseline uses a 1/8 inch kerf with no modeled edge trim. The next columns keep that kerf while reserving 1/4 and 1/2 inch on every edge. The final stress case combines a 1-inch edge margin with a 1/4 inch spacing assumption. “Incomplete” means at least one required part did not fit the usable rectangle and the reported sheet count must not be treated as a valid purchase estimate.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th><th>Baseline</th><th>1/4 in trim</th><th>1/2 in trim</th><th>Stress case</th><th>Selected-case result</th></tr></thead><tbody>${robustnessTableRows}</tbody></table></div>
      </section>
      <section><h2>What changed across the matrix</h2><p>${robustnessAffectedProjects.length} of ${projectRows.length} projects produced at least one complete rotation-allowed scenario that used more sheets than its baseline. ${robustnessIncompleteProjects.length} projects produced at least one incomplete rotation-allowed scenario because the usable rectangle became smaller than a required part. The largest complete-layout increase was ${robustnessMaxExtraSheets} ${robustnessMaxExtraSheets === 1 ? "sheet" : "sheets"} above baseline.</p><p>These are threshold events. A project can lose placement flexibility in many rows before sheet count changes, and a rejected long or wide part is categorically different from needing an additional sheet. The CSV keeps <code>complete_layout</code> and <code>rejected_piece_count</code> visible so those outcomes cannot be confused.</p></section>
      <section><h2>How to use the data for a real purchase</h2><ol><li>Measure the actual sheet and decide which edges need trimming.</li><li>Measure a test cut from the installed blade and machine.</li><li>Lock orientation for visible or specified parts only.</li><li>Find the closest declared scenario, then rerun your own dimensions in the calculator.</li><li>Inspect every placement and decide whether the remaining offcuts can cover a replacement part.</li></ol><p>Use the <a href="/plywood-cut-calculator/">plywood cut calculator</a> for the current project and save the reviewed layout in <a href="/apps/cutlist/">CutList</a>. The matrix is most useful as a warning about fragile assumptions, not as a substitute for the final plan.</p></section>
      <section><h2>Method, provenance, and limits</h2><p>Each scenario starts from one of ${projectRows.length} WoodCutTool planning examples linked to a public template or guide. The generator expands quantities into rectangles, sorts them deterministically, and runs the same MaxRects-style heuristic. It varies only seven declared kerfs, five per-edge trim margins, and two orientation modes on a nominal 96 × 48 inch panel.</p><p>The model does not inspect real sheets, prove a global optimum, or simulate a shop-ready cut sequence. It excludes defects, bow, face matching, joinery, rough-cut cleanup, shared cuts, machine support, test pieces, replacement parts, price, and supplier availability. No row is a construction drawing or guaranteed purchase quantity.</p></section>
      <section><h2>Deep guides for interpreting the matrix</h2><p>Read <a href="/learn/saw-kerf-size-for-cut-list/">what saw kerf a cut list should use</a>, <a href="/learn/plywood-edge-trim-allowance-guide/">how to choose an edge-trim allowance</a>, and <a href="/learn/why-plywood-cut-layout-does-not-fit/">why a plywood layout does not fit</a>. Together they explain the three most common reasons a nominally efficient layout becomes fragile in the shop.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${robustnessVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Plywood Cut Layout Robustness Matrix, ${robustnessVersion}.”</p></section>`
});

const outputs = [
  ["research/index.html", hubHtml],
  ["research/plywood-project-yield-benchmarks/index.html", projectHtml],
  ["research/saw-kerf-sheet-count-impact/index.html", kerfHtml],
  ["research/grain-direction-rotation-sheet-count-impact/index.html", rotationHtml],
  ["research/project-kerf-sensitivity-matrix/index.html", projectKerfHtml],
  ["research/plywood-sheet-size-comparison/index.html", sheetFormatHtml],
  ["research/edge-trim-allowance-impact/index.html", trimHtml],
  ["research/plywood-layout-robustness-matrix/index.html", robustnessHtml],
  [projectCsvPath.slice(1), projectCsv],
  [kerfCsvPath.slice(1), kerfCsv],
  [projectKerfCsvPath.slice(1), projectKerfCsv],
  [sheetFormatCsvPath.slice(1), sheetFormatCsv],
  [trimCsvPath.slice(1), trimCsv],
  [robustnessCsvPath.slice(1), robustnessCsv]
];

for (const [relativePath, contents] of outputs) {
  const target = resolve(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

console.log(`Generated ${outputs.length} research files (${projectRows.length} project rows, ${kerfRows.length} pattern rows, ${projectKerfRows.length + sheetFormatRows.length + trimRows.length + robustnessRows.length} scenario rows).`);
