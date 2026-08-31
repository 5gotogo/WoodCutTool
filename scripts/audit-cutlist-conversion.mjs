import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { conversionEventSchemas } from "../functions/lib/conversion-event-schema.js";
import { learnClusterProfiles } from "./learn-cluster-profiles.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const errors = [];

function htmlFiles(dir = root, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ["node_modules", "assets"].includes(entry.name)) continue;
    const absolute = join(dir, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...htmlFiles(absolute, relative));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(relative);
  }
  return files;
}

const allHtml = htmlFiles();
const appPage = readFileSync(join(root, "apps/cutlist/index.html"), "utf8");
const styles = readFileSync(join(root, "assets/styles.css"), "utf8");
const conversionRuntime = readFileSync(join(root, "assets/conversion.js"), "utf8");
const representativePages = {
  template: readFileSync(join(root, "templates/bathroom-vanity-cut-list/index.html"), "utf8"),
  example: readFileSync(join(root, "examples/bathroom-vanity-cut-list/index.html"), "utf8"),
  troubleshooting: readFileSync(join(root, "troubleshooting/material-groups-missing-from-cut-list/index.html"), "utf8"),
  unrelatedLearn: readFileSync(join(root, "learn/tile-calculator-inputs-explained/index.html"), "utf8"),
  componentHub: readFileSync(join(root, "tools/components/index.html"), "utf8"),
  componentModel: readFileSync(join(root, "tools/components/face-frame-cut-list-calculator/index.html"), "utf8"),
  project: readFileSync(join(root, "projects/base-cabinet/index.html"), "utf8"),
};
const screenshots = [
  "cutlist-layout.webp",
  "cutlist-layout-stats.webp",
  "cutlist-parts-view.webp",
  "cutlist-cut-sequence.webp",
  "cutlist-ai-scan.webp",
  "cutlist-offline-private.webp",
];
const clusterEvents = [
  "topic_action_click",
  "pillar_guide_click",
  "worksheet_download",
  "checklist_download",
  "example_download",
  "research_download",
  "calculator_start",
  "calculator_result",
  "app_store_outbound",
];

for (const event of clusterEvents) {
  if (!conversionEventSchemas[event]) errors.push(`Conversion schema is missing ${event}`);
}
if (!conversionRuntime.includes('[data-conversion-event]') ||
    !conversionRuntime.includes("conversionDestinationRoute") ||
    !conversionRuntime.includes("conversionSourceRoute")) {
  errors.push("Conversion runtime is missing generic, schema-backed tracked-link support");
}

let trackedTopicHubs = 0;
for (const cluster of learnClusterProfiles) {
  const route = `/learn/topics/${cluster.id}/`;
  const html = readFileSync(join(root, route, "index.html"), "utf8");
  const pillarEvents = html.match(/data-conversion-event="pillar_guide_click"/g) || [];
  const actionEvents = html.match(/data-conversion-event="topic_action_click"/g) || [];
  if (pillarEvents.length !== 1) errors.push(`${route} must track exactly one pillar-guide action`);
  if (actionEvents.length !== 4) errors.push(`${route} must track exactly four topic actions`);
  if ((html.match(new RegExp(`data-conversion-cluster="${cluster.id}"`, "g")) || []).length !== 5) {
    errors.push(`${route} must attach its cluster ID to all five primary actions`);
  }
  if ((html.match(new RegExp(`data-conversion-source-route="${route}"`, "g")) || []).length !== 5) {
    errors.push(`${route} must attach its source route to all five primary actions`);
  }
  for (const [destination] of cluster.actions) {
    if (!html.includes(`data-conversion-destination-route="${destination}"`)) {
      errors.push(`${route} is missing tracked destination metadata for ${destination}`);
    }
  }
  if (/data-conversion-(?:dimension|measurement|query|referrer|project|notes?)=/i.test(html)) {
    errors.push(`${route} contains privacy-unsafe conversion metadata`);
  }
  trackedTopicHubs += 1;
}

for (const screenshot of screenshots) {
  const path = join(root, "assets/images/apps/cutlist", screenshot);
  if (!existsSync(path)) errors.push(`Missing real CutList screenshot: ${screenshot}`);
  if (!appPage.includes(`/assets/images/apps/cutlist/${screenshot}`)) errors.push(`CutList landing page does not use ${screenshot}`);
}

