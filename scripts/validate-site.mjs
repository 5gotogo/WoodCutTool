import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://woodcuttool.com").replace(/\/$/, "");
const siteHost = new URL(siteUrl).hostname;
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const errors = [];
const redirectSourcePaths = new Set(
  readFileSync(join(root, "_redirects"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/)[0] ?? "")
    .filter((source) => source.startsWith("/") && !source.includes("*") && !source.includes(":"))
);

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

function pagesFunctionExists(route) {
  const clean = route.split("#")[0].split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!clean) {
    return false;
  }

  return existsSync(join(root, "functions", `${clean}.js`));
}

function directoryRouteExists(pathname) {
  if (!pathname || pathname === "/") {
    return false;
  }

  return existsSync(join(root, pathname, "index.html"));
}

function redirectProneLocalPath(pathname) {
  if (redirectSourcePaths.has(pathname)) {
    return "is configured as a redirect source";
  }

  if (pathname.endsWith("/index.html")) {
    return "uses /index.html instead of the canonical directory route";
  }

  if (!pathname.endsWith("/") && directoryRouteExists(pathname)) {
    return "omits trailing slash for a directory route";
  }

  return "";
}

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

const siteChromeSource = readText("assets/site-chrome.js");
const contentPageSource = readText("assets/content-page.js");
if (!contentPageSource.includes('const appScriptPath = "/assets/app.js"')) {
  errors.push("Lightweight content runtime cannot load the full app runtime on demand.");
}
if (!siteChromeSource.includes("function initMegaNavigation()")) {
  errors.push("Shared navigation runtime is missing from site-chrome.js.");
}
if (!siteChromeSource.includes("const projectsMenu = {")) {
  errors.push("Shared navigation is missing the Projects menu definition.");
}
if (!siteChromeSource.includes('href: "/projects/"')) {
  errors.push("Shared navigation does not link the Projects destination to /projects/.");
}
if (!siteChromeSource.includes("const resourcesMenu = {")) {
  errors.push("Shared navigation is missing the Resources menu definition.");
}
for (const renderedMenu of [
  "${resourceNavMenu(projectsMenu)}",
  "${resourceNavMenu(learnMenu)}",
  "${resourceNavMenu(resourcesMenu)}"
]) {
  if (!siteChromeSource.includes(renderedMenu)) {
    errors.push(`Shared navigation does not render the expected consolidated menu: ${renderedMenu}`);
  }
}
if (!siteChromeSource.includes('class="nav-menu-toggle"')) {
  errors.push("Shared navigation is missing a separate mobile menu toggle.");
}

const checklistHubSource = readText("checklists/index.html");
for (const categoryId of [
  "planning-measurement",
  "materials-purchasing",
  "cutting-machining",
  "assembly-joinery",
  "cabinets-hardware",
  "installation-site-work",
  "finishing-handoff"
]) {
  if (!checklistHubSource.includes(`id="${categoryId}"`)) {
    errors.push(`Checklists navigation target is missing from the hub: #${categoryId}`);
  }
}

const projectsHubSource = readText("projects/index.html");
for (const categoryId of [
  "cabinets",
  "storage",
  "furniture",
  "shop",
  "small-spaces",
  "outdoor"
]) {
  if (!projectsHubSource.includes(`id="${categoryId}"`)) {
    errors.push(`Projects navigation target is missing from the hub: #${categoryId}`);
  }
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
    } else if (entry.isFile() && (entry.name === "index.html" || relative === "404.html")) {
      files.push(relative);
    }
  }

  return files.sort();
}

