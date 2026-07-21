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

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function head({ title, description, canonical, jsonLd = "", ogType = "website" }) {
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

function header(active = "Glossary") {
  const links = [
    ["CutList", "/cutlist/"],
    ["QuiltFit", "/quiltfit/"],
    ["Tile", "/tile-calculator/"],
    ["Stringer", "/stringer/"],
    ["Blogs", "/blog/"],
    ["Apps", "/apps/"],
    ["Tools", "/tools/"],
    ["Learn", "/learn/"],
    ["Glossary", "/glossary/"]
  ];
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links">${links.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="${href}">${label}</a>`).join("")}</div><label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label><a class="button small nav-download-cta" href="https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871" rel="nofollow noopener">Download CutList</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/cutlist/">CutList</a><a href="/plywood-cut-calculator/">Plywood calculator</a><a href="/wood-waste-calculator/">Waste calculator</a><a href="/tools/">Tools</a><a href="/learn/">Learn</a><a href="/glossary/">Glossary</a></nav></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/disclaimer/">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

const rawTerms = [
  "Kerf|Cut planning",
  "Blade Kerf|Cut planning",
  "Kerf Allowance|Cut planning",
  "Rip Cut|Cut planning",
  "Cross Cut|Cut planning",
  "Grain Direction|Cut planning",
  "Cut List|Cut planning",
  "Cut Diagram|Cut planning",
  "Sheet Layout|Cut planning",
  "Cut Sequence|Cut planning",
  "Nest Layout|Cut planning",
  "Offcut|Cut planning",
  "Scrap|Cut planning",
  "Yield|Cut planning",
  "Waste Percentage|Cut planning",
  "Part Rotation|Cut planning",
  "Fixed Orientation|Cut planning",
  "Finished Face|Cut planning",
  "Reference Edge|Cut planning",
  "Stop Block|Cut planning",
  "Batch Cutting|Cut planning",
  "Rough Cut|Cut planning",
  "Final Cut|Cut planning",
  "Oversize Allowance|Cut planning",
  "Trim Allowance|Cut planning",
  "Square Cut|Cut planning",
  "Bevel Cut|Cut planning",
  "Miter Cut|Cut planning",
  "Dado Cut|Cut planning",
  "Rabbet Cut|Cut planning",
  "Groove Cut|Cut planning",
  "Plunge Cut|Cut planning",
  "Relief Cut|Cut planning",
  "Tearout|Cut planning",
  "Chipout|Cut planning",
  "Plywood|Sheet goods",
  "MDF|Sheet goods",
  "OSB|Sheet goods",
  "Particle Board|Sheet goods",
  "Melamine|Sheet goods",
  "Baltic Birch|Sheet goods",
  "Cabinet Grade Plywood|Sheet goods",
  "Marine Plywood|Sheet goods",
  "Hardboard|Sheet goods",
  "Veneer Core|Sheet goods",
  "MDF Core|Sheet goods",
  "Particle Core|Sheet goods",
  "Prefinished Plywood|Sheet goods",
  "Plywood Grade|Sheet goods",
  "Face Veneer|Sheet goods",
  "Core Voids|Sheet goods",
  "4x8 Sheet|Sheet goods",
  "Sheet Thickness|Sheet goods",
  "Nominal Thickness|Sheet goods",
  "Actual Thickness|Sheet goods",
  "Panel Saw|Sheet goods",
  "Track Saw|Sheet goods",
  "Table Saw|Sheet goods",
  "Circular Saw|Sheet goods",
  "Lumber|Lumber",
  "Hardwood|Lumber",
  "Softwood|Lumber",
  "Board Foot|Lumber",
  "Linear Foot|Lumber",
  "Nominal Size|Lumber",
  "Actual Size|Lumber",
  "S4S Lumber|Lumber",
  "Rough Lumber|Lumber",
  "Dimensional Lumber|Lumber",
  "Stud|Lumber",
  "Common Board|Lumber",
  "Moisture Content|Lumber",
  "Wood Movement|Lumber",
  "Cupping|Lumber",
  "Bowing|Lumber",
  "Twist|Lumber",
  "Crook|Lumber",
  "Crown|Lumber",
  "End Grain|Lumber",
  "Face Grain|Lumber",
  "Edge Grain|Lumber",
  "Butt Joint|Joinery",
  "Pocket Hole|Joinery",
  "Dado Joint|Joinery",
  "Rabbet Joint|Joinery",
  "Groove Joint|Joinery",
  "Lap Joint|Joinery",
  "Half Lap|Joinery",
  "Miter Joint|Joinery",
  "Mortise and Tenon|Joinery",
  "Dovetail|Joinery",
  "Box Joint|Joinery",
  "Biscuit Joint|Joinery",
  "Domino Joint|Joinery",
  "Dowels|Joinery",
  "Spline|Joinery",
  "Tongue and Groove|Joinery",
  "Shiplap|Joinery",
  "Finger Joint|Joinery",
  "Scarf Joint|Joinery",
  "Bridle Joint|Joinery",
  "Floating Tenon|Joinery",
  "Loose Tenon|Joinery",
  "Glue Joint|Joinery",
  "Clamping Pressure|Joinery",
  "Edge Glue-Up|Joinery",
  "Panel Glue-Up|Joinery",
  "Cauls|Joinery",
  "Countersink|Joinery",
  "Pilot Hole|Joinery",
  "Screw Clearance Hole|Joinery",
  "Cabinet Carcass|Cabinet parts",
  "Face Frame|Cabinet parts",
  "Frameless Cabinet|Cabinet parts",
  "Base Cabinet|Cabinet parts",
  "Wall Cabinet|Cabinet parts",
  "Tall Cabinet|Cabinet parts",
  "Cabinet Side|Cabinet parts",
  "Cabinet Bottom|Cabinet parts",
  "Cabinet Top|Cabinet parts",
  "Fixed Shelf|Cabinet parts",
  "Adjustable Shelf|Cabinet parts",
  "Shelf Pin Hole|Cabinet parts",
  "Back Panel|Cabinet parts",
  "Door Rail|Cabinet parts",
  "Door Stile|Cabinet parts",
  "Center Panel|Cabinet parts",
  "Drawer Box|Cabinet parts",
  "Drawer Front|Cabinet parts",
  "Drawer Side|Cabinet parts",
  "Drawer Bottom|Cabinet parts",
  "Toe Kick|Cabinet parts",
  "Scribe Strip|Cabinet parts",
  "Filler Strip|Cabinet parts",
  "End Panel|Cabinet parts",
  "Stretchers|Cabinet parts",
  "Cleat|Cabinet parts",
  "Nailer|Cabinet parts",
  "Overlay Door|Cabinet parts",
  "Inset Door|Cabinet parts",
  "Reveal|Cabinet parts",
  "Tape Measure|Measuring and layout",
  "Combination Square|Measuring and layout",
  "Speed Square|Measuring and layout",
  "Framing Square|Measuring and layout",
  "Straightedge|Measuring and layout",
  "Chalk Line|Measuring and layout",
  "Story Stick|Measuring and layout",
  "Marking Knife|Measuring and layout",
  "Pencil Line|Measuring and layout",
  "Calipers|Measuring and layout",
  "Bevel Gauge|Measuring and layout",
  "Level|Measuring and layout",
  "Plumb|Measuring and layout",
  "Square|Measuring and layout",
  "Out of Square|Measuring and layout",
  "Diagonal Check|Measuring and layout",
  "Centerline|Measuring and layout",
  "Layout Line|Measuring and layout",
  "Reference Face|Measuring and layout",
  "Shims|Measuring and layout",
  "Scribe Line|Measuring and layout",
  "Dry Fit|Measuring and layout",
  "Mockup|Measuring and layout",
  "Template|Measuring and layout",
  "Jig|Measuring and layout",
  "Fence|Measuring and layout",
  "Featherboard|Measuring and layout",
  "Push Stick|Measuring and layout",
  "Zero Clearance Insert|Measuring and layout",
  "Edge Banding|Finishing and hardware",
  "Veneer Tape|Finishing and hardware",
  "Iron-On Edge Banding|Finishing and hardware",
  "Flush Trim Bit|Finishing and hardware",
  "Roundover Bit|Finishing and hardware",
  "Chamfer|Finishing and hardware",
  "Sanding Grit|Finishing and hardware",
  "Orbital Sander|Finishing and hardware",
  "Hand Sanding|Finishing and hardware",
  "Pre-Stain Conditioner|Finishing and hardware",
  "Stain|Finishing and hardware",
  "Dye|Finishing and hardware",
  "Polyurethane|Finishing and hardware",
  "Water-Based Finish|Finishing and hardware",
  "Oil-Based Finish|Finishing and hardware",
  "Shellac|Finishing and hardware",
  "Lacquer|Finishing and hardware",
  "Danish Oil|Finishing and hardware",
  "Wood Filler|Finishing and hardware",
  "Wood Putty|Finishing and hardware",
  "Hinge Cup|Finishing and hardware",
  "Euro Hinge|Finishing and hardware",
  "Drawer Slide|Finishing and hardware",
  "Full Extension Slide|Finishing and hardware",
  "Soft Close|Finishing and hardware",
  "Shelf Pin|Finishing and hardware",
  "Confirmat Screw|Finishing and hardware",
  "Pocket Screw|Finishing and hardware",
  "Brad Nail|Finishing and hardware",
  "Wood Glue|Finishing and hardware"
].map((row) => {
  const [name, category] = row.split("|");
  return { name, category, slug: slugify(name) };
});

if (rawTerms.length !== 200) {
  throw new Error(`Expected 200 glossary terms, got ${rawTerms.length}.`);
}

const customDefinitions = new Map([
  ["Kerf", "Kerf is the width of material removed by a saw blade during a cut. A cut plan must reserve this space between parts, otherwise the final piece in a row can come out short."],
  ["MDF", "MDF, or medium-density fiberboard, is an engineered sheet material made from wood fiber and resin. It is flat, smooth, and useful for painted parts, but it is heavy and its edges need careful finishing."],
  ["OSB", "OSB, or oriented strand board, is a structural sheet made from compressed wood strands and adhesive. It is common in sheathing and utility work, but it is usually not the first choice for fine cabinet faces."],
  ["Rip Cut", "A rip cut runs with the grain or along the long direction of a board or sheet. In sheet layout work, rip cuts often break a full sheet into long strips before smaller cross cuts are made."],
  ["Cross Cut", "A cross cut runs across the grain or across the shorter dimension of a board. Cross cuts usually bring pieces to final length after the stock has been ripped to width."],
  ["Grain Direction", "Grain direction is the visible direction of the wood fibers or veneer pattern. It matters on doors, drawer fronts, cabinet sides, and any part where appearance or strength depends on orientation."],
  ["Cut List", "A cut list is the named parts table for a project, usually including dimensions, quantities, material, thickness, and notes such as grain direction or finished face."],
  ["Offcut", "An offcut is leftover material from a cut that may still be large enough to save, label, and reuse in a future project."],
  ["Plywood", "Plywood is a sheet good made from thin veneer layers glued with alternating grain direction. That construction makes it stable, strong, and useful for cabinets, shelves, jigs, and many built-ins."],
  ["Board Foot", "A board foot is a lumber volume equal to a board 12 inches long, 12 inches wide, and 1 inch thick. Hardwood is often estimated and sold with this unit."],
  ["Dado Joint", "A dado joint is a slot cut across a board or panel to receive another part, such as a shelf fitting into a cabinet side."],
  ["Rabbet Joint", "A rabbet joint uses a stepped recess cut along an edge, often to receive a cabinet back, door panel, or overlapping case part."],
  ["Cabinet Carcass", "A cabinet carcass is the main box of a cabinet before doors, drawers, face frames, trim, and hardware are added."],
  ["Edge Banding", "Edge banding is a thin strip applied to exposed plywood or panel edges so the part looks finished and resists wear."],
  ["Finished Face", "A finished face is the visible side of a part that should avoid tearout, dents, wrong grain direction, and layout marks."]
]);

const termDetails = new Map([
  ["End Panel", {
    definition: "An end panel is the finished panel seen at the exposed end of a cabinet run. It may be a separate applied skin or a cabinet side sized and finished to remain visible after doors, fillers, countertops, and trim are installed.",
    why: "End panels affect the finished width of the cabinet run, door and drawer reveals, countertop overhang, filler placement, and which plywood face must remain presentation-ready. Leaving the panel out of the cut list can make an otherwise correct cabinet box finish short or misalign with adjacent fronts.",
    workflow: "Confirm whether the design uses an applied panel or a finished cabinet side, then record its finished height, depth, thickness, grain direction, exposed face, and any scribe allowance. Add it to the material group before optimizing sheets so its visible face and grain are not treated like an internal cabinet part.",
    example: "For a base cabinet at the end of a kitchen run, the end panel may extend to the floor, stop above the toe kick, or cover the toe-kick notch. The drawing and cut list must use the same choice before the panel is sized.",
    mistake: "A common mistake is copying the cabinet-side dimensions without checking the door overlay, countertop projection, toe-kick treatment, or wall scribe. The panel can then be structurally usable but visually wrong."
  }],
  ["Template", {
    definition: "A woodworking template is a repeatable pattern used to transfer a shape, hole layout, curve, or cutting boundary to one or more workpieces. Templates are commonly made from MDF, plywood, hardboard, acrylic, or an accurately prepared first part.",
    why: "A template turns one carefully verified layout into repeatable parts. Its accuracy controls every copy, including curves, hardware holes, router paths, and offsets created by guide bushings or bearing-guided bits.",
    workflow: "Mark a reference edge and orientation on the template, verify the master against the drawing, and test it on scrap. When routing, account for the relationship between the cutter, bearing, or guide bushing and keep the template secured so it cannot shift during the cut.",
    example: "A cabinet shop can use one shelf-pin template for every side panel, or a curved MDF template to flush-trim several identical furniture parts after rough cutting them slightly oversize.",
    mistake: "The costly mistake is copying an unverified first layout. A small hole-spacing or offset error is then repeated across every workpiece instead of being caught once."
  }],
  ["Part Rotation", {
    definition: "Part rotation is the option to turn a rectangular part, usually by 90 degrees, while arranging it on a sheet or board. Rotation can improve material yield, but it is only valid when grain direction, finished-face orientation, strength, and pattern direction allow it.",
    why: "Allowing rotation gives a layout optimizer more packing choices and may reduce sheet count. Locking rotation protects appearance and performance when long-grain direction, veneer matching, printed patterns, or directional surfaces matter.",
    workflow: "Set rotation per part rather than as a blanket rule. Allow it for non-directional backs, jigs, and hidden utility pieces; lock it for doors, drawer fronts, cabinet ends, slotted material, and any part whose grain or pattern must run a specified direction.",
    example: "A plywood cabinet back may rotate without affecting appearance, while two visible door fronts should normally keep the same vertical grain even if rotation would fit them onto a smaller offcut.",
    mistake: "Optimizing only for the lowest waste percentage can produce a numerically efficient sheet that has mismatched grain or weak-looking visible parts."
  }],
  ["Drawer Box", {
    definition: "A drawer box is the functional four-sided container and bottom that moves on drawer slides. It is separate from the decorative drawer front and is sized from the cabinet opening, slide clearance, joinery, bottom groove, and required usable depth.",
    why: "Drawer-box dimensions connect cabinet geometry to hardware requirements. Side thickness, slide clearance, front and back joinery, bottom-panel fit, and squareness all change the finished outside width and the individual cut sizes.",
    workflow: "Start with the measured opening and the slide manufacturer's required clearance. Choose the joint and bottom construction, calculate front and back lengths from the finished outside width, then label every side, front, back, and bottom in the cut list before batching repeated drawers.",
    example: "A nominal 18-inch opening does not automatically produce an 18-inch drawer box. Side-mount slides may require a specific clearance on both sides, and inset construction may also change the decorative front without changing the box the same way.",
    mistake: "The usual failure is cutting all pieces from the opening size before subtracting slide clearance and accounting for the joinery. The assembled box then binds or leaves the wrong reveal."
  }],
  ["Panel Saw", {
    definition: "A panel saw is a machine designed to break down sheet goods with the work supported vertically or horizontally while the saw carriage or panel follows a controlled path. It is commonly used for plywood, MDF, melamine, and other large panels.",
    why: "Panel saws make full sheets easier to handle and can produce consistent straight breakdown cuts, but machine calibration, support, blade choice, scoring, and the distinction between rough and final sizing still determine cut quality.",
    workflow: "Inspect the sheet support and reference stops, confirm the blade is suitable for the face material, plan the first breakdown cuts, and label parts as they leave the machine. Leave trim allowance when the panel saw is being used for rough sizing before a final table-saw or track-saw pass.",
    example: "A cabinet shop may first rip a 4x8 sheet into manageable strips on a vertical panel saw, then crosscut repeated cabinet sides to final size using a calibrated stop system.",
    mistake: "Treating every panel-saw cut as automatically finish-ready can leave chipped faces or accumulated dimension error when the machine, blade, or stops have not been checked."
  }],
  ["Flush Trim Bit", {
    definition: "A flush trim bit is a bearing-guided router bit used to trim one surface exactly to a reference edge or template. Common uses include copying shaped parts, trimming laminate or edge banding, and bringing a rough-cut blank to a finished pattern.",
    why: "The bit can reproduce a verified shape quickly, but the bearing must stay on the reference surface and the cutter must meet the grain in a controllable direction. Bit length, bearing position, stock allowance, and workholding all affect the result.",
    workflow: "Rough-cut the workpiece close to the final line, secure the template, confirm the bearing rides on the intended reference, and remove material in shallow controlled passes. Change feed direction or use staged cuts where grain reversal could lift fibers.",
    example: "To make identical curved shelf brackets, cut each blank slightly oversize with a jigsaw, attach the master template, and use the flush trim bit to bring every blank to the same profile.",
    mistake: "Leaving too much material for one heavy router pass or letting the bearing lose contact can cause chatter, tearout, template damage, or a ruined edge."
  }],
  ["Dry Fit", {
    definition: "A dry fit is a temporary assembly made without final glue, permanent fasteners, or finish. It verifies that parts, joints, hardware, clearances, and the assembly sequence work before the project reaches an irreversible step.",
    why: "Dry fitting exposes dimension errors while parts can still be trimmed or remade. It also reveals whether clamps can reach, joints close fully, drawers and doors clear adjacent parts, and a large assembly can be built in the planned order.",
    workflow: "Deburr and label the parts, assemble them in the real sequence, check diagonals and reference faces, test moving hardware, and mark corrections directly on the cut list. Repeat the dry fit after any correction that changes geometry.",
    example: "Before gluing a cabinet carcass, assemble the sides, top, bottom, fixed shelves, and back without glue, then compare diagonals and confirm the back seats fully in its rabbets.",
    mistake: "Checking individual joints but skipping the complete assembly can hide accumulated error, inaccessible clamp positions, or a part that cannot be inserted once another joint is glued."
  }],
  ["Chalk Line", {
    definition: "A chalk line is a reel of pigment-coated string snapped against a surface to create a long straight reference. It is useful for sheet layout, framing, flooring, roofing, and construction work where a pencil and straightedge cannot span the distance conveniently.",
    why: "A chalk line establishes a shared reference over a long distance, but the mark has thickness and can bow if the string is not tensioned or supported. It is a layout aid, not automatically a finish-cut edge.",
    workflow: "Anchor the line at verified points, pull it tight, lift it squarely from the surface, and snap once. Decide which edge or center of the chalk mark represents the measurement, then use a guide or straightedge when the final cut needs tighter accuracy.",
    example: "On a large plywood sheet, a chalk line can mark the rough breakdown boundary before a track-saw rail is aligned to the correct side of the mark for the final cut.",
    mistake: "Cutting through the middle of a wide chalk mark without defining a reference side can introduce a measurable error, especially across repeated panels."
  }],
  ["Countersink", {
    definition: "A countersink is a conical recess that lets the head of a flat-head screw sit flush with or slightly below the material surface. The term can describe the recess, the cutter that makes it, or the operation itself.",
    why: "A correctly sized countersink improves surface fit and reduces splitting or raised fibers around the screw head. It must match the screw-head angle and should not be confused with a straight-sided counterbore used for plugs or different fastener heads.",
    workflow: "Drill the pilot hole for the screw's root diameter, use a stop or test piece to set countersink depth, and verify the screw head sits as intended without removing too much face material. Adjust for hardwood, plywood face veneers, and brittle finished surfaces.",
    example: "For a plywood cabinet cleat, drill the pilot hole first and countersink only deep enough for the flat-head screw to finish flush without cutting through the thin face veneer.",
    mistake: "Driving the screw itself to create the recess can crush fibers, split hardwood, strip the hole, or pull through a thin plywood face."
  }]
]);

const categoryCopy = {
  "Cut planning": {
    noun: "cut planning term",
    why: "It affects whether parts fit on real stock after kerf, orientation, order of operations, and usable leftovers are considered.",
    workflow: "Check this term before finalizing a plywood layout or board cut sequence. It often changes the way parts are grouped, rotated, or spaced in a calculator."
  },
  "Sheet goods": {
    noun: "sheet-good material term",
    why: "Sheet material choice changes thickness, edge finishing, fasteners, weight, face quality, and how much waste a layout can tolerate.",
    workflow: "Enter the real sheet size and thickness before optimizing the layout, then review finished faces and grain direction before cutting."
  },
  Lumber: {
    noun: "lumber term",
    why: "Lumber terms affect buying quantities, board selection, moisture risk, milling allowance, and how boards should be oriented before cutting.",
    workflow: "Use lumber terms with board-foot estimates, cut lists, and rough-to-final dimension planning so the material order matches the finished parts."
  },
  Joinery: {
    noun: "joinery term",
    why: "Joinery choices change part dimensions, cutting order, clamping needs, hardware requirements, and the amount of extra material needed for test cuts.",
    workflow: "Decide joinery before locking the cut list because grooves, rabbets, dados, and fastener clearances can change finished part sizes."
  },
  "Cabinet parts": {
    noun: "cabinetmaking term",
    why: "Cabinet part names keep the cut list readable and prevent identical-looking panels from being mixed up at assembly.",
    workflow: "Name each part in the cut list, mark visible faces, and keep related cabinet pieces grouped in the layout before export or printing."
  },
  "Measuring and layout": {
    noun: "measuring and layout term",
    why: "Layout accuracy controls every cut that follows. Small marking or squaring mistakes can multiply across repeated parts.",
    workflow: "Use measuring and layout checks before buying material and again before cutting, especially when a project must fit an existing wall or opening."
  },
  "Finishing and hardware": {
    noun: "finishing and hardware term",
    why: "Finishing and hardware decisions affect clearances, exposed edges, screw placement, door movement, and the order parts should be cut or drilled.",
    workflow: "Account for hardware holes, edge treatment, sanding, and finish thickness before treating the cut list as final."
  }
};

function definition(term) {
  if (termDetails.has(term.name)) {
    return termDetails.get(term.name).definition;
  }

  if (customDefinitions.has(term.name)) {
    return customDefinitions.get(term.name);
  }

  const copy = categoryCopy[term.category];
  return `${term.name} is a ${copy.noun} used when planning, cutting, assembling, or finishing wood projects. In a cut list workflow, it gives a specific name to a material, part, tool, joint, or constraint that should be checked before cutting.`;
}

function relatedTerms(term, count = 10) {
  const peers = rawTerms.filter((candidate) => candidate.category === term.category);
  const currentIndex = peers.findIndex((candidate) => candidate.slug === term.slug);
  if (currentIndex === -1 || peers.length < 2) return [];

  const related = [];
  const seen = new Set([term.slug]);
  for (let distance = 1; related.length < Math.min(count, peers.length - 1); distance += 1) {
    for (const direction of [1, -1]) {
      const candidate = peers[(currentIndex + direction * distance + peers.length) % peers.length];
      if (!candidate || seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      related.push(candidate);
      if (related.length >= count) break;
    }
  }

  return related;
}

function termCardGrid(terms, label = "Term") {
  return `<div class="related-grid">
          ${terms.map((term) => `<a href="/glossary/${term.slug}/"><span>${escapeHtml(label)}</span><strong>${escapeHtml(term.name)}</strong></a>`).join("\n          ")}
        </div>`;
}

function groupedTerms() {
  const groups = new Map();
  for (const term of rawTerms) {
    const items = groups.get(term.category) || [];
    items.push(term);
    groups.set(term.category, items);
  }

  return [...groups.entries()];
}

function glossaryJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Woodworking Glossary",
    url: `${siteUrl}/glossary/`,
    description: "A 200-term woodworking glossary for cut lists, plywood layout, cabinetmaking, joinery, lumber, sheet goods, measuring, finishing, and hardware.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: rawTerms.map((term, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: term.name,
        url: `${siteUrl}/glossary/${term.slug}/`
      }))
    }
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function glossaryIndexPage() {
  return `<!doctype html>
<html lang="en">
${head({
    title: "Woodworking Glossary: 200 Cut List and Cabinet Terms | WoodCutTool",
    description: "Browse 200 woodworking glossary terms for cut lists, plywood layouts, sheet goods, lumber, joinery, cabinet parts, measuring, finishing, and hardware.",
    canonical: `${siteUrl}/glossary/`,
    jsonLd: glossaryJsonLd()
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Glossary")}
  <main id="main">
    <section class="page-hero">
      <p class="breadcrumb"><a href="/">Home</a> / Glossary</p>
      <p class="eyebrow">Woodworking glossary</p>
      <h1>Woodworking Glossary</h1>
      <p class="lead">Short definitions for 200 woodworking, cabinetmaking, cut list, plywood layout, joinery, lumber, measuring, finishing, and hardware terms. Each page links to focused neighboring terms while this index remains the complete directory.</p>
      <div class="hero-actions"><a class="button" href="/tools/">Explore tools</a><a class="button secondary" href="/learn/">Read guides</a></div>
    </section>
    ${groupedTerms().map(([category, terms]) => `<section class="section">
      <div class="section-heading compact"><p class="eyebrow">${escapeHtml(category)}</p><h2>${escapeHtml(category)} terms</h2></div>
      ${termCardGrid(terms)}
    </section>`).join("\n    ")}
  </main>
  ${footer()}
</body>
</html>
`;
}

