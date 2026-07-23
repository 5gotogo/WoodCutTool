import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cutlistConversionCta, cutlistRedirectUrl } from "./conversion-components.mjs";
import { ogTags } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apps = JSON.parse(readFileSync(join(root, "data", "app-store-apps.json"), "utf8"));
const reviewsBySlug = JSON.parse(readFileSync(join(root, "data", "app-store-reviews.json"), "utf8"));
const app = apps.find((item) => item.slug === "cutlist-plywood-optimizer");
const reviews = reviewsBySlug["cutlist-plywood-optimizer"]?.reviews || [];

if (!app) throw new Error("Missing CutList App Store data");

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const screenshotCards = [
  ["cutlist-layout.webp", "Start a checked cut list", "Add the sheet stock and named parts, then generate a layout in seconds."],
  ["cutlist-layout-stats.webp", "See yield, cost, and waste", "Review sheet use, material cost, waste value, and the visual layout before cutting."],
  ["cutlist-parts-view.webp", "Inspect every part", "Check exact dimensions and placement instead of interpreting an unlabeled rectangle."],
  ["cutlist-cut-sequence.webp", "Follow the cutting sequence", "Work through coordinates and completed cuts directly beside the material."],
  ["cutlist-ai-scan.webp", "Scan a paper list with AI OCR", "CutList Pro can read a handwritten or printed list locally; review the imported parts before use."],
  ["cutlist-offline-private.webp", "Keep project data on device", "No account, no cloud upload, and no project tracking are required for the workflow."],
];

const featureCards = [
  ["waste", "Stop buying the extra sheet “just in case”", "Enter the real stock, parts, quantity, kerf, and rotation rules. CutList shows the material consequence before the first panel is broken down.", "Layout, sheet count, waste, and material cost"],
  ["scan", "Stop typing a long parts list twice", "Use on-device AI OCR in CutList Pro to scan a handwritten or printed list, then review the recognized rows before generating the layout.", "Local AI scan · Pro"],
  ["sequence", "Stop improvising the next cut at the saw", "Follow a step-by-step cut sequence with exact coordinates and mark completed cuts as the sheet is processed.", "Cut sequence and coordinates"],
  ["revision", "Stop losing the approved revision", "Save, reopen, edit, and duplicate projects so a changed shelf or cabinet side does not force the whole plan back into scattered notes.", "Project history"],
  ["accuracy", "Keep grain, kerf, and edge details visible", "Lock grain direction, set the real blade kerf, use inch fractions or metric units, and account for edge-banding decisions before release.", "Inch and metric support"],
  ["export", "Hand off the same plan you reviewed", "CutList Pro exports layouts and cut sequences to PDF, saves layout images, and supports AirPrint from iPhone or iPad.", "PDF and AirPrint · Pro"],
];

const reviewCards = reviews.slice(0, 3).map((review) => `<article class="cutlist-review-card">
  <div class="cutlist-review-stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(Math.max(0, 5 - review.rating))}</div>
  <h3>${esc(review.title)}</h3>
  <p>${esc(review.content)}</p>
  <span>${esc(review.author)} · verified public App Store review</span>
</article>`).join("");

const ratingValue = Number(app.averageUserRating || 0);
const ratingCount = Number(app.userRatingCount || reviews.length);
const heroStoreUrl = cutlistRedirectUrl("app-page", "hero");

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://woodcuttool.com/apps/cutlist/#software",
      name: app.name,
      url: "https://woodcuttool.com/apps/cutlist/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "iOS 17.6 or later; iPadOS 17.6 or later",
      description: "Offline plywood cut list optimizer with visual sheet layouts, local AI scan, step-by-step cutting sequence, material cost and waste tracking, saved projects, PDF export, and AirPrint.",
      downloadUrl: app.url,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free basic layout generation. Advanced Pro features require a subscription.",
      },
      featureList: [
        "Fast visual sheet layout generation",
        "On-device AI cut-list scan",
        "Step-by-step cut sequence",
        "Material cost and waste tracking",
        "Inch fractions and metric units",
        "Grain direction, kerf, and edge-banding settings",
        "Saved project history",
        "PDF export and AirPrint",
        "Offline operation with no account or cloud upload",
      ],
      ...(ratingCount > 0 ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          ratingCount,
          bestRating: 5,
          worstRating: 1,
        },
      } : {}),
      ...(reviews.length ? {
        review: reviews.slice(0, 3).map((review) => ({
          "@type": "Review",
          author: { "@type": "Person", name: review.author },
          name: review.title,
          reviewBody: review.content,
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        })),
      } : {}),
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        ["Can I use CutList for free?", "Yes. CutList includes free basic layout generation. AI Scan, PDF export, AirPrint, unlimited projects, and other advanced tools require CutList Pro."],
        ["Does CutList upload my project?", "No. CutList runs on device, requires no account, and does not upload project data to the cloud."],
        ["Can CutList scan a handwritten parts list?", "CutList Pro includes on-device AI OCR for handwritten or printed parts lists. Every imported row should be reviewed before layout generation."],
        ["Does CutList create a cutting sequence?", "Yes. After a layout is generated, CutList provides an ordered cutting guide with coordinates for each part."],
      ].map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

