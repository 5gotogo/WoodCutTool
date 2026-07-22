const makeCategory = ({ slug, name, description, stage, baseChecks, links, topics }) => ({
  slug,
  name,
  description,
  stage,
  baseChecks,
  links,
  topics: topics.map(([topicSlug, title, summary, releaseGate, focusChecks]) => ({
    slug: topicSlug,
    title,
    summary,
    releaseGate,
    focusChecks,
  })),
});

export const checklistCategories = [
  makeCategory({
    slug: "planning-measurement",
    name: "Planning & Measurement",
    description: "Freeze dimensions, datums, tolerances, revisions, orientation, and field conditions before material or labor is committed.",
    stage: "before design release, estimating, or cut-list optimization",
    baseChecks: [
      ["Active revision", "Match the drawing, cut list, estimate, and field notes to one named revision and date.", "Every person and downstream file points to the same released revision."],
      ["Measurement source", "Mark each dimension as field measured, manufacturer supplied, design derived, or still provisional.", "No critical dimension is treated as measured when it is only assumed."],
      ["Units and precision", "State the working unit, rounding rule, and measuring-tool resolution beside the project inputs.", "Conversions and rounded values cannot silently change a finished size."],
      ["Change record", "Write who approved the current inputs and which layouts, quantities, labels, or orders must be regenerated after a change.", "The decision trail is complete enough to reproduce the release."],
    ],
    links: [
      ["/learn/cut-list-review-before-cutting-guide/", "Learn the cut-list review workflow", "Learn"],
      ["/templates/", "Start from a project template", "Template"],
      ["/apps/cutlist/", "Save a released plan in CutList", "App"],
    ],
    topics: [
      ["jobsite-measurement-release", "Jobsite Measurement Release Checklist", "Capture the physical envelope, obstructions, access, and reference lines before shop dimensions are released.", "Do not release shop dimensions until two independent checks agree on every controlling field measurement.", [
        ["Room envelope", "Measure width, height, depth, and diagonals at the actual contact planes rather than one convenient point.", "The smallest usable envelope and any taper are recorded."],
        ["Obstructions", "Locate trim, outlets, pipes, vents, switches, doors, windows, and access panels from the chosen datums.", "Every obstruction has a measured keep-out zone."],
        ["Delivery path", "Measure doors, stairs, corners, elevators, and turning space against the largest finished assembly.", "The project has a workable delivery or site-assembly plan."],
      ]],
      ["project-dimension-freeze", "Project Dimension Freeze Checklist", "Turn approved design dimensions into a controlled baseline before estimating, ordering, or cutting begins.", "Do not freeze the design while any finished size, construction choice, or external clearance is unresolved.", [
        ["Finished sizes", "List finished width, height, depth, and thickness for every assembly that controls another part.", "Controlling finished sizes agree across drawings and the cut list."],
        ["Construction method", "Confirm captured versus applied parts, reveals, overlays, grooves, rabbets, and edge treatments.", "Part math matches the approved construction method."],
        ["Open decisions", "Search notes and drawings for TBD, approximate, verify, by others, and allowance language.", "Every open item has an owner and cannot affect released geometry."],
      ]],
      ["cut-list-revision-release", "Cut List Revision Release Checklist", "Release one traceable cut-list revision after design changes without mixing old quantities, labels, or layouts.", "Do not issue a revised list until changed parts, unchanged parts, and downstream outputs have been reconciled.", [
        ["Change set", "Compare the previous and current lists by stable part ID, not row position.", "Added, removed, resized, and quantity-changed parts are explicit."],
        ["Dependent outputs", "Regenerate layouts, material totals, labels, edge schedules, and purchasing groups from the same revision.", "No downstream document still carries superseded values."],
        ["Superseded stock", "Identify already-cut or already-ordered items affected by the revision.", "Reuse, rework, quarantine, and replacement decisions are recorded."],
      ]],
      ["units-datums-orientation", "Units, Datums & Orientation Checklist", "Prevent mirrored parts and conversion errors by declaring one coordinate system, unit convention, and face orientation.", "Do not calculate derived parts until origin, axes, faces, and units are visible on the source document.", [
        ["Datum origin", "Choose the wall, floor, cabinet face, or stock edge from which controlling dimensions are measured.", "Every critical offset traces to one unambiguous origin."],
        ["Face and edge names", "Mark show face, inside face, front, back, top, bottom, left, and right where orientation matters.", "A part cannot be mirrored by reading the list from the opposite face."],
        ["Unit conversion", "Recalculate one known dimension through every inch, millimeter, decimal, or fractional conversion used.", "The round trip returns the released value within the stated precision."],
      ]],
      ["square-level-plumb-survey", "Square, Level & Plumb Survey Checklist", "Record out-of-square, out-of-level, and out-of-plumb conditions before fitting cabinets, built-ins, or panels.", "Do not size fillers or scribes from nominal room dimensions when the surveyed planes are not true.", [
        ["Diagonal check", "Measure both diagonals of each controlling opening or footprint and note where the error accumulates.", "The amount and direction of out-of-square are known."],
        ["Level profile", "Map high and low points along the full cabinet, shelf, or panel run.", "The installation reference uses the controlling high point."],
        ["Plumb profile", "Check walls at front and back contact lines and at multiple heights.", "Scribe, filler, and clearance allowances reflect actual wall lean."],
      ]],
      ["opening-clearance-verification", "Opening & Clearance Verification Checklist", "Verify functional openings against the actual appliance, drawer, door, shelf, and service requirements.", "Do not release adjacent parts until the opening works at worst-case tolerance and full travel.", [
        ["Product envelope", "Use the current manufacturer drawing and the physical product when available, including projections and connectors.", "The opening exceeds the required operating and installation envelope."],
        ["Movement path", "Trace door swing, drawer travel, pull clearance, shelf removal, and nearby traffic through the full motion.", "Nothing collides at full travel or during removal."],
        ["Service access", "Locate water, power, ventilation, fasteners, filters, and future replacement paths.", "Required service points remain reachable after installation."],
      ]],
      ["grain-face-orientation-release", "Grain & Face Orientation Release Checklist", "Lock visible face, grain direction, sequence matching, and rotation permissions before optimization.", "Do not allow automatic rotation until every appearance or strength restriction is encoded per part.", [
        ["Show faces", "Mark the visible face and visible edges for each appearance-critical part.", "The selected sheet face and defect limits match exposure."],
        ["Grain direction", "Specify grain along length, width, matched sequence, or unrestricted for each part group.", "Optimizer rotation settings match the design intent."],
        ["Bookmatch sequence", "Number adjacent doors, fronts, or panels and mark their order on the source sheet.", "The cutting and labeling plan preserves the intended sequence."],
      ]],
      ["mockup-template-approval", "Mockup & Template Approval Checklist", "Use a full-size mockup or physical template to resolve geometry that drawings alone cannot prove.", "Do not transfer a mockup dimension until the template is labeled, oriented, dated, and approved in position.", [
        ["True-scale shape", "Check the template against the actual wall, curve, hardware, reveal, or human reach condition.", "The template contacts and clears exactly where intended."],
        ["Orientation marks", "Label room, assembly, face, top, reference edge, and no-cut zones directly on the template.", "The template cannot be flipped or used at the wrong location."],
        ["Transfer method", "Define whether the template represents finished size, rough size, centerline, or offset.", "The shop can reproduce the approved shape without guessing an allowance."],
      ]],
      ["tolerance-stack-review", "Tolerance Stack Review Checklist", "Add material, joinery, hardware, finish, and installation variation before deciding a critical fit.", "Do not accept a nominal fit unless the worst credible stack still assembles, moves, and looks intentional.", [
        ["Variation sources", "List thickness variation, machining error, glue line, finish build, hardware play, and site movement separately.", "Every meaningful source has a direction and allowance."],
        ["Worst-case stack", "Combine the limits in the direction that creates the tightest and loosest fit.", "Both extremes meet functional and visual requirements."],
        ["Adjustment path", "Identify slots, shims, reveals, scribes, oversize holes, or replaceable parts that absorb variation.", "The assembly has a controlled adjustment instead of forced fit."],
      ]],
      ["final-design-release", "Final Design Release Checklist", "Confirm scope, dimensions, materials, interfaces, and responsibilities before the project enters production.", "Do not mark a design released while any safety, structural, code, service, or client decision remains implicit.", [
        ["Scope boundary", "List included assemblies, excluded work, owner-supplied items, and work by other trades.", "No interface depends on an undocumented assumption."],
        ["Approval evidence", "Collect the signed drawing, selected sample, hardware schedule, finish choice, and decision log.", "The released package matches what was approved."],
        ["Production handoff", "Walk the shop through critical datums, unusual parts, mockups, sequence, and stop conditions.", "The team can identify what must be verified before irreversible work."],
      ]],
    ],
  }),
  makeCategory({
    slug: "materials-purchasing",
    name: "Materials & Purchasing",
    description: "Verify usable stock, actual thickness, moisture, appearance, hardware, consumables, quantities, and receiving evidence.",
    stage: "before purchase orders are placed or received stock is released to production",
    baseChecks: [
      ["Specification", "Match species, grade, core, thickness, finish, color, and manufacturer requirements to the released project.", "The purchase description is specific enough to prevent an unapproved substitution."],
      ["Usable size", "Distinguish nominal dimensions from measured usable dimensions after damage, trim, defects, and squaring.", "The material plan fits the smallest accepted usable stock."],
      ["Quantity basis", "Reconcile optimized need, yield assumption, defect allowance, setup pieces, and spare policy.", "Ordered quantity has an explicit and reproducible basis."],
      ["Receiving record", "Record supplier, lot, date, measured condition, defects, and disposition before stock is mixed.", "Accepted, returned, quarantined, and conditional material are visibly separated."],
    ],
    links: [
      ["/material-library/", "Compare material properties", "Reference"],
      ["/learn/plywood/", "Plan plywood selection and yield", "Learn"],
      ["/wood-waste-calculator/", "Estimate waste allowance", "Calculator"],
    ],
    topics: [
      ["plywood-order-release", "Plywood Order Release Checklist", "Order sheet goods by verified grade, core, face, thickness, usable format, grain, and yield assumptions.", "Do not place the order until each material group maps to a released set of parts and a usable sheet size.", [
        ["Panel specification", "Write veneer species, face grade, back grade, core, certification, and prefinish requirement.", "Supplier acknowledgement matches the complete specification."],
        ["Sheet format", "Confirm actual length, width, thickness, grain direction, and mill trim with the supplier.", "The optimized layout fits the confirmed usable format."],
        ["Lot consistency", "Define whether visible panels must come from one lot or sequence.", "The order and receiving plan preserve required color and grain continuity."],
      ]],
      ["lumber-order-release", "Lumber Order Release Checklist", "Buy rough or surfaced lumber from a board-foot plan that includes finished sizes, defects, grain, moisture, and milling loss.", "Do not order from finished volume alone; release only after rough-size and yield assumptions are explicit.", [
        ["Rough dimensions", "Convert finished parts into required rough thickness, width, length, and quantity before calculating board feet.", "Every finished part has enough milling and crosscut allowance."],
        ["Grade and cut", "Specify grade, species, flat/rift/quarter preference, sapwood limits, and matching needs.", "The material description matches visible and structural use."],
        ["Length mix", "Group parts by required clear length and compare them with available board lengths.", "Long clear parts are not assumed to come from short or defective stock."],
      ]],
      ["sheet-usability-receiving", "Sheet Usability Receiving Checklist", "Inspect sheet goods for damage, bow, thickness, face defects, and usable trim before accepting them into inventory.", "Do not mark a sheet available until defects and the true rectangular usable area are recorded.", [
        ["Flatness and damage", "Sight and measure bow, twist, edge crush, delamination, water damage, and handling marks.", "The sheet can be safely supported and yields required part sizes."],
        ["Face map", "Mark defects, patches, color shifts, and protected show areas on both faces.", "Appearance-critical parts can be assigned without hiding defects in the layout."],
        ["Usable rectangle", "Square or model damaged edges and record the remaining length and width.", "The inventory size reflects usable material rather than the printed label."],
      ]],
      ["material-thickness-verification", "Material Thickness Verification Checklist", "Measure real panel, lumber, banding, and finish thickness before joinery and hardware dimensions are fixed.", "Do not machine grooves, drawer parts, or overlays from a nominal thickness that has not been sampled.", [
        ["Sample plan", "Measure multiple pieces, sheets, edges, and center zones with a suitable tool.", "The recorded range represents the material lot, not one favorable point."],
        ["Joinery impact", "Recalculate grooves, rabbets, tenons, reveals, and captured-panel sizes using the controlling thickness.", "The joint has the intended fit across the measured range."],
        ["Hardware impact", "Check hinge plates, slide clearances, fastener length, and edge treatment against actual build-up.", "Hardware installs without breakthrough, binding, or lost adjustment."],
      ]],
      ["moisture-acclimation-release", "Moisture & Acclimation Release Checklist", "Hold solid wood and moisture-sensitive panels until storage conditions and moisture readings support machining and assembly.", "Do not release unstable stock simply because the schedule needs it; document equilibrium evidence first.", [
        ["Environment", "Record storage and installation temperature, relative humidity, airflow, and exposure history.", "Material is stored flat and protected in conditions reasonably close to service."],
        ["Moisture readings", "Take calibrated readings from multiple boards, faces, and depths appropriate to the meter and species.", "The spread is stable enough for the intended construction and environment."],
        ["Movement allowance", "Review grain direction, panel width, fastening, gaps, and finish schedule for seasonal movement.", "The design allows predictable movement instead of restraining it."],
      ]],
      ["hardware-order-release", "Hardware Order Release Checklist", "Order hinges, slides, lifts, pulls, fasteners, and accessories from current product data and tested clearances.", "Do not buy the full quantity until one representative hardware set is compatible with the construction.", [
        ["Exact model", "Record manufacturer, model, finish, hand, length, load class, overlay, and accessory kit.", "The order cannot be filled with a similar but incompatible version."],
        ["Boring and clearance", "Check drilling pattern, setbacks, box dimensions, door thickness, travel, and adjustment range.", "One test installation reaches full function with adjustment remaining."],
        ["Complete kit", "Count plates, clips, brackets, screws, covers, spacers, locks, and templates as separate line items.", "Every opening has a complete installation set plus the approved spare allowance."],
      ]],
      ["finish-supplies-order", "Finish Supplies Order Checklist", "Plan coating, thinner, catalyst, abrasives, applicators, test material, and disposal needs as one compatible system.", "Do not order a finish system until product data, sample approval, coverage math, and safe-use requirements agree.", [
        ["System compatibility", "Confirm sealer, stain, primer, topcoat, thinner, catalyst, filler, and substrate compatibility from current data sheets.", "Every layer is approved for the preceding and following layer."],
        ["Coverage basis", "Calculate surface area, number of coats, transfer loss, pot life, and sample allowance.", "Quantity covers the released schedule without relying on best-case coverage."],
        ["Safety and disposal", "Identify ventilation, PPE, ignition control, rag storage, waste, and local disposal requirements.", "Required controls are available before material enters the shop."],
      ]],
      ["edge-banding-order", "Edge Banding Order Checklist", "Match edge band species, color, thickness, width, adhesive, grain, and footage to the released part schedule.", "Do not order by panel perimeter alone; release only after exposed edges and process loss are counted.", [
        ["Edge schedule", "Mark which individual edges receive banding and whether they are applied before or after machining.", "Footage traces to named parts and edges."],
        ["Build-up impact", "Confirm band thickness at doors, drawers, shelves, fillers, and hardware interfaces.", "Finished dimensions and reveals include the applied edge."],
        ["Process allowance", "Add setup strips, end trimming, roll remnants, repairs, and approved spare footage.", "The order supports the actual machine or hand-application process."],
      ]],
      ["offcut-inventory-release", "Offcut Inventory Release Checklist", "Classify offcuts by material, usable rectangle, grain, face, condition, and reservation before reusing them in a new layout.", "Do not count an offcut as available until it has a measured usable area and a physical location.", [
        ["Identity", "Label material specification, thickness, grain, show face, source project, and date.", "The offcut cannot be mistaken for a visually similar material."],
        ["Usable geometry", "Square the measured boundary around defects, holes, banding, and damaged edges.", "The inventory dimensions describe a real rectangular cutting area."],
        ["Reservation", "Record assigned project, expiry or review date, rack location, and whether rotation is allowed.", "Two projects cannot promise the same offcut."],
      ]],
      ["purchase-reconciliation", "Purchase Reconciliation Checklist", "Compare purchase orders, deliveries, accepted stock, shortages, substitutions, and the released material plan before cutting.", "Do not close receiving while the shop quantity and approved usable quantity differ.", [
        ["Line-item match", "Compare ordered and delivered description, quantity, unit, lot, and price line by line.", "Every variance has a documented disposition."],
        ["Usable quantity", "Subtract rejected, damaged, quarantined, and conditionally accepted stock from physical count.", "Available inventory covers the released production requirement."],
        ["Plan update", "Update material IDs, lot assignments, costs, layouts, and replacement orders from the receiving result.", "Production documents reflect what is actually available."],
      ]],
    ],
  }),
  makeCategory({
    slug: "cutting-machining",
    name: "Cutting & Machining",
    description: "Prove setup, reference edges, tools, workholding, extraction, first articles, and repeat accuracy before batch machining.",
    stage: "before an irreversible cut or repeated machining operation",
    baseChecks: [
      ["Machine condition", "Inspect guards, blade or cutter condition, alignment, power, extraction, and manufacturer-required setup.", "The machine is safe, stable, and appropriate for the operation."],
      ["Reference system", "Mark the face, edge, fence, stop, datum, and feed direction used to locate the cut.", "Every part in the batch uses the same controlled references."],
      ["First article", "Machine one representative part and measure it with the same method used at final inspection.", "Dimension, square, orientation, edge quality, and downstream fit all pass."],
      ["Batch control", "Set a recheck frequency and stop rule for drift, damage, setup movement, or label mismatch.", "The batch cannot continue beyond a failed check without correction and a new first article."],
    ],
    links: [
      ["/kerf-calculator/", "Verify saw kerf", "Calculator"],
      ["/learn/saw-kerf-explained/", "Understand kerf and cut references", "Learn"],
      ["/troubleshooting/", "Diagnose cutting problems", "Troubleshooting"],
    ],
    topics: [
      ["saw-preflight", "Saw Preflight Checklist", "Inspect the saw, blade, support, extraction, references, and test material before the first project cut.", "Do not start cutting when a guard, support, blade, fence, extraction, or safe feed issue is unresolved.", [
        ["Blade selection", "Match blade diameter, tooth geometry, kerf, condition, rotation, and material to the saw instructions.", "The installed blade is sound and intended for the stock and cut."],
        ["Stock support", "Support the full piece and both sides of the cut without trapping the blade or allowing an uncontrolled fall.", "The planned cut stays stable from start through separation."],
        ["Test cut", "Use representative scrap to check actual kerf, square, tearout, burning, and feed behavior.", "The measured test result matches the released process."],
      ]],
      ["first-article-cut-release", "First-Article Cut Release Checklist", "Approve one completely inspected part before applying a setup to repeated or expensive stock.", "Do not batch a part because one dimension passed; release only after every downstream-critical feature is verified.", [
        ["Complete inspection", "Check finished dimensions, diagonals, face, grain, labels, edge quality, and feature locations.", "The part matches the drawing and can be identified without inference."],
        ["Downstream fit", "Test the part with mating pieces, hardware, grooves, or installation references where practical.", "The part performs its actual role, not only a bench measurement."],
        ["Setup lock", "Record fence, stop, tool, program, offset, feed, and measurement method after approval.", "The released setup can be maintained and independently checked."],
      ]],
      ["batch-rip-release", "Batch Rip-Cut Release Checklist", "Control reference edges, fence setup, stock support, labels, and drift during repeated rip cuts.", "Do not continue a rip batch after reference damage, fence movement, burning, or width drift appears.", [
        ["Reference edge", "Confirm the edge against the fence is straight, sound, and consistently identified.", "Every rip begins from a valid reference rather than accumulating error."],
        ["Fence verification", "Measure fence-to-blade relationship using the intended cut side and account for actual kerf.", "The first strip reaches finished or planned oversize width."],
        ["Drift sample", "Measure the beginning, middle, and end of selected strips at the defined batch interval.", "Width and parallelism stay inside the project tolerance."],
      ]],
      ["crosscut-release", "Crosscut Release Checklist", "Verify square, stop position, support, grain exit, and part identification before repeated crosscuts.", "Do not trust a stop block until a measured first article and a later drift sample both pass.", [
        ["Square reference", "Check fence-to-blade square and confirm the stock edge contacting the fence is valid.", "The cut is square across the full workpiece width."],
        ["Stop strategy", "Place the stop so offcuts cannot bind and the measured face consistently contacts the reference.", "Repeated length is controlled without trapping stock."],
        ["Exit support", "Support long or heavy pieces and choose the show-face orientation for acceptable tearout.", "The part stays registered and the critical face meets edge-quality requirements."],
      ]],
      ["track-saw-sheet-breakdown", "Track-Saw Sheet Breakdown Checklist", "Plan rail position, support, splinter control, cut order, and safe body position for breaking down sheet goods.", "Do not plunge or start a cut until the rail, stock, blade path, support, and power path are controlled.", [
        ["Rail datum", "Mark the kept side, align the splinter strip to the true line, and verify the rail cannot move.", "The blade removes waste on the intended side of the mark."],
        ["Sheet support", "Use a stable surface that supports both pieces and permits full-depth cutting without hazards below.", "Neither piece closes the kerf, tips, or drops during the cut."],
        ["Cut sequence", "Choose a sequence that preserves reference edges, manageable piece sizes, labels, and grain orientation.", "Each remaining panel can still be safely referenced and identified."],
      ]],
      ["table-saw-setup-release", "Table-Saw Setup Release Checklist", "Release a table-saw operation after verifying blade, fence, insert, support, kickback controls, and test results.", "Do not cut stock that cannot stay registered or be fed using the saw manufacturer's safe procedure.", [
        ["Alignment", "Check fence and blade relationship, blade height, throat insert, and applicable riving or guarding components.", "The setup is aligned and uses required safety equipment."],
        ["Feed plan", "Plan hand position, push devices, infeed, outfeed, and where each piece will move after separation.", "The operator can complete the cut without reaching into the hazard area."],
        ["Cut quality", "Test for size, parallelism, burning, chatter, and edge damage on representative stock.", "The process meets both dimension and surface requirements."],
      ]],
      ["router-operation-release", "Router Operation Release Checklist", "Confirm cutter, speed, depth, direction, workholding, climb-cut limits, and staged passes before routing.", "Do not begin when cutter engagement, workholding, or feed direction could pull the work out of control.", [
        ["Cutter setup", "Match cutter type, shank engagement, speed range, rotation, and condition to tool and material instructions.", "The cutter is secure and operated within its rated setup."],
        ["Pass strategy", "Set staged depth, feed direction, entry, exit, and any backing or sacrificial support.", "No single pass removes more material than the controlled process allows."],
        ["Template and bearing", "Inspect templates, guide bushings, bearings, offsets, screws, and no-cut zones.", "The guide system cannot shift or expose a hidden fastener."],
      ]],
      ["drilling-boring-release", "Drilling & Boring Release Checklist", "Verify bit, depth, centerline, face orientation, breakout control, and hole pattern before repeated drilling.", "Do not drill the batch until the first pattern is checked with the actual hardware or mating part.", [
        ["Pattern datum", "Locate holes from stable edges or a verified jig and mark the correct face and hand.", "Left, right, inside, and outside parts cannot be confused."],
        ["Depth control", "Set stops from measured material thickness and include the point geometry of the bit.", "The hole reaches required depth without breakthrough or a weak skin."],
        ["Hardware trial", "Install the actual insert, screw, dowel, hinge, or connector in the first article.", "Fit, pull, alignment, and remaining wall thickness are acceptable."],
      ]],
      ["dado-rabbet-groove-release", "Dado, Rabbet & Groove Release Checklist", "Match groove width, depth, offset, actual material thickness, and assembly sequence before machining captured joints.", "Do not run all panels until a mating offcut and one full joint prove the fit.", [
        ["Actual fit", "Cut a test groove and fit material from the production lot at multiple sample points.", "The joint seats fully without splitting, crushing, or uncontrolled looseness."],
        ["Offset", "Measure the groove from the designated face and include edge band, back, or reveal build-up.", "The assembled face and interior dimensions match the design."],
        ["Stopped features", "Mark start, stop, plunge, and exit points and confirm they remain hidden or structurally sound.", "No groove breaks into an exposed edge or hardware zone."],
      ]],
      ["cnc-job-release", "CNC Job Release Checklist", "Release a CNC sheet after validating program revision, origin, stock, hold-down, tools, simulation, and first-piece inspection.", "Do not press cycle start until program, material, origin, and physical setup are independently matched.", [
        ["Program identity", "Match file name, revision, units, postprocessor, sheet map, and machine to the released job traveler.", "The controller is loaded with the intended verified program."],
        ["Hold-down and clearance", "Check vacuum zones, clamps, tabs, spoilboard, tool path, fixtures, and machine travel.", "Nothing can move or collide throughout the full path."],
        ["Simulation and dry run", "Review cut order, depths, lead-ins, tool changes, and remaining skin before using project stock.", "The simulated result matches geometry and a controlled first run passes inspection."],
      ]],
    ],
  }),
  makeCategory({
    slug: "assembly-joinery",
    name: "Assembly & Joinery",
    description: "Control dry fit, joint preparation, glue, fasteners, clamping, square, sequence, and first-assembly evidence.",
    stage: "before glue, permanent fasteners, or a repeated assembly run",
    baseChecks: [
      ["Part identity", "Match IDs, hand, face, edge, grain, and revision before parts enter the assembly area.", "Every part belongs to the same released assembly and orientation."],
      ["Joint preparation", "Inspect mating surfaces, machining, dust, damage, finish restrictions, and required relief.", "Each joint can close fully without force masking an error."],
      ["Sequence and access", "Rehearse the order, clamps, cauls, drivers, cleanup, and hardware access before adhesive or permanent fasteners.", "The complete sequence fits the available open time and physical access."],
      ["Release inspection", "Check diagonals, dimensions, twist, reveals, movement, and labels before the assembly leaves the fixture.", "The assembly meets its downstream installation and finishing requirements."],
    ],
    links: [
      ["/screw-size-finder/", "Check practical screw sizing", "Tool"],
      ["/learn/woodworking/", "Learn woodworking assembly methods", "Learn"],
      ["/troubleshooting/cabinet-box-not-square/", "Diagnose an out-of-square cabinet", "Troubleshooting"],
    ],
    topics: [
      ["dry-fit-release", "Dry-Fit Release Checklist", "Use a complete dry fit to prove part identity, joint closure, square, hardware space, and assembly sequence.", "Do not apply glue because individual joints fit; release only after the whole assembly closes and can be measured.", [
        ["Complete part set", "Lay out every component, loose panel, divider, back, stretcher, and hardware-dependent spacer.", "No missing or duplicated part is hidden by a partial fit."],
        ["Joint closure", "Seat joints using normal assembly force and inspect shoulders, bottoms, gaps, and trapped debris.", "Every joint reaches its intended stop without crushing or forcing."],
        ["Whole-assembly geometry", "Measure exterior size, openings, diagonals, twist, and mating interfaces while dry.", "The assembly is adjustable into its released geometry."],
      ]],
      ["glue-up-release", "Glue-Up Release Checklist", "Prepare adhesive, parts, clamps, cauls, timing, cleanup, and measurement before the irreversible glue-up starts.", "Do not mix or apply adhesive until the dry run fits inside the working time with all tools staged.", [
        ["Adhesive system", "Confirm product, substrate compatibility, temperature, open time, clamp time, cure, and safe-use instructions.", "The selected adhesive and environment meet current product requirements."],
        ["Clamp plan", "Place clamps and cauls in the dry run and check pressure direction, access, and distortion risk.", "Pressure closes joints without bowing, racking, or damaging show faces."],
        ["Cleanup plan", "Protect surfaces and stage scrapers, water or solvent only as permitted, and waste containers.", "Squeeze-out can be controlled without contaminating finish surfaces."],
      ]],
      ["pocket-hole-assembly", "Pocket-Hole Assembly Checklist", "Verify stock thickness, screw type, jig setup, orientation, clamp control, and edge distance before pocket-hole assembly.", "Do not drive project parts until a test joint proves screw length and clamping do not shift or pierce the face.", [
        ["Jig setting", "Set drill guide, stop collar, and screw selection from measured stock thickness and manufacturer instructions.", "The test screw holds without breakthrough or a weak joint."],
        ["Hole orientation", "Place pockets on permitted hidden faces with adequate edge and end distance.", "The drilling pattern avoids show faces, hardware, grooves, and fragile edges."],
        ["Assembly restraint", "Clamp the joint against a square reference before driving and observe shift during tightening.", "The joint remains flush, aligned, and square at final torque."],
      ]],
      ["dowel-domino-joinery", "Dowel & Loose-Tenon Joinery Checklist", "Control reference faces, registration, cutter settings, plunge depth, spacing, and fit before repeating dowel or loose-tenon joints.", "Do not machine the set until matched test pieces prove alignment, depth, and adhesive space.", [
        ["Reference marks", "Mark mating faces, edges, joint numbers, and machine registration side on both parts.", "Both mortises or holes are referenced from the intended finished faces."],
        ["Depth and width", "Test plunge depth, tenon length, glue space, lateral setting, and remaining wall thickness.", "The joint closes fully without bottoming or weakening the part."],
        ["Repeat alignment", "Assemble a representative corner or panel and measure face flushness and square.", "The process repeats within the project alignment tolerance."],
      ]],
      ["confirmat-screw-assembly", "Confirmat Screw Assembly Checklist", "Verify panel thickness, pilot and clearance drilling, edge location, driver control, and square before confirmat assembly.", "Do not use production panels until test drilling holds straight without splitting, bulging, or stripping.", [
        ["Bore geometry", "Match stepped bit or pilot and clearance sizes, depth, and countersink to the selected screw.", "The head seats correctly and the threads engage the intended panel."],
        ["Edge location", "Center the hole in actual panel thickness and keep required distance from ends and other machining.", "The screw path stays inside sound core material."],
        ["Drive control", "Clamp the joint square and set clutch or torque using representative offcuts.", "The joint closes without stripping, crushing, or moving out of alignment."],
      ]],
      ["cabinet-box-squaring", "Cabinet Box Squaring Checklist", "Square a cabinet from controlled edges and diagonals before the back, stretchers, or glue lock the case.", "Do not fasten the squaring member until exterior size, openings, diagonals, and twist all agree.", [
        ["Edge seating", "Check every joint and divider shoulder for debris, proud edges, gaps, or a part against the wrong reference.", "All joints are fully seated before diagonal correction."],
        ["Diagonal method", "Measure comparable corners with the case supported flat and correct half the difference in a controlled direction.", "Diagonals agree within the project tolerance without distorted sides."],
        ["Back confirmation", "Verify back size, groove engagement, reveal, and corner registration before fastening.", "The back preserves rather than forces the approved square."],
      ]],
      ["drawer-box-assembly", "Drawer Box Assembly Checklist", "Confirm finished box size, slide clearances, square, bottom capture, and front/back orientation before drawer production.", "Do not repeat drawer boxes until one assembled box runs on the actual slide system.", [
        ["Finished envelope", "Measure outside width, height, depth, and diagonals after accounting for joinery and bottom construction.", "The box matches the hardware's required clearances."],
        ["Bottom system", "Check groove width, depth, offset, bottom expansion or fit, and captured versus applied sequence.", "The bottom seats without preventing square or weakening the sides."],
        ["Slide trial", "Mount a representative pair at the planned setback and cycle the loaded box.", "Travel, disconnect, adjustment, and front clearance all work."],
      ]],
      ["face-frame-assembly", "Face Frame Assembly Checklist", "Verify rail and stile identity, openings, square, joint flushness, overhang, and case alignment before attachment.", "Do not attach a face frame until its openings and cabinet registration are checked as one system.", [
        ["Part layout", "Lay rails and stiles in final orientation and mark finished edges, overhangs, and opening dimensions.", "The frame cannot be assembled with a reversed or misplaced member."],
        ["Joint faces", "Dry clamp on a flat reference and inspect flushness, square, twist, and squeeze-out access.", "Show faces align without sanding away critical thickness."],
        ["Case registration", "Place the completed frame on the cabinet and check reveals, fillers, hinges, and adjacent joints.", "Attachment preserves required inside openings and exterior overhang."],
      ]],
      ["clamping-pressure-release", "Clamping Pressure Release Checklist", "Choose clamp type, number, placement, cauls, pressure, and sequence without distorting or starving the joint.", "Do not leave a glue-up under pressure until square, seating, and surface condition are checked.", [
        ["Pressure direction", "Align clamp force through the joint and use cauls or opposing clamps where pressure can bow the assembly.", "Pressure closes the joint without introducing twist or cup."],
        ["Contact protection", "Protect finished or show faces and confirm pads, bars, and cauls cannot stain or dent the work.", "Clamping leaves no unacceptable surface damage."],
        ["Timed recheck", "Recheck joint closure, diagonals, flatness, and squeeze-out immediately and before the adhesive prevents adjustment.", "The assembly remains within geometry limits during cure."],
      ]],
      ["assembly-release", "Final Assembly Release Checklist", "Inspect completed assemblies for geometry, strength, function, finish readiness, labels, and installation interfaces.", "Do not release an assembly that depends on site force, finish build, or hardware adjustment to hide a shop defect.", [
        ["Geometry", "Measure controlling exterior dimensions, openings, diagonals, level surfaces, and twist on a stable reference.", "The assembly fits its released envelope and mating work."],
        ["Function", "Cycle doors, drawers, moving hardware, removable panels, and service access under representative conditions.", "Movement is clear, repeatable, and adjustable."],
        ["Handoff condition", "Inspect edges, glue residue, fasteners, labels, protection points, loose parts, and installation notes.", "The next team receives a complete, identified, damage-free assembly."],
      ]],
    ],
  }),
  makeCategory({
    slug: "cabinets-hardware",
    name: "Cabinets & Hardware",
    description: "Prove overlays, reveals, clearances, boring, movement, loads, service access, and adjustment using actual hardware.",
    stage: "before cabinet parts or hardware patterns are repeated",
    baseChecks: [
      ["Current product data", "Use the exact hardware model's current drawing, template, load, and installation instructions.", "Dimensions and limits trace to the purchased model rather than a generic example."],
      ["Actual construction", "Measure panel, door, front, edge, gap, and finish build-up at the hardware interface.", "The hardware calculation uses real construction dimensions."],
      ["Representative mockup", "Install one complete set on production-equivalent material and cycle it through full travel.", "Fit, adjustment, access, and appearance pass before batch drilling."],
      ["Adjustment reserve", "Center initial settings where practical and record the remaining correction range.", "Installation can absorb expected variation without exceeding adjustment limits."],
    ],
    links: [
      ["/templates/kitchen-cabinet-cut-list/", "Open the kitchen cabinet template", "Template"],
      ["/learn/woodworking-hardware-allowance-guide/", "Plan hardware allowances", "Learn"],
      ["/troubleshooting/cut-list-missing-hardware-clearance/", "Diagnose missing hardware clearance", "Troubleshooting"],
    ],
    topics: [
      ["concealed-hinge-release", "Concealed Hinge Release Checklist", "Verify hinge model, overlay or inset geometry, cup drilling, plate location, collision, adjustment, and quantity.", "Do not batch-drill doors or cases until one installed hinge set proves the full opening path.", [
        ["Door geometry", "Confirm door thickness, overlay or inset gap, edge profile, cup setback, and minimum reveal.", "The selected hinge supports the exact door construction."],
        ["Boring pattern", "Test cup diameter and depth, screw holes, plate height, and hand on representative parts.", "No breakthrough occurs and the closed position matches the design."],
        ["Motion and collision", "Cycle the door beside adjacent fronts, fillers, walls, shelves, pulls, and interior fittings.", "The door reaches required opening without collision or binding."],
      ]],
      ["drawer-slide-release", "Drawer Slide Release Checklist", "Verify slide type, box size, clearances, length, setback, load, disconnect, and mounting before drawer production.", "Do not release drawer width or depth until an actual slide pair works in a representative opening.", [
        ["Box clearance", "Measure opening width and calculate the box from the exact side-mount or undermount requirement.", "Clearance is uniform and within the hardware specification."],
        ["Depth and setback", "Check cabinet depth, slide length, front setback, rear bracket, box back, and obstruction zones.", "The slide fits without blocking the back, front, or services."],
        ["Function test", "Cycle and load the box; verify close, extension, disconnect, locks, and adjustment.", "The installed system works through full travel with reserve adjustment."],
      ]],
      ["door-overlay-reveal", "Cabinet Door Overlay & Reveal Checklist", "Calculate each door from actual openings, hinge capability, edge build-up, adjacent fronts, and required reveals.", "Do not cut a full door set from one nominal formula without checking end, pair, corner, and appliance conditions.", [
        ["Opening map", "Measure each case opening and face-frame member after assembly rather than assuming repeated boxes are identical.", "Door sizes trace to the actual or controlled opening set."],
        ["Reveal network", "Map top, bottom, side, pair, end-panel, filler, and drawer-front gaps across the full elevation.", "Adjacent fronts form intentional and achievable lines."],
        ["Edge build-up", "Include banding, solid edging, profile cuts, finish, and seasonal movement where applicable.", "Finished doors—not raw blanks—meet overlay and gap targets."],
      ]],
      ["drawer-front-reveal", "Drawer Front Reveal Checklist", "Set drawer-front size and position from the complete elevation, adjustment range, pulls, and neighboring doors.", "Do not drill fronts to boxes until the entire reveal pattern can be adjusted and approved.", [
        ["Elevation layout", "Use spacers or a full-size layout to establish shared gaps and endpoints across all fronts.", "The visual grid closes correctly at every edge."],
        ["Attachment method", "Plan temporary alignment, permanent screws, slotting, handle holes, and future adjustment access.", "The front can be positioned without locking in the first rough setting."],
        ["Operational clearance", "Cycle every drawer beside doors, pulls, counters, fillers, and adjacent fronts.", "No pull or front collides through normal use."],
      ]],
      ["shelf-pin-boring", "Shelf Pin Boring Checklist", "Release shelf-pin rows after checking datum, spacing system, front/back offset, depth, hardware, and left/right orientation.", "Do not bore cabinet sides until a paired test panel accepts the actual pin and produces a level shelf.", [
        ["System datum", "Define the first hole and spacing from a finished edge using the chosen metric or imperial system.", "All panels share a compatible and documented hole sequence."],
        ["Front/back position", "Place rows for shelf depth, door hardware, loads, and anti-tip support.", "The shelf sits fully supported without hardware interference."],
        ["Hole quality", "Test diameter, depth, breakout, chip clearance, and pin retention on production material.", "Pins seat consistently without looseness or panel breakthrough."],
      ]],
      ["toe-kick-release", "Toe-Kick Release Checklist", "Verify finished floor, cabinet depth, recess, height, leveling, return, ventilation, and applied skin before cutting toe-kick parts.", "Do not finalize toe-kick skins or returns until the installed cabinet run is level and positioned.", [
        ["Finished-floor datum", "Measure toe-kick height and leveling range from the final floor surface and highest point.", "The cabinet and toe space work across the complete run."],
        ["Depth interfaces", "Check door and drawer clearance, appliance bases, end panels, returns, and recessed lighting or vents.", "The toe-kick line stays continuous without blocking function."],
        ["Field-fit sequence", "Separate shop-cut structural bases from field-scribed skins and removable service panels.", "Parts cut early do not assume a perfectly straight floor or wall."],
      ]],
      ["cabinet-back-release", "Cabinet Back Release Checklist", "Confirm applied or captured back construction, groove position, interior depth, square, hanging loads, and service openings.", "Do not cut backs until the case dimensions and chosen attachment method are verified together.", [
        ["Construction choice", "State back thickness, applied or captured position, groove or rabbet, fasteners, and squaring role.", "Part sizes preserve intended case depth and interior space."],
        ["Mounting zones", "Locate rails, cleats, screws, French cleats, studs, and any no-cut or no-fastener areas.", "The back and hanging system transfer load as designed."],
        ["Openings", "Map outlets, pipes, vents, access, and scribe allowances from the cabinet and site datums.", "Field openings can be made without weakening the required mounting zones."],
      ]],
      ["appliance-opening-release", "Appliance Opening Release Checklist", "Release cabinet openings from current appliance data, physical projections, airflow, services, door swing, trim, and replacement access.", "Do not size the opening from the appliance's advertised width alone.", [
        ["Installation envelope", "Use the complete cutout, ventilation, leveling, trim, handle, hinge, and anti-tip dimensions.", "The opening satisfies the most restrictive current requirement."],
        ["Service routing", "Locate power, water, drain, gas, duct, shutoff, and connection bend radii without occupying required clearance.", "The appliance can connect and slide into place without crushing services."],
        ["Removal path", "Check doors, panels, counters, flooring, fasteners, and adjacent units for future replacement.", "The appliance remains removable without destructive cabinet work."],
      ]],
      ["countertop-support-release", "Countertop Support Release Checklist", "Coordinate cabinet level, spans, overhangs, seams, cutouts, brackets, appliances, and fabricator requirements before templating.", "Do not invite final templating until cabinets are fixed, level, complete, and documented.", [
        ["Support map", "Mark cabinet walls, rails, stretchers, cleats, brackets, unsupported spans, and overhangs.", "Support agrees with material and fabricator requirements."],
        ["Cutout zones", "Coordinate sinks, cooktops, faucets, dispensers, seams, clips, and service clearances.", "No cutout or fastener conflicts with cabinet structure or hardware."],
        ["Template readiness", "Verify cabinet position, fillers, end panels, finished walls, appliance data, and seam decisions.", "The measured condition will not change after templating."],
      ]],
      ["cabinet-hardware-function-test", "Cabinet Hardware Function Test Checklist", "Cycle and load every door, drawer, lift, pullout, latch, and adjustable component before handoff.", "Do not close the hardware punch list until function is proven with adjacent components installed.", [
        ["Full-cycle test", "Open, close, extend, retract, disconnect, latch, and adjust each moving item through its complete range.", "Operation is smooth and repeatable without collision."],
        ["Representative load", "Test shelves, slides, pullouts, and lifts with a safe representative load permitted by the product.", "Deflection and motion remain acceptable."],
        ["Fastener and adjustment", "Inspect seating, torque guidance, thread engagement, slots, cams, covers, and remaining adjustment.", "Hardware is secure and not parked at the end of its adjustment range."],
      ]],
    ],
  }),
  makeCategory({
    slug: "installation-site-work",
    name: "Installation & Site Work",
    description: "Control load-in, datums, anchors, scribing, services, neighboring trades, protection, field changes, and installation release.",
    stage: "before delivery, anchoring, scribing, or irreversible site work",
    baseChecks: [
      ["Site readiness", "Confirm access, finished surfaces, environmental conditions, power, lighting, protection, and other-trade status.", "The work can proceed without predictable damage or blocked access."],
      ["Installation datum", "Transfer and verify the governing level, plumb, centerline, elevation, or wall reference at the work area.", "Every installed component traces to the same checked reference."],
      ["Hidden conditions", "Locate structure, services, membranes, hazards, and no-fastener zones using appropriate records and methods.", "Anchoring and cutting avoid unverified hidden conditions."],
      ["Field-change control", "Record variance, proposed correction, approval, affected parts, and updated documents before alteration.", "A field fix cannot silently change design, safety, function, or future service."],
    ],
    links: [
      ["/learn/cabinet-installation-release-checklist/", "Learn the cabinet installation workflow", "Learn"],
      ["/troubleshooting/base-cabinets-uneven-floor/", "Diagnose an uneven-floor cabinet run", "Troubleshooting"],
      ["/templates/", "Review project templates", "Template"],
    ],
    topics: [
      ["delivery-load-in-release", "Delivery & Load-In Checklist", "Protect finished work and verify access, assembly size, sequencing, staging, weather, labor, and damage records before delivery.", "Do not unload until the route, staging zones, protection, and responsibility for received condition are clear.", [
        ["Route clearance", "Recheck vehicle access, doors, corridors, stairs, elevators, corners, overhead limits, and floor capacity.", "Every package has a safe path to its staging or installation point."],
        ["Package identity", "Match labels, room, elevation, assembly, loose hardware, and revision to the delivery manifest.", "Nothing is installed from an unidentified or superseded package."],
        ["Condition record", "Photograph packaging and product at handoff and record visible damage or shortages immediately.", "Responsibility and disposition are documented before handling continues."],
      ]],
      ["wall-cabinet-installation", "Wall Cabinet Installation Checklist", "Install wall cabinets from a verified level line, structural fastening plan, run layout, fillers, and appliance clearances.", "Do not release a hanging cabinet until the fastening path and supporting structure are verified.", [
        ["Run layout", "Mark cabinet widths, ends, fillers, corners, appliances, and centerlines against the field dimensions.", "The full run closes without stealing required clearances."],
        ["Support and fastening", "Locate suitable structure and use the cabinet and fastener manufacturer's approved attachment method.", "Fasteners engage verified support and cabinets bear correctly."],
        ["Alignment", "Check level, plumb, face plane, adjacent-case alignment, doors, and bottom line as cabinets are joined.", "The run is aligned without forcing boxes out of square."],
      ]],
      ["base-cabinet-installation", "Base Cabinet Installation Checklist", "Set base cabinets from the floor high point while preserving appliance, counter, toe-kick, and service requirements.", "Do not anchor the run until elevation, level, depth, and appliance openings pass together.", [
        ["High-point datum", "Map the finished floor and establish the cabinet level line from the controlling high point.", "The entire run can be shimmed without falling below required height."],
        ["Service clearance", "Coordinate plumbing, electrical, gas, vents, access panels, and appliance connections before backs are cut.", "Services remain usable and do not force the cabinets off layout."],
        ["Counter readiness", "Check level, face plane, seams, support rails, dishwasher opening, and end-panel conditions.", "The installed run is ready for the intended counter system."],
      ]],
      ["filler-scribe-installation", "Filler & Scribe Installation Checklist", "Field-fit fillers and scribes from installed cabinet positions, actual wall profiles, reveal goals, and door movement.", "Do not final-cut a filler from a single gap measurement or before adjacent cabinets are fixed.", [
        ["Gap profile", "Measure the opening at multiple heights or depths and transfer the wall or ceiling profile from a fixed reference.", "The blank retains enough width for the widest required point."],
        ["Functional reveal", "Check door, drawer, pull, hinge, appliance, trim, and cleaning clearance beside the filler.", "The visible filler also provides the required operating space."],
        ["Cut and fit sequence", "Use a marked show face, controlled scribe offset, test fitting, and the approved fastening method.", "The final edge fits without overcutting or forcing the cabinet."],
      ]],
      ["tall-cabinet-installation", "Tall Cabinet Installation Checklist", "Verify tipping path, ceiling clearance, floor level, wall lean, anchoring, fillers, and service interfaces for tall units.", "Do not stand or move a tall unit into position until the physical path and temporary stability plan are proven.", [
        ["Tipping geometry", "Compare cabinet diagonal and pivot path with ceiling, soffit, light, trim, and floor protection.", "The unit can be safely raised or has an approved site-assembly plan."],
        ["Stability", "Plan temporary restraint, leveling, joining, and permanent anchoring before doors or loads are added.", "The unit cannot tip during any installation stage."],
        ["Vertical fit", "Measure wall plumb, ceiling variation, crown or filler allowance, and top service clearances.", "The completed top and side conditions remain intentional across the height."],
      ]],
      ["floating-shelf-installation", "Floating Shelf Installation Checklist", "Coordinate shelf structure, bracket capacity, wall framing, level, hidden services, projection, and fit before drilling.", "Do not install into an unverified wall or claim a load capacity beyond the complete tested system.", [
        ["Support system", "Match shelf depth, thickness, weight, intended load, bracket spacing, projection, and manufacturer limits.", "The complete shelf and bracket assembly suits the stated use."],
        ["Wall verification", "Locate suitable structure and hidden services with methods appropriate to the wall construction.", "Every fastener location is verified and clear of hazards."],
        ["Fit and level", "Mock up height and projection, then test bracket alignment, wall flatness, and shelf engagement.", "The shelf seats fully, reads level, and does not rock."],
      ]],
      ["built-in-bookcase-installation", "Built-In Bookcase Installation Checklist", "Fit bookcases to floor, walls, ceiling, trim, outlets, anchoring, face lines, and adjustable shelves.", "Do not close scribes or trim until all cases are joined, anchored, and checked for shelf and door function.", [
        ["Opening map", "Reconfirm wall width, floor and ceiling level, wall plumb, baseboard, crown, outlets, and heat sources.", "Cases plus fillers and scribes fit the controlling envelope."],
        ["Case alignment", "Set a common level and face plane while checking join lines, shelf holes, reveals, and face frames.", "The full elevation reads as one aligned installation."],
        ["Anchor and finish sequence", "Plan structural attachment, removable service access, trim, caulk, touch-up, and protection.", "Anchors remain effective and finish work does not hide an unresolved gap."],
      ]],
      ["closet-system-installation", "Closet System Installation Checklist", "Coordinate wall structure, base and top clearances, modules, rods, drawers, doors, access, and usable reach.", "Do not anchor a closet layout until every module and moving component is marked at full scale.", [
        ["Full-wall layout", "Mark module widths, corners, doors, drawers, rods, shelves, outlets, access panels, and obstructions.", "All components fit and can operate in the actual room."],
        ["Support and load path", "Verify wall construction, cleats, vertical supports, feet, anchors, and hardware limits.", "Loads transfer through the intended supported path."],
        ["Human clearance", "Test reach, hanging lengths, aisle width, drawer projection, hamper removal, and door swing.", "The installed storage is usable, not merely dimensionally possible."],
      ]],
      ["wall-anchoring-release", "Wall Anchoring Release Checklist", "Select and locate anchors from verified substrate, structure, load path, edge distance, services, and manufacturer instructions.", "Do not drill or load an anchor based only on a generic wall label or unverified capacity claim.", [
        ["Substrate identification", "Verify wall layers, framing or masonry type, thickness, condition, voids, and finishes at the actual location.", "The selected anchor is approved for the confirmed substrate."],
        ["Load path", "Define item weight, live or dynamic use, projection, overturning, fastener count, and load distribution.", "The complete connection suits the intended loading and geometry."],
        ["Installation control", "Follow required hole size, depth, cleaning, spacing, edge distance, embedment, and torque guidance.", "Each installed anchor meets the product procedure and inspection criteria."],
      ]],
      ["final-installation-release", "Final Installation Release Checklist", "Inspect installed work for alignment, anchoring, function, damage, protection, services, punch items, and owner handoff.", "Do not declare installation complete while a safety, function, access, or undocumented field-change item remains open.", [
        ["Physical inspection", "Check level, plumb, square, face plane, reveals, seams, fasteners, trim, finish, and surrounding damage.", "The installation meets the released visual and dimensional standard."],
        ["Operational test", "Cycle every door, drawer, appliance interface, removable panel, adjustable shelf, and service access.", "All intended functions work in the completed environment."],
        ["Closeout record", "Capture field changes, photos, punch status, care information, spare parts, and acceptance.", "The owner and project record match the final installed condition."],
      ]],
    ],
  }),
  makeCategory({
    slug: "finishing-handoff",
    name: "Finishing & Handoff",
    description: "Control sample approval, surface preparation, compatible coating schedules, cure, inspection, protection, punch, and closeout records.",
    stage: "before finish application, packaging, delivery, or project closeout",
    baseChecks: [
      ["Approved sample", "Match substrate, preparation, color, sheen, application method, and coating schedule to a dated approved sample.", "The production system can reproduce the accepted appearance."],
      ["Product instructions", "Review current preparation, mixing, application, recoat, cure, safety, and disposal requirements.", "The planned process stays within the complete manufacturer's system."],
      ["Environment and cleanliness", "Record temperature, humidity, ventilation, dust control, lighting, and contamination risks.", "Conditions support safe application and reliable inspection."],
      ["Release record", "Inspect under defined lighting and record defects, repairs, cure status, protection, and acceptance.", "Finished work is documented before packaging or use can hide responsibility."],
    ],
    links: [
      ["/learn/woodworking/", "Learn woodworking preparation and finishing", "Learn"],
      ["/troubleshooting/", "Diagnose material and workflow failures", "Troubleshooting"],
      ["/apps/cutlist/", "Keep the final project record in CutList", "App"],
    ],
    topics: [
      ["surface-preparation-release", "Surface Preparation Release Checklist", "Inspect machining marks, glue, dents, fillers, edge condition, sanding sequence, dust, and contamination before finish.", "Do not apply finish until the whole surface is inspected under raking light and matches the approved preparation standard.", [
        ["Defect map", "Mark tearout, mill marks, dents, scratches, glue, putty, burnishing, and repair zones before final sanding.", "Every visible defect has been corrected or approved."],
        ["Sanding control", "Use the specified grit sequence and consistent method on faces, edges, end grain, profiles, and repaired areas.", "Scratch pattern and absorption are uniform on a sample check."],
        ["Clean surface", "Remove dust and contamination using methods compatible with the chosen coating.", "Inspection cloth, light, or approved test shows a clean surface ready for coating."],
      ]],
      ["stain-sample-approval", "Stain Sample Approval Checklist", "Approve stain on production-equivalent substrate with the complete sanding, conditioning, color, topcoat, and lighting system.", "Do not approve color from a wet sample, different species, or unfinished topcoat schedule.", [
        ["Representative substrate", "Use the same species, cut, lot range, veneer, edge material, and sanding schedule as production.", "The sample predicts the actual surfaces and variation."],
        ["Complete schedule", "Apply conditioner, dye, stain, glaze, sealer, and topcoat exactly as proposed.", "Approved color and sheen reflect the final cured system."],
        ["Viewing conditions", "Review sample orientation under shop and installation lighting beside related materials.", "Acceptance includes the lighting and reasonable natural variation."],
      ]],
      ["paint-finish-release", "Paint Finish Release Checklist", "Verify substrate, primer, filler, caulk boundaries, color, sheen, application, film build, and cure before painted work proceeds.", "Do not apply production coats until adhesion and appearance pass on the actual substrate system.", [
        ["Substrate system", "Identify solid wood, MDF, plywood edge, banding, filler, caulk, and existing coatings separately.", "Each surface has a compatible preparation and primer path."],
        ["Color and sheen", "Match approved product, formula, base, batch, sheen, and sample under final lighting.", "The production material matches the accepted appearance."],
        ["Application trial", "Test spray or brush method, thinning if permitted, coverage, edge build, sanding, and recoat timing.", "The cured trial has acceptable adhesion, texture, and film continuity."],
      ]],
      ["clear-coat-release", "Clear-Coat Release Checklist", "Control sealer, topcoat, sheen, film build, compatibility, recoat windows, witness samples, and cure.", "Do not package or rub out clear finish until cure and film condition meet the product process.", [
        ["Appearance target", "Compare raw and coated sample for color shift, ambering, grain contrast, pore fill, and sheen.", "The complete clear system produces the approved appearance."],
        ["Coat schedule", "Record product, mix, reducer, application rate, number of coats, sanding, flash, and recoat window.", "Every coat stays inside the validated schedule."],
        ["Cure evidence", "Use elapsed time, environment, hardness or handling tests allowed by the product, and odor or print checks as applicable.", "The finish can be safely handled without blocking, imprinting, or damage."],
      ]],
      ["plywood-edge-finish", "Plywood Edge Finish Checklist", "Choose and inspect banding, solid lipping, filler, sanding, sealing, and coating for exposed plywood edges.", "Do not finish exposed edges until voids, telegraphing, thickness build-up, and corner transitions are resolved.", [
        ["Edge method", "Match exposure, durability, appearance, radius, hardware clearance, and finish to the selected edge treatment.", "The method suits both the visual and service requirements."],
        ["Bond and continuity", "Inspect adhesive coverage, voids, seams, end joints, overhang trimming, and corner transitions.", "The edge is fully bonded and continuous before coating."],
        ["Finish absorption", "Test sealing, filler, primer, stain, or clear coat on the actual edge construction.", "The edge does not telegraph or absorb differently beyond the approved sample."],
      ]],
      ["between-coat-inspection", "Between-Coat Inspection Checklist", "Inspect dust, nibs, runs, sags, witness lines, adhesion, sanding, cleanliness, and recoat timing between finish coats.", "Do not bury a visible or adhesion defect under another coat without identifying and correcting the cause.", [
        ["Surface defects", "Use raking and diffuse light to inspect horizontal, vertical, edge, and profile surfaces.", "Runs, sags, dry spray, contamination, and damage are corrected."],
        ["Intercoat preparation", "Follow the product's sanding or scuffing method and remove residue without incompatible cleaners.", "The next coat has a uniformly prepared bonding surface."],
        ["Timing", "Record application time and environment, then confirm minimum, maximum, and special-prep recoat limits.", "The next coat is applied inside the approved window or after required remediation."],
      ]],
      ["finish-cure-release", "Finish Cure Release Checklist", "Verify elapsed time, environment, hardness, blocking, odor, packing material, and use restrictions before handling or delivery.", "Do not equate dry-to-touch with ready for stacking, wrapping, hardware, cleaning, or service.", [
        ["Cure timeline", "Record final-coat time, temperature, humidity, airflow, product schedule, and any catalyst or mix details.", "Minimum handling and service times are satisfied under the actual conditions."],
        ["Contact test", "Use an approved inconspicuous check for imprint, blocking, softness, adhesion, or packing reaction.", "The finish tolerates the intended handling and protection material."],
        ["Use restrictions", "Document when doors may close, shelves be loaded, cleaners used, rugs or objects placed, and full service begins.", "The handoff communicates remaining cure limits clearly."],
      ]],
      ["shop-punch-list", "Shop Punch List Checklist", "Close defects, missing parts, hardware, finish, labels, documentation, protection, and installation dependencies before loading.", "Do not ship an assembly with a shop-correctable item deferred to the jobsite without written disposition.", [
        ["Completeness", "Check every assembly against drawings, part list, hardware schedule, loose-parts list, and room manifest.", "Nothing required for installation or function is missing."],
        ["Condition", "Inspect dimensions, square, movement, surfaces, edges, touch-up, cleaning, and protective packaging.", "The delivered condition can be distinguished from transit or site damage."],
        ["Open items", "Assign owner, due point, access need, material, approval, and risk for every remaining item.", "Only deliberate site-dependent work remains open."],
      ]],
      ["client-handoff", "Client Handoff Checklist", "Transfer operating, care, cure, warranty, adjustment, service, spare-part, and final-condition information at completion.", "Do not rely on a verbal handoff for information that affects safety, finish care, function, or future service.", [
        ["Operation", "Demonstrate doors, drawers, locks, removable parts, adjustments, appliances interfaces, and access panels.", "The owner can use intended functions without forcing or guessing."],
        ["Care and limits", "Provide finish cure, cleaning, load, moisture, heat, movement, and prohibited-product guidance.", "Critical care information is written and acknowledged."],
        ["Records and spares", "Deliver approved drawings, finish and hardware identification, keys, touch-up, spare pieces, contacts, and photos.", "Future maintenance can identify the installed system."],
      ]],
      ["project-closeout", "Woodworking Project Closeout Checklist", "Reconcile final drawings, revisions, costs, material, offcuts, photos, warranties, lessons, and archived project files.", "Do not archive the project until the final installed condition and outstanding responsibilities are represented accurately.", [
        ["As-built record", "Update dimensions, field changes, hardware, finish, services, and installation notes to match final work.", "The archive describes what exists rather than only the original design."],
        ["Material closeout", "Reconcile purchased, used, returned, scrapped, reserved, and reusable stock by material group.", "Cost and inventory records explain the final material result."],
        ["Learning review", "Record preventable rework, successful controls, supplier issues, timing, and checklist changes for the next project.", "Lessons become an updated process rather than private memory."],
      ]],
    ],
  }),
];

export const checklistEntries = checklistCategories.flatMap((category) =>
  category.topics.map((topic) => ({
    ...topic,
    category: category.name,
    categorySlug: category.slug,
    categoryDescription: category.description,
    stage: category.stage,
    checks: [...category.baseChecks, ...topic.focusChecks],
    links: category.links,
    publishedDate: "2026-07-22",
  })),
);
