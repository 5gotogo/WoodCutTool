export const STORAGE_KEY = 'wct-joinery-lab-v1';
export const REVIEWED = '2026-10-18';
export const SOURCES = [
  { title: 'USDA Forest Products Laboratory — Wood Handbook, Chapter 10: adhesive bonding', url: 'https://research.fs.usda.gov/treesearch/62250', scope: 'General bonding context; it does not prescribe the dimensions in these examples.' },
  { title: 'Titebond — woodworking glue FAQs', url: 'https://www.titebond.com/resources/use/glues/faqs', scope: 'Product-specific surface preparation and curing guidance. Read the selected adhesive label.' },
  { title: 'Dowelmax — wood joint configurations', url: 'https://www.dowelmax.com/wood-joints-for-furniture/', scope: 'Manufacturer reference-face and jig-configuration examples, not a universal drilling specification.' },
  { title: 'Leigh — F1 Finger Joint User Guide', url: 'https://www.leightools.com/wp-content/uploads/2018/09/F1-User-Guide-Complete.pdf', scope: 'Manufacturer-specific setup and scrap fit tests; our interval map is independent of that jig.' }
];
// key, label, minimum, maximum, default, count (otherwise a length in mm)
export const JOINTS = [
  { id:'dado', name:'Dado & groove', slug:'dado-groove-planner', tag:'01 / HOUSED PARTS', description:'Locate a housing from a marked edge using measured stock and an explicit total fit allowance.', fields:[['host','Host thickness',1,150,18],['mate','Mating part thickness',0.5,150,17.8],['fit','Total width allowance',0,3,0.15],['depth','Housing depth',0.1,149,6],['start','Near wall from datum',0,2500,40],['width','Host width along layout',1,3000,300]], formula:'Housing width = measured mating thickness + total width allowance. Far wall = near wall + housing width. Remaining floor = host thickness − depth.', boundary:'One straight, through housing. Stopped ends, tool radius, cutter travel, structural sizing and cross-grain movement need a separate review.' },
  { id:'rabbet', name:'Rabbet / rebate', slug:'rabbet-rebate-planner', tag:'02 / EDGE SEATS', description:'Resolve the shoulder, seat width and remaining lip of an open edge recess.', fields:[['host','Host thickness',1,150,18],['mate','Mating edge thickness',0.5,150,6],['fit','Total seat allowance',0,3,0.15],['depth','Recess depth',0.1,149,9],['width','Host width along layout',1,3000,180]], formula:'Seat width = mating edge thickness + total allowance. Shoulder = host width − seat width. Remaining lip = host thickness − recess depth.', boundary:'A single open edge recess, viewed in section. A fitted back or panel still needs its own movement, fixing and assembly decisions.' },
  { id:'half-lap', name:'Half-lap', slug:'half-lap-planner', tag:'03 / CROSSING MEMBERS', description:'Balance two recesses to an entered finished stack thickness, including unequal stock.', fields:[['a','Member A thickness',1,150,18],['b','Member B thickness',1,150,18],['wa','Member A width',1,500,40],['wb','Member B width',1,500,50],['stack','Finished stack thickness',1,299,18],['da','Recess depth in A',0.1,149,9],['fit','Total notch-width allowance',0,3,0.15]], formula:'Depth B = thickness A + thickness B − finished stack − depth A. Notch A = width B + allowance; notch B = width A + allowance.', boundary:'Two rectangular members crossing at 90°. This balances the stack; it does not select a load-bearing lap, joint location or fastener.' },
  { id:'mortise-tenon', name:'Mortise & tenon', slug:'mortise-tenon-planner', tag:'04 / SHOULDERS & CHEEKS', description:'Review a centered rectangular tenon, its four shoulders and a blind receiving pocket.', fields:[['host','Receiving thickness',1,200,24],['hostWidth','Receiving width',1,300,70],['hostDepth','Available pocket depth',1,300,40],['rail','Rail thickness',1,200,22],['railWidth','Rail width',1,300,60],['tenon','Tenon thickness',0.5,150,8],['tenonWidth','Tenon width',0.5,250,36],['length','Tenon length',0.5,200,25],['depth','Mortise depth',0.5,250,27],['fit','Total allowance on each axis',0,3,0.1]], formula:'Mortise section = tenon section + total allowance on each axis. Cheek shoulder = (rail thickness − tenon thickness) ÷ 2. End reserve = mortise depth − tenon length.', boundary:'One centered, straight, rectangular tenon with square shoulders. Round-ended mortises require compatible tenon ends; haunches, offsets and structural design are outside this model.' },
  { id:'dowel', name:'Dowel row', slug:'dowel-row-planner', tag:'05 / MATCHED BORE CENTERS', description:'Place an equally spaced row on two identical faces and separate usable bore depth from tip penetration.', fields:[['length','Face length',1,2500,300],['width','Face width',1,500,60],['host','Thickness of each part',1,150,18],['diameter','Hole / dowel diameter',0.5,40,8],['count','Holes on each face',2,40,4,true],['end','First and last center inset',0,1000,30],['offset','Row center from marked side',0,500,30],['bore','Full-diameter bore depth',0.1,149,12],['tip','Extra point penetration',0,30,2],['dowelLength','Dowel length',0.5,250,22]], formula:'Pitch = (face length − 2 × center inset) ÷ (count − 1). Center i = inset + i × pitch. Outer skin = thickness − full bore depth − extra tip. Pair reserve = 2 × full bore depth − dowel length.', boundary:'One row on two identical, opposing faces. Coordinates start at each face’s corresponding marked datum. This is not an edge-to-face jig setup or a dowel capacity calculation.' },
  { id:'box', name:'Box / finger joint', slug:'box-joint-planner', tag:'06 / COMPLEMENTARY INTERVALS', description:'Map alternating tabs and sockets, expose a partial end interval and compare two stock thicknesses.', fields:[['width','Joint span',1,1500,120],['finger','Nominal interval width',0.5,100,10],['a','Panel A thickness',1,100,12],['b','Panel B thickness',1,100,12.1],['proud','Extra cut depth for trimming',0,3,0.2]], formula:'Intervals divide the span at multiples of the entered width; a final remainder is retained. Panel A keeps even-index intervals; panel B keeps odd-index intervals. Cut depth A = thickness B + extra depth, and vice versa.', boundary:'A nominal complementary boundary map. It does not calculate cutter kerf, jig indexing, fit compensation or a machining sequence. Prove the actual cutting system on a pair of scraps.' }
];
export const EVIDENCE = [
  'The reference faces and actual stock match this record.',
  'A matching-material test pair seats fully without forced assembly.',
  'The complete dry assembly and chosen adhesive process have been reviewed.'
];
export const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt = n => Number(n.toFixed(4)).toLocaleString('en-US',{maximumFractionDigits:4});
export const jointById = id => JOINTS.find(j=>j.id===id);
export function sampleProject() {
  return {version:1,name:'Workshop joinery study',revision:'A',unit:'mm',notes:'',values:Object.fromEntries(JOINTS.map(j=>[j.id,Object.fromEntries(j.fields.map(f=>[f[0],f[4]]))])),evidence:Object.fromEntries(JOINTS.map(j=>[j.id,EVIDENCE.map(()=>false)]))};
}
export function normalizeProject(input) {
  if (!input || typeof input!=='object' || Array.isArray(input) || input.version!==1) throw Error('Choose a Joinery Lab version 1 project.');
  const p=sampleProject();
  for (const [key,max] of [['name',100],['revision',40],['notes',4000]]) {
    if (typeof input[key]!=='string' || input[key].length>max) throw Error('Invalid '+key+' in project.');
    p[key]=input[key];
  }
  if (!['mm','in'].includes(input.unit)) throw Error('Unknown display unit.');
  p.unit=input.unit;
  for (const j of JOINTS) {
    if (!input.values?.[j.id] || !Array.isArray(input.evidence?.[j.id]) || input.evidence[j.id].length!==EVIDENCE.length) throw Error('Missing '+j.name+' record.');
    for (const [key,,min,max,,count] of j.fields) {
      const v=input.values[j.id][key];
      if (typeof v!=='number' || !Number.isFinite(v) || v<min || v>max || (count && !Number.isInteger(v))) throw Error('Invalid '+key+' in '+j.name+'.');
      p.values[j.id][key]=v;
    }
    if (!input.evidence[j.id].every(v=>typeof v==='boolean')) throw Error('Invalid physical observations.');
    p.evidence[j.id]=[...input.evidence[j.id]];
  }
  return p;
}
export function calculate(id, values) {
  const j=jointById(id); if (!j) throw Error('Unknown joint.');
  const errors=[],warnings=[],rows=[],metrics=[];
  for (const [key,label,min,max,,count] of j.fields) {
    const v=values?.[key];
    if (typeof v!=='number' || !Number.isFinite(v) || v<min || v>max || (count && !Number.isInteger(v))) errors.push(`${label}: enter ${count?'a whole number':'a number'} from ${min} to ${max}${count?'':' mm'}.`);
  }
  const add=(label,value,unit='mm')=>rows.push({label,value,unit});
  const metric=(label,value,unit='mm')=>metrics.push({label,value,unit});
  if (errors.length) return {id,ok:false,errors,warnings,rows,metrics};
  const v=values;
  if (id==='dado' || id==='rabbet') {
    const seat=v.mate+v.fit, skin=v.host-v.depth;
    if (skin<=0) errors.push('The recess must leave a positive thickness of host material.');
    if (id==='dado' && v.start+seat>v.width) errors.push('The far housing wall extends beyond the host width.');
    if (id==='rabbet' && seat>=v.width) errors.push('The seat must be narrower than the host.');
    metric(id==='dado'?'Housing width':'Seat width',seat);metric('Remaining '+(id==='dado'?'floor':'lip'),skin);metric(id==='dado'?'Far wall from datum':'Shoulder from datum',id==='dado'?v.start+seat:v.width-seat);
    add('Near wall from datum',id==='dado'?v.start:v.width-seat);add('Far wall from datum',id==='dado'?v.start+seat:v.width);add('Recess width',seat);add('Recess depth',v.depth);add('Remaining material',skin);add('Total width allowance',v.fit);
    if (v.depth>v.host/2) warnings.push('The recess removes more than half the host thickness. Review the design and coupon; a positive remainder is only a geometry check.');
    if (v.fit===0) warnings.push('Zero modeled clearance requires a physical fit trial; tool size and stock variation remain unmeasured.');
  } else if (id==='half-lap') {
    const db=v.a+v.b-v.stack-v.da;
    if (v.da>=v.a || db<=0 || db>=v.b) errors.push('Both recesses must remove some material and leave some material. Change the stack thickness or depth A.');
    metric('Required recess B',db);metric('Notch width A',v.wb+v.fit);metric('Notch width B',v.wa+v.fit);
    for (const [label,n] of [['Recess depth A',v.da],['Recess depth B',db],['Remaining A',v.a-v.da],['Remaining B',v.b-db],['Finished stack',v.stack],['Notch width A',v.wb+v.fit],['Notch width B',v.wa+v.fit]]) add(label,n);
    if (v.a!==v.b) warnings.push('Unequal stock can meet the entered stack while exterior faces remain offset. Review the assembled face datums.');
  } else if (id==='mortise-tenon') {
    const mt=v.tenon+v.fit,mw=v.tenonWidth+v.fit;
    if (v.tenon>=v.rail || v.tenonWidth>=v.railWidth) errors.push('The modeled tenon must leave positive shoulders on all four sides of the rail.');
    if (mt>=v.host || mw>=v.hostWidth) errors.push('The centered mortise must leave material on both sides of each receiving axis.');
    if (v.depth<v.length) errors.push('The mortise is shallower than the tenon length.');
    if (v.depth>=v.hostDepth) errors.push('The blind mortise must be shallower than the available receiving depth.');
    metric('Mortise thickness',mt);metric('Cheek shoulder', (v.rail-v.tenon)/2);metric('End reserve',v.depth-v.length);
    for (const [label,n] of [['Mortise thickness',mt],['Mortise width',mw],['Rail cheek shoulder each',(v.rail-v.tenon)/2],['Rail edge shoulder each',(v.railWidth-v.tenonWidth)/2],['Receiving side wall each',(v.host-mt)/2],['Receiving end wall each',(v.hostWidth-mw)/2],['Tenon length',v.length],['Mortise depth',v.depth],['End reserve',v.depth-v.length],['Blind back wall',v.hostDepth-v.depth]]) add(label,n);
    if (v.depth===v.length) warnings.push('The modeled end reserve is zero. Verify seating, debris clearance and your adhesive process on a coupon.');
    warnings.push('A rounded router mortise and a square-ended tenon need a separate corner treatment; this rectangular model does not resolve that fit.');
  } else if (id==='dowel') {
    const pitch=(v.length-2*v.end)/(v.count-1),skin=v.host-v.bore-v.tip,reserve=2*v.bore-v.dowelLength;
    if (v.end<v.diameter/2 || v.length-2*v.end<=0) errors.push('The first and last full hole circles must fit inside opposite ends.');
    if (pitch<=v.diameter) errors.push('Neighboring hole circles touch or overlap. Increase the spacing or reduce the count.');
    if (v.offset-v.diameter/2<0 || v.offset+v.diameter/2>v.width) errors.push('The full row of hole circles must lie within the face width.');
    if (skin<=0) errors.push('The deepest point would reach or cross the outer face.');
    if (reserve<0) errors.push('The dowel is longer than the pair of full-diameter bores.');
    metric('Center pitch',pitch);metric('Outer skin at tip',skin);metric('Pair end reserve',reserve);
    add('Row offset from marked side',v.offset);add('Hole diameter',v.diameter);add('Full-diameter depth per part',v.bore);add('Maximum tip penetration',v.bore+v.tip);add('Remaining outer skin',skin);add('Pair end reserve',reserve);
    for(let i=0;i<v.count;i++)add('Hole '+(i+1)+' center from end',v.end+i*pitch);
    if (reserve===0) warnings.push('No modeled length reserve remains. Check actual dowels, full bore depth and seating on a test pair.');
  } else if (id==='box') {
    if (v.finger>v.width) errors.push('The interval width must not exceed the joint span.');
    const quotient=v.width/v.finger, rounded=Math.round(quotient), count=Math.abs(quotient-rounded)<1e-9?rounded:Math.ceil(quotient);
    if(count<2 || count>120) errors.push('Use between 2 and 120 complementary intervals.');
    if(!errors.length) {
      const last=v.width-(count-1)*v.finger;
      metric('Intervals',count,'count');metric('Final interval',last);metric('Cut depth A',v.b+v.proud);
      add('Cut depth A',v.b+v.proud);add('Cut depth B',v.a+v.proud);add('Nominal interval',v.finger);add('Final interval width',last);
      for(let i=0;i<count;i++)rows.push({label:`Interval ${i+1}: A ${i%2?'socket':'tab'} / B ${i%2?'tab':'socket'}`,value:i*v.finger,end:Math.min(v.width,(i+1)*v.finger),unit:'mm'});
      if(Math.abs(last-v.finger)>1e-7) warnings.push(`The last interval is partial (${fmt(last)} mm). Review both end patterns and the actual jig; the planner does not resize the board.`);
      warnings.push('These are nominal boundaries. Fit compensation and cutter width must be established with the cutting system’s own method and a scrap pair.');
    }
  }
  return {id,ok:!errors.length,errors,warnings,rows:errors.length?[]:rows,metrics:errors.length?[]:metrics};
}
export function exportCSV(project,id) {
  const r=calculate(id,project.values[id]);if(!r.ok)throw Error(r.errors.join(' '));
  const cell=v=>{let text=String(v??'');if(typeof v==='string' && /^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  const lines=[['Project','Revision','Joint','Observation count','Dimension / interval','Start or value','End','Unit'],...r.rows.map(row=>[project.name,project.revision,jointById(id).name,project.evidence[id].filter(Boolean).length+'/3',row.label,typeof row.value==='number'?Number(row.value.toFixed(8)):row.value,row.end==null?'':Number(row.end.toFixed(8)),row.unit])];
  return lines.map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
export function renderSVG(id,values) {
  const r=calculate(id,values);if(!r.ok)return '';
  const v=values,j=jointById(id),n=key=>fmt(v[key]);
  let art='';
  const label=(x,y,t)=>`<text x="${x}" y="${y}">${esc(t)}</text>`;
  if(id==='dado'||id==='rabbet') {
    const x=id==='dado'?265:475;
    art=`<rect x="80" y="98" width="490" height="110" fill="#c8b28e"/><rect x="${x}" y="98" width="95" height="56" fill="#fbf7ed" stroke="#ba593a" stroke-dasharray="5 4"/><path d="M80 226H${x}M${x} 218v16" stroke="#235b50"/>${label(80,252,(id==='dado'?'Near wall: ':'Shoulder: ')+fmt(r.rows[0].value)+' mm')}${label(x-20,80,'Width '+fmt(v.mate+v.fit)+' mm')}${label(x+105,137,'Depth '+n('depth'))}${label(80,285,'Remaining '+(id==='dado'?'floor':'lip')+': '+fmt(v.host-v.depth)+' mm')}`;
  } else if(id==='half-lap') {
    const db=v.a+v.b-v.stack-v.da;
    art=`<path d="M70 95h150v55h105V95h150v100H70z" fill="#c8b28e"/><path d="M220 215h105v50H220z" fill="#638c7b"/><path d="M70 215h150v-45h105v45h150v65H70z" fill="none" stroke="#235b50" stroke-width="2"/>${label(75,75,'A: recess '+n('da')+' mm · notch '+fmt(v.wb+v.fit))}${label(75,310,'B: recess '+fmt(db)+' mm · notch '+fmt(v.wa+v.fit))}${label(505,170,'Stack')}${label(505,195,n('stack')+' mm')}`;
  } else if(id==='mortise-tenon') {
    art=`<path d="M70 105h185v35h115v50H255v35H70z" fill="#c8b28e"/><rect x="430" y="70" width="155" height="200" fill="#638c7b"/><rect x="430" y="136" width="110" height="58" fill="#fbf7ed" stroke="#ba593a" stroke-dasharray="5 4"/><path d="M375 165h45" stroke="#235b50" stroke-dasharray="4 4"/>${label(70,82,'Rail '+n('rail')+' × '+n('railWidth'))}${label(265,127,'Tenon L '+n('length'))}${label(430,295,'Pocket depth '+n('depth'))}${label(70,285,'Each cheek shoulder '+fmt((v.rail-v.tenon)/2)+' mm')}`;
  } else if(id==='dowel') {
    const row=(y,who)=>`<rect x="65" y="${y}" width="520" height="66" fill="${who==='A'?'#c8b28e':'#c8d9ce'}"/>${Array.from({length:v.count},(_,i)=>{const cx=65+520*(v.end+i*(v.length-2*v.end)/(v.count-1))/v.length;return `<circle cx="${cx}" cy="${y+33}" r="6" fill="#235b50"/>`;}).join('')}${label(600,y+38,who)}`;
    art=row(80,'A')+row(185,'B')+label(65,60,'Corresponding marked end → centers '+n('end')+' … '+fmt(v.length-v.end)+' mm')+label(65,290,'Row from marked side '+n('offset')+' mm · '+v.count+' holes per face');
  } else {
    const intervals=r.rows.filter(row=>row.end!=null);
    art=intervals.map((row,i)=>{const x=65+520*row.value/v.width,w=520*(row.end-row.value)/v.width;return `<rect x="${x}" y="85" width="${w}" height="70" fill="${i%2?'#fbf7ed':'#c8b28e'}" stroke="#9b8769"/><rect x="${x}" y="190" width="${w}" height="70" fill="${i%2?'#638c7b':'#fbf7ed'}" stroke="#638c7b"/>`;}).join('')+label(605,125,'A')+label(605,230,'B')+label(65,65,'Datum → nominal interval boundaries')+label(65,295,intervals.length+' intervals · span '+n('width')+' mm · last '+fmt(r.rows[3].value)+' mm');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 350" width="720" height="350" role="img" aria-labelledby="jl-svg-title-${id} jl-svg-desc-${id}"><title id="jl-svg-title-${id}">${esc(j.name)} — dimension reference</title><desc id="jl-svg-desc-${id}">Schematic, not to scale. All labeled lengths are millimeters. ${esc(r.metrics.map(m=>m.label+': '+fmt(m.value)+' '+m.unit).join('; '))}</desc><rect width="720" height="350" rx="12" fill="#f2eee3"/><g font-family="Arial,sans-serif" font-size="14" fill="#254b42">${art}<text x="65" y="336" font-size="11">SCHEMATIC · NOT TO SCALE · ALL LENGTHS mm · PROVE ON A TEST PAIR</text></g></svg>`;
}
