import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { learnPillarExpansion20260721 } from "./learn-pillar-batch-2026-07-21.mjs";
import { learnHandoffExpansion20260724 } from "./learn-handoff-batch-2026-07-24.mjs";
import { learnClusterProfiles } from "./learn-cluster-profiles.mjs";
import { checklistEntries } from "./checklist-data.mjs";
import { worksheetEntries } from "./worksheet-data.mjs";
import { componentCategories, componentModels } from "./cut-list-component-data.mjs";
import { projectPlaybooks } from "./project-playbook-data.mjs";

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
const indexableInboundSources = new Map();
for (const page of pages) {
  const hrefs = [...page.html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    const target = internalRoute(href);
    if (!target || target === page.route) continue;
    if (!inboundSources.has(target)) inboundSources.set(target, new Set());
    inboundSources.get(target).add(page.route);
    if (!page.noindex) {
      if (!indexableInboundSources.has(target)) indexableInboundSources.set(target, new Set());
      indexableInboundSources.get(target).add(page.route);
    }
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
  wood: [],
  learnPillar: [],
  learnTopicHub: [],
  checklists: [],
  worksheets: [],
  projectPlaybooks: [],
  componentCategories: [],
  componentModels: []
};
const gatedLearnExpansions = [
  ...learnPillarExpansion20260721,
  ...learnHandoffExpansion20260724,
];
const learnPillarFiles = new Set(gatedLearnExpansions.map((article) => `learn/${article.slug}/index.html`));
const noindexCounts = {
  blog: pages.filter((page) => page.noindex && /^blog\/[^/]+\/index\.html$/.test(page.file)).length
};
const componentCategoryFiles = new Set(componentCategories.map((category) => `tools/components/${category.slug}/index.html`));
const componentModelFiles = new Set(componentModels.map((model) => `tools/components/${model.slug}/index.html`));

const relatedWoodRoutesByPage = new Map();
const relatedWoodInboundSources = new Map();
for (const page of pages) {
  if (page.noindex || !/^wood\/[^/]+\/index\.html$/.test(page.file)) continue;

  const relatedBlock = page.html.match(/<div class=["']wood-related-species["']>([\s\S]*?)<\/div>/i)?.[1] ?? "";
  const relatedRoutes = [...relatedBlock.matchAll(/\shref=["']([^"']+)["']/gi)]
    .map((match) => internalRoute(match[1]))
    .filter(Boolean);
  relatedWoodRoutesByPage.set(page.route, relatedRoutes);

  for (const route of new Set(relatedRoutes)) {
    if (!relatedWoodInboundSources.has(route)) relatedWoodInboundSources.set(route, new Set());
    relatedWoodInboundSources.get(route).add(page.route);
  }
}

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

  if (/^wood\/[^/]+\/index\.html$/.test(page.file)) {
    const indexableInbound = indexableInboundSources.get(page.route)?.size || 0;
    const relatedRoutes = relatedWoodRoutesByPage.get(page.route) ?? [];
    const uniqueRelatedRoutes = new Set(relatedRoutes);
    const relatedInbound = relatedWoodInboundSources.get(page.route)?.size || 0;
    groups.wood.push({ ...page, inbound: indexableInbound, relatedInbound });

    if (indexableInbound < 3) {
      issues.push(`${page.file} has only ${indexableInbound} indexable internal-link source page(s); expected at least 3.`);
    }
    if (page.words < 475) issues.push(`${page.file} has only ${page.words} visible words; expected at least 475.`);
    if (relatedRoutes.length !== 4 || uniqueRelatedRoutes.size !== 4) {
      issues.push(`${page.file} has ${relatedRoutes.length} related-species link(s) across ${uniqueRelatedRoutes.size} unique route(s); expected exactly 4 distinct links.`);
    }
    if (uniqueRelatedRoutes.has(page.route)) {
      issues.push(`${page.file} links to itself in the related-species section.`);
    }
    for (const route of uniqueRelatedRoutes) {
      const target = pagesByRoute.get(route);
      if (!target || target.noindex || !/^wood\/[^/]+\/index\.html$/.test(target.file)) {
        issues.push(`${page.file} links to a missing or non-indexable related wood species: ${route}`);
      }
    }
    if (relatedInbound < 2) {
      issues.push(`${page.file} is referenced by only ${relatedInbound} related-species detail page(s); expected at least 2.`);
    }
  }

  if (learnPillarFiles.has(page.file)) {
    groups.learnPillar.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 750) issues.push(`${page.file} has only ${page.words} visible words; expected at least 750.`);
  }

  if (/^learn\/topics\/[^/]+\/index\.html$/.test(page.file)) {
    groups.learnTopicHub.push({ ...page, inbound });
    if (inbound < 5) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 5.`);
    if (page.words < 650) issues.push(`${page.file} has only ${page.words} visible words; expected at least 650.`);
    if (!/"@type"\s*:\s*"CollectionPage"/.test(page.html)) issues.push(`${page.file} is missing CollectionPage structured data.`);
    if (!page.html.includes('"@type": "FAQPage"')) issues.push(`${page.file} is missing FAQPage structured data.`);
  }

  if (/^checklists\/[^/]+\/index\.html$/.test(page.file)) {
    groups.checklists.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 1000) issues.push(`${page.file} has only ${page.words} visible words; expected at least 1000.`);
    if (!page.html.includes("checklist.csv")) issues.push(`${page.file} is missing its downloadable checklist CSV.`);
  }

  if (/^worksheets\/[^/]+\/index\.html$/.test(page.file)) {
    groups.worksheets.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 1400) issues.push(`${page.file} has only ${page.words} visible words; expected at least 1400.`);
    if (!page.html.includes("worksheet.csv")) issues.push(`${page.file} is missing its downloadable worksheet CSV.`);
  }

  if (/^projects\/[^/]+\/index\.html$/.test(page.file)) {
    groups.projectPlaybooks.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 1250) issues.push(`${page.file} has only ${page.words} visible words; expected at least 1250.`);
    if (!page.html.includes("project-playbook.csv")) issues.push(`${page.file} is missing its downloadable project-playbook CSV.`);
    if (!page.html.includes('data-project-playbook')) issues.push(`${page.file} is missing its browser-local project playbook mount.`);
    if (!/"@type"\s*:\s*"HowTo"/.test(page.html)) issues.push(`${page.file} is missing HowTo structured data.`);
    if (!page.html.includes('"@type": "FAQPage"')) issues.push(`${page.file} is missing FAQPage structured data.`);
  }

  if (componentCategoryFiles.has(page.file)) {
    groups.componentCategories.push({ ...page, inbound });
    if (inbound < 1) issues.push(`${page.file} has no internal-link source page.`);
    if (page.words < 650) issues.push(`${page.file} has only ${page.words} visible words; expected at least 650.`);
    if (!/"@type"\s*:\s*"CollectionPage"/.test(page.html)) issues.push(`${page.file} is missing CollectionPage structured data.`);
  }

  if (componentModelFiles.has(page.file)) {
    groups.componentModels.push({ ...page, inbound });
    if (inbound < 4) issues.push(`${page.file} has only ${inbound} internal-link source page(s); expected at least 4.`);
    if (page.words < 1100) issues.push(`${page.file} has only ${page.words} visible words; expected at least 1100.`);
    if (!/"@type"\s*:\s*"WebApplication"/.test(page.html)) issues.push(`${page.file} is missing WebApplication structured data.`);
    if (!page.html.includes('data-component-config')) issues.push(`${page.file} is missing its static component model configuration.`);
    if (!page.html.includes("example-cut-list.csv")) issues.push(`${page.file} is missing its example cut-list CSV.`);
    if (!page.html.includes("model.json")) issues.push(`${page.file} is missing its downloadable model JSON.`);
  }
}

if (groups.learnPillar.length !== gatedLearnExpansions.length) {
  issues.push(`Expected ${gatedLearnExpansions.length} gated Learn pillar pages, found ${groups.learnPillar.length}.`);
}

if (groups.learnTopicHub.length !== learnClusterProfiles.length) {
  issues.push(`Expected ${learnClusterProfiles.length} Learn topic hubs, found ${groups.learnTopicHub.length}.`);
}

if (groups.wood.length !== 200) {
  issues.push(`Expected 200 indexable wood species pages, found ${groups.wood.length}.`);
}

if (groups.checklists.length !== checklistEntries.length) {
  issues.push(`Expected ${checklistEntries.length} checklist pages, found ${groups.checklists.length}.`);
}

if (groups.worksheets.length !== worksheetEntries.length) {
  issues.push(`Expected ${worksheetEntries.length} worksheet pages, found ${groups.worksheets.length}.`);
}

if (groups.projectPlaybooks.length !== projectPlaybooks.length) {
  issues.push(`Expected ${projectPlaybooks.length} project playbook pages, found ${groups.projectPlaybooks.length}.`);
}

if (groups.componentCategories.length !== componentCategories.length) {
  issues.push(`Expected ${componentCategories.length} component category hubs, found ${groups.componentCategories.length}.`);
}

if (groups.componentModels.length !== componentModels.length) {
  issues.push(`Expected ${componentModels.length} component model pages, found ${groups.componentModels.length}.`);
}

const componentHub = pagesByRoute.get("/tools/components/");
if (!componentHub || componentHub.noindex) {
  issues.push("The Cut List Component Library hub is missing or noindex.");
} else {
  if (!sitemapRoutes.has("/tools/components/")) issues.push("The Cut List Component Library hub is absent from the sitemap.");
  if (!/"@type"\s*:\s*"CollectionPage"/.test(componentHub.html)) issues.push("The Cut List Component Library hub is missing CollectionPage structured data.");
  if (!componentHub.html.includes("data-component-project")) issues.push("The Cut List Component Library hub is missing its browser-local project tray.");
  for (const model of componentModels) {
    if (!componentHub.html.includes(`/tools/components/${model.slug}/`)) {
      issues.push(`The Cut List Component Library hub does not link model ${model.slug}.`);
    }
  }
}

const projectsHub = pagesByRoute.get("/projects/");
if (!projectsHub || projectsHub.noindex) {
  issues.push("The Project Playbooks hub is missing or noindex.");
} else {
  if (!sitemapRoutes.has("/projects/")) issues.push("The Project Playbooks hub is absent from the sitemap.");
  if (!/"@type"\s*:\s*"CollectionPage"/.test(projectsHub.html)) issues.push("The Project Playbooks hub is missing CollectionPage structured data.");
  if (!projectsHub.html.includes("data-project-hub")) issues.push("The Project Playbooks hub is missing its filter and resume mount.");
  for (const project of projectPlaybooks) {
    if (!projectsHub.html.includes(`/projects/${project.slug}/`)) {
      issues.push(`The Project Playbooks hub does not link ${project.slug}.`);
    }
  }
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exit(1);
}

const summary = Object.fromEntries(Object.entries(groups).map(([name, pagesInGroup]) => {
  const lowestInbound = pagesInGroup.toSorted((a, b) => a.inbound - b.inbound || a.file.localeCompare(b.file))[0];
  const shortest = pagesInGroup.toSorted((a, b) => a.words - b.words || a.file.localeCompare(b.file))[0];
  const pagesWithRelatedInbound = pagesInGroup.filter((page) => Number.isInteger(page.relatedInbound));
  const lowestRelatedInbound = pagesWithRelatedInbound
    .toSorted((a, b) => a.relatedInbound - b.relatedInbound || a.file.localeCompare(b.file))[0];
  return [name, {
    pages: pagesInGroup.length,
    minimumInboundLinks: lowestInbound?.inbound || 0,
    minimumInboundPage: lowestInbound?.file || "",
    minimumVisibleWords: shortest?.words || 0,
    minimumWordPage: shortest?.file || "",
    ...(lowestRelatedInbound ? {
      minimumRelatedSpeciesInboundLinks: lowestRelatedInbound.relatedInbound,
      minimumRelatedSpeciesInboundPage: lowestRelatedInbound.file
    } : {})
  }];
}));

console.log("Indexability quality gates passed.");
console.log(JSON.stringify(summary, null, 2));
console.log(`Generated blog pages held at noindex until expanded: ${noindexCounts.blog}`);
console.log(`Search Console priority URLs verified: ${searchConsolePriorityRoutes.length}`);
