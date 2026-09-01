(function () {
  "use strict";

  const STRINGER_APP_STORE_URL = "https://apps.apple.com/us/app/stringer-stair-layout/id6784882437?uo=4";

  const format = (value, digits = 2) => {
    if (!Number.isFinite(value)) return "0";
    return value.toFixed(digits).replace(/\.?0+$/, "");
  };

  const numberValue = (form, name, fallback = 0) => {
    const input = form.elements[name];
    const value = input ? Number(input.value) : fallback;
    return Number.isFinite(value) ? value : fallback;
  };

  const stringerCta = () => `
    <div class="cta-panel" id="download-stringer">
      <h3>Take this stair layout to the job site with Stringer for iPhone</h3>
      <p>Save stair projects offline, compare code-checked riser options, and export a printable stair cut sheet before you cut.</p>
      <div class="cta-row">
        <a class="button" href="${STRINGER_APP_STORE_URL}" rel="nofollow">Download Stringer</a>
      </div>
      <ul class="feature-list" aria-label="Stringer app features">
        <li>Offline support</li>
        <li>Code checks</li>
        <li>PDF cut sheet</li>
      </ul>
    </div>
  `;

  function stairPreviewSvg({ risers, treads, totalRise, actualRun, riserHeight, stairAngle, stringerLength }) {
    const width = 720;
    const height = 360;
    const left = 72;
    const bottom = 286;
    const stairWidth = 520;
    const stairHeight = 210;
    const stepW = stairWidth / Math.max(treads, 1);
    const stepH = stairHeight / Math.max(risers, 1);
    const topX = left + stepW * Math.max(treads, 1);
    const topY = bottom - stepH * Math.max(risers, 1);
    const path = [`M ${left} ${bottom}`];

    for (let index = 0; index < risers; index += 1) {
      path.push(`V ${bottom - stepH * (index + 1)}`);
      if (index < treads) path.push(`H ${left + stepW * (index + 1)}`);
    }

    const radians = stairAngle * Math.PI / 180;
    const angleArc = `M ${left + 24} ${bottom} A 44 44 0 0 0 ${left + 24 + 44 * Math.cos(-radians)} ${bottom - 44 * Math.sin(radians)}`;

    return `
      <svg class="stair-preview-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Visual stair elevation preview">
        <defs>
          <marker id="stair-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8e96a2"></path>
          </marker>
          <linearGradient id="stair-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#fbfcff"></stop>
            <stop offset="1" stop-color="#f1f3f8"></stop>
          </linearGradient>
        </defs>
        <rect class="stair-svg-bg" x="0" y="0" width="${width}" height="${height}" rx="18" fill="url(#stair-bg)"></rect>
        <path class="stair-ground-line" d="M ${left - 12} ${bottom} H ${topX + 24}"></path>
        <path class="stair-stringer-line" d="M ${left} ${bottom} L ${topX} ${topY}"></path>
        <path class="stair-step-line" d="${path.join(" ")}"></path>
        <path class="stair-angle-arc" d="${angleArc}"></path>
        <line class="stair-dimension-line" x1="${left}" y1="${bottom + 46}" x2="${topX}" y2="${bottom + 46}" marker-start="url(#stair-arrow)" marker-end="url(#stair-arrow)"></line>
        <line class="stair-dimension-line" x1="${topX + 44}" y1="${bottom}" x2="${topX + 44}" y2="${topY}" marker-start="url(#stair-arrow)" marker-end="url(#stair-arrow)"></line>
        <text class="stair-svg-label" x="${left + 50}" y="${bottom - 34}">${format(stairAngle, 1)}°</text>
        <text class="stair-svg-label" x="${left + stairWidth * 0.5}" y="${bottom + 72}">${format(actualRun)} in run</text>
        <text class="stair-svg-label" x="${topX + 60}" y="${topY + stairHeight * 0.5}">${format(totalRise)} in rise</text>
        <text class="stair-svg-caption" x="${left}" y="42">${risers} risers @ ${format(riserHeight)} in</text>
        <text class="stair-svg-caption muted" x="${left}" y="66">${format(stringerLength)} in stringer before end cuts</text>
      </svg>
    `;
  }

  function initStairs() {
    const form = document.getElementById("stair-form");
    const result = document.getElementById("stair-result");
    if (!form || !result || form.dataset.stairCalculatorBound === "true") return;
    form.dataset.stairCalculatorBound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const totalRise = numberValue(form, "totalRise", 108);
      const totalRun = numberValue(form, "totalRun", 120);
      const maxRiser = numberValue(form, "maxRiser", 7.75);
      const targetTread = numberValue(form, "targetTread", 10);
      const risers = Math.max(1, Math.ceil(totalRise / maxRiser));
      const treads = Math.max(1, risers - 1);
      const riserHeight = totalRise / risers;
      const treadDepth = totalRun > 0 ? totalRun / treads : targetTread;
      const actualRun = treadDepth * treads;
      const stairAngle = Math.atan(riserHeight / treadDepth) * (180 / Math.PI);
      const plumbAngle = 90 - stairAngle;
      const stringerLength = Math.sqrt(totalRise ** 2 + actualRun ** 2);
      const meetsCommonRiser = riserHeight <= 7.75;
      const codeNote = meetsCommonRiser
        ? "Riser height is within the common 7.75 in residential maximum."
        : "Check local code: riser height is above 7.75 in.";
      const preview = stairPreviewSvg({ risers, treads, totalRise, actualRun, riserHeight, stairAngle, stringerLength });
      const options = [risers - 1, risers, risers + 1]
        .filter((count, index, list) => count >= 2 && list.indexOf(count) === index)
        .map((count) => {
          const optionTreads = count - 1;
          const optionRiser = totalRise / count;
          const optionTread = totalRun / optionTreads;
          const comfort = 2 * optionRiser + optionTread;
          const status = optionRiser <= maxRiser ? "Within target riser" : "Above target riser";
          return `<article class="card"><h3>${count} risers</h3><p><strong>${format(optionRiser)} in</strong> riser · <strong>${format(optionTread)} in</strong> tread</p><p>Comfort check: 2R + T = ${format(comfort)} in · ${status}</p></article>`;
        }).join("");

      result.innerHTML = `
        <h2>Stair stringer result</h2>
        <div class="metric-grid">
          <div class="metric"><strong>${risers}</strong><span>Risers</span></div>
          <div class="metric"><strong>${treads}</strong><span>Treads</span></div>
          <div class="metric"><strong>${format(riserHeight)} in</strong><span>Riser height</span></div>
          <div class="metric"><strong>${format(treadDepth)} in</strong><span>Tread depth</span></div>
        </div>
        <div class="stair-result-card">
          <div class="stair-result-header">
            <div><span class="stair-preview-kicker">Visual elevation preview</span><h3>${risers} risers at ${format(riserHeight)} in</h3><p>See the stair shape, rise/run dimensions, angle, and key layout measurements before marking the stringer.</p></div>
            <span class="stair-code-badge ${meetsCommonRiser ? "pass" : "warn"}">${meetsCommonRiser ? "Common riser check" : "Verify riser height"}</span>
          </div>
          <div class="stair-preview-tabs" aria-label="Stringer preview modes"><span>Elevation</span><a href="/apps/stringer/">Stringer</a><a href="/apps/stringer/">Cut sheet</a></div>
          <div class="stair-preview-frame">${preview}</div>
          <div class="stair-preview-stats" aria-label="Stair layout summary">
            <div><span>Rise</span><strong>${format(totalRise)} in</strong></div><div><span>Run</span><strong>${format(actualRun)} in</strong></div><div><span>Pitch</span><strong>${format(stairAngle, 1)}°</strong></div><div><span>Stringer</span><strong>${format(stringerLength)} in</strong></div>
          </div>
        </div>
        <ul class="plan-list">
          <li><strong>Stair angle</strong>: ${format(stairAngle)} degrees from level.</li>
          <li><strong>Plumb cut angle</strong>: ${format(plumbAngle)} degrees from the stringer edge.</li>
          <li><strong>Approximate stringer length</strong>: ${format(stringerLength)} in before end cuts.</li>
          <li><strong>Total run</strong>: ${format(actualRun)} in.</li>
        </ul>
        <section class="stair-options"><h3>Compare nearby layout options</h3><div class="grid tools">${options}</div></section>
        <p class="notice">${codeNote} Always confirm local building requirements before cutting.</p>
        ${stringerCta()}
      `;
    });
  }

  let fullAppLoading = false;
  function loadFullAppForLanguage(lang) {
    if (!lang || lang === "en" || fullAppLoading || document.querySelector('script[src="/assets/app.js"]')) return;
    fullAppLoading = true;
    localStorage.setItem("woodcuttool-lang", lang);
    const script = document.createElement("script");
    script.src = "/assets/app.js";
    script.defer = true;
    document.head.appendChild(script);
  }

  document.addEventListener("change", (event) => {
    if (event.target?.id === "language-select") loadFullAppForLanguage(event.target.value);
  });

  initStairs();
  loadFullAppForLanguage(localStorage.getItem("woodcuttool-lang") || "en");
})();
