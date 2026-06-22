// One-off: apply the recommended (★) SEO titles + meta descriptions from
// docs/seo-titles-descriptions.md to the hand-written HTML pages.
// (The 13 /learn articles are handled in build-learn-content.mjs instead.)
// Idempotent: matches on the <title>/<meta description> tags and replaces them.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const pages = {
  "index.html": {
    title: "Plan Plywood Cuts & Cut Less Waste — Free Calculator",
    desc: "Free plywood cutting calculator and cut list optimizer. Plan sheet layouts, add kerf, and cut less waste in your browser — no login, no upload."
  },
  "tools/index.html": {
    title: "Free Woodworking Calculators for Cuts, Waste & Cost",
    desc: "Free woodworking calculators and DIY construction tools: plywood cuts, cut lists, board feet, waste, stairs, and tile. Pick a tool and start planning."
  },
  "plywood-cut-calculator/index.html": {
    title: "Free Plywood Cut Calculator & Sheet Layout Optimizer",
    desc: "Free plywood cut calculator. Plan sheet layouts, add saw kerf, count sheets, and cut less waste before you touch the saw. No login, works offline."
  },
  "cut-list-calculator/index.html": {
    title: "Free Cut List Calculator — Optimize Board Cuts | WoodCutTool",
    desc: "Free cut list calculator for woodworking. Enter board size, parts, quantities, and kerf to get an optimized cutting plan and waste percentage in seconds."
  },
  "wood-waste-calculator/index.html": {
    title: "Wood Waste Calculator — Estimate Scrap, Area & Cost",
    desc: "Free wood waste calculator for boards and sheet goods. Compare parts to your stock and estimate waste percentage, scrap area, and waste cost."
  },
  "board-foot-calculator/index.html": {
    title: "Free Board Foot Calculator — Lumber Volume & Cost",
    desc: "Free board foot calculator for lumber. Get board feet and total cost from thickness, width, length, quantity, and price per board foot — instantly."
  },
  "stair-stringer-calculator/index.html": {
    title: "Free Stair Stringer Calculator — Rise, Run & Angle",
    desc: "Free stair stringer calculator. Get riser height, tread depth, number of steps, stair angle, and stringer length from your total rise and run."
  },
  "tile-calculator/index.html": {
    title: "Free Tile Calculator — Tiles, Boxes, Waste & Cost",
    desc: "Free tile calculator for floors and walls. Estimate tile count, waste allowance, boxes required, coverage, and total material cost before you buy."
  },
  "stringer/index.html": {
    title: "Stringer Calculator — Quick Stair Rise & Run Layout",
    desc: "Quick stringer calculator for stair layout. Estimate risers, treads, stair angle, plumb-cut angle, and stringer length from total rise and run."
  },
  "quiltfit/index.html": {
    title: "Free Quilt Calculator — Blocks, Backing & Binding",
    desc: "Free quilt calculator. Plan block rows, cut sizes, backing, batting, and binding fabric, then keep going in the QuiltFit iPhone app. No login needed."
  },
  "cutlist/index.html": {
    title: "Plywood Cutting Calculator & CutList Optimizer (Free)",
    desc: "Free plywood cutting calculator and CutList optimizer. Enter sheet size, parts, quantities, and kerf to plan cuts, sheets required, and waste in seconds."
  },
  "compare/best-plywood-tools/index.html": {
    title: "Best Plywood Cutting Calculator Tools (2026 Compared)",
    desc: "Compare the best plywood cutting calculator tools for 2026: CutList optimizer, manual planning, generic calculators, and spreadsheets — pros and cons."
  },
  "guides/how-to-cut-plywood-efficiently/index.html": {
    title: "How to Cut Plywood Efficiently & Cut Waste 30%+",
    desc: "Learn how to cut plywood efficiently: a sheet layout method, kerf planning, grain checks, and cut sequence that can cut waste 30% or more on real jobs."
  },
  "templates/4x8-plywood-sheet/index.html": {
    title: "Free 4x8 Plywood Cut List Template & Layout Tool",
    desc: "Free 4x8 plywood cut list template. Plan cabinet panels, shelves, and furniture parts with kerf, grain direction, and an optimized sheet cutting layout."
  }
};

function esc(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

let warnings = 0;
for (const [file, { title, desc }] of Object.entries(pages)) {
  const abs = join(root, file);
  let html = readFileSync(abs, "utf8");

  if (title.length > 60) console.warn(`! title >60 (${title.length}): ${file}`);
  if (desc.length >= 155) console.warn(`! desc >=155 (${desc.length}): ${file}`);

  const before = html;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(desc)}">`
  );
  if (html === before) {
    console.warn(`! no change applied: ${file}`);
    warnings++;
  } else {
    writeFileSync(abs, html);
    console.log(`ok  ${file}  T[${title.length}] D[${desc.length}]`);
  }
}
console.log(warnings ? `Done with ${warnings} warning(s).` : "Done. All pages updated.");
