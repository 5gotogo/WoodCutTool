const logan = ["Logan Graphic Products · DIY Picture Framing", "https://www.logangraphic.com/learning-center/free-books-and-guides/logan-241-diy-picture-framing.pdf"];
const vermont = ["Vermont Hardwoods · Moulding length and cut losses", "https://vermonthardwoods.com/picture-framing/how-much-picture-frame-moulding/"];
const craig = ["Craig Frames · Frame profiles and proper measurement", "https://www.craigframes.com/pages/framing-tips"];
const rockler = ["Rockler · How to make picture frames", "https://www.rockler.com/learn/video-how-to-make-professional-quality-picture-frames"];

export const guides = [
  {
    slug: "measure-artwork-and-mat",
    title: "Measure Artwork, Mat and Backing for a Wood Frame",
    summary: "Record the display crop and the actual package as separate measurements before choosing a frame profile.",
    sections: [
      ["Decide what will be visible", "Lay the print flat and note its full paper size, including any white border or signature that matters. Next, mark the intended visible image with loose paper strips. The mat window sets that crop. Its outside dimensions set the size of the package that goes into the frame. A print sold as 8 × 10 inches may have margins you want to keep, so check the actual piece before specifying the window."],
      ["Measure the largest outer layer", "Stack the glazing, mat or spacer, artwork and backing in their intended order. Measure the widest and tallest layer, even if they are different layers. Check at both ends of each axis and compare diagonals for any rigid sheet that looks skewed. A single nominal size written on the packaging will miss a proud edge or out-of-square corner."],
      ["Check orientation and mat borders", "Mark top on the reverse and sketch the planned orientation. For a bottom-weighted mat, record the four borders individually and compare the visible border after the moulding lip covers the perimeter. On a no-mat project, use an overlay of the calculated sight rectangle to locate any covered signature or lettering."],
      ["Keep one dimension record", "Write the actual package width and height with units, window size, top edge and maximum stack thickness. Leave clearance out of the package dimensions. The planner adds it when sizing the rabbet pocket."]
    ],
    check: "Trace the assembled package on scrap paper and lay a paper sight opening over it. Confirm the same crop and fit in the intended hanging orientation.",
    source: logan
  },
  {
    slug: "rabbet-sight-and-long-point",
    title: "Picture Frame Dimensions from Rabbet to Long Point",
    summary: "Convert package dimensions into the rabbet opening, front sight opening and both miter reference lengths.",
    sections: [
      ["Measure a real moulding sample", "Measure across the entire face from the inner visible edge to the outer edge. Then turn the profile over and measure the horizontal recess from the inner visible edge to the back shoulder. This is the lip width used here. The vertical distance from the glazing seat to the back of the frame is rabbet depth. Write face, lip and depth beside a quick end-view sketch."],
      ["Calculate the back and front openings", "Work one axis at a time. Back rabbet opening equals package size plus twice the clearance per edge. The front sight opening equals back rabbet opening minus twice the lip width. For a 280 mm package, 1.5 mm clearance per edge and a 9 mm lip, the openings are 283 mm at the back and 265 mm at the front."],
      ["Transfer the right reference to your stop", "On a 45° rectangular frame, the long-point span equals sight opening plus twice the profile face. With a 35 mm face, the 265 mm front opening needs a 335 mm long-point span. Across the same part, the back rabbet shoulder span is 283 mm and the front short-point span is 265 mm. A jig indexing at the back shoulder must use the 283 mm dimension."],
      ["Check profiles with more than one step", "Use the shoulder that the widest package layer actually fits between. Sketch stepped or undercut profiles and verify with a corner sample. The planner assumes one uniform moulding, one bearing lip and a 45° cut at both ends of each piece."]
    ],
    check: "Mark the long point, the rabbet shoulder and the short point on one scrap miter. Confirm which mark your stop or scale references.",
    source: vermont
  },
  {
    slug: "glazing-and-rabbet-depth",
    title: "Check Glazing, Backing and Rabbet Depth",
    summary: "Check both bearing overlap and depth for the assembled package, including room for retainers.",
    sections: [
      ["Measure the assembled stack", "Measure the thickness at every edge after putting together the intended layers. Use the largest reading and account for any mounting tape, spacers or raised backing. A mat or separate spacer can establish a gap between the image and glazing. Include that spacer in the thickness budget."],
      ["Reserve room at the back", "Subtract the stack and the depth needed for the actual retention system from the usable rabbet depth. For a 12 mm rabbet, an 8 mm stack and 2 mm retainer reserve, 2 mm remains. A depth check depends on the hardware and on where it bears. Trial-fit a real retainer on an offcut of the profile."],
      ["Keep the package supported at the edges", "For a centered package, the lip overlaps each edge by lip width minus per-edge clearance. The package can shift to one side by the full clearance on that axis. The least overlap on the opposite edge is then lip width minus twice the per-edge clearance. If that reaches zero, choose a wider bearing lip or revise the fit and verify it on a corner sample."],
      ["Check layers that have different sizes", "The planner treats the package as one rigid rectangle. Individually loose layers can slide even when the largest backing piece fits. Check those layers at the corners and document any mounting or spacer that keeps them located. For a valuable, fragile or irreplaceable piece, use materials and mounting methods appropriate to the artwork."]
    ],
    check: "Assemble a short mock corner with the actual layers, shift them through their available play and test the selected retainer before committing to the profile.",
    source: craig
  },
  {
    slug: "estimate-moulding-and-kerf",
    title: "Estimate Picture Frame Moulding, Kerf and End Loss",
    summary: "Allocate four complete parts to individual sticks and use a measured miter transition loss.",
    sections: [
      ["Start with four complete parts", "List each long-point span and count the matching opposite side separately. Summing them gives the net moulding in the frame. Compare each span with the continuous usable length on a stick. Two shorter pieces of scrap cannot supply one full-length side."],
      ["Measure the gap between usable parts", "On scrap of the same profile, mark the outside edge and make the two cut orientations your process needs between adjacent rails. Measure along that outside edge from the end long point of one usable rail to the start long point of the next. Use that consumed length as the inter-part allowance. Blade kerf alone can miss the wedge and cleanup required by a miter reversal."],
      ["Budget both stick ends", "Record the combined loss to establish usable long points at both ends of each stick, including defects and the cuts needed near the ends. For an 800 mm stick with 30 mm total end loss, assign parts to 770 mm. A 335 mm and a 410 mm part with 6 mm loss between them use 751 mm and leave 19 mm in the usable interval."],
      ["Mark defects and grain before buying", "The planner finds the fewest identical-length sticks for one frame with the allowances you enter. Mark knots, checks and any face defects on each piece you will actually use. Match adjacent corners dry where the grain is prominent. If a stick has an interior defect, handle its usable segments separately in your shop layout."]
    ],
    check: "Pencil the proposed parts on the actual stock. Verify both longest points per part, a fresh miter at each end, and a clean interval at every mark.",
    source: vermont
  },
  {
    slug: "test-45-degree-miters",
    title: "Test 45° Picture Frame Miters Before Cutting",
    summary: "Use four scrap parts to separate angle errors from unequal opposite sides and wrong stop references.",
    sections: [
      ["Register the same face every time", "Mark the face and outside edge of each blank. Use profile offcuts for tests so the support and orientation are the same as on the good stock. Follow your tool and fixture instructions for clamping and supporting the moulding. Keep a marked sample for each of the two end orientations."],
      ["Verify the angle on four parts", "A single corner can look closed while a small error shows up at the fourth joint. Dry-fit four scrap rails from the setup and inspect each corner on a known flat surface. Check inside and outside seams separately. If several seams open at the same end, verify both 45° setups and the moulding registration before adjusting length."],
      ["Match the opposite sides", "Put the top and bottom together with long points aligned at one end and compare the opposite ends. Repeat for the sides. Measure to the same reference edge and verify the stop has held. Check the rabbet dimension too, especially if a shaped profile makes the visible short point hard to register."],
      ["Keep the good stock for the verified setup", "When the scrap closes cleanly, mark the same references on the real parts, record the verified dimensions, and label matched pairs. If hardware or a finish will change the back fit, keep a second offcut for that trial."]
    ],
    check: "Release the final cut list only after the four-piece scrap frame closes dry without forcing any corner.",
    source: rockler
  },
  {
    slug: "dry-fit-and-assemble",
    title: "Dry-Fit, Square and Assemble a Mitered Frame",
    summary: "Check seams, diagonals and package fit while every correction is still reversible.",
    sections: [
      ["Dry-fit on a flat surface", "Lay out the labeled parts face up and check the grain across adjoining corners. Pull the four miters together with light pressure from your chosen clamp. Look at each seam from the face and back. Twist or profile mismatch can leave one lip higher than the next even when the outlines seem square."],
      ["Read diagonals alongside the seams", "Measure between matching outside reference points in both directions. Equal diagonals are useful only alongside fully seated corners, matched opposite lengths and a flat frame. If diagonals differ, check which parts shifted under pressure and verify the original cuts before adding more force."],
      ["Test the package before finishing", "Turn over the dry frame and check a mock package against all four shoulders and behind the lip. Verify the backing depth at each corner. Allow for the actual finish on the bearing surfaces and leave room for the retention method."],
      ["Choose a joint and retention method for the frame", "Check profile thickness before selecting any reinforcement or fastener. Trial-fit the selected system on scrap of the same moulding. Keep the artwork and glazing clear of glue and clamps until the assembly and finish are ready. Then check that the backing is held without loading the glazing unevenly."]
    ],
    check: "Record the two diagonals and verify the intended package seats with all four seams closed before adding glue.",
    source: rockler
  },
  {
    slug: "troubleshoot-miter-gaps",
    title: "Diagnose Gaps, Racking and Tight Fits in Picture Frames",
    summary: "Use the gap pattern and a few direct measurements to choose the next check before recutting.",
    sections: [
      ["A repeated wedge gap points to the setup", "If multiple seams touch at the inner edge but open at the outer edge, or show the inverse pattern, compare both miter orientations against a reference. Verify the moulding is supported in the same position in both cuts. A test with four short pieces makes repeated angle and registration errors easier to reproduce."],
      ["One open corner can be a length error", "Compare the opposite members directly, then bring the joints together with very light pressure. A stop shift or wrong reference can leave otherwise clean miters unable to close together. A recut on one rail changes an opening dimension. Recalculate the matching pair before trimming it."],
      ["A joint that closes on one face can hide twist", "Check each piece on a flat bench and inspect how the profiles meet across their thickness. A piece rocking on the fixture or a profile varying across sticks can create a height mismatch and a seam that opens at the back. Use a clean, matching set of parts when testing the jig."],
      ["A tight backing fit calls for a separate measurement", "Compare the real package to the clear spans between back shoulders, checking the top and bottom and both diagonals. Feel for finish ridges or proud corner joints. If the pocket depth is the issue, measure the stack and retention space separately before changing the frame width."]
    ],
    check: "Label the failure as angle, opposite-side length, profile registration or package fit and reproduce it on a sample before changing the final pieces.",
    source: rockler
  },
  {
    slug: "worked-example-walnut-frame",
    title: "Worked Example of a 280 × 355 mm Walnut Frame",
    summary: "Follow the worksheet example from package dimensions to a four-part cut list and a two-stick stock allocation.",
    sections: [
      ["Start with the package and profile", "The stack measures 280 × 355 mm at its perimeter and 8 mm thick. The selected moulding has a 35 mm face, 9 mm lip and 12 mm usable rabbet depth. Use 1.5 mm clearance per edge and reserve 2 mm behind the stack for the chosen retainers. The stack leaves 2 mm beyond that reserve, with at least 6 mm of bearing overlap after allowing for shift."],
      ["Develop the three reference rectangles", "Adding 3 mm to each package axis yields a 283 × 358 mm back opening. Removing 18 mm on each axis yields a 265 × 340 mm sight opening. Adding 70 mm to each sight dimension yields the 335 × 410 mm outside. The two horizontal rails are 335 mm long-point to long-point and the vertical rails are 410 mm."],
      ["Allocate two identical sticks", "Budget 30 mm total end loss on each 800 mm stick and 6 mm between adjacent parts. Two long sides would need 826 mm of usable length. Instead assign one 335 mm rail and one 410 mm side to each stick. Each pair uses 751 of the available 770 mm, leaving 19 mm per stick."],
      ["Take the plan to a bench sample", "Load this example in the planner and export the CSV. It lists each part with the long-point, shoulder and short-point span. Verify the 6 mm loss with your actual miter process and confirm the fit with a scrap corner. On a real profile, adjust the input measurements to match the shop sample."]
    ],
    check: "Confirm the two mixed-length pairs on the stock and use the reference column that matches your verified stop."
  }
];
