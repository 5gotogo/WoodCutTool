import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fields, sample } from "../assets/picture-frame-core.js";
import { guides } from "./picture-framing-data.mjs";

const root = resolve(import.meta.dirname, "..");
const site = "https://woodcuttool.com";
const base = "/picture-framing/";
const date = "2026-11-20";
const photo = "/assets/images/picture-framing/walnut-frame";
const image = site + photo + ".webp";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: site + "/about/" };
const routeFor = ({slug}) => base + slug + "/";
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = ([label, href]) => `<a href="${escape(href)}">${escape(label)}</a>`;
const byline = `<p class="pf-byline">By ${link([author.name, "/about/"])} · <time datetime="${date}">${date}</time></p>`;

function writePage({route, title, description, content, guide}) {
  const url = site + route;
  const crumbs = [["Home", "/"], ["Woodworking Tools", "/tools/woodworking/"], ["Picture Framing", base]];
  if (guide) crumbs.push([title, route]);
  const schema = { "@context": "https://schema.org", "@graph": [
    guide
      ? { "@type": "Article", headline: title, description, url, image, author, datePublished: date, dateModified: date,
          ...(guide.source && { citation: guide.source[1] }) }
      : { "@type": "CollectionPage", name: title, description, url, image, author,
          hasPart: guides.map(item => ({ "@type": "Article", headline: item.title, url: site + routeFor(item) })) },
    { "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, path], index) => ({
      "@type": "ListItem", position: index + 1, name, item: site + path
    })) }
  ] };
  const dir = resolve(root, "." + route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | WoodCutTool</title>
  <meta name="description" content="${escape(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${guide ? "article" : "website"}">
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
  <link rel="stylesheet" href="/assets/picture-framing.css">
  <script defer src="/assets/site-chrome.js"></script>
  ${guide ? "" : '<script type="module" src="/assets/picture-framing.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main class="pf" id="main">${content}</main>
  <div data-site-footer></div>
</body>
</html>
`.replace(/[ \t]+$/gm, ""));
}

const input = key => `<label>${fields[key]}<input type="number" inputmode="decimal" step="any" min="0" name="${key}" value="${sample[key]}" required></label>`;
const fieldset = (title, intro, keys) => `<fieldset><legend>${title}</legend><p>${intro}</p><div class="pf-fields">
          ${keys.map(input).join("\n          ")}
        </div></fieldset>`;

const worksheet = `<section class="pf-width pf-section" id="planner" aria-labelledby="pf-planner-title">
  <header class="pf-section-head"><div><h2 id="pf-planner-title">Picture frame cut list calculator</h2>
    <p>Plan one rectangular frame with a uniform profile and 45° miters. Use a measured package and clean, equal-length sticks.</p></div>
    <button type="button" id="pf-example">Restore worked example</button>
  </header>
  <noscript><p>Use the ${link(["worked example", routeFor(guides.at(-1))])} to calculate these dimensions by hand.</p><style>#pf-workspace,#pf-example{display:none}</style></noscript>
  <div class="pf-workspace" id="pf-workspace">
    <form class="pf-panel pf-form" id="pf-form">
      <label class="pf-unit">Measurement units<select name="unit"><option value="mm">Millimeters</option><option value="in">Inches</option></select></label>
      ${fieldset("Package and moulding", "Enter the outside size of the actual glazing, mat and backing package. Measure the lip horizontally from the inside face edge to the back shoulder.", ["width", "height", "face", "lip", "clearance"])}
      ${fieldset("Depth and retention", "Measure from the bearing ledge to the back of the moulding. Include all layers in the stack thickness.", ["depth", "stack", "reserve"])}
      ${fieldset("Available stock", "Include both end cuts in total end loss. Measure the material lost between usable long points when reversing the miter.", ["stick", "trim", "gap"])}
      <p class="pf-storage" id="pf-storage">Your measurements are saved in this browser.</p>
    </form>
    <section class="pf-panel pf-results" aria-labelledby="pf-results-title">
      <h3 id="pf-results-title">Frame dimensions</h3>
      <p class="pf-status" id="pf-status" role="status"></p>
      <div id="pf-output" hidden>
        <figure class="pf-diagram">
          <canvas width="640" height="390" id="pf-diagram" aria-hidden="true"></canvas>
          <figcaption><span>Outside edge</span><span>Back rabbet</span><span>Front sight</span></figcaption>
        </figure>
        <dl class="pf-dimensions" id="pf-dimensions"></dl>
        <h3>Four frame parts</h3>
        <div class="pf-table-scroll" tabindex="0" role="region" aria-label="Frame part dimensions">
          <table><caption id="pf-part-caption"></caption><thead><tr><th scope="col">Part</th><th scope="col">Long point</th><th scope="col">Rabbet shoulder</th><th scope="col">Short point</th></tr></thead><tbody id="pf-parts"></tbody></table>
        </div>
        <h3>Moulding allocation</h3>
        <p id="pf-stock-summary"></p>
        <ol id="pf-sticks"></ol>
        <p>Verify the actual stock, miter setup and package fit on scrap before cutting the finished parts.</p>
        <button type="button" id="pf-export" disabled>Download cut list CSV</button>
      </div>
    </section>
  </div>
</section>`;

const card = guide => `<a class="pf-guide" href="${routeFor(guide)}"><strong>${escape(guide.title)}</strong><span>${escape(guide.summary)}</span></a>`;
writePage({
  route: base,
  title: "Picture Frame Cut List Calculator & Miter Guides",
  description: "Calculate long-point, rabbet and sight dimensions, check backing depth, and allocate four 45° mitered picture frame parts to your moulding stock.",
  content: `<header class="pf-hero"><div class="pf-width pf-hero-grid">
      <div>
        <nav class="pf-crumb" aria-label="Breadcrumb"><a href="/tools/woodworking/">Woodworking Tools</a> <span aria-hidden="true">/</span> Picture Framing</nav>
        <h1>Build a mitered wood picture frame</h1>
        <p class="pf-lead">Measure the artwork package, size the 45° miters and plan the moulding cuts. Then verify the fit on scrap before you cut the good stock.</p>
        <div class="pf-actions"><a class="pf-primary" href="#planner">Calculate a cut list</a><a href="#guides">Read the framing guides</a></div>
      </div>
      <figure class="pf-cover"><img class="pf-hero-image" src="${photo}.webp" srcset="${photo}-640.webp 640w, ${photo}.webp 1200w" sizes="(max-width: 760px) calc(100vw - 32px), 550px" width="1200" height="800" alt="Walnut picture frame with mitered corners on a maple workbench" fetchpriority="high"></figure>
    </div></header>
    ${worksheet}
    <section class="pf-width pf-section" id="guides"><h2>Picture framing guides</h2>
      <div class="pf-guide-grid">${guides.map(card).join("\n      ")}</div>
      ${byline}
      <nav class="pf-related" aria-label="Related tools">
        <a href="/joinery-lab/rabbet-rebate-planner/">Plan a rabbet joint</a>
        <a href="/kerf-calculator/">Check straight-cut blade loss</a>
        <a href="/assembly-check/">Review dry-fit measurements</a>
      </nav>
    </section>`
});

for (const [index, guide] of guides.entries()) {
  const prev = guides[index - 1];
  const next = guides[index + 1];
  writePage({
    route: routeFor(guide), title: guide.title, description: guide.summary, guide,
    content: `<header class="pf-article-hero"><div class="pf-width">
      <nav class="pf-crumb" aria-label="Breadcrumb"><a href="${base}">Picture Framing</a></nav>
      <h1>${escape(guide.title)}</h1><p class="pf-lead">${escape(guide.summary)}</p>${byline}
    </div></header>
    <div class="pf-width pf-reading">
      <nav aria-label="On this page">
        ${guide.sections.map(([heading], i) => link([heading, "#section-" + (i + 1)])).join("\n        ")}
        <a href="#bench-check">Bench check</a>
      </nav>
      <article>
        ${guide.sections.map(([heading, body], i) => `<section id="section-${i + 1}"><h2>${escape(heading)}</h2><p>${escape(body)}</p></section>`).join("\n        ")}
        <aside class="pf-check" id="bench-check"><h2>Bench check</h2><p>${escape(guide.check)}</p></aside>
        ${guide.source ? `<p class="pf-reference">Reference · ${link(guide.source)}</p>` : ""}
        <div class="pf-actions"><a class="pf-primary" href="${base}#planner">Open the cut list calculator</a>${index < guides.length - 1 ? link(["See the worked example", routeFor(guides.at(-1))]) : ""}</div>
        <nav class="pf-related" aria-label="Picture framing guide navigation">
          ${link(prev ? [prev.title, routeFor(prev)] : ["All framing guides", base + "#guides"])}
          ${link(next ? [next.title, routeFor(next)] : ["All framing guides", base + "#guides"])}
        </nav>
      </article>
    </div>`
  });
}
console.log(`Built picture framing planner and ${guides.length} guides.`);
