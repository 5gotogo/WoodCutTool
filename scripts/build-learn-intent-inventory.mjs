import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { allLearnPages, learnClusters, learnClusterId } from "./build-learn-content.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(root, "data", "seo");
const outputPath = join(outputDir, "learn-intent-inventory.json");
const decisionsPath = join(outputDir, "learn-intent-decisions.json");
const reviewPath = join(root, "docs", "learn-intent-review.md");
const inventoryVersion = "2026-08-31";
const siteUrl = "https://woodcuttool.com";

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "before", "best", "by", "for", "from", "guide", "how", "in", "into",
  "is", "of", "on", "or", "plan", "planning", "the", "to", "use", "using", "what", "when", "with", "woodworking",
]);

function flattenStrings(value, result = []) {
  if (typeof value === "string") result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flattenStrings(item, result));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => flattenStrings(item, result));
  return result;
}

function decodeEntities(value) {
  return String(value || "")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function firstSentence(value, fallback = "") {
  const text = decodeEntities(value || fallback);
  const match = text.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || text).slice(0, 420);
}

function normalizedTokens(value) {
  return new Set(
    decodeEntities(value)
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1 && !stopWords.has(token))
  );
}

function normalizedText(value) {
  return [...normalizedTokens(value)].sort().join(" ");
}

function jaccard(left, right) {
  const a = normalizedTokens(left);
  const b = normalizedTokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
}

