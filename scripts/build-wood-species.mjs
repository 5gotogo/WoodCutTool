import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags, breadcrumbJsonLd } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const version = "20260708-wood-species";

const speciesNames = [
  "Oak", "White Oak", "Red Oak", "Live Oak", "English Oak", "Walnut", "Black Walnut", "Claro Walnut", "European Walnut", "Butternut",
  "Birch", "Yellow Birch", "Paper Birch", "Sweet Birch", "Baltic Birch", "Maple", "Hard Maple", "Soft Maple", "Birdseye Maple", "Curly Maple",
  "Cherry", "Black Cherry", "Pine", "Eastern White Pine", "Southern Yellow Pine", "Ponderosa Pine", "Sugar Pine", "Radiata Pine", "Scots Pine", "Lodgepole Pine",
  "Cedar", "Western Red Cedar", "Eastern Red Cedar", "Spanish Cedar", "Aromatic Cedar", "Ash", "White Ash", "Black Ash", "Poplar", "Tulip Poplar",
  "Beech", "American Beech", "European Beech", "Mahogany", "Honduran Mahogany", "African Mahogany", "Sapele", "Utile", "Khaya", "Meranti",
  "Teak", "Burmese Teak", "Plantation Teak", "Ipe", "Cumaru", "Garapa", "Massaranduba", "Tigerwood", "Jatoba", "Purpleheart",
  "Padauk", "African Padauk", "Bubinga", "Wenge", "Zebrawood", "Cocobolo", "Bocote", "Ziricote", "Rosewood", "Indian Rosewood",
  "Brazilian Rosewood", "East Indian Rosewood", "Kingwood", "Tulipwood", "Ebony", "Gaboon Ebony", "Macassar Ebony", "Lignum Vitae", "Greenheart", "Osage Orange",
  "Hickory", "Shagbark Hickory", "Pecan", "Elm", "American Elm", "Red Elm", "Cedar Elm", "Alder", "Red Alder", "Basswood",
  "Linden", "Sycamore", "American Sycamore", "London Plane", "Sweetgum", "Blackgum", "Tupelo", "Hackberry", "Locust", "Black Locust",
  "Honey Locust", "Chestnut", "American Chestnut", "Horse Chestnut", "Buckeye", "Willow", "Black Willow", "Cottonwood", "Aspen", "Quaking Aspen",
  "Balsa", "Paulownia", "Mango", "Rubberwood", "Acacia", "Black Acacia", "Koa", "Australian Blackwood", "Monkeypod", "Mora",
  "Olivewood", "Osage", "Persimmon", "Dogwood", "Holly", "Boxwood", "Pear", "Apple", "Plum", "Mulberry",
  "Figured Anigre", "Anigre", "Avodire", "Afromosia", "Iroko", "Ovangkol", "Shedua", "Movingui", "Limba", "Black Limba",
  "Lacewood", "Leopardwood", "Canarywood", "Bloodwood", "Satine", "Mopane", "Beli", "Tali", "Angelim Pedra", "Angelim Vermelho",
  "Andiroba", "Marupa", "Katalox", "Chechen", "Granadillo", "Mora Excelsa", "Sucupira", "Tornillo", "Peroba Rosa", "Goncalo Alves",
  "Yellowheart", "Pau Ferro", "Morado", "Benge", "Mun Ebony", "Camphor", "Laurel", "Sassafras", "Catalpa", "Sourwood",
  "Mesquite", "Desert Ironwood", "Mountain Mahogany", "Manzanita", "Redwood", "Douglas Fir", "Hemlock", "Western Hemlock", "Spruce", "Sitka Spruce",
  "Norway Spruce", "Engelmann Spruce", "Fir", "White Fir", "Balsam Fir", "Larch", "Tamarack", "Cypress", "Bald Cypress", "Port Orford Cedar",
  "Yew", "Juniper", "Rimu", "Kauri", "Hoop Pine", "Araucaria", "Merbau", "Keruing", "Kapur", "Balau"
];

