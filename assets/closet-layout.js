import { bayTypes, formatDimension, partsCsv, planCloset, presets } from "./closet-layout-core.js";

const form = document.querySelector("#cl-form");
const rows = document.querySelector("#cl-bays");
const template = document.querySelector("#cl-bay-template");
const preset = document.querySelector("#cl-preset");
const status = document.querySelector("#cl-status");
const storage = document.querySelector("#cl-storage");
const output = document.querySelector("#cl-output");
const elevation = document.querySelector("#cl-elevation");
const budget = document.querySelector("#cl-budget");
const bayTable = document.querySelector("#cl-bay-results");
const partsTable = document.querySelector("#cl-parts");
const exportButton = document.querySelector("#cl-export");
const addButton = document.querySelector("#cl-add");
const widths = ["low", "middle", "high"];
const panelFields = ["maxHeight", "maxDepth", "height", "depth", "thickness", "left", "right", "shelfGap", "setback"];
const fieldNames = [...widths, ...panelFields];
const storageKey = "woodcuttool.closet-layout.v1";
let unit = "mm";
let result;

const field = name => form.elements.namedItem(name);
const scale = unit => unit === "in" ? 25.4 : 1;
const toMm = value => value.trim() === "" ? NaN : Number(value) * scale(unit);
const convert = (mm, target) => String(Number((mm / scale(target)).toFixed(9)));

function addBay(bay = { type: "shelves", width: "", shelves: "3" }) {
  const row = template.content.firstElementChild.cloneNode(true);
  for (const key of ["type", "width", "shelves"]) row.querySelector(`[data-bay="${key}"]`).value = bay[key];
  rows.append(row);
  return row;
}

function numberBays() {
  [...rows.children].forEach((row, index) => {
    const label = `Bay ${index + 1}`;
    row.querySelector("legend").textContent = label;
    const remove = row.querySelector("[data-remove]");
    remove.setAttribute("aria-label", `Remove bay ${index + 1}`);
    remove.disabled = rows.children.length <= 1;
  });
  addButton.disabled = rows.children.length >= 8;
}

function draft() {
  return {
    unit,
    fields: Object.fromEntries(fieldNames.map(key => [key, field(key).value])),
    bays: [...rows.children].map(row => Object.fromEntries(
      [...row.querySelectorAll("[data-bay]")].map(el => [el.dataset.bay, el.value])
    ))
  };
}

function savedDraft() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey));
    if (["mm", "in"].includes(data?.unit) && fieldNames.every(key => typeof data.fields?.[key] === "string") &&
        Array.isArray(data.bays) && data.bays.length >= 1 && data.bays.length <= 8 &&
        data.bays.every(bay => bay && Object.hasOwn(bayTypes, bay.type) && typeof bay.width === "string" && typeof bay.shelves === "string")) {
      return data;
    }
  } catch { /* Storage can be unavailable or contain a damaged draft. */ }
  return null;
}

function save(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    storage.textContent = "Saved in this browser.";
  } catch {
    storage.textContent = "Browser storage is unavailable. Download the schedule to keep a copy.";
  }
}

function showDraft(state) {
  unit = state.unit;
  field("unit").value = unit;
  for (const key of fieldNames) field(key).value = state.fields[key];
  rows.replaceChildren();
  for (const bay of state.bays) addBay(bay);
  numberBays();
  update();
}

function showPreset(key) {
  const sample = presets[key];
  const fields = Object.fromEntries([
    ...widths.map((key, index) => [key, convert(sample.widths[index], unit)]),
    ...panelFields.map(key => [key, convert(sample[key], unit)])
  ]);
  showDraft({
    unit, fields,
    bays: sample.bays.map(bay => ({ ...bay, width: bay.width === null ? "" : convert(bay.width, unit) }))
  });
}

function tableRow(values) {
  const row = document.createElement("tr");
  for (const [index, value] of values.entries()) {
    const cell = document.createElement(index === 0 ? "th" : "td");
    if (index === 0) cell.scope = "row";
    cell.textContent = value;
    row.append(cell);
  }
  return row;
}

