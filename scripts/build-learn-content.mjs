import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags, breadcrumbJsonLd } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260623-seo-feed";
const siteUrl = "https://woodcuttool.com";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
  ${jsonLd}
</head>`;
}

function header(active = "Learn") {
  const links = [
    ["Tools", "/tools/"],
    ["Learn", "/learn/"],
    ["CutList", "/apps/cutlist/"],
    ["Plywood", "/plywood-cut-calculator/"],
    ["Tile", "/tile-calculator/"],
    ["Apps", "/apps/"]
  ];
  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links">${links.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="${href}">${label}</a>`).join("")}</div><a class="button small" href="/apps/cutlist/">Open CutList</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/tools/">Tools</a><a href="/learn/">Learn</a><a href="/apps/cutlist/">CutList</a><a href="/plywood-cut-calculator/">Plywood calculator</a><a href="/wood-waste-calculator/">Waste calculator</a></nav></div><div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Results are estimates &mdash; always verify measurements, material quantities, and costs yourself before buying or cutting.</p><p>Our content is not professional, structural, engineering, or safety advice. For stairs, structural work, electrical, plumbing, or anything affecting safety, consult a qualified professional and follow your local building codes and permit requirements. You are responsible for your own measurements, tools, and safety. WoodCutTool is not liable for any loss, injury, or damage arising from use of this site.</p><p>App names, logos, and trademarks (including Apple and App Store) belong to their respective owners and do not imply endorsement. External links and cited sources are provided for reference only.</p></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

