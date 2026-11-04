export const chapters = [
  {
    slug: "rough-board-survey", phase: "Survey", title: "How to Survey a Rough-Sawn Board",
    summary: "Record actual board dimensions, map end checks and mark clear zones before promising a part to a board.",
    sections: [
      ["Give each board an identity", "Label the boards A, B and C before laying out parts. Keep the label at both ends or transfer it to your notes when an end gets trimmed. Write down the measured dimensions beside the ID. Keep the supplier's nominal size in a separate column so a label such as 4/4 never silently becomes your measured thickness."],
      ["Measure where the part will live", "Take width and thickness readings at several stations inside the candidate area. A board that is 180 mm wide in the middle and 164 mm at a relevant narrow point offers at most 164 mm there before edge cleanup. If the narrow point falls outside the chosen segment, record the segment as its own piece of stock. Keep a separate note for cup or twist because a thickness reading alone does not show what will survive flattening."],
      ["Draw the unusable zones", "Mark splits, knots you intend to avoid, damaged edges and any areas with uncertain grain. An end reservation can cover an end check, but a defect in the middle divides the board. Measure the clear segments separately. Save the parent board ID so the same physical stock does not get counted twice in the order."]
    ],
    exercise: "The example side table starts with board A at 1,800 × 180 × 32 mm. Mark 30 mm at each end and 10 mm at each edge as unavailable in the initial scenario. If any defect intrudes farther, redraw the boundaries before using the sample numbers.",
    link: "/wood-database/", action: "Explore wood species"
  },
  {
    slug: "warp-and-thickness", phase: "Survey", title: "Read Bow, Cup, Crook and Twist",
    summary: "Distinguish four shapes of warp and decide which pieces deserve a trial before the whole batch is milled.",
    sections: [
      ["Name the direction of the error", "Bow runs along the length of a face. Cup runs across its width. Crook bends the edge along the length. Twist means the end sections are rotated relative to one another. A single board can have several of these shapes, so write down both the affected zone and the direction of the deviation."],
      ["Inspect the piece at the intended blank size", "A rough board can look unsuitable for one long component while still containing shorter clear segments. Narrower blanks can also change the effect of cup. Draw the actual footprints and inspect within them. Keep the longest or widest parts assigned first because they have fewer alternative locations."],
      ["Budget from trial measurements", "A gap under a straightedge is a useful observation, but the final thickness also depends on the reference plane, local defects and the cleanup needed on the opposite face. Use a representative trial blank and record the measured clean thickness. Inspect the other blanks individually before committing the batch to one finished thickness."]
    ],
    exercise: "Take a representative 32 mm offcut from the same material. If it cleans up at 26 mm, use 6 mm as the observed removal for that piece. Then try an 8 mm budget on board A in the planner and see how it changes the 24 mm target.",
    link: "/wood-movement/", action: "Review seasonal width changes"
  },
  {
    slug: "blank-allowance-budget", phase: "Budget", title: "Set Rough Blank and Milling Allowances",
    summary: "Separate stock reservations, saw kerf, per-blank cleanup and thickness removal so each loss is counted once.",
    sections: [
      ["Keep three sets of dimensions", "Finished dimensions belong to the part drawing. Rough length and width are the finished dimensions plus cleanup allowances for one blank. Measured stock dimensions describe the actual board before you reserve defective areas. Use a separate line for each so the numbers stay traceable after the first cut."],
      ["Choose who owns each loss", "A 30 mm reservation at each end consumes 60 mm of the board once. An extra 30 mm on a 420 mm blank gives 450 mm per blank and gets used repeatedly. Kerf is reserved separately for each rough crosscut and rip in the planner. Include any stock-trimming kerf inside the relevant end or edge reserve."],
      ["Keep thickness on its own axis", "A 32 mm board with a 6 mm thickness removal budget leaves an estimated 26 mm. A target of 24 mm has 2 mm of modeled headroom. That headroom can disappear if a second cleanup becomes necessary, so compare the result with the trial and record the thinnest clean blank before setting the batch target."]
    ],
    exercise: "Enter a 420 × 65 × 24 mm apron and add 30 mm of length and 8 mm of width per blank. Confirm the rough footprint is 450 × 73 mm. Change the end reservation by 10 mm and verify that the footprint stays the same.",
    link: "/kerf-calculator/", action: "Review blade kerf"
  },
  {
    slug: "board-yield-layout", phase: "Budget", title: "Estimate Repeated Blanks From One Board",
    summary: "Use rip lanes and crosscut positions to screen a same-size batch before marking the actual board.",
    sections: [
      ["Keep the grain direction fixed", "In this model the blank length follows the board length. Every lane has the same blank width and every position has the same blank length. If you need differently sized parts, mark their footprints together on the actual board and allocate clear pieces separately. Running separate scenarios against the full board can count the same area twice."],
      ["Work both axes independently", "The example board has 1,740 mm left after reserving the ends and 160 mm after reserving the edges. With 3 mm kerf, a length slot takes 453 mm and a width slot takes 76 mm. Three positions and two lanes fit. Their product is six rough blanks, provided the thickness check also passes."],
      ["Review what remains after the allocation", "Three length slots leave 381 mm along the board and two width slots leave 8 mm across it. The length remainder describes the row of unused stock across the occupied lanes. The width remainder describes the strip beside them. Measure the real leftovers after cutting before recording them for another job."]
    ],
    exercise: "Raise the apron length from 420 to 550 mm while keeping the 30 mm length allowance. Three 583 mm slots would require 1,749 mm. The screen should drop to two positions and four blanks.",
    link: "/cut-list-calculator/", action: "Plan mixed lengths in linear stock"
  },
  {
    slug: "reference-face-and-edge", phase: "Mill", title: "Track the Reference Face and Edge",
    summary: "Carry one reference face and one square edge through the batch so later measurements use the same datum.",
    sections: [
      ["Start with the geometry you need", "A finished rectangular apron needs flat faces, parallel thickness and a square reference edge. Identify which face will register against the next operation. The first flat face establishes that reference. The opposite face can then be sized parallel to it, and a square edge provides the reference for the final width."],
      ["Put the marks where you can keep them", "Choose a face mark and an adjacent edge mark your shop can recognize. A mark that disappears at the next stage is a prompt to transfer it before sizing. Keep the part ID and orientation distinct, especially when the inside and outside faces will look similar after cleanup."],
      ["Check the reference against the joinery", "Decide which face locates the shoulder or groove on the finished part. Use it consistently when transferring the layout across mating components. Check from that face on the trial piece and pair it with a mating offcut or sample so an offset becomes visible before the whole batch is machined."]
    ],
    exercise: "On the first apron, label the outside face and top edge. Record which surface sets the joinery offset. Dry-fit the sample beside a leg blank and check the intended reveal before transferring the layout.",
    link: "/joinery-lab/", action: "Plan joint geometry"
  },
  {
    slug: "staged-milling-batch", phase: "Mill", title: "Stage a Milling Batch Before Final Sizing",
    summary: "Use a trial blank, an intermediate checkpoint and a final measurement to release the batch to joinery.",
    sections: [
      ["Separate rough, trial and accepted stock", "Set aside a representative blank with enough cleanup stock to learn from it. Note the starting dimensions and the minimum clean thickness after the trial. Keep the remaining rough parts together by target thickness so boards with a different final dimension cannot accidentally enter the batch."],
      ["Reserve stock for the next checkpoint", "When working in stages, record the size at which you will stop the first stage and how much you plan to leave for the final one. Stock may shift after rough sizing or material removal. Recheck flatness and thickness at the next session, then revise the budget using the amount of material that actually remains."],
      ["Release only measured parts", "Sort blanks into ready, hold and replace. A hold part stays oversized while you decide whether it can be cleaned up. A replace part no longer has enough material for its assigned finished size. If a part moves to a different role, update both IDs in the stock record before proceeding."]
    ],
    exercise: "Mark four required aprons and up to two spare footprints. Write down a minimum acceptable clean thickness from the project drawing, then assign a status after the trial. Keep a spare for the fit check if the real board yields it.",
    link: "/assembly-check/", action: "Prepare the dry-fit check"
  },
  {
    slug: "side-table-apron-worked-example", phase: "Verify", title: "Worked Example: Four Side-Table Aprons",
    summary: "Follow one board through the sample calculation, check the headroom and revise the plan when the board measures differently.",
    sections: [
      ["Write the work order", "This illustrative square side table calls for four identical 420 × 65 × 24 mm apron components. The 420 mm length is the complete finished part length from the drawing. Board A measures 1,800 × 180 × 32 mm. The example assigns 60 mm to total end loss, 20 mm to total edge loss and 6 mm to thickness removal."],
      ["Count candidate parts before cutting", "Each rough blank is 450 × 73 mm. Adding the 3 mm kerf on both axes gives a 453 × 76 mm slot. The working footprint is 1,740 × 160 mm, giving three positions by two lanes. Six candidates cover the demand of four with two possible spares. The 26 mm estimated clean thickness leaves 2 mm above the target."],
      ["Rerun with the board you actually have", "If an edge defect increases total edge loss to 30 mm, usable width drops to 150 mm. One lane fits and the result falls to three candidates, one short of the order. The next step is to measure a second board or identify a separately verified segment. A thicker board does not recover the missing width in this example."]
    ],
    exercise: "Load the sample and export its CSV. Set edge loss to 30 mm, export again and compare the width remainder, geometric candidates and batch shortfall. Use the revised record to identify what the second board must supply.",
    link: "/solid-wood-milling/#planner", action: "Run the apron example"
  },
  {
    slug: "milling-quality-check", phase: "Verify", title: "Check Milled Parts Before Joinery",
    summary: "Verify size, flatness, orientation and group matching, then record any replacement parts and usable offcuts.",
    sections: [
      ["Compare the group and the drawing", "Measure thickness and width at several positions on every part. Check length between the finished ends and compare matching parts side by side. A group can look consistent while all four parts miss the drawing, so keep both the drawing target and the actual measured range on the record."],
      ["Check the surfaces that drive fit", "Look for twist on a trusted flat surface and check the relevant edge against the reference face. Confirm the face and edge labels are readable and that the visible faces match the grain and orientation you selected. Recheck any part that has been waiting between operations before using its reference marks."],
      ["Close the stock record", "Mark the accepted parts and update the count of spares. Record offcuts using actual length, width and thickness, with the parent board ID and any remaining defect notes. A strip or short piece shown by the arithmetic becomes reusable stock only after it exists and has been measured."]
    ],
    exercise: "Record the measured minimum and maximum thickness of the four aprons. Hold any part that falls outside the project drawing's tolerance. Label and measure the real leftovers before entering them in the inventory.",
    link: "/offcut-planner/", action: "Record measured offcuts"
  }
];
