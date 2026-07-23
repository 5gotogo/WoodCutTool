import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cutlistConversionCta } from "./conversion-components.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const surfaces = ["templates", "examples", "learn", "troubleshooting"];

function htmlFiles(dir, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...htmlFiles(absolute, relative));
    if (entry.isFile() && entry.name === "index.html") files.push(relative);
  }
  return files;
}

function labelFromSlug(slug) {
  return slug
    .replaceAll(/-(cut-list|guide|example)$/g, "")
    .replaceAll("-", " ")
    .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

function ctaFor(file, html) {
  const [surface, slug = ""] = file.split("/");
  if (!slug || file === `${surface}/index.html`) return "";
  const label = labelFromSlug(slug);

  if (surface === "templates") {
    return cutlistConversionCta({
      context: "template",
      source: "template-detail",
      title: `Replace the ${label.toLowerCase()} sample dimensions with the real job`,
      description: "Use the sample as a parts checklist, then create a CutList project with measured dimensions, actual material, kerf, grain direction, and approved quantities.",
    });
  }
  if (surface === "examples") {
    return cutlistConversionCta({
      context: "example",
      source: "example-detail",
      title: `Turn the ${label} example into your checked project`,
      description: "The published result uses fixed sample inputs. Rebuild it with the dimensions, material groups, kerf, and grain rules that will actually be released to the shop.",
    });
  }
  if (surface === "learn") {
    const unrelated = /(tile|quilt|fabric|yardage|batting|binding|stair|stringer|roof|deck|fence|concrete)/i.test(`${slug} ${html.slice(0, 2200)}`);
    if (unrelated || !html.includes("/apps/cutlist/")) return "";
    return cutlistConversionCta({
      context: "guide",
      source: "learn-guide",
      title: `Apply ${label.toLowerCase()} to the parts you will actually cut`,
      description: "Use the related browser calculator for a quick check. Use CutList when the plywood plan needs saved revisions, offline access, a cutting sequence, or a Pro PDF handoff.",
      secondaryHref: "/tools/",
      secondaryLabel: "Choose the matching calculator",
    });
  }
  if (surface === "troubleshooting") {
    return cutlistConversionCta({
      context: "troubleshooting",
      source: "troubleshooting",
      title: `Preserve the corrected ${label.toLowerCase()} revision`,
      description: "After the cause is isolated, keep the baseline, corrected parts, regenerated plywood layout, and approved cutting sequence together with the job.",
      secondaryHref: "/troubleshooting/",
      secondaryLabel: "Browse another symptom",
    });
  }
  return "";
}

let added = 0;
let skipped = 0;

for (const surface of surfaces) {
  const dir = join(root, surface);
  for (const relative of htmlFiles(dir, surface)) {
    const absolute = join(root, relative);
    const html = readFileSync(absolute, "utf8");
    if (html.includes("data-conversion-cta")) {
      skipped += 1;
      continue;
    }
    const cta = ctaFor(relative, html);
    if (!cta || !html.includes("</article>")) {
      skipped += 1;
      continue;
    }
    writeFileSync(absolute, html.replace("</article>", `${cta}\n</article>`));
    added += 1;
  }
}

console.log(`Applied contextual CutList CTAs to ${added} pages, skipped ${skipped}.`);
