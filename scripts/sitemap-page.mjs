// Shared sitemap admission and image rules, used by generation and validation.
export function htmlAttribute(tag, name) {
  const value = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return (value?.[1] ?? value?.[2] ?? value?.[3] ?? '')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'");
}

export function hasNoindex(html) {
  return (html.match(/<meta\b[^>]*>/gi) ?? []).some(tag => {
    const name = htmlAttribute(tag, 'name').toLowerCase();
    return ['robots', 'googlebot'].includes(name)
      && /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(htmlAttribute(tag, 'content'));
  });
}

export function canonicalUrl(html, pageUrl) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonical = tags.filter(tag => htmlAttribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  if (!canonical.length) return new URL(pageUrl);
  if (canonical.length !== 1) throw new Error(`Multiple canonical links: ${pageUrl}`);
  const href = htmlAttribute(canonical[0], 'href');
  if (!href) throw new Error(`Empty canonical link: ${pageUrl}`);
  return new URL(href, pageUrl);
}

export function sitemapRoute(html, route, siteUrl) {
  if (hasNoindex(html)) return null;
  const pageUrl = new URL(route, siteUrl);
  const canonical = canonicalUrl(html, pageUrl);
  // Aliases must not contribute their images or content hashes to the destination.
  // The canonical page is collected separately and must itself be indexable.
  return canonical.href === pageUrl.href ? route : null;
}

export function extractImages(html, pageUrl) {
  const images = new Set();
  const keep = tag => {
    const src = htmlAttribute(tag, 'src');
    if (!src) return;
    let url;
    try { url = new URL(src, pageUrl); } catch { return; }
    if (!['https:', 'http:'].includes(url.protocol)) return;
    if (/\/assets\/og\/|favicon|apple-touch-icon|\.svg(?:[?#]|$)/i.test(url.pathname)) return;
    url.hash = '';
    images.add(url.href);
  };
  // Authored figures cover blog photos, template previews, project illustrations,
  // comparisons and tool guides. Use the fallback img, not every responsive variant.
  for (const figure of html.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi)) {
    for (const img of figure[1].matchAll(/<img\b[^>]*>/gi)) keep(img[0]);
  }
  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    if (htmlAttribute(img[0], 'class').split(/\s+/).includes('app-detail-icon')) keep(img[0]);
  }
  for (const strip of html.matchAll(/<div\b[^>]*\bclass\s*=\s*["'][^"']*\bapp-screenshot-strip\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)) {
    for (const img of strip[1].matchAll(/<img\b[^>]*>/gi)) keep(img[0]);
  }
  return [...images];
}
