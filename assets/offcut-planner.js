import { cleanOffcut, cleanPart, cleanProjectPart, newId, planProject, rankedMatches } from "/assets/offcut-core.js";

const root = document.querySelector("[data-offcut-planner]");
if (root) {
  const key = "woodcuttool.offcut-planner.v1";
  const projectKey = "woodcuttool.offcut-project.v1";
  const inventoryForm = root.querySelector("[data-inventory-form]");
  const partForm = root.querySelector("[data-part-form]");
  const inventoryList = root.querySelector("[data-inventory-list]");
  const matchesList = root.querySelector("[data-matches-list]");
  const status = root.querySelector("[data-offcut-status]");
  const count = root.querySelector("[data-inventory-count]");
  const inventorySearch = root.querySelector("[data-inventory-search]");
  const projectForm = root.querySelector("[data-project-form]");
  const projectList = root.querySelector("[data-project-list]");
  const allocationList = root.querySelector("[data-allocation-list]");
  const projectStatus = root.querySelector("[data-project-status]");
  let offcuts = [];
  let matches = [];
  let parts = [];
  let allocations = [];
  let storageAvailable = true;
  let projectStorageAvailable = true;
  let editingId = null;

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
    const query = inventorySearch.value.trim().toLocaleLowerCase();
    const shown = query ? offcuts.filter((item) => [item.label, item.material, item.note].some((value) => value.toLocaleLowerCase().includes(query))) : offcuts;
    count.textContent = `${offcuts.length} saved piece${offcuts.length === 1 ? "" : "s"}${query ? ` · ${shown.length} shown` : ""}`;
    inventoryList.innerHTML = shown.length ? shown.map((item) => `<li class="offcut-item"><div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.material)} · ${format(item.thickness)} in thick · ${format(item.length)} × ${format(item.width)} in${item.grain ? " · grain along length" : ""}</span>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}</div><div class="offcut-item-actions"><button type="button" data-edit="${escapeHtml(item.id)}" aria-label="Edit ${escapeHtml(item.label)}">Edit</button><button type="button" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.label)}">Remove</button></div></li>`).join("") : `<li class="offcut-empty">${offcuts.length ? "No saved pieces match this search." : "No offcuts recorded yet. Measure a clean rectangle and add the first piece."}</li>`;
    for (const button of inventoryList.querySelectorAll("[data-edit]")) button.addEventListener("click", () => startEdit(button.dataset.edit));
    for (const button of inventoryList.querySelectorAll("[data-remove]")) button.addEventListener("click", () => removeOffcut(button.dataset.remove));
  }
  function finishEdit() {
    editingId = null;
    inventoryForm.reset();
    root.querySelector("[data-inventory-form-title]").textContent = "Add a measured piece";
    root.querySelector("[data-save-inventory]").textContent = "Save piece";
    root.querySelector("[data-cancel-inventory-edit]").hidden = true;
  }
  function startEdit(id) {
    const item = offcuts.find((stock) => stock.id === id);
    if (!item) return;
    editingId = item.id;
    for (const name of ["label", "material", "thickness", "length", "width", "note"]) inventoryForm.elements.namedItem(name).value = item[name];
    inventoryForm.elements.grain.checked = item.grain;
    root.querySelector("[data-inventory-form-title]").textContent = `Edit ${item.label}`;
    root.querySelector("[data-save-inventory]").textContent = "Save changes";
    root.querySelector("[data-cancel-inventory-edit]").hidden = false;
    inventoryForm.elements.label.focus();
    setStatus(`Editing ${item.label}. Save changes or cancel.`);
  }
  function removeOffcut(id) {
    if (editingId === id) finishEdit();
    offcuts = offcuts.filter((item) => item.id !== id);
    save(); renderInventory(); updateMatches(); updateProject();
  }
  function renderMatches() {
    matchesList.innerHTML = matches.length ? matches.map((item, index) => `<li class="offcut-match"><span class="offcut-rank">${index + 1}</span><div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.orientation)} · needs a ${format(item.needLength)} × ${format(item.needWidth)} in blank including trim and kerf</p><small>${format(item.remainingArea / 144)} sq ft remains by area only; actual reusable shape depends on the cut.</small></div></li>`).join("") : '<li class="offcut-empty">Enter a part to check your saved pieces. A match will appear here.</li>';
  }
  function saveProject() {
    try {
      localStorage.setItem(projectKey, JSON.stringify({ version: 1, parts }));
      projectStorageAvailable = true;
    } catch {
      projectStorageAvailable = false;
    }
  }
  function renderProject() {
    root.querySelector("[data-project-count]").textContent = `${parts.length} part${parts.length === 1 ? "" : "s"}`;
    projectList.innerHTML = parts.length ? parts.map((part) => `<li class="offcut-item"><div><strong>${escapeHtml(part.label)}</strong><span>${escapeHtml(part.material)} · ${format(part.thickness)} in thick · ${format(part.length)} × ${format(part.width)} in${part.grain ? " · grain along length" : ""}</span><small>Trim ${format(part.trim)} in per edge · kerf ${format(part.kerf)} in${part.rotate && !part.grain ? " · rotation allowed" : ""}</small></div><button type="button" data-remove-part="${escapeHtml(part.id)}" aria-label="Remove ${escapeHtml(part.label)}">Remove</button></li>`).join("") : '<li class="offcut-empty">No project parts yet. Add one part per physical piece needed.</li>';
  }
  function updateProject() {
    allocations = planProject(offcuts, parts);
    const covered = allocations.filter((row) => row.match).length;
    root.querySelector("[data-allocation-count]").textContent = `${covered} of ${parts.length} allocated`;
    allocationList.innerHTML = allocations.length ? allocations.map(({ part, match, candidateCount }) => `<li class="offcut-assignment"><span class="offcut-rank${match ? "" : " offcut-rank-open"}">${match ? "✓" : "!"}</span><div><strong>${escapeHtml(part.label)}</strong>${match ? `<p>Pick ${escapeHtml(match.label)} · ${escapeHtml(match.orientation)} · blank ${format(match.needLength)} × ${format(match.needWidth)} in</p><small>Check the labeled piece before cutting.</small>` : `<p>${candidateCount ? "No distinct piece available; candidate stock is allocated to another part." : "No saved piece fits the material, thickness, grain, and size rules."}</p>`}</div></li>`).join("") : '<li class="offcut-empty">Add project parts to preview a one-piece-per-part allocation.</li>';
    projectStatus.textContent = `${parts.length ? `${covered} of ${parts.length} parts have distinct candidate offcuts. This is a stock pick list, not a cutting layout.` : "Add parts to see which saved offcuts can cover this project."}${projectStorageAvailable ? "" : " Browser storage is unavailable; download the pick list before leaving."}`;
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
  try {
    const stored = JSON.parse(localStorage.getItem(projectKey) || "null");
    if (stored?.version === 1 && Array.isArray(stored.parts)) parts = stored.parts.slice(0, 50).map(cleanProjectPart).filter(Boolean);
  } catch {
    projectStorageAvailable = false;
  }
  renderInventory();
  renderMatches();
  renderProject();
  updateProject();

  inventoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(inventoryForm));
    const item = cleanOffcut({ ...data, id: editingId ?? undefined, grain: inventoryForm.elements.grain.checked });
    if (!item) { setStatus("Enter a label, material, and positive dimensions up to 1,200 inches."); return; }
    if (!editingId && offcuts.length >= 500) { setStatus("The inventory is limited to 500 pieces. Export a backup and remove old entries before adding more."); return; }
    if (editingId) offcuts = offcuts.map((stock) => stock.id === editingId ? item : stock);
    else offcuts.unshift(item);
    const wasEditing = Boolean(editingId);
    finishEdit();
    save();
    renderInventory();
    updateMatches();
    updateProject();
    if (storageAvailable) setStatus(`${wasEditing ? "Updated" : "Added"} ${item.label}. It stays in this browser until removed or browser storage is cleared.`);
  });
  inventorySearch.addEventListener("input", renderInventory);
  root.querySelector("[data-cancel-inventory-edit]").addEventListener("click", () => { finishEdit(); setStatus("Edit canceled. Inventory is unchanged."); });
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
        while (ids.has(id)) id = newId();
        ids.add(id);
        return { ...item, id };
      });
      offcuts = [...offcuts, ...unique];
      save(); renderInventory(); updateMatches(); updateProject();
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
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(projectForm));
    const part = cleanProjectPart({ ...data, rotate: projectForm.elements.rotate.checked, grain: projectForm.elements.grain.checked });
    if (!part) { projectStatus.textContent = "Enter a part label, material, positive dimensions, and valid trim and kerf allowances."; return; }
    if (parts.length >= 50) { projectStatus.textContent = "A project is limited to 50 parts. Export the pick list and clear the project before planning another batch."; return; }
    parts.push(part);
    saveProject(); renderProject(); updateProject();
    projectForm.elements.label.value = "";
    projectForm.elements.namedItem("length").value = "";
    projectForm.elements.width.value = "";
    projectForm.elements.label.focus();
  });
  projectList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-part]");
    if (!button) return;
    parts = parts.filter((part) => part.id !== button.dataset.removePart);
    saveProject(); renderProject(); updateProject();
  });
  root.querySelector("[data-clear-project]").addEventListener("click", () => {
    if (!parts.length || !window.confirm("Clear all project parts from this browser? Your offcut inventory will stay saved.")) return;
    parts = [];
    saveProject(); renderProject(); updateProject();
  });
  root.querySelector("[data-export-plan]").addEventListener("click", () => {
    if (!parts.length) { projectStatus.textContent = "Add at least one project part before exporting a pick list."; return; }
    const rows = [["part_label", "material", "thickness_in", "part_length_in", "part_width_in", "trim_per_edge_in", "kerf_in", "grain_required", "status", "offcut_label", "offcut_id", "orientation", "blank_length_in", "blank_width_in"], ...allocations.map(({ part, match }) => [part.label, part.material, part.thickness, part.length, part.width, part.trim, part.kerf, part.grain ? "yes" : "no", match ? "candidate - verify" : "unallocated", match?.label ?? "", match?.id ?? "", match?.orientation ?? "", match?.needLength ?? "", match?.needWidth ?? ""])];
    download("woodcuttool-offcut-project-pick-list.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n", "text/csv;charset=utf-8");
    projectStatus.textContent = "Pick list downloaded. Verify every candidate on the rack, then update inventory after cutting.";
  });
}
