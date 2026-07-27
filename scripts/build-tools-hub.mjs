import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { constructionHubs, constructionTools } from "./construction-tool-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tool = new Map(constructionTools.map((item) => [item.slug, item]));
const card = (name, description, href, action = "Open calculator") => `<article class="card"><h2>${name}</h2><p>${description}</p><a class="card-link" href="${href}">${action}</a></article>`;
const visualFigure = (src, alt, { wide = false, eager = false } = {}) => `<figure class="visual-frame${wide ? " wide" : ""}"><img src="${src}" alt="${alt}" width="${wide ? 1600 : 1200}" height="900" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
const visualHeading = (eyebrow, title, description, src, alt) => `<div class="visual-section-heading"><div class="section-heading compact"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${description ? `<p>${description}</p>` : ""}</div>${visualFigure(src, alt)}</div>`;
const groupVisual = (eyebrow) => {
  if (eyebrow.includes("Cabinet")) return ["/assets/images/tools/tools-cabinet.webp", "Cabinet panels, drawer parts, and hardware arranged for assembly"];
  if (eyebrow.includes("Wood &")) return ["/assets/images/tools/tools-measurement.webp", "Wood samples, measuring tools, and material notes arranged on a workbench"];
  if (eyebrow.includes("Stairs")) return ["/assets/images/learn/stair-planning.webp", "Stair framing measurements and layout marks prepared for planning"];
  if (eyebrow.includes("Deck")) return ["/assets/images/compare/compare-construction.webp", "Deck framing and stair layout prepared for construction estimates"];
  return ["/assets/images/tools/tools-cut-layout.webp", "Sheet goods and cut parts arranged around a measured cutting layout"];
};
const constructionCard = (slug) => {
  const item = tool.get(slug);
  return card(item.name, item.description, item.route);
};

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Woodworking & Construction Calculators | WoodCutTool</title>
  <meta name="description" content="Free woodworking and construction calculators for plywood, cabinets, deck, fence, stairs, roof pitch, concrete, boards, waste, and material planning.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="https://woodcuttool.com/tools/">
  <meta property="og:type" content="website"><meta property="og:site_name" content="WoodCutTool"><meta property="og:title" content="Woodworking & Construction Calculators | WoodCutTool"><meta property="og:description" content="Free woodworking and construction calculators for plywood, cabinets, deck, fence, stairs, roof pitch, concrete, boards, waste, and material planning."><meta property="og:url" content="https://woodcuttool.com/tools/"><meta property="og:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Woodworking & Construction Calculators | WoodCutTool"><meta name="twitter:description" content="Free woodworking and construction calculators for plywood, cabinets, deck, fence, stairs, roof pitch, concrete, boards, waste, and material planning."><meta name="twitter:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619"><link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619"><link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619"><meta name="theme-color" content="#e8d9b4">
  <style>.mega-menu{display:none}</style><link rel="stylesheet" href="/assets/styles.css"><script defer src="/assets/site-chrome.js"></script><script defer src="/assets/app.js"></script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"WoodCutTool Calculators","url":"https://woodcuttool.com/tools/"}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a><div data-site-header></div>
  <main id="main">
    <section class="page-hero visual-hub-hero"><div class="visual-hub-copy"><p class="breadcrumb"><a href="/">Home</a> / Tools</p><p class="eyebrow">Calculator hub</p><h1>Woodworking and Construction Calculators</h1><p class="lead">Choose a focused calculator for the job in front of you: plywood and cabinet parts, lumber and shop measurements, deck and fence materials, stairs, roof geometry, concrete, and finishing estimates. Every result is a starting point to verify before you buy or build.</p></div>${visualFigure("/assets/images/tools/tools-hero.webp", "Woodworking calculators represented by measured boards, plywood parts, hand tools, and a digital cut plan", { wide: true, eager: true })}</section>
    <section class="section"><div class="grid tools">${card("Woodworking Tools", "Cut and layout, cabinet and furniture, wood species, sheet goods, board feet, material cost, and shop measurement tools.", "/tools/woodworking/", "Browse woodworking tools")}${card("Construction Tools", "Stairs, tile, deck, fence, wall, roof geometry, concrete, spacing, finish, and field-planning calculators.", "/tools/construction/", "Browse construction tools")}</div></section>
    <section class="section">${visualHeading("Woodworking", "Cut lists, plywood, cabinets, lumber, and shop math.", "Start here when the material will be cut in the shop. Use the quick calculators for a first estimate, then move confirmed part dimensions into a sheet layout.", "/assets/images/tools/tools-cut-layout.webp", "Plywood sheets and cabinet parts organized around an efficient cutting layout")}<div class="grid tools">
      ${card("Plywood Cut Calculator", "Plan sheet layouts, parts, kerf, sheet count, layout preview, and estimated waste.", "/plywood-cut-calculator/")}
      ${card("Cut List Calculator", "Turn board inventory and part dimensions into a practical linear cutting plan.", "/cut-list-calculator/")}
      ${constructionCard("cabinet-cut-list-calculator")}
      ${constructionCard("drawer-box-calculator")}
      ${constructionCard("cabinet-door-calculator")}
      ${constructionCard("shelf-spacing-calculator")}
      ${card("Board Foot Calculator", "Estimate lumber volume and cost from thickness, width, length, quantity, and price per board foot.", "/board-foot-calculator/")}
      ${constructionCard("shelf-sag-calculator")}
      ${card("Kerf Calculator", "Check blade loss, remaining stock, and waste before making repeated cuts.", "/kerf-calculator/")}
      ${card("Wood Waste Calculator", "Estimate scrap area, waste percentage, and waste cost from project parts and stock.", "/wood-waste-calculator/")}
    </div></section>
    <section class="section">${visualHeading("Fence and deck", "Turn outdoor dimensions into a material starting list.", "Estimate posts, pickets, rails, deck boards, footings, finish coverage, stair geometry, and the key inputs you need for a detailed framing check.", "/assets/images/compare/compare-construction.webp", "Deck framing, posts, and stair layout prepared for outdoor material planning")}<div class="grid tools">${["fence-calculator", "deck-calculator", "deck-board-calculator", "post-hole-concrete-calculator", "picket-spacing-calculator", "baluster-spacing-calculator", "deck-stair-calculator", "deck-stain-calculator", "fence-stain-calculator", "joist-span-calculator"].map(constructionCard).join("")}</div></section>
    <section class="section">${visualHeading("Stairs and roofing", "Geometry first, then confirm the build details.", "Calculate rise and run, slope, pitch, rafter geometry, and roof material estimates. Structural and code requirements always need project-specific verification.", "/assets/images/learn/stair-planning.webp", "Stair framing dimensions and angle measurements prepared for layout")}<div class="grid tools">${["stair-calculator", "rise-run-calculator", "stair-angle-calculator", "roof-pitch-calculator", "roofing-calculator", "rafter-length-calculator", "roof-shingle-calculator"].map(constructionCard).join("")}${card("Stair Stringer Calculator", "Explore risers, treads, angle, and a visual stair elevation before marking a stringer.", "/stair-stringer-calculator/")}</div></section>
    <section class="section">${visualHeading("Finish and measurement", "Small tools that prevent expensive layout mistakes.", "Use conversion, crown-molding, material, and fastener references to prepare accurate marks and purchase lists.", "/assets/images/tools/tools-measurement.webp", "Tape measure, square, angle gauge, and wood samples arranged for precise layout")}<div class="grid tools">${card("Conversion Calculator", "Convert fractions, inches, millimeters, feet, angles, slope, and rise and run in one workspace.", "/conversion/")}${card("Drill Bit Finder", "Match screw diameter and material to pilot, clearance, fractional, and metric drill sizes.", "/drill-bit-finder/")}${constructionCard("crown-molding-angle-calculator")}${card("Fraction Calculator", "Convert fractional inches into decimal inches and millimeters.", "/fraction-calculator/")}${card("Inch ↔ mm Converter", "Switch between imperial and metric dimensions for plans, sheet sizes, and hardware.", "/inch-mm-converter/")}${card("Material Library", "Compare sheet goods by thickness, size, weight, cost tier, and common uses.", "/material-library/")}${card("Wood Species Library", "Search wood density, hardness, weight, cost tier, and finishing notes.", "/wood/")}</div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Project workflow</p><h2>Plan, verify, record, then troubleshoot.</h2><p>A calculator answers one number. These connected libraries carry that number through a practical project workflow and make the next useful page easy to find.</p></div><div class="related-grid">
      <a href="/templates/"><span>Start</span><strong>Project templates</strong></a>
      <a href="/examples/"><span>Inspect</span><strong>Worked examples</strong></a>
      <a href="/worksheets/"><span>Record</span><strong>Printable worksheets</strong></a>
      <a href="/checklists/"><span>Verify</span><strong>Release checklists</strong></a>
      <a href="/research/"><span>Audit</span><strong>Research and open data</strong></a>
      <a href="/troubleshooting/"><span>Recover</span><strong>Troubleshooting guides</strong></a>
    </div></section>
    <section class="section">${visualHeading("Learn by project", "Browse a focused topic cluster.", "These hubs keep woodworking, decks, fences, stairs, and roofing connected by project intent instead of mixing unrelated apps into the calculator hub.", "/assets/images/learn/workshop-layout.webp", "Organized workshop layout with tools, benches, and project planning areas")}<div class="grid tools">${constructionHubs.map(([slug, name, description]) => card(name, description, `/learn/${slug}/`, "Open topic hub")).join("")}</div></section>
  </main><div data-site-footer></div>
</body></html>`;