const sitemap = readText("sitemap.xml");
const sitemapIndexUrls = [...sitemap.matchAll(/<sitemap><loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapFiles = sitemapIndexUrls.map((url) => {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== siteUrl) errors.push(`Sitemap index URL does not use ${siteUrl}: ${url}`);
    return parsed.pathname.replace(/^\//, "");
  } catch {
    errors.push(`Malformed sitemap index URL: ${url}`);
    return "";
  }
}).filter(Boolean);

if (!sitemapFiles.length) {
  errors.push("sitemap.xml is missing child sitemap entries.");
}

const sitemapUrls = sitemapFiles.flatMap((file) => {
  if (!existsSync(join(root, file))) {
    errors.push(`Sitemap index references missing file: ${file}`);
    return [];
  }
  const xml = readText(file);
  return [...xml.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
});
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
  const redirectReason = redirectProneLocalPath(route);
  if (redirectReason) {
    errors.push(`Sitemap URL ${redirectReason}: ${route}`);
  }

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

  const headerMounts = html.match(/<div\b[^>]*\bdata-site-header\b[^>]*>\s*<\/div>/gi) ?? [];
  const footerMounts = html.match(/<div\b[^>]*\bdata-site-footer\b[^>]*>\s*<\/div>/gi) ?? [];
  const staticHeaders = html.match(/<header\b[^>]*\bclass=["'][^"']*\bsite-header\b[^"']*["'][^>]*>/gi) ?? [];
  const staticFooters = html.match(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/gi) ?? [];
  const siteChromeScripts = html.match(/<script\b[^>]*\bsrc=["']\/assets\/site-chrome\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi) ?? [];
  if (siteChromeScripts.length !== 1) {
    errors.push(`${file} must load exactly one shared site-chrome.js script; found ${siteChromeScripts.length}`);
  }
  if (headerMounts.length !== 1 || footerMounts.length !== 1) {
    errors.push(`${file} must contain exactly one shared header and footer mount`);
  }
  if (/<!-- shared-(?:header|footer):(?:start|end) -->/.test(html) || html.includes("data-site-chrome-fallback")) {
    errors.push(`${file} still contains expanded shared chrome instead of the common mount`);
  }
  if (staticHeaders.length || staticFooters.length) {
    errors.push(`${file} contains static site chrome in addition to the shared mounts`);
  }
  if (siteChromeScripts.some((tag) => /site-chrome\.js\?/i.test(tag))) {
    errors.push(`${file} uses a versioned site-chrome.js URL instead of the shared canonical asset URL`);
  }

  if (file === "wood/index.html" || /^wood\/[^/]+\/index\.html$/.test(file)) {
    const contentRuntimeScripts = html.match(/<script\b[^>]*\bsrc=["']\/assets\/content-page\.js["'][^>]*>\s*<\/script>/gi) ?? [];
    if (contentRuntimeScripts.length !== 1) {
      errors.push(`${file} must load exactly one lightweight content-page.js runtime; found ${contentRuntimeScripts.length}`);
    }
    if (/src=["']\/assets\/app\.js["']/.test(html)) {
      errors.push(`${file} eagerly loads app.js instead of the lightweight content runtime`);
    }
  }

  if (html.includes("{search_term_string}")) {
    errors.push(`${file} exposes a SearchAction template URL that Google may crawl: {search_term_string}`);
  }

  const internalAbsoluteUrls = [...html.matchAll(/https?:\/\/(?:www\.)?woodcuttool\.com(?:\/[^\s"'<>\\]*)?/gi)]
    .map((match) => match[0].replaceAll("&amp;", "&"));

  for (const value of internalAbsoluteUrls) {
    const url = new URL(value);

    if (url.origin !== siteUrl) {
      errors.push(`${file} exposes a noncanonical internal URL (${url.protocol}//${url.host}): ${value}`);
      continue;
    }

    const redirectReason = redirectProneLocalPath(url.pathname);
    if (redirectReason) {
      errors.push(`${file} exposes an absolute internal URL that ${redirectReason}: ${value}`);
    }
  }

  if (!hasNoindex(html)) {
    const route = canonicalRoute(html, routeFromFile(file));
    if (!sitemapUrlSet.has(`${siteUrl}${route}`)) {
      errors.push(`${file} is indexable but missing from sitemap.xml: ${route}`);
    }
  }

  const links = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const link of links) {
    if (link.startsWith("http://") || link.startsWith("https://")) {
      try {
        const url = new URL(link.replaceAll("&amp;", "&"));
        if (url.hostname === siteHost || url.hostname === `www.${siteHost}`) {
          if (url.origin !== siteUrl) {
            errors.push(`${file} references a noncanonical internal URL (${url.protocol}//${url.host}): ${link}`);
          } else {
            const redirectReason = redirectProneLocalPath(url.pathname);
            if (redirectReason) {
              errors.push(`${file} references an absolute internal URL that ${redirectReason}: ${link}`);
            }
          }
        }
      } catch {
        errors.push(`${file} references a malformed absolute URL: ${link}`);
      }
      continue;
    }

    if (
      link.startsWith("mailto:") ||
      link.startsWith("tel:") ||
      link.startsWith("#")
    ) {
      continue;
    }

    if (link.startsWith("/")) {
      const pathname = new URL(link, siteUrl).pathname;
      const redirectReason = redirectProneLocalPath(pathname);

      if (redirectReason) {
        errors.push(`${file} references redirect-prone local path that ${redirectReason}: ${link}`);
      }

      if (!pathExists(link) && !pagesFunctionExists(link)) {
        errors.push(`${file} references missing local path: ${link}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files across ${sitemapFiles.length} sitemaps and ${sitemapUrls.length} sitemap URLs.`);
