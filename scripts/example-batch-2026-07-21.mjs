const publishedDate = "2026-07-21";

const part = (label, length, width, qty = 1) => ({ label, length, width, qty });
const project = (slug, name, category, templatePath, parts, considerations, troubleshootingPath, troubleshootingLabel) => ({
  slug,
  name,
  category,
  templatePath,
  parts,
  considerations,
  troubleshootingPath,
  troubleshootingLabel,
  publishedDate,
});

// This batch closes the largest gaps between the template library and the
// reproducible Examples surface. Inputs mirror the linked public templates;
// they remain planning examples rather than dimensioned construction plans.
export const exampleBatch20260721 = [
  project(
    "floating-shelf",
    "Floating shelf",
    "Storage",
    "/templates/floating-shelf-cut-list/",
    [part("Top and bottom", 36, 10, 2), part("Long sides", 36, 8.5, 2), part("End caps", 8.5, 8.5, 2), part("Face strip", 36, 1.5)],
    [
      "Choose the concealed bracket or cleat before sizing the hollow shelf box and rear opening.",
      "Verify wall structure, fastener capacity, shelf depth, and expected load rather than relying on the plywood shell alone.",
      "Keep visible face grain aligned across the top, bottom, and front strip when appearance matters.",
    ],
    "/troubleshooting/shelf-sagging/",
    "Diagnose shelf span and load",
  ),
  project(
    "wall-garage-cabinet",
    "Wall garage cabinet",
    "Storage",
    "/templates/wall-garage-cabinet-cut-list/",
    [part("Sides", 30, 24, 2), part("Top and bottom", 30, 22.5, 2), part("Shelves", 28.5, 22, 2), part("Back", 30, 24)],
    [
      "Map studs, masonry, utilities, door travel, and vehicle clearance before setting the cabinet location.",
      "Select a structural hanging method for the loaded cabinet and keep fasteners out of unsupported wall finishes.",
      "Separate doors, cleats, and thinner back material from the carcass sheet calculation when required.",
    ],
    "/troubleshooting/wall-cabinets-not-level/",
    "Diagnose an unlevel wall cabinet",
  ),
  project(
    "storage-bench",
    "Storage bench",
    "Storage",
    "/templates/storage-bench-cut-list/",
    [part("Lid", 48, 18), part("Sides", 18, 17.25, 2), part("Front and back", 46.5, 17.25, 2), part("Divider", 17.25, 16.5)],
    [
      "Choose lid hinges and stays before fixing the rear gap, lid overhang, and interior divider location.",
      "Design the seat, joinery, and base for the expected live load rather than treating the panels as a structural rating.",
      "Provide ventilation and finger-safe clearances when the bench stores shoes, toys, or frequently handled items.",
    ],
    "/troubleshooting/cabinet-box-not-square/",
    "Diagnose a box that will not square",
  ),
  project(
    "toy-box",
    "Toy box",
    "Furniture",
    "/templates/toy-box-cut-list/",
    [part("Lid", 36, 18), part("Sides", 18, 17.25, 2), part("Front and back", 34.5, 17.25, 2), part("Bottom", 34.5, 16.5)],
    [
      "Use child-safe lid support hardware and preserve ventilation and finger clearances around the opening.",
      "Round accessible edges, prevent tip hazards, and verify finishes and fasteners for the intended users.",
      "Prototype the lid motion with the selected hardware before drilling the finished side panels.",
    ],
    "/troubleshooting/cabinet-hinges-bottom-out/",
    "Diagnose hinge travel and alignment",
  ),
  project(
    "shoe-rack",
    "Shoe rack",
    "Storage",
    "/templates/shoe-rack-cut-list/",
    [part("Sides", 30, 12, 2), part("Shelves", 28.5, 11.25, 4), part("Top", 30, 12), part("Back rails", 28.5, 3, 2)],
    [
      "Measure the largest footwear, toe overhang, and hand clearance before choosing shelf spacing or angle.",
      "Add a drip-safe, cleanable surface when wet footwear will be stored indoors.",
      "Keep repeated shelf widths identical and use the back rails or wall restraint to control racking and tipping.",
    ],
    "/troubleshooting/repeated-parts-different-sizes/",
    "Fix inconsistent repeated shelves",
  ),
  project(
    "nightstand",
    "Nightstand",
    "Furniture",
    "/templates/nightstand-cut-list/",
    [part("Top", 20, 18), part("Sides", 18.5, 16.5, 2), part("Shelf", 18.5, 16.5), part("Back", 18.5, 18.5)],
    [
      "Choose drawer slides, door hardware, or an open shelf before fixing the clear interior width.",
      "Check bed height, wall trim, outlet access, and top overhang in the actual room.",
      "Use the back to hold the case square while preserving any cable opening or wall clearance.",
    ],
    "/troubleshooting/drawer-box-too-tight/",
    "Diagnose drawer clearance",
  ),
  project(
    "dining-bench",
    "Dining bench",
    "Furniture",
    "/templates/dining-bench-cut-list/",
    [part("Seat", 60, 14), part("Leg panels", 17.5, 12.5, 2), part("Long stretcher", 54, 4), part("End stretchers", 10, 4, 2)],
    [
      "Set seat height and length from the table apron, user clearance, and desired place settings.",
      "Treat the panel and stretcher arrangement as planning geometry, then verify joinery and live-load strength separately.",
      "Prototype leg position so the bench remains stable without blocking feet or table legs.",
    ],
    "/troubleshooting/tolerance-stack-breaks-assembly/",
    "Diagnose an assembly tolerance stack",
  ),
  project(
    "entryway-table",
    "Entryway table",
    "Furniture",
    "/templates/entryway-table-cut-list/",
    [part("Top", 42, 14), part("Sides", 30, 12.5, 2), part("Shelf", 39, 12.5), part("Back rail", 39, 4)],
    [
      "Measure baseboard, wall outlets, door swing, and walking clearance before setting the final depth.",
      "Check the long shelf and back rail for expected load and racking resistance.",
      "Scribe or level the finished piece at its real location rather than forcing a square cabinet against an uneven wall.",
    ],
    "/troubleshooting/cut-edge-is-bowed/",
    "Diagnose a bowed reference edge",
  ),
  project(
    "tool-cabinet",
    "Tool cabinet",
    "Shop",
    "/templates/tool-cabinet-cut-list/",
    [part("Sides", 36, 8, 2), part("Top and bottom", 30, 7.25, 2), part("Shelves", 28.5, 7.25, 3), part("Back", 36, 30)],
    [
      "Inventory the heaviest tools and their handles before choosing shelf spacing and cabinet depth.",
      "Size the back, cleat, wall attachment, and fasteners for the complete loaded cabinet.",
      "Reserve door thickness, hinge cups, magnetic catches, and swing clearance outside the carcass list.",
    ],
    "/troubleshooting/cabinet-back-racks-the-box/",
    "Diagnose a back that racks the case",
  ),
  project(
    "router-table",
    "Router table",
    "Shop",
    "/templates/router-table-cut-list/",
    [part("Top layers", 32, 24, 2), part("Sides", 30, 22.5, 2), part("Bottom", 30.5, 22.5), part("Fence faces", 32, 4, 2)],
    [
      "Obtain the router plate, lift, fence, switch, and dust hardware before locating any opening or internal support.",
      "Preserve motor ventilation, bit access, cord routing, and dust-hose bend radius inside the cabinet.",
      "Verify top flatness and fence alignment after laminating the two large top layers.",
    ],
    "/troubleshooting/holes-mirrored-on-wrong-face/",
    "Prevent mirrored machining errors",
  ),
  project(
    "pegboard-organizer",
    "Pegboard organizer",
    "Shop",
    "/templates/pegboard-organizer-cut-list/",
    [part("Pegboard panel", 48, 24), part("Side rails", 48, 3, 2), part("Top and bottom rails", 24, 3, 2), part("Spacer strips", 24, 0.75, 4)],
    [
      "Confirm the hole spacing, panel thickness, and hook system before framing the pegboard.",
      "Keep the spacer cavity clear so hooks can pass through without hitting the wall or rails.",
      "Anchor the organizer into verified structure for the actual tool load and distribute heavy items near supports.",
    ],
    "/troubleshooting/holes-mirrored-on-wrong-face/",
    "Check face and hole orientation",
  ),
  project(
    "clamp-rack",
    "Clamp rack",
    "Shop",
    "/templates/clamp-rack-cut-list/",
    [part("Backer", 36, 12), part("Rack arms", 10, 3, 8), part("Front rail", 36, 4), part("Spacer blocks", 3, 3, 8)],
    [
      "Measure bar thickness, head shape, jaw travel, and handle clearance for every clamp family stored.",
      "Laminate or reinforce projecting arms according to the loaded bending demand rather than the empty rack.",
      "Fasten the backer into suitable wall structure and keep heavy clamps within a controlled reach zone.",
    ],
    "/troubleshooting/plywood-delaminates-at-cut/",
    "Diagnose damaged plywood edges",
  ),
  project(
    "drill-press-stand",
    "Drill press stand",
    "Shop",
    "/templates/drill-press-stand-cut-list/",
    [part("Top layers", 24, 20, 2), part("Sides", 30, 18.5, 2), part("Shelf", 21, 18.5), part("Back", 30, 20)],
    [
      "Use the machine footprint, column position, table travel, belt access, and manufacturer mounting pattern.",
      "Design the top, cabinet, anchors, and optional casters for the machine's weight and operating forces.",
      "Check handle travel and long-work support before fixing the stand height or wall distance.",
    ],
    "/troubleshooting/cabinet-box-not-square/",
    "Square the machine cabinet before mounting",
  ),
  project(
    "planter-box",
    "Planter box",
    "Outdoor",
    "/templates/planter-box-cut-list/",
    [part("Long sides", 36, 14, 2), part("End panels", 14, 14, 2), part("False bottom", 34.5, 12.5), part("Corner cleats", 12, 1.5, 4)],
    [
      "Separate soil from plywood with a suitable liner while preserving drainage and ventilation paths.",
      "Choose material, edge sealing, fasteners, and finish for repeated wetting and outdoor exposure.",
      "Verify the full soil-and-water load, support, and safe placement before treating the sample box as structural guidance.",
    ],
    "/troubleshooting/sheet-goods-swell-after-storage/",
    "Diagnose moisture-swollen sheet goods",
  ),
  project(
    "plywood-chair",
    "Plywood chair",
    "Furniture",
    "/templates/plywood-chair-cut-list/",
    [part("Side profiles", 30, 24, 2), part("Seat", 18, 18), part("Back", 18, 16), part("Front stretcher", 16.5, 3)],
    [
      "Prototype seat height, depth, back angle, and front-edge comfort before cutting finished side profiles.",
      "A rectangular nesting envelope does not define the final curved profile or prove joint and live-load strength.",
      "Keep paired side profiles registered and mirrored deliberately so hole locations and visible faces match.",
    ],
    "/troubleshooting/build-sequence-blocks-assembly/",
    "Check the chair assembly sequence",
  ),
  project(
    "lounge-chair",
    "Plywood lounge chair",
    "Furniture",
    "/templates/lounge-chair-cut-list/",
    [part("Side profiles", 32, 30, 2), part("Seat slats", 22, 3, 7), part("Back slats", 22, 3, 6), part("Support rails", 24, 3, 3)],
    [
      "Build a full-size side-profile mockup to test recline, seat height, knee support, and safe entry and exit.",
      "Treat the side-profile rectangles as stock envelopes; the final shapes, holes, joinery, and strength need separate design.",
      "Batch the repeated slats from one verified setup so width, spacing, and edge treatment remain consistent.",
    ],
    "/troubleshooting/ambiguous-dimensions-in-cut-list/",
    "Resolve profile and slat dimensions",
  ),
  project(
    "dollhouse",
    "Plywood dollhouse",
    "Furniture",
    "/templates/dollhouse-cut-list/",
    [part("Side walls", 30, 24, 2), part("Floors", 30, 12, 3), part("Front", 30, 30), part("Roof panels", 32, 18, 2)],
    [
      "Draw floor heights, roof geometry, openings, stairs, and room dividers before releasing the rectangular blanks.",
      "Keep paired walls and roof panels labeled by face and orientation before cutting windows or bevels.",
      "Use age-appropriate openings, edge treatment, finishes, and small-part controls for the intended users.",
    ],
    "/troubleshooting/cut-list-quantity-wrong/",
    "Audit repeated floors and walls",
  ),
  project(
    "desk-organizer",
    "Desk organizer",
    "Small Projects",
    "/templates/desk-organizer-cut-list/",
    [part("Base", 18, 10), part("Back", 18, 8), part("Dividers", 8, 6, 4), part("Tray fronts", 8, 2, 3)],
    [
      "Measure notebooks, mail, devices, cables, and hand clearance before equalizing the compartments.",
      "Use actual material thickness when calculating divider slots and the clear width between parts.",
      "Batch small repeated dividers with a stop and label their orientation before cutting joinery.",
    ],
    "/troubleshooting/repeated-parts-different-sizes/",
    "Fix inconsistent divider sizes",
  ),
  project(
    "monitor-riser",
    "Monitor riser",
    "Small Projects",
    "/templates/monitor-riser-cut-list/",
    [part("Top", 24, 10), part("Sides", 9.25, 8.5, 2), part("Shelf", 22.5, 8.5), part("Back rail", 22.5, 3)],
    [
      "Set height from eye level, display stand geometry, keyboard clearance, and seated posture.",
      "Check the top span and joint design for the real monitor weight and off-center stand position.",
      "Reserve cable, ventilation, and desk-wall clearance before fixing the back rail location.",
    ],
    "/troubleshooting/shelf-sagging/",
    "Check span and monitor load",
  ),
  project(
    "printer-stand",
    "Printer stand",
    "Small Projects",
    "/templates/printer-stand-cut-list/",
    [part("Top layers", 20, 18, 2), part("Sides", 18.5, 16.5, 2), part("Shelf", 18.5, 16.5), part("Back rail", 18.5, 4)],
    [
      "Measure the printer with paper trays, scanner lid, cables, ventilation, and service doors fully open.",
      "Design the top and shelf for operating vibration, paper load, and the machine's concentrated feet.",
      "Keep the back opening large enough for plugs and paper paths without weakening the assembled stand.",
    ],
    "/troubleshooting/cabinet-back-will-not-fit/",
    "Diagnose rear-panel and cable clearance",
  ),
  project(
    "file-cabinet",
    "File cabinet",
    "Storage",
    "/templates/file-cabinet-cut-list/",
    [part("Sides", 28, 16, 2), part("Top and bottom", 18, 15.25, 2), part("Drawer rails", 16.5, 3, 4), part("Back", 28, 18)],
    [
      "Choose letter or legal folders, drawer slides, and hanging hardware before fixing the opening dimensions.",
      "Calculate drawer boxes from the measured finished case and selected slide clearance, not the nominal cabinet width.",
      "Use anti-tip restraint and keep loaded drawer travel from shifting the cabinet beyond a stable support footprint.",
    ],
    "/troubleshooting/drawer-box-too-tight/",
    "Diagnose file-drawer clearance",
  ),
  project(
    "rolling-pantry",
    "Rolling pantry cart",
    "Storage",
    "/templates/rolling-pantry-cut-list/",
    [part("Shelves", 30, 12, 3), part("Sides", 30, 12, 2), part("Back", 30, 30), part("Handle rail", 30, 2)],
    [
      "Measure the gap at floor, counter, and wall height, including baseboard, hinge, and appliance projections.",
      "Choose wheel diameter and guide clearance for the loaded cart before setting shelf and side-panel height.",
      "Keep heavy containers low and provide shelf lips or restraints so contents cannot fall during movement.",
    ],
    "/troubleshooting/tall-cabinet-is-out-of-plumb/",
    "Diagnose a cart or case that leans",
  ),
  project(
    "linen-cabinet",
    "Linen cabinet",
    "Storage",
    "/templates/linen-cabinet-cut-list/",
    [part("Sides", 72, 14, 2), part("Top and bottom", 24, 12.5, 2), part("Shelves", 22.5, 12.5, 4), part("Back", 72, 24)],
    [
      "Measure towels, baskets, door casing, baseboard, and ceiling stand-up clearance before fixing cabinet depth and height.",
      "Choose shelf-pin zones and door hardware before drilling tall visible side panels.",
      "Anchor the cabinet and keep heavier supplies low while preserving ventilation for stored linens.",
    ],
    "/troubleshooting/adjustable-shelves-are-not-level/",
    "Diagnose shelf-pin alignment",
  ),
  project(
    "folding-work-table",
    "Folding work table",
    "Shop",
    "/templates/folding-work-table-cut-list/",
    [part("Top", 48, 24), part("Leg panels", 28.5, 22.5, 2), part("Wall cleat", 46.5, 4), part("Support rails", 42, 3, 2)],
    [
      "Choose hinges, folding supports, latches, and wall attachment before fixing clearances or hole locations.",
      "Verify wall structure and the loaded table capacity in both open and folded positions.",
      "Mock the complete motion so the legs, top, rails, handles, and nearby objects do not collide.",
    ],
    "/troubleshooting/cut-list-missing-hardware-clearance/",
    "Audit folding-hardware clearance",
  ),
];

if (exampleBatch20260721.length !== 24) {
  throw new Error(`Expected 24 example projects, received ${exampleBatch20260721.length}`);
}
if (new Set(exampleBatch20260721.map((entry) => entry.slug)).size !== exampleBatch20260721.length) {
  throw new Error("Example batch slugs must be unique");
}
for (const entry of exampleBatch20260721) {
  if (entry.parts.length < 4 || entry.considerations.length !== 3) {
    throw new Error(`Example batch entry is incomplete: ${entry.slug}`);
  }
  if (!entry.templatePath.startsWith("/templates/") || !entry.troubleshootingPath.startsWith("/troubleshooting/")) {
    throw new Error(`Example batch entry has an invalid related path: ${entry.slug}`);
  }
}
