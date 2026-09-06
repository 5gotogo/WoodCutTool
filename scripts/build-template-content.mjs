import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { templateBatch20260717 } from "./template-batch-2026-07-17.mjs";
import { projectBenchmarks } from "./plywood-benchmark-data.mjs";
import { smallSpaceProjectBatch20260721 } from "./small-space-project-batch-2026-07-21.mjs";
import { templateDepthBatch20260721 } from "./template-depth-batch-2026-07-21.mjs";
import { cutlistConversionCta } from "./conversion-components.mjs";

import { exampleHandoff, handoffMarkup } from "./cut-handoff-data.mjs";

import { pilotEditorial } from "./pilot-editorial.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
const categoryVisuals = {
  Cabinets: "/assets/images/templates/template-cabinets.png",
  Storage: "/assets/images/templates/template-storage.png",
  Furniture: "/assets/images/templates/template-furniture.png",
  Shop: "/assets/images/templates/template-shop.png",
  Outdoor: "/assets/images/templates/template-shop.png",
  "Small Spaces": "/assets/images/templates/template-furniture.png",
  "Small projects": "/assets/images/templates/template-furniture.png"
};

const templateImageSizes = "(max-width: 900px) calc(100vw - 88px), 812px";

const optimizedTemplateImage = (image, { alt, loading = "lazy", highPriority = false } = {}) => {
  const webp = image.replace(/\.png$/, ".webp");
  const compactWebp = image.replace(/\.png$/, "-724.webp");
  const priority = highPriority ? ' fetchpriority="high"' : "";
  return `<picture><source type="image/webp" srcset="${compactWebp} 724w, ${webp} 1448w" sizes="${templateImageSizes}"><img src="${image}" width="1448" height="1086" loading="${loading}" decoding="async"${priority} alt="${esc(alt)}"></picture>`;
};

const formatInches = (value) => {
  const whole = Math.floor(value);
  const eighths = Math.round((value - whole) * 8);
  if (eighths === 0) return String(whole);
  if (eighths === 8) return String(whole + 1);
  const divisor = eighths % 4 === 0 ? 4 : eighths % 2 === 0 ? 2 : 1;
  const numerator = eighths / divisor;
  const denominator = 8 / divisor;
  return `${whole ? `${whole}-` : ""}${numerator}/${denominator}`;
};
const titleCase = (value) => value.replaceAll(/-/g, " ").replaceAll(/\b\w/g, (letter) => letter.toUpperCase());

const smallSpaceTemplateBatch = smallSpaceProjectBatch20260721.map((entry) => [
  `${entry.slug}-cut-list`,
  titleCase(entry.name),
  entry.category,
  entry.summary,
  entry.parts.map((item) => [item.label, `${formatInches(item.width)} x ${formatInches(item.length)}`, item.qty]),
  entry.considerations,
  entry.smallSpacePlan,
  entry.learnPath,
  entry.learnLabel,
  entry.troubleshootingPath,
  entry.troubleshootingLabel,
  entry.slug,
]);

const templateDepthBatch = templateDepthBatch20260721.map((entry) => [
  entry.slug,
  entry.name,
  entry.category,
  entry.summary,
  entry.parts,
  entry.checks,
  undefined,
  entry.learnPath,
  entry.learnLabel,
  entry.troubleshootingPath,
  entry.troubleshootingLabel,
  undefined,
  entry.releaseBoundary,
]);

