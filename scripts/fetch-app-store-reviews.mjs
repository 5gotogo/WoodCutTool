import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apps = JSON.parse(readFileSync(join(root, "data", "app-store-apps.json"), "utf8"));
const outputPath = join(root, "data", "app-store-reviews.json");
const storefront = "us";
const maxPages = 3;

function appIdFromUrl(url) {
  return String(url || "").match(/\/id(\d+)/)?.[1] || "";
}

function entriesFromFeed(feed) {
  const entries = feed?.feed?.entry || [];
  const list = Array.isArray(entries) ? entries : [entries];
  return list.filter((entry) => entry?.["im:rating"]);
}

function textValue(value) {
  return String(value?.label || "").trim();
}

function normalizeReview(entry) {
  return {
    id: textValue(entry.id),
    author: textValue(entry.author?.name),
    rating: Number(textValue(entry["im:rating"])) || 0,
    version: textValue(entry["im:version"]),
    title: textValue(entry.title),
    content: textValue(entry.content),
    updated: textValue(entry.updated)
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "user-agent": "WoodCutTool review fetcher"
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchFiveStarReviews(app) {
  const appId = appIdFromUrl(app.url);
  if (!appId) {
    return { appId: "", sourceUrl: "", reviews: [], error: "missing-app-id" };
  }

  const sourceUrl = `https://itunes.apple.com/${storefront}/rss/customerreviews/page=1/id=${appId}/sortby=mostrecent/json`;
  const reviews = [];
  const seen = new Set();

  for (let page = 1; page <= maxPages; page += 1) {
    const pageUrl = `https://itunes.apple.com/${storefront}/rss/customerreviews/page=${page}/id=${appId}/sortby=mostrecent/json`;
    const feed = await fetchJson(pageUrl);
    const entries = entriesFromFeed(feed);
    if (!entries.length) break;

    for (const entry of entries) {
      const review = normalizeReview(entry);
      if (review.rating !== 5 || !review.content || seen.has(review.id)) continue;
      seen.add(review.id);
      reviews.push(review);
    }

    if (entries.length < 50) break;
  }

  return { appId, sourceUrl, reviews };
}

const data = {
  _meta: {
    source: "Apple App Store customer reviews RSS, US storefront",
    storefront,
    fetchedAt: new Date().toISOString().slice(0, 10),
    ratingFilter: 5,
    maxPages
  }
};

for (const app of apps) {
  try {
    const result = await fetchFiveStarReviews(app);
    data[app.slug] = {
      sourceUrl: result.sourceUrl,
      appId: result.appId,
      reviews: result.reviews
    };
    console.log(`${app.slug}: ${result.reviews.length} five-star review(s)`);
  } catch (error) {
    data[app.slug] = {
      sourceUrl: "",
      appId: appIdFromUrl(app.url),
      reviews: [],
      error: String(error?.message || error)
    };
    console.log(`${app.slug}: failed (${String(error?.message || error)})`);
  }
}

writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
