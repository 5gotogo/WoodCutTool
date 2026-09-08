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
  const html = pages.map((file) => readFileSync(join(root, file), "utf8"));
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

export function buildSiteStyles() {
  for (const [name, result] of [
    ["content.css", compileContentStyles()],
    ["interactive.css", compileInteractiveStyles()],
  ]) {
    writeFileSync(join(root, "assets", name), result.css);
    console.log(`Built ${name} for ${result.pages.length} pages: ${Buffer.byteLength(result.css)} bytes.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) buildSiteStyles();
