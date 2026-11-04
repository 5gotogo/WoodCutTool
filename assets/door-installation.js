import {STORAGE_KEY,CHECKS,sampleProject,blankDoor,validateProject,calculate,renderSVG,exportCSV,clearEvidence,importProject,esc} from './door-installation-core.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let project=sampleProject(),active=0,pending=null,tab='survey',storageAvailable=true;
const message=t=>{$('#di-message').textContent=t;};
try {const saved=localStorage.getItem(STORAGE_KEY);if(saved)project=validateProject(JSON.parse(saved));}
catch(e){storageAvailable=false;message('Saved record could not be opened. The example is shown; your existing stored copy has not been replaced.');}
const factor=()=>project.unit==='in'?25.4:1;
const display=n=>Number.isFinite(n)?String(Number((n/factor()).toFixed(6))):'';
const mm=n=>Number.isFinite(n)?String(Number(n.toFixed(3))):'—';
function storageStatus(text){$('#di-storage').textContent=text;}
function persist(){
  try{validateProject(project);}catch(e){storageStatus('Current input is incomplete or invalid. The last valid browser draft is retained.');return;}
  if(!storageAvailable){storageStatus('Browser storage is unavailable or could not be read. Work in this session and save a JSON backup.');return;}
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(project));storageStatus('Saved in this browser. Download a JSON backup for a separate copy.');}
  catch(e){storageAvailable=false;storageStatus('Browser storage is unavailable. Work in this session and save a JSON backup.');}
}
function list(){
  $('#di-doors').innerHTML=project.doors.map((d,i)=>`<button type="button" data-door="${i}" aria-pressed="${active===i}"><strong>${esc(d.id||'Unnamed door')}</strong><span>${mm(d.width)} × ${mm(d.height)} mm</span><small>${d.hand==='left'?'← Left':'Right →'} / back view</small></button>`).join('');
  $('#di-add').disabled=project.doors.length>=30;$('#di-remove').disabled=project.doors.length<=1;
}
function fields(){
  const d=project.doors[active];
  $('#di-unit').value=project.unit;
  $$('.di-unit').forEach(e=>e.textContent=project.unit);
  $$('[data-scope]').forEach(e=>{
    const scope=e.dataset.scope,key=e.name;
    if(scope==='check'){e.checked=d.checks[key];return;}
    if(scope==='gap'){e.value=d.gaps[Number(key.slice(4))]===null?'':display(d.gaps[Number(key.slice(4))]);return;}
    const value=(scope==='door'?d:project)[key];
    if(key==='custom')e.value=d.custom.map(display).join(', ');
    else if(key==='zones')e.value=d.zones.map(z=>display(z.from)+':'+display(z.to)).join(', ');
    else e.value=typeof value==='number'&&key!=='count'?display(value):value;
    if(e.type==='number'&&key!=='count'){
      if(!e.dataset.mmMin)e.dataset.mmMin=e.min;
      if(!e.dataset.mmMax)e.dataset.mmMax=e.max;
      e.min=Number(e.dataset.mmMin)/factor();e.max=Number(e.dataset.mmMax)/factor();
    }
  });
  for(const key of ['count','top','bottom'])$(`[name="${key}"]`).disabled=d.custom.length>0;
}
function gapSummary(d){
  return `<h3>Reveal observations</h3><div class="di-gap-grid">${['Left','Top','Right','Bottom'].map((label,i)=>{
    const g=d.observations[i];return `<div class="${g&&!g.within?'di-outlier':''}"><span>${label}</span><strong>${g?esc(display(g.value)+' '+project.unit):'Unmeasured'}</strong><small>${g?(g.delta>0?'+':'')+display(g.delta)+' '+project.unit+' / '+(g.within?'within entered tolerance':'outside entered tolerance'):'No observation recorded'}</small></div>`;
  }).join('')}</div><p class="di-small">${d.evidence} of 3 physical observations recorded · ${d.measured} of 4 gaps measured.</p>`;
}
function output(){
  list();let result;
  try{result=calculate(project);}
  catch(e){$('#di-summary').innerHTML=`<div class="di-notice" role="alert"><strong>Check the input</strong><p>${esc(e.message)} Values in this message use mm.</p></div>`;$('#di-map').innerHTML='';$('#di-map-title').textContent='Map unavailable';$('#di-fit-results').innerHTML='';$('#di-register').textContent='Resolve invalid inputs to show the schedule.';$('#di-csv').disabled=true;$('#di-svg').disabled=true;$('#di-backup').disabled=true;return;}
  const d=result.doors[active],issues=result.issues;
  $('#di-summary').innerHTML=`<div class="di-stats"><div><strong>${project.doors.length}</strong><span>doors</span></div><div><strong>${result.holes}</strong><span>proposed cups</span></div><div><strong>${result.outside}</strong><span>gap outliers / ${result.measured} measured</span></div></div>${issues.length?`<div class="di-notice"><strong>Geometry needs review</strong><ul>${issues.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`:'<p class="di-pass">Entered geometry fits. Physical review remains separate.</p>'}`;
  $('#di-map-title').textContent=d.id+' · BACK face · top up';
  $('#di-map').innerHTML=renderSVG(project,d.id);
  $('#di-fit-results').innerHTML=gapSummary(d);
  $('#di-register').innerHTML=`<table><caption>Project ${esc(project.name)} · revision ${esc(project.revision)} · X from LEFT, Y DOWN from TOP, BACK face</caption><thead><tr><th>Door / hand</th><th>Finished W × H × T / mm</th><th>Cup centers X, Y / mm</th><th>Review</th></tr></thead><tbody>${result.doors.map(door=>`<tr><th>${esc(door.id)}<br><small>${door.hand}</small></th><td>${mm(door.width)} × ${mm(door.height)} × ${mm(door.thickness)}</td><td>${door.holes.map(c=>`${mm(c.x)}, ${mm(c.y)}`).join('<br>')}</td><td>${door.issues.length?'Geometry conflict':'Geometry fits'}<br>${door.measured}/4 gaps · ${door.outside} outliers<br>${door.evidence}/3 observations</td></tr>`).join('')}</tbody></table>`;
  $('#di-csv').disabled=issues.length>0;$('#di-svg').disabled=issues.length>0;$('#di-backup').disabled=false;
}
function showTab(next){tab=next;$$('[data-tab]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.tab===tab)));$$('[data-panel]').forEach(e=>e.hidden=e.dataset.panel!==tab);}
function updateAll(){fields();output();showTab(tab);}
function clearForGeometry(all){
  project.doors=project.doors.map((d,i)=>all||i===active?clearEvidence(d):d);
  $$('[data-scope="check"]').forEach(e=>e.checked=false);$$('[data-scope="gap"]').forEach(e=>e.value='');
  message('Geometry changed. Affected gap measurements and physical observations were cleared.');
}
function numeric(text){return text.trim()===''?NaN:Number(text);}
document.addEventListener('input',e=>{
  const input=e.target,scope=input.dataset.scope,key=input.name;if(!scope||input.tagName==='SELECT')return;
  const d=project.doors[active];
  if(scope==='check')d.checks[key]=input.checked;
  else if(scope==='gap')d.gaps[Number(key.slice(4))]=input.value.trim()===''?null:numeric(input.value)*factor();
  else{
    let value=input.type==='number'?numeric(input.value)*(key==='count'?1:factor()):input.value;
    if(key==='custom')value=input.value.trim()===''?[]:input.value.split(',').map(v=>numeric(v)*factor());
    if(key==='zones')value=input.value.trim()===''?[]:input.value.split(',').map(v=>{const pair=v.split(':');return {from:pair.length===2?numeric(pair[0])*factor():NaN,to:pair.length===2?numeric(pair[1])*factor():NaN};});
    (scope==='project'?project:d)[key]=value;
    const geometry=scope==='door'&&key!=='id'||['hardware','diameter','edge','penetration','reserve'].includes(key);
    if(geometry)clearForGeometry(scope==='project');
    if(key==='custom')for(const k of ['count','top','bottom'])$(`[name="${k}"]`).disabled=value.length>0;
  }
  output();persist();
});
document.addEventListener('change',e=>{
  if(e.target.id==='di-unit'){
    try{validateProject(project);}catch(error){e.target.value=project.unit;message('Resolve the invalid input before changing display units.');return;}
    project.unit=e.target.value;fields();output();persist();return;
  }
  if(e.target.name==='hand'){project.doors[active].hand=e.target.value;clearForGeometry(false);output();persist();}
});
$$('form').forEach(form=>form.addEventListener('submit',e=>e.preventDefault()));
$('#di-doors').addEventListener('click',e=>{
  const button=e.target.closest('[data-door]');if(!button)return;
  try{validateProject(project);}catch(error){message('Resolve the invalid input before switching doors.');return;}
  active=Number(button.dataset.door);updateAll();
});
$$('[data-tab]').forEach(e=>e.addEventListener('click',()=>showTab(e.dataset.tab)));
$('#di-add').addEventListener('click',()=>{
  try{validateProject(project);}catch(error){message('Resolve the invalid input before adding another door.');return;}
  if(project.doors.length>=30)return;
  let n=1;while(project.doors.some(d=>d.id==='D'+n))n++;
  project.doors.push(blankDoor('D'+n));active=project.doors.length-1;tab='survey';updateAll();persist();message('Added a new door. Enter its measured dimensions before using its map.');
});
function review(next,copy){pending=next;$('#di-review-copy').textContent=copy;$('#di-review').showModal();}
$('#di-remove').addEventListener('click',()=>{
  if(project.doors.length<=1)return;
  const next=structuredClone(project),id=next.doors.splice(active,1)[0].id;
  review(next,`Remove ${id} and its measurements from this schedule? Other door observations will remain.`);
});
$('#di-example').addEventListener('click',()=>review(sampleProject(),'Load the illustrative two-door example and replace the current record?'));
$('#di-cancel').addEventListener('click',()=>{$('#di-review').close();pending=null;});
$('#di-review').addEventListener('cancel',()=>{pending=null;});
$('#di-apply').addEventListener('click',()=>{if(!pending)return;project=pending;pending=null;active=0;$('#di-review').close();updateAll();persist();message('The replacement record is now open. Review its physical setup before use.');});
$('#di-import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    if(file.size>200000)throw Error('File is too large (maximum 200 KB).');
    const next=importProject(JSON.parse(await file.text()));
    review(next,`Import “${next.name}”, revision ${next.revision}, with ${next.doors.length} doors? All imported measurements and observations will be cleared.`);
  }catch(error){message('Import was not applied. '+error.message);}
  finally{e.target.value='';}
});
function download(name,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#di-csv').addEventListener('click',()=>download('door-installation-schedule.csv',exportCSV(project),'text/csv;charset=utf-8'));
$('#di-svg').addEventListener('click',()=>{const id=project.doors[active].id;download('door-'+id.replace(/[^a-z0-9_-]/gi,'_')+'.svg',renderSVG(project,id),'image/svg+xml');});
$('#di-backup').addEventListener('click',()=>download('door-installation-project.json',JSON.stringify(validateProject(project),null,2),'application/json'));
$('#di-print').addEventListener('click',()=>window.print());
updateAll();
if(!storageAvailable)storageStatus('Browser storage is unavailable or could not be read. Work in this session and save a JSON backup.');
