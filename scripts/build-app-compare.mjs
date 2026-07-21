// Generates two comparison articles per App Store app under /apps/compare/,
// plus a hub index. Static HTML for Cloudflare Pages, matching the site's
// existing /compare/ article design. Data lives in app-compare-data.mjs.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags } from "./seo-meta.mjs";
import { compareData } from "./app-compare-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260701-nav";
const SITE = "https://woodcuttool.com";
const CONTENT_UPDATED = "2026-07-21";

function esc(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function head({ title, description, canonical }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${esc(canonical)}">
  ${ogTags({ title, description, canonical, type: "article" })}
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/app.js"></script>`;
}

const header = `  <header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links"><a href="/cutlist/">CutList</a><a href="/quiltfit/">QuiltFit</a><a href="/tile-calculator/">Tile</a><a href="/stringer/">Stringer</a><a href="/blog/">Blogs</a><a class="active" href="/apps/">Apps</a><a href="/tools/">Tools</a><a href="/learn/">Learn</a></div><label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;

const footer = `  <footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/">Apps</a><a href="/apps/compare/">App comparisons</a><a href="/blog/">Blogs</a><a href="/cutlist/">CutList</a><a href="mailto:727268425@qq.com">Contact</a></nav></div>
<div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/disclaimer/">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;

function breadcrumb(title, slug) {
  const trail = [
    ["Home", "/"],
    ["Apps", "/apps/"],
    ["Compare", "/apps/compare/"],
    [title, `/apps/compare/${slug}/`]
  ];
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${path}`
    }))
  };
  return `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;
}

function faqSchema(article) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
}

function blogPostingSchema(article, slug) {
  const url = `${SITE}/apps/compare/${slug}/`;
  const json = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.desc,
    url,
    mainEntityOfPage: url,
    image: `${SITE}/assets/og/woodcuttool-og.png`,
    datePublished: "2026-06-28",
    dateModified: CONTENT_UPDATED,
    inLanguage: "en",
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${SITE}/about/` },
    publisher: {
      "@type": "Organization",
      name: "WoodCutTool",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/assets/icons/icon-512.png` }
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;
}

// Pick up to N related apps from the same category (excluding self) for internal links.
function relatedApps(app, allApps, n = 3) {
  return allApps
    .filter((a) => a.slug !== app.slug && a.category === app.category)
    .slice(0, n);
}

