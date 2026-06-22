import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260622-language-picker";
const siteUrl = "https://woodcuttool.com";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function head({ title, description, canonical, jsonLd = "" }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
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
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/tools/">Tools</a><a href="/learn/">Learn</a><a href="/apps/cutlist/">CutList</a><a href="/plywood-cut-calculator/">Plywood calculator</a><a href="/wood-waste-calculator/">Waste calculator</a></nav></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

const articles = [
  {
    slug: "what-is-cut-list-optimization",
    seoTitle: "What Is Cut List Optimization? A Practical Guide for Woodworkers",
    h1: "What Is Cut List Optimization?",
    description: "Learn what cut list optimization means, how it reduces waste, and when to use a cut list optimizer, plywood calculator, or woodworking app.",
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
    slug: "how-to-reduce-plywood-waste",
    seoTitle: "How to Reduce Plywood Waste Before Cutting",
    h1: "How to Reduce Plywood Waste",
    description: "A practical guide to reducing plywood waste with better measurement, kerf planning, sheet layouts, offcut decisions, and cut list optimizer tools.",
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
    slug: "best-woodworking-calculator-workflow",
    seoTitle: "Best Woodworking Calculator Workflow for Cut Lists, Plywood, and Waste",
    h1: "Best Woodworking Calculator Workflow",
    description: "Build a better woodworking calculator workflow with project scope, cut lists, plywood layout planning, waste estimates, and CutList app conversion.",
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
    seoTitle: "DIY Workshop Planning Guide: Tools, Layouts, Materials, and Cut Lists",
    h1: "DIY Workshop Planning Guide",
    description: "Plan a DIY workshop workflow with cut lists, plywood layouts, material calculators, waste estimates, storage, and practical app-based project planning.",
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
    seoTitle: "Material Estimation for Carpentry: Boards, Plywood, Waste, and Cost",
    h1: "Material Estimation for Carpentry",
    description: "Learn how to estimate carpentry materials with board feet, plywood sheets, cut lists, waste allowance, and tool-based project planning.",
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
  }
];

const landingPages = [
  {
    slug: "plywood-cutting-optimization",
    seoTitle: "Plywood Cutting Optimization for Cleaner Sheet Layouts",
    h1: "Plywood Cutting Optimization",
    description: "Plan plywood cutting optimization with fewer layout mistakes, better sheet use, saw kerf allowance, and a clear path from estimate to CutList.",
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
    seoTitle: "Woodworking Material Calculator for Boards, Plywood, Waste, and Cost",
    h1: "Woodworking Material Calculator",
    description: "Use a woodworking material calculator workflow to estimate boards, plywood sheets, board feet, waste, cost, and cut planning before buying stock.",
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
    seoTitle: "Cut List Planner for Cabinets, Shelves, and DIY Wood Projects",
    h1: "Cut List Planner",
    description: "Build a reliable cut list planner workflow for cabinets, shelves, plywood projects, board stock, saw kerf, saved layouts, and material saving.",
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
    seoTitle: "DIY Wood Project Estimation for Material, Cost, Waste, and Cut Lists",
    h1: "DIY Wood Project Estimation",
    description: "Estimate a DIY wood project with material quantities, plywood sheets, board feet, waste allowance, cost, and a practical cut list workflow.",
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
    seoTitle: "Sheet Layout Optimization for Plywood, MDF, Panels, and Shop Projects",
    h1: "Sheet Layout Optimization",
    description: "Improve sheet layout optimization for plywood, MDF, cabinet panels, shop projects, kerf planning, offcut reuse, and saved CutList layouts.",
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
  }
];

const allLearnPages = [...articles, ...landingPages];

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
    title: `${article.seoTitle} | WoodCutTool Learn`,
    description: article.description,
    canonical: `${siteUrl}/learn/${article.slug}/`,
    jsonLd: articleJsonLd(article)
  })}
<body>
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
    jsonLd: landingJsonLd(page)
  })}
<body>
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
      ${internalLinksSection(page)}
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
    title: "Learn Woodworking Calculators, Cut List Optimization, and Material Estimation | WoodCutTool",
    description: "Learn cut list optimization, plywood waste reduction, woodworking calculator workflows, DIY workshop planning, and carpentry material estimation.",
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
