import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { transform } from "lightningcss";

const root = resolve(import.meta.dirname, "..");

export function appHtmlFiles() {
  return readdirSync(join(root, "apps"), { recursive: true })
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => join("apps", file));
}

// Keep styles.css as the single authored source. Only discard classes absent
// from every App page AND its runtimes, including the on-demand language bundle.
// Scan whole source tokens conservatively so menu/rail/translation states survive
// even when they are not present in the initial DOM. Never prune by viewport.
export function compileAppStyles() {
  const pages = appHtmlFiles();
  const html = pages.map((file) => readFileSync(join(root, file), "utf8")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi, ""));
  const runtimePaths = new Set([
    "assets/site-chrome.js", "assets/content-page.js", "assets/conversion.js",
  ]);
  for (const source of html) {
    for (const match of source.matchAll(/<script\b[^>]*\bsrc=["']\/(assets\/[^"'?]+\.js)(?:\?[^"']*)?["']/g)) {
      runtimePaths.add(match[1]);
    }
  }
  const sources = [...html, ...[...runtimePaths].map((file) => readFileSync(join(root, file), "utf8"))];
  const usedTokens = new Set(sources.join("\n").match(/[a-zA-Z_][\w-]*/g));
  const css = readFileSync(join(root, "assets/styles.css"));
  const classes = new Set();
  transform({
    filename: "styles.css",
    code: css,
    visitor: {
      Selector(selector) {
        for (const component of selector) {
          if (component.type === "class") classes.add(component.name);
        }
      },
    },
  });
  const { code } = transform({
    filename: "styles.css",
    code: css,
    minify: true,
    unusedSymbols: [...classes].filter((name) => !usedTokens.has(name)),
  });
  return { css: `/* Generated from styles.css by scripts/build-app-styles.mjs. */\n${code}\n`, pages };
}

export function buildAppStyles() {
  const { css, pages } = compileAppStyles();
  writeFileSync(join(root, "assets/apps.css"), css);
  console.log(`Built App stylesheet for ${pages.length} pages: ${Buffer.byteLength(css)} bytes.`);
}

export function inlineAppStyles() {
  const { css, pages } = compileAppStyles();
  for (const file of pages) {
    const path = join(root, file);
    const html = readFileSync(path, "utf8");
    const next = html.replace(/<style data-apps-styles>[\s\S]*?<\/style>|<link rel="stylesheet" href="\/assets\/apps\.css">/g,
      () => `<style data-apps-styles>${css}</style>`);
    if (next !== html) writeFileSync(path, next);
  }
  console.log(`Inlined App styles for ${pages.length} pages: ${Buffer.byteLength(css)} bytes.`);
}
