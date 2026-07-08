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
  <link rel="stylesheet" href="/assets/styles.css?v=${version}">
  <script defer src="/assets/app.js?v=${version}"></script>
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
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/cutlist/">CutList</a><a href="/plywood-cut-calculator/">Plywood calculator</a><a href="/wood-waste-calculator/">Waste calculator</a><a href="/tools/">Tools</a><a href="/learn/">Learn</a><a href="/glossary/">Glossary</a></nav></div><div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Results are estimates &mdash; always verify measurements, material quantities, and costs yourself before buying or cutting.</p><p>Our content is not professional, structural, engineering, or safety advice. For stairs, structural work, electrical, plumbing, or anything affecting safety, consult a qualified professional and follow your local building codes and permit requirements. You are responsible for your own measurements, tools, and safety. WoodCutTool is not liable for any loss, injury, or damage arising from use of this site.</p><p>App names, logos, and trademarks (including Apple and App Store) belong to their respective owners and do not imply endorsement. External links and cited sources are provided for reference only.</p></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
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
  if (customDefinitions.has(term.name)) {
    return customDefinitions.get(term.name);
  }

  const copy = categoryCopy[term.category];
  return `${term.name} is a ${copy.noun} used when planning, cutting, assembling, or finishing wood projects. In a cut list workflow, it gives a specific name to a material, part, tool, joint, or constraint that should be checked before cutting.`;
}

function relatedTerms(term, count = 10) {
  const sameCategory = rawTerms.filter((candidate) => candidate.category === term.category && candidate.slug !== term.slug);
  const sameIndex = rawTerms.findIndex((candidate) => candidate.slug === term.slug);
  const nearby = rawTerms
    .slice(Math.max(0, sameIndex - 4), sameIndex)
    .concat(rawTerms.slice(sameIndex + 1, sameIndex + 5))
    .filter((candidate) => candidate.slug !== term.slug);
  const picked = new Map();
  for (const candidate of [...sameCategory, ...nearby]) {
    picked.set(candidate.slug, candidate);
    if (picked.size >= count) break;
  }
  return [...picked.values()];
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
      <p class="lead">Short definitions for 200 woodworking, cabinetmaking, cut list, plywood layout, joinery, lumber, measuring, finishing, and hardware terms. Every glossary page links back to this index and to the full set of terms.</p>
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
        <p>${escapeHtml(copy.why)} For builders using WoodCutTool, the practical point is simple: define the term before the material is cut so the plan, calculator result, and shop work all describe the same thing.</p>
      </section>
      <section>
        <h2>How to use it in a project</h2>
        <p>${escapeHtml(copy.workflow)} When the project has many parts or expensive material, move from a rough note to a real <a href="/cut-list-calculator/">cut list calculator</a>, <a href="/plywood-cut-calculator/">plywood cut calculator</a>, or saved <a href="/apps/cutlist/">CutList</a> layout before buying or cutting stock.</p>
      </section>
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
      <section class="related-tools-guides">
        <p class="eyebrow">Complete glossary</p>
        <h2>All 200 terms are interlinked</h2>
        ${termCardGrid(rawTerms, "Glossary")}
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
