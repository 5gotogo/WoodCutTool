import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sitemapRoute, extractImages } from "./sitemap-page.mjs";
import { constructionTools } from "./construction-tool-data.mjs";
import { SITEMAP_SIGNATURE_VERSION, sitemapContentSignature } from "./sitemap-content-signature.mjs";

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

function hashContent(value) {
  return createHash("sha256").update(value).digest("hex");
}

function todayInTimeZone(timeZone = "Asia/Shanghai") {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
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
  const map = new Map();
  const files = ["sitemap.xml", ...readdirSync(root).filter((name) => /^sitemap-[a-z-]+\.xml$/.test(name))];
  for (const file of new Set(files)) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const xml = readFileSync(path, "utf8");
    for (const match of xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) {
      try {
        const url = new URL(match[1]);
        map.set(url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`, match[2]);
      } catch {
        // Ignore malformed legacy sitemap rows and let this run generate a fresh date.
      }
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

  if (route === "/built-in-scribe/" || route === "/solid-wood-milling/" || route === "/drawer-fit/" || route === "/joinery-lab/" || route === "/shelf-pin-layout/" || route === "/glue-up/" || route === "/assembly-check/" || route === "/cabinet-studio/" || route === "/edge-banding/" || route === "/finishing-planner/" || route === "/wood-movement/") {
    return { changefreq: "monthly", priority: "0.94" };
  }

  if (route === "/tools/components/") {
    return { changefreq: "weekly", priority: "0.94" };
  }

  if (route === "/projects/") {
    return { changefreq: "weekly", priority: "0.94" };
  }

  if (route === "/one-sheet-projects/") {
    return { changefreq: "weekly", priority: "0.94" };
  }

  if (route === "/learn/") {
    return { changefreq: "weekly", priority: "0.93" };
  }

  if (route === "/examples/") {
    return { changefreq: "weekly", priority: "0.92" };
  }

  if (route === "/troubleshooting/") {
    return { changefreq: "weekly", priority: "0.92" };
  }

  if (route === "/checklists/") {
    return { changefreq: "weekly", priority: "0.92" };
  }

  if (route === "/worksheets/") {
    return { changefreq: "weekly", priority: "0.92" };
  }

  if (route === "/glossary/") {
    return { changefreq: "weekly", priority: "0.9" };
  }

  if (route === "/wood/") {
    return { changefreq: "weekly", priority: "0.91" };
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

  if (route === "/board-foot-calculator/" || route === "/wood-waste-calculator/" || route === "/kerf-calculator/") {
    return { changefreq: "monthly", priority: "0.85" };
  }

  if (route === "/blog/") {
    return { changefreq: "monthly", priority: "0.9" };
  }

  if (route === "/blog/wood-cutting-calculator-guide/" || route === "/blog/how-to-optimize-material-layout/") {
    return { changefreq: "monthly", priority: "0.8" };
  }

  if (route.startsWith("/learn/topics/")) {
    return { changefreq: "weekly", priority: "0.88" };
  }

  if (route.startsWith("/tools/components/")) {
    return { changefreq: "monthly", priority: "0.84" };
  }

  if (route.startsWith("/projects/")) {
    return { changefreq: "monthly", priority: "0.84" };
  }

  if (route.startsWith("/learn/")) {
    return { changefreq: "monthly", priority: "0.82" };
  }

  if (route.startsWith("/examples/")) {
    return { changefreq: "monthly", priority: "0.81" };
  }

  if (route.startsWith("/troubleshooting/")) {
    return { changefreq: "monthly", priority: "0.81" };
  }

  if (route.startsWith("/checklists/")) {
    return { changefreq: "monthly", priority: "0.81" };
  }

  if (route.startsWith("/worksheets/")) {
    return { changefreq: "monthly", priority: "0.81" };
  }

  if (route.startsWith("/glossary/")) {
    return { changefreq: "monthly", priority: "0.76" };
  }

  if (route.startsWith("/wood/")) {
    return { changefreq: "monthly", priority: "0.78" };
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

  if (
    route === "/privacy-policy/" ||
    route === "/terms-of-service/" ||
    route === "/disclaimer/" ||
    route === "/cookie-policy/" ||
    route === "/copyright-notice/" ||
    route === "/acceptable-use-policy/" ||
    route === "/external-links-policy/"
  ) {
    return { changefreq: "yearly", priority: "0.5" };
  }

  return { changefreq: "monthly", priority: "0.7" };
}

function sortRoutes(routes) {
  const preferredOrder = [
    "/",
    "/tools/",
    "/tools/components/",
    "/projects/",
    "/one-sheet-projects/",
    "/learn/",
    "/troubleshooting/",
    "/checklists/",
    "/examples/",
    "/glossary/",
    "/apps/",
    "/apps/cutlist/",
    "/apps/quiltfit/",
    "/cutlist/",
    "/quiltfit/",
    "/tile-calculator/",
    "/stringer/",
    "/cut-list-calculator/",
    "/plywood-cut-calculator/",
    "/stair-stringer-calculator/",
    "/board-foot-calculator/",
    "/wood-waste-calculator/",
    "/kerf-calculator/",
    "/blog/",
    "/privacy-policy/",
    "/terms-of-service/",
    "/disclaimer/",
    "/cookie-policy/",
    "/copyright-notice/",
    "/acceptable-use-policy/",
    "/external-links-policy/"
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
const routeLegacyHashes = new Map();

for (const file of collectHtmlFiles()) {
  const html = readFileSync(join(root, file), "utf8");

  const route = sitemapRoute(html, routeFromFile(file), siteUrl);
  if (!route) continue;
  routes.add(route);

  const hashes = routeHashes.get(route) ?? [];
  hashes.push(sitemapContentSignature(html));
  routeHashes.set(route, hashes);

  // Keep the prior raw-HTML signature for a one-time, lossless migration. This
  // lets pages that truly changed during the migration refresh their lastmod,
  // while unchanged pages retain the date stored by the previous algorithm.
  const legacyHashes = routeLegacyHashes.get(route) ?? [];
  legacyHashes.push(hashContent(html));
  routeLegacyHashes.set(route, legacyHashes);

  // Attach authored images only to their indexable canonical page.
  const images = extractImages(html, `${siteUrl}${route}`);
  if (images.length) {
    const existing = routeImages.get(route) ?? new Set();
    for (const src of images) existing.add(src);
    routeImages.set(route, existing);
  }
}

const urls = sortRoutes([...routes]);
const today = todayInTimeZone(process.env.SITEMAP_TIME_ZONE || "Asia/Shanghai");
const previousState = loadJson(lastmodStatePath);
const legacyLastmods = loadExistingSitemapLastmods();
const nextState = {};
let imageCount = 0;
const entries = urls.map((route) => {
  const { changefreq, priority } = sitemapMeta(route);
  const signature = hashContent((routeHashes.get(route) ?? []).sort().join("|"));
  const legacySignature = hashContent((routeLegacyHashes.get(route) ?? []).sort().join("|"));
  const previous = previousState[route];
  const hasCurrentSignature = previous?.hashVersion === SITEMAP_SIGNATURE_VERSION;
  const changed = hasCurrentSignature
    ? previous?.hash !== signature
    : Boolean(previous?.hash && previous.hash !== legacySignature);
  const lastmod = changed
    ? today
    : (previous?.lastmod || legacyLastmods.get(route) || today);
  nextState[route] = { lastmod, hash: signature, hashVersion: SITEMAP_SIGNATURE_VERSION };
  const images = [...(routeImages.get(route) ?? [])];
  imageCount += images.length;
  const imageTags = images
    .map((src) => `\n    <image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`)
    .join("");
  return { route, xml: `  <url><loc>${xmlEscape(`${siteUrl}${route}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${imageTags}</url>` };
});

const explicitToolRoutes = new Set([
  "/tools/", "/tools/woodworking/", "/tools/construction/", "/cabinet-studio/",
  "/plywood-cut-calculator/", "/cut-list-calculator/", "/wood-waste-calculator/", "/board-foot-calculator/", "/kerf-calculator/",
  "/stair-stringer-calculator/", "/tile-calculator/", "/stringer/", "/cutlist/", "/quiltfit/", "/lumber-calculator/", "/sheet-calculator/",
  "/material-cost-calculator/", "/cost-estimator/", "/wood-weight-calculator/", "/fraction-calculator/", "/inch-mm-converter/", "/conversion/",
  "/material-list-generator/", "/screw-size-finder/", "/drill-bit-finder/", "/material-library/", "/wood-database/", ...constructionTools.map((tool) => tool.route)
]);

function sitemapGroup(route) {
  if (["/built-in-scribe/", "/furniture-fit/", "/offcut-planner/", "/door-installation/", "/workshop-atlas/", "/estimating/"].some(prefix => route.startsWith(prefix))) return "tools";
  if (route.startsWith("/solid-wood-milling/") || route.startsWith("/drawer-fit/") || route.startsWith("/joinery-lab/") || route.startsWith("/shelf-pin-layout/") || explicitToolRoutes.has(route) || route.startsWith("/tools/") || route.startsWith("/glue-up/") || route.startsWith("/assembly-check/") || route.startsWith("/edge-banding/") || route.startsWith("/finishing-planner/") || route.startsWith("/wood-movement/")) return "tools";
  if (route.startsWith("/projects/") || route.startsWith("/one-sheet-projects/")) return "projects";
  if (route.startsWith("/learn/") || route.startsWith("/guides/")) return "learn";
  if (route.startsWith("/templates/")) return "templates";
  if (route.startsWith("/worksheets/")) return "worksheets";
  if (route.startsWith("/blog/")) return "blog";
  if (route.startsWith("/apps/compare/")) return "app-comparisons";
  if (route.startsWith("/apps/")) return "apps";
  if (route.startsWith("/compare/") || route.startsWith("/glossary/") || route.startsWith("/wood/") || route.startsWith("/research/") || route.startsWith("/examples/") || route.startsWith("/troubleshooting/") || route.startsWith("/checklists/")) return "resources";
  return "pages";
}

const grouped = new Map();
for (const entry of entries) {
  const group = sitemapGroup(entry.route);
  if (!grouped.has(group)) grouped.set(group, []);
  grouped.get(group).push(entry);
}

const childFiles = [];
for (const [group, groupEntries] of grouped) {
  const file = `sitemap-${group}.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${groupEntries.map((entry) => entry.xml).join("\n")}\n</urlset>\n`;
  writeFileSync(join(root, file), xml);
  childFiles.push({
    file,
    lastmod: groupEntries.map((entry) => nextState[entry.route].lastmod).sort().at(-1),
  });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${childFiles.sort((a, b) => a.file.localeCompare(b.file)).map(({ file, lastmod }) => `  <sitemap><loc>${siteUrl}/${file}</loc><lastmod>${lastmod}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;

writeFileSync(lastmodStatePath, `${JSON.stringify(nextState, null, 2)}\n`);
writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`Generated sitemap index with ${childFiles.length} files, ${urls.length} URLs, and ${imageCount} images.`);
