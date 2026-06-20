import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apps = JSON.parse(readFileSync(join(root, "data", "app-store-apps.json"), "utf8"));
const outputPath = join(root, "data", "app-store-reviews.json");
const storefront = "us";
const maxPages = 3;

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function stripTags(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

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

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "text/html",
      "user-agent": "WoodCutTool review fetcher"
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

function extractHtmlReviews(html) {
  const start = html.indexOf('id="allProductReviews"');
  if (start === -1) return [];

  const sectionEnd = html.indexOf('id="information"', start);
  const section = html.slice(start, sectionEnd === -1 ? undefined : sectionEnd);
  const markers = [...section.matchAll(/aria-labelledby="review-(\d+)-title"/g)];
  const reviews = [];
  const seen = new Set();

  markers.forEach((marker, index) => {
    const id = marker[1];
    if (seen.has(id)) return;
    seen.add(id);

    const chunkStart = marker.index || 0;
    const chunkEnd = markers[index + 1]?.index || section.length;
    const chunk = section.slice(chunkStart, chunkEnd);
    const title = stripTags(chunk.match(new RegExp(`<h3 id="review-${id}-title"[^>]*>([\\s\\S]*?)<\\/h3>`))?.[1]);
    const rating = Number(chunk.match(/aria-label="(\d+) Stars?"/)?.[1]) || 0;
    const updated = decodeHtml(chunk.match(/<time[^>]*datetime="([^"]+)"/)?.[1] || "");
    const author = stripTags(chunk.match(/<span class="author[^"]*"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
    const content = stripTags(chunk.match(/<p data-testid="truncate-text"[^>]*>[\s\S]*?<!-- HTML_TAG_START -->([\s\S]*?)<!-- HTML_TAG_END -->/)?.[1]);

    if (!title || !content) return;
    reviews.push({ id, author, rating, version: "", title, content, updated });
  });

  return reviews;
}

async function fetchReviewsFromAppPage(app) {
  const pageUrl = `${app.url}?see-all=reviews&platform=iphone`;
  const html = await fetchHtml(pageUrl);
  return {
    sourceUrl: pageUrl,
    reviews: extractHtmlReviews(html).filter((review) => review.rating === 5)
  };
}

async function fetchFiveStarReviews(app) {
  const appId = appIdFromUrl(app.url);
  if (!appId) {
    return { appId: "", sourceUrl: "", reviews: [], error: "missing-app-id" };
  }

  try {
    const pageResult = await fetchReviewsFromAppPage(app);
    if (pageResult.reviews.length) {
      return { appId, sourceUrl: pageResult.sourceUrl, reviews: pageResult.reviews, sourceType: "app-store-page" };
    }
  } catch (error) {
    console.log(`${app.slug}: App Store page fallback (${String(error?.message || error)})`);
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

  return { appId, sourceUrl, reviews, sourceType: "rss" };
}

const data = {
  _meta: {
    source: "Apple App Store public reviews page, with customer reviews RSS fallback, US storefront",
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
      sourceType: result.sourceType,
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