function routeFromHref(value) {
  let href = String(value || "").trim();
  if (href.startsWith(siteUrl)) href = href.slice(siteUrl.length);
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  href = href.split(/[?#]/)[0];
  if (!href || /\.[a-z0-9]{2,5}$/i.test(href)) return href || "/";
  return href.endsWith("/") ? href : `${href}/`;
}

function localRoutesFrom(value) {
  const routes = new Set();
  for (const text of flattenStrings(value)) {
    for (const match of text.matchAll(/(?:href=["']|^)(\/(?!\/)[^"'\s<]*)/g)) {
      const route = routeFromHref(match[1]);
      if (route) routes.add(route);
    }
  }
  return [...routes];
}

function actionType(route, explicitType = "") {
  if (explicitType) return String(explicitType).toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  if (route.startsWith("/apps/")) return "app";
  if (route.startsWith("/worksheets/")) return "worksheet";
  if (route.startsWith("/checklists/")) return "checklist";
  if (route.startsWith("/troubleshooting/")) return "troubleshooting";
  if (route.startsWith("/research/")) return "research";
  if (route.startsWith("/templates/")) return "template";
  if (route.startsWith("/examples/")) return "example";
  if (route.startsWith("/learn/")) return "guide";
  if (route.startsWith("/blog/")) return "article";
  if (route.includes("calculator")) return "calculator";
  return "resource";
}

function explicitActions(page) {
  const candidates = [];
  for (const key of ["relatedTools", "links"]) {
    for (const item of page[key] || []) {
      if (Array.isArray(item)) {
        const route = routeFromHref(item[0]);
        if (route) candidates.push({ route, label: item[1] || route, type: actionType(route, item[2]) });
      } else if (item && typeof item === "object") {
        const route = routeFromHref(item.href || item.route);
        if (route) candidates.push({ route, label: item.label || item.title || route, type: actionType(route, item.type) });
      }
    }
  }
  return candidates;
}

function primaryAction(page, cluster) {
  const preferredTypes = ["calculator", "app", "template", "worksheet", "example", "research", "troubleshooting", "resource", "guide", "article"];
  const explicit = explicitActions(page);
  const embedded = localRoutesFrom(page).map((route) => ({ route, label: route, type: actionType(route) }));
  const fallback = cluster.actions.map(([route, label, type]) => ({ route, label, type: actionType(route, type) }));
  const candidates = [...explicit, ...embedded, ...fallback]
    .filter((candidate) => candidate.route !== `/learn/${page.slug}/` && candidate.route !== `/learn/topics/${cluster.id}/`);
  for (const type of preferredTypes) {
    const match = candidates.find((candidate) => candidate.type === type);
    if (match) return match;
  }
  return candidates[0] || { route: "/tools/", label: "WoodCutTool tools", type: "resource" };
}

function requiredEvidence(page, cluster) {
  const headings = [];
  for (const item of [...(page.sections || []), ...(page.steps || [])]) {
    if (Array.isArray(item) && item[0]) headings.push(decodeEntities(item[0]));
    else if (item && typeof item === "object" && (item.title || item.heading)) headings.push(decodeEntities(item.title || item.heading));
  }
  if (headings.length) return `${headings.slice(0, 3).join("; ")}. Cluster evidence boundary: ${cluster.evidence}`;
  return cluster.evidence;
}

function pageRole(page, cluster) {
  if (page.cluster && !page.seoTitle) return "legacy-topic-hub";
  if (page.slug === cluster.pillarSlug) return "pillar-guide";
  if (page.problem) return "tool-explainer";
  return "supporting-guide";
}

function htmlFiles(dir = root, result = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ["node_modules", "assets"].includes(entry.name)) continue;
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(absolute, result);
    else if (entry.name === "index.html") result.push(absolute);
  }
  return result;
}

function routeForFile(file) {
  const relative = file.slice(root.length).replaceAll("\\", "/").replace(/index\.html$/, "");
  return relative || "/";
}

function outputMetrics() {
  const inbound = new Map();
  const words = new Map();
  for (const file of htmlFiles()) {
    const sourceRoute = routeForFile(file);
    const html = readFileSync(file, "utf8");
    if (sourceRoute.startsWith("/learn/") && !sourceRoute.startsWith("/learn/topics/")) {
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
      words.set(sourceRoute, decodeEntities(main).split(/\s+/).filter(Boolean).length);
    }
    for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
      const target = routeFromHref(match[1]);
      if (!target || target === sourceRoute) continue;
      if (!inbound.has(target)) inbound.set(target, new Set());
      inbound.get(target).add(sourceRoute);
    }
  }
  return { inbound, words };
}

function candidateSets(rows) {
  const parents = new Map(rows.map((row) => [row.slug, row.slug]));
  const pairSignals = [];
  const find = (slug) => {
    const parent = parents.get(slug);
    if (parent === slug) return slug;
    const rootSlug = find(parent);
    parents.set(slug, rootSlug);
    return rootSlug;
  };
  const union = (left, right) => {
    const a = find(left);
    const b = find(right);
    if (a !== b) parents.set(b, a);
  };

  for (let i = 0; i < rows.length; i += 1) {
    for (let j = i + 1; j < rows.length; j += 1) {
      const left = rows[i];
      const right = rows[j];
      const signals = [];
      const sameCluster = left.cluster === right.cluster;
      const titleSimilarity = sameCluster ? jaccard(left.h1, right.h1) : 0;
      const openingSimilarity = sameCluster ? jaccard(left.openingAnswer, right.openingAnswer) : 0;
      if (normalizedText(left.h1) === normalizedText(right.h1)) signals.push("exact-h1");
      if (normalizedText(left.title) === normalizedText(right.title)) signals.push("exact-title");
      if (normalizedText(left.description) === normalizedText(right.description)) signals.push("exact-description");
      if (normalizedText(left.primaryIntent) === normalizedText(right.primaryIntent)) signals.push("exact-primary-intent");
      if (sameCluster && titleSimilarity >= 0.65) signals.push(`title-jaccard:${titleSimilarity.toFixed(3)}`);
      if (left.primaryKeyword && left.primaryKeyword === right.primaryKeyword) signals.push("shared-primary-keyword");
      if (sameCluster && left.actionRoute === right.actionRoute && openingSimilarity >= 0.72) {
        signals.push(`opening-action-overlap:${openingSimilarity.toFixed(3)}`);
      }
      if (!signals.length) continue;
      union(left.slug, right.slug);
      pairSignals.push({ left: left.slug, right: right.slug, titleSimilarity, openingSimilarity, signals });
    }
  }

  const groups = new Map();
  for (const row of rows) {
    const rootSlug = find(row.slug);
    if (!groups.has(rootSlug)) groups.set(rootSlug, []);
    groups.get(rootSlug).push(row.slug);
  }
  const sets = [...groups.values()].filter((slugs) => slugs.length > 1).map((slugs) => {
    const pairs = pairSignals.filter((pair) => slugs.includes(pair.left) && slugs.includes(pair.right));
    const score = Math.max(...pairs.map((pair) => Math.max(pair.titleSimilarity, pair.openingSimilarity, pair.signals.some((signal) => signal.startsWith("exact-")) ? 1 : 0.7)));
    return { slugs: slugs.sort(), score, pairs };
  }).sort((a, b) => b.score - a.score || b.slugs.length - a.slugs.length || a.slugs[0].localeCompare(b.slugs[0]));

  return sets.map((set, index) => ({ ...set, id: `LI-${String(index + 1).padStart(3, "0")}` }));
}

function readDecisions() {
  if (!existsSync(decisionsPath)) return {};
  const parsed = JSON.parse(readFileSync(decisionsPath, "utf8"));
  return parsed.decisions || {};
}

function markdownReport(inventory) {
  const lines = [
    "# Learn intent overlap review",
    "",
    `Updated: ${inventory.version}`,
    "",
    "## Scope",
    "",
    `Reviewed ${inventory.summary.pages} Learn routes across ${inventory.summary.clusters} topic hubs. Candidate detection compares exact source fields, same-cluster title similarity, shared primary keywords, and high opening-answer overlap paired with the same primary action. Decisions do not authorize redirects without aggregate query/page evidence.`,
    "",
    "## Result",
    "",
    `- Candidate sets: ${inventory.summary.candidateSets}`,
    `- Pages in candidate sets: ${inventory.summary.candidatePages}`,
    `- Reviewed sets: ${inventory.summary.reviewedCandidateSets}`,
    `- Implemented differentiations: ${inventory.summary.implementedDifferentiations}`,
    `- Redirects approved: 0`,
    "",
    "## Candidate decisions",
    "",
    "| Set | Score | Routes | Decision | Reason |",
    "| --- | ---: | --- | --- | --- |",
  ];
  for (const set of inventory.candidateSets) {
    lines.push(`| ${set.id} | ${set.score.toFixed(3)} | ${set.slugs.map((slug) => `\`/learn/${slug}/\``).join("<br>")} | ${set.reviewDecision} | ${set.reviewReason.replaceAll("|", "\\|")} |`);
  }
  lines.push(
    "",
    "## Implemented differentiations",
    "",
    "| Routes | Result |",
    "| --- | --- |"
  );
  for (const item of inventory.implementedDifferentiations) {
    lines.push(`| ${item.slugs.map((slug) => `\`/learn/${slug}/\``).join("<br>")} | ${item.reason.replaceAll("|", "\\|")} |`);
  }
  lines.push(
    "",
    "## Decision boundary",
    "",
    "- `keep` means the repository currently exposes a distinct decision, evidence path, or next action.",
    "- `differentiate-existing` requires generator-backed copy or metadata clarification; it does not create a new URL.",
    "- `hold-for-performance-data` blocks merge and redirect work until a minimum 90-day aggregate Search Console query/page export is available.",
    "- Low traffic by itself is never a delete or redirect signal.",
    "",
    "## Reproduction",
    "",
    "```sh",
    "npm run generate:learn-intents",
    "npm run audit:learn-intents",
    "```",
    ""
  );
  return lines.join("\n");
}

export function buildLearnIntentInventory() {
  const { inbound, words } = outputMetrics();
  const clusterMap = new Map(learnClusters.map((cluster) => [cluster.id, cluster]));
  const rows = allLearnPages.map((page) => {
    const cluster = clusterMap.get(learnClusterId(page));
    const route = `/learn/${page.slug}/`;
    const action = primaryAction(page, cluster);
    const openingAnswer = firstSentence(page.intro || page.problem || page.description);
    const relatedRoutes = new Set([
      `/learn/topics/${cluster.id}/`,
      ...localRoutesFrom(page),
      ...explicitActions(page).map((candidate) => candidate.route),
    ]);
    relatedRoutes.delete(route);
    return {
      slug: page.slug,
      route,
      canonical: `${siteUrl}${route}`,
      title: page.seoTitle || page.h1,
      h1: page.h1,
      description: page.description,
      openingAnswer,
      cluster: cluster.id,
      pageRole: pageRole(page, cluster),
      primaryIntent: firstSentence(page.primaryIntent || page.description, page.h1),
      primaryKeyword: String(page.keywords?.[0] || page.h1).toLowerCase(),
      supportingKeywords: (page.keywords || []).slice(1),
      requiredEvidence: requiredEvidence(page, cluster),
      primaryAction: action.label,
      actionType: action.type,
      actionRoute: action.route,
      relatedRoutes: [...relatedRoutes].sort(),
      visibleWords: words.get(route) || 0,
      inboundSourceCount: inbound.get(route)?.size || 0,
      datePublished: page.datePublished || null,
      dateModified: page.dateModified || null,
      candidateSet: null,
      reviewDecision: "not-flagged",
      reviewReason: "No configured collision or high-similarity rule flagged this route.",
    };
  });

  const sets = candidateSets(rows);
  const decisions = readDecisions();
  for (const set of sets) {
    const signature = set.slugs.join("|");
    const reviewed = decisions[signature] || decisions[set.id] || {
      decision: "unreviewed",
      reason: "A new candidate set was detected and requires an explicit source-controlled review decision.",
    };
    set.reviewDecision = reviewed.decision;
    set.reviewReason = reviewed.reason;
    for (const slug of set.slugs) {
      const row = rows.find((entry) => entry.slug === slug);
      row.candidateSet = set.id;
      row.reviewDecision = reviewed.decision;
      row.reviewReason = reviewed.reason;
    }
  }

  const implementedDifferentiations = Object.entries(decisions)
    .filter(([, value]) => value.decision === "differentiate-existing")
    .map(([signature, value]) => ({ slugs: signature.split("|"), reason: value.reason }));

  const inventory = {
    version: inventoryVersion,
    source: "scripts/build-learn-content.mjs",
    performanceDataBoundary: "No merge or redirect decision is authorized without aggregate query/page evidence.",
    summary: {
      pages: rows.length,
      clusters: learnClusters.length,
      candidateSets: sets.length,
      candidatePages: rows.filter((row) => row.candidateSet).length,
      reviewedCandidateSets: sets.filter((set) => set.reviewDecision !== "unreviewed").length,
      implementedDifferentiations: implementedDifferentiations.length,
    },
    implementedDifferentiations,
    candidateSets: sets,
    pages: rows.sort((a, b) => a.route.localeCompare(b.route)),
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(reviewPath, markdownReport(inventory));
  console.log(JSON.stringify(inventory.summary, null, 2));
  return inventory;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildLearnIntentInventory();
}