const articles = [
  {
    slug: "what-is-cut-list-optimization",
    seoTitle: "What Is Cut List Optimization? Simple Guide",
    h1: "What Is Cut List Optimization?",
    description: "What is cut list optimization? Learn how it reduces waste, what inputs it needs, and when to use a cut list optimizer, plywood calculator, or app.",
    keywords: ["cut list optimization", "cut list optimizer", "woodworking calculator", "plywood layout planning", "reduce wood waste"],
    intro: "Cut list optimization is the process of arranging project parts on boards or plywood sheets so you can cut them with less waste, fewer mistakes, and a clearer material plan. It starts with a parts list, but it does not stop at dimensions. A useful optimized cut list also considers sheet size, board length, blade kerf, rotation, grain direction, repeated parts, and whether leftover pieces will be usable later.",
    sections: [
      ["Why cut list optimization matters", "Many woodworking mistakes happen before the saw starts. A cabinet side can be copied with the wrong quantity. A shelf may fit by area but not by shape. A plywood sheet may look large enough until kerf and grain direction are included. Cut list optimization helps turn a rough list of parts into a visual plan that can be checked before money, time, and material are committed. For a hobby builder, that can mean avoiding an extra store trip. For a cabinet shop, it can mean better estimates, fewer surprises, and cleaner communication at the saw."],
      ["What information goes into an optimized cut list", "A good cut list optimizer needs real inputs. Start with the finished part names, dimensions, and quantities. Add material type, stock size, thickness, kerf, and rotation rules. If plywood grain direction matters, mark visible parts so they do not rotate just to improve waste percentage. If edge banding or trimming is required, include those allowances before generating the layout. The better the input, the more useful the output."],
      ["How optimization differs from a simple calculator", "A simple woodworking calculator may total area or length. That is helpful, but it does not prove that pieces fit together on the material. Optimization is spatial. It shows how rectangles fit on sheets or boards, where cut lines fall, and what scrap remains. This is why area-only planning can fail: a project can have enough total square inches and still require another sheet because the remaining space is the wrong shape."],
      ["Where CutList fits", "Use the <a href=\"/apps/cutlist/\">CutList cut list optimizer app</a> when a project needs saved layouts, offline planning, PDF export, or repeated edits. Use the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> for quick browser estimates. Use the <a href=\"/cut-list-calculator/\">cut list calculator</a> for board stock. The best workflow is not choosing one tool forever; it is choosing the right level of planning for the project."],
      ["Common mistakes to avoid", "The most common mistake is treating the optimizer as a magic button. A tool can arrange parts, but it cannot know that a cabinet end is visible, that one shelf needs edge banding, or that a part was copied with the wrong quantity. Another mistake is chasing the lowest waste number without checking cut order or offcut quality. A slightly higher waste percentage can still be better if it creates safer cuts, clearer grouping, and reusable leftovers."],
      ["How to review the result", "After generating a layout, review it like a shop document. Check that every part appears with the right quantity. Look for narrow strips that may be hard to cut accurately. Confirm visible panels face the correct direction. Make sure the remaining pieces are large enough to label and reuse. If the plan will be shared with another person, export or print a version that names parts clearly instead of relying on memory."],
      ["Conversion path for real projects", "If you are planning one quick shelf, a browser calculator may be enough. If you are building cabinets, closet organizers, drawer boxes, van storage, or a shop fixture, use an app that saves the project. Start from the <a href=\"/tools/\">WoodCutTool tools hub</a>, test the rough idea online, then move serious layouts into CutList before cutting."],
      ["Final checklist", "Before cutting, confirm five things: the stock size is real, the kerf matches your blade, the part list is complete, rotation rules match the material, and the result has been reviewed visually. That checklist is simple, but it catches most avoidable planning errors. Cut list optimization works best when it becomes a verification step between design and cutting, not an afterthought once material is already on the saw."]
    ],
    cta: "Plan a real layout with CutList, or start with the free plywood and cut list calculators from the tools hub."
  },
  {
    slug: "how-to-read-a-cut-list",
    seoTitle: "How to Read a Cut List (Beginner's Guide)",
    h1: "How to Read a Cut List",
    description: "Learn how to read a cut list and cutting diagram: what each column means and how to take part names, sizes, kerf, and grain to the saw without mistakes.",
    keywords: ["how to read a cut list", "cut list calculator", "cutting diagram", "woodworking cut list", "cut list optimizer"],
    intro: "A cut list is a table that tells you exactly which parts to cut, at what size, from which stock, and in what quantity. Reading it correctly is the difference between a smooth build and a pile of wrong-sized pieces. The columns usually cover a part name, finished width and length, thickness, quantity, material, and sometimes grain direction or a sheet number. A cutting diagram adds the spatial half: it shows where each part sits on the board or sheet so you can see the cut order, not just the sizes. This guide explains what each part of a cut list means and how to take it to the saw without second-guessing every measurement.",
    sections: [
      ["Read the part name first, not the dimensions", "The part name is the most important column and the one beginners skip. Names like left side, fixed shelf, drawer bottom, or door rail tell you where the piece goes and which face is visible. Two parts can share the same width and length but have different grain or finish requirements. If you cut purely by dimension, identical-looking parts get mixed up during assembly. Read the name, find the part on the cutting diagram, then check the size."],
      ["Understand width, length, and which is which", "Most cut lists list width first, then length, but conventions vary, so confirm before cutting. For sheet goods, width and length also imply grain direction: the grain usually runs along the longer dimension unless the part is marked otherwise. A 12 by 30 shelf cut the wrong way around still measures correctly but may show the grain running the wrong direction on a visible panel. When in doubt, match the part to its position on the layout diagram instead of trusting the numbers alone."],
      ["Check quantity and group identical parts", "The quantity column saves time and prevents the most common error: cutting too few or too many of a repeated part. Group identical parts and cut them in one setup so they come out exactly the same size. A fence stop or a stop block makes repeated parts consistent. If the cut list came from the <a href=\"/cut-list-calculator/\">cut list calculator</a> or a layout in <a href=\"/apps/cutlist/\">CutList</a>, the quantities are already grouped for you, which is faster than counting parts by hand from a sketch."],
      ["Account for kerf before you trust the sizes", "A cut list shows finished part sizes, but the saw blade removes material on every cut. If the list or diagram was built without kerf, the last part in a row may not fit even though the math looked correct on paper. A good cutting diagram already includes kerf between parts. If you built the list yourself, confirm the kerf value matches your actual blade before cutting, or run the parts through the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> so the spacing reflects real cutting loss."],
      ["Follow the cut order on the diagram", "A cutting diagram is not just a picture of finished parts. It implies a cut sequence: usually the longest, most stable cuts first, then breaking large pieces into smaller ones. Cutting in the wrong order can leave you handling an awkward, oversized piece on a small saw, which is both inaccurate and unsafe. Read the diagram from the largest cuts inward, and mark each part as you cut it so you never lose track of which pieces are done."],
      ["Mark visible faces and grain direction", "A cut list often notes which face is visible or which way the grain should run, but it cannot enforce it. Before cutting, mark the good face of each panel with a pencil or tape. This matters most on cabinet sides, doors, and drawer fronts where mismatched grain is obvious in the finished piece. Reading the grain note and acting on it at the saw is what separates a clean build from one that technically fits but looks wrong."],
      ["Turn the cut list into a shop document", "A cut list is most useful when it travels with the project. A number scribbled on scrap is easy to lose; a printed or exported list with part names, quantities, and a layout diagram is something you can check off as you work. Start from the <a href=\"/tools/\">WoodCutTool tools hub</a> to generate the list, then keep it visible at the saw. If the project will change or move between locations, save it in CutList so the layout, sizes, and quantities stay together and can be reopened or exported as a PDF."]
    ],
    cta: "Generate a clear cut list with the cut list calculator, or save the full diagram in CutList to use at the saw."
  },
  {
    slug: "how-to-reduce-plywood-waste",
    seoTitle: "How to Reduce Plywood Waste Before Cutting",
    h1: "How to Reduce Plywood Waste",
    description: "A practical guide to reducing plywood waste: better measurement, kerf planning, sheet layouts, smart offcut choices, and cut list optimizer tools.",
    keywords: ["reduce plywood waste", "plywood waste calculator", "plywood cut calculator", "material saving", "cut list optimizer"],
    intro: "To reduce plywood waste, plan the sheet layout before cutting, account for kerf, group repeated parts, protect grain direction, and keep only offcuts that are large enough to reuse. Waste is not just the pile of scraps at the end. It is usually created earlier through unclear dimensions, missing quantities, poor sheet orientation, and buying material before testing the layout.",
    sections: [
      ["Start with a complete parts list", "Write every part before opening the calculator: sides, shelves, backs, stretchers, drawer parts, dividers, doors, toe kicks, and test pieces. Many plywood waste problems begin when a builder adds a forgotten part after the layout already looked efficient. A complete list also makes repeated parts easier to group, which often improves cutting clarity."],
      ["Use real sheet dimensions and kerf", "A 4 by 8 sheet is sold as 48 by 96 inches, but damaged edges, trimming, and factory variation can reduce usable area. Measure the real sheet if the job is tight. Then enter the saw blade kerf you actually plan to use. Ten cuts with a 1/8 inch kerf consume 1.25 inches of material before any mistakes. Ignoring kerf can make a digital layout look possible when the physical cut will not fit."],
      ["Respect grain direction when it matters", "Reducing waste is not always the same as making the best project. Cabinet sides, doors, drawer fronts, and visible panels may need consistent grain direction. If a layout saves material by rotating a visible face the wrong way, it is not a good layout. The goal is usable material saving, not a misleading low waste percentage."],
      ["Plan offcuts on purpose", "Not all leftover plywood is useful. A large rectangular offcut with a label can become a shelf, jig, or future drawer part. A pile of narrow strips often becomes clutter. Use the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> to estimate waste cost, but also review offcut shape. A smaller waste number is less important than keeping offcuts you can actually reuse."],
      ["Change dimensions before buying", "The cheapest time to reduce waste is before material is purchased. Try small changes to shelf depth, cabinet width, divider spacing, or repeated panel sizes. A one-inch change can sometimes turn an awkward layout into a clean one-sheet plan. This does not mean every design should be shaped by the calculator. It means the calculator can show where a design choice has a material cost."],
      ["Watch the difference between waste and scrap", "Waste percentage is a number. Scrap is physical material in your shop. Two layouts can show similar waste but create very different leftovers. One may leave a clean rectangle that becomes a future shelf. Another may leave strips that are too narrow to matter. When reviewing a plywood layout, look beyond the percentage and ask whether the remaining pieces have a realistic future use."],
      ["Use tools before buying material", "Test the layout with the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a>. If the project will change, save it in the <a href=\"/apps/cutlist/\">CutList app</a>. For rough cost and volume planning, check the <a href=\"/board-foot-calculator/\">board foot calculator</a> and the broader <a href=\"/tools/\">tools hub</a>. This sequence catches material problems while changes are still cheap."],
      ["Shop-floor checklist", "Before cutting plywood, verify sheet size, blade kerf, part quantity, rotation settings, and grain direction. Mark finished faces and label repeated parts. If you plan to keep offcuts, write the size and material on the piece immediately. This simple habit prevents a common problem: a potentially useful leftover becomes anonymous scrap because nobody remembers its thickness, grade, or original purpose."]
    ],
    cta: "Open CutList when the layout needs to be saved, exported, printed, or carried to the shop."
  },
  {
    slug: "saw-kerf-explained",
    seoTitle: "Saw Kerf Explained: Why Cuts Come Out Short",
    h1: "Saw Kerf Explained",
    description: "Saw kerf explained: why parts come out short, how to measure your blade kerf, and how to plan for it so your cut lists and plywood layouts actually fit.",
    keywords: ["saw kerf", "blade kerf", "kerf allowance", "plywood cut calculator", "cut list calculator"],
    intro: "Saw kerf is the width of material a blade removes with every cut. It sounds minor, but it is the reason a row of parts that adds up perfectly on paper can still come out short on real stock. A typical table saw blade has a kerf around 1/8 inch, or about 3 millimeters, so every cut quietly eats a little extra material. If you make ten cuts across a sheet without planning for kerf, you lose more than an inch of usable length. This guide explains what kerf is, why it makes cuts come up short, how to measure your own blade, and how to plan for it so your cut lists and layouts actually fit.",
    sections: [
      ["What kerf actually is", "Kerf is the slot the blade cuts, and it is wider than the steel of the blade because the teeth are set or carbide-tipped to be wider than the plate. That extra width is what clears the cut so the blade does not bind. The practical result is that the material turned into sawdust is gone from your part. When you cut a board in half, you do not get two pieces that add up to the original length; you get two pieces minus one kerf. Multiply that across a full project and the loss adds up fast."],
      ["Why your parts come out short", "The classic mistake is measuring from the same reference edge for several parts without accounting for the blade taking material each time. Or you mark two parts end to end on one board, cut the line, and find the second part is short by a blade width because the pencil line itself had thickness and the kerf landed on the wrong side of it. Kerf always removes material, so if you do not add it between parts, the last piece in a sequence is the one that comes up short. Knowing this turns a frustrating mystery into a predictable, planned-for number."],
      ["How to measure your blade kerf", "Do not guess from the box. Make a single cut in scrap, then measure the width of the slot with calipers, or measure a part before and after a cut and take the difference. Different blades vary: a thin-kerf blade may be around 3/32 inch, a standard blade around 1/8 inch, and a dado or wide blade much more. Jigsaws, track saws, and band saws all have their own kerf. Once you know your real number, you can enter it into a calculator instead of relying on an assumption that may be off by enough to ruin a fit."],
      ["Add kerf in your cut list, not at the saw", "The cheapest place to handle kerf is in planning, before any material is cut. When you build a cut list, the spacing between parts should already include the blade width. The <a href=\"/cut-list-calculator/\">cut list calculator</a> and the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> both take a kerf value and position parts so the cuts reflect real material loss. That way the layout you see on screen is the layout you can actually cut, instead of one that looks possible but fails on the last piece of a row."],
      ["Kerf and plywood sheet layouts", "Kerf matters most on full sheets because there are so many cuts. A 4 by 8 sheet broken into many cabinet parts can lose a surprising amount of usable area purely to blade width. If a layout ignores kerf, it may show parts fitting edge to edge that physically cannot, because the saw needs room between them. When you plan sheet goods, enter the real sheet size and the real kerf together. If the project is large or will change, save the layout in <a href=\"/apps/cutlist/\">CutList</a> so the kerf-aware plan stays with the job."],
      ["When kerf changes your material total", "Kerf does not just shift dimensions; it can change how much stock you need to buy. A layout that fit on three sheets without kerf might need a fourth once blade width is added, because the parts no longer pack as tightly. This is why an area-only estimate can underbuy material. After laying out parts with kerf included, check the result against the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> to see whether the extra cuts pushed you into another sheet or board, then decide whether a small dimension change avoids it."],
      ["A simple kerf workflow", "Measure your blade kerf once and write it down. Enter that exact value into whichever calculator matches your material. Review the layout to confirm parts still fit with the blade width included, and watch for any row where the last part now comes up short. Start from the <a href=\"/tools/\">tools hub</a> to pick the right calculator, then cut from a kerf-aware plan. Handled this way, kerf stops being the reason a project comes up short and becomes just another number you control before the saw ever runs."]
    ],
    cta: "Enter your real blade kerf in the plywood or cut list calculator, then save the kerf-aware layout in CutList."
  },
  {
    slug: "best-woodworking-calculator-workflow",
    seoTitle: "The Best Woodworking Calculator Workflow",
    h1: "Best Woodworking Calculator Workflow",
    description: "Build the best woodworking calculator workflow: scope, cut lists, plywood layouts, waste estimates, and when to move a project into the CutList app.",
    keywords: ["woodworking calculator workflow", "woodworking calculator", "cut list calculator", "plywood cut calculator", "material calculator"],
    intro: "The best woodworking calculator workflow moves from project scope to rough material estimate, then to cut list optimization, waste review, and saved project planning. The order matters. If you start with a layout before the parts list is complete, the result may be fast but wrong. If you only calculate material area, you may miss the shape problem that decides how many boards or sheets are actually required.",
    sections: [
      ["Step 1: define the project before calculating", "Start with the object, not the calculator. A cabinet, shelf, bench, closet system, drawer stack, or shop fixture has functional constraints that drive the parts list. Decide finished size, visible faces, material thickness, joinery approach, and whether dimensions are final or oversized for trimming. These choices affect every later calculation."],
      ["Step 2: choose the right calculator", "Use the <a href=\"/cut-list-calculator/\">cut list calculator</a> for boards and linear stock. Use the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> for sheet goods. Use the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> when you need waste percentage or waste cost. Use the <a href=\"/board-foot-calculator/\">board foot calculator</a> when buying lumber by volume. Use <a href=\"/apps/cutlist/\">CutList</a> when the project needs saved layouts, PDF export, offline access, or repeated edits."],
      ["Step 3: run a rough estimate", "The first pass should answer whether the project is in the right material range. It does not need to be perfect. Estimate sheet count, board count, waste, and rough cost. This helps you compare design choices. A small change in shelf depth or cabinet width can sometimes save a full sheet. The calculator should support decisions, not just produce a number."],
      ["Step 4: optimize and review visually", "After the rough estimate, use a visual layout. Look for awkward strips, repeated parts, rotated grain, missing quantities, and cuts that would be hard to make safely. Visual review is where a cut list optimizer becomes more useful than a spreadsheet. A spreadsheet can calculate totals, but it cannot show whether the remaining space is practical."],
      ["Step 5: review cost and waste together", "A layout is not finished just because it fits. Check how much material is used, how much is wasted, and whether the waste is expensive enough to justify another design pass. If the project uses premium plywood, hardwood, or prefinished sheet goods, small improvements matter more. A cheap shop fixture may not need the same level of optimization as a visible cabinet or client build."],
      ["Step 6: save the plan before cutting", "When the plan matters, save it. A browser calculation can disappear or drift from the final design. A saved CutList project keeps the layout with the job. Start from the <a href=\"/tools/\">WoodCutTool tools hub</a>, estimate online, then use CutList for the final workshop plan."],
      ["Step 7: use the result at the saw", "The best calculator workflow ends in a usable shop document. Keep part labels visible. Cut large stable pieces first when possible. Avoid depending on memory for repeated parts that look similar. If the plan is shared with another person, export a PDF or print the layout so measurements, quantities, and sequence are visible. Good calculator output should reduce conversation, not create a new translation step."],
      ["Workflow summary", "Use a fast calculator for exploration, a visual optimizer for layout review, a waste calculator for material decisions, and a saved app project for execution. This layered approach is more reliable than forcing every job through the same tool. It also gives each page in the WoodCutTool cluster a clear purpose, which helps users and search engines understand the workflow."]
    ],
    cta: "Use the tools hub to choose the right calculator, then move finished layouts into CutList."
  },
  {
    slug: "diy-workshop-planning-guide",
    seoTitle: "DIY Workshop Planning Guide",
    h1: "DIY Workshop Planning Guide",
    description: "A DIY workshop planning guide: organize tools, material flow, cut lists, plywood layouts, waste, and offcut storage so every project moves faster.",
    keywords: ["DIY workshop planning", "DIY construction tools", "woodworking calculator", "cut list optimizer", "workshop material planning"],
    intro: "A useful DIY workshop plan is less about owning every tool and more about controlling the workflow from idea to material, layout, cut, assembly, and cleanup. The best workshop setup helps you measure clearly, store stock safely, plan cuts before cutting, and keep project notes where you can find them again.",
    sections: [
      ["Plan around repeatable workflows", "Most DIY shops repeat the same pattern: sketch the project, measure the space, list parts, buy material, break down stock, make final cuts, assemble, finish, and store leftovers. If any step depends on memory, the shop becomes harder to use. A simple workflow with calculators, labels, saved project plans, and clear offcut storage usually beats a more complicated shop with no system."],
      ["Separate rough planning from final cut planning", "A rough plan estimates whether the project is realistic. A final cut plan decides what happens at the saw. Use calculators early for sheet count, board feet, and waste estimates. Use a cut list optimizer when dimensions are stable. This prevents a common DIY mistake: buying material from a rough estimate and discovering later that the optimized layout needs a different sheet count."],
      ["Use digital tools where they reduce friction", "The <a href=\"/tools/\">WoodCutTool tools hub</a> groups calculators and apps by job. Use the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> for sheet layout, the <a href=\"/cut-list-calculator/\">cut list calculator</a> for board cuts, the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> for scrap cost, and <a href=\"/apps/cutlist/\">CutList</a> for saved iPhone projects. Digital tools are most valuable when they prevent rework, not when they add extra steps."],
      ["Build a material storage habit", "Offcuts only save money when they are visible and labeled. Sort sheet-good leftovers by thickness and usable size. Keep a note of material type, finish side, and project source when it matters. If an offcut is too small or damaged to be useful, discard it instead of letting the shop fill with unusable pieces. A cleaner shop makes better planning easier."],
      ["Design for the space you actually have", "A DIY workshop often has limits: a small garage, a shared driveway, low lighting, limited outfeed support, or tools that must be moved before each session. Planning should reflect those limits. A layout that looks efficient but requires unsafe handling is not a good plan. Break down large sheets into manageable cuts, leave room for measuring, and make sure the final cut sequence matches the way material can move through the shop."],
      ["Keep project information together", "Scattered notes create delays. A dimension in a notebook, a screenshot in the camera roll, and a calculator result in a browser tab can drift apart. Keep the final dimensions, material choices, cut list, and layout in one place. For quick jobs, that may be a printed page. For repeat projects, use a saved CutList project so the plan can be reopened when measurements or quantities change."],
      ["Convert planning into action", "A workshop plan should end with a clear next cut, not just a prettier spreadsheet. Print or export the final plan, verify the first sheet, and mark parts as they are cut. If the project needs to travel to a garage, job site, or shared shop, use CutList so the project remains available offline."],
      ["Workshop planning checklist", "A practical DIY shop checklist includes measuring tools, clear stock dimensions, a cut list, a layout preview, labeled offcut storage, dust control, enough support for large sheets, and a way to save project notes. None of these steps need to be complex. The goal is to make the next action obvious, so the project keeps moving without remeasuring the same part three times."]
    ],
    cta: "Start with the tools hub, then use CutList for any workshop project that needs a saved cutting plan."
  },
  {
    slug: "material-estimation-for-carpentry",
    seoTitle: "Material Estimation for Carpentry (Guide)",
    h1: "Material Estimation for Carpentry",
    description: "Material estimation for carpentry made practical: board feet, plywood sheets, cut lists, waste allowance, and cost — so you don't over- or underbuy.",
    keywords: ["material estimation for carpentry", "material calculator", "woodworking calculator", "board foot calculator", "cut list optimizer"],
    intro: "Material estimation for carpentry means calculating the boards, plywood sheets, fasteners, trim allowances, waste, and cost needed to complete a build without underbuying or overbuying. A good estimate is not just a total. It explains where the material goes, what waste is expected, and which assumptions could change the final purchase.",
    sections: [
      ["Start with finished dimensions", "Finished dimensions tell you what the project must become. From there, convert the design into parts: sides, rails, stiles, shelves, panels, backs, blocking, trim, and test pieces. Mark which dimensions are final and which need extra length or width for trimming. This distinction prevents double allowances and incorrect material totals."],
      ["Estimate boards and sheet goods differently", "Boards are often estimated by length, width, thickness, and board feet. Sheet goods are estimated by sheet layout and part fit. Use the <a href=\"/board-foot-calculator/\">board foot calculator</a> for lumber volume and the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> for panels. Do not rely only on square footage for plywood, because shape, grain, and kerf can decide whether an extra sheet is needed."],
      ["Add realistic waste allowance", "Waste allowance covers saw kerf, trimming, mistakes, defects, and unusable offcuts. A simple project with forgiving dimensions may need a modest allowance. A built-in, cabinet, stair, or visible furniture project may need more. Use the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> after a rough layout to understand the cost of scrap, then revise the design if a small dimension change saves material."],
      ["Use cut lists to validate the estimate", "A carpentry estimate becomes stronger when the parts list can be cut from real stock. Use the <a href=\"/cut-list-calculator/\">cut list calculator</a> for board cuts and the <a href=\"/apps/cutlist/\">CutList optimizer</a> for saved plywood layouts. This turns the estimate from a material guess into a plan that can be checked, revised, exported, and used in the shop."],
      ["Separate estimate risk from design risk", "Some estimate changes come from math: a wrong quantity, a missing board, or a sheet count error. Other changes come from design: a client changes cabinet width, a wall is out of square, or a finish panel becomes visible. Good material estimation makes these risks visible. Keep notes about assumptions so you know which numbers are firm and which should be revisited after field measurements."],
      ["Review cost before final purchase", "A material calculator should support a buying decision, not only a theoretical total. Compare the estimated cost against the value of time, delivery, and possible mistakes. For inexpensive utility plywood, a small amount of extra material may be acceptable. For premium hardwood, prefinished plywood, or specialty panels, better layout planning can quickly pay for itself. The estimate should match the material risk."],
      ["Connect estimation to conversion", "Users searching for material estimation are often close to a project decision. Give them a fast online calculator for confidence, then offer an app for saved work. The <a href=\"/tools/\">tools hub</a> should be the entry point, while CutList becomes the conversion path for serious plywood, cabinet, and shop projects."],
      ["Estimation checklist", "Before buying, confirm finished dimensions, stock dimensions, waste allowance, kerf, material grade, quantity, and project status. If the job is still changing, keep the estimate flexible. If the design is approved, convert the estimate into a cut list and layout. That final step is what turns a cost guess into a practical carpentry plan."]
    ],
    cta: "Estimate material online, then save the final cut plan in CutList before buying or cutting stock."
  },
  {
    slug: "how-many-sheets-of-plywood-do-i-need",
    seoTitle: "How Many Sheets of Plywood Do I Need?",
    h1: "How Many Sheets of Plywood Do I Need?",
    description: "How many sheets of plywood do you need? Estimate by laying out parts instead of dividing square footage — with kerf, grain, and waste factored in first.",
    keywords: ["how many sheets of plywood do i need", "plywood sheet estimate", "plywood cut calculator", "plywood layout planning", "reduce plywood waste"],
    intro: "The honest answer to how many sheets of plywood you need is that you cannot get it reliably by dividing square footage. A 4 by 8 sheet has 32 square feet, so it is tempting to add up your parts, divide, and round up. But plywood is cut as rectangles, not poured as area, so the shapes have to actually fit on the sheets. A project can total 60 square feet and still need three sheets instead of two because the leftover space on each sheet is the wrong shape for the remaining parts. This guide shows a practical way to estimate sheet count that accounts for shape, kerf, and grain, so you buy the right amount the first time.",
    sections: [
      ["Why dividing square footage fails", "Square footage estimates the material area, not the layout. If your parts were liquid, dividing total area by 32 would work. They are not. A wide shelf and a tall cabinet side may each fit on a sheet individually but waste the rest of that sheet because nothing else fits in the leftover strip. This is the single most common reason a plywood estimate comes up one sheet short. Area gives you a floor, the absolute minimum, but never the real answer. The real answer comes from arranging the actual rectangles."],
      ["Start with a complete parts list", "List every panel before counting sheets: sides, top, bottom, shelves, back, dividers, doors, drawer parts, and any test pieces. Record width, length, quantity, and thickness for each. A forgotten back panel or a second shelf is enough to push a two-sheet job to three. The more complete the list, the more accurate the sheet count, because the layout can only be as good as the parts you give it. Skipping this step is why rough mental estimates are so often wrong."],
      ["Lay the parts out on real sheets", "Instead of dividing, arrange the parts on sheet outlines, the same way you would actually cut them. This is exactly what the <a href=\"/plywood-cut-calculator/\">plywood cut calculator</a> does: you enter the sheet size, your parts, quantities, and kerf, and it packs them onto as few sheets as the shapes allow and reports the sheet count. For a project that will change or needs to be saved, do the same in <a href=\"/apps/cutlist/\">CutList</a> so the layout and the sheet count stay with the job."],
      ["Include kerf so the count is honest", "Every cut removes a blade width, so parts cannot sit perfectly edge to edge. A layout that ignores kerf can show parts fitting on fewer sheets than reality allows. When that happens, the shortfall does not appear until you are at the saw and out of material. Enter your real blade kerf, usually around 1/8 inch, before reading the sheet count. A kerf-aware layout occasionally needs one more sheet than the ideal drawing, and it is far better to learn that before the store than after."],
      ["Respect grain direction and finished faces", "Grain direction can change the count. If cabinet sides, doors, or visible panels all need the grain running the same way, those parts cannot be rotated to fill gaps, so the layout packs less tightly and may need more sheets. Mark which parts have a fixed orientation before laying them out. A sheet count that assumes free rotation will be too optimistic for a project with many visible faces, so be honest about which parts can turn and which cannot."],
      ["Add a buffer, then check the waste", "Even a good layout deserves a small buffer for defects, damaged corners, and the occasional mistake. One extra sheet is cheap insurance on a multi-sheet job, especially with premium or prefinished plywood that is hard to source again. After you have a sheet count, run it through the <a href=\"/wood-waste-calculator/\">wood waste calculator</a> to see how much you are scrapping. If the waste is high, a small change to a shelf depth or cabinet width can sometimes drop the count by a full sheet."],
      ["Confirm the count before you buy", "Before you load up at the store, confirm the sheet count came from a real layout, included kerf, respected grain direction, and carries a sensible buffer. Start from the <a href=\"/tools/\">WoodCutTool tools hub</a>, lay out the parts, and read the sheet count from the diagram rather than from a square-footage shortcut. For anything bigger than a single quick project, save the layout in CutList so you can reopen it, adjust quantities, and export the final plan. That is how you answer the sheet question once and buy correctly the first time."]
    ],
    cta: "Lay out your parts in the plywood cut calculator to get a real sheet count, then save it in CutList before buying."
  }
];