function siblingComparisons(app, article, count = 3) {
  const currentIndex = app.articles.findIndex((candidate) => candidate.slug === article.slug);
  if (currentIndex === -1 || app.articles.length < 2) return [];

  const related = [];
  const seen = new Set([article.slug]);
  for (let distance = 1; related.length < Math.min(count, app.articles.length - 1); distance += 1) {
    for (const direction of [1, -1]) {
      const candidate = app.articles[(currentIndex + direction * distance + app.articles.length) % app.articles.length];
      if (!candidate || seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      related.push(candidate);
      if (related.length >= count) break;
    }
  }

  return related;
}

function factorAnalysis(article, app) {
  return article.rows.map(([factor, appValue, otherValue]) => `<article class="card">
          <span class="eyebrow">${esc(factor)}</span>
          <h3>${esc(app.appName)} vs ${esc(article.vs)}</h3>
          <p><strong>${esc(app.appName)}:</strong> ${esc(appValue)}. <strong>${esc(article.vs)}:</strong> ${esc(otherValue)}.</p>
          <p>Use this factor as a decision check when ${esc(factor.toLowerCase())} changes how often you repeat the task, review the result, or correct a mistake.</p>
        </article>`).join("\n        ");
}

function decisionChecklist(article, app) {
  return article.rows.slice(0, 4).map(([factor, appValue, otherValue]) =>
    `<li>Choose ${esc(app.appName)} when ${esc(factor.toLowerCase())} needs ${esc(appValue.toLowerCase())}; keep ${esc(article.vs)} when ${esc(otherValue.toLowerCase())} is sufficient.</li>`
  ).join("\n          ");
}

function articlePage(app, article, allApps) {
  const slug = article.slug;
  const siblingArticles = siblingComparisons(app, article);
  const related = relatedApps(app, allApps);
  const rowsHtml = article.rows
    .map(([f, a, o]) => `<tr><td><strong>${esc(f)}</strong></td><td>${esc(a)}</td><td>${esc(o)}</td></tr>`)
    .join("\n              ");
  const faqHtml = article.faqs
    .map(([q, a]) => `<h3>${esc(q)}</h3>\n        <p>${esc(a)}</p>`)
    .join("\n        ");
  const relatedAppLinks = related
    .map((a) => `<a href="${a.detail}"><span>App</span><strong>${esc(a.appName)}</strong></a>`)
    .join("\n          ");

  return `<!doctype html>
<html lang="en">
${head({ title: article.title, description: article.desc, canonical: `${SITE}/apps/compare/${slug}/` })}
  ${faqSchema(article)}
  <!-- article-schema:start -->
  ${blogPostingSchema(article, slug)}
  <!-- article-schema:end -->
</head>
<body>
  <!-- breadcrumb:start -->
  ${breadcrumb(article.title, slug)}
  <!-- breadcrumb:end -->
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/apps/">Apps</a> / <a href="/apps/compare/">Compare</a> / ${esc(app.appName)} vs ${esc(article.vs)}</p>
      <p class="eyebrow">${esc(app.appName)} comparison</p>
      <h1>${esc(article.title)}</h1>
      <p class="lead">${esc(article.intro)}</p>
      <p class="article-byline">By <a href="/about/">WoodCutTool Editorial Team</a> · Based on the documented app workflow and the practical tradeoffs of the alternative.</p>

      <section>
        <h2>Comparison table</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Factor</th><th>${esc(app.appName)}</th><th>${esc(article.vs)}</th></tr></thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>How each factor changes the decision</h2>
        <div class="grid tools">
        ${factorAnalysis(article, app)}
        </div>
      </section>

      <section class="article-checklist">
        <h2>Decision checklist</h2>
        <ul>
          ${decisionChecklist(article, app)}
        </ul>
      </section>

      <section>
        <h2>Test the workflow before committing</h2>
        <ol>
          <li>Pick one real task that you would normally complete with ${esc(article.vs)}.</li>
          <li>Compare the same task in ${esc(app.appName)}, paying special attention to ${esc(article.rows[0][0].toLowerCase())} and ${esc(article.rows[1][0].toLowerCase())}.</li>
          <li>Choose the option that leaves a result you can review, correct, and repeat with fewer manual steps.</li>
        </ol>
      </section>

      <section>
        <h2>What this comparison covers</h2>
        <p>This guide compares ${esc(app.appName)} with ${esc(article.vs)} using the documented product workflow and five day-to-day decision factors. It does not assume that one option is automatically best for every person, device, budget, or record-keeping requirement. Start with the factor that creates the most repeated work in your own routine, then verify the result using a real task rather than a demo.</p>
        <p>After the first test, review what had to be entered manually, what could be corrected, what remained available for later reference, and whether the output was easy to reuse. Those checks matter more than feature count because they show which option will still be practical after the novelty of setup has passed.</p>
      </section>

      <section>
        <h2>Where ${esc(app.appName)} wins</h2>
        <p>${esc(article.whyApp)}</p>
      </section>

      <section>
        <h2>When ${esc(article.vs)} still makes sense</h2>
        <p>${esc(article.whenOther)}</p>
      </section>

      <!-- conversion-blocks:start -->
      <section class="section app-cta-band">
        <h2>Try ${esc(app.appName)}</h2>
        <p>See what ${esc(app.appName)} can do on the app detail page, with the full feature list and App Store link.</p>
        <p><a class="button" href="${app.detail}">Open the ${esc(app.appName)} app page</a></p>
      </section>

      <section>
        <h2>Related apps</h2>
        <div class="related-grid">
          <a href="${app.detail}"><span>App</span><strong>${esc(app.appName)}</strong></a>
          ${relatedAppLinks}
        </div>
      </section>
      <!-- conversion-blocks:end -->

      <section class="faq-list" aria-label="${esc(app.appName)} vs ${esc(article.vs)} FAQ">
        <h2>FAQ</h2>
        ${faqHtml}
      </section>

      <section>
        <h2>More comparisons</h2>
        <div class="related-grid">
          ${siblingArticles.map((candidate) => `<a href="/apps/compare/${candidate.slug}/"><span>${esc(app.appName)}</span><strong>${esc(candidate.title)}</strong></a>`).join("\n          ")}
          <a href="/apps/compare/"><span>Directory</span><strong>Browse all app comparisons</strong></a>
        </div>
      </section>
    </article>
  </main>
${footer}
</body>
</html>
`;
}

function hubPage(apps) {
  const byCategory = {};
  for (const app of apps) {
    (byCategory[app.category] ||= []).push(app);
  }
  const sections = Object.entries(byCategory)
    .map(([cat, list]) => {
      const cards = list
        .flatMap((app) =>
          app.articles.map(
            (art) =>
              `<a href="/apps/compare/${art.slug}/"><span>${esc(app.appName)}</span><strong>vs ${esc(art.vs)}</strong></a>`
          )
        )
        .join("\n          ");
      return `      <section>
        <h2>${esc(cat)} apps</h2>
        <div class="related-grid">
          ${cards}
        </div>
      </section>`;
    })
    .join("\n\n");

  const title = "App Comparisons: WoodCutTool Apps vs the Alternatives";
  const desc =
    "Compare WoodCutTool's iPhone apps against manual methods and common alternatives. Honest side-by-side comparisons for CutList, Stringer, QuiltFit, and more.";

  return `<!doctype html>
<html lang="en">
${head({ title, description: desc, canonical: `${SITE}/apps/compare/` })}
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"CollectionPage","name":"App Comparisons","description":${JSON.stringify(desc)},"url":"${SITE}/apps/compare/"}
  </script>
</head>
<body>
  <!-- breadcrumb:start -->
  <script type="application/ld+json">
${JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        ["Home", "/"],
        ["Apps", "/apps/"],
        ["Compare", "/apps/compare/"]
      ].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE}${path}` }))
    },
    null,
    2
  )}
  </script>
  <!-- breadcrumb:end -->
  <a class="skip-link" href="#main">Skip to content</a>
