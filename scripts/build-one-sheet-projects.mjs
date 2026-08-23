import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkMethod,
  benchmarkVersion,
  packSheets,
  projectBenchmarks,
  projectResult,
  standardSheet,
} from "./plywood-benchmark-data.mjs";
import { cutlistConversionCta } from "./conversion-components.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const route = "/one-sheet-projects/";
const publishedDate = "2026-08-23";
const expectedCount = 43;

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const pct = (value) => `${Number(value).toFixed(1)}%`;
const sqFt = (squareInches) => Number(squareInches / 144).toFixed(1);
const slugify = (value) => String(value || "")
  .toLowerCase()
  .replaceAll(/[^a-z0-9]+/g, "-")
  .replaceAll(/^-+|-+$/g, "");

function yieldBand(value) {
  if (value < 40) return { id: "offcut", label: "Large offcut" };
  if (value < 70) return { id: "balanced", label: "Balanced use" };
  return { id: "high", label: "High sheet use" };
}

function partBand(value) {
  if (value <= 6) return { id: "simple", label: "Up to 6 parts" };
  if (value <= 9) return { id: "medium", label: "7–9 parts" };
  return { id: "dense", label: "10+ parts" };
}

const projects = projectBenchmarks
  .map((project) => ({
    project,
    result: projectResult(project),
    layout: packSheets(project.parts, standardSheet.length, standardSheet.width, 0.125, true),
  }))
  .filter(({ result }) => result.allowedComplete && result.allowedSheets === 1)
  .map((entry) => ({
    ...entry,
    yieldBand: yieldBand(entry.result.allowedYield),
    partBand: partBand(entry.result.partCount),
    unusedArea: standardSheet.area - entry.result.partArea,
  }));

