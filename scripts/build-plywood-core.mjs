import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(import.meta.dirname, '..');
export function plywoodCoreSource() {
  const app = readFileSync(resolve(root, 'assets/app.js'), 'utf8');
  const between = (start, end) => {
    const a = app.indexOf(start), b = app.indexOf(end, a + start.length);
    if (a < 0 || b < 0) throw new Error(`Missing core boundary: ${start}`);
    return app.slice(a, b).trim();
  };
  return `// Generated from assets/app.js by scripts/build-plywood-core.mjs.\n(function () {\n${app.split('\n')[0]}\n${between('const format =', 'const numberValue =')}\n${between('const escapeHtml =', 'const cutColors =')}\n${between('const appCta =', 'const kerfCta =')}\n${between('function summarizeParts(', 'function optimizeLinearCuts(')}\n${between('function packSheets(', '// Shared packing and drawing implementation')}\nwindow.WCTPlywoodCore = Object.freeze({ packSheets, drawSheet, appCta });\n})();\n`;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = plywoodCoreSource();
  writeFileSync(resolve(root, 'assets/plywood-core.js'), source);
  console.log(`Built plywood core: ${Buffer.byteLength(source)} bytes.`);
}