const fixed = {
  "Oak": { density: [42, 47], janka: 1320, price: "Medium to high", group: "Hardwood", weight: "Heavy", outdoor: "White oak works better outdoors than red oak; verify the exact stock.", applications: ["cabinets", "flooring", "tables", "stair parts", "interior trim"], pros: ["Strong and familiar", "Excellent wear resistance", "Takes stain well"], cons: ["Open grain can telegraph through paint", "Heavy to handle", "Red oak is not ideal for wet outdoor use"] },
  "Walnut": { density: [36, 40], janka: 1010, price: "High", group: "Hardwood", weight: "Medium", outdoor: "Best for indoor projects or protected exterior accents.", applications: ["fine furniture", "cabinet doors", "desktops", "turning", "decorative panels"], pros: ["Rich dark color", "Machines cleanly", "Looks good with clear finish"], cons: ["Expensive", "Sapwood color can vary", "Usually not chosen for paint-grade work"] },
  "Birch": { density: [40, 45], janka: 1260, price: "Medium", group: "Hardwood", weight: "Medium-heavy", outdoor: "Use indoors unless the project is fully protected.", applications: ["cabinet parts", "drawer boxes", "plywood faces", "painted furniture", "utility shelves"], pros: ["Good strength for the cost", "Smooth paint surface", "Common in plywood"], cons: ["Can blotch under stain", "Not naturally outdoor durable", "Color can look plain under clear finish"] },
  "Maple": { density: [39, 44], janka: 1450, price: "Medium to high", group: "Hardwood", weight: "Heavy", outdoor: "Best indoors; protect carefully if used outside.", applications: ["cabinets", "drawers", "work surfaces", "cutting boards", "furniture"], pros: ["Hard and durable", "Fine smooth texture", "Good for light modern finishes"], cons: ["Can burn when machined", "Can blotch under stain", "Heavy boards need planning"] },
  "Cherry": { density: [34, 38], janka: 950, price: "Medium to high", group: "Hardwood", weight: "Medium", outdoor: "Use indoors; color and stability are best in controlled conditions.", applications: ["furniture", "cabinetry", "casework", "turning", "trim"], pros: ["Warm color deepens with age", "Machines well", "Finishes beautifully"], cons: ["Darkens unevenly under sunlight", "Can blotch with stain", "Costs more than utility hardwoods"] },
  "Pine": { density: [22, 35], janka: 560, price: "Low", group: "Softwood", weight: "Light", outdoor: "Use treated, exterior-rated, or well-protected stock outdoors.", applications: ["painted shelves", "trim", "shop fixtures", "beginner furniture", "utility builds"], pros: ["Affordable", "Easy to cut", "Lightweight"], cons: ["Dents easily", "Knots can move or bleed", "Stain may blotch without conditioner"] },
  "Cedar": { density: [22, 33], janka: 350, price: "Medium", group: "Softwood", weight: "Light", outdoor: "Good outdoor candidate when detailed for drainage and airflow.", applications: ["outdoor furniture", "closet lining", "garden projects", "fencing", "decorative trim"], pros: ["Naturally weather resistant", "Lightweight", "Pleasant aroma in many boards"], cons: ["Soft surface dents easily", "Fasteners need care near edges", "Can split if over-driven"] },
  "Ash": { density: [39, 42], janka: 1320, price: "Medium", group: "Hardwood", weight: "Medium-heavy", outdoor: "Best indoors unless sealed and maintained.", applications: ["chairs", "tool handles", "tables", "bent parts", "sports equipment"], pros: ["Strong and resilient", "Attractive open grain", "Good shock resistance"], cons: ["Open grain needs filling for glass-smooth finishes", "Availability varies", "Not naturally rot resistant"] },
  "Poplar": { density: [25, 32], janka: 540, price: "Low to medium", group: "Hardwood", weight: "Light", outdoor: "Use indoors or under full protection.", applications: ["painted cabinets", "drawer parts", "trim", "utility furniture", "mockups"], pros: ["Affordable hardwood", "Paints well", "Easy to machine"], cons: ["Soft for a hardwood", "Green or gray color can show under clear finish", "Not a wear surface choice"] },
  "Beech": { density: [40, 45], janka: 1300, price: "Medium", group: "Hardwood", weight: "Heavy", outdoor: "Best for indoor furniture and tools.", applications: ["workbench tops", "chairs", "tool handles", "drawer slides", "furniture"], pros: ["Hard and uniform", "Good for steam bending", "Reliable indoor wear surface"], cons: ["Moves with moisture", "Plain figure", "Needs good finish in humid shops"] },
  "White Oak": { density: [45, 48], janka: 1360, price: "Medium to high", group: "Hardwood", weight: "Heavy", outdoor: "Good exterior candidate when detailed to shed water.", applications: ["cabinetry", "flooring", "outdoor furniture", "boat trim", "tables"] },
  "Red Oak": { density: [42, 45], janka: 1290, price: "Medium", group: "Hardwood", weight: "Heavy", outdoor: "Best indoors; open pores make it a poor wet exterior choice.", applications: ["flooring", "cabinets", "trim", "tables", "stairs"] },
  "Black Walnut": { density: [36, 39], janka: 1010, price: "High", group: "Hardwood", weight: "Medium", outdoor: "Best indoors or in protected exterior details.", applications: ["fine furniture", "desktops", "cabinet doors", "turning", "decorative panels"] },
  "Hard Maple": { density: [43, 47], janka: 1450, price: "Medium to high", group: "Hardwood", weight: "Heavy", outdoor: "Best indoors.", applications: ["work surfaces", "cutting boards", "cabinets", "drawers", "flooring"] },
  "Soft Maple": { density: [35, 39], janka: 950, price: "Medium", group: "Hardwood", weight: "Medium", outdoor: "Best indoors.", applications: ["painted cabinets", "drawers", "furniture", "trim", "shelves"] },
  "Yellow Birch": { density: [41, 45], janka: 1260, price: "Medium", group: "Hardwood", weight: "Medium-heavy", outdoor: "Best indoors.", applications: ["cabinet parts", "drawer boxes", "furniture", "plywood faces", "flooring"] },
  "Eastern White Pine": { density: [22, 25], janka: 380, price: "Low", group: "Softwood", weight: "Light", outdoor: "Use protected or exterior-rated stock outdoors.", applications: ["painted furniture", "trim", "shelves", "carving", "shop fixtures"] },
  "Southern Yellow Pine": { density: [35, 41], janka: 870, price: "Low to medium", group: "Softwood", weight: "Medium-heavy", outdoor: "Use treated or exterior-rated stock outdoors.", applications: ["framing", "workbenches", "shelving", "decks", "utility projects"] },
  "Western Red Cedar": { density: [22, 24], janka: 350, price: "Medium", group: "Softwood", weight: "Light", outdoor: "Good exterior candidate when detailed and maintained.", applications: ["outdoor furniture", "fencing", "cladding", "garden projects", "closet lining"] },
  "Teak": { density: [40, 44], janka: 1070, price: "High", group: "Tropical hardwood", weight: "Medium-heavy", outdoor: "Excellent outdoor reputation when sourced responsibly and detailed correctly.", applications: ["outdoor furniture", "boat trim", "tables", "decking", "high-moisture accents"] },
  "Ipe": { density: [60, 69], janka: 3680, price: "High", group: "Tropical hardwood", weight: "Very heavy", outdoor: "Excellent exterior candidate, but predrilling and stainless fasteners are often needed.", applications: ["decking", "outdoor furniture", "stairs", "high-wear parts", "commercial fixtures"] },
  "Hickory": { density: [48, 53], janka: 1820, price: "Medium to high", group: "Hardwood", weight: "Heavy", outdoor: "Best indoors or protected.", applications: ["tool handles", "chairs", "flooring", "work surfaces", "sporting goods"] }
};

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

