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
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/app.js"></script>
  ${jsonLd}
</head>`;
}

function header() {
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links"><a href="/cutlist/">CutList</a><a href="/quiltfit/">QuiltFit</a><a href="/tile-calculator/">Tile</a><a href="/stringer/">Stringer</a><a href="/blog/">Blogs</a><a href="/apps/">Apps</a><a href="/tools/">Tools</a><a href="/learn/">Learn</a></div><label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/cutlist/">CutList</a><a href="/quiltfit/">QuiltFit</a><a href="mailto:727268425@qq.com">Contact</a></nav></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/disclaimer/">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
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
  ["plywood-vs-mdf", "Material", "Plywood vs MDF: Which Sheet Material Should You Use?", "Compare plywood and MDF for cabinets, shelves, painted projects, screw holding, moisture, weight, price, and workability.", "Plywood", "MDF", "Use plywood when strength, screw holding, lighter weight, and moisture forgiveness matter. Use MDF when a smooth painted surface and low material cost matter more than edge strength.", "cabinet boxes, shelves, built-ins, structural panels, and damp-adjacent spaces", "painted doors, smooth panels, templates, speaker boxes, and low-cost flat surfaces", [["Strength", "Better stiffness and screw holding", "Flat but weaker at edges"], ["Moisture resistance", "More forgiving if briefly exposed", "Swells badly when wet"], ["Paint finish", "Needs edge prep and grain control", "Very smooth for paint"], ["Cost", "Usually higher", "Usually lower"], ["Weight", "Lighter by comparable sheet", "Heavier and dense"]], "/learn/mdf-cut-list-planning-guide/", "/plywood-cut-calculator/"],
  ["mdf-vs-particle-board", "Material", "MDF vs Particle Board: Which Panel Is Better?", "Compare MDF and particle board for shelves, cabinets, laminate substrate, screw holding, moisture, weight, price, and finish quality.", "MDF", "Particle board", "Use MDF when paint quality, smooth machining, and denser edges matter. Use particle board when low cost and laminate substrate work matter more than strength or moisture resistance.", "painted panels, routed profiles, doors, templates, and smooth flat work", "laminate counters, budget furniture, dry closet shelves, and low-cost substrates", [["Surface", "Smooth and paint-friendly", "Best under laminate or veneer"], ["Screw holding", "Moderate, weak at edges", "Weaker and crumbly at edges"], ["Moisture", "Poor if wet", "Very poor if wet"], ["Cost", "Low to medium", "Usually lower"], ["Workability", "Machines smoothly but dusty", "Chips and crumbles more easily"]], "/material-library/", "/material-cost-calculator/"],
  ["baltic-birch-vs-plywood", "Material", "Baltic Birch vs Plywood: Which Should You Buy?", "Compare Baltic birch and standard plywood for drawer boxes, jigs, cabinets, exposed edges, price, strength, and sheet yield.", "Baltic birch", "Standard plywood", "Use Baltic birch for precision parts, exposed ply edges, jigs, and drawer boxes. Use standard plywood for larger cabinets, lower cost, and broad 4x8 sheet availability.", "drawer boxes, shop jigs, templates, CNC parts, and exposed layered edges", "cabinet boxes, shelves, built-ins, shop furniture, and general sheet layouts", [["Core", "Many thin consistent plies", "Core quality varies by grade"], ["Sheet size", "Often 5x5 or metric sizes", "Common 4x8 sheets"], ["Edge quality", "Attractive exposed edge", "Usually needs banding"], ["Cost", "Higher", "Lower to medium"], ["Best role", "Precision and appearance", "General yield and availability"]], "/wood/baltic-birch/", "/apps/cutlist/"],
  ["birch-vs-maple", "Material", "Birch vs Maple Wood: Cabinets, Drawers & Furniture", "Compare birch and maple for cabinet parts, drawer boxes, furniture, hardness, density, price, stain behavior, and paint quality.", "Birch", "Maple", "Use birch when you want a practical, paint-friendly hardwood or plywood face at a moderate price. Use maple when hardness, smooth texture, and premium cabinet durability matter more.", "drawer boxes, cabinet parts, plywood faces, painted furniture, and utility shelving", "cabinet doors, drawers, work surfaces, furniture, and high-wear interiors", [["Hardness", "Medium-hard and practical", "Harder, especially hard maple"], ["Price", "Usually medium", "Medium to high"], ["Paint", "Good paint surface", "Excellent smooth paint surface"], ["Stain", "Can blotch", "Can blotch and needs testing"], ["Best use", "Utility cabinet parts", "Durable premium parts"]], "/wood/birch/", "/wood/maple/"],
  ["oak-vs-maple", "Material", "Oak vs Maple Wood: Which Hardwood Fits Your Project?", "Compare oak and maple for cabinets, furniture, flooring, hardness, grain, stain, paint, price, and workability.", "Oak", "Maple", "Use oak when open grain, stain character, and traditional durability are desirable. Use maple when a harder, smoother, cleaner surface is better for modern cabinets or work surfaces.", "stained cabinets, flooring, tables, stair parts, and visible grain projects", "painted cabinets, drawers, work surfaces, furniture, and smooth light finishes", [["Grain", "Open and prominent", "Fine and smooth"], ["Hardness", "Hard and wear resistant", "Hard maple is very hard"], ["Stain", "Takes stain strongly", "Can blotch without testing"], ["Paint", "Grain can show", "Smooth paint base"], ["Cost", "Medium to high", "Medium to high"]], "/wood/oak/", "/wood/maple/"],
  ["pine-vs-cedar", "Material", "Pine vs Cedar: Outdoor, Furniture & Cost Comparison", "Compare pine and cedar for outdoor projects, shelves, trim, garden builds, cost, durability, moisture resistance, and finish behavior.", "Pine", "Cedar", "Use pine for low-cost indoor, painted, and utility projects. Use cedar when natural outdoor resistance, light weight, and weather-friendly garden or fence work matter.", "painted furniture, shop fixtures, trim, shelves, and beginner projects", "outdoor furniture, fencing, garden projects, cladding, and closet lining", [["Outdoor durability", "Needs treatment or protection", "Naturally more weather resistant"], ["Cost", "Lower", "Medium"], ["Weight", "Light", "Light"], ["Surface hardness", "Soft and dents easily", "Soft and dents easily"], ["Finish", "Paints well; stain can blotch", "Often left clear or stained outdoors"]], "/wood/pine/", "/wood/cedar/"],
  ["hardwood-vs-softwood", "Material", "Hardwood vs Softwood: Strength, Cost & Best Uses", "Compare hardwood and softwood for furniture, cabinets, framing, shelves, outdoor work, price, hardness, and woodworking use.", "Hardwood", "Softwood", "Use hardwood when wear resistance, furniture appearance, and durable surfaces matter. Use softwood when framing, cost, light weight, and easy cutting are more important.", "furniture, cabinets, flooring, tool handles, and high-wear finished parts", "framing, trim, outdoor structures, shop fixtures, and painted utility work", [["Source", "Broadleaf trees", "Conifer trees"], ["Hardness", "Often harder, but varies", "Often softer, but varies"], ["Cost", "Usually higher", "Usually lower"], ["Workability", "Can be denser and slower", "Usually easier to cut"], ["Best role", "Finished woodworking", "Construction and utility"]], "/wood/", "/lumber-calculator/"],
  ["solid-wood-vs-plywood", "Material", "Solid Wood vs Plywood: Which Is Better For Builds?", "Compare solid wood and plywood for shelves, cabinets, furniture, movement, cost, edging, strength, moisture, and cut-list planning.", "Solid wood", "Plywood", "Use solid wood when natural edges, shaping, and visible grain are central to the design. Use plywood when stable wide panels, repeatable parts, and sheet yield matter more.", "fine furniture, visible edges, shaped parts, and clear-finished grain", "cabinets, closets, built-ins, wide shelves, painted projects, and sheet layouts", [["Movement", "Moves across the grain", "More dimensionally stable"], ["Wide panels", "Needs glue-up", "Available from sheets"], ["Edges", "Natural wood edge", "Needs banding or lipping"], ["Cost", "Depends on species and grade", "Predictable sheet pricing"], ["Cut planning", "Board selection and defects", "Sheet layout and kerf"]], "/learn/shelf-span-and-plywood-thickness-guide/", "/plywood-cut-calculator/"],
  ["acx-vs-bcx-plywood", "Material", "ACX vs BCX Plywood: Grades, Faces & Outdoor Use", "Compare ACX and BCX plywood for exterior projects, faces, cost, sheathing, paint quality, durability, and project planning.", "ACX plywood", "BCX plywood", "Use ACX when the better A face matters for paint, appearance, or exposed utility work. Use BCX when exterior glue is needed but a lower-grade face is acceptable.", "painted outdoor panels, utility doors, better exposed faces, and appearance-sensitive work", "sheathing, backing, rough outdoor panels, and lower-cost protected work", [["Face grade", "A face on one side", "B face on one side"], ["Back face", "C back", "C back"], ["Exterior glue", "Exterior-rated X glue", "Exterior-rated X glue"], ["Cost", "Higher", "Lower"], ["Best use", "Better visible face", "Utility exterior panel"]], "/learn/plywood-grade-selection-for-cabinets/", "/material-library/"],
  ["circular-saw-vs-table-saw", "Tools", "Circular Saw vs Table Saw: Which Should You Buy First?", "Compare circular saws and table saws for plywood, boards, accuracy, safety, space, cost, repeat cuts, and beginner woodworking.", "Circular saw", "Table saw", "Use a circular saw first when budget, portability, and breaking down sheet goods matter. Use a table saw when repeatable rips, precise sizing, and shop-based production matter.", "first-tool plywood breakdown, job-site cuts, budget shops, and large sheets", "repeat rips, cabinet parts, small pieces, precision sizing, and shop workflows", [["Portability", "Portable and compact", "Stationary and heavy"], ["Accuracy", "Good with a guide", "Excellent with fence and setup"], ["Cost", "Lower", "Higher"], ["Sheet goods", "Great for first breakdown", "Needs support for full sheets"], ["Repeat cuts", "Slower", "Fast and consistent"]], "/blog/cutting-large-sheets-without-a-table-saw/", "/plywood-cut-calculator/"],
  ["track-saw-vs-circular-saw", "Tools", "Track Saw vs Circular Saw: Sheet Goods & Accuracy", "Compare track saws and circular saws for plywood breakdown, accuracy, splinter control, cost, portability, and shop workflow.", "Track saw", "Circular saw", "Use a track saw when straight, clean sheet-good cuts are frequent enough to justify the rail system. Use a circular saw when budget and general-purpose cutting matter more.", "cabinet-grade sheet breakdown, clean plywood cuts, small shops, and job-site accuracy", "rough cuts, framing, budget plywood breakdown, and general DIY cutting", [["Accuracy", "Rail-guided and repeatable", "Depends on straightedge setup"], ["Cut quality", "Cleaner with splinter strip", "Blade and guide dependent"], ["Cost", "Higher", "Lower"], ["Portability", "Portable with rails", "Very portable"], ["Best role", "Sheet-good system", "General cutting tool"]], "/learn/track-saw-sheet-breakdown-workflow/", "/plywood-cut-calculator/"],
  ["router-vs-planer", "Tools", "Router vs Planer: Which Woodworking Tool Do You Need?", "Compare routers and planers for shaping, flattening, joinery, thicknessing, surface prep, cost, and shop workflow.", "Router", "Planer", "Use a router for edges, dados, rabbets, templates, and joinery details. Use a planer when board thickness, parallel faces, and milling rough lumber are the problem.", "edge profiles, dados, rabbets, templates, signs, and joinery details", "flattening thickness, milling boards, surfacing rough lumber, and batch stock prep", [["Primary job", "Shape and cut profiles", "Set board thickness"], ["Material handling", "Tool moves over or along work", "Board feeds through machine"], ["Cost", "Lower entry cost", "Higher entry cost"], ["Dust", "Localized chips and dust", "Large chip volume"], ["Best shop stage", "Joinery and details", "Stock preparation"]], "/blog/router-bit-drawer-cabinet-cut-list/", "/tools/"],
  ["jointer-vs-planer", "Tools", "Jointer vs Planer: Flattening Lumber Correctly", "Compare jointers and planers for flattening boards, parallel faces, rough lumber prep, cost, shop space, and milling workflow.", "Jointer", "Planer", "Use a jointer to create one flat face and one square edge. Use a planer to make the opposite face parallel and bring boards to final thickness.", "flattening one face, straightening one edge, and preparing rough stock reference surfaces", "thicknessing boards, making faces parallel, and batch dimensioning lumber", [["First reference", "Creates flat reference face", "Needs a reference face"], ["Thickness", "Not for final thickness alone", "Excellent for thickness"], ["Edge jointing", "Excellent", "Not the main job"], ["Cost", "Medium to high", "Medium to high"], ["Best workflow", "Before planer", "After jointer"]], "/blog/planing-and-flattening-rough-lumber/", "/lumber-calculator/"],
  ["brad-nailer-vs-finish-nailer", "Tools", "Brad Nailer vs Finish Nailer: Trim, Cabinets & Furniture", "Compare brad nailers and finish nailers for trim, cabinets, holding power, hole size, splitting risk, and shop use.", "Brad nailer", "Finish nailer", "Use a brad nailer for light trim, small parts, and delicate work with smaller holes. Use a finish nailer for stronger trim, casing, and parts needing more holding power.", "small trim, cabinet backs, lightweight moldings, and delicate assemblies", "door casing, baseboard, heavier trim, and stronger fastening", [["Fastener size", "Smaller 18 gauge brads", "Larger 15 or 16 gauge nails"], ["Hole size", "Smaller", "Larger"], ["Holding power", "Lower", "Higher"], ["Splitting risk", "Lower", "Higher in small stock"], ["Best use", "Light trim", "Heavier trim"]], "/blog/screws-nails-glue-joining-compared/", "/tools/"],
  ["pocket-hole-vs-dowels", "Tools", "Pocket Hole vs Dowels: Joinery Strength & Speed", "Compare pocket holes and dowels for cabinet boxes, face frames, furniture, strength, alignment, tools, and visibility.", "Pocket holes", "Dowels", "Use pocket holes when speed, clamps, and hidden backside fastening matter. Use dowels when invisible alignment and cleaner joinery are worth slower layout.", "face frames, cabinet boxes, shop projects, and fast hidden fastening", "furniture joints, alignment, hidden joinery, and cleaner visible work", [["Speed", "Fast", "Slower"], ["Visibility", "Visible from one side unless hidden", "Hidden"], ["Alignment", "Good with clamps", "Excellent with accurate drilling"], ["Tools", "Pocket-hole jig", "Doweling jig or machine"], ["Best use", "Fast cabinet construction", "Cleaner furniture joinery"]], "/blog/pocket-hole-joinery-for-plywood/", "/cut-list-calculator/"],
  ["pocket-hole-vs-biscuit-joint", "Tools", "Pocket Hole vs Biscuit Joint: Which Joinery Fits?", "Compare pocket holes and biscuit joints for panels, cabinets, alignment, strength, clamps, speed, and visible fasteners.", "Pocket holes", "Biscuit joints", "Use pocket holes for mechanical fastening and fast cabinet assembly. Use biscuits for alignment during glue-ups and light hidden registration, not as the main structural fastener.", "fast cabinet boxes, face frames, and hidden mechanical fastening", "panel alignment, edge glue-ups, and hidden registration", [["Strength role", "Mechanical screw joint", "Alignment plus glue"], ["Speed", "Fast after jig setup", "Fast slots but needs glue/clamps"], ["Visibility", "Pocket can show on one side", "Hidden"], ["Tools", "Pocket-hole jig", "Biscuit joiner"], ["Best use", "Assembly fastening", "Panel alignment"]], "/blog/pocket-hole-joinery-for-plywood/", "/templates/bookcase-cut-list/"],
  ["pocket-hole-vs-mortise-and-tenon", "Tools", "Pocket Hole vs Mortise and Tenon: Fast vs Traditional", "Compare pocket-hole joinery and mortise-and-tenon joints for furniture, cabinets, strength, time, tools, and appearance.", "Pocket holes", "Mortise and tenon", "Use pocket holes for fast hidden assembly and practical cabinet work. Use mortise and tenon when traditional strength, appearance, and long-term furniture joinery justify the time.", "quick cabinet frames, shop fixtures, face frames, and hidden fasteners", "chairs, tables, doors, heirloom furniture, and high-stress frames", [["Strength", "Good for many cabinets", "Excellent long-grain mechanical joint"], ["Speed", "Very fast", "Slow and precise"], ["Appearance", "Hidden only if placed carefully", "Traditional and clean"], ["Tools", "Simple jig and screws", "Chisels, router, hollow chisel, or machines"], ["Best use", "Production and utility", "Fine furniture"]], "/glossary/mortise-and-tenon/", "/cut-list-calculator/"],
  ["corded-vs-cordless-circular-saw", "Tools", "Corded vs Cordless Circular Saw: Power, Runtime & Cost", "Compare corded and cordless circular saws for plywood, framing, runtime, power, portability, batteries, and shop workflow.", "Corded circular saw", "Cordless circular saw", "Use a corded saw when continuous power and lower tool cost matter. Use a cordless saw when mobility, quick setup, and job-site freedom are more important.", "long cutting sessions, shop power, budget buying, and heavy repeated cuts", "job sites, quick sheet breakdown, ladder work, and cord-free mobility", [["Power", "Consistent wall power", "Battery and motor dependent"], ["Runtime", "Unlimited with outlet", "Limited by batteries"], ["Portability", "Needs cord management", "Very portable"], ["Cost", "Lower tool cost", "Higher with batteries"], ["Best use", "Shop and long sessions", "Mobile work"]], "/blog/cutting-large-sheets-without-a-table-saw/", "/plywood-cut-calculator/"],
  ["deck-screws-vs-wood-screws", "Construction", "Deck Screws vs Wood Screws: Which Fastener Should You Use?", "Compare deck screws and wood screws for outdoor projects, corrosion resistance, shear strength, pilot holes, cost, and best applications.", "Deck screws", "Wood screws", "Use deck screws for exterior-rated decking and outdoor assemblies where corrosion resistance is required. Use wood screws for indoor woodworking, furniture, and controlled environments.", "decks, fences, exterior repairs, and pressure-treated lumber rated fasteners", "furniture, cabinets, indoor assemblies, and general woodworking", [["Corrosion", "Exterior coatings or stainless options", "Varies widely; many are indoor only"], ["Head style", "Often bugle or trim heads", "Many head styles"], ["Cost", "Higher than basic screws", "Broad range"], ["Outdoor use", "Designed for it when rated", "Only if specified"], ["Best check", "Coating compatibility", "Pilot and countersink"]], "/blog/screws-nails-glue-joining-compared/", "/screw-size-finder/"],
  ["nails-vs-screws", "Construction", "Nails vs Screws: Strength, Speed & Best Uses", "Compare nails and screws for framing, cabinets, decks, shear strength, withdrawal resistance, speed, cost, and repairability.", "Nails", "Screws", "Use nails where speed and shear-friendly framing connections are appropriate. Use screws where pull-out resistance, removability, and precise clamping are more important.", "framing, sheathing, trim production, and fast structural nailing where allowed", "cabinets, decks, removable assemblies, hardware, and clamping parts together", [["Speed", "Very fast with nailer", "Slower"], ["Withdrawal", "Lower", "Higher"], ["Shear behavior", "Often better ductility", "Can be brittle if wrong screw"], ["Removal", "Harder", "Easier"], ["Cost", "Lower per fastener", "Higher per fastener"]], "/blog/screws-nails-glue-joining-compared/", "/drill-bit-finder/"],
  ["pressure-treated-vs-cedar", "Construction", "Pressure Treated vs Cedar: Decks, Fences & Outdoor Builds", "Compare pressure-treated lumber and cedar for decks, fences, garden projects, rot resistance, maintenance, cost, and appearance.", "Pressure-treated lumber", "Cedar", "Use pressure-treated lumber when structural outdoor durability and lower cost matter. Use cedar when natural appearance, lighter weight, and dimensional feel matter more than structural rating.", "deck framing, ground-adjacent lumber, budget outdoor structures, and hidden framing", "fences, garden beds, outdoor furniture, trim, and visible exterior boards", [["Rot resistance", "Chemically treated for exterior use", "Naturally resistant"], ["Appearance", "Utility look", "Warm natural look"], ["Cost", "Usually lower", "Higher"], ["Weight", "Heavier when wet", "Light"], ["Maintenance", "Needs drying and finish planning", "Needs finish for color retention"]], "/wood/cedar/", "/wood-weight-calculator/"],
  ["concrete-footing-vs-deck-blocks", "Construction", "Concrete Footing vs Deck Blocks: Foundation Choice", "Compare concrete footings and deck blocks for decks, sheds, frost, code, load, speed, cost, and long-term movement.", "Concrete footing", "Deck blocks", "Use concrete footings for permanent, code-sensitive, frost-aware, and higher-load structures. Use deck blocks only for light, temporary, or low-risk projects where local rules allow them.", "decks, sheds, posts, frost zones, inspections, and permanent loads", "temporary platforms, light sheds, low decks, and non-permit utility bases", [["Load", "Higher and more permanent", "Limited"], ["Frost", "Can reach frost depth", "Usually surface-bearing"], ["Code", "More likely accepted", "Often limited"], ["Speed", "Slower", "Fast"], ["Cost", "Higher labor", "Lower setup cost"]], "/blog/deck-stair-footing-layout/", "/cost-estimator/"],
  ["2x4-vs-2x6", "Construction", "2x4 vs 2x6: Framing, Shelves & Outdoor Builds", "Compare 2x4 and 2x6 lumber for framing, shelves, decks, strength, span, weight, cost, and project planning.", "2x4", "2x6", "Use 2x4s when cost, weight, and compact framing are enough. Use 2x6s when greater stiffness, span, insulation depth, or load capacity is needed.", "light framing, shop fixtures, small shelves, bracing, and budget builds", "longer spans, deck joists, stronger shelves, wall depth, and heavier loads", [["Strength", "Good for light framing", "Stronger and stiffer"], ["Weight", "Lighter", "Heavier"], ["Cost", "Lower", "Higher"], ["Span", "Shorter", "Longer"], ["Best use", "Compact utility work", "Load and span"]], "/lumber-calculator/", "/wood-weight-calculator/"],
  ["joist-tape-vs-no-tape", "Construction", "Joist Tape vs No Tape: Deck Framing Protection", "Compare using joist tape vs no tape on deck framing for moisture protection, cost, installation time, maintenance, and durability.", "Joist tape", "No tape", "Use joist tape when protecting deck framing from trapped moisture is worth the added labor and material cost. Skip it only when the structure is temporary or the budget clearly accepts shorter protection.", "deck joists, stair stringer tops, beam caps, and moisture-prone framing", "temporary builds, very low-budget structures, or designs with excellent drying", [["Moisture", "Protects top surfaces", "Water sits directly on framing"], ["Cost", "Added material cost", "No added tape cost"], ["Labor", "Adds installation step", "Faster"], ["Durability", "Can extend framing life", "Depends entirely on drainage and finish"], ["Best use", "Long-term decks", "Temporary or low-risk builds"]], "/blog/stair-stringer-spacing-for-composite-decking/", "/material-cost-calculator/"],
  ["composite-deck-vs-wood-deck", "Construction", "Composite Deck vs Wood Deck: Cost, Maintenance & Feel", "Compare composite decking and wood decking for cost, maintenance, heat, span, appearance, fasteners, and long-term durability.", "Composite deck", "Wood deck", "Use composite decking when lower maintenance and consistent boards matter. Use wood decking when lower upfront cost, stiffness, repairability, and natural feel matter more.", "low-maintenance decks, consistent color, hidden fasteners, and long-term finish savings", "budget decks, natural boards, easier replacement, and cooler traditional surfaces", [["Maintenance", "Low maintenance", "Needs stain or seal"], ["Upfront cost", "Higher", "Lower"], ["Heat", "Can run hot", "Often cooler"], ["Span", "Manufacturer-specific", "Species and size dependent"], ["Repair", "Board replacement", "Sand, refinish, or replace"]], "/blog/stair-stringer-spacing-for-composite-decking/", "/cost-estimator/"],
  ["deck-stain-vs-paint", "Construction", "Deck Stain vs Paint: Which Finish Lasts Better?", "Compare deck stain and paint for outdoor wood decks, maintenance, peeling, moisture, appearance, cost, and refinishing.", "Deck stain", "Paint", "Use deck stain when you want a finish that penetrates, shows wood texture, and is easier to refresh. Use paint when you need opaque color and accept higher peeling risk on deck surfaces.", "deck boards, fences, cedar, pressure-treated lumber, and visible wood texture", "vertical trim, rail parts, opaque color changes, and protected exterior surfaces", [["Appearance", "Shows wood texture", "Opaque color"], ["Peeling", "Less film buildup", "Can peel on walking surfaces"], ["Maintenance", "Recoat regularly", "Scrape and repaint if failing"], ["Moisture", "Lets wood breathe more", "Film can trap moisture if damaged"], ["Best use", "Decking and fences", "Trim and accents"]], "/blog/wood-finish-types-compared/", "/material-cost-calculator/"],
  ["cedar-fence-vs-vinyl-fence", "Construction", "Cedar Fence vs Vinyl Fence: Cost, Maintenance & Look", "Compare cedar and vinyl fences for privacy, cost, maintenance, durability, repair, appearance, wind, and installation.", "Cedar fence", "Vinyl fence", "Use cedar when natural appearance, repairability, and traditional fence detailing matter. Use vinyl when low maintenance and consistent color matter more than natural material feel.", "natural privacy fences, custom details, repairable boards, and stained outdoor projects", "low-maintenance privacy fences, uniform panels, and no-paint exterior boundaries", [["Maintenance", "Needs stain or weathering plan", "Low maintenance washing"], ["Appearance", "Natural wood grain", "Uniform manufactured look"], ["Repair", "Replace boards easily", "Panel/profile dependent"], ["Cost", "Varies by grade", "Higher upfront in many markets"], ["Durability", "Good with maintenance", "Good but can crack or fade"]], "/wood/cedar/", "/cost-estimator/"],
  ["gravel-vs-concrete-shed-foundation", "Construction", "Gravel vs Concrete Shed Foundation: Which Base Works?", "Compare gravel and concrete shed foundations for drainage, cost, permanence, floor support, DIY difficulty, and maintenance.", "Gravel foundation", "Concrete slab", "Use gravel for drainage, DIY speed, and many small shed bases. Use concrete when a permanent, hard, level, high-load floor or code-sensitive base is required.", "small sheds, drainage-friendly bases, budget DIY installs, and movable structures", "permanent sheds, heavy equipment, workshops, and slab-floor structures", [["Drainage", "Excellent when built correctly", "Needs slope and edge planning"], ["Cost", "Lower", "Higher"], ["DIY difficulty", "Moderate", "Higher"], ["Permanence", "Easier to change", "Permanent"], ["Best use", "Small sheds", "Heavy or finished spaces"]], "/blog/concrete-step-overlay-measurements/", "/cost-estimator/"],
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
  ["cutlist-vs-sketchup", "Software", "CutList vs SketchUp For Cut Lists", "Compare CutList and SketchUp for woodworking cut lists, plywood layout, kerf, sheet count, revisions, and shop-ready cutting plans.", "CutList", "SketchUp", "Use CutList when the immediate job is a cut list, sheet layout, kerf-aware plan, and PDF shop handoff. Use SketchUp when the project needs 3D modeling, room context, joinery visualization, and design exploration before the cut list is final.", "kerf-aware sheet layouts, fast revisions, saved cut plans, and shop-ready PDFs", "3D design, visual modeling, client presentation, and spatial planning", [["Primary role", "Cut-list optimizer", "3D modeling workspace"], ["Sheet layout", "Built into the workflow", "Requires plugins or manual work"], ["Kerf", "Explicit cut input", "Not native to the model"], ["Revision speed", "Re-run layout quickly", "Revise geometry, then rebuild list"], ["Best handoff", "Cut sheet and part list", "Design model and drawings"]], "/apps/compare/cutlist-vs-sketchup-for-cut-lists/", "/apps/cutlist/"],
  ["cutlist-vs-cut-optimizer", "Software", "CutList vs Cut Optimizer Websites", "Compare CutList and generic cut optimizer websites for plywood projects, privacy, saved layouts, offline use, PDF export, and repeat revisions.", "CutList", "Cut optimizer websites", "Use CutList when the layout should stay saved, private, offline, and available at the saw. Use cut optimizer websites for quick one-off tests when you do not need project history, app workflow, or local records.", "saved iPhone projects, private local planning, PDF export, repeated revisions, and workshop use", "quick browser experiments, occasional one-sheet estimates, and no-install testing", [["Project history", "Saved locally", "Often temporary"], ["Privacy", "No account needed for core workflow", "Depends on each website"], ["Offline use", "Designed for offline planning", "Usually needs browser access"], ["Export", "PDF-oriented project handoff", "Varies by site"], ["Best fit", "Real builds and repeat plans", "Quick feasibility checks"]], "/apps/compare/cutlist-vs-cut-optimizer-websites/", "/plywood-cut-calculator/"],
  ["cutlist-vs-maxcut", "Software", "CutList vs MaxCut For Woodworking Layouts", "Compare CutList and MaxCut for plywood cut lists, cabinet parts, desktop workflows, mobile shop use, kerf, labels, and saved projects.", "CutList", "MaxCut", "Use CutList when the planning workflow needs to be mobile, simple, private, and close to the saw. Use MaxCut when a Windows desktop workflow, larger production setup, or office-based nesting process is the better fit.", "iPhone-first shop planning, quick project revisions, local records, and PDF handoff", "desktop-based planning, larger shop office workflows, and users already committed to Windows software", [["Platform", "iPhone app", "Desktop software"], ["Shop mobility", "Good at the saw or store", "Better at the desk"], ["Setup", "Focused cut list workflow", "More desktop configuration"], ["Output", "Saved project and PDF", "Production-style reports"], ["Best user", "DIY builders and small shops", "Desktop-oriented shops"]], "/blog/best-plywood-cutting-workflow-2026/", "/apps/cutlist/"],
  ["cutlist-vs-cutlist-plus", "Software", "CutList vs CutList Plus: Which Cut List Tool Fits?", "Compare CutList and CutList Plus for woodworking cut lists, desktop vs mobile planning, sheet layouts, printed reports, revisions, and shop workflow.", "CutList", "CutList Plus", "Use CutList when you want a modern mobile cut-list workflow with local iPhone projects and quick PDF handoff. Use CutList Plus when you prefer established desktop software, printed reports, and a PC-centered planning process.", "mobile-first planning, fast revisions, local iPhone records, and simple shop handoff", "desktop cut-list management, printed report workflows, and PC-based shop administration", [["Workflow location", "Phone and shop", "Desktop and office"], ["Learning curve", "Focused app workflow", "Traditional desktop workflow"], ["Revisions", "Quick project edits", "Report-oriented edits"], ["Best output", "Mobile project and PDF", "Desktop reports"], ["Best fit", "Personal builders and small shops", "PC-centered shops"]], "/blog/best-plywood-cutting-workflow-2026/", "/compare/cut-list-app-vs-spreadsheet/"],
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
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/compare/${article.slug}/`,
    mainEntityOfPage: `${siteUrl}/compare/${article.slug}/`,
    image: `${siteUrl}/assets/og/woodcuttool-og.png`,
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    inLanguage: "en",
    articleSection: article.category,
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
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

