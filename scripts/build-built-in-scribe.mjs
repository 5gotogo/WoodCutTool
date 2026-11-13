import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { guides, installationGuide, stages } from "./built-in-scribe-data.mjs";

const root = join(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/built-in-scribe/";
const name = "Built-in Cabinet Scribing";
const date = "2026-11-13";
const hero = "/assets/images/learn/cabinet-planning-800.webp";
const image = origin + "/assets/images/learn/cabinet-planning.webp";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const route = guide => base + guide.slug + "/";
const byline = `<p class="scribe-byline">By <a href="/about/">WoodCutTool editorial team</a> · <time datetime="${date}">November 13, 2026</time></p>`;

function page(path, title, description, content, guide) {
  const url = origin + path;
  const schema = { "@context": "https://schema.org", "@graph": [
    guide
      ? { "@type": "Article", headline: title, description, url, author, image, datePublished: date, dateModified: date,
        ...(guide.reference ? { citation: installationGuide } : {}) }
      : { "@type": "CollectionPage", name, description, url, image, author, hasPart: guides.map(item => ({
        "@type": "Article", headline: item.title, url: origin + route(item)
      })) },
    { "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ["Tools", "/tools/"], [name, base], ...(guide ? [[title, path]] : [])]
      .map(([label, href], index) => ({ "@type": "ListItem", position: index + 1, name: label, item: origin + href })) }
  ] };
  const directory = join(root, path);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.html"), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | WoodCutTool</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${guide ? "article" : "website"}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#e8d9b4">
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/built-in-scribe.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${guide ? "" : '<script type="module" src="/assets/built-in-scribe.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main class="scribe" id="main">${content}</main>
  <div data-site-footer></div>
</body>
</html>
`.replace(/^ +\n/gm, ""));
}

const measure = (name, label) => `<label>${label} <small data-unit>mm</small><input name="${name}" type="number" min="0" step="any" inputmode="decimal"></label>`;
const figures = [
  ["min", "Narrowest gap"], ["max", "Widest gap"], ["range", "Measured variation"],
  ["required", "Required blank"], ["reserve", "Blank reserve"]
];

page(base, "Built-in Cabinet Scribing and Filler Planner",
  "Survey an uneven wall, size a cabinet filler blank, compare trimming allowances and export your readings. Includes ten installation guides.", `
  <header class="scribe-hero">
    <div>
      <p class="scribe-crumb"><a href="/tools/woodworking/">Woodworking tools</a> / Cabinet installation</p>
      <h1>Built-in cabinet scribing</h1>
      <p>Measure the gap between a straight cabinet and an uneven wall. Size the filler blank, then take the survey to the installation.</p>
      <div class="scribe-actions"><a class="scribe-button primary" href="#planner">Open filler planner</a><a href="#guides">Browse field guides</a></div>
    </div>
    <img src="${hero}" width="800" height="600" alt="" fetchpriority="high" decoding="async">
  </header>
  <section class="scribe-section" id="planner" aria-labelledby="planner-heading">
    <h2 id="planner-heading">Filler survey worksheet</h2>
    <p>Record one filler per worksheet. Measure every gap in the intended filler face plane from the same straight cabinet edge.</p>
    <noscript><p>The worksheet requires JavaScript. Use the <a href="${base}alcove-desk-filler-example/">worked example</a> for the calculation and field checks.</p></noscript>
    <div id="scribe-workspace" hidden>
      <div class="scribe-actions scribe-toolbar">
        <button type="button" id="scribe-example">Load example</button>
        <button type="button" id="scribe-new">Start blank</button>
        <small id="scribe-storage" role="status">Changes save in this browser.</small>
      </div>
      <div class="scribe-workspace">
        <form id="scribe-form" aria-label="Filler measurements">
          <h3>Blank and allowances</h3>
          <div class="scribe-fields">
            <label>Filler or part ID<input name="name" maxlength="100" type="text" autocomplete="off"></label>
            <label>Units<select name="unit"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
            <label class="scribe-datum">Datum and direction<input name="datum" maxlength="200" type="text" autocomplete="off"></label>
            ${measure("length", "Filler length")}
            ${measure("blank", "Usable blank width")}
            ${measure("trim", "Trimming allowance")}
            ${measure("uncertainty", "Measurement allowance")}
          </div>
          <h3>Gap readings</h3>
          <p class="scribe-help">Include both ends (zero and full length). Add stations at wall changes and enter gaps as decimals.</p>
          <div id="scribe-stations"></div>
          <button type="button" id="scribe-add">Add station</button>
          <template id="scribe-station">
            <fieldset class="scribe-station">
              <legend></legend>
              <label>Position <small data-unit>mm</small><input data-field="position" type="number" min="0" step="any" inputmode="decimal"></label>
              <label>Gap <small data-unit>mm</small><input data-field="gap" type="number" min="0" step="any" inputmode="decimal"></label>
              <button type="button">Remove</button>
            </fieldset>
          </template>
        </form>
        <section id="scribe-result" aria-labelledby="scribe-result-heading">
          <h3 id="scribe-result-heading">Blank check</h3>
          <p id="scribe-status" role="status"></p>
          <dl id="scribe-summary" hidden>${figures.map(([id, label]) => `<div><dt>${label}</dt><dd id="scribe-${id}"></dd></div>`).join("")}</dl>
          <ol id="scribe-chart" aria-label="Gap width at each measured position" hidden></ol>
          <p class="scribe-help">Bars show measured gaps. The dashed mark shows the blank width. Required blank width includes both allowances at the widest measured station.</p>
          <p class="scribe-help">Transfer the full wall profile on site and physically check hardware clearance before final fixing.</p>
          <button class="primary" id="scribe-export" type="button" disabled>Download survey CSV</button>
        </section>
      </div>
    </div>
  </section>
  <section class="scribe-section" id="guides" aria-labelledby="guide-heading">
    <h2 id="guide-heading">Field guides</h2>
    <div class="scribe-guide-grid">${stages.map(([stage, heading]) => `<section>
      <p class="scribe-stage">${stage}</p>
      <h3>${heading}</h3>
      ${guides.filter(guide => guide.stage === stage).map(guide => `<a href="${route(guide)}"><strong>${esc(guide.title)}</strong><span>${esc(guide.description)}</span></a>`).join("")}
    </section>`).join("")}</div>
    ${byline}
  </section>`);

for (const [index, guide] of guides.entries()) {
  const previous = guides[index - 1];
  const next = guides[index + 1];
  const anchor = heading => heading.toLowerCase().replaceAll(/[^a-z]+/g, "-");
  page(route(guide), guide.title, guide.description, `
    <header class="scribe-article-head">
      <p class="scribe-crumb"><a href="${base}#guides">${name}</a> / ${guide.stage}</p>
      <h1>${esc(guide.title)}</h1><p>${esc(guide.description)}</p>
      ${byline}
    </header>
    <div class="scribe-reading">
      <nav aria-label="In this guide">
        <strong>In this guide</strong>
        ${guide.sections.map(([heading]) => `<a href="#${anchor(heading)}">${esc(heading)}</a>`).join("")}
        <a href="#field-check">Field check</a>
        <a href="${base}#planner">Open filler planner</a>
      </nav>
      <article>
        ${guide.sections.map(([heading, copy]) => `<section id="${anchor(heading)}"><h2>${esc(heading)}</h2><p>${esc(copy)}</p></section>`).join("")}
        <section class="scribe-field-check" id="field-check"><h2>Field check</h2><p>${esc(guide.task)}</p>
          <a href="${base}#planner">Open the filler planner →</a></section>
        <p><a href="${guide.related[0]}">${esc(guide.related[1])}</a></p>
        ${guide.reference ? `<p>Reference <a href="${installationGuide}">IKEA SEKTION kitchen installation guide</a></p>` : ""}
        <nav class="scribe-pagination" aria-label="Guide navigation">
          <a href="${previous ? route(previous) : base + "#guides"}">← ${previous ? esc(previous.title) : "All guides"}</a>
          <a href="${next ? route(next) : base + "#guides"}">${next ? esc(next.title) : "All guides"} →</a>
        </nav>
      </article>
    </div>`, guide);
}
console.log(`Built ${name} and ${guides.length} field guides.`);