function hash(value) {
  let h = 0;
  for (const char of String(value)) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

function rangeValue(seed, min, max, step = 1) {
  const count = Math.floor((max - min) / step) + 1;
  const index = ((seed % count) + count) % count;
  return min + index * step;
}

function densityRange(seed, lowMin, lowMax, spanMin, spanMax) {
  const low = rangeValue(seed, lowMin, lowMax);
  const span = rangeValue(seed >> 4, spanMin, spanMax);
  return [low, low + span];
}

function inferGroup(name) {
  if (/(pine|cedar|fir|spruce|hemlock|larch|redwood|cypress|yew|juniper|douglas|kauri|rimu|araucaria)/i.test(name)) return "Softwood";
  if (/(teak|ipe|cumaru|garapa|massaranduba|tigerwood|jatoba|purpleheart|padauk|bubinga|wenge|zebrawood|cocobolo|bocote|ziricote|rosewood|kingwood|tulipwood|ebony|lignum|greenheart|mahogany|sapele|utile|khaya|meranti|iroko|ovangkol|merbau|keruing|kapur|balau|katalox|chechen|granadillo|sucupira|pau ferro|morado|mopane|tali|andiroba|peroba|goncalo|yellowheart)/i.test(name)) return "Tropical hardwood";
  return "Hardwood";
}

function groupProfile(group, name) {
  const s = hash(name);
  if (group === "Softwood") {
    return {
      density: densityRange(s, 21, 31, 5, 10),
      janka: rangeValue(s >> 5, 320, 920, 20),
      price: /redwood|cedar|yew|kauri|rimu/i.test(name) ? "Medium to high" : "Low to medium",
      weight: "Light to medium",
      outdoor: /cedar|redwood|cypress|yew|juniper/i.test(name) ? "Often used outdoors when detailed for drainage and maintained." : "Use exterior-rated, treated, or protected stock outdoors.",
      applications: ["framing", "trim", "painted shelves", "outdoor projects", "shop fixtures"]
    };
  }
  if (group === "Tropical hardwood") {
    return {
      density: densityRange(s, 42, 56, 8, 16),
      janka: rangeValue(s >> 5, 1350, 3600, 50),
      price: "High",
      weight: "Heavy",
      outdoor: /teak|ipe|cumaru|garapa|massaranduba|greenheart|merbau|balau/i.test(name) ? "Often chosen for exterior work, but movement, fasteners, and sourcing matter." : "Use outdoors only when the exact species is suitable and the detail sheds water.",
      applications: ["fine furniture", "decking or exterior accents", "decorative panels", "turning", "high-wear parts"]
    };
  }
  return {
    density: densityRange(s, 30, 40, 5, 12),
    janka: rangeValue(s >> 5, 700, 1800, 25),
    price: ["Low to medium", "Medium", "Medium to high"][s % 3],
    weight: (s % 3 === 0) ? "Medium" : "Medium-heavy",
    outdoor: /black locust|osage|mesquite|chestnut|acacia/i.test(name) ? "Can work outdoors when the exact stock is durable and detailing is correct." : "Best for indoor or protected projects unless supplier data says otherwise.",
    applications: ["furniture", "cabinets", "shelves", "interior trim", "small project parts"]
  };
}

function normalizeSpecies(name, position) {
  const override = fixed[name] || {};
  const group = override.group || inferGroup(name);
  const profile = { ...groupProfile(group, name), ...override };
  const densityAvg = Math.round((profile.density[0] + profile.density[1]) / 2);
  const kg = Math.round(densityAvg * 16.0185);
  const janka = Number(profile.janka);
  const hardness = janka >= 2200 ? "Very hard" : janka >= 1400 ? "Hard" : janka >= 850 ? "Medium" : "Soft";
  const finish = group === "Softwood"
    ? "Paint usually works well after sealing knots; stain can blotch, so test conditioner first."
    : group === "Tropical hardwood"
      ? "Clear oil or film finishes highlight color; oily species may need solvent wipe and finish testing."
      : "Clear finish is usually reliable; stain and paint should be tested on offcuts.";
  const applications = profile.applications;
  const pros = profile.pros || [
    `${hardness === "Soft" ? "Easy to cut and shape" : "Useful strength for woodworking parts"}`,
    `${profile.weight.includes("Light") ? "Light enough for easy handling" : "Stable feel in finished pieces"}`,
    `${group === "Tropical hardwood" ? "Distinct color and grain" : "Works in many shop workflows"}`
  ];
  const cons = profile.cons || [
    "Actual boards vary by supplier, grade, and moisture",
    `${profile.weight === "Heavy" ? "Heavy stock can be harder to move and ship" : "Needs testing before final finish"}`,
    `${janka > 1800 ? "Hardness may slow cutting and dull tools faster" : "Surface durability may be lower than harder species"}`
  ];
  return {
    position,
    name,
    slug: slugify(name),
    group,
    density: profile.density,
    densityMetric: kg,
    janka,
    hardness,
    price: profile.price,
    weight: profile.weight,
    outdoor: profile.outdoor,
    finish,
    applications,
    pros,
    cons
  };
}

const uniqueSpecies = [];
const seen = new Set();
for (const name of speciesNames) {
  const slug = slugify(name);
  if (!seen.has(slug)) {
    seen.add(slug);
    uniqueSpecies.push(name);
  }
}

const species = uniqueSpecies.slice(0, 200).map((name, index) => normalizeSpecies(name, index + 1));

if (species.length !== 200) {
  throw new Error(`Expected 200 wood species, got ${species.length}.`);
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

function header(active = "Tools") {
  const links = [
    ["CutList", "/cutlist/"],
    ["QuiltFit", "/quiltfit/"],
    ["Tile", "/tile-calculator/"],
    ["Stringer", "/stringer/"],
    ["Blogs", "/blog/"],
    ["Apps", "/apps/"],
    ["Tools", "/tools/"],
    ["Learn", "/learn/"]
  ];
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links">${links.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="${href}">${label}</a>`).join("")}</div><label class="language-picker"><span class="visually-hidden">Language</span><select id="language-select" aria-label="Language"><option value="en">English</option><option value="zh-CN">简体中文</option><option value="zh-TW">繁體中文</option><option value="es">Español</option><option value="pt">Português</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="nl">Nederlands</option><option value="it">Italiano</option><option value="ar">العربية</option><option value="ja">日本語</option></select></label><a class="button small nav-download-cta" href="https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871" rel="nofollow noopener">Download CutList</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/wood/">Wood species</a><a href="/wood-weight-calculator/">Wood weight</a><a href="/board-foot-calculator/">Board foot</a><a href="/material-cost-calculator/">Material cost</a><a href="/tools/">Tools</a><a href="/blog/">Blogs</a></nav></div><div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Wood species values are planning ranges only. Always verify actual stock, supplier data, moisture content, prices, local codes, and safety requirements before buying or cutting.</p></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

function itemListJsonLd() {
  return `<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/wood/#collection`,
  name: "Wood Species Library",
  url: `${siteUrl}/wood/`,
  description: "A searchable wood species library with density, weight, Janka hardness, price tier, applications, pros, cons, and project planning notes.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: species.length,
    itemListElement: species.map((wood) => ({
      "@type": "ListItem",
      position: wood.position,
      name: wood.name,
      url: `${siteUrl}/wood/${wood.slug}/`
    }))
  }
}, null, 2)}
</script>`;
}

function indexPage() {
  const title = "Wood Species Library: 200 Woods by Density & Janka";
  const description = "Search 200 wood species by density, Janka hardness, weight, price tier, applications, pros, cons, and woodworking project fit.";
  const canonical = `${siteUrl}/wood/`;
  const groups = [...new Set(species.map((wood) => wood.group))].sort();
  const prices = [...new Set(species.map((wood) => wood.price))].sort();
  const rows = species.map((wood) => `<tr class="wood-row" data-name="${escapeHtml(wood.name.toLowerCase())}" data-group="${escapeHtml(wood.group)}" data-price="${escapeHtml(wood.price)}">
              <td><a href="/wood/${wood.slug}/">${escapeHtml(wood.name)}</a></td>
              <td>${escapeHtml(wood.group)}</td>
              <td>${wood.density[0]}-${wood.density[1]} lb/ft³</td>
              <td>${wood.densityMetric} kg/m³</td>
              <td>${wood.janka.toLocaleString()} lbf</td>
              <td>${escapeHtml(wood.price)}</td>
              <td>${escapeHtml(wood.applications.slice(0, 3).join(", "))}</td>
            </tr>`).join("\n");
  const featured = species.slice(0, 10).map((wood) => `<a href="/wood/${wood.slug}/">${escapeHtml(wood.name)}</a>`).join("");

  return `<!doctype html>
