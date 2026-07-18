import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "research", "data");
const csvFiles = readdirSync(dataDir).filter((file) => file.endsWith(".csv")).sort();
const issues = [];
const summaries = [];

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (quoted) issues.push(["unterminated quoted cell"]);
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function routeFile(urlValue) {
  try {
    const url = new URL(urlValue);
    if (url.hostname !== "woodcuttool.com") return null;
    const path = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
    return join(root, path.replace(/^\//, ""));
  } catch {
    return null;
  }
}

for (const file of csvFiles) {
  const raw = readFileSync(join(dataDir, file), "utf8");
  if (/\b(?:NaN|Infinity|undefined)\b/.test(raw)) {
    issues.push([file, "contains non-finite or undefined output"]);
  }
  const parsed = parseCsv(raw);
  const [headers = [], ...records] = parsed;
  if (!headers.length || !records.length) issues.push([file, "missing header or data rows"]);
  if (new Set(headers).size !== headers.length) issues.push([file, "duplicate headers"]);
  const width = headers.length;
  const objects = records.map((values, rowIndex) => {
    if (values.length !== width) issues.push([file, `row ${rowIndex + 2} has ${values.length} cells; expected ${width}`]);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
  if (new Set(records.map((values) => JSON.stringify(values))).size !== records.length) {
    issues.push([file, "contains duplicate rows"]);
  }

  for (const [rowIndex, record] of objects.entries()) {
    for (const [key, value] of Object.entries(record)) {
      if (/(?:yield|waste)_pct$/.test(key)) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0 || number > 100) {
          issues.push([file, `row ${rowIndex + 2}`, `${key} outside 0-100`, value]);
        }
      }
      if (/_url$/.test(key) && value.startsWith("https://woodcuttool.com/")) {
        const target = routeFile(value);
        if (!target || !existsSync(target)) issues.push([file, `row ${rowIndex + 2}`, `missing local source for ${value}`]);
      }
    }
    if ("complete_layout" in record && "rejected_piece_count" in record) {
      const complete = record.complete_layout === "true";
      const rejected = Number(record.rejected_piece_count);
      if (!Number.isInteger(rejected) || rejected < 0) issues.push([file, `row ${rowIndex + 2}`, "invalid rejected_piece_count"]);
      if (complete !== (rejected === 0)) issues.push([file, `row ${rowIndex + 2}`, "complete_layout conflicts with rejected_piece_count"]);
    }
  }
  summaries.push({ file, rows: records.length, columns: headers.length });
}

const robustnessFile = "plywood-layout-robustness-matrix.csv";
const robustnessRaw = readFileSync(join(dataDir, robustnessFile), "utf8");
const [robustnessHeaders, ...robustnessRecords] = parseCsv(robustnessRaw);
const robustnessObjects = robustnessRecords.map((values) => Object.fromEntries(robustnessHeaders.map((header, index) => [header, values[index]])));
const projectSlugs = new Set(robustnessObjects.map((row) => row.project_slug));
const trimValues = new Set(robustnessObjects.map((row) => row.trim_margin_each_edge_in));
const kerfValues = new Set(robustnessObjects.map((row) => row.kerf_in));
const orientationValues = new Set(robustnessObjects.map((row) => row.orientation_mode));
const scenarioKeys = robustnessObjects.map((row) => [row.project_slug, row.trim_margin_each_edge_in, row.kerf_in, row.orientation_mode].join("|"));
const expectedRobustnessRows = projectSlugs.size * trimValues.size * kerfValues.size * orientationValues.size;

if (projectSlugs.size !== 36) issues.push([robustnessFile, `expected 36 projects; found ${projectSlugs.size}`]);
if (trimValues.size !== 5) issues.push([robustnessFile, `expected 5 trim values; found ${trimValues.size}`]);
if (kerfValues.size !== 7) issues.push([robustnessFile, `expected 7 kerf values; found ${kerfValues.size}`]);
if (orientationValues.size !== 2) issues.push([robustnessFile, `expected 2 orientation modes; found ${orientationValues.size}`]);
if (scenarioKeys.length !== expectedRobustnessRows) issues.push([robustnessFile, `expected ${expectedRobustnessRows} full-factorial rows; found ${scenarioKeys.length}`]);
if (new Set(scenarioKeys).size !== scenarioKeys.length) issues.push([robustnessFile, "duplicate scenario keys"]);

console.log(`Audited ${summaries.length} research CSV files.`);
console.table(summaries);
console.log(`Robustness matrix: ${projectSlugs.size} projects × ${trimValues.size} trims × ${kerfValues.size} kerfs × ${orientationValues.size} modes = ${scenarioKeys.length} rows.`);

if (issues.length) {
  console.log("\nResearch data issues:");
  for (const issue of issues.slice(0, 100)) console.log(`- ${issue.join(" | ")}`);
  process.exitCode = 1;
} else {
  console.log("Research data audit passed.");
}
