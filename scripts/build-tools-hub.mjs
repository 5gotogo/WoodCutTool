import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { constructionHubs, constructionTools } from "./construction-tool-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tool = new Map(constructionTools.map((item) => [item.slug, item]));
const card = (name, description, href, action = "Open calculator") => `<article class="card"><h2>${name}</h2><p>${description}</p><a class="card-link" href="${href}">${action}</a></article>`;
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
    <section class="page-hero"><p class="breadcrumb"><a href="/">Home</a> / Tools</p><p class="eyebrow">Calculator hub</p><h1>Woodworking and Construction Calculators</h1><p class="lead">Choose a focused calculator for the job in front of you: plywood and cabinet parts, lumber and shop measurements, deck and fence materials, stairs, roof geometry, concrete, and finishing estimates. Every result is a starting point to verify before you buy or build.</p></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Woodworking</p><h2>Cut lists, plywood, cabinets, lumber, and shop math.</h2><p>Start here when the material will be cut in the shop. Use the quick calculators for a first estimate, then move confirmed part dimensions into a sheet layout.</p></div><div class="grid tools">
      ${card("CutList Plywood Optimizer", "Saved iPhone plywood layouts, kerf settings, PDF export, and offline project planning when a browser estimate is not enough.", "/apps/cutlist/", "Explore CutList")}
      ${card("Plywood Cut Calculator", "Plan sheet layouts, parts, kerf, sheet count, layout preview, and estimated waste.", "/plywood-cut-calculator/")}
      ${card("Cut List Calculator", "Turn board inventory and part dimensions into a practical linear cutting plan.", "/cut-list-calculator/")}
      ${constructionCard("cabinet-cut-list-calculator")}
      ${card("Board Foot Calculator", "Estimate lumber volume and cost from thickness, width, length, quantity, and price per board foot.", "/board-foot-calculator/")}
      ${constructionCard("shelf-sag-calculator")}
      ${card("Kerf Calculator", "Check blade loss, remaining stock, and waste before making repeated cuts.", "/kerf-calculator/")}
      ${card("Wood Waste Calculator", "Estimate scrap area, waste percentage, and waste cost from project parts and stock.", "/wood-waste-calculator/")}
    </div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Fence and deck</p><h2>Turn outdoor dimensions into a material starting list.</h2><p>Estimate posts, pickets, rails, deck boards, footings, finish coverage, stair geometry, and the key inputs you need for a detailed framing check.</p></div><div class="grid tools">${["fence-calculator", "deck-calculator", "deck-board-calculator", "post-hole-concrete-calculator", "picket-spacing-calculator", "baluster-spacing-calculator", "deck-stair-calculator", "deck-stain-calculator", "fence-stain-calculator", "joist-span-calculator"].map(constructionCard).join("")}</div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Stairs and roofing</p><h2>Geometry first, then confirm the build details.</h2><p>Calculate rise and run, slope, pitch, rafter geometry, and roof material estimates. Structural and code requirements always need project-specific verification.</p></div><div class="grid tools">${["stair-calculator", "rise-run-calculator", "stair-angle-calculator", "roof-pitch-calculator", "roofing-calculator", "rafter-length-calculator", "roof-shingle-calculator"].map(constructionCard).join("")}${card("Stair Stringer Calculator", "Explore risers, treads, angle, and a visual stair elevation before marking a stringer.", "/stair-stringer-calculator/")}</div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Finish and measurement</p><h2>Small tools that prevent expensive layout mistakes.</h2><p>Use conversion, crown-molding, material, and fastener references to prepare accurate marks and purchase lists.</p></div><div class="grid tools">${constructionCard("crown-molding-angle-calculator")}${card("Fraction Calculator", "Convert fractional inches into decimal inches and millimeters.", "/fraction-calculator/")}${card("Inch ↔ mm Converter", "Switch between imperial and metric dimensions for plans, sheet sizes, and hardware.", "/inch-mm-converter/")}${card("Material Library", "Compare sheet goods by thickness, size, weight, cost tier, and common uses.", "/material-library/")}${card("Wood Species Library", "Search wood density, hardness, weight, cost tier, and finishing notes.", "/wood/")}</div></section>
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Learn by project</p><h2>Browse a focused topic cluster.</h2><p>These hubs keep woodworking, decks, fences, stairs, and roofing connected by project intent instead of mixing unrelated apps into the calculator hub.</p></div><div class="grid tools">${constructionHubs.map(([slug, name, description]) => card(name, description, `/learn/${slug}/`, "Open topic hub")).join("")}</div></section>
  </main><div data-site-footer></div>
</body></html>`;

const target = join(root, "tools", "index.html");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, html);
console.log("Generated focused woodworking and construction tools hub.");