const landingPages = [
  {
    slug: "plywood-cutting-optimization",
    seoTitle: "Plywood Cutting Optimization: Cleaner Layouts",
    h1: "Plywood Cutting Optimization",
    description: "Plywood cutting optimization made simple: fewer layout mistakes, better sheet use, kerf allowance, and a clear path from estimate to a saved cut plan.",
    keywords: ["plywood cutting optimization", "plywood cut calculator", "sheet layout optimization", "cut list optimizer", "reduce plywood waste"],
    problem: "Plywood cutting optimization becomes difficult when a project has many panels, repeated parts, visible grain direction, and a limited sheet budget. Many builders start with enough total square footage, then discover that the parts do not actually fit on the sheets once blade kerf, rotation limits, trimming, and offcut shape are included. The result is extra plywood, more scrap, and a cutting session that depends too much on memory.",
    steps: [
      ["List every plywood part", "Write each panel name, width, height, quantity, thickness, and whether the grain direction or finished face matters. Do this before estimating sheet count."],
      ["Enter real sheet size and saw kerf", "Use the exact stock size you plan to buy. Add blade kerf so the layout reflects real cutting loss instead of an ideal drawing."],
      ["Control rotation rules", "Allow rotation for hidden parts when it helps sheet use, but lock visible faces when grain direction needs to stay consistent."],
      ["Review waste shape, not only waste percent", "A layout with reusable rectangular offcuts can be better than a lower waste number that leaves only narrow strips."],
      ["Save the final layout", "When the project has more than a few parts, save the optimized plan so it can be reopened, checked, exported, and used at the saw."]
    ],
    recommendation: "Start with the free plywood calculator for a quick layout check, then use the tools hub to choose the right workflow. For serious plywood projects, the CutList app is the better recommendation because it supports saved layouts, offline planning, project editing, and PDF export.",
    faqs: [
      ["What is plywood cutting optimization?", "Plywood cutting optimization is the process of arranging project panels on plywood sheets while accounting for dimensions, quantities, kerf, rotation rules, grain direction, and usable offcuts."],
      ["Is plywood cutting optimization the same as square footage estimating?", "No. Square footage tells you rough material area. Optimization checks whether the exact shapes fit on real sheets in a practical cutting layout."],
      ["Which tool should I use first?", "Use the plywood cut calculator for a fast browser estimate, then move larger saved projects into CutList."],
      ["How can I reduce plywood waste?", "Enter accurate parts, include kerf, review rotation rules, and compare layouts before buying sheets."]
    ],
    links: [
      ["/tools/", "WoodCutTool tools hub"],
      ["/plywood-cut-calculator/", "Plywood cut calculator"],
      ["/apps/cutlist/", "CutList app"],
      ["/wood-waste-calculator/", "Wood waste calculator"]
    ]
  },
  {
    slug: "woodworking-material-calculator",
    seoTitle: "Woodworking Material Calculator Workflow",
    h1: "Woodworking Material Calculator",
    description: "Use a woodworking material calculator workflow to estimate boards, plywood sheets, board feet, waste, and cost — and plan cuts before buying stock.",
    keywords: ["woodworking material calculator", "material calculator", "woodworking calculator", "board foot calculator", "wood waste calculator"],
    problem: "A woodworking material calculator is useful because material planning often fails in small hidden ways. A board list may ignore defects. A plywood estimate may use square footage instead of layout fit. A cost estimate may miss waste allowance. If those pieces are calculated separately, the project can look cheaper and simpler than it really is.",
    steps: [
      ["Define the project material types", "Separate plywood, hardwood boards, construction lumber, hardware, trim, and finish materials so each group can be estimated correctly."],
      ["Estimate board volume", "Use board feet for lumber when material is priced by volume, and keep thickness, width, length, quantity, and price visible."],
      ["Estimate sheet layout", "Use a plywood layout calculator for panels because sheet goods depend on shape, orientation, kerf, and offcut size."],
      ["Add waste allowance", "Check waste cost after layout planning so the estimate includes scrap, trimming, and practical offcuts."],
      ["Move from estimate to cut plan", "When dimensions are stable, create a cut list so the estimate becomes a shop-ready plan."]
    ],
    recommendation: "Use /tools as the decision hub: board foot calculator for lumber, plywood cut calculator for sheet goods, wood waste calculator for scrap impact, and CutList for saved cut planning.",
    faqs: [
      ["What is a woodworking material calculator?", "It is a planning tool that estimates material quantity, cost, waste, and cut requirements for a woodworking project."],
      ["Can one calculator handle every woodworking material?", "Not perfectly. Boards, plywood, waste, and cost each need slightly different calculations, so a tools hub workflow is more reliable."],
      ["How much extra material should I buy?", "The right allowance depends on defects, joinery, finish quality, and project risk. Use waste estimates and layout review before deciding."],
      ["Does a material calculator replace a cut list?", "No. A material calculator estimates what to buy. A cut list explains how parts should be cut from that material."]
    ],
    links: [
      ["/tools/", "All woodworking tools"],
      ["/board-foot-calculator/", "Board foot calculator"],
      ["/wood-waste-calculator/", "Wood waste calculator"],
      ["/cut-list-calculator/", "Cut list calculator"]
    ]
  },
  {
    slug: "cut-list-planner",
    seoTitle: "Cut List Planner for Cabinets & Shelves",
    h1: "Cut List Planner",
    description: "Build a reliable cut list planner for cabinets, shelves, and plywood projects: clear part names, quantities, kerf, and saved layouts that cut rework.",
    keywords: ["cut list planner", "cut list optimizer", "cut list calculator", "woodworking calculator", "plywood layout planning"],
    problem: "A cut list planner solves a common woodworking problem: dimensions are scattered across sketches, notes, screenshots, and mental reminders. Without a clear planner, repeated parts get missed, part names become unclear, and the saw setup depends on interpretation. That creates rework even when the design itself is simple.",
    steps: [
      ["Name every part clearly", "Use practical names like left side, fixed shelf, back panel, stretcher, drawer bottom, and door rail instead of anonymous numbers."],
      ["Add dimensions and quantity", "Record final part size, material thickness, and count. Include trimming allowance only when it is actually needed."],
      ["Choose board or sheet workflow", "Use a board cut list for linear stock and a plywood layout workflow for sheet goods."],
      ["Account for kerf and direction", "Blade kerf and rotation rules can change whether a plan fits, so they must be part of the planner."],
      ["Export or save before cutting", "A good cut list planner should become a shop document that can be checked at the saw."]
    ],
    recommendation: "For quick planning, use the cut list calculator. For projects that need saved layouts, repeat editing, and a more product-like workflow, use CutList and keep the tools hub as the internal navigation point.",
    faqs: [
      ["What is a cut list planner?", "A cut list planner organizes part names, dimensions, quantities, material, kerf, and layout rules before cutting."],
      ["Is a cut list planner better than a spreadsheet?", "A spreadsheet can track parts, but a planner or optimizer can also show whether the parts fit the stock material."],
      ["When should I use CutList?", "Use CutList when the project has many plywood parts, needs saved layouts, or should be exported as a PDF."],
      ["What should every cut list include?", "Part name, width, length, quantity, material, thickness, kerf assumptions, and notes for rotation or grain direction."]
    ],
    links: [
      ["/tools/", "Tools hub"],
      ["/cut-list-calculator/", "Cut list calculator"],
      ["/apps/cutlist/", "CutList cut list optimizer"],
      ["/learn/what-is-cut-list-optimization/", "What is cut list optimization"]
    ]
  },
  {
    slug: "diy-wood-project-estimation",
    seoTitle: "DIY Wood Project Estimation Made Simple",
    h1: "DIY Wood Project Estimation",
    description: "DIY wood project estimation step by step: material quantities, plywood sheets, board feet, waste allowance, cost, and a practical cut list workflow.",
    keywords: ["DIY wood project estimation", "woodworking material calculator", "material calculator", "DIY construction tools", "cut list planner"],
    problem: "DIY wood project estimation is hard because the first idea is usually not the final build. Dimensions change after measuring the room. Material changes after checking price. Waste changes after seeing the layout. If estimation happens only once, the project can quickly drift away from the original plan.",
    steps: [
      ["Start with finished dimensions", "Measure the space and define the final size of the project before choosing material or buying stock."],
      ["Break the project into parts", "List panels, shelves, sides, rails, supports, trim, and optional test pieces."],
      ["Run a rough material estimate", "Use board foot and plywood calculators to understand the likely material range."],
      ["Check waste and layout", "Use cut planning tools to see whether the parts fit efficiently and whether offcuts are usable."],
      ["Save the final project plan", "Once the design is stable, save the layout or export a cut plan before cutting begins."]
    ],
    recommendation: "The best tool recommendation is a sequence: start at /tools, use calculators for rough estimation, then use CutList when the project needs a saved plan. That keeps the landing page aligned with both search intent and app conversion.",
    faqs: [
      ["How do I estimate a DIY wood project?", "List the parts, choose material, calculate boards or sheet goods, add waste allowance, estimate cost, and review a cut plan before buying."],
      ["What tools help with DIY wood project estimation?", "Use a board foot calculator, plywood cut calculator, wood waste calculator, cut list calculator, and CutList for saved projects."],
      ["Why does my estimate change after layout planning?", "Because total area does not prove that exact part shapes fit real stock with kerf and rotation rules."],
      ["Should I estimate before or after designing?", "Estimate during design, then rerun the estimate after dimensions are final."]
    ],
    links: [
      ["/tools/", "DIY wood project tools"],
      ["/learn/diy-workshop-planning-guide/", "DIY workshop planning guide"],
      ["/plywood-cut-calculator/", "Plywood calculator"],
      ["/board-foot-calculator/", "Board foot calculator"]
    ]
  },
  {
    slug: "sheet-layout-optimization",
    seoTitle: "Sheet Layout Optimization: Plywood & MDF",
    h1: "Sheet Layout Optimization",
    description: "Sheet layout optimization for plywood, MDF, and cabinet panels: kerf planning, smart part grouping, offcut reuse, and saved layouts that waste less.",
    keywords: ["sheet layout optimization", "plywood cutting optimization", "sheet cutting optimizer", "plywood layout planner", "cut list optimizer"],
    problem: "Sheet layout optimization is where many panel projects succeed or fail. Plywood, MDF, melamine, and other sheet goods may look simple because they are rectangular, but the layout still has constraints: saw kerf, safe cut sequence, panel orientation, fragile edges, finished faces, and offcuts that may or may not be worth keeping.",
    steps: [
      ["Group similar panels", "Repeated shelves, sides, and dividers are easier to verify when grouped together before layout planning."],
      ["Mark orientation constraints", "Decide which panels can rotate and which need a consistent direction because of grain, face, or finish."],
      ["Use a sheet layout tool", "Enter sheet size, parts, quantity, and kerf into a calculator or optimizer instead of relying on area math."],
      ["Compare at least two layouts", "A second layout can reveal a cleaner cut order, better offcuts, or a lower sheet count."],
      ["Use the chosen plan in the shop", "Keep the final layout visible while cutting so the digital plan becomes an execution guide."]
    ],
    recommendation: "Use the plywood cut calculator for quick sheet layout optimization, the wood waste calculator to understand scrap cost, and CutList when the project should be saved, exported, or edited later.",
    faqs: [
      ["What is sheet layout optimization?", "It is the process of arranging rectangular parts on sheet goods to reduce waste, respect kerf, and create a practical cutting plan."],
      ["Does sheet layout optimization work for MDF and melamine?", "Yes. The same planning principles apply, although finished faces, chipping risk, and edge quality may affect the cut sequence."],
      ["Why is kerf important in sheet layout?", "Every saw cut removes material. Ignoring kerf can make a layout look possible when the real sheet will not fit."],
      ["What is the best next tool?", "Start with the plywood cut calculator for a fast browser layout, then use CutList for saved iPhone projects."]
    ],
    links: [
      ["/tools/", "Tools hub"],
      ["/plywood-cut-calculator/", "Plywood layout calculator"],
      ["/wood-waste-calculator/", "Waste calculator"],
      ["/apps/cutlist/", "CutList app"]
    ]
  },
  {
    slug: "cut-list-optimizer",
    seoTitle: "Cut List Optimizer: Plan Cuts and Cut Waste",
    h1: "Cut List Optimizer",
    description: "A cut list optimizer turns your parts list into a real cutting layout, accounting for kerf, rotation, and offcuts so you buy less material and cut with less waste.",
    keywords: ["cut list optimizer", "cutlist optimizer", "cut calculator", "woodworking calculator", "reduce wood waste"],
    problem: "A parts list tells you what to cut, but not whether those parts actually fit on the material you plan to buy. A cut list optimizer solves that gap. It takes your part sizes and quantities, then arranges them on real boards or sheets while respecting saw kerf, rotation rules, and grain direction. Without one, woodworkers tend to estimate from total area, then discover at the lumberyard or the saw that the shapes do not pack the way the math suggested.",
    steps: [
      ["Enter every part with its quantity", "Whether you are building a bookcase, a run of cabinets, or shop shelving, list each panel and board with width, length, and how many you need."],
      ["Set the stock size and saw kerf", "Tell the optimizer your real sheet or board size and your blade kerf, so the layout reflects the material removed by every cut."],
      ["Let it arrange the parts", "The optimizer packs parts to reduce waste, rotating hidden pieces while keeping visible grain consistent, and reports how many sheets or boards you need."],
      ["Review the offcuts, not just the percentage", "A good optimized layout leaves rectangular offcuts you can reuse, which is often more valuable than chasing the lowest waste number."],
      ["Cut from the plan", "Follow the cut order, label parts as they come off the saw, and keep the planned offcut for the next project."]
    ],
    recommendation: "For a quick optimization, use the free cut list calculator or plywood cut calculator in the browser. When a project has many parts or you want to save, edit, and export the layout, CutList Optimizer for iPhone keeps the whole plan with the job, offline.",
    faqs: [
      ["What does a cut list optimizer do?", "It arranges your parts on real stock to reduce waste, accounting for kerf, rotation, and grain, then tells you how much material you need."],
      ["How is an optimizer different from a calculator?", "A calculator can total area or board feet; an optimizer proves the exact shapes fit on real sheets or boards in a practical cutting layout."],
      ["Does a cut list optimizer really save material?", "Often yes, especially on projects with repeated parts, by packing pieces better and turning leftovers into reusable offcuts instead of scrap."],
      ["Do I need to account for saw kerf?", "Yes. Each cut removes material, so an accurate optimizer includes kerf, or the last part in a row may not fit."],
      ["What is the easiest way to start?", "Open the cut list calculator, enter a few parts, and review the layout. Move larger or saved projects into CutList Optimizer."]
    ],
    links: [
      ["/cut-list-calculator/", "Cut list calculator"],
      ["/learn/what-is-cut-list-optimization/", "What is cut list optimization"],
      ["/learn/cut-list-planner/", "Cut list planner workflow"],
      ["/apps/cutlist/", "CutList Optimizer app"]
    ]
  },
  {
    slug: "plywood-cut-calculator",
    seoTitle: "Plywood Cut Calculator: Sheet Cutting Made Simple",
    h1: "Plywood Cut Calculator",
    description: "Use a plywood cut calculator to plan how parts fit on a 4x8 sheet, add saw kerf, count sheets, and cut less waste before you buy a single panel.",
    keywords: ["plywood cut calculator", "cut calculator for plywood", "plywood cutting calculator", "sheet cutting calculator", "plywood waste"],
    problem: "Plywood is sold in whole sheets, so the real question is rarely how much area you need, but how many sheets your parts actually require once they are arranged. A plywood cut calculator answers that. It places your panels on a real sheet size, adds the kerf each cut removes, and shows whether a cabinet job fits on two sheets or quietly needs a third. Guessing from square footage is where many plywood projects go over budget.",
    steps: [
      ["Set the sheet size", "Use the real panel you plan to buy, such as 48 by 96 inches for a standard 4x8 sheet, not a rounded nominal number."],
      ["Add the plywood parts", "List cabinet sides, shelves, backs, drawer parts, and any panels with their width, length, and quantity."],
      ["Include the saw kerf", "Enter your blade kerf, often about 1/8 inch, so the layout reflects the material lost to every cut across the sheet."],
      ["Read the sheet count and layout", "See how the panels pack, how many sheets you need, and where the waste falls before you head to the store."],
      ["Adjust a dimension to save a sheet", "Sometimes shaving a shelf depth or cabinet width by a small amount drops a full sheet from the order."]
    ],
    recommendation: "Run a quick plan in the free plywood cut calculator first. For a kitchen of cabinets or any project you want to save and reuse, move the layout into CutList Optimizer for iPhone so you can edit it and export a PDF for the shop.",
    faqs: [
      ["What is a plywood cut calculator?", "It is a tool that arranges your plywood parts on a real sheet size, includes saw kerf, and tells you how many sheets the project needs."],
      ["How many sheets of plywood do I need?", "It depends on how the parts pack, not just total area. Enter every part and the calculator reports a real sheet count."],
      ["Does the calculator account for grain direction?", "Good layouts let you lock visible faces so the grain stays consistent while hidden parts rotate to fill the sheet."],
      ["Is a 4x8 sheet really 48 by 96 inches?", "Close, but edges can be damaged or out of square, so measure the real sheet for tight layouts."],
      ["Can I use it for MDF or melamine?", "Yes. Sheet goods follow the same logic, though brittle melamine may need a higher waste allowance for chipping."]
    ],
    links: [
      ["/plywood-cut-calculator/", "Plywood cut calculator"],
      ["/learn/how-many-sheets-of-plywood-do-i-need/", "How many sheets of plywood you need"],
      ["/learn/plywood-cutting-optimization/", "Plywood cutting optimization"],
      ["/apps/cutlist/", "CutList Optimizer app"]
    ]
  },
  {
    slug: "cut-list-software",
    seoTitle: "Cut List Software for Woodworking Projects",
    h1: "Cut List Software",
    description: "Compare cut list software options for woodworking, from browser calculators to the CutList Optimizer app, and pick the right tool for saving, exporting, and reusing cut lists.",
    keywords: ["cut list software", "cut list app", "cutlist software", "cutting plan software", "woodworking software"],
    problem: "Spreadsheets and paper sketches work until a project has many repeated parts, changing dimensions, or needs to be reused. That is where cut list software earns its place. The right tool does more than total your parts: it arranges them on real stock, saves the project so you can edit it later, and exports a clean plan you can take to the saw. The trick is matching the level of software to the job instead of overcomplicating a simple shelf or under-planning a cabinet run.",
    steps: [
      ["Decide what the project needs", "A one-off shelf may only need a quick browser calculation; a kitchen of cabinets benefits from saved, editable software."],
      ["Use a browser calculator for quick jobs", "For fast, no-install planning, a cut list or plywood calculator gives a layout in seconds with no account."],
      ["Choose an app when you need to save and reuse", "Software that stores projects lets you reopen a layout, tweak a part, and reprint without starting over."],
      ["Look for export and offline use", "PDF export and offline access matter in a shop where you do not want to rely on a connection or a login."],
      ["Keep your data private", "An app that works on-device, without an account, keeps your project details on your phone instead of a cloud."]
    ],
    recommendation: "For quick planning, the free browser calculators are the simplest cut list software. When you need saved projects, repeat edits, PDF export, and offline use, CutList Optimizer for iPhone is the better fit, with no account required.",
    faqs: [
      ["What is cut list software?", "It is any tool that turns a parts list into a cutting plan. Some are browser calculators; others are apps that save and export projects."],
      ["Do I need software or is a spreadsheet enough?", "A spreadsheet tracks parts but cannot show whether they fit on real stock. Cut list software arranges the actual layout."],
      ["Is there free cut list software?", "Yes. The browser cut list and plywood calculators are free and need no install or account."],
      ["What should good cut list software include?", "Layout that respects kerf and rotation, saved projects, PDF export, and ideally offline, private operation."],
      ["Does cut list software work offline?", "The CutList Optimizer app is built to work offline on iPhone, so you can plan and cut without a connection."]
    ],
    links: [
      ["/apps/cutlist/", "CutList Optimizer app"],
      ["/learn/best-woodworking-calculator-workflow/", "Best calculator workflow"],
      ["/cut-list-calculator/", "Free cut list calculator"],
      ["/tools/", "WoodCutTool tools hub"]
    ]
  },
  {
    slug: "wood-cut-planner",
    seoTitle: "Wood Cut Planner: A Simple Planning Workflow",
    h1: "Wood Cut Planner",
    description: "A wood cut planner workflow takes a project from rough idea to cut-ready plan, organizing parts, material, kerf, and cut order so you cut once and cut right.",
    keywords: ["wood cut planner", "wood cutting planner", "cut planner", "cutting plan", "woodworking planning"],
    problem: "Planning is the cheapest place to fix a woodworking mistake. A wood cut planner is less a single tool than a repeatable workflow: define the project, list the parts, choose the material, account for kerf and grain, then arrange a cut order you can actually follow. Skipping this is why projects end with a forgotten part, a second trip to the store, or an offcut pile nobody can use. A clear planning sequence keeps the whole job moving from idea to finished cuts.",
    steps: [
      ["Define the finished project", "Start with the object and its real dimensions, whether that is a closet system, a workbench, or a set of drawers."],
      ["Break it into a parts list", "Name every part, with sizes and quantities, and mark which faces are visible so grain direction is planned, not improvised."],
      ["Choose and size the material", "Decide between boards and sheet goods, and use real stock sizes so the plan reflects what you will buy."],
      ["Plan the cut order with kerf in mind", "Sequence long cuts first, include the blade kerf, and keep the sheet or board stable for as long as possible."],
      ["Save the plan and cut from it", "Keep the planned layout with the project so you can reopen, adjust, and follow it at the saw instead of relying on memory."]
    ],
    recommendation: "For quick planning, sketch the parts and run them through the cut list or plywood calculator. For a project you will build over several sessions, CutList Optimizer for iPhone keeps the plan saved, editable, and ready offline at the saw.",
    faqs: [
      ["What is a wood cut planner?", "It is a workflow, often supported by a tool, that organizes a project into parts, material, kerf, and a followable cut order."],
      ["Why plan cuts before buying material?", "Planning shows the real sheet or board count and catches forgotten parts, so you buy the right amount once."],
      ["What should a cut plan include?", "Part names and sizes, quantities, material, saw kerf, grain direction, and a safe cut sequence."],
      ["How detailed should the plan be?", "Match it to the project. A simple shelf needs a quick layout; a cabinet run benefits from a saved, detailed plan."],
      ["Can I keep the plan at the saw?", "Yes. Export a PDF or use the CutList Optimizer app so the plan is with you while you cut."]
    ],
    links: [
      ["/learn/cut-list-planner/", "Cut list planner workflow"],
      ["/learn/how-to-read-a-cut-list/", "How to read a cut list"],
      ["/cut-list-calculator/", "Cut list calculator"],
      ["/apps/cutlist/", "CutList Optimizer app"]
    ]
  },
  {
    slug: "plywood-cut-list-calculator",
    seoTitle: "Plywood Cut List Calculator for Cabinet Parts",
    h1: "Plywood Cut List Calculator",
    description: "A plywood cut list calculator turns cabinet and panel parts into a sheet-by-sheet cutting plan, with kerf and grain handled, so you know exactly what to cut from each sheet.",
    keywords: ["plywood cut list calculator", "cutlist calculator", "plywood cutting calculator", "cabinet cut list", "sheet cutting plan"],
    problem: "When a project is built from plywood, the cut list and the sheet layout are really one problem. A plywood cut list calculator combines them: it takes your panel parts and generates a plan that shows which parts come from which sheet, in what order, with kerf and grain accounted for. This matters most on cabinets, where dozens of repeated sides, shelves, backs, and drawer parts have to be cut accurately and tracked so nothing is missed at assembly.",
    steps: [
      ["List the cabinet parts", "Enter sides, bottoms, shelves, backs, stretchers, and drawer parts with sizes and quantities for every box in the run."],
      ["Group parts by material", "Keep 3/4 inch carcass plywood separate from 1/4 inch backs so each material is planned on its own sheets."],
      ["Generate the cut list per sheet", "The calculator assigns parts to sheets and gives a cut order, so you know exactly what to cut from each panel."],
      ["Account for kerf and grain", "Include the blade kerf and lock the grain on visible cabinet faces so finished ends look consistent."],
      ["Label and track parts", "Mark each part as it is cut so identical panels do not get mixed up during assembly."]
    ],
    recommendation: "Use the plywood cut calculator to generate a quick cut list and sheet count. For a full kitchen or any multi-cabinet job, CutList Optimizer for iPhone saves the cut list, lets you edit it, and exports a PDF you can keep at the saw.",
    faqs: [
      ["What is a plywood cut list calculator?", "It generates a cutting plan from your plywood parts, showing which parts come from each sheet, with kerf and grain handled."],
      ["How is it different from a plain cut list?", "A plain cut list names parts and sizes; this calculator also arranges them on real sheets and reports the sheet count."],
      ["Can it handle a whole kitchen of cabinets?", "Yes. Enter every box's parts and quantities, and it plans the sheets, though saving the project in an app helps on big runs."],
      ["Should I separate backs from carcass plywood?", "Yes. Thin backs are usually a different, cheaper material and should be planned on their own sheets."],
      ["Does it include the toe kick and stretchers?", "Include every part you will cut, including stretchers and toe kicks, so the sheet count and cut list are complete."]
    ],
    links: [
      ["/plywood-cut-calculator/", "Plywood cut calculator"],
      ["/templates/kitchen-cabinet-cut-list/", "Kitchen cabinet cut list template"],
      ["/learn/how-to-read-a-cut-list/", "How to read a cut list"],
      ["/apps/cutlist/", "CutList Optimizer app"]
    ]
  },
  {
    slug: "sheet-cutting-calculator",
    seoTitle: "Sheet Cutting Calculator for Panels and Boards",
    h1: "Sheet Cutting Calculator",
    description: "A sheet cutting calculator lays out parts on plywood, MDF, and melamine, adds kerf, and plans the cut order so sheet goods cut cleanly with less waste.",
    keywords: ["sheet cutting calculator", "sheet goods calculator", "panel cutting calculator", "cut calculator", "reduce sheet waste"],
    problem: "Sheet goods look simple because they are rectangular, but laying parts out well is where a panel project succeeds or fails. A sheet cutting calculator arranges your parts on a real sheet, includes the kerf each cut removes, and helps you plan a cut order that keeps the panel stable and the edges clean. It works the same for plywood, MDF, and melamine, with small adjustments for finished faces and chipping, so you can plan any sheet goods job before buying material.",
    steps: [
      ["Set the sheet size and material", "Enter your real panel size and note the material, since melamine and finished faces affect the cut sequence."],
      ["Add the parts and quantities", "List every panel with width, length, and how many you need across the project."],
      ["Add kerf and rotation rules", "Include the blade kerf and decide which parts can rotate, locking visible faces where grain or pattern matters."],
      ["Plan the cut order", "Break the sheet down with long cuts first while it is most stable, then crosscut smaller parts to size."],
      ["Protect the edges and offcuts", "For brittle materials, score the cut and keep usable rectangular offcuts for future parts."]
    ],
    recommendation: "Start with the free plywood cut calculator for a fast sheet layout. For larger panel jobs or anything you want to save, edit, and export, CutList Optimizer for iPhone keeps the cutting plan with the project and works offline.",
    faqs: [
      ["What is a sheet cutting calculator?", "It arranges parts on sheet goods like plywood, MDF, or melamine, adds kerf, and plans a practical cut order to reduce waste."],
      ["Does it work for MDF and melamine?", "Yes. The layout logic is the same, though brittle melamine needs a sharp blade and a higher waste allowance for chipping."],
      ["Why does cut order matter?", "Cutting long pieces first keeps the sheet stable and gives clean reference edges for the smaller parts that follow."],
      ["How much does kerf affect a sheet layout?", "Across many cuts the kerf adds up, so ignoring it can make a layout look possible when the real sheet falls short."],
      ["What is the best next step?", "Run a layout in the plywood cut calculator, then save larger projects in CutList Optimizer for iPhone."]
    ],
    links: [
      ["/plywood-cut-calculator/", "Plywood cut calculator"],
      ["/learn/sheet-layout-optimization/", "Sheet layout optimization"],
      ["/learn/how-to-reduce-plywood-waste/", "How to reduce plywood waste"],
      ["/apps/cutlist/", "CutList Optimizer app"]
    ]
  }
];

