import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  projectCategories,
  projectPlaybooks,
  projectPublishedDate,
} from "./project-playbook-data.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function decodeHtml(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function plainText(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value) {
  return plainText(value).split(/\s+/).filter(Boolean).length;
}

function mainBlocks(html) {
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "";
  return [...main.matchAll(/<(?:p|li|h[1-4])\b[^>]*>([\s\S]*?)<\/(?:p|li|h[1-4])>/gi)]
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

assert(/^\d{4}-\d{2}-\d{2}$/.test(projectPublishedDate), "Project publication date must be ISO formatted.");
assert(projectCategories.length === 6, `Expected 6 project categories, found ${projectCategories.length}.`);
assert(projectPlaybooks.length === 18, `Expected 18 project playbooks, found ${projectPlaybooks.length}.`);

const slugs = new Set();
const categoryCounts = new Map(projectCategories.map((category) => [category.slug, 0]));
const variationConditions = [];
const variationImpacts = [];
const riskSignals = [];
const riskResponses = [];
const linkDescriptions = [];
const finishChecks = [];

for (const entry of projectPlaybooks) {
  assert(!slugs.has(entry.slug), `Duplicate project slug: ${entry.slug}`);
  slugs.add(entry.slug);
  const category = entry.categorySlug || entry.category;
  assert(categoryCounts.has(category), `${entry.slug} uses unknown category ${category}.`);
  categoryCounts.set(category, categoryCounts.get(category) + 1);
  assert(entry.decisions?.length === 3, `${entry.slug} must have exactly 3 decisions.`);
  assert(entry.phases?.length === 6, `${entry.slug} must have exactly 6 phases.`);
  assert(entry.variations?.length === 3, `${entry.slug} must have exactly 3 variations.`);
  assert(entry.risks?.length === 4, `${entry.slug} must have exactly 4 risks.`);

  for (const [index, variation] of entry.variations.entries()) {
    assert(variation && typeof variation === "object" && !Array.isArray(variation), `${entry.slug} variation ${index + 1} must be structured.`);
    assert(String(variation.condition || "").length >= 30, `${entry.slug} variation ${index + 1} needs a specific condition.`);
    assert(String(variation.impact || "").length >= 30, `${entry.slug} variation ${index + 1} needs a specific impact.`);
    variationConditions.push(variation.condition);
    variationImpacts.push(variation.impact);
  }

  for (const [index, risk] of entry.risks.entries()) {
    assert(risk && typeof risk === "object" && !Array.isArray(risk), `${entry.slug} risk ${index + 1} must be structured.`);
    assert(String(risk.signal || "").length >= 30, `${entry.slug} risk ${index + 1} needs a specific early signal.`);
    assert(String(risk.response || "").length >= 30, `${entry.slug} risk ${index + 1} needs a specific response.`);
    riskSignals.push(risk.signal);
    riskResponses.push(risk.response);
  }

  assert(entry.links?.length >= 5, `${entry.slug} needs at least 5 connected resources.`);
  for (const [index, link] of entry.links.entries()) {
    assert(Array.isArray(link) && String(link[3] || "").length >= 30, `${entry.slug} link ${index + 1} needs a project-specific description.`);
    linkDescriptions.push(link[3]);
  }

  assert(entry.finishLine && typeof entry.finishLine === "object" && !Array.isArray(entry.finishLine), `${entry.slug} finishLine must be structured.`);
  assert(String(entry.finishLine.summary || "").length >= 40, `${entry.slug} needs a specific finish summary.`);
  assert(entry.finishLine.checks?.length >= 3, `${entry.slug} needs at least 3 observable finish checks.`);
  finishChecks.push(...entry.finishLine.checks);
}

for (const [category, count] of categoryCounts) {
  assert(count === 3, `Project category ${category} has ${count} entries; expected 3.`);
}

for (const [label, values] of [
  ["variation conditions", variationConditions],
  ["variation impacts", variationImpacts],
  ["risk signals", riskSignals],
  ["risk responses", riskResponses],
  ["resource descriptions", linkDescriptions],
  ["finish checks", finishChecks],
]) {
  assert(new Set(values).size === values.length, `Project ${label} must not reuse identical fallback copy.`);
}

const generated = projectPlaybooks.map((entry) => ({
  entry,
  html: read(`projects/${entry.slug}/index.html`),
}));
const descriptions = [];
for (const { entry, html } of generated) {
  const description = decodeHtml(html.match(/<meta name="description" content="([^"]+)">/i)?.[1] || "");
  assert(description.length >= 120 && description.length <= 165, `${entry.slug} meta description length is ${description.length}.`);
  assert(/[.!?]$/.test(description), `${entry.slug} meta description must end as a complete sentence.`);
  assert(!/\b(?:a|an|and|or|the|with|for|to|of)\.$/i.test(description), `${entry.slug} meta description ends in a clipped fragment: ${description}`);
  descriptions.push(description);
  assert(html.includes('<link rel="stylesheet" href="/assets/project-playbooks.css">'), `${entry.slug} is missing the scoped Projects stylesheet.`);
  assert(html.includes("<style>.mega-menu{display:none}</style>"), `${entry.slug} is missing the canonical mega-menu fallback.`);
  const scriptOrder = [
    '/assets/project-playbooks.js',
    '/assets/site-chrome.js',
    '/assets/app.js',
    '/assets/conversion.js',
  ].map((source) => html.indexOf(`src="${source}"`));
  assert(scriptOrder.every((position) => position >= 0), `${entry.slug} is missing a canonical runtime script.`);
  assert(scriptOrder.every((position, index) => index === 0 || scriptOrder[index - 1] < position), `${entry.slug} runtime scripts are not in canonical post-process order.`);
  assert(html.includes('src="/assets/conversion.js"'), `${entry.slug} is missing the conversion runtime.`);
  assert(html.includes('data-conversion-source="project-detail"'), `${entry.slug} is missing its natural CutList handoff.`);
  assert(!/assets\/images\/templates\/[^"']+\.png/i.test(html), `${entry.slug} still loads a heavyweight template PNG.`);
  if ((entry.categorySlug || entry.category) === "outdoor") {
    assert(html.includes('/assets/images/woodworking/wood-05-material-selection.webp'), `${entry.slug} needs the truthful outdoor material reference image.`);
  }
  assert(/<progress\b[^>]*aria-labelledby=/i.test(html), `${entry.slug} progress needs an accessible name.`);
  assert(/class="project-table-wrap"[^>]*role="region"[^>]*tabindex="0"/i.test(html), `${entry.slug} material table wrapper needs a focusable named region.`);
  assert(/class="project-decision-options"[^>]*aria-labelledby=/i.test(html), `${entry.slug} decisions need labelled fieldsets.`);
  assert(/data-project-decision-reveal[^>]*|aria-expanded="false"/i.test(html), `${entry.slug} decision reveal needs expanded state.`);
  assert(!/"totalTime"\s*:/i.test(html), `${entry.slug} HowTo must not invent a duration.`);
}
assert(new Set(descriptions).size === descriptions.length, "Project meta descriptions must be unique.");

const blockLists = generated.map(({ html }) => mainBlocks(html));
const pageFrequency = new Map();
for (const blocks of blockLists) {
  for (const block of new Set(blocks)) pageFrequency.set(block, (pageFrequency.get(block) || 0) + 1);
}
let maximumCommonRatio = 0;
let maximumCommonSlug = "";
for (const [index, blocks] of blockLists.entries()) {
  const totalWords = blocks.reduce((sum, block) => sum + wordCount(block), 0);
  const commonWords = blocks
    .filter((block) => (pageFrequency.get(block) || 0) >= 17)
    .reduce((sum, block) => sum + wordCount(block), 0);
  const ratio = totalWords ? commonWords / totalWords : 1;
  if (ratio > maximumCommonRatio) {
    maximumCommonRatio = ratio;
    maximumCommonSlug = generated[index].entry.slug;
  }
  assert(ratio <= 0.5, `${generated[index].entry.slug} repeats ${(ratio * 100).toFixed(1)}% common paragraph words; expected at most 50%.`);
}

const hub = read("projects/index.html");
assert(hub.includes('src="/assets/conversion.js"'), "Projects hub is missing the conversion runtime.");
assert((hub.match(/class="project-card-visual"><img[^>]+loading="lazy"/g) || []).length === 18, "All 18 catalog card images must be lazy-loaded.");
assert(!/assets\/images\/templates\/[^"']+\.png/i.test(hub), "Projects hub still loads a heavyweight template PNG.");

const runtime = read("assets/project-playbooks.js");
for (const token of ["probePersistentStorage", "preferBrief", "prefers-reduced-motion", "aria-expanded", "data-project-decision-result"]) {
  assert(runtime.includes(token), `Project runtime is missing the ${token} behavior contract.`);
}
const globalCss = read("assets/styles.css");
const projectCss = read("assets/project-playbooks.css");
assert(!globalCss.includes("Outcome-first Project Playbooks"), "Projects CSS must not ship in the global stylesheet.");
assert(projectCss.includes("Outcome-first Project Playbooks"), "Scoped Projects stylesheet marker is missing.");

console.log(JSON.stringify({
  projectPlaybooks: projectPlaybooks.length,
  categories: categoryCounts.size,
  maximumCommonParagraphWordRatio: Number(maximumCommonRatio.toFixed(3)),
  maximumCommonPage: maximumCommonSlug,
}, null, 2));
