import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const siteHost = "woodcuttool.com";
const canonicalAliases = new Map([
  ["apps/cutlist-plywood-optimizer/index.html", "/apps/cutlist/"],
  ["apps/quiltfit-quilt-design-planner/index.html", "/apps/quiltfit/"],
  ["apps/stringer-stair-layout/index.html", "/apps/stringer/"]
]);

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

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2]?.trim() ?? "";
}

function metaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const target = name.toLowerCase();
  for (const tag of tags) {
    if (getAttribute(tag, "name").toLowerCase() === target) {
      return getAttribute(tag, "content");
    }
  }
  return "";
}

function metaNameCount(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const target = name.toLowerCase();
  return tags.filter((tag) => getAttribute(tag, "name").toLowerCase() === target).length;
}

function metaPropertyCount(html, property) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const target = property.toLowerCase();
  return tags.filter((tag) => getAttribute(tag, "property").toLowerCase() === target).length;
}

function linkHref(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const target = rel.toLowerCase();
  for (const tag of tags) {
    if (getAttribute(tag, "rel").toLowerCase() === target) {
      return getAttribute(tag, "href");
    }
  }
  return "";
}

function linkRelCount(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const target = rel.toLowerCase();
  return tags.filter((tag) => getAttribute(tag, "rel").toLowerCase() === target).length;
}

function h1Texts(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
    match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  );
}

function hasNoindex(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return metaTags.some((tag) => {
    const name = /\bname=["']robots["']/i.test(tag);
    const content = tag.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? "";
    return name && content.toLowerCase().split(",").map((part) => part.trim()).includes("noindex");
  });
}

const files = collectHtmlFiles();
const issues = [];
const titles = new Map();
const descriptions = new Map();
const canonicalsByFile = new Map();

for (const file of files) {
  const html = readFileSync(join(root, file), "utf8");
  if (hasNoindex(html)) continue;

  const title = firstMatch(html, /<title>([^<]*)<\/title>/i);
  const description = metaContent(html, "description");
  const canonical = linkHref(html, "canonical");
  const h1s = h1Texts(html);
  const titleCount = (html.match(/<title>/gi) ?? []).length;
  const descriptionCount = metaNameCount(html, "description");
  const canonicalCount = linkRelCount(html, "canonical");
  const ogTitleCount = metaPropertyCount(html, "og:title");
  const twitterCardCount = metaNameCount(html, "twitter:card");

  if (titleCount !== 1) issues.push(["title count", file, titleCount]);
  if (!title) {
    issues.push(["missing title", file]);
  } else {
    if (title.length < 20) issues.push(["short title", file, title.length, title]);
    if (title.length > 70) issues.push(["long title", file, title.length, title]);
    titles.set(title, [...(titles.get(title) ?? []), file]);
  }

  if (!description) {
    issues.push(["missing description", file]);
  } else {
    if (descriptionCount !== 1) issues.push(["description count", file, descriptionCount]);
    if (description.length < 50) issues.push(["short description", file, description.length, description]);
    if (description.length > 170) issues.push(["long description", file, description.length, description]);
    descriptions.set(description, [...(descriptions.get(description) ?? []), file]);
  }

  if (!canonical) {
    issues.push(["missing canonical", file]);
  } else {
    if (canonicalCount !== 1) issues.push(["canonical count", file, canonicalCount]);
    try {
      const url = new URL(canonical);
      const canonicalPath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
      canonicalsByFile.set(file, canonicalPath);
      if (url.hostname !== siteHost) issues.push(["noncanonical host", file, canonical]);
      if (canonicalPath !== routeFromFile(file) && canonicalAliases.get(file) !== canonicalPath) {
        issues.push(["canonical route mismatch", file, canonical, routeFromFile(file)]);
      }
    } catch {
      issues.push(["bad canonical", file, canonical]);
    }
  }

  if (h1s.length !== 1) issues.push(["h1 count", file, h1s.length]);
  if (ogTitleCount === 0) issues.push(["missing og:title", file]);
  if (ogTitleCount > 1) issues.push(["og:title count", file, ogTitleCount]);
  if (twitterCardCount === 0) issues.push(["missing twitter card", file]);
  if (twitterCardCount > 1) issues.push(["twitter card count", file, twitterCardCount]);
  if (!/application\/ld\+json/i.test(html)) issues.push(["missing jsonld", file]);
}

for (const [title, titleFiles] of titles) {
  const canonicalGroups = new Set(titleFiles.map((file) => canonicalsByFile.get(file) ?? routeFromFile(file)));
  if (titleFiles.length > 1 && canonicalGroups.size > 1) {
    issues.push(["duplicate title", titleFiles.join(", "), titleFiles.length, title]);
  }
}

for (const [description, descriptionFiles] of descriptions) {
  const canonicalGroups = new Set(descriptionFiles.map((file) => canonicalsByFile.get(file) ?? routeFromFile(file)));
  if (descriptionFiles.length > 1 && canonicalGroups.size > 1) {
    issues.push(["duplicate description", descriptionFiles.slice(0, 8).join(", "), descriptionFiles.length, description]);
  }
}

const counts = {};
for (const [kind] of issues) counts[kind] = (counts[kind] ?? 0) + 1;

console.log(`Audited ${files.length} HTML files.`);
console.log(JSON.stringify(counts, null, 2));

if (issues.length) {
  console.log("\nTop issues:");
  for (const issue of issues.slice(0, 120)) {
    console.log(`- ${issue.join(" | ")}`);
  }
}
