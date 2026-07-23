(function () {
  const appStoreLinks = {
    cutlist: "/go/cutlist/?source=navigation&placement=header",
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
    const cutListRoute = (
      current === "/" ||
      /^\/(cutlist|cut-list|plywood|cabinet-cut-list)/.test(current) ||
      current.startsWith("/apps/cutlist/") ||
      current.startsWith("/templates/") ||
      current.startsWith("/examples/") ||
      current.startsWith("/troubleshooting/") ||
      current.startsWith("/learn/") ||
      (current.startsWith("/blog/") && /(cutlist|cut-list|plywood|cabinet|sheet-layout|kerf|wood-waste)/.test(current))
    );
    if (cutListRoute) return ["Get CutList", appStoreLinks.cutlist];
    if (current.startsWith("/apps/") || current.startsWith("/blog/")) return ["Explore Apps", "/apps/"];
    return ["Browse Tools", "/tools/"];
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
    if (type === "templates") {
      return `<span class="mega-visual mega-visual-templates" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-grid" d="M28 34H292M28 70H292M28 106H292M28 142H292M64 18V172M108 18V172M152 18V172M196 18V172M240 18V172"/><rect class="mega-svg-paper" x="62" y="26" width="196" height="138" rx="9"/><path class="mega-svg-wood" d="M83 47h68v96H83zM169 47h68v42h-68zM169 101h68v42h-68z"/><path class="mega-svg-line" d="M117 47v96M169 72h68M169 122h68"/><circle class="mega-svg-accent" cx="143" cy="95" r="4"/><circle class="mega-svg-accent" cx="181" cy="72" r="3"/><circle class="mega-svg-accent" cx="181" cy="122" r="3"/><path class="mega-svg-measure" d="M76 153h168M76 148v10M244 148v10"/></svg></span>`;
    }
    if (type === "learn") {
      return `<span class="mega-visual mega-visual-learn" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M43 150c56-14 176-14 234 0-46 25-191 25-234 0z"/><path class="mega-svg-paper" d="M42 48c42-12 83-5 118 18v91c-35-23-76-30-118-18z"/><path class="mega-svg-paper" d="M278 48c-42-12-83-5-118 18v91c35-23 76-30 118-18z"/><path class="mega-svg-line" d="M160 66v91M63 72c31-5 56 0 78 13M63 91c31-5 56 0 78 13M63 110c31-5 56 0 78 13M179 85c22-13 47-18 78-13M179 104c22-13 47-18 78-13M179 123c22-13 47-18 78-13"/><path class="mega-svg-accent-fill" d="M211 33h23v51l-11.5-8-11.5 8z"/><path class="mega-svg-pencil" d="M70 48l30-22 10 14-30 22-15 4z"/><path class="mega-svg-pencil-tip" d="M65 66l5-18 10 14z"/></svg></span>`;
    }
    if (type === "checklists") {
      return `<span class="mega-visual mega-visual-checklists" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M53 160c50-12 164-12 214 0-40 20-174 20-214 0z"/><rect class="mega-svg-paper" x="65" y="22" width="190" height="140" rx="12"/><rect class="mega-svg-accent-fill" x="121" y="13" width="78" height="24" rx="10"/><path class="mega-svg-line" d="M118 65h101M118 93h101M118 121h101M118 149h74"/><path class="mega-svg-accent-fill" d="M83 60l8 8 16-18 7 7-23 26-15-15zM83 88l8 8 16-18 7 7-23 26-15-15zM83 116l8 8 16-18 7 7-23 26-15-15zM83 144l8 8 16-18 7 7-23 26-15-15z"/></svg></span>`;
    }
    if (type === "blog") {
      return `<span class="mega-visual mega-visual-blog" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><rect class="mega-svg-paper" x="47" y="24" width="226" height="144" rx="10"/><path class="mega-svg-browser" d="M47 52h226M63 38h1M76 38h1M89 38h1"/><rect class="mega-svg-photo" x="67" y="69" width="82" height="66" rx="6"/><path class="mega-svg-photo-line" d="M73 125l22-26 17 17 12-13 19 22"/><circle class="mega-svg-sun" cx="126" cy="84" r="8"/><path class="mega-svg-heading" d="M168 72h72M168 86h54"/><path class="mega-svg-line" d="M168 106h72M168 118h64M168 130h69M67 149h173"/><rect class="mega-svg-accent-fill" x="219" y="15" width="50" height="24" rx="12"/><path class="mega-svg-pen" d="M244 141l35-35 10 10-35 35-17 7z"/></svg></span>`;
    }
    if (type === "compare") {
      return `<span class="mega-visual mega-visual-compare" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><rect class="mega-svg-card-left" x="32" y="35" width="108" height="120" rx="10"/><rect class="mega-svg-card-right" x="180" y="35" width="108" height="120" rx="10"/><path class="mega-svg-material-left" d="M50 54h72v42H50z"/><path class="mega-svg-material-right" d="M198 54h72v42h-72z"/><path class="mega-svg-line-light" d="M50 112h56M50 126h70M50 140h48M198 112h56M198 126h70M198 140h48"/><circle class="mega-svg-vs" cx="160" cy="95" r="25"/><path class="mega-svg-vs-text" d="M147 87l8 18 8-18M166 103c4 3 10 2 10-2 0-7-12-4-12-10 0-5 8-7 13-3"/><path class="mega-svg-arrow-left" d="M145 53h-24l8-8M121 53l8 8"/><path class="mega-svg-arrow-right" d="M175 137h24l-8-8M199 137l-8 8"/></svg></span>`;
    }
    if (type === "glossary") {
      return `<span class="mega-visual mega-visual-glossary" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><rect class="mega-svg-paper" x="69" y="28" width="182" height="134" rx="10"/><path class="mega-svg-tabs" d="M69 53h-18V38h18M69 83h-25V68h25M69 113h-18V98h18M69 143h-25v-15h25"/><text class="mega-svg-letter" x="88" y="81">A</text><path class="mega-svg-heading" d="M126 59h88M126 75h64"/><path class="mega-svg-line" d="M89 103h126M89 117h111M89 131h121"/><circle class="mega-svg-search" cx="229" cy="126" r="25"/><path class="mega-svg-search-handle" d="M247 144l25 25"/><path class="mega-svg-search-line" d="M218 120h22M218 129h15"/></svg></span>`;
    }
    return `<span class="mega-visual mega-visual-tools" aria-hidden="true"><span class="mega-visual-sheet"><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span><span class="mega-visual-piece"></span></span></span>`;
  }

  function megaFeature({ href, title, description, cta, visual = "tools" }) {
    return `<a class="mega-feature" href="${href}">${megaVisual(visual)}<strong>${title}</strong><span>${description}</span><span class="card-link">${cta}</span></a>`;
  }

  function resourceNavMenu({ href, label, featureTitle, featureDescription, featureCta, visual, columns }) {
    return `<div class="nav-menu-item"><a class="nav-trigger${activeClass(href)}" href="${href}" aria-haspopup="true" aria-expanded="false">${label}</a><div class="mega-menu" role="group" aria-label="${label} menu">${megaFeature({ href, title: featureTitle, description: featureDescription, cta: featureCta, visual })}<div class="mega-columns">${columns.map((column) => `<div class="mega-column"><p class="mega-column-title">${column.title}</p>${column.links.map(menuLink).join("")}</div>`).join("")}</div></div></div>`;
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
      { href: "/apps/jobphotolog-work-reports/", icon: "JP", title: "JobPhotoLog", description: "Organize jobsite photos, before-and-after proof, signatures, punch lists, and PDF reports." },
      { href: "/apps/snapreceipt-expenses-and-tax/", icon: "SR", title: "SnapReceipt", description: "Scan receipts and prepare expense or tax records." },
      { href: "/apps/pdf-scan-scanner-and-reader/", icon: "PS", title: "PDF Scan", description: "Turn paper documents into readable PDFs." },
      { href: "/apps/snaplabel-photo-text-label/", icon: "SL", title: "SnapLabel", description: "Create photo labels for storage, products, boxes, and home organization." },
      { href: "/apps/tinnitus-relief-sound-masking/", aliases: ["/tinnitus/"], icon: "TN", title: "Tinnitus Relief", description: "Masking sounds and hearing-profile tools for iPhone." },
      { href: "/apps/", icon: "AP", title: "All apps", description: "Browse the full app library and comparisons.", exact: true }
    ];

    const resources = [
      { href: "/learn/", icon: "LN", title: "Learn", description: "Workflows for planning cuts, stairs, tile, and materials." },
      { href: "/checklists/", icon: "CK", title: "Checklists", description: "Release checks for planning, cutting, assembly, installation, and handoff." },
      { href: "/troubleshooting/", icon: "FX", title: "Troubleshooting", description: "Diagnose layout, cutting, cabinet, material, and workflow failures." },
      { href: "/examples/", icon: "EX", title: "Cut list examples", description: "Real parts, plywood layouts, sheet counts, and CSV downloads." },
      { href: "/blog/", icon: "BG", title: "Blog", description: "Project guides, app workflows, and planning examples." },
      { href: "/compare/", icon: "CP", title: "Compare", description: "Tool and material comparisons before choosing a path." },
      { href: "/templates/", icon: "TP", title: "Templates", description: "Reusable planning starts for common shop projects." },
      { href: "/glossary/", icon: "GL", title: "Glossary", description: "Cut list, plywood, joinery, and measurement terms." },
      { href: "/wood/", aliases: ["/wood-database/"], icon: "WD", title: "Wood species", description: "Reference density, hardness, and planning notes." }
    ];

    const templateMenu = {
      href: "/templates/", label: "Templates", visual: "templates", featureTitle: "Start from a project-ready cut list", featureDescription: "Use indexed cabinet, drawer, shelving, bookcase, workbench, and plywood templates before optimizing the finished parts.", featureCta: "Browse templates ->",
      columns: [
        { title: "Cabinets", links: [
          { href: "/templates/kitchen-cabinet-cut-list/", icon: "KC", title: "Kitchen cabinets", description: "Base and wall cabinet plywood parts." },
          { href: "/templates/drawer-box-cut-list/", icon: "DB", title: "Drawer boxes", description: "Sides, fronts, backs, bottoms, and clearances." }
        ] },
        { title: "Shelving", links: [
          { href: "/templates/closet-shelving-cut-list/", icon: "CS", title: "Closet shelving", description: "Towers, shelves, cleats, and repeated parts." },
          { href: "/templates/bookcase-cut-list/", icon: "BK", title: "Bookcase", description: "Sides, shelves, top, bottom, and back." }
        ] },
        { title: "More templates", links: [
          { href: "/templates/workbench-cut-list/", icon: "WB", title: "Workbench", description: "Top, legs, aprons, shelf, and bracing." },
          { href: "/templates/", icon: "TP", title: "All templates", description: "Browse every reusable project starting point.", exact: true }
        ] }
      ]
    };

    const learnMenu = {
      href: "/learn/", label: "Learn", visual: "learn", featureTitle: "Learn the method behind the calculator", featureDescription: "Move from a search question to a measured workflow for plywood, cabinets, stairs, decks, fences, and roofing.", featureCta: "Browse learning guides ->",
      columns: [
        { title: "Woodworking", links: [
          { href: "/learn/woodworking/", icon: "WW", title: "Woodworking hub", description: "Cut lists, cabinets, lumber, and shop planning." },
          { href: "/learn/plywood/", icon: "PW", title: "Plywood hub", description: "Sheet count, kerf, grain, layout, and waste." },
          { href: "/troubleshooting/", icon: "FX", title: "Troubleshooting", description: "Diagnose fit, cutting, cabinet, and material failures." },
          { href: "/checklists/", icon: "CK", title: "Woodworking checklists", description: "Verify release gates before ordering, cutting, assembly, and installation." },
          { href: "/examples/", icon: "EX", title: "Cut list examples", description: "Download project parts and inspect modeled layouts." }
        ] },
        { title: "Construction", links: [
          { href: "/learn/stairs/", icon: "ST", title: "Stairs", description: "Rise, run, tread, stringer, and angle guides." },
          { href: "/learn/deck/", icon: "DK", title: "Deck", description: "Boards, stairs, finish, and material planning." },
          { href: "/learn/tile-calculator-inputs-explained/", icon: "TI", title: "Tile planning", description: "Measurements, layout, grout, pattern, boxes, and waste." },
          { href: "/learn/material-estimation-for-carpentry/", icon: "ME", title: "Material estimates", description: "Quantities, stock groups, waste, cost, and purchasing checks." }
        ] },
        { title: "Outdoor", links: [
          { href: "/learn/fence/", icon: "FN", title: "Fence", description: "Posts, pickets, spacing, concrete, and finish." },
          { href: "/learn/roofing/", icon: "RF", title: "Roofing", description: "Pitch, rafter geometry, area, and shingles." },
          { href: "/learn/playhouse-plywood-material-guide/", icon: "PH", title: "Playhouse projects", description: "Plywood, openings, weather exposure, safety, and material planning." },
          { href: "/examples/outdoor-storage-box-cut-list/", icon: "OS", title: "Outdoor storage", description: "Parts, sheet layout, drainage, ventilation, and weather-ready planning." }
        ] }
      ]
    };

    const checklistsMenu = {
      href: "/checklists/", label: "Checklists", visual: "checklists", featureTitle: "Verify the work before it becomes rework", featureDescription: "Use 70 release-ready checklists across planning, purchasing, cutting, assembly, cabinets, installation, finishing, and handoff.", featureCta: "Browse all checklists ->",
      columns: [
        { title: "Plan & purchase", links: [
          { href: "/checklists/#planning-measurement", icon: "PM", title: "Planning & measurement", description: "Freeze dimensions, datums, tolerances, and revisions." },
          { href: "/checklists/#materials-purchasing", icon: "MP", title: "Materials & purchasing", description: "Verify stock, thickness, quantity, moisture, and orders." }
        ] },
        { title: "Build & fit", links: [
          { href: "/checklists/#cutting-machining", icon: "CM", title: "Cutting & machining", description: "Release first cuts, setups, references, and batch work." },
          { href: "/checklists/#assembly-joinery", icon: "AJ", title: "Assembly & joinery", description: "Dry-fit joints, hardware, glue-ups, and tolerances." },
          { href: "/checklists/#cabinets-hardware", icon: "CH", title: "Cabinets & hardware", description: "Check openings, overlays, slides, backs, and toe kicks." }
        ] },
        { title: "Install & finish", links: [
          { href: "/checklists/#installation-site-work", icon: "IS", title: "Installation & site work", description: "Confirm walls, openings, clearances, levels, and access." },
          { href: "/checklists/#finishing-handoff", icon: "FH", title: "Finishing & handoff", description: "Release samples, cure limits, punch work, and closeout." },
          { href: "/checklists/", icon: "CK", title: "All 70 checklists", description: "Browse the complete release-control library.", exact: true }
        ] }
      ]
    };

    const blogMenu = {
      href: "/blog/", label: "Blog", visual: "blog", featureTitle: "Practical project and calculator articles", featureDescription: "Read current workflows, benchmarks, mistakes, and planning examples, then move directly into the matching tool.", featureCta: "Open all blog posts ->",
      columns: [
        { title: "Cut lists", links: [
          { href: "/blog/plywood-waste-cost-benchmark-manual-vs-optimizer/", icon: "PW", title: "Plywood waste benchmark", description: "Compare manual planning with an optimizer." },
          { href: "/blog/best-plywood-cutting-workflow-2026/", icon: "PL", title: "Plywood workflow", description: "A current start-to-finish cutting workflow." }
        ] },
        { title: "Cabinets", links: [
          { href: "/blog/cabinet-cut-list-mistakes/", icon: "CB", title: "Cabinet cut-list mistakes", description: "Avoid repeated panel and clearance errors." },
          { href: "/blog/cutlist-shop-workflow-from-bid-to-cut/", icon: "SH", title: "Shop workflow", description: "Move from estimate to a cut-ready plan." }
        ] },
        { title: "Construction", links: [
          { href: "/blog/stair-stringer-design-rise-run-basics/", icon: "ST", title: "Stair stringer basics", description: "Understand rise, run, tread, and stringer geometry." },
          { href: "/blog/deck-stair-stringer-field-measurements/", icon: "DK", title: "Deck stair measurements", description: "Capture field dimensions before layout." }
        ] }
      ]
    };

    const compareMenu = {
      href: "/compare/", label: "Compare", visual: "compare", featureTitle: "Compare materials, tools, and workflows", featureDescription: "Check the tradeoffs that change dimensions, construction choices, material costs, and the next calculator input.", featureCta: "Browse comparisons ->",
      columns: [
        { title: "Cut-list methods", links: [
          { href: "/compare/best-way-to-create-a-wood-cut-list/", icon: "CL", title: "Create a cut list", description: "Compare practical cut-list workflows." },
          { href: "/compare/cut-list-template-vs-cut-list-calculator/", icon: "VS", title: "Template vs calculator", description: "Choose a reusable start or live calculation." },
          { href: "/compare/batch-cutting-vs-part-by-part-cutting/", icon: "BT", title: "Batch vs one-by-one", description: "Compare repeat accuracy, setup time, labels, and revision risk." }
        ] },
        { title: "Cabinets", links: [
          { href: "/compare/face-frame-vs-frameless-cabinets/", icon: "CF", title: "Face frame vs frameless", description: "See how construction changes cabinet parts." },
          { href: "/compare/inset-vs-overlay-cabinet-doors/", icon: "DR", title: "Inset vs overlay doors", description: "Compare door sizing and reveal choices." },
          { href: "/compare/applied-vs-captured-cabinet-backs/", icon: "BK", title: "Applied vs captured backs", description: "Compare case depth, grooves, squaring, and assembly order." }
        ] },
        { title: "Hardware", links: [
          { href: "/compare/drawer-slides-side-mount-vs-undermount/", icon: "DS", title: "Drawer slide types", description: "Compare clearances and installation tradeoffs." },
          { href: "/compare/pocket-screws-vs-confirmat-screws/", icon: "SC", title: "Pocket vs confirmat screws", description: "Compare drilling, panel fit, visibility, and assembly control." },
          { href: "/compare/", icon: "CP", title: "All comparisons", description: "Browse every comparison page.", exact: true }
        ] }
      ]
    };

    const glossaryMenu = {
      href: "/glossary/", label: "Glossary", visual: "glossary", featureTitle: "Look up woodworking and planning terms", featureDescription: "Understand cut diagrams, kerf, grain direction, sheet layout, joinery, and measurement terms before using the calculators.", featureCta: "Open the glossary ->",
      columns: [
        { title: "Cut planning", links: [
          { href: "/glossary/cut-diagram/", icon: "CD", title: "Cut diagram", description: "Read a visual stock and part layout." },
          { href: "/glossary/kerf/", icon: "KF", title: "Kerf", description: "Material removed by a saw blade." }
        ] },
        { title: "Material", links: [
          { href: "/glossary/grain-direction/", icon: "GR", title: "Grain direction", description: "Orient visible faces and structural grain." },
          { href: "/wood/", icon: "WD", title: "Wood species", description: "Compare hardness, density, weight, and use." }
        ] },
        { title: "Directory", links: [
          { href: "/material-library/", icon: "ML", title: "Material library", description: "Compare common sheet and project materials." },
          { href: "/glossary/", icon: "GL", title: "All glossary terms", description: "Browse the complete alphabetical glossary.", exact: true }
        ] }
      ]
    };

    return `<div class="nav-links nav-links-mega"><div class="nav-menu-item"><a class="nav-trigger" href="/tools/" aria-haspopup="true" aria-expanded="false">Tools</a><div class="mega-menu" role="group" aria-label="Tools menu">${megaFeature({ href: "/tools/", title: "Choose a calculator by project", description: "Browse focused woodworking and construction tools without mixing unrelated app categories into the planning hub.", cta: "Browse tools ->", visual: "tools" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Woodworking Tools</p>${menuLink({ href: "/tools/woodworking/", icon: "WW", title: "Woodworking hub", description: "Cut and layout, cabinets, furniture, wood, and materials." })}${tools.slice(0, 3).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Construction Tools</p>${menuLink({ href: "/tools/construction/", icon: "CN", title: "Construction hub", description: "Stairs, tile, deck, fence, wall, roof, and concrete." })}${tools.slice(3, 6).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Tool directory</p>${menuLink({ href: "/tools/", icon: "TL", title: "All tools", description: "Open the full calculator and planning hub.", exact: true })}${menuLink({ href: "/material-library/", icon: "ML", title: "Material library", description: "Browse materials, specs, and planning references." })}${menuLink({ href: "/material-list-generator/", icon: "MT", title: "Material list", description: "Turn project inputs into a material checklist." })}${menuLink({ href: "/inch-mm-converter/", icon: "IN", title: "Inch/mm converter", description: "Convert workshop dimensions quickly." })}</div></div></div></div>${resourceNavMenu(templateMenu)}${resourceNavMenu(learnMenu)}${resourceNavMenu(checklistsMenu)}${resourceNavMenu(blogMenu)}${resourceNavMenu(compareMenu)}${resourceNavMenu(glossaryMenu)}<div class="nav-menu-item"><a class="nav-trigger" href="/apps/" aria-haspopup="true" aria-expanded="false">Apps</a><div class="mega-menu" role="group" aria-label="Apps menu">${megaFeature({ href: "/apps/", title: "iPhone apps for saved workflows", description: "Use the website for quick checks, then move repeatable projects into focused iPhone apps when you need saved records.", cta: "Browse apps ->", visual: "apps" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Planning apps</p>${apps.slice(0, 3).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Document apps</p>${apps.slice(3, 6).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">More apps</p>${apps.slice(6, 9).map(menuLink).join("")}${menuLink({ href: "/apps/compare/", icon: "VS", title: "App comparisons", description: "Compare app workflows against common alternatives." })}</div></div></div></div></div>`;
  }

  function header() {
    const [label, href] = ctaFor();
    const isStoreLink = href.includes("apps.apple.com") || href.startsWith("/go/cutlist/");
    return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a>${navLinks()}<a class="button small nav-download-cta" href="${href}"${isStoreLink ? ' data-app-store-link data-platform-label data-conversion-placement="navigation" rel="nofollow noopener"' : ""}>${label}</a></nav></header>`;
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
      { href: "/about/", label: "About & editorial process" },
      { href: "/research/", label: "Research & datasets" },
      { href: "/troubleshooting/", label: "Troubleshooting" },
      { href: "/checklists/", label: "Woodworking checklists" },
      { href: "/examples/", label: "Cut list examples" },
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
