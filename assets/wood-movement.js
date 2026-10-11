import { STORAGE_KEY, sampleProject, validateProject, calculate, unitFactor, exportCSV } from './wood-movement-core.js';

const $ = s => document.querySelector(s);
const form = $('#wm-form');
if (form) {
  let project = sampleProject(), valid = true, storage = 'ready', pending = null;
  const esc = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const number = n => Number(n.toFixed(3)).toLocaleString('en-US', { maximumFractionDigits: 3 });
  const status = message => { $('#wm-status').textContent = message; };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { project = validateProject(JSON.parse(raw)); status('Your saved draft is restored.'); } catch { storage = 'corrupt'; status('The saved draft could not be read and is preserved. Export your working draft; a reviewed import can replace the unreadable data.'); } }
  } catch { storage = 'unavailable'; status('Browser storage is unavailable. You can still calculate and export this session.'); }
  const measure = n => `${number(n / unitFactor(project.unit))} ${project.unit}`;
  function save() {
    if (storage === 'corrupt') return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); storage = 'ready'; status('Draft saved in this browser. Export a backup to move devices.'); }
    catch { storage = 'unavailable'; status('Browser storage is unavailable. Changes are in this session; export a backup to keep them.'); }
  }
  function fill() {
    $('#wm-unit').value = project.unit;
    for (const key of ['label', 'species', 'direction', 'current', 'low', 'high', 'anchor', 'notes']) form.elements[key].value = project[key];
    for (const key of ['width', 'opening', 'reserve']) form.elements[key].value = Number((project[key] / unitFactor(project.unit)).toPrecision(14));
    document.querySelectorAll('[data-unit]').forEach(e => { e.textContent = project.unit; });
  }
  function read() {
    const next = { ...project };
    for (const key of ['label', 'species', 'direction', 'anchor', 'notes']) next[key] = form.elements[key].value;
    for (const key of ['width', 'opening', 'reserve', 'current', 'low', 'high']) {
      const raw = form.elements[key].value.trim();
      const dimensional = ['width', 'opening', 'reserve'].includes(key), factor = dimensional ? unitFactor(project.unit) : 1;
      const value = raw === '' ? NaN : Number(raw);
      // An untouched displayed conversion must not change the canonical mm value.
      next[key] = dimensional && value === Number((project[key] / factor).toPrecision(14)) ? project[key] : value * factor;
    }
    return validateProject(next);
  }
  function chart(rows) {
    const min = Math.min(...rows.map(r => r.dryWidth)), max = Math.max(...rows.map(r => r.wetWidth)), spread = max - min || project.width * 0.005;
    const bottom = min - spread * 0.2, top = max + spread * 0.2;
    const x = mc => 65 + (project.high === project.low ? 0.5 : (mc - project.low) / (project.high - project.low)) * 405;
    const y = width => 215 - (width - bottom) / (top - bottom) * 170;
    return `<svg viewBox="0 0 530 285" role="img" aria-labelledby="wm-chart-title"><title id="wm-chart-title">Estimated width versus wood moisture content. ${esc(rows.map(r => `${r.direction}: ${measure(r.dryWidth)} at ${project.low}% to ${measure(r.wetWidth)} at ${project.high}%`).join('. '))}</title><path d="M65 35V215H470" fill="none" stroke="#a5afa6"/>${[...new Set([project.low, project.high])].map(mc => `<text x="${x(mc)}" y="239" text-anchor="middle">${number(mc)}%</text>`).join('')}<text x="267" y="270" text-anchor="middle">WOOD MOISTURE CONTENT · %</text><text x="65" y="20">ESTIMATED WIDTH · ${project.unit}</text>${[...new Set([min, max])].map(w => `<path d="M65 ${y(w)}H470" stroke="#dce1d5" stroke-dasharray="3 5"/><text x="54" y="${y(w) + 4}" text-anchor="end">${number(w / unitFactor(project.unit))}</text>`).join('')}${rows.map(r => { const color = r.direction === 'radial' ? '#386756' : '#b26537'; return `<path d="M${x(project.low)} ${y(r.dryWidth)}L${x(project.high)} ${y(r.wetWidth)}" fill="none" stroke="${color}" stroke-width="3"/><circle cx="${x(project.current)}" cy="${y(project.width)}" r="5" fill="${color}"/>`; }).join('')}</svg><p class="wm-chart-key">${rows.map(r => `<span style="color:${r.direction === 'radial' ? '#386756' : '#b26537'}">● ${r.direction === 'radial' ? 'Radial' : 'Tangential'}</span>`).join('')}<span>Dot = current reading · schematic scale</span></p>`;
  }
  function render() {
    const { species, rows } = calculate(project);
    $('#wm-error').textContent = '';
    $('#wm-result').innerHTML = `<p class="wm-kicker">THE SEASONAL ENVELOPE</p><h2>${esc(project.label || 'Your solid-wood part')}</h2><p>${esc(species.name)} · ${number(project.low)}–${number(project.high)}% MC · approximate free movement</p><div class="wm-scenarios">${rows.map(r => `<article class="wm-scenario"><p class="wm-kicker">${r.direction === 'radial' ? 'RADIAL / QUARTERSAWN WIDTH MODEL' : 'TANGENTIAL / FLATSAWN WIDTH MODEL'}</p><h3>${measure(r.swing)}<small>dry-to-wet width change</small></h3><dl>${[['Dry-season width', measure(r.dryWidth)], ['Measured width now', measure(project.width)], ['Wet-season width', measure(r.wetWidth)], ['Expansion from now', measure(r.wetChange)], ['Wet total clearance', measure(r.wetGap)], ['Balance after your reserve', measure(r.reserveBalance)]].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="wm-verdict ${r.reserveBalance < 0 ? 'wm-review' : ''}">${r.reserveBalance < 0 ? 'Your entered reserve is not available at the wet endpoint.' : 'The fixed-opening arithmetic leaves your entered reserve.'}</p><p class="wm-small">C = ${r.coefficient.toFixed(5)} per MC point. ${project.anchor === 'center' ? 'With a centered locating reference, each edge' : 'With one edge located, the opposite edge'} moves ${measure(r.dryTravel)} toward dry and ${measure(r.wetTravel)} toward wet from today’s position. These are displacement estimates, not slot lengths.</p></article>`).join('')}</div><figure class="wm-chart">${chart(rows)}</figure><p class="wm-small">Clearance is the total across the width in a fixed opening. Both scenarios are comparisons, not statistical limits or an estimate of your board’s ring angle. Check the actual part, opening and attachment before machining.</p>`;
    valid = true; $('#wm-csv').disabled = false; $('#wm-backup').disabled = false;
    $('#wm-print').disabled = false;
  }
  function update(persist = true) {
    try { project = read(); render(); if (persist) save(); return true; }
    catch (e) {
      valid = false; $('#wm-error').textContent = e.message;
      $('#wm-result').innerHTML = '<h2>Review the inputs</h2><p>Resolve the message above to calculate the seasonal envelope. The last valid saved draft is preserved.</p>';
      $('#wm-csv').disabled = true; $('#wm-backup').disabled = true; $('#wm-print').disabled = true;
      return false;
    }
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type })), link = document.createElement('a');
    link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  fill(); render();
  form.addEventListener('input', () => update());
  form.addEventListener('change', () => update());
  form.addEventListener('submit', e => { e.preventDefault(); if (update()) $('#wm-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); });
  $('#wm-unit').addEventListener('change', e => { const unit = e.target.value; if (!update(false)) { e.target.value = project.unit; return; } project.unit = unit; fill(); render(); save(); });
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => { project = { ...sampleProject(Number(button.dataset.example)), unit: project.unit }; fill(); render(); save(); }));
  $('#wm-csv').addEventListener('click', () => { if (valid && update(false)) download(exportCSV(project), 'wood-movement-review.csv', 'text/csv;charset=utf-8'); });
  $('#wm-backup').addEventListener('click', () => { if (valid && update(false)) download(JSON.stringify(project, null, 2), 'wood-movement-project.json', 'application/json'); });
  $('#wm-print').addEventListener('click', () => { if (valid && update(false)) window.print(); });
  $('#wm-import').addEventListener('change', async e => {
    pending = null; $('#wm-import-review').hidden = true;
    try {
      const file = e.target.files[0]; if (!file) return;
      if (file.size > 30000) throw Error('Backup is too large. Choose a Wood Movement project JSON under 30 KB.');
      pending = validateProject(JSON.parse(await file.text()));
      $('#wm-import-summary').textContent = `Replace this draft with “${pending.label || 'Untitled part'}”? Export the current draft first if you need to keep it.`;
      $('#wm-import-review').hidden = false;
    } catch (error) { status('Import was not applied. ' + error.message); }
    finally { e.target.value = ''; }
  });
  $('#wm-import-cancel').addEventListener('click', () => { pending = null; $('#wm-import-review').hidden = true; status(storage === 'corrupt' ? 'Import canceled. The unreadable saved data is still preserved.' : storage === 'unavailable' ? 'Import canceled. Your in-session draft is unchanged; browser storage is unavailable.' : 'Import canceled. Your current draft is unchanged.'); });
  $('#wm-import-apply').addEventListener('click', () => { if (!pending) return; project = pending; pending = null; storage = 'ready'; fill(); render(); save(); $('#wm-import-review').hidden = true; });
}
