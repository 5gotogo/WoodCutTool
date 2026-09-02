import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];
let articlePages = 0;
let heroImages = 0;
let inlineImages = 0;

function inspectArticles(directory) {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(root, directory, entry.name, "index.html");
    try {
      const html = readFileSync(path, "utf8");
      const hero = html.match(/<figure class="article-wood-photo article-wood-photo-hero">\s*<img src="([^"]+)"[^>]*>/);
      if (!hero) continue;
      articlePages += 1;
      heroImages += 1;
      const heroTag = hero[0];
      const preload = `<link rel="preload" as="image" href="${hero[1]}" fetchpriority="high">`;
      if (!html.includes(preload)) failures.push(`${directory}/${entry.name}: hero image is not preloaded`);
      if (!heroTag.includes('loading="eager"') || !heroTag.includes('fetchpriority="high"')) {
        failures.push(`${directory}/${entry.name}: hero image is not eager/high priority`);
      }

      for (const match of html.matchAll(/<figure class="article-wood-photo article-wood-photo-inline">\s*<img[^>]*>/g)) {
        inlineImages += 1;
        if (!match[0].includes('loading="lazy"') || !match[0].includes('fetchpriority="low"')) {
          failures.push(`${directory}/${entry.name}: supporting image can compete with the LCP image`);
        }
      }
    } catch {
      // Not every directory entry is an article route.
    }
  }
}

inspectArticles("blog");
inspectArticles("learn");

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

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Core Web Vitals guards passed: ${articlePages} article pages, ${heroImages} hero preloads, ${inlineImages} lazy/low-priority inline images, stair bundle ${stairBundleSize} bytes.`);
