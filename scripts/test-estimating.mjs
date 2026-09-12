import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {estimatePanel} from '../assets/estimating-model.js';
import {estimatingProjects} from './estimating-data.mjs';
const base={length:1000,width:500,qty:4,stockLength:2000,stockWidth:1000,allowance:0,price:50,hours:2,rate:30,unit:'mm',rotate:false};
assert.deepEqual(estimatePanel(base),{net:2,allowed:2,sheets:1,material:50,labor:60,total:110,fits:true});
assert.equal(estimatePanel({...base,allowance:10}).sheets,2);
const inches={...base,unit:'in'};for(const k of ['length','width','stockLength','stockWidth']) inches[k]/=25.4;
assert.ok(Math.abs(estimatePanel(inches).net-2)<1e-10);assert.equal(estimatePanel(inches).sheets,1);
assert.equal(estimatePanel({...base,length:900,width:1900}).fits,false);
assert.equal(estimatePanel({...base,length:900,width:1900,rotate:true}).fits,true);
assert.equal(estimatePanel({...base,length:2100,rotate:true}).fits,false);
for(const invalid of [{qty:1.5},{qty:0},{price:-1},{length:NaN},{allowance:101},{width:Infinity},{unit:'feet'},{qty:10001}])assert.throws(()=>estimatePanel({...base,...invalid}));
for(const p of estimatingProjects){const result=estimatePanel({...base,...p});assert.ok(result.fits);const html=readFileSync(`estimating/${p.slug}/index.html`,'utf8');assert.ok(html.includes('does not transfer'));assert.equal((html.match(/id="panel-estimate-form"/g)||[]).length,1);for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){if(url.startsWith('/go/'))continue;assert.ok(existsSync('.'+url+(url.endsWith('/')?'index.html':'')),url);}}
console.log('ESTIMATING_OK: known values, unit equivalence, rounding, fit, invalid inputs, six scenarios and local links');
