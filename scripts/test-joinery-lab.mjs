import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JOINTS, sampleProject, normalizeProject, calculate, renderSVG, exportCSV, esc } from '../assets/joinery-core.js';
import { guides } from './joinery-data.mjs';
const p=sampleProject();
const result=(id,patch={})=>calculate(id,{...p.values[id],...patch});
const value=(r,label)=>r.rows.find(row=>row.label===label)?.value;
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

// Hand-worked reference dimensions, including the unequal-member case.
close(value(result('dado'),'Recess width'),17.95);
close(value(result('dado'),'Far wall from datum'),57.95);
assert.equal(value(result('rabbet'),'Remaining material'),9);
close(value(result('rabbet'),'Near wall from datum'),173.85);
assert.equal(value(result('half-lap',{b:20,stack:20,da:8}),'Recess depth B'),10);
assert.equal(value(result('half-lap',{b:20,stack:20,da:8}),'Remaining A'),10);
assert.equal(value(result('mortise-tenon'),'Rail cheek shoulder each'),7);
assert.equal(value(result('mortise-tenon'),'Rail edge shoulder each'),12);
close(value(result('mortise-tenon'),'Receiving side wall each'),7.95);
assert.deepEqual(result('dowel').rows.filter(row=>row.label.startsWith('Hole ')&&row.label.includes('center')).map(row=>row.value),[30,110,190,270]);
assert.equal(value(result('dowel'),'Remaining outer skin'),4);
assert.equal(value(result('dowel'),'Pair end reserve'),2);
const box=result('box',{width:123});
assert.equal(box.metrics[0].value,13);
assert.equal(value(box,'Final interval width'),3);
assert.equal(box.rows.at(-1).end,123);
assert.match(box.rows.at(-1).label,/A tab \/ B socket/);
close(value(result('box'),'Cut depth A'),12.3);
close(value(result('box'),'Cut depth B'),12.2);
assert.equal(result('box',{width:0.3*10,finger:0.3}).ok,false); // Software minimum interval is 0.5 mm.
assert.equal(result('box',{width:0.7*10,finger:0.7}).metrics[0].value,10);

// Model boundaries: crossed walls, unsupported patterns and incomplete inputs cannot leak stale output.
for(const [id,patch] of [
  ['dado',{depth:18}],['dado',{start:290}],['rabbet',{width:6}],
  ['half-lap',{da:18}],['half-lap',{stack:36}],['half-lap',{stack:1}],
  ['mortise-tenon',{depth:24}],['mortise-tenon',{depth:40}],['mortise-tenon',{tenon:22}],['mortise-tenon',{tenonWidth:60}],
  ['mortise-tenon',{host:8}],['dowel',{count:2.5}],['dowel',{end:3}],['dowel',{count:40}],
  ['dowel',{offset:2}],['dowel',{bore:16,tip:2}],['dowel',{dowelLength:25}],
  ['box',{width:120,finger:0.5}],['box',{width:8,finger:10}],['box',{width:10,finger:10}]
]) {
  const r=result(id,patch);assert.equal(r.ok,false,id+JSON.stringify(patch));assert.deepEqual(r.rows,[]);assert.deepEqual(r.metrics,[]);assert.equal(renderSVG(id,{...p.values[id],...patch}),'');
}
for(const j of JOINTS)for(const invalid of [null,undefined,NaN,Infinity,'18',-1])assert.equal(result(j.id,{[j.fields[0][0]]:invalid}).ok,false);
assert.ok(result('dowel',{dowelLength:24}).warnings.some(w=>w.includes('No modeled length reserve')));
assert.ok(result('mortise-tenon',{depth:25}).warnings.some(w=>w.includes('zero')));

// Several independent physical invariants across varying inputs.
for(let a=8;a<=30;a+=2)for(let b=10;b<=28;b+=3){
  const stack=Math.max(a,b),da=(a+b-stack)/2,r=result('half-lap',{a,b,stack,da});assert.ok(r.ok);close(value(r,'Remaining A')+value(r,'Remaining B'),stack);
}
for(const count of [2,3,4,7,15]){
  const r=result('dowel',{length:800,count,end:40});assert.ok(r.ok);const centers=r.rows.filter(row=>row.label.includes('center from end')).map(row=>row.value);assert.equal(centers.length,count);close(centers[0],40);close(centers.at(-1),760);for(let i=1;i<centers.length;i++)close(centers[i]-centers[i-1],720/(count-1));
}
for(const width of [35,60,91,120,123,147]){
  const intervals=result('box',{width}).rows.filter(row=>row.end!=null);close(intervals.reduce((sum,row)=>sum+row.end-row.value,0),width);assert.equal(intervals[0].value,0);assert.equal(intervals.at(-1).end,width);for(let i=1;i<intervals.length;i++)close(intervals[i-1].end,intervals[i].value);
}

const restored=normalizeProject(JSON.parse(JSON.stringify(p)));assert.deepEqual(restored,p);restored.values.dado.host=25;assert.equal(p.values.dado.host,18);
for(const patch of [{version:2},{unit:'feet'},{name:'a'.repeat(101)},{notes:null},{values:{}},{evidence:{}}])assert.throws(()=>normalizeProject({...p,...patch}));
const fractional=sampleProject();fractional.values.dowel.count=2.5;assert.throws(()=>normalizeProject(fractional));
const injection=sampleProject();injection.name='<svg onload="alert(1)">';assert.equal(normalizeProject(injection).name,injection.name);assert.ok(!esc(injection.name).includes('<'));
for(const name of ['=1+1','+SUM(A1:A3)','@SUM(A1:A3)','-1+1','  =1+1']){const record=sampleProject();record.name=name;assert.ok(exportCSV(record,'dado').includes('"\''+name+'"'));}
for(const j of JOINTS){
  assert.ok(result(j.id).ok);assert.match(renderSVG(j.id,p.values[j.id]),/SCHEMATIC · NOT TO SCALE/);
  const csv=exportCSV(p,j.id);assert.match(csv,/Observation count/);assert.equal(csv.trim().split('\r\n').length,result(j.id).rows.length+1);
}

assert.equal(guides.length,18);assert.equal(new Set(guides.map(g=>g.slug)).size,18);
for(const j of JOINTS){assert.equal(guides.filter(g=>g.joint===j.id).length,3);assert.ok(existsSync(`joinery-lab/${j.slug}/index.html`));}
for(const route of ['',...JOINTS.map(j=>j.slug+'/'),...guides.map(g=>g.slug+'/')]){
  const html=readFileSync('joinery-lab/'+route+'index.html','utf8');assert.match(html,/name="twitter:card"/);assert.match(html,/BreadcrumbList/);assert.match(html,/data-site-header/);assert.match(html,/data-site-footer/);assert.match(html,/href="\/about\/"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate IDs on '+route);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,'One document heading on '+route);
  assert.ok((html.match(/name="description" content="([^"]+)"/)?.[1]||'').length<=180,'Description length on '+route);
  for(const [,path] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){if(path.startsWith('/go/'))continue;assert.ok(existsSync('.'+path+(path.endsWith('/')?'index.html':'')),'Missing local path '+path);}
}
console.log('Joinery Lab: six worked models, invalid boundaries, paired geometry invariants, project schema, exports and all 25 generated routes passed.');
