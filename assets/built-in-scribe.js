import {
  assessSurvey, blankSurvey, display, emptyStation, exampleSurvey, maxDimension, maxStations, surveyCsv, unitScale, validSurvey
} from "./built-in-scribe-core.js";

const $ = id => document.getElementById(id);
const key = "wct-built-in-scribe-v1";
const form = $("scribe-form");
const stations = $("scribe-stations");
const rowTemplate = $("scribe-station");
const fields = ["length", "blank", "trim", "uncertainty"];
let survey = exampleSurvey();
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (validSurvey(saved)) survey = saved;
} catch {
  $("scribe-storage").textContent = "Saved worksheet unavailable. The example is open.";
}

function persist() {
  try {
    localStorage.setItem(key, JSON.stringify(survey));
    $("scribe-storage").textContent = "Draft saved in this browser.";
  } catch {
    $("scribe-storage").textContent = "Browser storage unavailable. Download the CSV to keep a copy of completed readings.";
  }
}

function renderForm() {
  const { unit } = survey;
  for (const field of ["name", "datum"]) form.elements.namedItem(field).value = survey[field];
  form.elements.namedItem("unit").value = unit;
  for (const field of fields) form.elements.namedItem(field).value = display(survey[field], unit);
  stations.replaceChildren(...survey.stations.map((row, index) => {
    const element = rowTemplate.content.firstElementChild.cloneNode(true);
    element.dataset.index = index;
    element.querySelector("legend").textContent = "Station " + (index + 1);
    for (const input of element.querySelectorAll("input")) input.value = display(row[input.dataset.field], unit);
    const remove = element.querySelector("button");
    remove.setAttribute("aria-label", "Remove station " + (index + 1));
    remove.disabled = survey.stations.length <= 2;
    return element;
  }));
  form.querySelectorAll("[data-unit]").forEach(label => label.textContent = unit);
  form.querySelectorAll("input[type=number]").forEach(input => input.max = maxDimension / unitScale(unit));
  $("scribe-add").disabled = survey.stations.length >= maxStations;
}

function renderResult() {
  const output = $("scribe-result");
  const result = assessSurvey(survey);
  const invalid = [...form.querySelectorAll("input[type=number]")].some(input => !input.validity.valid);
  const unit = survey.unit;
  output.dataset.state = invalid ? "pending" : result.status;
  $("scribe-status").textContent = invalid ? "Review the highlighted measurements." : result.message;
  $("scribe-export").disabled = invalid || result.reserve === undefined;
  const summary = $("scribe-summary");
  const chart = $("scribe-chart");
  summary.hidden = chart.hidden = invalid || !result.readings;
  if (summary.hidden) {
    chart.replaceChildren();
    return;
  }
  const format = new Intl.NumberFormat("en", { maximumFractionDigits: 4 });
  const measurement = value => value === undefined ? "—" : format.format(value / unitScale(unit)) + " " + unit;
  for (const metric of ["min", "max", "range", "required", "reserve"]) {
    $("scribe-" + metric).textContent = measurement(result[metric]);
  }
  const span = Math.max(result.max, survey.blank || 0, result.required || 0, 1);
  chart.replaceChildren(...result.readings.map(({ position, gap }) => {
    const li = document.createElement("li");
    const positionLabel = document.createElement("span");
    const track = document.createElement("span");
    const width = document.createElement("span");
    const gapLabel = document.createElement("strong");
    positionLabel.textContent = measurement(position);
    track.className = "scribe-track";
    track.setAttribute("aria-hidden", "true");
    width.style.width = (gap / span * 100) + "%";
    track.append(width);
    if (survey.blank > 0) track.style.setProperty("--blank-edge", (survey.blank / span * 100) + "%");
    gapLabel.textContent = measurement(gap);
    li.append(positionLabel, track, gapLabel);
    return li;
  }));
}

function update() {
  persist();
  renderResult();
}

form.addEventListener("submit", event => event.preventDefault());
form.addEventListener("input", event => {
  const input = event.target;
  if (input.tagName !== "INPUT") return;
  const row = input.closest("[data-index]");
  if (input.type === "text") survey[input.name] = input.value;
  else {
    const number = input.valueAsNumber * unitScale(survey.unit);
    const value = input.value && input.validity.valid ? Math.min(number, maxDimension) : null;
    if (row) survey.stations[Number(row.dataset.index)][input.dataset.field] = value;
    else survey[input.name] = value;
  }
  update();
});

form.elements.namedItem("unit").addEventListener("change", event => {
  survey.unit = event.target.value;
  renderForm();
  update();
});
$("scribe-add").addEventListener("click", () => {
  if (survey.stations.length >= maxStations) return;
  survey.stations.push(emptyStation());
  renderForm();
  stations.lastElementChild.querySelector("input").focus();
  update();
});
stations.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button || survey.stations.length <= 2) return;
  const index = Number(button.closest("[data-index]").dataset.index);
  survey.stations.splice(index, 1);
  renderForm();
  stations.children[Math.min(index, survey.stations.length - 1)].querySelector("input").focus();
  update();
});

for (const [id, create] of [["scribe-example", exampleSurvey], ["scribe-new", blankSurvey]]) {
  $(id).addEventListener("click", () => {
    survey = create();
    renderForm();
    update();
    form.elements.namedItem("name").focus();
  });
}

$("scribe-export").addEventListener("click", () => {
  const csv = surveyCsv(survey);
  if (!csv) return;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "cabinet-filler-survey.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

renderForm();
renderResult();
$("scribe-workspace").hidden = false;
