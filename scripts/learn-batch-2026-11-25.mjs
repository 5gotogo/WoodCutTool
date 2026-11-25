import { handoffMarkup } from "./cut-handoff-data.mjs";

const usableLength = 96;
const usableWidth = 48;
const reservedWidth = 11.875;
const kerf = 0.125;
const remainingWidth = usableWidth - reservedWidth - kerf;
const panels = [
  { label: "Cabinet panel A", length: 60, width: 18, qty: 1 },
  { label: "Cabinet panel B", length: 60, width: 17.875, qty: 1 },
];

export const plywoodStripHandoff = {
  version: 1,
  scenario: "plywood-strip-reservation",
  unit: "in",
  groups: [{
    id: "remainder", material: "Plywood remainder", thickness: 0.75,
    sheetLength: usableLength, sheetWidth: remainingWidth, kerf, trim: 0,
    price: 0, allowRotate: false,
  }],
  parts: panels.map(panel => ({ ...panel, group: "remainder", allowRotate: false })),
  exclusions: [
    "The 96 × 11.875 in reserved strip is kept out of this panel layout. The first rip has already been deducted. The kerf field is for future cuts.",
    "Only one remainder is available in this example. A result needing two or more sheets means the planned cuts need more stock or a revised reservation.",
  ],
};

const exampleTable = `<table>
  <caption>Panel blanks for the remainder, one of each</caption>
  <thead><tr><th scope="col">Panel</th><th scope="col">Length × width (in)</th></tr></thead>
  <tbody>${panels.map(panel => `<tr><th scope="row">${panel.label}</th><td>${panel.length} × ${panel.width}</td></tr>`).join("")}</tbody>
</table>`;

export const plywoodStripReservationGuide = {
  slug: "reserve-plywood-strip-before-cutting",
  cluster: "layout-optimization",
  seoTitle: "How to Reserve a Full-Length Plywood Strip",
  h1: "How to Reserve a Full-Length Plywood Strip",
  description: "Plan a full-length plywood rip before nesting. Calculate the remaining sheet width, account for kerf once, and test two strip widths with a worked cut list.",
  keywords: ["reserve plywood strip", "plywood rip cut layout", "plywood remaining width", "plywood offcut planning"],
  showKeywords: false,
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  intro: "To reserve a full-length plywood strip, subtract the strip width and one rip kerf from the usable sheet width, then lay out the current job on the smaller rectangle. From a usable 96 × 48 in sheet, an 11⅞ in strip and a ⅛ in kerf leave 96 × 36 in for the job. A strip just ⅛ in wider can be enough to make the same cut list need another piece of stock.",
  sections: [
    ["Choose what the strip must provide", `Write down the minimum usable length and width for the future job, along with thickness, face and grain direction. A blank that will lose material to edge cleanup needs to start wider than the finished part. For example, a finished 11¾ in strip requiring ⅛ in of future edge cleanup calls for an 11⅞ in reservation. If the future part actually needs 12 in of clear width, the 11⅞ in reservation cannot serve it. Set that minimum before testing panel layouts.`],
    ["Calculate the stock left after the rip", `<strong>Remaining width = usable sheet width − reserved strip width − first rip kerf.</strong> A rip that runs the full usable length leaves the length unchanged. Measure the actual sheet and use its usable rectangular dimensions after any edge cleanup. If the sheet measures 48 in wide and the two long edges lose ¼ in and ⅛ in in total material removal respectively, the usable width is 47⅝ in. Reserving 12 in with a ⅛ in rip kerf then leaves 35½ in. The same equation works in millimeters. A 1220 mm usable width minus a 305 mm strip and a 3.2 mm kerf leaves 911.8 mm.`],
    ["Compare two strip widths on the same cut list", `This example uses a square, already usable 96 × 48 in sheet, a measured ⅛ in kerf and grain running along the 96 in length. Both cabinet panel blanks keep their grain along the 60 in dimension. Verify those constraints before changing the reserve width.`, exampleTable + `
      <p>With an <strong>11⅞ in strip</strong>, the remainder is 36 in wide. Side by side, the panels require 18 + ⅛ + 17⅞ = 36 in. That consumes the entire available width, so the fit has zero cleanup margin. The two 60 in lengths cannot run end to end on the 96 in remainder.</p>
      <p>With a <strong>12 in strip</strong>, the remainder is 35⅞ in wide. The same pair is ⅛ in too wide for a single remainder. The geometric upper limit for the reservation in this example is 48 − ⅛ − 36 = 11⅞ in. If the future job needs the full 12 in, allocate more stock or revisit the parts with the designer before cutting.</p>`],
    ["Recalculate using the remainder as stock", `Open the sample below to load the 96 × 36 in remainder and the two panel rows into the <a href="/plywood-cut-calculator/">Plywood Cut Calculator</a>. Review the import, keep rotation locked and optimize. Then change <strong>Sheet width</strong> to 35.875 in and optimize again. The first setup places both panels on one remainder. The second needs two rectangles of that size, which exceeds the single rectangle available from this sheet. Use zero trim for this already-squared example. Keep the 0.125 in kerf setting for cuts that still need to happen between the panels. The first rip is already reflected in the stock width. The <a href="/learn/saw-kerf-explained/">saw kerf guide</a> covers how to establish the value for your own blade.`, handoffMarkup(plywoodStripHandoff)],
    ["Remeasure and label the two rectangles", `Before committing the first rip, check both planned rectangles against real grain, face defects, edge condition and the support requirements of the chosen equipment. After the rip, measure each rectangle at both ends and confirm it is square. Recalculate if the smaller usable measurement changes the fit. Label the reserved strip with the stock ID, measured length and width, actual thickness, grain arrow, show face and intended use. Record it in the <a href="/offcut-planner/">Offcut Planner</a> if it will return to shared stock, or keep it assigned to the future job so it cannot be allocated twice.`],
    ["When can a strip be picked from the leftover diagram?", `When the future work is flexible, a leftover rectangle can be a reasonable choice after reviewing its usable dimensions. When you must guarantee a continuous length for a specific blank, reserve that rectangle explicitly before nesting. A high yield score can leave several short remnants with enough combined area and no single piece long enough. Review cut-line access separately from rectangle fit. Grain restrictions and through-cut layouts are described in the <a href="https://docs.opencutlist.org/features/parts/parts-list/cutting-diagrams">OpenCutList cutting diagram documentation</a>.`],
  ],
  cta: "Compare the two remainder widths with identical panel inputs, then repeat the calculation with your measured stock and required strip size.",
  relatedGuides: ["plywood-breakdown-cut-sequence", "saw-kerf-explained", "how-to-reduce-plywood-waste"],
  relatedTools: [
    ["/plywood-cut-calculator/", "Test a layout on the remainder", "Calculator"],
    ["/offcut-planner/", "Record the measured reserved strip", "Tool"],
    ["/troubleshooting/first-cut-leaves-unusable-strip/", "Diagnose an unusable first-cut strip", "Troubleshooting"],
  ],
};