<html lang="en">
${head({ title, description, canonical, jsonLd: itemListJsonLd() })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Tools", "/tools/"], ["Wood Species Library", "/wood/"]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Tools")}
  <main id="main">
    <section class="page-hero wood-library-hero">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / Wood Species Library</p>
      <p class="eyebrow">Wood Species Library</p>
      <h1>Wood Species Library</h1>
      <p class="lead">Search 200 woods by density, weight, Janka hardness, price tier, applications, pros, cons, and project fit before choosing stock for a cut list or material estimate.</p>
      <div class="hero-actions"><a class="button" href="/wood/oak/">Start with oak</a><a class="button secondary" href="/wood-weight-calculator/">Use weight calculator</a></div>
      <div class="wood-stats" aria-label="Wood library stats">
        <div><strong>200</strong><span>wood species</span></div>
        <div><strong>Density</strong><span>lb/ft³ and kg/m³</span></div>
        <div><strong>Janka</strong><span>hardness planning value</span></div>
      </div>
    </section>

    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">Common woods</p><h2>Start with familiar species.</h2><p>These pages are the fastest entry points for common search terms. Each page links back to calculators, CutList, and related woodworking guides.</p></div>
      <div class="wood-featured-links">${featured}</div>
    </section>

    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">Search the library</p><h2>Compare 200 wood species.</h2><p>Use the filters for quick planning. Values are typical ranges, not supplier guarantees.</p></div>
      <div class="wood-filter-bar" role="search">
        <label>Search wood
          <input id="wood-search" type="search" placeholder="Oak, walnut, teak, maple..." autocomplete="off">
        </label>
        <label>Wood group
          <select id="wood-group">
            <option value="">All groups</option>
            ${groups.map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`).join("")}
          </select>
        </label>
        <label>Price tier
          <select id="wood-price">
            <option value="">All prices</option>
            ${prices.map((price) => `<option value="${escapeHtml(price)}">${escapeHtml(price)}</option>`).join("")}
          </select>
        </label>
      </div>
      <p class="wood-count" id="wood-count">${species.length} species shown</p>
      <div class="table-scroll">
        <table class="wood-species-table">
          <thead><tr><th>Wood</th><th>Group</th><th>Density</th><th>Metric density</th><th>Janka</th><th>Price</th><th>Common applications</th></tr></thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="related-tools-guides">
      <p class="eyebrow">Related tools</p>
      <h2>Turn species choice into a build plan.</h2>
      <div class="related-grid">
        <a href="/wood-weight-calculator/"><span>Calculator</span><strong>Wood weight calculator</strong><em>Use density to estimate board or panel weight.</em></a>
        <a href="/board-foot-calculator/"><span>Calculator</span><strong>Board foot calculator</strong><em>Estimate hardwood volume and buying cost.</em></a>
        <a href="/material-cost-calculator/"><span>Calculator</span><strong>Material cost calculator</strong><em>Turn species choice into a project budget.</em></a>
        <a href="/apps/cutlist/"><span>App</span><strong>CutList Optimizer</strong><em>Save cut lists, kerf settings, and PDF exports.</em></a>
        <a href="/blog/common-wood-species-and-uses/"><span>Blog</span><strong>Common wood species and uses</strong><em>Read the broader species selection guide.</em></a>
      </div>
    </section>
  </main>
  ${footer()}
  <script>
    (() => {
      const search = document.getElementById("wood-search");
      const group = document.getElementById("wood-group");
      const price = document.getElementById("wood-price");
      const rows = [...document.querySelectorAll(".wood-row")];
      const count = document.getElementById("wood-count");
      const apply = () => {
        const q = search.value.trim().toLowerCase();
        let visible = 0;
        for (const row of rows) {
          const ok = (!q || row.dataset.name.includes(q)) &&
            (!group.value || row.dataset.group === group.value) &&
            (!price.value || row.dataset.price === price.value);
          row.hidden = !ok;
          if (ok) visible += 1;
        }
        count.textContent = visible + " species shown";
      };
      search.addEventListener("input", apply);
      group.addEventListener("change", apply);
      price.addEventListener("change", apply);
    })();
  </script>
</body>
</html>`;
}