const title = "CutList App: Stop Recalculating Plywood Cuts";
const description = "Scan or enter plywood parts, generate visual sheet layouts, track cost and waste, follow the cut sequence, and keep projects offline on iPhone or iPad.";

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | WoodCutTool</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="https://woodcuttool.com/apps/cutlist/">
  <!-- og:start -->
  ${ogTags({
    title: `${title} | WoodCutTool`,
    description,
    canonical: "https://woodcuttool.com/apps/cutlist/",
  })}
  <!-- og:end -->
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <style>.mega-menu{display:none}</style>
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/app.js"></script>
  <script type="application/ld+json">${JSON.stringify(softwareJsonLd)}</script>
</head>
<body class="cutlist-app-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  <main id="main">
    <section class="cutlist-app-hero">
      <div class="cutlist-app-hero-copy">
        <p class="breadcrumb"><a href="/">Home</a> / <a href="/apps/">Apps</a> / CutList</p>
        <p class="eyebrow">Plywood plans that survive real project changes</p>
        <h1>Stop recalculating plywood cuts every time the list changes.</h1>
        <p class="lead">Scan or enter the parts, generate a visual sheet layout, review material cost and waste, then carry the cutting sequence into the shop—offline on iPhone or iPad.</p>
        <div class="hero-actions">
          <a class="button" href="${heroStoreUrl}" data-app-store-link data-platform-label data-conversion-placement="app-hero" rel="nofollow noopener">Get CutList on the App Store</a>
          <a class="button secondary" href="/plywood-cut-calculator/">Try the free browser calculator</a>
        </div>
        <ul class="cutlist-app-proof" aria-label="CutList proof points">
          <li><strong>${ratingValue.toFixed(1)}/5</strong><span>${ratingCount} public US ratings</span></li>
          <li><strong>Free</strong><span>Basic layout generation</span></li>
          <li><strong>Private</strong><span>No account or cloud upload</span></li>
          <li><strong>Offline</strong><span>Project data stays on device</span></li>
        </ul>
      </div>
      <figure class="cutlist-hero-shot">
        <img src="/assets/images/apps/cutlist/cutlist-layout-stats.webp" width="600" height="1300" fetchpriority="high" alt="CutList app showing plywood yield, sheet count, material cost, waste value, and visual layout">
        <figcaption>See the sheet count, yield, cost, waste value, and part placement before cutting.</figcaption>
      </figure>
    </section>

    <section class="section cutlist-problem-strip" aria-label="Common cut list problems">
      <div><strong>One changed dimension</strong><span>can invalidate the sheet count.</span></div>
      <div><strong>One missing part</strong><span>can force another material run.</span></div>
      <div><strong>One lost revision</strong><span>can send the wrong list to the saw.</span></div>
    </section>

    <section class="section cutlist-feature-section">
      <div class="section-heading compact">
        <p class="eyebrow">Built around the failure you want to avoid</p>
        <h2>Move from scattered dimensions to one checked shop plan.</h2>
        <p>Every feature below maps to a specific source of material waste, repeated entry, or cutting ambiguity.</p>
      </div>
      <div class="cutlist-feature-grid">
        ${featureCards.map(([id, heading, body, label]) => `<article id="${id}" class="cutlist-feature-card">
          <span>${esc(label)}</span>
          <h3>${esc(heading)}</h3>
          <p>${esc(body)}</p>
        </article>`).join("")}
      </div>
    </section>

    <section class="section cutlist-screenshots-section" aria-labelledby="cutlist-screenshots-title">
      <div class="section-heading compact">
        <p class="eyebrow">Real App Store screenshots</p>
        <h2 id="cutlist-screenshots-title">See the workflow before you install.</h2>
        <p>Start with stock and parts, inspect the layout, follow the sequence, and keep the records local.</p>
      </div>
      <div class="cutlist-screenshot-grid">
        ${screenshotCards.map(([file, heading, body], index) => `<figure class="cutlist-screenshot-card">
          <img src="/assets/images/apps/cutlist/${file}" width="600" height="1300" loading="${index < 2 ? "eager" : "lazy"}" alt="${esc(`${heading} in the CutList app`)}">
          <figcaption><strong>${esc(heading)}</strong><span>${esc(body)}</span></figcaption>
        </figure>`).join("")}
      </div>
    </section>

    <section class="section cutlist-pricing-section">
      <div class="cutlist-pricing-copy">
        <p class="eyebrow">Clear before download</p>
        <h2>Start with free basic layouts. Upgrade only for the advanced workflow.</h2>
        <p>CutList is free to download and includes basic layout generation. CutList Pro is required for AI Scan, PDF export, AirPrint, unlimited projects, and additional professional tools. Subscription pricing is shown inside the App Store and the app for your region.</p>
      </div>
      <div class="cutlist-plan-grid" aria-label="CutList free and Pro feature comparison">
        <article><span>Free</span><h3>Basic layout generation</h3><ul><li>Enter sheets and parts</li><li>Generate and review layouts</li><li>Work locally on device</li></ul></article>
        <article class="featured"><span>CutList Pro</span><h3>Advanced shop workflow</h3><ul><li>On-device AI Scan</li><li>PDF export and AirPrint</li><li>Unlimited projects and advanced tools</li></ul></article>
      </div>
    </section>

    ${reviews.length ? `<section class="section cutlist-reviews-section">
      <div class="section-heading compact"><p class="eyebrow">Real public feedback</p><h2>What the first CutList reviewers say.</h2><p>${ratingCount} public US App Store ratings are currently available. The small count is shown directly rather than inflated into a larger claim.</p></div>
      <div class="cutlist-review-grid">${reviewCards}</div>
    </section>` : ""}

    <section class="section cutlist-faq-section">
      <div class="section-heading compact"><p class="eyebrow">Before you install</p><h2>CutList questions</h2></div>
      <div class="faq-list">
        <details><summary>Can I use CutList for free?</summary><p>Yes. Basic layout generation is free. AI Scan, PDF export, AirPrint, unlimited projects, and other professional tools require CutList Pro.</p></details>
        <details><summary>Does CutList upload my project?</summary><p>No. Project data and cut-list processing stay on your device. No account or cloud upload is required.</p></details>
        <details><summary>Can I scan a handwritten cut list?</summary><p>CutList Pro includes local AI OCR for handwritten or printed lists. Review every recognized name, dimension, quantity, and grain rule before generating a layout.</p></details>
        <details><summary>Can the website send this exact calculator result into the app?</summary><p>Not currently. The website is for a quick browser estimate. Use CutList to create and retain the reviewed project, or scan a prepared parts list with CutList Pro.</p></details>
      </div>
    </section>

    <section class="section">
      ${cutlistConversionCta({
        context: "result",
        source: "app-page",
        title: "Make the next plywood layout a saved project",
        description: "Start with free basic layout generation, then decide whether the advanced scan, export, and printing workflow fits the job.",
        primaryLabel: "Get CutList on the App Store",
        secondaryHref: "/plywood-cut-calculator/",
        secondaryLabel: "Use the browser calculator first",
      })}
    </section>
  </main>
  <div data-site-footer></div>
</body>
</html>
`;

writeFileSync(join(root, "apps", "cutlist", "index.html"), html);
console.log(`Generated CutList conversion landing page with ${screenshotCards.length} real screenshots and ${reviews.length} reviews.`);
