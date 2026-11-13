import {
  emptyStop, evaluateStop, formatDimension, kinds, labels, maxDimension, maxStops,
  orientations, routeCsv, samplePlan, scale, storageKey, validPlan
} from "./furniture-fit-core.js";

const byId = id => document.getElementById(id);
const pieceForm = byId("ff-piece");
const stopForm = byId("ff-stop");
const list = byId("ff-route");
const result = byId("ff-result");
const summary = byId("ff-summary");
const status = byId("ff-status");
const editor = byId("ff-editor");
const transitions = byId("ff-transitions");
const unitInput = byId("ff-unit");
const importInput = byId("ff-import");
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const title = key => key[0].toUpperCase() + key.slice(1);
const dimensions = ["width", "height", "depth"];
const getControl = (form, name) => form.elements.namedItem(name);

let plan = samplePlan();
let selected = 0;
let storageAvailable = true;

try {
  const stored = JSON.parse(localStorage.getItem(storageKey));
  if (validPlan(stored)) plan = stored;
} catch {
  status.textContent = "The previous plan could not be read. You can work from the example or import a backup.";
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(plan));
  } catch {
    storageAvailable = false;
    byId("ff-storage").textContent = "Browser storage is unavailable. Download a JSON backup to keep your work.";
  }
}

function fillForm(form, record, fields) {
  for (const name of fields) {
    const control = getControl(form, name);
    control.value = control.type === "number" ? formatDimension(record[name], plan.unit) : record[name];
    if (control.type === "number") {
      control.max = maxDimension / scale(plan.unit);
      control.setCustomValidity("");
    }
  }
}

function display(value) {
  if (value === null) return "—";
  return formatDimension(value, plan.unit) + " " + plan.unit;
}

function renderRoute() {
  const states = plan.stops.map(stop => evaluateStop(plan, stop).status);
  const count = key => states.filter(state => state === key).length;
  const groups = [["clear", "meet allowance"], ["tight", "below allowance"], ["contact", "no clearance"], ["blocked", "too small"], ["review", "field review"], ["pending", "unmeasured"]];
  summary.textContent = states.length ? groups.filter(([key]) => count(key)).map(([key, label]) => count(key) + " " + label).join(" · ") : "Add the first checkpoint.";
  const turns = plan.stops.flatMap((stop, index) => {
    const previous = plan.stops[index - 1];
    return previous && kinds[stop.kind].axes.length && kinds[previous.kind].axes.length && stop.orientation !== previous.orientation
      ? [index + " → " + (index + 1)]
      : [];
  });
  transitions.hidden = turns.length === 0;
  transitions.textContent = turns.length ? "Orientation changes between stops " + turns.join(", ") + ". Check where the piece can turn or tip." : "";
  list.innerHTML = plan.stops.map((stop, index) => `<li><button type="button" data-stop="${index}" aria-pressed="${index === selected}">
    <span class="ff-stop-number">${index + 1}</span><span><strong>${escape(stop.name || kinds[stop.kind].label)}</strong>
    <small class="ff-state" data-state="${states[index]}">${labels[states[index]]}</small></span></button></li>`).join("");
  byId("ff-add").disabled = plan.stops.length >= maxStops;
  byId("ff-csv").disabled = plan.stops.length === 0;
}

function bars(check) {
  const maximum = Math.max(check.piece || 0, check.clear || 0);
  if (!maximum || check.piece === null || check.clear === null) return "";
  return `<div class="ff-bars" aria-hidden="true"><span style="width:${check.clear / maximum * 100}%"></span><span style="width:${check.piece / maximum * 100}%"></span></div>`;
}

function renderResult() {
  const stop = plan.stops[selected];
  if (!stop) {
    result.innerHTML = "";
    return;
  }
  const { status: state, checks } = evaluateStop(plan, stop);
  result.innerHTML = `<h4 class="ff-state" data-state="${state}">${labels[state]}</h4>` + (checks.length ? `
    <p class="ff-key"><span>Clear span</span><span>Piece extent</span></p>
    <div class="ff-comparisons">${checks.map(check => `<section>
      <strong>${title(check.axis)}</strong>${bars(check)}
      <dl><div><dt>Clear span</dt><dd>${display(check.clear)}</dd></div><div><dt>Piece extent</dt><dd>${display(check.piece)}</dd></div>
      <div><dt>After allowance</dt><dd>${display(check.reserve)}</dd></div></dl>
    </section>`).join("")}</div>` :
    "<p>Record the geometry and arrange a site check for the movement through this point. Use the notes to capture measurements and what needs to be tested.</p>");
}

