// Generated from assets/app.js by scripts/build-home-runtime.mjs.
(function () {
const t = (text) => window.WCTTranslation?.t?.(text) || text;
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
function initHeroCutPlanner() {
  const form = document.getElementById("hero-cut-form");
  const preview = document.getElementById("hero-plan-preview");
  if (!form || !preview) return;
  if (form.dataset.homePlannerBound === "true") {
    form.WCTRender?.();
    return;
  }
  form.dataset.homePlannerBound = "true";

  const presets = {
    cabinet: { width: 2440, height: 1220, waste: 18, parts: 5, sheets: 2, saved: 48 },
    shelves: { width: 2440, height: 1220, waste: 12, parts: 7, sheets: 2, saved: 64 },
    desk: { width: 2000, height: 900, waste: 24, parts: 4, sheets: 1, saved: 31 }
  };
  let activePreset = "cabinet";
  let addedParts = 0;
  let showBefore = false;

  const render = ({ animate = false } = {}) => {
    const width = Math.max(1, numberValue(form, "sheetWidth", 2440));
    const height = Math.max(1, numberValue(form, "sheetHeight", 1220));
    const wasteTarget = Math.max(8, Math.min(35, numberValue(form, "wasteTarget", presets[activePreset].waste)));
    const area = width * height;
    const baseParts = presets[activePreset]?.parts || 5;
    const sampleParts = Math.max(3, Math.min(10, Math.round(baseParts + addedParts + area / 4200000 - wasteTarget / 30)));
    const visibleWaste = showBefore
      ? Math.min(48, wasteTarget + 15 + addedParts * 3)
      : Math.max(6, wasteTarget - addedParts);
    const sheets = Math.max(
      1,
      Math.min(5, presets[activePreset].sheets + (sampleParts > 7 ? 1 : 0) + (showBefore && visibleWaste > 30 ? 1 : 0))
    );
    const saved = showBefore ? 0 : Math.max(18, Math.round(presets[activePreset].saved + (24 - wasteTarget) * 1.9 - addedParts * 3));
    const extraPieces = Array.from({ length: Math.min(3, Math.max(0, sampleParts - 5)) }, (_, index) => {
      const label = String.fromCharCode(70 + index);
      return `<span class="planner-part extra extra${index + 1}">${label}</span>`;
    }).join("");
    const boardClass = `planner-sheet advanced-sheet ${showBefore ? "layout-before" : "layout-optimized"} ${animate ? "is-optimizing" : ""}`;

    preview.innerHTML = `
      <div class="${boardClass}" aria-hidden="true">
        <span class="planner-part one">A</span>
        <span class="planner-part two">B</span>
        <span class="planner-part three">C</span>
        <span class="planner-part four">D</span>
        <span class="planner-part five">E</span>
        ${extraPieces}
        <span class="planner-waste">${format(visibleWaste, 0)}% demo waste</span>
      </div>
      <div class="lab-stats">
        <div><strong>${sheets}</strong><span>Demo sheets</span></div>
        <div><strong>${sampleParts}</strong><span>Demo pieces</span></div>
        <div><strong>$${saved}</strong><span>Simulated savings</span></div>
      </div>
    `;
    const compareButton = document.querySelector("[data-toggle-before]");
    if (compareButton) {
      compareButton.textContent = t(showBefore ? "Show optimized layout" : "Compare before optimization");
      compareButton.classList.toggle("active", showBefore);
    }
    translateElement(preview, getActiveLang());
  };

  const applyPreset = (name) => {
    const preset = presets[name];
    if (!preset) return;
    activePreset = name;
    addedParts = 0;
    showBefore = false;
    form.elements.sheetWidth.value = preset.width;
    form.elements.sheetHeight.value = preset.height;
    form.elements.wasteTarget.value = preset.waste;
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.classList.toggle("active", button.dataset.preset === name);
    });
    render({ animate: true });
  };

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  document.querySelectorAll("[data-add-part]").forEach((button) => {
    button.addEventListener("click", () => {
      addedParts = Math.min(3, addedParts + 1);
      showBefore = false;
      render({ animate: true });
    });
  });

  document.querySelector("[data-shuffle-layout]")?.addEventListener("click", () => {
    const names = Object.keys(presets);
    activePreset = names[Math.floor(Math.random() * names.length)];
    const preset = presets[activePreset];
    addedParts = Math.floor(Math.random() * 4);
    showBefore = false;
    form.elements.sheetWidth.value = preset.width;
    form.elements.sheetHeight.value = preset.height;
    form.elements.wasteTarget.value = Math.round(8 + Math.random() * 20);
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.classList.toggle("active", button.dataset.preset === activePreset);
    });
    render({ animate: true });
  });

  document.querySelector("[data-toggle-before]")?.addEventListener("click", () => {
    showBefore = !showBefore;
    render({ animate: true });
  });

  form.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showBefore = false;
    render({ animate: true });
  });

  form.WCTRender = render;
  render();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroCutPlanner, { once: true });
} else {
  initHeroCutPlanner();
}
})();
