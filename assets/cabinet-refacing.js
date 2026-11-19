import { calculateFronts, edges, sample, scheduleCsv } from "./cabinet-refacing-core.js";

const form = document.querySelector("#cr-form");
const field = (name) => form.elements.namedItem(name);
const byId = (id) => document.getElementById(id);
const preview = byId("cr-preview");
const diagram = byId("cr-diagram");
const schedule = byId("cr-schedule-list");
const status = byId("cr-status");
const save = byId("cr-save");
const cancel = byId("cr-cancel");
const exportButton = byId("cr-export");
const storageKey = "woodcuttool.cabinet-refacing.schedule.v1";
const limit = 100;
let records = [];
let editing = null;

try {
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) {
    const entries = JSON.parse(saved);
    if (!Array.isArray(entries)) throw new Error("Invalid schedule");
    records = entries.slice(0, limit).flatMap((entry) => {
      const result = entry && calculateFronts(entry);
      return result?.record ? [result.record] : [];
    });
    if (records.length !== entries.length) status.textContent = "Some saved openings could not be read.";
  }
} catch {
  status.textContent = "The saved schedule could not be read. This worksheet can still run in this tab.";
}

function persist(message) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(records));
    status.textContent = message;
  } catch {
    status.textContent = message + " Browser storage is unavailable. Download the CSV before leaving.";
  }
}

function setFields(input) {
  for (const key of Object.keys(sample)) field(key).value = input[key] ?? "";
}

function startDraft(example = null) {
  editing = null;
  form.reset();
  if (example) setFields(example);
  save.textContent = "Add to schedule";
  cancel.hidden = true;
  renderPreview();
}

function readDraft() {
  const input = Object.fromEntries(new FormData(form));
  for (const key of ["width", "height", ...edges, "gap"]) {
    input[key] = field(key).valueAsNumber;
  }
  return calculateFronts(input);
}

function shape(rect, bounds, className, label = "") {
  const item = document.createElement("span");
  item.className = className;
  item.style.left = (rect.x - bounds.x) / bounds.width * 100 + "%";
  item.style.top = (rect.y - bounds.y) / bounds.height * 100 + "%";
  item.style.width = rect.width / bounds.width * 100 + "%";
  item.style.height = rect.height / bounds.height * 100 + "%";
  item.textContent = label;
  return item;
}

function draw({ record, leaves, width, height }) {
  const first = leaves[0];
  const x = Math.min(0, first.x);
  const y = Math.min(0, first.y);
  const bounds = {
    x, y,
    width: Math.max(record.width, first.x + width) - x,
    height: Math.max(record.height, first.y + height) - y
  };
  const aspect = bounds.width / bounds.height;
  // Keep very thin shapes visible while preserving their relative positions.
  diagram.style.aspectRatio = Math.min(6, Math.max(0.3, aspect));
  diagram.style.width = Math.min(100, 75 * Math.max(0.3, aspect)) + "%";
  diagram.replaceChildren(
    ...leaves.map((leaf) => shape(leaf, bounds, "cr-leaf", leaf.name)),
    shape({ x: 0, y: 0, width: record.width, height: record.height }, bounds, "cr-opening")
  );
}

function dimensions({ record, leaves }) {
  const leaf = leaves[0];
  return leaf.width + " × " + leaf.height + " " + record.unit;
}

function renderPreview() {
  const isPair = field("layout").value === "pair";
  byId("cr-gap-field").hidden = !isPair;
  field("gap").disabled = !isPair;
  const inset = field("mode").value === "inset";
  byId("cr-edge-caption").textContent = inset ? "Edge clearances" : "Edge overlays";
  byId("cr-edge-help").textContent = inset
    ? "Enter the gap inside each edge of the finished opening."
    : "Enter how far each front edge extends past the finished opening.";
  const result = readDraft();
  const { record, error } = result;
  save.disabled = Boolean(error);
  byId("cr-diagram-box").hidden = Boolean(error);
  if (error) {
    preview.textContent = error;
    return;
  }
  draw(result);
  preview.textContent = (record.layout === "pair" ? "Two equal fronts · " : "Single front · ") +
    dimensions(result) + (record.layout === "pair" ? " each" : "");
}

function action(label, kind, index, opening) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset[kind] = index;
  button.setAttribute("aria-label", label + " " + opening);
  return button;
}

function renderSchedule() {
  schedule.replaceChildren(...records.map((record, index) => {
    const item = document.createElement("li");
    const detail = document.createElement("div");
    const name = document.createElement("strong");
    const spec = document.createElement("span");
    name.textContent = record.label;
    spec.textContent = (record.layout === "pair" ? "2 fronts · " : "1 front · ") +
      dimensions(calculateFronts(record)) + " · " + record.mode;
    detail.append(name, spec);
    const controls = document.createElement("div");
    controls.className = "cr-row-actions";
    controls.append(action("Edit", "edit", index, record.label), action("Remove", "remove", index, record.label));
    item.append(detail, controls);
    return item;
  }));
  byId("cr-empty").hidden = records.length > 0;
  exportButton.disabled = records.length === 0;
}

form.addEventListener("input", renderPreview);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { record } = readDraft();
  if (!record) return;
  if (records.some((entry, index) => index !== editing && entry.label.toLowerCase() === record.label.toLowerCase())) {
    status.textContent = "That opening ID is already saved. Edit the existing row or use a different ID.";
    field("label").focus();
    return;
  }
  if (editing === null && records.length >= limit) {
    status.textContent = "This schedule holds 100 openings. Export it and remove a row to add another.";
    return;
  }
  const updated = editing !== null;
  if (updated) records[editing] = record;
  else records.push(record);
  renderSchedule();
  startDraft();
  persist(record.label + (updated ? " updated." : " added to the schedule."));
  field("label").focus();
});

schedule.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-edit")) {
    editing = Number(button.dataset.edit);
    setFields(records[editing]);
    save.textContent = "Update opening";
    cancel.hidden = false;
    renderPreview();
    field("label").focus();
    return;
  }
  const index = Number(button.dataset.remove);
  const [removed] = records.splice(index, 1);
  if (editing === index) startDraft();
  else if (editing > index) editing -= 1;
  renderSchedule();
  persist(removed.label + " removed from the schedule.");
  const focusTarget = schedule.children[index] ?? schedule.lastElementChild;
  (focusTarget?.querySelector("button") ?? field("label")).focus();
});

byId("cr-example").addEventListener("click", () => {
  startDraft(sample);
  status.textContent = "The B03 example is loaded in the worksheet.";
  field("label").focus();
});
cancel.addEventListener("click", () => {
  startDraft();
  status.textContent = "Edit canceled.";
  field("label").focus();
});
exportButton.addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([scheduleCsv(records)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "cabinet-refacing-door-schedule.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = "Door schedule CSV prepared.";
});

startDraft(sample);
renderSchedule();
