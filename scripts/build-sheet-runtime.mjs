import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");

// Keep the calculation and result markup in app.js as the single source.
// The English sheet calculator needs none of the other calculators or dictionaries.
export function sheetRuntimeSource() {
  const app = readFileSync(resolve(root, "assets/app.js"), "utf8");
  const between = (start, end) => {
    const a = app.indexOf(start), b = app.indexOf(end, a + start.length);
    if (a < 0 || b < 0) throw new Error(`Missing sheet runtime boundary: ${start}`);
    return app.slice(a, b).trim();
  };
  return `// Generated from assets/app.js by scripts/build-sheet-runtime.mjs.
(function () {
${app.split("\n")[0]}
const getActiveLang = () => window.WCTTranslation?.getActiveLang?.() || "en";
const translateElement = (root, lang) => window.WCTTranslation?.translateElement?.(root, lang);
${between("const format =", "const cutColors =")}
${between("const appCta =", "const kerfCta =")}
${between("function initSheetCalculator()", "function initMaterialCostCalculator()")}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSheetCalculator, { once: true });
} else {
  initSheetCalculator();
}
})();
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = sheetRuntimeSource();
  writeFileSync(resolve(root, "assets/sheet.js"), source);
  console.log(`Built sheet runtime: ${Buffer.byteLength(source)} bytes.`);
}
