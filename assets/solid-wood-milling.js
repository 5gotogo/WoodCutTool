import { fields, plan, sample } from "./solid-wood-milling-core.js";

const storageKey = "woodcuttool.solid-wood-milling.v1";
const form = document.querySelector("#milling-form");
const unit = form.elements.unit;
const output = document.querySelector("#milling-result");
const status = document.querySelector("#milling-status");
const csv = document.querySelector("#milling-csv");
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });
let currentUnit = sample.unit;
let exportRows;

function read() {
  return { unit: unit.value, ...Object.fromEntries(fields.map(([key]) => [key, form.elements.namedItem(key).valueAsNumber])) };
}

function load(input) {
  currentUnit = unit.value = input.unit;
  for (const [key] of fields) form.elements.namedItem(key).value = input[key];
}

function measurement(value, units) {
  return `${number.format(value)} ${units}`;
}

function update() {
  for (const label of form.querySelectorAll("[data-unit]")) label.textContent = unit.value;
  exportRows = null;
  csv.disabled = true;
  const input = read();
  let result;
  try {
    result = plan(input);
  } catch (error) {
    output.textContent = error.message;
    status.textContent = "The last valid draft is kept on this device when browser storage is available.";
    return;
  }
  const m = (value) => measurement(value, input.unit);
  const batch = result.shortfall
    ? `${number.format(result.shortfall)} short of the requested batch`
    : `${number.format(result.surplus)} spare candidates after the requested batch`;
  const axis = (label, count, blank, remainder, usable) => {
    const blankShare = usable ? count * blank / usable * 100 : 0;
    const kerfShare = usable ? count * input.kerf / usable * 100 : 0;
    return `<div class="milling-axis">
      <div><strong>${label}</strong><span>${number.format(count)} slots · ${m(remainder)} unallocated</span></div>
      <div class="milling-bar" aria-hidden="true"><span style="width:${blankShare}%"></span><span style="width:${kerfShare}%"></span></div>
    </div>`;
  };
  output.innerHTML = `
    <div class="milling-total"><strong>${number.format(result.yieldCount)}</strong><div>Candidate blanks<span>${batch}</span></div></div>
    <dl class="milling-details">
      <div><dt>Rough blank footprint</dt><dd>${number.format(result.blankLength)} × ${m(result.blankWidth)}</dd></div>
      <div><dt>Estimated clean thickness</dt><dd>${m(result.cleanThickness)}</dd></div>
      <div><dt>Clear board footprint</dt><dd>${number.format(result.usableLength)} × ${m(result.usableWidth)}</dd></div>
      <div><dt>Thickness margin</dt><dd>${m(result.thicknessMargin)}</dd></div>
    </dl>
    ${result.thicknessMargin < 0 ? `<p class="milling-alert">Thickness is below target. The footprint alone fits ${number.format(result.candidates)} candidates.</p>` : ""}
    <div class="milling-axes">
      ${axis("Crosscut positions", result.positions, result.blankLength, result.lengthRemainder, result.usableLength)}
      ${axis("Rip lanes", result.lanes, result.blankWidth, result.widthRemainder, result.usableWidth)}
      <div class="milling-legend"><span>Blank stock</span><span>Kerf</span><span>Unallocated</span></div>
    </div>`;
  exportRows = [
    ["section", "field", "value", "unit"],
    ...fields.map(([key]) => ["input", key, input[key], key === "quantity" ? "count" : input.unit]),
    ...Object.entries(result).map(([key, value]) => [
      "result", key, value, ["positions", "lanes", "candidates", "yieldCount", "shortfall", "surplus"].includes(key) ? "count" : input.unit
    ])
  ];
  csv.disabled = false;
  try {
    localStorage.setItem(storageKey, JSON.stringify(input));
    status.textContent = "Saved in this browser.";
  } catch {
    status.textContent = "Browser storage is unavailable. Export the current estimate to keep a copy.";
  }
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  plan(saved);
  load(saved);
} catch {
  load(sample);
}
form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", (event) => {
  if (event.target !== unit) update();
});
unit.addEventListener("change", () => {
  if (unit.value === currentUnit) return;
  const factor = unit.value === "in" ? 1 / 25.4 : 25.4;
  for (const [key] of fields) {
    const field = form.elements.namedItem(key);
    if (key !== "quantity" && Number.isFinite(field.valueAsNumber)) {
      field.value = Math.round(field.valueAsNumber * factor * 1000) / 1000;
    }
  }
  currentUnit = unit.value;
  update();
});
document.querySelector("#milling-sample").addEventListener("click", () => {
  load(sample);
  update();
});
csv.addEventListener("click", () => {
  if (!exportRows) return;
  const blob = new Blob([exportRows.map((row) => row.join(",")).join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "solid-wood-milling-plan.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
update();
