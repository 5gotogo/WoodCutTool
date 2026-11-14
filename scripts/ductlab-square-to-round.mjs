import { breadcrumbJsonLd, SITE } from "./seo-meta.mjs";
import { ductLabChinaProductPath } from "../functions/lib/app-store.js";

export const ductLabSlug = "ductlab-hvac-duct-layout";
export const ductLabPath = `/apps/${ductLabSlug}/`;
export const squareToRoundPath = `${ductLabPath}square-to-round-example/`;
export const ductLabLead = "Lay out HVAC sheet-metal fittings on iPhone. Calculate fitting dimensions, estimate sheet stock and cost, and export fabrication PDFs offline.";
const chinaStoreUrl = `https://apps.apple.com${ductLabChinaProductPath}`;
const supportPath = "/legal/DuctLab/support/";

export const chinaStoreLink = `<a href="${chinaStoreUrl}" rel="noopener noreferrer">China mainland App Store</a>`;
export const ductLabStylesheet = '<link rel="stylesheet" href="/assets/ductlab-example.css">';

export function fittingOverview() {
  return `    <section class="section ductlab-fittings" aria-labelledby="fitting-layouts">
      <div class="section-heading compact">
        <p class="eyebrow">HVAC sheet-metal fabrication</p>
        <h2 id="fitting-layouts">Four fitting layouts</h2>
        <p>Start with the fitting you need to lay out, then save parts to a job for material estimates and PDF export.</p>
      </div>
      <div class="ductlab-grid">
        <a class="ductlab-card ductlab-example-card" href="${squareToRoundPath}">
          <h3>Square to round</h3><p>Lay out a square or rectangular opening to a round outlet. Enter the diameter, axial length, offsets, and round divisions.</p>
          <strong>See the 22 × 10 in to Ø16 in worked example →</strong>
        </a>
        <div class="ductlab-card"><h3>Rectangular transition</h3><p>Compare the four panel slopes and centerline true length from two rectangular openings and their offsets.</p></div>
        <div class="ductlab-card"><h3>Duct offset</h3><p>Use rise and run to calculate true travel and offset angle for a four-face layout.</p></div>
        <div class="ductlab-card"><h3>Rectangular or round elbow</h3><p>Use angle, centerline radius, and segment count to review the centerline, throat, and heel arcs.</p></div>
      </div>
    </section>`;
}

const sample = {
  width: 22, height: 10, diameter: 16, length: 12,
  xOffset: 3, yOffset: 2, divisions: 16
};
const { width, height, diameter, length, xOffset, yOffset, divisions } = sample;
const radius = diameter / 2;
const angleStep = 360 / divisions;
const arc = Math.PI * diameter / divisions;
const chord = diameter * Math.sin(Math.PI / divisions);
const corners = [[width / 2, height / 2], [-width / 2, height / 2],
  [-width / 2, -height / 2], [width / 2, -height / 2]];
const angle = index => 45 + index * angleStep;
const ring = Array.from({ length: divisions }, (_, index) => {
  const radians = angle(index) * Math.PI / 180;
  return [xOffset + radius * Math.cos(radians), yOffset + radius * Math.sin(radians)];
});
const distance = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const trueLength = (p, q) => Math.hypot(distance(p, q), length);
const pointLabel = index => `P${index % divisions}`;
const fmt = n => n.toFixed(3);

// Pick the intersection on the positive (left) or negative (right) side
// of the directed baseline PQ. Every construction edge keeps its 3D length.
function swing(p, q, fromP, fromQ, side = 1) {
  const span = distance(p, q);
  const along = (fromP ** 2 - fromQ ** 2 + span ** 2) / (2 * span);
  const perpendicular = side * Math.sqrt(fromP ** 2 - along ** 2);
  const ux = (q[0] - p[0]) / span;
  const uy = (q[1] - p[1]) / span;
  return [p[0] + along * ux - perpendicular * uy, p[1] + along * uy + perpendicular * ux];
}

export const panels = ["Top", "Left", "Bottom", "Right"].map((name, i) => {
  const a = corners[i], b = corners[(i + 1) % corners.length];
  const labels = [String.fromCharCode(65 + i), String.fromCharCode(65 + (i + 1) % corners.length)];
  const first = i * 4;
  const rows = Array.from({ length: 5 }, (_, j) => {
    const index = (first + j) % divisions;
    return {
      index, a: j <= 2 ? trueLength(a, ring[index]) : null,
      b: j >= 2 ? trueLength(b, ring[index]) : null
    };
  });
  const base = [[0, 0], [distance(a, b), 0]];
  const flat = [];
  flat[2] = swing(...base, rows[2].a, rows[2].b);
  for (let j = 1; j >= 0; j--) flat[j] = swing(base[0], flat[j + 1], rows[j].a, chord);
  for (let j = 3; j <= 4; j++) flat[j] = swing(base[1], flat[j - 1], rows[j].b, chord, -1);
  return { name, labels, rows, base, flat };
});

