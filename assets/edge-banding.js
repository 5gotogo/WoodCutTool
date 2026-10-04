import { EDGES, STORAGE_KEY, sampleProject, validateProject, calculateProject, partsCsv, suppliesCsv, layoutProject } from './edge-banding-core.js';
import { HANDOFF_KEY } from './cut-handoff-model.js';

const form = document.querySelector('#eb-form');
if (form) {
  const $ = s => document.querySelector(s);
  const esc = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  let project = sampleProject(), result = null, saveAllowed = true, pending = null;
  const status = message => { $('#eb-status').textContent = message; };
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) project = validateProject(JSON.parse(raw)); }
  catch { saveAllowed = false; status('The saved project could not be read and is preserved. Export your current project before leaving.'); }
  const display = n => Number((n / (project.unit === 'in' ? 25.4 : 1)).toFixed(8));
  const pretty = n => Number((n / (project.unit === 'in' ? 25.4 : 1)).toFixed(project.unit === 'in' ? 4 : 3));
  const field = (label, name, value, dimension = true, min = '0', step = 'any') => `<label>${label}<input name="${name}" type="number" inputmode="decimal" value="${dimension ? display(value) : value}" min="${min}" step="${step}" required></label>`;
  function renderForm() {
    const u = project.unit;
    $('#eb-unit').value = u; $('#eb-mode').value = project.mode;
    $('#eb-setup').innerHTML = `<div class="eb-profile-grid">${project.profiles.map(p => `<fieldset data-profile="${p.id}"><legend><span class="eb-chip eb-${p.id}">${p.id}</span> Edging profile</legend><label>Name / color<input name="label" maxlength="100" value="${esc(p.label)}" required></label><div class="eb-pair">${field(`Thickness (${u})`, 'thickness', p.thickness, true, '0.00001')}${field(`Tape width (${u})`, 'width', p.width, true, '0.00001')}</div>${field('Roll length (m)', 'rollLength', p.rollLength / 1000, false, '0.001')}<p>Use the effective added thickness from a finished test piece.</p></fieldset>`).join('')}</div><details class="eb-settings"><summary>Process allowances & sheet stock</summary><div class="eb-fields">${field(`Pre-mill / banded edge (${u})`, 'preMill', project.settings.preMill)}${field(`Extra tape / end (${u})`, 'endTrim', project.settings.endTrim)}${field(`Tape overhang / face (${u})`, 'faceTrim', project.settings.faceTrim)}${field('Extra tape waste (%)', 'waste', project.settings.waste, false)}${field(`Stock length (${u})`, 'sheetLength', project.settings.sheetLength, true, '0.001')}${field(`Stock width (${u})`, 'sheetWidth', project.settings.sheetWidth, true, '0.001')}${field(`Saw kerf (${u})`, 'kerf', project.settings.kerf)}${field(`Sheet trim / edge (${u})`, 'sheetTrim', project.settings.sheetTrim)}</div><p>Pre-milling removes stock only at banded edges. Kerf belongs to sheet layout and is not added to individual blanks.</p></details>`;
    $('#eb-parts').innerHTML = project.parts.map((p, i) => `<fieldset class="eb-part" data-part="${i}"><legend><span class="eb-number">${String(i + 1).padStart(2, '0')}</span> Part row</legend><div class="eb-part-body"><div><div class="eb-fields"><label>Part name<input name="label" value="${esc(p.label)}" maxlength="100" required></label><label>Panel material<input name="material" value="${esc(p.material)}" maxlength="100" required></label>${field(`${project.mode === 'finished' ? 'Finished' : 'Saw'} length (${u})`, 'length', p.length, true, '0.00001')}${field(`${project.mode === 'finished' ? 'Finished' : 'Saw'} width (${u})`, 'width', p.width, true, '0.00001')}${field(`Panel thickness (${u})`, 'thickness', p.thickness, true, '0.00001')}${field('Quantity', 'qty', p.qty, false, '1', '1')}</div><label class="eb-check"><input type="checkbox" name="grain" ${p.grain ? 'checked' : ''}>Keep grain along length</label><button type="button" class="eb-text" data-remove="${i}" ${project.parts.length === 1 ? 'disabled' : ''}>Remove this row</button></div><div class="eb-edge-editor"><p class="eb-caption">Length runs left → right</p><div class="eb-panel-map" role="group" aria-label="${esc(p.label)} edge map">${EDGES.map(e => `<button type="button" class="eb-map-${e} eb-${p.edges[e] || 'none'}" data-cycle="${e}" aria-label="${e} edge: ${p.edges[e] || 'none'}. Change edging profile.">${e}<span>${p.edges[e] || '—'}</span></button>`).join('')}<span class="eb-grain" aria-hidden="true">${p.grain ? '→ → →' : '↔ ↕'}</span></div><div class="eb-edge-selects">${EDGES.map(e => `<label>${e[0].toUpperCase() + e.slice(1)} edge<select name="${e}"><option value="">None</option>${project.profiles.map(profile => `<option value="${profile.id}" ${p.edges[e] === profile.id ? 'selected' : ''}>${profile.id} · ${esc(profile.label)}</option>`).join('')}</select></label>`).join('')}</div><p class="eb-part-result" data-part-result="${i}"></p></div></div></fieldset>`).join('');
    $('#eb-add').disabled = project.parts.length >= 100;
  }
  function read() {
    const factor = project.unit === 'in' ? 25.4 : 1;
    const val = (root, n) => root.querySelector(`[name="${n}"]`).value;
    const num = (root, n, dimension = true) => { const v = val(root, n); return v.trim() ? (dimension ? Number((Number(v) * factor).toFixed(6)) : Number(v)) : NaN; };
    const setup = $('#eb-setup'), settings = {};
    for (const k of Object.keys(project.settings)) settings[k] = num(setup, k, k !== 'waste');
    return { ...project, settings,
      profiles: [...form.querySelectorAll('[data-profile]')].map(el => ({ id: el.dataset.profile, label: val(el, 'label'), thickness: num(el, 'thickness'), width: num(el, 'width'), rollLength: num(el, 'rollLength', false) * 1000 })),
      parts: [...form.querySelectorAll('[data-part]')].map(el => ({ label: val(el, 'label'), material: val(el, 'material'), length: num(el, 'length'), width: num(el, 'width'), thickness: num(el, 'thickness'), qty: num(el, 'qty', false), grain: el.querySelector('[name="grain"]').checked, edges: Object.fromEntries(EDGES.map(e => [e, val(el, e)])) })) };
  }
  function save() {
    if (!saveAllowed) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); status('Saved in this browser. Export a project backup to keep a separate copy.'); }
    catch { status('Browser storage is unavailable. Export a backup before closing this tab.'); }
  }
  function renderResults() {
    const box = $('#eb-results');
    if (!result) { box.innerHTML = '<h2>Check the inputs above</h2><p>The current cut list is unavailable until the input errors are resolved.</p>'; return; }
    const u = project.unit, tape = n => (n / 1000).toFixed(3);
    box.innerHTML = `<div class="eb-section-title"><div><p class="eb-overline">03 / REVIEW & EXPORT</p><h2>Your shop list</h2></div><span class="eb-badge">${result.count} physical parts</span></div>${result.issues.length ? `<div class="eb-errors"><strong>Resolve before export</strong><ul>${result.issues.map(v => `<li>${esc(v.message)}</li>`).join('')}</ul></div>` : '<p class="eb-success">Dimensions and tape widths pass the entered constraints. Verify a finished test piece before releasing the list.</p>'}<div class="eb-table-wrap" tabindex="0" role="region" aria-label="Saw and finished dimensions"><table><thead><tr><th>Part / qty</th><th>Saw blank (${u})</th><th>After pre-mill (${u})</th><th>Finished (${u})</th><th>Edges L / R / T / B</th></tr></thead><tbody>${result.parts.map(p => `<tr><th>${esc(p.label)}<small>${esc(p.material)} · ${p.qty} × · ${pretty(p.thickness)} ${u}</small></th><td>${pretty(p.sawLength)} × ${pretty(p.sawWidth)}</td><td>${pretty(p.substrateLength)} × ${pretty(p.substrateWidth)}</td><td>${pretty(p.finishedLength)} × ${pretty(p.finishedWidth)}</td><td>${EDGES.map(e => p.edges[e] || '—').join(' / ')}</td></tr>`).join('')}</tbody></table></div><h3>Edging purchase estimate</h3><div class="eb-supplies">${result.supplies.map(s => `<article class="eb-supply"><p><span class="eb-chip eb-${s.id}">${s.id}</span> ${esc(s.label)}</p><strong>${tape(s.purchase)} <span>m to allow</span></strong><dl><div><dt>Strips</dt><dd>${s.strips}</dd></div><div><dt>Envelope total</dt><dd>${tape(s.net)} m</dd></div><div><dt>With end trim</dt><dd>${tape(s.allowance)} m</dd></div><div><dt>Rolls by length</dt><dd>≥ ${s.rolls} × ${tape(s.rollLength)} m</dd></div></dl></article>`).join('') || '<p>No banded edges selected. Tape requirement is zero.</p>'}</div><p class="eb-note">Includes ${project.settings.endTrim} mm at each strip end, then ${project.settings.waste}% extra waste. Roll counts are length-based minimums: individual strips may require more rolls. Strip lengths use the larger of saw and finished envelopes; this estimate does not prescribe banding order.</p><div class="eb-actions"><button type="button" data-export="parts" ${result.valid ? '' : 'disabled'}>Download cut list CSV</button><button type="button" class="secondary" data-export="supplies" ${result.valid ? '' : 'disabled'}>Download edging CSV</button><button type="button" class="secondary" id="eb-layout" ${result.valid ? '' : 'disabled'}>Plan these blanks on sheets ↗</button></div><p>Sheet planning carries saw blanks, materials, thickness and grain locks. Keep the edge map CSV at the bench. Displayed dimensions are rounded; exports retain six decimal places.</p>`;
    result.parts.forEach((p, i) => {
      const el = form.querySelector(`[data-part-result="${i}"]`); if (el) el.textContent = `Saw ${pretty(p.sawLength)} × ${pretty(p.sawWidth)} ${u} → finished ${pretty(p.finishedLength)} × ${pretty(p.finishedWidth)} ${u}`;
      const row = form.querySelector(`[data-part="${i}"]`); row.querySelector('.eb-grain').textContent = p.grain ? '→ → →' : '↔ ↕';
      for (const e of EDGES) for (const profile of project.profiles) row.querySelector(`[name="${e}"] option[value="${profile.id}"]`).textContent = `${profile.id} · ${profile.label}`;
    });
  }
  function update() {
    try { project = validateProject(read()); result = calculateProject(project); $('#eb-error').textContent = result.valid ? '' : 'Resolve the dimension and tape errors shown in the shop list below.'; save(); }
    catch (e) { result = null; $('#eb-error').textContent = e.message; form.querySelectorAll('[data-part-result]').forEach(el => { el.textContent = 'Check this row before cutting.'; }); }
    renderResults();
  }
  function download(filename, value, type) {
    const url = URL.createObjectURL(new Blob([value], { type })), a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', event => {
    update();
    const part = event.target.closest('[data-part]');
    if (part && EDGES.includes(event.target.name)) { const e = event.target.name, v = event.target.value, button = part.querySelector(`[data-cycle="${e}"]`); button.className = `eb-map-${e} eb-${v || 'none'}`; button.setAttribute('aria-label', `${e} edge: ${v || 'none'}. Change edging profile.`); button.querySelector('span').textContent = v || '—'; }
  });
  form.addEventListener('submit', event => { event.preventDefault(); update(); if (!result || !result.valid) $('#eb-error').focus(); else $('#eb-results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  form.addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]'), cycle = event.target.closest('[data-cycle]');
    if (remove) { project = read(); project.parts.splice(Number(remove.dataset.remove), 1); renderForm(); update(); }
    if (cycle) { const select = cycle.closest('[data-part]').querySelector(`[name="${cycle.dataset.cycle}"]`); select.value = ['', 'A', 'B'][(['', 'A', 'B'].indexOf(select.value) + 1) % 3]; select.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  $('#eb-add').addEventListener('click', () => {
    try { project = validateProject(read()); project.parts.push({ label: 'New panel', material: project.parts[0].material, length: 600, width: 300, thickness: 18, qty: 1, grain: true, edges: { left: '', right: '', top: 'A', bottom: '' } }); renderForm(); update(); form.querySelector('[data-part]:last-child input').focus(); }
    catch (e) { $('#eb-error').textContent = e.message; $('#eb-error').focus(); }
  });
  $('#eb-unit').addEventListener('change', event => {
    try { project = validateProject(read()); project.unit = event.target.value; renderForm(); update(); }
    catch (e) { event.target.value = project.unit; $('#eb-error').textContent = e.message; }
  });
  $('#eb-mode').addEventListener('change', event => {
    try { const next = calculateProject(read()); if (!next.valid) throw Error('Resolve the project errors before switching the input basis.'); project = next.project; project.mode = event.target.value; project.parts = next.parts.map(p => ({ label: p.label, material: p.material, thickness: p.thickness, qty: p.qty, grain: p.grain, edges: p.edges, length: project.mode === 'finished' ? p.finishedLength : p.sawLength, width: project.mode === 'finished' ? p.finishedWidth : p.sawWidth })); renderForm(); update(); }
    catch (e) { event.target.value = project.mode; $('#eb-error').textContent = e.message; }
  });
  $('#eb-results').addEventListener('click', event => {
    try {
      if (event.target.dataset.export && result) download(`edge-banding-${event.target.dataset.export}.csv`, event.target.dataset.export === 'parts' ? partsCsv(result) : suppliesCsv(result), 'text/csv;charset=utf-8');
      if (event.target.id === 'eb-layout' && result) { sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(layoutProject(result))); location.assign('/plywood-cut-calculator/#import-cut-list'); }
    } catch (e) { status(`Could not complete the action: ${e.message} Use the CSV or visible table to enter blanks manually.`); }
  });
  $('#eb-backup').addEventListener('click', () => { try { project = validateProject(read()); download('edge-banding-project.json', JSON.stringify(project, null, 2), 'application/json'); } catch (e) { $('#eb-error').textContent = e.message; } });
  $('#eb-import').addEventListener('change', async event => {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    try { if (file.size > 1000000) throw Error('Choose a project backup smaller than 1 MB.'); pending = validateProject(JSON.parse(await file.text())); $('#eb-import-review').hidden = false; $('#eb-import-summary').textContent = `Incoming backup: ${pending.parts.length} rows, ${pending.parts.reduce((n, p) => n + p.qty, 0)} physical parts. Replace the current project? Export a backup first if you need to keep it.`; }
    catch (e) { pending = null; $('#eb-import-review').hidden = true; status(`Import was not applied: ${e.message}`); }
  });
  $('#eb-import-apply').addEventListener('click', () => { if (!pending) return; project = pending; pending = null; saveAllowed = true; $('#eb-import-review').hidden = true; renderForm(); update(); });
  $('#eb-import-cancel').addEventListener('click', () => { pending = null; $('#eb-import-review').hidden = true; status('Import canceled. Your current project is unchanged.'); });
  renderForm(); update();
}
