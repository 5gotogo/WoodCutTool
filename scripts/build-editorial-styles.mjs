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

export function blogArticleHtmlFiles() {
  return htmlFilesUnder("blog").filter((file) => file !== "blog/index.html" && file !== "blog/archive/index.html");
}

// Blog and Compare pages share the authored styles.css source, but they do not
// need calculator, App-directory, or project-workflow CSS on the critical path.
// Keep runtime tokens so translated and interactive Blog-index states remain.
function compilePages(pages, outputName) {
  // Generated inline CSS must not keep its own obsolete selectors alive.
  const html = pages.map((file) => readFileSync(join(root, file), "utf8").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ""));
  const runtimePaths = new Set([
    "assets/site-chrome.js",
    "assets/content-page.js",
    "assets/conversion.js",
    "assets/blog-index.js",
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
  return { css: `/* Generated ${outputName} from styles.css by scripts/build-editorial-styles.mjs. */\n${code}\n`, pages };
}

export function compileEditorialStyles() {
  return compilePages(editorialHtmlFiles(), "editorial.css");
}

export function compileBlogArticleStyles() {
  return compilePages(blogArticleHtmlFiles(), "blog-article.css");
}

export function compileBlogIndexStyles() {
  return compilePages(["blog/index.html"], "Blog index inline CSS");
}

export function inlineBlogIndexStyles() {
  const path = join(root, "blog/index.html");
  const html = readFileSync(path, "utf8");
  const css = compileBlogIndexStyles().css;
  const markup = `<style data-blog-index-styles>${css}</style>`;
  const next = html.replace(/<style data-blog-index-styles>[\s\S]*?<\/style>|<link rel="stylesheet" href="\/assets\/(?:editorial|blog-index)\.css">/g, () => markup);
  if (next !== html) writeFileSync(path, next);
  console.log(`Inlined Blog index styles: ${Buffer.byteLength(css)} bytes.`);
}

export function buildEditorialStyles() {
  for (const [name, result] of [
    ["editorial.css", compileEditorialStyles()],
    ["blog-article.css", compileBlogArticleStyles()],
  ]) {
    writeFileSync(join(root, "assets", name), result.css);
    console.log(`Built ${name} for ${result.pages.length} pages: ${Buffer.byteLength(result.css)} bytes.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  buildEditorialStyles();
}
