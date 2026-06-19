import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = "20260619-app-details";

const articles = [
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
    ["Apps", "/apps/"],
    ["Blogs", "/blog/"],
    ["Tile", "/tile-calculator/"],
    ["Stringer", "/stringer/"]
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
  return `<a href="/blog/${article.slug}/" data-blog-directory-item data-blog-search="${escapeHtml(searchText.toLowerCase())}">
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
      return `<a href="#${id}"><span>${label}</span><strong>${count}</strong></a>`;
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
        <div class="blog-directory-panel">
          <p class="eyebrow">Directory</p>
          <h2>Find articles faster.</h2>
          <label class="blog-search">
            <span>Search the library</span>
            <input type="search" data-blog-search-input autocomplete="off" placeholder="Search CutList, QuiltFit, stairs, tile...">
          </label>
          <nav class="blog-directory-nav" aria-label="Blog topic shortcuts">
            ${categoryLinks}
            <a href="#core-guides"><span>Guides</span><strong>${oldGuides.length}</strong></a>
          </nav>
          <div class="blog-directory-status" data-blog-search-status>${articles.length + oldGuides.length} articles</div>
          <div class="blog-directory-list" aria-label="Article list">
            ${articles.map(directoryLink).join("\n            ")}
            ${oldGuides.map((guide, index) => `<a href="${guide.href}" data-blog-directory-item data-blog-search="${escapeHtml([guide.title, guide.description, guide.category].join(" ").toLowerCase())}">
              <span>G${index + 1}</span>
              <strong>${escapeHtml(guide.title)}</strong>
              <em>${escapeHtml(guide.category)}</em>
            </a>`).join("\n            ")}
          </div>
          <p class="blog-search-empty" data-blog-search-empty hidden>No matching articles.</p>
        </div>
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
      ${article.sections.map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p></section>`).join("\n      ")}
      <section class="article-checklist">
        <h2>Field Checklist</h2>
        <ul>${article.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
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
    html = html.replace(/<a href="\/apps\/">Apps<\/a>(?!<a[^>]+href="\/blog\/")/g, '<a href="/apps/">Apps</a><a href="/blog/">Blogs</a>');
    html = html.replace(/<a class="active" href="\/apps\/">Apps<\/a>(?!<a[^>]+href="\/blog\/")/g, '<a class="active" href="/apps/">Apps</a><a href="/blog/">Blogs</a>');
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
writeFileSync(join(root, "blog", "index.html"), blogIndex());

for (const article of articles) {
  const dir = join(root, "blog", article.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), articlePage(article));
}

updateExistingHtml();
