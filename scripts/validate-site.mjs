import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const errors = [];

function pathExists(route) {
  const clean = route.split("#")[0].split("?")[0];

  if (!clean || clean === "/") {
    return existsSync(join(root, "index.html"));
  }

  if (clean.endsWith("/")) {
    return existsSync(join(root, clean, "index.html"));
  }

  return existsSync(join(root, clean)) || existsSync(join(root, `${clean}.html`));
}

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

const sitemap = readText("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

for (const url of sitemapUrls) {
  if (!url.startsWith(siteUrl)) {
    errors.push(`Sitemap URL does not use ${siteUrl}: ${url}`);
    continue;
  }

  const route = new URL(url).pathname;
  if (!pathExists(route)) {
    errors.push(`Sitemap route missing local page: ${route}`);
  }
}

const htmlFiles = [
  "index.html",
  "cutlist/index.html",
  "quiltfit/index.html",
  "tile-calculator/index.html",
  "stringer/index.html",
  "privacy-policy/index.html",
  "terms-of-service/index.html",
  "cut-list-calculator/index.html",
  "plywood-cut-calculator/index.html",
  "stair-stringer-calculator/index.html",
  "board-foot-calculator/index.html",
  "wood-waste-calculator/index.html",
  "blog/plywood-cutting-optimization/index.html",
  "blog/stair-stringer-calculator-guide/index.html",
  "blog/cut-list-optimization-tips/index.html"
];

for (const file of htmlFiles) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing expected HTML file: ${file}`);
    continue;
  }

  const html = readText(file);
  const links = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const link of links) {
    if (
      link.startsWith("http://") ||
      link.startsWith("https://") ||
      link.startsWith("mailto:") ||
      link.startsWith("tel:") ||
      link.startsWith("#")
    ) {
      continue;
    }

    if (link.startsWith("/") && !pathExists(link)) {
      errors.push(`${file} references missing local path: ${link}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs.`);
