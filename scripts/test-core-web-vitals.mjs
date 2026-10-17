import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { appHtmlFiles, compileAppStyles } from "./build-app-styles.mjs";
import { blogArticleHtmlFiles, compileBlogArticleStyles, compileBlogIndexStyles, compileCompareStyles, compileEditorialStyles, editorialHtmlFiles } from "./build-editorial-styles.mjs";
import { compileContentStyles, compileHomeStyles, compileLearnStyles, compileInteractiveStyles, compileWoodStyles, compileWoodSpeciesStyles, compileWoodDatabaseStyles, compilePlanningStyles, compileTemplateStyles, compileConstructionStyles, compilePlywoodStyles, compileChecklistStyles, compileLegalStyles, compileGlossaryStyles, compileWorkflowStyles } from "./build-site-styles.mjs";
import { performanceProfile } from "./site-performance-profile.mjs";
import assert from "node:assert/strict";
import { appStoreThumbnail, appStoreScreenshotSources } from "./app-store-images.mjs";

import { plywoodCoreSource } from "./build-plywood-core.mjs";
import { homeRuntimeSource } from "./build-home-runtime.mjs";
import { renderWoodChrome, woodLanguageSource, woodRuntimeSource } from "./build-wood-runtime.mjs";
import { heroSources } from "./lcp-images.mjs";
import { woodworkingImages as articlePhotos, woodworkingPreload } from "./woodworking-images.mjs";

const root = resolve(import.meta.dirname, "..");
const failures = [];
const sample = "https://is1-ssl.mzstatic.com/image/thumb/example/1.png/1290x2796bb.jpg";
assert.equal(appStoreThumbnail(sample, 360, 780), sample.replace("1290x2796", "360x780"));
assert.equal(appStoreThumbnail("/assets/images/screenshot.png", 360), "/assets/images/screenshot.png");
assert.equal(appStoreThumbnail("https://example.com/1290x2796bb.jpg", 360), "https://example.com/1290x2796bb.jpg");
assert.equal(appStoreScreenshotSources("/assets/images/screenshot.png", { width: 1290, height: 2796 }), null);
assert.equal(appStoreScreenshotSources(sample, { width: 1290, height: 2796 }).srcset.split(", ").length, 5);
assert.deepEqual(performanceProfile("learn/example/index.html", '<style>.template-category-section{display:block}</style><main class="article-shell"></main>').runtimes, ["/assets/content-page.js"]);
assert.deepEqual(performanceProfile("learn/index.html", '<style>.template-category-section{display:block}</style><main><section class="template-category-section"></section></main>').runtimes, ["/assets/content-page.js", "/assets/directory-page.js"]);
for (const file of ["templates/example/index.html", "about/index.html"]) {
  assert.deepEqual(performanceProfile(file, '<style>.template-category-section{display:block}</style><main class="article-shell"></main>').runtimes, ["/assets/content-page.js"]);
}
let articlePages = 0;
let heroImages = 0;
let inlineImages = 0;
let editorialPages = 0;
let compareLcpImages = 0;
const expectedBlogStyles = compileBlogArticleStyles().css;

