import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkMethod,
  benchmarkVersion,
  kerfPatterns,
  projectBenchmarks,
  projectResult,
  standardSheet
} from "./plywood-benchmark-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const licenseUrl = "https://creativecommons.org/licenses/by/4.0/";
const kerfs = [0, 0.0625, 0.09375, 0.125];
const projectRows = projectBenchmarks.map((project) => projectResult(project));
const kerfRows = kerfPatterns.flatMap((pattern) => kerfs.map((kerf) => ({ ...projectResult(pattern, kerf), kerf })));

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

function datasetSchema({ name, description, route, csvPath, variables }) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${siteUrl}${route}`,
    sameAs: `${siteUrl}${route}`,
    creator: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    datePublished: benchmarkVersion,
    dateModified: benchmarkVersion,
    version: benchmarkVersion,
    license: licenseUrl,
    isAccessibleForFree: true,
    measurementTechnique: "Deterministic MaxRects-style rectangle-packing heuristic with 96 by 48 inch sheets",
    variableMeasured: variables,
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${siteUrl}${csvPath}`,
      encodingFormat: "text/csv"
    }
  };
}

function page({ route, title, description, eyebrow, h1, lead, schemas, content }) {
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
      <p class="article-byline">Published ${benchmarkVersion} by <a href="/about/">WoodCutTool Editorial Team</a> · Dataset version ${benchmarkVersion}</p>
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

const hubDescription = "Original woodworking datasets and transparent benchmark reports on plywood yield, saw kerf, sheet count, and grain-direction constraints.";
const hubCards = [
  ["Plywood project yield benchmarks", "24 common project parts lists tested on standard 4×8 sheets, with area-only minimums and heuristic sheet counts.", "/research/plywood-project-yield-benchmarks/", "24 projects"],
  ["Saw kerf and sheet-count impact", "Ten repeated-cut patterns compared at zero, 1/16, 3/32, and 1/8 inch kerf to expose exact-fit failures.", "/research/saw-kerf-sheet-count-impact/", "40 test runs"],
  ["Grain direction and panel rotation", "The same 24 projects tested with rotation allowed and locked, plus practical guidance for visible plywood faces.", "/research/grain-direction-rotation-sheet-count-impact/", "2 rotation modes"]
].map(([title, copy, href, label]) => `<a class="research-card" href="${href}"><span>${label}</span><h2>${title}</h2><p>${copy}</p><strong>Read the report →</strong></a>`).join("");

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
        "@type": "ItemList",
        numberOfItems: 3,
        itemListElement: [
          ["Plywood Project Yield Benchmarks", "/research/plywood-project-yield-benchmarks/"],
          ["Saw Kerf and Sheet Count Impact", "/research/saw-kerf-sheet-count-impact/"],
          ["Grain Direction and Plywood Sheet Yield", "/research/grain-direction-rotation-sheet-count-impact/"]
        ].map(([name, route], index) => ({ "@type": "ListItem", position: index + 1, name, url: `${siteUrl}${route}` }))
      }
    },
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"]])
  ],
  content: `
      <section class="research-card-grid" aria-label="Available research reports">${hubCards}</section>
      <section><h2>What makes these datasets useful</h2><p>The reports answer narrow planning questions with explicit inputs. Project dimensions come from WoodCutTool’s public template library, every sheet is modeled as 96 by 48 inches, and sheet layouts use the same deterministic MaxRects-style heuristic across each comparison. The raw CSV files make it possible to check individual rows, reproduce summaries, or compare the estimates with another optimizer.</p></section>
      <section><h2>What the results do not prove</h2><p>These are planning benchmarks, not guaranteed purchase quantities or proof of a globally optimal layout. Real sheets can have damaged edges, voids, bow, trim loss, and defects. Joinery, hardware, test cuts, replacement pieces, face quality, and cut sequence can also increase material needs. Measure the stock and blade, validate every project dimension, and review the actual layout before purchasing or cutting.</p></section>
      <section class="research-note"><h2>Reuse and attribution</h2><p>The downloadable datasets are licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. You may share and adapt them with attribution to WoodCutTool, a link to the source report, and an indication of changes.</p></section>`
});