const templates = [
  ["floating-shelf-cut-list", "Floating Shelf", "Storage", "A concealed-bracket floating shelf with a plywood box, face strip, and wall cleat.", [["Top and bottom", "10 x 36", 2], ["Long sides", "8-1/2 x 36", 2], ["End caps", "8-1/2 x 8-1/2", 2], ["Face strip", "1-1/2 x 36", 1]]],
  ["wall-garage-cabinet-cut-list", "Wall Garage Cabinet", "Storage", "A wall-mounted garage cabinet with adjustable shelves, a back, and doors sized for a clear work zone.", [["Sides", "24 x 30", 2], ["Top and bottom", "22-1/2 x 30", 2], ["Shelves", "22 x 28-1/2", 2], ["Back", "24 x 30", 1]]],
  ["base-cabinet-cut-list", "Base Cabinet", "Cabinets", "A frameless plywood base cabinet with sides, bottom, stretchers, toe kick, and a removable back.", [["Sides", "23-1/4 x 34-1/2", 2], ["Bottom", "22-1/2 x 30", 1], ["Top stretchers", "3 x 30", 2], ["Back", "30 x 31", 1]]],
  ["wall-cabinet-cut-list", "Wall Cabinet", "Cabinets", "A plywood wall cabinet template with a fixed bottom, adjustable shelves, hanging rails, and a full back.", [["Sides", "11-1/4 x 30", 2], ["Top and bottom", "10-1/2 x 30", 2], ["Shelf", "10-1/2 x 28-1/2", 2], ["Back", "30 x 30", 1]]],
  ["bathroom-vanity-cut-list", "Bathroom Vanity", "Cabinets", "A compact vanity cabinet with a plumbing opening, drawer rail, false front, and sink-ready top support.", [["Sides", "21 x 30", 2], ["Bottom", "20-1/4 x 30", 1], ["Shelf", "20-1/4 x 28-1/2", 1], ["Back rails", "4 x 30", 2]]],
  ["pantry-cabinet-cut-list", "Pantry Cabinet", "Storage", "A tall pantry cabinet with repeatable shelves, a stable back, and an adjustable toe-kick base.", [["Sides", "16 x 84", 2], ["Top and bottom", "14-1/2 x 30", 2], ["Shelves", "14-1/2 x 28-1/2", 5], ["Back", "30 x 84", 1]]],
  ["laundry-room-cabinet-cut-list", "Laundry Room Cabinet", "Cabinets", "A utility-room cabinet template with deep shelves, appliance clearance, and a durable plywood carcass.", [["Sides", "23 x 36", 2], ["Top and bottom", "21-1/2 x 32", 2], ["Shelf", "21-1/2 x 30-1/2", 2], ["Back", "32 x 36", 1]]],
  ["mudroom-bench-cut-list", "Mudroom Bench", "Storage", "A plywood mudroom bench with shoe cubbies, a wide seat, dividers, and a wall-ready back rail.", [["Seat", "18 x 60", 1], ["Sides", "17-1/4 x 18", 2], ["Dividers", "17-1/4 x 16-1/2", 3], ["Bottom", "16-1/2 x 58-1/2", 1]]],
  ["storage-bench-cut-list", "Storage Bench", "Storage", "A lift-top storage bench with a stiff seat, interior dividers, hinge clearance, and plywood end panels.", [["Lid", "18 x 48", 1], ["Sides", "17-1/4 x 18", 2], ["Front and back", "17-1/4 x 46-1/2", 2], ["Divider", "17-1/4 x 16-1/2", 1]]],
  ["window-seat-cut-list", "Window Seat", "Storage", "A built-in window seat with a lift-up top, front face, support dividers, and trim allowance.", [["Seat", "20 x 72", 1], ["Front", "18-1/2 x 72", 1], ["Sides", "18-1/2 x 18-1/2", 2], ["Dividers", "18-1/2 x 18-1/2", 3]]],
  ["toy-box-cut-list", "Toy Box", "Furniture", "A child-friendly plywood toy box with a safe lid gap, fixed bottom, simple sides, and a stiff front.", [["Lid", "18 x 36", 1], ["Sides", "17-1/4 x 18", 2], ["Front and back", "17-1/4 x 34-1/2", 2], ["Bottom", "16-1/2 x 34-1/2", 1]]],
  ["bookshelf-cut-list", "Bookshelf", "Furniture", "A freestanding plywood bookshelf with sides, adjustable shelves, a recessed back, and anti-tip clearance.", [["Sides", "11-1/4 x 72", 2], ["Top and bottom", "10-1/2 x 30", 2], ["Shelves", "10-1/2 x 28-1/2", 4], ["Back", "30 x 72", 1]]],
  ["cube-storage-cut-list", "Cube Storage Unit", "Storage", "A plywood cube organizer with repeated dividers and shelf openings sized for baskets or bins.", [["Sides", "13 x 30", 2], ["Top and bottom", "13 x 58-1/2", 2], ["Vertical dividers", "13 x 28-1/2", 3], ["Shelves", "13 x 18-3/4", 6]]],
  ["record-cabinet-cut-list", "Record Cabinet", "Furniture", "A vinyl record cabinet with reinforced shelves, divider bays, a back, and a low media-console profile.", [["Sides", "16 x 30", 2], ["Top and bottom", "15-1/4 x 58-1/2", 2], ["Dividers", "15-1/4 x 14-1/2", 3], ["Back", "30 x 60", 1]]],
  ["shoe-rack-cut-list", "Shoe Rack", "Storage", "A compact shoe rack with angled shelves, repeated sides, and a plywood back or wall-cleat option.", [["Sides", "12 x 30", 2], ["Shelves", "11-1/4 x 28-1/2", 4], ["Top", "12 x 30", 1], ["Back rail", "3 x 28-1/2", 2]]],
  ["nightstand-cut-list", "Nightstand", "Furniture", "A plywood nightstand with a top, open shelf, drawer-ready opening, and square side panels.", [["Top", "18 x 20", 1], ["Sides", "16-1/2 x 18-1/2", 2], ["Shelf", "16-1/2 x 18-1/2", 1], ["Back", "18-1/2 x 18-1/2", 1]]],
  ["coffee-table-cut-list", "Coffee Table", "Furniture", "A plywood coffee table with a broad top, panel legs, a lower shelf, and simple anti-rack stretchers.", [["Top", "24 x 48", 1], ["Leg panels", "22-1/2 x 22-1/2", 2], ["Lower shelf", "20 x 42", 1], ["Stretchers", "4 x 42", 2]]],
  ["console-table-cut-list", "Console Table", "Furniture", "A narrow plywood console table with a long top, shelf, side panels, and wall-safe proportions.", [["Top", "14 x 48", 1], ["Sides", "12-1/2 x 30", 2], ["Lower shelf", "12-1/2 x 45", 1], ["Back stretcher", "4 x 45", 1]]],
  ["dining-bench-cut-list", "Dining Bench", "Furniture", "A sturdy plywood dining bench with a wide seat, paired legs, stretchers, and room for edge treatment.", [["Seat", "14 x 60", 1], ["Leg panels", "12-1/2 x 17-1/2", 2], ["Long stretcher", "4 x 54", 1], ["End stretchers", "4 x 10", 2]]],
  ["entryway-table-cut-list", "Entryway Table", "Furniture", "A slim entryway table with a shelf, simple panel legs, and a long top for keys and bags.", [["Top", "14 x 42", 1], ["Sides", "12-1/2 x 30", 2], ["Shelf", "12-1/2 x 39", 1], ["Back rail", "4 x 39", 1]]],
  ["rolling-cart-cut-list", "Rolling Utility Cart", "Shop", "A plywood rolling cart with shelves, caster blocks, a push handle, and short side panels.", [["Top", "18 x 30", 1], ["Shelves", "18 x 30", 2], ["Sides", "18 x 28-1/2", 2], ["Caster blocks", "3 x 3", 4]]],
  ["tool-cabinet-cut-list", "Tool Cabinet", "Shop", "A wall or bench tool cabinet with a shallow carcass, adjustable shelves, doors, and a stable back.", [["Sides", "8 x 36", 2], ["Top and bottom", "7-1/4 x 30", 2], ["Shelves", "7-1/4 x 28-1/2", 3], ["Back", "30 x 36", 1]]],
  ["mobile-workbench-cut-list", "Mobile Workbench", "Shop", "A rolling plywood workbench with a thick top, storage shelf, panel legs, and locking caster pads.", [["Top layers", "24 x 48", 2], ["Leg panels", "22-1/2 x 28-1/2", 2], ["Shelf", "20 x 42", 1], ["Caster pads", "4 x 4", 4]]],
  ["miter-saw-stand-cut-list", "Miter Saw Stand", "Shop", "A plywood miter-saw stand with a central saw bay, matching support wings, shelves, and stop-block rails.", [["Top wings", "16 x 30", 2], ["Saw deck", "16 x 24", 1], ["Leg panels", "15-1/4 x 28-1/2", 4], ["Lower shelves", "15-1/4 x 28-1/2", 2]]],
  ["router-table-cut-list", "Router Table", "Shop", "A plywood router table with a double top, cabinet sides, shelf, and removable fence faces.", [["Top layers", "24 x 32", 2], ["Sides", "22-1/2 x 30", 2], ["Bottom", "22-1/2 x 30-1/2", 1], ["Fence faces", "4 x 32", 2]]],
  ["assembly-table-cut-list", "Assembly Table", "Shop", "A flat plywood assembly table with a rigid top, lower shelf, panel legs, and optional dog-hole layout.", [["Top layers", "30 x 60", 2], ["Leg panels", "28-1/2 x 28-1/2", 2], ["Shelf", "24 x 54", 1], ["Stretchers", "4 x 54", 2]]],
  ["pegboard-organizer-cut-list", "Pegboard Organizer", "Shop", "A framed plywood pegboard organizer with spacer strips, side rails, and a shallow storage ledge.", [["Pegboard panel", "24 x 48", 1], ["Side rails", "3 x 48", 2], ["Top and bottom rails", "3 x 24", 2], ["Spacer strips", "3/4 x 24", 4]]],
  ["french-cleat-wall-cut-list", "French Cleat Tool Wall", "Shop", "A plywood French cleat wall with repeated angled strips, a backing panel, and a layout for movable holders.", [["Back panels", "24 x 48", 2], ["Cleat strips", "3-1/2 x 46-1/2", 8], ["Top cap", "2 x 48", 1], ["Bottom spacer", "2 x 48", 1]]],
  ["clamp-rack-cut-list", "Clamp Rack", "Shop", "A wall-mounted plywood clamp rack with layered arms, a stiff backer, and slots sized to your clamp bars.", [["Backer", "12 x 36", 1], ["Rack arms", "10 x 3", 8], ["Front rail", "4 x 36", 1], ["Spacer blocks", "3 x 3", 8]]],
  ["drill-press-stand-cut-list", "Drill Press Stand", "Shop", "A plywood drill-press stand with a wide base, shelf, panel sides, and a reinforced machine top.", [["Top layers", "20 x 24", 2], ["Sides", "18-1/2 x 30", 2], ["Shelf", "18-1/2 x 21", 1], ["Back", "20 x 30", 1]]],
  ["planter-box-cut-list", "Planter Box", "Outdoor", "A lined plywood planter box template with side panels, a false bottom, drainage clearance, and exterior-safe finish notes.", [["Long sides", "14 x 36", 2], ["End panels", "14 x 14", 2], ["False bottom", "12-1/2 x 34-1/2", 1], ["Corner cleats", "1-1/2 x 12", 4]]],
  ["outdoor-storage-box-cut-list", "Outdoor Storage Box", "Outdoor", "A weather-aware plywood storage box with a hinged lid, raised base, drain gap, and interior divider.", [["Lid", "24 x 48", 1], ["Sides", "22-1/2 x 24", 2], ["Front and back", "22-1/2 x 46-1/2", 2], ["Bottom", "22-1/2 x 46-1/2", 1]]],
  ["raised-garden-bed-cut-list", "Raised Garden Bed", "Outdoor", "A simple raised-bed template with plywood panel sides, corner posts, liner clearance, and a protected base option.", [["Long sides", "12 x 48", 2], ["End panels", "12 x 24", 2], ["Corner posts", "2 x 12", 4], ["Top caps", "3 x 48", 2]]],
  ["picnic-table-cut-list", "Picnic Table", "Outdoor", "A plywood picnic table plan with a top, bench seats, A-frame leg panels, and bracing laid out before cuts.", [["Tabletop", "30 x 60", 1], ["Bench seats", "12 x 60", 2], ["Leg panels", "28-1/2 x 28", 2], ["Cross braces", "4 x 54", 2]]],
  ["plywood-chair-cut-list", "Plywood Chair", "Furniture", "A simple plywood chair with paired side profiles, a seat, a back, and test-cut guidance for comfortable angles.", [["Side profiles", "30 x 24", 2], ["Seat", "18 x 18", 1], ["Back", "18 x 16", 1], ["Front stretcher", "3 x 16-1/2", 1]]],
  ["lounge-chair-cut-list", "Plywood Lounge Chair", "Furniture", "A reclining plywood lounge chair with full side profiles, slats, support rails, and a prototype-first cut list.", [["Side profiles", "32 x 30", 2], ["Seat slats", "3 x 22", 7], ["Back slats", "3 x 22", 6], ["Support rails", "3 x 24", 3]]],
  ["kids-table-cut-list", "Kids Table", "Furniture", "A plywood kids table with a small top, rounded corners, paired legs, and low stretchers for active use.", [["Top", "24 x 36", 1], ["Leg panels", "20 x 20", 2], ["Long stretcher", "4 x 30", 1], ["End stretchers", "4 x 18", 2]]],
  ["dollhouse-cut-list", "Plywood Dollhouse", "Furniture", "A sturdy plywood dollhouse with exterior walls, floor levels, room dividers, a roof, and window-layout allowance.", [["Side walls", "30 x 24", 2], ["Floors", "12 x 30", 3], ["Front", "30 x 30", 1], ["Roof panels", "18 x 32", 2]]],
  ["desk-organizer-cut-list", "Desk Organizer", "Small projects", "A compact plywood desk organizer with vertical dividers, small trays, a back, and a sheet-efficient footprint.", [["Base", "10 x 18", 1], ["Back", "8 x 18", 1], ["Dividers", "6 x 8", 4], ["Tray fronts", "2 x 8", 3]]],
  ["monitor-riser-cut-list", "Monitor Riser", "Small projects", "A plywood monitor riser with a broad top, short legs, a shelf opening, and clearance for keyboard storage.", [["Top", "10 x 24", 1], ["Sides", "8-1/2 x 9-1/4", 2], ["Shelf", "8-1/2 x 22-1/2", 1], ["Back rail", "3 x 22-1/2", 1]]],
  ["printer-stand-cut-list", "Printer Stand", "Small projects", "A plywood printer stand with a thick top, paper shelf, side panels, and rear cable clearance.", [["Top layers", "18 x 20", 2], ["Sides", "16-1/2 x 18-1/2", 2], ["Shelf", "16-1/2 x 18-1/2", 1], ["Back rail", "4 x 18-1/2", 1]]],
  ["file-cabinet-cut-list", "File Cabinet", "Storage", "A plywood file cabinet with a reinforced top, drawer bays, rails, and a back that keeps the case square.", [["Sides", "16 x 28", 2], ["Top and bottom", "15-1/4 x 18", 2], ["Drawer rails", "3 x 16-1/2", 4], ["Back", "18 x 28", 1]]],
  ["under-bed-drawer-cut-list", "Under-Bed Drawers", "Storage", "A pair of low plywood under-bed drawers with bottoms, tall sides, pull faces, and caster or glide allowance.", [["Drawer bottoms", "20 x 36", 2], ["Long sides", "6 x 36", 4], ["Ends", "6 x 18-1/2", 4], ["Drawer faces", "8 x 38", 2]]],
  ["rolling-pantry-cut-list", "Rolling Pantry Cart", "Storage", "A narrow rolling pantry cart with shelves, side panels, pull handle, and casters sized for kitchen gaps.", [["Shelves", "12 x 30", 3], ["Sides", "12 x 30", 2], ["Back", "30 x 30", 1], ["Handle rail", "2 x 30", 1]]],
  ["shop-storage-cabinet-cut-list", "Shop Storage Cabinet", "Shop", "A deep plywood shop cabinet with a full back, adjustable shelves, doors, and a stable plinth base.", [["Sides", "20 x 72", 2], ["Top and bottom", "18-1/2 x 36", 2], ["Shelves", "18-1/2 x 34-1/2", 4], ["Back", "36 x 72", 1]]],
  ["utility-closet-cut-list", "Utility Closet Cabinet", "Storage", "A tall utility closet cabinet with broom clearance, an upper shelf, adjustable shelves, and a strong back.", [["Sides", "20 x 84", 2], ["Top and bottom", "18-1/2 x 30", 2], ["Shelves", "18-1/2 x 28-1/2", 3], ["Back", "30 x 84", 1]]],
  ["linen-cabinet-cut-list", "Linen Cabinet", "Storage", "A narrow linen cabinet with repeatable shelves, a face-frame allowance, door clearance, and plywood carcass parts.", [["Sides", "14 x 72", 2], ["Top and bottom", "12-1/2 x 24", 2], ["Shelves", "12-1/2 x 22-1/2", 4], ["Back", "24 x 72", 1]]],
  ["media-wall-cabinet-cut-list", "Media Wall Cabinet", "Furniture", "A low plywood media wall cabinet with equipment bays, cable cutouts, dividers, shelves, and a stiff back.", [["Sides", "16 x 24", 2], ["Top and bottom", "15-1/4 x 72", 2], ["Dividers", "15-1/4 x 22-1/2", 4], ["Back", "24 x 72", 1]]],
  ["folding-craft-table-cut-list", "Folding Craft Table", "Furniture", "A compact folding craft table with a broad work surface, hinged leaves, support legs, and a lower supply shelf.", [["Center top", "24 x 36", 1], ["Folding leaves", "12 x 36", 2], ["Leg panels", "22-1/2 x 28-1/2", 2], ["Supply shelf", "18 x 32", 1]]],
  ["folding-work-table-cut-list", "Folding Work Table", "Shop", "A fold-down plywood work table with a rigid top, folding support legs, wall cleats, and hinge clearance.", [["Top", "24 x 48", 1], ["Leg panels", "22-1/2 x 28-1/2", 2], ["Wall cleat", "4 x 46-1/2", 1], ["Support rails", "3 x 42", 2]]],
  ...templateBatch20260717,
  ...smallSpaceTemplateBatch,
  ...templateDepthBatch
].map(([slug, name, category, summary, parts, projectChecks = [], smallSpacePlan, learnPath, learnLabel, troubleshootingPath, troubleshootingLabel, exampleSlug, releaseBoundary]) => ({
  slug,
  name,
  category,
  summary,
  parts,
  projectChecks,
  smallSpacePlan,
  learnPath,
  learnLabel,
  troubleshootingPath,
  troubleshootingLabel,
  exampleSlug,
  releaseBoundary,
  image: categoryVisuals[category] ?? "/assets/images/templates/template-cabinets.png"
}));

