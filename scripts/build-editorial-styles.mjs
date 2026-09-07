import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { transform } from "lightningcss";

const root = resolve(import.meta.dirname, "..");

function htmlFilesUnder(directory) {
  return readdirSync(join(root, directory), { recursive: true })
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => join(directory, file));
}

export function editorialHtmlFiles() {
  return [...htmlFilesUnder("blog"), ...htmlFilesUnder("compare")];
}

// Blog and Compare pages share the authored styles.css source, but they do not
// need calculator, App-directory, or project-workflow CSS on the critical path.
// Keep runtime tokens so translated and interactive Blog-index states remain.
export function compileEditorialStyles() {
  const pages = editorialHtmlFiles();
  const html = pages.map((file) => readFileSync(join(root, file), "utf8"));
  const runtimePaths = new Set([
    "assets/site-chrome.js",
    "assets/content-page.js",
    "assets/conversion.js",
    "assets/app.js",
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
  return { css: `/* Generated from styles.css by scripts/build-editorial-styles.mjs. */\n${code}\n`, pages };
}

export function buildEditorialStyles() {
  const { css, pages } = compileEditorialStyles();
  writeFileSync(join(root, "assets/editorial.css"), css);
  console.log(`Built editorial stylesheet for ${pages.length} pages: ${Buffer.byteLength(css)} bytes.`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  buildEditorialStyles();
}
