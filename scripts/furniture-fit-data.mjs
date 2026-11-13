export const sources = {
  survey: ["Room & Board measuring guide", "https://www.roomandboard.com/customer-service/measuring-for-delivery"],
  packages: ["IKEA package and delivery guidance", "https://www.ikea.com/be/en/customer-service/services/delivery/"],
  policy: ["IKEA UK delivery restrictions", "https://www.ikea.com/gb/en/customer-service/knowledge/articles/783e2g8e-9c75-462g-bd93-c31egdgf6951.html"]
};

export const chapters = [
  {
    slug: "measure-the-carry-envelope", group: "Measure", title: "Measure what will actually be carried",
    summary: "Record the outside dimensions of the wrapped piece, carton or separately carried module.",
    sections: [
      ["Choose the transport configuration", "Draw the piece in its normal installed position and label its width, height and depth. Then identify what travels together. A cabinet delivered in a carton and the same cabinet wrapped after unboxing are separate scenarios. Record the packaging dimensions from the product listing when available, or measure the outside of the wrapped piece."],
      ["Find the longest point on each axis", "Use two straight reference surfaces around curved or stepped profiles. Include feet, fixed pulls, hinge knuckles, trim and protective corners wherever they project. Mark detachable pieces separately and confirm with the maker or delivery team which parts can be removed and how the remaining frame will be supported."],
      ["Keep allowance separate", "The hall cabinet measures 920 × 1,480 × 440 mm with its wrap in place. The sample requests 20 mm of total clearance on each checked axis. Wrap is already part of the cabinet envelope. The allowance is extra space for the survey and handling plan, and the value should reflect the actual project."]
    ],
    exercise: "Write one carry-envelope card for the configuration you expect to use. Record the largest protrusion in each direction and who supplied the dimensions.", source: "packages"
  },
  {
    slug: "walk-the-delivery-route", group: "Measure", title: "Survey the route from unloading to installation",
    summary: "Break the trip into checkpoints and capture the approach to each narrow section.",
    sections: [
      ["Start where the object enters", "Walk in the same order as the delivery. Include the building entrance, vestibule, inner doors, lift entrance and cabin, hall corners and the destination. Compare a service entrance with the front route if both are available. In a shared building, confirm access and any booking requirements with the building or carrier."],
      ["Give each restriction its own row", "A lift opening and the cabin are different measurements. A wide foyer and a narrow approach after it are also separate. Label each row with a name the team can find on site. Take an approach and departure photo and mark the measured plane on a sketch."],
      ["Record what is still unknown", "If a door cannot be held in its intended position during the survey, record that as an unresolved condition. Leave missing dimensions blank. The hall cabinet route keeps the corner as a separate field review even after both lift checks meet the allowance."]
    ],
    exercise: "Walk backward from the destination once, looking for any constraint missed on the first pass. Add the missing checkpoint in the order the piece will encounter it.", source: "survey"
  },
  {
    slug: "doorway-clear-opening", group: "Measure", title: "Measure the clear opening of a doorway",
    summary: "Measure between the actual obstructions with the door in its delivery position.",
    sections: [
      ["Measure the usable rectangle", "Hold the door where it will be during delivery. Measure between the surfaces that bound the opening, including the door edge, stop and projecting hardware. Measure the usable height from the threshold to the first obstruction. Compare readings at several heights and across the opening; use a rectangle that remains clear through the full passage."],
      ["Check both sides of the opening", "A cabinet can have a narrow projected face and still need a long clear approach. In the example, the 440 mm side faces the 820 mm entry, leaving 380 mm of width before the allowance. In that same orientation the 920 mm dimension points along the path. Review the vestibule and the space beyond the doorway before relying on that orientation."],
      ["Write down any proposed change", "If a plan depends on removing a door or handle, confirm permission, responsibility and the achievable opening before updating the measurements. Delivery-provider practices can differ. Record the measured opening in the condition that will actually be available."]
    ],
    exercise: "Record the clear width, clear height and door position for the narrowest doorway. Add a separate checkpoint if there is a turn immediately beyond it.", source: "survey"
  },
  {
    slug: "straight-passage-and-orientation", group: "Screen", title: "Compare orientations in a straight passage",
    summary: "Map the furniture’s three dimensions to the opening and the direction of travel.",
    sections: [
      ["Assign the three axes", "Keep the furniture dimensions in installed order. In a face-first upright carry, the width crosses the opening, height stays vertical and depth points along travel. In an edge-first upright carry, depth crosses the opening, height stays vertical and width points along travel. Mark the leading end on a sketch so the team can reproduce it."],
      ["Calculate clearance on each measured axis", "Subtract the projected piece extent from the measured clear span. The remaining space is the total gap across that axis. Subtract the desired total allowance from that gap. A negative gap means the selected orientation is too large on that axis. A negative result after allowance means the measured gap is smaller than the planned reserve."],
      ["Review changes of orientation separately", "The planner compares static, axis-aligned dimensions. If you change the selected orientation between two rows, identify where the piece would turn or tip. Add a field review checkpoint there and confirm the configuration can be handled as intended."]
    ],
    exercise: "Change the sample entry from edge-first to face-first. Read which axis becomes too small, then restore edge-first and mark the leading edge in the notes."
  },
  {
    slug: "lift-door-and-cabin", group: "Screen", title: "Check the lift opening and cabin separately",
    summary: "Capture the door rectangle, interior dimensions and space available on each landing.",
    sections: [
      ["Record the door rectangle", "Use one opening row for the clear width and height of the lift doors. Measure the opening in its normal operating condition. If it is offset within the cabin, note the offset and where the piece would have to enter."],
      ["Measure the clear interior box", "Record width, height and depth available in the cabin after accounting for projections such as rails and fixtures. In the cabinet example the lift interior is 1,100 mm wide, 2,200 mm high and 1,400 mm deep. The edge-first cabinet uses 440, 1,480 and 920 mm on those axes. Subtracting a 20 mm allowance leaves 640, 700 and 460 mm respectively."],
      ["Review access with the building and crew", "The cabin box check describes one position inside the lift. Confirm the lobby approach, the exit path and the time and space available to load and unload. Discuss equipment, crew space, applicable load limits and access requirements with the building and delivery team."]
    ],
    exercise: "Enter the cabin and doors as two rows. Sketch where the door sits on the cabin face and note any rail or light that reduced the interior measurement.", source: "survey"
  },
  {
    slug: "turns-stairs-and-landings", group: "Review", title: "Record tight turns, stairs and landings",
    summary: "Survey the swept path where a simple width and height check leaves open questions.",
    sections: [
      ["Draw both legs of a turn", "Mark the inside and outside corners, door offsets and usable widths on both sides of the bend. Note changes in ceiling height and anything that projects at cabinet height. Take photos from both approach directions and include a measured reference in the sketch."],
      ["Record changes in elevation", "For stairs, record the narrowest width between fixed obstacles, ceiling clearance at the lower and upper approaches, and measurements around intermediate landings. Include rails and any overhead projections in the drawing. Capture the space available at both ends of the flight."],
      ["Test the unresolved movement", "An L-shaped path depends on where the entire piece moves during a turn. A drawing of the opening or a floor diagonal alone leaves that movement unresolved. Ask the delivery team to review the site and agree on the route and handling method. In the example, the hall corner stays marked for field review."]
    ],
    exercise: "Add a field review checkpoint and use its notes to record the location of the sketch, the suspected conflict and who will inspect it.", source: "survey"
  },
  {
    slug: "final-recess-and-installation", group: "Review", title: "Measure the final recess and installation space",
    summary: "Check the installed envelope and survey space for the movements and services around it.",
    sections: [
      ["Survey at several positions", "Measure width at the front and back and at several heights. Measure depth to the first obstruction and height beneath the lowest relevant surface. Take the limiting rectangular measurements for the installed position. Record baseboards, outlets, pipes and trim, and ask which features must stay accessible."],
      ["Use the correct envelope for placement", "The packaged, wrapped and installed sizes can differ. Export the carry route before creating a separate plan for the installed piece when the envelopes differ. For a rectangular recess, select the installed orientation and check all three axes. In the sample, 455 mm of depth minus 440 mm of cabinet gives 15 mm of gap, which is 5 mm below the entered allowance."],
      ["Review setup and use", "Measure the room needed to approach and position the piece, add or adjust feet, open doors and drawers, and reach service points. If the piece must tip upright under a ceiling or move sideways into a recess, record that movement for field review."]
    ],
    exercise: "Mark the shallowest point in the recess and the reason for it. Make a separate note for the first door or drawer that needs to open after installation.",
    link: ["/built-in-scribe/", "Survey the wall for cabinet fillers"]
  },
  {
    slug: "plan-modules-for-delivery", group: "Decide", title: "Design furniture around a smaller carry envelope",
    summary: "Use the hardest checkpoint to decide whether to split the project into modules.",
    sections: [
      ["Find the governing restriction", "Identify which axis of which checkpoint leaves the smallest reserve. Compare a change in route with a change in transport configuration. If the width is limiting but the piece has height to spare, record the allowed orientations and review where any rotation would occur."],
      ["Define complete carry modules", "For a built-in cabinet, a base and upper body might travel separately. Create an envelope for each module, including reinforcement, padding and hardware that travels with it. Check each module through the full route and plan how the finished piece will be aligned and fastened on site."],
      ["Approve the interfaces before cutting", "Show module joins and attachment access on the shop drawing. Label mating faces, track hardware separately and rehearse the assembly sequence. Record the dimensions again after the final hardware and packaging are in place."]
    ],
    exercise: "Sketch one proposed split and label the heaviest and longest modules. Save a separate route backup for each carry envelope.",
    link: ["/cabinet-studio/", "Open Cabinet Studio"]
  },
  {
    slug: "hall-cabinet-worked-example", group: "Decide", title: "Worked example: a hall cabinet through a lift",
    summary: "Follow one wrapped cabinet through five checkpoints and read the mixed result.",
    sections: [
      ["Start with the entry and lift door", "The wrapped cabinet is 920 × 1,480 × 440 mm. At the 820 × 2,040 mm entry, the edge-first orientation presents 440 × 1,480 mm. After 20 mm of allowance, the width and height reserves are 360 and 540 mm. The 800 × 2,000 mm lift door leaves 340 and 500 mm in the same orientation."],
      ["Continue to the cabin and corner", "The cabin has room for the selected rectangular envelope on all three axes. The next checkpoint is a hall corner that requires a separate sweep and handling review. Keep the two results distinct in the handoff so an interior box check cannot be mistaken for a turning check."],
      ["Investigate the recess", "The 955 × 1,520 × 455 mm recess leaves 35 mm of width, 40 mm of height and 15 mm of depth with the cabinet face forward. The depth misses the 20 mm allowance by 5 mm. Recheck the obstruction and confirm which size the cabinet will have when installed before deciding whether to alter the plan."]
    ],
    exercise: "Open the example and select each checkpoint. Export the CSV and identify the row with −5 mm after allowance and the row reserved for field review."
  },
  {
    slug: "delivery-handoff-checklist", group: "Decide", title: "Prepare the delivery handoff",
    summary: "Give the crew a route, the relevant measurements and a clear list of open checks.",
    sections: [
      ["Share the measured route", "Export the CSV and attach dated photos or sketches labeled with the checkpoint names. State which envelope the file uses and whether it includes packaging. Keep a JSON backup for later edits. If the route changes, update the affected checkpoints and send the revised record."],
      ["Confirm responsibilities in advance", "Agree who arranges building access and who checks removable parts, obstacles and alternative entrances. Review the delivery provider’s own terms and procedures for anything the route depends on. Put outstanding decisions alongside the related checkpoint."],
      ["Revisit the route on the day", "Walk the route before moving the piece and compare it with the recorded conditions. If a measured span has changed, a turn is unresolved or the crew identifies a problem, pause at that point and agree the next step with them. Keep any approved alternative route with the same project record."]
    ],
    exercise: "Select the highest-priority unresolved checkpoint. Give it an owner and a verification date in the notes, then export the revised schedule.", source: "policy"
  }
];
