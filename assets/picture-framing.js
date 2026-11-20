import { fields, sample, planFrame, frameCsv } from "./picture-frame-core.js";

const storageKey = "woodcuttool.picture-framing.v1";
const form = document.querySelector("#pf-form");
const unitField = form.elements.namedItem("unit");
const output = document.querySelector("#pf-output");
const status = document.querySelector("#pf-status");
const exportButton = document.querySelector("#pf-export");
const storageNote = document.querySelector("#pf-storage");
const canvas = document.querySelector("#pf-diagram");
const keys = Object.keys(fields);

let unit = "mm";
let measurements = { ...sample };
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && ["mm", "in"].includes(saved.unit) &&
      keys.every(key => saved.measurements?.[key] === null || Number.isFinite(saved.measurements?.[key]))) {
    unit = saved.unit;
    measurements = saved.measurements;
  }
} catch {
  storageNote.textContent = "Previous measurements could not be restored in this browser.";
}

let plan;
const scale = () => unit === "in" ? 25.4 : 1;
const formatNumber = value => Number((value / scale()).toFixed(6)).toString();
const formatSize = value => formatNumber(value) + " " + unit;
const formatPair = values => values.map(formatNumber).join(" × ") + " " + unit;

function fillFields() {
  unitField.value = unit;
  for (const key of keys) {
    const value = measurements[key];
    form.elements.namedItem(key).value = value === null ? "" : String(Number((value / scale()).toFixed(9)));
  }
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ unit, measurements }));
    storageNote.textContent = "Your measurements are saved in this browser.";
  } catch {
    storageNote.textContent = "Browser storage is unavailable. Download a CSV to retain a completed cut list.";
  }
}

function drawFrame({outside, rabbet, sight}) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const {width, height} = canvas;
  const ratio = Math.min((width - 64) / outside[0], (height - 54) / outside[1]);
  const rectangle = ([w, h]) => [(width - w * ratio) / 2, (height - h * ratio) / 2, w * ratio, h * ratio];
  const outer = rectangle(outside);
  const inner = rectangle(sight);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#aa724c";
  context.fillRect(...outer);
  context.fillStyle = "#fffaf2";
  context.fillRect(...inner);
  context.lineWidth = 2.5;
  context.strokeStyle = "#4b3022";
  context.strokeRect(...outer);
  context.beginPath();
  for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    context.moveTo(outer[0] + x * outer[2], outer[1] + y * outer[3]);
    context.lineTo(inner[0] + x * inner[2], inner[1] + y * inner[3]);
  }
  context.stroke();
  context.strokeStyle = "#385e56";
  context.strokeRect(...inner);
  context.strokeStyle = "#283747";
  context.setLineDash([6, 5]);
  context.strokeRect(...rectangle(rabbet));
  context.setLineDash([]);
}

function render() {
  plan = planFrame(measurements);
  output.hidden = Boolean(plan.error);
  exportButton.disabled = !plan.ready;
  status.dataset.state = plan.ready ? "ready" : "review";
  if (plan.error) {
    status.textContent = plan.error;
    return;
  }

  const issues = [];
  if (plan.minimumOverlap <= 1e-8) issues.push("The package can shift clear of the bearing lip.");
  if (plan.depthRemaining < -1e-8) issues.push("The stack and retainer reserve exceed the rabbet depth.");
  if (!plan.sticks) issues.push("At least one part exceeds the usable stick length.");
  status.textContent = issues.join(" ") || "The entered stock, bearing overlap and depth pass the worksheet checks.";

  drawFrame(plan);
  document.querySelector("#pf-dimensions").innerHTML = [
    ["Outside", formatPair(plan.outside)],
    ["Back rabbet opening", formatPair(plan.rabbet)],
    ["Front sight opening", formatPair(plan.sight)],
    ["Minimum bearing overlap", formatSize(plan.minimumOverlap)],
    ["Depth after retainer reserve", formatSize(plan.depthRemaining)]
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");

  document.querySelector("#pf-parts").innerHTML = plan.parts.map(part =>
    `<tr><th scope="row">${part.name}</th><td>${formatNumber(part.long)}</td><td>${formatNumber(part.rabbet)}</td><td>${formatNumber(part.short)}</td></tr>`
  ).join("");
  document.querySelector("#pf-part-caption").textContent = "Lengths in " + (unit === "in" ? "inches" : "millimeters");
  const stickCount = plan.sticks?.length;
  const usable = formatSize(plan.capacity);
  document.querySelector("#pf-stock-summary").textContent = stickCount
    ? `${stickCount} ${stickCount === 1 ? "stick" : "sticks"} needed with ${usable} usable per stick. Part lengths below are long point to long point.`
    : `Each stick has ${usable} of usable length. Enter longer stock or revise the frame dimensions to allocate all four parts.`;
  document.querySelector("#pf-sticks").innerHTML = (plan.sticks || []).map(({members, used, remaining}) =>
    `<li><strong>${members.map(part => part.name + " " + formatSize(part.long)).join(" + ")}</strong><span>${formatSize(used)} used · ${formatSize(remaining)} left after allowances</span></li>`
  ).join("");
}

form.addEventListener("submit", event => event.preventDefault());
form.addEventListener("input", ({target}) => {
  if (!keys.includes(target.name)) return;
  measurements[target.name] = Number.isFinite(target.valueAsNumber) ? target.valueAsNumber * scale() : null;
  save();
  render();
});
unitField.addEventListener("change", () => {
  unit = unitField.value;
  fillFields();
  save();
  render();
});
document.querySelector("#pf-example").addEventListener("click", () => {
  measurements = { ...sample };
  fillFields();
  save();
  render();
});
exportButton.addEventListener("click", () => {
  const csv = frameCsv(plan, unit);
  if (!csv) return;
  const url = URL.createObjectURL(new Blob([csv], {type: "text/csv;charset=utf-8"}));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "picture-frame-cut-list.csv";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

fillFields();
render();
