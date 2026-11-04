export const STORAGE_KEY = 'wct-door-installation-v1';
export const CHECKS = [['spec', 'Exact hinge, plate and quantity checked against product data'], ['coupon', 'Drilling setup proved on matching material'], ['swing', 'Installed door tested through its complete travel']];
export const SOURCES = [
  ['Blum: hinge quantity and door weight', 'https://ea.blum.com/en/number-of-hinges/'],
  ['Blum: standard hinge planning, gaps and drilling references', 'https://publications.blum.com/2026/catalogue/en/71/']
];
export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const blankDoor = (id = 'D1') => ({id, width:446, height:716, thickness:19, hand:'left', count:2, top:100, bottom:100, custom:[], zones:[], gaps:[null,null,null,null], checks:{spec:false,coupon:false,swing:false}});
export const sampleProject = () => ({version:1, name:'Utility cabinet · installation', revision:'A', unit:'mm', hardware:'Illustrative geometry — select actual hinge + plate', diameter:35, edge:5, penetration:13, reserve:3, target:2, tolerance:0.5, notes:'All example dimensions are illustrative, not hardware specifications.', doors:[blankDoor('D1'), {...blankDoor('D2'), hand:'right'}]});
const fail = message => { throw new Error(message); };
function number(value, name, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(`${name} must be ${min}–${max}.`);
  return value;
}
function text(value, name, max) {
  if (typeof value !== 'string' || value.length > max) fail(`${name} must be text up to ${max} characters.`);
  return value;
}
// Normalize a whitelist so imported properties never become DOM or project state.
export function validateProject(p) {
  if (!p || p.version !== 1 || !Array.isArray(p.doors) || p.doors.length < 1 || p.doors.length > 30) fail('Use a version 1 project with 1–30 doors.');
  if (!['mm','in'].includes(p.unit)) fail('Choose mm or in.');
  const result = {version:1, name:text(p.name,'Project name',100), revision:text(p.revision,'Revision',40), unit:p.unit, hardware:text(p.hardware,'Hardware reference',240), notes:text(p.notes,'Notes',3000)};
  for (const [key,min,max] of [['diameter',1,60],['edge',0,50],['penetration',0.1,50],['reserve',0,25],['target',0,25],['tolerance',0,10]]) result[key] = number(p[key],key,min,max);
  const ids = new Set();
  result.doors = p.doors.map(d => {
    if (!d || typeof d !== 'object') fail('Invalid door record.');
    const id = text(d.id,'Door ID',40).trim();
    if (!id || ids.has(id)) fail('Every door needs a unique, nonempty ID.');
    ids.add(id);
    const door = {id};
    for (const [key,min,max] of [['width',10,2000],['height',30,3500],['thickness',1,80],['count',2,8],['top',0,3500],['bottom',0,3500]]) door[key] = number(d[key],`${id} ${key}`,min,max);
    if (!Number.isInteger(door.count)) fail(`${id}: hinge count must be a whole number.`);
    if (!['left','right'].includes(d.hand)) fail(`${id}: choose left or right.`);
    door.hand = d.hand;
    if (!Array.isArray(d.custom) || d.custom.length > 8 || (d.custom.length === 1)) fail(`${id}: enter 2–8 custom centers, or leave the list empty.`);
    door.custom = d.custom.map(y => number(y,`${id} custom center`,0,3500));
    if (!Array.isArray(d.zones) || d.zones.length > 12) fail(`${id}: use up to 12 keep-out bands.`);
    door.zones = d.zones.map(z => {
      const from=number(z?.from,`${id} band start`,0,door.height), to=number(z?.to,`${id} band end`,0,door.height);
      if (from >= to) fail(`${id}: each band start must be below its end.`);
      return {from,to};
    });
    if (!Array.isArray(d.gaps) || d.gaps.length !== 4) fail(`${id}: four gap observations are required (unmeasured values may be null).`);
    door.gaps = d.gaps.map(g => g === null ? null : number(g,`${id} measured gap`,0,50));
    door.checks = Object.fromEntries(CHECKS.map(([key]) => {
      if (typeof d.checks?.[key] !== 'boolean') fail(`${id}: invalid evidence record.`);
      return [key,d.checks[key]];
    }));
    return door;
  });
  return result;
}
export function calculate(project) {
  const p=validateProject(project), r=p.diameter/2;
  const doors=p.doors.map(d=>{
    const issues=[];
    const centers = d.custom.length ? [...d.custom].sort((a,b)=>a-b) : Array.from({length:d.count},(_,i)=>d.top+i*(d.height-d.bottom-d.top)/(d.count-1));
    const x=d.hand==='left' ? p.edge+r : d.width-p.edge-r;
    const skin=d.thickness-p.penetration;
    if (d.height-d.bottom <= d.top && !d.custom.length) issues.push('Top and bottom center references must leave a positive span.');
    if (x-r < -1e-8 || x+r > d.width+1e-8) issues.push('Cup circle crosses a side edge.');
    if (skin < p.reserve-1e-8) issues.push('Maximum tip penetration leaves less than the entered skin reserve.');
    const holes=centers.map((y,i)=>{
      const blocked = d.zones.some(z=>y+r >= z.from-1e-8 && y-r <= z.to+1e-8);
      if (y-r < -1e-8 || y+r > d.height+1e-8) issues.push(`Cup ${i+1} crosses a top or bottom edge.`);
      if (blocked) issues.push(`Cup ${i+1} touches an entered keep-out band.`);
      if (i && y-centers[i-1] <= p.diameter+1e-8) issues.push(`Cups ${i} and ${i+1} overlap or touch.`);
      return {index:i+1,x,y,blocked};
    });
    const observations=d.gaps.map(g=>g===null ? null : {value:g,delta:g-p.target,within:Math.abs(g-p.target)<=p.tolerance+1e-8});
    const measured=observations.filter(Boolean).length, outside=observations.filter(g=>g&&!g.within).length;
    return {...d,holes,skin,issues,observations,measured,outside,evidence:CHECKS.filter(([k])=>d.checks[k]).length};
  });
  return {doors,holes:doors.reduce((n,d)=>n+d.holes.length,0),issues:doors.flatMap(d=>d.issues.map(issue=>`${d.id}: ${issue}`)),measured:doors.reduce((n,d)=>n+d.measured,0),outside:doors.reduce((n,d)=>n+d.outside,0)};
}
export function clearEvidence(d) { return {...d,gaps:[null,null,null,null],checks:{spec:false,coupon:false,swing:false}}; }
export function importProject(value) { const p=validateProject(value);return {...p,doors:p.doors.map(clearEvidence)}; }
const csvCell = value => '"'+String(value).replace(/^[=+\-@\t\r]/,"'$&").replaceAll('"','""')+'"';
export function exportCSV(p) {
  const result=calculate(p);
  if (result.issues.length) fail('Resolve geometry conflicts before exporting the drilling register.');
  const rows=[['Project','Revision','Door','Hand viewed from BACK','Width mm','Height mm','Thickness mm','Cup','X from LEFT back-face mm','Y DOWN from TOP mm','Cup diameter mm','Maximum tip penetration mm','Skin mm','Hardware reference','Measured gaps L/T/R/B mm','Target mm','Tolerance mm','Evidence recorded /3','Status']];
  for (const d of result.doors) for (const h of d.holes) rows.push([p.name,p.revision,d.id,d.hand,d.width,d.height,d.thickness,h.index,h.x,h.y,p.diameter,p.penetration,d.skin,p.hardware,d.gaps.map(g=>g??'unmeasured').join('/'),p.target,p.tolerance,d.evidence,'Reference geometry; physical release required']);
  return rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
export function renderSVG(p, id=p.doors[0].id) {
  const result=calculate(p),d=result.doors.find(door=>door.id===id);
  if (!d) fail('Choose a door from the schedule.');
  const pad=65,w=d.width+pad*2,h=d.height+pad*2, x=pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="di-title"><title id="di-title">${esc(d.id)} — revision ${esc(p.revision)} — BACK face, top up; reference geometry</title><rect width="${w}" height="${h}" fill="#f4f0e7"/><text x="${pad}" y="27" font-family="sans-serif" font-size="14" fill="#233d38">${esc(d.id)} · BACK FACE · TOP ↑ · ${d.width} × ${d.height} mm</text><text x="${pad}" y="47" font-family="sans-serif" font-size="10" fill="#233d38">Rev ${esc(p.revision.slice(0,40))} · cup Ø${p.diameter} · tip ${p.penetration} mm · physical review required</text><rect x="${x}" y="${pad}" width="${d.width}" height="${d.height}" fill="#e0c8a3" stroke="#596c5e" stroke-width="1"/>${d.zones.map(z=>`<rect x="${x}" y="${pad+z.from}" width="${d.width}" height="${z.to-z.from}" fill="#b94e36" opacity=".3"/>`).join('')}${d.holes.map(c=>`<circle cx="${x+c.x}" cy="${pad+c.y}" r="${p.diameter/2}" fill="${c.blocked?'#b94e36':'#285c50'}"/><path d="M${x+c.x-8} ${pad+c.y}h16m-8 -8v16" stroke="white" stroke-width=".8"/><text x="${d.hand==='left'?x+c.x+26:x+c.x-26}" y="${pad+c.y+5}" text-anchor="${d.hand==='left'?'start':'end'}" font-family="sans-serif" font-size="${Math.max(13,w/34,h/34)}">${c.index}: Y ${Number(c.y.toFixed(3))}</text>`).join('')}<text x="${pad}" y="${h-30}" font-family="sans-serif" font-size="12">X from LEFT / Y DOWN from TOP · mm · ${result.issues.length?'CONFLICT — REVIEW':'REFERENCE ONLY'}</text><path d="M${pad} ${h-15}h100m-100 -4v8m100 -8v8" stroke="#233d38"/><text x="${pad+110}" y="${h-11}" font-family="sans-serif" font-size="10">100 mm scale check · no fixing-hole pattern</text></svg>`;
}
