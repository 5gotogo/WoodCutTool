(function () {
  const appStoreLinks = {
    cutlist: "/go/cutlist/?source=navigation&placement=header",
    tilefit: "https://apps.apple.com/us/app/tilefit-tile-layout-planner/id6792627022",
    quiltfit: "https://apps.apple.com/us/app/quiltfit-quilt-design-planner/id6776541705",
    stringer: "https://apps.apple.com/us/app/stringer-stair-layout/id6784882437?uo=4",
    snaplabel: "https://apps.apple.com/us/app/snaplabel-photo-text-label/id6751947372",
    moodloop: "https://apps.apple.com/us/app/moodloop-mood-tracker-journal/id6797190025",
    tinnitus: "https://apps.apple.com/us/app/tinnitus-relief-sound-masking/id6782496783"
  };

  const languagePicker = `<label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label>`;

  function route() {
    return window.location.pathname || "/";
  }

  function ctaFor() {
    const current = route();
    if (
      current === "/tile-calculator/" ||
      current.startsWith("/apps/tilefit-tile-layout-planner/") ||
      current.startsWith("/legal/TileFit/")
    ) {
      return ["Download TileFit", appStoreLinks.tilefit];
    }
    if (
      current.startsWith("/apps/moodloop-mood-tracker-journal/") ||
      current.startsWith("/legal/MoodLoop/")
    ) {
      return ["Get MoodLoop", appStoreLinks.moodloop];
    }
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
      current.startsWith("/tools/components/") ||
      current.startsWith("/examples/") ||
      current.startsWith("/troubleshooting/") ||
      current.startsWith("/worksheets/") ||
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
    if (type === "resources") {
      return `<span class="mega-visual mega-visual-resources" aria-hidden="true"><span class="mega-resource-book">Research</span><span class="mega-resource-card mega-resource-card-one"><span></span><span></span><span></span></span><span class="mega-resource-card mega-resource-card-two"><span></span><span></span><span></span></span><span class="mega-resource-chip">Open data</span></span>`;
    }
    if (type === "templates") {
      return `<span class="mega-visual mega-visual-templates" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-grid" d="M28 34H292M28 70H292M28 106H292M28 142H292M64 18V172M108 18V172M152 18V172M196 18V172M240 18V172"/><rect class="mega-svg-paper" x="62" y="26" width="196" height="138" rx="9"/><path class="mega-svg-wood" d="M83 47h68v96H83zM169 47h68v42h-68zM169 101h68v42h-68z"/><path class="mega-svg-line" d="M117 47v96M169 72h68M169 122h68"/><circle class="mega-svg-accent" cx="143" cy="95" r="4"/><circle class="mega-svg-accent" cx="181" cy="72" r="3"/><circle class="mega-svg-accent" cx="181" cy="122" r="3"/><path class="mega-svg-measure" d="M76 153h168M76 148v10M244 148v10"/></svg></span>`;
    }
    if (type === "projects") {
      return `<span class="mega-visual mega-visual-projects" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M39 158c58-15 186-15 243 0-48 23-198 23-243 0z"/><rect class="mega-svg-paper" x="39" y="24" width="242" height="136" rx="12"/><path class="mega-svg-grid" d="M56 48H264M56 75H264M56 102H264M56 129H264M91 38V146M145 38V146M199 38V146M253 38V146"/><path class="mega-svg-wood" d="M59 53h62v70H59zM68 62h20v52H68zM95 62h17v23H95zM95 92h17v22H95z"/><path class="mega-svg-heading" d="M145 55h91M145 68h64"/><path class="mega-svg-line" d="M145 92h98M145 117h98"/><circle class="mega-svg-accent" cx="153" cy="92" r="7"/><circle class="mega-svg-accent-fill" cx="197" cy="92" r="7"/><circle class="mega-svg-accent-fill" cx="241" cy="92" r="7"/><path class="mega-svg-line-light" d="M160 92h30M204 92h30"/><path class="mega-svg-line" d="M193 92l3 3 6-7M237 92l3 3 6-7"/><rect class="mega-svg-accent-fill" x="145" y="126" width="98" height="13" rx="6.5"/></svg></span>`;
    }
    if (type === "learn") {
      return `<span class="mega-visual mega-visual-learn" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M43 150c56-14 176-14 234 0-46 25-191 25-234 0z"/><path class="mega-svg-paper" d="M42 48c42-12 83-5 118 18v91c-35-23-76-30-118-18z"/><path class="mega-svg-paper" d="M278 48c-42-12-83-5-118 18v91c35-23 76-30 118-18z"/><path class="mega-svg-line" d="M160 66v91M63 72c31-5 56 0 78 13M63 91c31-5 56 0 78 13M63 110c31-5 56 0 78 13M179 85c22-13 47-18 78-13M179 104c22-13 47-18 78-13M179 123c22-13 47-18 78-13"/><path class="mega-svg-accent-fill" d="M211 33h23v51l-11.5-8-11.5 8z"/><path class="mega-svg-pencil" d="M70 48l30-22 10 14-30 22-15 4z"/><path class="mega-svg-pencil-tip" d="M65 66l5-18 10 14z"/></svg></span>`;
    }
    if (type === "checklists") {
      return `<span class="mega-visual mega-visual-checklists" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M53 160c50-12 164-12 214 0-40 20-174 20-214 0z"/><rect class="mega-svg-paper" x="65" y="22" width="190" height="140" rx="12"/><rect class="mega-svg-accent-fill" x="121" y="13" width="78" height="24" rx="10"/><path class="mega-svg-line" d="M118 65h101M118 93h101M118 121h101M118 149h74"/><path class="mega-svg-accent-fill" d="M83 60l8 8 16-18 7 7-23 26-15-15zM83 88l8 8 16-18 7 7-23 26-15-15zM83 116l8 8 16-18 7 7-23 26-15-15zM83 144l8 8 16-18 7 7-23 26-15-15z"/></svg></span>`;
    }
    if (type === "worksheets") {
      return `<span class="mega-visual mega-visual-worksheets" aria-hidden="true"><svg viewBox="0 0 320 190" focusable="false"><path class="mega-svg-shadow" d="M49 160c51-13 170-13 222 0-43 21-180 21-222 0z"/><rect class="mega-svg-paper" x="58" y="20" width="204" height="142" rx="11"/><path class="mega-svg-heading" d="M82 48h94M82 62h62"/><path class="mega-svg-line" d="M82 88h154M82 112h154M82 136h154M118 76v72M199 76v72"/><rect class="mega-svg-accent-fill" x="211" y="34" width="27" height="27" rx="5"/><path class="mega-svg-line-light" d="M218 47h13M224.5 40v14"/></svg></span>`;
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

  function navMenuItem({ href, label, menu, aliases = [] }) {
    const isCurrent = isActive(href, aliases);
    return `<div class="nav-menu-item${isCurrent ? " active" : ""}"><div class="nav-menu-control"><a class="nav-trigger${isCurrent ? " active" : ""}" href="${href}">${label}</a><button class="nav-menu-toggle" type="button" aria-label="Open ${label} menu" aria-haspopup="true" aria-expanded="false"><span class="visually-hidden">Open ${label} menu</span></button></div>${menu}</div>`;
  }

  function resourceNavMenu({ href, label, aliases = [], featureTitle, featureDescription, featureCta, visual, columns }) {
    const menu = `<div class="mega-menu" role="group" aria-label="${label} menu">${megaFeature({ href, title: featureTitle, description: featureDescription, cta: featureCta, visual })}<div class="mega-columns">${columns.map((column) => `<div class="mega-column"><p class="mega-column-title">${column.title}</p>${column.links.map(menuLink).join("")}</div>`).join("")}</div></div>`;
    return navMenuItem({ href, label, menu, aliases });
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
      { href: "/apps/tilefit-tile-layout-planner/", icon: "TI", title: "TileFit app", description: "Plan tile patterns, quantities, grouped cuts, installation order, and PDF exports." },
      { href: "/apps/stringer/", aliases: ["/apps/stringer-stair-layout/"], icon: "ST", title: "Stringer app", description: "Keep stair layouts, code checks, and cut sheets together." },
      { href: "/apps/jobphotolog-work-reports/", icon: "JP", title: "JobPhotoLog", description: "Organize jobsite photos, before-and-after proof, signatures, punch lists, and PDF reports." },
      { href: "/apps/snapreceipt-expenses-and-tax/", icon: "SR", title: "SnapReceipt", description: "Scan receipts and prepare expense or tax records." },
      { href: "/apps/pdf-scan-scanner-and-reader/", icon: "PS", title: "PDF Scan", description: "Turn paper documents into readable PDFs." },
      { href: "/apps/moodloop-mood-tracker-journal/", icon: "ML", title: "MoodLoop", description: "Track daily moods, notes, patterns, and personal insights privately on iPhone." },
      { href: "/apps/tinnitus-relief-sound-masking/", aliases: ["/tinnitus/"], icon: "TN", title: "Tinnitus Relief", description: "Masking sounds and hearing-profile tools for iPhone." },
      { href: "/apps/", icon: "AP", title: "All apps", description: "Browse the full app library and comparisons.", exact: true }
    ];

    const resources = [
      { href: "/projects/", icon: "PJ", title: "Guided projects", description: "Follow 18 project playbooks with key decisions and browser-local progress." },
      { href: "/one-sheet-projects/", icon: "1S", title: "One-sheet projects", description: "Explore 43 modeled 4×8 layouts with templates and downloadable cut lists." },
      { href: "/learn/", icon: "LN", title: "Learn", description: "Workflows for planning cuts, stairs, tile, and materials." },
      { href: "/checklists/", icon: "CK", title: "Checklists", description: "Release checks for planning, cutting, assembly, installation, and handoff." },
      { href: "/worksheets/", icon: "WS", title: "Worksheets", description: "Printable records for measurements, materials, setups, installation, and closeout." },
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
          { href: "/worksheets/", icon: "WS", title: "Woodworking worksheets", description: "Record measurements, quantities, setups, installation, and closeout." },
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

    const worksheetsMenu = {
      href: "/worksheets/", label: "Worksheets", visual: "worksheets", featureTitle: "Record the project, not just the result", featureDescription: "Use 60 printable and downloadable records across field measurement, material planning, machine setup, assembly, installation, finishing, and closeout.", featureCta: "Browse all worksheets ->",
      columns: [
        { title: "Survey & plan", links: [
          { href: "/worksheets/#measurements-site-survey", icon: "MS", title: "Measurements & site survey", description: "Capture datums, openings, obstructions, access, square, level, and plumb." },
          { href: "/worksheets/#cut-list-material-planning", icon: "MP", title: "Cut list & material planning", description: "Record parts, sheet needs, stock groups, hardware, and orders." }
        ] },
        { title: "Build & install", links: [
          { href: "/worksheets/#machine-cutting-records", icon: "MC", title: "Machine & cutting records", description: "Preserve setups, first articles, samples, and batch checks." },
          { href: "/worksheets/#assembly-hardware-records", icon: "AH", title: "Assembly & hardware", description: "Track dry fits, glue-ups, geometry, hinges, and slides." },
          { href: "/worksheets/#installation-field-change-records", icon: "IF", title: "Installation & field change", description: "Document structure, leveling, scribing, anchoring, and changes." }
        ] },
        { title: "Finish & directory", links: [
          { href: "/worksheets/#finish-handoff-closeout", icon: "FC", title: "Finish, handoff & closeout", description: "Record samples, coats, cure, punch work, and final variance." },
          { href: "/checklists/", icon: "CK", title: "Release checklists", description: "Verify whether the evidence is complete enough to proceed." },
          { href: "/worksheets/", icon: "WS", title: "All 60 worksheets", description: "Browse the complete project-record library.", exact: true }
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

    const projectsMenu = {
      href: "/projects/",
      label: "Projects",
      aliases: ["/projects/", "/one-sheet-projects/", "/templates/", "/examples/", "/tools/components/", "/checklists/", "/worksheets/", "/troubleshooting/"],
      visual: "projects",
      featureTitle: "Build with 18 guided project playbooks",
      featureDescription: "Keep browser-local progress while you work through key measurements, decisions, parts, release checks, installation, and closeout.",
      featureCta: "Browse guided projects ->",
      columns: [
        { title: "Start", links: [
          { href: "/projects/", icon: "PJ", title: "Guided project playbooks", description: "Choose one of 18 end-to-end builds and continue your progress on this device.", exact: true },
          { href: "/one-sheet-projects/", icon: "1S", title: "One-sheet project gallery", description: "Filter 43 projects, preview each 4×8 layout, and download the cut list." },
          { href: "/tools/components/", icon: "CC", title: "Component calculators", description: "Build reusable cabinet parts and merge them into one project cut list." },
          { href: "/templates/", icon: "TP", title: "Templates", description: "Project-ready parts, constraints, and release checks.", exact: true },
          { href: "/examples/", icon: "EX", title: "Worked examples", description: "Parts, modeled layouts, sheet counts, and CSV files." },
          { href: "/material-list-generator/", icon: "ML", title: "Material list", description: "Turn confirmed project inputs into a buying list." }
        ] },
        { title: "Record", links: [
          { href: "/worksheets/", icon: "WS", title: "Worksheets", description: "Capture measurements, materials, setups, and closeout evidence." },
          { href: "/checklists/", icon: "CK", title: "Checklists", description: "Release planning, cutting, assembly, installation, and handoff." },
          { href: "/research/", icon: "RS", title: "Open datasets", description: "Inspect the assumptions behind sheet and kerf benchmarks." }
        ] },
        { title: "Recover", links: [
          { href: "/troubleshooting/", icon: "FX", title: "Troubleshooting", description: "Diagnose layout, cutting, cabinet, material, and workflow failures." },
          { href: "/learn/topics/cabinet-planning/", icon: "CB", title: "Cabinet planning", description: "Follow the cabinet workflow from inputs to field fit." },
          { href: "/learn/topics/furniture-projects/", icon: "FP", title: "Furniture projects", description: "Connect project decisions to templates, examples, and tools." }
        ] }
      ]
    };

    const resourcesMenu = {
      href: "/research/",
      label: "Resources",
      aliases: ["/compare/", "/blog/", "/glossary/", "/wood/", "/material-library/"],
      visual: "resources",
      featureTitle: "Check the evidence behind the next decision",
      featureDescription: "Use reproducible datasets, side-by-side comparisons, definitions, material references, and practical articles before choosing a method.",
      featureCta: "Open research and datasets ->",
      columns: [
        { title: "Evidence", links: [
          { href: "/research/", icon: "RS", title: "Research", description: "Open modeled datasets with methods, limitations, and CSV files.", exact: true },
          { href: "/examples/", icon: "EX", title: "Examples", description: "Inspect project-level parts, layouts, and source templates." },
          { href: "/blog/", icon: "BG", title: "Blog", description: "Read current project, calculator, and app workflows." }
        ] },
        { title: "Decide", links: [
          { href: "/compare/", icon: "CP", title: "Comparisons", description: "Compare materials, tools, hardware, and workflows." },
          { href: "/material-library/", icon: "ML", title: "Material library", description: "Review sheet-goods sizes, weights, costs, and uses." },
          { href: "/wood/", icon: "WD", title: "Wood species", description: "Compare density, hardness, weight, finish, and applications." }
        ] },
        { title: "Reference", links: [
          { href: "/glossary/", icon: "GL", title: "Glossary", description: "Look up 200 cut-list, cabinet, joinery, and measurement terms." },
          { href: "/about/", icon: "ED", title: "Editorial process", description: "See how calculators, articles, and datasets are produced." },
          { href: "/sitemap.xml", icon: "SM", title: "Sitemap", description: "Open the complete machine-readable site directory." }
        ] }
      ]
    };

    const toolsMenu = `<div class="mega-menu" role="group" aria-label="Tools menu">${megaFeature({ href: "/tools/", title: "Choose a calculator by project", description: "Browse focused woodworking and construction tools without mixing unrelated app categories into the planning hub.", cta: "Browse tools ->", visual: "tools" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Woodworking Tools</p>${menuLink({ href: "/tools/woodworking/", icon: "WW", title: "Woodworking hub", description: "Cut and layout, cabinets, furniture, wood, and materials." })}${tools.slice(0, 3).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Construction Tools</p>${menuLink({ href: "/tools/construction/", icon: "CN", title: "Construction hub", description: "Stairs, tile, deck, fence, wall, roof, and concrete." })}${tools.slice(3, 6).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Tool directory</p>${menuLink({ href: "/tools/", icon: "TL", title: "All tools", description: "Open the full calculator and planning hub.", exact: true })}${menuLink({ href: "/tools/components/", icon: "CC", title: "Component calculators", description: "Merge reusable cabinet component cut lists into one browser-local project." })}${menuLink({ href: "/conversion/", icon: "CV", title: "Conversion calculator", description: "Convert fractions, inches, millimeters, angles, rise, and run." })}${menuLink({ href: "/material-list-generator/", icon: "MT", title: "Material list", description: "Turn project inputs into a material checklist." })}${menuLink({ href: "/drill-bit-finder/", icon: "DR", title: "Drill bit finder", description: "Match screw diameter to pilot and clearance holes." })}</div></div></div>`;
    const appsMenu = `<div class="mega-menu" role="group" aria-label="Apps menu">${megaFeature({ href: "/apps/", title: "iPhone apps for saved workflows", description: "Use the website for quick checks, then move repeatable projects into focused iPhone apps when you need saved records.", cta: "Browse apps ->", visual: "apps" })}<div class="mega-columns"><div class="mega-column"><p class="mega-column-title">Planning apps</p>${apps.slice(0, 4).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">Document apps</p>${apps.slice(4, 7).map(menuLink).join("")}</div><div class="mega-column"><p class="mega-column-title">More apps</p>${apps.slice(7, 10).map(menuLink).join("")}${menuLink({ href: "/apps/compare/", icon: "VS", title: "App comparisons", description: "Compare app workflows against common alternatives." })}</div></div></div>`;

    return `<div class="nav-links nav-links-mega" id="site-navigation">${navMenuItem({ href: "/tools/", label: "Tools", aliases: tools.map((item) => item.href), menu: toolsMenu })}${resourceNavMenu(projectsMenu)}${resourceNavMenu(learnMenu)}${resourceNavMenu(resourcesMenu)}${navMenuItem({ href: "/apps/", label: "Apps", menu: appsMenu })}</div>`;
  }

  function header() {
    const [label, href] = ctaFor();
    const isStoreLink = href.includes("apps.apple.com") || href.startsWith("/go/cutlist/");
    const storeIcon = isStoreLink
      ? `<span class="nav-store-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M16.7 12.8c0-2 1.6-3 1.7-3.1a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7a3.9 3.9 0 0 0-3.3 2c-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 .9 0 1.3-.6 2.5-.6s1.5.6 2.5.6c1.1 0 1.8-1 2.5-2a8.7 8.7 0 0 0 1.1-2.3 3.5 3.5 0 0 1-2.1-3Zm-2-6c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.6-1 2.6 1 .1 2-.5 2.7-1.2Z"/></svg></span>`
      : "";
    return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/" aria-label="WoodCutTool home"><img class="brand-icon" src="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619" width="34" height="34" alt=""><span class="brand-name">WoodCutTool</span></a>${navLinks()}<button class="mobile-nav-toggle" type="button" aria-controls="site-navigation" aria-expanded="false"><span class="mobile-nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span><span class="visually-hidden">Open menu</span></button><a class="button small nav-download-cta" href="${href}" aria-label="${label}"${isStoreLink ? ' data-app-store-link data-platform-label data-conversion-placement="navigation" rel="nofollow noopener"' : ""}>${storeIcon}<span data-platform-label-text>${label}</span></a></nav></header>`;
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
      { href: "/apps/tilefit-tile-layout-planner/", label: "TileFit app" },
      { href: "/stringer/", label: "Stair stringer" },
      { href: "/apps/stringer/", label: "Stringer app" },
      { href: "/tile-calculator/", label: "Tile calculator" },
      { href: "/tools/", label: "All tools" }
    ];

    const planning = [
      { href: "/templates/kitchen-cabinet-cut-list/", label: "Kitchen cabinet cut list" },
      { href: "/tools/components/", label: "Component cut list calculators" },
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
      { href: "/projects/", label: "Guided project playbooks" },
      { href: "/one-sheet-projects/", label: "One-sheet plywood projects" },
      { href: "/tools/components/", label: "Cut list component library" },
      { href: "/troubleshooting/", label: "Troubleshooting" },
      { href: "/checklists/", label: "Woodworking checklists" },
      { href: "/worksheets/", label: "Woodworking worksheets" },
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

  function initMegaNavigation() {
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelector(".nav-links-mega");
    if (!nav || !navLinks || navLinks.dataset.boundMegaNavigation) return;
    navLinks.dataset.boundMegaNavigation = "true";

    const mobileQuery = window.matchMedia("(max-width: 979px)");
    const mobileToggle = nav.querySelector(".mobile-nav-toggle");
    const items = [...navLinks.querySelectorAll(".nav-menu-item")];
    if (!items.length) return;

    const updateMenuTop = () => {
      const header = nav.closest(".site-header");
      const bottom = header ? header.getBoundingClientRect().bottom : nav.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty("--mega-menu-top", `${Math.max(0, Math.round(bottom))}px`);
    };

    const closeSubmenus = () => {
      items.forEach((item) => {
        item.classList.remove("is-open");
        const toggle = item.querySelector(".nav-menu-toggle");
        const label = item.querySelector(".nav-trigger")?.textContent.trim() || "navigation";
        toggle?.setAttribute("aria-expanded", "false");
        toggle?.setAttribute("aria-label", `Open ${label} menu`);
        if (toggle?.querySelector(".visually-hidden")) {
          toggle.querySelector(".visually-hidden").textContent = `Open ${label} menu`;
        }
      });
      nav.classList.remove("nav-mega-open");
    };

    const setMobileNavigation = (isOpen) => {
      if (!mobileQuery.matches) isOpen = false;
      nav.classList.toggle("nav-mobile-open", isOpen);
      document.body.classList.toggle("mobile-navigation-open", isOpen);
      mobileToggle?.setAttribute("aria-expanded", String(isOpen));
      mobileToggle?.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} menu`);
      if (mobileToggle?.querySelector(".visually-hidden")) {
        mobileToggle.querySelector(".visually-hidden").textContent = `${isOpen ? "Close" : "Open"} menu`;
      }
      if (isOpen) {
        updateMenuTop();
      } else {
        closeSubmenus();
      }
    };

    const closeMenus = () => {
      closeSubmenus();
      setMobileNavigation(false);
    };

    const openMenu = (item) => {
      updateMenuTop();
      items.forEach((candidate) => {
        const isCurrent = candidate === item;
        candidate.classList.toggle("is-open", isCurrent);
        const toggle = candidate.querySelector(".nav-menu-toggle");
        const label = candidate.querySelector(".nav-trigger")?.textContent.trim() || "navigation";
        const action = isCurrent ? "Close" : "Open";
        toggle?.setAttribute("aria-expanded", String(isCurrent));
        toggle?.setAttribute("aria-label", `${action} ${label} menu`);
        if (toggle?.querySelector(".visually-hidden")) {
          toggle.querySelector(".visually-hidden").textContent = `${action} ${label} menu`;
        }
      });
      nav.classList.add("nav-mega-open");
    };

    mobileToggle?.addEventListener("click", () => {
      setMobileNavigation(!nav.classList.contains("nav-mobile-open"));
    });

    items.forEach((item) => {
      const toggle = item.querySelector(".nav-menu-toggle");
      if (!toggle) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (item.classList.contains("is-open")) {
          closeSubmenus();
        } else {
          openMenu(item);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("nav-mega-open") && !nav.classList.contains("nav-mobile-open")) return;
      if (!event.target.closest(".site-header")) closeMenus();
    });

    navLinks.addEventListener("click", (event) => {
      if (mobileQuery.matches && event.target.closest("a")) closeMenus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenus();
    });

    window.addEventListener("scroll", () => {
      if (nav.classList.contains("nav-mega-open")) updateMenuTop();
    }, { passive: true });

    mobileQuery.addEventListener?.("change", closeMenus);
  }

  function initBackToTop() {
    if (typeof document.createElement !== "function" || document.querySelector("[data-back-to-top]")) return;
    const button = document.createElement("button");
    button.className = "back-to-top";
    button.type = "button";
    button.hidden = true;
    button.dataset.backToTop = "true";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = `<span aria-hidden="true">↑</span>`;
    document.body.append(button);

    const updateVisibility = () => {
      button.hidden = window.scrollY < 1100;
    };

    button.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
  }

  function initMobileExperience() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const mobileQuery = window.matchMedia("(max-width: 680px)");

    const progress = document.createElement("span");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<span></span>";
    header.append(progress);

    let scrollFrame = 0;
    const updatePageProgress = () => {
      scrollFrame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progress.style.setProperty("--reading-progress", ratio.toFixed(4));
      header.classList.toggle("is-page-scrolled", window.scrollY > 12);
    };
    const requestPageProgress = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updatePageProgress);
    };

    const rails = [...document.querySelectorAll("[data-mobile-rail]")].map((rail, railIndex) => {
      const items = [...rail.children];
      if (items.length < 2) return null;

      const status = document.createElement("div");
      status.className = "mobile-rail-status";
      status.setAttribute("aria-hidden", "true");
      status.innerHTML = `<span class="mobile-rail-track"><span></span></span><span class="mobile-rail-count">1 / ${items.length}</span>`;
      rail.insertAdjacentElement("afterend", status);
      rail.dataset.mobileRailIndex = String(railIndex + 1);
      rail.tabIndex = 0;

      let railFrame = 0;
      const getActiveIndex = () => {
        const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        let activeIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            activeIndex = index;
          }
        });
        return activeIndex;
      };
      const updateRail = () => {
        railFrame = 0;
        if (!mobileQuery.matches) return;
        const activeIndex = getActiveIndex();
        const ratio = items.length > 1 ? activeIndex / (items.length - 1) : 0;
        status.style.setProperty("--mobile-rail-progress", ratio.toFixed(4));
        const count = status.querySelector(".mobile-rail-count");
        if (count) count.textContent = `${activeIndex + 1} / ${items.length}`;
        rail.classList.toggle("is-scroll-start", activeIndex === 0);
        rail.classList.toggle("is-scroll-end", activeIndex === items.length - 1);
      };
      const requestRailUpdate = () => {
        if (railFrame) return;
        railFrame = window.requestAnimationFrame(updateRail);
      };
      rail.addEventListener("scroll", requestRailUpdate, { passive: true });
      rail.addEventListener("keydown", (event) => {
        if (!mobileQuery.matches || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const rtl = document.documentElement.dir === "rtl";
        const forward = event.key === "ArrowRight" ? 1 : -1;
        const targetIndex = Math.min(items.length - 1, Math.max(0, getActiveIndex() + (rtl ? -forward : forward)));
        const railRect = rail.getBoundingClientRect();
        const targetRect = items[targetIndex].getBoundingClientRect();
        const inset = Number.parseFloat(getComputedStyle(rail).paddingLeft) || 0;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        rail.scrollBy({ left: targetRect.left - railRect.left - inset, behavior: reduceMotion ? "auto" : "smooth" });
      });
      updateRail();
      return { update: updateRail };
    }).filter(Boolean);

    const sync = () => {
      updatePageProgress();
      rails.forEach(({ update }) => update());
    };
    window.addEventListener("scroll", requestPageProgress, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    mobileQuery.addEventListener?.("change", sync);
    sync();
  }

  renderSiteChrome();
  initMegaNavigation();
  initBackToTop();
  initMobileExperience();
})();
