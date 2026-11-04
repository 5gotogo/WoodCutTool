import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { STORAGE_KEY, sampleProject } from '../assets/door-installation-core.js';
import { guides } from './door-installation-data.mjs';

// Use the local dev server and an isolated Chrome debugging profile.
const origin=process.env.WCT_DOOR_ORIGIN || 'http://127.0.0.1:4175';
const port=process.env.WCT_CDP_PORT || 9341;
const output=process.env.WCT_DOOR_OUTPUT || '/tmp/wct-door-qa';
mkdirSync(output,{recursive:true});
const tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let id=0;const jobs=new Map(),errors=[];
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);const job=jobs.get(m.id);if(!job)return;jobs.delete(m.id);if(m.error)job.reject(Error(JSON.stringify(m.error)));else job.resolve(m.result);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;jobs.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitFor(expression){for(let n=0;n<150;n++){if(await evaluate(expression))return;await sleep(50);}throw Error('Timed out: '+expression);}
async function navigate(route){await send('Page.navigate',{url:origin+route});await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header")');if(route==='/door-installation/')await waitFor('document.querySelectorAll(".di-stats>div").length === 3');}
async function click(selector){const point=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing target');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});}
async function fill(selector,value){await click(selector);await evaluate(`document.querySelector(${JSON.stringify(selector)}).select()`);await send('Input.insertText',{text:String(value)});}
async function screenshot(name,selector){await evaluate(selector?`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`:'scrollTo(0,0)');await sleep(100);const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${name}.png`,Buffer.from(data,'base64'));}
async function file(path){const {root}=await send('DOM.getDocument');const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector:'#di-import'});await send('DOM.setFileInputFiles',{nodeId,files:[path]});}
const saved=()=>evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}))`);
try {
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:output,eventsEnabled:true});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await navigate('/door-installation/');await evaluate(`localStorage.removeItem(${JSON.stringify(STORAGE_KEY)})`);await navigate('/door-installation/');
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".di-stats strong")].map(e=>e.textContent)'),['2','4','0']);
  assert.equal(await evaluate('document.querySelectorAll(".di-guide").length'),12);
  await screenshot('desktop-hero');await screenshot('desktop-workspace','#studio');
  await click('[data-tab="cups"]');await fill('[name="edge"]',6);assert.equal((await saved()).edge,6);
  assert.ok(await evaluate('document.querySelector("#di-register").textContent.includes("23.5")'));
  await click('[data-tab="fit"]');await fill('[name="gap-0"]',2.6);await click('[name="spec"]');
  assert.equal((await saved()).doors[0].gaps[0],2.6);assert.equal((await saved()).doors[0].checks.spec,true);
  assert.equal(await evaluate('document.querySelectorAll(".di-outlier").length'),1);
  await click('[data-tab="cups"]');await fill('[name="top"]',110);
  assert.equal((await saved()).doors[0].checks.spec,false);assert.deepEqual((await saved()).doors[0].gaps,[null,null,null,null]);
  await click('[data-door="1"]');assert.ok(await evaluate('document.querySelector("#di-map-title").textContent.includes("D2")'));
  await click('[data-tab="fit"]');await click('[name="coupon"]');await click('[data-door="0"]');
  assert.equal(await evaluate('document.querySelector("[name=coupon]").checked'),false);
  assert.equal((await saved()).doors[1].checks.coupon,true);
  await click('[data-tab="cups"]');await fill('[name="custom"]','100, 616');await fill('[name="zones"]','117.5:150');
  assert.equal(await evaluate('document.querySelector("#di-csv").disabled'),true);
  assert.ok(await evaluate('document.querySelector("#di-summary").textContent.includes("touches")'));
  await fill('[name="zones"]','118:150');assert.equal(await evaluate('document.querySelector("#di-csv").disabled'),false);
  await fill('[name="custom"]','100, nope');assert.equal(await evaluate('document.querySelector("#di-backup").disabled'),true);
  assert.deepEqual((await saved()).doors[0].custom,[100,616]);
  await fill('[name="custom"]','100, 616');
  await fill('[name="penetration"]',18);assert.equal(await evaluate('document.querySelector("#di-csv").disabled'),true);
  await fill('[name="penetration"]',13);await fill('[name="edge"]','');
  assert.equal(await evaluate('document.querySelector("#di-map svg")'),null);assert.equal((await saved()).edge,6);
  await fill('[name="edge"]',6);
  const beforeUnit=await saved();
  await evaluate('document.querySelector("#di-unit").value="in";document.querySelector("#di-unit").dispatchEvent(new Event("change",{bubbles:true}))');
  assert.ok(Math.abs(Number(await evaluate('document.querySelector("[name=edge]").value'))-6/25.4)<0.000001);
  assert.equal((await saved()).edge,beforeUnit.edge);
  await fill('[name="edge"]',0.25);assert.equal((await saved()).edge,6.35);
  await evaluate('document.querySelector("#di-unit").value="mm";document.querySelector("#di-unit").dispatchEvent(new Event("change",{bubbles:true}))');
  await click('[data-tab="survey"]');await fill('[name="id"]','D2');
  assert.equal(await evaluate('document.querySelector("#di-csv").disabled'),true);await fill('[name="id"]','D1');
  await click('#di-add');assert.equal((await saved()).doors.length,3);
  await click('#di-remove');await click('#di-cancel');assert.equal((await saved()).doors.length,3);
  await click('#di-remove');await click('#di-apply');assert.equal((await saved()).doors.length,2);
  await navigate('/door-installation/');assert.equal(await evaluate('document.querySelector("[name=id]").value'),'D1');
  assert.equal((await saved()).edge,6.35);
  await click('#di-example');await click('#di-cancel');assert.equal((await saved()).edge,6.35);
  await click('#di-example');await click('#di-apply');assert.equal((await saved()).edge,5);
  console.log('Browser: survey/cup/fit views, per-door selection, boundary conflicts, invalid-draft retention, evidence invalidation, units, add/remove, replacement and reload passed.');
  for(const [selector,name]of [['#di-csv','door-installation-schedule.csv'],['#di-svg','door-D1.svg'],['#di-backup','door-installation-project.json']]){
    if(existsSync(`${output}/${name}`))unlinkSync(`${output}/${name}`);await click(selector);
    for(let n=0;n<100&&!existsSync(`${output}/${name}`);n++)await sleep(50);
    assert.ok(existsSync(`${output}/${name}`),name);
  }
  assert.equal(readFileSync(`${output}/door-installation-schedule.csv`,'utf8').trim().split('\r\n').length,5);
  assert.ok(readFileSync(`${output}/door-D1.svg`,'utf8').includes('BACK FACE'));
  assert.equal(JSON.parse(readFileSync(`${output}/door-installation-project.json`,'utf8')).doors.length,2);
  writeFileSync(`${output}/bad.json`,'{"version":99}');await file(`${output}/bad.json`);
  await waitFor('document.querySelector("#di-message").textContent.includes("Import was not applied")');assert.equal((await saved()).doors.length,2);
  const incoming=sampleProject();incoming.name='Imported fit';incoming.doors[0].checks.spec=true;incoming.doors[0].gaps=[2,2,2,2];
  writeFileSync(`${output}/incoming.json`,JSON.stringify(incoming));await file(`${output}/incoming.json`);
  await waitFor('document.querySelector("#di-review").open');await click('#di-cancel');assert.notEqual((await saved()).name,'Imported fit');
  await file(`${output}/incoming.json`);await waitFor('document.querySelector("#di-review").open');await click('#di-apply');
  assert.equal((await saved()).name,'Imported fit');assert.equal((await saved()).doors[0].checks.spec,false);assert.deepEqual((await saved()).doors[0].gaps,[null,null,null,null]);
  await evaluate('window.print=()=>window.__printed=true');await click('#di-print');assert.equal(await evaluate('window.__printed'),true);
  const {identifier}=await send('Page.addScriptToEvaluateOnNewDocument',{source:'Storage.prototype.getItem=function(){throw Error("blocked")};Storage.prototype.setItem=function(){throw Error("blocked")};'});
  await navigate('/door-installation/');await fill('[name="width"]',450);
  assert.ok(await evaluate('document.querySelector("#di-storage").textContent.includes("unavailable")'));assert.equal(await evaluate('document.querySelector("#di-csv").disabled'),false);
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier});
  const responsive=[];
  for(const width of [320,390,768,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width<600?844:1100,deviceScaleFactor:1,mobile:width<600});
    for(const route of ['/door-installation/',...guides.map(g=>`/door-installation/${g.slug}/`)]){
      await navigate(route);const d=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
      assert.ok(d.scroll<=d.width,`${route} at ${width}: ${d.scroll}`);responsive.push({route,...d});
    }
    if(width===390){await navigate('/door-installation/');await screenshot('mobile-hero');await screenshot('mobile-survey','#studio');await click('[data-tab="cups"]');await screenshot('mobile-cup-form','.di-edit');await screenshot('mobile-map','.di-output');await navigate('/door-installation/back-face-handing/');await screenshot('mobile-guide');}
  }
  await navigate('/door-installation/');await send('Emulation.setEmulatedMedia',{media:'print'});
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".di-hero")).display'),'none');
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".di-register")).display'),'none');
  await send('Emulation.setEmulatedMedia',{media:''});assert.deepEqual(errors,[]);
  writeFileSync(`${output}/results.json`,JSON.stringify({responsive,errors,checks:'interaction, evidence, units, persistence, invalid inputs, downloads, imports, storage fallback, print'},null,2));
  console.log(`Browser: actual CSV/SVG/JSON downloads, imports, storage fallback, print, ${responsive.length} responsive route checks and zero runtime exceptions passed. Screenshots: ${output}`);
}finally{await send('Page.close').catch(()=>{});ws.close();}