function inspectArticles(directory) {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(root, directory, entry.name, "index.html");
    try {
      const html = readFileSync(path, "utf8");
      if (html.includes("blog-article-shell")) {
        editorialPages += 1;
        if (!html.includes(`<style data-blog-article-styles>${expectedBlogStyles}</style>`)) {
          failures.push(`${directory}/${entry.name}: article does not use the scoped Blog article stylesheet`);
        }
        if (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"')) {
          failures.push(`${directory}/${entry.name}: static article eagerly loads the full app runtime`);
        }
      }
      const hero = html.match(/<figure class="article-wood-photo article-wood-photo-hero">\s*(?:<picture[^>]*><source[^>]*>)?<img src="([^"]+)"[^>]*>/);
      if (!hero) continue;
      articlePages += 1;
      heroImages += 1;
      const heroTag = hero[0];
      if (!html.includes(woodworkingPreload(hero[1]))) failures.push(`${directory}/${entry.name}: typed hero preload does not match its AVIF candidates`);
      if (!heroTag.includes('source type="image/avif"') || !heroTag.includes(hero[1].replace(/\.webp$/, "-480.avif")) || !heroTag.includes(hero[1].replace(/\.webp$/, "-960.avif"))) failures.push(`${directory}/${entry.name}: missing responsive AVIF picture`);
      if (!heroTag.includes('loading="eager"') || !heroTag.includes('fetchpriority="high"')) {
        failures.push(`${directory}/${entry.name}: hero image is not eager/high priority`);
      }

      for (const match of html.matchAll(/<figure class="article-wood-photo article-wood-photo-inline">\s*(?:<picture[^>]*><source[^>]*>)?<img[^>]*>/g)) {
        inlineImages += 1;
        if (!match[0].includes('loading="lazy"') || !match[0].includes('fetchpriority="low"')) {
          failures.push(`${directory}/${entry.name}: supporting image is not lazy and low priority`);
        }
      }
    } catch {
      // Not every directory entry is an article route.
    }
  }
}

inspectArticles("blog");
inspectArticles("learn");

const compareStyles = compileCompareStyles();
if (Buffer.byteLength(compareStyles.css) > 60_000 || readFileSync(join(root, "assets/compare.css"), "utf8") !== compareStyles.css) failures.push("Compare stylesheet is stale or exceeds 60 KB");
for (const file of compareStyles.pages) {
  const html = readFileSync(join(root, file), "utf8");
  if (!html.includes(`<style data-compare-styles>${compareStyles.css}</style>`) || /<link\b[^>]*rel="stylesheet"/.test(html)) {
    failures.push(`${file}: Compare page must inline the complete scoped stylesheet`);
  }
  if (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"')) {
    failures.push(`${file}: static Compare page eagerly loads the full app runtime`);
  }
  const lead = html.match(/(?:article-lead-visual|comparison-hero-visual)[^>]*>(?:<picture[^>]*><source[^>]*>)?<img\b([^>]*)\bsrc="([^"]+)"([^>]*)>/)
    || html.match(/<figure class="visual-frame wide">(?:<picture[^>]*><source[^>]*>)?<img\b([^>]*)\bsrc="([^"]+)"([^>]*)>/);
  if (!lead) continue;
  compareLcpImages += 1;
  const imageTag = lead[0].match(/<img\b[^>]*>/)[0];
  if (!imageTag.includes('loading="eager"') || !imageTag.includes('fetchpriority="high"')) {
    failures.push(`${file}: above-the-fold Compare image is not eager/high priority`);
  }
  const preload = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('type="image/avif"'));
  if (!preload?.includes('fetchpriority="high"')) failures.push(`${file}: above-the-fold Compare image is not preloaded`);
  const small = lead[2].replace(/\.webp$/, "-800.webp");
  if (existsSync(join(root, small))) {
    const srcset = imageTag.match(/\bsrcset="([^"]+)"/)?.[1];
    const sizes = imageTag.match(/\bsizes="([^"]+)"/)?.[1];
    const sources = heroSources(lead[2], sizes);
    if (!srcset?.includes(`${small} 800w`) || !srcset.includes("480w") || !sizes || !lead[0].includes(`srcset="${sources.avif}"`) || !preload?.includes(`imagesrcset="${sources.avif}"`) || !preload?.includes(`imagesizes="${sizes}"`)) failures.push(`${file}: responsive Compare AVIF/WebP picture and preload must match`);
  }
  if (!html.includes('defer fetchpriority="low" src="/assets/content-page.js"') || !html.includes('defer fetchpriority="low" src="/assets/conversion.js"')) failures.push(`${file}: optional Compare runtimes must have low priority`);
}

for (const file of ["index.html", "blog/index.html"]) {
  const html = readFileSync(join(root, file), "utf8");
  if (/<script type="application\/ld\+json">/.test(html.slice(0, html.indexOf("<h1")))) failures.push(`${file}: structured data must follow the visible heading`);
}

