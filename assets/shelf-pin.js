import { FIELDS, CHECKS, STORAGE_KEY, sampleProject, parseProject, calculate, renderSVG, exportCSV, esc, fmt } from './shelf-pin-core.js';
const $ = selector => document.querySelector(selector);
const form = $('#sp-form');
let project = sampleProject(), selected = null, pending = null, mapView = 'pair';
const announce = message => { $('#sp-announce').textContent = message; };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { project = parseProject(JSON.parse(saved)); $('#sp-storage').textContent = 'Restored this browser’s project. Keep a JSON backup for a separate copy.'; }
} catch { $('#sp-storage').textContent = 'A saved draft could not be read. The example is open; your original stored value has not been replaced. You can still edit and export.'; }
function drawZones() {
  $('#sp-zones').innerHTML = project.zones.map((z,i)=>`<div class="sp-zone" data-zone="${i}"><label>Band ${i+1} label<input name="zone-label" maxlength="120" value="${esc(z.label)}"></label><div class="sp-fields"><label>Bottom from datum (mm)<input name="zone-from" type="number" min="0" max="3000" step="any" required value="${z.from}"></label><label>Top from datum (mm)<input name="zone-to" type="number" min="0" max="3000" step="any" required value="${z.to}"></label></div><button type="button" data-remove="${i}" aria-label="Remove keep-out band ${i+1}">Remove band</button></div>`).join('');
  $('#sp-add-zone').disabled = project.zones.length >= 12;
}
function fillForm() {
  for (const [key] of FIELDS) form.elements.namedItem(key).value = project[key];
  for (const key of ['name','revision','notes']) form.elements.namedItem(key).value = project[key];
  for (const [key] of CHECKS) form.elements.namedItem('check-'+key).checked = project.checks[key];
  drawZones();
}
function number(input) { return input.value.trim() === '' ? NaN : Number(input.value); }
function readForm() {
  for (const [key] of FIELDS) project[key] = number(form.elements.namedItem(key));
  for (const key of ['name','revision','notes']) project[key] = form.elements.namedItem(key).value;
  project.zones = [...document.querySelectorAll('[data-zone]')].map(row=>({label:row.querySelector('[name=zone-label]').value,from:number(row.querySelector('[name=zone-from]')),to:number(row.querySelector('[name=zone-to]'))}));
  for (const [key] of CHECKS) project.checks[key] = form.elements.namedItem('check-'+key).checked;
}
function clearEvidence() {
  const hadEvidence = CHECKS.some(([key])=>project.checks[key]);
  for (const [key] of CHECKS) {project.checks[key]=false;form.elements.namedItem('check-'+key).checked=false;}
  if(hadEvidence) announce('Geometry changed. The four physical observations were cleared; recheck this revision.');
}
function save() {
  try { parseProject(project); } catch { $('#sp-storage').textContent = 'This incomplete edit is in memory only. Correct the inputs to update the browser draft.';return; }
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(project)); $('#sp-storage').textContent='Draft saved in this browser. Export a JSON backup before clearing site data.'; }
  catch { $('#sp-storage').textContent='Browser storage is unavailable. Your current session still calculates and exports; download a JSON backup to retain this work.'; }
}
function render() {
  const r=calculate(project);
  for(const id of ['#sp-csv','#sp-svg','#sp-print','#sp-backup']) $(id).disabled=!r.ok;
  if(!r.ok) {
    $('#sp-results').innerHTML=`<div class="sp-errors" role="alert"><h3>Review these inputs</h3><ul>${r.errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul><p>The current map and coordinate exports are paused.</p></div>`;
    $('#sp-map').innerHTML='<p class="sp-empty">Complete the dimensions above to rebuild the pair.</p>';$('#sp-levels').innerHTML='';return;
  }
  if(!r.levels.some(l=>l.usable && l.y===selected)) selected=null;
  $('#sp-results').innerHTML=`<div class="sp-stats"><div><strong>${r.usable}</strong><span>available levels</span></div><div><strong>${r.holes.length}</strong><span>holes / both sides</span></div><div><strong>${fmt(r.remainingSkin)}<small> mm</small></strong><span>remaining outer skin</span></div></div><p class="sp-result-note">${r.skipped} levels skipped · ${r.evidence}/4 physical observations recorded · ${r.evidence===4?'Recorded checks still require your project review.':'Physical test pair still needs review.'}</p>`;
  drawMap();
  $('#sp-levels').innerHTML=`<div class="sp-level-grid">${r.levels.map(l=>l.usable?`<button type="button" data-level="${l.y}" aria-pressed="${selected===l.y}"><span>INDEX ${l.index}</span><strong>${fmt(l.y)} mm</strong><span>4 holes</span></button>`:`<div class="sp-blocked"><span>INDEX ${l.index}</span><strong>${fmt(l.y)} mm</strong><span>SKIP · ${esc(l.blockedBy.join('; '))}</span></div>`).join('')}</div><p class="sp-hint">Heights are pin-hole centers above the panel bottom, not shelf-top heights. Available levels are alternative locations, not a shelf quantity or capacity.</p>`;
}
function drawMap() {
  const r=calculate(project);if(!r.ok)return;
  $('#sp-map').innerHTML=renderSVG(project,selected);
  if(mapView!=='pair') {
    const svg=$('#sp-map svg'),x=mapView==='Left'?20:20+project.depth+50;
    svg.setAttribute('viewBox',`${x} 0 ${project.depth+24} ${project.height+55}`);
    svg.setAttribute('width',String(project.depth+24));svg.setAttribute('height',String(project.height+55));
  }
  for(const button of document.querySelectorAll('[data-map-view]'))button.setAttribute('aria-pressed',String(button.dataset.mapView===mapView));
  $('#sp-map-caption').textContent=`${mapView==='pair'?'Both inside faces · finished fronts outward':mapView+' inside face · finished front on the '+(mapView==='Left'?'left':'right')} · top ↑ · ${fmt(project.height)} × ${fmt(project.depth)} mm${selected===null?'':' · selected center '+fmt(selected)+' mm above bottom'}`;
}
$('.sp-map-controls').addEventListener('click',e=>{const button=e.target.closest('[data-map-view]');if(!button)return;mapView=button.dataset.mapView;drawMap();});
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{
  const geometry=FIELDS.some(([key])=>key===e.target.name)||['zone-from','zone-to'].includes(e.target.name);
  if(geometry) clearEvidence();
  readForm();render();save();
});
$('#sp-add-zone').addEventListener('click',()=>{
  readForm();if(project.zones.length>=12)return;clearEvidence();
  const h=Number.isFinite(project.height)?project.height:720;
  project.zones.push({label:'Measured hardware envelope',from:Math.min(100,h-20),to:Math.min(150,h)});drawZones();render();save();
  $('#sp-zones .sp-zone:last-child input').focus();
});
$('#sp-zones').addEventListener('click',e=>{
  const button=e.target.closest('[data-remove]');if(!button)return;readForm();clearEvidence();project.zones.splice(Number(button.dataset.remove),1);drawZones();render();save();$('#sp-add-zone').focus();
});
$('#sp-levels').addEventListener('click',e=>{const button=e.target.closest('[data-level]');if(!button)return;selected=Number(button.dataset.level);render();$(`[data-level="${selected}"]`).focus();});
function download(name,type,content) {
  const url=URL.createObjectURL(new Blob([content],{type})), a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);announce('Downloaded '+name+'.');
}
$('#sp-csv').addEventListener('click',()=>{if(calculate(project).ok)download('shelf-pin-holes.csv','text/csv;charset=utf-8',exportCSV(project));});
$('#sp-svg').addEventListener('click',()=>{if(calculate(project).ok)download('shelf-pin-panels.svg','image/svg+xml',renderSVG(project));});
$('#sp-backup').addEventListener('click',()=>{if(calculate(project).ok)download('shelf-pin-project.json','application/json',JSON.stringify(parseProject(project),null,2)+'\n');});
$('#sp-print').addEventListener('click',()=>{if(calculate(project).ok)window.print();});
function review(incoming,origin) {
  pending=incoming;const r=calculate(incoming);
  $('#sp-review-copy').textContent=`${origin}: “${incoming.name || 'Untitled'}”, revision ${incoming.revision || '—'}. ${incoming.height} × ${incoming.depth} × ${incoming.thickness} mm, ${incoming.pitch} mm pitch, ${incoming.zones.length} keep-out bands, ${r.usable} available levels and ${r.evidence}/4 recorded observations.`;
  $('#sp-review').showModal();
}
$('#sp-import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try {if(file.size>1000000)throw Error('The backup is larger than 1 MB.');const incoming=parseProject(JSON.parse(await file.text()));const r=calculate(incoming);if(!r.ok)throw Error(r.errors.join(' '));review(incoming,'Imported backup');}
  catch(error){announce('Import was not applied. '+error.message);}
  finally {e.target.value='';}
});
$('#sp-reset').addEventListener('click',()=>review(sampleProject(),'Published example'));
$('#sp-cancel').addEventListener('click',()=>{pending=null;$('#sp-review').close();announce('Replacement canceled. Your project is unchanged.');});
$('#sp-review').addEventListener('cancel',()=>{pending=null;announce('Replacement canceled. Your project is unchanged.');});
$('#sp-apply').addEventListener('click',()=>{if(!pending)return;project=pending;pending=null;selected=null;fillForm();render();save();$('#sp-review').close();announce('Replacement applied. Review imported dimensions and recorded observations before using the map.');});
fillForm();render();