function termJsonLd(term) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    description: definition(term),
    url: `${siteUrl}/glossary/${term.slug}/`,
    inDefinedTermSet: `${siteUrl}/glossary/`
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function termPage(term) {
  const copy = categoryCopy[term.category];
  const detail = termDetails.get(term.name);
  const related = relatedTerms(term);
  const title = `What Is ${term.name}? | Woodworking Glossary`;
  const description = `What is ${term.name}? Learn the meaning of ${term.name.toLowerCase()} in woodworking, cut lists, plywood layouts, cabinetmaking, and material planning.`;

  return `<!doctype html>
<html lang="en">
${head({
    title: `${title} | WoodCutTool`,
    description,
    canonical: `${siteUrl}/glossary/${term.slug}/`,
    jsonLd: termJsonLd(term),
    ogType: "article"
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Glossary", "/glossary/"], [term.name, `/glossary/${term.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Glossary")}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/glossary/">Glossary</a> / ${escapeHtml(term.name)}</p>
      <p class="eyebrow">${escapeHtml(term.category)}</p>
      <h1>What is ${escapeHtml(term.name)}?</h1>
      <p class="lead">${escapeHtml(definition(term))}</p>
      <section>
        <h2>Why ${escapeHtml(term.name)} matters</h2>
        <p>${escapeHtml(detail?.why || `${copy.why} For builders using WoodCutTool, the practical point is simple: define the term before the material is cut so the plan, calculator result, and shop work all describe the same thing.`)}</p>
      </section>
      <section>
        <h2>How to use it in a project</h2>
        <p>${escapeHtml(detail?.workflow || copy.workflow)} When the project has many parts or expensive material, move from a rough note to a real <a href="/cut-list-calculator/">cut list calculator</a>, <a href="/plywood-cut-calculator/">plywood cut calculator</a>, or saved <a href="/apps/cutlist/">CutList</a> layout before buying or cutting stock.</p>
      </section>${detail ? `<section>
        <h2>${escapeHtml(term.name)} project example</h2>
        <p>${escapeHtml(detail.example)}</p>
      </section>
      <section>
        <h2>Common ${escapeHtml(term.name.toLowerCase())} mistake</h2>
        <p>${escapeHtml(detail.mistake)}</p>
      </section>` : ""}
      <section class="inline-cta-section">
        <div class="inline-cta">
          <p>Use the glossary to clarify the language, then use WoodCutTool calculators to test the actual numbers.</p>
          <div class="cta-row"><a class="button" href="/tools/">Open tools</a><a class="button secondary" href="/glossary/">Browse glossary</a></div>
        </div>
      </section>
      <section class="related-tools-guides">
        <p class="eyebrow">Related terms</p>
        <h2>Keep reading</h2>
        ${termCardGrid(related)}
      </section>
      <section class="inline-cta-section">
        <div class="inline-cta">
          <p>Need a different definition? The glossary index groups all 200 terms by cut planning, material, joinery, cabinet, measuring, finishing, and hardware topics.</p>
          <div class="cta-row"><a class="button secondary" href="/glossary/">Browse the complete glossary</a></div>
        </div>
      </section>
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}

const glossaryDir = join(root, "glossary");
mkdirSync(glossaryDir, { recursive: true });
writeFileSync(join(glossaryDir, "index.html"), glossaryIndexPage());

for (const term of rawTerms) {
  const termDir = join(glossaryDir, term.slug);
  mkdirSync(termDir, { recursive: true });
  writeFileSync(join(termDir, "index.html"), termPage(term));
}

console.log(`Generated ${rawTerms.length} glossary pages plus index.`);
