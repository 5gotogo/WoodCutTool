import { createHash } from "node:crypto";

export const SITEMAP_SIGNATURE_VERSION = 2;

// Sitemap lastmod should represent a meaningful page/SEO change, not a deploy that
// only changes JavaScript, CSS, shared chrome, or image loading hints. Otherwise a
// site-wide technical release tells crawlers that thousands of URLs are fresh.
export function sitemapSignificantContent(html) {
  return String(html)
    // These generated hints insert their own leading newline, including in
    // otherwise compact heads. Remove that wrapper without changing lastmod.
    .replace(/\s*<link rel="preload" data-site-bootstrap[^>]*>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<header\b[^>]*\bclass=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<div\b[^>]*\bdata-site-(?:header|footer)\b[^>]*><\/div>/gi, " ")
    .replace(/<link\b(?=[^>]*\brel=["'][^"']*(?:stylesheet|preload|preconnect|icon|manifest)[^"']*["'])[^>]*>/gi, " ")
    // New encodings of the same authored photo are delivery changes. Retain
    // the fallback img, including src and alt, as the editorial signature.
    .replace(/<picture\b[^>]*><source\b(?=[^>]*\bsrcset=["']\/assets\/images\/(?:woodworking|apps\/cutlist)\/)[^>]*>(<img\b[^>]*>)<\/picture>/gi, "$1")
    .replace(/<source\b(?=[^>]*\btype=["']image\/avif["'])(?=[^>]*\bsrcset=["']\/assets\/images\/templates\/)[^>]*>/gi, "")
    .replace(/\s(?:loading|fetchpriority|decoding)=["'][^"']*["']/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sitemapContentSignature(html) {
  return createHash("sha256").update(sitemapSignificantContent(html)).digest("hex");
}
