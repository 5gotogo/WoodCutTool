// Applies SEO meta to the HAND-WRITTEN HTML pages (the generators handle their
// own pages). Three jobs per page, all idempotent:
//   1. recommended <title> + <meta description>  (from docs/seo-titles-descriptions.md)
//   2. Open Graph + Twitter Card tags            (between markers, re-runnable)
//   3. BreadcrumbList JSON-LD                     (between markers, in <body>)
// Run this AFTER apply-tool-schemas.mjs so its SoftwareApplication JSON-LD (the
// first <script ld+json> on tool pages) is never clobbered by the breadcrumb.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags, breadcrumbJsonLd } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// file -> { title, desc, type, bc }
// bc = breadcrumb trail [ [name, path], ... ]; omit for top-level pages.
const pages = {
  "index.html": {
    title: "Plan Plywood Cuts & Cut Less Waste — Free Calculator",
    desc: "Free plywood cutting calculator and cut list optimizer. Plan sheet layouts, add kerf, and cut less waste in your browser — no login, no upload."
  },
  "tools/index.html": {
    title: "Free Woodworking Calculators for Cuts, Waste & Cost",
    desc: "Free woodworking calculators and DIY construction tools: plywood cuts, cut lists, board feet, waste, stairs, and tile. Pick a tool and start planning.",
    bc: [["Home", "/"], ["Tools", "/tools/"]]
  },
  "plywood-cut-calculator/index.html": {
    title: "Free Plywood Cut Calculator & Sheet Layout Optimizer",
    desc: "Free plywood cut calculator. Plan sheet layouts, add saw kerf, count sheets, and cut less waste before you touch the saw. No login, works offline.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Plywood Cut Calculator", "/plywood-cut-calculator/"]]
  },
  "cut-list-calculator/index.html": {
    title: "Free Cut List Calculator — Optimize Board Cuts",
    desc: "Free cut list calculator for woodworking. Enter board size, parts, quantities, and kerf to get an optimized cutting plan and waste percentage in seconds.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Cut List Calculator", "/cut-list-calculator/"]]
  },
  "wood-waste-calculator/index.html": {
    title: "Wood Waste Calculator — Estimate Scrap, Area & Cost",
    desc: "Free wood waste calculator for boards and sheet goods. Compare parts to your stock and estimate waste percentage, scrap area, and waste cost.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Wood Waste Calculator", "/wood-waste-calculator/"]]
  },
  "board-foot-calculator/index.html": {
    title: "Free Board Foot Calculator — Lumber Volume & Cost",
    desc: "Free board foot calculator for lumber. Get board feet and total cost from thickness, width, length, quantity, and price per board foot — instantly.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Board Foot Calculator", "/board-foot-calculator/"]]
  },
  "stair-stringer-calculator/index.html": {
    title: "Free Stair Stringer Calculator — Rise, Run & Angle",
    desc: "Free stair stringer calculator. Get riser height, tread depth, number of steps, stair angle, and stringer length from your total rise and run.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Stair Stringer Calculator", "/stair-stringer-calculator/"]]
  },
  "tile-calculator/index.html": {
    title: "Free Tile Calculator — Tiles, Boxes, Waste & Cost",
    desc: "Free tile calculator for floors and walls. Estimate tile count, waste allowance, boxes required, coverage, and total material cost before you buy.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Tile Calculator", "/tile-calculator/"]]
  },
  "stringer/index.html": {
    title: "Stringer Calculator — Quick Stair Rise & Run Layout",
    desc: "Quick stringer calculator for stair layout. Estimate risers, treads, stair angle, plumb-cut angle, and stringer length from total rise and run.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["Stringer Calculator", "/stringer/"]]
  },
  "quiltfit/index.html": {
    title: "Free Quilt Calculator — Blocks, Backing & Binding",
    desc: "Free quilt calculator. Plan block rows, cut sizes, backing, batting, and binding fabric, then keep going in the QuiltFit iPhone app. No login needed.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["QuiltFit Calculator", "/quiltfit/"]]
  },
  "cutlist/index.html": {
    title: "Plywood Cutting Calculator & CutList Optimizer (Free)",
    desc: "Free plywood cutting calculator and CutList optimizer. Enter sheet size, parts, quantities, and kerf to plan cuts, sheets required, and waste in seconds.",
    bc: [["Home", "/"], ["Tools", "/tools/"], ["CutList Optimizer", "/cutlist/"]]
  },
  "compare/best-plywood-tools/index.html": {
    title: "Best Plywood Cutting Calculator Tools (2026 Compared)",
    desc: "Compare the best plywood cutting calculator tools for 2026: CutList optimizer, manual planning, generic calculators, and spreadsheets — pros and cons.",
    type: "article",
    bc: [["Home", "/"], ["Compare", "/compare/best-plywood-tools/"], ["Best Plywood Tools", "/compare/best-plywood-tools/"]]
  },
  "guides/how-to-cut-plywood-efficiently/index.html": {
    title: "How to Cut Plywood Efficiently & Cut Waste 30%+",
    desc: "Learn how to cut plywood efficiently: a sheet layout method, kerf planning, grain checks, and cut sequence that can cut waste 30% or more on real jobs.",
    type: "article",
    bc: [["Home", "/"], ["Guides", "/guides/how-to-cut-plywood-efficiently/"], ["How to Cut Plywood Efficiently", "/guides/how-to-cut-plywood-efficiently/"]]
  },
  "templates/4x8-plywood-sheet/index.html": {
    title: "Free 4x8 Plywood Cut List Template & Layout Tool",
    desc: "Free 4x8 plywood cut list template. Plan cabinet panels, shelves, and furniture parts with kerf, grain direction, and an optimized sheet cutting layout.",
    bc: [["Home", "/"], ["Templates", "/templates/4x8-plywood-sheet/"], ["4x8 Plywood Cut List", "/templates/4x8-plywood-sheet/"]]
  },
  "templates/kitchen-cabinet-cut-list/index.html": {
    title: "Kitchen Cabinet Cut List Template (Free Plywood Plan)",
    desc: "Free kitchen cabinet cut list template. Plan base and wall cabinet panels, shelves, and parts from plywood with kerf, grain direction, and less waste.",
    bc: [["Home", "/"], ["Templates", "/templates/kitchen-cabinet-cut-list/"], ["Kitchen Cabinet Cut List", "/templates/kitchen-cabinet-cut-list/"]]
  },
  "templates/workbench-cut-list/index.html": {
    title: "Workbench Cut List Template (Free Plywood Plan)",
    desc: "Free workbench cut list template. Plan a sturdy DIY plywood workbench: top, legs, shelf, and aprons with kerf, grain direction, and a simple cutting plan.",
    bc: [["Home", "/"], ["Templates", "/templates/workbench-cut-list/"], ["Workbench Cut List", "/templates/workbench-cut-list/"]]
  },
  // Hand-written app pages: keep their own title/desc, add OG + breadcrumb only.
  "apps/cutlist/index.html": {
    bc: [["Home", "/"], ["Apps", "/apps/"], ["CutList", "/apps/cutlist/"]]
  },
  "apps/quiltfit/index.html": {
    bc: [["Home", "/"], ["Apps", "/apps/"], ["QuiltFit", "/apps/quiltfit/"]]
  },
  "apps/pdfscanner/index.html": {
    bc: [["Home", "/"], ["Apps", "/apps/"], ["PDF Scanner", "/apps/pdfscanner/"]]
  },
  "apps/receipt/index.html": {
    bc: [["Home", "/"], ["Apps", "/apps/"], ["Receipt", "/apps/receipt/"]]
  },
  // Hand-written woodworking blog posts (not produced by build-blog-content).
  "blog/how-to-optimize-material-layout/index.html": {
    type: "article",
    bc: [["Home", "/"], ["Blogs", "/blog/"], ["How to Optimize Material Layout", "/blog/how-to-optimize-material-layout/"]]
  },
  "blog/wood-cutting-calculator-guide/index.html": {
    type: "article",
    bc: [["Home", "/"], ["Blogs", "/blog/"], ["Wood Cutting Calculator Guide", "/blog/wood-cutting-calculator-guide/"]]
  }
};

