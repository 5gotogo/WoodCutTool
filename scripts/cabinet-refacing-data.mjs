export const sources = {
  process: ["CabinetPro’s refacing sequence", "https://cabinetproindy.com/cabinet-refacing/process"],
  measuring: ["Hampton Bay measuring and care guide", "https://images.thdstatic.com/catalog/pdfImages/aa/aa4f50a2-49c9-400d-aca0-0d3baf696b90.pdf"],
  hinges: ["Blum concealed hinge technical manual", "https://d2.blum.com/BEC003/concealedhinges_ep_dok_bus_%24sen-us_%24aof_%24v17.pdf"],
  veneer: ["WiseWood Veneer refacing instructions", "https://wisewoodveneer.com/learning-center/installation-instructions/cabinet-refacing-instructions/"]
};

export const phases = [
  ["Survey", "Decide which cabinets can stay and measure them from a consistent reference."],
  ["Size", "Work out opening geometry, hinge requirements and neighboring clearances."],
  ["Verify", "Test the new face and hardware on one representative cabinet."],
  ["Install", "Release the order, fit the fronts and check the whole run."]
];

export const chapters = [
  {
    slug: "inspect-existing-cabinets", phase: "Survey",
    title: "Inspect the Existing Cabinet Boxes",
    summary: "Decide which cabinets can be refaced by checking the substrate, frames, anchorage and usable layout.",
    sections: [
      ["Walk the run with the old fronts installed", "Operate every door and drawer. Note rubbing, wide gaps, loose hinges and collision points before removing anything. Photograph the run closed, then photograph each problem with the door open so the obstruction remains visible. Mark the cabinet on a simple elevation sketch and use the same identifier on the front and hardware bag."],
      ["Check the box and mounting surfaces", "Look closely below the sink, beside the dishwasher and around previous repairs. Inspect for swelling, active moisture, loose joints, delaminating skins and damaged hinge mounting areas. Check whether the face frame is sound and whether the cabinet moves when used. Leave a damaged or loose box out of the door schedule until the underlying problem has been assessed and corrected."],
      ["Choose the work for each cabinet", "Record the intended scope per cabinet. An existing front in good shape might only need a compatible finish. A sound cabinet with a worn front can be a refacing candidate. An opening that needs reconstruction may change dimension after repair, so reserve its label and defer the final measurement until the work is complete."],
      ["Record what the survey established", "B03 in the worked example has a sound face frame and two worn doors. Its old left door grazes the adjacent pull. Keep the cabinet on the scope list and flag the left side for a swing test. The condition survey establishes that the box can be considered for refacing. The open-door clearance still needs separate evidence."]
    ],
    check: "Every cabinet has a stable ID and a condition decision. Hold any opening whose box, mounting surface or moisture problem is unresolved.",
    source: "process", related: ["Use the assembly check workflow", "/assembly-check/"]
  },
  {
    slug: "measure-finished-openings", phase: "Survey",
    title: "Measure Cabinet Openings From a Common Datum",
    summary: "Record repeat measurements and dry-fit the finished opening before committing front dimensions.",
    sections: [
      ["Label each opening from the front", "Sketch the cabinet run as you see it while standing in front. Mark left and right on the elevation and assign a unique ID to each opening. Add a reference line for the intended top row of fronts. Keep old front sizes in a separate column so they cannot be mistaken for opening measurements."],
      ["Measure the edges and diagonals", "Measure width at the top, middle and bottom, then height at the left, center and right. Check both diagonals as a cross-check. Use a straightedge to locate a bowed stile or rail. Equal diagonal lengths alone do not establish a clear rectangle when an edge curves or the two sides sit out of plane."],
      ["Confirm the finished rectangle", "Where veneer, edge strips or a repair will change the inside edges, dry-fit the build-up and remeasure the opening at the intended front plane. For inset, use a rigid rectangular template to confirm that the proposed reference rectangle fits at its actual position. Taking the smallest width and height independently can miss a skewed corner."],
      ["Carry the datum into the worksheet", "For B03 record a verified 600 × 700 mm finished opening. Keep the two diagonal readings and a note about the left-hand obstruction beside the drawing. The worksheet accepts the confirmed width and height. If a rectangular reference cannot be established, resolve the fit at the cabinet before adding the opening."]
    ],
    check: "The record identifies the finished opening plane, all six edge readings and the location of the confirmed rectangle.",
    source: "measuring", related: ["Measure nearby fillers and wall profiles", "/built-in-scribe/"]
  },
  {
    slug: "overlay-inset-and-paired-doors", phase: "Size",
    title: "Size Overlay, Inset and Paired Cabinet Doors",
    summary: "Calculate finished front sizes using separate perimeter allowances and an explicit center gap.",
    sections: [
      ["Decide which rectangle the numbers describe", "Use the finished inside opening as the reference. For overlay doors, enter how far the front extends beyond each opening edge. For inset doors, enter the clearance inside each edge. A visible gap between adjacent overlay fronts belongs to the run drawing. It is measured between front outlines, after sizing both openings."],
      ["Apply the perimeter allowances", "An overlay front span equals opening width plus the left and right overlaps. Apply the same calculation to height using the top and bottom overlaps. An inset span subtracts the respective clearances. A 400 × 600 mm inset opening with 2 mm left and top clearances and 3 mm right and bottom clearances yields a 395 × 595 mm single front."],
      ["Reserve the center gap before splitting", "For a pair over one uninterrupted opening, subtract the center gap once, then divide the remaining width by two. Use the same calculated height for both leaves. The worksheet centers the gap within the total front span. For doors that meet on a fixed center stile or have unequal widths, record the geometry in a separate drawing and size each side from its own reference."],
      ["Check the order increment", "Compare the nominal dimensions with the supplier’s allowed increments and written tolerances. If the supplier asks for whole millimeters and the worksheet returns half a millimeter, check both leaf widths and the resulting center gap after any change. Keep the approved width and height in the order record alongside the original calculation."]
    ],
    check: "A scaled or full-size drawing shows both perimeter edges and any meeting gap. Any size rounding has been reviewed against that drawing.",
    source: "measuring", related: ["Review cabinet overlay and inset terms", "/learn/cabinet-door-overlay-and-inset-guide/"]
  },
  {
    slug: "choose-hinges-and-check-swing", phase: "Size",
    title: "Match the Hinge and Check the Door Swing",
    summary: "Use model-specific hardware data and a physical swing check before approving boring or ordering.",
    sections: [
      ["Record the hardware as a set", "Record the hinge model and mounting plate together. Note the cabinet construction, mounting face, desired overlay or inset position and finished front thickness. If reusing old hardware, identify the actual model and test it on the new front thickness and profile. Treat a reused cup position as a measurement to verify."],
      ["Read the drawing for the selected parts", "Use the manufacturer’s table for the selected hinge, plate and front. Look for the permitted boring distance, cup depth, plate offset, opening angle and minimum clearance with that front thickness and edge detail. A cup diameter alone leaves several of those dimensions unspecified. Enter the approved boring details in the supplier’s format."],
      ["Trace the sweep across real obstacles", "Mark the cabinet wall, filler, appliance handles, pulls and the neighboring door. A closed elevation can look clear while the outside edge of the swinging front moves into the adjacent hardware. Include thickness and the planned pull in a representative mock-up. Test all positions needed for shelves and drawers to clear."],
      ["Test the demanding opening first", "At B03, use the left-side obstruction as the first test. Fit a representative leaf with the selected mounting system and handle projection. Open the neighboring front and test both in the combinations used day to day. If the fronts meet, change the geometry or cabinet detail and repeat before releasing the pair."]
    ],
    check: "The exact hinge and plate are recorded, the mounting and boring dimensions have been checked, and the mock-up clears its neighbors through the required motion.",
    source: "hinges", related: ["Trace a cabinet door collision", "/troubleshooting/cabinet-doors-collide/"]
  },
  {
    slug: "veneer-ends-and-finish-samples", phase: "Verify",
    title: "Plan Veneer, End Panels and Finish Samples",
    summary: "Map the surfaces that will show and verify the finished edge build-up before final measurements.",
    sections: [
      ["Make a face map before pricing material", "Mark the exposed end panels, frame stiles and rails, toe kicks and edges visible when doors open. Mark grain direction and each planned seam. Keep door faces and cabinet skins in separate material groups so a change in one finish does not silently alter the entire order."],
      ["Confirm the substrate for the chosen system", "Read the veneer or coating instructions for cleaning, preparation and compatible substrates. Check an inconspicuous section or representative sample before committing the visible run. A glossy, contaminated or loose surface needs attention before applying a skin. Keep the actual adhesive and finish product details with the sample record."],
      ["Dry-fit where surfaces meet", "Check end-panel thickness against walls, countertop overhangs and appliance space. Bring the new edge material into the opening during the mock-up to see where it changes the clear rectangle. Lay out seams around the stile and rail joint, then verify the appearance next to the intended door sample in the room’s lighting."],
      ["Measure again after the face is established", "Take final measurements once the new edge position is confirmed. If the finished opening changes, replace the old measurement in the worksheet and check the door sweep again. Keep the dated sample or a record of its material stack so the installed layer sequence can be compared with what was approved."]
    ],
    check: "The surface sample, grain direction, seam layout and final edge build-up are approved before releasing affected front sizes.",
    source: "veneer", related: ["Estimate the finish for prepared surfaces", "/finishing-planner/"]
  },
  {
    slug: "first-door-mockup", phase: "Verify",
    title: "Verify One Cabinet Door Before Ordering the Batch",
    summary: "Use a full-size template and a fitted trial door to check gaps, boring and real operating clearance.",
    sections: [
      ["Pick the cabinet most likely to fail", "Choose the opening with the tightest filler, the thinnest mounting area or the most demanding shared reveal. For a set with several hardware or construction combinations, plan a representative check for each combination that can change fit. A successful trial on a roomy cabinet gives little evidence for a blind corner."],
      ["Use a template for the closed position", "Make a stable full-size template for each relevant finished outline. Register it at the planned top and side positions. Use measured spacers to inspect where reveals close up. On a pair, place both templates together and verify the center gap and alignment with the cabinet’s edge conditions."],
      ["Use a fitted trial for movement", "Check the selected hardware on a representative front with the actual thickness, edge shape and pull projection. Mount it using the proposed plate and support. Work it through the needed opening arc and check nearby drawers or appliances. Document the maximum opening you need and any position where the front rubs, projects into another opening or restricts access."],
      ["Write down what changed", "Record the trial front size, hardware model, boring details, finish build-up and any change to the original sketch. If a single adjustment uses most of the available travel to hide a crooked frame, investigate the mounting surface before relying on that adjustment for a batch. Save the revised measurement and run the trial again where warranted."]
    ],
    check: "A full-size check establishes the closed gaps and a fitted trial establishes movement. Both use the same dimensions and material stack intended for the order.",
    source: "hinges", related: ["Check an existing drawer’s mounting space", "/drawer-fit/"]
  },
  {
    slug: "door-schedule-and-installation", phase: "Install",
    title: "Release the Door Schedule and Install by Opening ID",
    summary: "Turn verified nominal sizes into a supplier-ready order and track front fit through installation.",
    sections: [
      ["Keep a review record beside the CSV", "Export the worksheet to capture each leaf’s nominal width and height. Add the selected material, thickness, profile, finish, grain orientation, hardware identifiers and tested boring separately. Use the supplier’s requested left or right convention and state the view used. A spreadsheet row is easier to check when it matches the label on the cabinet elevation."],
      ["Check the order as one elevation", "Review each door against its own opening and then against the neighboring fronts. Compare the finished sizes with the supplier’s tolerances, increments and door-size limits. Mark entries that still need a template or hardware check. Compare the final order confirmation with the approved elevation before authorizing the batch."],
      ["Verify the delivered fronts before fitting", "Match the pieces by ID and confirm the delivered dimensions, face orientation and boring before committing the whole run. Start on the cabinet used for the trial. Use the intended reference line and follow the hinge instructions for adjustment. Recheck the full swing after the closed reveals are aligned."],
      ["Finish with an operating check", "Operate both doors in a pair, the adjacent drawers and any nearby appliance doors. Look for rubbing, skewed reveals, loose hardware and interference that only shows when two fronts are open. Photograph the accepted run and archive the approved schedule so later replacements can use the same opening IDs."]
    ],
    check: "Each delivered front matches an approved opening and has passed the closed-gap and operating checks in place.",
    source: "measuring", related: ["Diagnose inconsistent reveals across the run", "/troubleshooting/cabinet-reveals-change-across-run/"]
  },
  {
    slug: "worked-example-overlay-pair", phase: "Install",
    title: "Worked Example for a Pair of Overlay Doors",
    summary: "Follow cabinet B03 from a 600 × 700 mm opening to two nominal 310.5 × 718 mm replacement fronts.",
    sections: [
      ["Record the opening and the constraint", "B03 is an illustrative face-frame base cabinet with one uninterrupted opening. The finished rectangle is 600 mm wide and 700 mm high. The left side sits near a neighboring pull, so the swing check is part of the job from the first survey. Mark the opening B03 and label the two leaves left and right from the front."],
      ["Build the closed front span", "The plan has 12 mm of overlay on both sides, 10 mm at the top and 8 mm at the bottom. Adding the perimeter overlays gives a 624 mm horizontal span and a 718 mm height. The face starts 12 mm left of the opening and 10 mm above it. Using unequal top and bottom overlays keeps that shift visible in the drawing."],
      ["Split the span with one meeting gap", "The plan reserves a 3 mm center gap. Subtract 3 mm from 624 mm to leave 621 mm for the doors, then divide by two. Each nominal front is 310.5 × 718 mm. The two widths plus the gap add back to 624 mm. Use that arithmetic as a cross-check on the pair before making the template."],
      ["Review the real fit before releasing B03", "Load B03 in the worksheet, add it to the schedule and check that the CSV has both leaf rows. Fit the full-size outlines at the planned height. Then test the selected hinge and handle against the neighboring pull. A 3 mm meeting gap and the stated overlays are project assumptions for this example. The hardware documentation and trial determine whether they are usable in the real cabinet."]
    ],
    check: "The example calculation produces two 310.5 × 718 mm rows. A physical test still decides whether the left-hand swing can be released.",
    related: ["Load the B03 worksheet example", "/cabinet-refacing/#worksheet"]
  }
];
