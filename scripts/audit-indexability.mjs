import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { learnPillarExpansion20260721 } from "./learn-pillar-batch-2026-07-21.mjs";
import { checklistEntries } from "./checklist-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const issues = [];

function collectHtmlFiles(dir = root, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) continue;
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
  return file === "index.html" ? "/" : `/${dirname(file)}/`;
}

function hasNoindex(html) {
  return /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(html);
}

function visibleWordCount(html) {
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi, " ");
  return text.match(/[a-z0-9]+(?:[-'][a-z0-9]+)*/gi)?.length || 0;
}

function internalRoute(href) {
  try {
    const url = new URL(href, siteUrl);
    if (url.origin !== siteUrl) return "";
    return url.pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(url.pathname)
      ? url.pathname
      : `${url.pathname}/`;
  } catch {
    return "";
  }
}

const pages = collectHtmlFiles().map((file) => {
  const html = readFileSync(join(root, file), "utf8");
  return { file, route: routeFromFile(file), html, words: visibleWordCount(html), noindex: hasNoindex(html) };
});

const sitemapRoutes = new Set();
for (const file of readdirSync(root).filter((name) => /^sitemap-[a-z0-9-]+\.xml$/i.test(name))) {
  const xml = readFileSync(join(root, file), "utf8");
  for (const match of xml.matchAll(/<loc>https:\/\/woodcuttool\.com([^<]*)<\/loc>/g)) {
    sitemapRoutes.add(match[1] || "/");
  }
}

const inboundSources = new Map();
for (const page of pages) {
  const hrefs = [...page.html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    const target = internalRoute(href);
    if (!target || target === page.route) continue;
    if (!inboundSources.has(target)) inboundSources.set(target, new Set());
    inboundSources.get(target).add(page.route);
  }
}

const searchConsolePriorityRoutes = [
  "/glossary/end-panel/",
  "/apps/compare/fridgetrack-vs-grocery-list-only/",
  "/apps/compare/shift-calendar-vs-employer-scheduling-portal/",
  "/blog/ocr-pdf-scanner-searchable-documents-guide/",
  "/legal/quiltfit/support/",
  "/apps/compare/private-transcriber-vs-recording-audio-only/",
  "/apps/compare/mindnest-vs-cloud-journal-apps/",
  "/apps/compare/snapreceipt-vs-bank-statement-only/",
  "/legal/ThumbType/support/",
  "/apps/compare/shift-calendar-vs-text-message-rota/",
  "/apps/compare/pdf-scan-vs-flatbed-scanner-at-home/",
  "/apps/compare/quiltfit-vs-buying-fabric-by-guesswork/",
  "/apps/compare/glowfeel-vs-breathing-video-sites/",
  "/apps/compare/cutlist-vs-home-center-cutting-service/",
  "/apps/compare/blockfit-vs-complicated-strategy-games/",
  "/apps/compare/tinnitus-relief-vs-white-noise-machines/",
  "/apps/tinnitus-relief-sound-masking/",
  "/privacy-policy/",
  "/blog/plywood-pet-feeding-station-plan/",
  "/compare/baltic-birch-vs-plywood/",
  "/apps/compare/address-label-maker-vs-online-label-websites/",
  "/apps/compare/contacts-backup-vs-carrier-store-transfer/",
  "/apps/compare/atomic-clock-vs-wall-clock/",
  "/apps/compare/colorpop-vs-timed-reflex-games/",
  "/apps/compare/snaplabel-vs-spreadsheet-label-list/",
  "/apps/compare/cadenza-vs-tuner-only-app/",
  "/apps/compare/invoice-maker-vs-accounting-software/",
  "/learn/woodworking-hardware-allowance-guide/",
  "/learn/toe-kick-cut-list-planning/",
  "/glossary/template/",
  "/glossary/part-rotation/",
  "/glossary/drawer-box/",
  "/glossary/panel-saw/",
  "/blog/knowledge-base-cleanup-before-chatbot/",
  "/glossary/flush-trim-bit/",
  "/glossary/dry-fit/",
  "/learn/wall-cabinet-plywood-layout-guide/",
  "/blog/cutlist-drawer-boxes-for-beginners/",
  "/blog/quiltfit-half-square-triangle-throw/",
  "/blog/tile-waste-estimation-by-pattern/",
  "/glossary/chalk-line/",
  "/glossary/countersink/",
  "/blog/best-plywood-cutting-workflow-2026/",
  "/apps/marketvendor-sales-and-profit/"
];

const pagesByRoute = new Map(pages.map((page) => [page.route, page]));
for (const route of searchConsolePriorityRoutes) {
  const page = pagesByRoute.get(route);
  if (!page) {
    issues.push(`${route} from the Search Console recovery set is missing.`);
    continue;
  }
  if (page.noindex) issues.push(`${page.file} from the Search Console recovery set is noindex.`);
  if (!page.html.includes(`<link rel="canonical" href="${siteUrl}${route}">`)) {
    issues.push(`${page.file} from the Search Console recovery set lacks an exact self-canonical.`);
  }
  if (!sitemapRoutes.has(route)) issues.push(`${page.file} from the Search Console recovery set is absent from the sitemap.`);
  if (!(inboundSources.get(route)?.size > 0)) issues.push(`${page.file} from the Search Console recovery set has no internal-link source page.`);
}

const groups = {
  blog: [],
  appCompare: [],
  glossary: [],
  comparison: [],
  learnPillar: [],
  checklists: []
};
const learnPillarFiles = new Set(learnPillarExpansion20260721.map((article) => `learn/${article.slug}/index.html`));
const noindexCounts = {
  blog: pages.filter((page) => page.noindex && /^blog\/[^/]+\/index\.html$/.test(page.file)).length
};

for (const page of pages) {
  if (page.noindex) continue;
  const inbound = inboundSources.get(page.route)?.size || 0;

  if (/^blog\/[^/]+\/index\.html$/.test(page.file)) {
    groups.blog.push({ ...page, inbound });
    const legacyGuide = page.file === "blog/wood-cutting-calculator-guide/index.html" || page.file === "blog/how-to-optimize-material-layout/index.html";
    const minimumInbound = legacyGuide ? 2 : 3;
    if (inbound < minimumInbound) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least ${minimumInbound}.`);
    if (!legacyGuide && page.words < 500) issues.push(`${page.file} has only ${page.words} visible words; expected at least 500.`);
  }

  if (/^apps\/compare\/[^/]+\/index\.html$/.test(page.file)) {
    groups.appCompare.push({ ...page, inbound });
    if (inbound < 3) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 3.`);
    if (page.words < 650) issues.push(`${page.file} has only ${page.words} visible words; expected at least 650.`);
  }

  if (/^glossary\/[^/]+\/index\.html$/.test(page.file)) {
    groups.glossary.push({ ...page, inbound });
    if (inbound < 5) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 5.`);
    if (page.words < 220) issues.push(`${page.file} has only ${page.words} visible words; expected at least 220.`);
  }

  if (/^compare\/[^/]+\/index\.html$/.test(page.file) && page.html.includes('class="comparison-page"')) {
    groups.comparison.push({ ...page, inbound });
    if (inbound < 2) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 2.`);
    if (page.words < 700) issues.push(`${page.file} has only ${page.words} visible words; expected at least 700.`);
  }

  if (learnPillarFiles.has(page.file)) {
    groups.learnPillar.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 750) issues.push(`${page.file} has only ${page.words} visible words; expected at least 750.`);
  }

  if (/^checklists\/[^/]+\/index\.html$/.test(page.file)) {
    groups.checklists.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 1000) issues.push(`${page.file} has only ${page.words} visible words; expected at least 1000.`);
    if (!page.html.includes("checklist.csv")) issues.push(`${page.file} is missing its downloadable checklist CSV.`);
  }
}