const OG_START = "<!-- og:start -->";
const OG_END = "<!-- og:end -->";
const BC_START = "<!-- breadcrumb:start -->";
const BC_END = "<!-- breadcrumb:end -->";

function esc(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function canonicalOf(html, file) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (m) return m[1];
  // fall back to deriving from file path
  const path = "/" + file.replace(/index\.html$/, "");
  return `https://woodcuttool.com${path === "/" ? "/" : path}`;
}

function metaOf(html, re) {
  const m = html.match(re);
  return m ? m[1] : "";
}

let warnings = 0;
for (const [file, cfg] of Object.entries(pages)) {
  const { title, desc, type = "website", bc } = cfg;
  const abs = join(root, file);
  let html = readFileSync(abs, "utf8");

  // 1. title + description (only when this entry provides them; some entries
  //    are OG/breadcrumb-only and keep their existing title/desc).
  if (title) {
    if (title.length > 60) console.warn(`! title >60 (${title.length}): ${file}`);
    if (desc.length >= 155) console.warn(`! desc >=155 (${desc.length}): ${file}`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${esc(desc)}">`
    );
  }

  // OG uses this entry's title/desc, or the page's existing tags as fallback.
  const ogTitle = title || metaOf(html, /<title>([^<]*)<\/title>/);
  const ogDesc = desc || metaOf(html, /<meta name="description" content="([^"]*)"/);

  // 2. Open Graph (idempotent, wrapped in markers, placed after canonical)
  const canonical = canonicalOf(html, file);
  const ogBlock = `${OG_START}\n  ${ogTags({ title: ogTitle, description: ogDesc, canonical, type })}\n  ${OG_END}`;
  if (html.includes(OG_START)) {
    html = html.replace(new RegExp(`${OG_START}[\\s\\S]*?${OG_END}`), ogBlock);
  } else {
    html = html.replace(
      /(<link rel="canonical" href="[^"]+">)/,
      `$1\n  ${ogBlock}`
    );
  }

  // 3. BreadcrumbList (idempotent, right after <body>)
  if (bc) {
    const bcBlock = `${BC_START}\n  ${breadcrumbJsonLd(bc)}\n  ${BC_END}`;
    if (html.includes(BC_START)) {
      html = html.replace(new RegExp(`${BC_START}[\\s\\S]*?${BC_END}`), bcBlock);
    } else {
      html = html.replace(/<body([^>]*)>/, `<body$1>\n  ${bcBlock}`);
    }
  }

  writeFileSync(abs, html);
  const tag = title ? `T[${title.length}] D[${desc.length}]` : "og-only";
  console.log(`ok  ${file}  ${tag}${bc ? " +bc" : ""}`);
}
console.log(warnings ? `Done with ${warnings} warning(s).` : "Done. All hand-written pages updated.");
