import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);
const megaMenuFallbackStyle = "  <style>.mega-menu{display:none}</style>";
const HEADER_START = "<!-- shared-header:start -->";
const HEADER_END = "<!-- shared-header:end -->";
const FOOTER_START = "<!-- shared-footer:start -->";
const FOOTER_END = "<!-- shared-footer:end -->";
const headerMount = "<div data-site-header></div>";
const footerMount = "<div data-site-footer></div>";
const siteChromeScript = '  <script defer src="/assets/site-chrome.js"></script>';
const conversionScript = '  <script defer src="/assets/conversion.js"></script>';
const appStoreId = "6768171871";
const tileFitAppStoreId = "6792627022";
const providerToken = String(process.env.APPLE_PROVIDER_TOKEN || "").trim();

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
  return html.replace(/\/assets\/site-chrome\.js(?:\?[^\"]*)?/g, "/assets/site-chrome.js");
}

function applyConversionVersion(html) {
  return html.replace(/\/assets\/conversion\.js(?:\?[^\"]*)?/g, "/assets/conversion.js");
}

function applyMegaMenuFallback(html) {
  if (html.includes("<style>.mega-menu{display:none}</style>")) return html;
  return html.replace("</head>", `${megaMenuFallbackStyle}\n</head>`);
}

function applySiteChromeScript(html) {
  let next = html.replace(/\s*<script\b(?=[^>]*\bsrc="\/assets\/site-chrome\.js(?:\?[^\"]*)?")[^>]*>\s*<\/script>/g, "");
  const runtimeScriptPattern = /(\s*<script\b(?=[^>]*\bsrc="\/assets\/(?:app|content-page)\.js")[^>]*>\s*<\/script>)/;
  if (runtimeScriptPattern.test(next)) {
    return next.replace(runtimeScriptPattern, `\n${siteChromeScript}$1`);
  }
  return next.replace("</head>", `${siteChromeScript}\n</head>`);
}

function applyConversionScript(html) {
  const next = html.replace(/\s*<script\b(?=[^>]*\bsrc="\/assets\/conversion\.js(?:\?[^\"]*)?")[^>]*>\s*<\/script>/g, "");
  const appScriptPattern = /(\s*<script\b(?=[^>]*\bsrc="\/assets\/app\.js")[^>]*>\s*<\/script>)/;
  if (appScriptPattern.test(next)) {
    return next.replace(appScriptPattern, `$1\n${conversionScript}`);
  }
  const siteChromePattern = /(\s*<script\b(?=[^>]*\bsrc="\/assets\/site-chrome\.js")[^>]*>\s*<\/script>)/;
  if (siteChromePattern.test(next)) {
    return next.replace(siteChromePattern, `$1\n${conversionScript}`);
  }
  return next.replace("</head>", `${conversionScript}\n</head>`);
}

function cutlistCampaignFor(file) {
  if (file === "index.html") return "smart-home";
  if (file === "apps/cutlist/index.html") return "smart-app-page";
  if (/^(cutlist|cut-list-calculator|plywood-cut-calculator|cabinet-cut-list-calculator)\//.test(file)) return "smart-calculator";
  if (file.startsWith("tools/components/")) return "smart-component";
  if (file.startsWith("templates/")) return "smart-template";
  if (file.startsWith("examples/")) return "smart-example";
  if (file.startsWith("learn/")) return "smart-learn";
  if (file.startsWith("troubleshooting/")) return "smart-troubleshoot";
  if (file.startsWith("blog/") && /(cutlist|cut-list|plywood|cabinet|sheet-layout|kerf|wood-waste)/.test(file)) return "smart-blog";
  return "";
}

function tileFitCampaignFor(file) {
  if (file === "tile-calculator/index.html") return "smart-tilefit-calculator";
  if (file === "apps/tilefit-tile-layout-planner/index.html") return "smart-tilefit-app-page";
  if (file.startsWith("legal/TileFit/")) return "smart-tilefit-legal";
  return "";
}

function applySmartAppBanner(html, file) {
  const tileFitCampaign = tileFitCampaignFor(file);
  const campaign = tileFitCampaign || cutlistCampaignFor(file);
  const selectedAppStoreId = tileFitCampaign ? tileFitAppStoreId : appStoreId;
  const withoutExisting = html.replace(/\s*<meta\s+name="apple-itunes-app"[^>]*>/g, "");
  if (!campaign || !withoutExisting.includes('name="viewport"')) return withoutExisting;
  const affiliateData = [
    providerToken && /^\d+$/.test(providerToken) ? `pt=${providerToken}` : "",
    `ct=${campaign}`,
  ].filter(Boolean).join("&amp;");
  const route = file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`;
  const content = `app-id=${selectedAppStoreId}, affiliate-data=${affiliateData}, app-argument=https://woodcuttool.com${route}`;
  return withoutExisting.replace(/(<meta\s+name="viewport"[^>]*>)/, `$1\n  <meta name="apple-itunes-app" content="${content}">`);
}

function applySharedChromeMounts(html) {
  let next = html;
  const headerBlockPattern = new RegExp(`${HEADER_START}[\\s\\S]*?${HEADER_END}`, "g");
  const headerMountPattern = /<div\b[^>]*\bdata-site-header\b[^>]*>\s*<\/div>/gi;
  const staticHeaderPattern = /<header\b(?=[^>]*\bclass=["'][^"']*\bsite-header\b[^"']*["'])[^>]*>[\s\S]*?<\/header>/gi;
  if (headerBlockPattern.test(next)) {
    next = next.replace(headerBlockPattern, headerMount);
  } else if (headerMountPattern.test(next)) {
    next = next.replace(headerMountPattern, headerMount);
  } else if (staticHeaderPattern.test(next)) {
    next = next.replace(staticHeaderPattern, headerMount);
  } else if (next.includes('<a class="skip-link"')) {
    next = next.replace(/(<a class="skip-link"[^>]*>[\s\S]*?<\/a>)/, `$1\n  ${headerMount}`);
  } else {
    next = next.replace(/<body([^>]*)>/, `<body$1>\n  ${headerMount}`);
  }
  next = next.replace(staticHeaderPattern, "");
  let keptHeaderMount = false;
  next = next.replace(headerMountPattern, () => {
    if (keptHeaderMount) return "";
    keptHeaderMount = true;
    return headerMount;
  });

  const footerBlockPattern = new RegExp(`${FOOTER_START}[\\s\\S]*?${FOOTER_END}`, "g");
  const footerMountPattern = /<div\b[^>]*\bdata-site-footer\b[^>]*>\s*<\/div>/gi;
  const staticFooterPattern = /<footer\b(?=[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'])[^>]*>[\s\S]*?<\/footer>/gi;
  if (footerBlockPattern.test(next)) {
    next = next.replace(footerBlockPattern, footerMount);
  } else if (footerMountPattern.test(next)) {
    next = next.replace(footerMountPattern, footerMount);
  } else if (staticFooterPattern.test(next)) {
    next = next.replace(staticFooterPattern, footerMount);
  } else {
    next = next.replace("</body>", `  ${footerMount}\n</body>`);
  }
  next = next.replace(staticFooterPattern, "");
  let keptFooterMount = false;
  next = next.replace(footerMountPattern, () => {
    if (keptFooterMount) return "";
    keptFooterMount = true;
    return footerMount;
  });

  return next;
}

let updated = 0;
let skipped = 0;

for (const file of collectHtmlFiles()) {
  const absolute = join(root, file);
  const html = readFileSync(absolute, "utf8");
  const next = applySmartAppBanner(
    applySharedChromeMounts(
      applyConversionScript(
        applySiteChromeScript(
          applyMegaMenuFallback(
            applyConversionVersion(
              applySiteChromeVersion(
                applyAppVersion(
                  applyStylesVersion(html)
                )
              )
            )
          )
        )
      )
    ),
    file
  );

  if (next === html) {
    skipped += 1;
    continue;
  }

  writeFileSync(absolute, next);
  updated += 1;
}

console.log(`Applied shared site chrome to ${updated} pages${skipped ? `, skipped ${skipped}` : ""}.`);
