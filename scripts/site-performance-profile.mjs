export const generatedRuntimePaths = new Set([
  "/assets/app.js",
  "/assets/content-page.js",
  "/assets/directory-page.js",
  "/assets/blog-index.js",
]);

const fullAppMarkers = [
  'id="hero-cut-form"',
  'id="cut-list-form"',
  'id="stair-form"',
  'id="board-foot-form"',
  'id="kerf-form"',
  'id="fraction-form"',
  'id="inch-mm-form"',
  'id="conversion-fraction-form"',
  'id="conversion-unit-form"',
  'id="angle-calculator-form"',
  'id="rise-run-form"',
  'id="lumber-form"',
  'id="sheet-form"',
  'id="material-cost-form"',
  'id="cost-estimator-form"',
  'id="wood-weight-form"',
  'id="screw-size-form"',
  'id="drill-bit-form"',
  'id="material-list-form"',
  'id="waste-form"',
  'id="quiltfit-form"',
  'id="tile-form"',
];

export function needsFullAppRuntime(html) {
  return fullAppMarkers.some((marker) => html.includes(marker));
}

export function performanceProfile(file, html) {
  if (file.startsWith("ouyang/") || /<meta\b[^>]*http-equiv=["']refresh["']/i.test(html)) {
    return { stylesheet: null, runtimes: [] };
  }

  if (file.startsWith("apps/")) {
    return { stylesheet: "/assets/apps.css", runtimes: ["/assets/content-page.js"] };
  }

  if (/^(?:blog|compare)\//.test(file)) {
    return {
      stylesheet: "/assets/editorial.css",
      runtimes: file === "blog/index.html"
        ? ["/assets/content-page.js", "/assets/blog-index.js"]
        : ["/assets/content-page.js"],
    };
  }

  if (file === "stringer/index.html" || file === "stair-stringer-calculator/index.html") {
    return { stylesheet: "/assets/interactive.css", runtimes: ["/assets/content-page.js"] };
  }

  if (needsFullAppRuntime(html)) {
    return { stylesheet: "/assets/interactive.css", runtimes: ["/assets/app.js"] };
  }

  const runtimes = ["/assets/content-page.js"];
  if (html.includes("template-category-section")) runtimes.push("/assets/directory-page.js");
  return { stylesheet: "/assets/content.css", runtimes };
}
