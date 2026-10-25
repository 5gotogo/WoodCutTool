import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Original geometric teaching fixture. Coordinates are millimeters from the
// lower-left corner, viewed from face A. This is not a tested damaged panel.
export const defectMappingExample = {
  stock: { x: 0, y: 0, width: 1200, height: 2400 },
  observed: { x: 500, y: 1000, width: 200, height: 300 },
  exclusion: { x: 480, y: 980, width: 240, height: 340 },
  kerf: 4,
  zones: [
    { id: "L", x: 0, y: 0, width: 476, height: 2400 },
    { id: "R", x: 724, y: 0, width: 476, height: 2400 },
    { id: "B", x: 480, y: 0, width: 240, height: 976 },
    { id: "T", x: 480, y: 1324, width: 240, height: 1076 },
  ],
};
const assetRoute = "/assets/defect-mapping/";
const area = (r) => r.width * r.height;
const cleanArea = defectMappingExample.zones.reduce((sum, r) => sum + area(r), 0);
const formatArea = (n) => (n / 1e6).toFixed(5);
const rows = defectMappingExample.zones.map((r) => [r.id, `(${r.x}, ${r.y})`, `${r.width} × ${r.height} mm`, `${formatArea(area(r))} m²`]);

export function writeDefectMappingAssets(root) {
  const directory = join(root, "assets/defect-mapping");
  mkdirSync(directory, { recursive: true });
  const records = [["stock", defectMappingExample.stock], ["observed_cosmetic_mark", defectMappingExample.observed], ["exclusion", defectMappingExample.exclusion], ...defectMappingExample.zones.map((r) => [`zone_${r.id}`, r])];
  const csv = ["model,units,record,x,y,width,height,kerf,area_mm2", ...records.map(([id, r]) => ["teaching-v1", "mm", id, r.x, r.y, r.width, r.height, defectMappingExample.kerf, area(r)].join(","))].join("\n") + "\n";
  writeFileSync(join(directory, "worked-example.csv"), csv);
  // Only the plan view is to scale (0.2 px/mm). Text is a separate legend.
  const rect = (r, fill, stroke = "#31504b") => `<rect x="${90 + r.x * 0.2}" y="${120 + (2400 - r.y - r.height) * 0.2}" width="${r.width * 0.2}" height="${r.height * 0.2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
  const colors = ["#d2e8dd", "#d2e8dd", "#c8ddeb", "#c8ddeb"];
  const zoneRects = defectMappingExample.zones.map((r, i) => rect(r, colors[i]) + `<text x="${90 + (r.x + r.width / 2) * 0.2}" y="${128 + (2400 - r.y - r.height / 2) * 0.2}" text-anchor="middle" font-size="24" font-weight="700">${r.id}</text>`).join("");
  writeFileSync(join(directory, "sheet-map.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720" role="img" aria-labelledby="title desc">
<title id="title">One defect, four disjoint stock rectangles</title>
<desc id="desc">A 1200 by 2400 millimeter usable panel viewed from face A, with a central observed cosmetic mark and a larger exclusion. Four labeled rectangles exclude four millimeter kerf bands. L and R are each 476 by 2400, B is 240 by 976, and T is 240 by 1076 millimeters.</desc>
<rect width="960" height="720" rx="24" fill="#f6f3eb"/>
<g font-family="system-ui, sans-serif" fill="#203d37">
<text x="60" y="65" font-size="32" font-weight="750">Map the shape. Keep the coordinates.</text>
${rect(defectMappingExample.stock, "#203d37")}${zoneRects}${rect(defectMappingExample.exclusion, "#f2c382", "#8b4c1e")}${rect(defectMappingExample.observed, "#a74735", "#702b20")}
<text x="210" y="103" font-size="22" text-anchor="middle">1200 mm</text>
<text transform="translate(62 360) rotate(-90)" text-anchor="middle" font-size="22">2400 mm</text>
<text x="90" y="638" font-size="22">(0, 0) · Face A</text>
<path d="M 90 600 h 55 M 90 600 v -55" fill="none" stroke="#203d37" stroke-width="3"/>
<text x="400" y="150" font-size="26" font-weight="700">Declared clean rectangles</text>
<text x="400" y="200" font-size="25">L / R   476 × 2400 mm each</text>
<text x="400" y="248" font-size="25">B         240 × 976 mm</text>
<text x="400" y="296" font-size="25">T         240 × 1076 mm</text>
<rect x="400" y="345" width="24" height="24" fill="#a74735"/><text x="440" y="366" font-size="24">Observed mark: 200 × 300 mm</text>
<rect x="400" y="395" width="24" height="24" fill="#f2c382"/><text x="440" y="416" font-size="24">Exclusion: 240 × 340 mm</text>
<text x="400" y="478" font-size="24">Dark gaps: 4 mm modeled kerf</text>
<text x="400" y="526" font-size="24">Clean stock: ${formatArea(cleanArea)} m²</text>
<text x="400" y="574" font-size="24">Not a maximum-yield solution.</text>
<text x="60" y="682" font-size="22">Illustrative geometry only · not a repair approval or saw setup plan</text>
</g></svg>\n`);
}