${header}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/apps/">Apps</a> / Compare</p>
      <p class="eyebrow">App comparisons</p>
      <h1>App Comparisons</h1>
      <p class="lead">Should you use an app, or stick with the way you do it now? Each guide below puts one of our iPhone apps side by side with a manual method or a common alternative, with a clear table, honest trade-offs, and a recommendation. Pick the comparison closest to your question.</p>

${sections}

      <section>
        <h2>Looking for woodworking comparisons?</h2>
        <p>For material and tool comparisons like plywood vs MDF or track saw vs table saw, see the <a href="/compare/">woodworking comparisons</a> section.</p>
      </section>
    </article>
  </main>
${footer}
</body>
</html>
`;
}

// ---- generate ----
const apps = Object.entries(compareData).map(([slug, data]) => ({ slug, ...data }));

let pageCount = 0;
for (const app of apps) {
  for (const article of app.articles) {
    const dir = join(root, "apps", "compare", article.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), articlePage(app, article, apps));
    pageCount += 1;
  }
}

const hubDir = join(root, "apps", "compare");
mkdirSync(hubDir, { recursive: true });
writeFileSync(join(hubDir, "index.html"), hubPage(apps));

console.log(`Generated ${pageCount} app comparison pages + 1 hub across ${apps.length} apps.`);
