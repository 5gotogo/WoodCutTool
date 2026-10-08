import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { transform } from "lightningcss";
import { performanceProfile } from "./site-performance-profile.mjs";

const root = resolve(import.meta.dirname, "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);

function collectHtmlFiles(directory = root, prefix = "") {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) continue;
    const absolute = join(directory, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...collectHtmlFiles(absolute, relative));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(relative);
  }
  return files.sort();
}

function pagesFor(stylesheet) {
  return collectHtmlFiles().filter((file) => {
    const html = readFileSync(join(root, file), "utf8");
    return performanceProfile(file, html).stylesheet === stylesheet;
  });
}

function compile(stylesheet) {
  const pages = pagesFor(stylesheet);
  // Generated inline styles must not retain obsolete class names on rebuild.
  const html = pages.map((file) => readFileSync(join(root, file), "utf8").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ""));
  const runtimePaths = new Set(["assets/site-chrome.js", "assets/conversion.js"]);
  for (const source of html) {
    for (const match of source.matchAll(/<script\b[^>]*\bsrc=["']\/(assets\/[^"'?]+\.js)(?:\?[^"']*)?["']/g)) {
      runtimePaths.add(match[1]);
    }
  }
  const sources = [...html, ...[...runtimePaths].map((file) => readFileSync(join(root, file), "utf8"))];
  const usedTokens = new Set(sources.join("\n").match(/[a-zA-Z_][\w-]*/g));
  const sourceCss = readFileSync(join(root, "assets/styles.css"));
  const classes = new Set();
  transform({
    filename: "styles.css",
    code: sourceCss,
    visitor: {
      Selector(selector) {
        for (const component of selector) if (component.type === "class") classes.add(component.name);
      },
    },
  });
  const { code } = transform({
    filename: "styles.css",
    code: sourceCss,
    minify: true,
    unusedSymbols: [...classes].filter((name) => !usedTokens.has(name)),
  });
  return {
    css: `/* Generated from styles.css by scripts/build-site-styles.mjs. */\n${code}\n`,
    pages,
  };
}

export function compileContentStyles() {
  return compile("/assets/content.css");
}

export function compileInteractiveStyles() {
  return compile("/assets/interactive.css");
}

export function compileWoodStyles() {
  return compile("/assets/wood.css");
}

export function compilePlanningStyles() { return compile("/assets/planning.css"); }
export function compileTemplateStyles() { return compile("/assets/templates.css"); }
export function compileConstructionStyles() { return compile("/assets/construction.css"); }
export function compilePlywoodStyles() { return compile("/assets/plywood.css"); }
export function compileChecklistStyles() { return compile("/assets/checklists.css"); }
export function compileLegalStyles() { return compile("/assets/legal.css"); }

export function inlineWoodStyles() {
  // These text-led pages fit in a small complete bundle, including all menu
  // and responsive states. Inlining avoids a blocking stylesheet round trip.
  const { css, pages } = compileWoodStyles();
  const markup = `<style data-wood-styles>${css}</style>`;
  for (const file of pages) {
    const path = join(root, file);
    const html = readFileSync(path, "utf8");
    const next = html.replace(/<style data-wood-styles>[\s\S]*?<\/style>|<link rel="stylesheet" href="\/assets\/wood\.css">/g, () => markup);
    if (next !== html) writeFileSync(path, next);
  }
  console.log(`Inlined Wood styles for ${pages.length} pages: ${Buffer.byteLength(css)} bytes.`);
}

export function buildSiteStyles() {
  for (const [name, result] of [
    ["content.css", compileContentStyles()],
    ["interactive.css", compileInteractiveStyles()],
    ["wood.css", compileWoodStyles()],
    ["planning.css", compilePlanningStyles()],
    ["templates.css", compileTemplateStyles()],
    ["construction.css", compileConstructionStyles()],
    ["plywood.css", compilePlywoodStyles()],
    ["checklists.css", compileChecklistStyles()],
    ["legal.css", compileLegalStyles()],
  ]) {
    writeFileSync(join(root, "assets", name), result.css);
    console.log(`Built ${name} for ${result.pages.length} pages: ${Buffer.byteLength(result.css)} bytes.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) buildSiteStyles();
