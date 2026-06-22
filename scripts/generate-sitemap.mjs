import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://woodcuttool.com").replace(/\/$/, "");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);

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

for (const file of collectHtmlFiles()) {
  const html = readFileSync(join(root, file), "utf8");

  if (hasNoindex(html)) {
    continue;
  }

  routes.add(canonicalRoute(html, routeFromFile(file)));
}

const urls = sortRoutes([...routes]);
const entries = urls.map((route) => {
  const { changefreq, priority } = sitemapMeta(route);
  return `  <url><loc>${xmlEscape(`${siteUrl}${route}`)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