const target = join(root, "tools", "index.html");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, html);

function subHubPage({ slug, title, description, eyebrow, groups }) {
  const canonical = `https://woodcuttool.com/tools/${slug}/`;
  const cards = groups.flatMap((group) => group.cards);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": canonical, name: title, url: canonical, description, mainEntity: { "@type": "ItemList", itemListElement: cards.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `https://woodcuttool.com${item.href}` })) } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://woodcuttool.com/" }, { "@type": "ListItem", position: 2, name: "Tools", item: "https://woodcuttool.com/tools/" }, { "@type": "ListItem", position: 3, name: title, item: canonical }] }
  ] };
  const [heroSrc, heroAlt] = slug === "woodworking"
    ? ["/assets/images/tools/tools-cut-layout.webp", "Sheet goods and cabinet parts arranged around a measured cutting plan"]
    : ["/assets/images/compare/compare-construction.webp", "Deck framing and stair layout prepared for construction calculations"];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | WoodCutTool</title><meta name="description" content="${description}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="WoodCutTool"><meta property="og:title" content="${title} | WoodCutTool"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title} | WoodCutTool"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any"><style>.mega-menu{display:none}</style><link rel="stylesheet" href="/assets/styles.css"><script defer src="/assets/site-chrome.js"></script><script defer src="/assets/app.js"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><a class="skip-link" href="#main">Skip to content</a><div data-site-header></div><main id="main"><section class="page-hero visual-hub-hero"><div class="visual-hub-copy"><p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / ${title}</p><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p></div>${visualFigure(heroSrc, heroAlt, { eager: true })}</section>${groups.map((group) => { const [src, alt] = groupVisual(group.eyebrow); return `<section class="section">${visualHeading(group.eyebrow, group.title, group.description, src, alt)}<div class="grid tools">${group.cards.map((item) => card(item.name, item.description, item.href)).join("")}</div></section>`; }).join("")}</main><div data-site-footer></div></body></html>`;
}