const allLearnPages = [...articles, ...landingPages];

// slug -> h1, for building cross-link anchors
const pageTitleBySlug = Object.fromEntries(allLearnPages.map((p) => [p.slug, p.h1]));

const PILLAR_SLUG = "what-is-cut-list-optimization";

// G2 + G3: for each article, the sibling guides it links to (lateral spokes)
// and the tools it links back to. Every non-pillar page links to the pillar.
// Tool back-links here are what give stair / tile / quiltfit inbound links from /learn (G3).
const relatedMap = {
  // pillar: links DOWN to key supporting articles
  "what-is-cut-list-optimization": {
    guides: ["how-to-read-a-cut-list", "cut-list-planner", "how-to-reduce-plywood-waste"],
    tools: [["/cut-list-calculator/", "Cut list calculator"], ["/apps/cutlist/", "CutList app"]]
  },
  "how-to-read-a-cut-list": {
    guides: ["what-is-cut-list-optimization", "cut-list-planner", "saw-kerf-explained"],
    tools: [["/cut-list-calculator/", "Cut list calculator"], ["/apps/cutlist/", "CutList app"]]
  },
  "how-to-reduce-plywood-waste": {
    guides: ["what-is-cut-list-optimization", "saw-kerf-explained", "how-many-sheets-of-plywood-do-i-need"],
    tools: [["/plywood-cut-calculator/", "Plywood cut calculator"], ["/wood-waste-calculator/", "Wood waste calculator"]]
  },
  "saw-kerf-explained": {
    guides: ["what-is-cut-list-optimization", "how-to-read-a-cut-list", "how-to-reduce-plywood-waste"],
    tools: [["/plywood-cut-calculator/", "Plywood cut calculator"], ["/cut-list-calculator/", "Cut list calculator"]]
  },
  "how-many-sheets-of-plywood-do-i-need": {
    guides: ["what-is-cut-list-optimization", "how-to-reduce-plywood-waste", "sheet-layout-optimization"],
    tools: [["/plywood-cut-calculator/", "Plywood cut calculator"], ["/templates/kitchen-cabinet-cut-list/", "Kitchen cabinet cut list template"]]
  },
  "best-woodworking-calculator-workflow": {
    guides: ["what-is-cut-list-optimization", "woodworking-material-calculator", "diy-wood-project-estimation"],
    tools: [["/tools/", "All WoodCutTool tools"], ["/quiltfit/", "QuiltFit calculator"]]
  },
  "diy-workshop-planning-guide": {
    guides: ["what-is-cut-list-optimization", "diy-wood-project-estimation", "best-woodworking-calculator-workflow"],
    tools: [["/stair-stringer-calculator/", "Stair stringer calculator"], ["/stringer/", "Stringer tool"]]
  },
  "material-estimation-for-carpentry": {
    guides: ["what-is-cut-list-optimization", "woodworking-material-calculator", "diy-wood-project-estimation"],
    tools: [["/board-foot-calculator/", "Board foot calculator"], ["/tile-calculator/", "Tile calculator"], ["/stair-stringer-calculator/", "Stair stringer calculator"]]
  },
  // landing pages
  "plywood-cutting-optimization": {
    guides: ["what-is-cut-list-optimization", "sheet-layout-optimization", "how-many-sheets-of-plywood-do-i-need"],
    tools: [["/plywood-cut-calculator/", "Plywood cut calculator"]]
  },
  "woodworking-material-calculator": {
    guides: ["what-is-cut-list-optimization", "material-estimation-for-carpentry", "best-woodworking-calculator-workflow"],
    tools: [["/board-foot-calculator/", "Board foot calculator"]]
  },
  "cut-list-planner": {
    guides: ["what-is-cut-list-optimization", "how-to-read-a-cut-list", "best-woodworking-calculator-workflow"],
    tools: [["/cut-list-calculator/", "Cut list calculator"]]
  },
  "diy-wood-project-estimation": {
    guides: ["what-is-cut-list-optimization", "diy-workshop-planning-guide", "material-estimation-for-carpentry"],
    tools: [["/tile-calculator/", "Tile calculator"], ["/quiltfit/", "QuiltFit calculator"]]
  },
  "sheet-layout-optimization": {
    guides: ["what-is-cut-list-optimization", "plywood-cutting-optimization", "how-many-sheets-of-plywood-do-i-need"],
    tools: [["/plywood-cut-calculator/", "Plywood cut calculator"]]
  }
};

