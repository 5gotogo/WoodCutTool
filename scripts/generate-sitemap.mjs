import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://woodcuttool.com").replace(/\/$/, "");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const lastmodStatePath = join(root, "data", "sitemap-lastmod.json");

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

// Extract meaningful, page-specific images for an image sitemap. We deliberately skip
// the shared OG fallback, favicons, and inline SVG placeholders so Google Image search
// only sees genuinely unique images (blog article photos and App Store app icons).
function extractImages(html) {
  const images = new Set();
  const keep = (src) => {
    if (!src || !/^https?:\/\//i.test(src)) return false;
    if (/\/assets\/og\//i.test(src)) return false; // shared OG fallback
    if (/favicon|apple-touch-icon/i.test(src)) return false;
    if (/\.svg(\?|$)/i.test(src)) return false;
    return true;
  };

  // App Store icons carry the class directly on the <img> tag.
  for (const match of html.matchAll(/<img\b[^>]*\bclass=["'][^"']*\bapp-detail-icon\b[^"']*["'][^>]*>/gi)) {
    const src = match[0].match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (keep(src)) images.add(src);
  }

  // Blog article photos live inside a <figure class="...blog-photo-visual..."> wrapper,
  // so match the figure block and pull the first <img> src from within it.
  for (const fig of html.matchAll(/<figure\b[^>]*\bblog-photo-visual\b[^>]*>([\s\S]*?)<\/figure>/gi)) {
    const src = fig[1].match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1];
    if (keep(src)) images.add(src);
  }

  return [...images];
}

function hashContent(value) {
  return createHash("sha256").update(value).digest("hex");
}

function loadJson(path) {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

function loadExistingSitemapLastmods() {
  const path = join(root, "sitemap.xml");
  if (!existsSync(path)) return new Map();
  const xml = readFileSync(path, "utf8");
  const map = new Map();
  for (const match of xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) {
    try {
      const url = new URL(match[1]);
      map.set(url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`, match[2]);
    } catch {
      // Ignore malformed legacy sitemap rows and let this run generate a fresh date.
    }
  }
  return map;
}

function sitemapMeta(route) {
  if (route === "/") {
    return { changefreq: "weekly", priority: "1.0" };
  }

  if (route === "/apps/" || route === "/apps/cutlist/") {
    return { changefreq: "weekly", priority: "0.95" };
  }

  if (route === "/tools/") {
    return { changefreq: "weekly", priority: "0.96" };
  }

  if (route === "/learn/") {
    return { changefreq: "weekly", priority: "0.93" };
  }

  if (route === "/apps/quiltfit/") {
    return { changefreq: "weekly", priority: "0.9" };
  }

  if (route.startsWith("/apps/")) {
    return { changefreq: "monthly", priority: "0.65" };
  }

  if (route === "/cutlist/") {
    return { changefreq: "weekly", priority: "0.98" };
  }

  if (route === "/quiltfit/" || route === "/tile-calculator/" || route === "/stringer/") {
    return { changefreq: "weekly", priority: "0.92" };
  }

  if (route === "/cut-list-calculator/" || route === "/plywood-cut-calculator/") {
    return { changefreq: "weekly", priority: "0.95" };
  }

  if (route === "/stair-stringer-calculator/") {
    return { changefreq: "monthly", priority: "0.9" };
  }

  if (route === "/board-foot-calculator/" || route === "/wood-waste-calculator/") {
    return { changefreq: "monthly", priority: "0.85" };
  }

  if (route === "/blog/") {
    return { changefreq: "monthly", priority: "0.9" };
  }

  if (route === "/blog/wood-cutting-calculator-guide/" || route === "/blog/how-to-optimize-material-layout/") {
    return { changefreq: "monthly", priority: "0.8" };
  }

  if (route.startsWith("/learn/")) {
    return { changefreq: "monthly", priority: "0.82" };
  }

  if (route.startsWith("/blog/")) {
    return { changefreq: "monthly", priority: "0.74" };
  }

  if (route.includes("/support/")) {
    return { changefreq: "monthly", priority: "0.55" };
  }

  if (route.includes("/privacy/")) {
    return { changefreq: "yearly", priority: "0.55" };
  }

  if (route === "/privacy-policy/" || route === "/terms-of-service/") {
    return { changefreq: "yearly", priority: "0.5" };
  }

  return { changefreq: "monthly", priority: "0.7" };
}

function sortRoutes(routes) {
  const preferredOrder = [
    "/",
    "/tools/",
    "/learn/",
    "/apps/",
    "/apps/cutlist/",
    "/apps/quiltfit/",
    "/apps/pdfscanner/",
    "/apps/receipt/",
    "/cutlist/",
    "/quiltfit/",
    "/tile-calculator/",
    "/stringer/",
    "/cut-list-calculator/",
    "/plywood-cut-calculator/",
    "/stair-stringer-calculator/",
    "/board-foot-calculator/",
    "/wood-waste-calculator/",
    "/blog/",
    "/privacy-policy/",
    "/terms-of-service/"
  ];
  const order = new Map(preferredOrder.map((route, index) => [route, index]));

  return routes.sort((a, b) => {
    const aOrder = order.get(a) ?? 1000;
    const bOrder = order.get(b) ?? 1000;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.localeCompare(b);
  });
}

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

const routes = new Set();
const routeImages = new Map();
const routeHashes = new Map();

for (const file of collectHtmlFiles()) {
  const html = readFileSync(join(root, file), "utf8");

  if (hasNoindex(html)) {
    continue;
  }

  const route = canonicalRoute(html, routeFromFile(file));
  routes.add(route);

  const hashes = routeHashes.get(route) ?? [];
  hashes.push(hashContent(html));
  routeHashes.set(route, hashes);

  // Attach unique images to the canonical route (alias pages fold into their canonical).
  const images = extractImages(html);
  if (images.length) {
    const existing = routeImages.get(route) ?? new Set();
    for (const src of images) existing.add(src);
    routeImages.set(route, existing);
  }
}

const urls = sortRoutes([...routes]);
const today = new Date().toISOString().slice(0, 10);
const previousState = loadJson(lastmodStatePath);
const legacyLastmods = loadExistingSitemapLastmods();
const nextState = {};
let imageCount = 0;
const entries = urls.map((route) => {
  const { changefreq, priority } = sitemapMeta(route);
  const signature = hashContent((routeHashes.get(route) ?? []).sort().join("|"));
  const previous = previousState[route];
  const lastmod = previous?.hash === signature
    ? previous.lastmod
    : (previous?.lastmod ? today : (legacyLastmods.get(route) || today));
  nextState[route] = { lastmod, hash: signature };
  const images = [...(routeImages.get(route) ?? [])];
  imageCount += images.length;
  const imageTags = images
    .map((src) => `\n    <image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`)
    .join("");
  return `  <url><loc>${xmlEscape(`${siteUrl}${route}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${imageTags}</url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join("\n")}\n</urlset>\n`;

writeFileSync(lastmodStatePath, `${JSON.stringify(nextState, null, 2)}\n`);
writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${urls.length} URLs and ${imageCount} images.`);
