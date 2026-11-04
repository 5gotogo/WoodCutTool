import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { groups } from "../assets/solid-wood-milling-core.js";
import { chapters } from "./solid-wood-milling-data.mjs";

const root = resolve(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/solid-wood-milling/";
const date = "2026-11-04";
const image = origin + "/assets/og/woodcuttool-og.png";
const source = "https://www.woodcraft.com/blogs/magazine/dressing-stock";
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const chapterRoute = (chapter) => base + chapter.slug + "/";
const number = (index) => String(index + 1).padStart(2, "0");
const phases = [
  ["Survey", "Measure the stock and map the usable zones."],
  ["Budget", "Allow for cleanup, kerf and flattening."],
  ["Mill", "Carry reference surfaces through a staged batch."],
  ["Verify", "Compare the trial and final parts with the drawing."]
];

function page({ route, title, summary, body, chapter }) {
  const url = origin + route;
  const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };
  const bread = [["Home", "/"], ["Solid Wood Milling", base]];
  if (chapter) bread.push([title, route]);
  const schema = { "@context": "https://schema.org", "@graph": [
    chapter
      ? { "@type": "Article", headline: title, description: summary, url, author, image, datePublished: date, dateModified: date, citation: source }
      : { "@type": "CollectionPage", name: title, description: summary, url, author, hasPart: chapters.map((item) => ({ "@type": "Article", headline: item.title, url: origin + chapterRoute(item) })) },
    { "@type": "BreadcrumbList", itemListElement: bread.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: origin + path })) }
  ] };
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)} | WoodCutTool</title>
  <meta name="description" content="${escape(summary)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${chapter ? "article" : "website"}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(summary)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(summary)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#17352d">
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/solid-wood-milling.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${chapter ? "" : '<script type="module" src="/assets/solid-wood-milling.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main" class="milling">${body}</main>
  <div data-site-footer></div>
</body>
</html>
`;
  const dir = resolve(root, "." + route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html.replace(/[ \t]+$/gm, ""));
}

const art = `<svg class="milling-art" viewBox="0 0 550 400" role="img" aria-labelledby="milling-fig">
  <title id="milling-fig">Illustration of a rough board, two reference surfaces and a batch of squared apron blanks</title>
  <defs>
    <pattern id="milling-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#829b80" stroke-opacity=".26"/></pattern>
    <linearGradient id="milling-grain" x2="0%" y2="100%"><stop stop-color="#edb875"/><stop offset="1" stop-color="#a96137"/></linearGradient>
  </defs>
  <path fill="url(#milling-grid)" d="M0 0h550v400H0z"/>
  <g transform="translate(60 48) skewX(-29)">
    <path fill="#7d472e" d="M48 55h420v20H48z"/>
    <path fill="url(#milling-grain)" d="m45 0 72 5 67-4 62 6 90-5 134 4-2 49-113-3-60 4-87-4-79 5-81-2z"/>
    <path d="M62 24q72-17 155-5t143-3l93 6M56 37q104-14 183-2t129-3l87 5" fill="none" stroke="#793f26" stroke-opacity=".65"/>
  </g>
  <g transform="translate(60 151) skewX(-29)">
    <path fill="#e9ad6b" d="M48 0h420v49H48z"/><path fill="#9d5937" d="M48 49h420v17H48z"/>
    <path d="M65 21q52-12 145-4t237-2M48 48h420" stroke="#feefce" stroke-width="2" fill="none"/>
  </g>
  <g transform="translate(70 251) skewX(-29)" fill="#edbc83" stroke="#a9653d" stroke-width="2">
    <rect x="48" width="131" height="32"/><rect x="190" width="131" height="32"/><rect x="332" width="131" height="32"/>
    <rect x="48" y="43" width="131" height="32"/><rect x="190" y="43" width="131" height="32"/><rect x="332" y="43" width="131" height="32"/>
  </g>
  <g fill="#e7d8b9" font-family="monospace" font-size="13" letter-spacing="1.4">
    <text x="20" y="29">01 / ROUGH BOARD</text><text x="20" y="135">02 / REFERENCE SURFACES</text>
    <text x="20" y="236">03 / REPEATED BLANKS</text><text x="20" y="378">FIG. 01 · STOCK PREPARATION STUDY</text>
  </g>
</svg>`;

const form = `<section id="planner" class="milling-section">
  <p class="milling-kicker">Interactive worksheet</p>
  <h2>Board Yield Planner</h2>
  <p class="milling-lead">Estimate how many identical blanks one measured board can supply. Start with the side-table apron example or replace the dimensions with your own.</p>
  <noscript><p>The worksheet requires JavaScript. The worked example below shows the same calculation by hand.</p></noscript>
  <div class="milling-workspace">
    <form id="milling-form">
      <div class="milling-form-top"><label for="milling-unit">Dimensions
        <select name="unit" id="milling-unit"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
        <button class="milling-secondary" type="button" id="milling-sample">Load apron example</button>
      </div>
      <p class="milling-help">Unit changes convert dimensions to three decimal places. Recheck exact boundaries in the unit you measured.</p>
      ${groups.map(([heading, fields]) => `<fieldset><legend>${heading}</legend><div class="milling-inputs">
        ${fields.map(([key, label, value, optionalZero]) => `<label>${label}${key === "quantity" ? "" : ' <small data-unit>mm</small>'}
          <input name="${key}" type="number" step="${key === "quantity" ? 1 : 0.001}" min="${optionalZero ? 0 : key === "quantity" ? 1 : 0.001}" max="50000" value="${value}" required></label>`).join("\n")}
      </div></fieldset>`).join("\n")}
    </form>
    <div class="milling-results">
      <p class="milling-kicker">Estimated yield · one board</p>
      <div id="milling-result" aria-live="polite"></div>
      <div class="milling-export"><button id="milling-csv" type="button" disabled>Download plan CSV</button><p id="milling-status"></p></div>
    </div>
  </div>
  <details class="milling-method"><summary>Calculation and physical checks</summary>
    <p>Subtract total end and edge reserves from the measured board. Add the per-blank cleanup allowances to the finished length and width. Then add one kerf to each blank slot in both directions, including the final slot. Include stock-trimming kerf in the end and edge reserves.</p>
    <p>Divide each usable axis by its slot dimension and round down. Multiply crosscut positions by rip lanes, keeping the blank length parallel to the board. If board thickness minus removal falls below the target, the screen reports zero candidates at the target thickness.</p>
    <p>Use one clear rectangular board or one separately measured segment. Inspect defects, grain and warp in the actual footprints. Check the clean thickness on a trial blank, and use your equipment documentation for workpiece limits and setup.</p>
  </details>
</section>`;

const hub = `<header class="milling-hero">
  <div class="milling-hero-copy"><p class="milling-kicker">WoodCutTool · The stock preparation series</p>
    <h1>Solid Wood<br>Milling</h1>
    <p>Turn a rough-sawn board into a measured batch of parts. Survey the stock, set your allowances and check what will reach finished size.</p>
    <div class="milling-actions"><a class="milling-button" href="#planner">Plan board yield ↓</a><a href="#chapters">Read the eight guides ↓</a></div>
  </div>
  <figure>${art}</figure>
</header>
<div class="milling-phases">${phases.map(([phase, summary], index) => `<a href="#phase-${phase.toLowerCase()}"><small>${number(index)}</small><strong>${phase}</strong><span>${summary}</span></a>`).join("")}</div>
${form}
<section id="example" class="milling-section milling-example">
  <div><p class="milling-kicker">The running example</p><h2>Four aprons.<br>One rough board.</h2><p>Follow a square side table through the series. The sample asks for four finished 420 × 65 × 24 mm aprons from one 1,800 × 180 × 32 mm board.</p><a href="${chapterRoute(chapters[6])}">Walk through the full example →</a></div>
  <ol><li><strong>Measure the available rectangle</strong><span>Reserve 60 mm at the ends and 20 mm across the edges. That leaves 1,740 × 160 mm.</span></li>
  <li><strong>Allow for each blank</strong><span>Leave 30 mm in length and 8 mm in width. A 3 mm kerf makes each rough slot 453 × 76 mm.</span></li>
  <li><strong>Check the count and thickness</strong><span>Three positions by two lanes gives six candidates. Allow 6 mm of thickness removal to leave an estimated 26 mm.</span></li></ol>
</section>
<section id="chapters" class="milling-section">
  <p class="milling-kicker">Eight field guides</p><h2>From survey to verification</h2>
  <div class="milling-chapters">${phases.map(([phase, summary]) => `<section id="phase-${phase.toLowerCase()}"><div><h3>${phase}</h3><p>${summary}</p></div>
    ${chapters.filter((chapter) => chapter.phase === phase).map((chapter) => `<a href="${chapterRoute(chapter)}"><small>${number(chapters.indexOf(chapter))}</small><div><strong>${escape(chapter.title)}</strong><p>${escape(chapter.summary)}</p></div><span aria-hidden="true">↗</span></a>`).join("")}
  </section>`).join("")}</div>
  <p class="milling-source">By <a href="/about/">WoodCutTool editorial team</a> · Updated <time datetime="${date}">${date}</time>. The stock-preparation method draws on <a href="${source}">Paul Anthony’s guide to dressing rough stock</a>. The apron example is an illustrative planning exercise.</p>
</section>`;

page({
  route: base,
  title: "Solid Wood Milling & Board Yield Planner",
  summary: "Plan rough-sawn lumber yield with an interactive board calculator and eight guides on measuring stock, sizing blanks, milling and checking finished parts.",
  body: hub
});

for (const [index, chapter] of chapters.entries()) {
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  page({
    route: chapterRoute(chapter), title: chapter.title, summary: chapter.summary, chapter: true,
    body: `<header class="milling-article-hero">
      <a href="${base}">← Solid Wood Milling</a>
      <p class="milling-kicker">${chapter.phase} · Chapter ${number(index)} / ${chapters.length}</p>
      <h1>${escape(chapter.title)}</h1><p class="milling-lead">${escape(chapter.summary)}</p>
      <p class="milling-source">By <a href="/about/">WoodCutTool editorial team</a> · <time datetime="${date}">${date}</time></p>
    </header>
    <div class="milling-reading"><nav aria-label="In this guide"><strong>In this guide</strong>
      ${chapter.sections.map(([heading], i) => `<a href="#step-${i + 1}">${escape(heading)}</a>`).join("")}
      <a href="#bench-note">Bench exercise</a><a href="${base}#planner">Board Yield Planner ↗</a>
    </nav><article>
      ${chapter.sections.map(([heading, content], i) => `<section id="step-${i + 1}"><p class="milling-kicker">${number(index)}.${i + 1}</p><h2>${escape(heading)}</h2><p>${escape(content)}</p></section>`).join("")}
      <section id="bench-note" class="milling-bench"><p class="milling-kicker">Side-table bench exercise</p><h2>Put it into practice</h2><p>${escape(chapter.exercise)}</p><a href="${chapter.link}">${escape(chapter.action)} →</a></section>
      <p class="milling-source">Further reading on stock preparation · <a href="${source}">Dressing Stock, Woodcraft Magazine</a>.</p>
      <nav class="milling-pagination" aria-label="Chapter navigation">
        <a href="${previous ? chapterRoute(previous) : base + "#chapters"}">← ${previous ? escape(previous.title) : "All guides"}</a>
        <a href="${next ? chapterRoute(next) : base + "#planner"}">${next ? escape(next.title) : "Return to the planner"} →</a>
      </nav>
    </article></div>`
  });
}
console.log(`Built Solid Wood Milling and ${chapters.length} guides.`);
