import { createHash } from "node:crypto";

export const SITEMAP_SIGNATURE_VERSION = 2;

// Sitemap lastmod should represent a meaningful page/SEO change, not a deploy that
// only changes JavaScript, CSS, shared chrome, or image loading hints. Otherwise a
// site-wide technical release tells crawlers that thousands of URLs are fresh.
export function sitemapSignificantContent(html) {
  return String(html)
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<header\b[^>]*\bclass=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<div\b[^>]*\bdata-site-(?:header|footer)\b[^>]*><\/div>/gi, " ")
    .replace(/<link\b(?=[^>]*\brel=["'][^"']*(?:stylesheet|preload|icon|manifest)[^"']*["'])[^>]*>/gi, " ")
    .replace(/\s(?:loading|fetchpriority|decoding)=["'][^"']*["']/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sitemapContentSignature(html) {
  return createHash("sha256").update(sitemapSignificantContent(html)).digest("hex");
}