function panelFigure({ name, labels, rows, base, flat }) {
  const scale = 8;
  const points = [...base, ...flat];
  const minX = Math.min(...points.map(([x]) => x));
  const maxX = Math.max(...points.map(([x]) => x));
  const maxY = Math.max(...points.map(([, y]) => y));
  const map = ([x, y]) => [28 + scale * (x - minX), 30 + scale * (maxY - y)];
  const viewWidth = Math.ceil((maxX - minX) * scale + 56);
  const viewHeight = Math.ceil(maxY * scale + 58);
  const polygon = [base[0], ...flat, base[1]].map(p => map(p).map(fmt).join(",")).join(" ");
  const guide = (p, q) => {
    const [x1, y1] = map(p), [x2, y2] = map(q);
    return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}"/>`;
  };
  const label = (point, value, dy) => {
    const [x, y] = map(point);
    return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="2.5"/><text x="${fmt(x)}" y="${fmt(y + dy)}">${value}</text>`;
  };
  const baseName = labels.join("–");
  return `<figure class="ductlab-card ductlab-pattern">
          <figcaption><strong>${name} panel · ${baseName}</strong><span>${distance(...base)} in base</span></figcaption>
          <svg width="${viewWidth}" height="${viewHeight}" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${name} development: base ${baseName}; round edge ${pointLabel(rows[0].index)} to ${pointLabel(rows[4].index)}">
            <polygon points="${polygon}"/>
            <g class="ductlab-guides">${guide(base[0], flat[1])}${guide(base[0], flat[2])}${guide(base[1], flat[2])}${guide(base[1], flat[3])}</g>
            ${flat.map((p, j) => label(p, pointLabel(rows[j].index), -9)).join("")}
            ${base.map((p, j) => label(p, labels[j], 17)).join("")}
          </svg>
        </figure>`;
}

function panelTable({ name, labels, rows }) {
  return `<div class="ductlab-card ductlab-table">
          <table>
            <caption>${name} panel · ${labels.join("–")}</caption>
            <thead><tr><th scope="col">Round point</th><th scope="col">${labels[0]} → point (in)</th><th scope="col">${labels[1]} → point (in)</th></tr></thead>
            <tbody>${rows.map(row => `<tr><th scope="row">${pointLabel(row.index)}</th><td>${row.a === null ? "—" : fmt(row.a)}</td><td>${row.b === null ? "—" : fmt(row.b)}</td></tr>`).join("")}</tbody>
          </table>
        </div>`;
}

export function squareToRoundPage({ head, header, footer, app }) {
  const title = "Offset Square-to-Round Duct Layout Example";
  const description = "Work through a 22 × 10 in to Ø16 in offset duct transition: check the inputs, calculate point-by-point true lengths, and follow all four panel developments.";
  const canonical = `${SITE}${squareToRoundPath}`;
  const jsonLd = breadcrumbJsonLd([["Home", "/"], ["Apps", "/apps/"], ["DuctLab", ductLabPath], [title, squareToRoundPath]]);
  return `<!doctype html>
<html lang="en">
${head({ title: `${title} | WoodCutTool`, description, canonical, jsonLd }).replace("</head>", `  ${ductLabStylesheet}\n</head>`)}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  <main id="main" class="ductlab-worked">
    <article>
      <header class="ductlab-card ductlab-intro">
        <p class="breadcrumb"><a href="/apps/">Apps</a> / <a href="${ductLabPath}">DuctLab</a> / Worked example</p>
        <p class="eyebrow">HVAC sheet-metal layout · Worked example</p>
        <h1>${title}</h1>
        <p class="lead">Develop a 22 × 10 in rectangular inlet to a Ø16 in round outlet over 12 in of axial length. The outlet center shifts 3 in right and 2 in up, so matching edges on opposite panels have different true lengths.</p>
        <nav class="app-detail-actions" aria-label="On this page">
          <a class="button secondary" href="#dimensions">Input dimensions</a>
          <a class="button secondary" href="#true-lengths">True-length tables</a>
          <a class="button secondary" href="#flat-pattern">Flat pattern</a>
        </nav>
      </header>

      <section id="dimensions" class="ductlab-block" aria-labelledby="dimensions-title">
        <h2 id="dimensions-title">1. Set the opening dimensions</h2>
        <dl class="ductlab-specs">
          <div><dt>Rectangular opening</dt><dd>${width} × ${height} in</dd></div>
          <div><dt>Round opening</dt><dd>Ø${diameter} in</dd></div>
          <div><dt>Axial length</dt><dd>${length} in</dd></div>
          <div><dt>Round center offset</dt><dd>+${xOffset} in X, +${yOffset} in Y</dd></div>
          <div><dt>Round divisions</dt><dd>${divisions} × ${angleStep}°</dd></div>
          <div><dt>Division chord</dt><dd>${fmt(chord)} in</dd></div>
        </dl>
        <p>Look from the rectangular inlet toward the round outlet. Use the inlet center as (0, 0, 0), +X to the right, +Y up, and +Z toward the outlet. The inlet corners in inches are A (11, 5), B (−11, 5), C (−11, −5), and D (11, −5); all four have Z = 0.</p>
        <p>The round points run counterclockwise from P0 at 45° measured from +X about the round center. P4, P8 and P12 match corners B, C and D; P0 matches A and closes the ring. The 16 equal arcs are ${fmt(arc)} in each. Use the shorter straight chord, 16 × sin(180° ÷ 16) = ${fmt(chord)} in, to swing the dividers for this faceted development.</p>
      </section>

      <section id="true-lengths" class="ductlab-block" aria-labelledby="true-lengths-title">
        <h2 id="true-lengths-title">2. Check the point-to-point true lengths</h2>
        <p>For point P<var>i</var>, use θ = 45° + <var>i</var> × 22.5° and the 3D point (3 + 8 cos θ, 2 + 8 sin θ, 12). For a rectangular corner (<var>x</var>, <var>y</var>, 0), calculate the true length as √[(3 + 8 cos θ − <var>x</var>)² + (2 + 8 sin θ − <var>y</var>)² + 12²].</p>
        <p>For example, P0 is approximately (8.657, 7.657, 12), so A to P0 measures <strong>${fmt(panels[0].rows[0].a)} in</strong>. The opposite seam, C to P8, measures <strong>${fmt(panels[2].rows[0].a)} in</strong>. Each table lists the lines used by that panel; a dash means that corner-to-point line is unused. Values are rounded to 0.001 in.</p>
        <div class="ductlab-grid">
          ${panels.map(panelTable).join("\n          ")}
        </div>
      </section>

      <section id="flat-pattern" class="ductlab-block" aria-labelledby="flat-pattern-title">
        <h2 id="flat-pattern-title">3. Develop the four flat panels</h2>
        <p>Solid outlines show the net faceted shapes; dashed lines show the internal triangulation. Match the same corner and round-point labels at adjacent panel seams, including P0 at the closing seam.</p>
        <div class="ductlab-grid">
          ${panels.map(panelFigure).join("\n          ")}
        </div>
        <ol>
          <li>Draw the base edge at its full length: A–B and C–D are 22 in; B–C and D–A are 10 in.</li>
          <li>Swing the two true lengths from the base corners to locate the middle round point (P2, P6, P10, or P14). Use the intersection on the panel side of the baseline.</li>
          <li>Work outward from that point. For each next point, intersect an arc of one chord from the previous round point with the listed true length from its base corner. Choose the intersection on the outside of the triangle already laid out.</li>
          <li>Check the shared seam lengths and match points, then add the allowances required by your seam and end connections to the appropriate edges.</li>
        </ol>
        <p class="ductlab-note"><strong>Layout reference:</strong> The diagrams are shown at screen scale. The straight segments approximate the round edge, and the net outlines exclude seams and end allowances. Verify the opening fit and full-size layout before cutting.</p>
      </section>

      <section class="ductlab-card ductlab-close" aria-labelledby="ductlab-next">
        <p class="eyebrow">Continue in DuctLab</p>
        <h2 id="ductlab-next">Save fittings and estimate a job</h2>
        <p>DuctLab’s Square to Round layout accepts these opening dimensions, offsets and divisions on iPhone. The app provides summary measurements, a fitting preview, material estimates and PDF export. The point-by-point true lengths and flat panels above are calculated for this web example.</p>
        <div class="app-detail-actions">
          <a class="button" href="${app.url}" rel="noopener noreferrer">Download DuctLab on App Store</a>
          <a class="button secondary" href="${ductLabPath}">Explore DuctLab</a>
        </div>
        <p class="ductlab-store-note">An active subscription is required to use the app. ${chinaStoreLink} · <a href="${supportPath}">DuctLab support</a></p>
      </section>
    </article>
  </main>
  ${footer()}
</body>
</html>
`;
}
