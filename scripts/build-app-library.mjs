import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags } from "./seo-meta.mjs";
import { compareData } from "./app-compare-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260701-nav";
const apps = JSON.parse(readFileSync(join(root, "data", "app-store-apps.json"), "utf8"));
const appStoreReviews = JSON.parse(readFileSync(join(root, "data", "app-store-reviews.json"), "utf8"));

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function excerpt(description, max = 190) {
  const clean = String(description || "").replace(/\s+/g, " ").trim();
  const stop = clean.search(/(?<=[.!?])\s+[A-Z0-9]/);
  let text = stop > 85 ? clean.slice(0, stop + 1) : clean.slice(0, max);
  if (text.length < 95) text = clean.slice(0, max);
  // Keep meta descriptions within SERP display limits: if the chosen sentence still
  // overruns max, trim back to the last word boundary at or before max.
  if (text.length > max) {
    const hard = clean.slice(0, max);
    const lastSpace = hard.lastIndexOf(" ");
    text = lastSpace > 95 ? hard.slice(0, lastSpace) : hard;
  }
  text = text.trim();
  return text.length < clean.length ? `${text.replace(/[,\s.]+$/, "")}...` : text;
}

const titleSuffix = " | WoodCutTool";

function seoTitle(title, max = 65) {
  const clean = String(title || "").replace(/\s+/g, " ").trim();
  if (`${clean}${titleSuffix}`.length <= max) return `${clean}${titleSuffix}`;

  const maxCore = max - titleSuffix.length;
  const hard = clean.slice(0, maxCore + 1);
  const lastSpace = hard.lastIndexOf(" ");
  const core = clean
    .slice(0, lastSpace > 35 ? lastSpace : maxCore)
    .replace(/[,\-:;|\s]+$/, "")
    .trim();
  return `${core}${titleSuffix}`;
}

