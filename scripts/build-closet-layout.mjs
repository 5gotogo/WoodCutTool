import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bayTypes, formatDimension, partsCsv, planCloset, presets } from "../assets/closet-layout-core.js";
import { examples, guides, stages } from "./closet-layout-data.mjs";

const root = resolve(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/closet-layout/";
const date = "2026-11-22";
const photo = "/assets/images/closet-layout/maple-closet";
const image = origin + photo + ".webp";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };
const guidePath = slug => base + slug + "/";
const examplePath = key => base + "example-" + key + "/";
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = (label, href) => `<a href="${escape(href)}">${escape(label)}</a>`;
const byline = `<p class="cl-byline">By ${link(author.name, "/about/")} · <time datetime="${date}">November 22, 2026</time></p>`;
const title = "Closet Layout Planner and Build Guides";
const list = [
  ...guides.map(guide => ({ title: guide.title, path: guidePath(guide.slug) })),
  ...examples.map(example => ({ title: example.title, path: examplePath(example.key) }))
];

if (new Set(list.map(item => item.path)).size !== list.length) throw new Error("Duplicate closet route");

function write(path, filename, body) {
  const dir = resolve(root, "." + path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, filename), body);
}

function page({ path, title, description, content, item }) {
  const url = origin + path;
  const crumbs = [["Home", "/"], ["Woodworking Tools", "/tools/woodworking/"], ["Closet Layout", base]];
  if (item) crumbs.push([title, path]);
  const schema = { "@context": "https://schema.org", "@graph": [
    item
      ? { "@type": "Article", headline: title, description, url, image, author, datePublished: date, dateModified: date,
          ...(item.source && { citation: item.source[1] }) }
      : { "@type": "CollectionPage", name: title, description, url, image, author,
          hasPart: list.map(entry => ({ "@type": "Article", headline: entry.title, url: origin + entry.path })) },
    { "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, route], index) => ({
      "@type": "ListItem", position: index + 1, name, item: origin + route
    })) }
  ] };
  write(path, "index.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | WoodCutTool</title>
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${item ? "article" : "website"}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/closet-layout.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${item ? "" : '<script type="module" src="/assets/closet-layout.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main class="cl" id="main">${content}</main>
  <div data-site-footer></div>
</body>
</html>
`.replace(/[ \t]+$/gm, ""));
}

const input = (key, label) => `<label>${label}<input type="number" name="${key}" min="0" step="any" inputmode="decimal" data-dimension required></label>`;
const table = (id, label, columns, body = "") => `<div class="cl-scroll" tabindex="0" role="region" aria-label="${label}"><table>
  <thead><tr>${columns.map(column => `<th scope="col">${column}</th>`).join("")}</tr></thead>
  <tbody${id ? ` id="${id}"` : ""}>${body}</tbody>
</table></div>`;
const partColumns = ["Part", "Qty", "Length", "Depth", "Thickness"];
const sampleOptions = Object.entries(presets).map(([key, preset]) => `<option value="${key}">${escape(preset.title)}</option>`).join("");

const planner = `<section class="cl-width cl-section" id="planner" aria-labelledby="cl-planner-title">
  <h2 id="cl-planner-title">Calculate a straight closet run</h2>
  <p class="cl-intro">Plan up to eight bays with a shared upright between neighbors. Use an opening measured at the installation plane. For a walk-in with returns, calculate each wall after reserving its corner clearance.</p>
  <noscript><p>The calculator uses JavaScript. The ${link("worked layouts", "#examples")} include the calculations and downloadable schedules.</p><style>.cl-workspace{display:none}</style></noscript>
  <div class="cl-workspace">
    <form class="cl-panel cl-form" id="cl-form">
      <div class="cl-fields cl-controls">
        <label>Units<select name="unit"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
        <label>Worked layout<select id="cl-preset">${sampleOptions}</select></label>
        <button type="button" id="cl-load">Load example</button>
      </div>
      <fieldset><legend>Measured opening</legend>
        <p>Supply widths at the tightest verified front or rear plane. Enter usable height and depth after fit and obstruction allowances.</p>
        <div class="cl-fields">
          ${input("low", "Low width")}${input("middle", "Middle width")}${input("high", "High width")}
          ${input("maxHeight", "Usable height")}${input("maxDepth", "Usable depth")}
        </div>
      </fieldset>
      <fieldset><legend>Uprights and shelf blanks</legend>
        <div class="cl-fields">
          ${input("height", "Upright height")}${input("depth", "Upright depth")}${input("thickness", "Panel thickness")}
          ${input("left", "Left filler allowance")}${input("right", "Right filler allowance")}
          ${input("shelfGap", "Total shelf side clearance")}${input("setback", "Shelf front setback")}
        </div>
        <p>Shelf side clearance is the total across both ends. Setback assumes a shelf flush with the rear edge of the upright.</p>
      </fieldset>
      <div class="cl-bay-header"><h3>Bays, left to right</h3><button type="button" id="cl-add">Add bay</button></div>
      <p id="cl-bay-help">Blank widths share the remaining space equally. In hanging bays, shelf marks represent upper shelves.</p>
      <div id="cl-bays"></div>
      <div class="cl-form-end"><p class="cl-byline" id="cl-storage"></p>${link("View results", "#cl-result-title")}</div>
    </form>
    <section class="cl-panel cl-results" aria-labelledby="cl-result-title">
      <h3 id="cl-result-title">Width budget</h3>
      <p id="cl-status" role="status"></p>
      <div id="cl-output" hidden>
        <dl id="cl-budget" class="cl-budget"></dl>
        <figure class="cl-figure">
          <div id="cl-elevation" aria-hidden="true"></div>
          <figcaption>Front view with proportional widths and schematic shelf and rod heights. Olive marks are rods, wood marks are panels, and dashed areas are filler allowances or unallocated space.</figcaption>
        </figure>
        <h3>Clear bay dimensions</h3>
        ${table("cl-bay-results", "Clear bay dimensions", ["Bay", "Use", "Width", "Shelves", "From left wall"])}
        <h3>Preliminary panel schedule</h3>
        ${table("cl-parts", "Panel schedule", partColumns)}
        <p>The schedule covers rectangular upright and shelf blanks. Plan fillers, joinery, edging, bracing, backs, bases, rods and attachment separately. Verify panel fit and hardware before machining.</p>
        <button type="button" class="cl-button" id="cl-export" disabled>Download panel CSV</button>
      </div>
    </section>
  </div>
  <template id="cl-bay-template"><fieldset class="cl-bay">
    <legend></legend>
    <div class="cl-fields">
      <label>Use<select data-bay="type">${Object.entries(bayTypes).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}</select></label>
      <label>Clear width<input type="number" inputmode="decimal" step="any" min="0" data-dimension data-bay="width" placeholder="Automatic" aria-describedby="cl-bay-help"></label>
      <label>Shelves<input type="number" inputmode="numeric" min="0" max="20" step="1" data-bay="shelves" required></label>
    </div>
    <button type="button" data-remove>Remove</button>
  </fieldset></template>
</section>`;

const card = (item, path) => `<a class="cl-card" href="${path}"><strong>${escape(item.title)}</strong><span>${escape(item.summary)}</span></a>`;
const stageLinks = stages.map(stage => link(stage.title, "#" + stage.id)).join("");
page({
  path: base, title,
  description: "Calculate closet bay widths and shared upright panels, preview a straight run, and follow practical guides from field measurements to installation.",
  content: `<header class="cl-hero"><div class="cl-width cl-hero-grid">
    <div>
      <nav class="cl-crumb" aria-label="Breadcrumb">${link("Woodworking Tools", "/tools/woodworking/")} / Closet Layout</nav>
      <h1>Build a closet that fits the room</h1>
      <p class="cl-lead">Turn field measurements into a layout for hanging and shelves. Check door access, calculate panel sizes, and carry the plan from the first site visit to the final fit.</p>
      <div class="cl-actions"><a class="cl-button" href="#planner">Plan a closet run</a>${link("See the worked layouts", "#examples")}</div>
    </div>
    <figure class="cl-cover"><img src="${photo}.webp" srcset="${photo}-640.webp 640w, ${photo}.webp 1200w" sizes="(max-width: 800px) calc(100vw - 36px), 600px" width="1200" height="800" fetchpriority="high" alt="Maple closet with double hanging, a central shelf tower and a long coat bay"></figure>
  </div></header>
  <nav class="cl-width cl-jump" aria-label="Closet build stages">${stageLinks}</nav>
  ${planner}
  <section class="cl-width cl-section" id="examples"><h2>Worked layouts</h2>
    <p class="cl-intro">Each layout includes its width calculation, panel schedule and a field check. Load any of them into the planner to adapt the dimensions.</p>
    <div class="cl-grid">${examples.map(item => card(item, examplePath(item.key))).join("\n    ")}</div>
  </section>
  <div class="cl-guide-band">
    ${stages.map(stage => `<section class="cl-width cl-section" id="${stage.id}">
      <h2>${stage.title}</h2><p class="cl-intro">${stage.intro}</p>
      <div class="cl-grid">${guides.filter(guide => guide.stage === stage.id).map(item => card(item, guidePath(item.slug))).join("\n      ")}</div>
    </section>`).join("\n    ")}
    <div class="cl-width cl-section">${byline}<nav class="cl-jump" aria-label="Related woodworking tools">
      ${link("Plan wall fillers", "/built-in-scribe/")}
      ${link("Lay out shelf pins", "/shelf-pin-layout/")}
      ${link("Check shelf sag", "/shelf-sag-calculator/")}
      ${link("Lay out parts on plywood", "/plywood-cut-calculator/")}
    </nav></div>
  </div>`
});

function article(item, path, category, categoryPath, extra, action, related) {
  page({
    path, item, title: item.title, description: item.summary,
    content: `<header class="cl-article-hero"><div class="cl-width">
      <nav class="cl-crumb" aria-label="Breadcrumb">${link("Closet Layout", base)} / ${link(category, categoryPath)}</nav>
      <h1>${escape(item.title)}</h1><p class="cl-lead">${escape(item.summary)}</p>${byline}
    </div></header>
    <div class="cl-width cl-reading">
      <nav aria-label="On this page">${item.sections.map(([heading], i) => link(heading, "#step-" + (i + 1))).join("")}
        ${extra ? link("Panel schedule", "#schedule") : ""}${link("Field check", "#field-check")}
      </nav>
      <article>
        ${item.sections.map(([heading, text], i) => `<section id="step-${i+1}"><h2>${escape(heading)}</h2><p>${escape(text)}</p></section>`).join("\n        ")}
        ${extra}
        <aside class="cl-check" id="field-check"><h2>Field check</h2><p>${escape(item.check)}</p></aside>
        ${item.source ? `<p>${link(...item.source)}</p>` : ""}
        <div class="cl-actions">${action}${related.map(([name, url]) => link(name, url)).join("")}</div>
      </article>
    </div>`
  });
}

for (const [index, guide] of guides.entries()) {
  const stage = stages.find(stage => stage.id === guide.stage);
  const next = guides[index + 1];
  article(guide, guidePath(guide.slug), stage.title, base + "#" + stage.id, "",
    `<a class="cl-button" href="${base}#planner">Open the closet planner</a>`,
    [guide.related, next ? [next.title, guidePath(next.slug)] : ["Read the worked layouts", base + "#examples"]]);
}

for (const example of examples) {
  const path = examplePath(example.key);
  const plan = planCloset(presets[example.key]);
  if (plan.error) throw new Error(`${example.key}: ${plan.error}`);
  const schedule = `<section id="schedule"><h2>Preliminary panel schedule</h2>
    ${table("", "Panel schedule in millimeters", partColumns, plan.parts.map(part => `<tr><th scope="row">${part.part}</th><td>${part.quantity}</td>${
      [part.length, part.depth, part.thickness].map(mm => `<td>${formatDimension(mm, "mm")} mm</td>`).join("")
    }</tr>`).join(""))}
    <p><a href="${path}panels.csv" download>Download this example’s panel CSV</a></p></section>`;
  const related = guides.find(guide => guide.slug === example.related);
  article(example, path, "Worked layouts", base + "#examples", schedule,
    `<a class="cl-button" href="${base}?example=${example.key}#planner">Load this layout in the planner</a>`,
    [[related.title, guidePath(related.slug)]]);
  write(path, "panels.csv", partsCsv(plan.parts, "mm").replaceAll("\r\n", "\n"));
}

console.log(`Built the closet planner, ${guides.length} guides and ${examples.length} worked layouts with CSV downloads.`);
