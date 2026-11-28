const form = document.querySelector("[data-urban-record]");
const status = form.querySelector("[data-record-status]");
const printFields = form.closest(".urban-record").querySelectorAll("[data-record-print]");

const example = {
  lotId: "UW-014",
  sourceType: "Urban-tree logs",
  observedDate: "2026-11-18",
  sourceReference: "City storm cleanup, work order PW-218",
  quantity: "1",
  unit: "logs",
  conditionNotes: "Maple, 8 ft long and 17 in. at the small end over bark. Tree crew reported old fence wire near the butt. See photos UW-014-01 and UW-014-02.",
  disposition: "Hold for follow-up",
  responsibleTeam: "Receiving crew",
  nextAction: "Keep UW-014 in the hold area and forward the work order and photos for the mill's intake inspection.",
};

function readFields() {
  const data = new FormData(form);
  const fields = Object.fromEntries(Array.from(data, ([key, value]) => [key, value.trim()]));
  fields.flags = data.getAll("flags");
  return fields;
}

function preparePrint() {
  const fields = readFields();
  fields.flags = fields.flags.join(", ");
  for (const field of printFields) {
    field.textContent = fields[field.dataset.recordPrint];
  }
}

function downloadRecord() {
  if (!form.reportValidity()) return;

  const { quantity, unit, ...fields } = readFields();
  const record = {
    schemaVersion: 1,
    ...fields,
    quantity: { value: Number(quantity), unit },
  };
  const fileId = fields.lotId.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  const blob = new Blob([JSON.stringify(record, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileId ? `urban-wood-intake-${fileId}.json` : "urban-wood-intake.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = "JSON download requested.";
}

function loadExample() {
  form.reset();
  for (const [name, value] of Object.entries(example)) {
    form.elements.namedItem(name).value = value;
  }
  form.querySelector('[name="flags"][value="Metal or hardware"]').checked = true;
  status.textContent = "Fictional example UW-014 loaded.";
}

form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", () => {
  status.textContent = "";
});
form.addEventListener("reset", () => {
  status.textContent = "Record cleared.";
});
window.addEventListener("beforeprint", preparePrint);

for (const [selector, handleClick] of [
  ["[data-record-download]", downloadRecord],
  ["[data-record-print-button]", () => window.print()],
  ["[data-record-sample]", loadExample],
]) {
  const button = form.querySelector(selector);
  button.addEventListener("click", handleClick);
  button.hidden = false;
}