const blogIndex = readFileSync(join(root, "blog/index.html"), "utf8");
if (!blogIndex.includes(`<style data-blog-index-styles>${compileBlogIndexStyles().css}</style>`) || /<link\b[^>]*rel="stylesheet"/.test(blogIndex) || !blogIndex.includes('src="/assets/blog-index.js"') || !blogIndex.includes('src="/assets/content-page.js"') || blogIndex.includes('src="/assets/app.js"')) {
  failures.push("blog/index.html must use current inline scoped styles and lightweight search/language runtimes without blocking CSS requests");
}
if (Buffer.byteLength(compileBlogIndexStyles().css) > 45_000) failures.push("Blog index inline stylesheet exceeds 45 KB");
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

const homePage = readFileSync(join(root, "index.html"), "utf8");
const homeRuntime = readFileSync(join(root, "assets/home.js"), "utf8");
if (homePage.includes('src="/assets/app.js"') || !homePage.includes('src="/assets/home.js"') || !homePage.includes('src="/assets/content-page.js"')) {
  failures.push("Home page must use the lightweight planner and on-demand language runtimes");
}
if (homeRuntime !== homeRuntimeSource() || Buffer.byteLength(homeRuntime) > 8_000) failures.push("Home runtime is stale or exceeds 8 KB");

const constructionHub = readFileSync(join(root, "learn/plywood/index.html"), "utf8");
if (constructionHub.includes('src="/assets/construction-calculators.js"')) failures.push("Static construction topic hubs must not load the calculator runtime");
const cabinetCalculator = readFileSync(join(root, "cabinet-cut-list-calculator/index.html"), "utf8");
if (!cabinetCalculator.includes('rel="preload" as="image"') || !cabinetCalculator.includes('tools-cabinet-800.webp 800w')) {
  failures.push("Construction calculator hero images must preload responsive mobile candidates");
}

for (const route of ["cabinet-door-calculator", "cabinet-cut-list-calculator", "drawer-box-calculator"]) {
  if (readFileSync(join(root, route, "index.html"), "utf8").includes('src="/assets/component-builder.js"')) {
    failures.push(`${route}: project storage must load on demand`);
  }
}

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
const blogArticleStyles = readFileSync(join(root, "assets/blog-article.css"), "utf8");
if (blogArticleStyles !== compileBlogArticleStyles().css) {
  failures.push("Blog article stylesheet is stale; run npm run apply:nav-cta after generating Blog articles");
}
if (Buffer.byteLength(blogArticleStyles) > 60_000) failures.push("Blog article stylesheet exceeds the 60 KB budget");
for (const file of appHtmlFiles()) {
  const html = readFileSync(join(root, file), "utf8");
  const profile = performanceProfile(file, html);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!tag.includes('alt=') || !tag.includes('screenshot') || !tag.includes('src="https://is')) continue;
    if (tag.includes("mzstatic.com/image/thumb/") && /\/\d{4}x\d+bb\./.test(tag.split('srcset=')[0])) {
      failures.push(`${file}: App screenshot still requests a full-size source image`);
    }
    if (tag.includes("mzstatic.com/image/thumb/") && (!tag.includes('srcset="') || !tag.includes('sizes="') || !tag.includes('width="') || !tag.includes('height="'))) {
      failures.push(`${file}: App screenshot is missing responsive sizing or intrinsic dimensions`);
    }
  }
  if (!html.includes(`<style data-apps-styles>${appStyles}</style>`) || html.includes('href="/assets/styles.css"')) {
    failures.push(`${file}: must load the scoped App stylesheet`);
  }
  if (profile.runtimes.includes("/assets/content-page.js") && (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"'))) {
    failures.push(`${file}: static App content must use the on-demand language runtime`);
  }
}

