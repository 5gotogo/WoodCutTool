// Both the preload and picture use this single candidate list and size hint.
// Browsers without AVIF skip the typed preload and select the WebP fallback.
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
export function heroSources(src, sizes) {
  const width = src.endsWith("compare-hero.webp") ? 1600
    : /\/(?:tile-layout|quilt-planning)\.webp$/.test(src) ? 1448 : 1200;
  const widths = [480, 800, width];
  const path = (size, format) => format === "webp" && size === width ? src : src.replace(/\.webp$/, `-${size}.${format}`);
  const avif = widths.map(size => path(size, "avif"));
  if (avif.some(file => !existsSync(resolve(root, `.${file}`)))) throw new Error(`Missing AVIF hero: ${src}; run scripts/build-lcp-images.py`);
  return {
    sizes,
    avif: avif.map((file, i) => `${file} ${widths[i]}w`).join(", "),
    webp: widths.filter(size => existsSync(resolve(root, `.${path(size, "webp")}`)))
      .map(size => `${path(size, "webp")} ${size}w`).join(", "),
    preload: avif[1],
  };
}

export function heroPreload(src, sizes) {
  const sources = heroSources(src, sizes);
  return `<link rel="preload" as="image" type="image/avif" href="${sources.preload}" imagesrcset="${sources.avif}" imagesizes="${sizes}" fetchpriority="high">`;
}

export function heroPicture(img, src, sizes) {
  const sources = heroSources(src, sizes);
  const fallback = img.replace(/\s+(?:srcset|sizes)="[^"]*"/g, "")
    .replace(/\bsrc="[^"]*"/, `$& srcset="${sources.webp}" sizes="${sizes}"`);
  return `<picture style="display:contents"><source type="image/avif" srcset="${sources.avif}" sizes="${sizes}">${fallback}</picture>`;
}