const projectTableRows = projectRows.map((row) => `<tr>
  <th scope="row"><a href="${row.templatePath}">${esc(row.name)}</a></th>
  <td>${esc(row.category)}</td><td>${row.partCount}</td><td>${row.theoreticalSheets}</td>
  <td>${row.allowedSheets}</td><td>${pct(row.allowedYield)}</td><td>${row.lockedSheets}</td>
</tr>`).join("");

const projectDescription = "Benchmark data for 24 plywood project parts lists, comparing area-only minimum sheets with heuristic layouts and grain-direction constraints.";
const projectHtml = page({
  route: "/research/plywood-project-yield-benchmarks/",
  title: "Plywood Yield Benchmark: 24 Projects | WoodCutTool",
  description: projectDescription,
  eyebrow: "Open dataset · Plywood planning",
  h1: "Plywood Project Yield Benchmarks",
  lead: "We tested 24 common project parts lists on 96 × 48 inch sheets with a 1/8 inch kerf. The results show why area alone cannot reliably predict sheet count and where rotation constraints change the estimate.",
  schemas: [
    datasetSchema({
      name: "WoodCutTool Plywood Project Yield Benchmarks",
      description: projectDescription,
      route: "/research/plywood-project-yield-benchmarks/",
      csvPath: projectCsvPath,
      variables: ["project category", "part count", "part area", "area-only minimum sheet count", "rotation-allowed sheet count", "grain-locked sheet count", "material yield"]
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Plywood yield benchmarks", "/research/plywood-project-yield-benchmarks/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Dataset summary">
        ${metric("Projects tested", "24", "Five project categories")}
        ${metric("Heuristic sheets", String(totalAllowedSheets), "Rotation allowed")}
        ${metric("Mean material yield", pct(avgAllowedYield), "Unweighted project mean")}
        ${metric("Rotation-sensitive", String(affectedByRotation.length), "Projects using more sheets when locked")}
      </section>
      <section class="research-note"><h2>Download the data</h2><p><a class="button" href="${projectCsvPath}" download>Download project benchmark CSV</a></p><p>The CSV contains one row per project, the benchmark version and method, source template, part area, theoretical area minimum, heuristic sheet counts, yield percentages, and rejected-piece count.</p></section>
      <section><h2>Results for 24 common plywood projects</h2><p>The area-only minimum is a lower bound: it divides total part area by 4,608 square inches and rounds up. It does not account for part shape, kerf, or orientation. “Rotation allowed” lets the heuristic turn rectangles 90 degrees. “Grain locked” keeps the entered orientation.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th><th>Category</th><th>Parts</th><th>Area min.</th><th>Rotate</th><th>Yield</th><th>Locked</th></tr></thead><tbody>${projectTableRows}</tbody></table></div>
      </section>
      <section><h2>Findings</h2><p>Across these inputs, the rotation-allowed heuristic used ${totalAllowedSheets} sheets and produced an average project-level yield of ${pct(avgAllowedYield)}. ${affectedByRotation.length} of 24 projects—${affectedByRotation.map((row) => esc(row.name)).join(", ")}—required an additional sheet when rotation was locked. That does not mean those parts should be rotated: visible faces may require a consistent grain direction.</p><p>The widest gap between the area-only lower bound and the heuristic estimate comes from geometry. Large rectangles can leave substantial total area unused even when no remaining part fits its shape. Sheet count should therefore be checked with a real layout, not estimated from square footage alone.</p></section>
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

const rotationDescription = "Comparison of plywood sheet estimates with panel rotation allowed versus grain direction locked across 24 common woodworking projects.";
const rotationHtml = page({
  route: "/research/grain-direction-rotation-sheet-count-impact/",
  title: "Grain Direction and Plywood Sheet Yield | WoodCutTool",
  description: rotationDescription,
  eyebrow: "Benchmark report · Grain direction",
  h1: "Grain Direction, Panel Rotation, and Plywood Yield",
  lead: "Rotating rectangles can improve a digital layout, but visible plywood faces often need consistent grain direction. This comparison shows how frequently locking orientation changed the estimated sheet count in 24 project parts lists.",
  schemas: [
    datasetSchema({
      name: "WoodCutTool Grain Direction and Panel Rotation Benchmark",
      description: rotationDescription,
      route: "/research/grain-direction-rotation-sheet-count-impact/",
      csvPath: projectCsvPath,
      variables: ["project", "rotation-allowed sheet count", "grain-locked sheet count", "rotation-allowed yield", "grain-locked yield"]
    }),
    breadcrumbSchema([["Home", "/"], ["Research", "/research/"], ["Grain direction and rotation", "/research/grain-direction-rotation-sheet-count-impact/"]])
  ],
  content: `
      <section class="research-metrics" aria-label="Benchmark summary">
        ${metric("Projects tested", "24", "Same source parts lists")}
        ${metric("Rotation-sensitive", String(affectedByRotation.length), `${num(affectedByRotation.length / projectRows.length * 100)}% of tested projects`)}
        ${metric("Rotate-mode sheets", String(totalAllowedSheets), "Across all test inputs")}
        ${metric("Locked-mode sheets", String(totalLockedSheets), `+${totalLockedSheets - totalAllowedSheets} across test inputs`)}
      </section>
      <section class="research-note"><h2>Download the underlying data</h2><p><a class="button" href="${projectCsvPath}" download>Download project benchmark CSV</a></p><p>The shared project dataset includes both rotation modes, yield percentages, source templates, inputs, version, and method.</p></section>
      <section><h2>Rotation allowed versus orientation locked</h2><p>“Allowed” means any rectangle may turn 90 degrees. “Locked” means every piece retains the entered long-side and short-side orientation. A zero delta does not prove the placements are identical; it only means both modes used the same number of sheets.</p>
        <div class="research-table-wrap"><table class="research-table"><thead><tr><th>Project</th><th>Rotate</th><th>Locked</th><th>Difference</th><th>Result</th></tr></thead><tbody>${rotationTableRows}</tbody></table></div>
      </section>
      <section><h2>What changed</h2><p>${affectedByRotation.map((row) => esc(row.name)).join(", ")} used one additional sheet with orientation locked. Across all 24 test inputs, the heuristic estimated ${totalAllowedSheets} sheets when rotation was allowed and ${totalLockedSheets} when it was locked. The difference is specific to these dimensions and this heuristic; another parts list or packing method can produce a different result.</p></section>
      <section><h2>When grain direction should win</h2><p>Do not rotate a visible cabinet side, door, drawer front, tabletop, or matched panel solely to improve a yield number. Face veneer direction affects appearance, and panel orientation can matter to the project specification. Mark visible faces and required direction in the cut list before optimizing. Hidden backs, jigs, or paint-grade internal parts may allow more flexibility, but that is a design decision—not an automatic optimizer setting.</p></section>
      <section><h2>Method and limitations</h2><p>Both modes use 96 × 48 inch sheets, a 1/8 inch kerf, identical sorted rectangles, and the same deterministic MaxRects-style heuristic. The test does not model veneer matching, structural panel ratings, face defects, trim, joinery, cut order, or replacement parts. It estimates rectangular nesting and is not proof of a globally optimal or code-compliant layout.</p><p>For project-specific planning, read <a href="/learn/grain-direction-in-plywood-layouts/">grain direction in plywood layouts</a> and test the final orientation rules in the <a href="/plywood-cut-calculator/">plywood cut calculator</a>.</p></section>
      <section class="research-note"><h2>License and citation</h2><p>Dataset version ${benchmarkVersion}, method <code>${benchmarkMethod}</code>. Licensed under <a href="${licenseUrl}" rel="license">CC BY 4.0</a>. Suggested attribution: “WoodCutTool Grain Direction and Panel Rotation Benchmark, ${benchmarkVersion}.”</p></section>`
});

const outputs = [
  ["research/index.html", hubHtml],
  ["research/plywood-project-yield-benchmarks/index.html", projectHtml],
  ["research/saw-kerf-sheet-count-impact/index.html", kerfHtml],
  ["research/grain-direction-rotation-sheet-count-impact/index.html", rotationHtml],
  [projectCsvPath.slice(1), projectCsv],
  [kerfCsvPath.slice(1), kerfCsv]
];

for (const [relativePath, contents] of outputs) {
  const target = resolve(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

console.log(`Generated ${outputs.length} research files (${projectRows.length} project rows, ${kerfRows.length} kerf rows).`);