for (const [name, output, compiled, limit] of [
  ["content", join(root, "assets/content.css"), compileContentStyles(), 90_000],
  ["home", join(root, "assets/home.css"), compileHomeStyles(), 60_000],
  ["learn", join(root, "assets/learn.css"), compileLearnStyles(), 55_000],
  ["interactive", join(root, "assets/interactive.css"), compileInteractiveStyles(), 90_000],
  ["wood", join(root, "assets/wood.css"), compileWoodStyles(), 45_000],
  ["wood-species", join(root, "assets/wood-species.css"), compileWoodSpeciesStyles(), 40_000],
  ["wood-database", join(root, "assets/wood-database.css"), compileWoodDatabaseStyles(), 40_000],
  ["planning", join(root, "assets/planning.css"), compilePlanningStyles(), 45_000],
  ["templates", join(root, "assets/templates.css"), compileTemplateStyles(), 50_000],
  ["construction", join(root, "assets/construction.css"), compileConstructionStyles(), 50_000],
  ["plywood", join(root, "assets/plywood.css"), compilePlywoodStyles(), 40_000],
  ["checklists", join(root, "assets/checklists.css"), compileChecklistStyles(), 40_000],
  ["legal", join(root, "assets/legal.css"), compileLegalStyles(), 40_000],
  ["glossary", join(root, "assets/glossary.css"), compileGlossaryStyles(), 40_000],
  ["workflow-shell", join(root, "assets/workflow-shell.css"), compileWorkflowStyles(), 40_000],
]) {
  const css = readFileSync(output, "utf8");
  if (css !== compiled.css) failures.push(`${name} stylesheet is stale; run npm run apply:nav-cta`);
  if (Buffer.byteLength(css) > limit) failures.push(`${name} stylesheet exceeds the ${limit} byte budget`);
  for (const file of compiled.pages) {
    const html = readFileSync(join(root, file), "utf8");
    const profile = performanceProfile(file, html);
    const customName = name === "workflow-shell" ? file.split("/")[0] : name === "plywood" ? "plywood-workflow"
      : name === "construction" && /^(?:cabinet-cut-list-calculator|cabinet-door-calculator|drawer-box-calculator)\//.test(file) ? "component-builder" : null;
    const custom = customName ? readFileSync(join(root, "assets", `${customName}.css`), "utf8") : "";
    const marker = name === "workflow-shell" ? "workflow" : name === "wood-species" ? "wood" : name;
    const hasStyles = html.includes(`<style data-${marker}-styles>${css}${custom}</style>`) && !/<link\b[^>]*rel="stylesheet"/.test(html);
    if (Buffer.byteLength(css + custom) > 65_000) failures.push(`${file}: inline stylesheet exceeds 65 KB`);
    if (["learn", "glossary", "workflow-shell"].includes(name) && !html.includes('defer fetchpriority="low" src="/assets/content-page.js"')) failures.push(`${file}: optional language runtime must have low priority`);
    if (name === "learn" && !html.includes('defer fetchpriority="low" src="/assets/conversion.js"')) failures.push(`${file}: optional conversion runtime must have low priority`);
    if (name === "learn" && html.includes('src="/assets/directory-page.js"') !== profile.runtimes.includes("/assets/directory-page.js")) failures.push(`${file}: directory runtime must follow page markup, not inline CSS tokens`);
    if (name === "construction") {
      const image = html.match(/<figure class="visual-frame">(?:<picture[^>]*><source[^>]*>)?<img\b[^>]*>/)?.[0] || "";
      const srcset = image.match(/srcset="([^"]+)"/)?.[1];
      const sizes = image.match(/sizes="([^"]+)"/)?.[1];
      const preload = html.match(/<link rel="preload" as="image"[^>]*>/)?.[0] || "";
      if (!image.includes('<source type="image/avif"') || !preload.includes('type="image/avif"') || !srcset?.includes("480w") || !srcset.includes("800w") || !srcset.includes("1200w") || !sizes || !preload.includes(`imagesrcset="${srcset}"`) || !preload.includes(`imagesizes="${sizes}"`)) failures.push(`${file}: complete responsive AVIF candidates and matching typed preload required`);
      for (const candidate of (srcset || "").split(", ")) {
        const path = candidate.split(" ")[0];
        if (!existsSync(join(root, path))) failures.push(`${file}: missing image variant ${path}`);
        else if (path.endsWith("-480.webp") && statSync(join(root, path)).size > 30_000) failures.push(`${path}: mobile hero exceeds 30 KB`);
      }
    }
    if (!hasStyles || html.includes('href="/assets/styles.css"')) {
      failures.push(`${file}: must load the scoped ${name} stylesheet`);
    }
    if ((["content", "learn", "planning", "templates", "construction", "plywood", "checklists", "legal"].includes(name)) && (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"'))) {
      failures.push(`${file}: static content must not eagerly load the full app runtime`);
    }
    if (["wood", "wood-species"].includes(name)) {
      const chrome = renderWoodChrome(`/${file.replace(/index\.html$/, "")}`);
      if (!html.includes('<div data-site-header></div>') || !html.includes(chrome.footer) || chrome.header !== renderWoodChrome("/wood/").header) failures.push(`${file}: Wood chrome must match the shared renderer`);
      if (!html.includes('src="/assets/wood-page.js"') || /src="\/assets\/(?:app|site-chrome|content-page)\.js"/.test(html)) failures.push(`${file}: Wood page must use only its lightweight navigation/language bootstrap`);
      if (/<script type="application\/ld\+json">/.test(html.slice(0, html.indexOf("<h1>")))) failures.push(`${file}: structured data must follow visible Wood content`);
    }
    if (name === "interactive" && profile.runtimes.includes("/assets/app.js") && !html.includes('src="/assets/app.js"')) failures.push(`${file}: interactive page is missing the full app runtime`);
    if (name === "interactive" && profile.runtimes.includes("/assets/content-page.js") && (!html.includes('src="/assets/content-page.js"') || html.includes('src="/assets/app.js"'))) failures.push(`${file}: specialized calculator must use its lightweight runtime`);
  }
}

