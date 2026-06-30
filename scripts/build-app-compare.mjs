// Generates two comparison articles per App Store app under /apps/compare/,
// plus a hub index. Static HTML for Cloudflare Pages, matching the site's
// existing /compare/ article design. Data lives in app-compare-data.mjs.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags } from "./seo-meta.mjs";
import { compareData } from "./app-compare-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260623-seo-feed";
const SITE = "https://woodcuttool.com";

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
  <link rel="stylesheet" href="/assets/styles.css?v=${version}">`;
}

const header = `  <header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links"><a href="/tools/">Tools</a><a href="/learn/">Learn</a><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a><a href="/stringer/">Stringer</a><a href="/apps/">Apps</a></div><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;

const footer = `  <footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/">Apps</a><a href="/apps/compare/">App comparisons</a><a href="/blog/">Blogs</a><a href="/apps/cutlist/">CutList</a><a href="mailto:727268425@qq.com">Contact</a></nav></div>      <div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Results are estimates &mdash; always verify measurements, material quantities, and costs yourself before buying or cutting.</p><p>Our content is not professional, structural, engineering, or safety advice. For stairs, structural work, electrical, plumbing, or anything affecting safety, consult a qualified professional and follow your local building codes and permit requirements. You are responsible for your own measurements, tools, and safety. WoodCutTool is not liable for any loss, injury, or damage arising from use of this site.</p><p>App names, logos, and trademarks (including Apple and App Store) belong to their respective owners and do not imply endorsement. External links and cited sources are provided for reference only.</p></div>
<div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;

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
    dateModified: "2026-06-28",
    inLanguage: "en",
    author: { "@type": "Organization", name: "WoodCutTool", url: `${SITE}/` },
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

function articlePage(app, article, allApps) {
  const slug = article.slug;
  const otherArticle = app.articles.find((a) => a.slug !== slug);
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
        <p>See also <a href="/apps/compare/${otherArticle.slug}/">${esc(otherArticle.title)}</a>, or browse all <a href="/apps/compare/">app comparisons</a>.</p>
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
