// Keep deferred execution order, but discover critical bootstraps before the
// inline stylesheet is parsed. This prevents late script requests on busy CPUs.
export function applyBootstrapHints(html, profile) {
  let next = html.replace(/\s*<link rel="preload" data-site-bootstrap[^>]*>/g, "");
  const paths = profile.stylesheet
    ? [profile.runtimes.includes("/assets/wood-page.js") ? "/assets/wood-page.js" : "/assets/site-chrome.js",
      ...profile.runtimes.filter(path => path === "/assets/app.js")]
    : [];
  if (paths.length) next = next.replace(/(<meta\s+name="viewport"[^>]*>)/,
    `$1\n${paths.map(path => `  <link rel="preload" data-site-bootstrap as="script" href="${path}" fetchpriority="low">`).join("\n")}`);
  return next;
}