function ratingFor(option, metric, category) {
  const value = `${option} ${category}`.toLowerCase();
  let score = 3;

  if (metric === "strength") {
    if (/ipe|concrete|hardwood|plywood|table saw|mortise|2x6|screws|composite|oak|maple|baltic/.test(value)) score += 1;
    if (/mdf|particle|osb|pine|cedar|nails|deck blocks|gravel|biscuit|no tape/.test(value)) score -= 1;
  }

  if (metric === "durability") {
    if (/ipe|concrete|pressure treated|composite|deck screws|hardwood|plywood|teak|cedar|vinyl/.test(value)) score += 1;
    if (/mdf|particle|paint|nails|paper|no tape|softwood/.test(value)) score -= 1;
  }

  if (metric === "moisture") {
    if (/pressure treated|cedar|composite|vinyl|concrete|joist tape|deck stain|ipe|osb|exterior/.test(value)) score += 1;
    if (/mdf|particle|raw|hardwood|solid wood|paper|no tape|paint/.test(value)) score -= 1;
  }

  if (metric === "workability") {
    if (/pine|cedar|mdf|circular saw|pocket hole|nails|wood deck|gravel|2x4|router|track saw/.test(value)) score += 1;
    if (/ipe|concrete|table saw|mortise|hardwood|composite|porcelain|jointer/.test(value)) score -= 1;
  }

  return Math.max(1, Math.min(5, score));
}

