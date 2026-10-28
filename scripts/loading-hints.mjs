// Keep deferred execution order, but discover critical bootstraps before the
// inline stylesheet is parsed. This prevents late script requests on busy CPUs.
export function applyBootstrapHints(html, profile) {
  let next = html.replace(/\s*<link rel="preload" data-site-bootstrap[^>]*>/g, "");
  const paths = profile.stylesheet
    ? [profile.runtimes.includes("/assets/wood-page.js") ? "/assets/wood-page.js" : "/assets/site-navigation.js",
      ...profile.runtimes.filter(path => path === "/assets/app.js")]
    : [];
  if (paths.length) next = next.replace(/(<meta\s+name="viewport"[^>]*>)/,
    `$1\n${paths.map(path => `  <link rel="preload" data-site-bootstrap as="script" href="${path}" fetchpriority="low">`).join("\n")}`);
  return next;
}

// Structured data remains in the document, but must not make a streamed
// response deliver several KB of invisible JSON before the visible heading.
export function deferStructuredData(html) {
  if (!html.includes("</main>")) return html;
  const schemas = [];
  const next = html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, head => head.replace(
    /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi,
    schema => { schemas.push(schema); return ""; }
  ));
  return schemas.length ? next.replace("</main>", `</main>\n  ${schemas.join("\n  ")}`) : html;
}
