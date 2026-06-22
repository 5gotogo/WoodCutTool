// Shared SEO meta helpers used by every page generator so Open Graph,
// Twitter Card, and BreadcrumbList output is identical site-wide and
// maintained in one place.
const SITE = "https://woodcuttool.com";
const SITE_NAME = "WoodCutTool";
const DEFAULT_OG_IMAGE = `${SITE}/assets/og/woodcuttool-og.png`;

function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Open Graph + Twitter Card tags.
 * @param {object} o
 * @param {string} o.title    - page title (without brand suffix is fine)
 * @param {string} o.description
 * @param {string} o.canonical - absolute URL
 * @param {string} [o.type]   - og:type, default "website" ("article" for blog/learn)
 * @param {string} [o.image]  - absolute image URL, default site OG image
 */
export function ogTags({ title, description, canonical, type = "website", image = DEFAULT_OG_IMAGE }) {
  return [
    `<meta property="og:type" content="${esc(type)}">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`
  ].join("\n  ");
}

/**
 * BreadcrumbList JSON-LD.
 * @param {Array<[string,string]>} trail - [ [name, urlPath], ... ]; last item
 *        is the current page. urlPath is appended to SITE.
 */
export function breadcrumbJsonLd(trail) {
  const itemListElement = trail.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE}${path}`
  }));
  const graph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

export { SITE, SITE_NAME, DEFAULT_OG_IMAGE };
