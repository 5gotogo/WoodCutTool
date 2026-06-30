import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(root, "data", "app-store-apps.json");
const apps = JSON.parse(readFileSync(outputPath, "utf8"));
const storefront = "us";
const selectedSlugs = new Set(process.argv.slice(2));

function appIdFromUrl(url) {
  return String(url || "").match(/\/id(\d+)/)?.[1] || "";
}

function normalizeResult(existing, result) {
  return {
    id: result.trackId,
    slug: existing.slug,
    name: result.trackName,
    genre: result.primaryGenreName,
    genres: result.genres || [],
    url: result.trackViewUrl,
    artworkUrl512: result.artworkUrl512 || result.artworkUrl100 || existing.artworkUrl512,
    screenshotUrls: result.screenshotUrls || [],
    description: result.description || "",
    version: result.version || "",
    releaseDate: result.releaseDate || "",
    currentVersionReleaseDate: result.currentVersionReleaseDate || "",
    minimumOsVersion: result.minimumOsVersion || "",
    formattedPrice: result.formattedPrice || "",
    trackContentRating: result.trackContentRating || "",
    sellerName: result.sellerName || existing.sellerName || ""
  };
}

async function fetchLookup(ids) {
  const url = `https://itunes.apple.com/lookup?id=${ids.join(",")}&country=${storefront}&entity=software`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "WoodCutTool App Store metadata fetcher"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return new Map((data.results || []).map((result) => [String(result.trackId), result]));
}

const targets = apps.filter((app) => !selectedSlugs.size || selectedSlugs.has(app.slug));
const ids = targets.map((app) => String(app.id || appIdFromUrl(app.url))).filter(Boolean);

if (!ids.length) {
  console.log("No matching apps to update.");
  process.exit(0);
}

const resultsById = await fetchLookup(ids);
let updated = 0;

const nextApps = apps.map((app) => {
  if (selectedSlugs.size && !selectedSlugs.has(app.slug)) return app;

  const id = String(app.id || appIdFromUrl(app.url));
  const result = resultsById.get(id);
  if (!result) {
    console.log(`${app.slug}: not found in Apple lookup`);
    return app;
  }

  updated += 1;
  console.log(`${app.slug}: ${result.trackName} ${result.version || ""}`);
  return normalizeResult(app, result);
});

writeFileSync(outputPath, `${JSON.stringify(nextApps, null, 2)}\n`);
console.log(`Updated ${updated} App Store app record(s).`);
