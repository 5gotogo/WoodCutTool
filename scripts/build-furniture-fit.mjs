import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { kinds, orientations } from "../assets/furniture-fit-core.js";
import { chapters, sources } from "./furniture-fit-data.mjs";

const root = join(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/furniture-fit/";
const name = "Furniture Fit & Delivery";
const date = "2026-11-13";
const image = origin + "/assets/og/woodcuttool-og.png";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const route = chapter => base + chapter.slug + "/";
const groupNames = {
  Measure: "Capture the real dimensions",
  Screen: "Compare the rectangular spans",
  Review: "Resolve the difficult movements",
  Decide: "Revise and hand off the plan"
};

function write(path, title, description, body, chapter) {
  const url = origin + path;
  const schema = { "@context": "https://schema.org", "@graph": [
    chapter
      ? { "@type": "Article", headline: title, description, url, author, image, datePublished: date, dateModified: date,
        ...(chapter.source ? { citation: sources[chapter.source][1] } : {}) }
      : { "@type": "CollectionPage", name, description, url, author, hasPart: chapters.map(item => ({
        "@type": "Article", headline: item.title, url: origin + route(item)
      })) },
    { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], [name, base], ...(chapter ? [[title, path]] : [])]
      .map(([label, href], index) => ({ "@type": "ListItem", position: index + 1, name: label, item: origin + href })) }
  ] };
  const dir = join(root, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)} | WoodCutTool</title>
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${chapter ? "article" : "website"}">
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
  <meta name="theme-color" content="#172e3a">
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/furniture-fit.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${chapter ? "" : '<script type="module" src="/assets/furniture-fit.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main class="ff" id="main">${body}</main>
  <div data-site-footer></div>
</body>
</html>
`.replace(/\s+\n/g, "\n"));
}

const numberField = (key, label) => `<label>${label} <small data-ff-unit>mm</small><input name="${key}" type="number" min="0" step="any" inputmode="decimal"></label>`;
const dimensionFields = (prefix = "") => ["width", "height", "depth"].map(axis => numberField(axis, prefix + axis)).join("");
const options = entries => Object.entries(entries).map(([key, { label }]) => `<option value="${key}">${label}</option>`).join("");
const byline = `<p class="ff-byline">By <a href="/about/">WoodCutTool editorial team</a> · <time datetime="${date}">November 13, 2026</time></p>`;

const hub = `
  <header class="ff-hero">
    <div class="ff-hero-copy">
      <p class="ff-kicker">From the shop to the room</p>
      <h1>Furniture Fit<br>&amp; Delivery</h1>
      <p>Measure the piece. Walk the route. Find the doorway, lift or recess that needs a closer look before delivery day.</p>
      <div class="ff-actions"><a class="ff-primary" href="#planner">Plan a delivery route</a><a href="#guides">Read the field guides ↓</a></div>
    </div>
    <figure class="ff-hero-figure">
      <div class="ff-drawing" aria-hidden="true"><div class="ff-opening"><div class="ff-cabinet"></div></div></div>
      <figcaption><strong>Building entry</strong><span>820 × 2,040 mm clear</span><span>440 × 1,480 mm cabinet profile</span></figcaption>
    </figure>
  </header>
  <section id="planner" class="ff-section" aria-labelledby="ff-planner-title">
    <div class="ff-section-heading"><div><p class="ff-kicker">Interactive worksheet</p><h2 id="ff-planner-title">Delivery route planner</h2><p>Start with the hall cabinet or enter your own route. Use the outer dimensions of the piece as it will be carried.</p></div>
    <div class="ff-actions"><button id="ff-sample" type="button">Load example</button><button id="ff-new" type="button">Start blank</button></div></div>
    <noscript><p>The route planner requires JavaScript. The <a href="${base}hall-cabinet-worked-example/">worked example</a> shows the measurements and calculations.</p></noscript>
    <form id="ff-piece" class="ff-piece" aria-labelledby="ff-piece-heading">
      <h3 id="ff-piece-heading">Piece being carried</h3>
      <div class="ff-piece-grid">
        <label>Piece name<input name="name" maxlength="100"></label>
        <label>Unit<select id="ff-unit"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
        ${dimensionFields("Piece ")}
        ${numberField("allowance", "Total allowance per axis")}
      </div>
      <p class="ff-help">Allowance is the extra gap required across each measured axis. Enter 0 to compare the spans alone. Enter dimensions as decimals.</p>
    </form>
    <div class="ff-workspace">
      <section class="ff-route-panel" aria-labelledby="ff-route-heading">
        <h3 id="ff-route-heading">Route checkpoints</h3>
        <p id="ff-summary" class="ff-help" aria-live="polite"></p>
        <p id="ff-transitions" class="ff-help" role="status" hidden></p>
        <ol id="ff-route"></ol>
        <button id="ff-add" type="button">+ Add checkpoint</button>
      </section>
      <div id="ff-editor" class="ff-editor" hidden>
        <form id="ff-stop" aria-labelledby="ff-stop-heading">
          <h3 id="ff-stop-heading" tabindex="-1">Edit checkpoint</h3>
          <div class="ff-stop-fields">
            <label>Checkpoint name<input name="name" maxlength="100"></label>
            <label>Type<select name="kind">${options(kinds)}</select></label>
            <label class="ff-span">Orientation<select name="orientation">${options(orientations)}</select></label>
          </div>
          <div class="ff-stop-dimensions">${dimensionFields("Clear ")}</div>
          <label>Survey notes<textarea name="note" maxlength="500" rows="3" placeholder="Obstruction, measurement location, or field review needed"></textarea></label>
          <div class="ff-actions"><button id="ff-up" type="button">Move earlier</button><button id="ff-down" type="button">Move later</button><button id="ff-remove" type="button">Remove</button></div>
        </form>
        <section class="ff-result" aria-label="Checkpoint result" id="ff-result" aria-live="polite"></section>
      </div>
    </div>
    <div class="ff-export">
      <div class="ff-actions"><button id="ff-csv" class="ff-primary" type="button">Download route CSV</button><button id="ff-backup" type="button">Save JSON backup</button><label class="ff-import">Import JSON backup<input id="ff-import" type="file" accept=".json,application/json"></label></div>
      <p class="ff-help" id="ff-storage"></p><p id="ff-status" role="status"></p>
    </div>
    <details class="ff-method">
      <summary>How to read the results</summary>
      <p>Each result compares the selected axis-aligned orientation with the measured clear rectangle. Doorways and straight passages check width and height. Lift interiors and final recesses also check depth. The result shows the remaining gap after subtracting the total allowance. Contact with a boundary leaves no clearance.</p>
      <p>Add a field review row for turns, stairs, tipping, and changes of orientation between checkpoints. Verify the space to enter and leave each checkpoint and the space needed by the crew and equipment. If the installed dimensions differ from the carry dimensions, export the carry plan and check the installed piece in a separate plan.</p>
    </details>
  </section>
  <section class="ff-example ff-section" aria-labelledby="ff-example-title">
    <div><p class="ff-kicker">Worked example</p><h2 id="ff-example-title">One cabinet.<br>Five checkpoints.</h2><p>A wrapped hall cabinet travels through a building entry and lift to a recessed wall. Its 440 mm depth makes the narrower profile for the entry.</p><a href="${base}hall-cabinet-worked-example/">Follow the full calculation →</a></div>
    <ol>
      <li><strong>Entry, lift door and cabin</strong><span>All three meet the selected 20 mm allowance in the specified orientation.</span></li>
      <li><strong>Hall corner</strong><span>Keep the turn open for site review and record the measurements and photos.</span></li>
      <li><strong>Final recess</strong><span>455 mm of clear depth leaves 15 mm around a 440 mm envelope. That is 5 mm below the selected allowance.</span></li>
    </ol>
  </section>
  <section class="ff-section" id="guides" aria-labelledby="ff-guides-title">
    <div class="ff-section-heading"><div><p class="ff-kicker">Ten field guides</p><h2 id="ff-guides-title">From the first measurement to handoff</h2></div></div>
    <div class="ff-guide-groups">${Object.entries(groupNames).map(([group, heading]) => `<section>
      <p class="ff-kicker">${group}</p><h3>${heading}</h3>
      ${chapters.filter(chapter => chapter.group === group).map(chapter => `<a href="${route(chapter)}"><strong>${escape(chapter.title)}</strong><span>${escape(chapter.summary)}</span></a>`).join("")}
    </section>`).join("")}</div>
    ${byline}
  </section>`;

write(base, name + " Route Planner", "Check furniture through doorways, straight passages, lifts and final recesses. Plan a delivery route, export checkpoints, and follow ten measuring guides.", hub);

for (const [index, chapter] of chapters.entries()) {
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const reference = chapter.source ? sources[chapter.source] : null;
  write(route(chapter), chapter.title, chapter.summary, `
    <header class="ff-article-header">
      <a href="${base}#guides">← Furniture Fit &amp; Delivery</a>
      <p class="ff-kicker">${chapter.group}</p><h1>${escape(chapter.title)}</h1><p class="ff-lead">${escape(chapter.summary)}</p>
      ${byline}
    </header>
    <div class="ff-reading">
      <nav aria-label="In this guide"><strong>In this guide</strong>
        ${chapter.sections.map(([heading], i) => `<a href="#section-${i + 1}">${escape(heading)}</a>`).join("")}
        <a href="#exercise">Field exercise</a><a href="${base}#planner">Open the route planner ↗</a>
      </nav>
      <article>
        ${chapter.sections.map(([heading, paragraph], i) => `<section id="section-${i + 1}"><h2>${escape(heading)}</h2><p>${escape(paragraph)}</p></section>`).join("")}
        <section class="ff-exercise" id="exercise"><h2>Field exercise</h2><p>${escape(chapter.exercise)}</p>
          <a href="${chapter.link?.[0] || base + "#planner"}">${chapter.link?.[1] || "Open the route planner"} →</a>
        </section>
        ${reference ? `<p class="ff-byline">Reference · <a href="${reference[1]}">${escape(reference[0])}</a></p>` : ""}
        <nav class="ff-pagination" aria-label="Guide navigation">
          <a href="${previous ? route(previous) : base + "#guides"}">← ${previous ? escape(previous.title) : "All guides"}</a>
          <a href="${next ? route(next) : base + "#planner"}">${next ? escape(next.title) : "Return to the planner"} →</a>
        </nav>
      </article>
    </div>`, chapter);
}

console.log(`Built Furniture Fit & Delivery and ${chapters.length} field guides.`);
