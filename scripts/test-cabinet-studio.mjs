import assert from 'node:assert/strict';
import { DEFAULTS, PRESETS, normalize, buildCabinet, packParts, fitShelves, parseBrief, csvCutList } from '../assets/cabinet-studio-core.js';
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-6, `${a} != ${b}`);
const m = buildCabinet(DEFAULTS);
assert.equal(m.parts.length,9);
assert.deepEqual(m.parts.find(p=>p.id==='left').box,[0,0,0,18,1800,354]);
assert.equal(m.parts.find(p=>p.id==='top').length,864);
assert.equal(m.parts.find(p=>p.id==='shelf-0-1').width,342);
assert.equal(m.parts.find(p=>p.id==='back').thickness,6);
near(m.opening,338.4);
near(m.cost,208);
assert.ok(m.valid);
const divided = buildCabinet({...DEFAULTS,bays:3});
near(divided.bay,276);assert.equal(divided.parts.length,19);
assert.equal(buildCabinet({...DEFAULTS,back:false}).parts.find(p=>p.id==='left').width,360);
assert.ok(buildCabinet({...DEFAULTS,height:300,shelves:8,thickness:30}).issues.some(i=>i.kind==='error'));
assert.ok(buildCabinet({...DEFAULTS,sheetLength:600,sheetWidth:400}).groups.some(g=>g.unplaced.length));
assert.throws(()=>normalize({width:NaN}));assert.throws(()=>normalize({shelves:2.5}));assert.throws(()=>normalize({bays:0}));assert.throws(()=>normalize({back:'false'}));assert.throws(()=>normalize({material:'pine'}));
assert.equal(fitShelves(DEFAULTS),4);
assert.equal(fitShelves({...DEFAULTS,height:300,target:800}),0);
for(const preset of Object.values(PRESETS)) {const c={...DEFAULTS,...preset};assert.ok(buildCabinet(c).valid,'each starting preset must fit default stock');const adjusted=buildCabinet({...c,shelves:fitShelves(c)});assert.ok(adjusted.opening>=c.target || adjusted.config.shelves===0);}
assert.equal(parseBrief('bookcase 90 × 180 × 36 cm, 4 shelves').config.width,900);
assert.equal(parseBrief('书柜 宽90cm 高180cm 深36cm 4层板 胡桃木').config.material,'walnut');
assert.equal(parseBrief('media 60 x 24 x 16 in').config.width,1524);
assert.equal(parseBrief('width 950 mm', {...DEFAULTS,height:1600}).config.height,1600);
assert.throws(()=>parseBrief('bookcase 9 x 18 x 3 mm'));
assert.throws(()=>parseBrief('hello workshop'));
const testRotation = [{ id:'x',label:'test',length:500,width:700,thickness:18 }];
const stock = {...DEFAULTS,sheetLength:1000,sheetWidth:600,trim:0};
assert.equal(packParts(testRotation,{...stock,grain:true},18).unplaced.length,1);
assert.equal(packParts(testRotation,{...stock,grain:false},18).sheets[0].placed[0].rotated,true);
function verify(model) {
  const c=model.config, seen=new Set();
  for(const group of model.groups) {
    for(const sheet of group.sheets) {
      for(const p of sheet.placed) {
        assert.equal(p.thickness,group.thickness);
        assert.ok(!seen.has(p.id),'part placed more than once');seen.add(p.id);
        assert.ok(p.x>=c.trim-1e-6 && p.y>=c.trim-1e-6);
        assert.ok(p.x+p.l<=c.sheetLength-c.trim+1e-6 && p.y+p.w<=c.sheetWidth-c.trim+1e-6);
        if(c.grain)assert.equal(p.rotated,false);
        near(p.l*p.w,p.length*p.width);
      }
      for(let i=0;i<sheet.placed.length;i++)for(let j=i+1;j<sheet.placed.length;j++) {
        const a=sheet.placed[i],b=sheet.placed[j],k=c.kerf-1e-6;
        assert.ok(a.x+a.l+k<=b.x || b.x+b.l+k<=a.x || a.y+a.w+k<=b.y || b.y+b.w+k<=a.y,'overlap or kerf missing');
      }
    }
    group.unplaced.forEach(p=>{assert.ok(!seen.has(p.id));seen.add(p.id);});
  }
  assert.equal(seen.size,model.parts.length);
  if(!model.groups.some(g=>g.unplaced.length))assert.ok(model.utilization<=100+1e-6);
}
let seed=32026;
const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<180;i++) {
  const config={...DEFAULTS,width:300+Math.round(random()*2100),height:300+Math.round(random()*2100),depth:180+Math.round(random()*620),thickness:12+Math.round(random()*18),shelves:Math.floor(random()*9),bays:1+Math.floor(random()*3),back:random()>.3,grain:random()>.4,kerf:random()*8,trim:random()*35,sheetLength:600+Math.round(random()*3000),sheetWidth:400+Math.round(random()*1400)};
  const model=buildCabinet(config);verify(model);
  if(i<10)assert.deepEqual(model.groups,buildCabinet(config).groups);
}
verify(m);verify(divided);
const csv=csvCutList(m);assert.equal(csv.split('\r\n').length,m.parts.length+1);assert.ok(csv.includes('"Overlay back","1800.0","900.0","6"'));
console.log('Cabinet Studio checks passed: geometry, clearance, 180 randomized packing cases, containment, kerf, grain, parsing, deterministic layouts, and CSV.');
