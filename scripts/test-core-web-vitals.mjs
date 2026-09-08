import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { appHtmlFiles, compileAppStyles } from "./build-app-styles.mjs";
import { compileEditorialStyles, editorialHtmlFiles } from "./build-editorial-styles.mjs";
import { compileContentStyles, compileInteractiveStyles } from "./build-site-styles.mjs";
import { performanceProfile } from "./site-performance-profile.mjs";

import { plywoodCoreSource } from "./build-plywood-core.mjs";

const root = resolve(import.meta.dirname, "..");
const failures = [];
let articlePages = 0;
let heroImages = 0;
let inlineImages = 0;
let editorialPages = 0;
let compareLcpImages = 0;

function inspectArticles(directory) {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(root, directory, entry.name, "index.html");
    try {
      const html = readFileSync(path, "utf8");
      if (html.includes("blog-article-shell")) {
        editorialPages += 1;
        if (!html.includes('<link rel="stylesheet" href="/assets/editorial.css">')) {
          failures.push(`${directory}/${entry.name}: article does not use the scoped editorial stylesheet`);
        }
        if (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"')) {
          failures.push(`${directory}/${entry.name}: static article eagerly loads the full app runtime`);
        }
      }
      const hero = html.match(/<figure class="article-wood-photo article-wood-photo-hero">\s*<img src="([^"]+)"[^>]*>/);
      if (!hero) continue;
      articlePages += 1;
      heroImages += 1;
      const heroTag = hero[0];
      const preloads = [...html.matchAll(/<link\b[^>]*\brel="preload"[^>]*\bas="image"[^>]*>/g)].map((match) => match[0]);
      if (!preloads.some((tag) => tag.includes(hero[1]) && tag.includes('fetchpriority="high"'))) failures.push(`${directory}/${entry.name}: hero image is not preloaded`);
      if (!heroTag.includes('loading="eager"') || !heroTag.includes('fetchpriority="high"')) {
        failures.push(`${directory}/${entry.name}: hero image is not eager/high priority`);
      }

      for (const match of html.matchAll(/<figure class="article-wood-photo article-wood-photo-inline">\s*<img[^>]*>/g)) {
        inlineImages += 1;
        if (!match[0].includes('loading="lazy"') || match[0].includes('fetchpriority="high"')) {
          failures.push(`${directory}/${entry.name}: supporting image is not lazy or can compete with the hero`);
        }
      }
    } catch {
      // Not every directory entry is an article route.
    }
  }
}

inspectArticles("blog");
inspectArticles("learn");

for (const file of editorialHtmlFiles().filter((file) => file === "compare/index.html" || file.startsWith("compare/"))) {
  const html = readFileSync(join(root, file), "utf8");
  if (!html.includes('<link rel="stylesheet" href="/assets/editorial.css">')) {
    failures.push(`${file}: Compare page does not use the scoped editorial stylesheet`);
  }
  if (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"')) {
    failures.push(`${file}: static Compare page eagerly loads the full app runtime`);
  }
  const lead = html.match(/(?:article-lead-visual|comparison-hero-visual)[^>]*><img\b([^>]*)\bsrc="([^"]+)"([^>]*)>/);
  if (!lead) continue;
  compareLcpImages += 1;
  const imageTag = lead[0];
  if (!imageTag.includes('loading="eager"') || !imageTag.includes('fetchpriority="high"')) {
    failures.push(`${file}: above-the-fold Compare image is not eager/high priority`);
  }
  const preload = `<link rel="preload" as="image" href="${lead[2]}" fetchpriority="high">`;
  if (!html.includes(preload)) failures.push(`${file}: above-the-fold Compare image is not preloaded`);
}

const blogIndex = readFileSync(join(root, "blog/index.html"), "utf8");
if (!blogIndex.includes('<link rel="stylesheet" href="/assets/editorial.css">') || !blogIndex.includes('src="/assets/blog-index.js"') || !blogIndex.includes('src="/assets/content-page.js"') || blogIndex.includes('src="/assets/app.js"')) {
  failures.push("blog/index.html must use the lightweight search and language runtimes with the editorial stylesheet");
}
if (Buffer.byteLength(blogIndex) > 150_000) failures.push(`blog/index.html is ${Buffer.byteLength(blogIndex)} bytes (limit 150000)`);
if (!existsSync(join(root, "blog/archive/index.html")) || !blogIndex.includes('href="/blog/archive/"')) failures.push("Blog index is missing its crawlable complete archive");
if (!existsSync(join(root, "assets/blog-search-index.json")) || statSync(join(root, "assets/blog-search-index.json")).size > 500_000) failures.push("Blog search index is missing or exceeds 500 KB");
if (existsSync(join(root, "assets/blog-translations.json"))) failures.push("Monolithic Blog translation payload must not be published");
if (!existsSync(join(root, "assets/blog-translations/index.json")) || statSync(join(root, "assets/blog-translations/index.json")).size > 100_000) failures.push("Blog index translation shard is missing or exceeds 100 KB");

for (const route of ["stringer", "stair-stringer-calculator"]) {
  const html = readFileSync(join(root, route, "index.html"), "utf8");
  if (!html.includes('<script defer src="/assets/stair-calculator.js"></script>')) {
    failures.push(`${route}: missing lightweight stair calculator bundle`);
  }
  if (html.includes('<script defer src="/assets/app.js"></script>')) {
    failures.push(`${route}: still loads the full calculator bundle on the critical path`);
  }
}

