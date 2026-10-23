export const STORAGE_KEY = 'wct.drawer-fit.v1';
export const CHECKS = [
  ['hardware','Exact slide model, drawing and allowed side-space range checked'],
  ['planes','Mounting planes, obstructions and depth checked on the cabinet'],
  ['trial','One assembled drawer tested through full travel'],
  ['fronts','Finished front gaps and handle/door clearance checked in place']
];
export const FIELDS = [
  ['widthFront','Mounting width · front',50,2500,500],['widthMiddle','Mounting width · middle',50,2500,500],['widthRear','Mounting width · rear',50,2500,500],
  ['openingHeight','Clear stack height',50,3000,600],['depth','Usable cabinet depth',50,2000,560],['rail','Rail between equal bays',0,100,0],
  ['sideMin','Minimum side space',0.1,100,12.7],['sideMax','Maximum side space',0.1,100,13.5],['sideTarget','Target side space',0.1,100,13],
  ['setback','Box-front setback',0,200,10],['rearReserve','Required rear reserve',0,200,10],['length','Outside box length',20,1800,500],
  ['boxHeight','Total outside box height',10,800,150],['wall','Actual wall thickness',1,60,12],['bottom','Applied bottom thickness',1,40,6],
  ['below','Clearance below each box',0,100,8],['above','Clearance above each box',0,100,12],
  ['frontWidth','Front envelope width',30,3000,536],['frontHeight','Front envelope height',30,3500,636],
  ['gapLeft','Left edge gap',0,50,2],['gapRight','Right edge gap',0,50,2],['gapTop','Top edge gap',0,50,2],['gapBottom','Bottom edge gap',0,50,2],['gapBetween','Gap between fronts',0,50,2],['frontThickness','Front thickness',1,60,18]
];
export const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt = value => Number(value.toFixed(3)).toString();
export function sampleProject(){return {version:1,name:'Three-drawer workshop cabinet',revision:'A',hardware:'Illustrative side-mount setup — replace with your model',notes:'Applied plywood bottom; butt-jointed box. Dimensions are finished sizes.',count:3,...Object.fromEntries(FIELDS.map(([k,,, ,v])=>[k,v])),checks:Object.fromEntries(CHECKS.map(([k])=>[k,false]))};}
export function parseProject(input){
  if(!input || typeof input!=='object' || input.version!==1)throw Error('Use a Drawer Fit version 1 project JSON.');
  const p={version:1};
  for(const k of ['name','revision','hardware','notes']) {if(typeof input[k]!=='string' || input[k].length>(k==='notes'?2000:160))throw Error('Invalid '+k+' text.');p[k]=input[k];}
  for(const [k,,min,max] of FIELDS){if(typeof input[k]!=='number'||!Number.isFinite(input[k])||input[k]<min||input[k]>max)throw Error('Invalid '+k+' dimension.');p[k]=input[k];}
  if(!Number.isInteger(input.count)||input.count<1||input.count>12)throw Error('Use 1 to 12 whole drawers.');p.count=input.count;
  p.checks=Object.fromEntries(CHECKS.map(([k])=>[k,input.checks?.[k]===true]));return p;
}
export function calculate(input){
  let p;try{p=parseProject(input);}catch(e){return {ok:false,errors:[e.message]};}
  const errors=[], warnings=[], eps=1e-7;
  const widths=[p.widthFront,p.widthMiddle,p.widthRear], minWidth=Math.min(...widths),maxWidth=Math.max(...widths);
  const widthLow=maxWidth-2*p.sideMax, widthHigh=minWidth-2*p.sideMin, boxWidth=minWidth-2*p.sideTarget;
  if(p.sideMin>p.sideMax)errors.push('Minimum side space exceeds maximum side space.');
  if(p.sideTarget<p.sideMin||p.sideTarget>p.sideMax)errors.push('Target side space must lie inside the entered range.');
  if(widthLow>widthHigh+eps)errors.push('No common box width fits all three mounting widths. Correct the mounting planes first.');
  const spaces=widths.map(w=>(w-boxWidth)/2);
  if(spaces.some(s=>s<p.sideMin-eps||s>p.sideMax+eps))errors.push('The target box width exceeds the entered side-space range at one or more stations.');
  const innerWidth=boxWidth-2*p.wall, wallHeight=p.boxHeight-p.bottom;
  if(innerWidth<=0||p.length<=2*p.wall||wallHeight<=0)errors.push('Wall or bottom thickness leaves no usable box interior.');
  const rearRemaining=p.depth-p.setback-p.length;
  if(rearRemaining<p.rearReserve-eps)errors.push('Box length and setback leave less than the required rear reserve.');
  const bayHeight=(p.openingHeight-(p.count-1)*p.rail)/p.count, verticalReserve=bayHeight-p.boxHeight-p.below-p.above;
  if(verticalReserve<-eps)errors.push('The equal bay height cannot contain the box and entered vertical clearances.');
  const frontWidth=p.frontWidth-p.gapLeft-p.gapRight, frontHeight=(p.frontHeight-p.gapTop-p.gapBottom-(p.count-1)*p.gapBetween)/p.count;
  if(frontWidth<=0||frontHeight<=0)errors.push('Front gaps consume the whole front envelope.');
  if(maxWidth-minWidth>eps)warnings.push('Widths differ. The diagram assumes a centered box; verify each left and right gap and straight mounting planes physically.');
  if(boxWidth>p.length)warnings.push('Box width exceeds box length. Check the slide model’s permitted drawer proportions.');
  const parts=[
    {part:'Box sides',qty:2*p.count,length:p.length,width:wallHeight,thickness:p.wall},
    {part:'Box front / back',qty:2*p.count,length:innerWidth,width:wallHeight,thickness:p.wall},
    {part:'Applied bottom',qty:p.count,length:p.length,width:boxWidth,thickness:p.bottom},
    {part:'Decorative front',qty:p.count,length:frontHeight,width:frontWidth,thickness:p.frontThickness}
  ];
  const fronts=Array.from({length:p.count},(_,i)=>({number:i+1,top:p.gapTop+i*(frontHeight+p.gapBetween),height:frontHeight,width:frontWidth}));
  return {ok:errors.length===0,errors,warnings,minWidth,maxWidth,widthLow,widthHigh,boxWidth,spaces,innerWidth,wallHeight,rearRemaining,bayHeight,verticalReserve,frontWidth,frontHeight,parts,fronts,evidence:CHECKS.filter(([k])=>p.checks[k]).length};
}
const csvCell=value=>{let s=String(value);if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
export function exportCSV(p){const r=calculate(p);if(!r.ok)throw Error('Resolve geometry errors before exporting parts.');const rows=[['Project','Revision','Hardware record','Part','Quantity','Length mm','Width mm','Thickness mm','Physical checks','Construction'],...r.parts.map(x=>[p.name,p.revision,p.hardware,x.part,x.qty,fmt(x.length),fmt(x.width),fmt(x.thickness),r.evidence+'/4','Finished sizes; butt joints; applied bottom; no kerf allowance'])];return rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';}
export function renderSVG(p,view='plan'){
 const r=calculate(p);if(!r.ok)return '';
 const front=view==='front', w=front?p.frontWidth:r.maxWidth, h=front?p.frontHeight:p.depth;
 const scale=Math.min(430/w,330/h), ox=75,oy=55;
 const rect=(x,y,rw,rh,fill,stroke='#245c54')=>`<rect x="${ox+x*scale}" y="${oy+y*scale}" width="${rw*scale}" height="${rh*scale}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`;
 const label=(x,y,t)=>`<text x="${x}" y="${y}" fill="#245c54" font-size="12" text-anchor="middle">${esc(t)}</text>`;
 const shapes=front?r.fronts.map(f=>rect(p.gapLeft,f.top,f.width,f.height,'#dfc49a')+label(ox+w*scale/2,oy+(f.top+f.height/2)*scale,`${f.number} · ${fmt(f.width)} × ${fmt(f.height)} mm`)).join(''):
 rect((r.maxWidth-r.boxWidth)/2,p.setback,r.boxWidth,p.length,'#dfc49a')+rect((r.maxWidth-r.boxWidth)/2+p.wall,p.setback+p.wall,r.innerWidth,p.length-2*p.wall,'#faf7f0')+label(ox+w*scale/2,oy+p.depth*scale/2,`BOX ${fmt(r.boxWidth)} × ${fmt(p.length)}`);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 455" role="img" aria-labelledby="df-map-title"><title id="df-map-title">${esc(p.name)} — ${front?'decorative fronts, measured down from envelope top':'schematic plan at widest mounting station'}</title><rect width="580" height="455" fill="#f7f4ec"/>${rect(0,0,w,h,'#e5ebe4')}${shapes}${label(ox+w*scale/2,30,`${front?'FRONT ENVELOPE':'WIDEST MOUNTING WIDTH'} · ${fmt(w)} mm`)}${label(290,420,front?`TOP → BOTTOM · ${fmt(p.gapBetween)} mm BETWEEN FRONTS`:`FRONT ↓ · rear space ${fmt(r.rearRemaining)} mm`)}${label(290,443,'SCHEMATIC · NOT A DRILLING OR FULL-SIZE TEMPLATE')}</svg>`;
}
