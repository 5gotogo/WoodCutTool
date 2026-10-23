import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";
import { siteNavigationSource, siteMenuSource } from "./build-site-navigation.mjs";
import { woodRuntimeSource } from "./build-wood-runtime.mjs";
import { performanceProfile } from "./site-performance-profile.mjs";

const root = resolve(import.meta.dirname, "..");
const read = path => readFileSync(join(root, path), "utf8");
const source = read("assets/site-chrome.js");
const boundary = source.lastIndexOf("\n  renderSiteChrome();");
assert(boundary >= 0, "Shared chrome initialization boundary is missing");
const context = vm.createContext({ window: { location: { pathname: "/" } } });
vm.runInContext(source.slice(0, boundary) + `
  globalThis.renderHeader = pathname => {
    window.location.pathname = pathname;
    deferredMenus.clear();
    return header();
  };
})();`, context);

// Check the files browsers actually load, including Wood's separate runtime.
for (const [file, expected] of [
  ["assets/site-navigation.js", siteNavigationSource()],
  ["assets/site-menus.js", siteMenuSource()],
  ["assets/wood-page.js", woodRuntimeSource()],
]) assert.equal(read(file).trimEnd(), expected.trimEnd(), `${file} is stale; run npm run apply:nav-cta`);

function collect(dir = root, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith(".") || entry.name === "node_modules") return [];
    const relative = prefix + entry.name;
    if (entry.isDirectory()) return collect(join(dir, entry.name), relative + "/");
    return entry.isFile() && entry.name.endsWith(".html") ? [relative] : [];
  });
}

const files = collect().sort();
const summary = {
  htmlPages: files.length,
  navigationPages: 0,
  sharedRuntimePages: 0,
  woodRuntimePages: 0,
  redirectPages: 0,
  standalonePages: 0,
  bySection: {},
  cta: { label: "Download CutList App", href: "/apps/cutlist/" },
};
for (const file of files) {
  const html = read(file);
  const profile = performanceProfile(file, html);
  if (!profile.stylesheet) {
    if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html)) summary.redirectPages += 1;
    else summary.standalonePages += 1;
    continue;
  }
  const route = "/" + file.replace(/index\.html$/, "");
  const isWood = profile.runtimes.includes("/assets/wood-page.js");
  const runtime = isWood ? "/assets/wood-page.js" : "/assets/site-navigation.js";
  assert(html.includes(`src="${runtime}"`), `${route}: navigation runtime missing`);
  assert.equal((html.match(/<div\b[^>]*\bdata-site-header\b/g) || []).length, 1, `${route}: expected one header mount`);
  assert(!/<header\b[^>]*class=["'][^"']*\bsite-header\b/.test(html), `${route}: duplicate static site header`);
  const header = context.renderHeader(route);
  const buttons = [...header.matchAll(/<a\b[^>]*class="[^"]*\bnav-download-cta\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(buttons.length, 1, `${route}: expected one navigation CTA`);
  const [anchor, contents] = buttons[0];
  assert(anchor.includes(`href="${summary.cta.href}"`), `${route}: wrong download destination`);
  assert.equal(contents.replace(/<[^>]*>/g, "").trim(), summary.cta.label, `${route}: wrong CTA copy`);
  assert(!anchor.includes("data-app-store-link"), `${route}: landing link must not be rewritten to the store`);
  summary.navigationPages += 1;
  summary[isWood ? "woodRuntimePages" : "sharedRuntimePages"] += 1;
  const section = file === "index.html" ? "home" : file.split("/")[0];
  summary.bySection[section] = (summary.bySection[section] || 0) + 1;
}
console.log(JSON.stringify(summary, null, 2));
