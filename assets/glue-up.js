import { SOURCES, sampleProject, validateProject, calculateProject, exportCSV } from './glue-up-core.js';
const $ = s => document.querySelector(s), KEY = 'woodcuttool.glue-up.v1';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Number(n.toFixed(2)).toLocaleString('en-US');
let project = sampleProject(), blocked = false, originalRaw = null, pending = null;
function status(message) { $('#gu-status').textContent = message; }
function download(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type })), link = document.createElement('a');
  link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
try { originalRaw = localStorage.getItem(KEY); if (originalRaw) project = validateProject(JSON.parse(originalRaw)); }
catch { blocked = true; $('#gu-recovery').hidden = false; status('Saved data could not be read. It is preserved; export the recovery file before replacing it. The example below remains editable.'); }
function fields() {
  for (const key of ['product', 'adhesive', 'open', 'total', 'reserve', 'notes']) $('#gu-form').elements[key].value = project[key];
  for (const key of ['conditions', 'rehearsal', 'resources']) $('#gu-form').elements[key].checked = project[key];
  source(); renderRows(); review(false);
}
function source() {
  const s = SOURCES[project.product];
  $('#gu-source').innerHTML = s ? `<a href="${s.url}">${esc(s.label)}</a> · ${esc(s.range)} Loaded limits use the lower endpoints. Verify the current label and actual conditions; edits become a custom reference.` : 'Custom limits: record your product source and shop evidence in the notes.';
}
function renderRows() {
  $('#gu-rows').innerHTML = project.rows.map((row, i) => `<fieldset class="gu-row" data-row="${i}"><legend>Batch ${String(i + 1).padStart(2, '0')}</legend><div class="gu-row-top"><label>Independent assembly<input data-key="label" value="${esc(row.label)}" maxlength="120" required></label><button type="button" data-remove="${i}" class="gu-text" aria-label="Remove batch ${i + 1}"${project.rows.length === 1 ? ' disabled' : ''}>Remove ×</button></div><div class="gu-row-fields">${[['setup','Setup before glue'],['spread','Spread adhesive'],['mate','Bring all joints together'],['clamp','Apply final pressure']].map(([key,label]) => `<label>${label}<span class="gu-unit">minutes</span><input data-key="${key}" type="number" min="${key === 'setup' ? '0' : '0.01'}" max="120" step="any" value="${row[key]}" required></label>`).join('')}</div></fieldset>`).join('');
  $('#gu-add').disabled = project.rows.length >= 20;
}
function collect() {
  const form = $('#gu-form');
  for (const key of ['product', 'adhesive', 'notes']) project[key] = form.elements[key].value;
  for (const key of ['open', 'total', 'reserve']) project[key] = form.elements[key].value === '' ? NaN : Number(form.elements[key].value);
  for (const key of ['conditions', 'rehearsal', 'resources']) project[key] = form.elements[key].checked;
  for (const el of document.querySelectorAll('[data-row]')) {
    const row = project.rows[Number(el.dataset.row)];
    for (const input of el.querySelectorAll('[data-key]')) row[input.dataset.key] = input.dataset.key === 'label' ? input.value : input.value === '' ? NaN : Number(input.value);
  }
  return validateProject(project);
}
function review(save = true) {
  try {
    const r = calculateProject(collect()); $('#gu-error').textContent = '';
    for (const id of ['gu-csv','gu-backup','gu-print']) $('#' + id).disabled = false;
    $('#gu-results').innerHTML = `<div class="gu-result-heading"><p class="gu-kicker">THE REHEARSAL / ${r.rows.length} BATCHES</p><h2>${fmt(r.duration)} <small>min to final pressure</small></h2><p>${r.fits ? 'Timing fits the entered limits and reserve.' : 'One or more batches need a shorter sequence or a revised, verified limit.'}</p><p class="gu-evidence">${r.checks ? 'Three preparation checks recorded. Confirm the physical assembly before gluing.' : 'Preparation evidence is incomplete. Rehearse and verify the checks below before applying glue.'}</p></div><div class="gu-legend"><span>● Spread</span><span>● Mate</span><span>● Pressure</span></div>${r.rows.map(row => `<article class="gu-result-row ${row.fits ? '' : 'gu-late'}"><div class="gu-result-top"><h3>${esc(row.label)}</h3><span>${row.status}</span></div><div class="gu-bar" aria-label="${fmt(row.spread)} minutes spreading, ${fmt(row.mate)} mating, ${fmt(row.clamp)} applying pressure">${['spread','mate','clamp'].map(key => `<span class="gu-${key}" style="flex:${row[key]}"></span>`).join('')}</div><dl><div><dt>First adhesive</dt><dd>+${fmt(row.start)} min</dd></div><div><dt>All joints mated</dt><dd>+${fmt(row.mateEnd)} min</dd></div><div><dt>Final pressure</dt><dd>+${fmt(row.pressureEnd)} min</dd></div><div><dt>Open margin</dt><dd>${fmt(row.openMargin)} min</dd></div><div><dt>Total margin</dt><dd>${fmt(row.totalMargin)} min</dd></div></dl><p class="gu-small">Mating deadline +${fmt(row.openDeadline)} min · pressure deadline +${fmt(row.totalDeadline)} min, including your ${fmt(project.reserve)} min reserve. Offsets start at the beginning of the plan.</p></article>`).join('')}<p class="gu-small">Each batch starts after the previous batch reaches final pressure. Clamps remain occupied afterward; their release and adhesive curing need a separate plan. The bars show task proportions, not real-time countdowns.</p>`;
    if (save && !blocked) {
      try { localStorage.setItem(KEY, JSON.stringify(r.project)); status('Draft saved in this browser. Export a backup to keep a separate copy.'); }
      catch { status('Browser saving is unavailable. Your current draft is usable; export a backup before leaving.'); }
    }
    return r.project;
  } catch (e) {
    $('#gu-error').textContent = e.message;
    $('#gu-results').innerHTML = '<p class="gu-invalid">Resolve the input error to see the current schedule. Previous results are no longer shown.</p>';
    for (const id of ['gu-csv','gu-backup','gu-print']) $('#' + id).disabled = true;
    return null;
  }
}
$('#gu-form').addEventListener('input', e => {
  if (['open','total','adhesive'].includes(e.target.name)) { project.product = 'custom'; $('#gu-form').elements.product.value = 'custom'; $('#gu-form').elements.conditions.checked = false; source(); }
  if (e.target.closest('[data-row]')) { $('#gu-form').elements.rehearsal.checked = false; $('#gu-form').elements.resources.checked = false; }
  review();
});
$('#gu-form').addEventListener('change', e => {
  if (e.target.name === 'product') {
    project.product = e.target.value;
    const s = SOURCES[project.product]; if (s) { project.adhesive = s.label; project.open = s.open; project.total = s.total; project.conditions = project.rehearsal = project.resources = false; }
    fields(); review();
  }
});
$('#gu-form').addEventListener('submit', e => { e.preventDefault(); review(); });
$('#gu-add').addEventListener('click', () => { if (!review(false) || project.rows.length >= 20) return; project.rows.push({ label: 'Separate assembly ' + (project.rows.length + 1), setup: 2, spread: 1, mate: 1, clamp: 2 }); $('#gu-form').elements.rehearsal.checked = false; $('#gu-form').elements.resources.checked = false; renderRows(); review(); $('#gu-rows').lastElementChild.querySelector('input').focus(); });
$('#gu-rows').addEventListener('click', e => { const button = e.target.closest('[data-remove]'); if (!button || project.rows.length === 1) return; collectDraft(); project.rows.splice(Number(button.dataset.remove), 1); $('#gu-form').elements.rehearsal.checked = false; $('#gu-form').elements.resources.checked = false; renderRows(); review(); });
function collectDraft() { try { collect(); } catch {} }
$('#gu-csv').addEventListener('click', () => { const p = review(false); if (p) download('glue-up-schedule.csv', exportCSV(p), 'text/csv;charset=utf-8'); });
$('#gu-backup').addEventListener('click', () => { const p = review(false); if (p) download('glue-up-project.json', JSON.stringify(p, null, 2) + '\n', 'application/json'); });
$('#gu-print').addEventListener('click', () => { if (review(false)) window.print(); });
$('#gu-import').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  pending = null; $('#gu-import-review').hidden = true;
  try {
    if (file.size > 100000) throw Error('Backup is too large (maximum 100 KB).');
    pending = validateProject(JSON.parse(await file.text()));
    $('#gu-import-summary').textContent = `${pending.rows.length} batches · ${pending.adhesive} · open ${pending.open} / total ${pending.total} min. Replaces this draft. Export it first if needed.`;
    $('#gu-import-review').hidden = false;
  } catch (err) { status('Import was not applied: ' + err.message); }
  e.target.value = '';
});
$('#gu-import-cancel').addEventListener('click', () => { pending = null; $('#gu-import-review').hidden = true; status('Import canceled. Current draft preserved.'); });
$('#gu-import-apply').addEventListener('click', () => { if (!pending) return; project = pending; pending = null; $('#gu-import-review').hidden = true; fields(); review(); });
$('#gu-raw').addEventListener('click', () => download('glue-up-storage-recovery.txt', originalRaw ?? 'Storage could not be accessed.', 'text/plain'));
$('#gu-replace').addEventListener('click', () => { if (!review(false)) return; blocked = false; $('#gu-recovery').hidden = true; review(); });
fields();