function relatedGuidesSection(slug) {
  const rel = relatedMap[slug];
  if (!rel) return "";
  const guideCards = (rel.guides || [])
    .filter((g) => pageTitleBySlug[g] && g !== slug)
    .map(
      (g) =>
        `<a href="/learn/${g}/"><span>Guide</span><strong>${escapeHtml(pageTitleBySlug[g])}</strong></a>`
    )
    .join("\n          ");
  const toolCards = (rel.tools || [])
    .map(([href, label]) => `<a href="${href}"><span>Tool</span><strong>${escapeHtml(label)}</strong></a>`)
    .join("\n          ");
  return `<section class="related-tools-guides">
        <p class="eyebrow">Related guides</p>
        <h2>Keep reading and pick the right tool</h2>
        <div class="related-grid">
          ${guideCards}
          ${toolCards}
        </div>
      </section>`;
}

function articleJsonLd(article) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.description,
    url: `${siteUrl}/learn/${article.slug}/`,
    mainEntityOfPage: `${siteUrl}/learn/${article.slug}/`,
    keywords: article.keywords.join(", ")
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function targetKeywords(article) {
  return `<section class="article-application-panel">
        <p class="eyebrow">Target keywords</p>
        <div class="related-grid">${article.keywords.map((keyword) => `<a href="/tools/"><span>Keyword</span><strong>${escapeHtml(keyword)}</strong></a>`).join("")}</div>
      </section>`;
}