const stairBundleSize = statSync(join(root, "assets", "stair-calculator.js")).size;
if (stairBundleSize > 20_000) failures.push(`stair calculator bundle is ${stairBundleSize} bytes (limit 20000)`);

const plywoodPage = readFileSync(join(root, 'plywood-cut-calculator/index.html'), 'utf8');
if (plywoodPage.includes('src="/assets/app.js"') || !plywoodPage.includes('src="/assets/plywood-core.js"')) failures.push('Plywood page must use its lightweight core.');
const plywoodCore = readFileSync(join(root, 'assets/plywood-core.js'), 'utf8');
if (plywoodCore !== plywoodCoreSource() || Buffer.byteLength(plywoodCore) > 16000) failures.push('Plywood core is stale or exceeds 16 KB.');

const appStyles = readFileSync(join(root, "assets/apps.css"), "utf8");
if (appStyles !== compileAppStyles().css) {
  failures.push("App stylesheet is stale; run npm run apply:nav-cta after editing CSS, App pages, or their runtimes");
}
if (Buffer.byteLength(appStyles) > 60_000) failures.push("App stylesheet exceeds the 60 KB budget");

const editorialStyles = readFileSync(join(root, "assets/editorial.css"), "utf8");
if (editorialStyles !== compileEditorialStyles().css) {
  failures.push("Editorial stylesheet is stale; run npm run apply:nav-cta after generating Blog or Compare pages");
}
if (Buffer.byteLength(editorialStyles) > 75_000) failures.push("Editorial stylesheet exceeds the 75 KB budget");
for (const file of appHtmlFiles()) {
  const html = readFileSync(join(root, file), "utf8");
  const profile = performanceProfile(file, html);
  if (!html.includes('<link rel="stylesheet" href="/assets/apps.css">') || html.includes('href="/assets/styles.css"')) {
    failures.push(`${file}: must load the scoped App stylesheet`);
  }
  if (profile.runtimes.includes("/assets/content-page.js") && (!html.includes('<script defer src="/assets/content-page.js"></script>') || html.includes('src="/assets/app.js"'))) {
    failures.push(`${file}: static App content must use the on-demand language runtime`);
  }
}

for (const [name, output, compiled, limit] of [
  ["content", join(root, "assets/content.css"), compileContentStyles(), 90_000],
  ["interactive", join(root, "assets/interactive.css"), compileInteractiveStyles(), 90_000],
]) {
  const css = readFileSync(output, "utf8");
  if (css !== compiled.css) failures.push(`${name} stylesheet is stale; run npm run apply:nav-cta`);
  if (Buffer.byteLength(css) > limit) failures.push(`${name} stylesheet exceeds the ${limit} byte budget`);
  for (const file of compiled.pages) {
    const html = readFileSync(join(root, file), "utf8");
    const profile = performanceProfile(file, html);
    if (!html.includes(`<link rel="stylesheet" href="/assets/${name}.css">`) || html.includes('href="/assets/styles.css"')) {
      failures.push(`${file}: must load the scoped ${name} stylesheet`);
    }
    if (name === "content" && (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"'))) {
      failures.push(`${file}: static content must not eagerly load the full app runtime`);
    }
    if (name === "interactive" && profile.runtimes.includes("/assets/app.js") && !html.includes('src="/assets/app.js"')) failures.push(`${file}: interactive page is missing the full app runtime`);
    if (name === "interactive" && profile.runtimes.includes("/assets/content-page.js") && (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"'))) failures.push(`${file}: specialized calculator must use its lightweight runtime`);
  }
}

const allProfiledPages = [
  ...appHtmlFiles(),
  ...editorialHtmlFiles(),
  ...compileContentStyles().pages,
  ...compileInteractiveStyles().pages,
];
for (const file of new Set(allProfiledPages)) {
  if (readFileSync(join(root, file), "utf8").includes('href="/assets/styles.css"')) failures.push(`${file}: serves the authored full stylesheet`);
}

const chromeSource = readFileSync(join(root, "assets/site-chrome.js"), "utf8");
const brandIconSize = statSync(join(root, "assets/icons/brand-icon.webp")).size;
if (!chromeSource.includes('/assets/icons/brand-icon.webp') || chromeSource.includes('class="brand-icon" src="/assets/icons/apple-touch-icon.png')) failures.push("Shared header must use the compact brand icon");
if (brandIconSize > 4_000) failures.push(`Brand icon is ${brandIconSize} bytes (limit 4000)`);
if (readFileSync(join(root, "assets/styles.css"), "utf8").includes('/assets/images/woodworking/')) failures.push("Directory card CSS must not eagerly request the shared woodworking photo set");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Core Web Vitals guards passed: ${articlePages} image-led articles, ${editorialPages} static Blog articles, ${heroImages} hero preloads, ${inlineImages} lazy/promotable inline images, ${compareLcpImages} Compare LCP preloads, stair bundle ${stairBundleSize} bytes, App stylesheet ${Buffer.byteLength(appStyles)} bytes, editorial stylesheet ${Buffer.byteLength(editorialStyles)} bytes, content stylesheet ${statSync(join(root, "assets/content.css")).size} bytes, interactive stylesheet ${statSync(join(root, "assets/interactive.css")).size} bytes, Blog index ${Buffer.byteLength(blogIndex)} bytes, brand icon ${brandIconSize} bytes.`);