for (const [directory, maximum] of [["compare", 60_000], ["tools", 50_000], ["learn", 200_000]]) {
  for (const name of readdirSync(join(root, "assets/images", directory)).filter(name => name.endsWith(".avif"))) {
    const bytes = statSync(join(root, "assets/images", directory, name)).size;
    if (bytes > (name.endsWith("-480.avif") ? 15_000 : maximum)) failures.push(`${name}: AVIF hero exceeds byte budget`);
    const fallback = name.replace(/-(?:1200|1448|1600)\.avif$/, ".webp").replace(/\.avif$/, ".webp");
    if (bytes >= statSync(join(root, "assets/images", directory, fallback)).size * 0.8) failures.push(`${name}: AVIF must save at least 20% over its WebP fallback`);
  }
}

const allProfiledPages = [
  ...appHtmlFiles(),
  ...editorialHtmlFiles(),
  ...blogArticleHtmlFiles(),
  ...compileContentStyles().pages,
  ...compileHomeStyles().pages,
  ...compileLearnStyles().pages,
  ...compileInteractiveStyles().pages,
  ...compileWoodStyles().pages,
  ...compileWoodSpeciesStyles().pages,
  ...compileWoodDatabaseStyles().pages,
  ...compilePlanningStyles().pages,
  ...compileTemplateStyles().pages,
  ...compileConstructionStyles().pages,
  ...compilePlywoodStyles().pages,
  ...compileChecklistStyles().pages,
  ...compileLegalStyles().pages,
  ...compileGlossaryStyles().pages,
  ...compileWorkflowStyles().pages,
];
for (const [route, dependencies] of [
  ["wood-movement", ["wood-movement-core"]],
  ["finishing-planner", ["finishing-core"]],
  ["edge-banding", ["edge-banding-core", "cut-handoff-model"]],
  ["cabinet-studio", ["cabinet-studio-core"]],
]) {
  const html = readFileSync(join(root, route, "index.html"), "utf8");
  for (const dependency of dependencies) if (!html.includes(`<link rel="modulepreload" href="/assets/${dependency}.js">`)) failures.push(`${route}: missing ${dependency} module preload`);
}
for (const file of new Set(allProfiledPages)) {
  const html = readFileSync(join(root, file), "utf8");
  if (/<link\b[^>]*rel="stylesheet"/.test(html)) failures.push(`${file}: stylesheet request blocks first paint`);
  if (performanceProfile(file, html).stylesheet && !html.includes('data-site-brand as="image" href="/assets/icons/brand-icon.webp"')) failures.push(`${file}: header logo is discovered only after JavaScript`);
  const profile = performanceProfile(file, html);
  const bootstrap = profile.runtimes.includes("/assets/wood-page.js") ? "/assets/wood-page.js" : "/assets/site-chrome.js";
  if (profile.stylesheet && !html.includes(`data-site-bootstrap as="script" href="${bootstrap}"`)) failures.push(`${file}: navigation bootstrap is discovered after inline CSS`);
  if (profile.runtimes.includes("/assets/app.js") && !html.includes('data-site-bootstrap as="script" href="/assets/app.js"')) failures.push(`${file}: calculator bootstrap is discovered after inline CSS`);
  if (file.startsWith("templates/") && html.includes('class="template-page-visual"')) {
    const source = html.match(/<picture><source type="image\/avif" srcset="([^"]+)" sizes="([^"]+)"/);
    const preload = html.match(/<link rel="preload" as="image" type="image\/avif"[^>]*>/)?.[0] || "";
    if (!source || !preload.includes(`imagesrcset="${source[1]}"`) || !preload.includes(`imagesizes="${source[2]}"`)) failures.push(`${file}: Template AVIF preload must match picture candidates`);
  }
}

