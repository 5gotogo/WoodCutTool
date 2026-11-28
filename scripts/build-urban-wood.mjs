import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { guides } from "../data/urban-wood-guides.mjs";
import { recordMarkup } from "./urban-wood-record.mjs";

const root = resolve(import.meta.dirname, "..");
const origin = "https://woodcuttool.com";
const base = "/urban-wood/";
const column = "Urban Wood Recovery";
const date = "2026-11-28";
const image = "/assets/images/urban-wood-salvage-yard.webp";
const imageSmall = "/assets/images/urban-wood-salvage-yard-480.webp";
const imageCandidates = `${imageSmall} 480w, ${image} 960w`;
const imageSizes = "(max-width: 760px) calc(100vw - 8vw), (max-width: 1184px) 46vw, 542px";
const author = { "@type": "Organization", name: "WoodCutTool editorial team", url: origin + "/about/" };

function escape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const routeFor = (guide) => `${base}${guide.slug}/`;

async function writePage({ title, description, main, guide }) {
  const route = guide ? routeFor(guide) : base;
  const url = origin + route;
  const breadcrumbs = [["Home", "/"], [column, base]];
  if (guide) breadcrumbs.push([title, route]);
  const breadcrumbTail = guide
    ? `<a href="${base}">${column}</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span>`
    : `<span aria-current="page">${column}</span>`;
  const pageSchema = guide
    ? {
      "@type": "Article", headline: title, description, url, author,
      datePublished: date, dateModified: date, citation: guide.sources.map(([, href]) => href),
    }
    : {
      "@type": "CollectionPage", name: title, description, url,
      hasPart: guides.map((item) => ({ "@type": "WebPage", name: item.title, url: origin + routeFor(item) })),
    };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [pageSchema, {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map(([name, path], index) => ({
        "@type": "ListItem", position: index + 1, name, item: origin + path,
      })),
    }],
  };
  const socialImage = origin + (guide ? "/assets/og/woodcuttool-og.png" : image);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | WoodCutTool</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${guide ? "article" : "website"}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${socialImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#26352b">
  ${guide ? "" : `<link rel="preload" as="image" imagesrcset="${imageCandidates}" imagesizes="${imageSizes}" fetchpriority="high">`}
  <link rel="stylesheet" href="/assets/content.css">
  <link rel="stylesheet" href="/assets/urban-wood.css">
  ${guide ? "" : '<script type="module" src="/assets/urban-wood-record.js"></script>'}
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main" class="urban-wood ${guide ? "urban-guide" : "urban-hub"}">
    <nav class="urban-crumb" aria-label="Breadcrumb">
      <a href="/">Home</a><span aria-hidden="true">/</span>
      ${breadcrumbTail}
    </nav>
    ${main}
  </main>
  <div data-site-footer></div>
</body>
</html>
`;
  const directory = resolve(root, "." + route);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), html.replace(/[ \t]+$/gm, ""));
}

function guideCards(items) {
  return `<div class="urban-guide-grid">${items.map((guide) => `
    <a class="urban-guide-card" href="${routeFor(guide)}">
      <h3>${escape(guide.title)}</h3>
      <p>${escape(guide.description)}</p>
      <span aria-hidden="true">Read the guide</span>
    </a>`).join("")}
  </div>`;
}

const hub = `<header class="urban-hero">
      <div class="urban-hero-copy">
        <h1>${column}</h1>
        <p>Follow removed city trees and wood salvaged from buildings through the receiving yard. Learn what to document, when to hold a lot for review, and how to keep its source attached as it changes hands.</p>
        <div class="urban-actions">
          <a class="urban-button" href="#guides">Explore the guides</a>
          <a class="urban-button urban-button-secondary" href="#intake-record">Open intake record</a>
        </div>
      </div>
      <img sizes="${imageSizes}" srcset="${imageCandidates}" src="${imageSmall}" width="960" height="720" fetchpriority="high" alt="Salvaged hardwood logs beside stacks of rough-sawn boards in a recovery yard">
    </header>
    <section id="guides" class="urban-section" aria-labelledby="urban-guides-heading">
      <h2 id="urban-guides-heading">From source to stock</h2>
      <p class="urban-section-intro">Choose the guide that matches what arrived, then keep that source record with the material.</p>
      ${guideCards(guides)}
    </section>
    ${recordMarkup()}`;

await writePage({
  title: column,
  description: "Field guides for receiving removed urban logs and salvaged building lumber, tracking material lots, and creating a printable intake record.",
  main: hub,
});

for (const guide of guides) {
  const main = `<article>
      <header class="urban-guide-hero">
        <h1>${escape(guide.title)}</h1>
        <p>${escape(guide.intro)}</p>
        <p class="urban-byline">By <a href="/about/">${author.name}</a> · <time datetime="${date}">November 28, 2026</time></p>
      </header>
      <div class="urban-guide-layout">
        <nav class="urban-contents" aria-label="On this page">
          <h2>On this page</h2>
          <ul>${guide.sections.map(([heading], index) => `<li><a href="#topic-${index + 1}">${escape(heading)}</a></li>`).join("")}
            <li><a href="#sources">Sources</a></li>
          </ul>
        </nav>
        <div class="urban-article-body">
          ${guide.sections.map(([heading, paragraph], index) => `<section id="topic-${index + 1}">
            <h2>${escape(heading)}</h2>
            <p>${escape(paragraph)}</p>
          </section>`).join("\n          ")}
          <section id="sources">
            <h2>Sources</h2>
            <ul>${guide.sources.map(([name, href]) => `<li><a href="${escape(href)}">${escape(name)}</a></li>`).join("")}</ul>
          </section>
        </div>
      </div>
    </article>
    <section class="urban-guide-cta" aria-labelledby="urban-practice">
      <div><h2 id="urban-practice">Make a record for the next lot</h2><p>Keep the source, condition and receiving decision together.</p></div>
      <a class="urban-button" href="${base}#intake-record">Open intake record</a>
    </section>
    <section class="urban-section" aria-labelledby="urban-more">
      <h2 id="urban-more">More recovery guides</h2>
      ${guideCards(guides.filter((item) => item !== guide))}
    </section>`;
  await writePage({ title: guide.title, description: guide.description, main, guide });
}

console.log(`Built Urban Wood Recovery hub and ${guides.length} guides.`);
