import {
  cutListExpressionFunctionNames,
  evaluateCutListExpression,
} from "./cut-list-expression.mjs";
import { componentModels } from "./cut-list-component-data.mjs";

const modelsBySlug = new Map(componentModels.map((model) => [model.slug, model]));

function modelFor(slug) {
  const model = modelsBySlug.get(slug);
  if (!model) {
    throw new Error(`Unknown cut-list component model: ${slug}`);
  }
  return model;
}

function defaultVariables(slug) {
  return Object.fromEntries(
    modelFor(slug).inputs.map((input) => [input.id, input.default]),
  );
}

function inputDefault(slug, inputId) {
  const input = modelFor(slug).inputs.find((candidate) => candidate.id === inputId);
  if (!input) {
    throw new Error(`Unknown input ${inputId} for ${slug}`);
  }
  return input.default;
}

function partResult(slug, partName, property) {
  const part = modelFor(slug).parts.find((candidate) => candidate.name === partName);
  if (!part) {
    throw new Error(`Unknown part ${partName} for ${slug}`);
  }
  const expression = part[property];
  if (typeof expression !== "string") {
    throw new Error(`Missing ${property} expression for ${partName} in ${slug}`);
  }
  return evaluateCutListExpression(expression, defaultVariables(slug), {
    allowedFunctions: cutListExpressionFunctionNames,
  });
}

function displayNumber(value) {
  return Number(value.toFixed(4)).toString();
}

const d = (slug, inputId) => displayNumber(inputDefault(slug, inputId));
const r = (slug, partName, property) =>
  displayNumber(partResult(slug, partName, property));

