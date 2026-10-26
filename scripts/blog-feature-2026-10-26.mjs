import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Original arithmetic fixture, not measured cabinet or hardware specifications.
export const grainFrontExample = {
  envelopeWidth: 600, envelopeHeight: 720, sideGap: 2, topGap: 2, bottomGap: 2,
  reveal: 3, kerf: 3.2, outsideTrim: 10, heights: [160, 240, 310],
};
const e = grainFrontExample;
const width = e.envelopeWidth - 2 * e.sideGap;
const sumHeights = e.heights.reduce((a, b) => a + b, 0);
const masterHeight = sumHeights + (e.heights.length - 1) * e.kerf;
let sourceY = 0, installedY = e.topGap;
export const grainFrontRows = e.heights.map((height, i) => {
  const row = { id: `DF-${i + 1}`, width, height, sourceY, installedY };
  sourceY += height + e.kerf;
  installedY += height + e.reveal;
  return row;
});
const assetRoute = "/assets/continuous-grain/";
const fmt = n => Number(n.toFixed(2)).toString();

export function writeGrainFrontAssets(root) {
  const directory = join(root, "assets/continuous-grain");
  mkdirSync(directory, { recursive: true });
  const header = "model,units,group,part,face,orientation,width,height,source_top_y,installed_left_x,installed_top_y,kerf,reveal";
  const csv = [header, ...grainFrontRows.map(r => ["teaching-v1", "mm", "BANK-A", r.id, "A", "top-up-vertical-grain", r.width, r.height, fmt(r.sourceY), e.sideGap, fmt(r.installedY), e.kerf, e.reveal].join(","))].join("\n") + "\n";
  writeFileSync(join(directory, "drawer-front-sequence.csv"), csv);
  const scale = 0.45, top = 155;
  const colors = ["#ddc49c", "#d7b88b", "#cfac7a"];
  const grain = Array.from({ length: 15 }, (_, i) => {
    const points = Array.from({ length: 37 }, (_, j) => `${fmt((18 + i * 39 + 11 * Math.sin(j / 5 + i)) * scale)},${fmt(j * 20 * scale)}`).join(" ");
    return `<polyline points="${points}" fill="none" stroke="#906b41" stroke-width="1.4" opacity=".5"/>`;
  }).join("");
  const columns = [[60, false], [505, true]].map(([x, installed]) => {
    const panels = grainFrontRows.map((r, i) => {
      const y = top + (installed ? r.installedY : r.sourceY) * scale;
      const clip = `${installed ? "fit" : "stock"}-${i}`;
      return `<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${width * scale}" height="${r.height * scale}"/></clipPath><rect x="${x}" y="${y}" width="${width * scale}" height="${r.height * scale}" fill="${colors[i]}"/><g clip-path="url(#${clip})"><g transform="translate(${x} ${y - r.sourceY * scale})">${grain}</g></g><rect x="${x + 10}" y="${y + 12}" width="230" height="45" rx="6" fill="#fffaf0" fill-opacity=".93"/><text x="${x + 20}" y="${y + 40}" font-size="20" font-weight="700">${r.id} · 596 × ${r.height} mm</text>`;
    }).join("");
    return `<rect x="${x}" y="${top}" width="${(installed ? e.envelopeWidth : width) * scale}" height="${(installed ? e.envelopeHeight : masterHeight) * scale}" fill="#263e38"/>${installed ? `<g transform="translate(${e.sideGap * scale} 0)">${panels}</g>` : panels}`;
  }).join("");
  writeFileSync(join(directory, "master-and-reveals.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720" role="img" aria-labelledby="title desc">
<title id="title">One master blank, three ordered drawer fronts</title><desc id="desc">Original teaching geometry. Left: 596 by 716.4 millimeter master blank with 3.2 millimeter kerfs. Right: 600 by 720 millimeter installation envelope, 2 millimeter perimeter gaps and 3 millimeter internal reveals. Front heights are 160, 240 and 310 millimeters, top to bottom. Narrow gaps are drawn to scale; the text gives their exact size.</desc>
<rect width="960" height="720" rx="24" fill="#f6f3eb"/><g font-family="system-ui,sans-serif" fill="#263e38">
<text x="48" y="55" font-size="30" font-weight="750">Keep the order. Separate kerf from reveal.</text>
<text x="48" y="92" font-size="21">Vertical grain · Face A · All dimensions in millimeters</text>
<text x="60" y="132" font-size="23" font-weight="700">Master: 596 × 716.4</text><text x="505" y="132" font-size="23" font-weight="700">Envelope: 600 × 720</text>
${columns}
<text x="60" y="515" font-size="22">Two kerfs: 3.2 mm each</text><text x="505" y="515" font-size="22">Two reveals: 3 mm each</text>
<text x="60" y="563" font-size="22">Master height = 710 + 2 × 3.2 = 716.4</text>
<text x="60" y="605" font-size="22">Installed height = 2 + 710 + 2 × 3 + 2 = 720</text>
<text x="60" y="647" font-size="22">After aligning DF-1: DF-3 shifts 0.4 mm upward in the pattern.</text>
<text x="60" y="690" font-size="18">Illustrative geometry and grain lines · no edge banding or inter-part cleanup modeled</text>
</g></svg>\n`);
}

export const grainFrontFeature = {
  slug: "continuous-grain-drawer-fronts-master-blank",
  category: "CutList",
  title: "Continuous Grain Drawer Fronts: Master Blank, Kerf, and Reveals",
  seoTitle: "Continuous Grain Drawer Fronts: Blank and Reveal Math",
  description: "Plan three continuous-grain drawer fronts from one master blank. Follow the kerf and reveal math, preserve panel order, and download the dimensioned SVG and CSV.",
  kicker: "Grain planning · Worked feature",
  readTime: "11 min", accent: "cutlist", useGenericTranslation: false,
  publishedDate: "2026-10-26", modifiedDate: "2026-10-26",
  image: { kind: "diagram", width: 960, height: 720, src: `${assetRoute}master-and-reveals.svg`, alt: "A vertically grained master blank split into three fronts compared with the same fronts installed with perimeter gaps and internal reveals.", label: "Original teaching geometry. Narrow kerfs and reveals are to scale; use the printed dimensions and CSV for the exact values." },
  researchBrief: {
    question: "How much stock does a matched drawer bank need, and what happens when the saw kerf differs from the installed reveal?",
    insight: "Size the finished fronts from the installation envelope, then rebuild the master blank from those fronts plus real cutting losses. Preserve their order and orientation as a group.",
    metrics: ["Finished front dimensions", "Master blank size", "Kerf minus reveal", "Source and installed coordinates"],
  },
  sections: [
    ["A Grain Arrow Does Not Preserve a Picture", "Three panels can all have vertical grain and still look unrelated. A direction lock prevents a ninety-degree turn, but it does not keep neighboring pieces next to one another or protect their original top-to-bottom sequence. For a bank of visible slab drawer fronts, treat the selected face as one composition before treating it as three rectangles. This feature follows one invented veneered-panel example from installed dimensions back to a master blank. The numbers are an original arithmetic model, not measurements from a customer cabinet or hardware instructions. The goal is a traceable layout decision: which region supplies each front, what disappears during cutting, and where each surviving piece belongs after installation."],
    ["Specify the Match in an Elevation", "WalzCraft distinguishes continuous matching along the grain from sequential matching across it, and asks for project drawings when coordinating those relationships [1]. Here the grain runs vertically through a single stack, so DF-1, DF-2, and DF-3 occupy successive regions along that direction. This is a different requirement from merely buying three fronts in the same species. Draw the elevation as seen from the room, mark the selected face A, and put an upward arrow on every part record. Give the group an ID such as BANK-A. The supplier reference supports the matching terminology; the dimensions, formulas, and illustrated grain lines below are this article's own teaching model."],
    ["Solve the Installed Envelope First", "Assume a rectangular front elevation 600 mm wide and 720 mm high. Choose 2 mm gaps at the left, right, top, and bottom, plus two internal horizontal reveals of 3 mm. These are invented design inputs, not recommended universal clearances. Each front is 600 − 2 − 2 = 596 mm wide. The three finished heights must total 720 − 2 − 2 − 2 × 3 = 710 mm. Allocate that total as 160, 240, and 310 mm from top to bottom. Check the sum before laying anything out on stock. These dimensions describe applied fronts; drawer-box width, slide clearance, mounting-hole locations, and operating travel are separate decisions. Confirm those against the actual cabinet and selected hardware."],
    ["Build the Master Blank From the Parts and Cutting Loss", "Now assume a measured 3.2 mm kerf and no additional cleanup between the separated fronts. Two separations consume 6.4 mm. The squared master blank therefore needs a width of 596 mm and a height of 160 + 240 + 310 + 2 × 3.2 = 716.4 mm. The 3 mm installed reveals do not become extra wood in this equation: they are empty space between finished parts. If the parent needs an illustrative 10 mm outside trim on each edge, reserve a rough region 616 × 736.4 mm before establishing the squared master. That outside allowance is separate from the two internal kerfs. It must cover the actual perimeter cleanup process; it is not another allowance to deduct from each finished front."],
    ["Keep Source Coordinates and Installed Coordinates Separate", "Use a top-left origin with y increasing downward, viewed from face A. On the squared master, DF-1 spans y = 0 to 160; the first kerf spans 160 to 163.2. DF-2 spans 163.2 to 403.2; the second kerf spans 403.2 to 406.4. DF-3 spans 406.4 to 716.4. In the installation envelope, all fronts begin at x = 2. Their top coordinates are 2, 165, and 408 mm. The bottom front ends at 718, leaving the specified 2 mm bottom gap. The source coordinates preserve the veneer sequence; the installed coordinates preserve fit. Combining them into one unlabeled measurement column hides exactly the difference that this exercise is meant to expose."],
    ["Kerf and Reveal Need Not Be Equal", "For front i, counted from one, the difference between its installed top and source top is top gap + (i − 1) × (reveal − kerf), under this model. Here those differences are 2, 1.8, and 1.6 mm. After aligning the first front's pattern, the second has moved 0.2 mm upward and the third 0.4 mm upward relative to their source positions. That is a geometric shift, not a measured visual acceptance limit. Whether it is noticeable depends on the chosen figure and viewing conditions. Equal kerf and reveal preserve relative source spacing in the ideal model, but they do not restore the grain removed by the blade. Do not change a required operating clearance simply to match a blade specification."],
    ["Add Edge Treatment Before Reusing These Dimensions", "The worked example assumes the finished front outline equals the cut substrate outline. It includes no projecting edge banding, added lipping, or inter-part finish trimming. If those are part of the design, calculate the substrate from the finished dimensions first. Edge material can add height or width, while pre-milling can remove substrate; write the net allowance for each edge rather than subtracting one guessed number everywhere. Likewise, if each separated piece needs cleanup stock, include that stock in the master and its coordinate map. Extra cleanup increases the amount of original figure missing between adjacent finished faces. Review a sample of the complete edge treatment because its appearance can interrupt a match even when the substrate arithmetic is correct."],
    ["Optimize the Group as a Master Rectangle", "A rectangular layout tool can reserve one 596 × 716.4 mm squared master, or the larger rough reservation when that is the stock definition being planned. Choose one basis and keep its cleanup allowance explicit. Do not also enter the three child fronts as additional independent material demand. Keep a separate subdivision record linking BANK-A to DF-1 through DF-3. If the chosen optimizer only locks grain direction, it may still scatter three individually entered fronts across unrelated regions; do not infer adjacency from a grain arrow. Review the actual layout before accepting it. After the master region is selected, the child sequence remains fixed even if another arrangement would yield a slightly smaller scrap percentage."],
    ["Keep the Set Together Through Cutting and Installation", "Before separation, photograph the chosen face beside the elevation and mark part IDs, face identity, and top direction where the marking method will not damage the final surface. Maintain those identities through any sanding, edge work, and finishing. A half-turn can preserve the broad grain axis while reversing the figure; swapping DF-1 and DF-3 loses the original sequence completely. WalzCraft's catalog also emphasizes tracking face and back orientation through production and installation [1]. Dry-arrange the set with the intended gaps before drilling front-mounting holes. Verify actual part dimensions, reveal consistency, drawer operation, and acceptable appearance. The drawing establishes material bookkeeping; plan workholding and machine operation using the instructions for the equipment in use."],
    ["Download the Sequence and Know When to Recalculate", "The CSV contains three child records in millimeters, with group, part, face, orientation, source top coordinate, installed left and top coordinates, kerf, and reveal. It is a reference schedule, not a claimed direct-import format for a specific app. The SVG is generated from the same fixture. If the cabinet envelope, edge treatment, measured kerf, or finished front heights change, update the model before cutting and retire the old schedule. If one front is damaged, inspect the remaining figure before assuming a replacement from a random offcut will match. Keep enough information to decide whether an acceptable local replacement exists or the whole visual group needs to be remade. A matched bank is a sequence with a revision, not just a quantity of three."],
  ],
  checklist: [
    "Approve the measured elevation and hardware operation before assigning finished front sizes.",
    "Identify BANK-A, face A, top direction, and the exact DF-1 through DF-3 sequence.",
    "Keep installed reveals, extraction kerf, outside trim, and edge treatment separate.",
    "Reserve the master once in material demand and keep its child schedule separately.",
    "Dry-arrange the complete finished set and verify both appearance and operation before mounting.",
  ],
  deepDive: {
    comparisonTitle: "Three fronts, two coordinate systems: millimeters from the top",
    comparisonColumns: ["Part / sequence", "Finished width × height", "Source top → bottom", "Installed top → bottom"],
    comparisonRows: grainFrontRows.map(r => [r.id, `${r.width} × ${r.height}`, `${fmt(r.sourceY)} → ${fmt(r.sourceY + r.height)}`, `${fmt(r.installedY)} → ${fmt(r.installedY + r.height)}`]),
    faqs: [
      ["Should I add the installed reveals to the master blank?", "Build the master from the actual child cut dimensions plus cutting and cleanup losses. Installed reveals are empty space, not a separate strip of material to add by default."],
      ["Does locking grain guarantee continuous matching?", "No. It can constrain direction without preserving adjacency, face identity, or part sequence. Reserve a master group or use software with an explicit matching constraint that you have verified."],
      ["Why is the example master shorter than the 720 mm elevation?", "The elevation contains 10 mm of total empty gaps. Cutting removes 6.4 mm between parts, so the ideal squared master is 3.6 mm shorter than the envelope."],
      ["Are 2 mm perimeter gaps and 3 mm reveals suitable for every drawer?", "They are teaching inputs only. Use the actual cabinet, hardware requirements, material, edge treatment, and operating checks to establish project clearances."],
    ],
    sources: [
      ["Download the ordered front schedule (CSV)", `${assetRoute}drawer-front-sequence.csv`, "Original teaching-v1 child records. Not a measured project or an optimizer import contract."],
      ["Open the master and installation comparison (SVG)", `${assetRoute}master-and-reveals.svg`, "Original scaled geometry and illustrative grain paths generated from the same fixture."],
      ["[1] WalzCraft: Design Options, Grain and Color Coordination", "https://walzcraft.com/wp-content/uploads/2011/07/Chapter-G-WalzCraft-Design-Options-Cabinet-Doors-17.2-4.pdf", "Sections G.17.1–G.17.9 distinguish along-grain and across-grain coordination, drawings, and orientation tracking. Checked October 26, 2026. The numerical example is our own."],
      ["Grain matching cabinet doors", "/blog/grain-matching-cabinet-doors-guide/", "Background on choosing which visible faces need coordinated figure."],
      ["Drawer Fit Studio", "/drawer-fit/", "Review drawer-box geometry and hardware inputs separately from applied-front appearance."],
      ["Edge Banding Planner", "/edge-banding/", "Resolve finished outlines, substrate sizes, and edge-specific allowances."],
      ["Plywood cut calculator", "/plywood-cut-calculator/", "Review a reserved rectangular master alongside other project material demand."],
    ],
  },
};
