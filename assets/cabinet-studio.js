import { DEFAULTS, PRESETS, normalize, buildCabinet, fitShelves, parseBrief, csvCutList } from './cabinet-studio-core.js';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const ns = 'http://www.w3.org/2000/svg';
const storageKey = 'woodcuttool.cabinet-studio.v1';
const mobileView = matchMedia('(max-width: 720px)');
function syncViewport() { $('#cs-model').setAttribute('viewBox', mobileView.matches ? '90 15 620 620' : '0 0 800 650'); }
mobileView.addEventListener('change', () => { syncViewport(); if (visual) drawModel(visual); });
syncViewport();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fmt = n => Number(n.toFixed(1)).toLocaleString('en-US');
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const escape = value => String(value).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
let config = { ...DEFAULTS }, comparisons = [], model, selected = null, activePreset = 'bookcase', view = 'model';
let angle = -28, explosion = 0, dimensions = true, animId = 0, animationTimer, saveTimer, assemblyStep = -1;
let lastDownloadUrl;
let visual = null, storageAvailable = true, validInput = true, draftPending = false;
const palette = { birch: ['#d9c49b', '#f0dfbb', '#b7a075'], oak: ['#c69e67', '#e3c58e', '#987445'], walnut: ['#896245', '#b08c67', '#644633'] };
function notice(text = '', error = false) { $('#cs-notice').textContent = text; $('#cs-notice').dataset.error = String(error); }
function setExportEnabled(enabled) { ['cs-export-csv', 'cs-export-svg', 'cs-print', 'cs-snapshot', 'cs-backup', 'cs-share'].forEach(id => $('#' + id).disabled = !enabled || (id === 'cs-snapshot' && comparisons.length >= 3)); }
function readForm() {
  const raw = { ...config };
  new FormData($('#cs-design-form')).forEach((v, k) => raw[k] = Number(v));
  raw.back = $('#cs-design-form [name=back]').checked;
  raw.grain = $('#cs-design-form [name=grain]').checked;
  return normalize(raw);
}
function syncForm() {
  for (const [k, v] of Object.entries(config)) {
    const input = $(`#cs-design-form [name="${k}"]`);
    if (input) { if (input.type === 'checkbox') input.checked = v; else input.value = v; }
    const range = $(`[data-range="${k}"]`); if (range) range.value = v;
  }
  $$('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === activePreset)));
  $$('[data-material]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.material === config.material)));
}
function scheduleSave() {
  clearTimeout(saveTimer);
  $('#cs-save-status').textContent = storageAvailable ? 'Saving this design…' : 'Local saving unavailable. Export a JSON backup.';
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, config, comparisons })); storageAvailable = true; $('#cs-save-status').textContent = '✓ Saved in this browser · No account needed'; }
    catch { storageAvailable = false; $('#cs-save-status').textContent = 'Local saving unavailable. Export a JSON backup.'; }
  }, 250);
}
function snapshotVisual() { return { config: { ...config }, boxes: Object.fromEntries(model.parts.map(p => [p.id, [...p.box]])), angle, explosion }; }
function animate(from, target) {
  cancelAnimationFrame(animId);
  const start = performance.now(), duration = reduced.matches ? 0 : 470;
  function frame(now) {
    const t = duration ? Math.min(1, (now - start) / duration) : 1, e = 1 - Math.pow(1 - t, 3);
    const lerp = (a, b) => a + (b - a) * e;
    const c = Object.fromEntries(Object.entries(target.config).map(([k, v]) => [k, typeof v === 'number' && typeof from?.config[k] === 'number' ? lerp(from.config[k], v) : v]));
    const boxes = Object.fromEntries(Object.entries(target.boxes).map(([id, box]) => [id, box.map((n, i) => lerp(from?.boxes[id]?.[i] ?? n, n))]));
    visual = { config: c, boxes, angle: lerp(from?.angle ?? target.angle, target.angle), explosion: lerp(from?.explosion ?? target.explosion, target.explosion) };
    drawModel(visual);
    if (t < 1) animId = requestAnimationFrame(frame);
  }
  animId = requestAnimationFrame(frame);
}
function update(next, { message = '', preset = '', immediate = false } = {}) {
  stopAssembly();
  config = normalize(next); activePreset = preset;
  // A shared design becomes a local draft; reload must retain subsequent edits.
  if (new URLSearchParams(location.hash.slice(1)).has('width')) history.replaceState(null, '', location.pathname + location.search);
  model = buildCabinet(config); validInput = true; syncForm(); notice(message);
  if (!model.parts.some(p => p.id === selected)) selected = null;
  $('#cs-model-size').textContent = `${fmt(config.width)} × ${fmt(config.height)} × ${fmt(config.depth)} mm`;
  renderModelNodes(); renderResults(); renderComparison(); selectPart(selected); setExportEnabled(model.valid); scheduleSave();
  if (immediate) { cancelAnimationFrame(animId); visual = snapshotVisual(); drawModel(visual); }
  else animate(visual, snapshotVisual());
}
function svgElement(tag, attrs = {}) { const e = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([key, v]) => e.setAttribute(key, v)); return e; }
function renderModelNodes() {
  const container = $('#cs-model-parts'), existing = new Map([...container.children].map(e => [e.dataset.part, e]));
  for (const p of model.parts) {
    let group = existing.get(p.id);
    if (!group) {
      group = svgElement('g', { 'data-part': p.id, role: 'button', tabindex: 0, 'aria-pressed': 'false' });
      for (let f = 0; f < 3; f++) group.append(svgElement('polygon', { stroke: '#624f3545', 'stroke-width': '.75', 'stroke-linejoin': 'round' }));
      group.append(svgElement('polygon', { fill: 'url(#cs-grain)', 'pointer-events': 'none' }));
      container.append(group);
    }
    group.setAttribute('aria-label', `${p.label}, ${fmt(p.length)} by ${fmt(p.width)} by ${p.thickness} mm`);
    existing.delete(p.id);
  }
  existing.forEach(e => e.remove());
}
function drawModel(v) {
  const c = v.config, yaw = v.angle * Math.PI / 180, tilt = 12 * Math.PI / 180, e = v.explosion;
  const size = Math.max(c.width, c.height), separation = size * 0.15 * e;
  const scale = Math.min(530 / (c.width * Math.cos(yaw) + c.depth * Math.abs(Math.sin(yaw)) + separation * 2.4), (mobileView.matches ? 400 : 440) / (c.height + separation * 1.6 + c.depth * .23));
  const project = (x, y, z) => {
    x -= c.width / 2; y -= c.height / 2; z -= c.depth / 2;
    const xx = x * Math.cos(yaw) - z * Math.sin(yaw), zz = x * Math.sin(yaw) + z * Math.cos(yaw);
    return [400 + xx * scale, (mobileView.matches ? 305 : 325) + (-y * Math.cos(tilt) + zz * Math.sin(tilt)) * scale];
  };
  const points = arr => arr.map(p => project(...p).map(n => n.toFixed(2)).join(',')).join(' ');
  const colors = palette[c.material];
  const sorted = [...model.parts].sort((a, b) => {
    const depth = p => { const [x, y, z, w, h, d] = v.boxes[p.id]; return (x + w / 2) * Math.sin(yaw) + (z + d / 2) * Math.cos(yaw) + (y + h / 2) * .15; };
    return depth(b) - depth(a);
  });
  const parent = $('#cs-model-parts');
  for (const p of sorted) {
    const group = parent.querySelector(`[data-part="${p.id}"]`);
    const box = v.boxes[p.id]; if (!group || !box) continue;
    let [x, y, z, w, h, d] = box;
    x += p.offset[0] * separation; y += p.offset[1] * separation; z -= p.offset[2] * separation;
    const front = [[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]];
    const top = [[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]];
    const side = v.angle <= 0 ? [[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]] : [[x,y,z+d],[x,y,z],[x,y+h,z],[x,y+h,z+d]];
    const faces = [side, top, front];
    for (let i = 0; i < 3; i++) { group.children[i].setAttribute('points', points(faces[i])); group.children[i].setAttribute('fill', colors[[2,1,0][i]]); }
    group.children[3].setAttribute('points', points(front));
    group.children[3].setAttribute('fill', p.id === 'back' && c.width > c.height ? 'url(#cs-grain-horizontal)' : 'url(#cs-grain)');
    // An assembly view isolates meaningful groups. The construction model still contains all parts.
    let opacity = 1;
    if (assemblyStep >= 0) {
      const visible = assemblyStep === 0 ? ['left','right','bottom'].includes(p.id) : assemblyStep === 1 ? !p.id.startsWith('shelf') && p.id !== 'back' : assemblyStep === 2 ? p.id !== 'back' : true;
      opacity = visible ? 1 : .06;
    }
    group.setAttribute('opacity', opacity);
    // Only reorder when necessary; leave focused SVG controls in place while using the keyboard.
    if (document.activeElement !== group && group !== parent.lastElementChild) parent.append(group);
  }
  const grid = $('#cs-grid');
  if (!grid.children.length) for (let i = -5; i <= 5; i++) {
    grid.append(svgElement('line', { x1: 400+i*45-190, y1: 524+i*9, x2: 400+i*45+190, y2: 600+i*9 }));
    grid.append(svgElement('line', { x1: 400+i*45+190, y1: 524-i*9, x2: 400+i*45-190, y2: 600-i*9 }));
  }
  const dim = $('#cs-dimensions'); dim.replaceChildren();
  if (dimensions && assemblyStep < 0) {
    const line = (a, b, text, offset) => {
      a = project(...a); b = project(...b);
      dim.append(svgElement('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }));
      for (const p of [a,b]) dim.append(svgElement('line', { x1: p[0]-3, y1: p[1]-4, x2: p[0]+3, y2: p[1]+4 }));
      const label = svgElement('text', { x: (a[0]+b[0])/2 + offset[0], y: (a[1]+b[1])/2 + offset[1], 'text-anchor': 'middle' }); label.textContent = text; dim.append(label);
    };
    line([0,-85,0],[c.width,-85,0], `${Math.round(c.width)} mm`, [0,17]);
    line([-75,0,0],[-75,c.height,0], `${Math.round(c.height)} mm`, [-33,0]);
    line([c.width+65,0,0],[c.width+65,0,c.depth], `${Math.round(c.depth)} mm`, [30,14]);
  }
}
function renderResults() {
  const count = model.groups.reduce((v, g) => v + g.sheets.length, 0), complete = !model.groups.some(g => g.unplaced.length);
  const metrics = [
    ['Panels', model.parts.length, `${fmt(model.area / 1e6)} m² finished area`],
    ['Full sheets', complete ? count : '—', `${fmt(config.thickness)} mm body${config.back ? ' + 6 mm back' : ''}`],
    ['Utilization', complete ? `${Math.round(model.utilization)}%` : '—', 'Finished area / purchased area'],
    ['Stock budget', complete ? money(model.cost) : '—', 'Your USD prices · sheets only']
  ];
  $('#cs-metrics').innerHTML = metrics.map(([label, value, detail]) => `<div class="cs-metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`).join('');
  $('#cs-layout-summary').textContent = `${complete ? count : 'Incomplete'} full sheets · ${config.sheetLength} × ${config.sheetWidth} mm · ${config.kerf} mm kerf · ${config.trim} mm edge trim · ${config.grain ? 'grain locked' : 'rotation allowed'}`;
  let sheetNo = 0;
  $('#cs-sheets').innerHTML = model.groups.flatMap(g => [
    ...g.sheets.map((sheet, i) => {
      sheetNo++;
      return `<article class="cs-sheet"><h3>Sheet ${sheetNo} / ${g.thickness} mm ${g.thickness === 6 ? 'back' : 'body'} stock</h3><svg viewBox="-8 -8 ${config.sheetLength+16} ${config.sheetWidth+16}" role="group" aria-label="Sheet ${sheetNo} layout"><rect width="${config.sheetLength}" height="${config.sheetWidth}" fill="#e5dfca" stroke="#9c987b" stroke-width="5"/><rect x="${config.trim}" y="${config.trim}" width="${config.sheetLength-2*config.trim}" height="${config.sheetWidth-2*config.trim}" fill="none" stroke="#b79c62" stroke-width="3" stroke-dasharray="15 10"/>${sheet.placed.map((p, index) => `<g data-part="${p.id}" role="button" tabindex="0" aria-label="${escape(p.label)}, ${fmt(p.length)} by ${fmt(p.width)} mm${p.rotated ? ', rotated' : ''}" aria-pressed="false"><rect x="${p.x}" y="${p.y}" width="${p.l}" height="${p.w}" fill="${palette[config.material][index%2]}" stroke="#fffef1" stroke-width="3"/><text x="${p.x+p.l/2}" y="${p.y+p.w/2}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="${Math.min(40,p.w*.18,p.l*.14)}" fill="#3f3428" pointer-events="none">${escape(p.label)}</text>${config.grain ? `<path d="M${p.x+15} ${p.y+15}h${Math.min(100,p.l-30)}m-14 -7l14 7-14 7" fill="none" stroke="#72562e" stroke-width="3" pointer-events="none"/>` : ''}</g>`).join('')}</svg><p>${sheet.placed.length} panels · ${config.sheetLength} × ${config.sheetWidth} mm · ${config.grain ? 'grain → along sheet length' : '90° rotation allowed'}</p></article>`;
    }),
    ...(g.unplaced.length ? [`<article class="cs-insight" data-kind="error"><h3>Unplaced ${g.thickness} mm parts</h3><p>${g.unplaced.map(p => `${escape(p.label)} (${fmt(p.length)} × ${fmt(p.width)})`).join(', ')}. These parts need larger stock or a revised design.</p></article>`] : [])
  ]).join('');
  $('#cs-cut-rows').innerHTML = model.parts.map(p => `<tr data-row="${p.id}"><td><button type="button" data-part="${p.id}" aria-pressed="false">${escape(p.label)}</button></td><td>${fmt(p.length)}</td><td>${fmt(p.width)}</td><td>${p.thickness}</td><td>1</td></tr>`).join('');
  const checks = [...model.issues];
  if (model.opening >= config.target) checks.unshift({ kind: 'pass', title: 'Your items have room', detail: `${fmt(model.opening)} mm clear opening in each bay meets the ${config.target} mm item target.` });
  if (complete && model.valid) checks.push({ kind: 'pass', title: 'Every panel is accounted for', detail: `${model.parts.length} panels placed on ${count} thickness-separated sheets, with trim, kerf, and grain rules included.` });
  checks.push({ kind: 'note', title: 'Finish the front edges', detail: `${fmt(model.edge)} m of visible front edges before waste allowance. Check edging thickness against the finished dimensions and order separately.` });
  $('#cs-check-count').textContent = `${checks.length} live design checks`;
  $('#cs-insights').innerHTML = checks.map(i => `<article class="cs-insight" data-kind="${i.kind}"><span>${{error:'Needs revision',warning:'Review this',note:'Workshop note',pass:'Geometry checked'}[i.kind]}</span><h3>${escape(i.title)}</h3><p>${escape(i.detail)}</p>${i.action ? `<button type="button" data-fix="${i.action}">${{fit:'Fit shelf spacing',divide:'Add a bay divider',back:'Add the overlay back'}[i.action]} ↗</button>` : ''}</article>`).join('');
}
function selectPart(id) {
  selected = id;
  $$('[data-part]').forEach(e => e.setAttribute('aria-pressed', String(e.dataset.part === id)));
  $$('[data-row]').forEach(e => e.dataset.selected = String(e.dataset.row === id));
  const p = model.parts.find(p => p.id === id);
  $('#cs-selected-title').textContent = p ? p.label : 'Select a panel to see its dimensions';
  $('#cs-selected-detail').textContent = p ? `${fmt(p.length)} × ${fmt(p.width)} × ${p.thickness} mm · ${config.grain ? 'grain along length' : 'rotation allowed'}${p.edge ? ` · ${fmt(p.edge/1000)} m front edge` : ''}` : 'The 3D model, cut list, and sheet layouts share the same parts.';
  $('#cs-clear-selection').hidden = !p;
}
function setView(next) {
  view = next;
  $$('[data-view]').forEach(b => { const active = b.dataset.view === next; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; $('#cs-view-' + b.dataset.view).hidden = !active; });
}
function stopAssembly() {
  clearTimeout(animationTimer); assemblyStep = -1;
  $('#cs-assembly').setAttribute('aria-pressed','false'); $('#cs-assembly').innerHTML = '<span aria-hidden="true">▷</span> Assembly';
  $('#cs-stage-mode').textContent = explosion ? 'Exploded view' : 'Assembled view';
}
function toggleExplode() {
  stopAssembly(); explosion = explosion ? 0 : 1;
  $('#cs-explode').setAttribute('aria-pressed', String(!!explosion));
  $('#cs-stage-mode').textContent = explosion ? 'Exploded view' : 'Assembled view'; animate(visual, snapshotVisual());
}
function assembly() {
  if (assemblyStep >= 0) { stopAssembly(); animate(visual,snapshotVisual()); return; }
  explosion = 0; $('#cs-explode').setAttribute('aria-pressed','false');
  const steps = ['01 / Sides & bottom','02 / Top & dividers','03 / Place the shelves','04 / Overlay back & completed form'];
  $('#cs-assembly').setAttribute('aria-pressed','true'); $('#cs-assembly').innerHTML = '<span aria-hidden="true">Ⅱ</span> Stop';
  function advance() {
    assemblyStep++; if (assemblyStep > 3) { stopAssembly(); animate(visual,snapshotVisual()); return; }
    $('#cs-stage-mode').textContent = steps[assemblyStep];
    const from = visual; const target = snapshotVisual(); target.explosion = reduced.matches ? 0 : .1;
    animate(from, target); animationTimer = setTimeout(advance, reduced.matches ? 2200 : 1700);
  }
  advance();
}
function renderComparison() {
  const currentCost = model.cost;
  $('#cs-comparisons').innerHTML = comparisons.length ? comparisons.map((s, i) => {
    const m = buildCabinet(s.config), count = m.groups.reduce((n,g) => n+g.sheets.length,0), delta = m.cost-currentCost;
    return `<article class="cs-comparison"><h3>Option ${i+1} · ${escape(s.config.material)}</h3><p>${fmt(s.config.width)} × ${fmt(s.config.height)} × ${fmt(s.config.depth)} mm<br>${s.config.bays} bay(s) · ${s.config.shelves} shelves per bay · ${s.config.thickness} mm panels</p><div class="cs-comparison-stats"><div><strong>${money(m.cost)}</strong><span>${delta === 0 ? 'Same stock budget' : `${delta > 0 ? '+' : '−'}${money(Math.abs(delta))} vs current`}</span></div><div><strong>${count}</strong><span>full sheets</span></div><div><strong>${Math.round(m.utilization)}%</strong><span>utilization</span></div></div><button type="button" data-restore="${i}">Use this option ↗</button><button type="button" data-remove="${i}" aria-label="Delete comparison option ${i+1}">Remove</button></article>`;
  }).join('') : '<div class="cs-comparison-empty"><span aria-hidden="true">⧉</span><p>Good design takes a few tries.<br>Save up to three options, change your dimensions, and compare the stock budget.</p></div>';
  $('#cs-snapshot').disabled = !validInput || !model.valid || comparisons.length >= 3;
}
function download(name, contents, type) {
  if (lastDownloadUrl) URL.revokeObjectURL(lastDownloadUrl);
  const blob = new Blob([contents], { type }), url = URL.createObjectURL(blob), a = document.createElement('a');
  lastDownloadUrl = url; a.href = url; a.download = name; a.textContent = 'Download ' + name;
  notice(); $('#cs-notice').append('File ready. ', a); a.click();
}
function backup() { download('cabinet-studio-project.json', JSON.stringify({ version: 1, config, comparisons }, null, 2), 'application/json'); }
function validateProject(raw) {
  if (raw.version !== 1) throw Error('This project version is not supported.');
  const c = normalize(raw.config);
  if (!raw.config || typeof raw.config !== 'object') throw Error('Project settings are missing.');
  if (!Array.isArray(raw.comparisons) || raw.comparisons.length > 3) throw Error('Project must have at most three comparisons.');
  return { config: c, comparisons: raw.comparisons.map(s => { if (!s || !s.config || typeof s.config !== 'object') throw Error('Comparison settings are missing.'); const config = normalize(s.config); if (!buildCabinet(config).valid) throw Error('Saved comparison contains an incomplete design.'); return { config }; }) };
}
function exportDrawing() {
  // Export a settled assembled view, independently of the current animation or camera.
  const previous = visual, oldStep = assemblyStep; assemblyStep = -1;
  drawModel({ ...snapshotVisual(), angle: -28, explosion: 0 });
  const svg = $('#cs-model').cloneNode(true); svg.setAttribute('xmlns',ns);
  svg.setAttribute('viewBox','0 0 800 790'); svg.setAttribute('width','800'); svg.setAttribute('height','790'); svg.removeAttribute('id'); svg.setAttribute('role','img');
  svg.querySelector('#cs-dimensions').setAttribute('stroke', '#94a087');
  svg.querySelector('#cs-dimensions').setAttribute('fill', '#596950');
  svg.querySelector('#cs-dimensions').setAttribute('font-size', '11');
  svg.querySelector('#cs-dimensions').setAttribute('font-family', 'monospace');
  svg.querySelectorAll('#cs-dimensions text').forEach(e => e.setAttribute('stroke', 'none'));
  svg.querySelectorAll('[data-part]').forEach(e => { e.removeAttribute('tabindex'); e.removeAttribute('role'); e.removeAttribute('aria-pressed'); });
  const caption = svgElement('text',{ x:40,y:690,'font-family':'sans-serif','font-size':18,fill:'#23392f' }); caption.textContent = `Cabinet Studio · ${config.width} × ${config.height} × ${config.depth} mm`; svg.append(caption);
  const notes = [`${model.parts.length} panels · ${config.thickness} mm body${config.back ? ' + 6 mm overlay back' : ''} · ${config.bays} bay(s) · ${config.shelves} shelves per bay`, 'Butt-joint geometry. Verify loads, fixings, edging, joinery, and dimensions before cutting.'];
  notes.forEach((text,i) => { const t = svgElement('text',{x:40,y:723+i*26,'font-family':'sans-serif','font-size':12,fill:'#52634d'}); t.textContent=text;svg.append(t); });
  download('cabinet-studio-drawing.svg',new XMLSerializer().serializeToString(svg),'image/svg+xml');
  assemblyStep=oldStep; if (previous) drawModel(previous); selectPart(selected);
}
$('#cs-design-form').addEventListener('submit', e => e.preventDefault());
$('#cs-design-form').addEventListener('input', e => {
  const key = e.target.dataset.range || e.target.name;
  if (e.target.dataset.range) $(`#cs-design-form [name="${key}"]`).value = e.target.value;
  else { const range = $(`[data-range="${key}"]`); if (range) range.value = e.target.value; }
  if (draftPending) return; draftPending = true;
  requestAnimationFrame(() => {
    draftPending = false;
    try { update(readForm()); } catch (error) { validInput = false; setExportEnabled(false); notice(error.message + ' Preview shows the last valid design.', true); }
  });
});
$('#cs-brief-form').addEventListener('submit', e => {
  e.preventDefault();
  try { const parsed = parseBrief($('#cs-brief').value, config); update(parsed.config, { message: `Applied: ${parsed.recognized.join(', ')}. Review the dimensions and construction assumptions below.` }); $('.cs-stage').classList.remove('cs-celebrate'); requestAnimationFrame(() => $('.cs-stage').classList.add('cs-celebrate')); }
  catch (error) { notice(error.message,true); }
});
$$('[data-preset]').forEach(b => b.addEventListener('click', () => update({ ...config, ...PRESETS[b.dataset.preset] },{ preset:b.dataset.preset, message:'Starting design applied. Adjust the dimensions to your actual space.' })));
$$('[data-material]').forEach(b => b.addEventListener('click', () => update({ ...config, material: b.dataset.material })));
function applyFix(action) {
  const next = { ...config };
  if (action === 'fit') next.shelves = fitShelves(config);
  if (action === 'divide') next.bays = Math.min(3, config.bays+1);
  if (action === 'back') next.back = true;
  update(next,{ message:action === 'fit' ? `Set ${next.shelves} shelves per bay to meet your ${next.target} mm item target where possible. Review the updated clear opening.` : 'Suggestion applied. Review the updated model and sheet count.' });
}
$('#cs-fit').addEventListener('click',()=>applyFix('fit'));
$('#cs-insights').addEventListener('click',e=>{const b=e.target.closest('[data-fix]');if(b)applyFix(b.dataset.fix);});
$('.cs-canvas-column').addEventListener('click',e=>{const part=e.target.closest('[data-part]');if(part)selectPart(part.dataset.part);});
$('.cs-canvas-column').addEventListener('keydown',e=>{const part=e.target.closest('[data-part]');if(part && part.tagName.toLowerCase() !== 'button' && ['Enter',' '].includes(e.key)){e.preventDefault();selectPart(part.dataset.part);}});
$('#cs-clear-selection').addEventListener('click',()=>selectPart(null));
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$('.cs-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('[data-view]'),i=tabs.indexOf(document.activeElement);const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;setView(tabs[next].dataset.view);tabs[next].focus();});
$('#cs-explode').addEventListener('click',toggleExplode);$('#cs-assembly').addEventListener('click',assembly);
$('#cs-dimension-toggle').addEventListener('click',()=>{dimensions=!dimensions;$('#cs-dimension-toggle').setAttribute('aria-pressed',String(dimensions));if(visual)drawModel(visual);});
function orbit(next) { angle=Number(next);$('#cs-orbit').value=angle;stopAssembly();cancelAnimationFrame(animId);visual=snapshotVisual();drawModel(visual); }
$('#cs-orbit').addEventListener('input',e=>orbit(e.target.value));$('#cs-front').addEventListener('click',()=>orbit(0));$('#cs-perspective').addEventListener('click',()=>orbit(-28));
let pointer;
$('#cs-model').addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,angle,moved:false};});
$('#cs-model').addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.moved && Math.abs(dx)<6)return;if(!pointer.moved && Math.abs(dy)>Math.abs(dx)){pointer=null;return;}pointer.moved=true;$('#cs-model').setPointerCapture(e.pointerId);orbit(Math.max(-55,Math.min(55,pointer.angle+dx*.3)));});
$('#cs-model').addEventListener('pointerup',e=>{if(pointer?.moved){e.preventDefault();pointer.suppress=true;setTimeout(()=>pointer=null,0);}else pointer=null;});
$('#cs-model').addEventListener('pointercancel',()=>pointer=null);
$('#cs-model').addEventListener('click',e=>{if(pointer?.suppress){e.stopPropagation();e.preventDefault();}},true);
$('#cs-snapshot').addEventListener('click',()=>{if(comparisons.length>=3)return;comparisons.push({config:{...config}});renderComparison();scheduleSave();notice('Comparison saved. Change the current design to compare costs and material use.');});
$('#cs-comparisons').addEventListener('click',e=>{const restore=e.target.closest('[data-restore]'),remove=e.target.closest('[data-remove]');if(restore)update(comparisons[Number(restore.dataset.restore)].config,{message:'Saved option restored.'});if(remove){comparisons.splice(Number(remove.dataset.remove),1);renderComparison();scheduleSave();}});
$('#cs-export-csv').addEventListener('click',()=>download('cabinet-studio-cut-list.csv',csvCutList(model),'text/csv;charset=utf-8'));
$('#cs-export-svg').addEventListener('click',exportDrawing);
$('#cs-print').addEventListener('click',()=>{stopAssembly();cancelAnimationFrame(animId);explosion=0;$('#cs-explode').setAttribute('aria-pressed','false');visual=snapshotVisual();drawModel(visual);window.print();});
$('#cs-backup').addEventListener('click',backup);
$('#cs-import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try {if(file.size>100000)throw Error('Project file is too large. Use a Cabinet Studio JSON backup under 100 KB.');const project=validateProject(JSON.parse(await file.text()));comparisons=project.comparisons;update(project.config,{message:'Project imported, including saved comparisons.'});}
  catch(error){notice('Import failed: '+error.message,true);}finally{e.target.value='';}
});
$('#cs-share').addEventListener('click',async()=>{
  const hash=new URLSearchParams(Object.entries(config).map(([k,v])=>[k,String(v)])).toString(), url=location.origin+location.pathname+'#'+hash;
  try {await navigator.clipboard.writeText(url);notice('Design link copied. It contains design settings; saved comparisons stay in this browser.');}
  catch {const input=document.createElement('input');input.value=url;input.setAttribute('aria-label','Design link to copy');$('#cs-notice').replaceChildren(input);input.style.width='100%';input.select();}
});
$('#cs-mobile-preview').addEventListener('click',()=>{setView('model');$('#cs-view-model').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});});
$('#cs-reset').addEventListener('click',()=>{update({...DEFAULTS},{preset:'bookcase',message:'Current design reset. Saved comparisons are available below.'});});
function readSharedDesign() {
  const params=new URLSearchParams(location.hash.slice(1));if(!params.size)return null;
  const raw={};for(const[k,v]of params){if(['back','grain'].includes(k)){if(!['true','false'].includes(v))throw Error('Invalid switch in design link.');raw[k]=v==='true';}else if(k==='material')raw[k]=v;else if(k in DEFAULTS)raw[k]=Number(v);}
  return Object.keys(raw).length?normalize(raw):null;
}
let initialMessage='';
try {const saved=localStorage.getItem(storageKey);if(saved){const project=validateProject(JSON.parse(saved));config=project.config;comparisons=project.comparisons;activePreset='';initialMessage='Your last design is back. Continue where you left off.';}}
catch {storageAvailable=false;initialMessage='Local project could not be restored. The starting design is ready; you can import a backup.';}
try {const shared=readSharedDesign();if(shared){config=shared;activePreset='';initialMessage='Shared design loaded. Review its dimensions and stock settings.';}}
catch(error){initialMessage='Could not load the design link: '+error.message;}
update(config,{preset:activePreset,message:initialMessage,immediate:true});
window.addEventListener('hashchange',()=>{try{const shared=readSharedDesign();if(shared)update(shared,{message:'Shared design loaded.'});}catch(error){notice(error.message,true);}});
window.addEventListener('pagehide',()=>{clearTimeout(saveTimer);try{localStorage.setItem(storageKey,JSON.stringify({version:1,config,comparisons}));}catch{}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAssembly();cancelAnimationFrame(animId);}else if(model){visual=snapshotVisual();drawModel(visual);}});
reduced.addEventListener('change',()=>{cancelAnimationFrame(animId);if(model){visual=snapshotVisual();drawModel(visual);}});
