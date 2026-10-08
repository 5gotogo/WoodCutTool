import { STORAGE_KEY, SURFACES, sampleProject, validateProject, calculate, displayFactors, exportCSV } from './finishing-core.js';

const $ = s => document.querySelector(s);
const esc = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fmt = (v, n = 4) => Number(v.toFixed(n)).toLocaleString('en-US', { maximumFractionDigits: n });
const inputValue = v => Number(v.toFixed(10));
let project = sampleProject(), pending = null, protectedDraft = false, valid = true;
let storageNote = '', restored = false;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { try { project = validateProject(JSON.parse(saved)); restored = true; } catch { protectedDraft = true; storageNote = 'The saved draft is unreadable and has been preserved. Export your current work; importing a valid backup and choosing Replace will replace the saved draft.'; } }
} catch { storageNote = 'Browser saving is unavailable. You can still edit and export your work.'; }
function notify(message) { $('#fp-status').textContent = message + (storageNote ? ' ' + storageNote : ''); }
function persist() {
  if (protectedDraft) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); }
  catch { storageNote = 'Browser saving is unavailable. Export a backup to keep your work.'; }
}
function numericInput(name, title, value, { integer = false, min = 0, max = null } = {}) {
  return `<label>${esc(title)}<input name="${name}" type="number" step="${integer ? '1' : 'any'}" min="${min}" ${max !== null ? `max="${max}"` : ''} required value="${inputValue(value)}"></label>`;
}
function render() {
  const f = displayFactors(project.unit);
  $('#fp-unit').value = project.unit;
  $('#fp-products').innerHTML = project.products.map((s, i) => `<fieldset data-product="${i}"><legend>PRODUCT ${i ? 'B' : 'A'}</legend><label>Product / colour / reference<input name="label" required maxlength="100" value="${esc(s.label)}"></label><div class="fp-fields">${numericInput('coverage', `Coverage per coat (${f.coverageLabel})`, s.coverage / f.coverage, { min: 0.0001 })}${numericInput('coats', 'Number of coats', s.coats, { integer: true, min: 1, max: 20 })}${numericInput('waste', 'Extra allowance (%)', s.waste, { max: 300 })}${numericInput('pack', `One package (${f.volumeLabel})`, s.pack / f.volume, { min: 0.0001 })}${numericInput('stock', `Usable stock on hand (${f.volumeLabel})`, s.stock / f.volume)}</div></fieldset>`).join('');
  $('#fp-parts').innerHTML = project.parts.map((r, i) => `<fieldset data-part="${i}"><legend>PART ${String(i + 1).padStart(2, '0')}</legend><div class="fp-part-header"><label>Part label<input name="label" required maxlength="100" value="${esc(r.label)}"></label><button type="button" class="fp-subtle" data-remove="${i}" ${project.parts.length === 1 ? 'disabled' : ''} aria-label="Remove part ${i + 1}">Remove</button></div><div class="fp-fields">${numericInput('length', `Length (${f.lengthLabel})`, r.length / f.length, { min: 0.0001 })}${numericInput('width', `Width (${f.lengthLabel})`, r.width / f.length, { min: 0.0001 })}${numericInput('thickness', `Thickness (${f.lengthLabel})`, r.thickness / f.length, { min: 0.0001 })}${numericInput('qty', 'Quantity', r.qty, { integer: true, min: 1, max: 10000 })}</div><div class="fp-part-bottom"><div><p class="fp-small-title">Coated surfaces</p><div class="fp-surface-options">${SURFACES.map(s => `<label class="fp-check"><input type="checkbox" name="${s}" ${r.surfaces.includes(s) ? 'checked' : ''}>${s === 'top' || s === 'bottom' ? s + ' (length edge)' : s === 'left' || s === 'right' ? s + ' (width edge)' : s + ' face'}</label>`).join('')}</div><p class="fp-small-title">Apply these products to the selected surfaces</p><div class="fp-stage-options">${r.products.map((v, n) => `<label class="fp-check"><input type="checkbox" name="stage${n}" ${v ? 'checked' : ''}>Product ${n ? 'B' : 'A'}</label>`).join('')}</div></div><div class="fp-part-map" data-map="${i}"></div></div><p class="fp-part-area" data-area="${i}"></p></fieldset>`).join('');
  updateResults();
}
function read() {
  const f = displayFactors(project.unit), num = (e, name, factor = 1) => { const el = e.querySelector(`[name="${name}"]`); return el.value.trim() === '' ? NaN : el.valueAsNumber * factor; };
  return validateProject({ version: 1, unit: project.unit, products: [...document.querySelectorAll('[data-product]')].map(e => ({ label: e.querySelector('[name=label]').value, coverage: num(e, 'coverage', f.coverage), coats: num(e, 'coats'), waste: num(e, 'waste'), pack: num(e, 'pack', f.volume), stock: num(e, 'stock', f.volume) })), parts: [...document.querySelectorAll('[data-part]')].map(e => ({ label: e.querySelector('[name=label]').value, length: num(e, 'length', f.length), width: num(e, 'width', f.length), thickness: num(e, 'thickness', f.length), qty: num(e, 'qty'), surfaces: SURFACES.filter(s => e.querySelector(`[name="${s}"]`).checked), products: [0, 1].map(n => e.querySelector(`[name="stage${n}"]`).checked) })) });
}
function sync() {
  try { project = read(); valid = true; $('#fp-error').textContent = ''; updateResults(); persist(); notify(storageNote ? 'Estimate updated.' : 'Updated. Valid changes are saved in this browser.'); }
  catch (error) { valid = false; $('#fp-error').textContent = error.message; $('#fp-results').innerHTML = '<p>Complete the inputs before using or exporting a purchase estimate.</p>'; document.querySelectorAll('[data-map], [data-area]').forEach(e => e.replaceChildren()); }
  $('#fp-backup').disabled = !valid; $('#fp-csv').disabled = !valid;
  return valid;
}
function updateResults() {
  const r = calculate(project), f = displayFactors(project.unit);
  const area = v => `${fmt(v / f.area)} ${f.areaLabel}`, vol = v => `${fmt(v / f.volume)} ${f.volumeLabel}`;
  r.rows.forEach((row, i) => {
    const colour = s => row.surfaces.includes(s) ? '#387465' : '#d9d9cb';
    $(`[data-map="${i}"]`).innerHTML = `<svg viewBox="0 0 240 170" role="img" aria-label="Selected surfaces for part ${i + 1}. Green means coated."><rect x="30" y="25" width="180" height="115" rx="5" fill="${row.surfaces.includes('front') ? '#cadfd4' : '#f5f2e8'}"/><path d="M30 25H210" stroke="${colour('top')}" stroke-width="7"/><path d="M30 140H210" stroke="${colour('bottom')}" stroke-width="7"/><path d="M30 25V140" stroke="${colour('left')}" stroke-width="7"/><path d="M210 25V140" stroke="${colour('right')}" stroke-width="7"/><text x="120" y="75" text-anchor="middle">Front: ${row.surfaces.includes('front') ? 'coated' : 'bare'}</text><text x="120" y="98" text-anchor="middle">Back: ${row.surfaces.includes('back') ? 'coated' : 'bare'}</text><text x="120" y="164" text-anchor="middle" font-size="10">${fmt(row.length / f.length, 2)} × ${fmt(row.width / f.length, 2)} ${f.lengthLabel}</text></svg>`;
    $(`[data-area="${i}"]`).textContent = `${area(row.faces)} faces + ${area(row.edges)} edges = ${area(row.area)} for ${row.qty} part${row.qty === 1 ? '' : 's'} (one coat).`;
  });
  $('#fp-results').innerHTML = `<div class="fp-result-heading"><div><p class="fp-overline">03 / PURCHASE WITH THE ASSUMPTIONS VISIBLE</p><h2>Your finish list</h2></div><p>${area(r.area)} selected surface area</p></div><div class="fp-product-grid">${r.products.map((s, i) => `<article class="fp-result-card"><p class="fp-overline">PRODUCT ${i ? 'B' : 'A'}</p><h3>${esc(s.label)}</h3><div class="fp-total"><strong>${s.packs}</strong><span>package${s.packs === 1 ? '' : 's'} to buy</span></div><dl><div><dt>Selected area / one coat</dt><dd>${area(s.area)}</dd></div><div><dt>Area × ${s.coats} coat${s.coats === 1 ? '' : 's'}</dt><dd>${area(s.coatArea)}</dd></div><div><dt>Base volume</dt><dd>${vol(s.base)}</dd></div><div><dt>With ${fmt(s.waste)}% extra</dt><dd>${vol(s.demand)}</dd></div><div><dt>Stock deducted</dt><dd>${vol(s.stock)}</dd></div><div><dt>Shortfall to purchase</dt><dd>${vol(s.shortage)}</dd></div><div><dt>Buy ${s.packs} × ${vol(s.pack)}</dt><dd>${vol(s.purchase)}</dd></div><div><dt>Estimated surplus</dt><dd>${vol(Math.max(0, s.surplus))}</dd></div></dl>${s.area === 0 ? '<p>No parts use this product. Select its stage on a part to include it.</p>' : ''}</article>`).join('')}</div><p class="fp-note">Package counts round up for each product independently. Surplus includes usable stock. Products are separate coating stages; their volumes are never pooled.</p>`;
}
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type })), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('#fp-form').addEventListener('input', sync);
$('#fp-form').addEventListener('change', sync);
$('#fp-form').addEventListener('submit', e => { e.preventDefault(); if (sync()) $('#fp-results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
$('#fp-unit').addEventListener('change', () => {
  const unit = $('#fp-unit').value;
  if (!sync()) { $('#fp-unit').value = project.unit; notify('Complete the invalid inputs before changing units.'); return; }
  project.unit = unit; render(); persist(); notify('Units converted; the physical project stays the same.');
});
$('#fp-add').addEventListener('click', () => {
  if (!sync()) return;
  if (project.parts.length >= 100) { notify('The planner supports up to 100 part rows.'); return; }
  project.parts.push({ label: `Part ${project.parts.length + 1}`, length: 600, width: 300, thickness: 18, qty: 1, surfaces: ['front', 'back'], products: [true, false] }); render(); persist(); $('#fp-parts fieldset:last-child input').focus();
});
$('#fp-parts').addEventListener('click', e => {
  const button = e.target.closest('[data-remove]');
  if (!button || project.parts.length === 1) return;
  // Removal may resolve an invalid row; validate the remaining DOM before saving.
  button.closest('fieldset').remove();
  document.querySelectorAll('[data-part]').forEach((row, i) => { row.dataset.part = i; row.querySelector('[data-remove]').dataset.remove = i; row.querySelector('[data-map]').dataset.map = i; row.querySelector('[data-area]').dataset.area = i; });
  if (sync()) render();
});
$('#fp-backup').addEventListener('click', () => { if (sync()) download('finishing-project.json', JSON.stringify(project, null, 2), 'application/json'); });
$('#fp-csv').addEventListener('click', () => { if (sync()) download('finishing-purchase-list.csv', exportCSV(project), 'text/csv;charset=utf-8'); });
$('#fp-import').addEventListener('change', async e => {
  pending = null; $('#fp-import-review').hidden = true;
  const file = e.target.files[0]; e.target.value = ''; if (!file) return;
  try {
    if (file.size > 1e6) throw new Error('Backup exceeds the 1 MB limit.');
    pending = validateProject(JSON.parse(await file.text()));
    $('#fp-import-summary').textContent = `${pending.parts.length} part rows; product A: ${pending.products[0].label}; product B: ${pending.products[1].label}. Replace the current draft with this backup?`;
    $('#fp-import-review').hidden = false; $('#fp-import-apply').focus();
  } catch (error) { notify(`Import was not applied. ${error.message}`); }
});
$('#fp-import-cancel').addEventListener('click', () => { pending = null; $('#fp-import-review').hidden = true; notify('Import canceled. Current work kept.'); });
$('#fp-import-apply').addEventListener('click', () => {
  if (!pending) return; project = pending; pending = null; protectedDraft = false; storageNote = ''; valid = true; $('#fp-error').textContent = ''; $('#fp-import-review').hidden = true; $('#fp-backup').disabled = false; $('#fp-csv').disabled = false; render(); persist(); notify('Backup applied. Current draft replaced.');
});
render(); notify(restored ? 'Saved project restored. Review the finished sizes and product label data.' : 'Example loaded. Enter your finished part sizes and product label data.');