if (!appPage.includes("Basic layout generation") || !appPage.includes("CutList Pro")) {
  errors.push("CutList landing page is missing free/Pro pricing clarity");
}
if (!appPage.includes("data-conversion-cta")) errors.push("CutList landing page is missing the tracked conversion CTA");
if ((appPage.match(/class="cutlist-screenshot-card"/g) || []).length !== 6) errors.push("CutList landing page must render six screenshot cards");
if (!/\.result-panel \.conversion-cta\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s.test(styles)) {
  errors.push("Calculator result conversion CTA must use a single-column narrow-container layout");
}
if (/\.app-action-row\s*\{\s*grid-template-columns:\s*repeat\(3,/s.test(styles)) {
  errors.push("Plywood result action row must not reserve a third empty desktop column");
}
if (!representativePages.template.includes('data-conversion-source="template-detail"')) {
  errors.push("Representative template page is missing its template-specific CutList CTA");
}
if (!representativePages.example.includes('data-conversion-source="example-detail"')) {
  errors.push("Representative example page is missing its example-specific CutList CTA");
}
if (!representativePages.troubleshooting.includes('data-conversion-source="troubleshooting"')) {
  errors.push("Representative troubleshooting page is missing its diagnosis-specific CutList CTA");
}
if (representativePages.unrelatedLearn.includes('data-conversion-source="learn-guide"')) {
  errors.push("Unrelated tile Learn content must not receive a CutList conversion CTA");
}
if (!representativePages.componentHub.includes("data-component-project")) {
  errors.push("Cut List Component Library hub is missing its browser-local project tray");
}
if (!representativePages.componentModel.includes("data-component-form") ||
    !representativePages.componentModel.includes("data-component-add") ||
    !representativePages.componentModel.includes('src="/assets/component-builder.js"')) {
  errors.push("Representative component calculator is missing calculate, add-to-project, or browser runtime integration");
}
if (!representativePages.componentModel.includes("/apps/cutlist/")) {
  errors.push("Representative component calculator is missing its CutList handoff");
}
if (!representativePages.project.includes('data-conversion-source="project-detail"') ||
    !representativePages.project.includes('src="/assets/conversion.js"')) {
  errors.push("Representative Project Playbook is missing its CutList handoff or conversion runtime");
}
if (!conversionRuntime.includes('path.startsWith("/projects/")')) {
  errors.push("Conversion runtime is missing the project route source");
}

let bannerCount = 0;
let contextualCount = 0;
let conversionScriptCount = 0;
for (const file of allHtml) {
  const html = readFileSync(join(root, file), "utf8");
  if (html.includes('name="apple-itunes-app"')) bannerCount += 1;
  if (html.includes("data-conversion-cta")) contextualCount += 1;
  if (html.includes('src="/assets/conversion.js"')) conversionScriptCount += 1;

  if (/href="https:\/\/apps\.apple\.com[^"]*"[^>]*>(Share PDF|Save Images|AirPrint|Parts View)<\/a>/.test(html)) {
    errors.push(`${file} presents an App Store link as a completed browser action`);
  }
}

if (bannerCount < 300) errors.push(`Expected Smart App Banners on at least 300 high-intent pages, found ${bannerCount}`);
if (contextualCount < 250) errors.push(`Expected contextual CutList CTAs on at least 250 pages, found ${contextualCount}`);
if (conversionScriptCount !== allHtml.length) errors.push(`Expected conversion.js on all ${allHtml.length} HTML pages, found ${conversionScriptCount}`);

for (const path of [
  "assets/conversion.js",
  "functions/api/conversion-event.js",
  "functions/go/cutlist.js",
  "assets/images/apps/cutlist/cutlist-app-store-qr.svg",
]) {
  if (!existsSync(join(root, path))) errors.push(`Missing conversion asset: ${path}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  htmlPages: allHtml.length,
  smartAppBanners: bannerCount,
  contextualCtas: contextualCount,
  conversionScripts: conversionScriptCount,
  trackedTopicHubs,
  registeredEvents: Object.keys(conversionEventSchemas).length,
  screenshots: screenshots.length,
}, null, 2));
