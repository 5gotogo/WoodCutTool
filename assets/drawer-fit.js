import {STORAGE_KEY,FIELDS,CHECKS,sampleProject,parseProject,calculate,exportCSV,renderSVG,esc,fmt} from './drawer-fit-core.js';
const form=document.querySelector('#df-form');
if(form){
 let p=sampleProject(),view='plan',pending=null,stored=true;
 const status=document.querySelector('#df-status'),announce=document.querySelector('#df-announce'),dialog=document.querySelector('#df-import-review');
 try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)p=parseProject(JSON.parse(saved));}catch{stored=false;status.textContent='Saved draft could not be read. The example is loaded; the existing draft is kept until you edit. Save a JSON backup of this session.';}
 function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(p));stored=true;status.textContent='Draft saved in this browser. Download JSON to keep a separate copy.';}catch{stored=false;status.textContent='Browser storage is unavailable. This session still calculates and exports; download JSON before leaving.';}}
 function populate(){for(const k of [...FIELDS.map(f=>f[0]),'count','name','revision','hardware','notes'])form.elements.namedItem(k).value=p[k];for(const [k]of CHECKS)form.elements.namedItem('check-'+k).checked=p.checks[k];}
 function render(){
  const r=calculate(p),out=document.querySelector('#df-results');
  document.querySelector('#df-csv').disabled=!r.ok;document.querySelector('#df-svg').disabled=!r.ok;
  document.querySelector('#df-map').innerHTML=r.ok?renderSVG(p,view):'<p class="df-hint">The diagram returns when all dimensions are valid.</p>';
  if(!r.ok){out.innerHTML='<div class="df-error" role="alert"><h3>Resolve the geometry</h3><ul>'+r.errors.map(e=>'<li>'+esc(e)+'</li>').join('')+'</ul>'+(Number.isFinite(r.widthLow)&&r.widthLow<=r.widthHigh?'<p>Common box-width interval: '+fmt(r.widthLow)+'–'+fmt(r.widthHigh)+' mm. Current target produces '+fmt(r.boxWidth)+' mm.</p>':'')+'</div>';document.querySelector('#df-parts').innerHTML='';return;}
  out.innerHTML=`<p class="df-state">GEOMETRY SCREEN PASSES · PHYSICAL CHECKS ${r.evidence}/4</p><div class="df-metrics"><div><span>Outside box width</span><strong>${fmt(r.boxWidth)} <small>mm</small></strong></div><div><span>Finished front · W × H</span><strong>${fmt(r.frontWidth)} × ${fmt(r.frontHeight)} <small>mm</small></strong></div></div><dl class="df-readings"><div><dt>Common box-width interval</dt><dd>${fmt(r.widthLow)}–${fmt(r.widthHigh)} mm</dd></div><div><dt>Centered side spaces · front / middle / rear</dt><dd>${r.spaces.map(fmt).join(' / ')} mm</dd></div><div><dt>Rear space / required reserve</dt><dd>${fmt(r.rearRemaining)} / ${fmt(p.rearReserve)} mm</dd></div><div><dt>Equal bay height / unused vertical reserve</dt><dd>${fmt(r.bayHeight)} / ${fmt(r.verticalReserve)} mm</dd></div></dl>${r.warnings.length?'<div class="df-warning">'+r.warnings.map(esc).join('<br>')+'</div>':''}<p class="df-hint">Centered gaps at three stations; inspect each actual side and the full travel. Front layout does not position the box or its fixing holes.</p>`;
  document.querySelector('#df-parts').innerHTML=`<h3>Finished parts · ${p.count} equal drawers</h3><div class="df-table"><table><caption>Butt joints · full-length sides · applied bottom · all dimensions mm</caption><thead><tr><th scope="col">Part</th><th scope="col">Qty</th><th scope="col">L × W × T</th></tr></thead><tbody>${r.parts.map(x=>`<tr><th scope="row">${x.part}</th><td>${x.qty}</td><td>${fmt(x.length)} × ${fmt(x.width)} × ${fmt(x.thickness)}</td></tr>`).join('')}</tbody></table></div><details><summary>Front top positions from envelope top</summary><ol>${r.fronts.map(f=>`<li>Front ${f.number}: ${fmt(f.top)} mm down · ${fmt(f.height)} mm high</li>`).join('')}</ol></details><p class="df-hint">Finished sizes, no kerf allowance. Box height includes the applied bottom. Grooved bottoms and undermount preparation need a different construction schedule.</p>`;
 }
 function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce.textContent='Download prepared: '+name;}
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('input',e=>{
  const k=e.target.name;if(!k)return;
  if(k.startsWith('check-'))p.checks[k.slice(6)]=e.target.checked;
  else {p[k]=FIELDS.some(f=>f[0]===k)||k==='count'?(e.target.value.trim()===''?NaN:Number(e.target.value)):e.target.value;
   if(FIELDS.some(f=>f[0]===k)||k==='count'||k==='hardware'){p.checks=Object.fromEntries(CHECKS.map(([key])=>[key,false]));for(const [key]of CHECKS)form.elements.namedItem('check-'+key).checked=false;announce.textContent='Design changed. Physical evidence cleared; repeat the relevant checks.';}
  }
  // Do not overwrite a recoverable draft with incomplete numeric input.
  try{parseProject(p);save();}catch{status.textContent='Incomplete field: calculation paused; the previous saved draft is retained.';}
  render();
 });
 for(const button of document.querySelectorAll('[data-df-view]'))button.addEventListener('click',()=>{view=button.dataset.dfView;for(const b of document.querySelectorAll('[data-df-view]'))b.setAttribute('aria-pressed',String(b===button));render();});
 document.querySelector('#df-csv').addEventListener('click',()=>{try{download('drawer-fit-parts.csv',exportCSV(p),'text/csv;charset=utf-8');}catch(e){announce.textContent=e.message;}});
 document.querySelector('#df-svg').addEventListener('click',()=>download('drawer-fit-'+view+'.svg',renderSVG(p,view),'image/svg+xml'));
 document.querySelector('#df-backup').addEventListener('click',()=>{try{parseProject(p);download('drawer-fit-project.json',JSON.stringify(p,null,2)+'\n','application/json');}catch{announce.textContent='Complete valid fields before backing up the project.';}});
 document.querySelector('#df-print').addEventListener('click',()=>window.print());
 document.querySelector('#df-example').addEventListener('click',()=>{pending=sampleProject();document.querySelector('#df-import-copy').textContent='Load the three-drawer example and replace the current draft? Save a backup first if you need to retain it.';dialog.showModal();});
 document.querySelector('#df-import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error('Use a project JSON smaller than 100 KB.');pending=parseProject(JSON.parse(await file.text()));document.querySelector('#df-import-copy').textContent=`Replace this draft with “${pending.name}”, revision ${pending.revision}, ${pending.count} drawers? Imported evidence is a saved observation, not a new test. Save a backup first if needed.`;dialog.showModal();}catch(error){announce.textContent='Import not applied. '+error.message;}e.target.value='';});
 document.querySelector('#df-cancel').addEventListener('click',()=>{pending=null;dialog.close();});
 dialog.addEventListener('cancel',()=>{pending=null;});
 document.querySelector('#df-apply').addEventListener('click',()=>{if(!pending)return;p=pending;pending=null;populate();save();render();dialog.close();announce.textContent='Project replaced. Review the geometry and saved physical observations.';});
 populate();render();if(stored)status.textContent='Draft stays in this browser. Download JSON to keep a separate copy.';
}
