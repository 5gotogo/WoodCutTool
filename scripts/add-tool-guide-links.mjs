// One-off: inject a "Related guides" block (tool -> specific /learn articles)
// into each tool page, fixing G1 (tools only linked /learn/ hub) and
// G3 (stair/tile/quiltfit had no inbound article links — covered by reverse
// links added in build-learn-content.mjs). Idempotent: re-running replaces
// the existing injected block instead of duplicating it.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// tool file -> [ [articleSlug, anchorText], ... ]  (varied, keyword-bearing anchors)
const map = {
  "plywood-cut-calculator/index.html": [
    ["plywood-cutting-optimization", "Plywood cutting optimization guide"],
    ["how-many-sheets-of-plywood-do-i-need", "How many sheets of plywood do I need?"],
    ["sheet-layout-optimization", "Sheet layout optimization"]
  ],
  "cut-list-calculator/index.html": [
    ["how-to-read-a-cut-list", "How to read a cut list"],
    ["cut-list-planner", "Cut list planner workflow"],
    ["what-is-cut-list-optimization", "What is cut list optimization"]
  ],
  "wood-waste-calculator/index.html": [
    ["how-to-reduce-plywood-waste", "How to reduce plywood waste"],
    ["saw-kerf-explained", "Saw kerf explained"],
    ["sheet-layout-optimization", "Sheet layout optimization"]
  ],
  "board-foot-calculator/index.html": [
    ["material-estimation-for-carpentry", "Material estimation for carpentry"],
    ["woodworking-material-calculator", "Woodworking material calculator workflow"]
  ],
  "stair-stringer-calculator/index.html": [
    ["diy-workshop-planning-guide", "DIY workshop planning guide"],
    ["material-estimation-for-carpentry", "Material estimation for carpentry"]
  ],
  "tile-calculator/index.html": [
    ["material-estimation-for-carpentry", "Material estimation for carpentry"],
    ["diy-wood-project-estimation", "DIY wood project estimation"]
  ],
  "stringer/index.html": [
    ["diy-workshop-planning-guide", "DIY workshop planning guide"]
  ],
  "quiltfit/index.html": [
    ["best-woodworking-calculator-workflow", "Best woodworking calculator workflow"],
    ["diy-wood-project-estimation", "DIY wood project estimation"]
  ]
};

const START = "<!-- related-guides:start -->";
const END = "<!-- related-guides:end -->";

function escapeHtml(v) {
  return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function block(links) {
  const cards = links
    .map(
      ([slug, label]) =>
        `<article class="card"><h2>${escapeHtml(label)}</h2><a class="card-link" href="/learn/${slug}/">Read the ${escapeHtml(label.toLowerCase())} guide</a></article>`
    )
    .join("");
  return `${START}
    <section class="section"><div class="section-heading compact"><p class="eyebrow">Related guides</p><h2>Learn the method behind this calculator.</h2></div><div class="grid tools">${cards}</div></section>
  ${END}`;
}

let changed = 0;
for (const [file, links] of Object.entries(map)) {
  const abs = join(root, file);
  let html = readFileSync(abs, "utf8");
  const injected = block(links);

  if (html.includes(START)) {
    html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}`), injected);
  } else {
    // insert right before </main>
    html = html.replace("</main>", `${injected}\n  </main>`);
  }
  writeFileSync(abs, html);
  changed++;
  console.log(`updated ${file} (${links.length} guide links)`);
}
console.log(`Done. ${changed} tool pages updated.`);