const asCard = (item) => ({ name: item.name, description: item.description, href: item.route });
const woodworkingGenerated = constructionTools.filter((item) => item.section === "woodworking");
const constructionGenerated = constructionTools.filter((item) => item.section === "construction");
const woodworkingGroups = [
  { eyebrow: "Cut & Layout", title: "Cut and layout tools", description: "Turn stock and project dimensions into cut plans, sheet layouts, kerf checks, and waste estimates.", cards: [
    { name: "Plywood Cut Calculator", description: "Plan parts, kerf, sheet count, layout, and waste.", href: "/plywood-cut-calculator/" },
    { name: "Cut List Calculator", description: "Optimize linear board cuts and review waste.", href: "/cut-list-calculator/" },
    { name: "Kerf Calculator", description: "Estimate saw-cut material loss and remaining stock.", href: "/kerf-calculator/" }
  ] },
  { eyebrow: "Cabinet & Furniture", title: "Cabinet and furniture tools", description: "Generate cabinet, drawer, door, shelf, molding, and furniture planning dimensions.", cards: woodworkingGenerated.map(asCard) },
  { eyebrow: "Wood & Materials", title: "Wood and material tools", description: "Estimate lumber volume, weight, sheet goods, costs, and material properties.", cards: [
    { name: "Board Foot Calculator", description: "Estimate lumber volume, waste, cost, and weight.", href: "/board-foot-calculator/" },
    { name: "Lumber Calculator", description: "Estimate board feet, linear feet, waste, and cost.", href: "/lumber-calculator/" },
    { name: "Material Cost Calculator", description: "Build a project material and labor budget.", href: "/material-cost-calculator/" },
    { name: "Conversion Calculator", description: "Convert fractions, inches, millimeters, feet, angles, slope, and rise and run.", href: "/conversion/" },
    { name: "Drill Bit Finder", description: "Match screw and material inputs to pilot and clearance drill sizes.", href: "/drill-bit-finder/" },
    { name: "Wood Species Library", description: "Compare density, hardness, weight, cost, and common uses.", href: "/wood/" },
    { name: "Material Library", description: "Compare plywood, MDF, OSB, melamine, and other sheet goods.", href: "/material-library/" }
  ] }
];
const stairSlugs = new Set(["stair-calculator", "deck-stair-calculator", "rise-run-calculator", "stair-angle-calculator"]);
const constructionGroups = [
  { eyebrow: "Stairs & Tile", title: "Stair and tile tools", description: "Plan stair geometry, stringers, rise and run, angles, tile coverage, boxes, and waste.", cards: [
    { name: "Stair Stringer Calculator", description: "Calculate stair rise, run, risers, treads, angle, and stringer length.", href: "/stair-stringer-calculator/" },
    { name: "Tile Calculator", description: "Estimate tiles, boxes, waste, coverage, and material cost.", href: "/tile-calculator/" },
    ...constructionGenerated.filter((item) => stairSlugs.has(item.slug)).map(asCard)
  ] },
  { eyebrow: "Deck, Fence & Wall", title: "Deck, fence, wall, and exterior tools", description: "Estimate outdoor materials, spacing, concrete, finishes, roof geometry, and non-structural planning quantities.", cards: [
    ...constructionGenerated.filter((item) => !stairSlugs.has(item.slug)).map(asCard),
    { name: "Project Cost Estimator", description: "Build an early material, labor, tax, contingency, and project budget.", href: "/cost-estimator/" }
  ] }
];

for (const hub of [
  { slug: "woodworking", title: "Woodworking Tools", description: "Woodworking calculators for cut and layout planning, cabinets and furniture, lumber, plywood, materials, and accurate shop measurements.", eyebrow: "Cut, cabinet, and material planning", groups: woodworkingGroups },
  { slug: "construction", title: "Construction Tools", description: "Construction calculators for stairs, tile, decks, fences, walls, roofs, concrete, spacing, finishing, and early material estimates.", eyebrow: "Stairs, tile, deck, fence, and wall", groups: constructionGroups }
]) {
  const hubTarget = join(root, "tools", hub.slug, "index.html");
  mkdirSync(dirname(hubTarget), { recursive: true });
  writeFileSync(hubTarget, subHubPage(hub));
}

console.log("Generated focused tools hub plus woodworking and construction sub-hubs.");