function initials(name) {
  return name
    .replace(/[–—:&-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function head({ title, description, canonical, jsonLd = "" }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  ${ogTags({ title, description, canonical })}
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <style>.mega-menu{display:none}</style>
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/app.js"></script>
  ${jsonLd}
</head>`;
}

function header() {
  return `<div data-site-header></div>`;
}

function footer() {
  return `<div data-site-footer></div>`;
}

const appBySlug = new Map(apps.map((app) => [app.slug, app]));

const detailRouteOverrides = {
  "cutlist-plywood-optimizer": "/apps/cutlist/",
  "quiltfit-quilt-design-planner": "/apps/quiltfit/",
  "stringer-stair-layout": "/apps/stringer/"
};

const generatedOverrideSlugs = new Set(["stringer-stair-layout"]);
const handWrittenOverrideSlugs = new Set(["cutlist-plywood-optimizer", "quiltfit-quilt-design-planner"]);

const legalLinksBySlug = {
  "tilefit-tile-layout-planner": {
    privacy: "/legal/TileFit/privacy/",
    support: "/legal/TileFit/support/"
  },
  "jobphotolog-work-reports": {
    privacy: "/legal/JobPhotoLog/privacy/",
    support: "/legal/JobPhotoLog/support/"
  },
  "stringer-stair-layout": {
    privacy: "/legal/Stringer/privacy/",
    support: "/legal/Stringer/support/"
  },
  "thumbtype-typing-speed-test": {
    privacy: "/legal/ThumbType/privacy/",
    support: "/legal/ThumbType/support/"
  },
  "tinnitus-relief-sound-masking": {
    privacy: "/legal/Tinnitus/privacy/",
    support: "/legal/Tinnitus/support/"
  }
};

const appSupportDirectory = [
  ["CutList", "/legal/cutlist/privacy/", "/legal/cutlist/support/"],
  ["QuiltFit", "/legal/quiltfit/privacy/", "/legal/quiltfit/support/"],
  ["Stringer", "/legal/Stringer/privacy/", "/legal/Stringer/support/"],
  ["JobPhotoLog", "/legal/JobPhotoLog/privacy/", "/legal/JobPhotoLog/support/"],
  ["ThumbType", "/legal/ThumbType/privacy/", "/legal/ThumbType/support/"],
  ["Tinnitus Relief", "/legal/Tinnitus/privacy/", "/legal/Tinnitus/support/"],
  ["MoodLoop", "/legal/MoodLoop/privacy/", "/legal/MoodLoop/support/"],
  ["Casework", "/legal/Casework/privacy/", "/legal/Casework/support/"],
  ["PrivateMind", "/legal/PrivateMind/privacy/", "/legal/PrivateMind/support/"],
  ["TileFit", "/legal/TileFit/privacy/", "/legal/TileFit/support/"]
];

const featuredApps = [
  ["cutlist-plywood-optimizer", "Offline plywood cut list optimizer for woodworkers, cabinet makers, and DIY builders."],
  ["tilefit-tile-layout-planner", "Offline tile layout planner with six patterns, material estimates, grouped cuts, installation order, and PDF export."],
  ["jobphotolog-work-reports", "Private, offline jobsite photo records with before-and-after evidence, punch lists, signatures, and professional PDF reports."],
  ["quiltfit-quilt-design-planner", "Quilt design planner for fabric layouts, block planning, and project organization."],
  ["snapreceipt-expenses-and-tax", "Private receipt scanner, expense tracker, and mileage log for reimbursements and tax records."],
  ["invoice-maker-estimate-pdf", "Fast invoice and estimate PDF maker for freelancers, contractors, and small businesses."],
  ["pdf-scan-scanner-and-reader", "Private PDF scanner and document reader for everyday paperwork."],
  ["cadenza-metronome-and-tuner", "Metronome, tuner, and music practice companion for focused daily practice."]
];

const categorySections = [
  {
    id: "maker-calculator-apps",
    title: "Maker & Calculator Apps",
    description: "Practical iPhone tools for people who plan, measure, cut, design, or build physical projects. These apps focus on plywood optimization, quilt planning, tile estimation, stair stringer calculation, and other maker workflows.",
    slugs: ["cutlist-plywood-optimizer", "tilefit-tile-layout-planner", "quiltfit-quilt-design-planner", "stringer-stair-layout"],
    relatedTools: [
      {
        name: "Tile",
        label: "Calculator",
        description: "Tile layout and material planning calculator for floor and wall projects.",
        href: "/tile-calculator/",
        tags: ["Tile layout", "Materials", "Planning"]
      }
    ]
  },
  {
    id: "small-business-apps",
    title: "Small Business Apps",
    description: "Simple business utilities for contractors, vendors, freelancers, and small teams that need work reports, photo evidence, receipts, invoices, inventory counts, shift schedules, expense reports, and everyday records on iPhone.",
    slugs: ["jobphotolog-work-reports", "snapreceipt-expenses-and-tax", "invoice-maker-estimate-pdf", "expensereportmaker-and-receipts", "marketvendor-sales-and-profit", "snapstock-inventory-scanner", "work-shift-schedule-calendar"]
  },
  {
    id: "document-productivity-apps",
    title: "Document & Productivity Apps",
    description: "Private productivity apps for typing practice, scanning documents, compressing images, backing up contacts, transcribing meetings, picking decisions, and keeping precise time without heavy setup.",
    slugs: ["thumbtype-typing-speed-test", "pdf-scan-scanner-and-reader", "image-compressor-and-zip", "export-backup-all-contacts-pro", "private-meeting-transcriber", "pickone-random-choice-picker", "atomic-clock-precision-time", "printer-app-print-pdf-docs"]
  },
  {
    id: "home-everyday-utility-apps",
    title: "Home & Everyday Utility Apps",
    description: "Everyday iPhone utilities for home organization, pantry labels, QR codes, photo cleanup, private storage, and simple tasks that should stay quick and local.",
    slugs: ["fridgetrack-fridge-inventory", "pantry-label-maker-kitchen", "address-label-maker-and-envelope", "snapqr-qr-generator-app", "snapcleaner-clean-photos", "photosafe-private-photo-vault", "snaplabel-photo-text-label"]
  },
  {
    id: "creative-media-apps",
    title: "Creative & Media Apps",
    description: "Focused tools for musicians, creators, audio testing, watermarking, and personal creative workflows.",
    slugs: ["cadenza-metronome-and-tuner", "signaturemark-brand-mark", "speaker-tools-audio-test"]
  },
  {
    id: "health-focus-personal-apps",
    title: "Health, Focus & Personal Apps",
    description: "Calm personal utilities for journaling, habits, tinnitus sound masking, fasting, focus, breathing, sleep rhythm, and easier reading.",
    slugs: ["mindnest-secret-journal", "ritualix-habits-and-streaks", "glowfeel-stress-ease", "tinnitus-relief-sound-masking", "fast-rhythm-fasting-and-sleep", "magnifier-reader-big-text"]
  },
  {
    id: "games",
    title: "Games",
    description: "Small casual games designed for quick, relaxing sessions.",
    slugs: ["colorpop-color-block-tap-game", "blockfit-block-puzzle"]
  }
];

const appTags = {
  "cutlist-plywood-optimizer": ["Plywood", "Cut lists", "Offline", "PDF export"],
  "tilefit-tile-layout-planner": ["Tile layouts", "Six patterns", "Offline", "PDF export"],
  "quiltfit-quilt-design-planner": ["Quilting", "Fabric plans", "Blocks", "Projects"],
  "snapreceipt-expenses-and-tax": ["Receipts", "Expenses", "Mileage", "Records"],
  "invoice-maker-estimate-pdf": ["Invoices", "Estimates", "PDF", "Clients"],
  "pdf-scan-scanner-and-reader": ["PDF scan", "Documents", "Private", "Reader"],
  "cadenza-metronome-and-tuner": ["Metronome", "Tuner", "Practice", "Music"],
  "expensereportmaker-and-receipts": ["Reports", "Receipts", "PDF", "Business"],
  "marketvendor-sales-and-profit": ["Vendors", "Sales", "Profit", "Ledger"],
  "snapstock-inventory-scanner": ["Inventory", "Scanner", "Counts", "Stock"],
  "work-shift-schedule-calendar": ["Shifts", "Calendar", "Schedules", "Work"],
  "jobphotolog-work-reports": ["Job photos", "PDF reports", "Offline", "No login"],
  "image-compressor-and-zip": ["Compress", "ZIP", "Images", "Export"],
  "export-backup-all-contacts-pro": ["Contacts", "Backup", "CSV", "vCard"],
  "private-meeting-transcriber": ["Transcribe", "Meetings", "Private", "Notes"],
  "pickone-random-choice-picker": ["Choices", "Random", "Decisions", "Quick"],
  "atomic-clock-precision-time": ["Clock", "NTP", "Precision", "Time"],
  "stringer-stair-layout": ["Stairs", "Stringer", "Riser & tread", "Cut sheet"],
  "printer-app-print-pdf-docs": ["Print", "PDF", "Docs", "AirPrint"],
  "thumbtype-typing-speed-test": ["Typing test", "WPM", "Accuracy", "Offline"],
  "fridgetrack-fridge-inventory": ["Fridge", "Inventory", "Food", "Home"],
  "pantry-label-maker-kitchen": ["Pantry", "Labels", "Kitchen", "Print"],
  "address-label-maker-and-envelope": ["Labels", "Envelope", "Mailing", "Print"],
  "snapqr-qr-generator-app": ["QR codes", "Generator", "Share", "Utility"],
  "snapcleaner-clean-photos": ["Photos", "Cleanup", "Storage", "Utility"],
  "photosafe-private-photo-vault": ["Photos", "Vault", "Private", "Storage"],
  "snaplabel-photo-text-label": ["Labels", "Photo text", "Print", "AI"],
  "signaturemark-brand-mark": ["Watermark", "Branding", "Photos", "Creator"],
  "speaker-tools-audio-test": ["Audio", "Tone", "Speaker", "Test"],
  "mindnest-secret-journal": ["Journal", "Private", "Notes", "Personal"],
  "ritualix-habits-and-streaks": ["Habits", "Streaks", "Focus", "Routine"],
  "glowfeel-stress-ease": ["Breathing", "Stress", "Calm", "Focus"],
  "tinnitus-relief-sound-masking": ["Tinnitus", "Sound masking", "Offline", "No login"],
  "fast-rhythm-fasting-and-sleep": ["Fasting", "Sleep", "Rhythm", "Health"],
  "magnifier-reader-big-text": ["Magnifier", "Reading", "Big text", "Access"],
  "colorpop-color-block-tap-game": ["Puzzle", "Casual", "Color", "Relax"],
  "blockfit-block-puzzle": ["Blocks", "Puzzle", "Casual", "Relax"]
};

const directoryDescriptions = new Map(featuredApps);
directoryDescriptions.set("thumbtype-typing-speed-test", "Private, offline iPhone typing practice with timed WPM tests, accuracy tracking, daily challenges, and multilingual lessons.");
directoryDescriptions.set("tilefit-tile-layout-planner", "Plan floor, wall, backsplash, and countertop tile layouts with six patterns, box and cost estimates, grouped cuts, and PDF export.");

function detailHref(app) {
  return detailRouteOverrides[app.slug] || `/apps/${app.slug}/`;
}

function cardDescription(app) {
  return directoryDescriptions.get(app.slug) || excerpt(app.description, 135);
}

function tagList(app) {
  const tags = appTags[app.slug] || [app.genre, "iPhone", "Private", "Utility"];
  return `<div class="store-app-tags">${tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function appCard(app) {
  const details = detailHref(app);
  return `<article class="store-app-card" data-genre="${escapeHtml(app.genre)}">
          <a class="store-app-card-link" href="${escapeHtml(details)}" aria-label="View ${escapeHtml(app.name)} details">
            <div class="store-app-top">
              <img class="store-app-artwork" src="${escapeHtml(app.artworkUrl512)}" alt="${escapeHtml(app.name)} app icon" loading="lazy">
              <span class="store-app-genre">${escapeHtml(app.genre)}</span>
            </div>
            <h3>${escapeHtml(app.name)}</h3>
            <p>${escapeHtml(cardDescription(app))}</p>
            ${tagList(app)}
          </a>
          <div class="store-app-actions">
            <a class="store-detail-button" href="${escapeHtml(details)}">Details</a>
            <a class="store-download-button" href="${escapeHtml(app.url)}" rel="noopener noreferrer" aria-label="Download ${escapeHtml(app.name)} on the App Store">App Store</a>
          </div>
        </article>`;
}

function appLibrarySection({ withIntro = true, featuredOnly = false } = {}) {
  const visibleApps = featuredOnly ? apps.slice(0, 8) : apps;
  return `${withIntro ? `    <section class="section all-apps-section" id="all-apps">
      <div class="section-heading compact app-library-heading">
        <div>
          <p class="eyebrow">Apps</p>
          <h2>Featured apps by JiaBao Dai.</h2>
          <p>A quick look at selected App Store listings. Open the full directory for all ${apps.length} apps.</p>
        </div>
        <a class="button secondary" href="/apps/">More apps</a>
      </div>
      <div class="app-library-grid" aria-label="All apps by JiaBao Dai">
${visibleApps.map(appCard).join("\n")}
      </div>
      <div class="more-apps-row"><a class="button" href="/apps/">View all ${apps.length} apps</a></div>
    </section>` : `    <section class="app-library-grid apps-page-library" aria-label="All apps by JiaBao Dai">
${visibleApps.map(appCard).join("\n")}
    </section>`}`;
}

function appCardsFor(slugs) {
  return slugs
    .map((slug) => appBySlug.get(slug))
    .filter(Boolean)
    .map(appCard)
    .join("\n");
}

function featuredAppsSection() {
  const cards = featuredApps
    .map(([slug]) => appBySlug.get(slug))
    .filter(Boolean)
    .map(appCard)
    .join("\n");
  return `    <section class="section app-directory-section">
      <div class="section-heading compact app-library-heading">
        <div>
          <p class="eyebrow">Featured iPhone Apps</p>
          <h2>Featured iPhone Apps</h2>
          <p>Start with the most useful offline-first tools for makers, paperwork, business records, and focused practice.</p>
        </div>
      </div>
      <div class="app-library-grid featured-app-grid" aria-label="Featured iPhone apps by JiaBao Dai">
${cards}
      </div>
    </section>`;
}

function categoryNavSection() {
  return `    <section class="section app-category-nav-section" aria-labelledby="browse-apps-by-category">
      <div class="section-heading compact">
        <p class="eyebrow">Browse Apps by Category</p>
        <h2 id="browse-apps-by-category">Browse Apps by Category</h2>
      </div>
      <nav class="app-category-nav" aria-label="App categories">
${categorySections.map((section) => `        <a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`).join("\n")}
      </nav>
    </section>`;
}

function relatedToolCard(tool) {
  return `<article class="store-app-card directory-tool-card">
          <a class="store-app-card-link" href="${escapeHtml(tool.href)}" aria-label="Open ${escapeHtml(tool.name)} calculator">
            <div class="store-app-top">
              <span class="store-app-icon">${escapeHtml(initials(tool.name))}</span>
              <span class="store-app-genre">${escapeHtml(tool.label)}</span>
            </div>
            <h3>${escapeHtml(tool.name)}</h3>
            <p>${escapeHtml(tool.description)}</p>
            <div class="store-app-tags">${tool.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          </a>
          <div class="store-app-actions single">
            <a class="store-detail-button" href="${escapeHtml(tool.href)}">Open calculator</a>
          </div>
        </article>`;
}

function categorySection(section) {
  return `    <section class="section app-directory-section" aria-labelledby="${escapeHtml(section.id)}">
      <div class="section-heading compact">
        <p class="eyebrow">Category</p>
        <h2 id="${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.description)}</p>
      </div>
      <div class="app-library-grid category-app-grid" aria-label="${escapeHtml(section.title)}">
${appCardsFor(section.slugs)}
${(section.relatedTools || []).map(relatedToolCard).join("\n")}
      </div>
    </section>`;
}

const appDirectoryFaq = [
  ["What kind of iPhone apps does JiaBao Dai build?", "JiaBao Dai builds practical iPhone utilities for makers, small business work, documents, home organization, creative tasks, personal routines, and casual games."],
  ["Are these apps privacy-first?", "Many apps are designed around private, local workflows so common tasks can be completed without sending every project, receipt, note, or document through a cloud dashboard."],
  ["Do these apps require an account?", "Most apps are built to be useful without account setup. Some optional system sharing or export features may use standard iOS workflows."],
  ["Which app is best for woodworking?", "CutList is the woodworking app in the collection. It helps plan plywood cut lists, preview sheet layouts, save local projects, and export cut plans."],
  ["Which app is best for tile layout planning?", "TileFit plans floor, wall, backsplash, and countertop layouts with six patterns, quantities, box and cost estimates, grouped cuts, installation order, and PDF export."],
  ["Which app is best for receipt scanning?", "SnapReceipt is built for receipt capture, expense records, mileage logs, reimbursements, and tax-related organization."],
  ["Which app is best for invoices?", "Invoice Maker is the app for creating invoices, estimates, and PDF documents for freelance, contractor, and small business work."],
  ["Can I use these apps offline?", "Many apps are designed for offline-first use cases, especially local planning, scanning, records, labels, and personal utilities. Check each detail page for the exact workflow."],
  ["Where can I download the apps?", "Each app card links to a local details page and to its App Store listing. Use the App Store button on any card to open the official Apple download page."]
];

function appsIndexJsonLd() {
  const itemList = apps.map((app, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: app.name,
    url: `https://woodcuttool.com${detailHref(app)}`
  }));
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://woodcuttool.com/apps/#directory",
        name: "Privacy-First iPhone Apps for Work, Makers, and Everyday Tools",
        url: "https://woodcuttool.com/apps/",
        description: "A directory of privacy-first iPhone apps by JiaBao Dai for makers, small businesses, documents, home utilities, creative work, personal routines, and casual games.",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: itemList
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://woodcuttool.com/apps/#faq",
        mainEntity: appDirectoryFaq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://woodcuttool.com/apps/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://woodcuttool.com/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Apps",
            item: "https://woodcuttool.com/apps/"
          }
        ]
      }
    ]
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function offlineFirstSection() {
  return `    <section class="section app-offline-section">
      <div class="app-offline-panel">
        <p class="eyebrow">Offline-first tools</p>
        <h2>Why these apps are built offline-first</h2>
        <p>Many WoodCutTool apps are designed around a simple principle: useful tools should be fast, private, and available when you need them. Instead of forcing accounts, dashboards, or cloud upload, these apps focus on local workflows for iPhone users who want to get a job done quickly.</p>
        <p>From plywood cut lists and quilt planning to receipts, invoices, labels, PDF scanning, and music practice, the goal is the same: open the app, finish the task, and keep control of your data.</p>
      </div>
    </section>`;
}

function faqSection() {
  return `    <section class="section app-directory-faq-section">
      <div class="app-directory-faq-inner">
        <p class="eyebrow">FAQ</p>
        <h2 id="faq">FAQ</h2>
        <section class="faq-list" aria-label="iPhone app directory FAQ">
${appDirectoryFaq.map(([question, answer]) => `          <h3>${escapeHtml(question)}</h3>
          <p>${escapeHtml(answer)}</p>`).join("\n")}
        </section>
      </div>
    </section>`;
}

function appSupportSection() {
  return `    <section class="section" aria-labelledby="app-support-directory">
      <div class="section-heading compact">
        <p class="eyebrow">Support &amp; privacy</p>
        <h2 id="app-support-directory">Find app policies and support.</h2>
        <p>Open the exact privacy policy or support page for an app without searching through a store listing.</p>
      </div>
      <div class="grid tools">
${appSupportDirectory.map(([name, privacy, support]) => `        <article class="card"><h3>${escapeHtml(name)}</h3><p><a href="${escapeHtml(privacy)}">Privacy policy</a><br><a href="${escapeHtml(support)}">Support</a></p></article>`).join("\n")}
      </div>
    </section>`;
}

function appsIndexPage() {
  return `<!doctype html>
<html lang="en">
${head({
    title: "iPhone Apps for Makers, Work & Everyday Tools | WoodCutTool",
    description: "Privacy-first iPhone apps including TileFit, JobPhotoLog, CutList, QuiltFit, SnapReceipt, and PDF Scan. Offline tools for makers, field work, and small businesses.",
    canonical: "https://woodcuttool.com/apps/",
    jsonLd: appsIndexJsonLd()
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Apps")}
  <main id="main">
    <section class="page-hero">
      <p class="breadcrumb"><a href="/">Home</a> / Apps</p>
      <p class="eyebrow">App directory</p>
      <h1>Privacy-First iPhone Apps for Work, Makers, and Everyday Tools</h1>
      <p class="lead">Explore a growing collection of privacy-first iPhone apps built by JiaBao Dai. These tools focus on practical workflows: tile layout planning, jobsite photo reports, plywood cut lists, quilt planning, receipt scanning, invoices, PDF scanning, music practice, tinnitus sound masking, labels, inventory, and everyday productivity. Many apps are designed to work without accounts, cloud upload, or complicated setup.</p>
      <p class="lead">Deciding whether an app is worth it? Browse our <a href="/apps/compare/">app comparisons</a> to see each one side by side with the manual method or a common alternative.</p>
    </section>
${featuredAppsSection()}
${categoryNavSection()}
${categorySections.map(categorySection).join("\n")}
${offlineFirstSection()}
${appSupportSection()}
${faqSection()}
  </main>
  ${footer()}
</body>
</html>
`;
}

function detailVisual(app, index) {
  const screenshots = (app.screenshotUrls || []).slice(0, 3);
  if (screenshots.length) {
    return `<div class="app-screenshot-strip">${screenshots.map((url) => `<img src="${escapeHtml(url)}" alt="${escapeHtml(app.name)} screenshot" loading="lazy">`).join("")}</div>`;
  }

  const tone = (index % 8) + 1;
  return `<div class="app-detail-mockup tone-${tone}" aria-label="${escapeHtml(app.name)} visual preview">
            <div class="mock-phone">
              <div class="mock-screen-top"><span></span><span></span><span></span></div>
              <div class="mock-icon-row"><img src="${escapeHtml(app.artworkUrl512)}" alt="${escapeHtml(app.name)} app icon" loading="lazy"><strong>${escapeHtml(app.name.split(":")[0])}</strong></div>
              <div class="mock-content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div>
              <div class="mock-bottom-bar"><span></span><span></span></div>
            </div>
            <div class="mock-notes">
              <span>${escapeHtml(app.genre)}</span>
              <strong>${escapeHtml(excerpt(app.description, 120))}</strong>
            </div>
          </div>`;
}

function descriptionBlocks(description, { stripStandaloneUrls = false } = {}) {
  const lines = String(description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];

  for (const line of lines) {
    if (/^(privacy policy|terms of use|support|questions or feedback)/i.test(line)) {
      continue;
    }
    if (stripStandaloneUrls && /^https?:\/\/\S+$/.test(line)) {
      continue;
    }
    if (/^[-*•◆]/.test(line)) {
      blocks.push(`<li>${escapeHtml(line.replace(/^[-*•◆]\s*/, ""))}</li>`);
      continue;
    }
    blocks.push(`<p>${escapeHtml(line)}</p>`);
  }

  const html = [];
  let list = [];

  for (const block of blocks) {
    if (block.startsWith("<li>")) {
      list.push(block);
    } else {
      if (list.length) {
        html.push(`<ul>${list.join("")}</ul>`);
        list = [];
      }
      html.push(block);
    }
  }

  if (list.length) {
    html.push(`<ul>${list.join("")}</ul>`);
  }

  return html.join("\n        ");
}

function formatReviewDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function reviewStars(rating) {
  const count = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function appReviewsSection(app) {
  const reviewData = appStoreReviews[app.slug];
  const reviews = (reviewData?.reviews || []).filter((review) => Number(review.rating) === 5).slice(0, 6);
  if (!reviews.length) return "";

  const average = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length;
  const cards = reviews.map((review) => `
        <article class="app-review-card">
          <div class="app-review-head">
            <div>
              <strong>${escapeHtml(review.title)}</strong>
              <span>${escapeHtml(review.author)} · ${escapeHtml(formatReviewDate(review.updated))}</span>
            </div>
            <span class="review-stars" aria-label="${escapeHtml(String(review.rating))} out of 5 stars">${escapeHtml(reviewStars(review.rating))}</span>
          </div>
          <p>${escapeHtml(review.content)}</p>
          ${review.version ? `<small>App version ${escapeHtml(review.version)}</small>` : ""}
        </article>`).join("");

  return `    <section class="app-detail-reviews" aria-label="${escapeHtml(app.name)} App Store customer reviews">
      <div class="app-review-summary">
        <p class="eyebrow">Real App Store reviews</p>
        <h2>What users say</h2>
        <p>${escapeHtml(reviews.length)} public US App Store review${reviews.length === 1 ? "" : "s"} shown from Apple customer reviews. Average shown rating: ${escapeHtml(average.toFixed(1))}/5.</p>
      </div>
      <div class="app-review-grid">
${cards}
      </div>
      <p class="app-review-source">Source: <a href="${escapeHtml(reviewData.sourceUrl)}" rel="nofollow noopener">Apple App Store public reviews</a>, fetched ${escapeHtml(reviewData.fetchedAt || appStoreReviews._meta?.fetchedAt || "")}. Reviews are shown as published by App Store users.</p>
    </section>`;
}

function appComparisonsSection(app) {
  const comparisons = compareData[app.slug]?.articles || [];
  if (!comparisons.length) return "";

  const cards = comparisons.map((comparison) => `<a href="/apps/compare/${escapeHtml(comparison.slug)}/">
          <span>Decision guide</span>
          <strong>${escapeHtml(comparison.title)}</strong>
          <em>${escapeHtml(comparison.desc)}</em>
        </a>`).join("\n        ");

  return `    <!-- app-comparisons:start -->
    <section class="app-detail-comparisons section" aria-label="${escapeHtml(app.name)} comparisons">
      <div class="section-heading compact">
        <p class="eyebrow">Compare before choosing</p>
        <h2>${escapeHtml(app.name)} versus common alternatives</h2>
        <p>Use these decision guides to compare the documented app workflow with manual methods and familiar alternatives.</p>
      </div>
      <div class="related-grid">
        ${cards}
      </div>
    </section>
    <!-- app-comparisons:end -->`;
}

function appOffer(app) {
  const raw = String(app.formattedPrice || "").trim();
  const price = /^free$/i.test(raw) ? "0" : raw.match(/[\d.]+/)?.[0];
  return {
    "@type": "Offer",
    url: app.url,
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock"
  };
}

function appDetailJsonLd(app, canonical) {
  const release = app.currentVersionReleaseDate || app.releaseDate || "";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${canonical}#software`,
        name: app.name,
        url: canonical,
        sameAs: app.url,
        description: excerpt(app.description, 220),
        image: app.artworkUrl512,
        applicationCategory: app.genre,
        operatingSystem: app.minimumOsVersion ? `iOS ${app.minimumOsVersion}+` : "iOS",
        softwareVersion: app.version,
        datePublished: app.releaseDate ? app.releaseDate.slice(0, 10) : undefined,
        dateModified: release ? release.slice(0, 10) : undefined,
        contentRating: app.trackContentRating,
        author: { "@type": "Person", name: app.sellerName || "JiaBao Dai" },
        publisher: {
          "@type": "Organization",
          name: "WoodCutTool",
          url: "https://woodcuttool.com/",
          logo: { "@type": "ImageObject", url: "https://woodcuttool.com/assets/icons/icon-512.png" }
        },
        offers: appOffer(app)
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://woodcuttool.com/" },
          { "@type": "ListItem", position: 2, name: "Apps", item: "https://woodcuttool.com/apps/" },
          { "@type": "ListItem", position: 3, name: app.name, item: canonical }
        ]
      }
    ]
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function appDetailPage(app, index) {
  const release = app.currentVersionReleaseDate || app.releaseDate || "";
  // For apps with a route override (e.g. cutlist/quiltfit have a canonical short URL),
  // point this duplicate App Store-slug page's canonical at the preferred URL so search
  // engines consolidate ranking signals instead of treating the two pages as duplicates.
  const canonical = `https://woodcuttool.com${detailHref(app)}`;
  const isAlias = detailHref(app) !== `/apps/${app.slug}/`;
  const legalLinks = legalLinksBySlug[app.slug];
  return `<!doctype html>
<html lang="en">
${head({
    title: seoTitle(app.name),
    description: excerpt(app.description, 155),
    canonical,
    jsonLd: appDetailJsonLd(app, canonical)
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Apps")}
  <main id="main" class="app-detail-page">
    <section class="app-detail-hero">
      <div class="app-detail-copy">
        <p class="breadcrumb"><a href="/">Home</a> / <a href="/apps/">Apps</a> / ${escapeHtml(app.name)}</p>
        <div class="app-title-row">
          <img class="app-detail-icon" src="${escapeHtml(app.artworkUrl512)}" alt="${escapeHtml(app.name)} app icon">
          <div>
            <p class="eyebrow">${escapeHtml(app.genre)}</p>
            <h1>${escapeHtml(app.name)}</h1>
          </div>
        </div>
        <p class="lead">${escapeHtml(excerpt(app.description, 220))}</p>
        <div class="app-detail-actions">
          <a class="button" href="${escapeHtml(app.url)}" rel="noopener noreferrer">Download on App Store</a>
          <a class="button secondary" href="/apps/">Back to apps</a>
        </div>
      </div>
      ${detailVisual(app, index)}
    </section>
    <section class="app-detail-layout">
      <article class="app-description-panel">
        <p class="eyebrow">App Store description</p>
        <h2>What it does</h2>
        ${descriptionBlocks(app.description, { stripStandaloneUrls: Boolean(legalLinks) })}
      </article>
      <aside class="app-meta-panel">
        <h2>App details</h2>
        <dl>
          <div><dt>Category</dt><dd>${escapeHtml(app.genre)}</dd></div>
          <div><dt>Price</dt><dd>${escapeHtml(app.formattedPrice || "App Store")}</dd></div>
          <div><dt>Version</dt><dd>${escapeHtml(app.version || "Current")}</dd></div>
          <div><dt>Rating</dt><dd>${escapeHtml(app.trackContentRating || "App Store")}</dd></div>
          <div><dt>Minimum iOS</dt><dd>${escapeHtml(app.minimumOsVersion || "See App Store")}</dd></div>
          ${release ? `<div><dt>Updated</dt><dd>${escapeHtml(release.slice(0, 10))}</dd></div>` : ""}
        </dl>
        <a class="button" href="${escapeHtml(app.url)}" rel="noopener noreferrer">Open App Store</a>${legalLinks ? `
        <p><a href="${escapeHtml(legalLinks.privacy)}">Privacy Policy</a><br><a href="${escapeHtml(legalLinks.support)}">Support</a></p>` : ""}
      </aside>
    </section>
${appReviewsSection(app)}
${appComparisonsSection(app)}
  </main>
  ${footer()}
</body>
</html>
`;
}

