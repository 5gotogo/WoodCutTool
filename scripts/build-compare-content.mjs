import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags, breadcrumbJsonLd } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const version = "20260701-nav";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function head({ title, description, canonical, jsonLd = "", ogType = "article" }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  ${ogTags({ title, description, canonical, type: ogType })}
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <link rel="stylesheet" href="/assets/styles.css?v=${version}">
  <script defer src="/assets/app.js?v=${version}"></script>
  ${jsonLd}
</head>`;
}

function header() {
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links"><a href="/cutlist/">CutList</a><a href="/quiltfit/">QuiltFit</a><a href="/tile-calculator/">Tile</a><a href="/stringer/">Stringer</a><a href="/blog/">Blogs</a><a href="/apps/">Apps</a><a href="/tools/">Tools</a><a href="/learn/">Learn</a></div><label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/cutlist/">CutList</a><a href="/quiltfit/">QuiltFit</a><a href="mailto:727268425@qq.com">Contact</a></nav></div><div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Results are estimates &mdash; always verify measurements, material quantities, and costs yourself before buying or cutting.</p><p>Our content is not professional, structural, engineering, or safety advice. For stairs, structural work, electrical, plumbing, or anything affecting safety, consult a qualified professional and follow your local building codes and permit requirements. You are responsible for your own measurements, tools, and safety. WoodCutTool is not liable for any loss, injury, or damage arising from use of this site.</p><p>App names, logos, and trademarks (including Apple and App Store) belong to their respective owners and do not imply endorsement. External links and cited sources are provided for reference only.</p></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

const existingComparisons = [
  ["Material", "Plywood vs MDF", "Choose between plywood and MDF for cabinets, shelves, doors, and painted projects.", "/compare/plywood-vs-mdf/"],
  ["Material", "MDF vs particle board", "Compare two budget sheet goods for cabinets, shelves, and furniture parts.", "/compare/mdf-vs-particle-board/"],
  ["Saws", "Track saw vs table saw for sheet goods", "Compare sheet breakdown accuracy, space, safety, and repeatability.", "/compare/track-saw-vs-table-saw-sheet-goods/"],
  ["Saws", "Circular saw vs table saw", "Compare the two common saw choices for DIY woodworking and sheet goods.", "/compare/circular-saw-vs-table-saw/"],
  ["Software", "Best plywood cutting tools", "Compare manual planning, spreadsheets, browser calculators, and CutList.", "/compare/best-plywood-tools/"],
  ["Software", "Cut list app vs spreadsheet", "Compare visual cut planning against spreadsheet estimating.", "/compare/cut-list-app-vs-spreadsheet/"],
  ["Software", "CutList vs Excel for woodworking", "Compare a dedicated cut list app against Excel workflows.", "/compare/cutlist-vs-excel-for-woodworking/"],
  ["Planning", "Best way to create a wood cut list", "Compare paper notes, spreadsheets, calculators, and apps.", "/compare/best-way-to-create-a-wood-cut-list/"],
  ["Planning", "Cut list calculator vs manual plan", "Compare calculated cutting plans against hand-drawn layouts.", "/compare/cut-list-calculator-vs-manual-cutting-plan/"],
  ["Planning", "Woodworking calculator vs paper plans", "Compare digital calculation with paper-only project planning.", "/compare/woodworking-calculator-vs-paper-plans/"],
  ["Calculators", "Plywood calculator vs cut list calculator", "Compare sheet-first and part-list-first calculators.", "/compare/plywood-calculator-vs-cut-list-calculator/"],
  ["Calculators", "Board foot vs linear foot calculator", "Compare lumber volume and length-based estimating.", "/compare/board-foot-vs-linear-foot-calculator/"],
  ["Stairs", "Stair stringer calculator vs manual layout", "Compare calculated stringer layout with framing-square layout.", "/compare/stair-stringer-calculator-vs-manual-layout/"]
];

const comparisonDefinitions = [
  ["plywood-vs-osb", "Material", "Plywood vs OSB: Which Sheet Good Should You Use?", "Compare plywood and OSB for cabinets, sheathing, shop projects, moisture, screw holding, edges, and finish quality.", "Plywood", "OSB", "Use plywood for furniture, cabinets, exposed edges, and projects where screw holding and finish quality matter. Use OSB for hidden structural sheathing and utility surfaces where price matters more than appearance.", "visible shop furniture, cabinet parts, damp areas, and edge fastening", "hidden wall sheathing, roof decking, subfloors, and rough utility builds", [["Face quality", "Smoother and easier to finish", "Rough strand texture; usually hidden"], ["Edge behavior", "Cleaner edges and better screw holding", "Edges can swell and look rough"], ["Moisture tolerance", "Generally more forgiving if briefly wet", "Can swell at edges if exposed"], ["Cost", "Usually higher", "Usually lower"], ["Best role", "Finished or semi-finished projects", "Hidden structural panels"]], "/learn/plywood-grade-selection-for-cabinets/", "/plywood-cut-calculator/"],
  ["baltic-birch-vs-cabinet-grade-plywood", "Material", "Baltic Birch vs Cabinet-Grade Plywood", "Compare Baltic birch and cabinet-grade plywood for drawer boxes, jigs, furniture, shelves, and high-end cabinet parts.", "Baltic birch", "Cabinet-grade plywood", "Use Baltic birch when edge quality, void-free layers, drawer boxes, and jigs matter. Use cabinet-grade plywood when the visible face species, sheet availability, and cabinet-scale yield matter more.", "drawer boxes, templates, shop jigs, exposed ply edges, and small precision parts", "cabinet boxes, finished ends, large panels, and species-matched visible faces", [["Core", "Many thin plies, usually very stable", "Varies by supplier and grade"], ["Face choices", "Often birch faces", "Maple, oak, birch, prefinished, and more"], ["Edge look", "Attractive layered edge", "May need banding"], ["Sheet size", "Often different from 4x8 stock", "Common 4x8 sheets"], ["Cost signal", "Higher for small precision work", "Better yield for large cabinets"]], "/blog/baltic-birch-vs-cabinet-grade-plywood/", "/apps/cutlist/"],
  ["melamine-vs-plywood-for-cabinets", "Material", "Melamine vs Plywood For Cabinets", "Compare melamine and plywood for cabinet boxes, closets, shelves, edge banding, chipout, weight, and long-term durability.", "Melamine", "Plywood", "Use melamine for clean white interiors, closets, and budget cabinet boxes when chipout is controlled. Use plywood for stronger screw holding, lighter weight, better edges, and higher durability.", "closet systems, white interiors, utility cabinets, and low-finish labor", "shop cabinets, high-use boxes, exposed edges, and moisture-prone spaces", [["Finish", "Factory finished surface", "Needs finish or prefinished sheet"], ["Edges", "Requires banding and chipout control", "Stronger and easier to repair"], ["Weight", "Often heavy", "Usually lighter"], ["Screw holding", "Weaker at edges", "Better, especially in veneer core"], ["Waste risk", "Damaged corners and chipout", "Defects and grain constraints"]], "/blog/melamine-vs-plywood-cut-list-considerations/", "/plywood-cut-calculator/"],
  ["mdf-vs-plywood-for-painted-cabinets", "Material", "MDF vs Plywood For Painted Cabinets", "Compare MDF and plywood for painted cabinet doors, boxes, shelves, weight, screw holding, smoothness, and moisture risk.", "MDF", "Plywood", "Use MDF for smooth painted doors and panels that need a flat surface. Use plywood for cabinet boxes, shelves, and parts where stiffness, screw holding, and lower weight matter.", "painted flat doors, panels, and low-movement surfaces", "carcasses, shelves, structural cabinet parts, and damp-adjacent areas", [["Paint surface", "Very smooth", "Needs more prep for grain"], ["Stiffness", "Can sag on long spans", "Better stiffness by weight"], ["Fasteners", "Weak at edges", "Better edge screw holding"], ["Moisture", "Swells badly if wet", "More forgiving"], ["Dust", "Fine dust when machined", "Still dusty, less powdery"]], "/learn/mdf-cut-list-planning-guide/", "/templates/kitchen-cabinet-cut-list/"],
  ["hardwood-plywood-vs-softwood-plywood", "Material", "Hardwood Plywood vs Softwood Plywood", "Compare hardwood and softwood plywood for furniture, cabinets, shop fixtures, sheathing, appearance, and cost.", "Hardwood plywood", "Softwood plywood", "Use hardwood plywood for furniture, cabinets, and visible projects. Use softwood plywood for construction, utility shop fixtures, and hidden structural surfaces.", "visible furniture, cabinet sides, finished shelving, and stain-grade faces", "construction panels, shop storage, subfloors, and rough utility work", [["Appearance", "Decorative face veneers", "Construction-grade faces"], ["Strength role", "Furniture and cabinet use", "Structural and sheathing use"], ["Finish", "Better for stain or clear finish", "Usually painted or hidden"], ["Cost", "Higher", "Lower"], ["Cut planning", "Protect show faces", "Optimize for utility and strength"]], "/learn/plywood-grade-selection-for-cabinets/", "/plywood-cut-calculator/"],
  ["solid-wood-vs-plywood-for-shelves", "Material", "Solid Wood vs Plywood For Shelves", "Compare solid wood and plywood shelves for span, movement, edging, cost, finishing, and cut-list planning.", "Solid wood", "Plywood", "Use solid wood when the edge and natural grain are the design feature. Use plywood when stability, sheet yield, wide shelves, and repeatable cabinet parts matter more.", "furniture shelves with visible grain and shaped edges", "built-ins, closets, cabinets, wide shelves, and painted projects", [["Movement", "Expands and contracts across width", "More dimensionally stable"], ["Wide shelves", "Needs glue-up", "Easy from sheet goods"], ["Edges", "Natural edge", "Needs banding or edging"], ["Yield", "Board selection matters", "Sheet layout matters"], ["Best finish", "Clear or stain", "Paint, veneer, or banded face"]], "/learn/shelf-span-and-plywood-thickness-guide/", "/templates/closet-shelving-cut-list/"],
  ["prefinished-plywood-vs-raw-plywood", "Material", "Prefinished Plywood vs Raw Plywood", "Compare prefinished plywood and raw plywood for cabinet interiors, finish labor, cut planning, touch-ups, and cost.", "Prefinished plywood", "Raw plywood", "Use prefinished plywood when clean interiors and reduced finishing time matter. Use raw plywood when you need custom stain, paint, repair flexibility, or lower upfront sheet cost.", "cabinet interiors, drawer boxes, shop runs, and clear-coated utility parts", "custom finished furniture, paint-grade work, and projects needing on-site finish control", [["Labor", "Saves finishing time", "Needs sanding and finish"], ["Scratch repair", "Harder to blend perfectly", "Can refinish more easily"], ["Cost", "Higher upfront", "Lower upfront"], ["Cut handling", "Protect finished face", "More forgiving before finish"], ["Best use", "Cabinet interiors", "Custom exterior surfaces"]], "/learn/plywood-grade-selection-for-cabinets/", "/apps/cutlist/"],
  ["face-frame-vs-frameless-cabinets", "Cabinets", "Face-Frame vs Frameless Cabinets", "Compare face-frame and frameless cabinet construction for strength, access, cut lists, reveals, hardware, and plywood yield.", "Face-frame cabinets", "Frameless cabinets", "Use face-frame construction when you want traditional reveals and a forgiving front frame. Use frameless construction when you want full access, modern lines, and box accuracy.", "traditional kitchens, inset or overlay doors, and uneven openings", "modern cabinets, maximum access, and repeatable box systems", [["Front structure", "Frame adds stiffness and reveals", "Box edges define reveals"], ["Access", "Frame narrows opening", "Wider interior access"], ["Cut-list tolerance", "Frame can hide small box issues", "Box must be very square"], ["Hardware", "More overlay choices", "System hardware and precise drilling"], ["Style", "Traditional", "Modern European"]], "/blog/face-frame-vs-frameless-cut-list/", "/templates/kitchen-cabinet-cut-list/"],
  ["inset-vs-overlay-cabinet-doors", "Cabinets", "Inset vs Overlay Cabinet Doors", "Compare inset and overlay cabinet doors for reveals, hardware, difficulty, tolerance, cost, and cut-list planning.", "Inset doors", "Overlay doors", "Choose inset doors for a furniture-like look and precise reveals. Choose overlay doors for easier installation, more forgiving sizing, and faster cabinet production.", "high-end furniture-style cabinets and controlled shop builds", "DIY cabinets, utility cabinets, and faster installation", [["Reveal", "Even gap around the door", "Door covers the opening"], ["Difficulty", "High precision required", "More forgiving"], ["Hardware", "Special hinges or catches", "Common concealed hinges"], ["Cost", "More labor", "Lower labor"], ["Best fit", "Fine cabinetry", "Most practical cabinet runs"]], "/blog/cabinet-door-styles-explained/", "/templates/kitchen-cabinet-cut-list/"],
  ["drawer-slides-side-mount-vs-undermount", "Cabinets", "Side-Mount vs Undermount Drawer Slides", "Compare side-mount and undermount drawer slides for clearance, drawer box sizing, appearance, cost, and installation.", "Side-mount slides", "Undermount slides", "Use side-mount slides for budget, easy installation, and utility drawers. Use undermount slides when hidden hardware, soft-close feel, and premium cabinet interiors matter.", "shop cabinets, utility drawers, and budget builds", "kitchen drawers, furniture drawers, and premium interiors", [["Visibility", "Visible when open", "Hidden under drawer"], ["Clearance", "Needs side clearance", "Needs bottom and notch details"], ["Cost", "Lower", "Higher"], ["Installation", "Forgiving", "More precise"], ["Drawer box", "Simple box sizing", "Specific box rules"]], "/learn/drawer-box-cut-list-basics/", "/templates/drawer-box-cut-list/"],
  ["drawer-box-dovetail-vs-rabbet", "Cabinets", "Dovetail vs Rabbet Drawer Boxes", "Compare dovetail and rabbet drawer box joinery for strength, speed, tools, appearance, and sizing.", "Dovetail", "Rabbet", "Use dovetails when appearance and traditional strength justify the tooling and time. Use rabbets for fast, strong utility drawers with simpler tools.", "premium drawers, exposed joinery, and heirloom furniture", "cabinet drawers, shop drawers, and efficient batch production", [["Appearance", "Decorative joinery", "Mostly hidden"], ["Tools", "Jig or hand skills", "Table saw or router"], ["Speed", "Slower", "Faster"], ["Strength", "Excellent mechanical lock", "Strong with glue and fasteners"], ["Best use", "High-end work", "Cabinet production"]], "/blog/drawer-box-joinery-compared/", "/learn/drawer-box-cut-list-basics/"],
  ["table-saw-vs-track-saw-for-cabinet-parts", "Saws", "Table Saw vs Track Saw For Cabinet Parts", "Compare table saws and track saws for cabinet parts, repeatability, sheet breakdown, shop space, accuracy, and safety.", "Table saw", "Track saw", "Use a table saw for repeatable final sizing when you have space and support. Use a track saw for breaking down full sheets safely and accurately in a small shop.", "repeat rips, narrow parts, and production sizing", "full-sheet breakdown, small shops, job sites, and first cuts", [["Full sheets", "Needs infeed and outfeed", "Excellent on foam or bench"], ["Repeatability", "Excellent with fence", "Needs stops or marks"], ["Space", "Large footprint", "Compact"], ["Cut quality", "Excellent with setup", "Excellent with guide rail"], ["Best workflow", "Final sizing", "Initial breakdown"]], "/compare/track-saw-vs-table-saw-sheet-goods/", "/learn/sheet-cutting-calculator/"],
  ["track-saw-vs-panel-saw", "Saws", "Track Saw vs Panel Saw", "Compare track saws and panel saws for sheet goods, plywood breakdown, shop space, repeat cuts, cost, and workflow.", "Track saw", "Panel saw", "Use a track saw for flexible small-shop and job-site breakdown. Use a panel saw when sheet processing is frequent enough to justify a dedicated vertical cutting station.", "mobile work, small shops, occasional sheet breakdown, and angled cuts", "high-volume sheet cutting, retail shops, and repeated square cuts", [["Footprint", "Stores compactly", "Dedicated wall space"], ["Repeat cuts", "Manual setup", "Very fast with stops"], ["Cost", "Lower", "Higher"], ["Mobility", "Portable", "Stationary"], ["Best user", "DIY and small shops", "Sheet-heavy shops"]], "/blog/track-saw-plywood-cut-plan/", "/plywood-cut-calculator/"],
  ["jigsaw-vs-circular-saw-for-plywood", "Saws", "Jigsaw vs Circular Saw For Plywood", "Compare jigsaws and circular saws for plywood cuts, straight lines, curves, tearout, speed, and accuracy.", "Jigsaw", "Circular saw", "Use a jigsaw for curves, notches, and cutouts. Use a circular saw for straight plywood breakdown and long cuts.", "sink cutouts, curves, small notches, and irregular shapes", "straight rips, crosscuts, and sheet breakdown", [["Cut shape", "Curves and cutouts", "Straight lines"], ["Speed", "Slower", "Faster"], ["Accuracy", "Depends on blade and guide", "Good with straightedge"], ["Tearout", "Can be rough", "Cleaner with right blade"], ["Best role", "Detail cuts", "Primary breakdown"]], "/blog/cutting-large-sheets-without-a-table-saw/", "/learn/sheet-cutting-calculator/"],
  ["miter-saw-vs-table-saw-for-crosscuts", "Saws", "Miter Saw vs Table Saw For Crosscuts", "Compare miter saw and table saw crosscut workflows for boards, repeatability, long stock support, accuracy, and shop layout.", "Miter saw", "Table saw", "Use a miter saw for quick board crosscuts and long trim. Use a table saw with a sled when square repeatability and small-part accuracy matter.", "long boards, trim, framing stock, and fast rough crosscuts", "precise furniture parts, small panels, sled work, and repeat stops", [["Long stock", "Easy with wings", "Needs support"], ["Small parts", "Less ideal", "Good with sled"], ["Angles", "Fast angle setup", "Accurate with sled or gauge"], ["Repeatability", "Good with stop block", "Excellent with sled"], ["Best shop role", "Board station", "Precision station"]], "/blog/miter-saw-station-cut-list/", "/cut-list-calculator/"],
  ["router-vs-table-saw-for-dados", "Tools", "Router vs Table Saw For Dados", "Compare routers and table saws for dados, grooves, rabbets, plywood shelves, accuracy, dust, and setup time.", "Router", "Table saw", "Use a router when the dado must stop, follow a template, or happen on a large panel. Use a table saw for repeated through dados with consistent setup.", "stopped dados, large panels, and on-site adjustments", "repeated shelf dados, through grooves, and batch cabinet parts", [["Stopped cuts", "Excellent", "Not practical"], ["Repeat grooves", "Good with jig", "Fast with dado stack"], ["Large panels", "Works on the panel", "Panel handling can be hard"], ["Dust", "High and localized", "High but collected at saw"], ["Setup", "Jigs and guides", "Fence and blade setup"]], "/blog/dado-joints-for-shelving-guide/", "/templates/bookcase-cut-list/"],
  ["cutlist-vs-paper-cutting-diagram", "Planning", "CutList vs Paper Cutting Diagram", "Compare CutList and paper cutting diagrams for plywood projects, revisions, kerf, sheet count, labels, and shop communication.", "CutList", "Paper diagram", "Use a paper diagram for quick thinking and simple one-sheet jobs. Use CutList when the plan needs kerf, revisions, sheet count confidence, and a saved project record.", "multi-sheet plywood projects, client changes, repeated parts, and PDF sharing", "early sketches, concept planning, and simple shop notes", [["Revision", "Easy to edit and re-run", "Messy after changes"], ["Kerf", "Included as input", "Easy to forget"], ["Clarity", "Part labels and layout", "Depends on handwriting"], ["Speed", "Fast after entry", "Fast for rough sketch"], ["Best stage", "Final plan", "Early idea"]], "/learn/cut-list-revision-workflow/", "/apps/cutlist/"],
  ["cut-list-template-vs-cut-list-calculator", "Planning", "Cut List Template vs Cut List Calculator", "Compare project cut list templates and calculators for cabinets, shelves, drawer boxes, rough estimates, and final layouts.", "Cut list template", "Cut list calculator", "Use a template when the project type is known, like a drawer box or cabinet. Use a calculator when custom dimensions and stock layout need to be tested.", "standard projects with known part patterns", "custom dimensions, sheet layout, kerf, and material count", [["Starting point", "Project-specific structure", "Blank calculation workflow"], ["Speed", "Fast for common projects", "Flexible for any project"], ["Layout", "May need separate calculation", "Directly calculates cuts"], ["Best user", "Needs a checklist", "Needs a material answer"], ["Best together", "Template creates parts", "Calculator tests parts"]], "/templates/", "/cut-list-calculator/"],
  ["plywood-calculator-vs-wood-waste-calculator", "Calculators", "Plywood Calculator vs Wood Waste Calculator", "Compare plywood cut calculators and wood waste calculators: sheet count, layout fit, scrap value, and cost decisions.", "Plywood calculator", "Wood waste calculator", "Use a plywood calculator before buying to prove the parts fit. Use a wood waste calculator after or alongside layout planning to understand the cost of scrap and leftover material.", "sheet count, part fit, layout alternatives, and kerf-aware planning", "waste cost, scrap value, offcut decisions, and material efficiency review", [["Main question", "How many sheets and what layout?", "How much waste and what cost?"], ["Timing", "Before purchase", "Before and after planning"], ["Output", "Sheet layout", "Waste value"], ["Best for", "Fit and count", "Cost review"], ["Use together", "Plan layout first", "Measure waste impact"]], "/plywood-cut-calculator/", "/wood-waste-calculator/"],
  ["board-foot-calculator-vs-wood-waste-calculator", "Calculators", "Board Foot Calculator vs Wood Waste Calculator", "Compare board foot and wood waste calculators for hardwood buying, material volume, offcuts, scrap cost, and project estimates.", "Board foot calculator", "Wood waste calculator", "Use a board foot calculator to buy lumber by volume. Use a wood waste calculator to review how much of that material becomes offcut, trimming, or scrap.", "hardwood buying, board volume, thickness, width, length, and price", "scrap value, offcut tracking, trimming loss, and material efficiency", [["Main unit", "Board feet", "Waste area or value"], ["Best timing", "Before buying lumber", "After layout assumptions"], ["Cost use", "Purchase estimate", "Efficiency review"], ["Blind spot", "Does not show layout waste", "Needs material baseline"], ["Best together", "Buy enough stock", "Control leftover cost"]], "/board-foot-calculator/", "/wood-waste-calculator/"],
  ["metric-vs-imperial-cut-list-calculator", "Calculators", "Metric vs Imperial Cut List Calculator", "Compare metric and imperial cut list workflows for plywood, boards, kerf, rounding, conversions, and shop accuracy.", "Metric workflow", "Imperial workflow", "Use the unit system your tools, plans, and material supplier use most consistently. The winner is not metric or imperial by itself; it is the workflow with fewer conversions and rounding mistakes.", "millimeter-based plans, European hardware, and precise cabinet systems", "inch-based lumber, U.S. sheet goods, and familiar job-site measuring", [["Precision", "Clean decimal millimeters", "Fractions require care"], ["Material labels", "Common outside U.S.", "Common in U.S. lumberyards"], ["Hardware", "Strong for 32 mm systems", "Strong for local stock sizes"], ["Risk", "Wrong conversion", "Fraction rounding"], ["Best rule", "Stay consistent", "Stay consistent"]], "/learn/stair-stringer-calculator-inputs-explained/", "/cut-list-calculator/"],
  ["stair-calculator-vs-stair-chart", "Stairs", "Stair Calculator vs Stair Chart", "Compare stair calculators and stair charts for rise, run, total height, code checks, headroom, and stringer layout.", "Stair calculator", "Stair chart", "Use a stair calculator when total rise, tread depth, landing, or code checks need to match a real site. Use a stair chart for quick reference and early feasibility only.", "site-specific rise, run, pitch, tread thickness, and layout marks", "rough code ranges, quick checks, and concept planning", [["Input", "Your measured site", "Precomputed examples"], ["Accuracy", "Specific to total rise", "Generic"], ["Speed", "Fast after measurement", "Instant reference"], ["Risk", "Bad input gives bad output", "May not match site"], ["Best output", "Layout numbers", "Feasibility range"]], "/stair-stringer-calculator/", "/apps/stringer/"],
  ["open-riser-vs-closed-riser-stairs", "Stairs", "Open Riser vs Closed Riser Stairs", "Compare open-riser and closed-riser stairs for safety, appearance, cleaning, code, material, and layout planning.", "Open riser stairs", "Closed riser stairs", "Use closed risers for most family, utility, and code-sensitive stairs. Use open risers only when the design, local rules, and user safety all support the open look.", "modern visual openness and light through the stair", "safer family use, storage below, and traditional stair construction", [["Appearance", "Light and open", "Solid and traditional"], ["Safety", "Needs careful code review", "Usually more forgiving"], ["Cleaning", "Dust falls through", "Easier to contain"], ["Material", "No riser boards", "Needs riser material"], ["Best fit", "Design feature", "Everyday stair"]], "/blog/open-riser-stair-planning/", "/stair-stringer-calculator/"],
  ["wood-treads-vs-composite-deck-stair-treads", "Stairs", "Wood Treads vs Composite Deck Stair Treads", "Compare wood and composite deck stair treads for stringer spacing, durability, maintenance, fasteners, and cost.", "Wood treads", "Composite treads", "Use wood treads when cost, stiffness, and simple fastening matter. Use composite treads when lower maintenance and matching deck boards matter, but check required stringer spacing.", "budget deck stairs, easy replacement, and stiff tread spans", "low-maintenance decks, matching surfaces, and consistent color", [["Stringer spacing", "Often more forgiving", "Often needs tighter spacing"], ["Maintenance", "Needs finish or replacement", "Lower maintenance"], ["Cost", "Lower upfront", "Higher upfront"], ["Fasteners", "Standard exterior fasteners", "Manufacturer-specific systems"], ["Best check", "Span and rot protection", "Manufacturer stair requirements"]], "/blog/stair-stringer-spacing-for-composite-decking/", "/apps/stringer/"],
  ["porcelain-vs-ceramic-tile", "Tile", "Porcelain vs Ceramic Tile", "Compare porcelain and ceramic tile for floors, walls, wet areas, cutting difficulty, durability, cost, and layout waste.", "Porcelain tile", "Ceramic tile", "Use porcelain for durable floors, wet areas, and higher traffic. Use ceramic for walls, backsplashes, and budget-friendly areas where easier cutting matters.", "bathroom floors, entries, showers, and higher wear surfaces", "backsplashes, walls, light-duty floors, and easier DIY cutting", [["Density", "Harder and denser", "Softer and easier to cut"], ["Water", "Better for wet areas", "Varies by tile"], ["Cost", "Higher", "Lower"], ["Cutting", "Harder on tools", "Easier"], ["Best use", "Floors and showers", "Walls and backsplashes"]], "/tile-calculator/", "/learn/tile-calculator-inputs-explained/"],
  ["large-format-tile-vs-standard-tile", "Tile", "Large-Format Tile vs Standard Tile", "Compare large-format and standard tile for layout, substrate flatness, lippage, cuts, waste, and installation difficulty.", "Large-format tile", "Standard tile", "Use large-format tile when the substrate is flat and the design benefits from fewer grout lines. Use standard tile when cuts, slopes, small rooms, or DIY handling are more important.", "large open floors, modern walls, and fewer grout lines", "small bathrooms, complex cuts, slopes, and easier handling", [["Grout lines", "Fewer", "More"], ["Substrate demand", "Very high", "More forgiving"], ["Handling", "Harder", "Easier"], ["Waste risk", "High per broken tile", "Lower per tile"], ["Best room", "Open, flat surfaces", "Complex layouts"]], "/blog/large-format-tile-cut-planning/", "/tile-calculator/"],
  ["straight-lay-vs-diagonal-tile", "Tile", "Straight Lay vs Diagonal Tile", "Compare straight-lay and diagonal tile patterns for waste, layout complexity, room appearance, cuts, and cost.", "Straight lay", "Diagonal tile", "Use straight lay for lower waste, easier alignment, and cleaner installation. Use diagonal tile when visual movement is worth more cuts and a higher waste allowance.", "budget installs, simple rooms, and lower waste", "feature floors, out-of-square rooms, and stronger visual movement", [["Waste", "Lower", "Higher"], ["Cuts", "Simpler edge cuts", "More angled cuts"], ["Look", "Calm grid", "More movement"], ["Layout", "Easier", "More planning"], ["Best use", "Most rooms", "Selected feature areas"]], "/blog/diagonal-tile-layout-waste/", "/tile-calculator/"],
  ["wideback-vs-pieced-quilt-backing", "QuiltFit", "Wideback vs Pieced Quilt Backing", "Compare wideback and pieced quilt backing for yardage, seams, cost, directional prints, longarm prep, and leftover fabric.", "Wideback backing", "Pieced backing", "Use wideback when fewer seams and faster longarm prep matter. Use pieced backing when fabric choice, leftover use, or design control matters more.", "fast finishing, large quilts, and fewer backing seams", "stash use, design backs, directional control, and smaller fabric widths", [["Seams", "Few or none", "Planned seams"], ["Fabric choice", "More limited", "Very flexible"], ["Prep time", "Faster", "More piecing"], ["Cost", "Can be efficient", "Depends on fabric choices"], ["Best use", "Clean utility backing", "Creative or stash backing"]], "/blog/quilt-backing-wideback-vs-pieced/", "/apps/quiltfit/"],
  ["jelly-roll-vs-layer-cake-quilt-planning", "QuiltFit", "Jelly Roll vs Layer Cake Quilt Planning", "Compare jelly rolls and layer cakes for quilt planning, fabric yield, block design, cutting speed, and leftover management.", "Jelly roll", "Layer cake", "Use jelly rolls for strip-based quilts and fast piecing. Use layer cakes for larger patch units, half-square triangles, and block layouts with more shape flexibility.", "strip quilts, rail fence designs, and fast repetitive piecing", "block quilts, HSTs, large squares, and flexible layouts", [["Precut shape", "2.5 inch strips", "10 inch squares"], ["Speed", "Fast for strips", "Fast for blocks"], ["Design fit", "Linear patterns", "Patch and block patterns"], ["Waste", "Ends and strip leftovers", "Trimmed squares and triangles"], ["Best planning tool", "Strip count", "Block count"]], "/blog/quiltfit-precut-bundle-planning-jelly-roll-layer-cake/", "/apps/quiltfit/"],
  ["quiltfit-vs-graph-paper-for-quilt-planning", "QuiltFit", "QuiltFit vs Graph Paper For Quilt Planning", "Compare QuiltFit and graph paper for quilt layout, fabric estimates, color studies, shopping lists, and project tracking.", "QuiltFit", "Graph paper", "Use graph paper for quick sketching and visual exploration. Use QuiltFit when the design needs fabric roles, yardage, shopping lists, saved revisions, and progress tracking.", "yardage-aware planning, saved options, and project records", "rough sketches, early ideas, and low-tech color blocking", [["Speed to sketch", "Fast after setup", "Very fast"], ["Yardage", "Built into workflow", "Manual math"], ["Revisions", "Saved and editable", "Redraw or annotate"], ["Shopping list", "Structured", "Manual"], ["Best stage", "Project planning", "Idea capture"]], "/apps/compare/quiltfit-vs-graph-paper/", "/apps/quiltfit/"]
];

function articleJsonLd(article) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/compare/${article.slug}/`,
    mainEntityOfPage: `${siteUrl}/compare/${article.slug}/`,
    image: `${siteUrl}/assets/og/woodcuttool-og.png`,
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    inLanguage: "en",
    articleSection: article.category,
    author: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    publisher: {
      "@type": "Organization",
      name: "WoodCutTool",
      url: `${siteUrl}/`,
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/icons/icon-512.png` }
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function faqJsonLd(article) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text }
    }))
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function makeArticle([
  slug,
  category,
  title,
  description,
  optionA,
  optionB,
  quickAnswer,
  bestA,
  bestB,
  rows,
  relatedA,
  relatedB
]) {
  const baseTitle = title.replace(/\?.*$/, "");
  return {
    slug,
    category,
    title,
    description,
    optionA,
    optionB,
    quickAnswer,
    bestA,
    bestB,
    rows,
    relatedA,
    relatedB,
    faqs: [
      [`Which is better: ${optionA} or ${optionB}?`, quickAnswer],
      [`When should I choose ${optionA}?`, `Choose ${optionA} for ${bestA}.`],
      [`When should I choose ${optionB}?`, `Choose ${optionB} for ${bestB}.`],
      ["What should I compare before buying?", "Compare the real project constraints: material, tool access, installation conditions, finish quality, waste, cost, and the ability to revise the plan before work starts."],
      ["Which WoodCutTool page should I use next?", "Use the linked calculator, template, app, or learn guide on this page to test the decision with your own measurements instead of relying on a generic rule."]
    ],
    h1: baseTitle
  };
}

const newComparisons = comparisonDefinitions.map(makeArticle);

function comparisonPage(article) {
  const canonical = `${siteUrl}/compare/${article.slug}/`;
  return `<!doctype html>
<html lang="en">
${head({
    title: article.title,
    description: article.description,
    canonical,
    jsonLd: `${faqJsonLd(article)}\n${articleJsonLd(article)}`
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Compare", "/compare/"], [article.h1, `/compare/${article.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/compare/">Compare</a> / ${escapeHtml(article.h1)}</p>
      <p class="eyebrow">${escapeHtml(article.category)} comparison</p>
      <h1>${escapeHtml(article.h1)}</h1>
      <p class="lead">${escapeHtml(article.description)}</p>

      <section>
        <h2>Quick Answer</h2>
        <p>${escapeHtml(article.quickAnswer)}</p>
      </section>

      <section>
        <h2>Comparison Table</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Factor</th><th>${escapeHtml(article.optionA)}</th><th>${escapeHtml(article.optionB)}</th></tr></thead>
            <tbody>
              ${article.rows.map(([factor, a, b]) => `<tr><td><strong>${escapeHtml(factor)}</strong></td><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td></tr>`).join("\n              ")}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>When ${escapeHtml(article.optionA)} Makes More Sense</h2>
        <p>Choose ${escapeHtml(article.optionA)} for ${escapeHtml(article.bestA)}. The decision is strongest when the project's constraints match that advantage instead of when the choice is made from habit. Before committing, check whether the material, tool, calculator, or workflow still fits the real measurements and the finish quality you need.</p>
      </section>

      <section>
        <h2>When ${escapeHtml(article.optionB)} Makes More Sense</h2>
        <p>Choose ${escapeHtml(article.optionB)} for ${escapeHtml(article.bestB)}. This option usually wins when its strengths line up with the actual job conditions. If the project has unusual dimensions, premium material, or inspection-sensitive details, confirm the decision with a calculator, template, or saved plan before buying.</p>
      </section>

      <section>
        <h2>Decision Rule</h2>
        <p>Do not compare only sticker price or the first setup step. Compare the whole workflow: measuring, buying, cutting, installing, finishing, revising, and maintaining the result. A cheaper or faster option can still lose if it creates more waste, harder cuts, weaker fastening, worse appearance, or more rework after the first mistake.</p>
      </section>

      <section class="section app-cta-band">
        <h2>Plan The Work After Choosing</h2>
        <p>Once you choose between ${escapeHtml(article.optionA)} and ${escapeHtml(article.optionB)}, run your own numbers. WoodCutTool calculators and apps help turn the comparison into a cut list, sheet count, material estimate, or project record before you buy or cut.</p>
        <p><a class="button" href="/tools/">Explore WoodCutTool tools</a></p>
      </section>

      <section>
        <h2>Related Planning Pages</h2>
        <div class="related-grid">
          <a href="${article.relatedA}"><span>Related</span><strong>Planning guide</strong></a>
          <a href="${article.relatedB}"><span>Tool</span><strong>Calculator or app</strong></a>
          <a href="/compare/"><span>Compare</span><strong>All comparisons</strong></a>
          <a href="/apps/cutlist/"><span>App</span><strong>CutList Optimizer</strong></a>
        </div>
      </section>

      <section class="faq-list" aria-label="${escapeHtml(article.h1)} FAQ">
        <h2>FAQ</h2>
        ${article.faqs.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join("\n        ")}
      </section>
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}

function indexJsonLd(allCards) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Woodworking Comparisons",
    description: "Side-by-side woodworking, material, saw, calculator, stair, tile, and QuiltFit comparisons.",
    url: `${siteUrl}/compare/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allCards.map((card, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: card[1],
        url: `${siteUrl}${card[3]}`
      }))
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function renderCard([category, title, description, href]) {
  return `<article class="card"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p><a class="card-link" href="${href}">Read comparison</a></article>`;
}

function compareIndexPage() {
  const newCards = newComparisons.map((article) => [article.category, article.h1, article.description, `/compare/${article.slug}/`]);
  const allCards = [...existingComparisons, ...newCards];
  const grouped = Map.groupBy(allCards, ([category]) => category);
  return `<!doctype html>
<html lang="en">
${head({
    title: "Woodworking Comparisons: Materials, Saws & Tools | WoodCutTool",
    description: "Side-by-side woodworking comparisons for sheet goods, saws, cabinets, calculators, stairs, tile, QuiltFit, and cut list workflows.",
    canonical: `${siteUrl}/compare/`,
    jsonLd: indexJsonLd(allCards),
    ogType: "website"
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Compare", "/compare/"], ["Comparisons", "/compare/"]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  <main id="main">
    <section class="page-hero">
      <p class="breadcrumb"><a href="/">Home</a> / Compare</p>
      <p class="eyebrow">Woodworking comparisons</p>
      <h1>Woodworking Comparisons</h1>
      <p class="lead">Compare materials, saws, calculators, cabinet choices, stair layouts, tile options, quilt planning workflows, and cut list tools before buying material or making the first cut.</p>
      <div class="hero-actions"><a class="button" href="/tools/">Explore tools</a><a class="button secondary" href="/apps/cutlist/">Open CutList</a></div>
    </section>
    ${[...grouped.entries()].map(([category, cards]) => `<section class="section">
      <div class="section-heading compact"><p class="eyebrow">${escapeHtml(category)}</p><h2>${escapeHtml(category)} comparisons</h2></div>
      <div class="grid tools">
        ${cards.map(renderCard).join("\n        ")}
      </div>
    </section>`).join("\n    ")}
    <section class="related-tools-guides">
      <p class="eyebrow">Next step</p>
      <h2>Plan the work after you choose</h2>
      <div class="related-grid">
        <a href="/plywood-cut-calculator/"><span>Calculator</span><strong>Plywood cut calculator</strong></a>
        <a href="/cut-list-calculator/"><span>Calculator</span><strong>Cut list calculator</strong></a>
        <a href="/wood-waste-calculator/"><span>Calculator</span><strong>Wood waste calculator</strong></a>
        <a href="/apps/cutlist/"><span>App</span><strong>CutList Optimizer</strong></a>
      </div>
    </section>
  </main>
  ${footer()}
</body>
</html>
`;
}

const compareDir = join(root, "compare");
mkdirSync(compareDir, { recursive: true });
writeFileSync(join(compareDir, "index.html"), compareIndexPage());

for (const article of newComparisons) {
  const dir = join(compareDir, article.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), comparisonPage(article));
}

console.log(`Generated ${newComparisons.length} new compare pages.`);