for (const name of ["cabinets", "storage", "furniture", "shop"]) {
  const fallback = statSync(join(root, `assets/images/templates/template-${name}.webp`)).size;
  for (const width of [480, 960, 1448]) {
    const path = join(root, `assets/images/templates/template-${name}-${width}.avif`);
    if (!existsSync(path) || statSync(path).size > fallback * 0.8) failures.push(`${path}: template AVIF savings budget exceeded`);
  }
}

for (const { src } of articlePhotos) {
  for (const width of [480, 960]) {
    const avif = join(root, src.replace(/\.webp$/, `-${width}.avif`));
    const fallback = join(root, src.replace(/\.webp$/, width === 480 ? "-480.webp" : ".webp"));
    if (!existsSync(avif) || statSync(avif).size > statSync(fallback).size * 0.8) failures.push(`${avif}: must save at least 20% over WebP`);
  }
}
const cutlistHero = "/assets/images/apps/cutlist/cutlist-layout-stats-598.avif";
const cutlistHtml = readFileSync(join(root, "apps/cutlist/index.html"), "utf8");
if (!cutlistHtml.includes(`<link rel="preload" as="image" type="image/avif" href="${cutlistHero}" fetchpriority="high">`) || !cutlistHtml.includes(`<source type="image/avif" srcset="${cutlistHero}">`)) failures.push("CutList: matching hero picture/preload required");
if (statSync(join(root, cutlistHero)).size > statSync(join(root, "assets/images/apps/cutlist/cutlist-layout-stats.webp")).size * 0.8) failures.push("CutList: AVIF must save at least 20% over WebP");
for (const match of cutlistHtml.matchAll(/<figure class="cutlist-screenshot-card">([\s\S]*?)<\/figure>/g)) {
  if (!match[1].includes('loading="lazy"') || !match[1].includes('fetchpriority="low"')) failures.push("CutList: supporting screenshots compete with its hero");
}

const chromeSource = readFileSync(join(root, "assets/site-chrome.js"), "utf8");
const brandIconSize = statSync(join(root, "assets/icons/brand-icon.webp")).size;
if (!chromeSource.includes('/assets/icons/brand-icon.webp') || chromeSource.includes('class="brand-icon" src="/assets/icons/apple-touch-icon.png')) failures.push("Shared header must use the compact brand icon");
if (brandIconSize > 4_000) failures.push(`Brand icon is ${brandIconSize} bytes (limit 4000)`);
if (readFileSync(join(root, "assets/styles.css"), "utf8").includes('/assets/images/woodworking/')) failures.push("Directory card CSS must not eagerly request the shared woodworking photo set");

