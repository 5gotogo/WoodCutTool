const manufacturer = ["ClosetMaid installation and planning guides", "https://homedepot.closetmaid.com/en-US/Installation/Pages/how-to-guides.aspx"];
const shelfTests = ["WoodBin measured shelf deflection experiments", "https://woodbin.com/ref/shelf-sag-measurements/"];
const survey = ["Built-in cabinet scribing", "/built-in-scribe/"];
const fit = ["Furniture fit and delivery", "/furniture-fit/"];
const pins = ["Shelf Pin Studio", "/shelf-pin-layout/"];
const drawers = ["Drawer Fit Studio", "/drawer-fit/"];
const sag = ["Shelf sag calculator", "/shelf-sag-calculator/"];
const edging = ["Edge banding planner", "/edge-banding/"];
const sheet = ["Plywood cut calculator", "/plywood-cut-calculator/"];
const assembly = ["Assembly Check", "/assembly-check/"];

export const stages = [
  { id: "survey", title: "Survey the space", intro: "Find the usable envelope and the routes into it." },
  { id: "layout", title: "Lay out the bays", intro: "Fit the items you store and preserve everyday access." },
  { id: "fabricate", title: "Prepare parts and hardware", intro: "Turn verified openings into labels, blanks and hardware checks." },
  { id: "install", title: "Install and diagnose", intro: "Set the run true, make changes in order and record what was built." }
];