export const componentEditorialBySlug = {
  "face-frame-cut-list-calculator": {
    decisionContext:
      "Choose the face-frame model when the visible front structure is a separate assembly of full-height outer stiles and between-stile rails, with optional intermediate members defining openings. It is a better fit than the drawer-front grid model because it sizes structural frame members, not equal visible fronts and reveals. It also differs from the stretcher-and-nailer model, whose members fit between cabinet sides and are not intended to establish the finished opening elevation. Use another model when the frame has arched rails, unequal member widths, mitered perimeter construction, or joint extensions that cannot be represented by rectangular finished boundaries.",
    workedExample: `At the current defaults, the cabinet is ${d("face-frame-cut-list-calculator", "cabinetWidth")} inches wide by ${d("face-frame-cut-list-calculator", "cabinetHeight")} inches high. Stiles and rails are each ${d("face-frame-cut-list-calculator", "stileWidth")} inches wide, stock is ${d("face-frame-cut-list-calculator", "materialThickness")} inch thick, the elevation has ${d("face-frame-cut-list-calculator", "openingCount")} opening columns, and it includes ${d("face-frame-cut-list-calculator", "middleRailCount")} intermediate rail. Two outer stiles keep the full ${r("face-frame-cut-list-calculator", "Outer stile", "length")}-inch height. Subtracting two stile widths from the cabinet width gives ${r("face-frame-cut-list-calculator", "Top and bottom rail", "length")}-inch top and bottom rails. Opening count minus one produces ${r("face-frame-cut-list-calculator", "Intermediate stile", "quantity")} intermediate stile, whose length is the height minus two ${d("face-frame-cut-list-calculator", "railWidth")}-inch rails, or ${r("face-frame-cut-list-calculator", "Intermediate stile", "length")} inches. The single intermediate rail shares the ${r("face-frame-cut-list-calculator", "Intermediate rail", "length")}-inch rail length. Every listed member remains ${d("face-frame-cut-list-calculator", "materialThickness")} inch thick.`,
    invalidConfiguration:
      "A concrete failure occurs if cabinet width is entered as 6 inches and stile width as 3 inches. The rail expression becomes 6 minus two times 3, yielding a zero-length top rail, bottom rail, and intermediate rail. Likewise, a 6-inch cabinet height with 3-inch rail widths leaves a zero-length intermediate stile. Those relationships do not describe cuttable frame members. The calculator reports the configuration as invalid and refuses the result; it does not quietly replace zero with a fabricated 0.01-inch length.",
    releaseDecision:
      "Cut one stile pair and the top and bottom rails, then clamp the perimeter against the actual cabinet reference plane. Record both diagonals, the reconstructed outside width, and the net opening dimensions before adding intermediate members. Next, place the intermediate stile and rail on the approved centerlines and check hinge, slide, and front clearances. Release the remaining frames only when that first assembly matches the elevation, closes square without forcing, and retains the same stock preparation and model revision. A joint-extension change requires a revised model rather than an informal saw-side adjustment.",
  },

  "toe-kick-platform-cut-list-calculator": {
    decisionContext:
      "Use the toe-kick platform model when a recessed base frame supports a cabinet footprint and needs front and rear rails joined by end and intermediate sleepers. This is distinct from a filler or scribe blank, which closes a visible field gap, and from a finished end panel, which extends a cabinet skin. It is also not a hanging-rail layout because its members organize support at the floor rather than attachment along a wall. Choose a project-specific structural detail instead when the base uses adjustable legs, a solid plinth box, a continuous ladder with unequal recesses, or individually leveled members.",
    workedExample: `The default footprint begins with a ${d("toe-kick-platform-cut-list-calculator", "cabinetWidth")}-inch cabinet width and ${d("toe-kick-platform-cut-list-calculator", "cabinetDepth")}-inch depth. A ${d("toe-kick-platform-cut-list-calculator", "frontSetback")}-inch front recess, ${d("toe-kick-platform-cut-list-calculator", "sideSetback")}-inch inset at each side, ${d("toe-kick-platform-cut-list-calculator", "platformHeight")}-inch member width, and ${d("toe-kick-platform-cut-list-calculator", "materialThickness")}-inch stock define the frame. Deducting both side insets makes each of the two long rails ${r("toe-kick-platform-cut-list-calculator", "Front and rear platform rail", "length")} inches. Sleeper length is cabinet depth minus the front recess minus two stock thicknesses, producing ${r("toe-kick-platform-cut-list-calculator", "End sleeper", "length")} inches for both end sleepers. Dividing the ${r("toe-kick-platform-cut-list-calculator", "Front and rear platform rail", "length")}-inch platform width by the entered ${d("toe-kick-platform-cut-list-calculator", "supportSpacing")}-inch planning interval, rounding up, and subtracting one yields ${r("toe-kick-platform-cut-list-calculator", "Intermediate sleeper", "quantity")} intermediate sleeper of the same ${r("toe-kick-platform-cut-list-calculator", "Intermediate sleeper", "length")}-inch length. That count estimates layout only; it does not approve the load path.`,
    invalidConfiguration:
      "Enter a 6-inch cabinet depth, a 5.5-inch front setback, and 0.25-inch platform stock. The sleeper equation becomes 6 minus 5.5 minus two times 0.25, exactly zero. A similar width failure occurs when a 6-inch cabinet has a 3-inch side setback on both sides, leaving zero-length rails. Neither arrangement creates a physical platform rectangle. The page rejects the nonpositive output and asks for a coherent footprint instead of disguising the problem by clamping the affected member to 0.01 inch.",
    releaseDecision:
      "Template the first platform on the surveyed floor before repeating any module. Evidence should identify the high point, the intended front recess, both side boundaries, rail-to-sleeper joints, cabinet side bearing locations, and the approved attachment path. Dry-fit the platform, level it by the specified method, and set the first cabinet on it long enough to confirm footprint and access. Release repeated platforms only if member heights, seams, and bearing points match that verified condition. Any floor-driven height change or unsupported seam returns the model to review rather than becoming an unrecorded shim decision.",
  },

  "stretcher-nailer-cut-list-calculator": {
    decisionContext:
      "Select this model when horizontal stretchers or nailers are deliberately counted and fit between two cabinet sides with a visible end-clearance decision. A face-frame calculator is inappropriate because its rails terminate between outer stiles at the finished front plane; these members live within the carcass and may serve top fastening, squaring, or attachment coordination. The hanging-rail model also answers a different question: it divides a wall run into equal rail segments and gaps. Use a custom layout if member lengths differ, if one member laps or notches a side, or if back, sink, appliance, and service zones require nonrectangular pieces.",
    workedExample: `With the defaults, cabinet width is ${d("stretcher-nailer-cut-list-calculator", "cabinetWidth")} inches, each side is ${d("stretcher-nailer-cut-list-calculator", "sideThickness")} inch thick, and end clearance is ${d("stretcher-nailer-cut-list-calculator", "endClearance")} inches. The common member length is therefore ${d("stretcher-nailer-cut-list-calculator", "cabinetWidth")} minus two side thicknesses minus two end clearances, which evaluates to ${r("stretcher-nailer-cut-list-calculator", "Stretcher", "length")} inches. The entered count creates ${r("stretcher-nailer-cut-list-calculator", "Stretcher", "quantity")} stretchers, each ${d("stretcher-nailer-cut-list-calculator", "stretcherWidth")} inches wide and ${d("stretcher-nailer-cut-list-calculator", "materialThickness")} inch thick. It also creates ${r("stretcher-nailer-cut-list-calculator", "Nailer", "quantity")} nailer at ${d("stretcher-nailer-cut-list-calculator", "nailerWidth")} inches wide, the same ${r("stretcher-nailer-cut-list-calculator", "Nailer", "length")}-inch length, and the same thickness. The matching length follows from both part families sharing cabinet width, side thickness, and deliberate end clearance; their face widths and quantities remain independently controlled.`,
    invalidConfiguration:
      "Set cabinet width to 6 inches, both side panels to 3 inches, and end clearance to zero. The shared length expression gives 6 minus two times 3 minus zero, so both stretcher and nailer lengths become zero. Adding any positive end clearance would push them below zero. That signals that the outside envelope has been consumed by the sides and cannot contain a between-side member. The interface rejects the calculation and preserves the error for review; it never substitutes a misleading 0.01-inch strip.",
    releaseDecision:
      "Make a single stretcher and nailer set, label each intended location, and place it in the first carcass before machining the full batch. The release record should show the measured inside width, actual side thicknesses, chosen joint, fastener edge distances, and clearance from slides, plumbing, appliances, and top fasteners. Confirm that the nailer aligns with the approved attachment zone and that each stretcher remains accessible during assembly. Release quantities only after the carcass closes square and every member has a documented purpose. A changed wall substrate or load path holds the nailer batch for renewed attachment review.",
  },

  "divider-partition-cut-list-calculator": {
    decisionContext:
      "Choose the divider model for vertical rectangular panels positioned inside a known cabinet opening, where top, bottom, front, and rear allowances must remain independently reviewable. A fixed-shelf model reverses the orientation and adds joint engagement across the inside width, while an adjustable-shelf pack sizes removable horizontal parts around side clearance. The divider model is useful for separating bays or establishing hardware zones, but it does not locate the divider centerline or prove its support. Use a custom part definition when the partition is stepped, toe-notched, load-bearing, captured by unequal dados, or shaped around plumbing and pullout hardware.",
    workedExample: `The default opening is ${d("divider-partition-cut-list-calculator", "insideHeight")} inches high and ${d("divider-partition-cut-list-calculator", "insideDepth")} inches deep. It requests ${d("divider-partition-cut-list-calculator", "dividerCount")} divider made from ${d("divider-partition-cut-list-calculator", "materialThickness")}-inch panel stock. Top and bottom clearances are both ${d("divider-partition-cut-list-calculator", "topClearance")} inches, so subtracting them from inside height leaves a ${r("divider-partition-cut-list-calculator", "Vertical divider", "length")}-inch panel length. Across the depth, the model subtracts a ${d("divider-partition-cut-list-calculator", "frontSetback")}-inch front setback and ${d("divider-partition-cut-list-calculator", "backClearance")}-inch rear clearance from ${d("divider-partition-cut-list-calculator", "insideDepth")} inches, giving a ${r("divider-partition-cut-list-calculator", "Vertical divider", "width")}-inch panel width. The quantity expression simply carries the entered divider count, producing ${r("divider-partition-cut-list-calculator", "Vertical divider", "quantity")} rectangular part. No location, dado engagement, edge-banding buildup, or hardware offset is inferred; those decisions must be proved on the cabinet section and elevation.`,
    invalidConfiguration:
      "A 6-inch inside depth combined with a 3-inch front setback and 3-inch back clearance produces 6 minus 3 minus 3, so divider width is zero. For a vertical failure, a 6-inch inside height with 3-inch top clearance and 3-inch bottom clearance leaves zero length. These are explicit allowance conflicts, not tiny parts waiting to be rounded. The calculator rejects either nonpositive panel dimension and keeps the bad relationship visible; it does not coerce the answer into a nominal 0.01-inch sliver.",
    releaseDecision:
      "Cut one divider from the verified material lot and trial it at its actual centerline, not merely at the middle of the cabinet. Record the opening widths on both sides, the front setback, back relationship, top and bottom joint conditions, and conflicts with every slide, pullout, shelf-pin row, or door. The first piece earns release only when it seats in the planned assembly sequence and preserves both adjacent hardware envelopes. Duplicate dividers may proceed under the same revision; a shifted centerline, new dado, or changed interior hardware requires a fresh fit record.",
  },

  "fixed-shelf-cut-list-calculator": {
    decisionContext:
      "Use the fixed-shelf model when a horizontal shelf engages equal-depth joints in both cabinet sides and its front and rear setbacks are known separately. It should be chosen over the adjustable-shelf pack when the part contributes to a locked assembly sequence rather than resting on removable pins or clips. The formula intentionally adds side-dado engagement to the clear inside width, which makes it unsuitable for a loose shelf. Choose another model when joint depths differ, the shelf stops in blind dados, a face frame changes insertion geometry, or a shaped front, service notch, divider intersection, or torsion-box build breaks the single rectangular panel assumption.",
    workedExample: `At default settings, the finished inside width is ${d("fixed-shelf-cut-list-calculator", "insideWidth")} inches and inside depth is ${d("fixed-shelf-cut-list-calculator", "insideDepth")} inches. Two identical shelves are requested from ${d("fixed-shelf-cut-list-calculator", "shelfThickness")}-inch material. Each shelf engages a ${d("fixed-shelf-cut-list-calculator", "sideDadoDepth")}-inch dado on both sides, so length is ${d("fixed-shelf-cut-list-calculator", "insideWidth")} plus twice ${d("fixed-shelf-cut-list-calculator", "sideDadoDepth")}, yielding ${r("fixed-shelf-cut-list-calculator", "Fixed shelf", "length")} inches. Shelf width begins at ${d("fixed-shelf-cut-list-calculator", "insideDepth")} inches and deducts the ${d("fixed-shelf-cut-list-calculator", "frontSetback")}-inch front setback plus the ${d("fixed-shelf-cut-list-calculator", "backSetback")}-inch rear setback, resulting in ${r("fixed-shelf-cut-list-calculator", "Fixed shelf", "width")} inches. The quantity remains ${r("fixed-shelf-cut-list-calculator", "Fixed shelf", "quantity")}, and every output panel is ${r("fixed-shelf-cut-list-calculator", "Fixed shelf", "thickness")} inch thick. This chain models finished rectangular boundaries only; groove width, glue strategy, and insertion sequence remain separate evidence.`,
    invalidConfiguration:
      "Enter a 6-inch inside depth with a 3-inch front setback and 3-inch back setback. The width equation becomes 6 minus 3 minus 3, returning zero even though shelf length may still be positive. That combination consumes the entire usable depth and cannot describe a shelf. The page treats the zero-width output as a configuration error and stops the result from entering the cut list. It does not conceal the contradictory setbacks by forcing the panel width to 0.01 inch.",
    releaseDecision:
      "Machine the production dado setup in a sample side, then cut one shelf from the measured panel lot and assemble the first carcass in the intended order. Capture actual groove depth, groove width, shelf thickness, front and rear setbacks, diagonal readings, and whether the shelf seats without spreading the sides. Confirm the back and face-frame sequence still permits insertion. Release the remaining shelves only after the joint fully engages and the cabinet squares under the approved method. Any cutter change, material-thickness change, or revised back position invalidates that first-piece evidence.",
  },

  "adjustable-shelf-pack-calculator": {
    decisionContext:
      "Select the adjustable-shelf pack when several identical loose shelves must clear both cabinet sides and retain separate front and rear allowances. Unlike the fixed-shelf model, it subtracts side clearance instead of adding joint engagement, because the parts must be inserted, removed, and repositioned on hardware. It also differs from a divider because the controlling opening is horizontal and the support product governs each elevation. Use a custom layout for shelves of mixed depths, corner shapes, edge-built fronts, unequal side clearances, or openings where the shelf must rotate through a narrower face-frame or door aperture than the measured cabinet interior.",
    workedExample: `The default pack contains ${d("adjustable-shelf-pack-calculator", "shelfCount")} shelves. Each starts from a ${d("adjustable-shelf-pack-calculator", "insideWidth")}-inch inside width and loses ${d("adjustable-shelf-pack-calculator", "sideClearance")} inch at each side. Subtracting twice that clearance produces a ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "length")}-inch shelf length. The ${d("adjustable-shelf-pack-calculator", "insideDepth")}-inch interior depth is reduced by a ${d("adjustable-shelf-pack-calculator", "frontSetback")}-inch front setback and ${d("adjustable-shelf-pack-calculator", "backClearance")}-inch back clearance, leaving ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "width")} inches. The output therefore lists ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "quantity")} identical rectangular panels, each ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "thickness")} inch thick, ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "width")} inches deep, and ${r("adjustable-shelf-pack-calculator", "Adjustable shelf", "length")} inches long. The arithmetic does not verify that the shelf can pass through the door or face-frame opening, nor does it select shelf pins, clips, edge reinforcement, or an allowable loading condition.`,
    invalidConfiguration:
      "Set inside width to 6 inches and side clearance to 3 inches. The length expression subtracts two 3-inch clearances from 6 inches and returns zero. An analogous depth conflict occurs at 6 inches with 3 inches of front setback and 3 inches of rear clearance. Either case leaves no rectangular shelf surface, even if the requested count remains four. The calculator rejects the nonpositive dimension before export or project storage; it does not convert the failed relationship into a supposedly usable 0.01-inch shelf.",
    releaseDecision:
      "Cut one shelf and test it in the narrowest measured cabinet of the run at the highest and lowest intended pin positions. The evidence should include actual panel thickness, tightest inside width, insertion path through the finished front opening, pin or clip product, bearing contact, edge treatment, and front-to-back clearance. Tilt and remove the shelf without damaging finished edges, then place the planned contents or approved test condition on the verified supports. Release the pack only when fit and support geometry repeat; a different cabinet opening or hardware lot requires another first-piece check.",
  },

  "applied-back-panel-calculator": {
    decisionContext:
      "Use the applied-back model when a rectangular panel overlays the cabinet rear and is reduced by visible side, top, or bottom insets. It is the correct neighbor to reject when the back enters grooves: captured construction must add groove engagement and subtract a fit allowance instead. An applied panel can support squaring or enclosure only when its material and attachment detail are separately approved; this calculator merely sizes its boundary. Choose a custom panel workflow for service cutouts, split backs, ventilation patterns, hanging-hardware interruptions, rabbets, unequal side offsets, or any geometry that cannot be represented by one outside width and height.",
    workedExample: `The default cabinet rear measures ${d("applied-back-panel-calculator", "cabinetWidth")} inches wide by ${d("applied-back-panel-calculator", "cabinetHeight")} inches high. Side inset, top inset, and bottom inset are all ${d("applied-back-panel-calculator", "sideInset")} inches, while the back material is ${d("applied-back-panel-calculator", "backThickness")} inch thick and panel count is ${d("applied-back-panel-calculator", "panelCount")}. Width is cabinet width minus two side insets, so the output remains ${r("applied-back-panel-calculator", "Applied back panel", "width")} inches. Length is cabinet height minus the independent top and bottom insets, remaining ${r("applied-back-panel-calculator", "Applied back panel", "length")} inches. The count expression carries through ${r("applied-back-panel-calculator", "Applied back panel", "quantity")} panel at ${r("applied-back-panel-calculator", "Applied back panel", "thickness")} inch thick. With zero insets, the result covers the full modeled rear envelope; it does not automatically deduct nailers, wall clearances, service openings, or hardware zones.`,
    invalidConfiguration:
      "Choose a 6-inch cabinet width and enter a 3-inch side inset. Because that inset is applied at both sides, width becomes 6 minus 6, or zero. A height conflict can be made with a 6-inch cabinet height plus 3-inch top and bottom insets. These inputs remove the entire panel boundary rather than defining a narrow back. The page flags and rejects the zero dimension, preventing a false cut-list row; it will not hide the mistake behind a 0.01-inch fallback value.",
    releaseDecision:
      "Cut the first back only after marking rear services, nailers, hardware, and the approved fastening perimeter on the actual carcass. Place the panel against the cabinet, compare diagonals before and after temporary fastening, and record bearing at every edge along with screw or staple edge distance. Confirm the chosen installation order leaves wall and attachment access. Release subsequent backs when the first panel squares without forcing and every obstruction matches the reviewed rear elevation. A new service opening or attachment pattern is a drawing revision, not permission to trim production panels ad hoc.",
  },

  "captured-back-panel-calculator": {
    decisionContext:
      "Choose the captured-back model when one panel enters grooves on all four sides and a single total fit clearance is deliberately removed from both groove-bottom dimensions. It should replace the applied-back model whenever the panel edge is concealed in joinery rather than laid over the cabinet rear. The model assumes equal side-groove depths and equal top-and-bottom depths, so it is unsuitable for a rabbeted rear, a three-sided slide-in back, or unequal cutter settings. Use a custom detail if assembly requires a removable rail, floating-panel movement differs by axis, corner radii control insertion, or the back is divided around services.",
    workedExample: `At the defaults, the clear interior is ${d("captured-back-panel-calculator", "insideWidth")} inches wide by ${d("captured-back-panel-calculator", "insideHeight")} inches high. Side grooves are ${d("captured-back-panel-calculator", "sideGrooveDepth")} inch deep, top and bottom grooves are ${d("captured-back-panel-calculator", "topBottomGrooveDepth")} inch deep, and one total fit clearance of ${d("captured-back-panel-calculator", "fitClearance")} inch is deducted on each axis. Width is therefore ${d("captured-back-panel-calculator", "insideWidth")} plus twice ${d("captured-back-panel-calculator", "sideGrooveDepth")} minus ${d("captured-back-panel-calculator", "fitClearance")}, which yields ${r("captured-back-panel-calculator", "Captured back panel", "width")} inches. Length follows the parallel chain, ${d("captured-back-panel-calculator", "insideHeight")} plus twice ${d("captured-back-panel-calculator", "topBottomGrooveDepth")} minus ${d("captured-back-panel-calculator", "fitClearance")}, yielding ${r("captured-back-panel-calculator", "Captured back panel", "length")} inches. The output is ${r("captured-back-panel-calculator", "Captured back panel", "quantity")} rectangular back panel at ${r("captured-back-panel-calculator", "Captured back panel", "thickness")} inch thick. The shared clearance is total, not a per-edge deduction.`,
    invalidConfiguration:
      "A captured-back width becomes nonpositive when total fit clearance equals or exceeds inside width plus twice the side-groove depth. The visible controls prevent that case: inside width cannot be below 3 inches, fit clearance cannot exceed 1 inch, and zero groove depth still leaves a 2-inch result. The same protection applies on the height axis. If an altered document or incompatible saved payload bypasses those declared bounds and makes either expression zero or negative, the runtime rejects the panel instead of converting it to a misleading 0.01-inch blank.",
    releaseDecision:
      "Run the production groove setup through sample side, top, and bottom pieces, then cut a single back from the actual material lot. Record groove depths, groove width, panel thickness, cutter corner geometry, and the measured clearance at both axes. Assemble in the planned sequence and verify the back enters every groove, permits squaring, and neither rattles nor forces the joints open. Release the remaining panels only while the cutter setup and material lot remain unchanged. A revised glue strategy, movement allowance, or assembly order requires another captured-panel trial.",
  },

  "filler-scribe-panel-calculator": {
    decisionContext:
      "Use the filler-and-scribe model when a field gap must be closed by a blank wider than the nominal opening so one edge can be trimmed to an irregular wall or adjacent finish. It differs from the finished-end panel, whose width follows cabinet depth plus planned extensions and whose broad face remains visible. It also differs from a simple spacer because the removable scribe allowance is intentional and evidence should preserve the factory edge. Choose a templated or shaped-part workflow when the obstruction curves, changes through the depth, requires multiple seams, or leaves too little stock for the approved reveal after field fitting.",
    workedExample: `The default field opening is ${d("filler-scribe-panel-calculator", "openingHeight")} inches high with a nominal ${d("filler-scribe-panel-calculator", "nominalGap")}-inch gap. Adding the separate ${d("filler-scribe-panel-calculator", "scribeAllowance")}-inch trimming allowance makes the blank ${r("filler-scribe-panel-calculator", "Filler or scribe blank", "width")} inches wide. The model deducts ${d("filler-scribe-panel-calculator", "topClearance")} inch at the top and the same ${d("filler-scribe-panel-calculator", "bottomClearance")} inch at the bottom from opening height, producing a ${r("filler-scribe-panel-calculator", "Filler or scribe blank", "length")}-inch blank. It outputs ${r("filler-scribe-panel-calculator", "Filler or scribe blank", "quantity")} part at ${r("filler-scribe-panel-calculator", "Filler or scribe blank", "thickness")} inch thick. The ${d("filler-scribe-panel-calculator", "scribeAllowance")}-inch addition is stock available for field removal, not a promised final reveal; the approved control line, widest field deviation, edge treatment, and fitting method determine what remains after scribing and before the blank reaches installation.`,
    invalidConfiguration:
      "Set opening height to 6 inches with top clearance of 3 inches and bottom clearance of 3 inches, all values the controls permit. The length chain becomes 6 minus 3 minus 3, leaving zero even though panel count and width remain valid. That combination represents no usable vertical blank, not a miniature filler. The page rejects the configuration and prevents export; it does not manufacture a 0.01-inch length to make the arithmetic appear successful. Width remains positive because nominal gap has a declared 0.125-inch minimum.",
    releaseDecision:
      "Mill one oversize blank, label its finished face, factory edge, scribe edge, top, and cabinet location, then fit it against the actual installed condition. Preserve a dated template or a measured profile together with the opening height and the widest gap. Check door, drawer, pull, appliance, countertop, base, and trim movement before committing the visible reveal. Release additional blanks only where the field profile and control line demonstrably repeat. If the first scribe consumes the planned allowance or exposes an unfinished edge, stop and revise stock width or installation sequence.",
  },

  "drawer-front-grid-calculator": {
    decisionContext:
      "Choose the drawer-front grid model when one rectangular opening is intentionally divided into equal rows and equal columns with common perimeter reveals and internal gaps. It is not a face-frame model: the outputs are visible fronts sized inside an opening, not stiles and rails that create openings. It also should not be stretched to cover unequal drawer stacks, paired doors, false fronts, or appliance panels. Use a custom elevation when row heights or column widths vary, grain matching demands a nonuniform sequence, hardware fixes impose different minimum front sizes, or adjacent fronts require asymmetric reveals to align with another cabinet.",
    workedExample: `The default opening is ${d("drawer-front-grid-calculator", "openingWidth")} inches wide by ${d("drawer-front-grid-calculator", "openingHeight")} inches high, divided into ${d("drawer-front-grid-calculator", "columnCount")} columns and ${d("drawer-front-grid-calculator", "rowCount")} rows. Side reveals, top and bottom reveals, and internal gaps are each ${d("drawer-front-grid-calculator", "gap")} inch. Width first removes two side reveals and one intercolumn gap, then divides the remainder by ${d("drawer-front-grid-calculator", "columnCount")}, producing ${r("drawer-front-grid-calculator", "Equal drawer front", "width")} inches per front. Height removes two perimeter reveals and two interrow gaps before division by ${d("drawer-front-grid-calculator", "rowCount")}, producing ${r("drawer-front-grid-calculator", "Equal drawer front", "length")} inches. Multiplying columns by rows yields ${r("drawer-front-grid-calculator", "Equal drawer front", "quantity")} equal fronts, each ${r("drawer-front-grid-calculator", "Equal drawer front", "thickness")} inch thick. Reassembling those fronts, gaps, and reveals returns the original modeled opening on both axes before any machining begins.`,
    invalidConfiguration:
      "Use a 6-inch opening width, two columns, a 3-inch reveal at each side, and any nonnegative internal gap. The available width before division is already zero or negative, so every calculated front width fails. A height example uses a 6-inch opening, one row, and 3-inch top and bottom reveals, which returns zero height. The calculator rejects these nonpositive fronts rather than exporting them, and it does not clamp either axis to 0.01 inch merely to preserve the requested six-part quantity.",
    releaseDecision:
      "Cut the complete six-front default grid as one sequenced first set, maintaining grain order and part IDs from machining through finishing. Lay it in the verified opening with physical spacers matching the entered reveals and gaps, then reconstruct total width and height from the measured fronts. Check mounting screws, adjustment range, pull boring, edge finish, and collisions throughout drawer travel. Release the next grid only after the first elevation aligns at every perimeter and internal joint. A hardware change or unequal visual correction requires a revised elevation instead of selective trimming.",
  },

  "finished-end-panel-calculator": {
    decisionContext:
      "Select the finished-end model when a visible cabinet side skin follows cabinet height and depth but needs explicit top, bottom, front, or rear extension decisions. This is broader than a filler-and-scribe blank: a filler closes a gap and carries removable scribe stock, while a finished end establishes a finished plane and often coordinates fronts, countertops, base, or crown. It is not an applied back because width follows cabinet depth rather than rear width. Use a custom part when the panel is waterfall-shaped, floor-scribed, notched around base or countertop, handed by machining, or divided for grain sequence and transport.",
    workedExample: `The default cabinet is ${d("finished-end-panel-calculator", "cabinetHeight")} inches high and ${d("finished-end-panel-calculator", "cabinetDepth")} inches deep. Top extension and bottom extension are both ${d("finished-end-panel-calculator", "topExtension")} inches, so panel length remains ${r("finished-end-panel-calculator", "Finished end panel", "length")} inches after adding them to cabinet height. Across the side, the model adds a ${d("finished-end-panel-calculator", "frontExtension")}-inch front extension and subtracts a ${d("finished-end-panel-calculator", "backInset")}-inch rear inset from the ${d("finished-end-panel-calculator", "cabinetDepth")}-inch depth. The resulting panel width is ${r("finished-end-panel-calculator", "Finished end panel", "width")} inches. It outputs ${r("finished-end-panel-calculator", "Finished end panel", "quantity")} rectangular finished end at ${r("finished-end-panel-calculator", "Finished end panel", "thickness")} inch thick. The added front material establishes the modeled forward boundary; the formula does not infer door overlay, scribe, applied edge buildup, countertop overhang, or a handed machining face.`,
    invalidConfiguration:
      "Enter a 6-inch cabinet depth, zero front extension, and a 6-inch back inset. Width evaluates as 6 plus zero minus 6, producing zero. A vertical conflict is possible only if the entered top and bottom extensions are allowed to reduce height in a future revision; under the current nonnegative inputs, height stays positive. The present width failure is sufficient for rejection. The page refuses the zero-width finished end and preserves the input conflict, rather than replacing it with an arbitrary 0.01-inch panel.",
    releaseDecision:
      "Prepare one finished end with its face, hand, grain direction, front edge, rear edge, and cabinet location clearly marked. Hold it against the assembled cabinet at the actual floor, wall, countertop, appliance, base, and crown references. Record the visible front extension, rear relationship, total height, edge treatment, and fastener access, then cycle adjacent doors and drawers. Release matching panels only when the first one establishes the approved finished plane without field improvisation. A handed machining change, new scribe condition, or revised countertop datum creates a separate release decision.",
  },

  "cabinet-hanging-rail-calculator": {
    decisionContext:
      "Use the hanging-rail model when one or more horizontal rail rows must be divided into equal straight segments across a known wall run, with side clearances and seam gaps stated explicitly. It differs from the stretcher-and-nailer model because rail segments relate to the installation run and substrate, not merely the space between cabinet sides. It also does not design a toe-kick platform or choose attachment capacity. Select a manufacturer-specific or engineered layout when proprietary profiles dictate lengths, seams must land at particular blocking, services interrupt the run, cabinets require unequal segments, or structural review controls fastener spacing and rail continuity.",
    workedExample: `The default installation run is ${d("cabinet-hanging-rail-calculator", "runWidth")} inches wide with ${d("cabinet-hanging-rail-calculator", "sideClearance")} inch of clearance at each end. It uses ${d("cabinet-hanging-rail-calculator", "railCount")} rail rows, ${d("cabinet-hanging-rail-calculator", "segmentCount")} segment per row, and a ${d("cabinet-hanging-rail-calculator", "segmentGap")}-inch gap only between adjacent segments. Because one segment creates zero internal gaps, usable run length is ${d("cabinet-hanging-rail-calculator", "runWidth")} minus two end clearances, or ${r("cabinet-hanging-rail-calculator", "Hanging rail segment", "length")} inches per segment. Quantity multiplies ${d("cabinet-hanging-rail-calculator", "railCount")} rows by ${d("cabinet-hanging-rail-calculator", "segmentCount")} segment, yielding ${r("cabinet-hanging-rail-calculator", "Hanging rail segment", "quantity")} parts. Each is ${r("cabinet-hanging-rail-calculator", "Hanging rail segment", "width")} inches high and ${r("cabinet-hanging-rail-calculator", "Hanging rail segment", "thickness")} inch thick, so both rows retain identical blank geometry. The formula distributes geometry only; it does not choose fasteners, approve substrate, locate blocking, or establish carrying capacity.`,
    invalidConfiguration:
      "Set run width to 6 inches and side clearance to 3 inches at both ends. With one segment, the numerator becomes 6 minus 6 minus zero internal gaps, so segment length is zero. Another failure can arise when many segments make their combined gaps consume the usable run. These relationships leave no rail material between the boundaries. The calculator rejects a zero or negative segment before it reaches the project tray and does not disguise the installation conflict with a 0.01-inch substitute.",
    releaseDecision:
      "Mark one full run on the verified wall before cutting repeated rails. The evidence must locate cabinet boundaries, every seam, blocking or approved substrate, services, rail orientation, fastener positions, end clearances, and engagement with the exact mating hardware. Cut and mount the first segment set, level it, engage a representative cabinet, and verify locking or anti-lift provisions plus installation access. Release remaining runs only after that assembly matches the current manufacturer or engineered detail. A changed substrate, seam location, profile revision, or fastener schedule places the rail batch back on hold.",
  },
};

