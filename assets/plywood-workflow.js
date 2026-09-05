import { HANDOFF_KEY, DRAFT_KEY, validateProject, convertProject, calculateProject, cutListCsv } from './cut-handoff-model.js';

function init() {
  const form = document.getElementById('plywood-form');
  const result = document.getElementById('plywood-result');
  if (!form || !result || form.dataset.workflowReady) return;
  form.dataset.workflowReady = 'true';
  form.dataset.managedConversion = 'true';
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const pretty = value => Number(value.toFixed(6));
  const material = id => ({ id, material: 'Plywood', thickness: 0.75, sheetLength: 96, sheetWidth: 48, kerf: 0.125, trim: 0, price: 0, allowRotate: true });
  let project = { version: 1, scenario: 'none', unit: 'in', groups: [material('panels')], parts: [{ label: 'Shelf', length: 30, width: 12, qty: 2, group: 'panels', allowRotate: true }], exclusions: [] };
  let pending = null;
  let savedError = '';
  let currentResult = null;
  let dirty = false;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) { project = validateProject(JSON.parse(raw)); dirty = true; }
  } catch { savedError = 'A saved draft could not be loaded. It has not been overwritten. You can still enter and export a new list.'; }
  let saveAllowed = !savedError;
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (raw) pending = validateProject(JSON.parse(raw));
    else if (location.hash === '#import-cut-list') savedError += ' No pending list was found in this tab. Return to the source page and try again.';
  } catch { savedError += ' The incoming list could not be read. Existing inputs are unchanged.'; }
  form.insertAdjacentHTML('beforebegin', '<section class="plywood-import" id="import-cut-list" aria-label="Incoming cut list" hidden></section>');
  const importPanel = document.getElementById('import-cut-list');
  const notice = document.createElement('p'); notice.className = 'notice'; notice.setAttribute('role', 'status'); form.before(notice);
  notice.textContent = savedError || 'Your draft stays in this browser. No login or upload. Use CSV or JSON to keep a separate copy.';
  const track = (event, details = {}) => window.WCTConversion?.track(event, { ...details, scenario: project.scenario });
  function save() {
    if (!saveAllowed) { notice.textContent = 'The unreadable saved draft is preserved. Export your current list before leaving.'; return; }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(project)); notice.textContent = 'Draft saved in this browser only. Export a copy before clearing browser data.'; }
    catch { notice.textContent = 'Browser storage is unavailable. Keep this tab open and export CSV or JSON before leaving.'; }
  }
  function numberInput(label, name, value, min = '0', step = 'any') {
    return `<label>${label}<input name="${name}" type="number" value="${pretty(value)}" min="${min}" step="${step}" required></label>`;
  }
  function invalidate() {
    currentResult = null;
    result.innerHTML = '<h2>Layout needs calculation</h2><p>Inputs changed. Calculate again to preview and export the current list.</p>';
  }
  function renderForm() {
    form.dataset.scenario = project.scenario;
    form.innerHTML = `
      <label>Display units <select name="unit"><option value="in" ${project.unit === 'in' ? 'selected' : ''}>Inches</option><option value="mm" ${project.unit === 'mm' ? 'selected' : ''}>Millimeters</option></select></label>
      <p>Length follows the sheet grain. Rotation is allowed only when both the material group and the panel allow it. Each group is packed separately.</p>
      <div data-material-groups>${project.groups.map((g, index) => `<fieldset data-group="${esc(g.id)}"><legend>Material group ${index + 1}</legend><div class="plywood-fields">
        <label>Material<input name="material" value="${esc(g.material)}" maxlength="100" required></label>
        ${numberInput(`Thickness (${project.unit})`, 'thickness', g.thickness, '0.001')}
        ${numberInput(`Sheet length (${project.unit})`, 'sheetLength', g.sheetLength, '0.01')}
        ${numberInput(`Sheet width (${project.unit})`, 'sheetWidth', g.sheetWidth, '0.01')}
        ${numberInput(`Saw kerf (${project.unit})`, 'kerf', g.kerf)}
        ${numberInput(`Trim per edge (${project.unit})`, 'trim', g.trim)}
        ${numberInput('Price / sheet ($; 0 if unknown)', 'price', g.price)}
        <label>Allow group rotation<select name="allowRotate"><option value="yes" ${g.allowRotate ? 'selected' : ''}>Yes</option><option value="no" ${!g.allowRotate ? 'selected' : ''}>No — grain along length</option></select></label>
      </div><button class="button secondary small" type="button" data-remove-group="${esc(g.id)}" ${project.groups.length === 1 ? 'disabled' : ''}>Remove empty group</button></fieldset>`).join('')}</div>
      <button class="button secondary" type="button" data-add-group>Add material group</button>
      <fieldset><legend>Panels</legend><div id="plywood-rows">${project.parts.map((p, i) => `<div class="plywood-part" data-part="${i}"><strong>Panel row ${i + 1}</strong><div class="plywood-fields">
        <label>Panel name<input name="label" value="${esc(p.label)}" maxlength="100" required></label>
        ${numberInput(`Length (${project.unit})`, 'length', p.length, '0.01')}${numberInput(`Width (${project.unit})`, 'width', p.width, '0.01')}${numberInput('Quantity', 'qty', p.qty, '1', '1')}
        <label>Material group<select name="group">${project.groups.map((g, j) => `<option value="${esc(g.id)}" ${p.group === g.id ? 'selected' : ''}>${j + 1}: ${esc(g.material)} — ${pretty(g.thickness)} ${project.unit}</option>`).join('')}</select></label>
        <label>Allow panel rotation<select name="allowRotate"><option value="yes" ${p.allowRotate ? 'selected' : ''}>Yes, if group allows</option><option value="no" ${!p.allowRotate ? 'selected' : ''}>No — lock grain</option></select></label>
        </div><button class="button secondary small" type="button" data-remove-part="${i}" ${project.parts.length === 1 ? 'disabled' : ''}>Remove panel row</button></div>`).join('')}</div>
        <button class="button secondary" type="button" id="add-plywood-row">Add panel</button>
      </fieldset>
      ${project.exclusions.length ? `<aside class="notice"><strong>Scope to review</strong><ul>${project.exclusions.map(s => `<li>${esc(s)}</li>`).join('')}</ul><a href="/cut-list-calculator/">Plan separate lumber cuts</a></aside>` : ''}
      <p role="alert" data-input-error></p>
      <button class="button" type="submit">Optimize plywood layout</button>`;
  }
  function read() {
    const field = (el, name) => el.querySelector(`[name="${name}"]`).value;
    const number = (el, name) => { const value = field(el, name); return value.trim() ? Number(value) : NaN; };
    return validateProject({ ...project,
      groups: [...form.querySelectorAll('[data-group]')].map(el => ({ id: el.dataset.group, material: field(el, 'material'), thickness: number(el, 'thickness'), sheetLength: number(el, 'sheetLength'), sheetWidth: number(el, 'sheetWidth'), kerf: number(el, 'kerf'), trim: number(el, 'trim'), price: number(el, 'price'), allowRotate: field(el, 'allowRotate') === 'yes' })),
      parts: [...form.querySelectorAll('[data-part]')].map(el => ({ label: field(el, 'label'), length: number(el, 'length'), width: number(el, 'width'), qty: number(el, 'qty'), group: field(el, 'group'), allowRotate: field(el, 'allowRotate') === 'yes' })),
    });
  }
  function error(message) { form.querySelector('[data-input-error]').textContent = message; }
  function commit() { project = read(); dirty = true; save(); }
  function showImport() {
    if (!pending) return;
    importPanel.hidden = false;
    importPanel.innerHTML = `<h2>Review incoming ${esc(pending.scenario === 'none' ? 'component' : pending.scenario.replaceAll('-', ' '))} list</h2>
      <p>${pending.parts.reduce((n, p) => n + p.qty, 0)} panels in ${pending.groups.length} material groups. ${dirty ? 'Your existing draft is loaded below. Replacing it requires your choice.' : 'Review these assumptions before replacing the sample inputs.'}</p>
      <ul>${pending.groups.map(g => `<li>${esc(g.material)}: ${g.thickness} ${pending.unit}; ${g.sheetLength} × ${g.sheetWidth} ${pending.unit}; rotation ${g.allowRotate ? 'allowed' : 'locked'}</li>`).join('')}${pending.exclusions.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      <label><input type="checkbox" data-accept-scope> I reviewed the material assumptions and excluded items.</label>
      <div class="row-actions"><button class="button" type="button" data-accept-import>Use incoming list${dirty ? ' and replace current draft' : ''}</button><button class="button secondary" type="button" data-cancel-import>Keep current inputs</button></div><p role="alert" data-import-error></p>`;
    importPanel.querySelector('[data-accept-import]').addEventListener('click', () => {
      if (!importPanel.querySelector('[data-accept-scope]').checked) { importPanel.querySelector('[data-import-error]').textContent = 'Review and check the assumptions before continuing.'; return; }
      project = pending; pending = null; dirty = true; saveAllowed = true;
      try { sessionStorage.removeItem(HANDOFF_KEY); } catch { /* The active list remains in memory. */ }
      importPanel.hidden = true; renderForm(); invalidate(); save(); track('calculator_import');
      form.querySelector('input')?.focus();
    });
    importPanel.querySelector('[data-cancel-import]').addEventListener('click', () => {
      pending = null; importPanel.hidden = true;
      try { sessionStorage.removeItem(HANDOFF_KEY); } catch { /* Inputs stay unchanged. */ }
      notice.textContent = 'Kept your current inputs. The incoming list was not applied.';
    });
  }
  form.addEventListener('input', () => { dirty = true; invalidate(); });
  form.addEventListener('change', event => {
    try {
      if (event.target.name === 'unit') {
        const unit = event.target.value;
        project = convertProject(read(), unit); dirty = true; save(); renderForm();
      } else commit();
      error(''); invalidate();
    } catch (err) { if (event.target.name === 'unit') event.target.value = project.unit; error(err.message); }
  });
  form.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.type === 'submit') return;
    try {
      project = read();
      if (button.hasAttribute('data-add-group')) {
        if (project.groups.length >= 10) throw new Error('Maximum 10 material groups.');
        let id = 1; while (project.groups.some(g => g.id === `material-${id}`)) id++;
        const next = material(`material-${id}`);
        if (project.unit === 'mm') for (const key of ['thickness', 'sheetLength', 'sheetWidth', 'kerf', 'trim']) next[key] *= 25.4;
        project.groups.push(next);
      } else if (button.hasAttribute('data-remove-group')) {
        const id = button.dataset.removeGroup;
        if (project.parts.some(p => p.group === id)) throw new Error('Move or remove this group’s panel rows before removing the group.');
        project.groups = project.groups.filter(g => g.id !== id);
      } else if (button.id === 'add-plywood-row') {
        if (project.parts.length >= 100) throw new Error('Maximum 100 panel rows.');
        project.parts.push({ label: 'Panel', length: project.unit === 'mm' ? 762 : 30, width: project.unit === 'mm' ? 304.8 : 12, qty: 1, group: project.groups[0].id, allowRotate: true });
      } else if (button.hasAttribute('data-remove-part')) project.parts.splice(Number(button.dataset.removePart), 1);
      else return;
      dirty = true; save(); renderForm(); invalidate();
    } catch (err) { error(err.message); }
  });
  function download(name, content, type) {
    const blob = new Blob([content], { type }); const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = href; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  function renderResult(calculation) {
    const factor = project.unit === 'mm' ? 25.4 : 1;
    const size = v => pretty(v * factor);
    result.innerHTML = `<h2>${calculation.complete ? 'All listed panels placed' : 'Incomplete panel layout'}</h2>
      <p class="notice">${calculation.sheets} sheets across ${calculation.groups.length} separate material groups. ${calculation.rejected} panels could not be placed. ${project.exclusions.length ? 'This is a panel layout, not a complete project or purchase list.' : 'Verify the physical cutting sequence and actual stock before buying.'}</p>
      ${project.exclusions.length ? `<ul>${project.exclusions.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      <p>Rectangle-packing estimate; no guarantee of a globally optimal or guillotine-cuttable layout. Grain runs along the length axis. Trim is removed from all four sheet edges.</p>
      <div class="row-actions"><button class="button" type="button" data-export-csv>Export current cut list CSV</button><button class="button secondary" type="button" data-export-json>Export project JSON</button><button class="button secondary" type="button" data-print-summary>Print summary</button><button class="button secondary" type="button" data-adjust-list>Adjust inputs</button></div>
      ${calculation.groups.map((g, index) => `<section class="plywood-group-result"><h3>${esc(g.group.material)} — ${size(g.group.thickness)} ${project.unit}</h3><p>${g.plan.sheets.length} sheets; ${g.plan.sheets.length ? pretty(100 - g.plan.wastePercent) : 0}% usable-area yield; ${g.group.price ? `$${pretty(g.plan.sheets.length * g.group.price)} sheet cost` : 'sheet price not entered'}. Usable stock: ${size(g.length)} × ${size(g.width)} ${project.unit}.</p>
        ${g.plan.rejected.length ? `<p class="notice"><strong>Unplaced:</strong> ${g.plan.rejected.map(p => `${esc(p.label)} (${size(p.length)} × ${size(p.width)} ${project.unit})`).join(', ')}. Change stock, trim or permitted orientation; these panels are excluded from the sheet count.</p>` : ''}
        ${g.plan.sheets.length ? `<label>Preview sheet <select data-sheet-selector="${index}">${g.plan.sheets.map((_, i) => `<option value="${i}">Sheet ${i + 1} of ${g.plan.sheets.length}</option>`).join('')}</select></label><canvas class="sheet-preview" data-group-canvas="${index}" aria-label="${esc(g.group.material)} sheet preview"></canvas><button class="button secondary" type="button" data-save-image="${index}">Save selected sheet image</button>` : ''}
        <details><summary>View all placed panels (${g.plan.sheets.reduce((n, sheet) => n + sheet.placements.length, 0)})</summary><ul>${g.plan.sheets.flatMap((sheet, i) => sheet.placements.map(p => `<li>Sheet ${i + 1}: ${esc(p.label)} — ${size(p.length)} × ${size(p.width)} ${project.unit}${p.rotated ? ', rotated' : ''}</li>`)).join('')}</ul></details></section>`).join('')}
      <p><a href="/checklists/assembly-release/">Review the assembly release checklist</a> · <a href="/cut-list-calculator/">Calculate lumber cuts separately</a></p>
      ${window.WCTPlywoodCore.appCta({ mode: 'plywood', source: 'plywood-result', title: 'Keep reviewed projects in CutList', description: 'CutList supports saved revisions and shop exports. Re-create and verify your reviewed list in the app; this browser action does not transfer the project to the app.' })}
      <p role="status" data-export-status></p>`;
    const draw = (index, sheetIndex = 0) => {
      const g = calculation.groups[index]; window.WCTPlywoodCore.drawSheet(result.querySelector(`[data-group-canvas="${index}"]`), [g.plan.sheets[sheetIndex]], g.length, g.width);
    };
    calculation.groups.forEach((g, i) => { if (g.plan.sheets.length) draw(i); });
    result.querySelectorAll('[data-sheet-selector]').forEach(select => select.addEventListener('change', () => draw(Number(select.dataset.sheetSelector), Number(select.value))));
    result.querySelector('[data-export-csv]').addEventListener('click', () => {
      try { download('woodcuttool-cut-list.csv', cutListCsv(project, calculation), 'text/csv;charset=utf-8'); track('cut_list_export', { format: 'csv' }); result.querySelector('[data-export-status]').textContent = 'CSV prepared for download with material groups and layout limitations.'; } catch { result.querySelector('[data-export-status]').textContent = 'CSV could not be created. Try Print summary.'; }
    });
    result.querySelector('[data-export-json]').addEventListener('click', () => {
      try { download('woodcuttool-project.json', JSON.stringify(project, null, 2), 'application/json'); track('cut_list_export', { format: 'json' }); result.querySelector('[data-export-status]').textContent = 'Project JSON prepared for download.'; } catch { result.querySelector('[data-export-status]').textContent = 'JSON could not be created. Try Print summary.'; }
    });
    result.querySelector('[data-print-summary]').addEventListener('click', () => window.print());
    result.querySelector('[data-adjust-list]').addEventListener('click', () => form.querySelector('input').focus());
    result.querySelectorAll('[data-save-image]').forEach(button => button.addEventListener('click', () => {
      const canvas = result.querySelector(`[data-group-canvas="${button.dataset.saveImage}"]`);
      canvas.toBlob(blob => {
        if (!blob) return;
        download('woodcuttool-selected-sheet.png', blob, 'image/png'); track('image_download', { source: 'plywood-result' });
      });
    }));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    track('calculator_submit', { calculator: 'plywood' });
    try {
      commit(); error('');
      currentResult = calculateProject(project, window.WCTPlywoodCore.packSheets);
      renderResult(currentResult);
      track('calculator_complete', { calculator: 'plywood', result_class: currentResult.complete ? 'complete' : 'incomplete' });
    } catch (err) { invalidate(); error(err.message); }
  });
  // Avoid counting the default demonstration as a completed user calculation.
  renderForm(); invalidate(); showImport();
  window.addEventListener('resize', () => {
    if (!currentResult) return;
    result.querySelectorAll('[data-sheet-selector]').forEach(select => {
      const g = currentResult.groups[Number(select.dataset.sheetSelector)];
      window.WCTPlywoodCore.drawSheet(result.querySelector(`[data-group-canvas="${select.dataset.sheetSelector}"]`), [g.plan.sheets[Number(select.value)]], g.length, g.width);
    });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