export const guides = [
  {
    stage: "survey", slug: "measure-at-three-heights", title: "Measure a closet opening at three heights",
    summary: "Record low, middle and high widths on the same reference plane and carry the tightest measured width into the plan.",
    sections: [
      ["Set the reference plane", "Mark the proposed front of the uprights on both side walls with removable tape. Make every width reading between walls at that plane. Take a second series near the rear edge of the panels and check for bows between stations. If that series is tighter, use its readings or reduce the front readings to reflect the verified opening and keep the original numbers in your notes."],
      ["Check ceiling and floor independently", "Use a level line to compare floor heights under all uprights. Measure toward the lowest overhead point from the proposed level base, reserving space for shims, a platform or ceiling trim as needed. A nominal ceiling height measured beside the doorway tells you little about an upright below a soffit at the back."],
      ["Close the width chain", "If the three readings are 1824, 1810 and 1816 mm, start the run from 1810 mm. Label each measured position. A filler sized from the wider reading can consume the allowance needed to slip the run through the narrow band."]
    ], check: "Recheck the narrowest point and the tallest finished obstruction with a second reading before releasing panel dimensions.", related: survey
  },
  {
    stage: "survey", slug: "map-doors-and-obstructions", title: "Map door tracks, trim and closet obstructions",
    summary: "Turn hinges, tracks, service access and trim into explicit keep-outs before setting panel depth.",
    sections: [
      ["Introduce a common depth datum", "Mark the rear reference plane, then measure the distance to the innermost surface of any door, handle or guide through its travel. Record objects protruding forward from the rear plane separately. At each obstruction, check the remaining distance between the back of the organizer and the moving door."],
      ["Draw the moving envelope", "Mask the proposed face on the floor. Operate each door through its full travel and mark the sweep or overlap in every usable position. A folding leaf can swing into a linen basket during opening even if it folds clear at the end. Treat the sweep and the parking area as separate checks."],
      ["Keep services accessible", "Mark outlets, access panels, vents and cleanouts on the same sketch. Keep the required working and removal space available. Stop the panel run or revise the layout if service access would require dismantling the closet."]
    ], check: "Tape up a cardboard panel at the tightest point and cycle all existing doors. Repeat with the thickest intended handle or bin.", related: fit
  },
  {
    stage: "survey", slug: "allow-for-baseboards-and-fillers", title: "Budget closet fillers and baseboard clearance",
    summary: "Reserve space for irregular walls and trim before assigning any clear bay widths.",
    sections: [
      ["Separate three dimensions", "Record the planner's horizontal allowance, the rough blank width needed to cover the maximum gap, and the installed width after scribing. These can all differ. For example, a run might budget 30 mm at one end, need a 41 mm rough strip to cover a bow, and finish with a face that varies from 26 to 36 mm."],
      ["Choose the baseboard treatment first", "Decide where existing trim stays, where it ends against the organizer and whether a raised base lets a panel pass in front. Map the top and projection of each baseboard. A width check taken above the trim cannot verify that the bottom of an unnotched upright will fit."],
      ["Preserve the finished face", "Position the straight cabinet face first, with independent reserves for the left and right walls. Fit the blanks against the actual installed geometry and mark each against its own wall. Keep the factory or finished edge facing the bay where it stays visible."]
    ], check: "Review both wall profiles, finish thickness and any door swing before committing filler stock or panel width.", related: survey
  },
  {
    stage: "survey", slug: "check-panel-delivery-and-tilt", title: "Check the delivery path and panel tilt-up",
    summary: "Screen tall uprights against the transport route and the space needed to raise them.",
    sections: [
      ["Test the longest piece", "Start with the full-size upright and include the packaging or protective pads if carried in place. Walk the route from the delivery point to the installation wall. Check door stops, tight corners, railings and ceiling drops rather than relying on nominal door sizes."],
      ["Screen the rotation", "For a rectangular upright tipped up in its height–depth plane from a level floor, the swept top corner can reach the panel diagonal. A 2100 × 520 mm panel has a diagonal of about 2163 mm. This check assumes a clear rectangular space and a pivot at the floor. A raised platform or different rotation path changes the check."],
      ["Change the assembly order early", "If the full upright cannot travel or rotate as planned, investigate assembling smaller components in the room or revising the design with properly supported sections. Reserve the work area for the rotation and verify that the person handling the panel can step clear."]
    ], check: "Rehearse with a light full-size outline before bringing finished panels into the room.", related: fit
  },
  {
    stage: "layout", slug: "size-single-hanging", title: "Size a single-hanging closet bay",
    summary: "Lay out a rail and shelf around the longest garments on the actual hangers.",
    sections: [
      ["Measure from the bearing point", "Hang the longest coat or dress on the intended hanger. Measure from the point where the hook bears on the rod to the hem and include the gap you want to leave below it. If the longest drop is 1130 mm and you want 80 mm above a shoe shelf, place the rod bearing point at least 1210 mm above that shelf's finished top."],
      ["Test depth with a filled hanger", "Check the deepest shoulder and sleeve projection at the proposed rod centerline. Leave room behind for the garment and in front for the door and any handle projection. Roll the garment slightly on the rod to see how it moves while you take it out."],
      ["Allow for hardware access", "Check that the hook can lift free below the shelf. If the rod uses a closed socket and an open socket, verify the insertion direction and clearance before fixing the shelf above. Follow the supplied support and fastener instructions for the hardware you actually select."]
    ], check: "Hang the longest and deepest garment and remove each while the adjacent bay is occupied.", related: manufacturer
  },
  {
    stage: "layout", slug: "size-double-hanging", title: "Fit two tiers of short hanging",
    summary: "Set the rail levels against real garment drops and the movement needed to remove hangers.",
    sections: [
      ["Sort garments into two test sets", "Measure each set while hanging rather than laid flat. Place bulkier jackets on the set that has more open depth. If upper garments hang down 770 mm and lower hanger hooks need another 65 mm of release room, allow at least 835 mm between the upper bearing point and the lower rail before testing by hand."],
      ["Work from the lower obstruction", "Set the lower rod high enough to clear shoes, baskets or the base when loaded. Then confirm that the upper rod can be reached comfortably and the hooks can lift clear of any cap shelf. Check the tall divider for hardware collisions where rods mount from opposite sides."],
      ["Use a full-depth trial", "Put both rails temporarily at their proposed levels using a safe mock-up and load a few garments. Check that lower shirts can be taken out without dragging sleeves through the upper row and that hanging clothes do not foul the bypass or folding door."]
    ], check: "Record both rod centerlines from the same base datum, together with the tested hook clearance.", related: manufacturer
  },
  {
    stage: "layout", slug: "plan-a-linen-shelf-stack", title: "Plan adjustable linen shelves around real stacks",
    summary: "Size clear shelf openings and reach depth for towels, folded bedding and bins.",
    sections: [
      ["Measure a usable load", "Fold the largest item as it will be stored. Measure the width, depth and height of a typical stack and allow room to get one hand above it. A 310 mm stack needs more than 310 mm clear height if the top item must slide out without catching."],
      ["Use the practical front edge", "Start with the bin or linen that has to clear the shelf face. For a deep shelf, decide whether the second row needs its own pull-out container. A slightly shallower shelf can make everyday items easier to find and preserve reach through a narrow door."],
      ["Reserve height for the layers", "When comparing clear openings, count each shelf's actual thickness and any fixed members in the same vertical stack. Keep the heaviest items at a reachable low position consistent with the verified support system. Leave pin positions above and below the first set-up for later adjustment."]
    ], check: "Mock up the narrowest opening and physically remove the widest folded item or bin you plan to store there.", related: pins
  },
  {
    stage: "layout", slug: "align-bays-with-bypass-doors", title: "Align closet bays with bypass door openings",
    summary: "Use each door's actual parking positions to locate the dividers and keep wide bins removable.",
    sections: [
      ["Measure both access windows", "Slide the leaves all the way in one direction and mark the clear interval from the left wall datum. Repeat in the other direction. Measure the tight interval between trim, stops and protruding pulls at the height of the object you want to remove."],
      ["Compare intervals rather than widths", "A 680 mm bin can fit a 720 mm bay and still strike a door edge if only 630 mm of that bay is exposed. Draw the start and end of every bay on the same line as both access windows. Move the divider or choose smaller items until the required extraction path is open."],
      ["Allow fingers and turning room", "Check bulky contents with handles, hands and any slight tilt needed to lift past a shelf lip. For drawers or baskets on slides, test the full straight extension at the intended height with each door fully parked."]
    ], check: "Write down which door position exposes each bay and remove a full-size mock bin from both ends.", related: drawers
  },
  {
    stage: "layout", slug: "plan-walk-in-corners", title: "Treat walk-in closet corners as shared space",
    summary: "Allocate each corner to one run and verify the clear aisle after handles and garments are in place.",
    sections: [
      ["Draw each leg on the floor", "Mark both finished faces, including the door or clothing projection. Where runs meet, shade the overlap and designate which one continues into the corner. Back the other run away far enough that the first bay on each leg can be used."],
      ["Check the narrowest working aisle", "Draw the outline of the most projecting drawer or door when open. Include knobs, draped garments, and the person reaching for them. Compare the aisle at the adjacent corner and at the entry. Test with a box at the height of the extended drawer as well as tape on the floor."],
      ["Keep the takeoff leg-specific", "Calculate each straight run separately. Remove the return's keep-out from the input envelope before calculating the second leg, and label that leg's CSV and upright positions with its wall name. Account for any corner-specific fitting separately so the same panel does not appear on both lists."]
    ], check: "Stand at the corner and rehearse removing an item from each run while the neighboring storage is in use.", related: fit
  },
  {
    stage: "fabricate", slug: "choose-sheet-goods-and-edges", title: "Choose closet panels and plan finished edges",
    summary: "Measure actual thickness, pick the show faces, and account for edging before releasing saw blanks.",
    sections: [
      ["Measure the batch", "Measure representative sheets away from a damaged edge. If four uprights are actually 18.4 mm but the width budget used 18 mm, the assembled bays have 1.6 mm less total space. Where thickness varies enough to affect joints, assign panels and use a measured cut list rather than treating the stock as one thickness."],
      ["Map the visible surfaces", "Use an upright label with wall, bay interface, face and top. Determine which front and end edges will be banded. On parts trapped between two panels, verify whether edging builds up a controlled width or sits on an uncontrolled front edge. Use the finished dimension as the check after trimming."],
      ["Reserve stock for finishing trials", "Make a small sample with the actual sheet, edge tape and coating. Check corner cleanup, adhesion and how the surfaces look under the closet light. Confirm that shelf depth still fits the door envelope after edge build-up."]
    ], check: "Match the released saw dimensions and edge map to a sample part before cutting the full batch.", related: edging
  },
  {
    stage: "fabricate", slug: "check-shelf-span-and-support", title: "Check closet shelf span and support before cutting",
    summary: "Review the actual unsupported span, load pattern and support detail for the shelf you intend to build.",
    sections: [
      ["Start from the bearing points", "The width of a shelf blank describes the physical part. Measure the distance between actual bearing points for a sag check, and use the finished depth and thickness. Accurately describe whether the shelf rests on pins or is fixed into the side panels."],
      ["Distinguish the load patterns", "Evenly spread towels and a heavy bin centered on the same shelf can give different deflections. Material stiffness varies, and sustained loads can increase deflection. Use the expected worst storage pattern for a preliminary check, then confirm the panel and hardware are suitable for their intended duty."],
      ["Revise the support layout", "If the span is too generous, split it with a properly supported upright, shorten the bay, or design a stiffer shelf with appropriate support. Recompute the width chain after adding a divider, because its thickness uses space even when its only purpose is to support shelves."]
    ], check: "Record the expected shelf use and the verified bearing or hardware detail alongside the finished dimensions.", related: sag, source: shelfTests
  },
  {
    stage: "fabricate", slug: "drill-adjustable-shelf-pins", title: "Drill paired shelf-pin rows on shared uprights",
    summary: "Register both faces from consistent edges and check opposing holes, fasteners and shelf support positions.",
    sections: [
      ["Mark each face and bay", "A divider can serve bays on both sides. Identify left and right faces and mark the front edge and base datum on both. Lay out each row from that datum, with mating rows across the bay at the same heights. Use a test panel to verify the jig registers correctly when flipped."],
      ["Protect the middle of the panel", "Check hole depth and minimum remaining material against the selected pins and panel construction. Two 10 mm deep blind holes drilled on the same axis in an 18 mm panel overlap by 2 mm. Resolve opposing hole depth or positions before drilling, while preserving aligned supports within each individual bay."],
      ["Mask interference bands", "Mark fixed shelf joints, rod sockets, rail fasteners and slide screws before laying out long drilling rows. Remove overlapping positions and keep a written map of any intentionally blank range so a future adjustment does not use mismatched holes."]
    ], check: "Seat four pins in corresponding holes in the dry fit and check that the shelf bears on all four.", related: pins
  },
  {
    stage: "fabricate", slug: "size-rods-and-sockets", title: "Measure clothes rods between the installed sockets",
    summary: "Use the chosen socket engagement and fitting method to convert a bay opening into an actual rod length.",
    sections: [
      ["Use the hardware as a gauge", "Identify both socket types and determine where the rod ends seat. Measure between the installation faces once the bay is square and the sockets are in place. Then apply the product's instructions for seating, end clearance or telescoping engagement."],
      ["Check exit clearance", "An open socket can permit the rod to drop in from above if there is free space below the shelf. A pair of captive sockets may require a different order. Rehearse insertion with a scrap or telescoping gauge before committing the finished rod."],
      ["Verify support requirements", "Use the hardware maker's span and load guidance for the chosen rod, its end supports and any intermediate support. Verify that fasteners on adjacent faces of a shared upright do not meet inside the panel. Record left and right end treatment separately for an asymmetric pair."]
    ], check: "Label each rod to its measured bay, dry-fit the end condition and verify the actual support configuration before loading.", related: manufacturer
  },
  {
    stage: "fabricate", slug: "release-a-closet-parts-list", title: "Release a closet parts list with checked dimensions",
    summary: "Turn the panel schedule into a shop list with finished sizes, grain direction, edge work and separate hardware decisions.",
    sections: [
      ["Keep the width chain visible", "Record the verified tight opening, each side allowance, all uprights and the clear width of each bay. In a shared-upright run, three bays use four uprights. Any unallocated width needs an explicit location in the final plan, such as a larger reserve at an end."],
      ["Add missing fabrication details", "Group identical shelf blanks only after checking finished depth, edge treatment and visible face. Add material, grain, edging and machining to the job list. Create separate rows for the platform, rails, back, fixed shelves or joinery features required by the chosen construction."],
      ["Release sheet layout last", "After checking individual parts, transfer the saw blank dimensions into sheet layout with actual sheet size, trimming, blade kerf and grain settings. Keep the preliminary organizer CSV next to the released list so a revised field measurement can be followed through the affected rows."]
    ], check: "Rebuild the total width from the released list and independently verify quantities at both ends and each shared divider.", related: sheet
  },
  {
    stage: "install", slug: "level-the-base-and-uprights", title: "Set a level base and plumb closet uprights",
    summary: "Establish one installation datum so shelves and doors remain aligned across the entire run.",
    sections: [
      ["Map support points", "Mark floor readings under each proposed upright rather than just at the ends. Set a common level bearing plane based on the high point and the planned support system. Use a base or properly supported shims compatible with the loads and your design."],
      ["Align in two directions", "With the parts safely supported, check every upright for plumb left to right and front to back. Use a straightedge or string line across the faces. A partition can stand vertical while sitting forward of its neighbors, which moves both shelf pin rows and door hardware."],
      ["Check again after fastening", "Record clear bay widths at front and back before and after attachment. Fastening over an unsupported wall gap can pull a panel out of line. Resolve the bearing or packing detail and recheck the diagonals before sizing trapped parts."]
    ], check: "Recheck contact at the base, plumb at each upright and the continuous face line before installing movable fittings.", related: assembly
  },
  {
    stage: "install", slug: "verify-wall-attachment", title: "Verify wall attachment before loading a closet",
    summary: "Identify the substrate and retain the selected system's fastening and support details with the job record.",
    sections: [
      ["Identify what is behind the finish", "Document known framing, masonry, backing or services at the planned attachment positions. If substrate condition or hidden service clearance cannot be confirmed, stop before drilling and resolve it with a qualified installer. Keep the positions referenced to the same wall datum used for the layout."],
      ["Read instructions for the actual system", "Floor-supported uprights need an appropriate restraint design, and a suspended system transfers its load through the wall attachment. Follow the organizer and hardware instructions for the actual wall and required fastening pattern. Published instructions for a branded wire or laminate system apply to its specified parts and assembly."],
      ["Inspect the finished attachment", "Check that each rail or restraint is seated, that fastener locations match the verified substrate, and that adjustable standards and supports are locked in as required. Photograph concealed connections before closing them and record the hardware and installation instructions used."]
    ], check: "Withhold loading until support and anchorage have been verified for the installed system and substrate.", related: manufacturer
  },
  {
    stage: "install", slug: "diagnose-rocking-and-binding", title: "Diagnose closet shelves that rock or bind",
    summary: "Separate out-of-square bays, misregistered pin rows and thickened shelf edges before trimming a part.",
    sections: [
      ["Measure the bay empty", "Check the front and rear openings at the shelf height, then repeat above and below. If the front gap is correct but the rear narrows, check the face line and rear upright positions. A shelf that stops short can be reporting a twisted opening."],
      ["Swap the diagnostic piece", "Test a verified square blank in the same bay. Check the removed shelf diagonals and measure any edge tape buildup. If a correctly sized blank also rocks, inspect pin seating and row alignment with a straightedge before altering either shelf."],
      ["Change one condition at a time", "Correct unsupported bearings and alignment first, then retest the parts. If the bay is true and a single shelf is still tight, revise that shelf's finished dimensions and update its record. Keep paired or handed parts labeled during the corrections."]
    ], check: "Confirm the repaired shelf can be lifted, moved to a second tested position and reseated on all supports.", related: assembly
  },
  {
    stage: "install", slug: "final-closet-walkthrough", title: "Run a final closet installation walkthrough",
    summary: "Record fit, service access and hardware checks after installation so later adjustments start from the as-built geometry.",
    sections: [
      ["Check every motion from the doorway", "Cycle the original doors, then drawers, baskets and any swing-out hardware. Test complete travel with adjacent doors parked in their intended positions. Remove and replace a representative bin and the largest garment from each applicable bay."],
      ["Record what changed", "Capture the as-built clear widths, shelves that moved after dry-fit and actual rod lengths. Keep shelf pin keep-outs and hardware information with the drawings. Label and retain useful matched offcuts for future replacement shelves or fillers."],
      ["Hand over the limits", "Record the support and permitted loading information from the installed hardware and system. Show how to reposition a shelf with matching pin heights, how to check that every pin is seated and how to access any nearby service panels."]
    ], check: "Close the job with door travel verified, hardware documentation saved and unresolved fit or attachment items recorded before use.", related: assembly
  }
];

