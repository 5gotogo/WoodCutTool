import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260619-app-details";
const apps = JSON.parse(readFileSync(join(root, "data", "app-store-apps.json"), "utf8"));

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
  text = text.trim();
  return text.length < clean.length ? `${text.replace(/[,\s.]+$/, "")}...` : text;
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

function head({ title, description, canonical }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <link rel="stylesheet" href="/assets/styles.css?v=${version}">
</head>`;
}

function header(active = "Apps") {
  const links = [
    ["CutList", "/apps/cutlist/"],
    ["QuiltFit", "/apps/quiltfit/"],
    ["Apps", "/apps/"],
    ["Blogs", "/blog/"],
    ["Tile", "/tile-calculator/"],
    ["Stringer", "/stringer/"]
  ];

  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links">${links.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="${href}">${label}</a>`).join("")}</div><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a><a href="mailto:727268425@qq.com">Contact</a></nav></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

function appCard(app, index) {
  return `<article class="store-app-card" data-genre="${escapeHtml(app.genre)}">
          <a class="store-app-card-link" href="/apps/${escapeHtml(app.slug)}/" aria-label="View ${escapeHtml(app.name)} details">
            <div class="store-app-top">
              <img class="store-app-artwork" src="${escapeHtml(app.artworkUrl512)}" alt="" loading="lazy">
              <span class="store-app-genre">${escapeHtml(app.genre)}</span>
            </div>
            <h3>${escapeHtml(app.name)}</h3>
            <p>${escapeHtml(excerpt(app.description))}</p>
          </a>
          <div class="store-app-actions">
            <a class="store-detail-button" href="/apps/${escapeHtml(app.slug)}/">Details</a>
            <a class="store-download-button" href="${escapeHtml(app.url)}" rel="nofollow">App Store</a>
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

function appsIndexPage() {
  return `<!doctype html>
<html lang="en">
${head({
    title: "Apps | WoodCutTool",
    description: "All iPhone apps by JiaBao Dai, with App Store descriptions, detail pages, images, and download links.",
    canonical: "https://woodcuttool.com/apps/"
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Apps")}
  <main id="main">
    <section class="page-hero">
      <p class="breadcrumb"><a href="/">Home</a> / Apps</p>
      <p class="eyebrow">App directory</p>
      <h1>JiaBao Dai apps</h1>
      <p class="lead">A complete App Store directory for ${apps.length} iPhone apps by JiaBao Dai. Click any app to view its description, images, and download link.</p>
    </section>
${appLibrarySection({ withIntro: false })}
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
              <div class="mock-icon-row"><img src="${escapeHtml(app.artworkUrl512)}" alt="" loading="lazy"><strong>${escapeHtml(app.name.split(":")[0])}</strong></div>
              <div class="mock-content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div>
              <div class="mock-bottom-bar"><span></span><span></span></div>
            </div>
            <div class="mock-notes">
              <span>${escapeHtml(app.genre)}</span>
              <strong>${escapeHtml(excerpt(app.description, 120))}</strong>
            </div>
          </div>`;
}

function descriptionBlocks(description) {
  const lines = String(description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];

  for (const line of lines) {
    if (/^(privacy policy|terms of use|support|questions or feedback)/i.test(line)) {
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

function appDetailPage(app, index) {
  const release = app.currentVersionReleaseDate || app.releaseDate || "";
  return `<!doctype html>
<html lang="en">
${head({
    title: `${app.name} | WoodCutTool Apps`,
    description: excerpt(app.description, 155),
    canonical: `https://woodcuttool.com/apps/${app.slug}/`
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
          <a class="button" href="${escapeHtml(app.url)}" rel="nofollow">Download on App Store</a>
          <a class="button secondary" href="/apps/">Back to apps</a>
        </div>
      </div>
      ${detailVisual(app, index)}
    </section>
    <section class="app-detail-layout">
      <article class="app-description-panel">
        <p class="eyebrow">App Store description</p>
        <h2>What it does</h2>
        ${descriptionBlocks(app.description)}
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
        <a class="button" href="${escapeHtml(app.url)}" rel="nofollow">Open App Store</a>
      </aside>
    </section>
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
  html = html.replace(/    <section class="section all-apps-section" id="all-apps">[\s\S]*?    <section class="section" id="guides">/, `${appLibrarySection({ featuredOnly: true })}\n\n    <section class="section" id="guides">`);
  writeFileSync(path, html);
}

mkdirSync(join(root, "apps"), { recursive: true });
writeFileSync(join(root, "apps", "index.html"), appsIndexPage());

apps.forEach((app, index) => {
  const dir = join(root, "apps", app.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), appDetailPage(app, index));
});

updateHomePage();
console.log(`Generated ${apps.length} app detail pages.`);