function toolLinks() {
  return `<section class="related-tools-guides">
        <p class="eyebrow">Related tools</p>
        <h2>Use the tools mentioned in this guide</h2>
        <div class="related-grid">
          <a href="/tools/"><span>Hub</span><strong>All WoodCutTool tools</strong></a>
          <a href="/apps/cutlist/"><span>App</span><strong>CutList cut list optimizer</strong></a>
          <a href="/plywood-cut-calculator/"><span>Calculator</span><strong>Plywood cut calculator</strong></a>
          <a href="/cut-list-calculator/"><span>Calculator</span><strong>Cut list calculator</strong></a>
          <a href="/wood-waste-calculator/"><span>Calculator</span><strong>Wood waste calculator</strong></a>
          <a href="/board-foot-calculator/"><span>Calculator</span><strong>Board foot calculator</strong></a>
        </div>
      </section>`;
}

function articlePage(article) {
  return `<!doctype html>
<html lang="en">
${head({
    title: `${article.seoTitle} | WoodCutTool`,
    description: article.description,
    canonical: `${siteUrl}/learn/${article.slug}/`,
    jsonLd: articleJsonLd(article),
    ogType: "article"
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Learn", "/learn/"], [article.h1, `/learn/${article.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Learn")}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/learn/">Learn</a> / ${escapeHtml(article.h1)}</p>
      <p class="eyebrow">WoodCutTool Learn</p>
      <h1>${escapeHtml(article.h1)}</h1>
      <p class="lead">${escapeHtml(article.intro)}</p>
      ${targetKeywords(article)}
      ${article.sections.map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2><p>${body}</p></section>`).join("\n      ")}
      <section><h2>When to move from learning to planning</h2><p>Reading is useful when you are choosing a method, but the project becomes real when dimensions, quantities, material costs, and waste are entered into a tool. If the article describes the problem you are facing, the next step is to test your own numbers. Start with the <a href="/tools/">tools hub</a>, choose the calculator that matches the material, and compare the result before buying stock. For plywood and cabinet projects, move the final plan into <a href="/apps/cutlist/">CutList</a> so the layout can be saved, reopened, exported, and used at the saw.</p></section>
      <section><h2>Recommended next step</h2><p>If you only need a quick estimate, open the related browser calculator and run the first pass. If the job has many parts, expensive material, or changing measurements, use the CutList app as the project workspace. That path keeps the SEO learning journey connected to a practical action: learn the concept, calculate the material, review the layout, then save the final cut plan before work begins. This gives every reader a clear path from search intent to a useful tool.</p></section>
      <section class="inline-cta-section">
        <div class="inline-cta">
          <p>${escapeHtml(article.cta)}</p>
          <div class="cta-row"><a class="button" href="/apps/cutlist/">Open CutList</a><a class="button secondary" href="/tools/">Explore tools</a></div>
        </div>
      </section>
      ${relatedGuidesSection(article.slug)}
      ${toolLinks()}
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}

function landingJsonLd(page) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.h1,
        headline: page.h1,
        description: page.description,
        url: `${siteUrl}/learn/${page.slug}/`,
        mainEntityOfPage: `${siteUrl}/learn/${page.slug}/`,
        keywords: page.keywords.join(", ")
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: {
            "@type": "Answer",
            text
          }
        }))
      }
    ]
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function faqSection(page) {
  return `<section>
        <h2>FAQ</h2>
        <div class="faq-list">
          ${page.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("\n          ")}
        </div>
      </section>`;
}

function internalLinksSection(page) {
  return `<section class="related-tools-guides">
        <p class="eyebrow">Internal links</p>
        <h2>Continue planning with WoodCutTool</h2>
        <div class="related-grid">
          ${page.links.map(([href, label]) => `<a href="${href}"><span>Recommended</span><strong>${escapeHtml(label)}</strong></a>`).join("\n          ")}
        </div>
      </section>`;
}

function landingPage(page) {
  return `<!doctype html>
<html lang="en">
${head({
    title: `${page.seoTitle} | WoodCutTool`,
    description: page.description,
    canonical: `${siteUrl}/learn/${page.slug}/`,
    jsonLd: landingJsonLd(page),
    ogType: "article"
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Learn", "/learn/"], [page.h1, `/learn/${page.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Learn")}
  <main id="main" class="article-shell">
    <article class="article-body">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/learn/">Learn</a> / ${escapeHtml(page.h1)}</p>
      <p class="eyebrow">SEO landing page</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lead">${escapeHtml(page.description)}</p>
      ${targetKeywords(page)}
      <section>
        <h2>The problem</h2>
        <p>${escapeHtml(page.problem)}</p>
      </section>
      <section>
        <h2>Step-by-step solution</h2>
        <div class="steps-grid">
          ${page.steps.map(([heading, body], index) => `<article class="step-card"><span>${index + 1}</span><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(body)}</p></article>`).join("\n          ")}
        </div>
      </section>
      <section class="inline-cta-section">
        <div class="inline-cta">
          <p><strong>Tool recommendation:</strong> ${escapeHtml(page.recommendation)}</p>
          <div class="cta-row"><a class="button" href="/tools/">Explore WoodCutTool tools</a><a class="button secondary" href="/apps/cutlist/">Open CutList</a></div>
        </div>
      </section>
      ${faqSection(page)}
      <section class="inline-cta-section" aria-label="Download CutList Optimizer for iPhone">
        <div class="inline-cta">
          <p>Want to save, export, and reuse your cut lists? Download CutList Optimizer for iPhone.</p>
          <div class="cta-row"><a class="button" href="/apps/cutlist/">See the CutList Optimizer app</a><a class="button secondary" href="https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871" rel="nofollow noopener">Download CutList Optimizer</a></div>
        </div>
      </section>
      ${relatedGuidesSection(page.slug) || internalLinksSection(page)}
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}

function learnJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "WoodCutTool Learn",
    url: `${siteUrl}/learn/`,
    description: "SEO content hub for cut list optimization, plywood waste reduction, woodworking calculator workflows, DIY workshop planning, and material estimation for carpentry.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allLearnPages.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.h1,
        url: `${siteUrl}/learn/${article.slug}/`
      }))
    }
  };
  return `<script type="application/ld+json">
  ${JSON.stringify(graph, null, 2)}
  </script>`;
}

