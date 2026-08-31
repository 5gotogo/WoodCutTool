import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inventoryPath = join(root, "data", "seo", "learn-intent-inventory.json");
const reviewPath = join(root, "docs", "learn-intent-review.md");
const errors = [];
const allowedDecisions = new Set(["keep", "differentiate-existing", "hold-for-performance-data"]);
const requiredFields = [
  "slug", "route", "canonical", "title", "h1", "description", "openingAnswer", "cluster", "pageRole",
  "primaryIntent", "primaryKeyword", "supportingKeywords", "requiredEvidence", "primaryAction", "actionType",
  "actionRoute", "relatedRoutes", "visibleWords", "inboundSourceCount", "reviewDecision", "reviewReason",
];

if (!existsSync(inventoryPath)) errors.push("Missing data/seo/learn-intent-inventory.json.");
if (!existsSync(reviewPath)) errors.push("Missing docs/learn-intent-review.md.");

const inventory = existsSync(inventoryPath) ? JSON.parse(readFileSync(inventoryPath, "utf8")) : { pages: [], candidateSets: [], summary: {} };
if (inventory.pages.length !== 163) errors.push(`Expected 163 Learn rows, found ${inventory.pages.length}.`);
if (inventory.summary.clusters !== 12) errors.push(`Expected 12 Learn clusters, found ${inventory.summary.clusters}.`);

const seenSlugs = new Set();
const seenRoutes = new Set();
const seenCanonicals = new Set();
for (const row of inventory.pages) {
  for (const field of requiredFields) {
    if (!(field in row) || row[field] === "" || row[field] === undefined) errors.push(`${row.slug || "Unknown row"} is missing ${field}.`);
  }
  if (seenSlugs.has(row.slug)) errors.push(`Duplicate Learn slug: ${row.slug}.`);
  if (seenRoutes.has(row.route)) errors.push(`Duplicate Learn route: ${row.route}.`);
  if (seenCanonicals.has(row.canonical)) errors.push(`Duplicate Learn canonical: ${row.canonical}.`);
  seenSlugs.add(row.slug);
  seenRoutes.add(row.route);
  seenCanonicals.add(row.canonical);
  if (!row.canonical.endsWith(row.route)) errors.push(`${row.slug} canonical does not match its route.`);
  const minimumVisibleWords = row.pageRole === "legacy-topic-hub" ? 100 : 200;
  if (row.visibleWords < minimumVisibleWords) errors.push(`${row.slug} has only ${row.visibleWords} visible words.`);
  if (row.inboundSourceCount < 1) errors.push(`${row.slug} has no contextual inbound source.`);
  if (!row.actionRoute.startsWith("/")) errors.push(`${row.slug} has a non-local primary action.`);
  if (row.candidateSet && !allowedDecisions.has(row.reviewDecision)) errors.push(`${row.slug} candidate decision is not reviewed.`);
}

for (const set of inventory.candidateSets) {
  if (!allowedDecisions.has(set.reviewDecision)) errors.push(`${set.id} has no allowed review decision.`);
  if (!set.reviewReason || set.reviewReason.length < 24) errors.push(`${set.id} has no substantive review reason.`);
  if (set.slugs.length < 2) errors.push(`${set.id} must contain at least two routes.`);
}

if (inventory.summary.candidateSets !== inventory.candidateSets.length) errors.push("Candidate-set summary count is stale.");
if (inventory.summary.reviewedCandidateSets !== inventory.candidateSets.length) errors.push("Every candidate set must have a recorded decision.");
if (inventory.summary.implementedDifferentiations !== 2 || inventory.implementedDifferentiations?.length !== 2) {
  errors.push("Expected two implemented source differentiations from this review.");
}
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  pages: inventory.pages.length,
  clusters: inventory.summary.clusters,
  candidateSets: inventory.candidateSets.length,
  candidatePages: inventory.summary.candidatePages,
  reviewedCandidateSets: inventory.summary.reviewedCandidateSets,
}, null, 2));
