import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");

export function homeRuntimeSource() {
  const app = readFileSync(resolve(root, "assets/app.js"), "utf8");
  const between = (start, end) => {
    const a = app.indexOf(start);
    const b = app.indexOf(end, a + start.length);
    if (a < 0 || b < 0) throw new Error(`Missing home runtime boundary: ${start}`);
    return app.slice(a, b).trim();
  };

  return `// Generated from assets/app.js by scripts/build-home-runtime.mjs.\n(function () {\n` +
    `const t = (text) => window.WCTTranslation?.t?.(text) || text;\n` +
    `const getActiveLang = () => window.WCTTranslation?.getActiveLang?.() || "en";\n` +
    `const translateElement = (root, lang) => window.WCTTranslation?.translateElement?.(root, lang);\n` +
    `${between("const format =", "const escapeHtml =")}\n` +
    `${between("function initHeroCutPlanner()", "const format =")}\n` +
    `if (document.readyState === "loading") {\n` +
    `  document.addEventListener("DOMContentLoaded", initHeroCutPlanner, { once: true });\n` +
    `} else {\n` +
    `  initHeroCutPlanner();\n` +
    `}\n` +
    `})();\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = homeRuntimeSource();
  writeFileSync(resolve(root, "assets/home.js"), source);
  console.log(`Built home runtime: ${Buffer.byteLength(source)} bytes.`);
}
