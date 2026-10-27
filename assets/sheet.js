// Generated from assets/app.js by scripts/build-sheet-runtime.mjs.
(function () {
const APP_STORE_URL = "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871";
const getActiveLang = () => window.WCTTranslation?.getActiveLang?.() || "en";
const translateElement = (root, lang) => window.WCTTranslation?.translateElement?.(root, lang);
const format = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "0";
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, "");
};

const numberValue = (form, name, fallback = 0) => {
  const input = form.elements[name];
  const value = input ? Number(input.value) : fallback;
  return Number.isFinite(value) ? value : fallback;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const appCta = ({
  mode = "adjacent",
  source = "calculator-result",
  title = "",
  description = "",
} = {}) => {
  if (mode !== "plywood") {
    return `
      <div class="cta-panel adjacent-app-cta">
        <p class="eyebrow">Working with sheet goods too?</p>
        <h3>${mode === "board" ? "This result is a linear board estimate" : "Use the right workflow for the material"}</h3>
        <p>${mode === "board"
          ? "CutList is built for plywood, MDF, melamine, and other sheet stock. Open the app details when the project moves from linear boards to saved sheet layouts."
          : "CutList is the saved iPhone and iPad workspace for plywood layouts, cutting sequences, project history, and optional Pro export tools."}</p>
        <div class="cta-row">
          <a class="button secondary" href="/apps/cutlist/">See the CutList sheet-goods workflow</a>
        </div>
      </div>
    `;
  }

  return `
    <section class="conversion-cta conversion-cta-result" id="download-cutlist" data-conversion-cta data-conversion-source="${escapeHtml(source)}">
      <div class="conversion-cta-copy">
        <p class="eyebrow">Keep the checked result</p>
        <h3>${escapeHtml(title || "Do not let this reviewed plywood plan disappear with the browser tab")}</h3>
        <p>${escapeHtml(description || "Create the formal project in CutList, then keep its layout, waste, and step-by-step cutting sequence available offline in the shop.")}</p>
        <div class="cta-row">
          <a class="button" href="${APP_STORE_URL}" data-app-store-link data-platform-label data-conversion-placement="calculator-result" rel="nofollow noopener">Get CutList for saved projects</a>
          <a class="button secondary" href="/apps/cutlist/">See how the app workflow differs</a>
        </div>
        <ul class="conversion-proof-list" aria-label="CutList app features">
          <li>Free basic layouts</li>
          <li>No login</li>
          <li>No cloud upload</li>
          <li>Works offline</li>
        </ul>
        <p class="conversion-honesty-note">This browser draft is not transferred automatically. Re-enter the reviewed parts, or use on-device AI Scan in CutList Pro for a prepared list.</p>
      </div>
      <a class="conversion-qr" href="${APP_STORE_URL}" data-app-store-link data-conversion-placement="calculator-result-qr" aria-label="Scan or open the CutList App Store page">
        <img src="/assets/images/apps/cutlist/cutlist-app-store-qr.svg" width="132" height="132" loading="lazy" alt="QR code to get CutList on the App Store">
        <span><strong>On a computer?</strong> Scan with your iPhone or iPad.</span>
      </a>
    </section>
  `;
};
function initSheetCalculator() {
  const form = document.getElementById("sheet-form");
  const result = document.getElementById("sheet-result");
  if (!form || !result) return;
  // The small page runtime may already be active when translations load app.js.
  if (form.dataset.sheetCalculatorBound === "true") return;
  form.dataset.sheetCalculatorBound = "true";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const sheetLength = numberValue(form, "sheetLength", 96);
    const sheetWidth = numberValue(form, "sheetWidth", 48);
    const partLength = numberValue(form, "partLength", 30);
    const partWidth = numberValue(form, "partWidth", 18);
    const qty = Math.max(1, Math.floor(numberValue(form, "qty", 8)));
    const wastePercent = Math.max(0, numberValue(form, "wastePercent", 15));
    const sheetPrice = Math.max(0, numberValue(form, "sheetPrice", 0));
    const sheetArea = sheetLength * sheetWidth;
    const partArea = partLength * partWidth * qty;
    const requiredArea = partArea * (1 + wastePercent / 100);
    const sheets = sheetArea > 0 ? Math.ceil(requiredArea / sheetArea) : 0;
    const cost = sheets * sheetPrice;
    const estimatedWaste = Math.max(0, sheets * sheetArea - partArea);

    result.innerHTML = `
      <h2>Sheet estimate</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${sheets}</strong><span>Sheets to buy</span></div>
        <div class="metric"><strong>${format(partArea / 144)} ft²</strong><span>Net part area</span></div>
        <div class="metric"><strong>${format(estimatedWaste / 144)} ft²</strong><span>Estimated offcut</span></div>
        <div class="metric"><strong>$${format(cost, 2)}</strong><span>Sheet cost</span></div>
      </div>
      <p class="notice">This is an area estimate. Use the plywood cut calculator when exact part layout, grain direction, and kerf matter.</p>
      ${appCta()}
    `;
    translateElement(result, getActiveLang());
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSheetCalculator, { once: true });
} else {
  initSheetCalculator();
}
})();
