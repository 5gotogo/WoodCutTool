// Request resized images from Apple's existing thumbnail service. Unknown
// hosts and local assets retain their source URL and intrinsic dimensions.
export function appStoreThumbnail(url, width, height = width) {
  const source = String(url || "");
  if (!/^https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\//.test(source)) return source;
  return source.replace(/\/\d+x\d+bb\.(jpg|png|webp)(?=\?|$)/i, `/${width}x${height}bb.$1`);
}

export function appStoreScreenshotSources(url, size) {
  if (!size) return null;
  const candidate = width => appStoreThumbnail(url, width, Math.round(width * size.height / size.width));
  if (candidate(360) === url) return null;
  const widths = [240, 360, 540, 720, 1080].filter(width => width < size.width);
  if (!widths.length) return null;
  return {
    src: candidate(widths.includes(360) ? 360 : widths[0]),
    srcset: widths.map(width => `${candidate(width)} ${width}w`).join(", "),
  };
}