function updateHomePage() {
  const path = join(root, "index.html");
  let html = readFileSync(path, "utf8");
  html = html.replaceAll("20260619-app-library", version);
  html = html.replace(/    <section class="section all-apps-section" id="all-apps">[\s\S]*?\n    <\/section>\n\n(?=    <section class="section" id="guides">)/, "");
  writeFileSync(path, html);
}

mkdirSync(join(root, "apps"), { recursive: true });
writeFileSync(join(root, "apps", "index.html"), appsIndexPage());

let generatedDetailPageCount = 0;

apps.forEach((app, index) => {
  const slugDir = join(root, "apps", app.slug);

  if (handWrittenOverrideSlugs.has(app.slug)) {
    rmSync(slugDir, { recursive: true, force: true });
    return;
  }

  const outputRoute = generatedOverrideSlugs.has(app.slug) ? detailHref(app) : `/apps/${app.slug}/`;
  const dir = join(root, outputRoute);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), appDetailPage(app, index));
  generatedDetailPageCount += 1;

  if (generatedOverrideSlugs.has(app.slug)) {
    rmSync(slugDir, { recursive: true, force: true });
  }
});

for (const slug of handWrittenOverrideSlugs) {
  const app = appBySlug.get(slug);
  if (!app) continue;
  const path = join(root, detailHref(app), "index.html");
  let html = readFileSync(path, "utf8");
  const section = appComparisonsSection(app);
  const markerPattern = /\s*<!-- app-comparisons:start -->[\s\S]*?<!-- app-comparisons:end -->/;
  html = markerPattern.test(html)
    ? html.replace(markerPattern, `\n${section}`)
    : html.replace(/\n\s*<\/main>/, `\n${section}\n  </main>`);
  writeFileSync(path, html);
}

updateHomePage();
console.log(`Generated ${generatedDetailPageCount} app detail pages.`);
