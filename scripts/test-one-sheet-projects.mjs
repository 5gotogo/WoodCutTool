import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectBenchmarks, projectResult } from "./plywood-benchmark-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = join(root, "one-sheet-projects", "index.html");
const csvPath = join(root, "one-sheet-projects", "one-sheet-projects.csv");
const errors = [];
const expected = projectBenchmarks.filter((project) => {
  const result = projectResult(project);
  return result.allowedComplete && result.allowedSheets === 1;
});

if (!existsSync(htmlPath)) errors.push("Missing generated One-Sheet Projects hub.");
if (!existsSync(csvPath)) errors.push("Missing generated One-Sheet Projects master CSV.");

if (!errors.length) {
  const html = readFileSync(htmlPath, "utf8");
  const csv = readFileSync(csvPath, "utf8").trimEnd();
  const cardCount = (html.match(/\bdata-one-sheet-card\b/g) || []).length;
  const csvRows = csv.split("\n").length - 1;
  if (expected.length !== 43) errors.push(`Dataset now contains ${expected.length} one-sheet projects; review the published count and UX.`);
  if (cardCount !== expected.length) errors.push(`Expected ${expected.length} cards, found ${cardCount}.`);
  if (csvRows !== expected.length) errors.push(`Expected ${expected.length} CSV rows, found ${csvRows}.`);
  if (!html.includes('<link rel="canonical" href="https://woodcuttool.com/one-sheet-projects/">')) errors.push("One-Sheet Projects canonical is missing or incorrect.");
  if ((html.match(/<title\b/gi) || []).length !== 1) errors.push("One-Sheet Projects must contain exactly one title element.");
  if (!html.includes('"@type": "CollectionPage"') || !html.includes('"@type": "FAQPage"')) errors.push("One-Sheet Projects structured data is incomplete.");
  if (!html.includes("/assets/one-sheet-projects.css") || !html.includes("/assets/one-sheet-projects.js")) errors.push("One-Sheet Projects assets are not linked.");
  for (const project of expected) {
    for (const href of [project.templatePath, `/examples/${project.slug}-cut-list/`, `/examples/data/${project.slug}-cut-list.csv`]) {
      if (!html.includes(`href="${href}"`)) errors.push(`Hub is missing ${project.slug} link: ${href}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ projects: expected.length, cards: expected.length, csvRows: expected.length, localAssets: 2 }, null, 2));
