(function () {
  const appStoreLinks = {
    cutlist: "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871",
    quiltfit: "https://apps.apple.com/us/app/quiltfit-quilt-design-planner/id6776541705",
    stringer: "https://apps.apple.com/us/app/stringer-stair-layout/id6784882437?uo=4",
    snaplabel: "https://apps.apple.com/us/app/snaplabel-photo-text-label/id6751947372",
    tinnitus: "https://apps.apple.com/us/app/tinnitus-relief-sound-masking/id6782496783"
  };

  const languagePicker = `<label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label>`;

  function route() {
    return window.location.pathname || "/";
  }

  function ctaFor() {
    const current = route();
    if (
      current.startsWith("/tinnitus/") ||
      current.startsWith("/apps/tinnitus-relief-sound-masking/") ||
      current.startsWith("/legal/Tinnitus/")
    ) {
      return ["Download Tinnitus", appStoreLinks.tinnitus];
    }
    if (
      current.startsWith("/quiltfit/") ||
      current.startsWith("/apps/quiltfit/") ||
      current.startsWith("/apps/quiltfit-quilt-design-planner/") ||
      current.startsWith("/legal/quiltfit/")
    ) {
      return ["Download QuiltFit", appStoreLinks.quiltfit];
    }
    if (
      current.startsWith("/stringer/") ||
      current.startsWith("/apps/stringer/") ||
      current.startsWith("/apps/stringer-stair-layout/") ||
      current.startsWith("/legal/Stringer/")
    ) {
      return ["Download Stringer", appStoreLinks.stringer];
    }
    if (current.startsWith("/apps/snaplabel-photo-text-label/")) {
      return ["Download SnapLabel", appStoreLinks.snaplabel];
    }
    return ["Download CutList", appStoreLinks.cutlist];
  }

  function isActive(href, aliases = [], exact = false) {
    const current = route();
    const candidates = [href, ...aliases];
    if (exact) {
      return candidates.some((candidate) => current === candidate);
    }
    return candidates.some((candidate) => {
      if (candidate === "/") return current === "/";
      return current === candidate || current.startsWith(candidate);
    });
  }

  function activeClass(href, aliases = [], exact = false) {
    return isActive(href, aliases, exact) ? " active" : "";
  }

  function menuLink({ href, icon, title, description, aliases = [], exact = false }) {
    return `<a class="mega-link${activeClass(href, aliases, exact)}" href="${href}"><span class="mega-icon">${icon}</span><span class="mega-copy"><strong>${title}</strong><span>${description}</span></span></a>`;
  }

  function megaVisual(type = "tools") {
    if (type === "apps") {
      return `<span class="mega-visual mega-visual-apps" aria-hidden="true"><span class="mega-app-phone mega-app-phone-primary"><span class="mega-app-screen"><span></span><span></span><span></span><span></span></span></span><span class="mega-app-phone mega-app-phone-secondary"><span class="mega-app-screen"><span></span><span></span><span></span><span></span></span></span><span class="mega-app-badge">PDF</span></span>`;
    }
    if (type === "resources") {
      return `<span class="mega-visual mega-visual-resources" aria-hidden="true"><span class="mega-resource-book">Guide</span><span class="mega-resource-card mega-resource-card-one"><span></span><span></span><span></span></span><span class="mega-resource-card mega-resource-card-two"><span></span><span></span><span></span></span><span class="mega-resource-chip">Glossary</span></span>`;
    }
    return `<span class="mega-visual mega-visual-tools" aria-hidden="true"><span class="mega-visual-sheet"><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span></span></span>`;
  }

  function megaFeature({ href, title, description, cta, visual = "tools" }) {
    return `<a class="mega-feature" href="${href}">${megaVisual(visual)}<strong>${title}</strong><span>${description}</span><span class="card-link">${cta}</span></a>`;
  }

  function navLinks() {
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
      { href: "/apps/snaplabel-photo-text-label/", icon: "SL", title: "SnapLabel", description: "Create photo labels for storage, products, boxes, and home organization." },
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

    return `<div class="nav-links nav-links-mega"><div class="nav-menu-item"><a class="nav-trigger" href="/tools/" aria-haspopup="true" aria-expanded="false">Tools</a><div class="mega-menu" role="group" aria-label="Tools menu">${megaFeature({ href: "/cutlist/", title: "Plan plywood cuts visually", description: "Start with the core cut planner, then jump into calculators for waste, kerf, board feet, tile, stairs, and more.", cta: "Open CutList ->", visual: "tools" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Core planners</p>${tools.slice(0, 4).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Shop calculators</p>${tools.slice(4, 8).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Tool hubs</p>${menuLink({ href: "/tools/", icon: "TL", title: "All tools", description: "Open the full calculator and planning hub.", exact: true })}${menuLink({ href: "/material-library/", icon: "ML", title: "Material library", description: "Browse materials, specs, and planning references." })}${menuLink({ href: "/material-list-generator/", icon: "MT", title: "Material list", description: "Turn project inputs into a material checklist." })}${menuLink({ href: "/inch-mm-converter/", icon: "IN", title: "Inch/mm converter", description: "Convert workshop dimensions quickly." })}</div></div></div></div><div class="nav-menu-item"><a class="nav-trigger" href="/apps/" aria-haspopup="true" aria-expanded="false">Apps</a><div class="mega-menu" role="group" aria-label="Apps menu">${megaFeature({ href: "/apps/", title: "iPhone apps for saved workflows", description: "Use the website for quick checks, then move repeatable projects into focused iPhone apps when you need saved records.", cta: "Browse apps ->", visual: "apps" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Planning apps</p>${apps.slice(0, 3).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Document apps</p>${apps.slice(3, 6).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">More apps</p>${apps.slice(6, 8).map(menuLink).join("")}${menuLink({ href: "/apps/compare/", icon: "VS", title: "App comparisons", description: "Compare app workflows against common alternatives." })}</div></div></div></div><div class="nav-menu-item"><a class="nav-trigger" href="/learn/" aria-haspopup="true" aria-expanded="false">Resources</a><div class="mega-menu" role="group" aria-label="Resources menu">${megaFeature({ href: "/learn/", title: "Learn before you cut", description: "Use guides, comparisons, templates, glossary entries, and species references to reduce rework before buying material.", cta: "Open learning hub ->", visual: "resources" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Guides</p>${resources.slice(0, 3).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">References</p>${resources.slice(3, 6).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Site</p>${menuLink({ href: "/privacy-policy/", icon: "PV", title: "Privacy", description: "Read the privacy policy for the website and tools." })}${menuLink({ href: "/terms-of-service/", icon: "TS", title: "Terms", description: "Review the website terms of service." })}${menuLink({ href: "/disclaimer/", icon: "DS", title: "Disclaimer", description: "Read estimating, safety, and third-party link limitations." })}${menuLink({ href: "/sitemap.xml", icon: "SM", title: "Sitemap", description: "Open the XML sitemap for all indexed pages." })}</div></div></div></div></div>`;
  }

  function header() {
    const [label, href] = ctaFor();
    return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a>${navLinks()}<a class="button small nav-download-cta" href="${href}" rel="nofollow noopener">${label}</a></nav></header>`;
  }

  function footerColumn(title, links) {
    return `<div class="footer-column"><h2>${title}</h2>${links.map(({ href, label, rel = "" }) => `<a href="${href}"${rel ? ` rel="${rel}"` : ""}>${label}</a>`).join("")}</div>`;
  }

  function footer() {
    const product = [
      { href: "/cutlist/", label: "CutList" },
      { href: "/apps/cutlist/", label: "CutList iPhone app" },
      { href: "/plywood-cut-calculator/", label: "Plywood calculator" },
      { href: "/cut-list-calculator/", label: "Cut list calculator" },
      { href: "/quiltfit/", label: "QuiltFit" },
      { href: "/apps/quiltfit/", label: "QuiltFit app" },
      { href: "/stringer/", label: "Stair stringer" },
      { href: "/apps/stringer/", label: "Stringer app" },
      { href: "/tile-calculator/", label: "Tile calculator" },
      { href: "/tools/", label: "All tools" }
    ];

    const planning = [
      { href: "/templates/kitchen-cabinet-cut-list/", label: "Kitchen cabinet cut list" },
      { href: "/templates/bookcase-cut-list/", label: "Bookcase template" },
      { href: "/templates/workbench-cut-list/", label: "Workbench template" },
      { href: "/learn/how-many-sheets-of-plywood-do-i-need/", label: "Sheet count guide" },
      { href: "/learn/how-to-reduce-plywood-waste/", label: "Reduce plywood waste" },
      { href: "/learn/grain-direction-in-plywood-layouts/", label: "Grain direction" },
      { href: "/learn/saw-kerf-explained/", label: "Saw kerf explained" },
      { href: "/learn/project-cost-estimate-from-cut-list/", label: "Project cost estimate" },
      { href: "/compare/best-way-to-create-a-wood-cut-list/", label: "Choose a cut list workflow" },
      { href: "/compare/cut-list-app-vs-spreadsheet/", label: "App vs spreadsheet" }
    ];

    const resources = [
      { href: "/learn/", label: "Learning hub" },
      { href: "/templates/", label: "Templates" },
      { href: "/compare/", label: "Comparisons" },
      { href: "/glossary/", label: "Glossary" },
      { href: "/wood/", label: "Wood species" },
      { href: "/material-library/", label: "Material library" },
      { href: "/blog/", label: "Blog" },
      { href: "/apps/", label: "App library" },
      { href: "mailto:727268425@qq.com", label: "Contact" },
      { href: "/sitemap.xml", label: "Sitemap" }
    ];

    const legal = [
      { href: "/privacy-policy/", label: "Privacy Policy" },
      { href: "/terms-of-service/", label: "Terms of Service" },
      { href: "/disclaimer/", label: "Disclaimer" },
      { href: "/cookie-policy/", label: "Cookie Policy" },
      { href: "/copyright-notice/", label: "Copyright Notice" },
      { href: "/acceptable-use-policy/", label: "Acceptable Use" },
      { href: "/external-links-policy/", label: "External Links" }
    ];

    return `<footer class="site-footer"><div class="footer-inner"><nav class="footer-directory" aria-label="Footer navigation">${footerColumn("Product", product)}${footerColumn("Planning", planning)}${footerColumn("Resources", resources)}${footerColumn("Legal", legal)}</nav><div class="footer-bottom"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><p class="muted">© 2026 WoodCutTool</p><div class="footer-actions">${languagePicker}</div></div></div></footer>`;
  }

  function mount(selector, fallbackSelector, html, insertFallback) {
    const target = document.querySelector(selector);
    if (target) {
      target.outerHTML = html;
      return;
    }

    const fallback = document.querySelector(fallbackSelector);
    if (fallback) {
      fallback.outerHTML = html;
      return;
    }

    insertFallback(html);
  }

  function renderSiteChrome() {
    mount("[data-site-header]", ".site-header", header(), (html) => {
      const skipLink = document.querySelector(".skip-link");
      if (skipLink) {
        skipLink.insertAdjacentHTML("afterend", html);
      } else {
        document.body.insertAdjacentHTML("afterbegin", html);
      }
    });

    mount("[data-site-footer]", ".site-footer", footer(), (html) => {
      document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  renderSiteChrome();
})();
