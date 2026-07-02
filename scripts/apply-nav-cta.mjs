import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);

const appStoreLinks = {
  cutlist: "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871",
  quiltfit: "https://apps.apple.com/us/app/quiltfit-quilt-design-planner/id6776541705",
  stringer: "https://apps.apple.com/us/app/stringer-stair-layout/id6784882437?uo=4"
};

function collectHtmlFiles(dir = root, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) continue;
    const absolute = join(dir, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(absolute, relative));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relative);
    }
  }
  return files.sort();
}

function ctaFor(file, html) {
  if (
    file.startsWith("quiltfit/") ||
    file.startsWith("apps/quiltfit/") ||
    file.startsWith("apps/quiltfit-quilt-design-planner/") ||
    /<a class="active" href="\/quiltfit\/">QuiltFit<\/a>/.test(html)
  ) {
    return ["Download QuiltFit", appStoreLinks.quiltfit];
  }

  if (
    file.startsWith("stringer/") ||
    file.startsWith("apps/stringer/") ||
    file.startsWith("apps/stringer-stair-layout/") ||
    /<a class="active" href="\/stringer\/">Stringer<\/a>/.test(html)
  ) {
    return ["Download Stringer", appStoreLinks.stringer];
  }

  return ["Download CutList", appStoreLinks.cutlist];
}

function applyCta(html, label, href) {
  const replacement = `<a class="button small nav-download-cta" href="${href}" rel="nofollow noopener">${label}</a></nav></header>`;
  const pattern = /<a class="button small(?: nav-download-cta)?" href="[^"]*"(?: rel="[^"]*")?>[^<]*<\/a><\/nav><\/header>/;
  return html.replace(pattern, replacement);
}

let updated = 0;
let skipped = 0;

for (const file of collectHtmlFiles()) {
  const absolute = join(root, file);
  const html = readFileSync(absolute, "utf8");
  const [label, href] = ctaFor(file, html);
  const next = applyCta(html, label, href);
  if (next === html) {
    skipped += 1;
    continue;
  }
  writeFileSync(absolute, next);
  updated += 1;
}

console.log(`Applied nav download CTAs to ${updated} pages${skipped ? `, skipped ${skipped}` : ""}.`);
