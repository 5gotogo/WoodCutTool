import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://woodcuttool.com").replace(/\/$/, "");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
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

function collectHtmlFiles(dir = root, prefix = "") {
  const files = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) {
      continue;
    }

    const absolute = join(dir, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(absolute, relative));
    } else if (entry.isFile() && entry.name === "index.html") {
      files.push(relative);
    }
  }

  return files.sort();
}

const sitemap = readText("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);

if (sitemapUrlSet.size !== sitemapUrls.length) {
  errors.push("Sitemap contains duplicate URLs.");
}

function routeFromFile(file) {
  if (file === "index.html") {
    return "/";
  }

  return `/${dirname(file)}/`;
}

function hasNoindex(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return metaTags.some((tag) => {
    const name = tag.match(/\bname=["']robots["']/i);
    const content = tag.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? "";
    return name && content.toLowerCase().split(",").map((part) => part.trim()).includes("noindex");
  });
}

function canonicalRoute(html, fallbackRoute) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const isCanonical = /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag);
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];

    if (!isCanonical || !href) {
      continue;
    }

    try {
      const url = new URL(href, siteUrl);
      if (url.origin === siteUrl) {
        return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
      }
    } catch {
      return fallbackRoute;
    }
  }

  return fallbackRoute;
}

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

const htmlFiles = collectHtmlFiles();

for (const file of htmlFiles) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing expected HTML file: ${file}`);
    continue;
  }

  const html = readText(file);

  if (!hasNoindex(html)) {
    const route = canonicalRoute(html, routeFromFile(file));
    if (!sitemapUrlSet.has(`${siteUrl}${route}`)) {
      errors.push(`${file} is indexable but missing from sitemap.xml: ${route}`);
    }
  }

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
