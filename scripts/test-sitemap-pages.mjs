import assert from 'node:assert/strict';
import { extractImages, hasNoindex, sitemapRoute } from './sitemap-page.mjs';
const site = 'https://woodcuttool.com';
for (const meta of [
  '<meta name="robots" content="noindex,follow">',
  "<META content = 'NOINDEX FOLLOW' name = 'robots'>",
  '<meta name=googlebot content=none>',
  '<meta name="robots" content="none">',
]) {
  assert(hasNoindex(meta), meta);
  assert.equal(sitemapRoute(meta, '/example/', site), null);
}
assert(!hasNoindex('<meta name="robots" content="index,follow,noimageindex">'));
assert.equal(sitemapRoute('<link href="/example/" rel="canonical">', '/example/', site), '/example/');
for (const href of ['/other/', 'https://example.com/example/', '/example/?sort=1', '/example/#part']) {
  assert.equal(sitemapRoute(`<link rel="canonical" href="${href}">`, '/example/', site), null);
}
assert.throws(() => sitemapRoute('<link rel="canonical" href="/a/"><link rel="canonical" href="/b/">', '/example/', site));
assert.throws(() => sitemapRoute('<link rel="canonical" href="">', '/example/', site));
const html = `<figure><picture><source srcset="/small.avif 480w"><img src="/photo.webp"></picture></figure>
<figure class="blog-photo-visual"><img src="https://images.example.com/photo.jpg?a=1&amp;b=2"></figure>
<figure><img src="/photo.webp"><img src="/assets/og/shared.png"><img src="/diagram.svg"><img src="data:image/png;base64,abc"></figure>
<img src="https://images.example.com/icon.jpg" class="app-detail-icon">
<div class="app-screenshot-strip"><img src="/screen.png"></div>
<img src="/navigation-icon.png">`;
assert.deepEqual(extractImages(html, `${site}/example/`), [
  `${site}/photo.webp`, 'https://images.example.com/photo.jpg?a=1&b=2',
  'https://images.example.com/icon.jpg', `${site}/screen.png`,
]);
console.log('Sitemap page tests passed: robots directives, canonical aliases, local images, responsive variants and XML entity decoding.');