const editorialFields = [
  "decisionContext",
  "workedExample",
  "invalidConfiguration",
  "releaseDecision",
];

const wordRanges = {
  decisionContext: [80, 120],
  workedExample: [100, 150],
  invalidConfiguration: [70, 110],
  releaseDecision: [70, 110],
};

function wordCount(value) {
  return value.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

const sourceSlugs = componentModels.map((model) => model.slug).sort();
const editorialSlugs = Object.keys(componentEditorialBySlug).sort();

if (
  sourceSlugs.length !== 12 ||
  editorialSlugs.length !== 12 ||
  JSON.stringify(sourceSlugs) !== JSON.stringify(editorialSlugs)
) {
  throw new Error(
    `Component editorial must exactly cover all 12 source slugs. Source=${sourceSlugs.join(",")} Editorial=${editorialSlugs.join(",")}`,
  );
}

const normalizedParagraphs = new Set();
const normalizedSentences = new Set();
const validationErrors = [];

for (const slug of sourceSlugs) {
  const editorial = componentEditorialBySlug[slug];
  for (const field of editorialFields) {
    const paragraph = editorial[field];
    if (typeof paragraph !== "string" || paragraph.trim() === "") {
      validationErrors.push(`Missing ${field} editorial for ${slug}`);
      continue;
    }

    const count = wordCount(paragraph);
    const [minimum, maximum] = wordRanges[field];
    if (count < minimum || count > maximum) {
      validationErrors.push(
        `${slug}.${field} has ${count} words; expected ${minimum}-${maximum}`,
      );
    }

    const normalizedParagraph = paragraph
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (normalizedParagraphs.has(normalizedParagraph)) {
      validationErrors.push(
        `Duplicate editorial paragraph detected at ${slug}.${field}`,
      );
    }
    normalizedParagraphs.add(normalizedParagraph);

    for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) {
      const normalizedSentence = sentence
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      if (wordCount(normalizedSentence) < 8) continue;
      if (normalizedSentences.has(normalizedSentence)) {
        validationErrors.push(
          `Duplicate editorial sentence detected at ${slug}.${field}`,
        );
      }
      normalizedSentences.add(normalizedSentence);
    }
  }
}

if (validationErrors.length > 0) {
  throw new Error(validationErrors.join("\n"));
}