function ratingCell(label, score) {
  return `<div class="comparison-rating"><span>${escapeHtml(label)}</span><strong>${score}/5</strong><meter min="1" max="5" value="${score}">${score}/5</meter></div>`;
}

function optionRatings(article, option) {
  return [
    ["Strength", ratingFor(option, "strength", article.category)],
    ["Durability", ratingFor(option, "durability", article.category)],
    ["Moisture resistance", ratingFor(option, "moisture", article.category)],
    ["Workability", ratingFor(option, "workability", article.category)]
  ];
}

function prosFor(article, side) {
  const option = side === "a" ? article.optionA : article.optionB;
  const best = side === "a" ? article.bestA : article.bestB;
  const rowValues = article.rows.slice(0, 3).map(([factor, a, b]) => `${factor}: ${side === "a" ? a : b}`);
  return [`Best fit for ${best}`, ...rowValues, `Clear choice when the project is designed around ${option}.`].slice(0, 5);
}

function consFor(article, side) {
  const option = side === "a" ? article.optionA : article.optionB;
  const other = side === "a" ? article.optionB : article.optionA;
  const bestOther = side === "a" ? article.bestB : article.bestA;
  return [
    `Can be the wrong choice when the job is closer to ${bestOther}.`,
    `Requires checking real stock, tool setup, installation conditions, and finish expectations.`,
    `May cost more in rework if chosen only because ${option} is familiar.`,
    `Compare against ${other} with the actual measurements before buying.`
  ];
}

