import assert from 'node:assert/strict';
import { sampleReading, sampleProject, assessReading, validateReading, validateProject, recordsCSV } from '../assets/assembly-check-core.js';
const read = (a,b,u=0.5,t=2) => ({ ...sampleReading(), diagonalA:a, diagonalB:b, uncertainty:u, tolerance:t });
assert.equal(assessReading(sampleReading()).ideal,1000);
assert.deepEqual([assessReading(sampleReading()).lower,assessReading(sampleReading()).upper], [1,3]);
assert.equal(assessReading(sampleReading()).status,'borderline');
assert.equal(assessReading(read(1000,1000.5)).status,'within');
assert.equal(assessReading(read(1000,1004)).status,'outside');
assert.equal(assessReading(read(1000,1001)).status,'within'); // inclusive upper-bound limit
assert.equal(assessReading(read(1000,1003)).status,'borderline'); // inclusive lower-bound limit
assert.equal(assessReading(read(1000,1000,0,0)).status,'within');
assert.equal(assessReading(read(1000,1000,0.5,0)).status,'borderline');
assert.equal(assessReading(read(1000,1000.5)).ready,false);
const complete = read(1000,1000.5); Object.keys(complete.checks).forEach(k=>complete.checks[k]=true);
assert.equal(assessReading(complete).ready,true);
assert.equal(assessReading({...complete, diagonalB:1004}).ready,false);
for (const v of [-1,0,NaN,Infinity,'600',100001]) assert.throws(()=>validateReading({...sampleReading(),width:v}));
assert.throws(()=>validateReading({...sampleReading(),uncertainty:1000}));
assert.throws(()=>validateReading({...sampleReading(),checks:{sides:'true'}}));
assert.throws(()=>validateProject({version:2}));
assert.throws(()=>validateProject({...sampleProject(),records:Array(201).fill({})}));
assert.throws(()=>validateProject({...sampleProject(),records:[{...sampleReading(),created:'invalid'}]}));
const project=sampleProject();project.records.push({...complete,name:'=SUM(1,2)',created:'2026-10-09T01:00:00.000Z'});
assert.deepEqual(validateProject(JSON.parse(JSON.stringify(project))), project);
const csv=recordsCSV(project.records);assert.ok(csv.includes('"\'=SUM(1,2)"'));assert.ok(csv.includes('"within"'));assert.ok(csv.includes('Reading uncertainty'));
// Bound calculations are symmetric and classify identically after a mm/in/mm round trip.
for (const a of [99.1,1000,3000]) for(const b of [a,a+0.5,a+2,a+5]){
 const r=read(a,b);const x=assessReading(r),y=assessReading(read(b,a));assert.deepEqual(x,y);
 const converted={...r};for(const key of ['width','height','diagonalA','diagonalB','tolerance','uncertainty']) converted[key]=(r[key]/25.4)*25.4;
 assert.equal(assessReading(converted).status,x.status);
}
console.log('Assembly Check passed: bounded uncertainty, boundary decisions, physical gates, invalid data, unit equivalence, backups and CSV.');
