import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const megaMenuFallbackStyle = "  <style>.mega-menu{display:none}</style>";
const headerMount = '<div data-site-header></div>';
const footerMount = '<div data-site-footer></div>';
const siteChromeScript = '  <script defer src="/assets/site-chrome.js"></script>';

function collectHtmlFiles(dir = root, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) continue;
    const absolute = join(dir, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(absolute, relative));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relative);
    }
  }
  return files.sort();
}

function applyStylesVersion(html) {
  return html.replace(/\/assets\/styles\.css(?:\?v=[^"]+)?/g, "/assets/styles.css");
}

function applyAppVersion(html) {
  return html.replace(/\/assets\/app\.js(?:\?v=[^"]+)?/g, "/assets/app.js");
}

function applySiteChromeVersion(html) {
  return html.replace(/\/assets\/site-chrome\.js(?:\?v=[^"]+)?/g, "/assets/site-chrome.js");
}

function applyMegaMenuFallback(html) {
  if (html.includes("<style>.mega-menu{display:none}</style>")) return html;
  return html.replace("</head>", `${megaMenuFallbackStyle}\n</head>`);
}

function applySiteChromeScript(html) {
  let next = html.replace(/\s*<script\b(?=[^>]*\bsrc="\/assets\/site-chrome\.js")[^>]*>\s*<\/script>/g, "");
  const appScriptPattern = /(\s*<script\b(?=[^>]*\bsrc="\/assets\/app\.js")[^>]*>\s*<\/script>)/;
  if (appScriptPattern.test(next)) {
    return next.replace(appScriptPattern, `\n${siteChromeScript}$1`);
  }
  return next.replace("</head>", `${siteChromeScript}\n</head>`);
}

function applySharedChromeMounts(html) {
  let next = html.replace(/<header class="[^"]*\bsite-header\b[^"]*">[\s\S]*?<\/header>/, headerMount);

  if (!next.includes("data-site-header")) {
    if (next.includes('<a class="skip-link"')) {
      next = next.replace(/(<a class="skip-link"[^>]*>[\s\S]*?<\/a>)/, `$1\n  ${headerMount}`);
    } else {
      next = next.replace("<body>", `<body>\n  ${headerMount}`);
    }
  }

  next = next.replace(/<footer class="[^"]*\bsite-footer\b[^"]*">[\s\S]*?<\/footer>/, footerMount);

  if (!next.includes("data-site-footer")) {
    next = next.replace("</body>", `  ${footerMount}\n</body>`);
  }

  return next;
}

let updated = 0;
let skipped = 0;

for (const file of collectHtmlFiles()) {
  const absolute = join(root, file);
  const html = readFileSync(absolute, "utf8");
  const next = applySharedChromeMounts(
    applySiteChromeScript(
      applyMegaMenuFallback(
        applySiteChromeVersion(
          applyAppVersion(
            applyStylesVersion(html)
          )
        )
      )
    )
  );

  if (next === html) {
    skipped += 1;
    continue;
  }

  writeFileSync(absolute, next);
  updated += 1;
}

console.log(`Applied shared site chrome to ${updated} pages${skipped ? `, skipped ${skipped}` : ""}.`);
