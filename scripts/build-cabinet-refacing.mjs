import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { edges, sample } from "../assets/cabinet-refacing-core.js";
import { chapters, phases, sources } from "./cabinet-refacing-data.mjs";

const root = resolve(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/cabinet-refacing/";
const date = "2026-11-19";
const photo = "/assets/images/woodworking/wood-02-cabinet-hardware";
const image = origin + photo + ".webp";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };
const chapterRoute = ({ slug }) => base + slug + "/";
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = ([label, url]) => `<a href="${escape(url)}">${escape(label)}</a>`;
const byline = `<p class="cr-byline">By ${link([author.name, "/about/"])} · <time datetime="${date}">${date}</time></p>`;

function writePage({ route, title, description, content, chapter = null }) {
  const url = origin + route;
  const breadcrumbs = [["Home", "/"], ["Cabinet Refacing", base]];
  if (chapter) breadcrumbs.push([title, route]);
  const schema = { "@context": "https://schema.org", "@graph": [
    chapter
      ? { "@type": "Article", headline: title, description, url, author, image, datePublished: date,
          dateModified: date, ...(chapter.source ? { citation: sources[chapter.source][1] } : {}) }
      : { "@type": "CollectionPage", name: title, description, url, author, image,
          hasPart: chapters.map((item) => ({ "@type": "Article", headline: item.title, url: origin + chapterRoute(item) })) },
    { "@type": "BreadcrumbList", itemListElement: breadcrumbs.map(([name, path], index) => ({
      "@type": "ListItem", position: index + 1, name, item: origin + path
    })) }
  ] };
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
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
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/cabinet-refacing.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${chapter ? "" : '<script type="module" src="/assets/cabinet-refacing.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main" class="cr">${content}</main>
  <div data-site-footer></div>
</body>
</html>
`;
  const directory = resolve(root, "." + route);
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, "index.html"), html.replace(/[ \t]+$/gm, ""));
}

const measurement = (name, label, min, id = "") => `<label${id ? ` id="${id}"` : ""}>${label}<input name="${name}" type="number" inputmode="decimal" required min="${min}" max="10000" step="0.0001"></label>`;

const worksheet = `<section class="cr-width cr-section" id="worksheet" aria-labelledby="cr-worksheet-title">
  <header class="cr-section-head"><div><h2 id="cr-worksheet-title">Replacement door worksheet</h2>
    <p>Size one door or an equal pair over a verified rectangular opening. Save each opening to build a door schedule in this browser.</p></div>
    <button type="button" id="cr-example">Load B03 example</button>
  </header>
  <noscript><p>Enable JavaScript to calculate and save a schedule. The worked example shows how to calculate dimensions by hand.</p><style>#cr-interactive,#cr-example{display:none}</style></noscript>
  <div id="cr-interactive">
    <div class="cr-workspace">
      <form id="cr-form" class="cr-form">
        <fieldset><legend>Opening and front type</legend><div class="cr-fields">
          <label>Opening ID<input name="label" maxlength="64" placeholder="e.g. B03" required></label>
          <label>Units<select name="unit" aria-describedby="cr-unit-help"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
          <label>Front position<select name="mode"><option value="overlay">Overlay</option><option value="inset">Inset</option></select></label>
          <label>Door layout<select name="layout"><option value="pair">Equal pair</option><option value="single">Single door</option></select></label>
          ${measurement("width", "Opening width", 0.0001)}
          ${measurement("height", "Opening height", 0.0001)}
        </div><p class="cr-hint" id="cr-unit-help">Use the same units for all measurements in an opening. Changing units keeps the entered numbers.</p></fieldset>
        <fieldset><legend id="cr-edge-caption">Edge overlays</legend><p class="cr-hint" id="cr-edge-help">Enter how far each front edge extends past the finished opening.</p>
          <div class="cr-fields">
            ${edges.map((edge) => measurement(edge, edge[0].toUpperCase() + edge.slice(1), 0)).join("\n            ")}
            ${measurement("gap", "Center gap", 0.0001, "cr-gap-field")}
          </div>
        </fieldset>
        <div class="cr-actions"><button id="cr-save" class="cr-primary" type="submit" disabled>Add to schedule</button><button id="cr-cancel" type="button" hidden>Cancel edit</button></div>
      </form>
      <section class="cr-preview" aria-labelledby="cr-preview-title">
        <h3 id="cr-preview-title">Front elevation</h3>
        <p id="cr-preview" aria-live="polite"></p>
        <div id="cr-diagram-box" hidden>
          <div class="cr-diagram-space" aria-hidden="true"><div id="cr-diagram"></div></div>
          <p class="cr-legend"><span>Door face</span><span>Opening outline</span></p>
        </div>
        <p class="cr-hint">Dimensions are width × height. Check hinge and plate requirements, finished thickness, neighboring pulls and door swing on a fitted mock-up before ordering.</p>
      </section>
    </div>
    <section class="cr-schedule" aria-labelledby="cr-schedule-title">
      <div class="cr-section-head"><div><h3 id="cr-schedule-title">Door schedule</h3><p>The CSV lists each leaf separately and keeps the opening measurements and allowances alongside it.</p></div>
        <button id="cr-export" type="button" disabled>Download schedule CSV</button>
      </div>
      <p id="cr-status" role="status"></p>
      <p id="cr-empty">No openings saved yet.</p><ul id="cr-schedule-list"></ul>
    </section>
  </div>
</section>`;

const hub = `<header class="cr-hero">
  <div class="cr-width cr-hero-grid"><div class="cr-hero-copy">
    <p class="cr-kicker">Cabinetry field guide</p>
    <h1>Cabinet Refacing</h1>
    <p>Keep the cabinet boxes that still work. Survey the openings, check a trial door, and build a replacement schedule for the whole run.</p>
    <div class="cr-actions"><a class="cr-primary" href="#worksheet">Open the door worksheet</a><a href="#field-guides">Browse the field guides</a></div>
  </div>
  <picture><source type="image/avif" srcset="${photo}-480.avif 480w, ${photo}-960.avif 960w" sizes="(max-width: 760px) calc(100vw - 2rem), 46vw">
    <img src="${photo}-480.webp" width="480" height="360" fetchpriority="high" alt="Wood cabinet door, drawer front, concealed hinges and pulls on a workbench">
  </picture></div>
</header>
${worksheet}
<section class="cr-width cr-case" aria-labelledby="cr-case-title">
  <div><p class="cr-kicker">Worked example · B03</p><h2 id="cr-case-title">Two doors, one opening</h2>
    <p>A 600 × 700 mm opening and four measured overlays give a 624 × 718 mm front span. Reserve 3 mm in the center and each door is 310.5 × 718 mm.</p>
    ${link(["Follow the B03 example", chapterRoute(chapters.at(-1))])}</div>
  <dl><div><dt>Finished opening</dt><dd>${sample.width} × ${sample.height} mm</dd></div>
    <div><dt>Side / top / bottom overlays</dt><dd>${sample.left} / ${sample.top} / ${sample.bottom} mm</dd></div>
    <div><dt>Center gap</dt><dd>${sample.gap} mm</dd></div></dl>
</section>
<section class="cr-width cr-section" id="field-guides">
  <h2>From survey to installation</h2>
  <div class="cr-chapters">${phases.map(([phase, summary]) => `<section class="cr-phase">
    <div><h3>${phase}</h3><p>${summary}</p></div>
    ${chapters.filter((chapter) => chapter.phase === phase).map((chapter) => `<a href="${chapterRoute(chapter)}"><strong>${escape(chapter.title)}</strong><span>${escape(chapter.summary)}</span></a>`).join("\n    ")}
  </section>`).join("\n  ")}</div>
  ${byline}
  <nav class="cr-related" aria-label="Related cabinet tools">${[
    ["Design a new cabinet in Cabinet Studio", "/cabinet-studio/"],
    ["Check existing drawers in Drawer Fit Studio", "/drawer-fit/"],
    ["Plan the parts of a cabinet door", "/cabinet-door-calculator/"],
    ["Map hinge cups and record the installed reveals", "/door-installation/"]
  ].map(link).join("\n    ")}</nav>
</section>`;

writePage({
  route: base, title: "Cabinet Refacing & Replacement Door Worksheet",
  description: "Plan a cabinet refacing project with eight field guides, an interactive overlay and inset door worksheet, and a downloadable door schedule.",
  content: hub
});

for (const [index, chapter] of chapters.entries()) {
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  writePage({ route: chapterRoute(chapter), title: chapter.title, description: chapter.summary, chapter,
    content: `<header class="cr-article-top"><div class="cr-width">
      <p>${link(["Cabinet Refacing", base])} <span aria-hidden="true">/</span> ${chapter.phase}</p>
      <h1>${escape(chapter.title)}</h1><p class="cr-lead">${escape(chapter.summary)}</p>
      ${byline}
    </div></header>
    <div class="cr-width cr-reading"><nav aria-label="On this page">
      ${chapter.sections.map(([heading], i) => link([heading, "#section-" + (i + 1)])).join("\n      ")}
      ${link(["Before you proceed", "#checkpoint"])}
    </nav><article>
      ${chapter.sections.map(([heading, body], i) => `<section id="section-${i + 1}"><h2>${escape(heading)}</h2><p>${escape(body)}</p></section>`).join("\n      ")}
      <aside class="cr-checkpoint" id="checkpoint"><h2>Before you proceed</h2><p>${escape(chapter.check)}</p></aside>
      ${chapter.source ? `<p class="cr-reference">Reference · ${link(sources[chapter.source])}</p>` : ""}
      <nav class="cr-related" aria-label="Put the guide into practice">
        ${link(chapter.related)}
        ${index === chapters.length - 1 ? "" : link(["Open the replacement door worksheet", base + "#worksheet"])}
      </nav>
      <nav class="cr-pagination" aria-label="Chapter navigation">
        ${link(previous ? [previous.title, chapterRoute(previous)] : ["All field guides", base + "#field-guides"])}
        ${link(next ? [next.title, chapterRoute(next)] : ["All field guides", base + "#field-guides"])}
      </nav>
    </article></div>`
  });
}
console.log(`Built Cabinet Refacing and ${chapters.length} field guides.`);
