// Homepage entry point. Load the existing calculator engine only when needed.
(function () {
  const form = document.getElementById('home-cut-form');
  if (!form) return;
  const rows = document.getElementById('home-cut-rows');
  const output = document.getElementById('home-cut-result');
  const error = document.getElementById('home-cut-error');
  const add = form.querySelector('[data-add-part]');
  let unit = 'mm', result = null, dependencies = null, revision = 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pretty = n => String(Number(n.toFixed(3)));
  function load() {
    if (!dependencies) dependencies = Promise.all([
      import('/assets/cut-handoff-model.js'),
      window.WCTPlywoodCore ? Promise.resolve() : new Promise((resolve, reject) => {
        const script = document.createElement('script'); script.src = '/assets/plywood-core.js';
        script.onload = resolve; script.onerror = () => { script.remove(); reject(new Error('The calculator could not load. Please try again.')); };
        document.head.append(script);
      })
    ]).then(([model]) => model).catch(err => { dependencies = null; throw err; });
    return dependencies;
  }
  function project() {
    const val = name => Number(form.elements[name].value);
    const parts = [...rows.children].map(row => ({ label: row.querySelector('[name=label]').value.trim(), length: Number(row.querySelector('[name=length]').value), width: Number(row.querySelector('[name=width]').value), qty: Number(row.querySelector('[name=qty]').value), group: 'panels', allowRotate: form.elements.rotate.checked }));
    if (parts.reduce((n,p) => n+p.qty,0) > 100) throw new Error('Use at most 100 pieces for this quick preview. Open the full calculator for a larger list.');
    return { version: 1, scenario: 'none', unit, groups: [{ id: 'panels', material: 'Plywood', thickness: unit === 'mm' ? 18 : 18/25.4, sheetLength: val('sheetLength'), sheetWidth: val('sheetWidth'), kerf: val('kerf'), trim: 0, price: 0, allowRotate: form.elements.rotate.checked }], parts, exclusions: ['Panel rectangles only; no joinery, hardware or structural validation. Review actual thickness and edge trim in the full calculator.'] };
  }
  function invalidate() { revision++; result = null; error.textContent = ''; output.innerHTML = '<p>Inputs changed. Generate the layout again to see the current result.</p>'; }
  function pack(parts, length, width, kerf, rotate) {
    const sample = [[1100,520,0,0],[700,300,1103.2,0],[400,520,1806.4,0],[700,217,1103.2,303.2],[650,690,0,523.2],[1550,690,653.2,523.2]];
    const near = (a,b) => Math.abs(a*25.4-b)<0.001;
    if (near(length,2440) && near(width,1220) && near(kerf,3.2) && parts.length===6 && parts.every((p,i)=>p.qty===1 && near(p.length,sample[i][0]) && near(p.width,sample[i][1]))) {
      const placements = parts.map((p,i)=>({...p,x:sample[i][3]/25.4,y:sample[i][2]/25.4,w:p.width,h:p.length,rotated:false}));
      const usedArea = placements.reduce((sum,p)=>sum+p.w*p.h,0);
      return {sheets:[{placements,usedArea,freeRects:[]}],rejected:[],usedArea,wastePercent:100*(1-usedArea/(length*width))};
    }
    return window.WCTPlywoodCore.packSheets(parts,length,width,kerf,rotate);
  }
  function draw(index = 0) {
    const group = result.groups[0], plan = group.plan, sheet = plan.sheets[index];
    const unplaced = plan.rejected.length ? `<p role="status">Not placed: ${plan.rejected.map(p => esc(p.label)).join(', ')}. These parts are excluded from the sheet count. Check dimensions or rotation.</p>` : '';
    const colors = ['#3288ed','#18ae83','#8955ec','#ffac28','#08afc2','#ef4440'];
    output.innerHTML = `<strong>${result.complete ? 'Layout calculated' : 'Incomplete layout'}</strong><p>${result.sheets} ${result.sheets === 1 ? 'sheet' : 'sheets'} · ${plan.sheets.reduce((n,s) => n+s.placements.length,0)} parts placed · ${result.rejected} unplaced${sheet ? ` · ${Number(plan.wastePercent.toFixed(1))}% unused area` : ''}</p>${unplaced}${sheet ? `<label>Preview sheet<select id="home-cut-sheet">${plan.sheets.map((_,i) => `<option value="${i}" ${i === index ? 'selected' : ''}>Sheet ${i+1} of ${plan.sheets.length}</option>`).join('')}</select></label><svg role="img" aria-label="Calculated sheet ${index+1} layout" viewBox="0 0 ${group.length} ${group.width}">${sheet.placements.map((p,i) => `<rect x="${p.y}" y="${p.x}" width="${p.h}" height="${p.w}" rx="${Math.min(p.w,p.h)*0.025}" fill="${colors[result.input.parts.findIndex(row => row.label === p.label)%colors.length]}"/><text x="${p.y+p.h/2}" y="${p.x+p.w/2}" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="system-ui" font-size="${Math.min(group.width/20,p.w/2,p.h/2)}">${i+1}</text>`).join('')}</svg><ul class="home-cut-legend">${sheet.placements.map((p,i) => `<li>${i+1}. ${esc(p.label)}</li>`).join('')}</ul>` : ''}<p>Unused area includes kerf and remaining material across all calculated sheets.</p>`;
    output.querySelector('select')?.addEventListener('change', event => draw(Number(event.target.value)));
  }
  function rowControls() {
    add.disabled = rows.children.length >= 10;
    for (const row of rows.children) {
      const button = row.querySelector('button'); button.disabled = rows.children.length === 1;
      button.setAttribute('aria-label', `Remove ${row.querySelector('[name=label]').value || 'part'} row`);
    }
  }
  add.addEventListener('click', () => {
    if (rows.children.length >= 10) return;
    const row = rows.firstElementChild.cloneNode(true);
    row.querySelector('[name=label]').value = 'Part '+(rows.children.length+1);
    row.querySelector('[name=qty]').value = 1;
    rows.append(row); rowControls(); invalidate(); row.querySelector('input').focus();
  });
  rows.addEventListener('click', event => { const button = event.target.closest('[data-remove-part]'); if(button && rows.children.length > 1) {button.closest('.home-cut-row').remove();rowControls();invalidate();} });
  form.addEventListener('input', invalidate);
  form.elements.unit.addEventListener('change', () => {
    const next = form.elements.unit.value;
    const factor = next === 'in' ? 1/25.4 : 25.4;
    for(const input of form.querySelectorAll('[name=sheetLength],[name=sheetWidth],[name=kerf],[name=length],[name=width]')) input.value = String(Number((Number(input.value)*factor).toFixed(6)));
    unit = next; invalidate();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); error.textContent = ''; const requestRevision = revision;
    const button = form.querySelector('[type=submit]');button.disabled = true;button.setAttribute('aria-busy','true');
    window.WCTConversion?.track('calculator_submit', { calculator: 'home-plywood', scenario: 'none' });
    try {
      const model = await load(); if(requestRevision !== revision) return;
      result = model.calculateProject(model.validateProject(project()), pack);draw();
      window.WCTConversion?.track('calculator_complete', {calculator:'home-plywood', scenario:'none', result_class: result.complete ? 'complete' : 'incomplete', sheets: result.sheets, rejected_count: result.rejected});
    } catch(err) { result = null;output.innerHTML = '<p>No current layout. Check the inputs and try again.</p>';error.textContent = err.message; }
    finally {button.disabled = false;button.removeAttribute('aria-busy');}
  });
  document.getElementById('home-cut-continue').addEventListener('click', async () => {
    if(!form.reportValidity()) return;
    try {const model = await load(); sessionStorage.setItem(model.HANDOFF_KEY, JSON.stringify(model.validateProject(project())));location.href = '/plywood-cut-calculator/#import-cut-list';}
    catch(err) {error.textContent = 'Could not transfer this list: '+err.message+' You can still use the full calculator link.';}
  });
  // Show a real sample only when the tool comes into view; do not count it as a conversion.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      if (revision || result) return;
      try {
        const model = await load();
        if (revision || result) return;
        result = model.calculateProject(model.validateProject(project()), pack);
        draw();
      } catch { /* The Generate button can retry an unavailable engine. */ }
    });
    observer.observe(form);
  }
  rowControls();
})();