export const defectMappingFeature = {
  slug: "plywood-defect-mapping-usable-rectangles",
  category: "CutList",
  title: "Plywood Defect Mapping: From a Damaged Sheet to Usable Rectangles",
  seoTitle: "Plywood Defect Mapping and Usable Rectangles",
  description: "Map plywood defects with a common datum, separate exclusions from kerf, and verify usable rectangles with a worked coordinate example and downloadable CSV.",
  kicker: "Material planning · Worked feature",
  readTime: "12 min",
  accent: "cutlist",
  useGenericTranslation: false,
  publishedDate: "2026-10-25",
  modifiedDate: "2026-10-25",
  image: {
    kind: "diagram",
    width: 960,
    height: 720,
    src: `${assetRoute}sheet-map.svg`,
    alt: "Face-A map of a 1200 by 2400 mm sheet: a central excluded mark, four disjoint clean rectangles, and 4 mm kerf bands.",
    label: "Original teaching example. Coordinates and dimensions are reproduced in the table and CSV below.",
  },
  researchBrief: {
    question: "How can a local defect become explicit stock geometry without pretending that total clean area proves a part will fit?",
    insight: "Preserve the sheet datum, bound the exclusion, reserve the cut paths, and compare individual part dimensions against non-overlapping clean stock.",
    metrics: ["Exclusion coordinates", "Disjoint stock rectangles", "Kerf bands", "Largest required part"],
  },
  sections: [
    ["An Internal Defect Changes the Shape of the Decision", "A dent near the middle of a panel is a different planning problem from a chipped perimeter. Trimming an edge can leave one smaller rectangle. Avoiding an internal mark can leave several possible rectangles that overlap each other. Adding their areas, or subtracting the mark from the full sheet area, does not create a valid stock list. This feature develops one explicit coordinate example for a cosmetic mark that the project has already decided to exclude. It is an original geometric illustration, not a shop experiment, a panel grading rule, or permission to reuse material with unresolved damage. The result is a reviewable stock record that a rectangular layout workflow can understand."],
    ["Decide Whether Mapping Is Appropriate Before Drawing", "APA's Storage and Handling of APA Trademarked Panels identifies protection during storage, shipping, and site handling as a panel-care task [1]. Its Field Repairs of Plywood publication addresses damage types and repair feasibility [2]. Neither publication's existence establishes that a particular damaged sheet can be salvaged for your use. First distinguish a project appearance rejection, such as a known surface mark, from an unresolved material condition. If the panel has unexplained separation, soft regions, contamination, or damage whose extent cannot be established, hold it for the supplier or appropriate reviewer. Keep its identity and photographs. A smaller rectangle on a screen does not resolve a material-quality question."],
    ["Give Both Faces One Coordinate System", "Assign a sheet ID and select a reference view before measuring. In this example, look at face A with the origin at its lower-left corner. Let x increase across the 1200 mm width and y increase along the 2400 mm length. Mark the reference edges and orientation on the physical sheet as well as the sketch. A location recorded while looking directly at face B is mirrored relative to face A; transfer it into the common coordinate system before combining maps. For an unrotated flip about the vertical axis, an observed box with back-view x coordinate xb and width w maps to face-A x = W − xb − w. A different flip needs its own transformation. Verify the correspondence using a recognizable corner rather than guessing from a photograph."],
    ["Keep Three Different Allowances Visible", "Record perimeter trim, defect exclusion, and blade kerf separately. The example starts after any perimeter trim has established a 1200 × 2400 mm usable rectangle. Within it, an observed cosmetic mark occupies x = 500 to 700 and y = 1000 to 1300 mm. For this invented example only, choose a 20 mm planning margin on all four sides, producing an excluded box x = 480 to 720 and y = 980 to 1320 mm. That margin is an assumption, not an industry acceptance distance or a model of hidden damage. Reserve a separate 4 mm kerf for each modeled separation. If the observed boundary or required margin changes, recalculate the coordinates rather than adding an unexplained waste percentage."],
    ["Construct Four Rectangles Without Counting Any Stock Twice", "Choose a vertical-first partition for a concrete example. Reserve full-length kerf bands at x = 476 to 480 and x = 720 to 724 mm. The left clean rectangle L is therefore 476 × 2400 mm at (0, 0); the right rectangle R is the same size at (724, 0). The remaining central strip is 240 mm wide. Within that strip, reserve kerf at y = 976 to 980 and y = 1320 to 1324 mm around the excluded box. Rectangle B below it is 240 × 976 mm at (480, 0); rectangle T above it is 240 × 1076 mm at (480, 1324). These four clean rectangles share no area. The diagram shows this declared partition, while the CSV preserves its source coordinates. It is a geometric allocation, not an instruction for supporting or feeding a damaged panel through a saw."],
    ["Reconcile the Area Before Trusting the Stock List", `The usable parent area is 1200 × 2400 = 2,880,000 mm². The two side rectangles contribute 2 × 476 × 2400 = 2,284,800 mm². B contributes 234,240 mm² and T contributes 258,240 mm². Their sum is ${cleanArea.toLocaleString("en-US")} mm², or ${formatArea(cleanArea)} m². The expanded exclusion consumes 240 × 340 = 81,600 mm². Two full-length kerfs consume 2 × 4 × 2400 = 19,200 mm², and the two central crosscuts consume another 2 × 4 × 240 = 1,920 mm². Clean rectangles, exclusion, and kerf therefore add back to exactly 2,880,000 mm². This arithmetic checks the bookkeeping for this partition; it does not prove the unseen panel is sound or that every required part can be cut.`],
    ["Test a Large Part Instead of Celebrating a Percentage", "The four rectangles retain about 96.43% of the starting usable area, yet a 600 × 1500 mm part fits none of them in either orientation. In this particular example, that part also cannot avoid the exclusion anywhere on the intact parent rectangle under axis-aligned placement. With its 600 mm side across the sheet, its possible x origins range from 0 to 600; every such interval intersects the excluded x range 480 to 720. Its possible y origins range from 0 to 900; every 1500 mm interval intersects y = 980 to 1320. Rotating the part makes its width 1500 mm, greater than the stock width. This is a specific impossibility argument for one part, not a general nesting algorithm. A small excluded fraction can still block the one component that determines the purchase."],
    ["A Conservative Partition Can Reject a Part That Another Partition Allows", "Now consider a different requirement: one 500 × 900 mm part. It fits none of the four declared rectangles because the side rectangles are only 476 mm wide and the central rectangles only 240 mm wide. Nevertheless, a horizontal-first partition could preserve a full-width 1200 × 976 mm rectangle below the exclusion, after reserving the same 4 mm crosscut at y = 976 to 980. The 500 × 900 mm part fits there with room for subsequent separation. This is why a failed match against one stock partition does not prove that the original sheet cannot serve the job. Compare partitions against the actual critical parts before breaking down stock. Do not enter both the full-width bottom rectangle and the original side rectangles as simultaneously available inventory: those candidate regions overlap."],
    ["Transfer the Accepted Rectangles Into the Right Tool", "A rectangular optimizer can review clean rectangles after the exclusion has been handled explicitly outside its stock model. Do not assume that entering the original sheet plus a smaller area total will make the tool avoid an internal mark. Check the capabilities of the specific tool and preserve the accepted map with the layout. WoodCutTool's Offcut Planner screens one part against a recorded usable rectangle with its own material, thickness, grain, trim, and kerf settings; it does not solve an internal-defect polygon or prove a complete multi-part plan. Enter the rectangles from the chosen physical partition with separate IDs and the original sheet ID in their notes. If the recorded dimensions already end at clean cut edges, keep any additional future cleanup allowance explicit so the same extraction kerf is not silently deducted twice."],
    ["Release the Physical Stock and Keep the Revision", "Before adopting the map, verify the measured rectangle, the reference face, both-face observations, required orientation, and the dimensions of the critical part. Separate a geometric fit from approval of appearance, material condition, hardware zones, or load-bearing use. Plan the actual cutting operation for the available support and equipment, following their instructions; the coordinate bands here are not a safe cut-order prescription. After extraction, remeasure each clean piece and update its inventory entry instead of retaining ideal dimensions when the real cut wandered. New damage or a newly exposed void reopens the hold decision. Keep the chosen partition, rejected alternatives, margin assumption, kerf, reviewer, date, and revision together so the next user understands how a nominal sheet became several usable stock items."],
    ["What to Download and What to Change for Your Own Project", "The worked-example CSV contains the parent rectangle, observed cosmetic box, expanded exclusion, and four clean stock zones in millimeters under model teaching-v1. It is an illustrative dataset, not a record of your supplied plywood. Its rows describe different layers of the model: stock and exclusion rows must not be imported as additional available offcuts alongside the zone rows. The diagram is a scalable view of the same coordinates. For a real project, replace the observation and margin with accepted project evidence, recompute the split geometry, and verify every required part. Preserve candidate maps until the partition is chosen, then retire overlapping candidates from available inventory. The useful output is an accountable decision about particular rectangles, not a blanket salvage percentage."],
  ],
  checklist: [
    "Resolve material-condition questions before treating a mark as a local cosmetic exclusion.",
    "Record both faces in one sheet coordinate system and verify the physical datum.",
    "Keep perimeter trim, exclusion margin, extraction kerf, and future cleanup separate.",
    "Choose one non-overlapping stock partition and test the largest critical parts.",
    "Remeasure extracted rectangles and retain the parent sheet ID and revision.",
  ],
  deepDive: {
    comparisonTitle: "The declared vertical-first partition: face-A coordinates in millimeters",
    comparisonColumns: ["Clean zone", "Lower-left origin", "Width × length", "Area"],
    comparisonRows: rows,
    faqs: [
      ["Can I subtract a defect's area and enter the balance as stock?", "No. Area does not preserve the shape or position of clean material. Use accepted non-overlapping rectangles or a tool that explicitly models the excluded geometry."],
      ["Is the example's 20 mm margin enough for a real defect?", "It is only an invented geometric input. The appropriate hold, rejection, or exclusion decision depends on the actual condition and project requirements."],
      ["Does a failed rectangle match mean I need another sheet?", "It means that the part failed that stock definition and its constraints. A different non-overlapping partition may work; overlapping candidates cannot all be counted as available stock."],
      ["Does the downloadable CSV import directly into Offcut Planner?", "No. It is a coordinate reference with stock, observation, exclusion, and zone record types. Enter only accepted clean rectangles into inventory, adding their actual material, thickness, and grain information."],
    ],
    sources: [
      ["Download the worked coordinate example (CSV)", `${assetRoute}worked-example.csv`, "Original teaching-v1 inputs and four disjoint clean rectangles. All dimensions are millimeters; no shop observations are claimed."],
      ["Open the scalable sheet map (SVG)", `${assetRoute}sheet-map.svg`, "Original diagram generated from the same coordinate fixture as the table and CSV."],
      ["[1] APA: Storage and Handling of APA Trademarked Panels", "https://www.apawood.org/guides-tools-training/technical-document-library/builder-tips/storage-and-handling-of-apa-trademarked-panels/", "Panel-care reference U450. Publication listing checked October 25, 2026; it does not supply this example's exclusion margin."],
      ["[2] APA: Field Repairs of Plywood", "https://www.apawood.org/guides-tools-training/technical-document-library/technical-notes/field-repairs-of-plywood/", "Publication listing on damage types and repair feasibility, checked October 25, 2026. Consult applicable guidance for the actual panel; this article does not approve repairs."],
      ["Usable plywood sheet dimensions", "/learn/how-to-calculate-usable-plywood-sheet-size/", "Separate the measured parent rectangle from nominal format and perimeter trim."],
      ["Offcut Planner: measure and label", "/offcut-planner/measure-and-label/", "Carry accepted rectangles into a measured browser-local stock record."],
      ["Offcut Planner: single-part fit method", "/offcut-planner/fit-check-method/", "Understand what a recorded rectangle match establishes and what remains a physical check."],
      ["Plywood cut calculator", "/plywood-cut-calculator/", "Review rectangular stock and part constraints after choosing an accepted stock definition."],
    ],
  },
};