if (groups.learnPillar.length !== learnPillarExpansion20260721.length) {
  issues.push(`Expected ${learnPillarExpansion20260721.length} new Learn pillar pages, found ${groups.learnPillar.length}.`);
}

if (groups.checklists.length !== checklistEntries.length) {
  issues.push(`Expected ${checklistEntries.length} checklist pages, found ${groups.checklists.length}.`);
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exit(1);
}

const summary = Object.fromEntries(Object.entries(groups).map(([name, pagesInGroup]) => {
  const lowestInbound = pagesInGroup.toSorted((a, b) => a.inbound - b.inbound || a.file.localeCompare(b.file))[0];
  const shortest = pagesInGroup.toSorted((a, b) => a.words - b.words || a.file.localeCompare(b.file))[0];
  return [name, {
    pages: pagesInGroup.length,
    minimumInboundLinks: lowestInbound?.inbound || 0,
    minimumInboundPage: lowestInbound?.file || "",
    minimumVisibleWords: shortest?.words || 0,
    minimumWordPage: shortest?.file || ""
  }];
}));

console.log("Indexability quality gates passed.");
console.log(JSON.stringify(summary, null, 2));
console.log(`Generated blog pages held at noindex until expanded: ${noindexCounts.blog}`);
console.log(`Search Console priority URLs verified: ${searchConsolePriorityRoutes.length}`);
