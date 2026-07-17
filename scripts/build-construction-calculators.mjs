import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { constructionHubs, constructionTools } from "./construction-tool-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const bySlug = new Map(constructionTools.map((tool) => [tool.slug, tool]));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pageHead({ title, description, canonical, schema }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <style>.mega-menu{display:none}</style>
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/app.js"></script>
  <script defer src="/assets/construction-calculators.js"></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>`;
}

function inputMarkup([label, name, value, extra]) {
  const isDimension = label.includes("(in)");
  const visibleLabel = isDimension
    ? `${escapeHtml(label.replace("(in)", "").trim())} (<span data-unit-label>in</span>)`
    : escapeHtml(label);
  if (typeof extra === "string" && extra.startsWith("select:")) {
    const options = extra.slice(7).split(",").map((pair) => {
      const [optionLabel, optionValue] = pair.split("|");
      return `<option value="${escapeHtml(optionValue)}"${String(optionValue) === String(value) ? " selected" : ""}>${escapeHtml(optionLabel)}</option>`;
    }).join("");
    return `<label>${visibleLabel}<select name="${escapeHtml(name)}">${options}</select></label>`;
  }
  const step = extra || 0.01;
  return `<label>${visibleLabel}<input name="${escapeHtml(name)}" type="number" min="0" step="${escapeHtml(step)}" value="${escapeHtml(value)}"${isDimension ? " data-dimension-input" : ""} required></label>`;
}

function toolSchema(tool) {
  const canonical = `${siteUrl}${tool.route}`;
  const sectionName = tool.section === "woodworking" ? "Woodworking Tools" : "Construction Tools";
  const sectionUrl = `${siteUrl}/tools/${tool.section}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": canonical, name: tool.name, url: canonical, description: tool.description, isPartOf: { "@id": `${siteUrl}/tools/` } },
      { "@type": "WebApplication", "@id": `${canonical}#application`, name: tool.name, url: canonical, description: tool.description, applicationCategory: "DesignApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript in a modern web browser", isAccessibleForFree: true, featureList: ["Browser-based calculation", "Visible result summary", "Project assumptions", "Related planning links"] },
      { "@type": "FAQPage", "@id": `${canonical}#faq`, mainEntity: tool.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools/` },
        { "@type": "ListItem", position: 3, name: sectionName, item: sectionUrl },
        { "@type": "ListItem", position: 4, name: tool.name, item: canonical }
      ] }
    ]
  };
}

function relatedCards(slugs) {
  return slugs.map((slug) => {
    const item = bySlug.get(slug);
    if (!item) return "";
    return `<article class="card"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><a class="card-link" href="${item.route}">Open ${escapeHtml(item.name)}</a></article>`;
  }).join("");
}

function toolVisual(tool) {
  const category = `${tool.category} ${tool.name}`.toLowerCase();
  if (/cabinet|drawer|shelf|furniture/.test(category)) {
    return ["/assets/images/tools/tools-cabinet.webp", "Cabinet panels, drawer parts, and hardware organized for a measured build"];
  }
  if (/deck|fence|footing|railing|roof|stair|rafter|joist|concrete/.test(category)) {
    return ["/assets/images/compare/compare-construction.webp", "Deck framing and stair layout prepared for construction measurements"];
  }
  if (/finish|crown|angle|spacing|pitch|measurement/.test(category)) {
    return ["/assets/images/tools/tools-measurement.webp", "Tape measure, square, angle gauge, and material samples arranged for precise layout"];
  }
  return ["/assets/images/tools/tools-cut-layout.webp", "Sheet goods and cut parts arranged around a measured cutting layout"];
}

function toolPage(tool) {
  const canonical = `${siteUrl}${tool.route}`;
  const [visualSrc, visualAlt] = toolVisual(tool);
  const sectionName = tool.section === "woodworking" ? "Woodworking Tools" : "Construction Tools";
  const cta = tool.engine === "CutListGenerator" || tool.engine === "SpacingEngine"
    ? `<a class="button" href="/apps/cutlist/">Optimize this cut list in CutList</a>`
    : `<a class="button secondary" href="/tools/">Browse all woodworking and construction tools</a>`;
  const productBoundary = tool.engine === "CutListGenerator" || tool.engine === "SpacingEngine"
    ? `<p class="notice"><strong>Website:</strong> one-time calculation, SVG preview, and copyable results. <strong>CutList app:</strong> saved projects, later edits, full plywood optimization, PDF export, history, and offline use.</p>`
    : "";
  const contextCards = tool.contexts ? `
        <article class="card"><h3>Project template</h3><p>Start from an indexed static project example, then bring confirmed dimensions back into this calculator.</p><a class="card-link" href="${tool.contexts.template}">Open related template</a></article>
        <article class="card"><h3>Learn the workflow</h3><p>Review the measurement assumptions and cut-list method before batching material.</p><a class="card-link" href="${tool.contexts.learn}">Read related guide</a></article>
        <article class="card"><h3>Compare the options</h3><p>Understand the construction or hardware choice that changes the final dimensions.</p><a class="card-link" href="${tool.contexts.compare}">Read related comparison</a></article>` : "";
  const unitSwitch = tool.unitSwitch
    ? `<label>Units<select name="unit" data-unit-switch><option value="imperial">Imperial (in)</option><option value="metric">Metric (mm)</option></select></label>`
    : "";
  return `${pageHead({ title: tool.title, description: tool.description, canonical, schema: toolSchema(tool) })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main">
    <section class="page-hero visual-hub-hero">
      <div class="visual-hub-copy">
        <p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / <a href="/tools/${tool.section}/">${sectionName}</a> / ${escapeHtml(tool.name)}</p>
        <p class="eyebrow">${escapeHtml(tool.category)}</p>
        <h1>${escapeHtml(tool.h1)}</h1>
        <p class="lead">${escapeHtml(tool.intro)}</p>
      </div>
      <figure class="visual-frame"><img src="${visualSrc}" alt="${escapeHtml(visualAlt)}" width="1200" height="900" loading="eager" fetchpriority="high" decoding="async"></figure>
    </section>
    <section class="section tool-layout construction-tool" data-calculator="${escapeHtml(tool.type)}">
      <form class="tool-panel" data-construction-form>
        <div class="section-heading compact"><p class="eyebrow">Project inputs</p><h2>Start with your actual measurements.</h2><p>Results update in your browser. Measurements and prices are not sent to a server.</p></div>
        <div class="input-grid three">${unitSwitch}${tool.inputs.map(inputMarkup).join("")}</div>
        <button class="button" type="submit">Calculate ${escapeHtml(tool.name)}</button>
      </form>
      <aside class="result-panel" data-construction-result data-result-title="${escapeHtml(tool.name)}" aria-live="polite">
        <h2>${escapeHtml(tool.name)} result</h2>
        <p class="placeholder">Enter project values and run the calculator to see a planning estimate.</p>
      </aside>
    </section>
    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">How the estimate works</p><h2>Use the number as a planning starting point.</h2><p>${escapeHtml(tool.formula)}</p></div>
      <div class="grid tools">
        <article class="card"><h3>Measure first</h3><p>Measure finished dimensions, actual stock, openings, and site constraints before ordering material.</p></article>
        <article class="card"><h3>Check the result</h3><p>${escapeHtml(tool.detail)}</p></article>
        <article class="card"><h3>Plan the next step</h3><p>Use the related calculators below to turn a first estimate into a material list, layout, or a more detailed project plan.</p></article>
      </div>
      ${productBoundary}<div class="cta-row">${cta}</div>
    </section>
    ${contextCards ? `<section class="section"><div class="section-heading compact"><p class="eyebrow">Project context</p><h2>Template, guide, and comparison links.</h2></div><div class="grid tools">${contextCards}</div></section>` : ""}
    <section class="section" id="faq">
      <div class="section-heading compact"><p class="eyebrow">FAQ</p><h2>Common ${escapeHtml(tool.name)} questions</h2></div>
      <div class="grid tools">${tool.faqs.map(([question, answer]) => `<article class="card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">Related tools</p><h2>Keep the project moving.</h2></div>
      <div class="grid tools">${relatedCards(tool.related)}</div>
    </section>
    <section class="section"><p class="notice"><strong>Planning disclaimer:</strong> WoodCutTool results are estimates. Verify measurements, product instructions, material condition, local requirements, and safety practices before buying, cutting, or building.</p></section>
  </main>
  <div data-site-footer></div>
</body>
</html>`;
}

function legacyAliasPage(tool) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${siteUrl}${tool.route}"><meta http-equiv="refresh" content="0;url=${tool.route}"><title>Moved: ${escapeHtml(tool.name)}</title></head><body><p>This calculator moved to <a href="${tool.route}">${escapeHtml(tool.route)}</a>.</p></body></html>`;
}

function hubPage([slug, name, description, toolSlugs]) {
  const canonical = `${siteUrl}/learn/${slug}/`;
  const tools = toolSlugs.map((toolSlug) => bySlug.get(toolSlug)).filter(Boolean);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": canonical, name, url: canonical, description, mainEntity: { "@type": "ItemList", itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: `${siteUrl}${tool.route}` })) } },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Learn", item: `${siteUrl}/learn/` }, { "@type": "ListItem", position: 3, name, item: canonical }] }
    ]
  };
  return `${pageHead({ title: `${name} | WoodCutTool`, description, canonical, schema })}
<body>
  <a class="skip-link" href="#main">Skip to content</a><div data-site-header></div>
  <main id="main">
    <section class="page-hero"><p class="breadcrumb"><a href="/">Home</a> / <a href="/learn/">Learn</a> / ${escapeHtml(name)}</p><p class="eyebrow">Topic hub</p><h1>${escapeHtml(name)}</h1><p class="lead">${escapeHtml(description)}</p></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Calculators</p><h2>Start with the estimate that matches your job.</h2><p>Each page solves a distinct planning task so you can move from dimensions to a more useful purchase or layout check.</p></div><div class="grid tools">${tools.map((tool) => `<article class="card"><h2>${escapeHtml(tool.name)}</h2><p>${escapeHtml(tool.description)}</p><a class="card-link" href="${tool.route}">Open ${escapeHtml(tool.name)}</a></article>`).join("")}</div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Method</p><h2>Measure, estimate, verify.</h2><p>Use calculators to prepare a first material plan, then verify actual material, plans, manufacturer requirements, and local rules before committing to a build.</p></div></section>
  </main><div data-site-footer></div>
</body></html>`;
}

for (const tool of constructionTools) {
  const target = join(root, tool.route, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, toolPage(tool));
  const aliasTarget = join(root, tool.legacyRoute, "index.html");
  mkdirSync(dirname(aliasTarget), { recursive: true });
  writeFileSync(aliasTarget, legacyAliasPage(tool));
}

for (const hub of constructionHubs) {
  const target = join(root, "learn", hub[0], "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, hubPage(hub));
}

console.log(`Generated ${constructionTools.length} construction calculators and ${constructionHubs.length} topic hubs.`);