if (templates.length !== 111) {
  throw new Error(`Expected 111 generated template pages, received ${templates.length}`);
}

const existing = [
  ["4x8-plywood-sheet", "4x8 Plywood Cut List", "Sheet"], ["kitchen-cabinet-cut-list", "Kitchen Cabinet Cut List", "Cabinets"], ["bookcase-cut-list", "Bookcase Cut List", "Furniture"], ["closet-shelving-cut-list", "Closet Shelving Cut List", "Storage"], ["garage-shelving-cut-list", "Garage Shelving Cut List", "Storage"], ["drawer-box-cut-list", "Drawer Box Cut List", "Joinery"], ["workbench-cut-list", "Workbench Cut List", "Shop"], ["desk-cut-list", "Desk Cut List", "Furniture"], ["tv-stand-cut-list", "TV Stand Cut List", "Furniture"]
].map(([slug, name, category]) => ({ slug, name, category }));

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function page(template) {
  const editorial = pilotEditorial[template.slug.replace(/-cut-list$/, "")];
  const title = editorial?.templateTitle || `${template.name} Cut List Template (Free Plywood Plan)`;
  const description = editorial?.templateDescription || `Free ${template.name.toLowerCase()} cut list template. Plan the plywood parts, repeated pieces, kerf allowance, and sheet layout before making the first cut.`;
  const rows = template.parts.map(([part, size, qty]) => `${part.padEnd(18)} | ${size.padEnd(15)} | ${qty}`).join("\n");
  const partsTable = `Part               | Size (in)       | Qty\n-------------------+-----------------+----\n${rows}`;
  const projectChecks = template.projectChecks.length
    ? `<section><h2>${esc(template.name)} project-specific checks</h2><p>Use these checks with the sample parts list before calculating sheet count or making a purchase.</p><ul>${template.projectChecks.map((check) => `<li>${esc(check)}</li>`).join("")}</ul></section>`
    : "";
  const smallSpacePlanning = template.smallSpacePlan
    ? `<section class="research-note"><h2>Small-space planning boundary</h2><p>This paired project starts with three constraints that should be measured before the parts list is released.</p><ul><li><strong>Measured footprint:</strong> ${esc(template.smallSpacePlan.footprint)}</li><li><strong>Transport constraint:</strong> ${esc(template.smallSpacePlan.transport)}</li><li><strong>Reversible-installation boundary:</strong> ${esc(template.smallSpacePlan.installation)}</li></ul><p>Inspect the <a href="/examples/${template.exampleSlug}-cut-list/">calculated ${esc(template.name.toLowerCase())} example</a>, then use <a href="${template.learnPath}">${esc(template.learnLabel)}</a> and <a href="${template.troubleshootingPath}">${esc(template.troubleshootingLabel)}</a> before finalizing dimensions.</p></section>`
    : "";
  const releaseBoundaryPlanning = template.releaseBoundary
    ? `<section class="research-note"><h2>Release boundary for this template</h2><p>Do not release these plywood parts from nominal dimensions alone. Close the measurement, system, and installation decisions first.</p><ul><li><strong>Field measurement:</strong> ${esc(template.releaseBoundary.measurement)}</li><li><strong>Hardware and service system:</strong> ${esc(template.releaseBoundary.systems)}</li><li><strong>Installation boundary:</strong> ${esc(template.releaseBoundary.installation)}</li></ul><p>Use <a href="${template.learnPath}">${esc(template.learnLabel)}</a> to prepare the input, and <a href="${template.troubleshootingPath}">${esc(template.troubleshootingLabel)}</a> if the drawing, hardware, or installed condition no longer agrees.</p></section>`
    : "";
  const mainImageWebp = template.image.replace(/\.png$/, ".webp");
  const mainImageCompactWebp = template.image.replace(/\.png$/, "-724.webp");
  const mainImage = optimizedTemplateImage(template.image, {
    alt: `Plywood ${template.category.toLowerCase()} project with cut panels in a workshop`,
    loading: "eager",
    highPriority: true,
  });
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://woodcuttool.com/templates/${template.slug}/"><meta property="og:type" content="website"><meta property="og:site_name" content="WoodCutTool"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="https://woodcuttool.com/templates/${template.slug}/"><meta property="og:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any"><link rel="preload" as="image" href="${mainImageWebp}" imagesrcset="${mainImageCompactWebp} 724w, ${mainImageWebp} 1448w" imagesizes="${templateImageSizes}" fetchpriority="high"><style>.mega-menu{display:none}</style><link rel="stylesheet" href="/assets/styles.css"><script defer src="/assets/site-chrome.js"></script><script defer src="/assets/${editorial ? "content-page" : "app"}.js"></script><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"${esc(template.name)} Cut List Template","description":"${esc(description)}","url":"https://woodcuttool.com/templates/${template.slug}/"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://woodcuttool.com/"},{"@type":"ListItem","position":2,"name":"Templates","item":"https://woodcuttool.com/templates/"},{"@type":"ListItem","position":3,"name":"${esc(template.name)} Cut List","item":"https://woodcuttool.com/templates/${template.slug}/"}]}</script></head>
<body><a class="skip-link" href="#main">Skip to content</a><div data-site-header></div><main id="main" class="article-shell"><article class="article-body"><p class="breadcrumb"><a href="/">Home</a> / <a href="/templates/">Templates</a> / ${esc(template.name)} Cut List</p><p class="eyebrow">${esc(template.category)} cutting template</p><h1>${esc(template.name)} Cut List Template</h1><p class="lead">${esc(editorial?.templateLead || (template.summary + " Use this as a starting point, then change every dimension for your room, hardware, material thickness, and joinery before cutting."))}</p>${handoffMarkup(exampleHandoff(projectBenchmarks.find(p => p.templatePath === `/templates/${template.slug}/`) || {}))}<p class="article-byline">Prepared by the <a href="/about/">WoodCutTool Editorial Team</a> · This is an adjustable planning reference, not a dimensioned construction drawing.</p><figure class="template-page-visual">${mainImage}<figcaption>Use the reference build to visualize the parts, then size the cut list for your own space.</figcaption></figure>${smallSpacePlanning}${releaseBoundaryPlanning}
<section><h2>Plan the ${esc(template.name.toLowerCase())} before buying sheets</h2><p>Start by confirming the finished width, depth, height, access clearances, and load requirements. This template is intentionally made from rectangular plywood parts so you can adapt it without redrawing the whole project. Keep matching pieces grouped together, mark visible faces, and leave room for edge banding, backs, doors, drawers, hinges, or trim that apply to your version.</p><p>Use 3/4 inch plywood for the structural parts unless your design calls for another thickness. A template is not a structural rating: add bracing, wall anchoring, weather protection, or a thicker panel whenever the location, load, or local requirements demand it.</p></section>
${projectChecks}<section><h2>${esc(template.name)} parts list</h2><pre><code>Material: 3/4 in plywood
Kerf allowance: 1/8 in between cuts
Grain direction: keep visible faces consistent

${partsTable}</code></pre><p>Review each part against the actual construction method before cutting. Reduce a shelf or bottom for side-panel thickness where needed, leave back-panel or drawer-slide clearance, and make a test piece for any groove, dado, or hardware opening. Label repeated parts as a batch so their orientation stays consistent.</p></section>
<section><h2>Check the sheet layout and cut order</h2><p>Place the largest parts first, then nest matching rectangles around them. Square footage alone cannot tell you the sheet count because saw kerf, grain direction, and the shape of the remaining offcuts matter. Enter this adjusted list in the <a href="/plywood-cut-calculator/">plywood cut calculator</a> with your real sheet size and blade kerf before purchasing material.</p><p>Break full sheets into manageable strips first, then crosscut the final parts. Keep pairs together, label the inside faces, and dry-fit the case on a flat surface before driving final fasteners. The <a href="/cut-list-calculator/">cut list calculator</a> is useful if the project also uses solid-wood rails, trim, or stretchers.</p><p><a class="button" href="/plywood-cut-calculator/">Check this sheet layout</a></p></section>
<section><h2>Assembly checks that prevent rework</h2><p>Dry-fit the major panels, measure both diagonals for square, and confirm that moving parts or equipment have the clearance you planned. Pre-drill near plywood edges, test fasteners in an offcut, and attach the back only after the cabinet or frame is square. Read <a href="/learn/how-to-read-a-cut-list/">how to read a cut list</a> and <a href="/learn/saw-kerf-explained/">saw kerf explained</a> if you need a refresher before finalizing the layout.</p></section>
<section><h2>How this template was prepared</h2><p>The parts list models a common ${esc(template.name.toLowerCase())} carcass or frame so you have named pieces and repeated quantities to review. It deliberately leaves hardware, joinery, edge treatment, structural loads, and site conditions open because those choices change final dimensions. Before cutting, verify every opening and finished dimension, confirm material thickness with a caliper, apply hardware clearances, and review the optimized layout against the drawing or room. For a transparent comparison of common template inputs, see the <a href="/research/plywood-project-yield-benchmarks/">plywood project yield benchmark</a>.</p></section>
${cutlistConversionCta({
  context: "template",
  source: "template-detail",
  projectName: template.name,
  title: `Replace the sample ${template.name.toLowerCase()} dimensions with the real job`,
  description: "The sample rows are a planning start. Create a CutList project with the measured dimensions, actual material, blade kerf, grain direction, and approved quantities before releasing parts.",
})}
<section><h2>More project templates</h2><p>Browse the <a href="/templates/">full plywood cut list template library</a> for related builds, then save a revised version in the <a href="/apps/cutlist/">CutList optimizer app</a> when you want to compare sheet counts or keep the plan for later.</p></section></article></main><div data-site-footer></div></body></html>\n`;
}

function hub() {
  const allTemplates = [...existing, ...templates];
  const categories = ["Cabinets", "Storage", "Furniture", "Shop", "Outdoor", "Small Spaces", "Small projects", "Sheet", "Joinery"];
  const categoryId = (category) => category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  const collectionSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Plywood Cut List Templates",
    description: "A collection of free project-ready plywood cut list templates for common woodworking builds.",
    url: "https://woodcuttool.com/templates/",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allTemplates.length,
      itemListElement: allTemplates.map((template, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: template.name,
        url: `https://woodcuttool.com/templates/${template.slug}/`
      }))
    }
  });
  const categoryNav = categories.filter((category) => allTemplates.some((template) => template.category === category)).map((category) => `<a href="#${categoryId(category)}">${category}</a>`).join("");
  const categorySections = categories.map((category) => {
    const group = allTemplates.filter((template) => template.category === category);
    if (!group.length) return "";
    const cards = group.map((template) => `<a class="template-directory-card" href="/templates/${template.slug}/"><strong>${esc(template.name.toLowerCase())}</strong><em>Open template →</em></a>`).join("");
    return `<section class="template-category-section" id="${categoryId(category)}"><div class="template-category-heading"><p>${esc(category)}</p><span>${group.length} templates</span></div><div class="related-grid template-category-grid">${cards}</div></section>`;
  }).join("");
  const featured = [
    ["Cabinets", "/templates/kitchen-cabinet-cut-list/", "Kitchen cabinet cut list", "/assets/images/templates/template-cabinets.png", "eager"],
    ["Storage", "/templates/mudroom-bench-cut-list/", "Mudroom bench cut list", "/assets/images/templates/template-storage.png", "lazy"],
    ["Furniture", "/templates/desk-cut-list/", "Desk cut list", "/assets/images/templates/template-furniture.png", "lazy"],
    ["Shop", "/templates/mobile-workbench-cut-list/", "Mobile workbench cut list", "/assets/images/templates/template-shop.png", "lazy"]
  ].map(([category, href, label, image, loading]) => `<a class="template-feature-card" href="${href}">${optimizedTemplateImage(image, { alt: `${label} plywood project template`, loading, highPriority: loading === "eager" })}<span>${category}</span><strong>${label}</strong><em>Open the adjustable parts list →</em></a>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Free Plywood Cut List Templates by Project | WoodCutTool</title><meta name="description" content="Free project-ready plywood cut list templates for cabinets, storage, furniture, shop fixtures, outdoor builds, and small projects."><meta name="robots" content="index,follow"><link rel="canonical" href="https://woodcuttool.com/templates/"><!-- og:start --><meta property="og:type" content="website"><meta property="og:site_name" content="WoodCutTool"><meta property="og:title" content="Free Plywood Cut List Templates by Project | WoodCutTool"><meta property="og:description" content="Free project-ready plywood cut list templates for cabinets, storage, furniture, shop fixtures, outdoor builds, and small projects."><meta property="og:url" content="https://woodcuttool.com/templates/"><meta property="og:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Free Plywood Cut List Templates by Project | WoodCutTool"><meta name="twitter:description" content="Free project-ready plywood cut list templates for cabinets, storage, furniture, shop fixtures, outdoor builds, and small projects."><meta name="twitter:image" content="https://woodcuttool.com/assets/og/woodcuttool-og.png"><!-- og:end --><link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any"><style>.mega-menu{display:none}</style><link rel="stylesheet" href="/assets/styles.css"><script defer src="/assets/site-chrome.js"></script><script defer src="/assets/app.js"></script><script type="application/ld+json">${collectionSchema}</script><!-- breadcrumb:start --><script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://woodcuttool.com/"},{"@type":"ListItem","position":2,"name":"Templates","item":"https://woodcuttool.com/templates/"}]}</script><!-- breadcrumb:end --></head>
<body><a class="skip-link" href="#main">Skip to content</a><div data-site-header></div><main id="main" class="article-shell"><article class="article-body template-library"><p class="breadcrumb"><a href="/">Home</a> / Templates</p><p class="eyebrow">Cut list templates</p><h1>Plywood Cut List Templates</h1><p class="lead">Start from a real project instead of a blank sheet. These ${allTemplates.length} templates provide adjustable plywood parts, quantities, kerf guidance, and sheet-layout links for cabinets, storage, furniture, shop fixtures, outdoor builds, and small projects.</p><nav class="template-category-nav" aria-label="Browse template categories">${categoryNav}</nav><section><h2>Choose a project, then make the cut list yours</h2><p>Every template starts with a project-specific parts list rather than a generic worksheet. Choose a <a href="/templates/kitchen-cabinet-cut-list/">kitchen cabinet cut list</a>, <a href="/templates/bookcase-cut-list/">bookcase cut list</a>, <a href="/templates/workbench-cut-list/">workbench cut list</a>, or another build close to yours; then update the dimensions, material thickness, and hardware allowances before cutting.</p><ul><li><strong>Parts and quantities</strong> for a practical plywood starting point.</li><li><strong>Kerf and layout guidance</strong> to check sheet use before buying material.</li><li><strong>Calculator links</strong> to test your revised layout with your actual sheet size.</li></ul></section><section class="template-feature-section"><div class="template-feature-heading"><div><p class="eyebrow">Build inspiration</p><h2>Start with a cabinet, storage, furniture, or shop cut list</h2></div><p>Four visual starting points for common woodworking builds.</p></div><div class="template-feature-grid">${featured}</div></section><section class="template-directory"><div class="template-directory-heading"><div><p class="eyebrow">All templates</p><h2>Browse by category</h2></div><p>Open a template, adjust the dimensions, then check the sheet layout.</p></div>${categorySections}</section><section><h2>How to use a cut list template</h2><p>A template is a starting point, not a fixed answer. Open the project closest to your build, adjust the dimensions to match your space and materials, then confirm the parts physically fit on a sheet. Use the <a href="/plywood-cut-calculator/">plywood cut calculator</a> with your actual saw kerf, or the <a href="/cut-list-calculator/">cut list calculator</a> for board-cut parts. Save a working version in the <a href="/apps/cutlist/">CutList app</a> when you want to compare revisions.</p><p>If you are new to planning cuts, begin with <a href="/learn/how-to-read-a-cut-list/">how to read a cut list</a> and <a href="/learn/saw-kerf-explained/">saw kerf explained</a>.</p><p><a class="button" href="/apps/cutlist/">Open CutList Optimizer</a></p></section><section><h2>Cut less, waste less</h2><p>Most plywood waste is decided before the first cut, when parts are grouped poorly or a sheet count is guessed. Starting with an adjustable project template gives you a clear set of parts, then the layout calculator shows whether the actual sheet size and kerf will work.</p></section></article></main><div data-site-footer></div></body></html>\n`;
}

await Promise.all(templates.map(async (template) => {
  const output = resolve(root, "templates", template.slug, "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, page(template));
}));
const hubHtml = hub().replace(
  '<section class="template-feature-section">',
  `<section class="research-note"><h2>See a calculated cut list before you edit</h2><p>Open the <a href="/examples/">Cut List Examples library</a> to inspect real part rows, modeled 4×8 sheet counts, material yield, rotation comparisons, layout diagrams, and downloadable CSV files for ${projectBenchmarks.length} of these projects.</p></section><section class="template-feature-section">`
);
await writeFile(resolve(root, "templates", "index.html"), hubHtml);
console.log(`Generated ${templates.length} template pages and refreshed templates hub on ${today}.`);