function draw() {
  const strip = (kind, width) => {
    const el = document.createElement("div");
    el.className = `cl-strip cl-${kind}`;
    el.style.flexBasis = `${width / result.opening * 100}%`;
    elevation.append(el);
    return el;
  };
  const thickness = result.parts[0].thickness;
  elevation.replaceChildren();
  strip("filler", result.left);
  strip("upright", thickness);
  for (const bay of result.bays) {
    const opening = strip("opening", bay.width);
    if (bay.width / result.opening >= 0.055) {
      const badge = document.createElement("span");
      badge.textContent = bay.number;
      opening.append(badge);
    }
    const marker = (kind, position) => {
      const el = document.createElement("i");
      el.className = `cl-${kind}`;
      el.style.top = `${position}%`;
      opening.append(el);
    };
    const start = bay.type === "shelves" ? 16 : 14;
    const end = bay.type === "shelves" ? 78 : 20;
    for (let i = 0; i < bay.shelves; i++) marker("shelf", start + (end - start) * (i + 1) / (bay.shelves + 1));
    if (bay.type !== "shelves") marker("rod", 28);
    if (bay.type === "double") marker("rod", 59);
    strip("upright", thickness);
  }
  strip("unallocated", result.unallocated);
  strip("filler", result.right);
}

function update() {
  const state = draft();
  const hasBadInput = [...form.querySelectorAll("input")].some(el => el.validity.badInput);
  result = hasBadInput ? { error: "Finish entering the incomplete number." } : planCloset({
    widths: widths.map(key => toMm(state.fields[key])),
    ...Object.fromEntries(panelFields.map(key => [key, toMm(state.fields[key])])),
    bays: state.bays.map(bay => ({
      type: bay.type, width: bay.width.trim() === "" ? null : toMm(bay.width),
      shelves: bay.shelves.trim() === "" ? NaN : Number(bay.shelves)
    }))
  });
  save(state);
  output.hidden = Boolean(result.error);
  exportButton.disabled = Boolean(result.error);
  status.classList.toggle("cl-highlight", Boolean(result.error || result.unallocated));
  if (result.error) {
    status.textContent = result.error;
    return;
  }
  const number = mm => formatDimension(mm, unit);
  const measure = mm => `${number(mm)} ${unit}`;
  status.textContent = result.unallocated
    ? `${measure(result.unallocated)} is unallocated. Assign it to a bay or a filler before releasing parts.`
    : "The width budget balances. Verify supports, door access and hardware before cutting.";
  budget.replaceChildren(...[
    ["Tightest opening", result.opening],
    ["Uprights", result.panelBudget],
    ["Left + right filler", result.left + result.right],
    ["Clear bay budget", result.clearBudget]
  ].map(([label, mm]) => {
    const block = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const value = document.createElement("dd");
    value.textContent = measure(mm);
    block.append(term, value);
    return block;
  }));
  let left = result.left + result.parts[0].thickness;
  bayTable.replaceChildren(...result.bays.map(bay => {
    const end = left + bay.width;
    const row = tableRow([
      `Bay ${bay.number}`, bayTypes[bay.type], measure(bay.width), bay.shelves,
      `${number(left)}–${measure(end)}`
    ]);
    left = end + result.parts[0].thickness;
    return row;
  }));
  partsTable.replaceChildren(...result.parts.map(part => tableRow([
    part.part, part.quantity, measure(part.length), measure(part.depth), measure(part.thickness)
  ])));
  draw();
}

form.addEventListener("submit", event => event.preventDefault());
form.addEventListener("input", event => {
  if (event.target === field("unit")) {
    const next = field("unit").value;
    for (const input of form.querySelectorAll('input[data-dimension]')) {
      if (input.value !== "") input.value = convert(toMm(input.value), next);
    }
    unit = next;
  }
  update();
});
addButton.addEventListener("click", () => {
  addBay().querySelector("[data-bay=type]").focus();
  numberBays();
  update();
});
rows.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button || rows.children.length <= 1) return;
  const row = button.closest("fieldset");
  const neighbor = row.nextElementSibling || row.previousElementSibling;
  row.remove();
  numberBays();
  neighbor.querySelector("[data-bay=type]").focus();
  update();
});
document.querySelector("#cl-load").addEventListener("click", () => showPreset(preset.value));
exportButton.addEventListener("click", () => {
  if (!result?.parts) return;
  const url = URL.createObjectURL(new Blob([partsCsv(result.parts, unit)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `closet-panel-schedule-${unit}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const requested = new URL(location.href);
const key = requested.searchParams.get("example");
const saved = savedDraft();
if (Object.hasOwn(presets, key)) {
  preset.value = key;
  unit = saved?.unit || "mm";
  showPreset(key);
  requested.searchParams.delete("example");
  history.replaceState(history.state, "", requested);
} else if (saved) showDraft(saved);
else showPreset("reach-in");