function priceRow(article) {
  return article.rows.find(([factor]) => /cost|price|pricing|budget/i.test(factor)) || [
    "Pricing",
    "Compare local material, blade, fastener, or labor cost before buying.",
    "Compare local material, blade, fastener, or labor cost before buying."
  ];
}

function keyDifferenceCards(article) {
  return article.rows.slice(0, 4).map(([factor, a, b]) => `<article>
          <span>${escapeHtml(factor)}</span>
          <h3>${escapeHtml(article.optionA)} vs ${escapeHtml(article.optionB)}</h3>
          <p><strong>${escapeHtml(article.optionA)}:</strong> ${escapeHtml(a)}</p>
          <p><strong>${escapeHtml(article.optionB)}:</strong> ${escapeHtml(b)}</p>
        </article>`).join("\n        ");
}

const newComparisons = comparisonDefinitions.map(makeArticle);

function comparisonPage(article) {
  const canonical = `${siteUrl}/compare/${article.slug}/`;
  const [priceFactor, priceA, priceB] = priceRow(article);
  const ratingsA = optionRatings(article, article.optionA);
  const ratingsB = optionRatings(article, article.optionB);
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
  <main id="main" class="comparison-page">
    <article>
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/compare/">Compare</a> / ${escapeHtml(article.h1)}</p>
      <section class="comparison-hero">
        <div>
          <p class="eyebrow">${escapeHtml(article.category)} comparison</p>
          <h1>${escapeHtml(article.h1)}</h1>
          <p class="lead">${escapeHtml(article.description)}</p>
          <p class="article-byline">By <a href="/about/">WoodCutTool Editorial Team</a> · Compared by project fit, workflow, material risk, and practical tradeoffs.</p>
          <div class="hero-actions"><a class="button" href="${article.relatedB}">Use related tool</a><a class="button secondary" href="/compare/">Back to Comparison Center</a></div>
        </div>
        <aside class="comparison-verdict-card" aria-label="Quick verdict">
          <span>Quick verdict</span>
          <strong>${escapeHtml(article.optionA)} vs ${escapeHtml(article.optionB)}</strong>
          <p>${escapeHtml(article.quickAnswer)}</p>
        </aside>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Verdict</p><h2>Quick answer</h2></div>
        <div class="comparison-callout">
          <p>${escapeHtml(article.quickAnswer)}</p>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Ratings</p><h2>Strength, durability, moisture, and workability.</h2></div>
        <div class="comparison-rating-grid">
          <article><h3>${escapeHtml(article.optionA)}</h3>${ratingsA.map(([label, score]) => ratingCell(label, score)).join("")}</article>
          <article><h3>${escapeHtml(article.optionB)}</h3>${ratingsB.map(([label, score]) => ratingCell(label, score)).join("")}</article>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Side by side</p><h2>Comparison table</h2></div>
        <div class="table-scroll">
          <table class="comparison-table">
            <thead><tr><th>Factor</th><th>${escapeHtml(article.optionA)}</th><th>${escapeHtml(article.optionB)}</th></tr></thead>
            <tbody>
              ${article.rows.map(([factor, a, b]) => `<tr><td><strong>${escapeHtml(factor)}</strong></td><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td></tr>`).join("\n              ")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Key differences</p><h2>What changes in the real project?</h2></div>
        <div class="comparison-difference-grid">
          ${keyDifferenceCards(article)}
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Pros and cons</p><h2>Tradeoffs by option.</h2></div>
        <div class="comparison-procon-grid">
          <article><h3>${escapeHtml(article.optionA)} pros</h3><ul>${prosFor(article, "a").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article><h3>${escapeHtml(article.optionA)} cons</h3><ul>${consFor(article, "a").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article><h3>${escapeHtml(article.optionB)} pros</h3><ul>${prosFor(article, "b").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article><h3>${escapeHtml(article.optionB)} cons</h3><ul>${consFor(article, "b").map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Pricing</p><h2>Cost comparison</h2></div>
        <div class="comparison-price-grid">
          <article><span>${escapeHtml(priceFactor)}</span><h3>${escapeHtml(article.optionA)}</h3><p>${escapeHtml(priceA)}</p></article>
          <article><span>${escapeHtml(priceFactor)}</span><h3>${escapeHtml(article.optionB)}</h3><p>${escapeHtml(priceB)}</p></article>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Applications</p><h2>Common applications</h2></div>
        <div class="comparison-use-grid">
          <article><h3>Use ${escapeHtml(article.optionA)} for</h3><p>${escapeHtml(article.bestA)}.</p></article>
          <article><h3>Use ${escapeHtml(article.optionB)} for</h3><p>${escapeHtml(article.bestB)}.</p></article>
        </div>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Maintenance</p><h2>Maintenance and long-term fit</h2></div>
        <p class="comparison-copy">Do not compare only sticker price or the first setup step. Compare the whole workflow: measuring, buying, cutting, installing, finishing, revising, maintaining, and repairing the result. A cheaper or faster option can still lose if it creates more waste, harder cuts, weaker fastening, worse appearance, or more rework after the first mistake.</p>
      </section>

      <section class="comparison-section app-cta-band">
        <h2>Plan the work after choosing</h2>
        <p>Once you choose between ${escapeHtml(article.optionA)} and ${escapeHtml(article.optionB)}, run your own numbers. WoodCutTool calculators and apps help turn the comparison into a cut list, sheet count, material estimate, or project record before you buy or cut.</p>
        <p><a class="button" href="/tools/">Explore WoodCutTool tools</a></p>
      </section>

      <section class="comparison-section">
        <div class="section-heading compact"><p class="eyebrow">Internal links</p><h2>Related calculators and articles</h2></div>
        <div class="related-grid">
          <a href="${article.relatedB}"><span>Calculator</span><strong>Related calculator or app</strong><em>Use your own dimensions after comparing.</em></a>
          <a href="${article.relatedA}"><span>Article</span><strong>Related planning article</strong><em>Read the supporting guide for this decision.</em></a>
          <a href="/compare/"><span>Compare</span><strong>All comparisons</strong></a>
          <a href="/apps/cutlist/"><span>App</span><strong>CutList Optimizer</strong></a>
        </div>
      </section>

      <section class="comparison-section faq-list" aria-label="${escapeHtml(article.h1)} FAQ">
        <div class="section-heading compact"><p class="eyebrow">FAQ</p><h2>Common questions</h2></div>
        ${article.faqs.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("\n        ")}
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

function uniqueCards(cards) {
  const seen = new Set();
  return cards.filter((card) => {
    const href = card[3];
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

const cutListSoftwareSpotlight = [
  ["Software", "CutList vs SketchUp", "Cut-list optimizer vs 3D modeling for sheet layouts, kerf, revisions, and shop handoff.", "/compare/cutlist-vs-sketchup/"],
  ["Software", "CutList vs Excel", "Dedicated visual sheet layout vs spreadsheet formulas, pricing, and part rows.", "/compare/cutlist-vs-excel-for-woodworking/"],
  ["Software", "CutList vs Cut Optimizer", "Mobile saved projects vs one-off browser optimizer workflows.", "/compare/cutlist-vs-cut-optimizer/"],
  ["Software", "CutList vs MaxCut", "iPhone-first shop planning vs desktop cut optimization workflows.", "/compare/cutlist-vs-maxcut/"],
  ["Software", "CutList vs CutList Plus", "Modern mobile cut-list planning vs traditional desktop cut-list software.", "/compare/cutlist-vs-cutlist-plus/"]
];

function compareIndexPage() {
  const newCards = newComparisons.map((article) => [article.category, article.h1, article.description, `/compare/${article.slug}/`]);
  const allCards = uniqueCards([...newCards, ...existingComparisons]);
  const grouped = Map.groupBy(allCards, ([category]) => category);
  return `<!doctype html>
<html lang="en">
${head({
    title: "Comparison Center: Wood Materials, Tools & Methods",
    description: "Professional woodworking Comparison Center for materials, sheet goods, lumber, tools, fasteners, construction methods, calculators, and apps.",
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
      <p class="eyebrow">Comparison Center</p>
      <h1>Comparison Center for Woodworking Decisions</h1>
      <p class="lead">Compare wood materials, sheet goods, lumber, woodworking tools, fasteners, construction methods, calculators, and apps before buying material or making the first cut.</p>
      <div class="hero-actions"><a class="button" href="/tools/">Explore tools</a><a class="button secondary" href="/apps/cutlist/">Open CutList</a></div>
    </section>
    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">CutList software comparisons</p><h2>Compare CutList against the tools users already know.</h2><p>These pages target high-intent searches where builders are deciding between a dedicated cut-list app, spreadsheets, 3D modeling, browser optimizers, and desktop cut-list software.</p></div>
      <div class="grid tools">
        ${cutListSoftwareSpotlight.map(renderCard).join("\n        ")}
      </div>
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
