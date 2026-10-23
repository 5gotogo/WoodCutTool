import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sampleProject,calculate,parseProject,exportCSV,renderSVG} from '../assets/drawer-fit-core.js';
import {guides} from './drawer-fit-data.mjs';
const p=sampleProject(),r=calculate(p),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
assert.equal(r.ok,true);close(r.boxWidth,474);close(r.innerWidth,450);close(r.wallHeight,144);close(r.frontHeight,628/3);close(r.frontWidth,532);close(r.rearRemaining,50);close(r.bayHeight,200);close(r.verticalReserve,30);assert.equal(r.evidence,0);assert.deepEqual(r.parts.map(x=>x.qty),[6,6,3,3]);assert.equal(r.parts.reduce((n,x)=>n+x.qty,0),18);
close(r.fronts.at(-1).top+r.frontHeight+p.gapBottom,p.frontHeight);
const taper=calculate({...p,widthMiddle:500.4,widthRear:500.8});assert.equal(taper.ok,true);close(taper.widthLow,473.8);close(taper.widthHigh,474.6);taper.spaces.forEach((x,i)=>close(x,[13,13.2,13.4][i]));
assert.equal(calculate({...p,widthRear:502}).ok,false);
// A common interval can exist while the chosen target misses it.
const target=calculate({...p,widthRear:501,sideTarget:13.5});assert.equal(target.ok,false);assert.ok(target.widthLow<=target.widthHigh);assert.equal(calculate({...p,widthRear:501,sideTarget:13}).ok,true);
assert.equal(calculate({...p,widthRear:501.6,sideTarget:12.7}).ok,true);
assert.equal(calculate({...p,depth:520}).ok,true);assert.equal(calculate({...p,depth:519.99}).ok,false);
assert.equal(calculate({...p,openingHeight:510}).ok,true);assert.equal(calculate({...p,openingHeight:509.99}).ok,false);
for(const patch of [{count:1.5},{count:0},{count:13},{sideMin:14},{sideTarget:12},{widthFront:NaN},{widthRear:Infinity},{boxHeight:5},{bottom:40,boxHeight:20},{frontWidth:30,gapLeft:20,gapRight:20},{rail:100,openingHeight:50},{wall:60,widthFront:100,widthMiddle:100,widthRear:100}])assert.equal(calculate({...p,...patch}).ok,false,JSON.stringify(patch));
assert.throws(()=>parseProject({...p,version:2}));assert.throws(()=>parseProject({...p,count:'3'}));assert.throws(()=>parseProject({...p,widthFront:null}));assert.equal(parseProject({...p,checks:{trial:'true',hardware:true}}).checks.trial,false);assert.equal(parseProject({...p,checks:{hardware:true}}).checks.hardware,true);
assert.ok(exportCSV({...p,name:'=SUM(A1)',hardware:'@cmd'}).includes("'=SUM(A1)"));assert.ok(exportCSV({...p,name:'=SUM(A1)',hardware:'@cmd'}).includes("'@cmd"));assert.equal(exportCSV(p).trim().split('\r\n').length,5);assert.throws(()=>exportCSV({...p,count:0}));assert.ok(renderSVG({...p,name:'<script>unsafe</script>'}).includes('&lt;script&gt;'));assert.ok(renderSVG(p,'front').includes('TOP → BOTTOM'));
// Vary count, geometry, materials and gap budgets; every valid result closes.
for(let i=0;i<240;i++){
 const q={...p,count:1+i%8,widthFront:400+i,widthMiddle:400+i,widthRear:400+i,length:400+i%50,openingHeight:240*(1+i%8),frontHeight:250*(1+i%8),wall:9+i%10,bottom:3+i%6,gapBetween:1+i%4,rail:i%10};
 const s=calculate(q);assert.equal(s.ok,true);close(s.boxWidth+2*q.sideTarget,q.widthFront);close(s.innerWidth+2*q.wall,s.boxWidth);close(s.wallHeight+q.bottom,q.boxHeight);close(s.frontHeight*q.count+q.gapTop+q.gapBottom+(q.count-1)*q.gapBetween,q.frontHeight);close(s.bayHeight*q.count+(q.count-1)*q.rail,q.openingHeight);assert.deepEqual(parseProject(JSON.parse(JSON.stringify(q))),parseProject(q));
}
assert.equal(guides.length,10);assert.equal(new Set(guides.map(g=>g.slug)).size,10);
for(const g of guides){assert.ok(g.sections.flatMap(x=>x).join(' ').split(/\s+/).length>=280,g.slug+' needs substantial distinct guidance');const html=readFileSync(new URL('../drawer-fit/'+g.slug+'/index.html',import.meta.url),'utf8');assert.ok(html.includes('href="https://woodcuttool.com/drawer-fit/'+g.slug+'/"'));assert.ok(html.includes(g.stop));}
console.log('Drawer Fit: interval intersection, target failures, depth/height boundaries, front closure, quantities, safe imports/exports, 240 geometry sweeps and 10 guide contracts passed.');
