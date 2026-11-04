import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, extractImages, hasNoindex } from './sitemap-page.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://woodcuttool.com';
const read = file => readFileSync(resolve(root, file), 'utf8');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
const files = [];
function collect(dir = '') {
  for (const entry of readdirSync(resolve(root, dir), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'assets'].includes(entry.name)) continue;
    const file = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) collect(file);
    else if (entry.name === 'index.html') files.push(file);
  }
}
collect();
const pages = new Map(files.map(file => [file === 'index.html' ? '/' : `/${dirname(file)}/`, read(file)]));
const expected = new Set([...pages].filter(([route, html]) => !hasNoindex(html) && canonicalUrl(html, site + route).href === site + route).map(([route]) => site + route));
const index = read('sitemap.xml');
assert(index.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
const children = locations(index);
assert(children.length > 0 && children.length <= 50000);
assert.equal(new Set(children).size, children.length, 'Duplicate child sitemaps');
const childNames = children.map(value => {
  const url = new URL(value);
  assert.equal(url.origin, site);
  assert.match(url.pathname, /^\/sitemap-[a-z0-9-]+\.xml$/);
  return url.pathname.slice(1);
});
assert.deepEqual(childNames.toSorted(), readdirSync(root).filter(file => /^sitemap-[a-z0-9-]+\.xml$/.test(file)).toSorted(), 'Unreferenced child sitemap files');
assert(read('robots.txt').split(/\r?\n/).includes(`Sitemap: ${site}/sitemap.xml`), 'robots.txt must advertise the index');
const seen = new Set();
let imageCount = 0;
const state = JSON.parse(read('data/sitemap-lastmod.json'));
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const checkDate = date => {
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10), date);
  assert(date <= today, `Future lastmod: ${date}`);
};
for (const file of ['sitemap.xml', ...childNames]) {
  assert(statSync(resolve(root, file)).size <= 50 * 1024 * 1024, `${file} exceeds 50MB`);
  for (const match of read(file).matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) checkDate(match[1]);
}
for (const file of childNames) {
  const xml = read(file);
  assert(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  const rows = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  assert(rows.length > 0 && rows.length <= 50000, `${file}: URL count limit`);
  for (const [, row] of rows) {
    const [loc] = locations(row);
    assert(loc && expected.has(loc), `Noncanonical, missing or noindex page in ${file}: ${loc}`);
    assert(!seen.has(loc), `Duplicate URL: ${loc}`);
    seen.add(loc);
    const route = new URL(loc).pathname;
    const lastmod = row.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    assert.equal(lastmod, state[route]?.lastmod, `Lastmod state mismatch: ${route}`);
    const images = [...row.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(match => decode(match[1]));
    assert(images.length <= 1000, `Too many images: ${loc}`);
    assert.equal(new Set(images).size, images.length, `Duplicate image: ${loc}`);
    assert.deepEqual(images, extractImages(pages.get(route), loc), `Missing or extra authored images: ${loc}`);
    for (const src of images) {
      const url = new URL(src);
      assert(['http:', 'https:'].includes(url.protocol));
      if (url.origin === site) assert(existsSync(resolve(root, '.' + decodeURIComponent(url.pathname))), `Missing local image: ${src}`);
    }
    imageCount += images.length;
  }
}
assert.deepEqual([...seen].sort(), [...expected].sort(), 'Indexable pages missing from sitemap');
assert.deepEqual(Object.keys(state).sort(), [...seen].map(url => new URL(url).pathname).sort(), 'Stale or missing lastmod state');
// Literal redirect sources must never be advertised. Wildcard /index.html rules
// cannot match any of the directory routes required by the checks above.
for (const line of read('_redirects').split(/\r?\n/)) {
  const [source] = line.trim().split(/\s+/);
  if (source?.startsWith('/') && !source.includes('*')) assert(!seen.has(site + source), `Redirect in sitemap: ${source}`);
}
console.log(`Sitemap audit passed: ${pages.size} pages, ${seen.size} canonical URLs, ${childNames.length} child sitemaps, ${imageCount} image entries; no missing, duplicate, noindex, redirected URLs or missing local images.`);