function learnIndexPage() {
  return `<!doctype html>
<html lang="en">
${head({
    title: "Woodworking Calculator Guides: Cuts, Waste & Estimates",
    description: "Guides on cut list optimization, plywood waste, saw kerf, and material estimation. Learn the method, then jump straight to the matching calculator.",
    canonical: `${siteUrl}/learn/`,
    jsonLd: learnJsonLd()
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Learn")}
  <main id="main">
    <section class="page-hero">
      <p class="breadcrumb"><a href="/">Home</a> / Learn</p>
      <p class="eyebrow">SEO learning hub</p>
      <h1>Learn Cut List Optimization, Woodworking Calculators, and Material Estimation</h1>
      <p class="lead">Use this learning hub to understand cut list optimization, plywood waste reduction, woodworking calculator workflows, DIY workshop planning, and material estimation for carpentry. Each guide links directly to WoodCutTool calculators and the CutList iPhone app so readers can move from research to action.</p>
      <div class="hero-actions"><a class="button" href="/tools/">Explore tools</a><a class="button secondary" href="/apps/cutlist/">Open CutList</a></div>
    </section>
    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">SEO landing pages</p><h2>High-intent planning pages for long-tail searches.</h2><p>These landing pages match users searching for plywood optimization, material calculators, cut list planning, DIY estimates, and sheet layouts.</p></div>
      <div class="grid tools">
        ${landingPages.map((page) => `<article class="card"><h2>${escapeHtml(page.h1)}</h2><p>${escapeHtml(page.description)}</p><a class="card-link" href="/learn/${page.slug}/">Open landing page</a></article>`).join("\n        ")}
      </div>
    </section>
    <section class="section">
      <div class="section-heading compact"><p class="eyebrow">Guides</p><h2>Long-tail woodworking and material planning articles.</h2><p>These articles support SEO discovery and convert high-intent readers toward calculators, tool pages, and the CutList app.</p></div>
      <div class="grid tools">
        ${articles.map((article) => `<article class="card"><h2>${escapeHtml(article.h1)}</h2><p>${escapeHtml(article.description)}</p><a class="card-link" href="/learn/${article.slug}/">Read guide</a></article>`).join("\n        ")}
      </div>
    </section>
    ${toolLinks()}
  </main>
  ${footer()}
</body>
</html>
`;
}

const learnDir = join(root, "learn");
mkdirSync(learnDir, { recursive: true });
writeFileSync(join(learnDir, "index.html"), learnIndexPage());

for (const article of articles) {
  const dir = join(learnDir, article.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), articlePage(article));
}

for (const page of landingPages) {
  const dir = join(learnDir, page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), landingPage(page));
}

console.log(`Generated ${allLearnPages.length} learn pages.`);