function speciesJsonLd(wood) {
  const page = `${siteUrl}/wood/${wood.slug}/`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${page}#article`,
        headline: `${wood.name} wood properties`,
        name: `${wood.name} Wood`,
        url: page,
        description: `${wood.name} wood planning notes with density, weight, Janka hardness, price tier, applications, pros, cons, and FAQ.`,
        inLanguage: "en",
        about: [
          { "@type": "Thing", name: wood.name },
          { "@type": "Thing", name: "wood species" },
          { "@type": "Thing", name: "Janka hardness" }
        ],
        publisher: {
          "@type": "Organization",
          name: "WoodCutTool",
          url: siteUrl
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `Is ${wood.name} a good woodworking wood?`,
            acceptedAnswer: { "@type": "Answer", text: `${wood.name} can be a good woodworking choice for ${wood.applications.slice(0, 3).join(", ")} when the board quality, moisture, budget, and finish plan match the project.` }
          },
          {
            "@type": "Question",
            name: `How heavy is ${wood.name}?`,
            acceptedAnswer: { "@type": "Answer", text: `${wood.name} is typically around ${wood.density[0]}-${wood.density[1]} lb/ft3, or about ${wood.densityMetric} kg/m3, but actual weight changes with moisture and the specific board.` }
          }
        ]
      }
    ]
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function speciesPage(wood) {
  const title = `${wood.name} Wood: Density, Janka, Uses & Price`;
  const description = `${wood.name} wood guide with density, weight, Janka hardness, price tier, applications, pros, cons, finishing notes, and FAQ for woodworking plans.`;
  const canonical = `${siteUrl}/wood/${wood.slug}/`;
  const related = species
    .filter((item) => item.slug !== wood.slug && item.group === wood.group)
    .slice(0, 4);
  return `<!doctype html>
<html lang="en">
${head({ title, description, canonical, jsonLd: speciesJsonLd(wood), ogType: "article" })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Tools", "/tools/"], ["Wood Species Library", "/wood/"], [wood.name, `/wood/${wood.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Tools")}
  <main id="main">
    <section class="page-hero wood-species-hero">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/wood/">Wood Species Library</a> / ${escapeHtml(wood.name)}</p>
      <p class="eyebrow">${escapeHtml(wood.group)} reference</p>
      <h1>${escapeHtml(wood.name)} Wood</h1>
      <p class="lead">Use this ${escapeHtml(wood.name)} wood profile to compare density, weight, Janka hardness, price tier, applications, pros, cons, outdoor fit, and finish behavior before building a cut list.</p>
      <div class="hero-actions"><a class="button" href="/wood-weight-calculator/">Calculate ${escapeHtml(wood.name)} weight</a><a class="button secondary" href="/wood/">Back to wood library</a></div>
    </section>

    <section class="section wood-facts-section">
      <div class="wood-facts-grid" aria-label="${escapeHtml(wood.name)} wood facts">
        <div><span>Density</span><strong>${wood.density[0]}-${wood.density[1]} lb/ft³</strong><em>About ${wood.densityMetric} kg/m³</em></div>
        <div><span>Weight</span><strong>${escapeHtml(wood.weight)}</strong><em>Plan lifting, shipping, and joinery</em></div>
        <div><span>Hardness</span><strong>${wood.janka.toLocaleString()} Janka</strong><em>${escapeHtml(wood.hardness)} surface feel</em></div>
        <div><span>Price</span><strong>${escapeHtml(wood.price)}</strong><em>Local supply changes quickly</em></div>
      </div>
    </section>

    <section class="section wood-detail-layout">
      <article class="wood-detail-main">
        <h2>${escapeHtml(wood.name)} properties and best uses</h2>
        <p>${escapeHtml(wood.name)} is a ${escapeHtml(wood.group.toLowerCase())} that is commonly evaluated for ${escapeHtml(wood.applications.slice(0, 4).join(", "))}. For early project planning, use the density and Janka values as rough comparison points, then confirm the actual board grade, moisture content, and supplier data before buying.</p>
        <h3>Applications</h3>
        <ul class="wood-pill-list">${wood.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Pros</h3>
        <ul>${wood.pros.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Cons</h3>
        <ul>${wood.cons.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h3>Outdoor and finishing notes</h3>
        <p><strong>Outdoor fit:</strong> ${escapeHtml(wood.outdoor)}</p>
        <p><strong>Finish behavior:</strong> ${escapeHtml(wood.finish)}</p>
      </article>
      <aside class="wood-detail-side">
        <h2>Planning data</h2>
        <dl>
          <div><dt>Wood group</dt><dd>${escapeHtml(wood.group)}</dd></div>
          <div><dt>Density</dt><dd>${wood.density[0]}-${wood.density[1]} lb/ft³</dd></div>
          <div><dt>Metric density</dt><dd>${wood.densityMetric} kg/m³</dd></div>
          <div><dt>Janka hardness</dt><dd>${wood.janka.toLocaleString()} lbf</dd></div>
          <div><dt>Cost tier</dt><dd>${escapeHtml(wood.price)}</dd></div>
          <div><dt>Weight class</dt><dd>${escapeHtml(wood.weight)}</dd></div>
        </dl>
      </aside>
    </section>

    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">FAQ</p><h2>${escapeHtml(wood.name)} wood questions.</h2></div>
      <div class="faq-list">
        <details open><summary>Is ${escapeHtml(wood.name)} good for woodworking?</summary><p>Yes, ${escapeHtml(wood.name)} can work well for ${escapeHtml(wood.applications.slice(0, 3).join(", "))} when its weight, hardness, price, and finishing behavior fit the project.</p></details>
        <details><summary>How hard is ${escapeHtml(wood.name)}?</summary><p>The planning value used here is about ${wood.janka.toLocaleString()} Janka lbf, which puts it in the ${escapeHtml(wood.hardness.toLowerCase())} range for surface dent resistance.</p></details>
        <details><summary>What should I verify before buying ${escapeHtml(wood.name)}?</summary><p>Verify moisture content, board flatness, grade, defects, actual dimensions, supplier price, sustainability notes, and whether the stock is suitable for indoor or outdoor use.</p></details>
      </div>
    </section>

    <section class="related-tools-guides">
      <p class="eyebrow">Related planning links</p>
      <h2>Use ${escapeHtml(wood.name)} in a calculator or cut list.</h2>
      <div class="related-grid">
        <a href="/wood-weight-calculator/"><span>Calculator</span><strong>Wood weight calculator</strong><em>Use ${wood.density[0]}-${wood.density[1]} lb/ft³ as a starting density.</em></a>
        <a href="/board-foot-calculator/"><span>Calculator</span><strong>Board foot calculator</strong><em>Estimate rough hardwood volume and cost.</em></a>
        <a href="/material-cost-calculator/"><span>Calculator</span><strong>Material cost calculator</strong><em>Build a project budget around your selected species.</em></a>
        <a href="/apps/cutlist/"><span>App</span><strong>CutList Optimizer</strong><em>Save parts, kerf, layouts, and PDF exports.</em></a>
        <a href="/blog/common-wood-species-and-uses/"><span>Blog</span><strong>Common wood species and uses</strong><em>Compare familiar woods before choosing stock.</em></a>
      </div>
    </section>

    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">Similar woods</p><h2>Compare nearby ${escapeHtml(wood.group.toLowerCase())} options.</h2></div>
      <div class="wood-related-species">${related.map((item) => `<a href="/wood/${item.slug}/"><span>${escapeHtml(item.group)}</span><strong>${escapeHtml(item.name)}</strong><em>${item.density[0]}-${item.density[1]} lb/ft³ · ${item.janka.toLocaleString()} Janka</em></a>`).join("")}</div>
    </section>

    <section class="section cost-disclaimer" aria-labelledby="wood-disclaimer-title">
      <p class="eyebrow">Planning note</p>
      <h2 id="wood-disclaimer-title">Verify actual stock before building.</h2>
      <p>Wood values vary by species, board, moisture, grade, drying method, supplier, and local market. These pages are for estimating and comparison only, not structural, safety, engineering, or purchasing guarantees.</p>
    </section>
  </main>
  ${footer()}
</body>
</html>`;
}

const woodRoot = join(root, "wood");
rmSync(woodRoot, { recursive: true, force: true });
mkdirSync(woodRoot, { recursive: true });
writeFileSync(join(woodRoot, "index.html"), indexPage());

for (const wood of species) {
  const dir = join(woodRoot, wood.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), speciesPage(wood));
}

console.log(`Generated ${species.length} wood species pages plus /wood/.`);
