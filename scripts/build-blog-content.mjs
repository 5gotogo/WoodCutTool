import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260621-deep-blogs";
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
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><a class="footer-brand" href="/"><span class="brand-mark">W</span><span>WoodCutTool</span></a><nav class="footer-links footer-primary" aria-label="Footer navigation"><a href="/apps/cutlist/">CutList</a><a href="/apps/quiltfit/">QuiltFit</a><a href="/blog/">Blogs</a><a href="/tile-calculator/">Tile</a><a href="/stringer/">Stringer</a></nav></div><div class="footer-bottom"><p class="muted"><span>© 2026 WoodCutTool.</span> <span>All rights reserved.</span></p><nav class="footer-links footer-legal" aria-label="Legal navigation"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-of-service/">Terms of Service</a><a href="/sitemap.xml">Sitemap</a></nav></div></div></footer>`;
}

function head({ title, description, canonical }) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
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
    ["Tile", "tile"]
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
    description: "Research-style articles about CutList optimization, QuiltFit planning, stair stringer design, and tile layout workflows.",
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
            <input type="search" data-blog-search-input autocomplete="off" placeholder="Search CutList, QuiltFit, stairs, tile...">
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
        <h1>Research notes for builders, makers, and layout-obsessed planners.</h1>
        <p class="lead">Deeper articles on CutList optimization, QuiltFit planning, stair stringer geometry, and tile layout strategy, with decision metrics for real projects.</p>
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
          <strong>4</strong><span>planning disciplines</span>
        </div>
      </div>
    </section>

    <section class="blog-strip" aria-label="Blog categories">
      <a href="#cutlist">CutList</a>
      <a href="#quiltfit">QuiltFit</a>
      <a href="#stairs">Stairs</a>
      <a href="#tile">Tile</a>
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
    canonical: `https://woodcuttool.com/blog/${article.slug}/`
  })}
<body>
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
  "quiltfit-fabric-shop-decision-workflow": "在布料店用 QuiltFit 做购买决策"
};

const zhCategory = {
  CutList: "CutList",
  QuiltFit: "QuiltFit",
  Stairs: "楼梯",
  Tile: "瓷砖",
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
