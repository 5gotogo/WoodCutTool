import { STORAGE_KEY, fields, gates, sampleProject, validateReading, validateProject, assessReading, recordsCSV } from './assembly-check-core.js';
const $ = s => document.querySelector(s);
const esc = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const labels = { within: 'Readings within your tolerance', outside: 'Readings outside your tolerance', borderline: 'Borderline · repeat the measurement' };
let project = sampleProject(), pending = null, preserveStored = false;
const status = message => { $('#ac-status').textContent = message; };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { try { project = validateProject(JSON.parse(saved)); status('Restored your draft and saved records from this browser.'); } catch { preserveStored = true; status('The saved data could not be read. It is preserved; this tab uses a sample. Export your current work before leaving. A reviewed import can replace saved data.'); } }
} catch { status('Browser storage is unavailable. Keep this tab open and export a JSON backup.'); }
function save() {
  if (preserveStored) { status('Unreadable saved data is preserved. Export your work from this tab; a reviewed import can replace saved data.'); return false; }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); return true; }
  catch { status('Changes work in this tab, but could not be saved. Export a JSON backup before leaving.'); return false; }
}
const factor = () => project.unit === 'in' ? 25.4 : 1;
const number = n => Number((n / factor()).toFixed(6)).toString();
const measure = n => `${Number((n / factor()).toFixed(project.unit === 'in' ? 4 : 3))} ${project.unit}`;
function read() {
  const value = { name: $('#ac-name').value.trim(), checks: {} };
  for (const key of fields) {
    const text = $(`#ac-${key}`).value.trim();
    if (!text) throw Error('Complete every numeric field before saving or switching units.');
    value[key] = text === number(project.draft[key]) ? project.draft[key] : Number(text) * factor();
  }
  for (const gate of gates) value.checks[gate] = $(`#ac-${gate}`).checked;
  return validateReading(value);
}
function syncForm() {
  $('#ac-unit').value = project.unit;
  $('#ac-name').value = project.draft.name;
  for (const key of fields) $(`#ac-${key}`).value = number(project.draft[key]);
  for (const gate of gates) $(`#ac-${gate}`).checked = project.draft.checks[gate];
  document.querySelectorAll('[data-ac-unit]').forEach(e => { e.textContent = project.unit; });
}
function result(r) {
  const a = assessReading(r);
  $('#ac-result').className = `ac-result ${a.status}`;
  $('#ac-result').innerHTML = `<p class="ac-kicker">MEASUREMENT REVIEW</p><h3>${labels[a.status]}</h3><div class="ac-metrics"><div><span>Observed difference</span><strong>${measure(a.gap)}</strong></div><div><span>Possible difference range</span><strong>${measure(a.lower)} – ${measure(a.upper)}</strong></div><div><span>Reference diagonal</span><strong>${measure(a.ideal)}</strong></div></div><p>${a.status === 'within' ? 'Even the upper difference bound is within the limit you entered.' : a.status === 'outside' ? 'Even the lower difference bound exceeds your limit. Check references and dry-fit geometry, then take a new pair of readings.' : 'The difference range crosses your limit. Improve the measuring setup or repeat the reading; do not treat rounding as a pass.'}</p><p><strong>${a.ready ? 'Recorded checks complete for this reading.' : 'Physical review remains open.'}</strong> ${a.ready ? 'Recheck if the assembly, clamp pressure, or reference points change.' : 'Confirm all four checks and obtain readings within tolerance before marking this review complete.'}</p><p class="ac-small">Reference = √(width² + height²), using your intended rectangle. It is a comparison aid, not an acceptance test. Equal diagonals alone do not rule out taper, twist, or a wrong overall size.</p>`;
  $('#ac-diag-a').textContent = `A · ${measure(r.diagonalA)}`;
  $('#ac-diag-b').textContent = `B · ${measure(r.diagonalB)}`;
}
function records() {
  $('#ac-count').textContent = `${project.records.length} / 200 saved`;
  $('#ac-csv').disabled = !project.records.length;
  $('#ac-records').innerHTML = project.records.length ? project.records.map((r,i) => { const a = assessReading(r); return `<article class="ac-record"><div><h3>${esc(r.name || 'Untitled reading')}</h3><p>${esc(new Date(r.created).toLocaleString())} · ${measure(a.gap)} difference</p><p>${labels[a.status]} · ${a.ready ? 'checks complete' : 'review open'}</p></div><div class="ac-actions"><button type="button" class="secondary" data-load="${i}">Load reading</button><button type="button" class="secondary" data-delete="${i}">Delete record</button></div></article>`; }).join('') : '<p class="ac-empty">No saved checks yet. Adjust the example, then save a snapshot of your actual reading.</p>';
}
function update() {
  try { const r = read(); project.draft = r; $('#ac-error').textContent = ''; $('#ac-save').disabled = project.records.length >= 200; $('#ac-backup').disabled = false; result(r); save(); return true; }
  catch (e) { $('#ac-error').textContent = e.message; $('#ac-save').disabled = true; $('#ac-backup').disabled = true; $('#ac-result').className = 'ac-result'; $('#ac-result').innerHTML = '<h3>Complete the inputs to review this reading.</h3>'; return false; }
}
function download(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('#ac-form').addEventListener('input', e => {
  if (['width', 'height', 'diagonalA', 'diagonalB'].includes(e.target.name)) {
    for (const gate of gates) $(`#ac-${gate}`).checked = false;
  }
  update();
});
$('#ac-form').addEventListener('submit', e => {
  e.preventDefault(); if (!update()) return;
  if (project.records.length >= 200) { status('The 200-record limit is reached. Export your records and remove older snapshots.'); return; }
  project.records.unshift({ ...structuredClone(project.draft), created: new Date().toISOString() }); const persisted = save(); records(); $('#ac-save').disabled = project.records.length >= 200; if (persisted) status('Snapshot added and saved in this browser. Each new reading creates a separate record.');
});
$('#ac-unit').addEventListener('change', () => {
  const requested = $('#ac-unit').value;
  if (!update()) { $('#ac-unit').value = project.unit; return; }
  project.unit = requested; syncForm(); result(project.draft); records(); save();
});
$('#ac-records').addEventListener('click', e => {
  const load = e.target.closest('[data-load]'), remove = e.target.closest('[data-delete]');
  if (load) { project.draft = validateReading(project.records[Number(load.dataset.load)]); syncForm(); update(); status('Saved reading loaded into the editable draft. The snapshot is unchanged.'); }
  if (remove) { const i = Number(remove.dataset.delete); if (!confirm(`Delete saved reading “${project.records[i].name || 'Untitled reading'}”?`)) return; project.records.splice(i,1); records(); save(); update(); }
});
$('#ac-csv').addEventListener('click', () => download('assembly-check-records.csv', recordsCSV(project.records), 'text/csv;charset=utf-8'));
$('#ac-backup').addEventListener('click', () => { if (update()) download('assembly-check-backup.json', JSON.stringify(project,null,2), 'application/json'); });
$('#ac-print').addEventListener('click', () => window.print());
$('#ac-import').addEventListener('change', async e => {
  const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
  pending = null; $('#ac-import-review').hidden = true;
  try { if (file.size > 1000000) throw Error('Backup must be smaller than 1 MB.'); pending = validateProject(JSON.parse(await file.text())); $('#ac-import-summary').textContent = `This backup contains an editable draft and ${pending.records.length} saved records. Replacing will discard the current draft and records. Export your current backup first if needed.`; $('#ac-import-review').hidden = false; }
  catch(e) { status(`Import was not applied. ${e.message}`); }
});
$('#ac-import-cancel').addEventListener('click', () => { pending = null; $('#ac-import-review').hidden = true; status('Import canceled. Current draft and records were kept.'); });
$('#ac-import-apply').addEventListener('click', () => { if (!pending) return; project = pending; pending = null; preserveStored = false; $('#ac-import-review').hidden = true; syncForm(); records(); update(); status('Backup applied to this tab.'); save(); });
syncForm(); records(); result(project.draft);
