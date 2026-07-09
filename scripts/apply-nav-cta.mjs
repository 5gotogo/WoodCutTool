import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set([".git", ".github", ".agents", ".codex", "node_modules", "assets"]);

const appStoreLinks = {
  cutlist: "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871",
  quiltfit: "https://apps.apple.com/us/app/quiltfit-quilt-design-planner/id6776541705",
  stringer: "https://apps.apple.com/us/app/stringer-stair-layout/id6784882437?uo=4",
  tinnitus: "https://apps.apple.com/us/app/tinnitus-relief-sound-masking/id6782496783"
};

const languagePicker = `<label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label>`;

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

function routeFor(file) {
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${dirname(file)}/`;
  return `/${file}`;
}

function ctaFor(file, html) {
  if (
    file.startsWith("tinnitus/") ||
    file.startsWith("apps/tinnitus-relief-sound-masking/") ||
    file.startsWith("legal/Tinnitus/")
  ) {
    return ["Download Tinnitus", appStoreLinks.tinnitus];
  }

  if (
    file.startsWith("quiltfit/") ||
    file.startsWith("apps/quiltfit/") ||
    file.startsWith("apps/quiltfit-quilt-design-planner/") ||
    /<a class="active" href="\/quiltfit\/">QuiltFit<\/a>/.test(html)
  ) {
    return ["Download QuiltFit", appStoreLinks.quiltfit];
  }

  if (
    file.startsWith("stringer/") ||
    file.startsWith("apps/stringer/") ||
    file.startsWith("apps/stringer-stair-layout/") ||
    /<a class="active" href="\/stringer\/">Stringer<\/a>/.test(html)
  ) {
    return ["Download Stringer", appStoreLinks.stringer];
  }

  return ["Download CutList", appStoreLinks.cutlist];
}

function activeCategory(file) {
  const route = routeFor(file);
  if (route.startsWith("/apps/")) return "apps";
  if (route.startsWith("/tinnitus/")) return "apps";
  if (
    route.startsWith("/blog/") ||
    route.startsWith("/learn/") ||
    route.startsWith("/compare/") ||
    route.startsWith("/glossary/") ||
    route.startsWith("/guides/") ||
    route.startsWith("/legal/") ||
    route.startsWith("/templates/") ||
    route.startsWith("/wood/") ||
    route.startsWith("/privacy-policy/") ||
    route.startsWith("/terms-of-service/")
  ) {
    return "resources";
  }
  if (route === "/404.html") return "";
  return "tools";
}

function isRouteActive(file, href, aliases = [], exact = false) {
  const route = routeFor(file);
  const candidates = [href, ...aliases];
  if (exact) {
    return candidates.some((candidate) => route === candidate);
  }
  return candidates.some((candidate) => {
    if (candidate === "/") return route === "/";
    return route === candidate || route.startsWith(candidate);
  });
}

function linkActiveClass(file, href, aliases = [], exact = false) {
  return isRouteActive(file, href, aliases, exact) ? " active" : "";
}

function menuLink(file, { href, icon, title, description, aliases = [], exact = false }) {
  return `<a class="mega-link${linkActiveClass(file, href, aliases, exact)}" href="${href}"><span class="mega-icon">${icon}</span><span class="mega-copy"><strong>${title}</strong><span>${description}</span></span></a>`;
}

function megaFeature({ href, title, description, cta }) {
  return `<a class="mega-feature" href="${href}"><span class="mega-visual" aria-hidden="true"><span class="mega-visual-sheet"><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span></span></span><strong>${title}</strong><span>${description}</span><span class="card-link">${cta}</span></a>`;
}

function navLinks(file) {
  const tools = [
    { href: "/cutlist/", aliases: ["/cut-list-calculator/", "/plywood-cut-calculator/"], icon: "CL", title: "CutList", description: "Visual plywood layouts, kerf, waste, and savings." },
    { href: "/quiltfit/", icon: "QF", title: "QuiltFit", description: "Quilt block, backing, batting, and binding planning." },
    { href: "/tile-calculator/", icon: "TI", title: "Tile calculator", description: "Floor and wall tile quantities before ordering." },
    { href: "/stringer/", aliases: ["/stair-stringer-calculator/"], icon: "ST", title: "Stringer", description: "Stair rise, run, tread, and stringer layout checks." },
    { href: "/kerf-calculator/", icon: "KF", title: "Kerf calculator", description: "Estimate saw-cut material loss and remaining length." },
    { href: "/board-foot-calculator/", icon: "BF", title: "Board foot", description: "Convert board dimensions into lumber volume." },
    { href: "/wood-weight-calculator/", icon: "WT", title: "Wood weight", description: "Plan handling weight by species and stock size." },
    { href: "/screw-size-finder/", icon: "SC", title: "Screw finder", description: "Pick practical screw sizes for common assemblies." }
  ];

  const apps = [
    { href: "/apps/cutlist/", aliases: ["/apps/cutlist-plywood-optimizer/"], icon: "CL", title: "CutList app", description: "Save cut lists, layouts, and project revisions on iPhone." },
    { href: "/apps/quiltfit/", aliases: ["/apps/quiltfit-quilt-design-planner/"], icon: "QF", title: "QuiltFit app", description: "Design quilts and carry fabric planning into the app." },
    { href: "/apps/stringer/", aliases: ["/apps/stringer-stair-layout/"], icon: "ST", title: "Stringer app", description: "Keep stair layouts, code checks, and cut sheets together." },
    { href: "/apps/snapreceipt-expenses-and-tax/", icon: "SR", title: "SnapReceipt", description: "Scan receipts and prepare expense or tax records." },
    { href: "/apps/pdf-scan-scanner-and-reader/", icon: "PS", title: "PDF Scan", description: "Turn paper documents into readable PDFs." },
    { href: "/apps/printer-app-print-pdf-docs/", icon: "PR", title: "Printer App", description: "Print PDFs, docs, photos, labels, and common files." },
    { href: "/apps/tinnitus-relief-sound-masking/", aliases: ["/tinnitus/"], icon: "TN", title: "Tinnitus Relief", description: "Masking sounds and hearing-profile tools for iPhone." },
    { href: "/apps/", icon: "AP", title: "All apps", description: "Browse the full app library and comparisons.", exact: true }
  ];

  const resources = [
    { href: "/learn/", icon: "LN", title: "Learn", description: "Workflows for planning cuts, stairs, tile, and materials." },
    { href: "/blog/", icon: "BG", title: "Blog", description: "Project guides, app workflows, and planning examples." },
    { href: "/compare/", icon: "CP", title: "Compare", description: "Tool and material comparisons before choosing a path." },
    { href: "/templates/", icon: "TP", title: "Templates", description: "Reusable planning starts for common shop projects." },
    { href: "/glossary/", icon: "GL", title: "Glossary", description: "Cut list, plywood, joinery, and measurement terms." },
    { href: "/wood/", aliases: ["/wood-database/"], icon: "WD", title: "Wood species", description: "Reference density, hardness, and planning notes." }
  ];

  return `<div class="nav-links nav-links-mega"><div class="nav-menu-item"><a class="nav-trigger" href="/tools/" aria-haspopup="true">Tools</a><div class="mega-menu" role="group" aria-label="Tools menu">${megaFeature({ href: "/cutlist/", title: "Plan plywood cuts visually", description: "Start with the core cut planner, then jump into calculators for waste, kerf, board feet, tile, stairs, and more.", cta: "Open CutList ->" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Core planners</p>${tools.slice(0, 4).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">Shop calculators</p>${tools.slice(4, 8).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">Tool hubs</p>${menuLink(file, { href: "/tools/", icon: "TL", title: "All tools", description: "Open the full calculator and planning hub.", exact: true })}${menuLink(file, { href: "/material-library/", icon: "ML", title: "Material library", description: "Browse materials, specs, and planning references." })}${menuLink(file, { href: "/material-list-generator/", icon: "MT", title: "Material list", description: "Turn project inputs into a material checklist." })}${menuLink(file, { href: "/inch-mm-converter/", icon: "IN", title: "Inch/mm converter", description: "Convert workshop dimensions quickly." })}</div></div></div></div><div class="nav-menu-item"><a class="nav-trigger" href="/apps/" aria-haspopup="true">Apps</a><div class="mega-menu" role="group" aria-label="Apps menu">${megaFeature({ href: "/apps/", title: "iPhone apps for saved workflows", description: "Use the website for quick checks, then move repeatable projects into focused iPhone apps when you need saved records.", cta: "Browse apps ->" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Planning apps</p>${apps.slice(0, 3).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">Document apps</p>${apps.slice(3, 6).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">More apps</p>${apps.slice(6, 8).map((item) => menuLink(file, item)).join("")}${menuLink(file, { href: "/apps/compare/", icon: "VS", title: "App comparisons", description: "Compare app workflows against common alternatives." })}</div></div></div></div><div class="nav-menu-item"><a class="nav-trigger" href="/learn/" aria-haspopup="true">Resources</a><div class="mega-menu" role="group" aria-label="Resources menu">${megaFeature({ href: "/learn/", title: "Learn before you cut", description: "Use guides, comparisons, templates, glossary entries, and species references to reduce rework before buying material.", cta: "Open learning hub ->" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Guides</p>${resources.slice(0, 3).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">References</p>${resources.slice(3, 6).map((item) => menuLink(file, item)).join("")}</div><div class="mega-column"><p class="mega-column-title">Site</p>${menuLink(file, { href: "/privacy-policy/", icon: "PV", title: "Privacy", description: "Read the privacy policy for the website and tools." })}${menuLink(file, { href: "/terms-of-service/", icon: "TS", title: "Terms", description: "Review the website terms of service." })}${menuLink(file, { href: "/sitemap.xml", icon: "SM", title: "Sitemap", description: "Open the XML sitemap for all indexed pages." })}</div></div></div></div></div>`;
}

function buildHeader(file, html) {
  const [label, href] = ctaFor(file, html);
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a>${navLinks(file)}${languagePicker}<a class="button small nav-download-cta" href="${href}" rel="nofollow noopener">${label}</a></nav></header>`;
}

function applyHeader(file, html) {
  const pattern = /<header class="[^"]*\bsite-header\b[^"]*">[\s\S]*?<\/header>/;
  if (!pattern.test(html)) return html;
  return html.replace(pattern, buildHeader(file, html));
}

let updated = 0;
let skipped = 0;

for (const file of collectHtmlFiles()) {
  const absolute = join(root, file);
  const html = readFileSync(absolute, "utf8");
  const next = applyHeader(file, html);
  if (next === html) {
    skipped += 1;
    continue;
  }
  writeFileSync(absolute, next);
  updated += 1;
}

console.log(`Applied mega navigation to ${updated} pages${skipped ? `, skipped ${skipped}` : ""}.`);
