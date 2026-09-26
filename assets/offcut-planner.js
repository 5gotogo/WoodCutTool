import { cleanOffcut, cleanPart, rankedMatches } from "/assets/offcut-core.js";

const root = document.querySelector("[data-offcut-planner]");
if (root) {
  const key = "woodcuttool.offcut-planner.v1";
  const inventoryForm = root.querySelector("[data-inventory-form]");
  const partForm = root.querySelector("[data-part-form]");
  const inventoryList = root.querySelector("[data-inventory-list]");
  const matchesList = root.querySelector("[data-matches-list]");
  const status = root.querySelector("[data-offcut-status]");
  const count = root.querySelector("[data-inventory-count]");
  let offcuts = [];
  let matches = [];
  let storageAvailable = true;

  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const format = (value) => Number(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

  function setStatus(message) { status.textContent = `${message}${storageAvailable ? "" : " Browser storage is unavailable; export a JSON backup before leaving."}`; }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, offcuts }));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
      setStatus("Browser storage is unavailable. Your list works until this page closes; export a backup to keep it.");
    }
  }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function renderInventory() {
    count.textContent = `${offcuts.length} saved piece${offcuts.length === 1 ? "" : "s"}`;
    inventoryList.innerHTML = offcuts.length ? offcuts.map((item) => `<li class="offcut-item"><div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.material)} · ${format(item.thickness)} in thick · ${format(item.length)} × ${format(item.width)} in${item.grain ? " · grain along length" : ""}</span>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}</div><button type="button" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.label)}">Remove</button></li>`).join("") : '<li class="offcut-empty">No offcuts recorded yet. Measure a clean rectangle and add the first piece.</li>';
  }
  function renderMatches() {
    matchesList.innerHTML = matches.length ? matches.map((item, index) => `<li class="offcut-match"><span class="offcut-rank">${index + 1}</span><div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.orientation)} · needs a ${format(item.needLength)} × ${format(item.needWidth)} in blank including trim and kerf</p><small>${format(item.remainingArea / 144)} sq ft remains by area only; actual reusable shape depends on the cut.</small></div></li>`).join("") : '<li class="offcut-empty">Enter a part to check your saved pieces. A match will appear here.</li>';
  }
  function updateMatches() {
    const data = Object.fromEntries(new FormData(partForm));
    const part = cleanPart({ ...data, rotate: partForm.elements.rotate.checked, grain: partForm.elements.grain.checked });
    if (!part) { matches = []; renderMatches(); return; }
    matches = rankedMatches(offcuts, part);
    renderMatches();
    setStatus(matches.length ? `${matches.length} candidate${matches.length === 1 ? "" : "s"} fit this single part by recorded dimensions. Inspect the actual stock before cutting.` : "No recorded offcut fits this part and its current constraints. Change the dimensions or add a suitable piece.");
  }

  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    if (stored?.version === 1 && Array.isArray(stored.offcuts)) offcuts = stored.offcuts.slice(0, 500).map(cleanOffcut).filter(Boolean);
  } catch {
    storageAvailable = false;
    setStatus("Browser storage is unavailable. Your list works until this page closes; export a backup to keep it.");
  }
  renderInventory();
  renderMatches();

  inventoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(inventoryForm));
    const item = cleanOffcut({ ...data, grain: inventoryForm.elements.grain.checked });
    if (!item) { setStatus("Enter a label, material, and positive dimensions up to 1,200 inches."); return; }
    if (offcuts.length >= 500) { setStatus("The inventory is limited to 500 pieces. Export a backup and remove old entries before adding more."); return; }
    offcuts.unshift(item);
    save();
    renderInventory();
    updateMatches();
    inventoryForm.reset();
    if (storageAvailable) setStatus(`Added ${item.label}. It stays in this browser until removed or browser storage is cleared.`);
  });
  inventoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    offcuts = offcuts.filter((item) => item.id !== button.dataset.remove);
    save(); renderInventory(); updateMatches();
  });
  partForm.addEventListener("submit", (event) => { event.preventDefault(); updateMatches(); });
  root.querySelector("[data-export-inventory]").addEventListener("click", () => {
    download("woodcuttool-offcuts.json", JSON.stringify({ version: 1, unit: "in", offcuts }, null, 2) + "\n", "application/json");
    setStatus("Inventory backup downloaded. Keep the JSON file if you may clear browser storage.");
  });
  root.querySelector("[data-import-inventory]").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 200000) throw new Error("File is too large.");
      const data = JSON.parse(await file.text());
      if (data.version !== 1 || data.unit !== "in" || !Array.isArray(data.offcuts) || data.offcuts.length > 500) throw new Error("Use a WoodCutTool offcut JSON backup with at most 500 pieces.");
      const incoming = data.offcuts.map(cleanOffcut);
      if (incoming.some((item) => !item)) throw new Error("The backup contains an invalid piece.");
      if (offcuts.length + incoming.length > 500) throw new Error("The combined inventory exceeds 500 pieces.");
      const ids = new Set(offcuts.map((item) => item.id));
      const unique = incoming.map((item) => {
        let id = item.id;
        while (ids.has(id)) id = crypto.randomUUID();
        ids.add(id);
        return { ...item, id };
      });
      offcuts = [...offcuts, ...unique];
      save(); renderInventory(); updateMatches();
      setStatus(`Imported ${incoming.length} pieces into your inventory.`);
    } catch (error) { setStatus(`Import failed: ${error.message}`); }
    event.target.value = "";
  });
  root.querySelector("[data-export-matches]").addEventListener("click", () => {
    if (!matches.length) { setStatus("Run a part check with at least one match before exporting."); return; }
    const rows = [["rank", "label", "material", "thickness_in", "offcut_length_in", "offcut_width_in", "orientation", "required_blank_length_in", "required_blank_width_in", "remaining_area_sq_in"], ...matches.map((item, index) => [index + 1, item.label, item.material, item.thickness, item.length, item.width, item.orientation, item.needLength, item.needWidth, item.remainingArea.toFixed(3)])];
    download("woodcuttool-offcut-matches.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n", "text/csv;charset=utf-8");
    setStatus("Match CSV downloaded. Confirm defects, grain, and cutting sequence against the physical piece.");
  });
}