export const examples = [
  {
    key: "reach-in", title: "Three-bay reach-in with mixed hanging",
    summary: "Fit short hanging, a center shelf tower and a coat bay between two uneven walls.",
    sections: [
      ["Start with the tight width", "The middle reading of 1810 mm controls the layout. Two fillers together use 68 mm, and four 18 mm uprights use 72 mm, leaving 1670 mm for clear openings."],
      ["Assign the two priority bays", "Specify 620 mm for double hanging and 450 mm for the folded-linen tower. Leave the coat bay automatic, giving it 600 mm. A 2 mm total side allowance makes the middle shelf 448 mm wide before separate edge and machining decisions."],
      ["Test loaded depth", "The uprights are 520 mm deep and the shelf face is set back 20 mm. Choose the rod centerlines with hangers and clothes in the closet; the 500 mm shelf blank depth alone does not tell you the position of the rod."]
    ], check: "Test the coat's hem and shoulder clearance in the 600 mm bay before locating sockets.", related: "size-single-hanging"
  },
  {
    key: "bypass-doors", title: "Two shelf bays behind bypass doors",
    summary: "Keep bins removable when only one part of the closet is exposed at a time.",
    sections: [
      ["Size two clear bays", "Start with 1568 mm. With 52 mm of filler and 54 mm of uprights, the usable clear budget is 1462 mm. The planned clear openings are 700 and 762 mm, with ten shelves divided evenly between them."],
      ["Draw accessible intervals", "From the left datum, the bays are 44–744 mm and 762–1524 mm. Suppose the doors expose 40–725 mm on the left and 815–1530 mm on the right. The usable intersections are 681 and 709 mm, so a 720 mm bin would fail both access checks even though it fits geometrically in the right bay."],
      ["Choose storage using the narrower limit", "A 640 mm bin is a candidate for either position. Make a trial with handles and hands included and reserve depth for any knobs or overlap between leaves. Verify the access windows through the actual door travel."]
    ], check: "Remove a loaded-size bin from each bay with the doors parked as they will be during use.", related: "align-bays-with-bypass-doors"
  },
  {
    key: "linen", title: "Narrow linen closet with an offset divider",
    summary: "Make two supported shelf stacks with different widths for towels and folded bedding.",
    sections: [
      ["Check the low back corner", "The run starts from a tight width of 917 mm. Three 19 mm uprights and two 25 mm fillers leave 810 mm of clear width, split into 335 mm and 475 mm bays."],
      ["Fit shelves to the contents", "The widths with a 2 mm allowance are 333 and 473 mm, both 350 mm deep. Try the narrow side with a 305 mm towel stack and the wide side with a folded bedding set. Confirm that the selected shelf material and supports suit each loaded span."],
      ["Protect adjustability", "With six shelves on one side and five on the other, lay out separate pin boards using the same bottom datum. Check drill depth where rows are on both sides of the common divider and mask interference from the chosen fixed bracing."]
    ], check: "Verify the narrow bin clears the door stop and check that both bays retain useful alternate pin positions.", related: "plan-a-linen-shelf-stack"
  },
  {
    key: "walk-in", title: "Four bays along one wall of a walk-in",
    summary: "Size one straight run while reserving space for an intersecting return and an open aisle.",
    sections: [
      ["Reserve the corner", "The measured straight-run limit is 2564 mm. Allocate 48 mm on the left and 60 mm on the right for the approved fit envelopes, and measure the intersecting wall separately. Keep any additional corner setback outside this straight-run input."],
      ["Divide the remaining widths", "Five uprights consume 95 mm and the two allowances consume 108 mm. The 2361 mm clear budget leaves 1181 mm after specifying the first two bays at 700 and 480 mm. The two automatic bays receive 590.5 mm each."],
      ["Rehearse both runs together", "The 545 mm panel depth sets the proposed face line. Tape that line on the floor, add the real clothing projection and simulate opening an adjacent drawer. Confirm that the return's storage stays accessible through the narrowest part of the aisle."]
    ], check: "Keep the wall labels on the exported schedules and make sure no corner panel is counted twice.", related: "plan-walk-in-corners"
  }
];