function validateProjects() {
  const errors = [];
  const slugs = new Set();
  if (projects.length !== expectedCount) errors.push(`Expected ${expectedCount} one-sheet projects, received ${projects.length}.`);

  for (const { project, result, layout } of projects) {
    if (slugs.has(project.slug)) errors.push(`Duplicate one-sheet project slug: ${project.slug}`);
    slugs.add(project.slug);
    if (result.allowedSheets !== 1 || !result.allowedComplete || result.allowedRejected) errors.push(`${project.slug} is not a complete one-sheet layout.`);
    if (layout.sheets.length !== 1 || layout.rejected.length) errors.push(`${project.slug} has invalid layout geometry.`);
    const routes = [
      project.templatePath,
      `/examples/${project.slug}-cut-list/`,
      `/examples/data/${project.slug}-cut-list.csv`,
    ];
    for (const href of routes) {
      const clean = href.replace(/^\//, "");
      const file = href.endsWith("/") ? join(root, clean, "index.html") : join(root, clean);
      if (!existsSync(file)) errors.push(`${project.slug} references missing local asset: ${href}`);
    }
  }

  const requiredCategories = ["Cabinets", "Storage", "Furniture", "Shop", "Outdoor", "Small Projects", "Small Spaces"];
  for (const category of requiredCategories) {
    if (!projects.some(({ project }) => project.category === category)) errors.push(`Missing one-sheet category: ${category}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value, null, 2).replaceAll("<", "\\u003c")}</script>`;
}

function miniatureLayout(project, layout) {
  const placements = layout.sheets[0]?.placements ?? [];
  const parts = placements.map((part, index) => {
    const x = part.y;
    const y = part.x;
    const width = part.h;
    const height = part.w;
    return `<rect class="one-sheet-part one-sheet-part-${index % 6}" x="${x.toFixed(3)}" y="${y.toFixed(3)}" width="${width.toFixed(3)}" height="${height.toFixed(3)}"/>`;
  }).join("");
  return `<svg class="one-sheet-layout" viewBox="0 0 96 48" role="img" aria-label="Modeled 4 by 8 layout for ${esc(project.name)}"><rect class="one-sheet-board" x="0.35" y="0.35" width="95.3" height="47.3" rx="1.2"/>${parts}</svg>`;
}

function projectCard(entry) {
  const { project, result, layout, yieldBand: band, partBand: complexity, unusedArea } = entry;
  const exampleRoute = `/examples/${project.slug}-cut-list/`;
  const csvRoute = `/examples/data/${project.slug}-cut-list.csv`;
  const search = `${project.name} ${project.category} ${band.label} ${complexity.label}`.toLowerCase();
  return `<article class="one-sheet-card" data-one-sheet-card data-slug="${esc(project.slug)}" data-name="${esc(project.name)}" data-category="${esc(slugify(project.category))}" data-yield-band="${band.id}" data-part-band="${complexity.id}" data-yield="${result.allowedYield.toFixed(3)}" data-parts="${result.partCount}" data-search="${esc(search)}">
      <div class="one-sheet-card-visual">${miniatureLayout(project, layout)}<span>${pct(result.allowedYield)} yield</span></div>
      <div class="one-sheet-card-copy">
        <div class="one-sheet-badges"><span>${esc(project.category)}</span><span>${esc(complexity.label)}</span><span>${esc(band.label)}</span></div>
        <h2><a href="${exampleRoute}">${esc(project.name)}</a></h2>
        <p><strong>${result.partCount} parts</strong> use ${sqFt(result.partArea)} sq. ft., leaving ${sqFt(unusedArea)} sq. ft. of unfilled area in this modeled layout.</p>
        <div class="one-sheet-card-actions"><a href="${exampleRoute}">View full layout</a><a href="${esc(project.templatePath)}">Open template</a><a href="${csvRoute}" download>Download CSV</a></div>
        <button class="one-sheet-save" type="button" data-one-sheet-save aria-pressed="false">Save to shortlist</button>
      </div>
    </article>`;
}

function masterCsv() {
  const header = ["project", "category", "part_count", "modeled_sheet_count", "modeled_yield_pct", "finished_part_area_sq_ft", "unfilled_sheet_area_sq_ft", "yield_band", "template_url", "worked_layout_url", "cut_list_csv_url", "sheet_size_in", "kerf_in", "rotation", "benchmark_version", "method"];
  const rows = projects.map(({ project, result, yieldBand: band, unusedArea }) => [
    project.name,
    project.category,
    result.partCount,
    result.allowedSheets,
    result.allowedYield.toFixed(3),
    sqFt(result.partArea),
    sqFt(unusedArea),
    band.label,
    `${siteUrl}${project.templatePath}`,
    `${siteUrl}/examples/${project.slug}-cut-list/`,
    `${siteUrl}/examples/data/${project.slug}-cut-list.csv`,
    "96 × 48",
    "0.125",
    "allowed",
    benchmarkVersion,
    benchmarkMethod,
  ]);
  return `${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function pageHtml() {
  const categories = [...new Set(projects.map(({ project }) => project.category))];
  const cards = projects.map(projectCard).join("\n");
  const description = `Explore ${projects.length} one-sheet plywood projects with modeled 4×8 layouts, parts, material yield, templates, and downloadable cut list CSV files.`;
  const faq = [
    ["Does one sheet guarantee my project will use exactly one sheet?", "No. One sheet is the modeled result for the published rectangular parts, nominal 96 × 48 inch stock, a 1/8 inch kerf, and rotation allowed. Your dimensions, grain direction, defects, edge trim, joinery, test pieces, replacement policy, and omitted parts can change the purchase quantity."],
    ["Are these complete woodworking plans?", "No. The gallery connects a transparent cut list example to its adjustable template. Structure, joinery, hardware, loads, installation, finish, safety, product instructions, and local requirements still need project-specific design and verification."],
    ["What does material yield mean here?", "Yield is finished rectangular part area divided by one nominal 4×8 sheet. Unfilled area is not automatically reusable waste because its shape, grain, defects, edge condition, and cutting sequence determine whether it can serve another project."],
    ["Can I download a one-sheet project cut list?", "Yes. Every card links to the project's exact example CSV, and the gallery also provides one master CSV containing all 43 qualifying projects and their modeled results."],
    ["Does saving a shortlist require an account?", "No. The shortlist is stored only in this browser when local storage is available. It is not uploaded by this page, and clearing browser storage removes it."],
  ];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "One-Sheet Plywood Projects",
    description,
    url: `${siteUrl}${route}`,
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map(({ project, result }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${project.name}: ${result.partCount} parts on one 4×8 sheet`,
        url: `${siteUrl}/examples/${project.slug}-cut-list/`,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "One-Sheet Projects", item: `${siteUrl}${route}` },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
  };
  const categoryOptions = categories.map((category) => `<option value="${slugify(category)}">${esc(category)}</option>`).join("");
  const faqMarkup = faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("");
  const cta = cutlistConversionCta({
    context: "example",
    source: "one-sheet-projects",
    title: "Replace the gallery dimensions with the project you will actually cut",
    description: "Use the published layout to understand the scale, then create a saved CutList project with your real parts, sheet stock, kerf, grain rules, quantities, and revision.",
    primaryLabel: "Build my one-sheet layout in CutList",
    secondaryHref: "/plywood-cut-calculator/",
    secondaryLabel: "Try the free plywood calculator",
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>43 One-Sheet Plywood Projects With Cut Lists | WoodCutTool</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${siteUrl}${route}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="43 One-Sheet Plywood Projects With Cut Lists">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${siteUrl}${route}">
  <meta property="og:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="43 One-Sheet Plywood Projects With Cut Lists">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/one-sheet-projects.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/one-sheet-projects.js"></script>
  <script defer src="/assets/conversion.js"></script>
  ${jsonLd(collectionSchema)}
  ${jsonLd(breadcrumbSchema)}
  ${jsonLd(faqSchema)}
  <style>.mega-menu{display:none}</style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main" class="one-sheet-hub" data-one-sheet-hub>
    <header class="one-sheet-hero">
      <div class="one-sheet-hero-copy">
        <p class="breadcrumb"><a href="/">Home</a> / One-Sheet Projects</p>
        <p class="eyebrow">43 verified starting points · 4×8 plywood</p>
        <h1>Find a Project That Starts With One Sheet.</h1>
        <p class="lead">Browse ${projects.length} real project inputs that the WoodCutTool benchmark placed completely on one nominal 4×8 sheet. See the layout before the click, filter by what you want to build, save a private shortlist, then open the exact template, full layout, or CSV.</p>
        <div class="one-sheet-hero-actions"><a class="button" href="#project-finder">Find a project</a><a class="button secondary" href="${route}one-sheet-projects.csv" download>Download all ${projects.length} results</a></div>
        <p class="one-sheet-privacy">Shortlists stay in this browser only. No account or upload is required.</p>
      </div>
      <div class="one-sheet-hero-board" aria-label="One 4 by 8 plywood sheet represented as a project canvas"><div class="one-sheet-hero-grid"><span>MEASURE</span><span>LAY OUT</span><span>CHECK</span><span>BUILD</span></div><strong>4 × 8</strong><small>one sheet · many useful starts</small></div>
    </header>

    <section class="one-sheet-proof" aria-label="One-sheet project library summary">
      <article><strong>${projects.length}</strong><span>complete one-sheet layouts</span></article>
      <article><strong>${categories.length}</strong><span>project categories</span></article>
      <article><strong>${projects.reduce((sum, { result }) => sum + result.partCount, 0)}</strong><span>modeled rectangular parts</span></article>
      <article><strong>${benchmarkMethod.replace("woodcuttool-", "")}</strong><span>published layout method</span></article>
    </section>

    <section class="one-sheet-intro">
      <div><p class="eyebrow">Why this collection exists</p><h2>Start with a visible constraint, not a vague project promise</h2></div>
      <div><p>“One sheet” is useful only when the parts and assumptions are visible. This collection is generated from the same ${projectBenchmarks.length}-project dataset used by WoodCutTool’s reproducible plywood benchmark. A project appears here only when every published rectangle fits on one nominal 96 × 48 inch sheet with a 1/8 inch kerf and rotation allowed. No result is admitted from area math alone.</p><p>The gallery does not turn a sample cut list into a universal construction drawing. Use it to discover a manageable project scale, inspect how much of the sheet the rectangles occupy, and choose a credible starting point. Then verify your dimensions, material thickness, grain, joinery, hardware, loads, installation, finish, safety, and local requirements before buying or cutting.</p></div>
    </section>

    <section class="one-sheet-shortlist" data-one-sheet-shortlist hidden>
      <div><p class="eyebrow">Saved on this device</p><h2>Your project shortlist</h2><p>Open a saved layout or remove it from the shortlist. Nothing here is uploaded.</p></div>
      <div class="one-sheet-shortlist-links" data-one-sheet-shortlist-links></div>
      <button class="one-sheet-text-button" type="button" data-one-sheet-clear-saved>Clear shortlist</button>
    </section>

    <section class="one-sheet-finder" id="project-finder">
      <div class="one-sheet-section-heading"><div><p class="eyebrow">Project finder</p><h2>Filter ${projects.length} one-sheet plywood projects</h2></div><p>Choose the outcome, the amount of sheet you want to consume, or the number of parts you are ready to manage. Random Pick uses only the cards still visible.</p></div>
      <div class="one-sheet-controls">
        <label><span>Search projects</span><input type="search" placeholder="Try shelf, cabinet, cart, table…" autocomplete="off" data-one-sheet-search></label>
        <label><span>Category</span><select data-one-sheet-category><option value="">All categories</option>${categoryOptions}</select></label>
        <label><span>Sheet use</span><select data-one-sheet-yield-band><option value="">Any yield band</option><option value="offcut">Large offcut · under 40%</option><option value="balanced">Balanced use · 40–69.9%</option><option value="high">High sheet use · 70%+</option></select></label>
        <label><span>Part count</span><select data-one-sheet-part-band><option value="">Any part count</option><option value="simple">Up to 6 parts</option><option value="medium">7–9 parts</option><option value="dense">10+ parts</option></select></label>
        <label><span>Sort</span><select data-one-sheet-sort><option value="featured">Featured order</option><option value="yield-desc">Highest sheet use</option><option value="yield-asc">Largest unfilled area</option><option value="parts-asc">Fewest parts</option><option value="name">Project name</option></select></label>
        <button class="button secondary" type="button" data-one-sheet-random>Random pick</button>
        <button class="one-sheet-text-button" type="button" data-one-sheet-reset>Reset filters</button>
      </div>
      <p class="one-sheet-status" aria-live="polite" data-one-sheet-status>Showing all ${projects.length} projects.</p>
      <div class="one-sheet-grid" data-one-sheet-grid>${cards}</div>
      <div class="one-sheet-empty" data-one-sheet-empty hidden><h2>No project matches every filter</h2><p>Reset one condition or browse the complete collection. A useful starting point is more important than forcing a project into the wrong sheet or part-count boundary.</p><button class="button" type="button" data-one-sheet-empty-reset>Show all projects</button></div>
    </section>

    <section class="one-sheet-guide">
      <div class="one-sheet-section-heading"><div><p class="eyebrow">From gallery to workshop</p><h2>Use the one-sheet result in four controlled steps</h2></div></div>
      <ol><li><strong>Choose the scale.</strong><span>Use the gallery to compare part count, project family, modeled yield, and the shape of the remaining area.</span></li><li><strong>Open the evidence.</strong><span>Inspect the full example page, every source row, the large layout diagram, rotation comparison, method, and limitations.</span></li><li><strong>Replace the sample.</strong><span>Open the linked template and substitute measured dimensions, actual thickness, hardware, construction, and project-specific quantities.</span></li><li><strong>Regenerate before release.</strong><span>Run the edited parts through the plywood calculator or CutList, then review the final sheet, labels, grain, first cuts, safety, and contingency.</span></li></ol>
    </section>

    <section class="one-sheet-method">
      <div><p class="eyebrow">Published method</p><h2>What “fits on one sheet” means here</h2></div>
      <div><p>Each quantity is expanded into individual rectangles. The generator sorts pieces deterministically and places them with the versioned <code>${benchmarkMethod}</code> MaxRects-style heuristic on nominal ${standardSheet.length} × ${standardSheet.width} inch stock. It reserves a 0.125 inch kerf between applicable placements and permits 90-degree rotation. Projects with a rejected part or a second modeled sheet are excluded from this collection.</p><p>The method provides a reproducible estimate, not proof of a globally optimal nest or a safe saw sequence. Yield means finished rectangular part area divided by 4,608 square inches. The remaining shape can include useful rectangles, narrow strips, disconnected areas, or stock that becomes unavailable after safe breakdown cuts. Compare the <a href="/research/plywood-project-yield-benchmarks/">complete 75-project benchmark</a>, inspect the <a href="/examples/">worked examples</a>, and read <a href="/learn/saw-kerf-explained/">saw kerf explained</a> before treating a visual fit as a purchasing release.</p></div>
    </section>

    ${cta}

    <section class="one-sheet-faq"><div class="one-sheet-section-heading"><div><p class="eyebrow">Before using a result</p><h2>One-sheet project FAQ</h2></div></div>${faqMarkup}</section>
  </main>
  <div data-site-footer></div>
</body>
</html>\n`;
}

validateProjects();
await mkdir(join(root, "one-sheet-projects"), { recursive: true });
await writeFile(join(root, "one-sheet-projects", "index.html"), pageHtml());
await writeFile(join(root, "one-sheet-projects", "one-sheet-projects.csv"), masterCsv());
console.log(`Generated One-Sheet Projects with ${projects.length} verified layouts and one master CSV.`);
