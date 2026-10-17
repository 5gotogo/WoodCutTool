import { STORAGE_KEY, JOINTS, EVIDENCE, sampleProject, normalizeProject, calculate, renderSVG, exportCSV, esc, fmt, jointById } from './joinery-core.js';

const directory=document.querySelector('#jl-directory');
if(directory) {
  const search=document.querySelector('#jl-search'),buttons=[...document.querySelectorAll('[data-jl-filter]')],cards=[...document.querySelectorAll('[data-jl-card]')];
  let filter='all';
  const apply=()=>{let count=0;for(const card of cards){const show=(filter==='all'||card.dataset.joint===filter)&&card.textContent.toLowerCase().includes(search.value.trim().toLowerCase());card.hidden=!show;if(show)count++;}document.querySelector('#jl-count').textContent=count+' guides shown';document.querySelector('#jl-empty').hidden=count!==0;};
  search.addEventListener('input',apply);
  for(const button of buttons)button.addEventListener('click',()=>{filter=button.dataset.jlFilter;for(const b of buttons)b.setAttribute('aria-pressed',String(b===button));apply();});
  apply();
}

const workspace=document.querySelector('[data-jl-workspace]');
if(workspace) {
  const id=workspace.dataset.jlWorkspace,j=jointById(id),form=document.querySelector('#jl-form'),status=document.querySelector('#jl-storage'),announce=document.querySelector('#jl-announce'),dialog=document.querySelector('#jl-dialog');
  let project=sampleProject(),storageAvailable=true,pending=null;
  try {const raw=localStorage.getItem(STORAGE_KEY);if(raw)project=normalizeProject(JSON.parse(raw));}
  catch(error) {storageAvailable=false;status.textContent='The saved draft could not be read. This example is active; export a backup to retain your work. '+error.message;}
  const unitValue=(value,count)=>count||project.unit==='mm'?value:value/25.4;
  const display=(value,unit)=>unit==='count'?fmt(value):fmt(unitValue(value,false))+' '+project.unit;
  function save() {
    try {normalizeProject(project);} catch {status.textContent='An input is unfinished or outside its range. The previous saved draft is retained; complete the field before saving or exporting.';return;}
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(project));storageAvailable=true;status.textContent='Draft saved in this browser. All six planners share this project. Download a JSON backup for a separate copy.';}
    catch {storageAvailable=false;status.textContent='Browser storage is unavailable. The current session still calculates; download a JSON backup before leaving.';}
  }
  function renderFields() {
    document.querySelector('#jl-fields').innerHTML=j.fields.map(([key,label,min,max,,count])=>`<label for="jl-${key}">${esc(label)}<span class="jl-input-wrap"><input id="jl-${key}" name="${key}" type="number" step="${count?'1':'any'}" min="${unitValue(min,count)}" max="${unitValue(max,count)}" required inputmode="decimal" value="${project.values[id][key]==null?'':Number(unitValue(project.values[id][key],count).toFixed(8))}"><span>${count?'count':project.unit}</span></span></label>`).join('');
    for(const key of ['name','revision','notes'])form.elements[key].value=project[key];
    form.elements.unit.value=project.unit;
    syncEvidence();
  }
  function syncEvidence() {for(let i=0;i<EVIDENCE.length;i++)form.elements['evidence-'+i].checked=project.evidence[id][i];}
  function update() {
    const r=calculate(id,project.values[id]),evidence=project.evidence[id].filter(Boolean).length;
    document.querySelector('#jl-result-status').textContent=r.ok?'Geometry calculated · '+evidence+' of 3 observations recorded':'Review the inputs before using this layout';
    document.querySelector('#jl-result-status').className='jl-result-status'+(r.ok?'':' jl-invalid');
    document.querySelector('#jl-results').innerHTML=r.ok?`<div class="jl-metrics">${r.metrics.map(m=>`<div><span>${esc(m.label)}</span><strong>${display(m.value,m.unit)}</strong></div>`).join('')}</div>`:`<div class="jl-error" role="alert"><strong>Layout unavailable</strong><ul>${r.errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul><p>The previous drawing and dimension register are hidden until the inputs are corrected.</p></div>`;
    document.querySelector('#jl-drawing').innerHTML=renderSVG(id,project.values[id]);
    document.querySelector('#jl-warnings').innerHTML=r.ok?r.warnings.map(w=>`<p class="jl-notice">${esc(w)}</p>`).join(''):'';
    document.querySelector('#jl-register').innerHTML=r.ok?`<table><caption>Current dimension register · ${project.unit} · SVG labels always use mm</caption><thead><tr><th scope="col">Dimension / interval</th><th scope="col">Value or start</th><th scope="col">End</th></tr></thead><tbody>${r.rows.map(row=>`<tr><th scope="row">${esc(row.label)}</th><td>${display(row.value,row.unit)}</td><td>${row.end==null?'—':display(row.end,'mm')}</td></tr>`).join('')}</tbody></table>`:'';
    for(const key of ['csv','svg','print'])document.querySelector('#jl-'+key).disabled=!r.ok;
    let complete=true;try{normalizeProject(project);}catch{complete=false;}
    document.querySelector('#jl-backup').disabled=!complete;
    document.querySelector('#jl-print-name').textContent=project.name+' · Revision '+project.revision;
    document.querySelector('#jl-print-notes').textContent=project.notes;
    document.querySelector('#jl-print-evidence').innerHTML=EVIDENCE.map((text,i)=>`<li>${project.evidence[id][i]?'Recorded':'Not recorded'}: ${esc(text)}</li>`).join('');
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',event=>{
    const input=event.target,key=input.name;
    if(['name','revision','notes'].includes(key))project[key]=input.value;
    else if(key.startsWith('evidence-'))project.evidence[id][Number(key.slice(9))]=input.checked;
    else if(key==='unit') {project.unit=input.value;renderFields();}
    else {
      const field=j.fields.find(f=>f[0]===key);if(!field)return;
      const number=input.value===''?null:Number(input.value),value=number===null?null:Number((field[5]||project.unit==='mm'?number:number*25.4).toFixed(9));
      if(value!==project.values[id][key]) {project.values[id][key]=value;project.evidence[id]=EVIDENCE.map(()=>false);syncEvidence();announce.textContent='Dimensions changed. The three physical observations for this joint were cleared; repeat the test with this revision.';}
    }
    save();update();
  });
  const download=(name,type,content)=>{const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce.textContent='Downloaded '+name+'.';};
  document.querySelector('#jl-csv').addEventListener('click',()=>download('joinery-'+id+'.csv','text/csv;charset=utf-8',exportCSV(project,id)));
  document.querySelector('#jl-svg').addEventListener('click',()=>download('joinery-'+id+'.svg','image/svg+xml',renderSVG(id,project.values[id])));
  document.querySelector('#jl-backup').addEventListener('click',()=>download('joinery-project.json','application/json',JSON.stringify(normalizeProject(project),null,2)+'\n'));
  document.querySelector('#jl-print').addEventListener('click',()=>window.print());
  const review=(heading,copy,action)=>{pending=action;document.querySelector('#jl-dialog-title').textContent=heading;document.querySelector('#jl-dialog-copy').textContent=copy;dialog.showModal();};
  document.querySelector('#jl-cancel').addEventListener('click',()=>{pending=null;dialog.close();});
  dialog.addEventListener('cancel',()=>{pending=null;});
  document.querySelector('#jl-apply').addEventListener('click',()=>{const action=pending;pending=null;dialog.close();if(action)action();});
  document.querySelector('#jl-reset').addEventListener('click',()=>review('Load the '+j.name+' example?','This replaces only this joint’s dimensions and observations in the current project. Other joint records and your project notes are retained.',()=>{const example=sampleProject();project.values[id]=example.values[id];project.evidence[id]=example.evidence[id];renderFields();save();update();announce.textContent='Example loaded for '+j.name+'.';}));
  document.querySelector('#jl-import').addEventListener('change',async event=>{
    const file=event.target.files[0];event.target.value='';if(!file)return;
    try {if(file.size>256000)throw Error('Project files must be smaller than 256 KB.');const incoming=normalizeProject(JSON.parse(await file.text()));review('Replace all six joint records?',`Import “${incoming.name}”, revision ${incoming.revision}. This replaces all six layouts, notes, display units and recorded observations. Save a JSON backup first if you need the current project.`,()=>{project=incoming;renderFields();save();update();announce.textContent='Project imported. Check the recorded physical observations against your current parts and setup.';});}
    catch(error){announce.textContent='Import was not applied. '+error.message;}
  });
  renderFields();update();
  if(storageAvailable)status.textContent='Your project stays in this browser. All six planners share the draft; save a JSON backup for a separate copy.';
}
