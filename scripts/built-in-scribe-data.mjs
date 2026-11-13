export const installationGuide = "https://www.ikea.com/ca/en/files/pdf/75/96/75961b46/sektion-kitchen-installation-guide-fy23-l2-en.pdf";

export const stages = [
  ["Survey", "Set the cabinet and take readings"],
  ["Size", "Choose the filler and blank"],
  ["Fit", "Transfer, trial-fit and verify"],
  ["Handoff", "Work an example and close out"]
];

export const guides = [
  {
    slug: "set-cabinet-datum", stage: "Survey", title: "Set a cabinet datum for scribing",
    description: "Mark a cabinet-side line and a finished face plane that the survey and fitting crew can reproduce.",
    sections: [
      ["Mark two references", "On a right-hand alcove filler, put the zero-width line on the straight right edge of the cabinet in the intended filler face plane. Mark zero along the length at the top of the filler. Measure down from that mark and horizontally from the cabinet toward the wall. Draw the directions next to the marks so a second person can recover the same readings."],
      ["Check which face the design calls for", "A flush filler and a filler recessed behind the door faces can touch the wall at different depths. If the wall twists through the depth of the filler, a reading from the front of the door gives the wrong width for a recessed filler. Use a square or a temporary face-plane reference, and include a side view on the survey sketch."],
      ["Resurvey after the cabinet moves", "Check the cabinet position after any leveling or alignment adjustment. A 3 mm sideways shift can change the whole gap series, and a rotation can change it by different amounts at the two ends. Label each survey with a revision and carry the revised origin into the template and the fitting notes."]
    ],
    task: "Write a one-sentence datum description and ask someone to reproduce a reading at a marked point.",
    related: ["/checklists/square-level-plumb-survey/", "Square, level and plumb survey"]
  },
  {
    slug: "measure-wall-gap-stations", stage: "Survey", title: "Measure a wall gap at named stations",
    description: "Record both ends and add readings where the wall changes shape or a finish interrupts the contact line.",
    sections: [
      ["Measure in a consistent direction", "Start with the top and bottom of a vertical filler and write each distance from the cabinet-side line toward the wall. Use the same measuring direction at every station. If a tape hook or a tilted rule changes the reading, use a suitable rigid gauge and repeat the measurement from the same marks."],
      ["Look between the regular readings", "At a drywall joint, a baseboard return or a repaired patch, take extra readings immediately above, on and below the feature. For example, an 18 mm gap at the ends of a short segment can hide a 25 mm recess midway. Walk the whole contact edge with a straight reference before choosing where to sample."],
      ["Record the state of the finish", "Write down whether tile, skirting, or wall panels are in their final position. Give a removable trim piece its own note and confirm who will handle it. When the finish is pending, mark those readings as preliminary in the datum notes and schedule a second survey after the final surface is in place."]
    ],
    task: "Add an extra station at the largest change you can see and compare its reading with the two closest stations.",
    related: ["/learn/built-in-bookcase-measurement-guide/", "Built-in bookcase measurement"]
  },
  {
    slug: "read-wall-bow-and-taper", stage: "Survey", title: "Read taper, bow and local steps in a filler survey",
    description: "Use the station sequence to decide where to check the wall again and where a full-size template will help.",
    sections: [
      ["Look for direction first", "A 30, 33, 36 and 39 mm series at equally spaced stations suggests a taper. A 30, 35, 39 and 30 mm series points to a wider gap in the middle. Compare changes with the actual station spacing. On a long filler, use a reference along the full height to check whether the change is gradual."],
      ["Keep steps tied to the finish detail", "A jump at the top of a skirting board can require a return, a notch, or a different termination. Record both sides of the step and its height. Sketch which finish stays in place and test the proposed joint on a template before committing a finished part."],
      ["Use the range as a check", "The widest gap minus the narrowest gives the spread in your recorded readings. A 45 mm maximum and 33 mm minimum give a 12 mm spread. Compare that value with the trial template and inspect unexpected differences before transferring a line onto the actual stock."]
    ],
    task: "Mark the widest and narrowest points on your sketch, then check the boundary around each one for a missed change.",
    related: ["/blog/cabinet-filler-scribe-survey-worked-example/", "Five-station cabinet filler survey"]
  },
  {
    slug: "budget-filler-blank-width", stage: "Size", title: "Budget the width of a filler blank",
    description: "Start from the largest measured gap and allow separately for measurement uncertainty and trimming stock.",
    sections: [
      ["Measure usable stock", "Check the blank width after any straightening or edge preparation. If a rough blank measures 52 mm at one end and 49 mm at the other, establish its usable straight width before entering a number. Label the reference edge that will face the cabinet and note how much length remains after end trimming."],
      ["Add the allowances once", "Use the maximum observed gap plus trimming allowance plus measurement allowance. For a 45 mm maximum, 4 mm of trimming stock and a 1 mm positive allowance for possible underreading, the worksheet asks for 50 mm. Keep dimensions in the same unit and make sure a shop note or cut-list formula has not already included the same allowances."],
      ["Review the station that drives the result", "A 48 mm blank against the 50 mm requirement is 2 mm short. Changing the input to a genuine 52 mm usable blank gives 2 mm in reserve at the widest recorded point. Check the actual workpiece and the full wall contact line before cutting. Choose the trimming allowance for the transfer setup and material you will use."]
    ],
    task: "Measure the actual blank and enter its usable width. Record what each allowance covers next to the survey revision.",
    related: ["/learn/cabinet-filler-and-scribe-strip-guide/", "Cabinet filler and scribe strip guide"]
  },
  {
    slug: "allocate-left-and-right-fillers", stage: "Size", title: "Allocate left and right fillers in an alcove",
    description: "Keep the cabinet run on its design centerline while checking each wall against its own set of readings.",
    sections: [
      ["Start with the intended run position", "Mark the cabinet run centerline or the feature it aligns with. Measure left and right gaps separately from the two cabinet edges at that position. A 76 mm total gap at one height might give 30 mm on the left and 46 mm on the right. Treating both sides as 38 mm would move the cabinet and change the surveyed gaps."],
      ["Check constraints on moving the run", "Before shifting the layout, review countertop overhangs, drawer operation, service access and joints with adjoining units. In an alcove desk, a shift to gain filler clearance on the hinge side may move the worktop away from a window centerline. Record which alignment governs and who approves a change."],
      ["Save a worksheet for each side", "Give the fillers separate part IDs and clearly name their origins. Download the first survey before starting the next. In the shop, group the records by project and revision while keeping each blank linked to its wall and cabinet edge."]
    ],
    task: "Write both filler IDs on a front elevation and label the side the installer should see when facing the cabinet.",
    related: ["/cabinet-studio/", "Cabinet Studio"]
  },
  {
    slug: "check-wall-side-door-clearance", stage: "Fit", title: "Verify door and drawer clearance beside a filler",
    description: "Check the actual handle, hinge travel and drawer extension against the finished wall and nearby trim.",
    sections: [
      ["Draw the hardware beside the finished wall", "Mark the door overlay or inset condition and the depth of the filler face. Include the real handle and the closest wall projections such as a window stool or return. Consult the installation information for the selected cabinet and hardware when assigning clearances."],
      ["Test the full opening path", "Use the installed hardware or a representative mock-up. Watch a wall-side handle as it moves from closed to the angle needed to access the interior. Pull drawers through their intended extension and check the clearance needed to remove trays or bins. An obstruction can appear at an intermediate position."],
      ["Recheck after adjustments", "If a door overlay or hinge setting changes, check the movement again before finishing the joint. If the cabinet must move, update the wall-gap survey and recheck the blank. Keep the hardware check in the handoff record alongside the readings so the crew can repeat both."]
    ],
    task: "Identify the closest obstruction and record the hardware configuration and point in travel where you checked it.",
    reference: true, related: ["/door-installation/", "Door Installation Studio"]
  },
  {
    slug: "transfer-scribe-to-template", stage: "Fit", title: "Transfer an irregular wall profile to a template",
    description: "Preserve the cabinet datum, show the reference face and verify the transfer offset before marking the filler.",
    sections: [
      ["Establish a repeatable setup", "Mark the top, finished face and cabinet-side edge on a trial strip. Hold it in a reproducible position relative to the installed cabinet. If the blank overlaps the wall at the final plane, use a suitable offset or trial template that lets you transfer the intended contact line while preserving the orientation."],
      ["Test the transfer at known points", "With the chosen scribing tool, make trial marks at two measured stations and compare the transferred widths with the survey. A constant difference can indicate an unaccounted offset. A difference that grows along the part can indicate a shifted origin, a change of angle or a bowed reference. Resolve those differences on the template."],
      ["Mark the keeper and waste", "Label the side of the line that stays with the cabinet datum. With a mirrored left-side part, verify the finished face before transferring the template. Compare the transferred outline with the blank width and inspect any portion close to the edge before trimming."]
    ],
    task: "Compare the template with the observed maximum gap and with a local trim transition before marking the finished stock.",
    reference: true, related: ["/checklists/filler-scribe-installation/", "Filler and scribe installation checklist"]
  },
  {
    slug: "dry-fit-and-recheck-the-filler", stage: "Fit", title: "Dry-fit a scribed filler and read the contact marks",
    description: "Use contact points, face alignment and full-length inspection to decide where the fitted edge needs refinement.",
    sections: [
      ["Return to the original face plane", "Place the trial piece in the intended position with its cabinet edge on the marked line and its end at the survey origin. Check the face with a straightedge across the cabinet and filler. If the filler rocks, mark the contact points and confirm whether they come from the wall edge or an obstruction behind the face."],
      ["Read a mismatch before removing stock", "A local high spot can hold the rest of the filler away from the wall. Check the marked contact areas before removing material along a whole edge. A gap that grows uniformly from end to end calls for a check of the reference or orientation. An already undersized area may need a replacement blank."],
      ["Verify the final position with hardware fitted", "Confirm the joint, face alignment and the intended attachment access during a complete dry run. If fastening changes the face alignment or squeezes the cabinet out of position, review the support and fixing plan for the actual cabinet system. Repeat the operating checks before handing off."]
    ],
    task: "Mark one contact point and one open gap on the trial piece. Confirm which is driving the fit before making a correction.",
    related: ["/troubleshooting/cabinet-filler-too-narrow/", "Diagnose an undersized cabinet filler"]
  },
  {
    slug: "alcove-desk-filler-example", stage: "Handoff", title: "Worked example for a right-hand alcove desk filler",
    description: "Follow a five-station survey from a drywall patch to the choice of a wider usable blank.",
    sections: [
      ["Record the end points and the patch", "The example uses a 720 mm filler measured downward from the top. The gaps at 0, 180, 310, 540 and 720 mm are 33, 36, 45, 41 and 34 mm. A shallow patch near 310 mm prompted the extra station. The measured spread is 12 mm."],
      ["Compare two usable blank widths", "The plan calls for 4 mm of trimming stock and 1 mm of measurement allowance. At 310 mm the required width is 45 + 4 + 1 = 50 mm. The first blank has 48 mm of usable width and is short by 2 mm. A 52 mm usable blank gives a 2 mm reserve at that station."],
      ["Complete the fitting checks", "The plotted bars show individual measured widths. Check the contact edge above and below the patch and transfer the continuous profile on site. For this desk, check the pull near the wall through the full drawer travel. If the box moves during that test, survey the gap again before finishing the filler."]
    ],
    task: "Load the example, change the usable blank to 52 mm, and export the survey. Find the 310 mm row and confirm its 2 mm reserve.",
    related: ["/furniture-fit/", "Furniture Fit & Delivery"]
  },
  {
    slug: "release-and-handoff", stage: "Handoff", title: "Hand off a fitted filler for installation",
    description: "Send the installer a labeled part, a reproducible survey and the status of the fit and operating checks.",
    sections: [
      ["Pair the part with its record", "Use the same ID on the filler, elevation and trial template. Rename the exported CSV with that ID when saving the project record. Mark the wall edge and the end at the origin. Include the survey date, cabinet position and final finish condition so a second person can determine whether the readings still apply."],
      ["List checks that need a person", "Record whether the fitted contour was checked along the full edge, whether the doors and drawers were operated with the chosen hardware, and whether attachment access was verified. Assign each open item to a person. The worksheet records blank coverage at measured stations. The fit and operating checks require the physical installation."],
      ["Reopen the survey after a site change", "If skirting is replaced, new finishes change the contact plane or the cabinet is repositioned, identify which fillers are affected. Keep the earlier file as a superseded revision and issue fresh readings and dry-fit notes with the updated part. Confirm the installer has the current record before final fixing."]
    ],
    task: "Ask a second person to identify the part, origin and next open check from the handoff package alone.",
    reference: true, related: ["/learn/cabinet-installation-release-checklist/", "Cabinet installation release guide"]
  }
];
