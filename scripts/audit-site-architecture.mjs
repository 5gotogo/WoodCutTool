import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const errors = [];

function read(relative) {
  return readFileSync(join(root, relative), "utf8");
}

function routeFile(route) {
  return route === "/"
    ? join(root, "index.html")
    : join(root, route.replace(/^\/|\/$/g, ""), "index.html");
}

function normalizeRoute(value) {
  const decoded = String(value || "").replaceAll("&amp;", "&").trim();
  if (
    !decoded ||
    decoded.startsWith("#") ||
    decoded.startsWith("mailto:") ||
    decoded.startsWith("tel:") ||
    decoded.startsWith("javascript:")
  ) {
    return "";
  }

  let url;
  try {
    url = new URL(decoded, siteUrl);
  } catch {
    return "";
  }

  if (url.origin !== siteUrl) {
    return "";
  }

  let pathname = url.pathname.replace(/\/index\.html$/, "/");
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (!pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(pathname)) pathname += "/";
  return pathname;
}

const sitemapIndex = read("sitemap.xml");
const childSitemaps = [...sitemapIndex.matchAll(/<sitemap><loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.replace(/^\//, ""));

if (!childSitemaps.length) {
  errors.push("sitemap.xml does not reference any child sitemaps.");
}

const sitemapRoutes = childSitemaps.flatMap((file) => {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing child sitemap: ${file}`);
    return [];
  }
  return [...read(file).matchAll(/<url><loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname);
});
const routeSet = new Set(sitemapRoutes);

if (routeSet.size !== sitemapRoutes.length) {
  errors.push("Sitemap routes are not unique.");
}
if (!routeSet.has("/")) {
  errors.push("Sitemap is missing the home route.");
}

const siteChrome = read("assets/site-chrome.js");
let renderedHeader = "";
let renderedFooter = "";
const headerTarget = {
  set outerHTML(value) {
    renderedHeader = String(value);
  }
};
const footerTarget = {
  set outerHTML(value) {
    renderedFooter = String(value);
  }
};

try {
  runInNewContext(siteChrome, {
    window: { location: { pathname: "/" } },
    document: {
      querySelector(selector) {
        if (selector === "[data-site-header]") return headerTarget;
        if (selector === "[data-site-footer]") return footerTarget;
        return null;
      }
    }
  }, { timeout: 1000 });
} catch (error) {
  errors.push(`Unable to render shared site chrome for architecture audit: ${error.message}`);
}

if (!renderedHeader.includes('class="site-header"') || !renderedFooter.includes('class="site-footer"')) {
  errors.push("Shared site chrome did not render both the header and footer.");
}

const renderedSharedChrome = `${renderedHeader}${renderedFooter}`;
const sharedInternalTargets = new Set(
  [...renderedSharedChrome.matchAll(/\bhref=["']([^"']+)["']/gi)]
    .map((match) => normalizeRoute(match[1]))
    .filter(Boolean)
);

for (const target of sharedInternalTargets) {
  if (routeSet.has(target)) continue;

  const clean = target.replace(/^\/|\/$/g, "");
  const staticTarget = target.endsWith("/")
    ? join(root, clean, "index.html")
    : join(root, clean);
  const functionTarget = join(root, "functions", `${clean}.js`);
  if (!existsSync(staticTarget) && !existsSync(functionTarget)) {
    errors.push(`Shared runtime navigation references a missing local target: ${target}`);
  }
}

const sharedNavigationRoutes = new Set(
  [...sharedInternalTargets].filter((route) => routeSet.has(route))
);
const linksByRoute = new Map();
const renderedInboundSources = new Map([...routeSet].map((route) => [route, new Set()]));
const contextualInboundSources = new Map([...routeSet].map((route) => [route, new Set()]));

for (const route of routeSet) {
  const file = routeFile(route);
  if (!existsSync(file)) {
    errors.push(`Sitemap route has no index.html: ${route}`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const headerMounts = html.match(/<div\b[^>]*\bdata-site-header\b[^>]*>\s*<\/div>/gi) ?? [];
  const footerMounts = html.match(/<div\b[^>]*\bdata-site-footer\b[^>]*>\s*<\/div>/gi) ?? [];
  if (headerMounts.length !== 1 || footerMounts.length !== 1) {
    errors.push(`Sitemap route lacks one shared header and footer mount: ${route}`);
  }

  const contextualTargets = new Set(
    [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
      .map((match) => normalizeRoute(match[1]))
      .filter((target) => target && routeSet.has(target))
  );
  const targets = new Set([...sharedNavigationRoutes, ...contextualTargets]);
  linksByRoute.set(route, targets);

  for (const target of targets) {
    if (target !== route) renderedInboundSources.get(target)?.add(route);
  }
  for (const target of contextualTargets) {
    if (target !== route) contextualInboundSources.get(target)?.add(route);
  }
}

const depth = new Map([["/", 0]]);
const queue = ["/"];
for (let index = 0; index < queue.length; index += 1) {
  const route = queue[index];
  for (const target of linksByRoute.get(route) || []) {
    if (depth.has(target)) continue;
    depth.set(target, depth.get(route) + 1);
    queue.push(target);
  }
}

const unreachable = [...routeSet].filter((route) => !depth.has(route));
if (unreachable.length) {
  errors.push(`Unreachable sitemap routes (${unreachable.length}): ${unreachable.slice(0, 20).join(", ")}`);
}

const deepRoutes = [...depth].filter(([, value]) => value > 3);
if (deepRoutes.length) {
  errors.push(`Sitemap routes deeper than 3 clicks (${deepRoutes.length}): ${deepRoutes.slice(0, 20).map(([route, value]) => `${route} (${value})`).join(", ")}`);
}

const zeroInbound = [...routeSet].filter((route) => route !== "/" && !(renderedInboundSources.get(route)?.size));
if (zeroInbound.length) {
  errors.push(`Sitemap routes with no internal inbound source (${zeroInbound.length}): ${zeroInbound.slice(0, 20).join(", ")}`);
}

const expectedSharedHubs = [
  "/tools/",
  "/templates/",
  "/examples/",
  "/worksheets/",
  "/learn/",
  "/troubleshooting/",
  "/checklists/",
  "/compare/",
  "/research/",
  "/glossary/",
  "/wood/",
  "/material-library/",
  "/blog/",
  "/apps/"
];
for (const hub of expectedSharedHubs) {
  if (!sharedNavigationRoutes.has(hub)) {
    errors.push(`Shared runtime navigation does not expose hub: ${hub}`);
  }
}

const expectedRuntimeNav = '${navMenuItem({ href: "/tools/", label: "Tools"';
if (!siteChrome.includes(expectedRuntimeNav) ||
    !siteChrome.includes("${resourceNavMenu(projectsMenu)}") ||
    !siteChrome.includes("${resourceNavMenu(learnMenu)}") ||
    !siteChrome.includes("${resourceNavMenu(resourcesMenu)}") ||
    !siteChrome.includes('${navMenuItem({ href: "/apps/", label: "Apps"')) {
  errors.push("Runtime navigation does not render the five consolidated top-level destinations.");
}
if (!siteChrome.includes('class="nav-menu-toggle"')) {
  errors.push("Runtime navigation does not separate destination links from mobile menu toggles.");
}

for (const route of ["/tools/", "/learn/", "/apps/", "/glossary/", "/tinnitus/"]) {
  const file = routeFile(route);
  if (!existsSync(file) || !readFileSync(file, "utf8").includes('"@type": "BreadcrumbList"')) {
    errors.push(`Primary hub is missing BreadcrumbList structured data: ${route}`);
  }
}

for (const legacyRoute of ["/apps/pdfscanner/", "/apps/receipt/"]) {
  if (routeSet.has(legacyRoute)) {
    errors.push(`Thin legacy app route remains in the sitemap: ${legacyRoute}`);
  }
  const html = readFileSync(routeFile(legacyRoute), "utf8");
  if (!/name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html)) {
    errors.push(`Thin legacy app route is not noindex: ${legacyRoute}`);
  }
}

const depthCounts = {};
for (const value of depth.values()) {
  depthCounts[value] = (depthCounts[value] || 0) + 1;
}
const maxDepth = Math.max(...depth.values());
const renderedInboundValues = [...renderedInboundSources]
  .filter(([route]) => route !== "/")
  .map(([, sources]) => sources.size);
const contextualInboundValues = [...contextualInboundSources]
  .filter(([route]) => route !== "/")
  .map(([, sources]) => sources.size);
const zeroContextualInbound = [...routeSet]
  .filter((route) => route !== "/" && !(contextualInboundSources.get(route)?.size));

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  sitemapRoutes: routeSet.size,
  reachableRoutes: depth.size,
  maxClickDepth: maxDepth,
  depthDistribution: depthCounts,
  sharedNavigationRoutes: sharedNavigationRoutes.size,
  minimumRenderedInboundSources: Math.min(...renderedInboundValues),
  zeroRenderedInboundRoutes: zeroInbound.length,
  minimumContextualInboundSources: Math.min(...contextualInboundValues),
  zeroContextualInboundRoutes: zeroContextualInbound.length
}, null, 2));
