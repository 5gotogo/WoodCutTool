import assert from 'node:assert/strict';
import { sampleProject, calculate, parseProject, exportCSV, renderSVG } from '../assets/shelf-pin-core.js';
const p = sampleProject(), r = calculate(p);
assert.equal(r.ok, true); assert.equal(r.levels.length, 19); assert.equal(r.skipped, 2); assert.equal(r.usable, 17); assert.equal(r.holes.length, 68); assert.equal(r.remainingSkin, 6);
assert.deepEqual(r.levels.filter(l => !l.usable).map(l => l.y), [320,352]);
assert.equal(r.holes.find(h => h.panel === 'Right' && h.row === 'Front').xOnDrawing, 523);
assert.equal(r.holes.find(h => h.panel === 'Right' && h.row === 'Front').xFromFront, 37);
assert.equal(calculate({...p, zones: [{from:258.5,to:270,label:'tangent'}]}).levels.find(l=>l.y===256).usable, false);
assert.equal(calculate({...p, zones:[], origin:0, bottom:0, top:0}).levels[0].y, 32);
assert.equal(calculate({...p, zones:[], bore:15, skin:3}).ok,true);
for (const patch of [{height:NaN},{pitch:0},{bore:16},{front:300,rear:300},{origin:2800},{diameter:15,front:3},{zones:[{from:0,to:721}]}]) assert.equal(calculate({...p,...patch}).ok,false,JSON.stringify(patch));
assert.throws(()=>parseProject({...p,version:2})); assert.throws(()=>parseProject({...p,height:'720'}));
assert.equal(parseProject({...p,checks:{datum:'true',coupon:true},extra:4}).checks.datum,false);
assert.equal(parseProject({...p,checks:{coupon:true}}).checks.coupon,true);
assert.ok(exportCSV({...p,name:'=SUM(A1)'}).includes("'"+'=SUM(A1)'));
assert.ok(renderSVG({...p,name:'<script>alert(1)</script>'}).includes('&lt;script&gt;'));
assert.equal(exportCSV(p).trim().split('\r\n').length,69);
// Sweep asymmetric row offsets and grid phases: every accepted circle is contained,
// every level supplies exactly four matching holes, all keep-outs include the radius.
for (let n=0;n<150;n++) {
  const q={...p,height:300+n*9,depth:200+n*3,front:20+n%17,rear:25+n%23,origin:n%90,pitch:16+n%25,zones:[{label:'hardware',from:120,to:180}]};
  const s=calculate(q); assert.equal(s.ok,true);
  for (const h of s.holes) {
    assert.ok(h.xOnDrawing>=q.diameter/2 && h.xOnDrawing<=q.depth-q.diameter/2);
    assert.ok(h.yFromBottom-q.diameter/2>=q.bottom-1e-7 && h.yFromBottom+q.diameter/2<=q.height-q.top+1e-7);
    assert.ok(h.yFromBottom+q.diameter/2<120 || h.yFromBottom-q.diameter/2>180);
    assert.ok(Math.abs((h.yFromBottom-q.origin)/q.pitch-Math.round((h.yFromBottom-q.origin)/q.pitch))<1e-6);
  }
  for (const l of s.levels.filter(l=>l.usable)) assert.equal(s.holes.filter(h=>h.yFromBottom===l.y).length,4);
  assert.equal(JSON.stringify(parseProject(JSON.parse(JSON.stringify(q)))),JSON.stringify(parseProject(q)));
}
console.log('Shelf Pin Studio: paired coordinates, rim/keep-out boundaries, depth reserve, imports, CSV/SVG and 150 geometry sweeps passed.');
