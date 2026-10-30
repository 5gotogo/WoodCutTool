import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {sample,validate,inspect} from '../assets/workshop-atlas-core.js';
import {chapters} from './workshop-atlas-data.mjs';
const p=sample();assert.equal(inspect(p).area,27);assert.deepEqual(inspect(p).issues,[]);
p.stations[1].x=0;p.stations[1].y=0;assert(inspect(p).issues.some(s=>s.includes('overlaps')));
p.stations[0].x=6000;assert(inspect(p).issues.some(s=>s.includes('beyond')));
for(const bad of [{...sample(),width:NaN},{...sample(),width:-1},{...sample(),stations:[{...sample().stations[0],name:'<test>',w:0}]},{...sample(),stations:[sample().stations[0],sample().stations[0]]}])assert.throws(()=>validate(bad));
const touching={width:1000,depth:1000,stations:[{id:1,name:'A',x:0,y:0,w:500,d:500},{id:2,name:'B',x:500,y:0,w:500,d:500}]};assert.deepEqual(inspect(touching).issues,[]);
assert.equal(chapters.length,12);assert.equal(new Set(chapters.map(c=>c.slug)).size,12);
for(const path of ['workshop-atlas/index.html',...chapters.map(c=>`workshop-atlas/${c.slug}/index.html`)]){const html=readFileSync(path,'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1);assert(html.includes('rel="canonical"'));for(const [,href] of html.matchAll(/href="(\/[^"#?]*)[^\"]*"/g)){const file=href.endsWith('/')?href+'index.html':href;assert(existsSync('.'+file),`${path}: missing ${href}`);}}
console.log('Workshop Atlas: geometry, malformed inputs, 13 generated routes and internal targets passed.');