function renderEditor() {
  const stop = plan.stops[selected];
  editor.hidden = !stop;
  if (!stop) return renderResult();
  fillForm(stopForm, stop, ["name", "kind", "orientation", "note", ...dimensions]);
  const axes = kinds[stop.kind].axes;
  getControl(stopForm, "orientation").closest("label").hidden = !axes.length;
  for (const axis of dimensions) getControl(stopForm, axis).closest("label").hidden = !axes.includes(axis);
  byId("ff-up").disabled = selected === 0;
  byId("ff-down").disabled = selected === plan.stops.length - 1;
  renderResult();
}

function render() {
  unitInput.value = plan.unit;
  document.querySelectorAll("[data-ff-unit]").forEach(node => { node.textContent = plan.unit; });
  fillForm(pieceForm, plan, ["name", ...dimensions, "allowance"]);
  renderRoute();
  renderEditor();
}

function edit(event, record) {
  const field = event.target;
  if (field === unitInput || !Object.hasOwn(record, field.name)) return;
  if (field.type === "number") {
    const value = field.valueAsNumber * scale(plan.unit);
    const allowsZero = field.name === "allowance";
    const missing = field.value === "" && !field.validity.badInput;
    const invalid = !missing && (!Number.isFinite(value) || value > maxDimension || (allowsZero ? value < 0 : value <= 0));
    field.setCustomValidity(invalid ? "Enter a dimension within the supported range." : "");
    record[field.name] = invalid || missing ? null : value;
  } else {
    record[field.name] = field.value;
  }
  save();
  renderRoute();
  if (field.name === "kind") renderEditor();
  else renderResult();
}

function move(offset) {
  const destination = selected + offset;
  [plan.stops[selected], plan.stops[destination]] = [plan.stops[destination], plan.stops[selected]];
  selected = destination;
  save();
  render();
  list.querySelector('[aria-pressed="true"]')?.focus();
}

function replace(next, message) {
  plan = next;
  selected = 0;
  save();
  render();
  status.textContent = message;
}

function download(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

pieceForm.addEventListener("submit", event => event.preventDefault());
stopForm.addEventListener("submit", event => event.preventDefault());
pieceForm.addEventListener("input", event => edit(event, plan));
stopForm.addEventListener("input", event => edit(event, plan.stops[selected]));
unitInput.addEventListener("change", () => {
  plan.unit = unitInput.value;
  save();
  render();
});
list.addEventListener("click", event => {
  const button = event.target.closest("[data-stop]");
  if (!button) return;
  list.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
  selected = Number(button.dataset.stop);
  button.setAttribute("aria-pressed", "true");
  renderEditor();
  byId("ff-stop-heading").focus({ preventScroll: true });
  byId("ff-stop-heading").scrollIntoView({ block: "nearest" });
});
byId("ff-add").addEventListener("click", () => {
  if (plan.stops.length >= maxStops) return;
  selected = plan.stops.push(emptyStop()) - 1;
  save();
  render();
  getControl(stopForm, "name").focus();
});
byId("ff-up").addEventListener("click", () => move(-1));
byId("ff-down").addEventListener("click", () => move(1));
byId("ff-remove").addEventListener("click", () => {
  if (!confirm("Remove this checkpoint from the route?")) return;
  plan.stops.splice(selected, 1);
  selected = Math.min(selected, plan.stops.length - 1);
  save();
  render();
  list.querySelector('[aria-pressed="true"]')?.focus();
  if (!plan.stops.length) byId("ff-add").focus();
});
byId("ff-sample").addEventListener("click", () => {
  if (confirm("Replace the current route with the hall cabinet example?")) replace(samplePlan(), "Example loaded.");
});
byId("ff-new").addEventListener("click", () => {
  if (!confirm("Replace the current route with a blank plan?")) return;
  replace({ version: 1, unit: plan.unit, name: "", width: null, height: null, depth: null, allowance: null, stops: [emptyStop()] }, "Blank route created.");
  getControl(pieceForm, "name").focus();
});
byId("ff-csv").addEventListener("click", () => download("furniture-fit-route.csv", routeCsv(plan), "text/csv;charset=utf-8"));
byId("ff-backup").addEventListener("click", () => download("furniture-fit-plan.json", JSON.stringify(plan, null, 2), "application/json"));
importInput.addEventListener("change", async () => {
  const file = importInput.files[0];
  importInput.value = "";
  if (!file) return;
  try {
    if (file.size > 250000) throw new Error("File too large");
    const next = JSON.parse(await file.text());
    if (!validPlan(next)) throw new Error("Invalid plan");
    if (confirm("Replace the current route with the imported plan?")) replace(next, "Plan imported.");
  } catch {
    status.textContent = "Could not import this file. Choose a Furniture Fit JSON backup under 250 KB.";
  }
});

render();
save();
if (storageAvailable) byId("ff-storage").textContent = "Changes are saved in this browser.";