const woodworkingImages = readdirSync(join(root, "assets/images/woodworking")).filter((file) => /^wood-\d\d-.*\.webp$/.test(file));
const woodworkingImageBytes = woodworkingImages.reduce((sum, file) => sum + statSync(join(root, "assets/images/woodworking", file)).size, 0);
if (woodworkingImageBytes > 750_000) failures.push(`Responsive woodworking image set is ${woodworkingImageBytes} bytes (limit 750000)`);
for (const file of woodworkingImages) {
  const limit = file.includes("-480.webp") ? 26_000 : 65_000;
  const size = statSync(join(root, "assets/images/woodworking", file)).size;
  if (size > limit) failures.push(`${file} is ${size} bytes (limit ${limit})`);
}

const headers = readFileSync(join(root, "_headers"), "utf8");
for (const [file, expected, limit] of [["wood-page.js", woodRuntimeSource(), 18_000], ["wood-language.js", woodLanguageSource(), 25_000]]) {
  const actual = readFileSync(join(root, "assets", file), "utf8");
  if (actual !== expected || Buffer.byteLength(actual) > limit) failures.push(`${file}: stale runtime or byte budget exceeded`);
}
if (readFileSync(join(root, "assets/wood-menus.json"), "utf8") !== JSON.stringify(renderWoodChrome("/wood/").menus) + "\n") failures.push("Wood menus are stale");
for (const asset of ["learn.css", "wood-species.css", "wood-page.js", "wood-language.js", "wood-menus.json", "compare.css", "wood-database.css", "glossary.css", "workflow-shell.css", "finishing-planner.js", "finishing-core.js", "finishing-planner.css", "edge-banding.js", "edge-banding-core.js", "edge-banding.css", "wood-movement.js", "wood-movement-core.js", "wood-movement.css"]) {
  const block = headers.match(new RegExp(`/assets/${asset.replace(".", "\\.")}\\n([\\s\\S]*?)(?=\\n/|$)`))?.[1] || "";
  if (!/Cache-Control: public, max-age=[1-9]\d*/.test(block)) failures.push(`${asset} is missing a positive browser cache lifetime`);
}
for (const asset of ["home.css", "site-chrome.js", "content-page.js", "home.js", "conversion.js", "blog-article.css", "wood.css", "planning.css", "templates.css", "construction.css", "construction-calculators.js", "component-builder.js", "component-builder.css", "plywood.css", "checklists.css", "legal.css", "plywood-core.js", "plywood-workflow.js", "cut-handoff-model.js", "plywood-workflow.css"]) {
  const block = headers.match(new RegExp(`/assets/${asset.replace(".", "\\.")}\\n([\\s\\S]*?)(?=\\n/|$)`))?.[1] || "";
  if (!/Cache-Control: public, max-age=[1-9]\d*/.test(block)) failures.push(`${asset} is missing a positive browser cache lifetime`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Core Web Vitals guards passed: ${articlePages} image-led articles, ${editorialPages} static Blog articles, ${heroImages} hero preloads, ${inlineImages} lazy/low-priority inline images, ${compareLcpImages} Compare LCP preloads, stair bundle ${stairBundleSize} bytes, App stylesheet ${Buffer.byteLength(appStyles)} bytes, editorial stylesheet ${Buffer.byteLength(editorialStyles)} bytes, Blog article stylesheet ${Buffer.byteLength(blogArticleStyles)} bytes, content stylesheet ${statSync(join(root, "assets/content.css")).size} bytes, interactive stylesheet ${statSync(join(root, "assets/interactive.css")).size} bytes, wood stylesheet ${statSync(join(root, "assets/wood.css")).size} bytes, Blog index ${Buffer.byteLength(blogIndex)} bytes, brand icon ${brandIconSize} bytes.`);
