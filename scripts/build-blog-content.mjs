import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ogTags, breadcrumbJsonLd } from "./seo-meta.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260623-seo-feed";
const siteUrl = "https://woodcuttool.com";


const articles = [
  {
    slug: "plywood-waste-cost-benchmark-manual-vs-optimizer",
    category: "CutList",
    title: "Plywood Waste Cost Benchmark: Manual Layout vs CutList Optimizer",
    description: "A data-backed field guide for measuring plywood waste, comparing manual planning against optimized layouts, and deciding when one saved sheet pays for the tool.",
    kicker: "Waste benchmark",
    readTime: "12 min",
    accent: "cutlist",
    sections: [
      ["Waste Is A Buying Decision Before It Is A Scrap Problem", "A plywood offcut does not become expensive only when it reaches the trash bin. The cost is committed earlier, when the project asks for one more full 4 x 8 sheet because the parts were grouped poorly, the grain rule was forgotten, or the kerf was not modeled. EPA frames source reduction as the highest-priority waste strategy because it prevents waste before disposal decisions exist; sheet optimization is the same idea at shop scale."],
      ["The Benchmark Should Measure Sheets, Not Just Percent Waste", "Waste percentage is useful, but sheet count is what the builder pays for. A layout that drops waste from 22% to 15% but still requires the same number of sheets may matter less than a layout that keeps waste at 18% while moving the job from four sheets to three. The practical benchmark is therefore: sheets purchased, useful offcuts retained, kerf included, and cut sequence still sane for the saw."],
      ["A 4 x 8 Sheet Gives You 32 Square Feet Before Reality Enters", "A nominal 4 x 8 panel contains 32 square feet of area. Real projects subtract trim cuts, saw kerf, defects, grain-locked panels, orientation rules, and offcuts too small to save. That means a pure area total is only a lower bound. If parts add up to 29 square feet, the project may still need two sheets because rectangles have to fit physically, not just arithmetically."],
      ["Why Manual Layout Usually Breaks On Repeated Parts", "Manual layouts are strongest when there are only a few large rectangles. They weaken when the list includes repeated shelves, mirrored cabinet sides, backs, stretchers, toe kicks, and narrow fillers. The maker starts optimizing locally: fit these shelves here, put the backs there, save that strip. The whole sheet may still be inefficient because early choices block better later placements."],
      ["How To Run A Fair Shop Benchmark", "Use the same input list for every method. Include sheet size, material type, quantity, grain direction, kerf, and minimum useful offcut size. Record the first manual plan, a spreadsheet plan, and a CutList layout. Then compare total sheets, remaining area, offcut quality, and whether a real person could follow the cut order without creating fragile strips too early."],
      ["What A 30% Waste Reduction Really Means", "If a project originally wastes 30% of three sheets, the scrap area is 28.8 square feet. Reducing waste by a third brings that scrap to 19.2 square feet, which is 9.6 square feet recovered. That may not always eliminate a whole sheet, but it can create a usable offcut inventory or avoid the extra sheet on the next job. This is why the benchmark must track offcut dimensions, not only a single waste percentage."],
      ["The CutList Advantage Is Review Speed", "The strongest reason to use an optimizer is not that it magically knows the project. It is that it lets the builder test alternatives quickly: rotate non-visible shelves, lock visible grain panels, split backs into a cheaper material group, or adjust a cabinet depth by half an inch. The time savings come from trying those versions before buying material."],
      ["When Optimization Should Lose To Shop Reality", "A lower-waste layout is not automatically better. If it creates unsafe narrow rips, forces too many panel flips, loses grain continuity, or leaves offcuts nobody will store, the shop should choose the slightly higher-waste plan. The benchmark is meant to support judgment, not replace it."]
    ],
    checklist: ["Benchmark by sheet count, useful offcuts, and cut order.", "Use the same kerf and grain rules in every comparison.", "Separate visible plywood from hidden utility panels.", "Treat a saved full sheet as the clearest ROI event.", "Reject layouts that are efficient but awkward or unsafe."],
    deepDive: {
      figureTitle: "Visual benchmark: where waste reduction appears",
      figureCaption: "The goal is not just smaller scraps. The goal is to turn random leftover shapes into fewer purchased sheets or offcuts large enough to reuse.",
      figureStats: [
        ["32 sq ft", "Nominal area in one 4 x 8 sheet"],
        ["1/8 in", "Typical benchmark kerf setting"],
        ["3 checks", "Sheet count, waste percent, usable offcuts"]
      ],
      comparisonTitle: "Manual layout vs spreadsheet vs optimizer",
      comparisonColumns: ["Planning method", "Best use", "Blind spot", "Benchmark signal"],
      comparisonRows: [
        ["Manual sketch", "Fast first pass for simple projects", "Hard to revise after many parts are placed", "Time rises sharply with repeated parts"],
        ["Spreadsheet", "Accurate quantities and pricing formulas", "Cannot see physical fit, kerf paths, or grain conflicts", "Area total looks possible but sheet layout fails"],
        ["Generic calculator", "Quick one-off area or board estimates", "Usually weak on offcuts, cut order, and saved projects", "Gives a count but not enough review detail"],
        ["CutList optimizer", "Sheet layout review with kerf, rotation, and project records", "Still needs human judgment for shop handling", "Fewer sheets or cleaner reusable offcuts"]
      ],
      faqs: [
        ["Is 30% plywood waste reduction realistic?", "It can be realistic on messy manual layouts, repeated cabinet parts, or projects where rotation and batching were not tested. It is not guaranteed on every job; a layout that is already tight may only improve by a few percentage points."],
        ["Should I optimize for waste percent or sheet count?", "Use both, but prioritize sheet count when buying material. Waste percent explains efficiency; sheet count decides whether you purchase another panel."],
        ["Does kerf really change the result?", "Yes. Ten cuts at 1/8 inch consume 1.25 inches of material before trim cuts. On a tight layout, that can decide whether the last part fits."],
        ["Why does grain direction reduce optimization freedom?", "Visible faces often cannot rotate without looking wrong. Locking grain direction narrows the optimizer's choices, but it protects the finished project."],
        ["What offcuts should I save?", "Save offcuts only above a useful shop threshold, such as pieces large enough for shelves, drawer parts, templates, or jigs. Label material, thickness, and size."],
        ["How often should I re-run the layout?", "Re-run after changing cabinet depth, material group, kerf, rotation permissions, or quantity. Those variables change the layout more than small cosmetic edits."]
      ],
      sources: [
        ["US EPA: Sustainable Management of Construction and Demolition Materials", "https://www.epa.gov/smm/sustainable-management-construction-and-demolition-materials", "EPA reports 600 million tons of C&D debris generated in 2018 and identifies source reduction as a priority strategy."],
        ["2D cutting stock research", "https://arxiv.org/abs/2604.01732", "Recent research describes rectangular sheet cutting as a combinatorial optimization problem where item assignment, rotation, and non-overlap constraints interact."],
        ["WoodCutTool 4x8 template", "/templates/4x8-plywood-sheet/", "Internal template for translating benchmark ideas into a practical 4 x 8 cutting plan."]
      ]
    }
  },
  {
    slug: "best-plywood-cutting-workflow-2026",
    category: "CutList",
    title: "Best Plywood Cutting Workflow In 2026: Calculator, Spreadsheet, Optimizer, or CNC?",
    description: "A practical comparison of plywood planning workflows for beginners, cabinet makers, remodelers, and small shops choosing between manual planning, spreadsheets, CutList, and CNC nesting.",
    kicker: "Workflow comparison",
    readTime: "13 min",
    accent: "cutlist",
    sections: [
      ["The Best Tool Depends On The Decision You Are Making", "A beginner asking whether a bookcase fits on one sheet does not need the same system as a cabinet shop batching prefinished plywood. The best plywood cutting workflow is the one that answers the next expensive question: how many sheets to buy, whether the parts physically fit, whether the grain is acceptable, and whether the plan can be followed at the saw."],
      ["Manual Planning Still Has A Place", "A pencil sketch is useful at the concept stage. It forces the builder to think about finished size, joinery, visible faces, and assembly order. But manual planning becomes fragile when quantities repeat or when small changes need to be tested. It is easy to create a plan that looks organized yet forgets kerf, backs, fillers, or mirrored parts."],
      ["Spreadsheets Are Estimators, Not Sheet Layouts", "A spreadsheet is excellent for box math, cost totals, and repeatable formulas. It can tell you that a project contains 18 shelves, 12 sides, and six backs. It cannot reliably prove that those rectangles fit on a set of sheets with blade kerf, rotation rules, and usable offcuts. Use spreadsheets to produce clean part lists; use a layout tool to review physical fit."],
      ["A Browser Calculator Is Best For Fast Feasibility", "An online plywood calculator is the fastest way to test a rough idea. It is ideal when you want to know whether a shelf project is likely one sheet or two, or whether a design change reduces waste. The limitation is persistence: serious projects eventually need saved versions, local records, export, or a mobile workflow in the shop."],
      ["A CutList Optimizer Is The Best Middle Layer For Most Builders", "Most woodworkers do not need a full CNC nesting pipeline, but they do need more than area math. CutList sits in the middle: it turns part dimensions into visual sheets, includes kerf and rotation, supports saved project records, and gives the builder something to review before material is purchased. That makes it useful for both beginners and small professional workflows."],
      ["CNC Nesting Is Powerful, But It Changes The Whole Process", "CNC software is best when the output is machine-ready geometry and production repeatability matters. It can handle complex parts, toolpaths, tabs, and machine constraints. But it also requires clean CAD data, machine setup, hold-down planning, tooling knowledge, and a different error model. For many sheet-good projects cut with a track saw or table saw, a visual rectangular optimizer is the more practical step."],
      ["The 2026 Workflow: Estimate, Optimize, Review, Then Cut", "The modern plywood workflow is not one tool. Start with the design, calculate rough material, optimize the actual part list, review offcuts and cut order, then cut. EPA's C&D guidance is a reminder that preventing excess material is better than managing waste later. In a small shop, that prevention happens during the planning workflow."],
      ["How To Choose Without Overbuying Software", "If you build once a year, use a browser calculator and print the layout. If you build monthly, use CutList so saved projects and revisions do not disappear. If you produce batches for sale, connect estimating, optimization, labels, and records. If a CNC machine is doing the cutting, use CNC-native nesting after the design is finalized."]
    ],
    checklist: ["Use manual sketches for concept design only.", "Use spreadsheets for quantities, formulas, and cost assumptions.", "Use a browser calculator for quick feasibility checks.", "Use CutList for saved visual sheet layouts and shop review.", "Use CNC nesting when the output must become machine-ready toolpaths."],
    deepDive: {
      figureTitle: "Workflow map: from idea to cut-ready sheet",
      figureCaption: "A strong workflow does not force every project into the heaviest tool. It moves from rough intent to physical layout only when the part list is clear enough to optimize.",
      figureStats: [
        ["Manual", "Best for concept constraints"],
        ["CutList", "Best for visual sheet review"],
        ["CNC", "Best for machine-ready production"]
      ],
      comparisonTitle: "2026 plywood planning workflow comparison",
      comparisonColumns: ["Workflow", "Best for", "What it misses", "Use CutList when"],
      comparisonRows: [
        ["Manual sketch", "One-off rough planning and early design thinking", "Kerf, repeated quantities, fast revisions, and audit trail", "The sketch turns into a shopping decision"],
        ["Spreadsheet", "Cabinet math, pricing, formulas, and repeatable part lists", "Spatial fit on real sheets and visual offcut quality", "The spreadsheet has a clean parts list ready to test"],
        ["Browser calculator", "Quick plywood feasibility checks without login", "Long-term records, project history, and detailed mobile workflow", "The rough estimate becomes a real build"],
        ["CutList app", "Saved layouts, kerf-aware planning, visual review, and PDF/shop records", "Machine toolpath generation for CNC routers", "You cut with a saw but need production discipline"],
        ["CNC nesting", "Machine cutting, complex shapes, tabs, toolpaths, and repeat production", "Simple fast planning for saw-cut rectangular projects", "You need a pre-CNC estimate or saw-cut version"]
      ],
      faqs: [
        ["What is the best plywood cutting calculator for beginners?", "For beginners, the best tool is one that shows the sheet visually and makes mistakes obvious. Start with a browser calculator, then use CutList when you need saved projects or a shop-ready plan."],
        ["Do professionals still use spreadsheets?", "Yes. Spreadsheets remain useful for estimating, pricing, and quantity logic. The problem is using a spreadsheet as proof that parts fit on sheets."],
        ["Is CNC nesting always better than CutList?", "No. CNC nesting is better when a CNC router will cut the job. For table saw, track saw, or home-center cutting, a visual rectangular optimizer is often faster and easier to review."],
        ["When should I move from a calculator to an app?", "Move when the project has repeated parts, multiple materials, grain rules, revisions, or a need for saved records and exported plans."],
        ["Can a plywood optimizer replace woodworking judgment?", "No. It can reduce layout guesswork, but you still decide grain appearance, safe cut order, joinery allowances, and which offcuts are worth saving."],
        ["What workflow reduces waste the most?", "The workflow that catches mistakes before purchase: clean part list, realistic kerf, material groups, rotation rules, visual review, and a final cut sequence."]
      ],
      sources: [
        ["US EPA: C&D source reduction guidance", "https://www.epa.gov/smm/sustainable-management-construction-and-demolition-materials", "EPA emphasizes reducing material use and preventing waste before it is generated."],
        ["2D cutting stock research", "https://arxiv.org/abs/2604.01732", "Recent research frames two-dimensional sheet cutting as an optimization problem with assignment, orientation, and non-overlap constraints."],
        ["WoodCutTool comparison page", "/compare/best-plywood-tools/", "Internal comparison page for users evaluating plywood cutting calculator tools."]
      ]
    }
  },
  {
    slug: "cutlist-shop-workflow-from-bid-to-cut",
    category: "CutList",
    title: "CutList Shop Workflow: From Bid to First Cut",
    description: "How cabinet shops turn a rough scope into a cut-ready sheet plan without losing time between estimating, layout, and production.",
    kicker: "Production workflow",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Start With The Bid Assumptions", "A useful cut list begins before the shop opens a sheet. Pull cabinet counts, exposed finished ends, drawer box quantities, and any odd depth changes out of the estimate first. Those assumptions decide whether the optimizer is solving the real job or a simplified version of it."],
      ["Separate Parts By Material Behavior", "Melamine, prefinished plywood, veneer plywood, and shop-grade backing should not be treated as one pool. Each material has different face quality, grain rules, chipout risk, and offcut value. Splitting them early keeps the resulting layout practical on the saw."],
      ["Use Optimization As A Review Step", "The best shops do not accept the first layout blindly. They inspect sheet count, narrow strips, repeated rip settings, and offcuts that are large enough to keep. CutList planning works best when it becomes a review station between estimating and production."],
      ["Close The Loop After Cutting", "When the job is finished, compare expected waste with actual scraps. Patterns show up quickly: oversized filler allowances, duplicated panels, or parts that should be batched differently. That feedback turns the next cut list into a better estimate."]
    ],
    checklist: ["Lock finished dimensions before optimizing.", "Mark material groups before sheet layout.", "Review offcuts that are worth labeling.", "Compare planned waste with real scrap."]
  },
  {
    slug: "plywood-optimization-kerf-grain-offcuts",
    category: "CutList",
    title: "Plywood Optimization: Kerf, Grain, and Offcut Strategy",
    description: "A practical look at the three details that decide whether a plywood layout is shop-ready or just mathematically compact.",
    kicker: "Sheet goods",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Kerf Is A Layout Constraint", "Blade width changes every cut line. On a dense sheet, a kerf setting that is even one millimeter too low can push the final part out of tolerance. For cabinet parts, enter the saw blade you will actually use and include any trim cut needed to square factory edges."],
      ["Grain Direction Beats Small Waste Savings", "Visible panels need consistent grain, and that can cost material. A layout that rotates every part to save a few percent may still be wrong for doors, finished ends, and drawer fronts. Treat rotation permission as a design decision, not a convenience toggle."],
      ["Offcuts Need A Minimum Useful Size", "Not every leftover piece is worth saving. Decide the smallest offcut the shop will label and store, then optimize around that habit. A neat 300 mm strip is useful; a pile of thin slivers is just delayed cleanup."],
      ["Plan Cut Order Around Handling", "A low-waste nesting result can still be awkward if it forces fragile strips too early. Put large stabilizing cuts first where possible, then break down smaller parts. Good optimization supports the person at the saw."]
    ],
    checklist: ["Use actual blade kerf.", "Disable rotation on visible grain parts.", "Define a save-worthy offcut size.", "Review cut order for handling safety."]
  },
  {
    slug: "cabinet-cut-list-mistakes",
    category: "CutList",
    title: "Common Cabinet Cut List Mistakes That Waste Sheets",
    description: "The recurring data-entry and planning errors that make cabinet jobs consume more plywood than expected.",
    kicker: "Cabinet planning",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Mixing Finished And Rough Dimensions", "A cut list should state whether a number is final part size, oversized trim size, or opening size. Mixing those conventions creates double allowances and mismatched panels."],
      ["Forgetting Edgebanding Direction", "Parts that receive edgebanding often need a different handling sequence. If banded edges affect final dimensions, the cut list should make that visible before optimization."],
      ["Duplicating Symmetrical Parts", "Left and right sides are easy to duplicate accidentally when copying cabinet boxes. Grouping parts by exact size and label exposes quantity errors before the material plan is trusted."],
      ["Ignoring The Back Panel Standard", "Back panels, nailers, and stretchers often follow shop standards. Keeping them as reusable presets reduces typing and prevents small size drift across a run of cabinets."]
    ],
    checklist: ["Label dimension type clearly.", "Group exact duplicate sizes.", "Check left/right quantities.", "Use presets for standard parts."]
  },
  {
    slug: "reducing-sheet-good-waste-on-small-shops",
    category: "CutList",
    title: "Reducing Sheet-Good Waste In A Small Woodworking Shop",
    description: "How small teams can get professional material control without a full production engineering department.",
    kicker: "Small shop operations",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Standardize The Sheet Library", "Keep common stock sizes, thicknesses, and material names consistent. A small shop loses time when the same plywood appears under three names or when every job starts from a blank stock list."],
      ["Batch Similar Projects", "If two jobs use the same material, batch planning can reveal better layouts than optimizing each project in isolation. This is especially useful for shelves, drawer parts, and utility panels."],
      ["Make Offcuts Searchable", "Saved scraps only matter when people can find them. Label material, thickness, size, and date. A simple offcut shelf with visible dimensions can reduce new sheet purchases."],
      ["Keep A Waste Baseline", "Track expected waste per project type. Cabinet boxes, closets, built-ins, and one-off furniture all behave differently. Baselines help the shop notice when a layout is unusually expensive."]
    ],
    checklist: ["Use consistent material names.", "Batch projects using the same stock.", "Label usable offcuts.", "Track waste by job type."]
  },
  {
    slug: "cutlist-vs-spreadsheets-for-cabinetmakers",
    category: "CutList",
    title: "CutList Apps vs Spreadsheets For Cabinet Makers",
    description: "Where spreadsheets are still useful and where a visual cut list optimizer saves more time.",
    kicker: "Tools comparison",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Spreadsheets Are Good At Repetition", "A spreadsheet is still a strong place to calculate box quantities, door sizes, and pricing assumptions. It is familiar, flexible, and easy to audit when the formulas are clean."],
      ["Spreadsheets Are Weak At Spatial Layout", "Once parts need to fit on physical sheets with kerf, rotation, and grain rules, cells stop being a natural interface. The maker needs to see the board, not just the totals."],
      ["Visual Layout Reduces Second Guessing", "A CutList-style optimizer shows how the material is consumed. That makes it easier to catch a strange part, a wrong quantity, or an offcut that could be reused."],
      ["The Best Workflow Uses Both", "Use spreadsheets for estimating logic and a visual optimizer for sheet layout. The handoff point should be a clean parts list with dimensions, quantities, material, and rotation rules."]
    ],
    checklist: ["Keep estimating formulas in one place.", "Export a clean parts list.", "Review the visual sheet layout.", "Save the final plan with the job record."]
  },
  {
    slug: "quiltfit-digital-quilt-planning-workflow",
    category: "QuiltFit",
    title: "A Digital Quilt Planning Workflow For Modern Makers",
    description: "How QuiltFit-style planning helps quilters move from sketch to fabric requirements with fewer surprises.",
    kicker: "Quilt workflow",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Begin With Finished Size", "Start with the finished quilt size and intended use. A throw, wall quilt, baby quilt, and bed quilt all create different decisions for block count, borders, backing, and binding."],
      ["Convert The Sketch Into Blocks", "Digital planning works best when the design is broken into repeatable blocks. Once the block size and grid are stable, fabric estimates become much easier to reason about."],
      ["Track Fabric Roles", "Name fabrics by role: background, feature print, accent, border, backing, and binding. Role-based planning prevents the common mistake of buying enough total yardage but not enough of the fabric that matters."],
      ["Save Decisions As The Project Evolves", "Quilt ideas change. A saved plan gives the maker a record of block count, fabric assumptions, and changed measurements so the project does not depend on memory."]
    ],
    checklist: ["Pick finished size first.", "Lock block size before yardage.", "Assign fabric roles.", "Save revisions as the design changes."]
  },
  {
    slug: "fabric-yardage-estimates-with-block-layouts",
    category: "QuiltFit",
    title: "Fabric Yardage Estimates From Block Layouts",
    description: "A practical framework for estimating fabric from blocks, repeats, seams, and cutting waste.",
    kicker: "Fabric math",
    readTime: "8 min",
    accent: "quiltfit",
    sections: [
      ["Block Count Drives The Estimate", "Every fabric estimate starts with how many times each shape appears. A digital block layout makes repeated pieces visible and reduces the chance of missing a secondary fabric."],
      ["Seam Allowance Changes The Cut Size", "Finished patch dimensions are not cutting dimensions. Add seam allowance consistently, especially when a block mixes squares, strips, and triangle units."],
      ["Directional Prints Need Extra Room", "Fabric direction can prevent efficient rotation. Plaids, stripes, text prints, and directional motifs often need a larger allowance than solids or small allover prints."],
      ["Round Up With A Purpose", "Rounding should reflect risk: pattern matching, cutting mistakes, shrinkage, or future repairs. A blanket percentage is simple, but a role-specific allowance is usually more accurate."]
    ],
    checklist: ["Count each fabric role by block.", "Convert finished size to cut size.", "Account for directional prints.", "Round up based on real risk."]
  },
  {
    slug: "backing-binding-batting-planning",
    category: "QuiltFit",
    title: "Backing, Binding, and Batting Planning Without Guesswork",
    description: "How to estimate the less glamorous materials that decide whether a quilt finishes smoothly.",
    kicker: "Finishing materials",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Backing Needs Overhang", "Backing is not the same size as the quilt top. Longarm quilting, domestic quilting, and basting methods all need extra margin around the finished top."],
      ["Binding Depends On Perimeter", "Binding length follows the quilt perimeter, plus joining allowance and corners. Width depends on the desired finish and batting thickness."],
      ["Batting Choice Affects Drape", "Batting is a design decision as much as a quantity. Loft, fiber content, shrinkage, and quilting distance all affect the final feel."],
      ["Plan Finishing Early", "Finishing materials should be estimated before cutting begins. That prevents a nearly completed quilt from stalling while the maker searches for backing fabric."]
    ],
    checklist: ["Add backing overhang.", "Calculate binding from perimeter.", "Match batting to quilting plan.", "Buy finishing materials early."]
  },
  {
    slug: "quilt-project-tracking-from-sketch-to-finish",
    category: "QuiltFit",
    title: "Tracking A Quilt Project From Sketch To Finish",
    description: "A lightweight project system for quilt ideas, fabric decisions, cutting progress, and finish notes.",
    kicker: "Project tracking",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Capture The Original Intent", "Keep a note about why the quilt is being made, who it is for, and what size it needs to become. Those constraints guide later design choices."],
      ["Record Fabric Sources", "Fabric names, collection names, and yardage purchased are easy to forget. Recording them helps if more fabric is needed or if the maker wants to repeat a palette."],
      ["Track Cutting And Assembly Progress", "Large quilts stall when progress is invisible. Track cut pieces, completed blocks, rows assembled, quilting, binding, and label status."],
      ["Write Finish Notes", "Finish notes make future projects easier. Record what worked, what ran short, and what measurement would change next time."]
    ],
    checklist: ["Save project intent.", "Record fabric source and yardage.", "Track cutting status.", "Write final lessons learned."]
  },
  {
    slug: "color-and-repeat-planning-for-modern-quilts",
    category: "QuiltFit",
    title: "Color And Repeat Planning For Modern Quilts",
    description: "How digital layouts help balance color rhythm, negative space, and repeated blocks before fabric is cut.",
    kicker: "Design planning",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Use A Limited Palette First", "A smaller palette makes the structure easier to evaluate. Once the rhythm works, additional prints can be added without hiding the design."],
      ["Preview Negative Space", "Modern quilts often rely on open space. A digital layout makes it clear whether negative space feels intentional or simply empty."],
      ["Repeat Blocks With Variation", "Repeating a block gives the quilt order, while rotating color placement creates movement. Planning those variations before cutting saves fabric and time."],
      ["Check Contrast At A Distance", "Zoom out or view the layout small. If the contrast disappears, the finished quilt may read flatter than expected."]
    ],
    checklist: ["Start with fewer colors.", "Evaluate negative space.", "Plan block variations.", "Check contrast from a distance."]
  },
  {
    slug: "stair-stringer-design-rise-run-basics",
    category: "Stairs",
    title: "Stair Stringer Design: Rise, Run, and Total Height",
    description: "The core measurements behind a stair stringer layout and why small errors compound fast.",
    kicker: "Stringer basics",
    readTime: "7 min",
    accent: "stairs",
    sections: [
      ["Total Rise Comes First", "Measure from finished lower floor to finished upper floor. Rough framing heights can mislead the layout if flooring thickness has not been included."],
      ["Riser Count Controls Comfort", "Divide total rise into an even number of risers that fits the local code and the project use. A small change in riser count changes every step."],
      ["Run Defines The Footprint", "Tread depth and nosing rules determine how far the stair travels. A comfortable stair can still fail if the room does not have enough horizontal space."],
      ["Stringer Length And Angle Are Consequences", "After rise and run are set, the stringer angle and length follow. Treating angle as the starting point usually creates awkward steps."]
    ],
    checklist: ["Measure finished-floor to finished-floor.", "Choose riser count deliberately.", "Confirm available run.", "Check local code before cutting."]
  },
  {
    slug: "comfortable-stair-layout-rules",
    category: "Stairs",
    title: "Comfortable Stair Layout Rules Designers Actually Use",
    description: "How rise, run, rhythm, and landing placement shape stairs that feel natural instead of merely code-compliant.",
    kicker: "Design comfort",
    readTime: "8 min",
    accent: "stairs",
    sections: [
      ["Consistency Matters Most", "People adapt quickly to a stair rhythm. One odd riser is more dangerous than a full flight that is slightly steep but consistent."],
      ["The Rise-Run Relationship Sets The Feel", "A lower riser usually needs a deeper tread. A high riser with a shallow tread feels abrupt, especially for children, older users, and anyone carrying materials."],
      ["Landings Change The Experience", "A landing can make a tall run feel calmer and can solve direction changes. It also changes framing, headroom, and guardrail planning."],
      ["Headroom Should Be Checked Early", "Headroom problems are expensive to fix late. Check the stair path in section before committing to opening size or stringer geometry."]
    ],
    checklist: ["Keep every riser equal.", "Balance rise with tread depth.", "Use landings deliberately.", "Verify headroom in section."]
  },
  {
    slug: "deck-stair-stringer-field-measurements",
    category: "Stairs",
    title: "Deck Stair Stringer Field Measurements",
    description: "What to measure before cutting exterior stringers for decks, porches, and platforms.",
    kicker: "Field layout",
    readTime: "6 min",
    accent: "stairs",
    sections: [
      ["Measure To Finished Surfaces", "Exterior stairs often connect framing, decking, pads, and grade. Measure to the finished walking surfaces rather than the current rough structure."],
      ["Account For Landing Slope", "Concrete pads and grade often slope for drainage. That slope affects the bottom riser and should be measured where the stair will actually land."],
      ["Confirm Attachment Details", "Stringer attachment height, hangers, blocking, and rim framing all affect the final layout. The best stair math still needs a real connection plan."],
      ["Plan For Weather Exposure", "Exterior stringers need durable material choices, drainage gaps, and fasteners suited to the environment. Layout is only one part of a long-lasting stair."]
    ],
    checklist: ["Measure finished deck to finished landing.", "Check pad slope.", "Confirm attachment hardware.", "Use exterior-rated material and fasteners."]
  },
  {
    slug: "stair-opening-planning-for-remodels",
    category: "Stairs",
    title: "Planning Stair Openings In Remodel Projects",
    description: "How to evaluate stair footprint, headroom, and structural constraints before redesigning a stair opening.",
    kicker: "Remodel design",
    readTime: "8 min",
    accent: "stairs",
    sections: [
      ["Start With The Existing Structure", "Joists, beams, walls, and mechanical runs limit where an opening can move. A stair concept that ignores structure can become expensive quickly."],
      ["Model The Walking Line", "The walking line shows where people actually step. It matters for turns, landings, winders, and headroom checks."],
      ["Check Headroom Through The Whole Path", "Headroom is not just a single point at the opening. It needs to be checked along the stair path as the user climbs."],
      ["Coordinate With Guardrails And Doors", "Railings, door swings, and landings compete for space. Resolve those conflicts before cutting framing."]
    ],
    checklist: ["Map structure first.", "Draw the walking line.", "Check headroom along the path.", "Coordinate railings and doors."]
  },
  {
    slug: "avoiding-common-stringer-layout-errors",
    category: "Stairs",
    title: "Avoiding Common Stringer Layout Errors",
    description: "The mistakes that cause uneven risers, weak cuts, and expensive stair rework.",
    kicker: "Error prevention",
    readTime: "6 min",
    accent: "stairs",
    sections: [
      ["Do Not Forget Tread Thickness", "If the top or bottom condition includes a finished tread, decking, or flooring, that thickness changes the stringer cut. Missing it creates an uneven first or last step."],
      ["Watch The Bottom Cut", "The bottom plumb and seat cuts must match the landing condition. A small mistake here throws off the whole flight."],
      ["Leave Enough Stringer Strength", "Deep notches can weaken a stringer. Material size, species, and local code matter when deciding how many stringers and what stock to use."],
      ["Make A Test Layout", "For unfamiliar conditions, marking one stringer and checking it in place before cutting multiples can save a full set of boards."]
    ],
    checklist: ["Include finished tread thickness.", "Check bottom cut against landing.", "Maintain stringer strength.", "Test one stringer before batching."]
  },
  {
    slug: "tile-layout-planning-before-install",
    category: "Tile",
    title: "Tile Layout Planning Before The First Thinset Mix",
    description: "How installers and designers use layout planning to avoid awkward slivers, bad sightlines, and rushed cuts.",
    kicker: "Tile planning",
    readTime: "7 min",
    accent: "tile",
    sections: [
      ["Find The Visual Center", "The room's mathematical center is not always the visual center. Doorways, tubs, vanities, and main sightlines decide where the pattern should feel balanced."],
      ["Avoid Tiny Edge Cuts", "Small slivers at walls or thresholds look accidental and are harder to install. Shift the layout to create larger perimeter cuts where possible."],
      ["Dry-Lay Critical Lines", "Dry-laying a few rows exposes real tile size variation, joint width, and how the pattern meets focal points."],
      ["Plan Transitions Early", "Thresholds, adjacent flooring, and expansion joints should be part of the layout, not late details."]
    ],
    checklist: ["Set visual centerlines.", "Avoid tiny perimeter cuts.", "Dry-lay key rows.", "Resolve transitions before setting tile."]
  },
  {
    slug: "tile-waste-estimation-by-pattern",
    category: "Tile",
    title: "Tile Waste Estimation By Pattern Type",
    description: "Why straight lay, diagonal, herringbone, and mixed-size tile patterns need different waste allowances.",
    kicker: "Waste planning",
    readTime: "7 min",
    accent: "tile",
    sections: [
      ["Straight Lay Is The Baseline", "A simple straight layout usually has the lowest waste when the room is square and tile size fits well. It still needs allowance for cuts, breakage, and attic stock."],
      ["Diagonal Layouts Create More Cuts", "Turning tile at 45 degrees increases perimeter cuts and can create more unusable triangles. The pattern may be worth it, but the waste factor should rise."],
      ["Herringbone Needs Pattern Control", "Herringbone waste depends on module size, room shape, and starting line. The visual payoff is high, but edge cuts multiply quickly."],
      ["Mixed-Size Patterns Need Unit Counts", "When a pattern uses multiple tile sizes, estimate by repeating module, not just square footage. Running short on one size can stop the project."]
    ],
    checklist: ["Use straight lay as the baseline.", "Increase allowance for diagonal cuts.", "Map herringbone starting lines.", "Estimate mixed-size modules separately."]
  },
  {
    slug: "large-format-tile-cut-planning",
    category: "Tile",
    title: "Large-Format Tile Cut Planning",
    description: "How large tile changes layout decisions, handling, breakage risk, and tool requirements.",
    kicker: "Large format",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["Flatness Becomes Critical", "Large-format tile makes substrate problems obvious. Layout planning should include flatness checks because lippage tolerance is much tighter."],
      ["Cuts Are More Expensive", "A bad cut on a large tile wastes more money than a bad cut on a small tile. Plan cuts around edges, fixtures, and focal walls before opening boxes."],
      ["Handling Needs Space", "Large pieces require room to stage, cut, back-butter, and set. A layout that is simple on paper can be difficult in a cramped bathroom."],
      ["Grout Joints Still Matter", "Large tile often looks best with tighter joints, but tile warpage and manufacturer guidance control what is realistic."]
    ],
    checklist: ["Check substrate flatness.", "Plan expensive cuts first.", "Make staging room.", "Follow joint guidance for tile size."]
  },
  {
    slug: "bathroom-tile-layout-slope-and-drain",
    category: "Tile",
    title: "Bathroom Tile Layout Around Slope And Drainage",
    description: "Planning shower and bathroom tile so the pattern supports drainage instead of fighting it.",
    kicker: "Wet areas",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["Drain Location Sets The Geometry", "A center drain, linear drain, and offset drain each create different slope planes. Tile size and pattern should match the drainage geometry."],
      ["Small Tiles Follow Slope Better", "Mosaics and smaller formats can follow compound slopes with less lippage. Large tile usually needs simpler slope planes or special cutting."],
      ["Wall Lines Should Meet Floor Logic", "Shower walls and floors are seen together. Aligning major grout lines can make the whole bathroom feel more intentional."],
      ["Waterproofing Comes Before Visuals", "The layout can be beautiful, but waterproofing and drainage performance decide whether the installation lasts."]
    ],
    checklist: ["Choose tile size for drain geometry.", "Use small tile on compound slopes.", "Coordinate wall and floor grout lines.", "Prioritize waterproofing details."]
  },
  {
    slug: "grout-joint-layout-and-visual-balance",
    category: "Tile",
    title: "Grout Joint Layout And Visual Balance",
    description: "How grout width, color, and line alignment affect the finished tile design.",
    kicker: "Finish design",
    readTime: "6 min",
    accent: "tile",
    sections: [
      ["Grout Is Part Of The Pattern", "Grout lines are visible geometry. Wide contrasting grout creates a graphic grid, while close matching grout makes tile read as a surface."],
      ["Joint Width Depends On Tile Reality", "Handmade, rectified, and pressed tiles all behave differently. The joint should account for actual size variation, not just the desired look."],
      ["Align Lines Across Features", "Niches, benches, vanities, and transitions look cleaner when major grout lines relate to them. Plan those alignments before cuts begin."],
      ["Color Changes Maintenance Perception", "Light grout can brighten a room but may show staining sooner. Dark grout hides more but can emphasize every line."]
    ],
    checklist: ["Treat grout as design geometry.", "Base joint width on tile variation.", "Align lines with features.", "Choose color for both look and maintenance."]
  },
  {
    slug: "cutlist-floating-shelves-plywood",
    category: "CutList",
    title: "Floating Plywood Shelves: Cut List and Layout",
    description: "Plan strong, clean floating shelves from a single plywood sheet, with a cut list, hidden cleat sizing, grain direction, and a sheet layout that wastes less.",
    kicker: "Weekend project",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Why Floating Shelves Are A Good First Plywood Project", "Floating shelves are forgiving enough for a beginner but still teach the core skills: consistent rip widths, square crosscuts, grain direction on visible faces, and a hidden mounting system. Because every shelf is a repeated part, they are also a clear example of why batching parts on a sheet matters more than cutting them one at a time."],
      ["Build The Cut List Before You Buy", "A floating shelf is usually a hollow box: a top, a bottom, a front edge, and two short returns, wrapped around a wall cleat. List those parts for every shelf with width, length, and quantity. Three shelves multiply fast, and a forgotten return or front edge is the most common reason a one-sheet plan quietly becomes a two-sheet trip."],
      ["Size The Hidden Cleat First", "The cleat is what makes the shelf float, so size it before the skin. A 2x cleat or a torsion-style plywood cleat sets the internal cavity, and the plywood top and bottom must clear it. Plan the cleat thickness into the shelf depth so the box slides on without forcing, then confirm the wall studs match your shelf spacing."],
      ["Lay The Parts Out For Grain And Waste", "Visible shelf tops and front edges should share grain direction so the finished run looks consistent. Lock those faces, then let the hidden bottoms and returns rotate to fill the sheet. Run the parts through the plywood cut calculator with your real kerf to confirm everything fits before you cut, and to keep any leftover strip rectangular enough to reuse."],
      ["Cut Order That Keeps Edges Clean", "Break the sheet into long rips first while it is most stable, then crosscut the shelves and returns to length. Cutting the big rips first gives you straight reference edges for the smaller parts and keeps you from wrestling a full sheet for a tiny piece."]
    ],
    checklist: ["List top, bottom, front, and returns for every shelf.", "Size the hidden cleat before the plywood skin.", "Lock grain on visible tops and front edges.", "Confirm shelf spacing lands on wall studs.", "Run the layout with real kerf before cutting."]
  },
  {
    slug: "cutlist-plywood-platform-bed",
    category: "CutList",
    title: "Plywood Platform Bed: Cut List for a Sturdy Frame",
    description: "A practical cut list and sheet plan for a plywood platform bed, covering panel sizes, support spacing, mattress fit, and how many sheets the frame needs.",
    kicker: "Furniture build",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Start From The Mattress, Not The Sheet", "A platform bed is sized by the mattress it carries. Confirm the real mattress dimensions and the height you want, then work backward to panel sizes. A common mistake is building to a nominal size and finding the mattress sits proud or rattles loose, so add only the clearance the design needs and no more."],
      ["The Parts That Make A Platform Bed", "Most plywood platform beds are a deck supported by aprons and either legs or panel sides, often with a center beam for longer mattresses. List the deck panels, the aprons, the side panels or legs, and the center support. For a queen or king, the deck almost always splits into two or more panels, so plan that seam over a support rather than mid-span."],
      ["Support Spacing Decides Stiffness", "A platform deck flexes if the supports are too far apart. Plan cross supports or slats so the span stays short enough for the plywood thickness you chose. Thicker plywood allows wider spacing; thinner plywood needs more frequent support. Decide this before the cut list, because it changes how many support pieces you cut."],
      ["Fit The Panels On Your Sheets", "Deck panels are large, so they drive the sheet count. Two deck halves plus aprons and supports can run close to two full sheets, and adding storage drawers pushes it further. Use the plywood cut calculator to see how the large panels pack and whether a small dimension change saves a sheet before you buy."],
      ["Assembly Order And Knockdown Hardware", "If the bed must move through doorways or fit in a small room, plan it as a knockdown frame with bolts or connector hardware instead of glue. Cut the parts so the heavy deck panels rest on the aprons and the load transfers into the legs or side panels, not into the fasteners alone."]
    ],
    checklist: ["Confirm real mattress size and bed height first.", "Plan deck seams over a support, not mid-span.", "Match support spacing to plywood thickness.", "Let large deck panels drive the sheet count.", "Use knockdown hardware if the bed must move."]
  },
  {
    slug: "cutlist-built-in-bookshelf-wall",
    category: "CutList",
    title: "Built-In Bookshelf Wall: Planning the Cut List",
    description: "Plan a floor-to-ceiling built-in bookshelf wall with a plywood cut list, consistent shelf spacing, scribe allowance, and a sheet count you can trust.",
    kicker: "Built-in project",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["A Built-In Is Several Cabinets In A Row", "A floor-to-ceiling bookshelf wall is easier to plan as a series of identical plywood boxes rather than one giant unit. Decide a cabinet width that divides the wall cleanly, then repeat it. Repeated boxes make the cut list predictable, keep shelf parts interchangeable, and let the optimizer batch identical panels efficiently."],
      ["Measure The Opening, Then Subtract For Scribe", "Walls and floors are rarely square, so a built-in needs scribe allowance to fit tight. Measure the opening at several heights and widths, take the smallest, then subtract a scribe margin on the end panels and a filler strip where the run meets the wall. Plan those filler and scribe parts into the cut list now, not at install."],
      ["Shelf Spacing And Fixed Versus Adjustable", "Decide which shelves are structural and fixed and which are adjustable. Fixed shelves stiffen the carcass and should land where the design needs strength; adjustable shelves give flexibility for books of different heights. This decision changes your part count, because fixed shelves are full-depth structural panels and adjustable shelves are slightly shorter."],
      ["Backs, Face Frames, And Material Groups", "Separate the carcass plywood from the back panels and any face frame or trim. Backs are often a thinner, cheaper plywood and should be grouped separately on their own sheets. Keeping material groups apart in the cut list stops a thin back panel from being planned on the same sheet as a 3/4 inch side."],
      ["Confirm The Sheet Count Before You Commit", "A bookshelf wall can swallow several sheets fast once sides, shelves, backs, and a top run are added. List every part with quantity, then run it through the plywood cut calculator to get a real sheet count. For a build this size, save the layout in CutList so you can adjust cabinet width and re-check the count before buying a stack of plywood."]
    ],
    checklist: ["Divide the wall into repeated identical boxes.", "Add scribe and filler allowance from real measurements.", "Decide fixed versus adjustable shelves up front.", "Group thin backs separately from carcass plywood.", "Verify the full sheet count before buying."]
  },
  {
    slug: "cutlist-workshop-storage-cabinet",
    category: "CutList",
    title: "Workshop Storage Cabinet: A One-Weekend Cut List",
    description: "Build a sturdy shop storage cabinet from plywood with a simple cut list, adjustable shelves, a strong back, and a layout that uses offcuts well.",
    kicker: "Shop project",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["A Shop Cabinet Is Where Offcuts Become Useful", "A workshop storage cabinet is the ideal project for using up shop-grade plywood and offcuts. It does not need show-quality faces, so you can relax grain rules, use utility panels, and put leftover pieces to work. That makes it a good first carcass build and a smart way to clear the offcut pile."],
      ["Keep The Carcass Simple", "A basic shop cabinet is two sides, a top, a bottom, a back, and shelves. Decide whether it hangs on the wall or sits on the floor, because that changes the back panel strength and the need for a nailer strip. Plan a solid back for a hanging cabinet so it carries weight into the studs."],
      ["Adjustable Shelves Earn Their Keep", "Shop storage changes constantly, so adjustable shelves are worth the small extra effort. Plan shelf pin holes or a simple cleat system, and cut shelves slightly shorter than the inside width so they drop in and out easily. List the shelves as a repeated part so the quantity is obvious."],
      ["Lay It Out To Eat The Scrap Pile", "Because faces do not need to match, this is the project where you let the optimizer rotate freely and fill the sheet. Run the parts through the cut list calculator or plywood cut calculator, allow rotation on every panel, and aim to consume awkward offcuts instead of cutting into a fresh sheet."],
      ["Build It To Be Modified Later", "A shop cabinet rarely stays the same. Use screws instead of only glue where you might add a drawer, a divider, or a power strip later. Cutting the carcass so it can be modified keeps the cabinet useful as the shop changes."]
    ],
    checklist: ["Use shop-grade plywood and offcuts freely.", "Plan a strong back for a hanging cabinet.", "Cut adjustable shelves slightly undersized.", "Allow full rotation to consume scrap.", "Use screws where you may modify it later."]
  },
  {
    slug: "plywood-grades-for-cabinets-explained",
    category: "CutList",
    title: "Plywood Grades for Cabinets, Explained",
    description: "Understand plywood grades, veneer cores, and face ratings so you pick the right sheet for cabinet boxes, doors, and shelves without overpaying or underbuilding.",
    kicker: "Material guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Grades Describe Faces, Not Strength", "Plywood grade letters such as A, B, C, and D describe the appearance of each face, not how strong the panel is. An A face is smooth and nearly defect-free; a D face may have knots and patches. Sheets are graded on both faces, so an A-C panel has one good side and one rough side. For cabinets, that distinction decides which face shows and which faces inward."],
      ["Match The Face To The Job", "Cabinet sides that show, doors, and exposed ends want a good face out, so A or B grade earns its cost there. Interior partitions, bottoms, and backs can use a lower face grade because nobody sees them. Buying a top grade for hidden parts wastes money; using a rough face on a visible end wastes the look. The cut list is where you should mark which parts need a show face."],
      ["Core Matters As Much As The Face", "A smooth face over a void-filled core still makes a weak shelf and an ugly edge. Veneer-core plywood is light and strong; MDF-core is flat and stable but heavy; particleboard-core is cheap but weak at fasteners. Cabinet-grade plywood usually means a veneer core with few internal voids, which holds screws and finishes a clean edge."],
      ["Hardwood Plywood And Species", "Cabinet builders often choose hardwood plywood like birch, maple, or oak for visible work. The species sets the look and the price, and prefinished birch is popular for cabinet interiors because it needs no finishing. Decide species and finish before the cut list so you can group prefinished and raw panels separately."],
      ["Plan Material Groups In The Cut List", "Once you know which parts need which grade and species, split them into material groups before laying out sheets. A good cabinet plan rarely uses one single sheet type for everything. Run each group through the plywood cut calculator on its own so a cheap back panel is never planned onto an expensive show-grade sheet."]
    ],
    checklist: ["Read both face grades on every sheet.", "Put show-grade faces only where they show.", "Choose a void-free veneer core for cabinets.", "Pick species and finish before cutting.", "Lay out each material group separately."]
  },
  {
    slug: "mdf-vs-plywood-for-cut-projects",
    category: "CutList",
    title: "MDF vs Plywood for Cut Projects",
    description: "A practical comparison of MDF and plywood for cabinets, shelves, and panels, covering strength, weight, edges, screws, finishing, and how each one cuts.",
    kicker: "Material comparison",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Two Sheet Goods, Two Different Jobs", "MDF and plywood both come in 4x8 sheets and both cut into rectangular parts, but they behave differently under load, fasteners, and moisture. Choosing between them is less about which is better and more about which fits the part. Many real projects use both: plywood where strength and screw-holding matter, MDF where a flat painted surface matters."],
      ["Strength And Screw Holding", "Plywood is stronger across a span and holds screws far better, especially at edges, which is why cabinet carcasses and shelves usually favor it. MDF has no grain, so it can split or strip when screwed into an edge. If a part carries weight or takes fasteners on its edge, plywood is usually the safer call."],
      ["Edges And Finishing", "MDF has a smooth, dense face and a uniform edge that paints beautifully with no grain to telegraph, which makes it a favorite for painted doors and trim. Plywood shows its layered edge and grain, so it often needs edge banding or a solid edge for a clean look. If the part will be painted and flat, MDF wins on finish; if it will be stained or screwed, plywood wins."],
      ["Weight, Dust, And Moisture", "MDF is heavy and produces fine dust that demands good dust control and a mask. It also swells badly if it gets wet, so it is a poor choice for anything near moisture unless it is sealed. Plywood is lighter, more moisture-tolerant, and easier to handle on a full sheet, which matters when one person is breaking down sheets."],
      ["How Each One Cuts And Lays Out", "Both cut cleanly with a sharp blade, but MDF dulls blades faster and benefits from a fine-tooth blade to avoid fuzzy edges. For layout, the kerf and rotation logic is the same: run either material through the plywood cut calculator with your real kerf. The difference is in part assignment, so keep MDF parts and plywood parts in separate material groups."]
    ],
    checklist: ["Use plywood where strength or screws matter.", "Use MDF for flat painted faces.", "Plan edge banding for visible plywood edges.", "Keep MDF away from moisture unless sealed.", "Group MDF and plywood parts separately when cutting."]
  },
  {
    slug: "reading-a-cut-diagram-at-the-saw",
    category: "CutList",
    title: "Reading a Cut Diagram at the Saw",
    description: "Turn a plywood cut diagram into clean parts at the saw: read the layout, follow a safe cut order, label parts, and avoid the mistakes that ruin a sheet.",
    kicker: "Shop technique",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["A Diagram Is A Plan, Not Just A Picture", "A cut diagram shows where every part sits on the sheet, but its real value is the order it implies. Read it before you cut anything: find the largest parts, see which cuts run the full length, and notice where small parts come from leftover strips. A minute of reading prevents the most common error, which is cutting a small part first and losing your reference edges."],
      ["Cut The Long Rips First", "Most diagrams are cut most safely by making the long rips first while the sheet is large and stable, then crosscutting those strips into parts. Cutting big to small keeps you from balancing a full sheet to free a tiny piece. It also gives every later part a clean, straight reference edge from the first rips."],
      ["Account For Kerf On Every Line", "The diagram assumes a blade width between parts. If you cut exactly on a line without remembering the blade removes material, the last part in a row comes up short. Confirm the diagram was built with your real kerf, and when you mark by hand, keep the blade on the waste side of the line every time."],
      ["Label Parts As You Cut", "Identical-looking panels get mixed up fast. As each part comes off the saw, write its name on the waste face or a piece of tape: left side, fixed shelf, back. Labeling at the saw saves confusion at assembly, especially when several parts share the same dimensions but have different roles or grain direction."],
      ["Keep The Offcuts The Diagram Saved", "A good diagram leaves a usable rectangular offcut on purpose. Do not cut into it for a small part if the plan put that part elsewhere. Set the planned offcut aside, label its size and thickness, and it becomes free material for the next project instead of anonymous scrap."]
    ],
    checklist: ["Read the whole diagram before cutting.", "Make long rips first, then crosscut to size.", "Keep the blade on the waste side of each line.", "Label every part as it leaves the saw.", "Protect the rectangular offcut the plan saved."]
  },
  {
    slug: "stair-stringer-material-and-thickness",
    category: "Stairs",
    title: "Stair Stringer Material and Thickness",
    description: "Choose the right stringer material and thickness for safe stairs: lumber sizing, cut depth limits, spacing, and when to add a mid-span stringer.",
    kicker: "Stair framing",
    readTime: "8 min",
    accent: "stairs",
    sections: [
      ["The Stringer Is The Structure", "A staircase is only as strong as its stringers, the sloped boards that carry every tread and all the load on them. Choosing the right material and thickness is a safety decision, not a cosmetic one. Before cutting notches, confirm the stock is straight, sound, and rated for the span and load the stairs will see."],
      ["Common Stringer Material", "Interior stringers are often 2x12 dimensional lumber because it leaves enough material after the tread and riser notches are cut. Exterior or ground-contact stairs use pressure-treated lumber. Some builders use engineered lumber for long, straight runs. Whatever the material, pick boards with minimal knots along the notch lines, since a knot at a cut can become a weak point."],
      ["Why 2x12 And The Cut Depth Rule", "When you notch a stringer for treads and risers, you remove material and leave a thinner remaining throat behind the cuts. Building guidance commonly calls for keeping enough solid material behind the notch, which is why a 2x12 is standard: a smaller board may not leave enough throat after notching. Plan the rise and run so the remaining material stays adequate, and check your local code for the exact requirement."],
      ["Stringer Spacing And Mid-Span Support", "Stringer spacing depends on tread material and thickness. Closer spacing reduces tread flex and bounce. Wider stairs almost always need a third, mid-span stringer so the treads do not sag in the middle. Decide the number of stringers before you cut, because it changes how many identical notched boards you produce."],
      ["Lay Out One, Then Use It As A Template", "Cut and check a single stringer first, test it against the actual rise and run, then use it as a template to mark the rest so every stringer matches. Use the stair stringer calculator to work out riser height, tread depth, and stringer length before marking, so the first board is right and the rest simply copy it."]
    ],
    checklist: ["Pick straight, sound stock with clear notch lines.", "Use 2x12 so notching leaves enough throat.", "Check local code for remaining-material rules.", "Add a mid-span stringer on wide stairs.", "Cut one stringer, verify it, then template the rest."]
  },
  {
    slug: "tile-layout-for-small-bathrooms",
    category: "Tile",
    title: "Tile Layout for Small Bathrooms",
    description: "Make a small bathroom feel larger with smart tile layout: where to start, how to handle cuts at walls, grout choices, and estimating tiles and boxes.",
    kicker: "Tile planning",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["Layout Decides How Big The Room Feels", "In a small bathroom, the tile layout has an outsized effect on how large the space feels. Larger tiles with thin grout lines reduce visual clutter and can make a floor read bigger, while busy small tiles with wide grout can shrink it. Decide tile size and grout color as a design choice before you estimate quantities."],
      ["Find The Layout Lines First", "Do not start tiling from a wall, because walls are rarely straight. Find the center or a balanced reference line so the cut tiles at opposite walls are similar in size. A layout that leaves a full tile at the doorway and a tiny sliver at the back wall looks unbalanced. Dry-lay a row to see where the cuts land before committing."],
      ["Handle The Inevitable Cuts", "Small rooms are mostly edges, so cuts dominate. Plan the layout so cut tiles fall in less visible places, such as under a vanity or along the tub, and keep full tiles where the eye lands first. Around the toilet flange, drain, and fixtures, expect fiddly cuts and order enough extra tile to cover mistakes."],
      ["Grout And Maintenance In A Wet Room", "Grout is both design and maintenance. Tighter joints look cleaner but show lippage if tiles vary; wider joints hide variation but collect more grime. In a small wet bathroom, choose a grout color and joint width you can keep clean, and seal where the manufacturer recommends. The grout line is part of the layout, not an afterthought."],
      ["Estimate Tiles, Boxes, And Waste", "Once the layout and tile size are set, estimate how many tiles and boxes you need plus a waste allowance for cuts and breakage. Small rooms have a high cut ratio, so a larger waste percentage is realistic. Use the tile calculator to turn the room size, tile size, and waste allowance into a tile count, boxes required, and material cost before you buy."]
    ],
    checklist: ["Pick tile size and grout color as a design choice.", "Lay out from a balanced center line, not a wall.", "Hide cut tiles in low-visibility spots.", "Choose a grout joint you can keep clean.", "Add extra waste allowance for a high-cut room."]
  },
  {
    slug: "floor-tile-vs-wall-tile-planning",
    category: "Tile",
    title: "Floor Tile vs Wall Tile: Planning the Difference",
    description: "Floor and wall tile need different planning. Learn how rating, layout reference, cut placement, and waste estimates differ so each surface comes out right.",
    kicker: "Tile planning",
    readTime: "7 min",
    accent: "tile",
    sections: [
      ["They Are Not Interchangeable", "Floor tile and wall tile look similar on a sample board but plan very differently. Floor tile must be rated to walk on and resist slipping; many wall tiles are too thin or too slick for floors. Confirm the tile is rated for the surface before you plan layout or buy, because the right look on the wrong surface fails fast."],
      ["Different Reference Lines", "Floors are planned from a balanced center so cut tiles at opposite walls match. Walls are planned from a level horizontal reference and a plumb vertical one, often starting above the floor so the bottom row is not a thin sliver. The starting logic is different because gravity, sightlines, and the eye level of a standing person all change where balance matters."],
      ["Cut Placement Changes By Surface", "On a floor, cuts hide along walls and under fixtures. On a wall, the most visible cuts are at outside corners, around a window, and at the top course where they meet eye level. Plan wall layouts so full tiles land where people look and cuts fall at the edges. This often means the layout for a wall and the floor below it do not line up, and that is fine."],
      ["Waste Differs Too", "Wall layouts around windows, niches, and corners can generate more odd cuts than a simple rectangular floor, so the waste allowance is often higher on walls. A plain floor may need a smaller allowance, while a tub surround with a niche needs more. Estimate each surface separately rather than using one blanket number for the whole room."],
      ["Estimate Each Surface On Its Own", "Because rating, layout, and waste all differ, plan the floor and the walls as separate jobs. Run each through the tile calculator with its own dimensions and waste allowance to get an honest tile count and box count for that surface, then add them. Mixing them into one estimate hides where the cuts and cost really land."]
    ],
    checklist: ["Confirm the tile is rated for floor or wall use.", "Use a center line on floors, a level line on walls.", "Put wall cuts at corners and edges, not eye level.", "Use a higher waste allowance for cut-heavy walls.", "Estimate floor and walls as separate surfaces."]
  },
  {
    slug: "plywood-thickness-guide-for-projects",
    category: "CutList",
    title: "Plywood Thickness Guide: Which to Use and Where",
    description: "A practical plywood thickness guide for shelves, cabinets, backs, and drawers, with real nominal-versus-actual sizes and where each thickness belongs.",
    kicker: "Material guide",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Nominal Thickness Is Not Actual Thickness", "The single most common plywood surprise is that a sheet sold as 3/4 inch usually measures closer to 23/32 inch, and 1/2 inch is often nearer 15/32 inch. Sanded and hardwood plywood are milled slightly under their nominal label. If you cut a dado for a nominal 3/4 inch shelf, the real panel rattles loose. Measure the actual sheet before sizing joints, grooves, and rabbets."],
      ["Where Each Thickness Belongs", "Thicker is not always better; it is heavier, more expensive, and harder to handle. 3/4 inch is the workhorse for cabinet sides, shelves that span, and structural panels. 1/2 inch suits drawer sides, small cabinet parts, and lighter shelves. 1/4 inch is for cabinet backs, drawer bottoms, and panels that float in a frame. Matching thickness to load is what keeps a project both strong and affordable."],
      ["Span and Sag Decide Shelf Thickness", "A shelf's thickness must match its span and load. A 3/4 inch plywood shelf carrying books should not span much past 30 to 36 inches without support or a stiffening edge, or it will sag over time. Doubling the front edge or adding a center support lets a thinner shelf carry more. Decide the span first, then the thickness, not the other way around."],
      ["Thickness Changes Your Sheet Count And Weight", "Mixing thicknesses in one project means buying more than one sheet type, and that changes both cost and the cut list. A full sheet of 3/4 inch hardwood plywood can weigh over 70 pounds, which matters when one person breaks it down. Plan thinner material for parts that allow it, both to save weight and to keep the budget sensible."],
      ["Confirm Joints Against The Real Panel", "Every joint that captures a panel — a dado, groove, or rabbet — should be sized to the measured plywood, not the label. Cut a test groove in scrap and confirm the fit before running the real parts. Then enter your true thicknesses into the cut list so the layout and any joinery allowances reflect what you actually bought."]
    ],
    chart: {
      title: "Nominal vs actual plywood thickness (inches)",
      caption: "Hardwood and sanded plywood usually run under their nominal label. Size joints to the actual measurement, not the name on the tag.",
      unit: "",
      bars: [["1/4 nom", 0.25], ["1/4 actual", 0.21], ["1/2 nom", 0.5], ["1/2 actual", 0.47], ["3/4 nom", 0.75], ["3/4 actual", 0.72]]
    },
    deepDive: {
      figureTitle: "Where each thickness lands in a cabinet",
      figureCaption: "Structural sides and spanning shelves use 3/4 inch; backs and drawer bottoms use 1/4 inch.",
      figureStats: [["23/32 in", "Typical actual size of 3/4 in plywood"], ["30-36 in", "Practical 3/4 in shelf span before sag"], ["~70 lb", "Weight of a 3/4 in hardwood sheet"]],
      comparisonTitle: "Thickness to job match",
      comparisonColumns: ["Thickness", "Best use", "Avoid for", "Note"],
      comparisonRows: [
        ["1/4 inch", "Backs, drawer bottoms, panels", "Shelves and structure", "Floats in grooves, very light"],
        ["1/2 inch", "Drawer sides, small parts, light shelves", "Long spans, heavy load", "Good weight-to-strength balance"],
        ["3/4 inch", "Sides, structural shelves, tops", "Lightweight panels", "Standard cabinet carcass thickness"],
        ["1-1/8 inch", "Workbench tops, stair treads", "General cabinetry", "Heavy and stiff, special order"]
      ],
      faqs: [
        ["Why is my 3/4 inch plywood thinner than 3/4 inch?", "Hardwood and sanded plywood are milled slightly under nominal, so 3/4 inch often measures about 23/32 inch. Size joints to the real measurement."],
        ["How far can a 3/4 inch plywood shelf span?", "Roughly 30 to 36 inches for books before noticeable sag. Add a stiffening edge or center support for longer spans."],
        ["Can I use 1/4 inch plywood for shelves?", "Only for very light loads in a supported frame. For real shelving, use 1/2 or 3/4 inch."],
        ["Does thickness affect how many sheets I buy?", "Yes. Mixing thicknesses means separate sheet types, which changes cost, weight, and the cut list."]
      ],
      sources: [
        ["APA - The Engineered Wood Association: Plywood", "https://www.apawood.org/plywood", "Industry association covering plywood performance, grades, and nominal versus actual panel thickness."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Enter your real measured thickness to plan an accurate sheet layout."]
      ]
    },
    checklist: ["Measure actual thickness before sizing joints.", "Match thickness to load and span.", "Use 1/4 inch for backs, 3/4 inch for structure.", "Plan weight when one person handles sheets.", "Test-fit grooves in scrap first."]
  },
  {
    slug: "sheet-goods-cost-comparison-plywood-mdf-osb",
    category: "CutList",
    title: "Sheet Goods Cost Comparison: Plywood, MDF, OSB, Melamine",
    description: "Compare the real cost and trade-offs of plywood, MDF, OSB, and melamine for cabinets and shelves so you spend where it matters and save where it does not.",
    kicker: "Material economics",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Price Per Sheet Is Only Half The Story", "Sheet goods are easy to compare by sticker price, but the real cost includes waste, edge treatment, finishing, and how long the part lasts. A cheap sheet that needs edge banding, primer, and replacement in five years can cost more than a pricier sheet that installs clean. Compare total installed cost, not just the price at the rack."],
      ["What Each Material Is Good At", "Plywood is strong, light, and holds screws, making it the default for cabinet structure. MDF is dead flat and paints beautifully, ideal for doors and trim. OSB is cheap and structural but rough, suited to hidden or utility work. Melamine is a pre-finished particleboard panel that saves finishing time for shelving and closet interiors but is heavy and chips on the saw."],
      ["The Hidden Cost Of Finishing", "A raw plywood or MDF panel is not finished until it is sealed, and that labor and material is a real cost. Prefinished plywood and melamine arrive ready, trading a higher sheet price for saved finishing time. On a big closet or shelving job, prefinished material can win on total cost even though each sheet costs more."],
      ["Weight, Waste, And Handling", "MDF, melamine, and particleboard are heavy and tiring to handle, and MDF dust demands serious dust control. Plywood and OSB are lighter per sheet. Waste also varies: brittle melamine chips at the cut line, so a sharp scoring blade and extra waste allowance protect the edges. Factor handling and waste into the comparison, not just the price."],
      ["Match The Material To The Part, Not The Whole Project", "The best projects mix materials: plywood for structure, MDF for painted doors, melamine for hidden shelving, OSB for a utility back. Splitting the cut list by material lets each part use the cheapest sheet that does the job. Group materials separately and run each through the cut list so a cheap back is never planned on an expensive sheet."]
    ],
    chart: {
      title: "Relative cost index per 4x8 sheet (plywood = 100)",
      caption: "Indexed, not absolute prices, since rates vary by region and grade. Use it to compare relative material cost, then add finishing and waste.",
      unit: "",
      bars: [["OSB", 35], ["Particleboard", 45], ["MDF", 60], ["Melamine", 80], ["Plywood", 100], ["Hardwood ply", 165]]
    },
    deepDive: {
      figureTitle: "Cost is price plus finishing plus waste",
      figureCaption: "A prefinished panel costs more per sheet but can win on total installed cost by skipping finishing.",
      figureStats: [["3-4x", "Plywood can cost several times OSB"], ["0 coats", "Melamine and prefinished ply need no finish"], ["Higher", "Melamine waste allowance for chipping"]],
      comparisonTitle: "Sheet goods at a glance",
      comparisonColumns: ["Material", "Strength", "Finish need", "Best use"],
      comparisonRows: [
        ["Plywood", "High, holds screws", "Seal or band edges", "Cabinet structure, shelves"],
        ["MDF", "Moderate, weak edges", "Primes and paints well", "Painted doors, trim"],
        ["OSB", "Structural, rough", "Usually left raw", "Hidden or utility parts"],
        ["Melamine", "Low at fasteners", "None, prefinished", "Closet and shelf interiors"]
      ],
      faqs: [
        ["Is plywood always worth the extra cost?", "Not always. Use plywood where strength and screws matter, and cheaper sheets for hidden or painted parts."],
        ["Why does melamine chip when I cut it?", "Its hard surface fractures at the blade. Use a sharp fine-tooth or scoring blade and add waste allowance."],
        ["Does prefinished material really save money?", "It can, by removing finishing labor and material. On large jobs that often offsets the higher sheet price."],
        ["Can I mix materials in one project?", "Yes, and you usually should. Match each part to the cheapest sheet that meets its job."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood and wood-based panel properties from the USDA Forest Service."],
        ["WoodCutTool wood waste calculator", "/wood-waste-calculator/", "Estimate scrap and waste cost per material to compare total cost, not just sheet price."]
      ]
    },
    checklist: ["Compare installed cost, not just sheet price.", "Use plywood for structure and screws.", "Use MDF for flat painted faces.", "Add waste allowance for chip-prone melamine.", "Split the cut list by material group."]
  },
  {
    slug: "saw-blade-selection-for-clean-plywood-cuts",
    category: "CutList",
    title: "Saw Blade Selection for Clean Plywood Cuts",
    description: "Pick the right saw blade for splinter-free plywood: tooth count, kerf, grind, and feed rate, plus how blade choice changes your cut list spacing.",
    kicker: "Shop technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Tooth Count Drives Edge Quality", "For plywood and veneers, more teeth usually means a cleaner cut. A general 40-tooth combination blade is a fair compromise, but a 60- to 80-tooth blade gives far less splintering on veneered faces. Fewer teeth cut faster and cooler for ripping solid lumber, but they tear plywood faces. Match the blade to the material and the face quality you need."],
      ["Kerf Width Is A Planning Number, Not Just A Blade Spec", "Blade kerf is how much width each cut removes, and it belongs in your cut list, not just on the blade box. A full-kerf blade removes about 1/8 inch; a thin-kerf blade removes closer to 3/32 inch. Across many cuts that difference adds up, and it decides whether the last part in a row fits. Measure your blade's real kerf and enter it before laying out a sheet."],
      ["Grind Type And Why It Matters", "Tooth grind shapes the cut. An alternate top bevel grind slices veneer cleanly and is the usual choice for plywood and crosscuts. A flat top grind rips fast in solid wood but tears veneer. A high alternate top bevel is the gold standard for splinter-free melamine and prefinished faces. The grind is as important as the tooth count for a clean edge."],
      ["Support, Scoring, And Feed Rate", "Even a great blade tears out if the sheet is unsupported or fed wrong. Back up the cut with a sacrificial surface or zero-clearance insert, keep a steady moderate feed, and slow down on the exit. For melamine, a scoring pass or a fresh sharp blade prevents the bottom-face chipping that ruins a visible panel."],
      ["Keep The Blade Sharp And The Layout Honest", "A dull blade burns, tears, and wanders, which no layout can fix. Clean pitch off the blade and replace or sharpen it when cuts deteriorate. Then keep your cut list kerf matched to the blade you actually use, so the plan you see on screen is the plan that fits on the real sheet."]
    ],
    chart: {
      title: "Tooth count vs plywood edge quality (relative)",
      caption: "Higher tooth counts cut veneered plywood faces more cleanly; lower counts rip solid wood faster but tear veneer.",
      unit: "",
      bars: [["24T rip", 30], ["40T combo", 60], ["60T", 82], ["80T crosscut", 95]]
    },
    deepDive: {
      figureTitle: "Clean cuts come from blade plus support",
      figureCaption: "Tooth count, grind, support, and feed rate together decide whether a plywood edge is glass-smooth or fuzzy.",
      figureStats: [["60-80T", "Teeth for clean plywood faces"], ["1/8 in", "Typical full-kerf width"], ["ATB/Hi-ATB", "Grinds for veneer and melamine"]],
      comparisonTitle: "Blade choice by job",
      comparisonColumns: ["Blade", "Teeth", "Best for", "Weakness"],
      comparisonRows: [
        ["Rip blade", "24", "Fast ripping solid lumber", "Tears plywood veneer"],
        ["Combination", "40-50", "General-purpose mixed work", "Compromise on both ends"],
        ["Crosscut/plywood", "60-80", "Clean plywood and crosscuts", "Slower feed, more heat"],
        ["Hi-ATB melamine", "80", "Prefinished and melamine", "Specialized, dulls on solid wood"]
      ],
      faqs: [
        ["What blade gives the cleanest plywood cut?", "A 60- to 80-tooth ATB or Hi-ATB blade, with support behind the cut, gives the least splintering."],
        ["Does a thin-kerf blade change my cut list?", "Yes. It removes less material per cut, so enter its real kerf for an accurate layout."],
        ["Why does the bottom face chip out?", "The blade exits there with no support. Use a zero-clearance insert or sacrificial backer."],
        ["How do I stop melamine from chipping?", "Use a sharp Hi-ATB blade, score the cut, and keep a steady feed."]
      ],
      sources: [
        ["Forest Products Laboratory: Wood Handbook (machining)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood machining and surface quality from the USDA Forest Service."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Enter your measured blade kerf so the sheet layout matches real cuts."]
      ]
    },
    checklist: ["Use 60-80 teeth for clean plywood faces.", "Measure real kerf and put it in the cut list.", "Match grind to material: ATB for veneer.", "Support the cut to stop bottom chipout.", "Keep the blade clean and sharp."]
  },
  {
    slug: "cutting-jigs-for-accurate-sheet-goods",
    category: "CutList",
    title: "Cutting Jigs for Accurate Sheet Goods",
    description: "Build simple jigs that make plywood cuts square and repeatable: a track guide, a crosscut sled, and stop blocks that turn a cut list into matching parts.",
    kicker: "Shop technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Accuracy Comes From Jigs, Not Steady Hands", "Repeatable, square cuts on big sheets do not come from a careful hand; they come from jigs that remove the chance for error. A straight guide, a square sled, and a stop block let you reproduce the same dimension over and over. For a cut list with repeated parts, jigs are the difference between parts that assemble cleanly and parts that fight you."],
      ["A Shop-Made Track Guide", "A simple track guide is a straight piece of plywood with a fence, cut once to your saw's offset so the edge of the base marks the exact blade line. Clamp it to the layout line and the saw follows it perfectly. It turns a circular saw into a near-track-saw for breaking down full sheets safely on sawhorses before final cuts."],
      ["Crosscut Sled For Square Parts", "A crosscut sled rides the table saw miter slots and carries the workpiece past the blade with a fence that is dialed in exactly square. Once it is true, every crosscut is square without measuring the angle each time. For cabinet parts that must be square to assemble, a good sled is the most valuable jig in the shop."],
      ["Stop Blocks Make Repeats Identical", "When the cut list calls for eight identical shelves, do not measure eight times. Clamp a stop block at the right distance and cut them all to the exact same length. Stop blocks remove cumulative measuring error and guarantee that repeated parts truly match, which is what makes a carcass square and a row of drawers align."],
      ["Break Down Big, Then Cut Precise", "The safe, accurate workflow is to break a full sheet into rough oversized pieces with the track guide, then bring those manageable pieces to the table saw and sled for final, square cuts. Plan your cut list and layout around this two-stage flow so no jig is asked to handle a part it cannot control safely."]
    ],
    chart: {
      title: "Repeat cut error: measured each time vs stop block (relative)",
      caption: "Measuring each repeat lets small errors stack up; a stop block holds every part to the same length.",
      unit: "",
      bars: [["Measure each", 100], ["Pencil + line", 70], ["Tape stop", 35], ["Stop block", 10]]
    },
    deepDive: {
      figureTitle: "Two-stage cutting for safe accuracy",
      figureCaption: "Break sheets down rough with a track guide, then cut precise and square with a sled and stop block.",
      figureStats: [["1 setup", "A stop block cuts many identical parts"], ["2 stages", "Rough breakdown, then precise cuts"], ["90 deg", "A trued sled guarantees square"]],
      comparisonTitle: "Jigs and what they solve",
      comparisonColumns: ["Jig", "Solves", "Best for", "Note"],
      comparisonRows: [
        ["Track guide", "Straight long cuts", "Breaking down full sheets", "Cut once to your saw offset"],
        ["Crosscut sled", "Square crosscuts", "Cabinet parts, repeat crosscuts", "Must be tuned dead square"],
        ["Stop block", "Identical lengths", "Repeated parts", "Removes cumulative measuring error"],
        ["Zero-clearance insert", "Bottom chipout", "Clean plywood faces", "Pairs with a fine blade"]
      ],
      faqs: [
        ["Do I need a track saw for accurate cuts?", "No. A shop-made track guide plus a circular saw breaks down sheets accurately for far less money."],
        ["Why are my crosscuts not square?", "An untuned sled or miter gauge. Square the sled fence with the five-cut method before trusting it."],
        ["How do I cut eight identical shelves?", "Set a stop block and cut them all to the same stop, instead of measuring each one."],
        ["What is the safest way to break down a full sheet?", "Support it fully and make rough cuts with a track guide before precise table saw cuts."]
      ],
      sources: [
        ["OSHA: Woodworking eTool - Table Saws", "https://www.osha.gov/etools/woodworking/table-saws", "Official safety guidance for table saw operation, guarding, and safe stock handling."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan repeated parts so stop blocks turn the cut list into matching pieces."]
      ]
    },
    checklist: ["Use a track guide to break down full sheets.", "Tune a crosscut sled dead square.", "Use stop blocks for identical repeated parts.", "Work in two stages: rough then precise.", "Add a zero-clearance insert for clean faces."]
  },
  {
    slug: "track-saw-vs-table-saw-for-plywood",
    category: "CutList",
    title: "Track Saw vs Table Saw for Plywood",
    description: "Compare a track saw and a table saw for breaking down plywood: accuracy, safety, space, and cost, and why many shops end up using both.",
    kicker: "Tool comparison",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Two Tools, One Goal: Square Parts From Big Sheets", "A track saw and a table saw both turn a 4x8 sheet into accurate parts, but they solve the problem from opposite directions. A track saw brings the cut to the sheet; a table saw brings the sheet to the cut. Which one fits depends on your space, your typical project, and how you handle full sheets alone."],
      ["Where The Track Saw Wins", "A track saw shines at breaking down full sheets, especially alone or in a small space. You lay the sheet on foam or sawhorses, drop the track on the line, and cut a clean, splinter-free edge without wrestling a heavy panel across a table. For big panels and on-site work, it is safer and easier for one person."],
      ["Where The Table Saw Wins", "A table saw is faster and more repeatable for narrow rips, repeated parts, and small pieces, especially with a good fence and a sled. Once a sheet is broken down to manageable pieces, the table saw cuts them to final size quickly and consistently. For batching many identical parts, it is hard to beat."],
      ["Space, Safety, And Cost", "A track saw stores against a wall and needs little floor space; a table saw needs room to feed full sheets safely. Track saws keep your hands away from an exposed blade, while table saws demand respect, guards, and good technique. Cost varies, but a track saw plus a modest table saw often covers more than either alone."],
      ["Most Shops Use Both, In Sequence", "The common answer is not one or the other. Break full sheets down with a track saw where it is safest, then cut precise final parts on the table saw. Plan your cut list around that flow: rough oversized breakdown first, then accurate final cuts, so each tool does what it does best."]
    ],
    chart: {
      title: "Tool fit by task (relative suitability)",
      caption: "Higher is a better fit. The track saw leads at sheet breakdown; the table saw leads at repeated narrow parts.",
      unit: "",
      bars: [["Breakdown: track", 95], ["Breakdown: table", 55], ["Repeats: track", 50], ["Repeats: table", 95]]
    },
    deepDive: {
      figureTitle: "Breakdown then final cut",
      figureCaption: "The two tools are complementary: track saw for safe sheet breakdown, table saw for fast repeatable parts.",
      figureStats: [["1 person", "Track saw handles full sheets alone"], ["Repeat speed", "Table saw wins on batched parts"], ["Small footprint", "Track saw stores against a wall"]],
      comparisonTitle: "Track saw vs table saw",
      comparisonColumns: ["Factor", "Track saw", "Table saw", "Edge"],
      comparisonRows: [
        ["Full sheet breakdown", "Excellent, safe solo", "Awkward and heavy", "Track saw"],
        ["Repeated narrow rips", "Slower to set up", "Fast and repeatable", "Table saw"],
        ["Space needed", "Minimal", "Needs feed room", "Track saw"],
        ["Small parts", "Harder to control", "Easy with a sled", "Table saw"]
      ],
      faqs: [
        ["Should a beginner buy a track saw or table saw first?", "If you mostly break down sheets in a small space, start with a track saw. If you batch many small parts, a table saw earns its keep."],
        ["Can a track saw replace a table saw?", "For sheet goods, largely yes, but a table saw is still faster for repeated narrow rips and small parts."],
        ["Is a track saw safer?", "It keeps the blade enclosed and your hands clear, which many find safer for full-sheet work."],
        ["Do I need both?", "Many shops do: track saw to break down, table saw to finish. Plan the cut list around that sequence."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Official safety guidance for woodworking machinery including saws and stock handling."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan a breakdown-first layout so each saw cuts what it does best."]
      ]
    },
    checklist: ["Use a track saw to break down full sheets.", "Use a table saw for repeated narrow parts.", "Match the tool to your space and projects.", "Keep blade guards and safe technique on the table saw.", "Plan the cut list breakdown-first."]
  },
  {
    slug: "cutlist-garage-storage-cabinets-plan",
    category: "CutList",
    title: "Garage Storage Cabinets: A Plywood Cut Plan",
    description: "Plan a wall of garage storage cabinets from plywood with a repeatable box design, a sheet count you can trust, and a cut list that batches parts cleanly.",
    kicker: "Garage project",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Design One Box, Then Repeat It", "A wall of garage cabinets is easiest when every box is the same. Pick a width that divides your wall cleanly, a depth that clears the car, and a height that leaves room above. Repeating one box makes the cut list predictable, lets parts interchange, and lets the optimizer batch identical sides and shelves efficiently."],
      ["Build For The Garage, Not The Kitchen", "Garage cabinets carry tools and totes, not dishes, so they can be simpler and tougher. Use shop-grade plywood, skip fancy faces, and favor a strong back and solid shelves over thin material. A French cleat or a screwed nailer along the studs carries the load into the wall framing safely."],
      ["Adjustable Shelves Earn Their Keep", "Garage storage changes constantly, so adjustable shelves are worth it. Plan shelf-pin holes or a cleat system and cut shelves slightly under the inside width so they drop in and out. List shelves as a repeated part with a clear quantity so the cut list count is obvious."],
      ["Estimate The Sheet Count Honestly", "A full garage wall can swallow several sheets fast once sides, tops, bottoms, backs, and shelves add up. List every part with quantity and run it through the plywood cut calculator to get a real sheet count before buying a stack. Save the layout in CutList so you can adjust box width and re-check before committing."],
      ["Hang Level And Plumb", "Cabinets only look professional if they hang level. Find the high point of the floor, snap a level line, and hang to it with a temporary ledger board. Plan filler strips where the run meets a wall so the last cabinet scribes in tight instead of leaving a gap."]
    ],
    chart: {
      title: "Plywood sheets needed by cabinet run length (3/4 in)",
      caption: "Approximate full sheets for a single row of 24-inch-deep garage cabinets. Confirm with a real layout for your exact design.",
      unit: "",
      bars: [["4 ft", 2], ["8 ft", 4], ["12 ft", 6], ["16 ft", 8]]
    },
    deepDive: {
      figureTitle: "A garage wall is repeated boxes plus fillers",
      figureCaption: "Identical boxes keep the cut list simple; filler strips absorb out-of-square walls.",
      figureStats: [["1 box", "Design once and repeat"], ["French cleat", "Carries load into studs"], ["Level line", "Hang to it, not to the floor"]],
      comparisonTitle: "Garage cabinet choices",
      comparisonColumns: ["Choice", "Option A", "Option B", "When"],
      comparisonRows: [
        ["Mounting", "French cleat", "Screwed nailer", "Cleat for adjustability"],
        ["Shelves", "Adjustable pins", "Fixed dadoes", "Pins for flexibility"],
        ["Material", "Shop-grade plywood", "Prefinished plywood", "Prefinished to skip finishing"],
        ["Doors", "Open shelves", "Plywood doors", "Doors to keep dust out"]
      ],
      faqs: [
        ["How many plywood sheets for an 8-foot garage cabinet run?", "Roughly four 3/4-inch sheets for a 24-inch-deep row, but confirm with a real layout of your design."],
        ["Should garage cabinets be wall-hung or floor-standing?", "Wall-hung clears the floor for cleaning; floor-standing carries heavier loads. Many runs combine both."],
        ["What holds the weight?", "A French cleat or screwed nailer must land in the wall studs, not just the drywall."],
        ["Do I need doors?", "Doors keep dust off contents; open shelves are cheaper and faster. Choose by what you store."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Guidance on plywood grades and performance for shelving and cabinet construction."],
        ["WoodCutTool kitchen cabinet cut list template", "/templates/kitchen-cabinet-cut-list/", "A cabinet parts template you can adapt to garage box dimensions."]
      ]
    },
    checklist: ["Design one box and repeat it.", "Carry load into studs with a cleat or nailer.", "Cut adjustable shelves slightly undersized.", "Verify the sheet count before buying.", "Hang to a level line, not the floor."]
  },
  {
    slug: "cutlist-closet-system-plywood-plan",
    category: "CutList",
    title: "Plywood Closet System: Planning the Cut List",
    description: "Design a built-in plywood closet system with towers, shelves, and hanging sections, an honest sheet count, and scribe allowance for out-of-square walls.",
    kicker: "Built-in project",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Plan The Closet As Towers And Spans", "A closet system is a set of vertical plywood towers with shelves and hanging rods spanning between them. Decide tower spacing first, because it sets shelf length and rod span. Towers carry the load; shelves and rods fill the gaps. Repeating tower width keeps the cut list tidy and the parts interchangeable."],
      ["Measure, Then Subtract For Scribe", "Closet walls and floors are rarely square, so measure the opening at several points, take the smallest, and subtract scribe allowance on end panels. Plan a filler strip where the system meets the wall so the end tower scribes tight. Add those scribe and filler parts to the cut list now, not at install."],
      ["Balance Hanging, Shelves, And Drawers", "A useful closet mixes long-hang, double-hang, shelves, and maybe drawers. Each zone changes the parts: double-hang needs a mid rod, shelves need supports, drawers need boxes and slides. Decide the mix before the cut list because it drives part counts and which towers carry which loads."],
      ["Get An Honest Sheet Count", "Towers, shelves, drawer boxes, and a top can add up to several sheets. List every part with quantity and run it through the plywood cut calculator for a real count. For a build this size, save it in CutList so you can shift tower spacing and re-check the sheet count before buying."],
      ["Anchor Towers To The Wall", "Tall closet towers must be anchored to studs so they cannot tip, especially with drawers loaded. Plan a back rail or cleat that screws into framing. Cut the toe kick and leveling so the towers stand plumb on an uneven floor before they are fastened together into one system."]
    ],
    chart: {
      title: "Closet shelf sag limit by span (3/4 in plywood)",
      caption: "Relative safe load before noticeable sag drops as span grows. Add a center support or stiffening edge for long shelves.",
      unit: "",
      bars: [["24 in", 100], ["30 in", 75], ["36 in", 50], ["42 in", 30]]
    },
    deepDive: {
      figureTitle: "Towers carry load, spans fill the gaps",
      figureCaption: "Tower spacing sets shelf length and rod span, so decide it before cutting parts.",
      figureStats: [["Towers", "Carry the structural load"], ["Scribe", "Absorbs out-of-square walls"], ["Anchor", "Towers screw into studs"]],
      comparisonTitle: "Closet zone planning",
      comparisonColumns: ["Zone", "Needs", "Span note", "Parts impact"],
      comparisonRows: [
        ["Long hang", "One high rod", "Full height clear", "Fewer shelves"],
        ["Double hang", "Two rods, mid divider", "Shorter rod spans", "More dividers"],
        ["Shelves", "Supports or pins", "Watch sag past 36 in", "More shelf parts"],
        ["Drawers", "Boxes and slides", "Inside tower width", "Most parts per zone"]
      ],
      faqs: [
        ["How far can a closet shelf span without sagging?", "A 3/4-inch plywood shelf is comfortable to about 30-36 inches under clothing loads; longer needs support."],
        ["How do I fit a closet system to a crooked wall?", "Measure at several points, build to the smallest, and use scribe and filler strips at the walls."],
        ["Do closet towers need to be anchored?", "Yes. Anchor tall towers to studs so they cannot tip, especially when drawers are loaded."],
        ["How many sheets for a reach-in closet?", "Often two to four 3/4-inch sheets depending on towers and drawers; confirm with a real layout."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood panel stiffness and deflection relevant to shelf span."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan towers, shelves, and drawer parts into a real sheet count."]
      ]
    },
    checklist: ["Set tower spacing before sizing shelves.", "Add scribe and filler from real measurements.", "Plan hang, shelf, and drawer zones up front.", "Keep shelf spans under the sag limit.", "Anchor tall towers to wall studs."]
  },
  {
    slug: "cutlist-entertainment-center-plan",
    category: "CutList",
    title: "Plywood Entertainment Center: Cut List and Layout",
    description: "Plan a media center from plywood with cable management, ventilation, adjustable component shelves, and a sheet layout that keeps the grain consistent.",
    kicker: "Furniture build",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Start From The Gear And The TV", "An entertainment center is sized by what it holds: the TV width, the components, and the speakers. Measure those first, then design the openings around them with clearance. A media unit that looks right but cannot fit the receiver or vent the gear has failed at its one job, so plan equipment space before panel sizes."],
      ["Plan Ventilation And Cable Paths", "Electronics make heat, so component bays need airflow and cable openings. Plan vent gaps or grilles and cut access holes in the back panels for cables before assembly. Adding ventilation and cable management to the cut list now is far easier than drilling a finished cabinet later."],
      ["Adjustable Shelves For Changing Gear", "Components change, so adjustable shelves in the component bays keep the unit useful. Plan shelf-pin holes and cut shelves slightly under the bay width. Fixed shelves can stiffen the carcass where you need structure, while adjustable ones flex around future devices."],
      ["Keep The Grain Consistent", "A media center is a visible piece, so grain direction matters. Lock the grain on the visible top, sides, and front-facing shelves so the finished unit reads as one piece, then let hidden parts rotate to fill the sheet. Run it through the plywood cut calculator with grain locked on the show faces."],
      ["Confirm It Fits The Room And The Door", "A large media unit must get into the room. If it will not fit through doorways assembled, plan it as modular boxes that bolt together on site. Cut the parts so the heavy panels carry the load and the connectors only align the modules."]
    ],
    chart: {
      title: "Component bay clearance to plan (inches)",
      caption: "Typical minimum clearances to design around so gear fits and vents. Confirm against your actual equipment.",
      unit: " in",
      bars: [["Cable gap", 3], ["Vent gap", 2], ["Receiver height", 7], ["Console depth", 16]]
    },
    deepDive: {
      figureTitle: "Design openings around the gear",
      figureCaption: "Measure equipment first, then build bays with clearance for heat and cables.",
      figureStats: [["Measure first", "TV, receiver, speakers, console"], ["Vent + cable", "Plan airflow and access holes"], ["Lock grain", "On visible top, sides, shelves"]],
      comparisonTitle: "Media center decisions",
      comparisonColumns: ["Element", "Option A", "Option B", "When"],
      comparisonRows: [
        ["Construction", "One large unit", "Modular boxes", "Modular if doorways are tight"],
        ["Component shelves", "Adjustable pins", "Fixed shelves", "Pins for changing gear"],
        ["Ventilation", "Open back gaps", "Cut vent grilles", "Grilles for closed cabinets"],
        ["Back panel", "Full back", "Cable-access cutouts", "Cutouts behind gear"]
      ],
      faqs: [
        ["How much ventilation does a media cabinet need?", "Leave gaps or grilles so heat escapes; closed bays full of electronics can overheat without airflow."],
        ["Should component shelves be adjustable?", "Yes, because gear changes. Adjustable shelves keep the unit useful for years."],
        ["How do I hide the cables?", "Cut cable-access holes in the back panels and plan a channel before assembly."],
        ["What if it will not fit through the door?", "Build it as modular boxes that bolt together in the room."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Plywood grade and performance guidance for visible furniture panels."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Lock grain on show faces and confirm the sheet layout."]
      ]
    },
    checklist: ["Measure the TV and gear before sizing.", "Plan ventilation and cable openings.", "Use adjustable shelves in component bays.", "Lock grain on visible faces.", "Go modular if doorways are tight."]
  },
  {
    slug: "cutlist-kids-desk-plywood-plan",
    category: "CutList",
    title: "Kids Desk from Plywood: Simple Cut List",
    description: "Build a sturdy, safe kids desk from a single plywood sheet, with rounded edges, the right height, a cable-free design, and an easy beginner cut list.",
    kicker: "Weekend project",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Size The Desk To The Child", "A kids desk should fit the child, not a generic dimension. A comfortable desk height lets feet rest flat and elbows sit near 90 degrees. Because children grow, plan a height that works now and consider adjustable or replaceable legs. Start from the child's seated measurements, then size the top and legs."],
      ["A One-Sheet Beginner Build", "A simple kids desk is a top, two side panels or legs, an apron for stiffness, and maybe a lower shelf, all of which fit on a single plywood sheet. Keeping it to one sheet makes it a perfect first furniture build and an easy cut list to lay out and check before cutting."],
      ["Round The Edges For Safety", "Sharp plywood corners and edges are a hazard at kid height. Plan to round the corners and ease all edges, and sand the faces smooth. Soften any corner a child could run into. These are finishing steps, but they belong in the plan because they affect how you cut and handle the parts."],
      ["Finish It To Be Cleanable And Safe", "Kids desks get marker, glue, and spills, so finish with a durable, low-odor, child-safe finish that wipes clean. Seal the plywood edges so they do not absorb moisture. Choose a finish rated as safe once cured, and let it cure fully before the desk goes into use."],
      ["Lay It Out And Cut Clean", "Run the parts through the plywood cut calculator to confirm everything fits on one sheet with your kerf. Lock the grain on the visible top, cut the big parts first, and ease the edges before assembly. A clean, well-eased desk is safer and looks far more finished."]
    ],
    chart: {
      title: "Desk and chair height by child age (approx, inches)",
      caption: "Approximate ergonomic desk-top heights by age as a starting point. Fit to the individual child for best comfort.",
      unit: " in",
      bars: [["Age 4-5", 20], ["Age 6-8", 22], ["Age 9-11", 24], ["Age 12+", 26]]
    },
    deepDive: {
      figureTitle: "Fit the desk to the child",
      figureCaption: "Feet flat, elbows near ninety degrees. Size from the child, not a generic number.",
      figureStats: [["1 sheet", "A kids desk fits on one panel"], ["Eased edges", "Round every corner a child meets"], ["Safe finish", "Wipe-clean and low odor"]],
      comparisonTitle: "Kids desk choices",
      comparisonColumns: ["Choice", "Option A", "Option B", "When"],
      comparisonRows: [
        ["Legs", "Panel sides", "Square legs", "Panels are simpler for beginners"],
        ["Height", "Fixed to current size", "Adjustable", "Adjustable lasts longer"],
        ["Edges", "Eased and rounded", "Edge-banded", "Round for safety either way"],
        ["Finish", "Wipe-clean topcoat", "Painted", "Both must be child-safe when cured"]
      ],
      faqs: [
        ["What height should a kids desk be?", "Set it so the child's feet rest flat and elbows sit near 90 degrees; this rises with age."],
        ["Can I build a kids desk from one sheet?", "Yes. A top, sides, apron, and a shelf fit easily on a single plywood sheet."],
        ["How do I make it safe?", "Round corners, ease all edges, sand smooth, and use a child-safe finish that cures hard."],
        ["What finish is safe for kids?", "Choose a durable, low-odor finish rated safe once fully cured, and let it cure before use."]
      ],
      sources: [
        ["CPSC: U.S. Consumer Product Safety Commission", "https://www.cpsc.gov/", "Federal agency for consumer product safety, including childrens furniture guidance."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Confirm the desk parts fit on a single sheet with your kerf."]
      ]
    },
    checklist: ["Size the desk to the child, feet flat.", "Keep the build to a single sheet.", "Round corners and ease every edge.", "Use a child-safe, wipe-clean finish.", "Lock grain on the visible top."]
  },
  {
    slug: "cutlist-outdoor-bench-plywood-marine",
    category: "CutList",
    title: "Outdoor Bench: Plywood Choice and Cut List",
    description: "Build an outdoor bench that lasts: marine or exterior plywood, sealed edges, drainage and slope, and a cut list that survives weather.",
    kicker: "Outdoor project",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Outdoor Means Exterior-Rated Plywood", "An outdoor bench fails fast if built from interior plywood, because the glue and core are not made for moisture. Use exterior-grade or marine plywood with waterproof glue. Marine plywood adds a void-free core that resists rot and holds up to weather, which matters for a bench that sits outside year round."],
      ["Seal Every Edge And Face", "Water attacks plywood at the edges first. Seal every cut edge and all faces with an exterior finish, and re-coat as needed. Edges are end grain in the veneers and soak up water, so a bench that is sealed only on the faces will still delaminate from the edges. Plan edge sealing as a required step, not optional."],
      ["Design For Drainage And Slope", "Standing water rots even good plywood. Slope the seat slightly so water runs off, leave small gaps for drainage where parts meet, and keep the bench off the ground on feet so the base does not wick moisture. These details belong in the plan because they change how parts meet and how the bench sits."],
      ["Fasteners And Glue Must Be Exterior Too", "Exterior plywood with interior screws still fails, because the fasteners rust and the glue lets go. Use corrosion-resistant screws and a waterproof adhesive rated for exterior use. Match every part of the assembly to the outdoor environment, not just the plywood."],
      ["Lay Out To Minimize Exposed Edges", "Because edges are the weak point, lay out the bench so visible edges are minimized and easy to seal. Run the parts through the plywood cut calculator, keep the grain consistent on the seat, and plan generous sealing time. A bench built and sealed well outlasts one built from better wood but finished carelessly."]
    ],
    chart: {
      title: "Relative outdoor durability by plywood type",
      caption: "Relative resistance to moisture and delamination. Interior plywood is unsuitable outdoors regardless of finish.",
      unit: "",
      bars: [["Interior", 15], ["Exterior CDX", 55], ["Pressure-treated", 80], ["Marine", 100]]
    },
    deepDive: {
      figureTitle: "Edges and water decide outdoor life",
      figureCaption: "Exterior-rated plywood, sealed edges, drainage, and corrosion-resistant hardware together make a bench last.",
      figureStats: [["Exterior glue", "Required for outdoor use"], ["Seal edges", "End grain soaks water first"], ["Slope + gaps", "Shed standing water"]],
      comparisonTitle: "Outdoor plywood choices",
      comparisonColumns: ["Type", "Moisture resistance", "Cost", "Best use"],
      comparisonRows: [
        ["Interior plywood", "Poor", "Low", "Indoors only"],
        ["Exterior CDX", "Good with sealing", "Moderate", "Painted outdoor parts"],
        ["Pressure-treated", "Very good", "Moderate", "Ground-contact bases"],
        ["Marine plywood", "Excellent, void-free", "High", "Seats and visible parts"]
      ],
      faqs: [
        ["Can I use regular plywood outdoors if I seal it?", "No. Interior glue fails with moisture. Use exterior or marine plywood and still seal it."],
        ["Why seal the edges specifically?", "Plywood edges are end grain in the veneers and absorb water fastest, causing delamination."],
        ["Does the bench need drainage?", "Yes. Slope the seat and leave small gaps so water runs off instead of pooling."],
        ["What fasteners should I use outside?", "Corrosion-resistant screws and a waterproof exterior adhesive, to match the plywood."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (durability)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood and panel durability, moisture, and decay resistance."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Lay out the bench to minimize and seal exposed edges."]
      ]
    },
    checklist: ["Use exterior or marine plywood only.", "Seal every cut edge and face.", "Slope the seat and leave drainage gaps.", "Use corrosion-resistant screws and exterior glue.", "Lay out to minimize exposed edges."]
  },
  {
    slug: "edge-banding-plywood-guide",
    category: "CutList",
    title: "Edge Banding Plywood: A Practical Guide",
    description: "Hide plywood edges cleanly with iron-on, peel-and-stick, or solid wood edging, plus how edge treatment changes your cut list dimensions.",
    kicker: "Finishing technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Why Plywood Edges Need Covering", "A raw plywood edge shows its layered plies and voids, which looks unfinished and chips easily. Edge banding or a solid edge hides the plies, gives a durable surface to handle, and lets the part take a finish evenly. On any visible cabinet or shelf, edge treatment is the difference between a shop-made look and a polished one."],
      ["Iron-On Veneer Banding", "Iron-on edge banding is a thin wood veneer with heat-activated glue. You iron it onto the edge, trim the overhang flush, and sand lightly. It is fast, cheap, and matches common species, making it the go-to for cabinet interiors and shelves. It is thin, so it adds almost nothing to the part size but offers little protection against hard knocks."],
      ["Solid Wood Edging For Durability", "A solid wood edge, glued on as a strip, is tougher and can be shaped or rounded. It protects high-wear edges like shelf fronts and tabletops far better than veneer. But it adds real thickness, so the plywood part must be cut narrower to keep the finished dimension correct. That allowance belongs in the cut list."],
      ["Edge Treatment Changes Your Cut Sizes", "This is the detail beginners miss: a 1/4-inch solid edge on a 12-inch shelf means cutting the plywood to 11-3/4 inches so the finished part is 12. Veneer banding is thin enough to ignore, but solid edging must be subtracted before cutting. Decide the edge treatment before you finalize the cut list, not after."],
      ["Apply Before Or After Assembly?", "Band edges before assembly when the edge will be hard to reach later, and after assembly when continuous banding should wrap a corner. Plan the sequence with the cut list so you are not trying to iron banding into a tight assembled corner. A little planning here saves a lot of fiddly rework."]
    ],
    chart: {
      title: "Edge band thickness to subtract from part size (inches)",
      caption: "Veneer banding is thin enough to ignore; solid edging must be subtracted from the plywood part before cutting.",
      unit: "",
      bars: [["Iron-on veneer", 0.02], ["Peel-and-stick", 0.03], ["1/8 solid", 0.125], ["1/4 solid", 0.25]]
    },
    deepDive: {
      figureTitle: "Edge choice changes the cut",
      figureCaption: "Solid edging adds thickness, so cut the plywood narrower to keep the finished size right.",
      figureStats: [["Veneer", "Thin, fast, species match"], ["Solid edge", "Durable, shapeable, thicker"], ["Subtract", "Solid edge from part width"]],
      comparisonTitle: "Edge treatment options",
      comparisonColumns: ["Method", "Durability", "Adds thickness", "Best for"],
      comparisonRows: [
        ["Iron-on veneer", "Low", "Negligible", "Cabinet interiors, shelves"],
        ["Peel-and-stick", "Low", "Negligible", "Quick low-wear edges"],
        ["Solid edge strip", "High", "1/8 to 1/4 in", "Tabletops, shelf fronts"],
        ["Profiled solid edge", "High", "Varies", "Decorative or rounded edges"]
      ],
      faqs: [
        ["Does edge banding change my cut list?", "Solid edging does: subtract its thickness from the plywood part. Thin veneer banding can be ignored."],
        ["Which edge banding is most durable?", "A glued solid wood edge is the toughest and can be shaped; veneer banding is thinner and less protective."],
        ["Do I band before or after assembly?", "Band hard-to-reach edges before assembly; band wrap-around edges after."],
        ["How do I trim iron-on banding flush?", "Use an edge-banding trimmer or a sharp chisel, then sand lightly without cutting through the veneer."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Plywood construction reference covering panel edges and veneers."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Subtract solid edging from part sizes so finished dimensions stay correct."]
      ]
    },
    checklist: ["Cover raw edges on visible parts.", "Use veneer banding for fast interior edges.", "Use solid edging for high-wear surfaces.", "Subtract solid edge thickness before cutting.", "Plan banding sequence with assembly."]
  },
  {
    slug: "wood-joints-for-plywood-projects",
    category: "CutList",
    title: "Wood Joints for Plywood Projects",
    description: "Pick the right joint for plywood cabinets and boxes: dado, rabbet, pocket screw, dowel, or domino, and how each one affects part sizes in the cut list.",
    kicker: "Joinery guide",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Plywood Joins Differently Than Solid Wood", "Plywood is stable and has no seasonal movement, but its edges are layered and its faces are thin veneer, so some solid-wood joints do not apply. The best plywood joints register parts square, give good glue surface, and capture panels in grooves. Choosing the joint early matters because most joints change the size you cut the parts."],
      ["Dado And Rabbet: Strong And Self-Aligning", "A dado is a groove across a panel that captures a shelf; a rabbet is a step at an edge that captures a back or side. Both add glue surface, register parts square, and carry load well, which is why they are cabinet staples. They also require cutting parts slightly longer to seat into the groove, an allowance the cut list must include."],
      ["Pocket Screws: Fast And Knockdown-Friendly", "Pocket-hole screws join plywood quickly with no groove cutting and can be disassembled, which suits face frames, cabinet boxes, and built-ins that must be fitted on site. They do not add glue-surface strength like a dado, but for many cabinets they are plenty strong and far faster. Parts are cut to net size, which keeps the cut list simple."],
      ["Dowels And Dominoes For Alignment", "Dowels and loose-tenon joints register parts precisely and add strength without showing fasteners, useful for furniture and visible joints. They require accurate hole or mortise placement but do not change overall part dimensions much. They sit between the speed of pocket screws and the strength of a dado."],
      ["Let The Joint Set The Cut Size", "The key planning step is to choose the joint before finalizing dimensions, because captured joints change part lengths. A shelf seated in a 1/4-inch dado on each side must be cut 1/2 inch longer than the clear opening. Decide joinery first, then enter the correct allowances into the cut list so parts seat properly."]
    ],
    chart: {
      title: "Joint strength vs build speed (relative)",
      caption: "Relative trade-off. Captured joints like dadoes are strong but slower; pocket screws are fast and knockdown-friendly.",
      unit: "",
      bars: [["Pocket screw", 55], ["Dowel", 65], ["Domino", 80], ["Dado/rabbet", 95]]
    },
    deepDive: {
      figureTitle: "The joint changes the cut size",
      figureCaption: "Captured joints add length; butt and pocket joints are cut to net size. Decide before cutting.",
      figureStats: [["Dado", "Strong, self-aligning, +length"], ["Pocket screw", "Fast, knockdown, net size"], ["Domino", "Strong and aligned, hidden"]],
      comparisonTitle: "Plywood joint options",
      comparisonColumns: ["Joint", "Strength", "Speed", "Cut size impact"],
      comparisonRows: [
        ["Dado / rabbet", "High", "Slower", "Add groove depth to length"],
        ["Pocket screw", "Moderate", "Fast", "Cut to net size"],
        ["Dowel", "Moderate", "Moderate", "Little change"],
        ["Domino / loose tenon", "High", "Moderate", "Little change"]
      ],
      faqs: [
        ["What is the strongest joint for plywood cabinets?", "A glued dado or rabbet is very strong and self-aligning; dominoes are also strong for furniture."],
        ["Do joints change my part sizes?", "Captured joints like dadoes do: add the groove depth to the part length. Pocket screws use net sizes."],
        ["Are pocket screws strong enough for cabinets?", "For many cabinet boxes, yes, and they assemble fast and can be taken apart."],
        ["Which joint is best for a beginner?", "Pocket screws or rabbets are forgiving and need minimal specialized tooling."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (fastenings)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference chapter on wood joints, fasteners, and adhesive bonding."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Add joinery allowances so captured parts seat to the right finished size."]
      ]
    },
    checklist: ["Choose the joint before final dimensions.", "Use dadoes and rabbets for strong carcasses.", "Use pocket screws for fast knockdown builds.", "Add groove depth to captured part lengths.", "Match joint complexity to your tools."]
  },
  {
    slug: "finishing-plywood-for-a-smooth-result",
    category: "CutList",
    title: "Finishing Plywood for a Smooth Result",
    description: "Get a smooth, durable finish on plywood: sanding the thin veneer safely, sealing porous edges, and choosing a finish that suits the project.",
    kicker: "Finishing technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Respect The Thin Veneer", "Plywood's show face is a thin veneer, often well under 1/32 inch, so aggressive sanding cuts straight through it and ruins the panel. Sand lightly with progressively finer grits and stop early. The goal is to smooth the surface, not reshape it. Sanding through the veneer is the most common and most permanent finishing mistake."],
      ["Seal The Porous Edges", "Plywood edges are end grain in every veneer layer, so they drink finish and look blotchy if treated like the face. Seal edges first with a thinned sealer or edge banding, then finish. Sealing edges evens out absorption and stops the dark, rough edge that gives away an unfinished plywood project."],
      ["Choose The Finish For The Job", "A wipe-on oil is forgiving and easy for beginners; a film finish like polyurethane is more durable for tabletops and high-wear surfaces; a quality water-based finish dries fast and stays clear. Match the finish to wear and look. There is no single best finish, only the right one for the part and the skill level."],
      ["Control Blotch On Soft Species", "Some plywood faces, like birch or pine, blotch when stained because the veneer absorbs unevenly. A wash coat or conditioner before staining evens absorption. Testing the finish on an offcut of the same sheet is the cheapest insurance against a blotchy surprise on the finished piece."],
      ["Plan Finishing Into The Build", "Finishing is easier on flat parts before assembly, especially insides and shelves. Plan which parts to finish first, mask glue surfaces, and keep an offcut from the same sheet for testing. Building finishing into the plan, rather than treating it as an afterthought, produces a far smoother and more even result."]
    ],
    chart: {
      title: "Sanding grit sequence for plywood faces",
      caption: "Step up through grits and stop early on plywood. Over-sanding the thin veneer cuts through it permanently.",
      unit: "",
      bars: [["120", 120], ["150", 150], ["180", 180], ["220 stop", 220]]
    },
    deepDive: {
      figureTitle: "Smooth comes from light sanding and sealed edges",
      figureCaption: "Sand lightly, seal the porous edges, test on scrap, and choose a finish that matches the wear.",
      figureStats: [["<1/32 in", "Typical face veneer thickness"], ["Seal edges", "End grain drinks finish"], ["Test scrap", "Same sheet, before the part"]],
      comparisonTitle: "Finish options for plywood",
      comparisonColumns: ["Finish", "Durability", "Ease", "Best for"],
      comparisonRows: [
        ["Wipe-on oil", "Moderate", "Easy", "Beginners, low-wear parts"],
        ["Polyurethane", "High", "Moderate", "Tabletops, high wear"],
        ["Water-based clear", "High", "Moderate", "Fast, clear, low odor"],
        ["Paint", "High", "Easy", "MDF and hiding grain"]
      ],
      faqs: [
        ["Why did I sand through my plywood?", "The show veneer is very thin. Sand lightly with fine grits and stop early; do not power-sand aggressively."],
        ["How do I finish plywood edges?", "Seal them first because end grain absorbs finish unevenly, or cover them with edge banding."],
        ["What finish is easiest for beginners?", "A wipe-on oil is forgiving and hard to mess up; build coats slowly."],
        ["Why does my plywood blotch when stained?", "Soft veneers absorb unevenly. Use a conditioner or wash coat and test on an offcut first."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (finishing)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood finishing, surface preparation, and coatings."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan parts and keep an offcut from the same sheet for finish testing."]
      ]
    },
    checklist: ["Sand lightly and stop before the veneer thins.", "Seal porous edges before finishing.", "Match the finish to wear and skill.", "Use a conditioner on blotch-prone faces.", "Test the finish on a same-sheet offcut."]
  },
  {
    slug: "hardwood-vs-softwood-for-woodworking",
    category: "CutList",
    title: "Hardwood vs Softwood for Woodworking",
    description: "Understand hardwood and softwood: what the terms really mean, how each works and finishes, and how to choose for furniture, shelving, and structure.",
    kicker: "Material guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["The Names Do Not Mean What You Think", "Hardwood and softwood are botanical categories, not hardness ratings. Hardwoods come from broadleaf trees like oak and maple; softwoods from conifers like pine and fir. Some softwoods are harder to dent than some hardwoods. Knowing this prevents the common mistake of assuming softwood is always weak or hardwood is always best."],
      ["Hardness Is Measured, Not Assumed", "Actual surface hardness is measured by tests like the Janka scale, which rates resistance to denting. Maple and oak rate high and resist dents, while pine rates low and marks easily. For a tabletop or floor that takes abuse, the hardness number matters more than the hardwood or softwood label."],
      ["Working And Finishing Differences", "Softwoods are generally lighter, cheaper, and easier to cut and nail, which suits framing, shelving, and paint-grade work. Hardwoods are denser, hold detail and edges better, and finish to a richer look, which suits furniture and visible pieces. Hardwoods cost more and dull blades faster, so match the species to the job and budget."],
      ["Cost And Availability", "Softwood lumber is widely available and inexpensive at any home center, while hardwoods often come from specialty suppliers and cost considerably more. For utility projects, softwood keeps the budget sane; for heirloom furniture, hardwood earns its cost. Plan species against the project's purpose and lifespan before buying."],
      ["Match Species To The Part", "Like sheet goods, the smart move is to match species to the part: softwood for hidden structure and paint-grade parts, hardwood for visible furniture surfaces that must wear well and look rich. Plan board feet and cost per species in the cut list so you spend on hardwood only where it shows and works hard."]
    ],
    chart: {
      title: "Janka hardness by species (lbf, approx)",
      caption: "Approximate Janka hardness ratings. Note that some softwoods like Douglas fir outrank softer hardwoods.",
      unit: "",
      bars: [["Pine", 420], ["Douglas fir", 660], ["Cherry", 950], ["Oak", 1290], ["Maple", 1450]]
    },
    deepDive: {
      figureTitle: "Hardness is measured, not assumed",
      figureCaption: "The hardwood and softwood labels are botanical. For denting resistance, look at the Janka number.",
      figureStats: [["Janka", "Measures dent resistance"], ["Softwood", "Lighter, cheaper, easy to work"], ["Hardwood", "Denser, richer, holds edges"]],
      comparisonTitle: "Hardwood vs softwood",
      comparisonColumns: ["Factor", "Softwood", "Hardwood", "Note"],
      comparisonRows: [
        ["Typical species", "Pine, fir, cedar", "Oak, maple, cherry", "Botanical categories"],
        ["Cost", "Low, widely available", "Higher, specialty suppliers", "Budget driver"],
        ["Working", "Easy to cut and nail", "Denser, dulls blades", "Sharper tools for hardwood"],
        ["Best use", "Structure, paint-grade", "Furniture, visible wear", "Match to the part"]
      ],
      faqs: [
        ["Is hardwood always harder than softwood?", "No. The terms are botanical. Some softwoods resist denting better than some hardwoods; check the Janka rating."],
        ["When should I use softwood?", "For framing, utility shelving, and paint-grade parts where cost and ease matter more than hardness."],
        ["When is hardwood worth the cost?", "For furniture and visible surfaces that must wear well and finish to a rich look."],
        ["How do I compare hardness?", "Use the Janka hardness scale, which rates resistance to denting in pounds-force."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood species properties including hardness and strength."],
        ["WoodCutTool board foot calculator", "/board-foot-calculator/", "Estimate board feet and cost per species so you spend where it counts."]
      ]
    },
    checklist: ["Remember the labels are botanical, not hardness.", "Use the Janka scale to compare denting.", "Use softwood for structure and paint-grade.", "Use hardwood for visible, high-wear surfaces.", "Estimate cost per species before buying."]
  },
  {
    slug: "wood-movement-and-why-plywood-is-stable",
    category: "CutList",
    title: "Wood Movement, and Why Plywood Is Stable",
    description: "Understand seasonal wood movement, why solid wood expands and contracts, and why plywood stays flat, so you design joints that do not crack or jam.",
    kicker: "Material science",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Wood Moves With Humidity", "Solid wood takes on and gives off moisture with the seasons, expanding in humid months and shrinking in dry ones. This movement is real and unstoppable, and ignoring it cracks tabletops, splits panels, and jams drawers. Designing for movement, not against it, is one of the marks of work that lasts through the seasons."],
      ["Movement Is Mostly Across The Grain", "Wood moves very little along its length but noticeably across its width. A wide solid panel can change width by a measurable amount between summer and winter, while its length stays nearly constant. That is why solid-wood designs must let wide panels expand and contract across the grain rather than pinning them rigidly."],
      ["Why Plywood Stays Flat", "Plywood is built from thin veneers glued with their grain alternating at right angles. Each layer restrains the next, so the panel barely moves and stays flat. This dimensional stability is the main reason plywood is the default for cabinet carcasses, large panels, and anything that must keep its size across seasons."],
      ["Design Solid And Sheet Goods Differently", "Because plywood is stable and solid wood moves, they need different joinery. A solid-wood panel floats in a frame so it can move; a plywood panel can be glued in solidly because it will not. Mixing them, such as a solid edge on a plywood top, requires letting the solid part move or keeping it short enough not to matter."],
      ["Plan For Stability In The Cut List", "Stability affects how tight you can cut. Plywood parts can be cut to exact size and trusted to stay there; solid-wood parts in humid or dry extremes may need a clearance allowance. Knowing which material moves lets you plan drawer gaps, panel grooves, and tight fits that still work when the seasons change."]
    ],
    chart: {
      title: "Seasonal movement: plywood vs solid wood (relative)",
      caption: "Relative dimensional change across the grain over a season. Plywood barely moves; solid wood moves with width.",
      unit: "",
      bars: [["Plywood", 5], ["Narrow board", 35], ["Wide oak panel", 85], ["Wide flatsawn", 100]]
    },
    deepDive: {
      figureTitle: "Cross-grain movement is the issue",
      figureCaption: "Solid wood moves across its width with humidity; plywood's cross-laminated plies keep it flat.",
      figureStats: [["Across grain", "Where movement happens"], ["Plywood", "Cross-laminated and stable"], ["Float panels", "Let solid wood move"]],
      comparisonTitle: "Movement by material",
      comparisonColumns: ["Material", "Movement", "Design rule", "Best use"],
      comparisonRows: [
        ["Plywood", "Minimal", "Can be glued solidly", "Carcasses, large panels"],
        ["Narrow solid", "Small", "Modest allowance", "Frames, edges"],
        ["Wide solid panel", "Significant", "Must float to move", "Tabletops, raised panels"],
        ["MDF", "Minimal but swells wet", "Keep dry", "Painted flat parts"]
      ],
      faqs: [
        ["Does plywood expand and contract?", "Very little. Its cross-laminated veneers restrain movement, which is why it stays flat and stable."],
        ["Which way does solid wood move?", "Mostly across the grain (width), not along its length."],
        ["How do I stop a solid panel from cracking?", "Let it float in a frame or groove so it can expand and contract instead of being pinned."],
        ["Can I glue a plywood panel in solidly?", "Yes, because it barely moves. Solid-wood panels need room to move."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (moisture and movement)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood moisture relations and dimensional change."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Cut stable plywood parts to exact size with confidence."]
      ]
    },
    checklist: ["Expect solid wood to move with humidity.", "Remember movement is mostly across the grain.", "Use plywood where flatness must hold.", "Float solid panels so they can move.", "Cut plywood parts to exact size."]
  },
  {
    slug: "stair-code-basics-rise-run-headroom",
    category: "Stairs",
    title: "Stair Code Basics: Rise, Run, and Headroom",
    description: "Understand the stair dimensions that codes regulate: riser height, tread depth, headroom, and the 7-11 rule, so your stairs are safe and pass inspection.",
    kicker: "Stair safety",
    readTime: "9 min",
    accent: "stairs",
    sections: [
      ["Why Stair Dimensions Are Regulated", "Stairs are one of the most common places people get hurt at home, so building codes regulate their key dimensions tightly. Riser height, tread depth, headroom, and consistency are not style choices; they are safety rules. Always check your local code or building department for the exact figures, because they vary by jurisdiction and edition."],
      ["Riser Height And Tread Depth", "Codes set a maximum riser height and a minimum tread depth so each step is comfortable and predictable. The widely referenced residential figures are around a 7-3/4 inch maximum riser and a 10 inch minimum tread, often summarized as the 7-11 guideline. These numbers keep the step rhythm safe; confirm the exact limits with your local authority."],
      ["Consistency Is A Code Rule, Not A Preference", "Codes require risers and treads in a flight to be uniform within a small tolerance, often about 3/8 inch between the largest and smallest. Inconsistent steps cause trips because the foot expects the same rhythm each time. This is why careful layout and a template matter: one odd step is both a hazard and a code failure."],
      ["Headroom And Width", "Codes also set minimum headroom above the stairs, commonly around 6 feet 8 inches measured vertically from the tread nosing, and a minimum stair width. Headroom is easy to miss when planning an opening, so check it early. A staircase that fits the floor but lacks headroom forces an expensive redesign."],
      ["Plan The Layout, Then Verify Locally", "Work out total rise, the number of risers, the riser height, and the tread depth before cutting, then verify every figure against your local code. Use the stair stringer calculator to find consistent riser and tread dimensions and the stringer length, and treat the result as a starting point to confirm with your building department."]
    ],
    chart: {
      title: "Common residential stair limits (inches)",
      caption: "Widely referenced residential figures. These vary by jurisdiction and code edition; confirm with your local authority.",
      unit: " in",
      bars: [["Max riser", 7.75], ["Min tread", 10], ["Riser tolerance", 0.375], ["Min headroom", 80]]
    },
    deepDive: {
      figureTitle: "The numbers that keep stairs safe",
      figureCaption: "Riser height, tread depth, consistency, and headroom are the regulated dimensions to plan around.",
      figureStats: [["~7-11", "Common max riser, min tread guide"], ["3/8 in", "Typical riser consistency tolerance"], ["6 ft 8 in", "Common minimum headroom"]],
      comparisonTitle: "Regulated stair dimensions",
      comparisonColumns: ["Dimension", "Typical residential limit", "Why", "Note"],
      comparisonRows: [
        ["Riser height", "About 7-3/4 in max", "Comfortable, safe step", "Confirm locally"],
        ["Tread depth", "About 10 in min", "Room for the foot", "Confirm locally"],
        ["Consistency", "About 3/8 in tolerance", "Prevents trips", "Within one flight"],
        ["Headroom", "About 6 ft 8 in min", "Clearance overhead", "Measure from nosing"]
      ],
      faqs: [
        ["What is the 7-11 rule for stairs?", "A common guideline of about a 7-3/4 inch maximum riser and 10 inch minimum tread for comfortable, safe stairs. Confirm your local code."],
        ["How consistent do stairs have to be?", "Codes typically require risers and treads uniform within about 3/8 inch across a flight."],
        ["How much headroom do stairs need?", "Commonly about 6 feet 8 inches measured vertically from the tread nosing; check your local code."],
        ["Do stair codes vary by location?", "Yes. Always verify exact figures with your local building department before building."]
      ],
      sources: [
        ["CPSC: U.S. Consumer Product Safety Commission - stairs", "https://www.cpsc.gov/", "Federal consumer safety agency; stairs are a leading source of home injuries."],
        ["WoodCutTool stair stringer calculator", "/stair-stringer-calculator/", "Find consistent riser and tread dimensions, then confirm against local code."]
      ]
    },
    checklist: ["Check local code for exact figures.", "Keep risers at or under the max.", "Keep treads at or over the minimum.", "Hold risers consistent within tolerance.", "Verify headroom early in planning."]
  },
  {
    slug: "deck-stairs-building-and-stringer-layout",
    category: "Stairs",
    title: "Deck Stairs: Building and Stringer Layout",
    description: "Plan and lay out deck stairs: measuring total rise to grade, stringer spacing, attachment, and footings, so outdoor stairs are safe and solid.",
    kicker: "Outdoor stairs",
    readTime: "9 min",
    accent: "stairs",
    sections: [
      ["Measure Total Rise To The Ground", "Deck stairs start with an accurate total rise from the deck surface down to the landing grade. Outdoor ground is uneven, so measure to where the bottom step will actually land, accounting for a solid landing pad. An error here throws off every riser, so take the measurement carefully and account for the landing surface."],
      ["A Solid Landing Matters", "Deck stairs need a stable, level landing at the bottom, not bare dirt that settles and shifts. A concrete pad, pavers, or a gravel base keeps the bottom step at a consistent height and stops the stairs from sinking. Plan the landing before computing rise, because the landing height is part of the total rise."],
      ["Stringer Spacing And Material", "Outdoor stringers carry weather and load, so use pressure-treated lumber and space them closer than you might indoors to keep treads from flexing. Wide deck stairs need a third, mid-span stringer. Decide stringer count before cutting, because it sets how many identical notched boards you produce."],
      ["Attach The Stairs Securely", "Deck stairs must connect firmly to the deck frame at the top and rest on a stable base at the bottom, with proper hangers or hardware rated for outdoor use. A staircase that is merely leaned against the deck is dangerous. Plan the top attachment and bottom anchoring as part of the build, not an afterthought."],
      ["Lay Out One Stringer As A Template", "Compute riser height and tread depth, cut and check a single stringer against the actual rise to grade, then use it as a template for the rest so every stringer matches. Use the stair stringer calculator to work out consistent dimensions and stringer length, then confirm the first board on site before cutting the others."]
    ],
    chart: {
      title: "Deck stair stringers by stair width (count)",
      caption: "Approximate stringer count by stair width to limit tread flex. Closer spacing for thinner treads or heavy use.",
      unit: "",
      bars: [["36 in", 3], ["48 in", 3], ["60 in", 4], ["72 in", 5]]
    },
    deepDive: {
      figureTitle: "Rise to grade plus a solid landing",
      figureCaption: "Measure total rise to a stable landing, space stringers to limit flex, and anchor top and bottom.",
      figureStats: [["To grade", "Measure rise to the real landing"], ["PT lumber", "Pressure-treated for outdoors"], ["Anchor both", "Top to frame, bottom to pad"]],
      comparisonTitle: "Deck stair landing options",
      comparisonColumns: ["Landing", "Stability", "Cost", "When"],
      comparisonRows: [
        ["Bare grade", "Poor, shifts", "None", "Not recommended"],
        ["Gravel base", "Good", "Low", "Light use"],
        ["Pavers", "Good", "Moderate", "Most decks"],
        ["Concrete pad", "Excellent", "Higher", "Heavy use, permanence"]
      ],
      faqs: [
        ["How do I measure rise for deck stairs?", "Measure vertically from the deck surface to the finished landing height, accounting for the landing pad."],
        ["What lumber for outdoor stringers?", "Pressure-treated lumber rated for ground contact or exterior use, with corrosion-resistant hardware."],
        ["How many stringers do deck stairs need?", "At least two, with a third for wider stairs to stop tread flex; confirm for your tread material."],
        ["Do deck stairs need a landing?", "Yes. A stable, level landing keeps the bottom step consistent and stops sinking."]
      ],
      sources: [
        ["OSHA: Stairways and Ladders", "https://www.osha.gov/stairways-ladders", "Official guidance on stair safety, dimensions, and structural requirements."],
        ["WoodCutTool stair stringer calculator", "/stair-stringer-calculator/", "Work out consistent risers, treads, and stringer length for deck stairs."]
      ]
    },
    checklist: ["Measure total rise to the real landing.", "Build a stable, level landing first.", "Use pressure-treated stringers, spaced to limit flex.", "Anchor the stairs top and bottom.", "Cut one stringer, verify, then template."]
  },
  {
    slug: "tile-underlayment-and-subfloor-prep",
    category: "Tile",
    title: "Tile Underlayment and Subfloor Prep",
    description: "Prep a subfloor so tile lasts: flatness and deflection limits, the right underlayment, and why a stiff base prevents cracked tile and grout.",
    kicker: "Tile prep",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["Tile Is Only As Good As Its Base", "Beautiful tile cracks if the floor under it flexes or is uneven. Most tile failures trace back to subfloor prep, not the tile or the installer's hand. A flat, stiff, properly prepared base is the foundation of a tile job that lasts. Spend the effort here and the tile rewards you for decades."],
      ["Flatness Standards Matter", "Tile needs a flat substrate within a tight tolerance, and larger tiles need it flatter still because they cannot conform to dips. Industry guidance calls for flatness measured over a span, and high spots or dips beyond it cause lippage and cracks. Check the floor with a straightedge and address high and low spots before tiling."],
      ["Deflection: The Floor Cannot Flex", "A floor that bounces will crack rigid tile and grout. Subfloors for tile must meet a stiffness, or deflection, standard so they do not flex under load. If the joists or subfloor are too springy, tile is the wrong finish until the structure is stiffened. Deflection is the invisible reason many tile jobs fail."],
      ["Choosing The Underlayment", "The right underlayment depends on the substrate: cement backer board over a stiff wood subfloor, an uncoupling membrane to isolate tile from minor movement, or a mortar bed for the most demanding floors. Each addresses a specific problem. Pick the underlayment for your conditions rather than defaulting to one for every floor."],
      ["Prep Sequence Before The First Tile", "Confirm the structure is stiff enough, flatten the substrate, install the correct underlayment per its instructions, and only then lay out the tile. Skipping or rushing prep is the most expensive mistake in tiling because the failure shows up months later. Plan tile counts and layout with the tile calculator after the base is right."]
    ],
    chart: {
      title: "Tile failure causes (relative share)",
      caption: "Most tile failures trace to the base, not the tile. Prep, flatness, and deflection dominate the causes.",
      unit: "",
      bars: [["Deflection", 35], ["Flatness", 30], ["Wrong underlay", 20], ["Tile/setting", 15]]
    },
    deepDive: {
      figureTitle: "A stiff, flat base prevents cracks",
      figureCaption: "Confirm deflection, flatten the substrate, and choose the right underlayment before laying tile.",
      figureStats: [["Stiffness", "Floor must not flex"], ["Flatness", "Within tolerance for tile size"], ["Underlayment", "Matched to the substrate"]],
      comparisonTitle: "Underlayment options",
      comparisonColumns: ["Option", "Solves", "Best for", "Note"],
      comparisonRows: [
        ["Cement backer board", "Stable bonding surface", "Most wood subfloors", "Common, reliable"],
        ["Uncoupling membrane", "Minor movement isolation", "Floors with slight movement", "Reduces crack transfer"],
        ["Mortar bed", "Flatness and strength", "Demanding floors", "More skill and labor"],
        ["Self-leveler", "Low spots, flatness", "Uneven substrates", "Use with primer"]
      ],
      faqs: [
        ["Why did my tile crack?", "Most often a flexing or uneven subfloor, not the tile itself. Stiffen and flatten the base before tiling."],
        ["How flat does a floor need to be for tile?", "Within a tight tolerance over a span, and flatter for large tiles. Check with a straightedge."],
        ["What is deflection?", "How much a floor flexes under load. Too much flex cracks rigid tile and grout."],
        ["Do I need backer board?", "Usually yes over wood subfloors, or an uncoupling membrane, to give tile a stable, isolated base."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (floor systems)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood floor structure and deflection relevant to tile substrates."],
        ["WoodCutTool tile calculator", "/tile-calculator/", "Estimate tiles and boxes once the subfloor prep is correct."]
      ]
    },
    checklist: ["Confirm the floor is stiff enough for tile.", "Flatten high and low spots first.", "Choose underlayment for your substrate.", "Follow the underlayment instructions.", "Lay out tile only after prep is done."]
  },
  {
    slug: "tile-pattern-planning-and-waste",
    category: "Tile",
    title: "Tile Pattern Planning and Waste",
    description: "Choose a tile pattern with eyes open: how straight, brick, herringbone, and diagonal layouts change cuts, difficulty, and how much waste to buy.",
    kicker: "Tile planning",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["The Pattern Changes The Cut Count", "A tile pattern is not just a look; it decides how many tiles get cut and how hard the job is. A straight grid has the fewest cuts; a diagonal or herringbone pattern multiplies edge cuts dramatically. Choosing the pattern early lets you plan the difficulty and the material, instead of running short midway through."],
      ["Straight And Brick Patterns", "A straight stack is the simplest, with cuts mainly at the walls and a low waste factor. A brick or running-bond offset adds visual interest with only slightly more cutting, and it hides minor size variation between tiles. These patterns are forgiving and a good choice for beginners and large simple areas."],
      ["Diagonal And Herringbone Patterns", "Diagonal layouts turn every perimeter tile into an angled cut, and herringbone creates many small angled cuts throughout. The results look impressive but consume more tile, more time, and more skill. If you choose these, plan a higher waste allowance and accept a slower, more careful install."],
      ["Waste Allowance By Pattern", "Waste is not one number. A simple straight floor might need only a small allowance, while a diagonal or herringbone layout in a cut-up room can need much more. Buying too little means a second order, often from a different dye lot. Match the waste allowance to the pattern and the room's complexity, not a blanket figure."],
      ["Estimate Before You Buy", "Once you choose the pattern and tile size, estimate the tile count, boxes, and waste before ordering. A pattern that adds cuts adds tiles, and ordering a little extra of the same lot protects against breakage and future repairs. Use the tile calculator with a pattern-appropriate waste percentage to get an honest count."]
    ],
    chart: {
      title: "Typical waste allowance by tile pattern (percent)",
      caption: "Approximate extra tile to buy by pattern. Complex angled layouts and cut-up rooms need the higher figures.",
      unit: "%",
      bars: [["Straight", 10], ["Brick offset", 12], ["Diagonal", 17], ["Herringbone", 20]]
    },
    deepDive: {
      figureTitle: "More angles means more cuts and waste",
      figureCaption: "Pattern choice drives cut count, difficulty, and how much extra tile to order.",
      figureStats: [["Straight", "Fewest cuts, lowest waste"], ["Diagonal", "Every edge tile is angled"], ["Herringbone", "Many small angled cuts"]],
      comparisonTitle: "Tile patterns compared",
      comparisonColumns: ["Pattern", "Difficulty", "Cuts", "Waste allowance"],
      comparisonRows: [
        ["Straight grid", "Easy", "Perimeter only", "Lower"],
        ["Brick offset", "Easy", "Slightly more", "Lower-moderate"],
        ["Diagonal", "Moderate", "All edges angled", "Higher"],
        ["Herringbone", "Hard", "Many angled cuts", "Highest"]
      ],
      faqs: [
        ["How much extra tile should I buy?", "It depends on the pattern and room. Simple straight floors need less; diagonal and herringbone need more."],
        ["Which tile pattern wastes the least?", "A straight grid wastes the least because cuts are mostly at the perimeter."],
        ["Why is herringbone harder?", "It creates many small angled cuts throughout the field, which takes more skill, time, and tile."],
        ["Why order extra from the same lot?", "Dye lots vary, so future repairs and breakage are best covered by extra tile bought up front."]
      ],
      sources: [
        ["CPSC: U.S. Consumer Product Safety Commission", "https://www.cpsc.gov/", "Consumer safety reference relevant to flooring slip resistance and installation."],
        ["WoodCutTool tile calculator", "/tile-calculator/", "Estimate tiles, boxes, and waste with a pattern-appropriate allowance."]
      ]
    },
    checklist: ["Choose the pattern before estimating.", "Use straight or brick for low waste.", "Expect more cuts with diagonal and herringbone.", "Set waste allowance by pattern and room.", "Order extra from the same dye lot."]
  },
  {
    slug: "workshop-dust-and-saw-safety-basics",
    category: "CutList",
    title: "Workshop Dust and Saw Safety Basics",
    description: "Protect your lungs and hands in the shop: wood dust hazards, dust collection, blade guards, push sticks, and the habits that prevent serious injury.",
    kicker: "Shop safety",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Wood Dust Is A Real Hazard", "Fine wood dust is not just messy; it is a recognized respiratory hazard, and some species and engineered panels release dust that irritates or sensitizes the lungs over time. Treating dust control as part of the work, not an afterthought, protects your long-term health. The cleanest shops are also the safest and the most pleasant to work in."],
      ["Collect Dust At The Source", "The best dust control captures dust where it is made, at the tool, before it becomes airborne. Connect saws and sanders to a dust collector or shop vacuum, and add an air filter for the fine particles that escape. MDF and some plywoods produce especially fine dust, so capture at the source matters most with those materials."],
      ["Wear The Right Protection", "Hearing protection, safety glasses, and a properly rated dust mask or respirator are basic shop gear, not optional. Power tools are loud enough to damage hearing over time, and fine dust passes through cheap masks. Match the protection to the task, and keep it within reach so it actually gets used."],
      ["Respect The Table Saw", "The table saw causes many serious shop injuries, usually from kickback or contact with the blade. Use the blade guard and riving knife, never cut freehand, use push sticks for narrow rips, and stand out of the kickback path. Most table saw injuries are preventable with guards, push sticks, and disciplined technique."],
      ["Build Safe Habits Into Every Cut", "Safety is a routine, not a one-time setup. Keep the work area clear, support full sheets so they do not bind, plan the cut before the blade spins, and never reach over a running blade. Planning the cut list and breakdown sequence in advance means fewer awkward, dangerous cuts and a calmer, safer shop."]
    ],
    chart: {
      title: "Where dust control is most effective (relative capture)",
      caption: "Capturing dust at the source is far more effective than cleaning it up after it is airborne.",
      unit: "",
      bars: [["At source", 90], ["Air filter", 55], ["Shop vac after", 35], ["Sweep up", 15]]
    },
    deepDive: {
      figureTitle: "Source capture plus protection",
      figureCaption: "Collect dust at the tool, filter the fine particles, and wear hearing, eye, and lung protection.",
      figureStats: [["At source", "Best place to capture dust"], ["Guard + knife", "Cut kickback risk"], ["Push stick", "Keeps hands clear"]],
      comparisonTitle: "Shop safety essentials",
      comparisonColumns: ["Area", "Hazard", "Control", "Note"],
      comparisonRows: [
        ["Dust", "Respiratory irritation", "Source collection, respirator", "Worst with MDF"],
        ["Noise", "Hearing loss", "Ear protection", "Cumulative damage"],
        ["Table saw", "Kickback, blade contact", "Guard, riving knife, push stick", "Most serious injuries"],
        ["Handling sheets", "Strain, binding cuts", "Support and plan cuts", "Break down safely"]
      ],
      faqs: [
        ["Is wood dust really dangerous?", "Yes. Fine wood dust is a recognized respiratory hazard; capture it at the source and wear a rated respirator."],
        ["What is the most effective dust control?", "Capturing dust at the tool before it goes airborne, backed by an air filter for fine particles."],
        ["How do I avoid table saw kickback?", "Use the riving knife and guard, push sticks for narrow rips, and stand out of the kickback path."],
        ["What protection do I need in the shop?", "Eye protection, hearing protection, and a properly rated dust mask or respirator at minimum."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Official safety guidance for woodworking machinery, dust, and personal protection."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan the cut sequence in advance for fewer awkward, dangerous cuts."]
      ]
    },
    checklist: ["Treat wood dust as a real health hazard.", "Capture dust at the source.", "Wear eye, ear, and lung protection.", "Use the saw guard, riving knife, and push sticks.", "Plan cuts and support full sheets."]
  },
  {
    slug: "plywood-cost-breakdown-by-project",
    category: "CutList",
    title: "Plywood Cost Breakdown by Project Type",
    description: "See how plywood cost and sheet count scale across common projects, plus how grade and thickness change the budget, with charts to plan your spend.",
    kicker: "Cost planning",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Cost Scales With Sheets, Not Square Feet", "Plywood budgets are driven by how many full sheets a project needs, because you buy whole sheets even when a part uses only a corner. A small bookcase and a wall of cabinets sit at opposite ends of this scale. Estimating sheet count first, then multiplying by sheet price, gives a far more honest budget than guessing from rough square footage."],
      ["Project Type Sets The Baseline", "Different projects consume very different amounts of plywood. A single bookcase might fit on one or two sheets, while a kitchen's worth of cabinets can run well into double digits. Knowing the typical range for your project type lets you sanity-check an estimate before you ever open a calculator, and it flags when a design has crept larger than planned."],
      ["Grade Multiplies The Sheet Price", "The same sheet count costs very differently depending on grade. Shop-grade or utility plywood is cheap; cabinet-grade hardwood plywood costs several times more; prefinished panels add more still but save finishing labor. Because grade multiplies across every sheet, choosing grade per part, instead of buying one premium grade for everything, is where real savings live."],
      ["Thickness Changes Cost And Weight Together", "Thicker plywood costs more per sheet and weighs more to handle. Using 3/4 inch everywhere when 1/4 inch backs and 1/2 inch drawer parts would do quietly inflates both the budget and the labor. Matching thickness to the part keeps cost and weight sensible without weakening the structure."],
      ["Build The Estimate, Then Pressure-Test It", "Turn the parts list into a real sheet count with the plywood cut calculator, price it by grade, and check the total against the project-type baseline. If it is high, look for a cheaper grade on hidden parts, a thinner panel where load allows, or a small dimension change that drops a sheet. The wood waste calculator helps see where scrap is inflating the count."]
    ],
    charts: [
      {
        title: "Typical plywood sheets by project type",
        caption: "Approximate full 3/4-inch sheet counts; confirm with a real layout for your design.",
        unit: "",
        bars: [["Bookcase", 2], ["Desk", 2], ["Closet", 4], ["Garage wall", 8], ["Kitchen", 14]]
      },
      {
        title: "Relative sheet cost by plywood grade (shop = 100)",
        caption: "Indexed cost per sheet. Grade multiplies across every sheet in the project.",
        unit: "",
        bars: [["Shop", 100], ["Cabinet birch", 150], ["Prefinished", 175], ["Hardwood veneer", 210]]
      },
      {
        title: "Sheet price index by thickness (1/2 in = 100)",
        caption: "Thicker panels cost and weigh more; match thickness to the part to control both.",
        unit: "",
        bars: [["1/4 in", 65], ["1/2 in", 100], ["3/4 in", 135], ["1-1/8 in", 195]]
      }
    ],
    deepDive: {
      figureTitle: "Budget is sheets times grade times thickness",
      figureCaption: "Estimate sheet count, then let grade and thickness choices shape the final cost.",
      figureStats: [["Sheets", "The main cost driver"], ["Grade", "Multiplies every sheet"], ["Thickness", "Cost and weight together"]],
      comparisonTitle: "Where to spend and where to save",
      comparisonColumns: ["Part", "Save with", "Spend on", "Why"],
      comparisonRows: [
        ["Cabinet backs", "1/4 in shop grade", "-", "Hidden, low load"],
        ["Shelves", "1/2 in where span allows", "3/4 in for long spans", "Match to sag"],
        ["Visible sides", "-", "Cabinet-grade veneer", "Show face quality"],
        ["Doors", "-", "Prefinished or MDF", "Finish quality"]
      ],
      faqs: [
        ["How do I budget plywood by project?", "Estimate sheet count from a real layout, then multiply by sheet price for your chosen grade."],
        ["Why is square footage a bad budget basis?", "You buy whole sheets, so layout and shape, not raw area, decide the count and cost."],
        ["Where can I cut plywood cost?", "Use cheaper grades and thinner panels on hidden, low-load parts; spend on visible faces."],
        ["Does thickness really change the budget much?", "Yes. Thicker sheets cost and weigh more, so over-speccing thickness inflates both."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Reference on plywood grades and performance relevant to material selection and cost."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Turn a parts list into a real sheet count to price your project."]
      ]
    },
    checklist: ["Estimate sheet count before pricing.", "Check the total against a project-type baseline.", "Use cheaper grades on hidden parts.", "Match thickness to load to control cost.", "Trim a sheet with small dimension changes."]
  },
  {
    slug: "saw-kerf-waste-by-cut-count",
    category: "CutList",
    title: "How Saw Kerf Adds Up: Waste by Cut Count",
    description: "Quantify how saw kerf quietly eats material as cuts add up, how blade width and cut count change the loss, and why it can cost you a whole sheet.",
    kicker: "Material math",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Every Cut Removes Material", "Saw kerf is the width of material each cut turns to dust. One cut is trivial, but cuts add up. A project that breaks a sheet into many parts makes many cuts, and the kerf from all of them is real material that vanishes before any part is finished. Treating kerf as a running total, not a per-cut afterthought, is what keeps a layout honest."],
      ["Cut Count Drives The Total Loss", "The more parts, the more cuts, the more kerf. A simple two-part rip loses one kerf; a sheet diced into twenty small parts can lose dozens of kerf widths across both directions. As the cut count climbs, the cumulative loss grows with it, which is why busy layouts with many small parts need more material than the area math suggests."],
      ["Blade Width Multiplies It", "Kerf loss scales directly with blade width. A thin-kerf blade near 3/32 inch removes noticeably less than a full-kerf blade near 1/8 inch, and across many cuts that gap widens. On a tight layout, switching to a thin-kerf blade can be the difference between fitting on the sheet and needing another."],
      ["When Kerf Costs A Whole Sheet", "The painful case is when accumulated kerf pushes the last part off the sheet. The area was there, but the blade ate just enough that a part no longer fits, forcing a fresh sheet for one piece. This is entirely predictable if kerf is modeled up front, and entirely surprising if it is not."],
      ["Model Kerf Before You Cut", "Measure your blade's real kerf and enter it into the plywood cut calculator before laying out parts. The tool spaces cuts to reflect true loss, so the layout you see is the layout that fits. Then the wood waste calculator shows how much of the sheet kerf and offcuts consume, so you can decide if a thinner blade or a tweak saves a sheet."]
    ],
    charts: [
      {
        title: "Cumulative kerf loss by cut count (1/8 in blade, inches)",
        caption: "Total material removed grows with every cut. Many small parts mean many cuts and real loss.",
        unit: " in",
        bars: [["5 cuts", 0.6], ["10 cuts", 1.25], ["20 cuts", 2.5], ["40 cuts", 5]]
      },
      {
        title: "Loss per 20 cuts by blade kerf (inches)",
        caption: "Thinner blades remove less per cut, which compounds across a busy layout.",
        unit: " in",
        bars: [["3/32 thin", 1.9], ["1/8 full", 2.5], ["5/32 wide", 3.1], ["3/16 dado", 3.75]]
      }
    ],
    deepDive: {
      figureTitle: "Kerf is a running total, not a footnote",
      figureCaption: "Cut count and blade width together set how much material disappears before parts are done.",
      figureStats: [["1/8 in", "Typical full-kerf width"], ["1.25 in", "Loss across ten such cuts"], ["1 sheet", "What ignored kerf can cost"]],
      comparisonTitle: "Kerf factors and impact",
      comparisonColumns: ["Factor", "Lower loss", "Higher loss", "Lever"],
      comparisonRows: [
        ["Blade kerf", "Thin-kerf", "Full or dado", "Switch blades on tight layouts"],
        ["Cut count", "Few large parts", "Many small parts", "Batch and group parts"],
        ["Layout", "Kerf modeled", "Kerf ignored", "Enter real kerf first"],
        ["Material", "Forgiving size", "Tight to the sheet", "Tweak a dimension"]
      ],
      faqs: [
        ["How much does saw kerf waste?", "About 1/8 inch per cut with a full-kerf blade. Across ten cuts that is over an inch, and it grows with cut count."],
        ["Does a thin-kerf blade save material?", "Yes, modestly per cut, but it compounds across many cuts and can save a sheet on a tight layout."],
        ["Can kerf really cost a whole sheet?", "Yes. Accumulated kerf can push the last part off the sheet even when the area was technically there."],
        ["How do I plan for kerf?", "Measure your blade's real kerf and enter it in the cut calculator so the layout reflects true loss."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (machining)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on sawing, kerf, and material removal in wood machining."],
        ["WoodCutTool wood waste calculator", "/wood-waste-calculator/", "See how much of a sheet kerf and offcuts consume on your layout."]
      ]
    },
    checklist: ["Treat kerf as a cumulative total.", "Expect more loss with more cuts.", "Use a thin-kerf blade on tight layouts.", "Enter real kerf before laying out parts.", "Check whether kerf costs an extra sheet."]
  },
  {
    slug: "cabinet-sizing-standards-explained",
    category: "CutList",
    title: "Cabinet Sizing Standards, Explained with Numbers",
    description: "Learn the standard cabinet dimensions for base, wall, and tall units, plus counter and toe-kick heights, with charts so your cut list fits real kitchens.",
    kicker: "Design standards",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Standards Exist So Things Fit Together", "Cabinet dimensions are standardized so countertops, appliances, and hardware fit predictably. Building to standard heights and depths means a dishwasher slides in, a counter overhangs correctly, and wall cabinets clear the backsplash. Knowing the standards before you cut keeps a custom build compatible with off-the-shelf appliances and tops."],
      ["Base Cabinet Numbers", "Base cabinets cluster around well-known figures: a carcass height that, plus toe kick and countertop, lands the work surface near a comfortable counter height, and a depth that supports a standard countertop overhang. Widths come in increments so runs add up cleanly. Building base boxes to these numbers keeps the kitchen ergonomic and the parts list regular."],
      ["Wall And Tall Cabinet Numbers", "Wall cabinets hang at a height that clears the counter and backsplash while staying within reach, with depths shallow enough not to crowd the work zone. Tall pantry and oven cabinets run floor to a matching top line. Knowing these heights lets you plan a run where base, wall, and tall units align cleanly along the top."],
      ["Toe Kick And Counter Heights", "The toe kick recess and its height set how the base sits and how comfortable it is to stand at. Combined with carcass height and countertop thickness, it produces the finished counter height. These small numbers matter: get the toe kick wrong and the whole run sits at an awkward height. Plan them into the cut list, not at assembly."],
      ["Translate Standards Into A Cut List", "Once you know the target dimensions, convert them into parts: sides, bottoms, stretchers, shelves, and toe kicks at the right sizes. Use the kitchen cabinet cut list template as a starting point and the plywood cut calculator to lay the parts out. Standards give you the numbers; the cut list turns them into panels that fit real appliances and tops."]
    ],
    charts: [
      {
        title: "Standard cabinet heights (inches)",
        caption: "Common nominal heights. Counter height combines base carcass, toe kick, and countertop.",
        unit: " in",
        bars: [["Toe kick", 4], ["Base carcass", 30], ["Counter", 36], ["Wall cab", 30], ["Tall cab", 84]]
      },
      {
        title: "Standard cabinet depths (inches)",
        caption: "Typical nominal depths. Base supports a counter overhang; wall stays shallow to keep the work zone clear.",
        unit: " in",
        bars: [["Wall", 12], ["Tall front", 24], ["Base", 24], ["Counter depth", 25]]
      }
    ],
    deepDive: {
      figureTitle: "Standard numbers keep a run compatible",
      figureCaption: "Heights and depths are standardized so appliances, counters, and hardware fit predictably.",
      figureStats: [["~36 in", "Common finished counter height"], ["24 in", "Standard base cabinet depth"], ["~18 in", "Typical counter-to-wall-cabinet gap"]],
      comparisonTitle: "Cabinet types at a glance",
      comparisonColumns: ["Type", "Nominal height", "Nominal depth", "Note"],
      comparisonRows: [
        ["Base", "About 30 in carcass", "24 in", "Plus toe kick and top"],
        ["Wall", "24-42 in", "12 in", "Hung above counter"],
        ["Tall / pantry", "About 84-96 in", "24 in", "Aligns with wall tops"],
        ["Counter height", "About 36 in", "25 in top", "Carcass + kick + top"]
      ],
      faqs: [
        ["What is standard kitchen counter height?", "Commonly about 36 inches, made up of the base carcass, toe kick, and countertop thickness."],
        ["How deep are base cabinets?", "Typically 24 inches, which supports a standard countertop with overhang."],
        ["How high are wall cabinets hung?", "So they clear the counter and backsplash while staying in reach, usually around 18 inches above the counter."],
        ["Do I have to follow standards?", "For appliance and counter compatibility, mostly yes; custom needs can deviate but plan the consequences."]
      ],
      sources: [
        ["U.S. Access Board: ADA accessibility (kitchens)", "https://www.access-board.gov/", "Federal guidance on accessible kitchen dimensions and reach ranges."],
        ["WoodCutTool kitchen cabinet cut list template", "/templates/kitchen-cabinet-cut-list/", "Turn standard dimensions into a base and wall cabinet cut list."]
      ]
    },
    checklist: ["Build to standard heights for appliance fit.", "Use 24 in base depth for counter overhang.", "Hang wall cabinets to clear the backsplash.", "Plan toe-kick and counter height together.", "Convert standards into a cut list."]
  },
  {
    slug: "stair-comfort-dimensions-by-the-numbers",
    category: "Stairs",
    title: "Comfortable Stairs by the Numbers",
    description: "See how riser height, tread depth, and stair angle affect comfort and safety, with charts and the rules of thumb that produce stairs people climb easily.",
    kicker: "Stair design",
    readTime: "9 min",
    accent: "stairs",
    sections: [
      ["Comfort Is A Ratio, Not One Number", "Comfortable stairs come from the relationship between riser height and tread depth, not either alone. A tall riser with a shallow tread feels steep and tiring; a short riser with a deep tread feels endless. The classic rules of thumb balance the two so the step matches a natural stride. Always confirm final figures against your local building code."],
      ["Riser Height And Why It Matters", "Riser height sets how far you lift each step. Too tall and stairs feel like climbing; too short and the rhythm breaks and people stumble. Comfortable residential risers sit in a fairly narrow band, and codes cap the maximum. Consistency across the flight matters as much as the number, because the body expects every step to be the same."],
      ["Tread Depth And Foot Room", "Tread depth is how much room the foot gets. Too shallow and heels hang off, which is unsafe descending; deeper treads feel secure but stretch the staircase footprint. Codes set a minimum tread, and comfort usually wants a bit more than the minimum. Balancing tread against available run is a core stair planning trade-off."],
      ["Stair Angle Ties It Together", "Riser and tread together produce the stair angle. Comfortable residential stairs fall in a moderate range; steeper than that feels like a ladder, shallower wastes floor space. The angle is a useful single check: if the math produces an angle outside the comfortable band, the riser-tread balance needs adjusting before cutting stringers."],
      ["Run The Numbers, Then Verify Locally", "Compute total rise, number of risers, riser height, tread depth, and the resulting angle with the stair stringer calculator, and check them against the comfort ranges. Then verify every figure against your local code, because the calculator gives a comfortable starting point but the building department has the final say."]
    ],
    charts: [
      {
        title: "Comfortable vs steep riser height (inches)",
        caption: "Comfortable residential risers sit in a narrow band; codes cap the maximum. Confirm locally.",
        unit: " in",
        bars: [["Shallow", 6], ["Comfortable", 7], ["Max typical", 7.75], ["Too steep", 9]]
      },
      {
        title: "Tread depth and comfort (inches)",
        caption: "Below the minimum is unsafe; comfortable treads give the foot secure room.",
        unit: " in",
        bars: [["Too shallow", 8], ["Min typical", 10], ["Comfortable", 11], ["Generous", 12]]
      },
      {
        title: "Stair angle by design (degrees)",
        caption: "Comfortable residential stairs fall in a moderate angle band; steeper feels like a ladder.",
        unit: " deg",
        bars: [["Shallow", 30], ["Comfortable", 35], ["Steepish", 40], ["Ladder-like", 50]]
      }
    ],
    deepDive: {
      figureTitle: "Riser and tread set the comfort",
      figureCaption: "Balance riser height against tread depth, and check the resulting angle, before cutting stringers.",
      figureStats: [["~7 in", "Comfortable riser height"], ["~11 in", "Comfortable tread depth"], ["~35 deg", "Comfortable stair angle"]],
      comparisonTitle: "Comfort versus extremes",
      comparisonColumns: ["Dimension", "Comfortable", "Uncomfortable", "Effect"],
      comparisonRows: [
        ["Riser", "About 7 in", "Over 8 in", "Steep, tiring climb"],
        ["Tread", "About 11 in", "Under 10 in", "Heel overhang, unsafe"],
        ["Angle", "Around 35 deg", "Over 42 deg", "Ladder-like feel"],
        ["Consistency", "Uniform steps", "Varying steps", "Trip hazard"]
      ],
      faqs: [
        ["What is a comfortable riser height?", "Around 7 inches for residential stairs, with codes capping the maximum near 7-3/4 inches. Confirm locally."],
        ["What tread depth is comfortable?", "About 11 inches gives the foot secure room; codes set a minimum near 10 inches."],
        ["What stair angle feels comfortable?", "A moderate angle around 35 degrees; much steeper begins to feel like a ladder."],
        ["Does the code or comfort win?", "Meet code first, then aim for comfort within the allowed range. Verify figures with your local authority."]
      ],
      sources: [
        ["CPSC: U.S. Consumer Product Safety Commission - stairs", "https://www.cpsc.gov/", "Stairs are a leading source of home injuries; dimension consistency improves safety."],
        ["WoodCutTool stair stringer calculator", "/stair-stringer-calculator/", "Compute riser, tread, and angle, then verify against local code."]
      ]
    },
    checklist: ["Balance riser height against tread depth.", "Keep risers near the comfortable band.", "Give treads secure foot room.", "Check the resulting stair angle.", "Verify every figure against local code."]
  },
  {
    slug: "tile-quantity-and-cost-by-room",
    category: "Tile",
    title: "Tile Quantity and Cost by Room Size",
    description: "See how tile count, boxes, and cost scale with room size and tile format, with charts so you can estimate a bathroom, kitchen, or floor before you buy.",
    kicker: "Tile estimating",
    readTime: "8 min",
    accent: "tile",
    sections: [
      ["Quantity Scales With Area, Cost Scales With Choices", "Tile quantity follows the floor or wall area, but cost depends on tile format, grade, and waste. A small bathroom and a great room need very different amounts, and the same area in budget ceramic versus large-format porcelain lands at very different prices. Estimating area first, then layering format and waste, gives an honest budget."],
      ["Bigger Rooms, More Boxes", "As room area grows, tile count and box count grow with it, but not always smoothly, because tiles come in boxes that cover a fixed area and you round up. A room just over a box boundary needs the same boxes as one well into the next range. Knowing the box coverage lets you estimate boxes, not just loose tile count."],
      ["Tile Format Changes The Count And The Cuts", "Large-format tiles cover more area per piece, so a room needs fewer of them, but each cut wastes more and they demand a flatter floor. Small tiles and mosaics cover less per piece and create more grout lines and handling. Format changes both the count you buy and the difficulty of the install."],
      ["Waste Allowance Protects The Budget", "Every room needs extra tile for cuts, breakage, and future repairs, and the right percentage depends on the layout and room shape. A plain rectangular floor needs less; a cut-up bathroom or a diagonal pattern needs more. Buying too little means a second order, often from a different dye lot, so the waste allowance is real budget, not optional."],
      ["Estimate Before You Order", "Measure the area, choose the tile format, set a waste allowance for the layout, and turn it into a tile and box count with the tile calculator. That converts room size into the boxes you actually carry home and the cost you actually pay, instead of a rough guess that runs short halfway through the job."]
    ],
    charts: [
      {
        title: "Tiles needed by room area (12x12 tile, count)",
        caption: "Approximate tile count before waste for a 12-inch tile. Add a waste allowance for cuts and breakage.",
        unit: "",
        bars: [["40 sq ft", 40], ["80 sq ft", 80], ["120 sq ft", 120], ["200 sq ft", 200]]
      },
      {
        title: "Boxes needed by tile format (120 sq ft room)",
        caption: "Larger formats cover more per box, so fewer boxes; small mosaics need many more.",
        unit: "",
        bars: [["Mosaic", 18], ["6x6", 12], ["12x12", 8], ["24x24", 6]]
      },
      {
        title: "Waste allowance by layout (percent)",
        caption: "Plain layouts need less; cut-up rooms and angled patterns need more extra tile.",
        unit: "%",
        bars: [["Plain floor", 10], ["Small bath", 15], ["Diagonal", 17], ["Herringbone", 20]]
      }
    ],
    deepDive: {
      figureTitle: "Area sets quantity, choices set cost",
      figureCaption: "Room area drives tile count; format, grade, and waste drive the final cost.",
      figureStats: [["Area", "Drives tile and box count"], ["Format", "Changes count and cuts"], ["Waste", "Real budget, not optional"]],
      comparisonTitle: "Tile estimating factors",
      comparisonColumns: ["Factor", "Lower cost", "Higher cost", "Effect"],
      comparisonRows: [
        ["Area", "Small room", "Large room", "More tile and boxes"],
        ["Format", "Standard tile", "Large-format porcelain", "Fewer pieces, more waste per cut"],
        ["Grade", "Budget ceramic", "Premium porcelain", "Price per box"],
        ["Layout", "Plain straight", "Diagonal, cut-up", "Higher waste allowance"]
      ],
      faqs: [
        ["How do I estimate tile for a room?", "Measure the area, choose a tile format, add a waste allowance, and convert to tile and box counts."],
        ["Why round up to whole boxes?", "Tile sells in boxes covering a fixed area, so you round up and keep extra for repairs."],
        ["Does tile size change how much I buy?", "Yes. Large formats need fewer pieces but waste more per cut; small tiles need many more pieces."],
        ["How much waste should I add?", "Roughly 10 percent for plain floors, more for cut-up rooms and angled patterns."]
      ],
      sources: [
        ["CPSC: U.S. Consumer Product Safety Commission", "https://www.cpsc.gov/", "Consumer safety reference relevant to flooring and installation."],
        ["WoodCutTool tile calculator", "/tile-calculator/", "Convert room size and tile format into tile count, boxes, and cost."]
      ]
    },
    checklist: ["Measure room area first.", "Pick a tile format before estimating.", "Round up to whole boxes.", "Set waste allowance by layout.", "Convert to tiles and boxes before ordering."]
  },
  {
    slug: "wood-finish-types-compared",
    category: "CutList",
    title: "Wood Finish Types Compared, with Numbers",
    description: "Compare oil, polyurethane, water-based, shellac, and wax finishes on durability, dry time, and difficulty, with charts to pick the right finish for your project.",
    kicker: "Finishing guide",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["There Is No Single Best Finish", "Wood finishes trade off durability, ease, dry time, repairability, and look. A finish that is perfect for a cutting board is wrong for a floor, and vice versa. Choosing well means matching the finish to how the piece is used and how much effort you want to spend, not chasing one universal answer. The charts below compare the common options on the factors that decide the choice."],
      ["Oil Finishes Are Easy And Repairable", "Penetrating oils soak into the wood, are very forgiving to apply, and are easy to repair by wiping on more. They give a low, natural look but offer modest surface protection and need re-coating over time. For low-wear furniture and a beginner-friendly process, oils are hard to beat, but they will not shrug off water rings like a film finish."],
      ["Film Finishes Protect Best", "Polyurethane and other film finishes build a hard protective layer on the surface, resisting water, scratches, and wear far better than oils. That durability suits tabletops, floors, and high-use pieces. The trade-off is a more demanding application, longer dry times between coats, and harder spot repairs, since you are repairing a film, not refreshing an oil."],
      ["Water-Based Finishes Balance Speed And Clarity", "Water-based finishes dry fast, stay clear without yellowing, and have low odor, which makes them popular for light woods and indoor work. They are durable and convenient but can raise the grain and need light sanding between coats. They sit between oils and oil-based film finishes on both effort and protection."],
      ["Match The Finish To The Job", "Decide by use first. A workshop fixture wants speed; a dining table wants durability; a cutting board wants a food-safe, repairable oil; a light modern piece wants a clear, non-yellowing finish. Test on an offcut of the same wood before committing, and read the cure times so the piece is fully hardened before it goes into service."]
    ],
    charts: [
      {
        title: "Surface durability by finish (relative)",
        caption: "Film finishes protect best; oils and wax offer the least surface protection but the easiest repair.",
        unit: "",
        bars: [["Wax", 20], ["Oil", 40], ["Shellac", 55], ["Water-based", 80], ["Polyurethane", 95]]
      },
      {
        title: "Typical recoat dry time by finish (hours)",
        caption: "Approximate time between coats. Water-based dries fastest; oil-based films are slowest.",
        unit: " hr",
        bars: [["Water-based", 2], ["Shellac", 1], ["Wax", 1], ["Oil", 8], ["Polyurethane", 12]]
      },
      {
        title: "Application difficulty (1 easy to 5 hard)",
        caption: "Relative skill to apply well. Oils and wax are forgiving; film finishes show every flaw.",
        unit: "",
        bars: [["Oil", 1], ["Wax", 1], ["Water-based", 3], ["Shellac", 3], ["Polyurethane", 4]]
      }
    ],
    deepDive: {
      figureTitle: "Pick the finish by how the piece is used",
      figureCaption: "Durability, dry time, and difficulty trade off. There is no universal best finish.",
      figureStats: [["Oils", "Easy and repairable"], ["Film", "Most protective"], ["Water-based", "Fast and clear"]],
      comparisonTitle: "Finish at a glance",
      comparisonColumns: ["Finish", "Durability", "Ease", "Best for"],
      comparisonRows: [
        ["Penetrating oil", "Moderate", "Easy", "Low-wear furniture, boards"],
        ["Polyurethane", "High", "Harder", "Tables, floors, high wear"],
        ["Water-based", "High", "Moderate", "Light woods, indoor work"],
        ["Shellac / wax", "Low-moderate", "Easy", "Accent pieces, repairs"]
      ],
      faqs: [
        ["What is the most durable wood finish?", "Film finishes like polyurethane protect best against water and wear; oils protect least but repair easily."],
        ["What finish is easiest for beginners?", "A wipe-on oil is the most forgiving; build it slowly and it is hard to ruin."],
        ["Why choose a water-based finish?", "It dries fast, stays clear without yellowing, and has low odor, ideal for light woods indoors."],
        ["How do I pick a finish?", "Match it to use: durability for tables and floors, easy repair for boards, clarity for light modern pieces."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (finishing)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood finishing, coatings, and surface preparation."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan parts and keep a same-wood offcut for finish testing."]
      ]
    },
    checklist: ["Choose the finish by how the piece is used.", "Use oils for easy, repairable low-wear work.", "Use film finishes for high-wear surfaces.", "Test on a same-wood offcut first.", "Respect cure times before use."]
  },
  {
    slug: "screws-nails-glue-joining-compared",
    category: "CutList",
    title: "Screws vs Nails vs Glue: Joining Compared",
    description: "Compare screws, nails, and glue for woodworking joints on strength, speed, and whether they can be taken apart, with charts to choose the right fastener.",
    kicker: "Joinery guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Each Joining Method Solves A Different Problem", "Screws, nails, and glue are not ranked best to worst; they solve different problems. Glue makes the strongest permanent wood-to-wood bond, screws give mechanical strength and can be removed, and nails are fast for holding parts while glue cures. Most good joints use a combination, so understanding each one lets you pick the right mix for the job."],
      ["Glue Is The Strongest Permanent Bond", "A well-made glue joint on long-grain surfaces is often stronger than the wood around it, which is why glued joints are the backbone of fine woodworking. The catch is that glue needs good surface contact, clamping pressure, and cure time, and it cannot be undone. Glue shines on permanent furniture joints; it is the wrong choice where you need to disassemble later."],
      ["Screws Add Mechanical Strength And Come Apart", "Screws provide immediate clamping and mechanical strength, hold without waiting for cure, and can be removed for knockdown or repair. They excel in plywood carcasses, attaching hardware, and anywhere you might take the piece apart. Their weakness is in plywood edges, where threads can split the plies if you do not pilot the holes."],
      ["Nails Are Fast But Hold Least", "Nails drive fast and are great for tacking parts together, attaching trim, and holding a glued joint while it cures. They have the least withdrawal strength of the three and are not meant to carry heavy structural load alone. Think of nails as speed and positioning, not as the primary strength of a serious joint."],
      ["Combine Them For The Best Joint", "The strongest practical joints usually combine methods: glue for the permanent bond, plus screws or nails to clamp and hold while it cures. A glued-and-screwed cabinet joint is both strong and self-clamping. Decide the combination before assembly so you pilot holes, plan clamps, and keep the cut list and joinery allowances consistent."]
    ],
    charts: [
      {
        title: "Joint strength by method (relative)",
        caption: "Glue on good long-grain surfaces is strongest; nails hold least. Combinations beat any single method.",
        unit: "",
        bars: [["Nails", 35], ["Screws", 70], ["Glue", 90], ["Glue + screws", 100]]
      },
      {
        title: "Assembly speed (relative, higher is faster)",
        caption: "Nails and screws are fast to hold parts; glue needs clamping and cure time.",
        unit: "",
        bars: [["Nails", 95], ["Screws", 75], ["Glue", 35]]
      },
      {
        title: "Can it come apart? (1 no to 5 yes)",
        caption: "Screws disassemble easily; glue is permanent. Choose by whether you need to take it apart.",
        unit: "",
        bars: [["Glue", 1], ["Nails", 2], ["Screws", 5]]
      }
    ],
    deepDive: {
      figureTitle: "Strength, speed, and reversibility",
      figureCaption: "Glue bonds strongest and permanently; screws balance strength and removal; nails are fast holders.",
      figureStats: [["Glue", "Strongest, permanent"], ["Screws", "Strong, removable"], ["Nails", "Fast, light hold"]],
      comparisonTitle: "Joining methods compared",
      comparisonColumns: ["Method", "Strength", "Reversible", "Best for"],
      comparisonRows: [
        ["Glue", "Highest on long grain", "No", "Permanent furniture joints"],
        ["Screws", "High mechanical", "Yes", "Plywood carcasses, hardware"],
        ["Nails", "Lowest", "Partly", "Tacking, trim, holding glue-ups"],
        ["Glue + screws", "Highest practical", "No", "Strong self-clamping joints"]
      ],
      faqs: [
        ["Is glue or screws stronger?", "A good long-grain glue joint is usually stronger than screws alone, but it is permanent and needs clamping."],
        ["When should I use screws instead of glue?", "When you may need to take the piece apart, attach hardware, or want immediate mechanical strength."],
        ["Are nails strong enough for furniture?", "Not alone for structural joints. Use them to tack and hold, ideally with glue."],
        ["What is the strongest joint?", "Often glue plus screws or clamps: glue for the bond, fasteners to clamp and hold while it cures."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (fastenings)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference chapter on fasteners, adhesives, and joint strength in wood."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan parts and joinery so fasteners and glue-ups go together cleanly."]
      ]
    },
    checklist: ["Pick the method by the problem it solves.", "Use glue for permanent long-grain bonds.", "Use screws where you may disassemble.", "Use nails to tack and hold glue-ups.", "Combine glue with fasteners for strong joints."]
  },
  {
    slug: "lumber-dimensions-nominal-vs-actual",
    category: "CutList",
    title: "Lumber Dimensions: Nominal vs Actual",
    description: "Know why a 2x4 is not 2 by 4 inches, with a chart of common nominal versus actual lumber sizes so your cut list and joints come out right.",
    kicker: "Material guide",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["A 2x4 Is Not Two By Four", "The single most confusing thing in lumber is that nominal sizes are not actual sizes. A 2x4 actually measures about 1-1/2 by 3-1/2 inches once it is milled and dried. The nominal number refers to the rough size before surfacing. Knowing the real dimensions is essential, because building to the nominal number throws off every joint and measurement."],
      ["Why The Gap Exists", "Rough lumber is sawn near the nominal size, then dried and planed smooth, which removes material. The result is a consistent, smaller finished dimension. This is standardized, so a 2x4 from any yard is about 1-1/2 by 3-1/2 inches. The gap is predictable, which means you can plan around it as long as you use the actual figures."],
      ["The Pattern Across Sizes", "The reduction is not a fixed fraction; it changes with size. Thickness loses about half an inch on framing lumber, and width loses more on wider boards. A 1x board is about 3/4 inch thick; a 2x is about 1-1/2 inch. Memorizing or referencing the common actual sizes prevents the cascade of small errors that ruin a tight build."],
      ["Where It Bites In A Cut List", "The nominal-actual gap matters most when parts must fit together precisely. A shelf sized to a nominal number sits loose or proud; a frame built on nominal math ends up off by the accumulated difference. Always enter actual dimensions into the cut list, and measure the specific boards you bought, since moisture and yard variation shift the numbers slightly."],
      ["Measure The Real Board", "Standard actual sizes are a reliable starting point, but the safest habit is to measure the actual boards in front of you before cutting joints. Moisture content and milling vary. Use the real measured dimensions in the cut list and the board foot calculator so your estimate, your joints, and your assembly all agree."]
    ],
    charts: [
      {
        title: "Board thickness: nominal vs actual (inches)",
        caption: "Actual thickness after surfacing. A nominal 2x is about 1-1/2 inches thick.",
        unit: "",
        bars: [["1x nom 1", 0.75], ["1x act", 0.75], ["2x nom 2", 2], ["2x act", 1.5]]
      },
      {
        title: "Common widths: nominal vs actual (inches)",
        caption: "Width loss grows with size: nominal 4, 6, and 8 inch boards finish smaller.",
        unit: "",
        bars: [["4 nom", 4], ["4 act", 3.5], ["6 nom", 6], ["6 act", 5.5], ["8 nom", 8], ["8 act", 7.25]]
      }
    ],
    deepDive: {
      figureTitle: "Nominal names, actual sizes",
      figureCaption: "Lumber is named by rough size but sold milled smaller. Build with the actual numbers.",
      figureStats: [["1-1/2 in", "Actual thickness of a 2x"], ["3-1/2 in", "Actual width of a 2x4"], ["Measure", "Confirm the real board"]],
      comparisonTitle: "Common lumber sizes",
      comparisonColumns: ["Nominal", "Actual", "Use", "Note"],
      comparisonRows: [
        ["1x4", "3/4 x 3-1/2 in", "Trim, light parts", "Surfaced four sides"],
        ["2x4", "1-1/2 x 3-1/2 in", "Framing, structure", "Most common stud"],
        ["2x6", "1-1/2 x 5-1/2 in", "Joists, stringers", "Wider framing"],
        ["2x12", "1-1/2 x 11-1/4 in", "Stringers, beams", "Stair stringer stock"]
      ],
      faqs: [
        ["Why is a 2x4 not 2 by 4 inches?", "The nominal name is the rough size; after drying and planing it finishes about 1-1/2 by 3-1/2 inches."],
        ["Are actual sizes the same everywhere?", "They are standardized, so a 2x4 is about 1-1/2 by 3-1/2 inches at any yard, with slight variation."],
        ["Does width loss change with size?", "Yes. Wider boards lose more; a nominal 8-inch board finishes around 7-1/4 inches."],
        ["Should I measure my boards?", "Yes. Standard sizes guide you, but measure the real boards before cutting precise joints."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (lumber)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on lumber sizing, grading, and nominal versus dressed dimensions."],
        ["WoodCutTool board foot calculator", "/board-foot-calculator/", "Use actual measured dimensions to estimate board feet and cost."]
      ]
    },
    checklist: ["Remember nominal is not actual.", "Use 1-1/2 in for a 2x thickness.", "Expect more width loss on wider boards.", "Enter actual sizes in the cut list.", "Measure the real boards before cutting joints."]
  },
  {
    slug: "diy-project-difficulty-and-time",
    category: "CutList",
    title: "DIY Woodworking Projects by Difficulty and Time",
    description: "See how common woodworking projects rank on difficulty, build time, and cost, with charts to pick a realistic next project for your skill level.",
    kicker: "Project planning",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Pick A Project You Will Actually Finish", "The best next project is one that matches your skills, time, and budget, not the most impressive one. Overreaching leads to half-finished builds and wasted material; underreaching can be unsatisfying. Ranking projects by difficulty, time, and cost lets you choose a build you will finish and learn from, then step up to the next level."],
      ["Difficulty Tracks Joinery And Tolerances", "A project's difficulty comes mostly from its joinery and how tight the tolerances are. A simple shelf with butt joints and screws is forgiving; a cabinet with doors and drawers demands square assembly and precise fits. As difficulty rises, so does the need for accurate cuts and good technique, which is exactly where a clear cut list and jigs help most."],
      ["Time Is Often Underestimated", "Build time is the factor people misjudge most. Finishing, dry times between coats, and fixing mistakes stretch a project well past the cutting and assembly. A realistic plan budgets time for finishing and setbacks, not just the glamorous parts. Knowing the typical hours for a project type keeps your weekend expectations honest."],
      ["Cost Scales With Material And Hardware", "Project cost depends on material grade, sheet count, and hardware like slides and hinges. A plywood shelf is cheap; a kitchen of cabinets is a serious investment in both sheets and hardware. Estimating cost up front, by sheet count and a hardware list, prevents the mid-project surprise of an empty budget."],
      ["Plan The Build Before You Start", "Whatever the project, plan it before cutting: a parts list, a sheet count, a hardware list, and a realistic time estimate. Use the plywood cut calculator and the templates to turn a project idea into a concrete plan. A project chosen to match your skill and planned properly is far more likely to get finished and look good."]
    ],
    charts: [
      {
        title: "Project difficulty (1 easy to 5 hard)",
        caption: "Relative difficulty driven by joinery and tolerances. Start lower and step up.",
        unit: "",
        bars: [["Shelf", 1], ["Workbench", 2], ["Bookcase", 3], ["Cabinet", 4], ["Kitchen", 5]]
      },
      {
        title: "Typical build time by project (hours)",
        caption: "Approximate hands-on hours including finishing. Real time runs longer with setbacks.",
        unit: " hr",
        bars: [["Shelf", 4], ["Workbench", 10], ["Bookcase", 16], ["Dresser", 30], ["Kitchen", 80]]
      },
      {
        title: "Relative project cost (index)",
        caption: "Indexed cost driven by material grade, sheet count, and hardware.",
        unit: "",
        bars: [["Shelf", 20], ["Workbench", 35], ["Bookcase", 50], ["Dresser", 90], ["Kitchen", 100]]
      }
    ],
    deepDive: {
      figureTitle: "Match the project to your skill and time",
      figureCaption: "Difficulty, time, and cost rise together. Choose a build you will finish, then level up.",
      figureStats: [["Joinery", "Drives difficulty"], ["Finishing", "The hidden time sink"], ["Hardware", "A real cost line"]],
      comparisonTitle: "Projects by level",
      comparisonColumns: ["Project", "Difficulty", "Time", "Skills built"],
      comparisonRows: [
        ["Floating shelf", "Easy", "A few hours", "Straight cuts, mounting"],
        ["Workbench", "Easy-moderate", "A weekend", "Sheet breakdown, assembly"],
        ["Bookcase", "Moderate", "Several days", "Carcass, shelves, square"],
        ["Cabinet run", "Hard", "Weeks", "Doors, drawers, hardware"]
      ],
      faqs: [
        ["What is a good first woodworking project?", "A simple shelf or workbench: forgiving joinery, few parts, and quick to finish."],
        ["Why do projects take longer than expected?", "Finishing, dry times, and fixing mistakes are usually underestimated; budget time for them."],
        ["What makes a project hard?", "Tighter tolerances and joinery like doors and drawers that must be square and precise."],
        ["How do I plan project cost?", "Estimate sheet count and list the hardware up front, then price both before starting."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Safety guidance to factor into project planning and tool use."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Turn a project idea into a parts list, sheet count, and plan."]
      ]
    },
    checklist: ["Pick a project you will finish.", "Expect difficulty to track joinery.", "Budget real time for finishing.", "Estimate material and hardware cost.", "Plan the build before cutting."]
  },
  {
    slug: "router-bits-and-edge-profiles-guide",
    category: "CutList",
    title: "Router Bits and Edge Profiles: A Visual Guide",
    description: "Learn what common router bits do, from roundovers to dadoes and rabbets, with charts on cut depth and use so you shape edges and joints with confidence.",
    kicker: "Tool guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["The Router Shapes Edges And Cuts Joints", "A router is one of the most versatile shop tools, shaping decorative edges, cutting joinery like dadoes and rabbets, and trimming edge banding flush. The bit decides what it does. Understanding the common bits, what profile or cut each makes, and how deep to run them lets you both finish edges and cut accurate joints with one tool."],
      ["Edge Profile Bits", "Profile bits shape the edge of a board for looks and feel. A roundover softens a sharp corner, a chamfer cuts an angled bevel, and an ogee or cove adds a decorative curve. These improve both appearance and safety by removing sharp edges. On plywood, a light roundover or chamfer also reduces edge splintering on handled parts."],
      ["Joinery Bits", "Straight and spiral bits cut grooves, dadoes, and rabbets for joinery. A straight bit in a dado cut captures a shelf; a rabbeting bit steps an edge for a back panel. Flush-trim bits ride a bearing to trim edge banding or template-shape parts. These joinery cuts are where the router moves from decoration to structure, and depth control matters."],
      ["Depth And Multiple Passes", "Routing too deep in one pass strains the bit, burns the wood, and is unsafe. Deep profiles and joinery cuts should be reached in multiple shallow passes, raising the bit a little each time. Planning the final depth and the number of passes keeps cuts clean and the bit cool, especially in hard material or with large profile bits."],
      ["Plan Profiles And Joinery Into The Build", "Decide which edges get a profile and which joints the router will cut before you finalize the cut list, because a captured dado or a rabbet changes part sizes. Use the cut list calculator to account for joinery allowances, and run profiles on test offcuts first to confirm the depth and look before committing to finished parts."]
    ],
    charts: [
      {
        title: "Recommended passes by cut depth (count)",
        caption: "Deeper profiles and joinery need more shallow passes for clean, safe cuts.",
        unit: "",
        bars: [["1/8 in", 1], ["1/4 in", 2], ["3/8 in", 2], ["1/2 in", 3], ["3/4 in", 4]]
      },
      {
        title: "Router bit use by type (relative frequency)",
        caption: "Roundovers and straight bits are the everyday workhorses; decorative profiles are occasional.",
        unit: "",
        bars: [["Roundover", 90], ["Straight", 85], ["Flush-trim", 70], ["Rabbet", 60], ["Ogee", 35]]
      }
    ],
    deepDive: {
      figureTitle: "One tool, edges and joints",
      figureCaption: "Profile bits shape edges; straight and bearing bits cut joinery. Depth control keeps cuts clean.",
      figureStats: [["Roundover", "Softens and protects edges"], ["Straight bit", "Dadoes and rabbets"], ["Shallow passes", "Clean, safe cuts"]],
      comparisonTitle: "Common router bits",
      comparisonColumns: ["Bit", "Makes", "Use", "Note"],
      comparisonRows: [
        ["Roundover", "Soft rounded edge", "Comfort, safety", "Reduces splintering"],
        ["Chamfer", "Angled bevel", "Decorative edge", "Clean modern look"],
        ["Straight", "Grooves, dadoes", "Joinery", "Multiple passes deep"],
        ["Flush-trim", "Trimmed edge", "Edge banding, templates", "Bearing-guided"]
      ],
      faqs: [
        ["What does a router do?", "It shapes decorative edges, cuts joinery like dadoes and rabbets, and trims edge banding flush."],
        ["What is a roundover bit for?", "It softens a sharp edge for comfort and safety, and reduces splintering on plywood edges."],
        ["How deep can I rout in one pass?", "Keep passes shallow; reach deep profiles and joints in several passes, raising the bit each time."],
        ["Do router joints change my cut list?", "Yes. Captured dadoes and rabbets change part sizes, so add the allowance before cutting."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Safety guidance for routers and other woodworking machinery."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Account for router joinery allowances in your part sizes."]
      ]
    },
    checklist: ["Use profile bits to shape and soften edges.", "Use straight and bearing bits for joinery.", "Reach deep cuts in multiple shallow passes.", "Add router joinery allowances to part sizes.", "Test profiles on offcuts first."]
  },
  {
    slug: "wood-glue-types-and-strength",
    category: "CutList",
    title: "Wood Glue Types and Strength, Compared",
    description: "Compare PVA, polyurethane, epoxy, hide, and CA glues on strength, set time, and water resistance, with charts to pick the right adhesive for your joint.",
    kicker: "Adhesive guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["The Glue Is Often The Joint", "In most woodworking, the glue line carries the load, so choosing the right adhesive matters as much as the joinery. A well-made glue joint on long grain can be stronger than the surrounding wood. But glues differ widely in set time, water resistance, gap filling, and reversibility, so the best choice depends on the joint, the environment, and how fast you need to work."],
      ["PVA Is The Everyday Workhorse", "Yellow and white PVA glues are the default for interior woodworking: strong on long grain, easy to clean up with water, and inexpensive. Type II PVA adds water resistance for occasional damp exposure. PVA needs clamping and good surface contact, and it does not fill gaps well, so it rewards tight-fitting joints and firm clamp pressure."],
      ["Polyurethane And Epoxy For Tough Jobs", "Polyurethane glue foams to fill small gaps and resists water, making it useful for exterior work and imperfect joints, though the foam is messy and it needs moisture to cure. Epoxy is the gap-filler and structural champion: it bonds dissimilar materials, fills voids, and resists water, at the cost of mixing and higher price. Reserve these for jobs PVA cannot handle."],
      ["Specialty Glues: Hide And CA", "Hide glue is reversible with heat and moisture, prized for instruments and antique repair where future disassembly matters. Cyanoacrylate, or CA, sets in seconds and is great for small parts, tacking, and quick fixes, but it is brittle under load. These specialty glues solve narrow problems the everyday adhesives do not."],
      ["Match Glue To Joint And Environment", "Decide by use: PVA for most interior joints, Type II or polyurethane for damp exposure, epoxy for gaps and dissimilar materials, hide glue for reversibility, CA for speed. Respect clamp and cure times so the joint reaches full strength before stress. Test on offcuts when bonding an unfamiliar material to confirm the glue holds."]
    ],
    charts: [
      {
        title: "Bond strength by glue type (relative)",
        caption: "Relative strength on a good wood joint. PVA and epoxy lead; CA is fast but brittle under load.",
        unit: "",
        bars: [["Hide", 60], ["CA", 55], ["Polyurethane", 80], ["PVA", 90], ["Epoxy", 95]]
      },
      {
        title: "Typical clamp time by glue (minutes)",
        caption: "Approximate clamp time before handling. CA sets in seconds; epoxy and polyurethane need longer.",
        unit: " min",
        bars: [["CA", 1], ["PVA", 30], ["Hide", 30], ["Polyurethane", 60], ["Epoxy", 120]]
      },
      {
        title: "Water resistance (1 low to 5 high)",
        caption: "Interior PVA resists water least; epoxy and polyurethane resist most for damp or exterior use.",
        unit: "",
        bars: [["PVA I", 2], ["Hide", 1], ["PVA II", 3], ["Polyurethane", 4], ["Epoxy", 5]]
      }
    ],
    deepDive: {
      figureTitle: "Pick glue by joint and environment",
      figureCaption: "Strength, set time, and water resistance trade off. PVA covers most interior work.",
      figureStats: [["PVA", "Everyday interior workhorse"], ["Epoxy", "Gap-filling and structural"], ["Cure time", "Reach full strength before stress"]],
      comparisonTitle: "Wood glue at a glance",
      comparisonColumns: ["Glue", "Strength", "Water resist", "Best for"],
      comparisonRows: [
        ["PVA (yellow)", "High on long grain", "Low to moderate", "Most interior joints"],
        ["Polyurethane", "High", "High", "Exterior, small gaps"],
        ["Epoxy", "Highest, gap-filling", "High", "Voids, dissimilar materials"],
        ["Hide / CA", "Moderate", "Low", "Reversible work / quick fixes"]
      ],
      faqs: [
        ["What glue is strongest for wood?", "On a good long-grain joint, PVA and epoxy are both very strong; epoxy also fills gaps and bonds dissimilar materials."],
        ["Which wood glue is waterproof?", "Polyurethane and epoxy resist water well; for interior PVA, use Type II for occasional damp exposure."],
        ["How long do I clamp wood glue?", "PVA typically clamps about 30 minutes and cures fully in a day; epoxy and polyurethane need longer."],
        ["When should I use epoxy?", "When filling gaps, bonding dissimilar materials, or needing maximum structural strength and water resistance."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (adhesives)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference chapter on adhesive bonding of wood and bond performance."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan tight-fitting parts so glue joints reach full strength."]
      ]
    },
    checklist: ["Use PVA for most interior joints.", "Use Type II or polyurethane for damp exposure.", "Use epoxy for gaps and dissimilar materials.", "Respect clamp and cure times.", "Test unfamiliar bonds on offcuts."]
  },
  {
    slug: "clamps-for-woodworking-guide",
    category: "CutList",
    title: "Clamps for Woodworking: Types and Uses",
    description: "Learn which clamps to buy first, from bar and parallel clamps to pipe and spring clamps, with charts on force and use so your glue-ups stay tight and square.",
    kicker: "Tool guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["You Can Never Have Too Many Clamps", "Clamps turn a glued joint from loose parts into a strong, square assembly by holding pressure while the adhesive cures. The old saying that you always need one more clamp is true, because most glue-ups need even pressure across the whole joint. Knowing which clamp types do what lets you build a useful set without buying everything at once."],
      ["Bar And Parallel Clamps For Panels", "Bar clamps and their stronger parallel-jaw cousins are the backbone of panel and carcass glue-ups, applying steady pressure across a wide span. Parallel clamps keep their jaws square to the work, which helps assemblies stay flat and true. These are the clamps to invest in first for cabinets, tabletops, and box assemblies."],
      ["Pipe Clamps Stretch Your Budget", "Pipe clamps use fittings on a length of standard pipe, so you can make long clamps cheaply and swap pipe lengths as needed. They apply serious force and are ideal for wide panel glue-ups on a budget. They are heavier and can mar the work, so pads help, but for raw clamping value they are hard to beat."],
      ["Quick, Spring, And Specialty Clamps", "Quick-grip clamps trade some force for one-handed speed, perfect for tacking parts or holding jigs. Spring clamps are light-duty helpers for small work and holding stops. Specialty clamps like corner and band clamps square up frames and boxes. These fill the gaps around your main bar and parallel clamps."],
      ["Match The Clamp To The Glue-Up", "Plan the clamping before spreading glue, because once the glue is on the clock is running. Lay out enough clamps for even pressure, dry-fit the assembly first, and have pads and a square ready. The right clamps in the right spots are what turn a parts list and a glue bottle into a flat, square finished piece."]
    ],
    charts: [
      {
        title: "Clamping force by type (relative)",
        caption: "Relative force applied. Parallel and pipe clamps press hardest; spring clamps are light-duty.",
        unit: "",
        bars: [["Spring", 20], ["Quick-grip", 45], ["Bar", 70], ["Parallel", 90], ["Pipe", 95]]
      },
      {
        title: "Suggested first clamp set (count)",
        caption: "A practical starting set: invest most in parallel and bar clamps, fewer specialty clamps.",
        unit: "",
        bars: [["Parallel", 4], ["Bar", 4], ["Pipe", 2], ["Quick-grip", 4], ["Spring", 6]]
      }
    ],
    deepDive: {
      figureTitle: "Even pressure makes a flat, square joint",
      figureCaption: "Parallel and bar clamps carry panel glue-ups; quick and spring clamps hold and tack.",
      figureStats: [["Parallel", "Square jaws for flat panels"], ["Pipe", "Cheap long-reach force"], ["Dry-fit", "Plan clamps before glue"]],
      comparisonTitle: "Clamp types and uses",
      comparisonColumns: ["Clamp", "Force", "Best for", "Note"],
      comparisonRows: [
        ["Parallel", "High, square", "Cabinets, panels", "Stays flat and true"],
        ["Bar", "High", "General glue-ups", "Versatile workhorse"],
        ["Pipe", "High", "Wide panels on a budget", "Heavy, use pads"],
        ["Quick-grip / spring", "Low-moderate", "Tacking, jigs, small work", "Speed over force"]
      ],
      faqs: [
        ["What clamps should I buy first?", "Parallel or bar clamps for panel and carcass glue-ups, then add quick-grip and spring clamps for holding."],
        ["Are pipe clamps worth it?", "Yes, for cheap long-reach force on wide panels; they are heavy and benefit from pads."],
        ["How many clamps do I need?", "Enough for even pressure across the joint; most glue-ups need more than beginners expect."],
        ["Why dry-fit before gluing?", "To confirm the joint closes square and to plan clamp placement before the glue starts curing."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (adhesive bonding)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on the clamping pressure and contact needed for strong glue bonds."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan square parts so glue-ups clamp up flat and true."]
      ]
    },
    checklist: ["Invest first in parallel and bar clamps.", "Use pipe clamps for cheap long reach.", "Keep quick and spring clamps for holding.", "Dry-fit and plan clamps before glue.", "Apply even pressure across the joint."]
  },
  {
    slug: "drawer-slides-types-and-sizing",
    category: "CutList",
    title: "Drawer Slides: Types and Sizing Explained",
    description: "Compare side-mount, undermount, and center slides, plus load ratings and the clearance they need, with charts to size drawer boxes that fit and glide.",
    kicker: "Hardware guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Slides Decide The Drawer Box Size", "Drawer slides are the hardware that makes a drawer glide, and their required clearance dictates how big the drawer box can be. Choosing the slide before cutting the box is essential, because each slide type demands a specific gap between the box and the cabinet. Build the box first and guess the slide, and the drawer will not fit."],
      ["Side-Mount Slides Are The Standard", "Ball-bearing side-mount slides are the common choice: reliable, easy to install, and widely available. They typically require a precise clearance on each side of the drawer box, often around half an inch, so the box is cut narrower than the opening by the total clearance. They show at the drawer sides but are simple and forgiving."],
      ["Undermount Slides Hide And Glide", "Undermount slides mount beneath the drawer and stay hidden, giving a clean look and often soft-close action. They demand tighter tolerances on box height, depth, and bottom placement, so they are less forgiving of a sloppy box. The payoff is a premium feel, but the cut list must match the slide's specifications closely."],
      ["Load Rating And Length Matter", "Slides are rated for a load and come in set lengths. A heavy drawer of tools needs a higher-rated slide than a light utensil drawer, and the slide length should match the cabinet depth. Undersizing the load rating leads to sagging, sticking drawers. Pick the rating and length before sizing the box and the cabinet depth."],
      ["Size The Box From The Slide Spec", "The reliable workflow is to choose the slide, read its clearance and length spec, then size the drawer box and cabinet opening to match. Use the cut list calculator to set box parts to the exact width the slide needs, and confirm the cabinet depth suits the slide length. Hardware first, box second, every time."]
    ],
    charts: [
      {
        title: "Drawer slide load rating by type (lb, approx)",
        caption: "Approximate load ratings. Heavy-duty side-mounts carry the most; light slides suit small drawers.",
        unit: " lb",
        bars: [["Light", 35], ["Standard", 75], ["Undermount", 90], ["Heavy-duty", 150]]
      },
      {
        title: "Side clearance needed by slide type (inches)",
        caption: "Total clearance to subtract from the opening for the drawer box width. Side-mounts need the most.",
        unit: " in",
        bars: [["Undermount", 0.3], ["Center", 0.5], ["Side-mount", 1]]
      }
    ],
    deepDive: {
      figureTitle: "Hardware first, drawer box second",
      figureCaption: "Each slide type needs specific clearance, so the slide spec sets the box dimensions.",
      figureStats: [["~1/2 in", "Common side-mount clearance per side"], ["Load rating", "Match to drawer weight"], ["Length", "Match to cabinet depth"]],
      comparisonTitle: "Drawer slide types",
      comparisonColumns: ["Slide", "Look", "Tolerance", "Best for"],
      comparisonRows: [
        ["Side-mount", "Visible at sides", "Forgiving", "Most drawers"],
        ["Undermount", "Hidden", "Tight", "Premium, soft-close"],
        ["Center-mount", "Mostly hidden", "Moderate", "Light traditional drawers"],
        ["Heavy-duty", "Visible", "Forgiving", "Tool and pantry drawers"]
      ],
      faqs: [
        ["How do I size a drawer box for slides?", "Choose the slide, read its clearance spec, and cut the box narrower than the opening by the total clearance."],
        ["What clearance do side-mount slides need?", "Commonly about half an inch per side, so an inch total off the opening width; confirm your slide's spec."],
        ["Which slides are easiest to install?", "Side-mount ball-bearing slides are the most forgiving and widely available."],
        ["What load rating do I need?", "Match it to the drawer's contents; tool and pantry drawers need heavy-duty slides to avoid sag."]
      ],
      sources: [
        ["U.S. Access Board: ADA accessibility", "https://www.access-board.gov/", "Guidance on accessible storage and reach that informs drawer and hardware planning."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Size drawer box parts to the exact clearance your slides require."]
      ]
    },
    checklist: ["Choose the slide before cutting the box.", "Subtract the slide clearance from the opening.", "Match load rating to drawer weight.", "Match slide length to cabinet depth.", "Use undermount only with tight tolerances."]
  },
  {
    slug: "cabinet-hinges-explained",
    category: "CutList",
    title: "Cabinet Hinges Explained: Types and Overlay",
    description: "Understand European, overlay, and inset hinges, plus how door overlay and the cup bore affect your cut list, with charts to pick and bore hinges right.",
    kicker: "Hardware guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Hinges Decide How The Door Sits", "Cabinet hinges do more than swing the door; they determine whether it overlays the cabinet, sits inset, or splits a pair. The hinge type and overlay must be chosen before cutting doors, because they set the door size relative to the opening. Pick the hinge first, then size the doors to match, or they will not align."],
      ["European Cup Hinges Dominate Frameless", "European, or cup, hinges are the standard for frameless cabinets: concealed, adjustable in three directions, and easy to install once the cup hole is bored. Their three-way adjustment forgives small build errors, which is why they are so popular. They require a specific cup bore diameter and setback, so the door needs an accurately drilled hole."],
      ["Overlay Sets The Door Size", "Overlay is how much the door covers the cabinet opening: full overlay nearly hides the cabinet edge, half overlay shares an edge between two doors, and inset sits flush within the opening. The overlay you choose changes the door dimensions directly, so it must be locked before the doors are cut, not after."],
      ["Inset Doors Demand Precision", "Inset doors sit flush inside the frame for a classic look, but they leave a small reveal all around that must be even, which demands precise door sizing and hinge adjustment. They are less forgiving than overlay doors. If you choose inset, plan tighter tolerances and hinges designed for inset mounting."],
      ["Bore And Size From The Hinge Spec", "The reliable order is to pick the hinge and overlay, read the cup bore diameter and setback, then size and bore the doors to match. Use the cut list calculator to set door dimensions for your chosen overlay, and drill test holes in scrap to confirm the cup fit before boring finished doors."]
    ],
    charts: [
      {
        title: "Hinge adjustment directions by type (count)",
        caption: "European cup hinges adjust in three directions, forgiving small errors; basic hinges adjust less.",
        unit: "",
        bars: [["Butt", 0], ["Overlay basic", 1], ["Inset", 2], ["European cup", 3]]
      },
      {
        title: "Door overlay by style (inches, typical)",
        caption: "How much the door covers the opening edge. Full overlay hides the cabinet edge; inset sits flush.",
        unit: " in",
        bars: [["Inset", 0], ["Half overlay", 0.4], ["Full overlay", 0.6]]
      }
    ],
    deepDive: {
      figureTitle: "Hinge and overlay set the door size",
      figureCaption: "Choose the hinge type and overlay first, then size and bore the doors to match.",
      figureStats: [["3-way", "European hinge adjustment"], ["Cup bore", "Specific diameter and setback"], ["Overlay", "Sets the door dimensions"]],
      comparisonTitle: "Hinge types compared",
      comparisonColumns: ["Hinge", "Look", "Adjustability", "Best for"],
      comparisonRows: [
        ["European cup", "Concealed", "Three-way", "Frameless cabinets"],
        ["Overlay (face frame)", "Partly visible", "Some", "Face-frame cabinets"],
        ["Inset", "Flush, classic", "Moderate", "Traditional inset doors"],
        ["Butt / exposed", "Visible", "Little", "Decorative, simple doors"]
      ],
      faqs: [
        ["What hinge for frameless cabinets?", "European cup hinges, which are concealed and adjust in three directions to forgive small errors."],
        ["What is door overlay?", "How much the door covers the cabinet opening: full, half, or inset. It sets the door size."],
        ["Do hinges change my door cut list?", "Yes. The overlay you pick changes door dimensions, so choose it before cutting doors."],
        ["Are inset doors harder?", "Yes. They require an even reveal all around and precise sizing and hinge adjustment."]
      ],
      sources: [
        ["U.S. Access Board: ADA accessibility", "https://www.access-board.gov/", "Accessibility guidance relevant to cabinet door operation and hardware."],
        ["WoodCutTool kitchen cabinet cut list template", "/templates/kitchen-cabinet-cut-list/", "Size doors for your chosen overlay and hinge type."]
      ]
    },
    checklist: ["Choose hinge type and overlay first.", "Use European cup hinges for frameless.", "Let overlay set the door dimensions.", "Bore the cup hole to spec.", "Test the cup fit in scrap before doors."]
  },
  {
    slug: "measuring-and-marking-accuracy",
    category: "CutList",
    title: "Measuring and Marking for Accurate Cuts",
    description: "Cut accurate parts by measuring and marking right: knife versus pencil lines, reference faces, and avoiding cumulative error, with charts on precision.",
    kicker: "Shop technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Accuracy Starts Before The Saw", "The cleanest cut cannot fix a bad measurement. Accurate parts begin with careful measuring and marking, because every error there carries into the cut and stacks up across the assembly. Slowing down to measure twice, mark precisely, and reference from one face is what makes a project go together square and tight."],
      ["Knife Lines Beat Pencil Lines", "A pencil line has width, and that width is error. A marking knife scores a precise zero-width line and even gives the chisel or saw a tiny registration groove to start in. For joinery and fine work, knife lines are dramatically more accurate than pencil. Use a pencil for rough layout, but switch to a knife where the cut must be exact."],
      ["Reference From One Face And Edge", "Measuring every part from a single reference face and edge prevents errors from compounding. If you flip the workpiece or measure from different edges, small inconsistencies add up. Marking a reference face and always measuring from it keeps mating parts consistent, which is what makes joints align and assemblies stay square."],
      ["Beat Cumulative Error With Stops", "Measuring each repeated part by hand lets tiny errors accumulate across the set. A stop block or a story stick, marked once and used for every part, removes that cumulative drift so all the repeats match exactly. For anything cut in multiples, transferring marks from one master is far more accurate than re-measuring."],
      ["Marking Feeds The Cut List", "Good measuring and marking turn a cut list into accurate parts. Confirm your actual material sizes, mark reference faces, use a knife where precision counts, and use stops for repeats. Pair that discipline with the cut list calculator so the planned dimensions and the marked parts agree, and the project assembles without fighting."]
    ],
    charts: [
      {
        title: "Marking method precision (relative accuracy)",
        caption: "Higher is more precise. Knife lines and gauges beat a pencil line, whose width is built-in error.",
        unit: "",
        bars: [["Pencil", 50], ["Sharp pencil", 65], ["Marking gauge", 85], ["Marking knife", 95]]
      },
      {
        title: "Cumulative error over repeated parts (relative)",
        caption: "Measuring each part lets error grow; a stop block or story stick holds every repeat the same.",
        unit: "",
        bars: [["Measure each", 100], ["Tape mark", 60], ["Story stick", 25], ["Stop block", 10]]
      }
    ],
    deepDive: {
      figureTitle: "Precise marks make precise parts",
      figureCaption: "Knife lines, a single reference face, and stops for repeats keep error from stacking up.",
      figureStats: [["Knife line", "Zero-width and precise"], ["One reference", "Stops error compounding"], ["Stops", "Identical repeats"]],
      comparisonTitle: "Marking tools and uses",
      comparisonColumns: ["Tool", "Precision", "Best for", "Note"],
      comparisonRows: [
        ["Pencil", "Low", "Rough layout", "Line has width"],
        ["Marking knife", "High", "Joinery, exact cuts", "Scores a registration line"],
        ["Marking gauge", "High", "Parallel lines, joinery", "Repeatable settings"],
        ["Stop block", "High", "Repeated parts", "Removes cumulative error"]
      ],
      faqs: [
        ["Why use a marking knife over a pencil?", "A knife scores a zero-width line and a registration groove; a pencil line has width that becomes error."],
        ["How do I avoid measuring errors stacking up?", "Measure from one reference face and edge, and use stops or a story stick for repeats."],
        ["What is a story stick?", "A stick marked once with all key dimensions, used to transfer marks instead of re-measuring each part."],
        ["When is a pencil fine?", "For rough layout and non-critical marks; switch to a knife where the cut must be exact."]
      ],
      sources: [
        ["NIST: National Institute of Standards and Technology", "https://www.nist.gov/", "U.S. authority on measurement and metrology, the basis of accurate dimensioning."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Keep planned dimensions and marked parts in agreement."]
      ]
    },
    checklist: ["Measure twice before cutting.", "Use a marking knife for exact lines.", "Reference from one face and edge.", "Use stops for repeated parts.", "Confirm actual material sizes."]
  },
  {
    slug: "sanding-grits-and-sequence",
    category: "CutList",
    title: "Sanding Grits and Sequence, Explained",
    description: "Learn which sandpaper grits to use and in what order, why skipping grits wastes time, and where to stop, with charts to get a smooth finish efficiently.",
    kicker: "Finishing technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Sanding Is About Sequence, Not Just Effort", "Good sanding is a progression: each grit removes the scratches left by the one before it, so the surface gets steadily smoother. Skipping too far between grits leaves deep scratches the next paper cannot erase, while sanding too fine wastes time and can burnish the wood so it will not take stain. The right sequence is what produces a smooth, even surface efficiently."],
      ["Start Coarse Enough To Fix Flaws", "Begin at a grit coarse enough to level the real problems: mill marks, glue squeeze-out, and unevenness. Starting too fine just polishes the defects. For most prepared lumber and plywood, a medium coarse grit is the right entry point. Starting coarser than needed removes too much material; starting too fine never fixes the flaw."],
      ["Step Up Without Skipping Too Far", "Move up through grits in reasonable steps, roughly skipping no more than one grade at a time, so each paper can erase the previous scratches. Jumping from coarse straight to fine leaves scratches that show under finish. The progression feels slow but is faster overall, because you are not re-sanding to chase scratches you skipped past."],
      ["Know Where To Stop", "There is a point of diminishing returns. For surfaces taking a film finish, sanding to a medium-fine grit is usually enough; going finer can burnish the surface and reduce stain absorption, causing blotch. For oil finishes, a slightly finer stop can help. Stopping at the right grit matters as much as starting at the right one."],
      ["Sand Smart, Then Finish", "Sand with the grain, vacuum or wipe between grits so coarse particles do not scratch the next pass, and keep an offcut to test the finish. Pair good sanding with the right finish for the project. A well-sanded surface is the foundation every finish sits on, so the sequence is worth doing properly."]
    ],
    charts: [
      {
        title: "Sanding grit sequence for bare wood",
        caption: "Step up through grits without big jumps. Each removes the scratches from the one before.",
        unit: "",
        bars: [["80", 80], ["120", 120], ["150", 150], ["180", 180], ["220", 220]]
      },
      {
        title: "Where to stop by finish type (grit)",
        caption: "Stop finer for oils, coarser for film finishes and before staining to avoid burnishing.",
        unit: "",
        bars: [["Before stain", 150], ["Film finish", 180], ["Oil finish", 220], ["Between coats", 320]]
      }
    ],
    deepDive: {
      figureTitle: "Each grit erases the last one's scratches",
      figureCaption: "Start coarse enough to fix flaws, step up without skipping, and stop at the right grit.",
      figureStats: [["Start", "Coarse enough to level flaws"], ["Step up", "No big grit jumps"], ["Stop", "Match grit to finish"]],
      comparisonTitle: "Grit ranges and use",
      comparisonColumns: ["Grit range", "Job", "Use", "Note"],
      comparisonRows: [
        ["60-80", "Coarse", "Leveling, shaping", "Removes material fast"],
        ["100-150", "Medium", "Smoothing, pre-stain", "Workhorse range"],
        ["180-220", "Fine", "Final before finish", "Stop here for most film finishes"],
        ["320+", "Very fine", "Between finish coats", "Not for bare softwood"]
      ],
      faqs: [
        ["What grit should I start sanding with?", "Coarse enough to remove mill marks and flaws, often a medium coarse grit; starting too fine just polishes defects."],
        ["Can I skip grits?", "Skipping too far leaves scratches the next paper cannot remove. Step up without big jumps."],
        ["How fine should I sand before finishing?", "Often a medium-fine grit for film finishes; going too fine can burnish and reduce stain absorption."],
        ["Why vacuum between grits?", "Stray coarse particles will scratch the surface during finer passes, undoing your progress."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (finishing)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on surface preparation and sanding for wood finishing."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan parts and keep an offcut for sanding and finish tests."]
      ]
    },
    checklist: ["Start coarse enough to fix flaws.", "Step up grits without big jumps.", "Sand with the grain.", "Vacuum between grits.", "Stop at the right grit for your finish."]
  },
  {
    slug: "wood-moisture-content-and-drying",
    category: "CutList",
    title: "Wood Moisture Content and Drying Basics",
    description: "Understand moisture content, why green wood moves and cracks, target moisture for indoor work, and how to acclimate boards, with charts on drying.",
    kicker: "Material science",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Moisture Content Drives Wood Behavior", "How much water is in a board, its moisture content, determines whether it stays put or warps, cracks, and shrinks. Freshly cut green wood is full of water and moves a lot as it dries; properly dried wood is far more stable. Knowing the moisture content before you build is the difference between a project that lasts and one that splits."],
      ["Green, Air-Dried, And Kiln-Dried", "Green lumber is high in moisture and unstable for furniture. Air-dried lumber loses moisture over months to reach equilibrium with outdoor air. Kiln-dried lumber is brought down to a lower target moisture quickly and controllably, which is why most furniture stock is kiln-dried. Each state suits different work, but indoor projects want dried wood."],
      ["Target Moisture For Indoor Work", "Wood used indoors should be dried to roughly the moisture it will live at inside a heated home, often in the single-digit to low-teens percent range depending on climate. Building with wood wetter than its service environment guarantees movement as it finishes drying in place, opening joints and cracking panels. Match the wood to where it will live."],
      ["Acclimate Before You Build", "Even properly dried lumber should sit in the shop or the room where it will be used for a stretch so it reaches equilibrium with that environment before cutting joints. Acclimating prevents the board from moving after assembly. Stack boards with spacers for airflow and give them time; rushing this step is a common cause of later movement."],
      ["Plan For The Wood You Have", "Check moisture before building, ideally with a meter, and let the wood acclimate to its destination. Remember that plywood is far more stable than solid wood, so where movement is a risk, plywood or well-dried, acclimated lumber is the safer choice. Plan stable materials into the design, especially for wide panels and tight joints."]
    ],
    charts: [
      {
        title: "Moisture content by lumber state (percent)",
        caption: "Approximate moisture content. Green wood is far wetter; kiln-dried reaches a stable indoor range.",
        unit: "%",
        bars: [["Green", 50], ["Air-dried", 15], ["Kiln-dried", 8], ["Indoor target", 7]]
      },
      {
        title: "Relative movement risk by moisture gap (relative)",
        caption: "The bigger the gap between the wood's moisture and its service environment, the more it will move.",
        unit: "",
        bars: [["Acclimated", 10], ["Small gap", 35], ["Medium gap", 65], ["Green indoors", 100]]
      }
    ],
    deepDive: {
      figureTitle: "Dry it, then acclimate it",
      figureCaption: "Match wood moisture to where the piece will live, and let it acclimate before building.",
      figureStats: [["Kiln-dried", "Stable furniture stock"], ["Acclimate", "Equilibrate before cutting"], ["Plywood", "More stable than solid wood"]],
      comparisonTitle: "Lumber by drying state",
      comparisonColumns: ["State", "Moisture", "Stability", "Use"],
      comparisonRows: [
        ["Green", "High", "Poor, moves a lot", "Not for furniture"],
        ["Air-dried", "Moderate", "Better", "Some interior, outdoor"],
        ["Kiln-dried", "Low", "Good", "Furniture, cabinetry"],
        ["Acclimated", "At service level", "Best", "Ready to build"]
      ],
      faqs: [
        ["What moisture content should furniture wood be?", "Roughly the level it will live at indoors, often single digits to low teens percent depending on climate."],
        ["Why does green wood crack?", "It is full of water and shrinks unevenly as it dries, opening checks and warping."],
        ["Do I need to acclimate kiln-dried wood?", "Yes. Let it equilibrate to the room or shop before building so it does not move after assembly."],
        ["Is plywood affected by moisture like solid wood?", "Far less. Its cross-laminated construction keeps it stable, though it should still stay dry."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (moisture relations)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood moisture content, drying, and dimensional stability."],
        ["WoodCutTool board foot calculator", "/board-foot-calculator/", "Estimate lumber while planning for dried, acclimated stock."]
      ]
    },
    checklist: ["Check moisture content before building.", "Use kiln-dried stock for furniture.", "Match wood moisture to its service environment.", "Acclimate boards before cutting.", "Use plywood where movement is a risk."]
  },
  {
    slug: "plywood-storage-and-keeping-sheets-flat",
    category: "CutList",
    title: "Plywood Storage: Keeping Sheets Flat",
    description: "Store plywood so it stays flat and dry: vertical versus horizontal storage, support spacing, moisture control, and how to flatten a warped sheet.",
    kicker: "Shop technique",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Stored Wrong, Plywood Warps", "Plywood is stable when supported but will bow, cup, or twist if stored carelessly. A leaning sheet, an unsupported span, or a damp floor can ruin a panel before you cut it. Good storage keeps sheets flat and dry so they cut true and assemble square, protecting the money tied up in a stack of plywood."],
      ["Flat And Fully Supported Is Best", "The flattest storage is horizontal on a fully supported, level surface, so the sheet has no chance to sag. Stacking sheets flat on a flat base keeps them true. The enemy is an unsupported middle: a sheet bridging a gap will sag over time under its own weight, especially in a warm shop."],
      ["Vertical Storage Saves Space", "When floor space is tight, vertical storage works if the sheets stand nearly upright against a flat surface, not leaning at an angle. A shallow lean lets gravity bow the panel. Keep sheets close to vertical, fully backed, and off a damp floor with a rail or spacer underneath. Vertical is a fine compromise when done correctly."],
      ["Control Moisture", "Plywood absorbs moisture from a damp floor or humid air, which causes warping and can affect the glue over time. Keep sheets off concrete with spacers, store them in a dry space, and avoid wide swings in humidity. A panel stored damp on one face cups toward the dry side, so even drying and a dry environment matter."],
      ["Flattening A Warped Sheet", "A mildly cupped sheet can sometimes be coaxed flat by storing it flat with even weight, or by exposing the concave side to even moisture and letting it equilibrate. Severe warps may never fully recover. The better strategy is prevention: store flat, support fully, keep dry, and a sheet stays ready to cut into accurate parts."]
    ],
    charts: [
      {
        title: "Warp risk by storage method (relative)",
        caption: "Flat and fully supported is safest; an angled lean and a damp floor are the worst for warping.",
        unit: "",
        bars: [["Flat supported", 10], ["Near-vertical", 30], ["Leaning", 70], ["Damp floor", 90]]
      },
      {
        title: "Max unsupported span before sag (relative)",
        caption: "Thicker sheets tolerate a wider unsupported span; thin panels sag over short gaps.",
        unit: "",
        bars: [["1/4 in", 20], ["1/2 in", 45], ["3/4 in", 70], ["Full support", 100]]
      }
    ],
    deepDive: {
      figureTitle: "Flat, supported, and dry",
      figureCaption: "Keep sheets flat and fully supported, near-vertical if space is tight, and always off a damp floor.",
      figureStats: [["Flat", "Best, fully supported"], ["Near-vertical", "Space-saving if upright"], ["Dry", "Off the concrete floor"]],
      comparisonTitle: "Storage options",
      comparisonColumns: ["Method", "Flatness", "Space", "Note"],
      comparisonRows: [
        ["Flat, supported", "Best", "Uses floor area", "Fully back the stack"],
        ["Near-vertical", "Good", "Space-saving", "Keep nearly upright"],
        ["Leaning", "Poor", "Space-saving", "Gravity bows the sheet"],
        ["On damp floor", "Poor", "Any", "Absorbs moisture, cups"]
      ],
      faqs: [
        ["How should I store plywood?", "Flat and fully supported is best; near-vertical works if sheets stay nearly upright and off a damp floor."],
        ["Why did my plywood warp?", "Usually an unsupported span, an angled lean, or moisture from a damp floor or humid air."],
        ["Can I flatten warped plywood?", "Mild cupping may improve with flat storage and even moisture; severe warps often will not fully recover."],
        ["Does plywood need to be off the floor?", "Yes. Keep it off concrete with spacers to avoid absorbing moisture and cupping."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Guidance on handling and storing engineered wood panels to maintain flatness."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan cuts from flat, true sheets for accurate parts."]
      ]
    },
    checklist: ["Store sheets flat and fully supported.", "Keep vertical storage nearly upright.", "Get sheets off a damp concrete floor.", "Store in a dry, stable environment.", "Prevent warp rather than fixing it."]
  },
  {
    slug: "shop-layout-and-workflow-design",
    category: "CutList",
    title: "Shop Layout and Workflow Design",
    description: "Lay out a small woodworking shop around how work flows: from sheet storage to breakdown, assembly, finishing, and dust control, with charts on space.",
    kicker: "Workshop planning",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Design The Shop Around The Workflow", "A good shop is laid out around how material moves: in as sheets and boards, through breakdown and cutting, into assembly, then finishing, and out as a project. When the layout follows that flow, you waste less time carrying parts back and forth. Even a small shop works well if the stations sit in a sensible order."],
      ["Put The Table Saw At The Heart", "The table saw is usually the center of a shop because so much work passes through it, and it needs clear space for infeed and outfeed to handle sheets and long boards safely. Placing it centrally with room on all sides lets you break down and rip without obstruction. Most other stations arrange around it."],
      ["Plan Infeed, Outfeed, And Assembly Space", "Cutting needs room before and after the blade; assembly needs an open, flat surface; finishing needs a dust-free corner. Skimping on these is the most common small-shop mistake. A folding outfeed table, a mobile assembly bench, and a separate finishing zone keep the workflow smooth without demanding a huge footprint."],
      ["Mobility Makes Small Shops Work", "In a tight space, mobile bases let tools roll out for use and tuck away after, effectively giving one footprint multiple uses. A shared driveway or single-car garage shop lives or dies on mobility and folding surfaces. Plan which tools move and where they park, so the shop reconfigures quickly for each task."],
      ["Build Dust And Storage Into The Plan", "Dust collection and material storage are part of the layout, not afterthoughts. Route collection to the tools that make the most dust, and store sheets and offcuts where they are reachable but out of the work path. A clean, organized shop with a sensible flow is safer, faster, and far more pleasant to work in."]
    ],
    charts: [
      {
        title: "Clearance to plan around the table saw (feet)",
        caption: "Approximate clear space for safe sheet and board handling. Infeed and outfeed need the most room.",
        unit: " ft",
        bars: [["Sides", 3], ["Infeed", 8], ["Outfeed", 8], ["Rip width", 4]]
      },
      {
        title: "Shop space priority by station (relative)",
        caption: "Where to spend limited floor area. Cutting and assembly need the most; finishing can be compact.",
        unit: "",
        bars: [["Cutting", 90], ["Assembly", 80], ["Storage", 55], ["Finishing", 45], ["Bench", 60]]
      }
    ],
    deepDive: {
      figureTitle: "Material flows in one direction",
      figureCaption: "Storage to breakdown to assembly to finishing, with the table saw central and tools mobile.",
      figureStats: [["Flow", "In, cut, assemble, finish, out"], ["Table saw", "Central with infeed and outfeed"], ["Mobility", "Multiplies a small footprint"]],
      comparisonTitle: "Shop station needs",
      comparisonColumns: ["Station", "Space need", "Priority", "Note"],
      comparisonRows: [
        ["Sheet breakdown", "Large", "High", "Track saw or saw with room"],
        ["Table saw", "Large, clear sides", "High", "Central, infeed and outfeed"],
        ["Assembly", "Open flat surface", "High", "Mobile bench helps"],
        ["Finishing", "Dust-free corner", "Moderate", "Keep separate from cutting"]
      ],
      faqs: [
        ["How do I lay out a small shop?", "Arrange stations to follow the workflow: storage, breakdown, cutting, assembly, finishing, with mobile tools."],
        ["Where should the table saw go?", "Usually central, with clear infeed and outfeed space to handle sheets and long boards safely."],
        ["How much space does a table saw need?", "Enough infeed and outfeed to support full sheets and long rips, plus clearance at the sides."],
        ["How do I fit a shop in a garage?", "Use mobile bases and folding surfaces so tools roll out to use and tuck away after."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Safety guidance on machine spacing, material handling, and shop setup."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan breakdown cuts that suit your shop's space and flow."]
      ]
    },
    checklist: ["Lay out stations to follow the workflow.", "Place the table saw central with clear space.", "Plan infeed, outfeed, and assembly room.", "Use mobile bases in tight shops.", "Build dust and storage into the layout."]
  },
  {
    slug: "estimating-project-cost-materials-hardware",
    category: "CutList",
    title: "Estimating Project Cost: Materials and Hardware",
    description: "Build an honest woodworking budget: sheet goods, lumber, hardware, finish, and a contingency, with charts showing where the money actually goes.",
    kicker: "Cost planning",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["A Real Budget Is More Than Sheet Goods", "Woodworkers often budget the plywood and forget the rest, then get surprised at checkout. A complete estimate includes sheet goods, solid lumber, hardware, fasteners, glue, finish, and a contingency for mistakes. Listing every category up front turns a rough guess into a budget you can trust, and shows where a design is quietly expensive."],
      ["Sheet Goods And Lumber", "Material is usually the largest line. Estimate sheet count from a real layout and price it by grade, then add solid lumber by board foot for edges, face frames, and trim. Using a cheaper grade on hidden parts and a thinner panel where load allows is where material savings live. The plywood and board foot calculators turn parts into real quantities."],
      ["Hardware Adds Up Fast", "Hardware is the line people underestimate. Drawer slides, hinges, knobs, pulls, and shelf pins add up quickly across a cabinet project, sometimes rivaling the cost of the wood. List every piece of hardware and its quantity early, because a kitchen's worth of soft-close slides and hinges is a serious number that belongs in the budget from the start."],
      ["Finish, Fasteners, And Consumables", "Glue, screws, sandpaper, and finish are easy to overlook but real. A quart of quality finish, a box of screws, and several sanding discs are modest individually but add up. Including consumables keeps the estimate honest, and choosing the finish early lets you price it rather than discovering the cost at the end."],
      ["Add A Contingency", "Mistakes happen: a miscut part, a wrong hardware order, a damaged sheet. A sensible contingency, often around ten to fifteen percent, absorbs those without blowing the budget. Build the estimate by category, add the contingency, and you have a number you can commit to. Then track actual versus estimate to improve the next project's budget."]
    ],
    charts: [
      {
        title: "Where the budget goes: a cabinet project (percent)",
        caption: "Approximate cost shares for a cabinet build. Hardware and finish are bigger than many expect.",
        unit: "%",
        bars: [["Sheet goods", 40], ["Lumber", 15], ["Hardware", 25], ["Finish", 10], ["Contingency", 10]]
      },
      {
        title: "Relative total cost by project (index)",
        caption: "Indexed total cost. Hardware-heavy projects like kitchens cost far more than simple shelving.",
        unit: "",
        bars: [["Shelf", 15], ["Bookcase", 35], ["Dresser", 70], ["Kitchen", 100]]
      }
    ],
    deepDive: {
      figureTitle: "Estimate every category, then add contingency",
      figureCaption: "Sheet goods, lumber, hardware, finish, and consumables, plus a buffer for mistakes.",
      figureStats: [["Material", "Usually the largest line"], ["Hardware", "Underestimated and rising"], ["~10-15%", "Sensible contingency"]],
      comparisonTitle: "Budget categories",
      comparisonColumns: ["Category", "Typical share", "Save by", "Note"],
      comparisonRows: [
        ["Sheet goods", "Large", "Grade per part", "Estimate from a real layout"],
        ["Hardware", "Often large", "Choosing standard parts", "Slides, hinges add up"],
        ["Finish + consumables", "Small but real", "Buying in bulk", "Easy to forget"],
        ["Contingency", "10-15%", "Careful cutting", "Absorbs mistakes"]
      ],
      faqs: [
        ["What should a woodworking budget include?", "Sheet goods, lumber, hardware, fasteners, glue, finish, and a contingency for mistakes."],
        ["Why is hardware easy to underestimate?", "Slides, hinges, and pulls add up fast across a project and can rival the cost of the wood."],
        ["How much contingency should I add?", "Often around ten to fifteen percent to cover miscuts, damaged material, and wrong orders."],
        ["How do I estimate material cost?", "Get a real sheet count and board feet from a layout, then price by grade and species."]
      ],
      sources: [
        ["U.S. Bureau of Labor Statistics: Producer Price Index", "https://www.bls.gov/ppi/", "Official U.S. data on lumber and material price trends for realistic budgeting."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Turn parts into a real sheet count to anchor the material budget."]
      ]
    },
    checklist: ["Budget every category, not just plywood.", "Estimate sheet goods from a real layout.", "List all hardware and quantities early.", "Include finish and consumables.", "Add a sensible contingency."]
  },
  {
    slug: "tool-maintenance-schedule-for-woodworkers",
    category: "CutList",
    title: "Tool Maintenance Schedule for Woodworkers",
    description: "Keep saws, blades, and bits cutting clean with a simple maintenance schedule covering blade cleaning, alignment, lubrication, and dust, with charts on timing.",
    kicker: "Shop care",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Maintained Tools Cut Cleaner And Safer", "A dull, dirty, or misaligned tool burns wood, wanders off the line, and is more dangerous to use. Most cutting problems people blame on technique are really maintenance problems. A simple, regular schedule for cleaning, sharpening, aligning, and lubricating keeps tools accurate and safe, and it costs far less than replacing parts worn out by neglect."],
      ["Clean Blades And Bits Often", "Pitch and resin build up on blades and router bits, increasing friction, heat, and tearout. A blade that seems dull is often just dirty. Cleaning blades and bits with a proper cleaner restores performance instantly and is one of the highest-value, lowest-effort maintenance tasks. Do it whenever cuts start to burn or feel harder."],
      ["Check Alignment Periodically", "A table saw blade parallel to the miter slots and a fence parallel to the blade are the foundation of accurate, safe cuts. Alignment drifts over time and after moving a saw. Checking it periodically, and after any knock, prevents the gradual creep that causes binding, burning, and unsafe kickback. Alignment is invisible until it bites."],
      ["Lubricate And Protect Surfaces", "Cast-iron tops rust, screws stiffen, and slides gum up without care. Wax and protect bare metal surfaces, lubricate moving parts lightly, and keep tools dry. A waxed table top also lets stock slide smoothly, improving both accuracy and safety. These small habits extend tool life and keep everything moving as it should."],
      ["Build A Simple Routine", "You do not need a complex program. Clean blades when cuts deteriorate, check alignment monthly or after moves, wax surfaces seasonally, and sharpen or replace blades when cleaning no longer helps. Pair maintained tools with good planning from the cut list calculator, and the whole workflow stays accurate, smooth, and safe."]
    ],
    charts: [
      {
        title: "Suggested maintenance interval by task (days)",
        caption: "Approximate intervals. Clean blades on demand; check alignment monthly; wax surfaces seasonally.",
        unit: " d",
        bars: [["Blade clean", 14], ["Alignment", 30], ["Lubricate", 60], ["Wax top", 90]]
      },
      {
        title: "Cut quality impact of neglect (relative)",
        caption: "How much each neglected task degrades cut quality and safety. Dull blades and misalignment hurt most.",
        unit: "",
        bars: [["Dull blade", 95], ["Misaligned", 85], ["Dirty blade", 70], ["Rusty top", 45]]
      }
    ],
    deepDive: {
      figureTitle: "Small habits, accurate tools",
      figureCaption: "Clean blades on demand, check alignment regularly, and protect surfaces to keep cuts clean and safe.",
      figureStats: [["Clean", "Restores a dirty blade fast"], ["Align", "Check after every move"], ["Wax", "Smooth, rust-free tops"]],
      comparisonTitle: "Maintenance tasks",
      comparisonColumns: ["Task", "When", "Effort", "Payoff"],
      comparisonRows: [
        ["Clean blade/bit", "On demand", "Low", "Instant cut improvement"],
        ["Check alignment", "Monthly, after moves", "Moderate", "Accuracy and safety"],
        ["Lubricate moving parts", "Periodic", "Low", "Smooth operation"],
        ["Wax cast iron", "Seasonal", "Low", "No rust, smooth feed"]
      ],
      faqs: [
        ["Why does my saw burn the wood?", "Often a dirty or dull blade, or a misaligned fence. Clean the blade first, then check alignment."],
        ["How often should I clean blades?", "Whenever cuts start to burn or feel harder; pitch buildup mimics dullness."],
        ["How do I keep a cast-iron top from rusting?", "Keep it dry, and wax it seasonally; the wax also helps stock slide smoothly."],
        ["When should I replace a blade?", "When cleaning and sharpening no longer restore clean cuts, or teeth are damaged."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Safety guidance covering machine maintenance, guarding, and safe operation."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Pair maintained tools with accurate cut planning."]
      ]
    },
    checklist: ["Clean blades and bits when cuts degrade.", "Check alignment monthly and after moves.", "Lubricate moving parts lightly.", "Wax cast-iron tops seasonally.", "Sharpen or replace blades when cleaning fails."]
  },
  {
    slug: "table-saw-setup-and-safety-checklist",
    category: "CutList",
    title: "Table Saw Setup and Safety Checklist",
    description: "Set up a table saw for safe, accurate cuts: blade height, riving knife, fence alignment, push sticks, and kickback prevention, with charts on the key settings.",
    kicker: "Shop safety",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["The Table Saw Demands Respect", "The table saw is the most useful and the most dangerous tool in many shops, responsible for a large share of serious woodworking injuries, most from kickback or blade contact. The good news is that nearly all of these are preventable with correct setup and disciplined habits. A few minutes of setup and a consistent routine make the saw both safer and more accurate."],
      ["Set Blade Height And Use The Riving Knife", "Blade height is a small but real safety factor: a common approach sets the blade just above the stock so less blade is exposed. The riving knife, which sits behind the blade and keeps the kerf open, is one of the single most effective anti-kickback devices. Use it for every through cut; do not remove it out of convenience."],
      ["Align The Fence And Blade", "The fence must be parallel to the blade, or slightly angled away at the back, never toed in toward the blade, which causes binding and kickback. A blade parallel to the miter slots and a properly aligned fence are the foundation of safe ripping. Check alignment regularly, because it drifts and is invisible until a cut binds."],
      ["Use Push Sticks And Stand Clear", "Hands should never pass near the blade. Use push sticks and push blocks for narrow rips, keep the guard on when possible, and stand out of the direct line behind the blade where kickback throws stock. Most table saw injuries happen during narrow rips and freehand cuts; push sticks and stance prevent both."],
      ["Run Through The Checklist Every Time", "Before each session, confirm the riving knife is in, the blade is sharp and clean, the fence is aligned and locked, the area is clear, and push sticks are within reach. Plan the cut before the blade spins, and never freehand against the fence and blade at once. A consistent checklist turns safety into a habit."]
    ],
    charts: [
      {
        title: "Table saw injury causes (relative share)",
        caption: "Most table saw injuries come from kickback and blade contact, both preventable with setup and habits.",
        unit: "",
        bars: [["Kickback", 40], ["Blade contact", 35], ["Freehand", 15], ["Other", 10]]
      },
      {
        title: "Anti-kickback measure effectiveness (relative)",
        caption: "Relative protection from each measure. The riving knife and a properly aligned fence matter most.",
        unit: "",
        bars: [["Riving knife", 90], ["Fence aligned", 80], ["Push stick", 70], ["Blade guard", 65]]
      }
    ],
    deepDive: {
      figureTitle: "Setup plus habits prevent injury",
      figureCaption: "Riving knife, aligned fence, push sticks, and a clear stance remove the main kickback and contact risks.",
      figureStats: [["Riving knife", "Top anti-kickback device"], ["Fence parallel", "Never toed toward the blade"], ["Push sticks", "Keep hands clear"]],
      comparisonTitle: "Setup checklist",
      comparisonColumns: ["Item", "Setting", "Why", "Note"],
      comparisonRows: [
        ["Riving knife", "Installed", "Keeps kerf open", "Use every through cut"],
        ["Fence", "Parallel or out at rear", "Prevents binding", "Never toe in"],
        ["Blade", "Sharp, clean, low", "Clean cuts, less exposure", "Check before each session"],
        ["Push sticks", "Within reach", "Hands clear of blade", "Always for narrow rips"]
      ],
      faqs: [
        ["What causes table saw kickback?", "Stock binding between the blade and fence, a missing riving knife, or a toed-in fence. Setup prevents most of it."],
        ["What is a riving knife for?", "It sits behind the blade and keeps the kerf open so stock cannot pinch and kick back."],
        ["How high should the blade be?", "A common approach sets it just above the stock to limit blade exposure; follow your saw's guidance."],
        ["How do I rip narrow stock safely?", "Use push sticks and blocks, keep the guard on, and stand out of the kickback line."]
      ],
      sources: [
        ["OSHA: Woodworking eTool - Table Saws", "https://www.osha.gov/etools/woodworking/table-saws", "Official safety guidance for table saw operation, guarding, and kickback prevention."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan cuts in advance so you avoid awkward, unsafe setups."]
      ]
    },
    checklist: ["Install and keep the riving knife.", "Align the fence parallel to the blade.", "Keep the blade sharp, clean, and low.", "Use push sticks for narrow rips.", "Run the checklist before every session."]
  },
  {
    slug: "spray-vs-brush-finishing-compared",
    category: "CutList",
    title: "Spray vs Brush Finishing, Compared",
    description: "Compare spraying and brushing wood finish on smoothness, speed, equipment, and waste, with charts to choose the right method for your project and shop.",
    kicker: "Finishing technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["How You Apply Finish Changes The Result", "The same finish looks different brushed versus sprayed. Brushing is simple and cheap but can leave brush marks; spraying lays down a smooth, even film fast but needs equipment, setup, and overspray control. Choosing the application method is part of planning the finish, not an afterthought, because it affects smoothness, time, and how much finish you waste."],
      ["Brushing Is Simple And Low-Waste", "A brush needs almost no equipment, wastes little finish, and works anywhere. With good technique and a finish that levels well, brushing produces excellent results on flat panels and trim. Its weaknesses are brush marks, slower coverage on large areas, and difficulty on complex shapes. For small projects and occasional work, brushing is hard to beat on simplicity."],
      ["Spraying Is Fast And Smooth", "Spraying atomizes finish into a fine, even coat that self-levels into a glass-smooth surface, and it covers large areas and complex parts quickly. The cost is equipment, a dust-free spray area, masking, and overspray, plus more finish wasted to the air. For cabinets, doors, and production work, spraying's speed and finish quality justify the setup."],
      ["Count The Hidden Costs", "Spraying wastes more material to overspray and demands ventilation, masking, and cleanup; brushing wastes little but costs time and can show marks. Factor equipment, finish waste, and labor into the choice, not just the look. A small project rarely justifies spray setup, while a kitchen of doors rarely justifies brushing them all by hand."],
      ["Match The Method To The Job", "Brush small projects, trim, and touch-ups; spray cabinets, doors, and large or complex pieces where smoothness and speed pay off. Test your finish and method on an offcut first, because finishes behave differently sprayed versus brushed. Plan the application into the project so the finishing step goes smoothly."]
    ],
    charts: [
      {
        title: "Finish smoothness by method (relative)",
        caption: "Relative surface smoothness. Spraying self-levels best; brushing can leave marks without good technique.",
        unit: "",
        bars: [["Brush rough", 50], ["Brush good", 75], ["Wipe-on", 80], ["Spray", 95]]
      },
      {
        title: "Coverage speed and finish waste (relative)",
        caption: "Spraying covers fastest but wastes more to overspray; brushing is slow but wastes little.",
        unit: "",
        bars: [["Brush speed", 40], ["Spray speed", 90], ["Brush waste", 15], ["Spray waste", 60]]
      }
    ],
    deepDive: {
      figureTitle: "Smoothness and speed versus setup and waste",
      figureCaption: "Spraying wins on smoothness and speed; brushing wins on simplicity and low waste.",
      figureStats: [["Brush", "Simple, low-waste, slower"], ["Spray", "Smooth, fast, more setup"], ["Test", "On an offcut first"]],
      comparisonTitle: "Spray vs brush",
      comparisonColumns: ["Factor", "Brush", "Spray", "Edge"],
      comparisonRows: [
        ["Smoothness", "Can show marks", "Glass-smooth", "Spray"],
        ["Speed", "Slow on large areas", "Fast", "Spray"],
        ["Equipment", "Minimal", "Sprayer, booth, masking", "Brush"],
        ["Finish waste", "Low", "Higher overspray", "Brush"]
      ],
      faqs: [
        ["Is spraying or brushing better?", "Spraying is smoother and faster but needs equipment and wastes more; brushing is simple and low-waste but slower."],
        ["When should I brush instead of spray?", "For small projects, trim, and touch-ups where spray setup is not worth it."],
        ["Why does my brushed finish show marks?", "Technique and a finish that does not level. Use a leveling finish, the right brush, and thin coats."],
        ["Does spraying waste finish?", "Yes, to overspray. Budget more finish and control overspray with masking and ventilation."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (finishing)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood finishing methods, application, and coatings."],
        ["WoodCutTool plywood cut calculator", "/plywood-cut-calculator/", "Plan parts and keep an offcut to test the finish and method."]
      ]
    },
    checklist: ["Choose application method as part of the finish plan.", "Brush small projects and touch-ups.", "Spray cabinets, doors, and large parts.", "Budget for overspray waste when spraying.", "Test the method on an offcut first."]
  },
  {
    slug: "common-wood-species-and-uses",
    category: "CutList",
    title: "Common Wood Species and Their Uses",
    description: "Get to know pine, oak, maple, walnut, and poplar by hardness, cost, and best use, with charts to choose the right species for your woodworking project.",
    kicker: "Material guide",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Species Sets Look, Strength, And Cost", "Choosing a wood species is choosing a look, a hardness, a workability, and a price all at once. Pine is cheap and soft; maple is hard and pale; walnut is rich and pricey. Knowing a handful of common species and what each is good at lets you pick the right wood for the project instead of buying by guess or by what is on the shelf."],
      ["Softwoods: Pine, Fir, Cedar", "Softwoods come from conifers and are generally lighter, cheaper, and easier to cut. Pine is the everyday choice for shelving, paint-grade work, and practice pieces. Fir is stronger for structural work. Cedar resists decay and suits outdoor projects. Softwoods dent easily, so they shine where cost and workability matter more than a hard, perfect surface."],
      ["Hardwoods: Oak, Maple, Walnut, Cherry", "Hardwoods come from broadleaf trees and are usually denser, stronger, and finer for furniture. Oak is strong with a bold grain; maple is hard and pale, great for surfaces that take wear; walnut is dark and prized for fine furniture; cherry darkens beautifully with age. They cost more and dull blades faster, but they finish to a richer result."],
      ["Poplar And The Paint-Grade Niche", "Poplar is technically a hardwood but is soft, inexpensive, and stable, which makes it the favorite paint-grade hardwood. It machines cleanly and takes paint well, so it is ideal for painted furniture, trim, and built-ins where the grain will be hidden. Knowing this niche prevents overpaying for a premium species on parts that will be painted."],
      ["Match Species To The Part And Budget", "As with sheet goods, the smart move is to match species to the part: softwood or poplar for hidden and paint-grade work, premium hardwood for visible surfaces that must wear and impress. Estimate board feet and cost per species so you spend on hardwood only where it shows. Plan species into the cut list before buying."]
    ],
    charts: [
      {
        title: "Janka hardness by species (lbf, approx)",
        caption: "Approximate hardness. Harder species resist denting; softer ones are easier to work and cheaper.",
        unit: "",
        bars: [["Pine", 420], ["Poplar", 540], ["Cherry", 950], ["Walnut", 1010], ["Oak", 1290], ["Maple", 1450]]
      },
      {
        title: "Relative cost by species (pine = 100)",
        caption: "Indexed cost. Premium hardwoods like walnut cost many times more than pine or poplar.",
        unit: "",
        bars: [["Pine", 100], ["Poplar", 130], ["Oak", 220], ["Maple", 240], ["Cherry", 300], ["Walnut", 450]]
      }
    ],
    deepDive: {
      figureTitle: "Right species for the right part",
      figureCaption: "Hardness, cost, and look vary widely. Spend on hardwood where it shows and wears.",
      figureStats: [["Softwood", "Cheap, easy, dents"], ["Hardwood", "Dense, rich, costs more"], ["Poplar", "Paint-grade favorite"]],
      comparisonTitle: "Common species",
      comparisonColumns: ["Species", "Hardness", "Cost", "Best use"],
      comparisonRows: [
        ["Pine", "Soft", "Low", "Shelving, paint-grade, practice"],
        ["Poplar", "Soft hardwood", "Low", "Painted furniture and trim"],
        ["Oak / maple", "Hard", "Moderate", "Furniture, high-wear surfaces"],
        ["Walnut / cherry", "Medium-hard", "High", "Fine, visible furniture"]
      ],
      faqs: [
        ["What is the cheapest wood for furniture?", "Pine and poplar are inexpensive; poplar is the go-to paint-grade hardwood for painted pieces."],
        ["What wood is best for painted furniture?", "Poplar: stable, smooth-machining, and it takes paint well, so the grain stays hidden."],
        ["Which hardwood is hardest?", "Among common species, maple and oak rate high on the Janka hardness scale."],
        ["How do I choose a species?", "Match it to the part: cheap softwood or poplar for hidden and painted parts, premium hardwood for visible wear."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Authoritative reference on wood species properties, hardness, and strength."],
        ["WoodCutTool board foot calculator", "/board-foot-calculator/", "Estimate board feet and cost per species before buying."]
      ]
    },
    checklist: ["Match species to look, strength, and budget.", "Use softwood for cost and easy work.", "Use poplar for paint-grade parts.", "Use premium hardwood for visible wear.", "Estimate cost per species first."]
  },
  {
    slug: "planing-and-flattening-rough-lumber",
    category: "CutList",
    title: "Planing and Flattening Rough Lumber",
    description: "Turn rough or cupped boards into flat, square stock: the face-edge-thickness sequence, jointer and planer roles, and how much to allow, with charts.",
    kicker: "Milling technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Flat, Square Stock Is The Foundation", "Accurate joinery starts with flat, square boards. Rough or cupped lumber that is cut and joined as-is produces twisted assemblies and gaps. Milling rough stock flat and square, in the right sequence, is the unglamorous step that makes everything after it work. Skipping it is why many projects fight the builder at assembly."],
      ["The Milling Sequence Matters", "There is a proven order: flatten one face, then make one edge square to that face, then bring the board to final thickness, and finally rip to width. Doing these out of order, such as thicknessing before a face is flat, just transfers the warp. Following the face-edge-thickness-width sequence is what reliably produces square stock."],
      ["Jointer Flattens, Planer Thicknesses", "The jointer creates a flat reference face and a square edge; the planer makes the opposite face parallel to bring the board to thickness. They are not interchangeable: a planer alone will not flatten a cupped board, it will just make a thinner cupped board. Understanding which machine does what is key to milling stock correctly."],
      ["Allow Extra Material And Time", "Milling removes material, so rough stock must be bought thicker and longer than the finished part, and boards should rest after rough milling to let internal stresses settle before final passes. Plan a thickness allowance and a little time. Trying to mill a board to exactly its finished size in one go usually ends in a part that is too thin or still not flat."],
      ["Mill, Then Cut To The List", "Flatten and square your stock first, then cut parts to the cut list from known-flat material. Hand-tool methods can substitute for machines but follow the same logic. Plan the milling allowance into the board foot estimate so you buy enough rough stock. Flat, square parts are what make the rest of the build go together cleanly."]
    ],
    charts: [
      {
        title: "Milling sequence steps in order",
        caption: "The proven order: flatten a face, square an edge, thickness, then rip to width. Order prevents transferring warp.",
        unit: "",
        bars: [["1 Face", 1], ["2 Edge", 2], ["3 Thickness", 3], ["4 Width", 4]]
      },
      {
        title: "Thickness allowance for milling rough stock (inches)",
        caption: "Approximate material to allow above finished thickness so milling can flatten and clean both faces.",
        unit: " in",
        bars: [["Light cup", 0.125], ["Typical", 0.1875], ["Heavy warp", 0.3125]]
      }
    ],
    deepDive: {
      figureTitle: "Face, edge, thickness, width",
      figureCaption: "Follow the sequence and use the right machine for each step to produce flat, square stock.",
      figureStats: [["Jointer", "Flattens face and edge"], ["Planer", "Brings to thickness"], ["Allowance", "Buy thicker than finished"]],
      comparisonTitle: "Milling machines and roles",
      comparisonColumns: ["Step", "Machine", "Result", "Note"],
      comparisonRows: [
        ["Flatten face", "Jointer", "Flat reference face", "Not a planer job"],
        ["Square edge", "Jointer", "Edge square to face", "Reference off flat face"],
        ["Thickness", "Planer", "Parallel faces", "Removes to final thickness"],
        ["Rip width", "Table saw", "Final width", "Off the square edge"]
      ],
      faqs: [
        ["Why mill rough lumber first?", "To make it flat and square. Cutting and joining warped stock produces twisted, gappy assemblies."],
        ["Can a planer flatten a cupped board?", "No. A planer makes faces parallel; it will thin a cupped board without flattening it. Use a jointer first."],
        ["What is the right milling order?", "Flatten a face, square an edge, thickness the board, then rip to width."],
        ["How much extra thickness should I buy?", "Allow enough above finished thickness to clean both faces, more for warped stock."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (machining)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on machining wood to flat, square dimensions."],
        ["WoodCutTool board foot calculator", "/board-foot-calculator/", "Estimate rough stock with a milling allowance built in."]
      ]
    },
    checklist: ["Mill rough stock flat and square first.", "Follow face, edge, thickness, width order.", "Use the jointer to flatten, planer to thickness.", "Buy stock thicker and longer than finished.", "Let boards rest between rough and final passes."]
  },
  {
    slug: "drilling-pilot-holes-and-countersinks",
    category: "CutList",
    title: "Drilling Pilot Holes and Countersinks Right",
    description: "Stop splitting wood and stripping screws: how to size pilot holes, when to countersink or counterbore, and bit choices, with charts on drill sizes.",
    kicker: "Joinery technique",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Pilot Holes Prevent Splits And Strips", "Driving a screw without a pilot hole, especially near an edge or end grain, wedges the wood apart and splits it, or strips out and fails to hold. A correctly sized pilot hole gives the threads wood to bite while relieving the pressure that causes splits. For plywood edges and hardwoods particularly, pilot holes are not optional, they are the difference between a tight joint and a cracked part."],
      ["Size The Pilot To The Screw And Wood", "A pilot hole should match the screw's shank and the wood's hardness: roughly the size of the screw's solid core so the threads still bite, slightly larger in hard wood, slightly smaller in soft. Too small splits the wood; too large strips the threads. Matching pilot size to screw and species is the core skill, and a simple drill-size chart removes the guesswork."],
      ["Countersink For Flush Heads", "A countersink cuts a cone so a flat-head screw sits flush or just below the surface instead of standing proud. Driving a flat head without a countersink either leaves it proud or crushes the wood around it. A combination countersink bit drills the pilot and the cone in one step, which is fast and keeps the two aligned."],
      ["Counterbore To Hide Or Plug", "A counterbore drills a flat-bottomed recess so the screw head sits below the surface, to be hidden with a plug or filler. This is common where screws should not show, like a visible shelf or a tabletop cleat. Plan counterbores where you want a clean face, and cut matching plugs from an offcut of the same wood for an invisible repair."],
      ["Build Pilot Holes Into The Plan", "Decide where screws go and whether they need countersinks or counterbores before assembly, and pilot every screw into hardwood, plywood edges, and near ends. Keep a drill-size reference handy. Pairing this with accurate parts from the cut list means joints draw tight and faces stay clean, with no splits or proud heads."]
    ],
    charts: [
      {
        title: "Pilot hole drill size by screw gauge (inches, softwood)",
        caption: "Approximate pilot drill sizes for common screw gauges in softwood. Go slightly larger in hardwood.",
        unit: "",
        bars: [["#6", 0.078], ["#8", 0.094], ["#10", 0.109], ["#12", 0.125]]
      },
      {
        title: "Split risk without a pilot hole (relative)",
        caption: "Relative risk of splitting when driving screws with no pilot. End grain and hardwood split most.",
        unit: "",
        bars: [["Plywood face", 30], ["Softwood", 45], ["Hardwood", 80], ["End grain", 95]]
      }
    ],
    deepDive: {
      figureTitle: "Pilot, countersink, counterbore",
      figureCaption: "Size the pilot to the screw and wood, countersink for flush heads, counterbore to hide or plug.",
      figureStats: [["Pilot", "Prevents splits and strips"], ["Countersink", "Flush flat heads"], ["Counterbore", "Hide with a plug"]],
      comparisonTitle: "Hole types",
      comparisonColumns: ["Hole", "Purpose", "When", "Note"],
      comparisonRows: [
        ["Pilot only", "Threads bite, no split", "Hidden screws", "Size to screw and wood"],
        ["Countersink", "Flat head sits flush", "Visible flat heads", "Combination bit is fast"],
        ["Counterbore", "Head below surface", "Hide with plug or filler", "Plug from same wood"],
        ["Clearance + pilot", "Parts draw tight", "Two-board joints", "Top board free-spins"]
      ],
      faqs: [
        ["Why does my wood split when I drive screws?", "No pilot hole, or one too small, especially near ends and in hardwood. Drill a correctly sized pilot."],
        ["How big should a pilot hole be?", "About the screw's solid core diameter; slightly larger in hardwood, slightly smaller in softwood."],
        ["What is the difference between countersink and counterbore?", "A countersink is a cone for a flush flat head; a counterbore is a flat recess to hide the head and plug it."],
        ["Do I need pilot holes in plywood?", "Yes, especially in the edges, where screws easily split the plies."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (fastenings)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on screw holding, pilot holes, and fastener performance in wood."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan accurate parts so piloted, countersunk joints draw up tight."]
      ]
    },
    checklist: ["Pilot screws in hardwood, plywood edges, and near ends.", "Size the pilot to the screw core and wood.", "Countersink flat heads to sit flush.", "Counterbore where you will hide the head.", "Cut plugs from the same wood."]
  },
  {
    slug: "drawer-box-joinery-compared",
    category: "CutList",
    title: "Drawer Box Joinery, Compared",
    description: "Compare butt, rabbet, locking rabbet, and dovetail drawer joints on strength, difficulty, and how they affect drawer box sizing, with charts.",
    kicker: "Joinery guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Drawers Take Constant Stress", "A drawer is pulled, loaded, and slammed thousands of times, so its corner joints take more repeated stress than almost any joint in a cabinet. The joinery you choose decides whether the drawer survives years of use or racks apart. Matching joint strength to how hard the drawer will work is the key decision, and each joint also changes how you size the box parts."],
      ["Butt And Rabbet: Fast And Simple", "A butt joint, just screwed or nailed and glued, is the fastest and weakest, fine for light utility drawers. A rabbet joint, where the front laps into a groove in the side, adds glue surface and registration with little extra effort, making it a solid step up. Both are beginner-friendly and quick, suiting shop and utility drawers."],
      ["Locking Rabbet Resists Pulling Apart", "A locking rabbet interlocks the front and side so the joint mechanically resists the pulling force a drawer sees every time it opens. It takes more setup than a plain rabbet but is far stronger, and it is a favorite for solid everyday drawers. It is the sweet spot of strength and machinability for many builders."],
      ["Dovetails: Strongest And Finest", "Dovetails interlock with angled pins and tails that mechanically resist being pulled apart, the traditional mark of quality drawer making. They are the strongest and most attractive, and the most demanding to cut by hand or jig. Reserve them for fine furniture and visible quality, where their strength and look justify the effort."],
      ["Joint Changes The Box Sizing", "Every joint changes the part sizes: a rabbet or locking rabbet adds length that seats into the groove, while a butt joint uses net sizes. Decide the joinery before cutting drawer parts, and remember the slide clearance too. Use the cut list calculator to size box parts for the chosen joint so the finished drawer fits its opening and glides."]
    ],
    charts: [
      {
        title: "Drawer joint strength (relative)",
        caption: "Relative resistance to racking and pull-apart. Dovetails and locking rabbets far outlast plain butt joints.",
        unit: "",
        bars: [["Butt", 35], ["Rabbet", 60], ["Locking rabbet", 85], ["Dovetail", 100]]
      },
      {
        title: "Joint difficulty (1 easy to 5 hard)",
        caption: "Relative skill and setup needed. Butt joints are trivial; hand-cut dovetails are the most demanding.",
        unit: "",
        bars: [["Butt", 1], ["Rabbet", 2], ["Locking rabbet", 3], ["Dovetail", 5]]
      }
    ],
    deepDive: {
      figureTitle: "Match joint to how hard the drawer works",
      figureCaption: "Stronger joints last longer under constant use; each changes the box part sizing.",
      figureStats: [["Rabbet", "Easy strength upgrade"], ["Locking rabbet", "Strong and machinable"], ["Dovetail", "Strongest and finest"]],
      comparisonTitle: "Drawer joints",
      comparisonColumns: ["Joint", "Strength", "Difficulty", "Best for"],
      comparisonRows: [
        ["Butt", "Low", "Easy", "Light utility drawers"],
        ["Rabbet", "Moderate", "Easy", "Shop and everyday drawers"],
        ["Locking rabbet", "High", "Moderate", "Solid everyday drawers"],
        ["Dovetail", "Highest", "Hard", "Fine furniture, visible quality"]
      ],
      faqs: [
        ["What is the strongest drawer joint?", "The dovetail, which mechanically interlocks to resist pulling apart; a locking rabbet is a strong, easier alternative."],
        ["What drawer joint is easiest for beginners?", "A rabbet joint: simple to cut, much stronger than a plain butt joint."],
        ["Does the joint change drawer box size?", "Yes. Rabbets and locking rabbets add seated length; butt joints use net sizes. Plan before cutting."],
        ["Do I need dovetails?", "Only where strength and a fine look matter. Locking rabbets serve most everyday drawers well."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (joints)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on wood joint strength and construction."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Size drawer box parts for your chosen joint and slide clearance."]
      ]
    },
    checklist: ["Match joint strength to drawer use.", "Use a rabbet for an easy strength upgrade.", "Use a locking rabbet for solid everyday drawers.", "Reserve dovetails for fine, visible work.", "Size box parts for the joint and slides."]
  },
  {
    slug: "face-frame-vs-frameless-cabinets",
    category: "CutList",
    title: "Face-Frame vs Frameless Cabinets",
    description: "Compare face-frame and frameless (European) cabinet construction on strength, access, cost, and cut list, to choose the right style for your project.",
    kicker: "Cabinet design",
    readTime: "9 min",
    accent: "cutlist",
    sections: [
      ["Two Ways To Build A Cabinet", "Cabinets come in two main construction styles: face-frame, with a solid-wood frame on the front of the box, and frameless, also called European, where the doors mount directly to the carcass. The choice affects strength, interior access, hardware, cost, and the cut list. Neither is simply better; each suits different goals, tools, and looks."],
      ["Face-Frame: Traditional And Forgiving", "A face-frame cabinet adds a solid-wood frame to the front of the plywood box. The frame stiffens the carcass, hides the plywood edges, gives a sturdy place to mount doors and hinges, and forgives small carcass errors because the frame sets the openings. It is the traditional North American style, strong and forgiving, at the cost of a little interior access and extra frame material."],
      ["Frameless: Modern And Full-Access", "A frameless cabinet skips the front frame, so doors cover the whole box and the interior is fully accessible with wider drawers and easier reach. It is the modern, European look and uses cup hinges. It demands a more accurate, square carcass because there is no frame to hide errors, and it relies on good plywood edges or banding."],
      ["Cost, Access, And Hardware", "Face-frame uses more solid lumber for the frame but forgives the carcass; frameless saves frame material but needs precise boxes and specific hardware. Frameless gives more usable interior space and a clean look; face-frame gives a sturdy, traditional result and easier door mounting. Weigh material, tools, access, and style for your project."],
      ["Each Style Changes The Cut List", "The construction style reshapes the parts list: face-frame adds frame stiles and rails as solid-wood parts and lets the carcass be slightly looser; frameless drops the frame but demands dead-square plywood parts and edge treatment. Decide the style first, then build the cut list. Use the kitchen cabinet template and plywood calculator to plan whichever you choose."]
    ],
    charts: [
      {
        title: "Face-frame vs frameless by factor (relative score)",
        caption: "Higher is better for that factor. Frameless leads on access; face-frame forgives carcass errors.",
        unit: "",
        bars: [["Access: FF", 60], ["Access: frameless", 95], ["Forgiving: FF", 90], ["Forgiving: frameless", 55]]
      },
      {
        title: "Relative material use (index)",
        caption: "Frameless uses less solid lumber but demands precise plywood; face-frame adds frame stock.",
        unit: "",
        bars: [["FF plywood", 90], ["FF frame wood", 40], ["Frameless plywood", 100], ["Frameless frame", 5]]
      }
    ],
    deepDive: {
      figureTitle: "Frame forgives, frameless maximizes access",
      figureCaption: "Face-frame is sturdy and forgiving; frameless is modern with full interior access but needs precise boxes.",
      figureStats: [["Face-frame", "Traditional, forgiving"], ["Frameless", "Modern, full access"], ["Style first", "Then the cut list"]],
      comparisonTitle: "Construction styles",
      comparisonColumns: ["Factor", "Face-frame", "Frameless", "Edge"],
      comparisonRows: [
        ["Interior access", "Reduced by frame", "Full width", "Frameless"],
        ["Carcass tolerance", "Forgiving", "Must be square", "Face-frame"],
        ["Look", "Traditional", "Modern European", "Preference"],
        ["Hardware", "Various hinges", "Cup hinges", "Preference"]
      ],
      faqs: [
        ["What is the difference between face-frame and frameless cabinets?", "Face-frame has a solid-wood frame on the front of the box; frameless mounts doors directly to the carcass."],
        ["Which is stronger?", "Both are strong; the face frame stiffens the box and forgives errors, while frameless relies on a square, well-built carcass."],
        ["Which gives more storage?", "Frameless, because there is no frame narrowing the opening, so drawers and access are wider."],
        ["Which is easier for a beginner?", "Face-frame is more forgiving of small carcass inaccuracies; frameless demands precise, square boxes."]
      ],
      sources: [
        ["APA - The Engineered Wood Association", "https://www.apawood.org/", "Plywood construction reference relevant to cabinet carcass building."],
        ["WoodCutTool kitchen cabinet cut list template", "/templates/kitchen-cabinet-cut-list/", "Plan parts for face-frame or frameless construction."]
      ]
    },
    checklist: ["Choose face-frame or frameless before cutting.", "Use face-frame for a forgiving, traditional build.", "Use frameless for full access and a modern look.", "Build frameless boxes dead square.", "Plan the cut list for the chosen style."]
  },
  {
    slug: "choosing-screws-for-woodworking",
    category: "CutList",
    title: "Choosing Screws for Woodworking",
    description: "Pick the right screw for the job: wood vs construction screws, coarse vs fine thread, length and gauge, and head types, with charts on sizing.",
    kicker: "Hardware guide",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["The Right Screw Makes A Strong Joint", "Screws look interchangeable but are not. The wrong thread, length, or head can split the wood, strip out, or fail to hold. Choosing the right screw for the material and joint, then piloting it correctly, is what makes a screwed joint strong and clean. A little knowledge of thread, gauge, length, and head removes most screw failures."],
      ["Thread: Coarse For Soft, Fine For Hard", "Coarse-thread screws bite aggressively in softwood, plywood, and particleboard, where deep threads grip the loose fibers. Fine-thread screws suit hardwood, where fine threads cut cleanly without splitting and hold well in dense fibers. Matching thread to material is a basic but high-impact choice: coarse in soft and sheet goods, fine in hardwood."],
      ["Length And Gauge For Holding Power", "A screw should reach well into the second piece without blowing through, commonly enough that a good portion of its length is in the holding board. Gauge, the screw's thickness, sets shear strength: heavier gauge for structural joints, lighter for trim. Too short and it will not hold; too long and it punches through. Match both to the joint."],
      ["Heads And Drives", "Flat heads countersink flush for clean faces; pan and round heads sit on top for fastening hardware. The drive type, such as square or star, resists cam-out far better than slotted or basic cross drives, which strip easily. Choosing a good drive type saves stripped screws and frustration, especially when driving many fasteners."],
      ["Match Screw To Material And Joint", "Pick thread for the material, length and gauge for the holding power, and head and drive for the application, then pilot appropriately. Construction screws suit framing; finer wood and cabinet screws suit furniture. Plan fasteners alongside the cut list so joints draw tight and faces stay clean, without splits or stripped heads."]
    ],
    charts: [
      {
        title: "Screw length by board thickness joined (inches)",
        caption: "Approximate screw length to reach well into the holding board when joining a 3/4-inch top board.",
        unit: " in",
        bars: [["Into 1/2", 1], ["Into 3/4", 1.25], ["Into 1x", 1.625], ["Into 2x", 2.5]]
      },
      {
        title: "Thread choice by material (1 fine to 5 coarse)",
        caption: "Coarse thread grips soft and sheet goods; fine thread holds in dense hardwood without splitting.",
        unit: "",
        bars: [["Hardwood", 1], ["Softwood", 4], ["Plywood", 4], ["Particleboard", 5]]
      }
    ],
    deepDive: {
      figureTitle: "Thread, length, gauge, head",
      figureCaption: "Match thread to material, length and gauge to holding power, and head and drive to the job.",
      figureStats: [["Coarse", "Soft and sheet goods"], ["Fine", "Dense hardwood"], ["Star drive", "Resists cam-out"]],
      comparisonTitle: "Screw selection",
      comparisonColumns: ["Factor", "Choose", "For", "Note"],
      comparisonRows: [
        ["Thread", "Coarse", "Softwood, plywood", "Aggressive grip"],
        ["Thread", "Fine", "Hardwood", "Clean, no split"],
        ["Head", "Flat", "Flush, clean faces", "Countersink it"],
        ["Drive", "Square or star", "Many fasteners", "Resists stripping"]
      ],
      faqs: [
        ["What screw should I use for plywood?", "A coarse-thread wood or cabinet screw, piloted, holds well in plywood; coarse threads grip the plies."],
        ["Coarse or fine thread for hardwood?", "Fine thread, which cuts cleanly in dense hardwood and holds without splitting."],
        ["How long should a wood screw be?", "Long enough to reach well into the holding board without punching through, often most of its length in the second piece."],
        ["Why do my screws strip?", "Often a poor drive type or worn bit. Square and star drives resist cam-out far better than slotted."]
      ],
      sources: [
        ["U.S. Forest Products Laboratory: Wood Handbook (fastenings)", "https://www.fpl.fs.usda.gov/products/publications/several_pubs.php?grouping_id=100", "Reference on screw holding power, thread, and fastener selection in wood."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan parts and joints so the right screws draw them tight."]
      ]
    },
    checklist: ["Use coarse thread in soft and sheet goods.", "Use fine thread in hardwood.", "Size length to reach the holding board.", "Pick gauge for the needed strength.", "Choose a star or square drive to resist stripping."]
  },
  {
    slug: "hand-tools-vs-power-tools-for-beginners",
    category: "CutList",
    title: "Hand Tools vs Power Tools for Beginners",
    description: "Decide where to start: hand tools versus power tools on cost, learning curve, speed, noise, and space, with charts to build a sensible first kit.",
    kicker: "Getting started",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["You Do Not Have To Choose Only One", "New woodworkers often think they must pick a camp: hand tools or power tools. In reality most shops blend the two, using each where it shines. The useful question is not which is better but which to start with for your space, budget, and projects. Knowing the trade-offs lets a beginner build a sensible first kit instead of overbuying."],
      ["Cost And Space Favor Hand Tools To Start", "A basic hand-tool kit costs little, needs almost no space, and makes no noise, which suits apartments and tight budgets. A saw, a chisel set, a marking gauge, and a plane can build real projects. Power tools cost more and need space, power, and dust control. For a beginner testing the hobby, hand tools are a low-risk entry."],
      ["Power Tools Win On Speed And Repetition", "Where power tools earn their cost is speed and repeatable accuracy, especially breaking down sheet goods and cutting many identical parts. A circular saw or table saw does in minutes what hand tools do in an hour, and jigs make repeats identical. For sheet-good projects and any volume of parts, power tools are a large time saver."],
      ["Noise, Dust, And Learning Curve", "Hand tools are quiet, low-dust, and meditative, but demand technique that takes time to develop, like sawing to a line or planing flat. Power tools are loud and dusty and demand respect for safety, but many cuts are faster to learn to a usable result. Weigh noise, dust, and your patience for skill-building when choosing where to start."],
      ["Build A Blended Kit Over Time", "A practical path is to start with a few quality hand tools and one or two key power tools for your projects, then add as needs appear. For sheet-good and cabinet work, a circular saw or track saw plus a drill goes far; hand tools handle fitting and refinement. Plan projects with the cut list calculator and add tools to match, not the other way around."]
    ],
    charts: [
      {
        title: "Hand vs power tools by factor (relative score)",
        caption: "Higher is better for that factor. Hand tools win on cost, space, and quiet; power tools on speed.",
        unit: "",
        bars: [["Cost: hand", 90], ["Cost: power", 45], ["Speed: hand", 35], ["Speed: power", 95]]
      },
      {
        title: "Starter kit spend by approach (index)",
        caption: "Indexed cost of a basic first kit. A hand-tool start is far cheaper than a power-tool shop.",
        unit: "",
        bars: [["Hand basics", 25], ["Hybrid", 55], ["Power shop", 100]]
      }
    ],
    deepDive: {
      figureTitle: "Start lean, blend over time",
      figureCaption: "Hand tools are cheap, quiet, and compact; power tools are fast and repeatable. Most shops use both.",
      figureStats: [["Hand tools", "Low cost, low space, quiet"], ["Power tools", "Fast and repeatable"], ["Blend", "Add tools as needs appear"]],
      comparisonTitle: "Hand vs power tools",
      comparisonColumns: ["Factor", "Hand tools", "Power tools", "Edge"],
      comparisonRows: [
        ["Cost to start", "Low", "Higher", "Hand"],
        ["Speed", "Slow", "Fast", "Power"],
        ["Space and noise", "Minimal, quiet", "More, loud", "Hand"],
        ["Sheet goods, repeats", "Tedious", "Excellent", "Power"]
      ],
      faqs: [
        ["Should a beginner start with hand or power tools?", "Either works. Hand tools are cheaper, quieter, and need no space; power tools are faster for sheet goods and repeats."],
        ["What is the cheapest way to start woodworking?", "A small kit of quality hand tools costs little and needs almost no space."],
        ["When are power tools worth it?", "For breaking down sheet goods and cutting many identical parts, where speed and repeatable accuracy pay off."],
        ["Do I need a full power-tool shop?", "No. A circular saw or track saw plus a drill, blended with a few hand tools, handles a lot."]
      ],
      sources: [
        ["OSHA: Woodworking eTool", "https://www.osha.gov/etools/woodworking", "Safety guidance for power tools and woodworking machinery."],
        ["WoodCutTool cut list calculator", "/cut-list-calculator/", "Plan projects first, then add the tools that match them."]
      ]
    },
    checklist: ["Remember most shops blend hand and power.", "Start lean if budget or space is tight.", "Use power tools for sheet goods and repeats.", "Weigh noise, dust, and learning curve.", "Add tools to match planned projects."]
  },
  {
    slug: "receipt-tracking-for-contractors-and-makers",
    category: "SnapReceipt",
    title: "Receipt Tracking for Contractors and Makers",
    description: "Stop losing receipts on the job. A practical system for tracking materials, tools, and job costs by capturing receipts as you buy, with SnapReceipt.",
    kicker: "Expense workflow",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Lost Receipts Are Lost Money", "Contractors, woodworkers, and makers spend constantly on lumber, sheet goods, hardware, and consumables, but the paper receipts pile up, fade, and vanish. Every lost receipt is a deduction you cannot claim and a job cost you cannot bill back. The fix is not better filing later; it is capturing each receipt the moment you get it, before it ends up crushed in a truck console."],
      ["Capture At The Point Of Purchase", "The most reliable habit is to scan a receipt right at the store or the moment a delivery arrives, while it is in your hand and legible. A phone-based receipt scanner like SnapReceipt turns the paper into a digital record in seconds, so it is saved before it can be lost, soaked, or thrown away. Capture first, organize later."],
      ["Tag Receipts To Jobs", "A receipt is far more useful when it is tied to a job. Tagging each purchase to a project or client at capture time means you can total what a job actually cost in materials, compare it to your estimate, and bill accurately. For makers selling work, it also separates business spending from personal, which matters at tax time."],
      ["Keep Records Without An Account", "Many tradespeople distrust apps that demand a login and upload everything to a cloud. SnapReceipt is built to work privately on the iPhone without creating an account, so spending records stay on the device. For people who handle client and financial details, keeping records local instead of in someone else's cloud is a real advantage."],
      ["From Receipts To Better Estimates", "Captured, job-tagged receipts close the loop with your project planning. When you know what materials really cost on the last cabinet run, your next estimate is sharper. Pair receipt tracking with cut planning in the cut list calculator and the cost-estimating guide, and material spend stops being a guess and becomes data you can reuse."]
    ],
    charts: [
      {
        title: "Where receipts get lost (relative share)",
        caption: "Most receipts are lost to fading, clutter, and the truck, not to filing. Capture early to prevent it.",
        unit: "",
        bars: [["Truck/pocket", 40], ["Faded/damaged", 25], ["Tossed", 20], ["Never filed", 15]]
      },
      {
        title: "Receipt capture method by reliability (relative)",
        caption: "Scanning at purchase preserves the most receipts; shoeboxing and memory preserve the least.",
        unit: "",
        bars: [["Scan at buy", 95], ["Photo later", 70], ["Shoebox", 40], ["Memory", 10]]
      }
    ],
    deepDive: {
      figureCaption: "",
      comparisonTitle: "Receipt habits compared",
      comparisonColumns: ["Habit", "Reliability", "Effort", "Best for"],
      comparisonRows: [
        ["Scan at purchase", "High", "Low", "Anyone buying materials often"],
        ["Photo, sort later", "Moderate", "Moderate", "Light spenders"],
        ["Paper shoebox", "Low", "High at tax time", "Not recommended"],
        ["Reconstruct from memory", "Very low", "High", "Last resort only"]
      ],
      faqs: [
        ["How should contractors track receipts?", "Scan each receipt at the point of purchase and tag it to the job, so it is saved before it can be lost."],
        ["Why tag receipts to jobs?", "It lets you total real material cost per job, compare to your estimate, and bill clients accurately."],
        ["Do I need an account to track receipts?", "Not with SnapReceipt, which is built to work privately on iPhone without creating an account."],
        ["How does receipt tracking help estimating?", "Knowing real material costs from past jobs makes your next project estimate far more accurate."]
      ],
      sources: [
        ["IRS: Recordkeeping for Businesses", "https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping", "Official U.S. guidance on keeping receipts and records to substantiate business deductions."],
        ["SnapReceipt: Expenses & Tax", "/apps/snapreceipt-expenses-and-tax/", "Private iPhone receipt scanner, expense tracker, and mileage log, no account required."]
      ]
    },
    checklist: ["Capture each receipt at purchase.", "Tag receipts to the job or client.", "Keep records private on the device.", "Compare material cost to your estimate.", "Reuse cost data for better estimates."]
  },
  {
    slug: "mileage-log-for-tax-deductions",
    category: "SnapReceipt",
    title: "Keeping a Mileage Log for Tax Deductions",
    description: "A practical guide to logging business mileage for deductions: what records the IRS expects, standard rate vs actual cost, and how to log trips with SnapReceipt.",
    kicker: "Tax records",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Business Miles Are Real Money", "For trades and makers who drive to job sites, suppliers, and client meetings, business mileage can be a significant tax deduction, but only if it is documented. Undocumented miles are not deductible, and reconstructing a year of driving from memory does not satisfy a tax authority. A simple, consistent mileage log turns ordinary driving into a legitimate deduction."],
      ["What A Good Mileage Log Records", "Tax authorities generally expect a contemporaneous record: the date, the business purpose, the start and end points, and the miles for each trip. The key word is contemporaneous, meaning logged at or near the time of the trip, not invented later. A log kept as you go is both easier and far more defensible than one assembled at tax time."],
      ["Standard Rate Or Actual Cost", "Two common methods exist: a standard mileage rate that multiplies business miles by a set per-mile figure, or the actual-cost method that tracks the real expense of operating the vehicle. The standard rate is simpler and needs only a mileage log; actual cost needs receipts for fuel, maintenance, and more. Many drivers choose the standard rate for its simplicity, but the right choice depends on your situation."],
      ["Log Trips As You Go", "The hard part of mileage logging is consistency, not complexity. Logging each business trip when it happens, with a phone tool like SnapReceipt that records mileage alongside your receipts, keeps the record contemporaneous and complete. Capturing the trip in the moment beats trying to remember weeks of driving, and it keeps mileage and expense records in one place."],
      ["Keep It With Your Other Records", "Mileage is one piece of a business spending picture that also includes material and tool receipts. Keeping the mileage log together with those receipts, privately on your device, makes tax time a matter of review rather than reconstruction. Consult a tax professional for your specifics, but a clean, contemporaneous log is the foundation either way."]
    ],
    charts: [
      {
        title: "Mileage log quality and audit defensibility (relative)",
        caption: "Contemporaneous logs hold up best; memory-based reconstructions are the weakest at audit.",
        unit: "",
        bars: [["Logged per trip", 95], ["Weekly recap", 70], ["Monthly guess", 40], ["From memory", 10]]
      },
      {
        title: "What a trip record needs (count of fields)",
        caption: "A defensible trip record captures these basics each time: date, purpose, route, and miles.",
        unit: "",
        bars: [["Date", 1], ["Purpose", 1], ["Start/end", 2], ["Miles", 1]]
      }
    ],
    deepDive: {
      figureCaption: "",
      comparisonTitle: "Mileage methods",
      comparisonColumns: ["Method", "Records needed", "Effort", "Best for"],
      comparisonRows: [
        ["Standard rate", "Mileage log", "Low", "Most drivers"],
        ["Actual cost", "Log plus all vehicle receipts", "High", "High vehicle costs"],
        ["No log", "None", "None", "No deduction allowed"],
        ["Reconstructed", "Estimated", "High, weak", "Last resort only"]
      ],
      faqs: [
        ["What does a mileage log need to include?", "Generally the date, business purpose, start and end points, and miles for each trip, recorded at the time."],
        ["Standard rate or actual cost, which is better?", "The standard rate is simpler and needs only a mileage log; actual cost can be larger but needs full vehicle receipts."],
        ["Can I reconstruct mileage at tax time?", "It is far weaker than a contemporaneous log and may not satisfy an audit. Log trips as they happen."],
        ["How do I keep a mileage log easily?", "Log each trip in the moment with a tool like SnapReceipt that records mileage alongside receipts."]
      ],
      sources: [
        ["IRS: Standard Mileage Rates", "https://www.irs.gov/tax-professionals/standard-mileage-rates", "Official U.S. guidance on standard mileage rates and the records required to claim vehicle deductions."],
        ["SnapReceipt: Expenses & Tax", "/apps/snapreceipt-expenses-and-tax/", "Log business mileage alongside receipts, privately on iPhone, no account required."]
      ]
    },
    checklist: ["Log every business trip as it happens.", "Record date, purpose, route, and miles.", "Choose standard rate or actual cost deliberately.", "Keep mileage with your receipt records.", "Consult a tax professional for your situation."]
  },
  {
    slug: "private-expense-tracking-without-an-account",
    category: "SnapReceipt",
    title: "Private Expense Tracking Without an Account",
    description: "Track spending without handing your data to the cloud. Why account-free, on-device expense tracking matters, and how SnapReceipt keeps records private.",
    kicker: "Privacy",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Your Spending Data Is Sensitive", "Expense and receipt data reveals a lot: where you shop, what you buy, your clients, your income patterns. Most expense apps require an account and upload everything to a server, putting that sensitive picture in someone else's hands. For freelancers, tradespeople, and privacy-minded users, that is a real concern, and it is avoidable. Account-free, on-device tracking keeps the data where it belongs: with you."],
      ["The Cost Of The Account Model", "Requiring an account is convenient for the app maker but carries costs for you: a server that can be breached, terms that may allow data use, and a record that persists even if you stop using the app. Every account is another place your financial details live. The fewer copies of that data exist off your device, the smaller your exposure."],
      ["On-Device Means You Hold The Data", "An app that works on-device, without an account, keeps your receipts and expenses on your iPhone rather than in a cloud database. SnapReceipt is designed this way: scan receipts, track expenses, and log mileage without creating an account or uploading your records. You get the organization benefits without surrendering the data."],
      ["Privacy Does Not Mean Less Function", "Account-free does not mean basic. You can still scan paper receipts, import photos, add entries manually, review extracted details, tag spending, and keep organized records, all locally. The trade-off people fear, privacy versus usefulness, largely is not real here: the everyday expense workflow works fully on-device, which is the point."],
      ["Keep Control At Tax Time", "When records live on your device, you decide what to export and share, rather than having everything sit in a vendor's cloud by default. For tax preparation, you can review and export what you need. Pair private receipt and mileage tracking with good habits, and you keep both organized records and control over sensitive financial data."]
    ],
    charts: [
      {
        title: "Where expense data lives by app model (relative exposure)",
        caption: "On-device tracking minimizes off-device copies of sensitive financial data; cloud accounts maximize them.",
        unit: "",
        bars: [["On-device", 10], ["Local + backup", 35], ["Cloud account", 80], ["Cloud + sharing", 100]]
      },
      {
        title: "What account-free tracking still does (feature count)",
        caption: "Private, on-device tracking keeps the core workflow: scan, import, manual entry, tag, and review.",
        unit: "",
        bars: [["Scan", 1], ["Import", 1], ["Manual", 1], ["Tag", 1], ["Review", 1]]
      }
    ],
    deepDive: {
      figureCaption: "",
      comparisonTitle: "Account model vs on-device",
      comparisonColumns: ["Factor", "Cloud account", "On-device", "Edge"],
      comparisonRows: [
        ["Data location", "Vendor server", "Your iPhone", "On-device"],
        ["Breach exposure", "Higher", "Lower", "On-device"],
        ["Account required", "Yes", "No", "On-device"],
        ["Everyday features", "Full", "Full", "Tie"]
      ],
      faqs: [
        ["Why track expenses without an account?", "It keeps sensitive financial data on your device instead of a vendor's cloud, reducing exposure and breach risk."],
        ["Is account-free tracking less capable?", "No. Scanning, importing, manual entry, tagging, and review all work on-device in SnapReceipt."],
        ["Where does my receipt data go?", "With an on-device app like SnapReceipt, it stays on your iPhone rather than uploading to a cloud account."],
        ["How do I share records at tax time?", "You choose what to export from your device, keeping control instead of leaving everything in a cloud by default."]
      ],
      sources: [
        ["FTC: Protecting Personal Information", "https://www.ftc.gov/business-guidance/privacy-security", "U.S. Federal Trade Commission guidance on data privacy and minimizing exposure of personal information."],
        ["SnapReceipt: Expenses & Tax", "/apps/snapreceipt-expenses-and-tax/", "Private, account-free receipt and expense tracking that keeps records on your iPhone."]
      ]
    },
    checklist: ["Treat expense data as sensitive.", "Prefer on-device over cloud-account apps.", "Keep receipts and mileage local.", "Confirm the core workflow still works offline.", "Control what you export at tax time."]
  }
];

articles.push(
  {
    slug: "cutlist-garage-shelf-weekend-project",
    category: "CutList",
    title: "Using CutList To Build Garage Shelves In A Weekend",
    description: "A hobbyist workflow for turning rough shelf measurements into plywood layouts, cut sequences, and a realistic shopping plan.",
    kicker: "Weekend project",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Start With The Space, Not The Sheet", "Measure the wall, clear height, stud positions, and the storage bins you actually want to fit. For hobby projects, a useful cut list starts with how the object will be used, then translates that need into panels."],
      ["Use CutList For Repeated Parts", "Garage shelves usually repeat sides, shelves, dividers, and backs. Enter one clean part size with a quantity, then let CutList generate optimized sheet layouts instead of manually sketching every rectangle."],
      ["Check Waste Before Buying", "CutList's material cost and waste tracking can show whether a small dimension change saves a sheet. For a weekend build, that is often the difference between one store run and a second trip."],
      ["Cut From A Sequence, Not Memory", "Use the step-by-step cut sequence on the phone or export a PDF when you prefer paper near the saw. Label each shelf part as it comes off the sheet so repeated panels do not get mixed."]
    ],
    checklist: ["Measure storage bins first.", "Use quantities for repeated parts.", "Compare sheet count before buying.", "Label each part after cutting."]
  },
  {
    slug: "cutlist-bookcase-from-one-sheet",
    category: "CutList",
    title: "Planning A One-Sheet Bookcase With CutList",
    description: "How a DIY woodworker can test whether a small bookcase fits into one plywood sheet before cutting anything.",
    kicker: "One-sheet build",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Treat One Sheet As A Design Constraint", "Enter the real sheet size, saw kerf, and any trim allowance before entering the bookcase parts. The optimizer can only answer the one-sheet question if the stock setup is honest."],
      ["Use The Layout As Feedback", "If the optimized layout creates narrow fragile strips or needs a second sheet, adjust depth, shelf count, or back-panel strategy before buying material."],
      ["Protect Visible Grain", "A bookcase has visible sides and shelves. Use grain direction lock for parts where appearance matters, even if that costs a little material."],
      ["Save The Variant", "Project history is useful for hobby furniture. Duplicate the one-sheet version later to create a taller, wider, or deeper design without rebuilding the list."]
    ],
    checklist: ["Enter stock size and kerf.", "Review layout before buying.", "Lock visible grain direction.", "Save a reusable project variant."]
  },
  {
    slug: "cutlist-closet-organizer-diy",
    category: "CutList",
    title: "DIY Closet Organizer Planning With CutList",
    description: "A home renovator's approach to shelves, dividers, cubbies, and closet panels using a phone-based cut planner.",
    kicker: "Home renovation",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Break The Closet Into Zones", "Separate hanging space, shoe cubbies, folded clothing, and top storage before entering parts. Each zone creates a different panel rhythm."],
      ["Keep Materials Separate", "Melamine, plywood, and painted MDF should be planned as separate sheet stocks. CutList can handle different sheet materials, but the hobbyist still needs to avoid mixing visible and hidden parts."],
      ["Account For Edge Banding", "Closet fronts often have exposed edges. Use kerf and edge banding allowance so finished pieces do not drift from the planned size."],
      ["Export For The Garage", "PDF export and AirPrint are useful when cutting happens away from the closet. Bring the cut sequence to the saw instead of carrying room measurements in your head."]
    ],
    checklist: ["Divide the closet into zones.", "Separate sheet materials.", "Add edge banding allowance.", "Export or print the cut sequence."]
  },
  {
    slug: "cutlist-drawer-boxes-for-beginners",
    category: "CutList",
    title: "Beginner Drawer Boxes: Using CutList To Avoid Quantity Mistakes",
    description: "How hobbyists can plan drawer sides, fronts, backs, and bottoms without losing track of repeated parts.",
    kicker: "Beginner woodworking",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Solve One Drawer First", "List one box before multiplying: two sides, one front, one back, and one bottom. Then use quantities to scale the project."],
      ["Separate Bottom Material", "Drawer bottoms often use thinner plywood than the box sides. Enter them under their own stock so the layout does not mix materials."],
      ["Use The Visual Layout As A Sanity Check", "If six drawers should create six bottoms and the layout shows five, the mistake is visible before the sheet is cut."],
      ["Duplicate Similar Projects", "Project history helps when a cabinet has shallow, medium, and deep drawers. Duplicate the saved plan and adjust only the dimensions that differ."]
    ],
    checklist: ["Model one drawer first.", "Separate bottom stock.", "Check quantities visually.", "Duplicate for drawer size families."]
  },
  {
    slug: "cutlist-plywood-workbench-top",
    category: "CutList",
    title: "Planning A Plywood Workbench Top With CutList",
    description: "A practical workflow for laminated tops, lower shelves, and shop fixtures using optimized panel layouts.",
    kicker: "Shop fixture",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Label Laminated Layers", "A laminated top may need two or three identical panels. Use part names that make layer order clear so assembly does not depend on memory."],
      ["Compare Heavy And Light Versions", "Material cost and waste tracking help you decide whether a thicker top, lower shelf, or extra side panel is worth another sheet."],
      ["Set Kerf Early", "Workbench panels are large, and small kerf errors can matter. Set blade kerf before generating the layout."],
      ["Keep The Plan Offline", "CutList works offline, which is practical in garages and basement shops where connectivity is inconsistent."]
    ],
    checklist: ["Label top layers clearly.", "Compare sheet cost between versions.", "Set saw kerf before layout.", "Save the project for offline cutting."]
  },
  {
    slug: "cutlist-mudroom-bench-cubbies",
    category: "CutList",
    title: "Mudroom Bench And Cubby Planning For DIY Builders",
    description: "How to organize repeated cubby panels, bench supports, and backs before cutting a built-in mudroom unit.",
    kicker: "Built-in project",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Standardize Cubby Widths", "Repeated cubbies cut faster and assemble cleaner when dimensions match. Use CutList to test a few widths and watch the sheet count."],
      ["Leave Installation Tolerance", "Built-ins need scribe space and filler. Do not optimize panels exactly to a crooked wall unless you have already measured and planned the adjustment."],
      ["Lock Finished Ends", "Visible end panels should keep grain or finish direction consistent. Use grain direction lock where appearance matters."],
      ["Share The Cut Sequence", "If one person designs and another cuts, the PDF layout gives the project a shared reference instead of a text message full of dimensions."]
    ],
    checklist: ["Test cubby width against sheet count.", "Leave room for scribe/filler.", "Lock visible panels.", "Share the exported cut plan."]
  },
  {
    slug: "cutlist-kids-toy-storage-plywood",
    category: "CutList",
    title: "Kids' Toy Storage From Plywood: A CutList Workflow",
    description: "A hobby project guide for planning bins, low shelves, dividers, and safe rounded storage furniture.",
    kicker: "Family project",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Design Around Reach Height", "Toy storage should fit the child first. Decide height, bin size, and safe access before optimizing panels."],
      ["Avoid Unnecessary Narrow Strips", "The visual layout makes skinny offcuts easy to see. Redesign when the project creates fragile pieces that are annoying to sand, finish, or handle."],
      ["Track Sheet Cost Separately", "Use material cost tracking for plywood, then budget finish, hardware, and safety details separately."],
      ["Save For Matching Units", "Project history makes it easy to build a second matching storage unit later when toys multiply."]
    ],
    checklist: ["Set child-friendly dimensions.", "Watch for narrow strips.", "Track plywood cost.", "Save the plan for matching builds."]
  },
  {
    slug: "cutlist-small-apartment-furniture",
    category: "CutList",
    title: "Small Apartment Furniture Planning With CutList",
    description: "How renters and hobbyists can plan compact plywood furniture while controlling sheet count and transport constraints.",
    kicker: "Compact living",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Add Transport To The Design", "If a sheet must fit in a car, elevator, or shared shop schedule, the cut plan has to include movement constraints."],
      ["Optimize For Fewer Sheets", "A compact desk, bench, or media console may be possible with fewer sheets if dimensions shift slightly. Use the optimized layout to test alternatives."],
      ["Use PDF At A Maker Space", "If cutting happens in a shared shop, a PDF cut list keeps the work organized even when the phone is not on the saw table."],
      ["Duplicate Modular Pieces", "For cube shelves or modular benches, duplicate a saved project and adjust dimensions instead of recreating the plan."]
    ],
    checklist: ["Plan around transport limits.", "Compare sheet-count options.", "Bring a PDF to shared shops.", "Duplicate modular designs."]
  },
  {
    slug: "cutlist-backyard-planter-boxes",
    category: "CutList",
    title: "Backyard Planter Boxes: Planning Outdoor Sheet Cuts",
    description: "Using CutList for planter sides, bottoms, liners, and repeated outdoor panels without wasting weather-resistant material.",
    kicker: "Outdoor project",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Choose Outdoor Stock First", "Exterior material is often more expensive than shop plywood. Enter the actual material and sheet size before adding parts."],
      ["Batch Repeated Boxes", "If you are building several planters, optimize all repeated sides and bottoms together. Batch planning can save more than treating each box alone."],
      ["Name Drainage Parts Clearly", "Separate sides, liners, false bottoms, and drainage strips in the part names so the cut sequence stays readable."],
      ["Keep Repair-Worthy Offcuts", "Use the waste view to identify useful leftovers for future repairs instead of throwing away every offcut."]
    ],
    checklist: ["Use the real outdoor sheet stock.", "Batch repeated planters.", "Name drainage parts.", "Keep useful repair offcuts."]
  },
  {
    slug: "cutlist-van-storage-camper-conversion",
    category: "CutList",
    title: "Van Storage And Camper Conversion Panels With CutList",
    description: "A hobbyist planning workflow for cabinets, bed platforms, and storage boxes in vans or small campers.",
    kicker: "Mobile build",
    readTime: "8 min",
    accent: "cutlist",
    sections: [
      ["Template Curved Areas First", "Van walls are rarely square. Use cardboard templates or oversized measurements before entering final rectangular panels."],
      ["Group By Material Weight", "Lightweight plywood, structural panels, and finish faces should be optimized separately so purchase and cutting decisions stay clear."],
      ["Lock Visible Faces", "Cabinet faces and door panels inside the van should keep grain or finish direction consistent. Lock rotation where appearance matters."],
      ["Carry The Plan Offline", "Driveway camper builds often happen with weak connectivity. CutList's offline workflow keeps the plan available during cutting."]
    ],
    checklist: ["Template curved van surfaces.", "Separate material weights.", "Lock visible panel direction.", "Save the project for offline work."]
  },
  {
    slug: "cutlist-first-plywood-project-checklist",
    category: "CutList",
    title: "Your First Plywood Project: A CutList Checklist",
    description: "A beginner-friendly path from sketch to shopping list to optimized cuts using CutList on iPhone.",
    kicker: "First project",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["List Panels Before Opening The Saw", "Write every part name first: sides, top, bottom, shelves, backs, dividers, and doors. A clear parts list is the foundation."],
      ["Set Units And Kerf", "CutList supports inches with fractions and millimeters. Choose the unit system you cut with and set kerf before generating."],
      ["Inspect Before Cutting", "The visual layout is a review tool. If a part looks wrong, fix the data before the blade reaches the sheet."],
      ["Save The Project", "Project history helps if you damage a part, need a replacement, or want to build the project again later."]
    ],
    checklist: ["List all panels by name.", "Set units and kerf.", "Inspect the visual layout.", "Save before cutting."]
  },
  {
    slug: "cutlist-ocr-for-handwritten-project-notes",
    category: "CutList",
    title: "Using CutList OCR To Turn Handwritten Notes Into A Cut Plan",
    description: "How hobbyists can move from notebook measurements to a digital cut list while still checking every imported part.",
    kicker: "AI scan workflow",
    readTime: "7 min",
    accent: "cutlist",
    sections: [
      ["Photograph A Clean List", "CutList Pro includes on-device AI scan for handwritten or printed cut lists. A clean photo with legible dimensions creates a better import."],
      ["Treat OCR As A Draft", "OCR saves typing, but every imported dimension and quantity still needs review. Fast entry does not replace checking."],
      ["Add Material Rules After Import", "After import, assign sheet stock, kerf, grain direction, and edge banding rules before generating the layout."],
      ["Keep Project Notes Local", "The App Store description emphasizes no account, no cloud upload, no tracking, and on-device workflow, which matters when notes include home measurements."]
    ],
    checklist: ["Photograph a clean note.", "Verify every imported dimension.", "Add material rules after OCR.", "Save the corrected project."]
  },
  {
    slug: "cutlist-pdf-plan-for-home-center-cuts",
    category: "CutList",
    title: "Exporting A CutList PDF For Home-Center Or Shared-Shop Cutting",
    description: "How DIY builders can use printable cut layouts when the first rough cuts happen away from their own workspace.",
    kicker: "PDF workflow",
    readTime: "6 min",
    accent: "cutlist",
    sections: [
      ["Decide Which Cuts Are Rough", "Home centers may only make rough breakdown cuts. Use the CutList layout to identify large safe cuts and keep precision cuts for your own tools."],
      ["Export For Communication", "CutList Pro supports PDF export and AirPrint. A printed plan is easier to discuss at a counter or shared shop than a memory of dimensions."],
      ["Protect Final Fit", "For furniture, leave final sizing and visible parts under your control. The PDF is a planning aid, not a guarantee that every third-party cut will be finish-ready."],
      ["Store The File With The Project", "Keep the saved project and exported cut list together so replacements use the same assumptions."]
    ],
    checklist: ["Separate rough cuts from final cuts.", "Export or print the layout.", "Keep final fit cuts at home.", "Store the PDF with the project."]
  },
  {
    slug: "quiltfit-first-baby-quilt-plan",
    category: "QuiltFit",
    title: "Planning Your First Baby Quilt With QuiltFit",
    description: "A beginner workflow for choosing a block pattern, assigning fabrics, estimating yardage, and tracking progress.",
    kicker: "First quilt",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Pick A Simple Block", "QuiltFit supports classic blocks such as Nine Patch, Log Cabin, Half-Square Triangle, and Flying Geese. A first baby quilt benefits from a simple repeat."],
      ["Preview The Whole Quilt", "Set width and height in blocks, choose block size, and use the full quilt preview to judge color balance before cutting fabric."],
      ["Turn Design Into Yardage", "QuiltFit estimates fabric from project size, block size, seam allowance, and safety margin, then turns it into a shopping checklist."],
      ["Track Small Wins", "Use sewing guidance and progress tracking so the project moves from design to cutting to blocks without relying on scattered notes."]
    ],
    checklist: ["Choose a simple block.", "Preview full color balance.", "Use yardage before shopping.", "Track progress by block."]
  },
  {
    slug: "quiltfit-tshirt-memory-quilt",
    category: "QuiltFit",
    title: "Using QuiltFit To Plan A T-Shirt Memory Quilt",
    description: "How hobby quilters can organize shirt panels, supporting fabrics, yardage, and sewing steps for a personal memory project.",
    kicker: "Memory quilt",
    readTime: "8 min",
    accent: "quiltfit",
    sections: [
      ["Treat Shirts As Fabric Roles", "Name shirt groups as fabrics or roles so the design remains visible in the planner."],
      ["Balance Graphics In Preview", "A memory quilt has uneven colors and logos. Use the quilt preview to distribute visual weight before cutting."],
      ["Plan Supporting Materials", "Use the shopping list for background, sashing, backing, and binding so the shirts are not the only planned material."],
      ["Sew In Sections", "Use progress tracking to assemble by block or section, especially when the quilt has emotional value and many unique pieces."]
    ],
    checklist: ["Group shirts as fabric roles.", "Balance logos in the preview.", "Estimate supporting yardage.", "Track assembly by section."]
  },
  {
    slug: "quiltfit-scrap-quilt-from-stash",
    category: "QuiltFit",
    title: "Planning A Scrap Quilt From Your Fabric Stash",
    description: "A practical way to audition scraps, colors, and safety margins before buying more fabric.",
    kicker: "Scrap quilting",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Create Custom Fabric Groups", "QuiltFit lets users create and name custom fabrics. For scraps, group by color family, print scale, or role."],
      ["Use Magic Fill For Exploration", "Magic Fill can quickly explore layout possibilities when you are not sure where scraps should go."],
      ["Find Yardage Gaps", "A scrap quilt still needs background, backing, binding, or borders. The shopping list separates stash from what still needs buying."],
      ["Keep Safety Margin", "Scraps vary in usable size. Use safety margin and treat the cut list as a guide that may need substitutions."]
    ],
    checklist: ["Group stash fabrics.", "Use Magic Fill to explore.", "Check remaining shopping needs.", "Keep margin for irregular scraps."]
  },
  {
    slug: "quiltfit-weekend-table-runner",
    category: "QuiltFit",
    title: "A Weekend Table Runner Project In QuiltFit",
    description: "How to plan a small quilted table runner with block repeats, fabric estimates, and a printable cut list.",
    kicker: "Weekend sewing",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Use A Narrow Grid", "Set project width and height in blocks to match a runner shape. The preview makes repeat rhythm clear."],
      ["Assign Seasonal Fabrics", "Create custom fabrics for holiday prints, solids, or stash pieces, then assign them to block roles."],
      ["Export The Cut List", "QuiltFit can produce a printable PDF cut list with requirements and piece sizes, which keeps a weekend project moving."],
      ["Track Through Binding", "Progress tracking helps a small project finish instead of stopping after the top is pieced."]
    ],
    checklist: ["Set a runner-shaped grid.", "Assign seasonal fabric roles.", "Use the printable cut list.", "Track progress through binding."]
  },
  {
    slug: "quiltfit-guild-challenge-project",
    category: "QuiltFit",
    title: "Managing A Quilt Guild Challenge Project With QuiltFit",
    description: "A workflow for constraints, assigned fabrics, progress tracking, and deadline-driven quilt planning.",
    kicker: "Guild challenge",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Turn Rules Into Settings", "Guild challenges often specify size, fabric, colors, or theme. Record those constraints before exploring designs."],
      ["Audition Multiple Layouts", "Use block pattern choices and fabric assignment to test ideas while keeping yardage and cutting connected."],
      ["Use The Shopping List As A Record", "The shopping list documents required fabrics and can mark what has been bought or packed."],
      ["Track Deadline Progress", "Project status and block progress make the challenge manageable when the finish date is fixed."]
    ],
    checklist: ["Record challenge constraints.", "Audition multiple layouts.", "Use shopping list as a record.", "Track progress against deadline."]
  },
  {
    slug: "quiltfit-gift-quilt-shopping-list",
    category: "QuiltFit",
    title: "Gift Quilt Planning: From Idea To Shopping List In QuiltFit",
    description: "How personal makers can plan a gift quilt without rebuilding fabric math at the store.",
    kicker: "Gift project",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Choose Size By Use", "A baby gift, lap quilt, throw, and bed accent all imply different finished sizes and material needs."],
      ["Preview Before Buying", "Use built-in colors, textures, and custom fabrics to test the gift palette before buying yardage."],
      ["Bring The Shopping Checklist", "QuiltFit's shopping list includes fabric names, colors, quantities, and optional prices, so the fabric shop trip has a plan."],
      ["Save The Meaning", "Gift quilts often have personal notes. Keeping the project in the library preserves design decisions for labels or future matching gifts."]
    ],
    checklist: ["Choose finished size by use.", "Preview palette before buying.", "Use the shopping checklist.", "Save project notes."]
  },
  {
    slug: "quiltfit-log-cabin-color-study",
    category: "QuiltFit",
    title: "Using QuiltFit For A Log Cabin Color Study",
    description: "A hobby design workflow for testing contrast, light/dark placement, and repeated blocks before cutting strips.",
    kicker: "Color study",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Start With Log Cabin", "Log Cabin is a classic block supported by QuiltFit and works well for exploring contrast and movement."],
      ["Test Light And Dark Placement", "Assign fabrics and preview the repeated quilt. Move roles until the diagonal, barn-raising, or balanced effect reads clearly."],
      ["Estimate After The Design Settles", "Let yardage calculations follow the selected design, not the first idea."],
      ["Save Alternate Versions", "Use the project library to keep multiple color studies instead of overwriting a promising option."]
    ],
    checklist: ["Use Log Cabin for contrast tests.", "Preview full repeats.", "Estimate yardage after decisions.", "Save alternate versions."]
  },
  {
    slug: "quiltfit-flying-geese-wall-hanging",
    category: "QuiltFit",
    title: "Planning A Flying Geese Wall Hanging With QuiltFit",
    description: "A small-project workflow for direction, repetition, fabric balance, and clean cutting instructions.",
    kicker: "Wall hanging",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Use Direction As The Design Driver", "Flying Geese blocks create motion. Use the preview to decide whether the movement climbs, radiates, or alternates."],
      ["Name Feature And Background Fabrics", "Clear fabric names make yardage and cut lists easier to read."],
      ["Print The Cut Plan", "For small wall hangings, a PDF cut list keeps piece counts and sizes visible at the cutting table."],
      ["Track Directional Units", "Progress tracking helps avoid turning units the wrong way when direction matters."]
    ],
    checklist: ["Choose directional movement.", "Name fabric roles.", "Use a printable cut list.", "Track rows or units."]
  },
  {
    slug: "quiltfit-half-square-triangle-throw",
    category: "QuiltFit",
    title: "Half-Square Triangle Throw Quilt Planning In QuiltFit",
    description: "How to test HST layouts, fabric roles, and cutting quantities before starting a throw quilt.",
    kicker: "Throw quilt",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Preview HST Motion", "Half-Square Triangle layouts can create chevrons, diamonds, pinwheels, or scattered movement. Test the full repeat first."],
      ["Control Fabric Roles", "Assign triangle roles deliberately. A small role change can make the whole throw calmer or more graphic."],
      ["Use Safety Margin", "HST projects often involve trimming. QuiltFit's safety margin helps translate design into practical fabric buying."],
      ["Follow The Sewing Sequence", "Illustrated steps and progress tracking keep units, rows, pressing, and assembly organized."]
    ],
    checklist: ["Preview HST movement.", "Assign triangle roles.", "Use safety margin.", "Track rows and units."]
  },
  {
    slug: "quiltfit-quilt-retreat-prep",
    category: "QuiltFit",
    title: "Preparing For A Quilt Retreat With QuiltFit",
    description: "How to arrive with fabric, cut lists, sewing steps, and project status organized in one place.",
    kicker: "Retreat prep",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Pick A Retreat-Sized Project", "Choose a project that is satisfying but not so fragile that one missing fabric stops all progress."],
      ["Pack From The Shopping List", "Mark fabrics as bought or packed so the retreat does not start with missing background, binding, or backing."],
      ["Bring Cut Lists", "If cutting tools are shared, a printable cut list reduces table time and keeps fabric groups organized."],
      ["Track Interrupted Work", "Retreats include classes and conversations. Progress tracking makes it easier to resume after interruptions."]
    ],
    checklist: ["Choose a realistic retreat project.", "Pack from the shopping list.", "Bring printable cut lists.", "Track block progress."]
  },
  {
    slug: "quiltfit-restart-unfinished-quilt-project",
    category: "QuiltFit",
    title: "Restarting An Unfinished Quilt Project With QuiltFit",
    description: "How a hobby quilter can recover an old project by rebuilding the design, fabric list, cut status, and next sewing step.",
    kicker: "UFO recovery",
    readTime: "7 min",
    accent: "quiltfit",
    sections: [
      ["Inventory What Exists", "Start by recording finished blocks, cut pieces, remaining fabric, and any missing notes. An unfinished project becomes manageable when the current state is visible."],
      ["Rebuild The Pattern In QuiltFit", "Choose the closest block pattern, set the block count and size, then assign fabrics to recreate the intended design."],
      ["Use The Shopping List To Identify Gaps", "The shopping list can reveal whether background, binding, backing, or a replacement fabric is still needed before sewing resumes."],
      ["Track The Next Small Step", "Progress tracking matters most after a long pause. Mark the next action clearly so the project restarts with one concrete task instead of a vague memory."]
    ],
    checklist: ["Inventory existing blocks and fabric.", "Rebuild the design in QuiltFit.", "Use shopping list to find gaps.", "Track the next small action."]
  },
  {
    slug: "quiltfit-fabric-shop-decision-workflow",
    category: "QuiltFit",
    title: "Using QuiltFit At The Fabric Shop Without Guessing",
    description: "A shopping workflow for hobby quilters who want fabric names, quantities, prices, and substitutions ready before checkout.",
    kicker: "Fabric shopping",
    readTime: "6 min",
    accent: "quiltfit",
    sections: [
      ["Bring A Real Shopping List", "QuiltFit turns fabric estimates into a checklist with fabric names, colors, quantities, and optional prices. That is more reliable than trying to remember yardage at the counter."],
      ["Mark Bought Items Immediately", "When a fabric is found, mark it as bought so the remaining list stays clear. This is especially useful when shopping for several quilt roles at once."],
      ["Use Substitutions Deliberately", "If a planned fabric is unavailable, update the fabric name or color role in the project so the design record matches what you actually bought."],
      ["Keep Privacy Local", "Because QuiltFit is described as offline, no-login, on-device, and no cloud upload, personal gift notes and fabric choices can stay in the project workspace."]
    ],
    checklist: ["Open the shopping list before checkout.", "Mark bought fabrics in the store.", "Record substitutions immediately.", "Keep project details in the saved quilt."]
  }
);

articles.push(
  {
    slug: "best-pdf-scanner-app-iphone-private-documents",
    category: "PDF Scan",
    title: "Best PDF Scanner App For iPhone: Scan Documents, Receipts, IDs, And Contracts Privately",
    description: "A high-intent SEO guide to choosing a private PDF scanner app for iPhone, with practical tips for scanning documents, receipts, IDs, contracts, notes, forms, and business cards.",
    kicker: "Private PDF scanner",
    readTime: "16 min",
    accent: "cutlist",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Scanner.view.750pix.jpg",
      alt: "Flatbed scanner representing document scanning and PDF capture",
      label: "Document scanning"
    },
    sections: [
      ["Why People Search For A PDF Scanner App", "Most people do not search for a PDF scanner app because they want another productivity tool. They search because a paper document suddenly becomes urgent. A lease needs to be signed. A receipt needs to be submitted. A class handout needs to be saved before it disappears. An invoice, ID, contract, warranty, whiteboard, medical form, or business card needs to become a clean file that can be shared now. That is the moment a good iPhone scanner app has to win: open quickly, detect the page, correct the angle, enhance the text, save the PDF, and let the user move on."],
      ["The Best Scanner App Is Fast And Boring In The Right Way", "A scanner app should not feel like a creative editing suite when the user is holding a form at a kitchen table or standing in a school hallway. The best PDF scanner app for iPhone is clear, predictable, and fast. PDF Scan is positioned around everyday paperwork: receipts, invoices, contracts, notes, IDs, forms, books, whiteboards, and business cards. The product value is not only capture. It is turning a messy real-world page into a shareable PDF without forcing an account, cloud workspace, or complicated setup."],
      ["Camera Capture Has To Fix Real-World Problems", "Paper rarely sits perfectly flat. Phone cameras are held at an angle. Room lighting creates shadows. Receipts curl. Forms have low contrast. A strong mobile PDF scanner handles those realities with smart edge detection, perspective correction, and image enhancement. Edge detection helps frame the page automatically. Perspective correction makes angled shots look more like a proper scan. Enhancement improves shadows, contrast, and sharpness so text is easier to read. This is the practical difference between taking a photo of paper and creating a usable scan."],
      ["Privacy Is A Conversion Feature", "Scanned documents are rarely neutral. They can contain addresses, signatures, payment information, tax details, school records, medical forms, travel IDs, business invoices, legal language, or client names. That makes privacy part of the product decision, not a footer. PDF Scan is built around offline use, no login, privacy-first workflows, on-device processing, and no cloud upload of scans, recognized text, contacts, receipts, signatures, or projects to its own cloud. For searches like private PDF scanner app, offline scanner app, no login scanner, and iPhone document scanner, this privacy message is central."],
      ["A Good Scan Starts Before You Tap Capture", "The app matters, but the capture habit matters too. Place the paper on a contrasting surface. Use even light from the side instead of harsh light directly above the page. Flatten curled edges with a clean object if needed. Hold the phone parallel to the page when possible. Avoid fingers covering corners because edge detection uses the page boundary. Capture one page at a time when quality matters, then combine pages into a multi-page PDF. These small habits make OCR, export, and review more reliable later."],
      ["Multi-Page PDFs Need Organization", "A single-page scan is easy. The problem starts when a project has twelve receipts, three signed pages, two ID copies, and a note sheet. PDF Scan supports multi-page PDFs, page reordering, saved projects, and PDF export choices. That matters because users often return to a scan later. A project-based library helps separate tax documents, rental papers, work contracts, school notes, medical forms, invoices, warranties, business cards, and travel paperwork. The best scanner app is not only a camera. It is a small document workflow."],
      ["When To Save As PDF Versus Image", "PDF is usually the right choice for documents that need to be sent, stored, printed, signed, locked, or kept as a record. Images can be useful when one page needs to be inserted into another workflow or when the user wants the original capture. PDF Scan supports clean PDF files and image exports, which gives users the right format for the job. For SEO, this distinction matters because people search scan to PDF, document scanner app, PDF maker from camera, and save documents as PDF when they are comparing tools."],
      ["Why PDF Scan Fits Everyday Paperwork", "PDF Scan is built for the daily version of document scanning: not a corporate archive room, but a person with an iPhone and a stack of paper. Students can scan class handouts and notes. Freelancers can scan contracts and invoices. Travelers can keep copies of travel paperwork. Parents can scan school forms. Small business owners can scan receipts, IDs, business cards, signed agreements, and warranties. The app keeps the workflow simple: scan, review, recognize, sign, convert, lock if needed, and share."],
      ["A Realistic Buying Decision", "A high-conversion landing path should answer the user's real question: can I trust this app with my documents right now? PDF Scan has a strong answer because it combines camera scanning, project organization, OCR, PDF export, signatures, watermarking, PDF lock tools, business card recognition, receipt and invoice helpers, offline operation, no login, and no cloud upload to its own service. The app should be positioned as a private scanner for urgent everyday paperwork, not a generic file toy."],
      ["Bottom Line", "The best PDF scanner app for iPhone is the one that helps users finish the document task immediately while keeping private files under their control. PDF Scan fits high-intent searches such as PDF scanner app, iPhone scanner app, scan documents to PDF, receipt scanner PDF, contract scanner app, ID scanner app, private scanner app, no login scanner app, and offline PDF scanner. The conversion message is simple: paper comes in, a clean PDF comes out, and the document stays yours."]
    ],
    checklist: ["Use a contrasting background and even light.", "Keep all page corners visible for edge detection.", "Review crop and perspective before exporting.", "Use PDF for shareable records and image export for page assets.", "Store related scans in projects so they are easy to find later."],
    deepDive: {
      figureTitle: "Document capture funnel: paper to private PDF",
      figureCaption: "A scanner app has to handle capture, cleanup, organization, export, and privacy in one short workflow.",
      figureStats: [
        ["5 steps", "Scan, review, organize, export, share"],
        ["0 login", "No account needed for the core workflow"],
        ["Private files", "Receipts, IDs, contracts, forms, notes"]
      ],
      comparisonTitle: "Photo app vs PDF scanner app",
      comparisonColumns: ["Workflow", "Best use", "What breaks down", "PDF Scan advantage"],
      comparisonRows: [
        ["Regular camera photo", "Quick visual memory", "Crooked pages, shadows, no multi-page PDF workflow", "Edge detection and perspective correction"],
        ["General notes app", "Simple personal notes", "Weak document project workflow and export control", "Saved projects and PDF export choices"],
        ["Cloud scanner", "Team sync or shared folders", "May require accounts and uploads", "Offline, no login, no cloud upload to its own service"],
        ["Desktop flatbed scanner", "High-quality desk workflow", "Not portable when paper appears unexpectedly", "iPhone capture anywhere"],
        ["PDF Scan", "Everyday private paperwork", "Not a bulk office ADF replacement", "Scan, OCR, sign, lock, organize, and share from one app"]
      ],
      faqs: [
        ["What is the best PDF scanner app for iPhone?", "For everyday private paperwork, look for edge detection, perspective correction, image enhancement, multi-page PDFs, OCR, organization, export control, and a clear privacy model."],
        ["Is a scanner app better than taking a photo?", "For documents, yes. A scanner app can crop edges, straighten perspective, enhance text, combine pages, create PDFs, and support OCR or signing workflows."],
        ["Can I scan receipts and contracts with PDF Scan?", "Yes. PDF Scan is positioned for receipts, invoices, contracts, notes, IDs, forms, books, whiteboards, business cards, and signed pages."],
        ["Does PDF Scan require a login?", "PDF Scan is positioned around no login and offline document workflows."],
        ["Does PDF Scan upload documents to its own cloud?", "The app page states that PDF Scan does not upload scans, recognized text, contacts, receipts, signatures, or projects to its own cloud."],
        ["Should I save scans as PDF or image?", "Use PDF for records, forms, contracts, receipts, and files you need to share or print. Use image export when a single page needs to be reused as an image asset."]
      ],
      sources: [
        ["PDF Scan app page", "/apps/pdf-scan-scanner-and-reader/", "Internal product page describing scanning, OCR, PDF export, signing, locking, projects, and privacy promises."],
        ["Image scanner overview", "https://en.wikipedia.org/wiki/Image_scanner", "General scanner context, including flatbed, sheetfed, handheld, and document camera concepts."],
        ["Wikimedia Commons: Scanner.view image", "https://commons.wikimedia.org/wiki/File:Scanner.view.750pix.jpg", "Public domain image used to represent document scanning."]
      ]
    }
  },
  {
    slug: "ocr-pdf-scanner-searchable-documents-guide",
    category: "PDF Scan",
    title: "OCR PDF Scanner Guide: Make Scanned Documents Searchable Without Retyping",
    description: "A practical SEO guide to OCR PDF scanning, searchable documents, receipt and invoice text recognition, business card capture, and private on-device document workflows.",
    kicker: "OCR scanning",
    readTime: "17 min",
    accent: "tile",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Test_OCR_document.jpg/1280px-Test_OCR_document.jpg",
      alt: "OCR test document representing searchable text recognition",
      label: "OCR text recognition"
    },
    sections: [
      ["OCR Changes The Value Of A Scan", "A normal scanned PDF is often only an image of a page. That may be enough when the user simply needs to send a signed form, but it is not enough when they need to search, copy, review, or reuse the text. OCR, short for optical character recognition, helps turn the words inside a scan into editable or searchable text. For users searching OCR PDF scanner, searchable PDF app, scan text from image, receipt OCR app, invoice scanner OCR, or business card scanner, this is the difference between storing a picture and creating a useful document."],
      ["What OCR Can And Cannot Promise", "OCR is powerful, but it is not magic. Clean printed text on a flat, well-lit page is usually easier to recognize than handwriting, faded receipts, unusual fonts, stamps, low contrast paper, or curved book pages. A strong scanner app should make OCR easier by improving the image first: crop the page, straighten perspective, reduce shadows, increase contrast, and sharpen text. PDF Scan includes OCR text recognition so users can copy, review, and share words from scanned documents instead of retyping everything."],
      ["Good OCR Starts With Good Capture", "The fastest way to improve OCR is to capture better source images. Fill the frame with the document, keep the phone steady, avoid motion blur, use even lighting, and make sure the text is not skewed. For receipts, flatten folds and avoid glossy reflections. For business cards, capture the card on a plain background and make sure the contact details are not cut off. For invoices, capture the entire page so layout clues such as totals, dates, addresses, and line items remain visible. OCR works best when the app and the user cooperate."],
      ["Searchable PDFs Reduce Future Work", "The value of OCR often appears later. A user may scan a warranty today and search for the model number six months from now. A freelancer may scan a contract and later search for a clause. A student may scan class notes and search a keyword before an exam. A small business owner may scan invoices and search by vendor. A searchable PDF saves future typing, future scrolling, and future frustration. That is why OCR should be described as a document retrieval feature, not only a text extraction feature."],
      ["Receipts And Invoices Need Layout Awareness", "Receipts and invoices are not plain paragraphs. They contain dates, totals, merchants, line items, tax, addresses, invoice numbers, and sometimes tables. Research on scanned invoice extraction often combines OCR output with layout features because the position of text matters. PDF Scan positions receipt and invoice tools around extracting useful fields and exporting line items as CSV for expense tracking. That workflow is especially valuable for users who want to convert paper spending records into something they can review, share, or archive."],
      ["Business Card Scanning Is A Special OCR Case", "Business cards look simple, but they are layout-heavy. Names, titles, companies, emails, phone numbers, and addresses may appear in different orders and styles. PDF Scan includes business card scanning that can recognize contact details and help save them to Contacts. The conversion angle is practical: fewer lost cards, less manual typing, and a faster way to move from a paper contact to a usable phone record."],
      ["Privacy Matters More With OCR", "OCR can make documents more useful, but it can also make them more sensitive because recognized text is easier to search, copy, and analyze. That is why a privacy-first OCR scanner app has a stronger story than a generic scanner. PDF Scan states that document capture, image processing, OCR, PDF generation, signatures, and exports are handled on device, and that it does not upload scans or recognized text to its own cloud. Users searching private OCR scanner or offline OCR PDF app are often asking whether their documents have to leave the phone just to become searchable."],
      ["How To Review OCR Results", "A responsible OCR workflow includes review. After recognition, check names, totals, dates, addresses, invoice numbers, and signature blocks before relying on the extracted text. If the source page is important, keep the visual PDF as the record and treat OCR text as a convenience layer. For business cards, confirm the contact name and phone number before saving. For receipts, compare the recognized total against the image. For contracts, search is useful, but final interpretation should still come from the original page."],
      ["When OCR Is Worth Paying For", "OCR becomes subscription-worthy when it saves repeated manual work. A student scanning one page may only need a clean PDF. A freelancer scanning contracts, receipts, and invoices every week may benefit from searchable text, business card recognition, line item export, signatures, and PDF lock tools. A traveler may want offline scanning because documents appear in airports, hotels, and offices where internet access is unreliable. The strongest value proposition is not novelty. It is turning repeated paper friction into a fast, private workflow."],
      ["Bottom Line", "An OCR PDF scanner app should make documents easier to find, copy, review, and reuse without making privacy harder. PDF Scan fits searches like OCR PDF scanner, searchable PDF app, receipt OCR scanner, invoice OCR app, business card scanner, scan text from image, offline OCR scanner, and private document scanner. The core message is direct: capture the page, recognize the words, keep control of the file."]
    ],
    checklist: ["Capture pages flat, sharp, and evenly lit.", "Straighten perspective before OCR when possible.", "Review important fields after recognition.", "Keep the visual PDF as the record and OCR text as a convenience layer.", "Use offline/on-device OCR when documents contain private information."],
    deepDive: {
      figureTitle: "OCR workflow: image first, text second",
      figureCaption: "Searchable documents depend on both the quality of the source scan and the reliability of the text recognition layer.",
      figureStats: [
        ["OCR", "Turns scans into searchable text"],
        ["Layout", "Dates, totals, names, and fields depend on position"],
        ["Review", "Important extracted fields should be checked"]
      ],
      comparisonTitle: "OCR use cases by document type",
      comparisonColumns: ["Document", "Useful OCR output", "Review carefully", "Why PDF Scan helps"],
      comparisonRows: [
        ["Receipt", "Merchant, date, total, line items", "Totals, taxes, card fragments", "Receipt and invoice tools plus CSV line item export"],
        ["Invoice", "Vendor, invoice number, due date, amount", "Numbers, addresses, payment terms", "OCR plus project organization"],
        ["Business card", "Name, phone, email, company", "Phone numbers and email spelling", "Recognize contact details and save to Contacts"],
        ["Contract", "Searchable clauses and names", "Legal wording and signature pages", "Searchable PDF plus signing and PDF lock tools"],
        ["Class notes", "Keywords and copied text", "Handwriting and diagrams", "Scan, OCR, organize by project"]
      ],
      faqs: [
        ["What does OCR mean in a PDF scanner app?", "OCR means optical character recognition. It helps identify text inside scanned images so users can search, copy, or review the words."],
        ["Can OCR read handwriting?", "Sometimes, but handwriting is harder than clean printed text. Lighting, sharpness, contrast, and handwriting style all affect results."],
        ["What is a searchable PDF?", "A searchable PDF keeps the visual page while also including recognized text that can be found with search or copied in supported workflows."],
        ["Is OCR useful for receipts?", "Yes. OCR can help capture merchant names, dates, totals, and line items, but important fields should still be reviewed against the image."],
        ["Why does on-device OCR matter?", "OCR text may contain private data. On-device processing can reduce the need to upload sensitive documents just to recognize text."],
        ["Does PDF Scan support OCR?", "Yes. The app page describes OCR text recognition, business card scanning, and receipt or invoice tools."]
      ],
      sources: [
        ["PDF Scan app page", "/apps/pdf-scan-scanner-and-reader/", "Internal product page describing OCR text recognition, business card scanning, receipt and invoice tools, CSV export, and privacy."],
        ["OCR4all workflow paper", "https://arxiv.org/abs/1909.04032", "Research context on OCR as a workflow involving preprocessing, layout recognition, character recognition, and post-processing."],
        ["Scanned invoice extraction research", "https://arxiv.org/abs/2208.04011", "Discusses using OCR output with layout features for invoice data extraction."],
        ["Wikimedia Commons: Test OCR document image", "https://commons.wikimedia.org/wiki/File:Test_OCR_document.jpg", "CC0 image used to represent OCR text recognition."]
      ]
    }
  },
  {
    slug: "scan-to-pdf-workflow-receipts-invoices-signatures-lock",
    category: "PDF Scan",
    title: "Scan To PDF Workflow: Receipts, Invoices, Signatures, PDF Lock, And Project Organization",
    description: "A conversion-focused SEO guide to building a scan to PDF workflow for receipts, invoices, contracts, IDs, signatures, locked PDFs, CSV exports, and organized document projects.",
    kicker: "Scan to PDF workflow",
    readTime: "18 min",
    accent: "stairs",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Scanner-test.pdf/page1-960px-Scanner-test.pdf.jpg",
      alt: "Scanner test PDF page representing scan to PDF quality checks",
      label: "Scan to PDF quality"
    },
    sections: [
      ["A Scan To PDF Workflow Is More Than Capture", "The phrase scan to PDF sounds simple, but real paperwork has a workflow. A user captures pages, reviews the crop, reorders pages, recognizes text, signs when needed, locks sensitive files, exports the right size, and shares the final document. If any step is awkward, the user falls back to messy camera photos or scattered files. PDF Scan is designed to keep these steps together on iPhone: scan, review, recognize, sign, convert, protect, organize, and share."],
      ["Start With The Destination", "Before scanning, decide what the PDF needs to do. A school form may need a signature and email attachment. A receipt may need OCR and CSV export. A contract may need page order, a signature, and password protection. A warranty may need to be saved in a project for later search. A whiteboard may only need a clean image export. Choosing the destination first helps the user decide whether to scan at higher quality, smaller file size, multi-page PDF, image export, or original image retention."],
      ["Receipts Need Speed And Review", "Receipts are usually scanned under imperfect conditions: while traveling, after a meeting, in a car, at a counter, or during tax season cleanup. The workflow should be fast enough that the receipt is captured before it is lost, but not so automatic that errors go unnoticed. PDF Scan supports receipt and invoice tools that can extract useful fields and export line items as CSV. For users searching receipt scanner PDF, expense receipt scanner, scan receipt to PDF, or invoice scanner app, this combination of speed plus review is the key selling point."],
      ["Invoices Need Structure", "Invoices often contain structured information: vendor, invoice number, date, due date, totals, tax, line items, and payment terms. A useful scan workflow keeps the page readable and the data recoverable. OCR can help pull text, while project organization keeps related invoices together. CSV export can help move line items into expense or bookkeeping workflows. The right app does not have to replace accounting software. It has to turn a paper invoice into a file that can be named, found, reviewed, and shared."],
      ["Contracts And Forms Need Page Control", "Contracts, forms, applications, and signed agreements often become multi-page PDFs. Page order matters. Missing pages create delays. A scanner app should support multi-page capture, page reordering, saved projects, signatures, and export. PDF Scan includes multi-page PDFs, page reordering, signatures, watermarking, PDF lock tools, and share sheet export. That makes it useful when a document needs to look complete and professional before it leaves the phone."],
      ["Signatures Should Stay Close To The Document", "A common mobile workflow is scan, sign, export, and send. If signing requires another app, the user risks losing page order, exporting the wrong version, or creating duplicate files. PDF Scan lets users sign a document and place the signature on the page. The value is especially clear for freelancers, parents, renters, students, contractors, and travelers who need to return a signed file quickly. For SEO, this supports scan and sign PDF, sign scanned document on iPhone, and PDF scanner with signature searches."],
      ["PDF Lock Is About Appropriate Friction", "Some files should not be shared casually: IDs, contracts, medical forms, school records, tax documents, and signed agreements. PDF lock tools can help protect a document with a password before sharing. This is not a substitute for a full legal security policy, but it is useful friction for everyday document handling. A high-trust scanner app should make protection visible without making every simple scan difficult."],
      ["Projects Prevent The Paper Pile From Becoming A File Pile", "Scanning paper is only useful if the resulting files can be found later. Without organization, the phone becomes a new paper pile with better resolution. PDF Scan supports project-based organization for tax documents, school notes, rental papers, travel receipts, work contracts, medical forms, invoices, business cards, warranties, and signed agreements. A project library creates a natural mental model: capture now, add more pages later, export the right file when asked."],
      ["File Size And Quality Are A Tradeoff", "A high-quality scan is easier to read and better for OCR, but it may create a larger PDF. A smaller PDF is easier to email or upload, but aggressive compression can damage fine print, signatures, stamps, or small receipt text. PDF Scan supports export choices for smaller or higher quality PDF files. The practical advice is simple: use higher quality for contracts, IDs, forms, and OCR-heavy documents; use smaller exports when the document is simple and the recipient has file size limits."],
      ["Why Offline Workflow Wins In The Real World", "Scanning happens in unpredictable places: airports, hotels, school offices, client sites, job sites, rental offices, and waiting rooms. Offline scanning matters because paperwork cannot always wait for a strong connection. PDF Scan is positioned around offline core scanning, organizing, OCR, PDF creation, and export workflows, no login, on-device processing, and no cloud upload to its own service. That reduces friction and strengthens trust at the same time."],
      ["Bottom Line", "A scan to PDF workflow should take the user from paper to finished file without scattering the task across five apps. PDF Scan covers the core high-intent needs: document capture, receipts, invoices, OCR, CSV export, page reordering, signatures, watermarking, PDF lock, image export, projects, offline use, no login, and private on-device handling. It fits searches like scan to PDF app, PDF scanner with OCR, receipt scanner PDF, invoice scanner app, scan and sign PDF, PDF lock app, private document scanner, and offline PDF scanner app."]
    ],
    checklist: ["Decide whether the final file needs OCR, signature, lock, or small size.", "Capture all pages before exporting multi-page documents.", "Review page order before sharing contracts or forms.", "Use higher quality for OCR-heavy or fine-print pages.", "Group related scans into projects so files are easy to retrieve."],
    deepDive: {
      figureTitle: "Finished-file workflow: scan, edit, protect, share",
      figureCaption: "The strongest scan to PDF workflow keeps page quality, file structure, privacy, and sharing in one place.",
      figureStats: [
        ["Multi-page", "Capture and reorder pages"],
        ["OCR + CSV", "Useful for receipts and invoices"],
        ["Lock", "Protect sensitive PDFs before sharing"]
      ],
      comparisonTitle: "Which PDF workflow fits the document?",
      comparisonColumns: ["Document type", "Priority", "Export choice", "Extra step"],
      comparisonRows: [
        ["Receipt", "Capture before it is lost", "PDF or CSV line items", "Review total and merchant"],
        ["Invoice", "Keep fields readable", "Searchable PDF plus CSV when useful", "Check invoice number and due date"],
        ["Contract", "Page order and signatures", "Higher quality PDF", "Sign and lock when sensitive"],
        ["ID or travel paper", "Clarity and privacy", "High-quality PDF or image", "Use PDF lock before sharing if needed"],
        ["Whiteboard or notes", "Fast capture and readability", "Image or PDF", "Crop and enhance contrast"]
      ],
      faqs: [
        ["What is the best scan to PDF workflow?", "Capture clearly, review crop and page order, run OCR if text matters, sign or lock if needed, choose the right file size, then export or share."],
        ["Can PDF Scan handle receipts and invoices?", "Yes. PDF Scan describes receipt and invoice tools that extract useful fields and export line items as CSV for expense tracking."],
        ["Can I sign a scanned PDF on iPhone?", "PDF Scan includes signature tools that let users place a signature on the page before sharing."],
        ["When should I lock a scanned PDF?", "Consider locking files that contain IDs, contracts, medical forms, tax records, signatures, or other sensitive information before sharing."],
        ["Should I export smaller or higher quality PDFs?", "Use higher quality for fine print, OCR, signatures, IDs, and contracts. Use smaller files when the document is simple and the recipient has size limits."],
        ["Does an offline PDF scanner matter?", "Yes. Offline scanning helps when documents appear in places with weak or no internet, and it supports privacy by reducing dependency on cloud workflows."]
      ],
      sources: [
        ["PDF Scan app page", "/apps/pdf-scan-scanner-and-reader/", "Internal product page describing multi-page PDFs, reordering, OCR, signatures, watermarks, PDF lock, export choices, and projects."],
        ["PDF/A standard for long term archiving", "https://arxiv.org/abs/0906.0867", "Context on PDF/A as a long-term electronic document preservation format."],
        ["Image scanner overview", "https://en.wikipedia.org/wiki/Image_scanner", "General context for document scanning concepts and scanning device types."],
        ["Wikimedia Commons: Scanner-test PDF image", "https://commons.wikimedia.org/wiki/File:Scanner-test.pdf", "CC0 test PDF image used to represent scan quality review."]
      ]
    }
  },
  {
    slug: "best-metronome-app-daily-practice-cadenza",
    category: "Cadenza",
    title: "Best Metronome App For Daily Practice: Tempo, Tap Tempo, Accents, And Setlists",
    description: "A practical high-SEO guide to using Cadenza as a daily metronome app for musicians who need steady tempo, tap tempo, accent control, tempo ramping, and private offline practice.",
    kicker: "Metronome practice",
    readTime: "16 min",
    accent: "tile",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/80/Korg_TM-40_metronome.jpg",
      alt: "Digital metronome and tuner used for music practice",
      label: "Metronome and tuner"
    },
    sections: [
      ["Why A Metronome App Still Matters", "The best metronome app is not only a ticking sound. It is a practice decision tool. A musician opens it when the passage feels rushed, when a teacher asks for a slower repeat, when a band needs the same tempo twice, or when a student wants proof that the scale stayed even. Cadenza is built for this exact routine: open the app, set the BPM, choose the meter, shape the accents, and start practicing without a login or cloud workspace. That matters because daily music practice is usually fragmented. Ten focused minutes before work, a warmup before rehearsal, a quick tempo check before recording, or a quiet evening session all benefit from a metronome that is fast enough to use before motivation disappears."],
      ["Tempo Is Emotional Before It Is Numerical", "Musicians often talk about tempo as a number, but they experience it as control. A passage at 96 BPM may feel calm, while the same passage at 104 BPM may feel unstable. A rehearsal tempo can also carry pressure because everyone hears mistakes at the same time. Cadenza keeps the number visible and adjustable from 20 to 240 BPM, but it also gives musical names such as Largo, Andante, Allegro, Presto, and Prestissimo. Those names help a player connect the number to musical feeling. For SEO searches like practice metronome app, best metronome app for musicians, and rhythm practice app, this is the conversion point: the app should make tempo feel less abstract and more usable."],
      ["Tap Tempo Helps Match Real Music", "A fixed BPM value is useful when a score gives a marking, but many practice situations start from listening. A guitarist may want to learn a riff from a recording. A drummer may need to match a rehearsal count-off. A singer may feel a phrase before knowing the tempo. Tap Tempo turns that physical pulse into a number. Cadenza lets the user tap the beat they hear and convert it into a BPM value, then keep practicing with the metronome. This is valuable because it bridges musical instinct and measurable repetition. Instead of guessing whether a song is near 112 or 118 BPM, the player can tap, save the value, and return to it later."],
      ["Accents Turn Ticks Into Measures", "A basic click can keep time, but real music lives inside bars. Cadenza supports common time signatures including 2/4, 3/4, 4/4, 5/8, 6/8, 7/8, 9/8, 11/8, and 12/8. Beat dots show the shape of the bar, and each dot can cycle through strong, medium, weak, or silent accents. That makes the metronome useful for more than simple quarter notes. A student can practice the strong beat in 3/4, feel compound movement in 6/8, or work through odd meters without mentally forcing everything into 4/4. The benefit is low cognitive load: the meter is visible, the accents are intentional, and the musician can focus on sound."],
      ["Tempo Ramp Builds Speed Without Panic", "Many musicians make the same mistake when learning a fast passage: they jump from comfortable to target tempo too quickly, then practice tension. Tempo ramping gives a better path. Cadenza lets the user choose a start BPM, end BPM, and number of bars for the ramp. That makes it useful for scales, bowing drills, picking patterns, double-tonguing, keyboard runs, percussion rudiments, or any passage that needs gradual speed. The point is not to chase a number. The point is to notice when timing, sound, or body tension changes as the tempo rises. A good metronome app helps the player find that boundary before bad habits become automatic."],
      ["Setlists Keep Practice From Resetting Every Day", "A metronome is strongest when it remembers the context around the number. Cadenza setlists can store title, composer, BPM, time signature, key, and notes, then load the piece into the metronome. This turns a one-time tempo choice into a reusable practice record. For students, it means lesson assignments can stay organized. For band, choir, theater, or worship musicians, it means rehearsal tempos do not have to be rebuilt from memory. For solo practice, it makes progress more visible because the same piece can be revisited with the same settings."],
      ["Offline Practice Is A Real Feature", "Many musicians practice in rooms where internet access is irrelevant or unreliable: basement studios, school practice rooms, backstage areas, churches, rehearsal halls, airplanes, and bedrooms. Cadenza is positioned around offline operation, no login, privacy-first design, on-device workflows, and no cloud upload of tuner audio, setlists, or practice history. This is not only a privacy claim; it is a usability claim. A metronome app should not need a network request before a warmup. A musician should be able to open it, count in, and work."],
      ["How To Use Cadenza For A 20 Minute Practice Session", "Start with two minutes of slow tone or scale work at a comfortable BPM. Use clear accents so the bar shape is obvious. Move to five minutes of problem spots, starting below performance tempo and using tempo ramp only when the notes stay relaxed. Spend five minutes on rhythm isolation by clapping, tapping, or playing on one pitch with the same meter. Use Tap Tempo if the piece came from a recording. Finish by loading the setlist entry and running the piece at the target or rehearsal tempo. This simple workflow gives the metronome a job at every stage: stabilize, diagnose, build, and recall."],
      ["The Bottom Line", "The best metronome app for daily practice is the one musicians actually open every day. It should be fast, readable, flexible, and private. Cadenza combines practical tempo controls, tap tempo, accent dots, tempo ramping, setlists, and offline design into a focused iPhone workflow. That makes it a strong fit for searches like metronome app, practice metronome, rhythm practice app, tap tempo app, offline metronome, and music practice companion. More importantly, it helps musicians turn scattered practice time into repeatable progress."]
    ],
    checklist: ["Choose a BPM that keeps the passage relaxed.", "Use time signatures and accents to make the bar shape clear.", "Use Tap Tempo when learning from a recording or rehearsal count-off.", "Use Tempo Ramp only after the slow version is clean.", "Save piece tempo, meter, key, and notes in a Cadenza setlist."],
    deepDive: {
      figureTitle: "Practice flow: from pulse to repeatable tempo",
      figureCaption: "A useful metronome workflow starts with the pulse a musician feels, turns it into a stable BPM, then saves the tempo with the piece so practice can resume quickly.",
      figureStats: [
        ["20-240 BPM", "Cadenza tempo range"],
        ["9 meters", "Common and odd time signatures"],
        ["4 accent states", "Strong, medium, weak, silent"]
      ],
      comparisonTitle: "Metronome practice features that change real sessions",
      comparisonColumns: ["Feature", "Best use", "Why it matters", "Cadenza workflow"],
      comparisonRows: [
        ["Large BPM display", "Music stand, piano bench, rehearsal room", "The player can check tempo without breaking posture", "Set 20-240 BPM and nudge one beat at a time"],
        ["Tap Tempo", "Learning from recordings or matching a count-off", "Turns a felt pulse into a saved number", "Tap the beat, then practice against the measured BPM"],
        ["Accent dots", "Meters, subdivision drills, and odd time", "Makes the bar shape audible and visible", "Tap dots to choose strong, medium, weak, or silent accents"],
        ["Tempo Ramp", "Gradual speed building", "Finds the point where control starts to break", "Set start BPM, end BPM, and ramp length in bars"],
        ["Setlists", "Lessons, rehearsals, and repeat pieces", "Keeps tempo decisions from disappearing", "Save title, composer, BPM, meter, key, and notes"]
      ],
      faqs: [
        ["What is the best metronome app for daily practice?", "The best app is fast to open, easy to read, flexible with tempo and meter, and able to save practice context. Cadenza is designed around that daily workflow."],
        ["Why use Tap Tempo instead of typing BPM?", "Tap Tempo is useful when the tempo comes from a recording, conductor, rehearsal count-off, or natural phrase feel rather than a printed marking."],
        ["Do accent patterns matter?", "Yes. Accents help musicians hear the shape of the bar, which is especially useful in compound meters, odd meters, and rhythm studies."],
        ["Is Tempo Ramp only for advanced players?", "No. Beginners can use it carefully to increase speed in small steps, as long as relaxed sound and accurate timing stay more important than the final number."],
        ["Does Cadenza work offline?", "Yes. Cadenza is positioned around offline practice, no login, on-device workflows, and no cloud upload for core practice data."],
        ["Can I use Cadenza for band or choir rehearsal?", "Yes. Setlists can store piece tempo, meter, key, composer, and notes, which is useful when rehearsal moves quickly."]
      ],
      sources: [
        ["Cadenza app page", "/apps/cadenza-metronome-and-tuner/", "Internal product page describing metronome range, Tap Tempo, accents, Tempo Ramp, setlists, privacy, and offline operation."],
        ["Microtiming and swing research", "https://arxiv.org/abs/1904.03442", "Research context for timing perception and the musical importance of deviations around a pulse."],
        ["Wikimedia Commons: Korg TM-40 metronome image", "https://commons.wikimedia.org/wiki/File:Korg_TM-40_metronome.jpg", "CC0 image used to represent a real digital metronome and tuner practice setup."]
      ]
    }
  },
  {
    slug: "guitar-tuner-app-cents-a4-reference-cadenza",
    category: "Cadenza",
    title: "Guitar Tuner App Guide: Cents, A4 Reference, Chromatic Tuning, And Drone Tones",
    description: "A musician-friendly guide to using Cadenza as a guitar tuner app, chromatic tuner, A4 reference tool, and drone tone companion for cleaner intonation practice.",
    kicker: "Tuning guide",
    readTime: "17 min",
    accent: "stairs",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/54/Telecaster_Thinline_type_guitar_with_pedalboard_%28SecretPreamp%2CMXR10BandEQ%2CSupa-Trem%2CPOG2%2CSP_Comp%2CTuner%2CBigSky%2CSeaMachine%2CGigaDelay%2CTimmyOverdrive%2CBroadcast%2CVolumPedal%29_-_The_Smith_Center%2C_Las_Vegas_%282017-04-29_10.28.27_piqsels.com_en%29.jpg",
      alt: "Electric guitar and pedalboard with a chromatic tuner for practice",
      label: "Guitar tuning workflow"
    },
    sections: [
      ["A Tuner App Should Make Pitch Easier To Trust", "A good guitar tuner app does more than say sharp or flat. It gives the musician enough information to act confidently without turning tuning into a science project. Cadenza listens through the microphone and shows nearest note, frequency, and cents offset. That combination is useful because musicians often need different levels of detail. A beginner may only need to know whether the string is flat. A teacher may want to explain how far the note is from the target. A violinist, vocalist, brass player, or guitarist may want to use a drone tone and tune by ear. The app should support all of those modes without forcing extra setup."],
      ["What Cents Mean In Tuning", "The cent is a small unit used to describe pitch differences. In the common equal-tempered system, one semitone is divided into 100 cents. That makes cents useful because musicians can talk about pitch error without saying a frequency ratio every time. If a tuner shows a note at +12 cents, it is sharper than the target by a little more than one tenth of a semitone. If it shows -8 cents, it is slightly flat. For SEO searches like cents tuner app, guitar tuner cents, chromatic tuner app, and intonation practice app, this is the practical takeaway: cents are a readable way to measure small tuning differences."],
      ["Why A4 Reference Matters", "A4 is commonly used as a tuning reference, and 440 Hz is widely recognized as a standard concert pitch. Real musical contexts vary, however. Some ensembles, teachers, recordings, or instruments may use references such as 442 or 443 Hz, while some users prefer 432 Hz for personal practice. Cadenza includes A4 choices at 432, 440, 441, 442, 443, and 444 Hz. The benefit is not that one reference is universally better. The benefit is that the app can match the musical situation. A tuner is only useful if its target agrees with the room, ensemble, teacher, or recording."],
      ["Chromatic Mode Keeps The App Useful Beyond Guitar", "Instrument presets are convenient, but musicians eventually need a chromatic tuner. Cadenza includes chromatic mode for any pitch the microphone hears. That matters for voice, winds, brass, strings, percussion references, and general music practice. A guitarist can tune standard strings quickly, then switch to chromatic mode for alternate tunings or checking a melody note. A cello, violin, bass guitar, or ukulele player can work from a familiar preset but still use chromatic tuning when needed. This makes Cadenza more than a single-instrument utility."],
      ["Presets Reduce Mental Load", "Cadenza includes presets for guitar, bass guitar, ukulele, violin, and cello. Presets matter because real practice already has enough friction. A guitarist wants E, A, D, G, B, E. A violinist wants G, D, A, E. A bass guitarist wants E, A, D, G. A cellist wants C, G, D, A. A preset lets the player think in familiar strings instead of scanning every possible note. That speed matters before lessons, rehearsals, recordings, and quick tune-ups between songs."],
      ["Drone Tones Train The Ear", "A visual tuner is excellent for calibration, but musicians also need listening skill. Drone tones play a sustained reference note so the player can hear pitch relationships, tune intervals, practice long tones, and stabilize intonation without staring at a needle. This is especially useful for bowed strings, wind instruments, voice, brass, and any player working on tone center. A drone can make intonation more musical because the player hears how the note sits against a reference rather than only correcting a display."],
      ["Why The Microphone Environment Matters", "Any microphone-based tuner can struggle when the room is noisy, when another instrument is sounding, when the note has strong overtones, or when the player attacks the string too aggressively. A practical tuning workflow is simple: mute other strings, play one steady note, let the pitch settle, and adjust slowly. For guitar and bass, tune up to the target rather than down when possible, because string tension and tuning machines often settle more predictably that way. For bowed strings and voice, sustain the tone long enough for the tuner to identify the center."],
      ["Private On-Device Tuning Is A Strong Product Promise", "Tuning can feel ordinary, but audio privacy still matters. Cadenza is designed around offline use, no login, on-device workflows, and no cloud upload of tuner audio, setlists, or practice logs. That means the app can be useful in a lesson room, rehearsal space, school practice room, hotel room, or backstage area without becoming a cloud audio product. A musician searching for private tuner app, offline tuner app, or iPhone tuner app may not want extra accounts, social features, or uploads. They want the pitch, quickly."],
      ["A Simple Cadenza Tuning Routine", "Open the tuner before practice, choose the relevant preset or chromatic mode, confirm the A4 reference, and tune each string or note slowly. Use the cents display to get close, then use a drone tone to check how the pitch feels against a sustained reference. If you are preparing for ensemble work, match the A4 setting used by that group. If you are recording, tune again after warmup because strings, reeds, brass, and voice can shift as the session begins. Save the practice context in Cadenza if the piece also needs a BPM, meter, or notes."],
      ["The Bottom Line", "Cadenza is a strong fit for musicians who want one iPhone app for metronome, guitar tuner, chromatic tuner, A4 reference, drone tones, and practice context. The high-conversion promise is simple: tune quickly, practice privately, and keep moving. For SEO, this article naturally targets guitar tuner app, chromatic tuner app, cents tuner, A4 440 tuner, violin tuner app, cello tuner app, ukulele tuner app, bass tuner app, drone tone app, and offline tuner app."]
    ],
    checklist: ["Choose the right instrument preset or chromatic mode.", "Confirm the A4 reference before ensemble or recording work.", "Use cents to understand small pitch differences.", "Play one clear sustained note at a time.", "Use drone tones to train listening, not only visual correction."],
    deepDive: {
      figureTitle: "Tuning stack: reference, note, cents, ear",
      figureCaption: "A practical tuning workflow starts with the A4 reference, identifies the nearest note, checks cents offset, then uses listening to settle the pitch musically.",
      figureStats: [
        ["100 cents", "One equal-tempered semitone"],
        ["6 A4 choices", "432 through 444 Hz"],
        ["5 presets", "Guitar, bass, ukulele, violin, cello"]
      ],
      comparisonTitle: "Tuner modes and when to use them",
      comparisonColumns: ["Mode", "Best use", "Main benefit", "Watch out for"],
      comparisonRows: [
        ["Guitar preset", "Standard guitar tune-ups", "Shows familiar string targets quickly", "Alternate tunings may need chromatic mode"],
        ["Bass guitar preset", "Quick low-string calibration", "Reduces note scanning for common bass strings", "Low notes need a clear sustained attack"],
        ["Ukulele preset", "Fast practice setup", "Matches familiar ukulele string targets", "Room noise can confuse short plucked notes"],
        ["Violin or cello preset", "String-family tuning", "Supports familiar open-string references", "Bow pressure and finger contact can move pitch"],
        ["Chromatic mode", "Voice, winds, brass, alternate tunings, general checking", "Works across the full musical note space", "The player must know the target note"],
        ["Drone tones", "Ear training and intonation practice", "Develops pitch center by listening", "Requires patience and a quiet enough room"]
      ],
      faqs: [
        ["What does cents mean on a tuner?", "Cents measure small pitch differences. In equal temperament, 100 cents equals one semitone, so +10 cents means slightly sharp and -10 cents means slightly flat."],
        ["Is 440 Hz always the right A4 reference?", "440 Hz is widely used, but some ensembles and contexts use other references. Cadenza supports 432, 440, 441, 442, 443, and 444 Hz so users can match the situation."],
        ["Can I use Cadenza as a guitar tuner app?", "Yes. Cadenza includes instrument presets such as guitar and bass guitar, plus chromatic tuning for broader pitch checking."],
        ["Why use drone tones if I already have a tuner?", "A visual tuner helps calibrate pitch, while drone tones help train the ear to hear intervals and pitch center against a sustained reference."],
        ["Does microphone tuning work in noisy rooms?", "It can be harder. Play one clear note, mute nearby strings, reduce background noise, and let the pitch settle before adjusting."],
        ["Does Cadenza upload tuner audio?", "Cadenza is positioned around on-device operation and no cloud upload for tuner audio, metronome use, setlists, or practice logs."]
      ],
      sources: [
        ["Cadenza app page", "/apps/cadenza-metronome-and-tuner/", "Internal product page describing tuner, nearest note, frequency, cents, A4 references, presets, drone tones, and privacy."],
        ["A440 pitch standard", "https://en.wikipedia.org/wiki/A440_(pitch_standard)", "Reference context for A4 at 440 Hz as a common tuning standard."],
        ["Cent in music", "https://en.wikipedia.org/wiki/Cent_(music)", "Explains cents as a logarithmic unit used for small musical intervals."],
        ["Electronic tuner", "https://en.wikipedia.org/wiki/Electronic_tuner", "General context on electronic tuners, frequency detection, and tuning displays."],
        ["Wikimedia Commons: guitar and pedalboard image", "https://commons.wikimedia.org/wiki/File:Telecaster_Thinline_type_guitar_with_pedalboard_(SecretPreamp,MXR10BandEQ,Supa-Trem,POG2,SP_Comp,Tuner,BigSky,SeaMachine,GigaDelay,TimmyOverdrive,Broadcast,VolumPedal)_-_The_Smith_Center,_Las_Vegas_(2017-04-29_10.28.27_piqsels.com_en).jpg", "CC0 image used to represent guitar tuning and real practice gear."]
      ]
    }
  },
  {
    slug: "music-practice-tracker-setlist-metronome-tuner-cadenza",
    category: "Cadenza",
    title: "Music Practice Tracker Workflow: Setlists, Tempo Notes, Tuning, And Daily Repetition",
    description: "A high-intent guide to using Cadenza as a private music practice tracker with setlists, metronome settings, tuner context, tempo notes, and offline rehearsal memory.",
    kicker: "Practice workflow",
    readTime: "18 min",
    accent: "quiltfit",
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Practice_Keyboard_MET_206990.jpg",
      alt: "Practice keyboard representing daily music practice and repetition",
      label: "Daily practice memory"
    },
    sections: [
      ["Practice Fails When Context Disappears", "Many musicians do not fail because they lack motivation. They lose time because yesterday's context disappears. What tempo was the etude last week? Which measure needed slow work? Was the piece in 6/8 or 12/8 for rehearsal? Which key did the singer prefer? Did the teacher ask for a slower ramp or cleaner accents? A music practice tracker is valuable when it keeps those decisions close to the metronome and tuner. Cadenza is designed as a focused practice companion rather than a heavy project management system, which makes it useful for daily repetition."],
      ["Setlists Are More Than Performance Lists", "A setlist can be a concert order, but in practice it is also a memory structure. Cadenza lets users save title, composer, BPM, time signature, key, and notes. That makes each piece easier to restart. A violin student can save an etude tempo and key. A guitarist can save a song BPM and tuning reminder. A choir member can save rehearsal notes. A drummer can save odd meter practice settings. A pianist can save slow tempo targets for separate sections. The value is not paperwork. The value is reducing the time between opening the app and doing the next useful repetition."],
      ["Tempo Notes Make Progress Visible", "Progress in music practice is often invisible because it happens in tiny increments. A passage that was shaky at 72 BPM becomes reliable at 78 BPM, then starts to fall apart at 84 BPM. If the musician records the working tempo, they know where to start tomorrow. Cadenza's setlist and metronome workflow supports that habit by keeping BPM and meter tied to the piece. The app does not need to turn practice into a spreadsheet. It simply needs to preserve the tempo decision that would otherwise be forgotten."],
      ["A Tuner Belongs In The Same Practice Flow", "Tuning is often treated as a separate task, but it changes practice quality. If the instrument is off, the player may spend time adapting to a problem instead of training the ear. Cadenza combines metronome and tuner so the session can begin with pitch, then move directly into rhythm. The tuner shows nearest note, frequency, and cents offset, while chromatic mode, instrument presets, A4 reference choices, and drone tones support different instruments and contexts. For search intent like metronome tuner app, music practice app, and practice companion app, that all-in-one flow matters."],
      ["Offline Workflows Fit Real Practice Spaces", "A practice tracker should not depend on a login screen. Musicians practice in classrooms, churches, backstage corners, orchestra rooms, apartments, studios, and school halls where connectivity may be poor or irrelevant. Cadenza emphasizes offline operation, no login, privacy-first design, on-device workflows, and no cloud upload. This makes the app feel more like a tool than a platform. For users searching offline music practice app, private practice tracker, or no login metronome tuner, that promise is a conversion advantage."],
      ["How To Structure A Piece In Cadenza", "Create a setlist entry for the piece with title, composer, key, target BPM, time signature, and short notes. Add one sentence about the current practice problem, such as clean shifts in bar 18, relaxed right hand at 92 BPM, or tune third scale degree against drone. Start each session by loading the piece, then decide whether today's work is rhythm, tuning, sound, or memory. The app becomes a compact rehearsal notebook linked to the actual tools used during practice."],
      ["Use Cases Across Musicians", "A guitar player can use Cadenza for tuning, alternate tempo notes, riff speed building, and setlist preparation. A violin or cello player can combine drone tones with slow metronome work for intonation and bow control. A singer can use chromatic tuning references and tempo notes for rehearsal pieces. A drummer can work on odd meters and accent patterns. A pianist can save tempo targets for scales, études, repertoire, and sight-reading sessions. A teacher can recommend a simple workflow without requiring students to create accounts."],
      ["Keep Notes Short Enough To Reuse", "The best practice notes are short, specific, and actionable. Long journals can be useful, but they often become too heavy for daily use. In a Cadenza setlist entry, a good note might say: start at 76, ramp to 92 over 16 bars; strong beat only in 7/8; check A string with drone before piece; do not speed up in bridge. These notes are practical because they point to the next action. The app's role is to keep them near the metronome and tuner, not bury them in a separate document."],
      ["Daily Repetition Needs Low Friction", "High-quality practice is not glamorous. It is repeatable. The more steps it takes to resume a piece, the less likely a musician is to do the right drill. Cadenza reduces friction by combining tempo, meter, accents, tuner, drone tones, and setlist memory in one offline iPhone app. That can support beginners building routine, advanced players polishing details, and working musicians who need reliable rehearsal notes on the move."],
      ["The Bottom Line", "A music practice tracker should help musicians remember what to do next. Cadenza supports that by tying setlists, BPM, time signature, key, notes, metronome controls, tuner readings, A4 references, and drone tones into one private offline workflow. For SEO, this article targets music practice tracker, practice log app for musicians, setlist app, metronome tuner app, offline music practice app, private music practice app, tempo notes app, and rehearsal tracker."]
    ],
    checklist: ["Create a setlist entry for each active piece.", "Save BPM, meter, key, composer, and one useful note.", "Begin practice with tuning or drone tones when pitch matters.", "Use the metronome to define today's working tempo.", "Update notes only when they change the next session."],
    deepDive: {
      figureTitle: "Practice memory loop: tune, count, repeat, save",
      figureCaption: "Cadenza's practice value comes from keeping the next repetition connected to the pitch, tempo, meter, key, and note context from the previous session.",
      figureStats: [
        ["1 entry", "Piece, tempo, meter, key, notes"],
        ["2 tools", "Metronome plus tuner"],
        ["0 login", "Private on-device workflow"]
      ],
      comparisonTitle: "Practice tracking methods compared",
      comparisonColumns: ["Method", "Best use", "What breaks down", "Cadenza advantage"],
      comparisonRows: [
        ["Memory only", "Very short casual practice", "Tempo, meter, and notes disappear between sessions", "Setlist entries preserve the next action"],
        ["Paper notebook", "Detailed lesson notes and reflection", "Separated from tuner and metronome during practice", "Settings can live beside the practice tools"],
        ["Spreadsheet", "Long-term tracking and data analysis", "Too heavy for quick rehearsal restarts", "Fast enough for daily use"],
        ["General notes app", "Flexible writing", "No direct link to BPM, meter, tuning, or drone workflow", "Piece context loads into music tools"],
        ["Cadenza setlist", "Practical rehearsal memory", "Not a full studio management platform", "Private, focused, offline, and musician-specific"]
      ],
      faqs: [
        ["What should I track in a music practice app?", "Track the next useful action: piece title, BPM, time signature, key, composer, tuning context, and one short note about what needs work."],
        ["Is Cadenza a practice log app?", "Cadenza is positioned as a metronome, tuner, setlist, and practice companion. It supports practical rehearsal memory without requiring a login or cloud workspace."],
        ["Why combine a metronome and tuner?", "Pitch and rhythm are both part of daily practice. Keeping them in one app reduces setup time and keeps the session moving."],
        ["Can setlists help solo practice?", "Yes. A setlist can be a personal queue of active pieces, études, scales, warmups, or repertoire with saved tempo and notes."],
        ["Should practice notes be long?", "Usually no. Short notes are easier to reuse during a session. Save the detail that tells you what to do next."],
        ["Does Cadenza require an account?", "Cadenza is positioned around no login, offline operation, and on-device workflows for core practice data."]
      ],
      sources: [
        ["Cadenza app page", "/apps/cadenza-metronome-and-tuner/", "Internal product page describing setlists, metronome, tuner, privacy, offline use, and practice companion positioning."],
        ["A440 pitch standard", "https://en.wikipedia.org/wiki/A440_(pitch_standard)", "Reference context for A4 calibration used in tuning workflows."],
        ["Musical practice and cognitive aging", "https://arxiv.org/abs/1502.02804", "Academic context showing music practice as a structured activity studied in human performance research."],
        ["Wikimedia Commons: Practice Keyboard image", "https://commons.wikimedia.org/wiki/File:Practice_Keyboard_MET_206990.jpg", "CC0 image used to represent repeated music practice and training tools."]
      ]
    }
  },
  {
    slug: "tinnitus-relief-app-sound-masking-night-guide",
    category: "Tinnitus",
    title: "Tinnitus Relief App Guide: Sound Masking For Ringing Ears At Night",
    description: "A realistic, evidence-aware guide to using an offline tinnitus relief app, sound masking, white noise, rain, and sleep sounds when ringing feels louder at night.",
    kicker: "Night relief guide",
    readTime: "16 min",
    accent: "tinnitus",
    sections: [
      ["Why Night Makes Ringing Feel Bigger", "Many people do not experience tinnitus as a constant medical topic. They experience it as a bedroom problem. During the day, traffic, conversation, appliances, work calls, and movement create a background layer that competes with the ringing. At night, the room becomes still, the phone is put down, and the mind starts scanning for anything that is still active. That is when a soft tone can feel like it has moved to the center of the room. NIDCD describes tinnitus as the perception of sound without an external source, and also notes that some people find it affects sleep or concentration. That lived pattern matters for app design. A tinnitus relief app should not open with a complicated control panel. It should help the user move from silence to a gentler sound environment as quickly as possible, especially when they are tired and already frustrated."],
      ["The Practical Goal Is Not Silence", "The most useful expectation is not to make tinnitus vanish. That promise would be unrealistic and medically inappropriate. A better goal is to reduce contrast. If the room is perfectly quiet, the internal sound has nothing to compete with. If the room has a steady rain layer, a low fan texture, brown noise, or soft ocean movement, the ringing may become less dominant in attention. NIDCD explains that sound therapy may work by masking tinnitus sounds, helping people grow accustomed to them, or distracting attention. That is the practical lane for an app: create a sound layer that feels pleasant enough to keep on, stable enough not to wake the user, and adjustable enough to fit different nights. The user is not asking for an audiology lecture at 1:12 a.m. They want a listening environment that makes the next ten minutes feel less sharp."],
      ["Start With A Comfortable Baseline", "A good nighttime workflow begins with comfort, not maximum masking. Users often make the mistake of turning a sound up until it covers the ringing completely. That can be too loud, too stimulating, or too hard to sleep with. A calmer approach is to start just below the point where the external sound becomes the main thing you notice. White noise, pink noise, brown noise, rain, ocean, wind, and fan sounds all have different emotional textures. White noise can feel bright and full. Pink noise often feels softer. Brown noise can feel deeper. Rain can feel familiar and less mechanical. The right baseline is the one you can imagine leaving on while your attention loosens. This is where real-time sound generation helps: the sound can continue without an obvious loop, download wait, or buffering interruption."],
      ["Build A Short Bedtime Ritual", "The strongest app experience is often a repeated ritual. Open the same preset, lower the screen brightness, set a sleep timer, and give your brain the same cue each night. This does not require a claim that the app treats tinnitus. It is simply how habits work: the fewer decisions required, the easier the routine becomes when you are tired. A saved preset called Sleep calm or Rain mask can reduce the mental load of choosing. A timer can reduce the fear of leaving audio running all night. A volume slider that starts at a known safe, comfortable setting can prevent the nightly game of guessing. The user needs an emotional handoff from irritation to control: I know what to do, I have done it before, and I can start it in seconds."],
      ["Use Layers Instead Of One Loud Sound", "Layering can feel more natural than raising a single sound. A quiet pink noise bed plus light rain can mask different parts of the ringing while staying comfortable. Ocean waves can add motion, but if the wave cycle is too dramatic it may pull attention back. A fan layer can create steadiness. Wind can soften the edge of a bright tone. Mixing up to four sounds is not valuable because more features are impressive; it is valuable because tinnitus perception varies. One person may need a steady broadband sound. Another may find that natural ambience is easier to accept. Another may want a focus sound during work and a warmer sleep sound at night. The app should let those preferences exist without forcing the user to understand acoustic theory."],
      ["When To Use Frequency Matching", "Frequency matching is best treated as an optional personalization step, not a required first step. Some users want to identify the pitch they notice most because it helps them feel oriented. Others find pitch matching stressful because it asks them to listen directly to the sound they are trying to stop thinking about. The humane design is to keep frequency matching available, simple, and skippable. A slider-based tool can help a user find a reference frequency, then apply a notch filter or save the result for later. The page should clearly state that this is for comfort and personalization, not a clinical hearing test. That distinction protects trust. People searching for ear ringing relief are often anxious; they deserve tools that feel clear about what they can and cannot do."],
      ["Privacy Matters More Than It Looks", "Tinnitus can feel private in a way that ordinary wellness tracking does not. A listening profile may imply sleep problems, stress patterns, hearing concerns, medication questions, or anxiety. That is why an offline tinnitus relief app has a strong conversion advantage. No login means the user can open the app without explaining themselves. No cloud profile means the late-night preset, frequency match, and session history do not need to become account data. On-device sound generation means the app can work in airplane mode, hotel rooms, weak Wi-Fi, or during travel. The privacy story should be direct: no account, no cloud, no tracking-first experience, and all core sound generation on the iPhone."],
      ["How To Evaluate Whether It Helps You", "A realistic user should not judge the app by one dramatic moment. A better test is three to seven nights. Track whether you fall asleep with less frustration, whether you reach for the same preset, whether the sound feels comfortable after ten minutes, and whether the timer matches your routine. If the ringing is sudden, one-sided, pulsatile, associated with dizziness, pain, hearing change, or other concerning symptoms, the right action is medical evaluation, not another app setting. But for everyday masking, relaxation, and sleep support, the question is practical: does this sound environment make the night easier? High-conversion copy should respect that standard. It should invite action without pretending to be a cure."],
      ["Where Tinnitus Relief Fits In The Night Routine", "Tinnitus Relief is strongest as the first step after the user notices the room is too quiet. Open the app, choose a saved sound, set the timer, and put the phone down. The value is not only the sound; it is the reduction of panic, searching, and decision fatigue. A person who is awake at night does not want to read a manual, create an account, or browse a library of 200 recordings. They want a reliable sound masking app that starts instantly and stays private. For SEO, this article naturally connects tinnitus relief app, sound masking app, white noise tinnitus, sleep sound app, ear ringing relief, ambient noise app, and focus sound app. For the user, the promise is simpler: make the room feel less hostile."],
      ["A Safe And Honest Takeaway", "Sound masking can be a useful comfort tool, but it should be used gently. Keep volume comfortable, avoid using any sound at painful or fatiguing levels, and remember that louder is not automatically better. WHO and CDC resources on hearing safety both reinforce the broader principle that sound exposure matters. For tinnitus, the aim is to create a supportive layer, not to overpower the ear. If symptoms persist or change, consult a licensed healthcare professional or audiologist. If your need is immediate, private, and practical, an offline app can still be worth downloading tonight. It gives you a next action when the ringing feels too present: start a sound, soften the contrast, and let the night become easier to enter."],
      ["What A Real User Might Notice After A Week", "The most believable result is usually small but meaningful. A user may not say the tinnitus disappeared. They may say bedtime felt less tense, they stopped changing sounds after a few minutes, or they felt more willing to put the phone down. They may find that one preset works at home while another works in a hotel. They may discover that rain is better for sleep but fan noise is better for focus. Those observations are the realistic proof points a product page can build around. They also help subscription conversion because the app becomes part of a repeatable routine rather than a one-time experiment."],
      ["How This Supports App Store SEO", "A blog page like this should connect search intent to product intent without feeling stuffed. Users who search tinnitus relief app, sound masking app, sleep sound app, white noise tinnitus, ear ringing relief, ambient noise app, or focus sound app are often comparing options quickly. The article should educate enough to build trust, then point to the app as the simplest private action. Internal links from the article to the Tinnitus Relief landing page help search engines understand topical relevance, while the article itself captures longer searches such as why ringing feels louder at night or how to use sound masking for sleep."]
    ],
    checklist: ["Start with a comfortable sound, not maximum volume.", "Use a saved bedtime preset to reduce decision fatigue.", "Layer sounds gently instead of forcing one loud masker.", "Keep frequency matching optional and stress-free.", "Seek medical care for sudden, pulsatile, painful, or changing symptoms."],
    deepDive: {
      figureTitle: "Night masking model: reduce contrast, then reduce effort",
      figureCaption: "The practical app goal is to move from silent-room contrast to a softer, repeatable sleep environment.",
      figureStats: [["10-25%", "Adults estimated by NIDCD surveys to have tinnitus"], ["3 steps", "Open, choose sound, set timer"], ["0 login", "Private start for late-night use"]],
      comparisonTitle: "Night sound choices for tinnitus awareness",
      comparisonColumns: ["Sound layer", "Best emotional use", "Watch-out", "App setting"],
      comparisonRows: [
        ["Pink noise", "Soft steady bed for sleep", "Can feel too bright if loud", "Start low and save preset"],
        ["Brown noise", "Deeper masking for sharper rooms", "May feel heavy for some users", "Blend with rain"],
        ["Rain", "Familiar, less clinical bedtime sound", "Strong drops may pull attention", "Use gentle rain"],
        ["Fan", "Stable focus or hotel-room masking", "Can feel mechanical alone", "Layer with pink noise"]
      ],
      faqs: [
        ["Can a tinnitus relief app cure ringing?", "No. The appropriate claim is comfort, relaxation, focus, and sound masking. Persistent or changing symptoms should be discussed with a healthcare professional."],
        ["Is white noise good for tinnitus at night?", "Some people find white noise or similar steady sounds useful because they reduce the contrast between tinnitus and a quiet room. Others prefer rain, fan, ocean, pink noise, or brown noise."],
        ["Should masking fully cover tinnitus?", "Not necessarily. Many users do better with partial masking at a comfortable level rather than pushing volume high enough to cover everything."],
        ["Why use an offline app instead of streaming audio?", "Offline sound generation avoids buffering, login friction, weak Wi-Fi, and cloud dependence. It is especially useful in bed or while traveling."]
      ],
      sources: [
        ["NIDCD: Tinnitus", "https://www.nidcd.nih.gov/health/tinnitus", "Defines tinnitus, gives prevalence estimates, and describes sound therapy devices including smartphone apps for relaxation or sleep."],
        ["Cochrane: Sound therapy for tinnitus", "https://www.cochrane.org/evidence/CD013094_sound-therapy-using-amplification-devices-or-sound-generators-tinnitus", "Summarizes evidence limits and reports tinnitus affects 10% to 15% of adults, with quality-of-life effects for some."],
        ["WHO: Making listening safe", "https://www.who.int/activities/making-listening-safe", "Provides safe listening context and risk framing for recreational sound exposure."],
        ["Tinnitus Relief landing page", "/tinnitus/", "Internal app landing page for offline sound masking, sleep sounds, and private on-device use."]
      ]
    }
  },
  {
    slug: "white-noise-tinnitus-sleep-sound-app",
    category: "Tinnitus",
    title: "White Noise For Tinnitus: Choosing Sleep Sounds That Feel Calm",
    description: "A practical SEO guide to white noise tinnitus masking, pink noise, brown noise, rain, ocean, fan sounds, and how to choose a sleep sound app without overcomplicating bedtime.",
    kicker: "White noise tinnitus",
    readTime: "15 min",
    accent: "tinnitus",
    sections: [
      ["White Noise Is A Starting Point, Not The Whole Answer", "People often search for white noise tinnitus because white noise is the best-known phrase for background masking. In practice, many sleep sound app users do not actually want pure white noise. True white noise can feel bright, sharp, or static-like. Pink noise reduces intensity at higher frequencies and may feel smoother. Brown noise is deeper and can feel more like a low rumble. Rain, ocean, fan, and wind sounds are not technical noise colors, but they may be easier to live with because they feel familiar. The right question is not which sound is scientifically perfect for every tinnitus pattern. The right question is which sound helps you stop checking the ringing every few seconds. A high-quality tinnitus relief app should give options without making the user feel like they need a degree in acoustics."],
      ["Think In Terms Of Attention, Not Only Volume", "Tinnitus becomes distressing when it captures attention. Volume matters, but attention matters too. A sound can be loud enough to mask yet annoying enough to keep the brain alert. Another sound can be softer but emotionally easier to accept. NIDCD notes that sound therapy may help by masking, distraction, or helping the user become accustomed to tinnitus. That range explains why different users prefer different textures. If a user is anxious, a harsh sound may technically cover the ringing but still fail as a sleep tool. A calmer sound with slight movement may help attention settle. This is why app copy should use human language: softer room, less contrast, steadier focus, easier bedtime. Those phrases match how users judge the result."],
      ["White Noise For Bright Ringing", "White noise contains energy across a wide range of frequencies. For some people with bright ringing, it can provide enough coverage to make the tinnitus less isolated. The risk is fatigue. If the white noise feels like a hiss that fights the ringing, lower it or switch to pink noise. A good app should make that switch obvious. The goal is not to win a volume contest. It is to find a sound that can stay in the background. For SEO, the phrase white noise tinnitus should be present, but the content should be honest: white noise is one option among several. It may help some people, it may irritate others, and it should be used at a comfortable level."],
      ["Pink Noise For A Softer Bedtime Layer", "Pink noise often feels less sharp because the balance of energy is weighted differently than white noise. Many users describe it as smoother or warmer. That can make it a strong first preset for bedtime. Pink noise also blends well with rain because the rain provides a natural cue while the pink noise provides a continuous bed. In an app interface, this should not require advanced mixing knowledge. A simple preset can do the work. The user may only need to adjust volume and timer. If the tinnitus is still too present, a second layer can be added. If the sound becomes distracting, reduce movement before raising volume. The best sleep sound app design lowers the number of decisions."],
      ["Brown Noise For Low, Room-Filling Comfort", "Brown noise can feel heavier and deeper. Some users like it because it fills the room without the sharp edge of high-frequency noise. It may be useful when the bedroom feels too empty or when a user wants a deeper ambient noise app experience. But brown noise is not automatically better. If it feels oppressive, muddy, or too present, it can become another thing to monitor. The advantage of real-time generation is that the app can keep the texture continuous without obvious loops. Repeating audio files can sometimes reveal a seam, and once the brain notices a loop, it may start waiting for it. Continuous synthesis avoids that specific irritation."],
      ["Rain, Ocean, Wind, And Fan Sounds", "Natural and household sounds often work because they carry emotional meaning. Rain can signal shelter. Ocean can signal distance and movement. Wind can soften a room. Fan noise can feel familiar to people who already sleep with a fan. These are not medical interventions; they are environmental design choices. A person dealing with ear ringing relief at night may be more interested in feeling safe and less alone than in matching a frequency chart. A sound masking app that includes rain, ocean, wind, and fan sounds gives users multiple emotional routes toward the same goal: reduce the dominance of the internal sound. That is high-conversion content because it speaks to the actual decision the user is making."],
      ["How To Test A Sound In Two Minutes", "A simple test beats endless browsing. First, choose one sound and set it low. Second, close your eyes for thirty seconds and notice whether you are still bracing against the ringing. Third, raise the sound slightly or add one layer. Fourth, set a timer and stop changing settings. The final step is important because constant adjustment can keep attention locked on tinnitus. If the sound becomes annoying, lower it or choose another texture. If the sound feels easy, save it as a preset. The best preset is not the most impressive mix. It is the one you will actually use at midnight when you are tired."],
      ["Safe Listening Still Matters", "Sound masking should be comfortable. CDC/NIOSH explains that repeated exposure to sounds at or above 85 dBA can cause permanent hearing loss in occupational settings, and WHO emphasizes safe listening across personal audio and entertainment contexts. A tinnitus app should never encourage users to blast sound into the ear. It should encourage moderation, external speakers where appropriate, and comfortable levels. If using headphones or earbuds, extra caution matters because the sound is delivered close to the ear. The safest marketing tone is calm: use enough sound to soften awareness, not so much sound that it creates strain. This builds trust and reduces the risk of overpromising."],
      ["What Makes An App Better Than A Random Video", "A random video or streaming playlist can work sometimes, but it has weaknesses for high-intent tinnitus users. It may require internet. It may include ads. It may stop. It may have a loop. It may collect account data. It may suggest unrelated content when the user is trying to sleep. An offline sleep sound app can be more focused: open, play, timer, preset, done. On-device generation matters because it makes the experience reliable even in airplane mode or weak hotel Wi-Fi. For someone who searches sound masking app at night, reliability can be the feature that converts. They are not shopping for entertainment; they are trying to create relief."],
      ["The Best Sound Is The One You Trust", "A realistic conclusion is that there is no universal best sleep sound for tinnitus. There are better starting points, safer habits, and more private app designs. White noise tinnitus searches should lead users to a choice: start with white or pink noise, try rain if static feels too clinical, add a fan if focus is the goal, and save the mix that works. Tinnitus Relief can position itself as the practical place to do that offline, with no login and no cloud. The conversion message is not technical superiority. It is trust: the app starts fast, stays private, and gives you a quieter-feeling environment when the ringing is taking too much space."],
      ["The Mistake Of Chasing A Perfect Sound", "Many users lose time trying to find the perfect sound. They switch from white noise to rain, from rain to fan, from fan to brown noise, and then start over because the ringing is still present. That cycle can keep attention locked on tinnitus. A better approach is to choose a good-enough sound and give it time. If the sound is comfortable, stable, and not irritating, it may be doing its job even if the tinnitus is still partly noticeable. The user should be encouraged to stop editing once the room feels less sharp. This is a subtle but important product lesson: a sleep sound app should help end the search, not extend it."],
      ["How To Build Three Presets", "A practical setup is to build three presets instead of one. The first is Sleep: a gentle pink noise or rain mix with a timer. The second is Focus: a fan or brown noise layer that stays steady while reading or working. The third is Travel: a stronger but still comfortable ambient noise app preset for hotel rooms, flights, or unfamiliar apartments. Three presets cover most high-intent use cases and make the app feel useful quickly. The user does not need to browse every sound every time. They need a small set of reliable choices that make ear ringing relief feel accessible."],
      ["Why The App Should Avoid Surprise Sounds", "Changing sounds can be beautiful in meditation apps, but tinnitus masking often benefits from predictability. Sudden bird calls, loud thunder, dramatic wave peaks, or musical changes can pull attention back to listening. For sleep, the best sound may be boring in the right way: steady, gentle, and emotionally acceptable. This is why white noise, pink noise, brown noise, fan, rain, and soft ocean textures remain useful. They can create a background without demanding interpretation. A high-conversion article should make that point clearly because it helps users understand why Tinnitus Relief focuses on controllable ambient layers rather than entertainment."]
    ],
    checklist: ["Treat white noise as one option, not the only answer.", "Choose sounds by comfort and attention, not only loudness.", "Save a preset after a two-minute test.", "Use a timer to stop endless adjustment.", "Keep volume moderate and comfortable."],
    deepDive: {
      figureTitle: "Sound color choice: match emotion before precision",
      figureCaption: "Users usually choose the sound they can live with, not the sound with the most technical description.",
      figureStats: [["5 sounds", "White, pink, brown, rain, fan"], ["2 min", "Fast comfort test"], ["1 preset", "Reduce bedtime decisions"]],
      comparisonTitle: "Common sleep sounds for tinnitus masking",
      comparisonColumns: ["Sound", "User feeling", "Good for", "Try next if"],
      comparisonRows: [
        ["White noise", "Full, bright, static-like", "Broad masking", "It feels sharp or tiring"],
        ["Pink noise", "Smoother, warmer", "Bedtime and rain blends", "You need deeper sound"],
        ["Brown noise", "Deep, room-filling", "Low, steady comfort", "It feels heavy"],
        ["Rain", "Natural, familiar", "Sleep routine", "Drops feel distracting"],
        ["Fan", "Stable, ordinary", "Focus and travel", "It feels too mechanical"]
      ],
      faqs: [
        ["Is pink noise better than white noise for tinnitus?", "Not universally. Some users prefer pink noise because it feels smoother, but the useful choice is the one that lowers awareness without becoming annoying."],
        ["Can I use sleep sounds every night?", "Many people use background sound as a routine, but volume should stay comfortable. If symptoms change or persist, seek professional advice."],
        ["Do nature sounds count as sound masking?", "They can. Rain, ocean, wind, and fan sounds can reduce contrast between tinnitus and silence even though they are not pure noise colors."],
        ["Why use generated sound instead of audio files?", "Generated sound can play continuously without downloads or obvious loops, which is helpful when the user is trying not to notice repetition."]
      ],
      sources: [
        ["NIDCD: Tinnitus", "https://www.nidcd.nih.gov/health/tinnitus", "Describes sound therapy, smartphone sound generators, and sleep-related use of pleasant sounds."],
        ["ASHA: Tinnitus", "https://www.asha.org/public/hearing/tinnitus/", "Public education resource on tinnitus and audiology care."],
        ["CDC/NIOSH: Preventing noise-induced hearing loss", "https://www.cdc.gov/niosh/noise/prevent/index.html", "Provides hearing-safety context around repeated exposure to loud sound."],
        ["WHO: Making listening safe", "https://www.who.int/activities/making-listening-safe", "Frames safe listening and hearing risk from loud sound exposure."]
      ]
    }
  },
  {
    slug: "why-tinnitus-feels-louder-at-night-sleep-masking",
    category: "Tinnitus",
    title: "Why Tinnitus Feels Louder At Night: Sleep, Silence, And Sound Masking",
    description: "A research-informed, human guide to why tinnitus awareness often spikes in quiet rooms and how sleep sounds, sound masking, and offline app routines can help reduce the burden.",
    kicker: "Sleep and silence",
    readTime: "17 min",
    accent: "tinnitus",
    sections: [
      ["The Bedroom Has Fewer Competing Signals", "Tinnitus often feels louder at night because the environment has fewer competing signals. During the day, attention is divided across tasks, speech, screens, traffic, and physical movement. In bed, most of those signals disappear. The auditory system has less external information to process, and attention can narrow around the internal sound. NIDCD describes tinnitus as a phantom sound perceived without an external source and notes that it can affect sleep or concentration for some people. That does not mean the sound necessarily increased in a measurable way. It may mean the contrast increased. In conversion terms, this is the exact moment a tinnitus relief app needs to serve: the user is not casually learning about hearing science. They are tired, aware, and looking for a practical way to make the room feel less silent."],
      ["Silence Can Become A Spotlight", "A quiet bedroom can act like a spotlight. The absence of sound makes the ringing easier to detect, and detection can create tension. Tension makes the user check the sound again. The loop is not only auditory; it is emotional. People describe it as waiting for the ringing, fighting the ringing, or being unable to stop monitoring it. This is why a sound masking app should not present itself as a cure. It should present itself as a way to change the scene. Adding rain, fan, ocean, pink noise, or brown noise gives the brain another layer to process. The ringing may still be present, but it is no longer alone in the room. For many users, that difference is meaningful."],
      ["Sleep Pressure And Frustration Interact", "The more badly someone wants to sleep, the more frustrating tinnitus awareness can feel. A person may start calculating tomorrow's fatigue, worrying about work, or wondering whether the ringing is getting worse. That mental load can make the sound feel even more intrusive. Behavioral approaches for tinnitus often include education, counseling, relaxation, or cognitive strategies because the reaction to tinnitus matters. An app can support this indirectly by making the next action obvious. Instead of searching the web at 2 a.m., the user opens a preset. Instead of comparing symptoms, the user sets a timer. Instead of testing every sound endlessly, the user returns to a saved mix that has already felt tolerable."],
      ["Sound Masking Works By Changing The Environment", "Sound masking does not need to be mysterious. It changes the listening environment so tinnitus is less isolated. NIDCD explains that sound therapy devices may mask tinnitus, help users become accustomed to it, or distract them. Cochrane reviews also show that clinical evidence for device superiority is limited and low certainty, so marketing should be careful. But careful does not mean weak. A landing page can honestly say that sound masking may reduce awareness, support relaxation, and create a calmer environment for sleep. That is enough for many high-intent users. They are not asking for a treatment claim. They are asking whether the app can help them get through the next night."],
      ["Why A Timer Reduces Anxiety", "A sleep timer is not just a convenience feature. It reduces a small but real worry: will the sound run all night? Some users like all-night sound. Others only need help crossing the first sleep threshold. A fade-out timer gives them control without requiring another interaction after they become drowsy. The ideal timer is easy to set and easy to trust. Thirty, forty-five, or sixty minutes may be enough for many routines. The app should remember common choices because repeated setup creates friction. The emotional promise is simple: start relief now, and let the app stop later. That is a small interaction, but it matches the user's tired state."],
      ["Why Presets Matter More Than Libraries", "A huge sound library can feel impressive during browsing and exhausting during insomnia. Presets are more conversion-friendly because they create confidence. A user can save Night rain, Deep brown, Focus fan, or Travel room and return to it without thinking. This is especially important for tinnitus because too much testing can keep attention fixed on the symptom. The product should help users stop experimenting once they have a mix that feels comfortable. Saved presets also make the app feel personal without requiring cloud personalization. The data can stay on-device, and the user can still feel that the app remembers what helps."],
      ["Travel Makes The Night Problem Worse", "Hotels, guest rooms, flights, and unfamiliar apartments can make tinnitus awareness more noticeable because the normal sleep cues are missing. A fan may not be available. Wi-Fi may be weak. Streaming may fail. A partner may not want a loud device. An offline ambient noise app gives the user a familiar routine in an unfamiliar place. This is one of the strongest use cases for App Store marketing because it combines emotional urgency and practical differentiation. The user can download before travel, save a few presets, and know that the app will work without internet. That is a clear reason to install rather than keep searching."],
      ["What To Do When Night Tinnitus Changes", "Some patterns should lead to professional care. Sudden hearing changes, pulsatile tinnitus, severe dizziness, ear pain, one-sided new symptoms, or tinnitus after injury should not be managed only with an app. NICE and NIDCD both frame tinnitus management within healthcare assessment when appropriate. A trustworthy app page should say this clearly. Paradoxically, that disclaimer can improve conversion because it signals honesty. Users can tell the difference between a tool and a miracle claim. Tinnitus Relief can be positioned as a private comfort and sound masking companion, not a medical device. That boundary makes the app easier to trust."],
      ["A Better Night Routine In Four Steps", "A realistic routine can be short. First, choose the preset that has worked before. Second, lower volume until the sound feels like part of the room rather than a performance. Third, set the timer. Fourth, put the phone down and stop comparing. If the mix does not help after a few nights, try one variable at a time: noise color, nature layer, volume, or timer length. Do not redesign the entire routine every night. The goal is to reduce cognitive load. A well-designed tinnitus relief app should make the simplest helpful path feel obvious. The user should not have to become a sound engineer to sleep."],
      ["The SEO Promise And The Human Promise", "The SEO promise is that this page answers searches like why tinnitus feels louder at night, sleep sound app, ear ringing relief, tinnitus relief app, sound masking app, white noise tinnitus, and ambient noise app. The human promise is more important: when the room gets quiet and the ringing feels too present, there is a next step that does not require a login, a streaming service, or a medical claim. Open the app. Start the sound. Let the room become less silent. That is the conversion story: pain, relief, action, and trust."],
      ["Why Education Alone Is Not Enough At Night", "Educational articles are useful during the day, but they are not enough when someone is awake and upset. At night, the user needs an action that is small, safe, and immediate. This is where an app can convert better than a long resource page. The article can explain why silence increases awareness, but the CTA should invite the user to change the sound environment now. That is not manipulative if the app stays within honest claims. It is matching the user's state. They are not asking for a thesis. They are asking for a practical next step that might make the next hour easier."],
      ["What A Better Morning Looks Like", "The morning after a better night may not feel dramatic. It may simply feel less defeated. The user may remember that they started a preset, stopped checking, and fell asleep sooner than expected. They may still notice tinnitus in the morning, but the night did not become a battle. That is the realistic emotional result to write toward. App Store conversion improves when the copy paints a future users can believe: not cured forever, not transformed overnight, but supported enough to rest, focus, and feel more in control."],
      ["How To Avoid Turning The App Into Another Stressor", "Any tinnitus tool can become stressful if the user treats it like a test. If the sound does not work immediately, they may blame themselves. If they adjust too much, they may become more aware of the ringing. The app and article should push toward simplicity: choose a preset, set volume comfortably, set a timer, and stop adjusting. The product should make the calm path obvious. Too many settings above the fold, too many clinical labels, or too much emphasis on exact pitch can increase cognitive load. Better CRO means fewer decisions at the moment of distress."],
      ["A Realistic Seven-Night Experiment", "A strong article can give users a simple experiment instead of vague encouragement. For seven nights, use the same starting volume, the same sleep preset, and the same timer. Change only one variable if the routine feels wrong: sound type, volume, or timer length. Keep notes simple: easier, same, or harder. This creates a realistic sense of progress without turning the app into a medical diary. It also supports retention because the user has a reason to return for several nights. If the app helps even two or three nights feel less frustrating, that can be enough to make the subscription feel worthwhile. That is the kind of modest, believable improvement users remember."]
    ],
    checklist: ["Use sound to reduce silence contrast.", "Choose presets over endless browsing.", "Use a timer if all-night audio creates worry.", "Keep travel presets available offline.", "Get medical advice for sudden, one-sided, pulsatile, painful, or changing tinnitus."],
    deepDive: {
      figureTitle: "Night awareness loop: silence, scanning, stress, repeat",
      figureCaption: "Sound masking interrupts the silent-room contrast that can make tinnitus feel more intrusive.",
      figureStats: [["4 steps", "Silence, notice, worry, scan"], ["1 cue", "Saved sleep preset"], ["0 network", "Offline travel use"]],
      comparisonTitle: "Night problem to app response",
      comparisonColumns: ["Night trigger", "User feeling", "App response", "Conversion message"],
      comparisonRows: [
        ["Silent room", "Ringing feels isolated", "Start masking sound", "Turn down the contrast"],
        ["Insomnia worry", "Fear of tomorrow fatigue", "Set sleep timer", "Let it fade later"],
        ["Too many choices", "More symptom checking", "Use saved preset", "One tap routine"],
        ["Travel room", "Unfamiliar quiet", "Offline preset", "Works anywhere"]
      ],
      faqs: [
        ["Does tinnitus actually get louder at night?", "Sometimes perception changes more than the sound itself. A quiet room can make tinnitus more noticeable because there are fewer competing sounds."],
        ["Can sound masking help sleep?", "It can help some users by reducing contrast and creating a more comfortable sound environment. It is not a medical treatment or guaranteed cure."],
        ["Should I use a timer?", "Use a timer if it helps you relax about the sound stopping later. Some users prefer all-night sound; others only need the first part of the night."],
        ["What if tinnitus wakes me up?", "A saved preset can make the response faster. If tinnitus is new, sudden, pulsatile, or associated with other symptoms, seek medical advice."]
      ],
      sources: [
        ["NIDCD: Tinnitus", "https://www.nidcd.nih.gov/health/tinnitus", "Explains tinnitus symptoms, sleep impact, sound therapy, and when medical evaluation may be needed."],
        ["NICE NG155", "https://www.nice.org.uk/guidance/ng155", "Clinical guideline covering assessment and management of tinnitus."],
        ["Cochrane: Sound therapy for tinnitus", "https://www.cochrane.org/evidence/CD013094_sound-therapy-using-amplification-devices-or-sound-generators-tinnitus", "Evidence review describing quality-of-life effects and limitations of sound therapy evidence."],
        ["WHO: Making listening safe", "https://www.who.int/activities/making-listening-safe", "Safe listening context for responsible sound use."]
      ]
    }
  },
  {
    slug: "offline-tinnitus-app-privacy-on-device-sound-masking",
    category: "Tinnitus",
    title: "Offline Tinnitus App Privacy: Why On-Device Sound Masking Matters",
    description: "A high-intent guide for users comparing tinnitus relief apps, cloud audio, streaming sleep sounds, and private on-device sound masking on iPhone.",
    kicker: "Privacy and trust",
    readTime: "16 min",
    accent: "tinnitus",
    sections: [
      ["Tinnitus Data Feels Personal", "A tinnitus app may look like a simple audio utility, but the context is personal. A preset can reveal that someone struggles to sleep. A frequency match can suggest hearing concerns. A session history can imply stress patterns, travel habits, or late-night discomfort. That does not mean every app is unsafe, but it does mean privacy is not a decorative feature. For a high-intent user searching tinnitus relief app or ear ringing relief, privacy can be part of the relief. They want to open the app without creating an account, explaining symptoms, or sending a listening profile to a cloud service. A private app creates emotional safety before the first sound plays."],
      ["Offline Use Removes A Major Bedtime Failure Point", "Streaming sleep sounds can fail in exactly the moments users need reliability: weak hotel Wi-Fi, airplane mode, low signal, captive portals, account issues, ads, or app switching. An offline tinnitus app avoids those points of friction. Real-time on-device sound generation means the audio can start immediately and continue without buffering. The user does not have to download a library in advance or hope that a playlist remains available. This matters for conversion because users with tinnitus are often searching when they are already uncomfortable. The faster the app can move from install to sound, the more likely it is to feel useful."],
      ["No Login Is A Product Strategy", "No login is not only a privacy line. It is a conversion strategy. Every account screen asks the user to leave the emotional path: from I need relief now to I need to create credentials. That is a bad trade for a sound masking app. The ideal first session should be immediate: choose a sound, adjust volume, set timer, save preset. Account systems can make sense for social products or cross-device sync, but they are often unnecessary for an offline ambient noise app. If the core value lives on one iPhone, local settings are enough. The app becomes calmer because the business model does not require turning the user's night into a profile."],
      ["No Cloud Means Fewer Questions", "Cloud features can be useful in some categories, but tinnitus relief is not a category where cloud storage is automatically valuable. A user may reasonably ask: why does a sound masking app need to upload my listening habits? Why does it need a remote profile to play rain or white noise? Why should my frequency matching data leave the device? The privacy block should answer in plain language: no cloud account, no upload required for core sound generation, and all audio generated on-device. The clearer the answer, the more trustworthy the app feels. Trust is especially important because tinnitus users are often wary of exaggerated claims."],
      ["On-Device Audio Also Supports Performance", "Privacy is not the only reason on-device generation matters. Performance matters too. Audio files can loop. Streams can stutter. Ads can interrupt. Network calls can slow a bedtime action. Generated sound can be continuous and immediate. That does not automatically make every generated sound better, but it gives the product a strong functional base. A tinnitus relief app should feel like a bedside tool, not a media browsing experience. Open, play, adjust, sleep. The fewer dependencies involved, the less fragile the routine becomes."],
      ["How To Compare Tinnitus Apps", "When comparing apps, look beyond the sound list. Ask whether the app works offline. Ask whether it requires an account before use. Ask whether it explains what data stays on device. Ask whether sound generation is continuous or based on short loops. Ask whether the app includes a sleep timer and saved presets. Ask whether advanced features like frequency matching and notch filtering are optional and clearly described as personalization rather than medical testing. A strong app does not need to hide behind vague wellness language. It can state exactly what it does: sound masking, sleep sounds, focus sounds, offline operation, and private on-device settings."],
      ["Subscription Trust Starts With Honest Boundaries", "If the app offers a trial or subscription, trust depends on honest boundaries. Users can accept paying for a tool that helps them sleep, focus, or relax. They are less forgiving when the app implies a cure, hides cancellation context, or makes basic claims too aggressive. The best App Store conversion strategy is not to overpromise. It is to connect pain to an immediate, believable action. Start sound masking now. Build a private sleep preset. Use the timer tonight. Try personalization when ready. Consult a professional if symptoms persist or change. This tone can still sell because it matches the user's intelligence."],
      ["Offline Does Not Mean Isolated From Care", "A private app should not suggest that users avoid professional care. NIDCD recommends medical evaluation when appropriate and explains that tinnitus can have many causes. NICE frames tinnitus within assessment and management pathways. An offline app can live alongside that reality. It can support relaxation and sound masking while still telling users to seek help for sudden, pulsatile, painful, or changing symptoms. That balanced posture creates a more credible brand. The app is not pretending to be a clinic. It is offering a practical listening environment."],
      ["The Best Privacy Copy Is Specific", "Generic privacy claims are easy to ignore. Specific privacy copy converts better. 100% offline processing. No login. No cloud profile. No tracking-based personalization. Sound choices stay on device. Frequency matching stays on device. Presets stay on device. Session history stays on device. Each line answers a real doubt. It also differentiates the product from streaming videos, cloud playlists, and apps that require accounts before use. For an iPhone user who values privacy, this can be the reason they install now rather than bookmark the page."],
      ["A Practical Closing Argument", "An offline tinnitus app is not just another sleep sound app. It is a tool for a sensitive moment: when ringing is present, the room is quiet, and the user wants control without exposure. On-device sound masking gives the user immediate action. No login preserves momentum. No cloud preserves privacy. Real-time generation preserves continuity. The product story is simple and high-converting: relief should not depend on Wi-Fi, accounts, ads, or uploads. Tinnitus Relief should be ready when the user is ready to make the room feel calmer."],
      ["The Conversion Value Of Feeling Unobserved", "Privacy is often discussed as compliance, but for tinnitus it is also emotional design. A person may feel vulnerable when searching for ear ringing relief at night. They may not want a profile, a support community, targeted emails, or analytics-driven personalization. They may simply want sound. When the app communicates that nothing needs to leave the phone, the user can relax into the tool faster. This is a strong differentiator because many wellness apps ask users to trade personal context for features. Tinnitus Relief can make the opposite promise: the core experience is useful precisely because it stays quiet."],
      ["Why Offline Also Helps Subscriptions", "A subscription is easier to justify when the product solves a recurring problem reliably. Offline access supports that. If the app works at home, in a hotel, on a plane, during a commute, and in a weak-signal bedroom, it becomes a dependable utility rather than a novelty. Users pay for tools they trust under pressure. For tinnitus users, pressure often arrives when the environment is quiet or unfamiliar. A cloud-dependent product may be fine most of the time, but the offline product has a better story for the moments that matter. That story should be visible in the blog content and landing page."],
      ["How To Write Privacy Without Sounding Defensive", "The tone should be firm, not paranoid. Say what the app does not need: no login, no cloud profile, no tracking-first experience, no streaming requirement for core sound. Then say what the user gets: immediate sound masking, saved presets, sleep timer, frequency matching, notch personalization, and private local settings. This structure turns privacy from a legal paragraph into a benefit. It also helps SEO because users increasingly search for offline app, no login app, privacy-first iPhone app, and on-device processing. Those phrases should appear naturally in content that still reads like a human guide."],
      ["Privacy Also Reduces Support Risk", "Clear local-first positioning can reduce user confusion after download. If people understand that core sound generation does not require an account, they will not look for a missing login. If they understand that saved presets are local, they will not expect cloud sync. If they understand that deleting the app may remove local data, they can make informed decisions. That clarity matters for subscriptions because disappointed assumptions create cancellations. A strong blog article should therefore explain privacy as part of product fit, not only as a moral claim. The user gets a simpler app, the developer gets fewer mismatched expectations, and the brand earns more trust."],
      ["The Best CTA For A Privacy-First App", "A privacy-first tinnitus app should not close with a vague learn more button. The user has already learned enough. The CTA should say Start Relief Now or Download on App Store and sit near a short privacy reminder: works offline, no account required, all core sound generated on device. That combination supports action while answering the last objection. The user does not need to choose between relief and privacy. The app can offer both. That is the point of the article, and it should be repeated near the bottom where high-intent readers are ready to act. Clear final action matters when the reader is already motivated. It turns trust into a simple next step. That final step should feel calm, direct, private, and useful."]
    ],
    checklist: ["Prefer no-login first use for bedtime tools.", "Choose offline sound generation for travel reliability.", "Check whether presets and frequency settings stay on device.", "Avoid apps that make cure-like claims.", "Use privacy copy that names exactly what is not collected or uploaded."],
    deepDive: {
      figureTitle: "Private masking stack: local sound, local settings, local routine",
      figureCaption: "The strongest privacy story is also the simplest user flow: start sound without needing an account or network.",
      figureStats: [["0 account", "No sign-up before relief"], ["0 cloud", "No remote listening profile"], ["1 device", "Sound generated on iPhone"]],
      comparisonTitle: "Offline app vs streaming sound",
      comparisonColumns: ["Decision", "Offline app", "Streaming audio", "Why it matters"],
      comparisonRows: [
        ["Bedtime start", "Immediate", "May require network or app switching", "Lower friction"],
        ["Privacy", "Local settings", "Platform account and history may apply", "Sensitive context"],
        ["Travel", "Works in airplane mode", "Depends on connectivity or downloads", "Reliability"],
        ["Looping", "Can generate continuously", "May repeat or stop", "Less distraction"]
      ],
      faqs: [
        ["Why does no login matter for a tinnitus app?", "Because high-intent users often need immediate sound. Account creation interrupts the relief path and can make a private problem feel exposed."],
        ["Is offline sound better than streaming?", "Offline sound is not automatically better in every way, but it is more reliable when Wi-Fi, ads, accounts, or buffering would get in the way."],
        ["Should frequency matching data be private?", "Yes. It can relate to personal listening comfort and perceived tinnitus pitch, so keeping it on-device is a strong trust signal."],
        ["Can an offline app replace an audiologist?", "No. It can support sound masking and relaxation, but persistent or concerning symptoms should be evaluated by a healthcare professional."]
      ],
      sources: [
        ["NIDCD: Tinnitus", "https://www.nidcd.nih.gov/health/tinnitus", "Explains diagnosis, treatment approaches, and smartphone sound generator use."],
        ["NICE NG155", "https://www.nice.org.uk/guidance/ng155", "Guidance on tinnitus assessment and management in healthcare settings."],
        ["ASHA: Tinnitus", "https://www.asha.org/public/hearing/tinnitus/", "Public-facing audiology information on tinnitus."],
        ["Tinnitus Relief privacy policy", "/legal/Tinnitus/privacy/", "Internal privacy policy describing local storage and offline operation."]
      ]
    }
  },
  {
    slug: "frequency-matching-notch-filter-tinnitus-personalization",
    category: "Tinnitus",
    title: "Frequency Matching And Notch Filters For Tinnitus: Personalization Without Medical Claims",
    description: "An evidence-aware explanation of frequency matching, notch filtering, and personalized sound masking for tinnitus apps, written for users who want control without clinical overpromising.",
    kicker: "Personalization",
    readTime: "18 min",
    accent: "tinnitus",
    sections: [
      ["Personalization Starts With Listening, Not Diagnosing", "Frequency matching can sound clinical, but in a consumer tinnitus relief app it should be framed as personalization. The user is not taking a medical hearing test. They are using a slider to find a reference pitch that resembles the tone they notice most. That reference can help shape a notch filter or saved listening profile. The distinction matters. NIDCD explains that tinnitus sounds can vary widely, including ringing, buzzing, roaring, whistling, humming, clicking, hissing, or squealing. A single preset cannot feel personal to all of those experiences. Frequency matching gives users a way to make the app feel more relevant without claiming to diagnose the cause or severity of tinnitus."],
      ["What Frequency Matching Feels Like To A User", "A good frequency matching tool should be simple and emotionally safe. The user moves a slider, compares tones, and stops when the reference feels close enough. It should not force repeated testing, long calibration, or scary medical language. Many users already feel anxious when focusing on the sound. The product should reduce stress, not intensify it. A practical flow might say: find the pitch you notice most, save it, and adjust later if it changes. That acknowledges reality. Tinnitus perception can vary by day, stress, sleep, environment, and attention. The app should make change normal rather than making the user feel they failed a test."],
      ["What A Notch Filter Means In App Language", "A notch filter reduces a narrow band of frequencies in the ambient sound around a chosen reference frequency. In user language, it personalizes the masking sound so the mix leaves a small space around the pitch you selected. This should be described carefully. It is not a cure. It is not a guaranteed treatment. It is a comfort feature for users who want a more tailored listening experience. The most conversion-friendly explanation is visual and simple: choose your reference pitch, turn on the optional notch, and listen to whether that version feels more comfortable. If it does not, turn it off. Control matters more than complexity."],
      ["Why Optional Is Important", "Advanced features should not block relief. A person who downloads the app at night may want sound immediately. If the first screen demands frequency matching, the app risks losing the user. Optional personalization is better: start with sound masking now, then refine later. This respects different user states. Some are curious and want control. Some are exhausted and want rain. Some may never use notch filtering but still love the app for sleep sounds. Others may subscribe because personalization makes the product feel more serious. The funnel should support both emotional urgency and deeper engagement."],
      ["How To Use Frequency Matching Without Obsessing", "A healthy workflow is brief. Set volume low. Move the slider slowly. Stop when the tone feels close, not perfect. Save the result. Return to sound masking. The danger is over-checking. When users chase an exact pitch, attention can become locked on tinnitus. The app should avoid rewarding obsessive precision. Labels like close enough, save reference, and adjust anytime are better than clinical score language. A short session can make the user feel in control without turning bedtime into an experiment. This is where design and copy protect the user experience."],
      ["Pairing Notch Filters With Ambient Sound", "A notch filter is most useful when paired with a sound the user already finds comfortable. If the base sound is annoying, filtering it will not magically make it soothing. Start with pink noise, rain, fan, or ocean. Then try the notch. Compare for a minute. Save whichever version feels easier. This is a product story users can understand. The base layer handles comfort. The notch adds personalization. The timer handles sleep. Presets handle repeat use. Together, these features create a strong subscription argument without medical claims: users pay for a better controlled listening environment."],
      ["Evidence Boundaries Create Trust", "Cochrane's review of sound therapy for tinnitus highlights that evidence comparing devices is limited and low certainty. That does not mean sound tools are useless; it means marketing should be careful. A responsible app page should avoid saying notch filters treat tinnitus. It can say they personalize the ambient sound for comfort. It can say frequency matching helps tune the app to the pitch you notice. It can say sound masking may help reduce awareness or create a calmer environment. This evidence-aware language feels more credible than miracle claims. Users with tinnitus have likely seen exaggerated promises before. Honest specificity can convert better."],
      ["When Frequency Matching May Not Be The Right Feature", "Some users should skip frequency matching, at least at first. If focusing on the pitch increases anxiety, start with general masking. If tinnitus is changing rapidly, new, pulsatile, painful, or associated with hearing loss or dizziness, seek professional advice. If the user cannot find a stable pitch, that does not mean the app has failed. Many people experience noise-like, multi-tone, or fluctuating tinnitus. A good app should support broad masking and natural sounds alongside pitch-based personalization. Personalization should expand options, not create pressure."],
      ["A Strong App Store Subscription Story", "Frequency matching and notch filtering can support subscription conversion because they make the app feel individualized. But the subscription pitch should connect to outcomes: sleep with a calmer mix, focus with less sound awareness, save presets for different environments, and adjust personalization as needed. Users are more likely to subscribe when they feel the app understands their situation and gives them control. They are less likely to subscribe if they feel manipulated by fear. The best copy is firm and calm: tune your sound, keep it private, use it offline, and return to relief whenever tinnitus feels too noticeable."],
      ["The Bottom Line For Users", "Frequency matching is a reference tool. A notch filter is an optional personalization tool. Sound masking is the everyday relief tool. None of them should be marketed as diagnosis or treatment. Together, they can make a tinnitus relief app feel more useful, more personal, and more trustworthy. Tinnitus Relief should let users begin with immediate sound, then move into deeper tuning only when ready. That sequence matches the human journey: first reduce distress, then refine control."],
      ["How To Explain The Feature In Screenshots", "Screenshots should not lead with graphs that look medical. They should show the journey. First, a simple start screen. Second, sound selection. Third, a comfortable mix. Fourth, optional frequency tuning. Fifth, a notch toggle. Sixth, the sleep timer or saved preset. This order prevents advanced personalization from feeling intimidating. A user can see that the app works even if they never touch the frequency slider. At the same time, users who want control can see that more depth exists. The screenshot story should say: relief now, personalization when ready."],
      ["How To Keep The User From Over-Tuning", "Over-tuning is a real risk. A user can spend too long trying to match a pitch, then become more aware of tinnitus. The app should gently limit that behavior through copy and flow. Use plain language such as choose the closest tone, save and return to sound, and you can adjust later. Avoid scoreboards, medical-looking pass or fail language, or repeated prompts to retest. The goal is not to make the user prove their tinnitus. The goal is to help them create a sound environment they can tolerate. That product philosophy should appear in the blog article because it makes the feature feel safer."],
      ["Where Notch Filtering Fits In A Subscription Funnel", "Advanced personalization can be a subscription driver when it is framed as control, not fear. The free or first-use experience should prove immediate value with sound masking. Then the app can introduce deeper tools: frequency matching, notch filtering, saved profiles, richer mixes, and more presets. This order feels fair because the user understands the benefit before being asked to invest. The blog can support that funnel by explaining why personalization exists, who might want it, and why it remains optional. A subscriber is more likely to stay when the feature feels like a trusted extension of relief rather than a forced upgrade."],
      ["The Ethical Marketing Rule", "The simplest ethical rule is this: never imply that a slider or notch filter diagnoses, treats, or cures tinnitus. Say that it personalizes the sound masking experience. Say that it may help create a more comfortable listening environment. Say that it can be turned off anytime. Say that people with persistent or concerning symptoms should consult a professional. These boundaries do not weaken the article. They make it more believable. In a category full of desperate searches, realistic language is a competitive advantage."],
      ["How To Measure Whether Personalization Helps", "The simplest measure is not a clinical score. It is user behavior. Does the user return to the same personalized preset? Do they keep the notch on after trying it? Do they sleep with fewer adjustments? Do they use one profile for sleep and another for focus? These signals show whether personalization is useful in real life. A subscription product can build around these moments: saved profiles, quick toggles, timer recall, and local history. None of that requires making medical claims. It simply respects that tinnitus comfort is personal and that users value control when the ringing feels unpredictable."],
      ["A Good Advanced Feature Should Feel Calm", "Advanced does not have to mean complicated. The best frequency matching and notch filter flow should feel calm, short, and reversible. Give the user a slider, a preview sound, a save button, and a clear off switch. Avoid screens that look like diagnostic equipment unless the app is actually a regulated medical product. In a consumer tinnitus relief app, the emotional goal is confidence. The user should think: I can try this, I can stop anytime, and my settings stay private. That feeling turns a technical feature into a conversion asset."]
    ],
    checklist: ["Present frequency matching as personalization, not diagnosis.", "Let users start masking before advanced setup.", "Use close enough language instead of precision pressure.", "Make notch filtering optional and reversible.", "Keep frequency settings private and on-device."],
    deepDive: {
      figureTitle: "Personalization ladder: mask first, tune second",
      figureCaption: "Immediate relief and optional control should work together rather than compete.",
      figureStats: [["Step 1", "Start sound masking"], ["Step 2", "Match reference pitch"], ["Step 3", "Try optional notch"]],
      comparisonTitle: "Feature language that builds trust",
      comparisonColumns: ["Feature", "Avoid saying", "Better wording", "Reason"],
      comparisonRows: [
        ["Frequency match", "Diagnose your tinnitus", "Find a reference pitch", "Consumer comfort tool"],
        ["Notch filter", "Treat tinnitus", "Personalize the sound mix", "Avoid medical claim"],
        ["Sound masking", "Stop ringing", "Reduce awareness of ringing", "More realistic"],
        ["Listening profile", "Clinical hearing test", "Comfort profile", "Clear boundary"]
      ],
      faqs: [
        ["What is frequency matching?", "In an app context, it is a slider-based way to choose a reference tone that resembles the pitch you notice most."],
        ["What does a notch filter do?", "It reduces a narrow band of frequencies in the ambient sound around a selected reference frequency, creating a more personalized mix."],
        ["Is this a hearing test?", "No. Frequency matching in Tinnitus Relief should be understood as a comfort and personalization feature, not a clinical assessment."],
        ["Should everyone use notch filtering?", "No. Some users may prefer simple masking sounds. Advanced personalization should be optional."]
      ],
      sources: [
        ["NIDCD: Tinnitus", "https://www.nidcd.nih.gov/health/tinnitus", "Describes the range of tinnitus sounds and treatment approaches including sound therapy."],
        ["Cochrane: Sound therapy for tinnitus", "https://www.cochrane.org/evidence/CD013094_sound-therapy-using-amplification-devices-or-sound-generators-tinnitus", "Explains evidence quality and uncertainty around sound therapy devices."],
        ["NICE NG155", "https://www.nice.org.uk/guidance/ng155", "Guideline context for assessment and management boundaries."],
        ["Tinnitus Relief support", "/legal/Tinnitus/support/", "Internal support page describing frequency matching and notch filter workflow."]
      ]
    }
  }
);

const oldGuides = [
  {
    href: "/blog/wood-cutting-calculator-guide/",
    title: "Wood Cutting Calculator Guide",
    category: "Classic guide",
    description: "Kerf, stock size, grain direction, and waste reduction."
  },
  {
    href: "/blog/how-to-optimize-material-layout/",
    title: "How To Optimize Material Layout",
    category: "Classic guide",
    description: "Batching, rotation, offcut preservation, and cleaner layouts."
  }
];

const visualPatterns = [
  {
    cols: "repeat(8, 1fr)",
    rows: "34px 34px 34px",
    bg: "linear-gradient(135deg, #f1eee6, #e5ddcd)",
    cells: [
      ["1 / 1 / 2 / 6", "#4f8b63"],
      ["1 / 6 / 2 / 8", "#d7943c"],
      ["1 / 8 / 4 / 9", "#355f8f"],
      ["2 / 1 / 3 / 3", "#2f6f4e"],
      ["2 / 3 / 3 / 5", "#8b5e34"],
      ["2 / 5 / 4 / 7", "#4f8b63"]
    ]
  },
  {
    cols: "repeat(9, 1fr)",
    rows: "28px 28px 28px 28px",
    bg: "repeating-linear-gradient(90deg, rgba(139, 94, 52, 0.12) 0 1px, transparent 1px 24px), #f7efe1",
    cells: [
      ["1 / 1 / 5 / 2", "#243f31"],
      ["1 / 3 / 2 / 8", "#4f8b63"],
      ["2 / 3 / 3 / 6", "#d7943c"],
      ["2 / 6 / 5 / 7", "#355f8f"],
      ["3 / 3 / 5 / 5", "#2f6f4e"],
      ["3 / 8 / 5 / 10", "#8b5e34"]
    ]
  },
  {
    cols: "repeat(7, 1fr)",
    rows: "36px 36px 36px",
    bg: "linear-gradient(135deg, #fff8ec, #eef3ec)",
    cells: [
      ["1 / 1 / 3 / 3", "#d7943c"],
      ["1 / 3 / 2 / 6", "#4f8b63"],
      ["1 / 6 / 4 / 8", "#2f6f4e"],
      ["2 / 3 / 4 / 4", "#8b5e34"],
      ["2 / 4 / 3 / 6", "#355f8f"],
      ["3 / 4 / 4 / 6", "#4f8b63"]
    ]
  },
  {
    cols: "repeat(6, 1fr)",
    rows: "30px 30px 30px 30px",
    bg: "linear-gradient(180deg, #f8f6ef, #eee4d3)",
    cells: [
      ["1 / 1 / 2 / 7", "#d7943c"],
      ["2 / 1 / 3 / 3", "#2f6f4e"],
      ["2 / 3 / 3 / 5", "#4f8b63"],
      ["2 / 5 / 3 / 7", "#355f8f"],
      ["3 / 1 / 5 / 4", "#8b5e34"],
      ["3 / 4 / 5 / 7", "#4f8b63"]
    ]
  },
  {
    cols: "repeat(10, 1fr)",
    rows: "26px 26px 26px 26px",
    bg: "linear-gradient(135deg, #eef3ec, #f7f5ef)",
    cells: [
      ["1 / 1 / 5 / 3", "#2f6f4e"],
      ["1 / 4 / 2 / 11", "#d7943c"],
      ["2 / 4 / 3 / 7", "#4f8b63"],
      ["2 / 7 / 4 / 9", "#355f8f"],
      ["3 / 4 / 5 / 6", "#8b5e34"],
      ["4 / 6 / 5 / 11", "#4f8b63"]
    ]
  },
  {
    cols: "repeat(5, 1fr)",
    rows: "repeat(5, 24px)",
    bg: "linear-gradient(135deg, #fff6fb, #f0edf9)",
    cells: [
      ["1 / 1 / 3 / 3", "#9c4d7a"],
      ["1 / 3 / 2 / 6", "#2f6f4e"],
      ["2 / 3 / 4 / 5", "#d9467c"],
      ["3 / 1 / 6 / 2", "#14b8a6"],
      ["4 / 2 / 6 / 4", "#7c3aed"],
      ["4 / 4 / 6 / 6", "#f97316"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "repeating-linear-gradient(45deg, rgba(156, 77, 122, 0.08) 0 10px, transparent 10px 20px), #fff7fb",
    cells: [
      ["1 / 1 / 3 / 3", "#7c3aed"],
      ["1 / 3 / 2 / 7", "#d9467c"],
      ["1 / 7 / 5 / 9", "#2f6f4e"],
      ["2 / 3 / 4 / 5", "#14b8a6"],
      ["2 / 5 / 5 / 7", "#9c4d7a"],
      ["4 / 1 / 5 / 5", "#f97316"]
    ]
  },
  {
    cols: "repeat(6, 1fr)",
    rows: "repeat(4, 30px)",
    bg: "linear-gradient(135deg, #fff6fb, #eef3ec)",
    cells: [
      ["1 / 1 / 2 / 7", "#9c4d7a"],
      ["2 / 1 / 5 / 2", "#2f6f4e"],
      ["2 / 2 / 3 / 4", "#d9467c"],
      ["2 / 4 / 4 / 7", "#7c3aed"],
      ["3 / 2 / 5 / 4", "#14b8a6"],
      ["4 / 4 / 5 / 7", "#f97316"]
    ]
  },
  {
    cols: "repeat(7, 1fr)",
    rows: "repeat(5, 23px)",
    bg: "linear-gradient(135deg, #fdf2f8, #fffaf0)",
    cells: [
      ["1 / 1 / 3 / 4", "#d9467c"],
      ["1 / 4 / 2 / 8", "#2f6f4e"],
      ["2 / 4 / 4 / 6", "#9c4d7a"],
      ["3 / 1 / 6 / 2", "#14b8a6"],
      ["4 / 2 / 6 / 5", "#7c3aed"],
      ["4 / 5 / 6 / 8", "#f97316"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "repeating-linear-gradient(90deg, rgba(47, 111, 78, 0.08) 0 1px, transparent 1px 26px), #fff7fb",
    cells: [
      ["1 / 1 / 2 / 3", "#2f6f4e"],
      ["1 / 3 / 3 / 5", "#9c4d7a"],
      ["1 / 5 / 2 / 9", "#d9467c"],
      ["2 / 1 / 5 / 2", "#7c3aed"],
      ["3 / 2 / 5 / 6", "#14b8a6"],
      ["2 / 6 / 5 / 9", "#f97316"]
    ]
  },
  {
    cols: "repeat(7, 1fr)",
    rows: "repeat(4, 30px)",
    bg: "linear-gradient(135deg, #eef4fb, #f7f5ef)",
    cells: [
      ["4 / 1 / 5 / 8", "#8b5e34"],
      ["3 / 2 / 4 / 8", "#355f8f"],
      ["2 / 3 / 3 / 8", "#4f8b63"],
      ["1 / 4 / 2 / 8", "#d7943c"],
      ["1 / 1 / 5 / 2", "#2f6f4e"],
      ["2 / 2 / 5 / 3", "#8b5e34"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(4, 30px)",
    bg: "linear-gradient(135deg, #eff6ff, #f7f5ef)",
    cells: [
      ["1 / 1 / 5 / 2", "#355f8f"],
      ["1 / 2 / 2 / 5", "#4f8b63"],
      ["2 / 3 / 3 / 6", "#d7943c"],
      ["3 / 4 / 4 / 7", "#8b5e34"],
      ["4 / 5 / 5 / 9", "#2f6f4e"],
      ["1 / 7 / 4 / 9", "#355f8f"]
    ]
  },
  {
    cols: "repeat(9, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "linear-gradient(135deg, #eef4fb, #fff8ec)",
    cells: [
      ["1 / 1 / 5 / 3", "#8b5e34"],
      ["1 / 3 / 2 / 10", "#355f8f"],
      ["2 / 4 / 3 / 10", "#4f8b63"],
      ["3 / 5 / 4 / 10", "#d7943c"],
      ["4 / 6 / 5 / 10", "#2f6f4e"],
      ["2 / 3 / 5 / 4", "#355f8f"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(5, 24px)",
    bg: "repeating-linear-gradient(0deg, rgba(53, 95, 143, 0.09) 0 1px, transparent 1px 24px), #f7fbff",
    cells: [
      ["1 / 1 / 2 / 9", "#355f8f"],
      ["2 / 1 / 3 / 3", "#2f6f4e"],
      ["2 / 3 / 4 / 5", "#8b5e34"],
      ["3 / 5 / 5 / 7", "#d7943c"],
      ["4 / 7 / 6 / 9", "#4f8b63"],
      ["5 / 1 / 6 / 7", "#355f8f"]
    ]
  },
  {
    cols: "repeat(7, 1fr)",
    rows: "repeat(4, 30px)",
    bg: "linear-gradient(135deg, #f1eee6, #eef4fb)",
    cells: [
      ["1 / 1 / 5 / 2", "#8b5e34"],
      ["1 / 2 / 2 / 5", "#355f8f"],
      ["1 / 5 / 3 / 8", "#4f8b63"],
      ["2 / 2 / 4 / 4", "#d7943c"],
      ["4 / 2 / 5 / 6", "#2f6f4e"],
      ["3 / 6 / 5 / 8", "#8b5e34"]
    ]
  },
  {
    cols: "repeat(6, 1fr)",
    rows: "repeat(5, 24px)",
    bg: "repeating-linear-gradient(90deg, rgba(139, 94, 52, 0.12) 0 1px, transparent 1px 31px), repeating-linear-gradient(0deg, rgba(139, 94, 52, 0.12) 0 1px, transparent 1px 31px), #fffaf0",
    cells: [
      ["1 / 1 / 3 / 3", "#d7943c"],
      ["1 / 3 / 2 / 7", "#2f6f4e"],
      ["2 / 3 / 4 / 5", "#8b5e34"],
      ["3 / 1 / 6 / 2", "#4f8b63"],
      ["4 / 2 / 6 / 5", "#d7943c"],
      ["4 / 5 / 6 / 7", "#355f8f"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "linear-gradient(135deg, #fffaf0, #eef3ec)",
    cells: [
      ["1 / 1 / 5 / 2", "#2f6f4e"],
      ["1 / 2 / 2 / 5", "#d7943c"],
      ["1 / 5 / 3 / 7", "#8b5e34"],
      ["1 / 7 / 5 / 9", "#355f8f"],
      ["2 / 2 / 5 / 4", "#4f8b63"],
      ["3 / 4 / 5 / 7", "#d7943c"]
    ]
  },
  {
    cols: "repeat(9, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "repeating-linear-gradient(45deg, rgba(215, 148, 60, 0.12) 0 8px, transparent 8px 16px), #fff8ec",
    cells: [
      ["1 / 1 / 5 / 3", "#d7943c"],
      ["1 / 3 / 2 / 10", "#8b5e34"],
      ["2 / 3 / 4 / 5", "#2f6f4e"],
      ["2 / 5 / 5 / 7", "#355f8f"],
      ["3 / 7 / 5 / 10", "#4f8b63"],
      ["4 / 1 / 5 / 5", "#d7943c"]
    ]
  },
  {
    cols: "repeat(7, 1fr)",
    rows: "repeat(5, 24px)",
    bg: "linear-gradient(135deg, #eef3ec, #fffaf0)",
    cells: [
      ["1 / 1 / 2 / 8", "#355f8f"],
      ["2 / 1 / 4 / 3", "#2f6f4e"],
      ["2 / 3 / 5 / 5", "#d7943c"],
      ["2 / 5 / 4 / 8", "#8b5e34"],
      ["4 / 1 / 6 / 4", "#4f8b63"],
      ["4 / 4 / 6 / 8", "#d7943c"]
    ]
  },
  {
    cols: "repeat(8, 1fr)",
    rows: "repeat(4, 28px)",
    bg: "repeating-linear-gradient(90deg, rgba(47, 111, 78, 0.1) 0 1px, transparent 1px 24px), #fffaf0",
    cells: [
      ["1 / 1 / 2 / 9", "#2f6f4e"],
      ["2 / 1 / 3 / 4", "#d7943c"],
      ["2 / 4 / 5 / 5", "#8b5e34"],
      ["2 / 5 / 4 / 9", "#355f8f"],
      ["3 / 1 / 5 / 3", "#4f8b63"],
      ["4 / 5 / 5 / 9", "#d7943c"]
    ]
  }
];

const researchBriefs = {
  "plywood-waste-cost-benchmark-manual-vs-optimizer": {
    question: "How should a builder prove that plywood optimization is saving money instead of just making a prettier layout?",
    insight: "The benchmark has to compare sheet count, usable offcuts, kerf assumptions, and cut order across the same part list. A lower waste percentage is useful only when it leads to fewer purchased sheets, reusable offcuts, or fewer layout revisions.",
    metrics: ["Sheets purchased", "Waste percentage", "Usable offcut area", "Kerf-included fit", "Revision time before cut"]
  },
  "best-plywood-cutting-workflow-2026": {
    question: "Which planning workflow fits the job: manual sketch, spreadsheet, browser calculator, CutList optimizer, or CNC nesting?",
    insight: "Each tool answers a different question. Spreadsheets are strong for quantity logic, calculators are strong for fast feasibility, CutList is strong for visual sheet review, and CNC nesting is strongest when geometry must become machine-ready toolpaths.",
    metrics: ["Decision speed", "Layout visibility", "Saved project record", "Kerf and rotation handling", "Machine-readiness"]
  },
  "cutlist-shop-workflow-from-bid-to-cut": {
    question: "Where does material waste enter the cabinet workflow before anyone reaches the saw?",
    insight: "Most waste is created upstream: ambiguous estimating assumptions, mixed material groups, and unreviewed sheet layouts. The optimizer is most valuable when it sits between estimating and production as a verification layer.",
    metrics: ["Estimate-to-cut variance", "Sheet yield by material", "Rework parts per job", "Reusable offcut recovery"]
  },
  "plywood-optimization-kerf-grain-offcuts": {
    question: "Why do mathematically compact layouts still fail in real shops?",
    insight: "The optimization target has to include shop constraints, not just area utilization. Grain direction, kerf, trim cuts, handling order, and offcut usefulness can outweigh a small percentage-point gain in yield.",
    metrics: ["Kerf assumption error", "Rotation-locked part count", "Offcut size distribution", "Cut sequence handling risk"]
  },
  "cabinet-cut-list-mistakes": {
    question: "Which cut list errors produce the highest downstream cost?",
    insight: "The expensive errors are rarely arithmetic alone. They come from unclear dimension conventions, quantity duplication, edge treatment omissions, and nonstandard back or stretcher rules that multiply across the run.",
    metrics: ["Duplicate-size anomalies", "Finished vs rough dimension mismatches", "Edgebanding exceptions", "Standard part reuse rate"]
  },
  "reducing-sheet-good-waste-on-small-shops": {
    question: "How can a small shop build a material-control system without enterprise software?",
    insight: "Small shops gain leverage from standard material naming, reusable stock libraries, offcut labeling, and project-type baselines. The operating system matters as much as the optimizer.",
    metrics: ["Named material consistency", "Saved offcut usage", "Waste by job type", "Sheets purchased vs planned"]
  },
  "cutlist-vs-spreadsheets-for-cabinetmakers": {
    question: "Where should spreadsheets stop and spatial optimization begin?",
    insight: "Spreadsheets are strong for estimating logic and quantity derivation. They become fragile when the problem becomes spatial: kerf, rotation, sheet boundaries, and visual review belong in a layout interface.",
    metrics: ["Formula error rate", "Manual layout time", "Parts exported per project", "Layout revisions before approval"]
  },
  "quiltfit-digital-quilt-planning-workflow": {
    question: "What changes when quilt design is treated as a planning system instead of a sketch?",
    insight: "A digital quilt plan preserves relationships between finished size, block count, fabric roles, and yardage. That reduces the gap between creative exploration and purchasing decisions.",
    metrics: ["Block count stability", "Fabric role coverage", "Revision count", "Yardage variance after cutting"]
  },
  "fabric-yardage-estimates-with-block-layouts": {
    question: "Why do yardage estimates drift even when the quilt dimensions are correct?",
    insight: "The hidden variables are repeat count, seam allowance conversion, directional print restrictions, and role-specific rounding. A block-level estimate exposes those assumptions earlier.",
    metrics: ["Pieces per fabric role", "Cut-size conversion checks", "Directional-print allowance", "Unused yardage by fabric"]
  },
  "backing-binding-batting-planning": {
    question: "Why do finishing materials create late-stage project friction?",
    insight: "Backing, binding, and batting are often treated as afterthoughts, but they are driven by perimeter, overhang, quilting method, and material behavior. Planning them early prevents stalled finishes.",
    metrics: ["Backing overhang margin", "Binding length buffer", "Batting shrinkage allowance", "Finish-stage delay days"]
  },
  "quilt-project-tracking-from-sketch-to-finish": {
    question: "What project information is most likely to disappear during a long quilt build?",
    insight: "Fabric sources, design intent, quantity changes, and partial cutting status are the fragile records. Tracking them turns a creative project into a resumable workflow.",
    metrics: ["Documented fabric sources", "Cut piece completion", "Block assembly status", "Finish notes captured"]
  },
  "color-and-repeat-planning-for-modern-quilts": {
    question: "How can makers evaluate color rhythm before committing fabric?",
    insight: "Digital layouts reveal contrast, repetition, negative space, and focal balance at a distance. The strongest signal is often the zoomed-out composition, not the individual fabric choice.",
    metrics: ["Palette size", "Contrast bands", "Negative-space ratio", "Block variation count"]
  },
  "stair-stringer-design-rise-run-basics": {
    question: "Why do small stair measurement errors compound so quickly?",
    insight: "A stair is a repeated geometry system. Total rise, riser count, tread depth, and finished-floor assumptions distribute across every step, so a small input error becomes a repeated comfort and safety issue.",
    metrics: ["Total rise source", "Riser height deviation", "Total run fit", "Top and bottom finish adjustment"]
  },
  "comfortable-stair-layout-rules": {
    question: "What separates a stair that is legal from one that feels good?",
    insight: "Comfort comes from rhythm, consistency, and predictability. Code compliance is the floor; perceived safety depends on equal risers, sufficient run, landing logic, and uninterrupted headroom.",
    metrics: ["Riser consistency", "Tread depth comfort", "Landing interval", "Headroom clearance path"]
  },
  "deck-stair-stringer-field-measurements": {
    question: "Which field conditions most often break a deck stair layout?",
    insight: "Exterior stairs depend on finished surfaces and real landing slope. A stringer drawn from rough framing can fail once decking, pads, drainage, and attachment hardware enter the system.",
    metrics: ["Finished deck elevation", "Landing slope", "Attachment height", "Bottom riser deviation"]
  },
  "stair-opening-planning-for-remodels": {
    question: "Why are stair openings hard to redesign late in a remodel?",
    insight: "The opening is constrained by structure, walking line, headroom envelope, door swings, and guardrail landings. These constraints must be studied together, not as separate details.",
    metrics: ["Opening length", "Walking-line clearance", "Headroom envelope", "Door and guardrail conflicts"]
  },
  "avoiding-common-stringer-layout-errors": {
    question: "Which stringer layout mistakes are most expensive to recover from?",
    insight: "Uneven top or bottom risers, forgotten tread thickness, over-notched stringers, and untested duplicated cuts can ruin a full batch. One verified template is cheaper than repeated confidence.",
    metrics: ["Top/bottom riser delta", "Tread thickness adjustment", "Notch depth ratio", "Template verification status"]
  },
  "tile-layout-planning-before-install": {
    question: "How does layout planning change perceived tile quality?",
    insight: "Tile quality is read through sightlines, symmetry, edge cuts, and transitions. A technically sound install can still look poor if visual center and focal-wall relationships are ignored.",
    metrics: ["Edge cut width", "Focal-line alignment", "Dry-lay variance", "Transition conflict count"]
  },
  "tile-waste-estimation-by-pattern": {
    question: "Why is square footage a weak predictor of tile waste?",
    insight: "Waste is pattern-dependent. Diagonal, herringbone, mixed-size, and perimeter-heavy rooms generate different cut distributions even when total area is identical.",
    metrics: ["Pattern module size", "Perimeter cut count", "Unusable cutoffs", "Attic stock percentage"]
  },
  "large-format-tile-cut-planning": {
    question: "What makes large-format tile planning materially different from standard tile?",
    insight: "Large units concentrate cost, handling risk, substrate flatness requirements, and lippage visibility. One bad cut or bowed substrate is more consequential than in small-format installs.",
    metrics: ["Substrate flatness readings", "Large cut count", "Breakage risk zones", "Staging area availability"]
  },
  "bathroom-tile-layout-slope-and-drain": {
    question: "How should drainage geometry shape bathroom tile layout?",
    insight: "Drain type creates slope planes, and slope planes decide tile size and cut strategy. Visual layout must support water movement before it supports decorative symmetry.",
    metrics: ["Drain location", "Slope plane count", "Tile size vs plane complexity", "Wall-floor grout alignment"]
  },
  "grout-joint-layout-and-visual-balance": {
    question: "Why should grout be planned as part of the design system?",
    insight: "Grout lines are visible geometry. Width, color, alignment, and tile variation determine whether the installation reads as calm surface, graphic grid, or uneven field.",
    metrics: ["Joint width tolerance", "Tile size variation", "Feature alignment", "Grout contrast level"]
  }
};

const extraPalettes = [
  ["#2f6f4e", "#d7943c", "#355f8f", "#8b5e34", "#4f8b63", "#243f31"],
  ["#9c4d7a", "#14b8a6", "#f97316", "#7c3aed", "#d9467c", "#2f6f4e"],
  ["#355f8f", "#d7943c", "#2f6f4e", "#8b5e34", "#4f8b63", "#9c4d7a"],
  ["#d7943c", "#2f6f4e", "#8b5e34", "#355f8f", "#4f8b63", "#f97316"]
];

const extraLayouts = [
  ["1 / 1 / 3 / 3", "1 / 3 / 2 / 7", "2 / 3 / 5 / 4", "2 / 4 / 4 / 8", "4 / 4 / 6 / 6", "4 / 6 / 6 / 9"],
  ["1 / 1 / 2 / 9", "2 / 1 / 5 / 2", "2 / 2 / 3 / 5", "2 / 5 / 4 / 7", "3 / 2 / 5 / 5", "4 / 5 / 5 / 9"],
  ["1 / 1 / 5 / 2", "1 / 2 / 3 / 4", "1 / 4 / 2 / 9", "2 / 4 / 5 / 5", "3 / 5 / 5 / 8", "2 / 8 / 5 / 9"],
  ["1 / 1 / 3 / 5", "1 / 5 / 2 / 9", "3 / 1 / 5 / 3", "2 / 5 / 5 / 6", "2 / 6 / 4 / 9", "4 / 3 / 5 / 9"],
  ["1 / 1 / 2 / 4", "1 / 4 / 4 / 5", "1 / 5 / 3 / 9", "2 / 1 / 5 / 2", "3 / 2 / 5 / 5", "4 / 5 / 5 / 9"]
];

function createGeneratedPattern(index) {
  const palette = extraPalettes[index % extraPalettes.length];
  const layout = extraLayouts[index % extraLayouts.length];
  const rotated = palette.map((_, colorIndex) => palette[(colorIndex + index) % palette.length]);
  const bg =
    index % 2 === 0
      ? `linear-gradient(135deg, rgba(247, 245, 239, 0.96), rgba(238, 243, 236, 0.94)), repeating-linear-gradient(90deg, rgba(47, 111, 78, 0.09) 0 1px, transparent 1px ${22 + (index % 6) * 3}px)`
      : `linear-gradient(135deg, rgba(255, 250, 240, 0.96), rgba(241, 238, 230, 0.96)), repeating-linear-gradient(45deg, rgba(139, 94, 52, 0.1) 0 8px, transparent 8px ${16 + (index % 5) * 2}px)`;

  return {
    cols: "repeat(8, 1fr)",
    rows: "repeat(5, 24px)",
    bg,
    cells: layout.map((area, cellIndex) => [area, rotated[cellIndex]])
  };
}

function getVisualPattern(articleIndex) {
  return visualPatterns[articleIndex] || createGeneratedPattern(articleIndex);
}

function fallbackResearchBrief(article) {
  if (article.category === "CutList") {
    return {
      question: `How can a personal builder use CutList to finish ${article.title.toLowerCase()} with fewer mistakes?`,
      insight: "The hobby workflow is strongest when the app is used as a planning checkpoint: define the project, enter accurate stock and parts, generate a visual layout, then use cost, waste, grain, kerf, PDF export, project history, and offline access to control the real cutting session.",
      metrics: ["Sheet count before purchase", "Waste percentage", "Part-label accuracy", "Cuts completed from sequence"]
    };
  }

  if (article.category === "QuiltFit") {
    return {
      question: `How can a personal quilter use QuiltFit to move ${article.title.toLowerCase()} from idea to finished project?`,
      insight: "The hobby workflow is strongest when design, fabric planning, shopping, cutting, sewing sequence, and progress tracking stay connected. QuiltFit keeps those decisions in one project so a maker can preview the quilt, estimate yardage, build a shopping list, export cut information, and return to the work later.",
      metrics: ["Block layout stability", "Yardage variance", "Shopping-list completion", "Block progress tracked"]
    };
  }

  return null;
}

const relatedCutListLinks = [
  ["/plywood-cut-calculator/", "Try the plywood cut calculator"],
  ["/cut-list-calculator/", "Use the board cut list calculator"],
  ["/apps/cutlist/", "Open the CutList iPhone cut list app"],
  ["/blog/plywood-optimization-kerf-grain-offcuts/", "Study kerf, grain, and offcut strategy"],
  ["/blog/cabinet-cut-list-mistakes/", "Avoid common cabinet cut list mistakes"],
  ["/blog/reducing-sheet-good-waste-on-small-shops/", "Reduce sheet-good waste in a small shop"],
  ["/blog/cutlist-vs-spreadsheets-for-cabinetmakers/", "Compare CutList apps and spreadsheets"]
];

const cutlistArticleEnhancements = {
  "cutlist-shop-workflow-from-bid-to-cut": {
    scenario: "A two-person cabinet shop is quoting a laundry room with four base cabinets, six adjustable shelves, two finished end panels, and drawer boxes. Before a sheet is opened, the estimator needs to know whether prefinished plywood and shop-grade backs should be purchased together or separated into different material groups.",
    calculation: "If the visible cabinet parts use three 4 x 8 sheets at roughly 78% yield and backs use one cheaper sheet at 62% yield, mixing the groups hides the real cost. Running them separately in CutList makes the buying decision clearer and keeps offcuts matched to material quality.",
    mistake: "The common mistake is sending the first spreadsheet total straight to the saw. It usually misses finished ends, duplicate left/right parts, or the extra trim cut needed to square factory edges.",
    cta: "Use the online plywood calculator for a quick sheet count, then move the approved job into CutList for iPhone when the shop needs saved local projects and PDF output."
  },
  "plywood-optimization-kerf-grain-offcuts": {
    scenario: "A maker is building a maple plywood media cabinet with visible side panels and hidden internal shelves. The layout must preserve grain direction on finished faces while still using offcuts for shelves and stretchers.",
    calculation: "With a 1/8 inch kerf, ten rip cuts consume 1.25 inches of material before any trimming. On a tight sheet layout, that can be the difference between a shelf fitting cleanly and a part coming out undersized.",
    mistake: "The common mistake is allowing every part to rotate because the waste percentage looks better. For visible panels, grain direction can matter more than saving a few square inches.",
    cta: "Check the layout with the free plywood cutting calculator, then use CutList when the project needs grain rules, saved layouts, and a shop-ready cut record."
  },
  "cabinet-cut-list-mistakes": {
    scenario: "A DIY builder is making two garage cabinets and copies the same shelf size into every box. One cabinet is deeper because it sits beside a utility pipe, but the copied cut list does not show that exception.",
    calculation: "Six shelves at 30 x 18 inches use 3,240 square inches before kerf. If two shelves should actually be 30 x 21 inches, the missing 180 square inches can force a different sheet layout late in the job.",
    mistake: "The common mistake is mixing opening dimensions, finished dimensions, and oversized trim dimensions in one list. The optimizer can only solve the dimensions it receives.",
    cta: "Use a visual cut list optimizer to group duplicate sizes and catch quantity errors before buying plywood."
  },
  "reducing-sheet-good-waste-on-small-shops": {
    scenario: "A small shop builds mudroom benches, closet inserts, and shop cabinets from the same 3/4 inch plywood. Without a shared stock library, every project starts with slightly different material names and offcuts are hard to reuse.",
    calculation: "Saving one usable 18 x 30 inch offcut is 540 square inches, or about 7.8% of a 4 x 8 sheet. Labeling three similar offcuts can prevent buying an extra project panel later.",
    mistake: "The common mistake is treating every leftover piece as useful. Thin strips without labels usually become clutter instead of inventory.",
    cta: "Use CutList to keep local project records and compare planned waste against real shop scraps after the job is cut."
  },
  "cutlist-vs-spreadsheets-for-cabinetmakers": {
    scenario: "A cabinet maker uses a spreadsheet to calculate box quantities, then manually sketches parts on paper to see whether they fit on plywood. The estimate is fast, but the spatial layout is still guesswork.",
    calculation: "A spreadsheet can total five shelves at 30 x 18 inches, but it does not show whether those shelves fit beside two 34.5 x 23.25 inch side panels after kerf and grain restrictions.",
    mistake: "The common mistake is using area totals as proof that a sheet will work. Rectangles can have enough total area and still fail because of shape, rotation, or cut order.",
    cta: "Keep formulas in the spreadsheet if they help estimating, then move dimensions into the CutList app or online calculator for sheet layout."
  },
  "cutlist-garage-shelf-weekend-project": {
    scenario: "A homeowner wants garage shelves from two sheets of plywood and needs the side panels, shelves, and braces ready before Saturday afternoon assembly.",
    calculation: "Four shelves at 48 x 15 inches consume 2,880 square inches before kerf, close to 42% of one 4 x 8 sheet. The side panels and braces decide whether the project needs another sheet.",
    mistake: "The common mistake is measuring shelf openings after buying material, then discovering that support strips or side panels were not included.",
    cta: "Use the plywood cut calculator before the store trip, then save the final layout in CutList for offline reference."
  },
  "cutlist-bookcase-from-one-sheet": {
    scenario: "A maker is trying to build a simple bookcase from one sheet and wants to know whether fixed shelves, side panels, and a toe kick can all fit.",
    calculation: "Two sides at 72 x 11.25 inches already use 1,620 square inches. Add four shelves at 30 x 11.25 inches and the layout is tight enough that kerf and rip order matter.",
    mistake: "The common mistake is assuming a one-sheet project works because the arithmetic area fits. Long parts can block efficient placement.",
    cta: "Preview the sheet layout online, then use CutList if the design needs saved revisions."
  },
  "cutlist-closet-organizer-diy": {
    scenario: "A DIY closet organizer has tower sides, adjustable shelves, shoe shelves, and narrow cleats. The project looks simple until every small support piece is added.",
    calculation: "A 96 x 48 sheet has 4,608 square inches. If the visible panels consume 3,600 square inches before kerf, the remaining area may not be shaped well enough for long cleats.",
    mistake: "The common mistake is leaving cleats, fillers, and nailers out of the first cut list because they feel minor.",
    cta: "Use CutList to keep all small parts labeled so the layout and assembly sequence stay connected."
  },
  "cutlist-drawer-boxes-for-beginners": {
    scenario: "A beginner is cutting drawer box sides, fronts, backs, and bottoms for a small workbench. The repeated parts make the job ideal for a cut list, but labels matter.",
    calculation: "Six drawers need twelve sides and twelve fronts or backs. A 1/16 inch dimension mistake repeated 24 times turns into a project-wide fit problem.",
    mistake: "The common mistake is cutting one part from memory and batching it before checking the assembled drawer size.",
    cta: "Enter every drawer part in a cut list optimizer, review quantities, then export or save the plan in CutList."
  },
  "cutlist-plywood-workbench-top": {
    scenario: "A builder is laminating plywood for a workbench top and needs a clean plan for top layers, stretchers, and utility shelves from sheet goods.",
    calculation: "Two 72 x 30 inch top layers consume 4,320 square inches, almost a full 4 x 8 sheet before kerf. The remaining parts need a second sheet or a design adjustment.",
    mistake: "The common mistake is pricing only the top surface and forgetting lower shelves, braces, and sacrificial strips.",
    cta: "Run the layout before buying material, then keep the final cut sequence in the CutList iPhone app."
  }
};

function cutlistApplicationPanel(article) {
  const detail = cutlistArticleEnhancements[article.slug];
  if (!detail) {
    return "";
  }

  return `<section class="article-application-panel">
        <h2>Project Application</h2>
        <div class="application-grid">
          <div><strong>Real scenario</strong><p>${escapeHtml(detail.scenario)}</p></div>
          <div><strong>Quick calculation</strong><p>${escapeHtml(detail.calculation)}</p></div>
          <div><strong>Common mistake</strong><p>${escapeHtml(detail.mistake)}</p></div>
          <div><strong>Tool CTA</strong><p>${escapeHtml(detail.cta)}</p></div>
        </div>
      </section>`;
}

function relatedToolsAndGuides(article) {
  if (article.category !== "CutList") {
    return "";
  }

  return `<section class="related-tools-guides">
        <h2>Related tools and guides</h2>
        <div class="related-grid">${relatedCutListLinks
          .map(([href, label]) => `<a href="${href}"><span>CutList resource</span><strong>${escapeHtml(label)}</strong></a>`)
          .join("")}</div>
      </section>`;
}

function deepDiveFigure(article) {
  const detail = article.deepDive;
  if (!detail?.figureTitle) return "";
  const labels = detail.figureStats || [];
  if (article.category === "Tinnitus") {
    return tinnitusDeepFigure(article, labels);
  }
  if (article.category === "PDF Scan") {
    return pdfScanDeepFigure(article, labels);
  }

  return `<section class="deep-figure-section">
        <div class="deep-figure-copy">
          <p class="eyebrow">Visual model</p>
          <h2>${escapeHtml(detail.figureTitle)}</h2>
          <p>${escapeHtml(detail.figureCaption || "")}</p>
        </div>
        <figure class="deep-layout-figure ${escapeHtml(article.accent)}">
          <div class="sheet-diagram" aria-hidden="true">
            <span class="sheet-part part-a">A</span>
            <span class="sheet-part part-b">B</span>
            <span class="sheet-part part-c">C</span>
            <span class="sheet-part part-d">D</span>
            <span class="sheet-offcut offcut-one">usable offcut</span>
            <span class="sheet-offcut offcut-two">scrap</span>
            <span class="kerf-line kerf-one"></span>
            <span class="kerf-line kerf-two"></span>
          </div>
          <figcaption>${escapeHtml(detail.figureCaption || "")}</figcaption>
          <div class="deep-stat-row">${labels.map(([value, label]) => `<span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(label)}</em></span>`).join("")}</div>
        </figure>
      </section>`;
}

function pdfScanVisualVariant(article) {
  const variants = {
    "best-pdf-scanner-app-iphone-private-documents": "capture",
    "ocr-pdf-scanner-searchable-documents-guide": "ocr",
    "scan-to-pdf-workflow-receipts-invoices-signatures-lock": "workflow"
  };
  return variants[article.slug] || "capture";
}

function pdfScanDeepModel(article) {
  const variant = pdfScanVisualVariant(article);
  const models = {
    capture: `<div class="pdf-capture-stage">
            <span class="pdf-phone-shell">
              <span class="pdf-phone-speaker"></span>
              <span class="pdf-camera-frame">
                <span class="pdf-page-shape">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span class="pdf-scan-beam"></span>
                <span class="pdf-corner corner-one"></span>
                <span class="pdf-corner corner-two"></span>
                <span class="pdf-corner corner-three"></span>
                <span class="pdf-corner corner-four"></span>
              </span>
            </span>
            <span class="pdf-side-note note-a">Edge detect</span>
            <span class="pdf-side-note note-b">Private PDF</span>
          </div>`,
    ocr: `<div class="pdf-ocr-stage">
            <span class="pdf-doc-card">
              <span class="ocr-badge">OCR</span>
              <span class="ocr-photo-block"></span>
              <span class="ocr-line line-one"></span>
              <span class="ocr-line line-two"></span>
              <span class="ocr-line line-three"></span>
              <span class="ocr-highlight"></span>
            </span>
            <span class="pdf-search-panel">
              <span>Searchable PDF</span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>`,
    workflow: `<div class="pdf-workflow-stage">
            <span class="pdf-flow-step step-scan">Scan</span>
            <span class="pdf-flow-step step-review">Review</span>
            <span class="pdf-flow-step step-sign">Sign</span>
            <span class="pdf-flow-step step-lock">Lock</span>
            <span class="pdf-secure-card">
              <span class="pdf-lock-mark"></span>
              <span>Private PDF</span>
            </span>
          </div>`
  };
  return models[variant] || models.capture;
}

function pdfScanDeepFigure(article, labels) {
  const detail = article.deepDive;
  const variant = pdfScanVisualVariant(article);

  return `<section class="deep-figure-section">
        <div class="deep-figure-copy">
          <p class="eyebrow">Visual model</p>
          <h2>${escapeHtml(detail.figureTitle)}</h2>
          <p>${escapeHtml(detail.figureCaption || "")}</p>
        </div>
        <figure class="deep-layout-figure pdf-scan-deep-figure pdf-scan-deep-${variant} ${escapeHtml(article.accent)}">
          <div class="pdf-scan-deep-model" aria-hidden="true">${pdfScanDeepModel(article)}</div>
          <figcaption>${escapeHtml(detail.figureCaption || "")}</figcaption>
          <div class="deep-stat-row">${labels.map(([value, label]) => `<span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(label)}</em></span>`).join("")}</div>
        </figure>
      </section>`;
}

function tinnitusVisualVariant(article) {
  const variants = {
    "tinnitus-relief-app-sound-masking-night-guide": "night",
    "white-noise-tinnitus-sleep-sound-app": "noise",
    "why-tinnitus-feels-louder-at-night-sleep-masking": "sleep",
    "offline-tinnitus-app-privacy-on-device-sound-masking": "privacy",
    "frequency-matching-notch-filter-tinnitus-personalization": "frequency"
  };
  return variants[article.slug] || "night";
}

function tinnitusArticleVisual(article, articleIndex) {
  const variant = tinnitusVisualVariant(article);
  const number = String(articleIndex + 1).padStart(2, "0");
  const images = {
    night: {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Girl_in_headphones_%28cropped%29.jpg",
      alt: "Person wearing headphones for a calm tinnitus sound masking routine",
      label: "Night relief"
    },
    noise: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Rain_on_window_%28Unsplash%29.jpg",
      alt: "Rain on a window for white noise and sleep sound masking",
      label: "Rain and white noise"
    },
    sleep: {
      src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/A_Bedroom_with_a_wooden_bed.jpg",
      alt: "Quiet bedroom setting for nighttime tinnitus awareness",
      label: "Sleep and silence"
    },
    privacy: {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Smartphone_lock_screen_enter_PIN.jpg",
      alt: "Smartphone lock screen representing offline private on-device sound masking",
      label: "Offline privacy"
    },
    frequency: {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/f1/API_Console_-_VU_Meter_Bridge%2C_API560_10_Band_EQ%2C_API550A_3_Band_EQ_%282017-01-05_19.45.22_piqsels.com_en%29.jpg",
      alt: "Audio equalizer controls representing frequency matching and notch filtering",
      label: "Frequency tuning"
    }
  };
  const image = images[variant] || images.night;

  return `<figure class="blog-article-visual tinnitus-photo-visual tinnitus-photo-${variant} visual-${number}">
          <img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">
          <figcaption>${escapeHtml(image.label)}</figcaption>
        </figure>`;
}

function articlePhotoVisual(article, articleIndex) {
  const number = String(articleIndex + 1).padStart(2, "0");
  const image = article.image;
  return `<figure class="blog-article-visual blog-photo-visual visual-${number}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || article.title)}" loading="lazy" decoding="async">
          <figcaption>${escapeHtml(image.label || article.category)}</figcaption>
        </figure>`;
}

function tinnitusDeepModel(article) {
  const variant = tinnitusVisualVariant(article);
  const models = {
    night: `<div class="masking-contrast">
            <span class="contrast-before">Silent room</span>
            <span class="contrast-after">Sound layer</span>
            <span class="contrast-line"></span>
          </div>
          <div class="masking-flow">
            <span>Open app</span>
            <span>Choose preset</span>
            <span>Set timer</span>
          </div>`,
    noise: `<div class="noise-choice-grid">
            <span class="noise-card white">White</span>
            <span class="noise-card pink">Pink</span>
            <span class="noise-card brown">Brown</span>
            <span class="noise-card rain">Rain</span>
          </div>
          <div class="noise-wave-row">
            <span></span>
            <span></span>
            <span></span>
          </div>`,
    sleep: `<div class="awareness-loop">
            <span>Silence</span>
            <span>Notice</span>
            <span>Stress</span>
            <span>Mask</span>
          </div>
          <div class="sleep-softener">
            <span></span>
            <span></span>
            <span></span>
          </div>`,
    privacy: `<div class="local-stack">
            <span class="local-phone">iPhone</span>
            <span class="local-lock">Local</span>
            <span class="local-chip">No cloud</span>
            <span class="local-chip">No account</span>
          </div>`,
    frequency: `<div class="personalization-ladder">
            <span>Mask</span>
            <span>Tune</span>
            <span>Notch</span>
          </div>
          <div class="notch-curve">
            <span class="notch-curve-line"></span>
            <span class="notch-dip"></span>
          </div>`
  };
  return models[variant] || models.night;
}

function tinnitusDeepFigure(article, labels) {
  const detail = article.deepDive;
  const variant = tinnitusVisualVariant(article);

  return `<section class="deep-figure-section">
        <div class="deep-figure-copy">
          <p class="eyebrow">Visual model</p>
          <h2>${escapeHtml(detail.figureTitle)}</h2>
          <p>${escapeHtml(detail.figureCaption || "")}</p>
        </div>
        <figure class="deep-layout-figure tinnitus-deep-figure tinnitus-deep-${variant} ${escapeHtml(article.accent)}">
          <div class="tinnitus-deep-model" aria-hidden="true">${tinnitusDeepModel(article)}</div>
          <figcaption>${escapeHtml(detail.figureCaption || "")}</figcaption>
          <div class="deep-stat-row">${labels.map(([value, label]) => `<span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(label)}</em></span>`).join("")}</div>
        </figure>
      </section>`;
}

function deepComparison(article) {
  const detail = article.deepDive;
  if (!detail?.comparisonRows?.length) return "";
  const columns = detail.comparisonColumns || ["Option", "Best for", "Limit", "Decision"];

  return `<section class="deep-compare-section">
        <p class="eyebrow">Compare</p>
        <h2>${escapeHtml(detail.comparisonTitle || "Workflow comparison")}</h2>
        <div class="deep-table-wrap">
          <table class="deep-compare-table">
            <thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
            <tbody>${detail.comparisonRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </section>`;
}

function deepFaq(article) {
  const faqs = article.deepDive?.faqs || [];
  if (!faqs.length) return "";

  return `<section class="deep-faq-section">
        <p class="eyebrow">FAQ</p>
        <h2>Common questions</h2>
        <div class="deep-faq-grid">${faqs.map(([question, answer]) => `<div class="deep-faq-item"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></div>`).join("")}</div>
      </section>`;
}

function deepSources(article) {
  const sources = article.deepDive?.sources || [];
  if (!sources.length) return "";

  return `<section class="deep-sources-section">
        <p class="eyebrow">Sources</p>
        <h2>Data and references</h2>
        <div class="deep-source-grid">${sources.map(([label, href, note]) => {
          const rel = /^https?:\/\//.test(href) ? ' rel="nofollow noopener"' : "";
          return `<a href="${escapeHtml(href)}"${rel}><strong>${escapeHtml(label)}</strong><span>${escapeHtml(note)}</span></a>`;
        }).join("")}</div>
      </section>`;
}

// Inline SVG bar chart — vector, zero external assets, no copyright risk.
// chart = { title, caption, unit, bars: [[label, value], ...], source? }
// Renders one inline SVG bar chart (vector, no external assets).
let chartIdCounter = 0;
function renderBarChart(chart, accent) {
  if (!chart?.bars?.length) return "";
  const bars = chart.bars;
  const chartId = `chart${++chartIdCounter}`;
  const max = Math.max(...bars.map(([, v]) => Number(v) || 0)) || 1;
  const W = 720, H = 300, padL = 44, padR = 16, padT = 16, padB = 54;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / bars.length;
  const barW = Math.min(72, slot * 0.6);

  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH - f * plotH;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" class="chart-grid"/>` +
      `<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" class="chart-axis" text-anchor="end">${Math.round(f * max)}</text>`;
  }).join("");

  const rects = bars.map(([label, value], i) => {
    const v = Number(value) || 0;
    const h = (v / max) * plotH;
    const x = padL + i * slot + (slot - barW) / 2;
    const y = padT + plotH - h;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="4" class="chart-bar chart-bar-c${i % 6}"/>` +
      `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" class="chart-value" text-anchor="middle">${escapeHtml(String(value))}${chart.unit ? escapeHtml(chart.unit) : ""}</text>` +
      `<text x="${(x + barW / 2).toFixed(1)}" y="${(H - padB + 20).toFixed(1)}" class="chart-label" text-anchor="middle">${escapeHtml(label)}</text>`;
  }).join("");

  return `<figure class="deep-chart-figure ${escapeHtml(accent)}">
          <figcaption class="chart-title">${escapeHtml(chart.title)}</figcaption>
          <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${chartId}-t ${chartId}-d" preserveAspectRatio="xMidYMid meet">
            <title id="${chartId}-t">${escapeHtml(chart.title)}</title>
            <desc id="${chartId}-d">${escapeHtml(chart.caption || chart.title)} Values: ${bars.map(([l, v]) => `${escapeHtml(l)} ${escapeHtml(String(v))}${chart.unit ? escapeHtml(chart.unit) : ""}`).join(", ")}.</desc>
            <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" class="chart-axis-line"/>
            <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" class="chart-axis-line"/>
            ${grid}
            ${rects}
          </svg>
          ${chart.caption ? `<figcaption>${escapeHtml(chart.caption)}</figcaption>` : ""}
        </figure>`;
}

// Supports article.charts (array, multiple charts) or article.chart (single).
function chartFigure(article) {
  const charts = article.charts || (article.chart ? [article.chart] : []);
  const valid = charts.filter((c) => c?.bars?.length);
  if (!valid.length) return "";
  const accent = article.accent || "cutlist";
  return `<section class="deep-chart-section">
        <p class="eyebrow">Data charts</p>
        <div class="deep-chart-grid">${valid.map((c) => renderBarChart(c, accent)).join("")}</div>
      </section>`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function header(active = "Blogs") {
  const links = [
    ["CutList", "/apps/cutlist/"],
    ["QuiltFit", "/apps/quiltfit/"],
    ["Tile", "/tile-calculator/"],
    ["Stringer", "/stringer/"],
    ["Blogs", "/blog/"],
    ["Apps", "/apps/"]
  ];

  return `<header class="site-header"><nav class="nav" aria-label="Main navigation"><a class="brand" href="/"><span class="brand-mark">W</span>WoodCutTool</a><div class="nav-links">${links.map(([label, href]) => `<a${label === active ? ' class="active"' : ""} href="${href}">${label}</a>`).join("")}</div><a class="button small" href="/apps/">Explore Apps</a></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a><a href="/blog/">Blogs</a><a href="/tile-calculator/">Tile</a><a href="/stringer/">Stringer</a></nav></div><div class="footer-disclaimer"><!-- disclaimer --><p><strong>Disclaimer:</strong> WoodCutTool calculators, templates, and guides are provided for general informational and estimating purposes only, on an &quot;as is&quot; basis without warranties of any kind. Results are estimates &mdash; always verify measurements, material quantities, and costs yourself before buying or cutting.</p><p>Our content is not professional, structural, engineering, or safety advice. For stairs, structural work, electrical, plumbing, or anything affecting safety, consult a qualified professional and follow your local building codes and permit requirements. You are responsible for your own measurements, tools, and safety. WoodCutTool is not liable for any loss, injury, or damage arising from use of this site.</p><p>App names, logos, and trademarks (including Apple and App Store) belong to their respective owners and do not imply endorsement. External links and cited sources are provided for reference only.</p></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

function head({ title, description, canonical, ogType = "website", jsonLd = "" }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" type="application/rss+xml" title="WoodCutTool Blog" href="/feed.xml">
  ${ogTags({ title, description, canonical, type: ogType })}
  ${jsonLd}
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#1e2a23">
  <link rel="stylesheet" href="/assets/styles.css?v=${version}">
  <script src="/assets/app.js?v=${version}" defer></script>
</head>`;
}

function getArticleIndex(article) {
  return articles.findIndex((candidate) => candidate.slug === article.slug);
}

function articleVisual(article) {
  const articleIndex = Math.max(0, getArticleIndex(article));
  if (article.image) {
    return articlePhotoVisual(article, articleIndex);
  }
  if (article.category === "Tinnitus") {
    return tinnitusArticleVisual(article, articleIndex);
  }
  const pattern = getVisualPattern(articleIndex);
  const style = `--visual-cols: ${pattern.cols}; --visual-rows: ${pattern.rows}; --visual-bg: ${pattern.bg};`;
  const cells = pattern.cells
    .map(([area, color]) => `<span style="grid-area: ${area}; background: ${color};"></span>`)
    .join("");

  return `<div class="blog-article-visual ${article.accent} visual-${String(articleIndex + 1).padStart(2, "0")}" style="${style}" aria-hidden="true">${cells}</div>`;
}

function articleCard(article) {
  const articleIndex = Math.max(0, getArticleIndex(article));
  const searchText = [article.title, article.description, article.category, article.kicker, article.readTime, article.slug].join(" ");
  return `<article class="blog-card ${article.accent}" data-blog-card data-blog-category="${escapeHtml(article.category)}" data-blog-search="${escapeHtml(searchText.toLowerCase())}">
        <a href="/blog/${article.slug}/" aria-label="Read ${escapeHtml(article.title)}">
          <span class="blog-card-number">${String(articleIndex + 1).padStart(2, "0")}</span>
          <span class="blog-card-category">${escapeHtml(article.category)}</span>
          ${articleVisual(article)}
          <h2>${escapeHtml(article.title)}</h2>
          <p>${escapeHtml(article.description)}</p>
          <span class="blog-card-meta">${escapeHtml(article.kicker)} · ${escapeHtml(article.readTime)}</span>
        </a>
      </article>`;
}

function directoryLink(article) {
  const articleIndex = Math.max(0, getArticleIndex(article));
  const searchText = [article.title, article.description, article.category, article.kicker, article.slug].join(" ");
  return `<a href="/blog/${article.slug}/" data-blog-directory-item data-blog-category="${escapeHtml(article.category)}" data-blog-search="${escapeHtml(searchText.toLowerCase())}">
              <span>${String(articleIndex + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(article.title)}</strong>
              <em>${escapeHtml(article.category)}</em>
            </a>`;
}

function blogIndex() {
  const featured = [articles[0], articles[5], articles[10], articles[15]];
  const categories = [
    ["CutList", "cutlist"],
    ["QuiltFit", "quiltfit"],
    ["Stairs", "stairs"],
    ["Tile", "tile"],
    ["PDF Scan", "pdf-scan"],
    ["SnapReceipt", "snapreceipt"],
    ["Cadenza", "cadenza"],
    ["Tinnitus", "tinnitus"]
  ];
  const categoryLinks = categories
    .map(([label, id]) => {
      const count = articles.filter((article) => article.category === label).length;
      return `<a href="#${id}" data-blog-category-link="${escapeHtml(label)}"><span>${label}</span><strong data-blog-category-count>${count}</strong></a>`;
    })
    .join("\n          ");

  return `<!doctype html>
<html lang="en">
${head({
    title: "Blogs | WoodCutTool",
    description: "Research-style articles about CutList optimization, PDF scanning, Cadenza music practice, QuiltFit planning, tinnitus sound masking, stair stringer design, and tile layout workflows.",
    canonical: "https://woodcuttool.com/blog/"
  })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Blogs")}
  <main id="main" class="blog-home" data-blog-index>
    <div class="blog-shell">
      <aside class="blog-directory" aria-label="Blog directory">
        <details class="blog-directory-panel" data-blog-directory-panel>
          <summary class="blog-directory-summary">
            <span>
              <span class="eyebrow">Directory</span>
              <strong>Find articles faster.</strong>
            </span>
            <span class="blog-directory-count">${articles.length + oldGuides.length} articles</span>
          </summary>
          <div class="blog-directory-content">
          <label class="blog-search">
            <span>Search the library</span>
            <input type="search" data-blog-search-input autocomplete="off" placeholder="Search CutList, PDF Scan, Cadenza, QuiltFit...">
          </label>
          <nav class="blog-directory-nav" aria-label="Blog topic shortcuts">
            ${categoryLinks}
            <a href="#core-guides" data-blog-category-link="Classic guide"><span>Guides</span><strong data-blog-category-count>${oldGuides.length}</strong></a>
          </nav>
          <div class="blog-directory-status" data-blog-search-status>${articles.length + oldGuides.length} articles</div>
          <div class="blog-directory-list" aria-label="Article list">
            ${articles.map(directoryLink).join("\n            ")}
            ${oldGuides.map((guide, index) => `<a href="${guide.href}" data-blog-directory-item data-blog-category="${escapeHtml(guide.category)}" data-blog-search="${escapeHtml([guide.title, guide.description, guide.category].join(" ").toLowerCase())}">
              <span>G${index + 1}</span>
              <strong>${escapeHtml(guide.title)}</strong>
              <em>${escapeHtml(guide.category)}</em>
            </a>`).join("\n            ")}
          </div>
          <p class="blog-search-empty" data-blog-search-empty hidden>No matching articles.</p>
          </div>
        </details>
      </aside>

      <div class="blog-main">
        <section class="blog-hero">
      <div class="blog-hero-copy">
        <p class="breadcrumb"><a href="/">Home</a> / Blogs</p>
        <p class="eyebrow">Industry research library</p>
        <h1>Research notes for builders, makers, document workflows, musicians, wellness apps, and layout-obsessed planners.</h1>
        <p class="lead">Deeper articles on CutList optimization, PDF scanning, Cadenza music practice, QuiltFit planning, tinnitus sound masking, stair stringer geometry, and tile layout strategy, with decision metrics for real projects.</p>
      </div>
      <div class="blog-console" aria-label="Blog topic map">
        <div class="console-top"><span></span><span></span><span></span></div>
        <div class="console-grid" aria-hidden="true">
          <span class="cut"></span><span class="quilt"></span><span class="stairs"></span><span class="tile"></span>
          <span class="tile"></span><span class="cut"></span><span class="quilt"></span><span class="stairs"></span>
          <span class="stairs"></span><span class="tile"></span><span class="cut"></span><span class="quilt"></span>
        </div>
        <div class="console-stats">
          <strong>${articles.length}</strong><span>research briefs</span>
          <strong>${categories.length}</strong><span>topic areas</span>
        </div>
      </div>
    </section>

    <section class="blog-strip" aria-label="Blog categories">
      <a href="#cutlist">CutList</a>
      <a href="#quiltfit">QuiltFit</a>
      <a href="#stairs">Stairs</a>
      <a href="#tile">Tile</a>
      <a href="#pdf-scan">PDF Scan</a>
      <a href="#cadenza">Cadenza</a>
      <a href="#tinnitus">Tinnitus</a>
    </section>

    <section class="blog-featured" aria-label="Featured blog articles" data-blog-featured>
      ${featured.map(articleCard).join("\n      ")}
    </section>

    <section class="blog-section" id="cutlist" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">CutList</p><h2>Sheet optimization and shop workflow.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "CutList").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="quiltfit" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">QuiltFit</p><h2>Digital quilt planning and fabric decisions.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "QuiltFit").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="stairs" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">Stairs</p><h2>Stringer geometry, comfort, and remodel planning.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "Stairs").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="tile" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">Tile</p><h2>Tile layout, waste, joints, and wet-area planning.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "Tile").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="pdf-scan" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">PDF Scan</p><h2>Private document scanning, OCR, scan to PDF workflows, signatures, and file organization.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "PDF Scan").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="snapreceipt" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">SnapReceipt</p><h2>Receipt tracking, mileage logs, and private expense records for contractors, makers, and small business.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "SnapReceipt").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="cadenza" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">Cadenza</p><h2>Metronome, tuner, rhythm, intonation, and private music practice workflows.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "Cadenza").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="tinnitus" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">Tinnitus</p><h2>Sound masking, sleep sounds, privacy, and evidence-aware app positioning.</h2></div>
      <div class="blog-grid">${articles.filter((article) => article.category === "Tinnitus").map(articleCard).join("\n        ")}</div>
    </section>

    <section class="blog-section" id="core-guides" data-blog-section>
      <div class="blog-section-head"><p class="eyebrow">Core guides</p><h2>Existing WoodCutTool guides.</h2></div>
      <div class="blog-grid legacy-guides">${oldGuides.map((guide, index) => `<article class="blog-card classic" data-blog-card data-blog-category="${guide.category}" data-blog-search="${escapeHtml([guide.title, guide.description, guide.category].join(" ").toLowerCase())}"><a href="${guide.href}"><span class="blog-card-number">G${index + 1}</span><span class="blog-card-category">${guide.category}</span><h2>${guide.title}</h2><p>${guide.description}</p><span class="blog-card-meta">Read guide</span></a></article>`).join("\n        ")}</div>
    </section>
      </div>
    </div>
  </main>
  ${footer()}
</body>
</html>
`;
}

function blogPostingJsonLd(article) {
  const url = `https://woodcuttool.com/blog/${article.slug}/`;
  const graph = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    image: "https://woodcuttool.com/assets/og/woodcuttool-og.png",
    datePublished: "2026-01-01",
    dateModified: "2026-06-23",
    inLanguage: "en",
    articleSection: article.category,
    author: { "@type": "Organization", name: "WoodCutTool", url: "https://woodcuttool.com/" },
    publisher: {
      "@type": "Organization",
      name: "WoodCutTool",
      url: "https://woodcuttool.com/",
      logo: { "@type": "ImageObject", url: "https://woodcuttool.com/assets/icons/icon-512.png" }
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function articlePage(article) {
  const related = articles
    .filter((candidate) => candidate.slug !== article.slug && candidate.category === article.category)
    .slice(0, 3);
  const research = researchBriefs[article.slug] || fallbackResearchBrief(article);

  return `<!doctype html>
<html lang="en">
${head({
    title: `${article.title} | WoodCutTool Blogs`,
    description: article.description,
    canonical: `https://woodcuttool.com/blog/${article.slug}/`,
    ogType: "article",
    jsonLd: blogPostingJsonLd(article)
  })}
<body>
  ${breadcrumbJsonLd([["Home", "/"], ["Blogs", "/blog/"], [article.title, `/blog/${article.slug}/`]])}
  <a class="skip-link" href="#main">Skip to content</a>
  ${header("Blogs")}
  <main id="main" class="article-shell blog-article-shell">
    <article class="article-body blog-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blogs</a> / ${escapeHtml(article.category)}</p>
      <div class="blog-article-head">
        <div>
          <p class="eyebrow">${escapeHtml(article.kicker)}</p>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="lead">${escapeHtml(article.description)}</p>
          <div class="article-meta-line"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.readTime)}</span><span>Updated 2026</span></div>
        </div>
        ${articleVisual(article)}
      </div>
      ${research ? `<section class="research-panel"><h2>Research Lens</h2><div class="research-grid"><div><strong>Question</strong><p>${escapeHtml(research.question)}</p></div><div><strong>Working Insight</strong><p>${escapeHtml(research.insight)}</p></div></div></section><section class="metric-panel"><h2>Decision Metrics</h2><div class="metric-pill-grid">${research.metrics.map((metric) => `<span>${escapeHtml(metric)}</span>`).join("")}</div></section>` : ""}
      ${deepDiveFigure(article)}
      ${article.sections.map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p></section>`).join("\n      ")}
      ${chartFigure(article)}
      ${deepComparison(article)}
      <section class="article-checklist">
        <h2>Field Checklist</h2>
        <ul>${article.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      ${deepFaq(article)}
      ${deepSources(article)}
      ${cutlistApplicationPanel(article)}
      ${relatedToolsAndGuides(article)}
      <section class="related-articles">
        <h2>Related Articles</h2>
        <div class="related-grid">${related.map((item) => `<a href="/blog/${item.slug}/"><span>${escapeHtml(item.category)}</span><strong>${escapeHtml(item.title)}</strong></a>`).join("")}</div>
      </section>
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}

const zhArticleTitles = {
  "plywood-waste-cost-benchmark-manual-vs-optimizer": "胶合板浪费成本基准：手工排版 vs CutList 优化器",
  "best-plywood-cutting-workflow-2026": "2026 胶合板切割工作流对比：计算器、表格、优化器还是 CNC",
  "cutlist-shop-workflow-from-bid-to-cut": "CutList 工坊流程：从报价到第一刀",
  "plywood-optimization-kerf-grain-offcuts": "胶合板优化：锯缝、纹理与余料策略",
  "cabinet-cut-list-mistakes": "浪费板材的常见橱柜切割清单错误",
  "reducing-sheet-good-waste-on-small-shops": "小型木工店如何减少板材浪费",
  "cutlist-vs-spreadsheets-for-cabinetmakers": "橱柜制作者该用 CutList 还是电子表格",
  "quiltfit-digital-quilt-planning-workflow": "现代拼布制作者的数字化 QuiltFit 规划流程",
  "fabric-yardage-estimates-with-block-layouts": "从拼布块布局估算布料用量",
  "backing-binding-batting-planning": "不用猜的背布、包边和铺棉规划",
  "quilt-project-tracking-from-sketch-to-finish": "从草图到完成的拼布项目追踪",
  "color-and-repeat-planning-for-modern-quilts": "现代拼布的色彩与重复节奏规划",
  "stair-stringer-design-rise-run-basics": "楼梯梁设计：踏步高、踏面深度与总高度",
  "comfortable-stair-layout-rules": "设计师真正会用的舒适楼梯布局规则",
  "deck-stair-stringer-field-measurements": "露台楼梯梁的现场测量方法",
  "stair-opening-planning-for-remodels": "改造项目中的楼梯洞口规划",
  "avoiding-common-stringer-layout-errors": "避免常见楼梯梁放样错误",
  "tile-layout-planning-before-install": "搅拌薄贴砂浆前的瓷砖排版规划",
  "tile-waste-estimation-by-pattern": "按铺贴图案估算瓷砖损耗",
  "large-format-tile-cut-planning": "大规格瓷砖切割规划",
  "bathroom-tile-layout-slope-and-drain": "围绕坡度与排水的浴室瓷砖排版",
  "grout-joint-layout-and-visual-balance": "美缝线布局与视觉平衡",
  "cutlist-garage-shelf-weekend-project": "用 CutList 周末完成车库置物架",
  "cutlist-bookcase-from-one-sheet": "用一张板做书柜的 CutList 规划",
  "cutlist-closet-organizer-diy": "用 CutList 规划 DIY 衣柜收纳系统",
  "cutlist-drawer-boxes-for-beginners": "新手抽屉盒：用 CutList 避免数量错误",
  "cutlist-plywood-workbench-top": "用 CutList 规划胶合板工作台面",
  "cutlist-mudroom-bench-cubbies": "DIY 玄关长凳和储物格规划",
  "cutlist-kids-toy-storage-plywood": "儿童玩具收纳家具的胶合板 CutList 流程",
  "cutlist-small-apartment-furniture": "小户型家具的 CutList 规划",
  "cutlist-backyard-planter-boxes": "后院花箱：户外板材切割规划",
  "cutlist-van-storage-camper-conversion": "房车和露营车收纳板件规划",
  "cutlist-first-plywood-project-checklist": "第一个胶合板项目的 CutList 检查清单",
  "cutlist-ocr-for-handwritten-project-notes": "用 CutList OCR 把手写笔记变成切割方案",
  "cutlist-pdf-plan-for-home-center-cuts": "为建材店或共享工坊导出 CutList PDF",
  "quiltfit-first-baby-quilt-plan": "用 QuiltFit 规划第一条婴儿被",
  "quiltfit-tshirt-memory-quilt": "用 QuiltFit 规划 T 恤纪念被",
  "quiltfit-scrap-quilt-from-stash": "用布料库存规划碎布拼布被",
  "quiltfit-weekend-table-runner": "用 QuiltFit 做一个周末桌旗项目",
  "quiltfit-guild-challenge-project": "用 QuiltFit 管理拼布社群挑战项目",
  "quiltfit-gift-quilt-shopping-list": "礼物拼布：从想法到 QuiltFit 购物清单",
  "quiltfit-log-cabin-color-study": "用 QuiltFit 做木屋拼布色彩研究",
  "quiltfit-flying-geese-wall-hanging": "用 QuiltFit 规划飞雁壁挂拼布",
  "quiltfit-half-square-triangle-throw": "用 QuiltFit 规划半方三角盖毯",
  "quiltfit-quilt-retreat-prep": "用 QuiltFit 准备拼布营项目",
  "quiltfit-restart-unfinished-quilt-project": "用 QuiltFit 重启未完成的拼布项目",
  "quiltfit-fabric-shop-decision-workflow": "在布料店用 QuiltFit 做购买决策",
  "best-pdf-scanner-app-iphone-private-documents": "iPhone 最佳 PDF 扫描 App：私密扫描文档、收据、证件和合同",
  "ocr-pdf-scanner-searchable-documents-guide": "OCR PDF 扫描指南：把扫描件变成可搜索文档",
  "scan-to-pdf-workflow-receipts-invoices-signatures-lock": "Scan To PDF 工作流：收据、发票、签名、PDF 加锁和项目整理",
  "best-metronome-app-daily-practice-cadenza": "日常练习最佳节拍器 App：速度、Tap Tempo、重音和曲目单",
  "guitar-tuner-app-cents-a4-reference-cadenza": "吉他调音器 App 指南：音分、A4 参考音、半音阶调音和 Drone",
  "music-practice-tracker-setlist-metronome-tuner-cadenza": "音乐练习追踪流程：曲目单、速度笔记、调音和日常重复"
};

const zhCategory = {
  CutList: "CutList",
  QuiltFit: "QuiltFit",
  Stairs: "楼梯",
  Tile: "瓷砖",
  "PDF Scan": "PDF 扫描",
  SnapReceipt: "SnapReceipt",
  Cadenza: "Cadenza",
  Tinnitus: "耳鸣",
  "Classic guide": "经典指南"
};

const zhSectionTemplates = {
  CutList: {
    headings: ["明确项目约束", "输入真实材料参数", "检查可视化排版", "保存并复盘切割计划"],
    bodies: [
      "先把项目尺寸、零件数量、材料类型和可见面要求写清楚。CutList 只有拿到真实约束，才能生成可以落地的板材排版。",
      "输入实际板材尺寸、锯缝、纹理方向和是否允许旋转。对个人项目来说，提前把这些参数设准，比开锯后返工更省时间。",
      "生成方案后不要只看利用率，还要检查窄条、余料、切割顺序和容易混淆的重复零件。可视化布局是开工前的最后审核点。",
      "把项目保存到历史记录，必要时导出 PDF 或打印切割清单。完成后对比实际余料，下次类似项目会规划得更准。"
    ],
    checklist: ["确认所有零件名称和数量。", "设置真实板材尺寸与锯缝。", "检查纹理方向和可见面。", "保存或导出最终切割方案。"]
  },
  QuiltFit: {
    headings: ["先确定成品目标", "把设计拆成可计算的块", "用购物清单控制布料", "追踪裁剪与缝制进度"],
    bodies: [
      "先确定成品尺寸、用途和想要的视觉风格。QuiltFit 的规划从目标尺寸开始，避免边做边猜布料是否足够。",
      "把草图转成拼布块、行列和布料角色。块尺寸稳定之后，布料用量、裁片数量和安全余量才更容易判断。",
      "使用布料名称、颜色、数量和可选价格生成购物清单。去布料店之前先有计划，能减少漏买和重复购买。",
      "把裁片、区块、行列、压线、包边等步骤放进同一个项目里追踪。暂停一段时间后，也能知道下一步该做什么。"
    ],
    checklist: ["确定成品尺寸。", "选择拼布块和布料角色。", "生成并核对购物清单。", "追踪裁剪、拼接和收尾进度。"]
  },
  Stairs: {
    headings: ["从完成面测量", "平衡踏步高和踏面深度", "检查空间与净空", "切割前验证放样"],
    bodies: [
      "楼梯尺寸应从完成后的地面到完成后的地面测量。忽略地板、平台或铺面厚度，会让第一步或最后一步不一致。",
      "踏步高、踏面深度和总进深共同决定楼梯是否舒适。一个小误差会重复到整段楼梯上，所以需要先算清楚。",
      "在决定楼梯梁之前，要检查水平空间、洞口、转角、门扇、扶手和净空。能走通的楼梯不一定安装得下。",
      "对复杂现场，先画一根样板楼梯梁并现场核对，再批量切割。一次验证比整批返工便宜得多。"
    ],
    checklist: ["测量完成面到完成面。", "核对踏步数和每步高度。", "检查总进深与净空。", "批量切割前验证样板。"]
  },
  Tile: {
    headings: ["先找视觉基准线", "避免边缘小窄条", "把损耗按图案估算", "铺贴前确认细节"],
    bodies: [
      "瓷砖排版不只是面积计算，还要考虑门口、墙面、浴缸、地漏和主要视线。视觉中心往往比几何中心更重要。",
      "边缘太窄的切片看起来像失误，也更难施工。提前移动基准线，可以让周边切片更均衡。",
      "直铺、斜铺、人字铺和混合规格图案的损耗不同。按图案估算，比只按平方英尺加固定百分比更可靠。",
      "正式铺贴前确认美缝宽度、过门石、伸缩缝、排水坡度和关键对线。排版规划越早，现场返工越少。"
    ],
    checklist: ["确定视觉中心和主基准线。", "检查边缘切片宽度。", "按图案增加损耗预留。", "铺贴前干铺关键区域。"]
  },
  "PDF Scan": {
    headings: ["先确定最终文件用途", "拍清楚再做 OCR", "按项目整理扫描件", "导出前检查隐私"],
    bodies: [
      "扫描前先判断文件要用于提交、报销、存档、签名还是分享。用途不同，PDF 质量、页面顺序、OCR、签名和加锁需求也不同。",
      "OCR 的效果取决于原始扫描质量。尽量让纸张平整、光线均匀、边缘完整，再用裁切、透视校正和增强工具提高可读性。",
      "把合同、收据、发票、证件、课堂资料、旅行文件和保修单分项目保存。扫描不是终点，之后能不能找回来同样重要。",
      "包含身份证件、签名、金额、地址、客户信息或医疗表格的文件要谨慎分享。需要时使用 PDF 加锁，并优先选择离线、无登录、设备端处理的流程。"
    ],
    checklist: ["确认文件要 PDF、图片、OCR 还是 CSV。", "检查裁切、方向和页面顺序。", "重要字段要人工复核。", "敏感 PDF 分享前考虑加锁。"]
  },
  Cadenza: {
    headings: ["先保存练习目标", "用节拍器稳定节奏", "用调音器确认音准", "把设置留给下一次"],
    bodies: [
      "先把曲名、作曲者、调性、目标 BPM、拍号和一句练习笔记保存下来。Cadenza 的价值不只是发出节拍声，而是让下一次练习能马上接上。",
      "用清晰的 BPM、Tap Tempo、拍号和重音点建立稳定节奏。对日常练习来说，慢速准确比快速硬冲更有价值。",
      "练习前用调音器检查最近音名、频率和音分偏差，需要时选择 A4 参考音或使用 Drone 音训练听感。",
      "结束时只更新真正影响下一次练习的信息，比如新的工作速度、容易抢拍的小节、需要对 drone 检查的音程。"
    ],
    checklist: ["保存曲目和 BPM。", "设置拍号与重音。", "确认 A4 参考音和调音状态。", "留下下一次练习要做的短笔记。"]
  }
};

function zhTitle(article) {
  return zhArticleTitles[article.slug] || article.title;
}

function zhReadTime(readTime) {
  return readTime.replace("min", "分钟");
}

function zhKicker(article) {
  if (article.category === "CutList") return "切割规划";
  if (article.category === "QuiltFit") return "拼布规划";
  if (article.category === "Stairs") return "楼梯设计";
  if (article.category === "Tile") return "瓷砖排版";
  if (article.category === "PDF Scan") return "PDF 扫描";
  if (article.category === "SnapReceipt") return "费用记录";
  if (article.category === "Cadenza") return "音乐练习";
  return "指南";
}

function zhDescription(article) {
  if (article.category === "CutList") {
    return `围绕“${zhTitle(article)}”的实用流程，帮助个人木工和小型工坊在购买板材前看清零件、排版、余料和切割顺序。`;
  }
  if (article.category === "QuiltFit") {
    return `围绕“${zhTitle(article)}”的拼布规划方法，帮助制作者把尺寸、布料、购物清单、裁片和缝制进度放在同一个项目里管理。`;
  }
  if (article.category === "Stairs") {
    return `围绕“${zhTitle(article)}”的楼梯设计笔记，帮助在切割楼梯梁之前核对高度、进深、净空、洞口和现场条件。`;
  }
  if (article.category === "Tile") {
    return `围绕“${zhTitle(article)}”的瓷砖排版研究，帮助在施工前判断视觉基准、损耗、切割和关键节点。`;
  }
  if (article.category === "PDF Scan") {
    return `围绕“${zhTitle(article)}”的 PDF 扫描流程，帮助用户把纸质文档、收据、发票、合同、证件、签名和 OCR 文本整理成私密、可分享的文件。`;
  }
  if (article.category === "Cadenza") {
    return `围绕“${zhTitle(article)}”的音乐练习流程，帮助演奏者把节拍器、调音器、曲目单、速度笔记和离线隐私放在同一个练习工具里。`;
  }
  return article.description;
}

function toTraditional(text) {
  const map = {
    这: "這", 个: "個", 为: "為", 与: "與", 业: "業", 东: "東", 丝: "絲", 丢: "丟", 两: "兩", 严: "嚴", 丧: "喪",
    临: "臨", 举: "舉", 义: "義", 乌: "烏", 乐: "樂", 习: "習", 书: "書", 买: "買", 乱: "亂", 争: "爭",
    于: "於", 云: "雲", 亚: "亞", 产: "產", 亩: "畝", 亲: "親", 亵: "褻", 亿: "億", 仅: "僅", 从: "從",
    仑: "侖", 仓: "倉", 仪: "儀", 们: "們", 优: "優", 会: "會", 传: "傳", 伤: "傷", 伦: "倫", 伪: "偽",
    体: "體", 余: "餘", 佛: "佛", 作: "作", 你: "你", 佣: "傭", 侠: "俠", 侣: "侶", 侥: "僥", 侦: "偵",
    侧: "側", 侨: "僑", 侩: "儈", 侪: "儕", 侬: "儂", 俣: "俁", 俦: "儔", 俨: "儼", 俩: "倆", 俪: "儷",
    俭: "儉", 债: "債", 倾: "傾", 偿: "償", 储: "儲", 儿: "兒", 兑: "兌", 党: "黨", 兰: "蘭", 关: "關",
    兴: "興", 养: "養", 内: "內", 冈: "岡", 册: "冊", 写: "寫", 军: "軍", 农: "農", 冲: "衝", 决: "決",
    况: "況", 冻: "凍", 净: "淨", 准: "準", 凉: "涼", 减: "減", 凑: "湊", 几: "幾", 凤: "鳳", 凭: "憑",
    凯: "凱", 击: "擊", 凿: "鑿", 划: "劃", 刘: "劉", 则: "則", 刚: "剛", 创: "創", 删: "刪", 别: "別",
    刬: "剗", 刭: "剄", 刹: "剎", 刽: "劊", 刿: "劌", 剀: "剴", 剂: "劑", 剐: "剮", 剑: "劍", 剧: "劇",
    劝: "勸", 办: "辦", 务: "務", 动: "動", 励: "勵", 劲: "勁", 劳: "勞", 势: "勢", 勋: "勳", 匀: "勻",
    匦: "匭", 区: "區", 医: "醫", 华: "華", 协: "協", 单: "單", 卖: "賣", 卢: "盧", 卤: "鹵", 卧: "臥",
    卫: "衛", 厂: "廠", 厅: "廳", 历: "歷", 厉: "厲", 压: "壓", 厌: "厭", 厕: "廁", 厢: "廂", 厣: "厴",
    厦: "廈", 厨: "廚", 厩: "廄", 县: "縣", 参: "參", 双: "雙", 发: "發", 变: "變", 叙: "敘", 叠: "疊",
    叶: "葉", 号: "號", 后: "後", 向: "向", 吓: "嚇", 吗: "嗎", 启: "啟", 吴: "吳", 员: "員", 呙: "咼",
    呛: "嗆", 呜: "嗚", 咏: "詠", 咙: "嚨", 咛: "嚀", 咝: "噝", 咤: "吒", 咴: "噅", 咸: "鹹", 响: "響",
    哑: "啞", 哒: "噠", 哓: "嘵", 哔: "嗶", 哕: "噦", 哗: "嘩", 哙: "噲", 哜: "嚌", 哝: "噥", 哟: "喲",
    唤: "喚", 唿: "呼", 啧: "嘖", 啬: "嗇", 啭: "囀", 啮: "嚙", 啴: "嘽", 啸: "嘯", 喷: "噴", 喽: "嘍",
    嗫: "囁", 嗳: "噯", 嘘: "噓", 嘤: "嚶", 嘱: "囑", 噜: "嚕", 团: "團", 园: "園", 围: "圍", 国: "國",
    图: "圖", 圆: "圓", 圣: "聖", 场: "場", 坏: "壞", 块: "塊", 坚: "堅", 坛: "壇", 坜: "壢", 坝: "壩",
    坞: "塢", 坟: "墳", 坠: "墜", 垄: "壟", 垅: "壟", 垆: "壚", 垒: "壘", 垦: "墾", 垩: "堊", 垫: "墊",
    垭: "埡", 垱: "壋", 垲: "塏", 垴: "堖", 埘: "塒", 埙: "塤", 埚: "堝", 埯: "垵", 堑: "塹", 堕: "墮",
    墙: "牆", 壮: "壯", 声: "聲", 壳: "殼", 壶: "壺", 处: "處", 备: "備", 复: "複", 头: "頭", 夹: "夾",
    夺: "奪", 奁: "奩", 奂: "奐", 奋: "奮", 奖: "獎", 奥: "奧", 妆: "妝", 妇: "婦", 妈: "媽", 妩: "嫵",
    妪: "嫗", 妫: "媯", 姗: "姍", 姹: "奼", 娄: "婁", 娅: "婭", 娆: "嬈", 娇: "嬌", 娈: "孌", 娱: "娛",
    娲: "媧", 娴: "嫻", 婳: "嫿", 婴: "嬰", 婵: "嬋", 婶: "嬸", 媪: "媼", 嫒: "嬡", 嫔: "嬪", 嫱: "嬙",
    嬷: "嬤", 孙: "孫", 学: "學", 孪: "孿", 宁: "寧", 宝: "寶", 实: "實", 宠: "寵", 审: "審", 宪: "憲",
    宫: "宮", 宽: "寬", 宾: "賓", 寝: "寢", 对: "對", 寻: "尋", 导: "導", 寿: "壽", 将: "將", 尔: "爾",
    尘: "塵", 尝: "嘗", 尧: "堯", 尴: "尷", 尽: "盡", 层: "層", 屉: "屜", 届: "屆", 属: "屬", 屡: "屢",
    屦: "屨", 岁: "歲", 岂: "豈", 岖: "嶇", 岗: "崗", 岘: "峴", 岚: "嵐", 岛: "島", 岭: "嶺", 岳: "嶽",
    岿: "巋", 峃: "嶨", 峄: "嶧", 峡: "峽", 峣: "嶢", 峤: "嶠", 峥: "崢", 峦: "巒", 崂: "嶗", 崃: "崍",
    崄: "嶮", 崭: "嶄", 嵘: "嶸", 嵚: "嶔", 嵝: "嶁", 巅: "巔", 巩: "鞏", 巯: "巰", 币: "幣", 帅: "帥",
    师: "師", 帐: "帳", 带: "帶", 帧: "幀", 帮: "幫", 帱: "幬", 帻: "幘", 帼: "幗", 幂: "冪", 干: "乾",
    并: "並", 广: "廣", 庄: "莊", 庆: "慶", 庐: "廬", 庑: "廡", 库: "庫", 应: "應", 庙: "廟", 庞: "龐",
    废: "廢", 开: "開", 异: "異", 弃: "棄", 张: "張", 弥: "彌", 弪: "弳", 弯: "彎", 弹: "彈", 强: "強",
    归: "歸", 当: "當", 录: "錄", 彦: "彥", 彻: "徹", 径: "徑", 徕: "徠", 御: "禦", 忆: "憶", 忏: "懺",
    志: "誌", 忧: "憂", 忾: "愾", 怀: "懷", 态: "態", 怂: "慫", 怃: "憮", 怄: "慪", 怅: "悵", 怆: "愴",
    怜: "憐", 总: "總", 怼: "懟", 恋: "戀", 恳: "懇", 恶: "惡", 恸: "慟", 恹: "懨", 恺: "愷", 恻: "惻",
    恼: "惱", 恽: "惲", 悦: "悅", 悫: "愨", 悬: "懸", 悭: "慳", 悮: "誤", 悯: "憫", 惊: "驚", 惧: "懼",
    惨: "慘", 惩: "懲", 惫: "憊", 惬: "愜", 惭: "慚", 惮: "憚", 惯: "慣", 愠: "慍", 愤: "憤", 愦: "憒",
    愿: "願", 慑: "懾", 慭: "憖", 懑: "懣", 懒: "懶", 懔: "懍", 戆: "戇", 戋: "戔", 戏: "戲", 戗: "戧",
    战: "戰", 戬: "戩", 户: "戶", 扑: "撲", 执: "執", 扩: "擴", 扪: "捫", 扫: "掃", 扬: "揚", 扰: "擾",
    抚: "撫", 抛: "拋", 抟: "摶", 抠: "摳", 抡: "掄", 抢: "搶", 护: "護", 报: "報", 担: "擔", 拟: "擬",
    拢: "攏", 拣: "揀", 拥: "擁", 拦: "攔", 拧: "擰", 拨: "撥", 择: "擇", 挂: "掛", 挚: "摯", 挛: "攣",
    挜: "掗", 挝: "撾", 挞: "撻", 挟: "挾", 挠: "撓", 挡: "擋", 挢: "撟", 挣: "掙", 挤: "擠", 挥: "揮",
    挦: "撏", 挽: "輓", 捞: "撈", 损: "損", 捡: "撿", 换: "換", 捣: "搗", 据: "據", 掳: "擄", 掴: "摑",
    掷: "擲", 掸: "撣", 掺: "摻", 掼: "摜", 揽: "攬", 揿: "撳", 搀: "攙", 搁: "擱", 搂: "摟", 搅: "攪",
    携: "攜", 摄: "攝", 摅: "攄", 摆: "擺", 摇: "搖", 摈: "擯", 摊: "攤", 撄: "攖", 撑: "撐", 撵: "攆",
    撷: "擷",撸:"擼", 撺: "攛", 擞: "擻", 攒: "攢", 敌: "敵", 敛: "斂", 数: "數", 斋: "齋", 斓: "斕",
    斗: "鬥", 斩: "斬", 断: "斷", 无: "無", 旧: "舊", 时: "時", 旷: "曠", 昙: "曇", 昼: "晝", 显: "顯",
    晋: "晉", 晒: "曬", 晓: "曉", 晔: "曄", 晕: "暈", 晖: "暉", 暂: "暫", 暧: "曖", 术: "術", 朴: "樸",
    机: "機", 杀: "殺", 杂: "雜", 权: "權", 条: "條", 来: "來", 杨: "楊", 杩: "榪", 杰: "傑", 极: "極",
    构: "構", 枞: "樅", 枢: "樞", 枣: "棗", 枥: "櫪", 枧: "梘", 枨: "棖", 枪: "槍", 枫: "楓", 枭: "梟",
    柜: "櫃", 栀: "梔", 栅: "柵", 标: "標", 栈: "棧", 栉: "櫛", 栊: "櫳", 栋: "棟", 栌: "櫨", 栎: "櫟",
    栏: "欄", 树: "樹", 栖: "棲", 样: "樣", 栾: "欒", 桠: "椏", 桡: "橈", 桢: "楨", 档: "檔", 桤: "榿",
    桥: "橋", 桦: "樺", 桧: "檜", 桨: "槳", 桩: "樁", 梦: "夢", 梼: "檮", 梾: "棶", 梿: "槤", 检: "檢",
    棂: "欞", 椁: "槨", 椟: "櫝", 椠: "槧", 椤: "欏", 椭: "橢", 楼: "樓", 榄: "欖", 榅: "榲", 榇: "櫬",
    榈: "櫚", 榉: "櫸", 槚: "檟", 槛: "檻", 槟: "檳", 槠: "櫧", 横: "橫", 樯: "檣", 樱: "櫻", 橥: "櫫",
    橱: "櫥", 橼: "櫞", 檩: "檁", 欢: "歡", 欤: "歟", 欧: "歐", 欲: "欲", 歼: "殲", 殁: "歿", 殇: "殤",
    残: "殘", 殒: "殞", 殓: "殮", 殚: "殫", 殡: "殯", 殴: "毆", 毁: "毀", 毂: "轂", 毕: "畢", 毙: "斃",
    毡: "氈", 气: "氣", 氢: "氫", 氩: "氬", 氲: "氳", 汇: "匯", 汉: "漢", 汤: "湯", 汹: "洶", 沟: "溝",
    没: "沒", 沣: "灃", 沤: "漚", 沥: "瀝", 沦: "淪", 沧: "滄", 沨: "渢", 沩: "溈", 沪: "滬", 泞: "濘",
    泪: "淚", 泶: "澩", 泷: "瀧", 泸: "瀘", 泺: "濼", 泻: "瀉", 泼: "潑", 泽: "澤", 泾: "涇", 洁: "潔",
    洒: "灑", 洼: "窪", 浅: "淺", 浆: "漿", 浇: "澆", 浈: "湞", 浊: "濁", 测: "測", 浍: "澮", 济: "濟",
    浏: "瀏", 浐: "滻", 浑: "渾", 浒: "滸", 浓: "濃", 浔: "潯", 涛: "濤", 涝: "澇", 涞: "淶", 涟: "漣",
    涠: "潿", 涡: "渦", 涣: "渙", 涤: "滌", 润: "潤", 涧: "澗", 涨: "漲", 涩: "澀", 渊: "淵", 渌: "淥",
    渍: "漬", 渎: "瀆", 渐: "漸", 渑: "澠", 渔: "漁", 渖: "瀋", 渗: "滲", 温: "溫", 湾: "灣", 湿: "濕",
    溃: "潰", 溅: "濺", 溆: "漵", 溇: "漊", 滗: "潷", 滚: "滾", 滞: "滯", 滟: "灩", 滠: "灄", 满: "滿",
    滢: "瀅", 滤: "濾", 滥: "濫", 滦: "灤", 滨: "濱", 滩: "灘", 滪: "澦", 漤: "灠", 潆: "瀠", 潇: "瀟",
    潋: "瀲", 潍: "濰", 潜: "潛", 潴: "瀦", 澜: "瀾", 濑: "瀨", 濒: "瀕", 灏: "灝", 灭: "滅", 灯: "燈",
    灵: "靈", 灾: "災", 灿: "燦", 炀: "煬", 炉: "爐", 炖: "燉", 炜: "煒", 炝: "熗", 点: "點", 炼: "煉",
    炽: "熾", 烁: "爍", 烂: "爛", 烃: "烴", 烛: "燭", 烟: "煙", 烦: "煩", 烧: "燒", 烨: "燁", 烩: "燴",
    烫: "燙", 烬: "燼", 热: "熱", 焕: "煥", 焖: "燜", 焘: "燾", 爱: "愛", 爷: "爺", 牍: "牘", 牦: "氂",
    牵: "牽", 牺: "犧", 犊: "犢", 状: "狀", 犷: "獷", 犸: "獁", 犹: "猶", 狈: "狽", 狞: "獰", 独: "獨",
    狭: "狹", 狮: "獅", 狯: "獪", 狰: "猙", 狱: "獄", 狲: "猻", 猃: "獫", 猎: "獵", 猕: "獼", 猡: "玀",
    猪: "豬", 猫: "貓", 猬: "蝟", 献: "獻", 獭: "獺", 玑: "璣", 玙: "璵", 玚: "瑒", 玛: "瑪", 玮: "瑋",
    环: "環", 现: "現", 玱: "瑲", 玺: "璽", 珉: "珉", 珏: "玨", 珐: "琺", 珑: "瓏", 珰: "璫", 珲: "琿",
    琏: "璉", 琐: "瑣", 琼: "瓊", 瑶: "瑤", 瑷: "璦", 璎: "瓔", 瓒: "瓚", 瓯: "甌", 电: "電", 画: "畫",
    畅: "暢", 畴: "疇", 疖: "癤", 疗: "療", 疟: "瘧", 疠: "癘", 疡: "瘍", 疬: "癧", 疭: "瘲", 疮: "瘡",
    疯: "瘋", 疱: "皰", 疴: "痾", 痈: "癰", 痉: "痙", 痒: "癢", 痖: "瘂", 痨: "癆", 痪: "瘓", 痫: "癇",
    瘅: "癉", 瘗: "瘞", 瘘: "瘻", 瘪: "癟", 瘫: "癱", 瘾: "癮", 瘿: "癭", 癞: "癩", 癣: "癬", 癫: "癲",
    皑: "皚", 皱: "皺", 皲: "皸", 盏: "盞", 盐: "鹽", 监: "監", 盖: "蓋", 盗: "盜", 盘: "盤", 着: "著",
    睁: "睜", 睐: "睞", 睑: "瞼", 瞒: "瞞", 瞩: "矚", 矫: "矯", 矶: "磯", 矾: "礬", 矿: "礦", 码: "碼",
    砖: "磚", 砗: "硨", 砚: "硯", 砜: "碸", 砺: "礪", 砻: "礱", 砾: "礫", 础: "礎", 硁: "硜", 硕: "碩",
    硖: "硤", 硗: "磽", 硙: "磑", 硚: "礄", 确: "確", 碍: "礙", 碛: "磧", 碜: "磣", 碱: "鹼", 礼: "禮",
    祢: "禰", 祯: "禎", 祷: "禱", 祸: "禍", 禀: "稟", 禄: "祿", 禅: "禪", 离: "離", 秃: "禿", 秆: "稈",
    种: "種", 积: "積", 称: "稱", 秽: "穢", 税: "稅", 稣: "穌", 稳: "穩", 穷: "窮", 窃: "竊", 窍: "竅",
    窑: "窯", 窜: "竄", 窝: "窩", 窥: "窺", 窦: "竇", 竖: "豎", 竞: "競", 笃: "篤", 笋: "筍", 笔: "筆",
    笕: "筧", 笺: "箋", 笼: "籠", 笾: "籩", 筚: "篳", 筛: "篩", 筜: "簹", 筝: "箏", 筹: "籌", 签: "簽",
    简: "簡", 箓: "籙", 箦: "簀", 箧: "篋", 箨: "籜", 箩: "籮", 箪: "簞", 箫: "簫", 篑: "簣", 篓: "簍",
    篮: "籃", 篱: "籬", 簖: "籪", 籁: "籟", 籴: "糴", 类: "類", 籼: "秈", 粜: "糶", 粝: "糲", 粤: "粵",
    粪: "糞", 粮: "糧", 糁: "糝", 糇: "餱", 糍: "餈", 糕: "糕", 糠: "糠", 紧: "緊", 累: "累", 絷: "縶",
    纟: "糹", 纠: "糾", 纡: "紆", 红: "紅", 纣: "紂", 纤: "纖", 纥: "紇", 约: "約", 级: "級", 纨: "紈",
    纩: "纊", 纪: "紀", 纫: "紉", 纬: "緯", 纭: "紜", 纯: "純", 纰: "紕", 纱: "紗", 纲: "綱", 纳: "納",
    纴: "紝", 纵: "縱", 纶: "綸", 纷: "紛", 纸: "紙", 纹: "紋", 纺: "紡", 纽: "紐", 纾: "紓", 线: "線",
    绀: "紺", 绁: "紲", 绂: "紱", 练: "練", 组: "組", 绅: "紳", 细: "細", 织: "織", 终: "終", 绉: "縐",
    绊: "絆", 绋: "紼", 绌: "絀", 绍: "紹", 绎: "繹", 经: "經", 绐: "紿", 绑: "綁", 绒: "絨", 结: "結",
    绔: "絝", 绕: "繞", 绗: "絎", 绘: "繪", 给: "給", 绚: "絢", 绛: "絳", 络: "絡", 绝: "絕", 绞: "絞",
    统: "統", 绠: "綆", 绡: "綃", 绢: "絹", 绣: "繡", 绥: "綏", 绦: "絛", 继: "繼", 绨: "綈", 绩: "績",
    绪: "緒", 绫: "綾", 续: "續", 绮: "綺", 绯: "緋", 绰: "綽", 绱: "緔", 绲: "緄", 绳: "繩", 维: "維",
    绵: "綿", 绶: "綬", 绷: "繃", 绸: "綢", 绹: "綯", 绺: "綹", 绻: "綣", 综: "綜", 绽: "綻", 绾: "綰",
    绿: "綠", 缀: "綴", 缁: "緇", 缂: "緙", 缃: "緗", 缄: "緘", 缅: "緬", 缆: "纜", 缇: "緹", 缈: "緲",
    缉: "緝", 缊: "縕", 缋: "繢", 缌: "緦", 缍: "綞", 缎: "緞", 缏: "緶", 缐: "線", 缑: "緱", 缒: "縋",
    缓: "緩", 缔: "締", 缕: "縷", 编: "編", 缗: "緡", 缘: "緣", 缙: "縉", 缚: "縛", 缛: "縟", 缜: "縝",
    缝: "縫", 缟: "縞", 缠: "纏", 缡: "縭", 缢: "縊", 缣: "縑", 缤: "繽", 缥: "縹", 缦: "縵", 缧: "縲",
    缨: "纓", 缩: "縮", 缪: "繆", 缫: "繅", 缬: "纈", 缭: "繚", 缮: "繕", 缯: "繒", 缰: "韁", 缱: "繾",
    缲: "繰", 缳: "繯", 缴: "繳", 缵: "纘", 网: "網", 罗: "羅", 罚: "罰", 罢: "罷", 罴: "羆", 羁: "羈",
    羟: "羥", 羡: "羨", 翘: "翹", 耧: "耬", 耸: "聳", 耻: "恥", 聂: "聶", 聋: "聾", 职: "職", 聍: "聹",
    联: "聯", 聩: "聵", 聪: "聰", 肃: "肅", 肠: "腸", 肤: "膚", 肮: "骯", 肴: "餚", 肾: "腎", 肿: "腫",
    胀: "脹", 胁: "脅", 胆: "膽", 胜: "勝", 胧: "朧", 胨: "腖", 胪: "臚", 胫: "脛", 胶: "膠", 脉: "脈",
    脍: "膾", 脏: "臟", 脐: "臍", 脑: "腦", 脓: "膿", 脔: "臠", 脚: "腳", 脱: "脫", 脶: "腡", 脸: "臉",
    腊: "臘", 腌: "醃", 腘: "膕", 腭: "齶", 腻: "膩", 腼: "靦", 腾: "騰", 膑: "臏", 臜: "臢", 舆: "輿",
    舣: "艤", 舰: "艦", 舱: "艙", 艰: "艱", 艳: "艷", 艺: "藝", 节: "節", 芈: "羋", 芗: "薌", 芜: "蕪",
    芦: "蘆", 苁: "蓯", 苇: "葦", 苈: "藶", 苋: "莧", 苌: "萇", 苍: "蒼", 苎: "苧", 苏: "蘇", 苘: "檾",
    范: "範", 茎: "莖", 茏: "蘢", 茑: "蔦", 茔: "塋", 茕: "煢", 茧: "繭", 荆: "荊", 荐: "薦", 荙: "薘",
    荚: "莢", 荛: "蕘", 荜: "蓽", 荞: "蕎", 荟: "薈", 荠: "薺", 荡: "蕩", 荣: "榮", 荤: "葷", 荥: "滎",
    荦: "犖", 荧: "熒", 荨: "蕁", 荩: "藎", 荪: "蓀", 荫: "蔭", 荬: "蕒", 荭: "葒", 荮: "葤", 药: "藥",
    莅: "蒞", 莜: "蓧", 莱: "萊", 莲: "蓮", 莳: "蒔", 莴: "萵", 莶: "薟", 获: "獲", 莸: "蕕", 莹: "瑩",
    莺: "鶯", 莼: "蓴", 萚: "蘀", 萝: "蘿", 萤: "螢", 营: "營", 萦: "縈", 萧: "蕭", 萨: "薩", 葱: "蔥",
    蒇: "蕆", 蒉: "蕢", 蒋: "蔣", 蒌: "蔞", 蓝: "藍", 蓟: "薊", 蓠: "蘺", 蓣: "蕷", 蓥: "鎣", 蓦: "驀",
    蔷: "薔", 蔹: "蘞", 蔺: "藺", 蔼: "藹", 蕲: "蘄", 蕴: "蘊", 薮: "藪", 藓: "蘚", 虏: "虜", 虑: "慮",
    虚: "虛", 虫: "蟲", 虬: "虯", 虮: "蟣", 虽: "雖", 虾: "蝦", 虿: "蠆", 蚀: "蝕", 蚁: "蟻", 蚂: "螞",
    蚕: "蠶", 蛊: "蠱", 蛎: "蠣", 蛏: "蟶", 蛮: "蠻", 蛰: "蟄", 蛱: "蛺", 蛲: "蟯", 蛳: "螄", 蛴: "蠐",
    蜕: "蛻", 蜗: "蝸", 蜡: "蠟", 蝇: "蠅", 蝈: "蟈", 蝉: "蟬", 蝼: "螻", 蝾: "蠑", 螀: "螿", 螨: "蟎",
    蟏: "蠨", 衅: "釁", 衔: "銜", 补: "補", 表: "表", 衬: "襯", 衮: "袞", 袄: "襖", 袅: "裊", 袜: "襪",
    袭: "襲", 袯: "襏", 装: "裝", 裆: "襠", 裢: "褳", 裣: "襝", 裤: "褲", 裥: "襇", 褛: "褸", 褴: "襤",
    襁: "繈", 见: "見", 观: "觀", 规: "規", 觅: "覓", 视: "視", 觇: "覘", 览: "覽", 觉: "覺", 觊: "覬",
    觋: "覡", 觌: "覿", 觎: "覦", 觏: "覯", 觐: "覲", 觑: "覷", 觞: "觴", 触: "觸", 言: "言", 誊: "謄",
    计: "計", 订: "訂", 讣: "訃", 认: "認", 讥: "譏", 讦: "訐", 讧: "訌", 讨: "討", 让: "讓", 讪: "訕",
    讫: "訖", 训: "訓", 议: "議", 讯: "訊", 记: "記", 讲: "講", 讳: "諱", 讴: "謳", 讵: "詎", 讶: "訝",
    讷: "訥", 许: "許", 讹: "訛", 论: "論", 讼: "訟", 讽: "諷", 设: "設", 访: "訪", 诀: "訣", 证: "證",
    诂: "詁", 诃: "訶", 评: "評", 诅: "詛", 识: "識", 诈: "詐", 诉: "訴", 诊: "診", 诋: "詆", 诌: "謅",
    词: "詞", 诎: "詘", 诏: "詔", 译: "譯", 诒: "詒", 诓: "誆", 诔: "誄", 试: "試", 诖: "詿", 诗: "詩",
    诘: "詰", 诙: "詼", 诚: "誠", 诛: "誅", 诜: "詵", 话: "話", 诞: "誕", 诟: "詬", 诠: "詮", 诡: "詭",
    询: "詢", 诣: "詣", 诤: "諍", 该: "該", 详: "詳", 诧: "詫", 诨: "諢", 诩: "詡", 诫: "誡", 诬: "誣",
    语: "語", 诮: "誚", 误: "誤", 诰: "誥", 诱: "誘", 诲: "誨", 诳: "誑", 说: "說", 诵: "誦", 诶: "誒",
    请: "請", 诸: "諸", 诹: "諏", 诺: "諾", 读: "讀", 诼: "諑", 诽: "誹", 课: "課", 诿: "諉", 谀: "諛",
    谁: "誰", 谂: "諗", 调: "調", 谄: "諂", 谅: "諒", 谆: "諄", 谇: "誶", 谈: "談", 谊: "誼", 谋: "謀",
    谌: "諶", 谍: "諜", 谎: "謊", 谏: "諫", 谐: "諧", 谑: "謔", 谒: "謁", 谓: "謂", 谔: "諤", 谕: "諭",
    谖: "諼", 谗: "讒", 谘: "諮", 谙: "諳", 谚: "諺", 谛: "諦", 谜: "謎", 谝: "諞", 谟: "謨", 谠: "讜",
    谡: "謖", 谢: "謝", 谣: "謠", 谤: "謗", 谥: "諡", 谦: "謙", 谧: "謐", 谨: "謹", 谩: "謾", 谪: "謫",
    谫: "譾", 谬: "謬", 谭: "譚", 谮: "譖", 谯: "譙", 谰: "讕", 谱: "譜", 谲: "譎", 谳: "讞", 谴: "譴",
    谵: "譫", 谶: "讖", 谷: "穀", 豆: "豆", 豮: "豶", 贝: "貝", 贞: "貞", 负: "負", 贡: "貢", 财: "財",
    责: "責", 贤: "賢", 败: "敗", 账: "賬", 货: "貨", 质: "質", 贩: "販", 贪: "貪", 贫: "貧", 贬: "貶",
    购: "購", 贮: "貯", 贯: "貫", 贰: "貳", 贱: "賤", 贲: "賁", 贳: "貰", 贴: "貼", 贵: "貴", 贶: "貺",
    贷: "貸", 贸: "貿", 费: "費", 贺: "賀", 贻: "貽", 贼: "賊", 贽: "贄", 贾: "賈", 贿: "賄", 赀: "貲",
    赁: "賃", 赂: "賂", 赃: "贓", 资: "資", 赅: "賅", 赆: "贐", 赇: "賕", 赈: "賑", 赉: "賚", 赊: "賒",
    赋: "賦", 赌: "賭", 赍: "齎", 赎: "贖", 赏: "賞", 赐: "賜", 赑: "贔", 赒: "賙", 赓: "賡", 赔: "賠",
    赕: "賧", 赖: "賴", 赗: "賵", 赘: "贅", 赙: "賻", 赚: "賺", 赛: "賽", 赜: "賾", 赝: "贗", 赞: "贊",
    赠: "贈", 赡: "贍", 赢: "贏", 赣: "贛", 赵: "趙", 赶: "趕", 趋: "趨", 趱: "趲", 趸: "躉", 跃: "躍",
    跄: "蹌", 跞: "躒", 践: "踐", 跷: "蹺", 跸: "蹕", 跹: "躚", 跻: "躋", 踊: "踴", 踌: "躊", 踪: "蹤",
    踬: "躓", 踯: "躑", 蹑: "躡", 蹒: "蹣", 蹰: "躕", 蹿: "躥", 躏: "躪", 躜: "躦", 车: "車", 轧: "軋",
    轨: "軌", 轩: "軒", 轪: "軑", 轫: "軔", 转: "轉", 轭: "軛", 轮: "輪", 软: "軟", 轰: "轟", 轱: "軲",
    轲: "軻", 轳: "轤", 轴: "軸", 轵: "軹", 轶: "軼", 轷: "軤", 轸: "軫", 轹: "轢", 轺: "軺", 轻: "輕",
    轼: "軾", 载: "載", 轾: "輊", 轿: "轎", 辂: "輅", 较: "較", 辄: "輒", 辅: "輔", 辆: "輛", 辇: "輦",
    辈: "輩", 辉: "輝", 辊: "輥", 辋: "輞", 辍: "輟", 辎: "輜", 辏: "輳", 辐: "輻", 辑: "輯", 输: "輸",
    辔: "轡", 辕: "轅", 辖: "轄", 辗: "輾", 辙: "轍", 辚: "轔", 辞: "辭", 辟: "闢", 辣: "辣", 办: "辦",
    边: "邊", 辽: "遼", 达: "達", 迁: "遷", 过: "過", 迈: "邁", 运: "運", 还: "還", 这: "這", 进: "進",
    远: "遠", 违: "違", 连: "連", 迟: "遲", 迩: "邇", 迳: "逕", 迹: "跡", 适: "適", 选: "選", 逊: "遜",
    递: "遞", 逻: "邏", 遗: "遺", 遥: "遙", 邓: "鄧", 邝: "鄺", 邬: "鄔", 邮: "郵", 邹: "鄒", 邺: "鄴",
    邻: "鄰", 郁: "鬱", 郄: "郤", 郏: "郟", 郐: "鄶", 郑: "鄭", 郓: "鄆", 郦: "酈", 郧: "鄖", 郸: "鄲",
    酝: "醞", 酦: "醱", 酱: "醬", 酽: "釅", 酾: "釃", 酿: "釀", 释: "釋", 里: "裡", 鉴: "鑑", 銮: "鑾",
    钆: "釓", 钇: "釔", 针: "針", 钉: "釘", 钊: "釗", 钋: "釙", 钌: "釕", 钍: "釷", 钎: "釺", 钏: "釧",
    钐: "釤", 钑: "鈒", 钒: "釩", 钓: "釣", 钔: "鍆", 钕: "釹", 钖: "鍚", 钗: "釵", 钘: "鈃", 钙: "鈣",
    钚: "鈈", 钛: "鈦", 钜: "鉅", 钝: "鈍", 钞: "鈔", 钟: "鐘", 钠: "鈉", 钡: "鋇", 钢: "鋼", 钣: "鈑",
    钤: "鈐", 钥: "鑰", 钦: "欽", 钧: "鈞", 钨: "鎢", 钩: "鉤", 钪: "鈧", 钫: "鈁", 钬: "鈥", 钭: "鈄",
    钮: "鈕", 钯: "鈀", 钰: "鈺", 钱: "錢", 钲: "鉦", 钳: "鉗", 钴: "鈷", 钵: "缽", 钶: "鈳", 钷: "鉕",
    钸: "鈽", 钹: "鈸", 钺: "鉞", 钻: "鑽", 钼: "鉬", 钽: "鉭", 钾: "鉀", 钿: "鈿", 铀: "鈾", 铁: "鐵",
    铂: "鉑", 铃: "鈴", 铄: "鑠", 铅: "鉛", 铆: "鉚", 铇: "鉋", 铈: "鈰", 铉: "鉉", 铊: "鉈", 铋: "鉍",
    铌: "鈮", 铍: "鈹", 铎: "鐸", 铏: "鉶", 铐: "銬", 铑: "銠", 铒: "鉺", 铓: "鋩", 铔: "錏", 铕: "銪",
    铖: "鋮", 铗: "鋏", 铘: "鋣", 铙: "鐃", 铚: "銍", 铛: "鐺", 铜: "銅", 铝: "鋁", 铞: "銱", 铟: "銦",
    铠: "鎧", 铡: "鍘", 铢: "銖", 铣: "銑", 铤: "鋌", 铥: "銩", 铦: "銛", 铧: "鏵", 铨: "銓", 铩: "鎩",
    铪: "鉿", 铫: "銚", 铬: "鉻", 铭: "銘", 铮: "錚", 铯: "銫", 铰: "鉸", 铱: "銥", 铲: "鏟", 铳: "銃",
    铴: "鐋", 铵: "銨", 银: "銀", 铷: "銣", 铸: "鑄", 铹: "鐒", 铺: "鋪", 铻: "鋙", 铼: "錸", 铽: "鋱",
    链: "鏈", 铿: "鏗", 销: "銷", 锁: "鎖", 锂: "鋰", 锃: "鋥", 锄: "鋤", 锅: "鍋", 锆: "鋯", 锇: "鋨",
    锈: "鏽", 锉: "銼", 锊: "鋝", 锋: "鋒", 锌: "鋅", 锍: "鋶", 锎: "鐦", 锏: "鐧", 锐: "銳", 锑: "銻",
    锒: "鋃", 锓: "鋟", 锔: "鋦", 锕: "錒", 锖: "錆", 锗: "鍺", 锘: "鍩", 错: "錯", 锚: "錨", 锛: "錛",
    锜: "錡", 锝: "鍀", 锞: "錁", 锟: "錕", 锠: "錩", 锡: "錫", 锢: "錮", 锣: "鑼", 锤: "錘", 锥: "錐",
    锦: "錦", 锧: "鑕", 锨: "鍁", 锩: "錈", 锪: "鍃", 锫: "錇", 锬: "錟", 锭: "錠", 键: "鍵", 锯: "鋸",
    锰: "錳", 锱: "錙", 锲: "鍥", 锳: "鍈", 锴: "鍇", 锵: "鏘", 锶: "鍶", 锷: "鍔", 锸: "鍤", 锹: "鍬",
    锺: "鍾", 锻: "鍛", 锼: "鎪", 锽: "鍠", 锾: "鍰", 锿: "鎄", 镀: "鍍", 镁: "鎂", 镂: "鏤", 镃: "鎡",
    镄: "鐨", 镅: "鎇", 镆: "鏌", 镇: "鎮", 镈: "鎛", 镉: "鎘", 镊: "鑷", 镌: "鐫", 镍: "鎳", 镎: "鎿",
    镏: "鎦", 镐: "鎬", 镑: "鎊", 镒: "鎰", 镓: "鎵", 镔: "鑌", 镕: "鎔", 镖: "鏢", 镗: "鏜", 镘: "鏝",
    镙: "鏍", 镚: "鏰", 镛: "鏞", 镜: "鏡", 镝: "鏑", 镞: "鏃", 镟: "鏇", 镠: "鏐", 镡: "鐔", 镢: "鐝",
    镣: "鐐", 镤: "鏷", 镥: "鑥", 镦: "鐓", 镧: "鑭", 镨: "鐠", 镩: "鑹", 镪: "鏹", 镫: "鐙", 镬: "鑊",
    镭: "鐳", 镮: "鐶", 镯: "鐲", 镰: "鐮", 镱: "鐿", 镲: "鑔", 镳: "鑣", 镴: "鑞", 长: "長", 门: "門",
    闩: "閂", 闪: "閃", 闫: "閆", 闭: "閉", 问: "問", 闯: "闖", 闰: "閏", 闱: "闈", 闲: "閒", 闳: "閎",
    间: "間", 闵: "閔", 闶: "閌", 闷: "悶", 闸: "閘", 闹: "鬧", 闺: "閨", 闻: "聞", 闼: "闥", 闽: "閩",
    闾: "閭", 阀: "閥", 阁: "閣", 阂: "閡", 阃: "閫", 阄: "鬮", 阅: "閱", 阆: "閬", 阇: "闍", 阈: "閾",
    阉: "閹", 阊: "閶", 阋: "鬩", 阌: "閿", 阍: "閽", 阎: "閻", 阏: "閼", 阐: "闡", 阑: "闌", 阒: "闃",
    阔: "闊", 阕: "闋", 阖: "闔", 阗: "闐", 阙: "闕", 阚: "闞", 队: "隊", 阳: "陽", 阴: "陰", 阵: "陣",
    阶: "階", 际: "際", 陆: "陸", 陈: "陳", 陉: "陘", 陕: "陝", 陧: "隉", 陨: "隕", 险: "險", 随: "隨",
    隐: "隱", 隶: "隸", 难: "難", 雏: "雛", 雠: "讎", 雳: "靂", 雾: "霧", 霁: "霽", 霉: "黴", 霭: "靄",
    靓: "靚", 静: "靜", 面: "麵", 靥: "靨", 鞑: "韃", 鞒: "鞽", 鞯: "韉", 韦: "韋", 韧: "韌", 韩: "韓",
    韪: "韙", 韫: "韞", 韬: "韜", 韵: "韻", 页: "頁", 顶: "頂", 顷: "頃", 项: "項", 顺: "順", 须: "須",
    顼: "頊", 顽: "頑", 顾: "顧", 顿: "頓", 颀: "頎", 颁: "頒", 颂: "頌", 颃: "頏", 预: "預", 颅: "顱",
    领: "領", 颇: "頗", 颈: "頸", 颉: "頡", 颊: "頰", 颌: "頜", 颍: "潁", 颎: "熲", 颏: "頦", 颐: "頤",
    频: "頻", 颓: "頹", 颔: "頷", 颖: "穎", 颗: "顆", 题: "題", 额: "額", 颚: "顎", 颛: "顓", 颜: "顏",
    额: "額", 颞: "顳", 颟: "顢", 颠: "顛", 颡: "顙", 颢: "顥", 颤: "顫", 颥: "顬", 颦: "顰", 颧: "顴",
    风: "風", 飏: "颺", 飐: "颭", 飑: "飆", 飒: "颯", 飓: "颶", 飔: "颸", 飕: "颼", 飖: "颻", 飘: "飄",
    飙: "飆", 飚: "飈", 飞: "飛", 饥: "飢", 饦: "飥", 饧: "餳", 饨: "飩", 饩: "餼", 饪: "飪", 饫: "飫",
    饬: "飭", 饭: "飯", 饮: "飲", 饯: "餞", 饰: "飾", 饱: "飽", 饲: "飼", 饳: "飿", 饴: "飴", 饵: "餌",
    饶: "饒", 饷: "餉", 饸: "餄", 饹: "餎", 饺: "餃", 饻: "餏", 饼: "餅", 饽: "餑", 饿: "餓", 馀: "餘",
    馁: "餒", 馂: "餕", 馃: "餜", 馄: "餛", 馅: "餡", 馆: "館", 馇: "餷", 馈: "饋", 馉: "餶", 馊: "餿",
    馋: "饞", 馌: "饁", 馍: "饃", 馎: "餺", 馏: "餾", 馐: "饈", 馑: "饉", 馒: "饅", 馓: "饊", 馔: "饌",
    馕: "饢", 马: "馬", 驭: "馭", 驮: "馱", 驯: "馴", 驰: "馳", 驱: "驅", 驲: "馹", 驳: "駁", 驴: "驢",
    驵: "駔", 驶: "駛", 驷: "駟", 驸: "駙", 驹: "駒", 驺: "騶", 驻: "駐", 驼: "駝", 驽: "駑", 驾: "駕",
    驿: "驛", 骀: "駘", 骁: "驍", 骂: "罵", 骄: "驕", 骅: "驊", 骆: "駱", 骇: "駭", 骈: "駢", 骊: "驪",
    骋: "騁", 验: "驗", 骏: "駿", 骐: "騏", 骑: "騎", 骒: "騍", 骓: "騅", 骖: "驂", 骗: "騙", 骘: "騭",
    骙: "騤", 骚: "騷", 骛: "騖", 骜: "驁", 骝: "騮", 骞: "騫", 骟: "騸", 骠: "驃", 骡: "騾", 骢: "驄",
    骣: "驏", 骤: "驟", 骥: "驥", 骧: "驤", 骨: "骨", 髅: "髏", 髋: "髖", 髌: "髕", 鬓: "鬢", 魇: "魘",
    鱼: "魚", 鲁: "魯", 鲂: "魴", 鲅: "鮁", 鲆: "鮃", 鲇: "鮎", 鲈: "鱸", 鲋: "鮒", 鲍: "鮑", 鲎: "鱟",
    鲐: "鮐", 鲑: "鮭", 鲒: "鮚", 鲔: "鮪", 鲕: "鮞", 鲚: "鱭", 鲛: "鮫", 鲜: "鮮", 鲞: "鯗", 鲟: "鱘",
    鲠: "鯁", 鲡: "鱺", 鲢: "鰱", 鲣: "鰹", 鲤: "鯉", 鲥: "鰣", 鲦: "鰷", 鲧: "鯀", 鲨: "鯊", 鲩: "鯇",
    鲫: "鯽", 鲭: "鯖", 鲮: "鯪", 鲰: "鯫", 鲱: "鯡", 鲲: "鯤", 鲳: "鯧", 鲴: "鯝", 鲵: "鯢", 鲶: "鯰",
    鲷: "鯛", 鲸: "鯨", 鲺: "鯴", 鲻: "鯔", 鲼: "鱝", 鲽: "鰈", 鲾: "鰏", 鳀: "鯷", 鳁: "鰛", 鳃: "鰓",
    鳄: "鱷", 鳅: "鰍", 鳆: "鰒", 鳇: "鰉", 鳊: "鯿", 鳋: "鰠", 鳌: "鰲", 鳍: "鰭", 鳎: "鰨", 鳏: "鰥",
    鳐: "鰩", 鳓: "鰳", 鳔: "鰾", 鳕: "鱈", 鳖: "鱉", 鳗: "鰻", 鳘: "鰵", 鳙: "鱅", 鳜: "鱖", 鳝: "鱔",
    鳞: "鱗", 鳟: "鱒", 鳢: "鱧", 鸟: "鳥", 鸠: "鳩", 鸡: "雞", 鸢: "鳶", 鸣: "鳴", 鸥: "鷗", 鸦: "鴉",
    鸨: "鴇", 鸩: "鴆", 鸪: "鴣", 鸫: "鶇", 鸬: "鸕", 鸭: "鴨", 鸯: "鴦", 鸱: "鴟", 鸲: "鴝", 鸳: "鴛",
    鸵: "鴕", 鸶: "鷥", 鸷: "鷙", 鸸: "鴯", 鸹: "鴰", 鸺: "鵂", 鸻: "鴴", 鸼: "鵃", 鸽: "鴿", 鸾: "鸞",
    鸿: "鴻", 鹁: "鵓", 鹂: "鸝", 鹃: "鵑", 鹄: "鵠", 鹅: "鵝", 鹆: "鵒", 鹇: "鷳", 鹈: "鵜", 鹉: "鵡",
    鹊: "鵲", 鹋: "鶓", 鹌: "鵪", 鹍: "鵾", 鹎: "鵯", 鹏: "鵬", 鹑: "鶉", 鹕: "鶘", 鹗: "鶚", 鹘: "鶻",
    鹚: "鶿", 鹛: "鶥", 鹜: "鶩", 鹞: "鷂", 鹣: "鶼", 鹤: "鶴", 鹦: "鸚", 鹧: "鷓", 鹨: "鷚", 鹩: "鷯",
    鹪: "鷦", 鹫: "鷲", 鹬: "鷸", 鹭: "鷺", 鹰: "鷹", 鹳: "鸛", 鹾: "鹺", 麦: "麥", 黄: "黃", 黉: "黌",
    黡: "黶", 黩: "黷", 黪: "黲", 黾: "黽", 鼋: "黿", 鼍: "鼉", 鼹: "鼴", 齐: "齊", 齑: "齏", 齿: "齒",
    龀: "齔", 龃: "齟", 龄: "齡", 龅: "齙", 龆: "齠", 龇: "齜", 龈: "齦", 龉: "齬", 龊: "齪", 龋: "齲",
    龌: "齷", 龙: "龍", 龚: "龔", 龛: "龕"
  };
  return text.replace(/[\s\S]/g, (char) => map[char] || char);
}

function generateBlogTranslations() {
  const zhCN = {
    "Research notes for builders, makers, and layout-obsessed planners.": "给建造者、手作爱好者和排版控的研究笔记。",
    "Deeper articles on CutList optimization, QuiltFit planning, stair stringer geometry, and tile layout strategy, with decision metrics for real projects.": "深入文章覆盖 CutList 优化、QuiltFit 规划、楼梯梁几何和瓷砖排版策略，并提供真实项目可用的决策指标。",
    "Sheet optimization and shop workflow.": "板材优化与工坊流程。",
    "Digital quilt planning and fabric decisions.": "数字化拼布规划与布料决策。",
    "Stringer geometry, comfort, and remodel planning.": "楼梯梁几何、舒适度与改造规划。",
    "Tile layout, waste, joints, and wet-area planning.": "瓷砖排版、损耗、美缝与湿区规划。",
    "Existing WoodCutTool guides.": "已有 WoodCutTool 指南。",
    "research briefs": "研究简报",
    "planning disciplines": "规划领域",
    "47 articles": "47 篇文章",
    "45 research briefs": "45 篇研究文章",
    "4 planning disciplines": "4 个规划领域",
    "Core guides": "核心指南",
    "Classic guide": "经典指南",
    "Wood Cutting Calculator Guide": "木材切割计算器指南",
    "Kerf, stock size, grain direction, and waste reduction.": "锯缝、板材尺寸、纹理方向与减少浪费。",
    "How To Optimize Material Layout": "如何优化材料排版",
    "Batching, rotation, offcut preservation, and cleaner layouts.": "批量规划、旋转、余料保留和更清晰的排版。",
    "Updated 2026": "2026 年更新"
  };

  for (const article of articles) {
    const templates = zhSectionTemplates[article.category];
    const title = zhTitle(article);
    zhCN[article.title] = title;
    zhCN[article.description] = zhDescription(article);
    zhCN[article.kicker] = zhKicker(article);
    zhCN[article.readTime] = zhReadTime(article.readTime);
    zhCN[`${article.kicker} · ${article.readTime}`] = `${zhKicker(article)} · ${zhReadTime(article.readTime)}`;
    zhCN[article.category] = zhCategory[article.category] || article.category;

    article.sections.forEach(([heading, body], index) => {
      zhCN[heading] = templates?.headings[index] || heading;
      zhCN[body] = templates?.bodies[index] || body;
    });

    article.checklist.forEach((item, index) => {
      zhCN[item] = templates?.checklist[index] || item;
    });

    const research = researchBriefs[article.slug] || fallbackResearchBrief(article);
    if (research) {
      zhCN[research.question] = `这篇文章关注“${title}”中最容易影响结果的关键问题。`;
      zhCN[research.insight] = zhDescription(article);
      research.metrics.forEach((metric, index) => {
        const labels = {
          CutList: ["板材数量", "浪费比例", "零件准确度", "可复用余料"],
          QuiltFit: ["拼布块数量", "布料余量", "购物清单完成度", "缝制进度"],
          Stairs: ["总高度", "踏步一致性", "总进深", "现场校验"],
          Tile: ["边缘切片", "图案损耗", "对线质量", "施工风险"]
        };
        zhCN[metric] = labels[article.category]?.[index] || metric;
      });
    }
  }

  return {
    "zh-CN": zhCN,
    "zh-TW": Object.fromEntries(Object.entries(zhCN).map(([key, value]) => [key, toTraditional(value)]))
  };
}

function updateExistingHtml() {
  const htmlFiles = [
    "index.html",
    "apps/index.html",
    "apps/cutlist/index.html",
    "apps/quiltfit/index.html",
    "apps/pdfscanner/index.html",
    "apps/receipt/index.html",
    "blog/wood-cutting-calculator-guide/index.html",
    "blog/how-to-optimize-material-layout/index.html",
    "board-foot-calculator/index.html",
    "cut-list-calculator/index.html",
    "cutlist/index.html",
    "legal/cutlist/privacy/index.html",
    "legal/cutlist/support/index.html",
    "legal/quiltfit/privacy/index.html",
    "legal/quiltfit/support/index.html",
    "plywood-cut-calculator/index.html",
    "privacy-policy/index.html",
    "quiltfit/index.html",
    "stair-stringer-calculator/index.html",
    "stringer/index.html",
    "terms-of-service/index.html",
    "tile-calculator/index.html",
    "wood-waste-calculator/index.html"
  ];

  for (const file of htmlFiles) {
    const path = join(root, file);
    let html = readFileSync(path, "utf8");
    html = html.replaceAll("20260619-research-blog", version);
    html = html.replaceAll("20260619-hobby-projects", version);
    html = html.replaceAll("20260619-blog-directory", version);
    html = html.replaceAll("20260619-app-library", version);
    html = html.replaceAll("20260619-blogs", version);
    html = html.replaceAll("20260619-brand-case", version);
    html = html.replaceAll("20260619-app-directory", version);
    html = html.replaceAll("/assets/styles.css\"", `/assets/styles.css?v=${version}"`);
    html = html.replaceAll("/assets/app.js\"", `/assets/app.js?v=${version}"`);
    html = html.replaceAll('<a href="/apps/">Apps</a><a href="/blog/">Blogs</a>', '<a href="/blog/">Blogs</a><a href="/apps/">Apps</a>');
    html = html.replaceAll('<a class="active" href="/apps/">Apps</a><a href="/blog/">Blogs</a>', '<a href="/blog/">Blogs</a><a class="active" href="/apps/">Apps</a>');
    html = html.replace(/<a class="active" href="\/blog\/[^"]+\/">[^<]+<\/a>/g, '<a class="active" href="/blog/">Blogs</a>');
    html = html.replace(/<a href="\/blog\/wood-cutting-calculator-guide\/">Blog<\/a>/g, '<a href="/blog/">Blogs</a>');
    html = html.replace(/<a href="\/#guides">Guides<\/a>/g, '<a href="/blog/">Blogs</a>');
    html = html.replaceAll('<a href="/apps/">Apps</a><a href="/blog/">Blogs</a> /', '<a href="/apps/">Apps</a> /');
    html = html.replaceAll('<a class="active" href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a><a href="/blog/">Blogs</a>', '<a class="active" href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a>');
    html = html.replaceAll('<a href="/apps/">Apps</a><a href="/blog/">Blogs</a><a href="/blog/">Blogs</a>', '<a href="/apps/">Apps</a><a href="/blog/">Blogs</a>');
    writeFileSync(path, html);
  }

  for (const file of ["blog/wood-cutting-calculator-guide/index.html", "blog/how-to-optimize-material-layout/index.html"]) {
    const path = join(root, file);
    let html = readFileSync(path, "utf8");
    html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, header("Blogs"));
    writeFileSync(path, html);
  }
}

mkdirSync(join(root, "blog"), { recursive: true });
writeFileSync(join(root, "assets", "blog-translations.json"), `${JSON.stringify(generateBlogTranslations(), null, 2)}\n`);
writeFileSync(join(root, "blog", "index.html"), blogIndex());

for (const article of articles) {
  const dir = join(root, "blog", article.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), articlePage(article));
}

updateExistingHtml();

// RSS 2.0 feed of the most recent blog posts (helps discovery + freshness).
function buildRssFeed() {
  const site = "https://woodcuttool.com";
  const recent = articles.slice(-40).reverse();
  const now = new Date();
  const items = recent.map((article, i) => {
    // Stagger pubDates so newest posts sort first in readers.
    const d = new Date(now.getTime() - i * 86400000);
    const url = `${site}/blog/${article.slug}/`;
    return `    <item>
      <title>${escapeHtml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeHtml(article.category)}</category>
      <pubDate>${d.toUTCString()}</pubDate>
      <description>${escapeHtml(article.description)}</description>
    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WoodCutTool Blog</title>
    <link>${site}/blog/</link>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical woodworking guides on plywood cutting, cut lists, materials, cabinets, stairs, and tile from WoodCutTool.</description>
    <language>en</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

writeFileSync(join(root, "feed.xml"), buildRssFeed());
