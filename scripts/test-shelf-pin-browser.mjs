import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { STORAGE_KEY, sampleProject } from '../assets/shelf-pin-core.js';
import { guides } from './shelf-pin-data.mjs';

// Use the local dev server and an isolated Chrome debugging profile.
const origin=process.env.WCT_SHELF_PIN_ORIGIN || 'http://127.0.0.1:4175';
const port=process.env.WCT_CDP_PORT || 9337;
const output=process.env.WCT_SHELF_PIN_OUTPUT || '/tmp/wct-shelf-pin-qa';
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
async function navigate(route){await send('Page.navigate',{url:origin+route});await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header")');if(route==='/shelf-pin-layout/')await waitFor('document.querySelectorAll(".sp-stats>div").length === 3');}
async function click(selector){const point=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing target');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});}
async function fill(selector,value){await click(selector);await evaluate(`document.querySelector(${JSON.stringify(selector)}).select()`);await send('Input.insertText',{text:String(value)});}
async function screenshot(name,selector){await evaluate(selector?`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`:'scrollTo(0,0)');await sleep(100);const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${name}.png`,Buffer.from(data,'base64'));}
async function file(path){const {root}=await send('DOM.getDocument');const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector:'#sp-import'});await send('DOM.setFileInputFiles',{nodeId,files:[path]});}
const saved=()=>evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}))`);
try {
  await send('Page.enable');await send('Page.bringToFront');await send('Runtime.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:output,eventsEnabled:true});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/shelf-pin-layout/');await evaluate(`localStorage.removeItem(${JSON.stringify(STORAGE_KEY)})`);await navigate('/shelf-pin-layout/');
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".sp-stats strong")].map(e=>e.textContent.trim())'),['17','68','6 mm']);
  assert.equal(await evaluate('document.querySelectorAll(".sp-blocked").length'),2);
  await screenshot('desktop-hero');await screenshot('desktop-map','#sp-results');
  await click('[data-map-view="Right"]');assert.ok(await evaluate('document.querySelector("#sp-map svg").getAttribute("viewBox").startsWith("630 ")'));assert.ok(await evaluate('document.querySelector("#sp-map-caption").textContent.includes("front on the right")'));
  await click('[data-map-view="Left"]');assert.ok(await evaluate('document.querySelector("#sp-map svg").getAttribute("viewBox").startsWith("20 ")'));
  await click('[data-map-view="pair"]');assert.equal(await evaluate('document.querySelector("#sp-map svg").getAttribute("viewBox")'),'0 0 1234 830');
  await click('[data-level="128"]');assert.equal(await evaluate('document.querySelector("[data-level=\\"128\\"]").getAttribute("aria-pressed")'),'true');
  await evaluate('document.querySelector("[data-level=\\"160\\"]").focus()');
  await send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:36});await send('Input.dispatchKeyEvent',{type:'char',text:'\r',unmodifiedText:'\r',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:36});
  assert.equal(await evaluate('document.querySelector("[data-level=\\"160\\"]").getAttribute("aria-pressed")'),'true');
  await click('[name=check-coupon]');assert.equal((await saved()).checks.coupon,true);
  await fill('[name=front]',41);assert.equal((await saved()).checks.coupon,false);
  assert.ok(await evaluate('document.querySelector("#sp-announce").textContent.includes("cleared")'));
  await fill('[name=name]','Cabinet browser test');await navigate('/shelf-pin-layout/');assert.equal(await evaluate('document.querySelector("[name=front]").value'),'41');
  await fill('[name=bore]',16);assert.equal(await evaluate('document.querySelector("#sp-csv").disabled'),true);assert.equal(await evaluate('document.querySelector("#sp-map svg")'),null);
  await fill('[name=bore]',12);await fill('[name=pitch]','');assert.equal(await evaluate('document.querySelector("#sp-csv").disabled'),true);assert.equal((await saved()).pitch,32);
  await fill('[name=pitch]',32);await click('[data-remove="0"]');assert.equal(await evaluate('document.querySelector(".sp-stats strong").textContent'),'19');
  await click('#sp-add-zone');await fill('[name=zone-from]',258.5);await fill('[name=zone-to]',270);
  assert.ok(await evaluate('[...document.querySelectorAll(".sp-blocked")].some(e=>e.textContent.includes("256 mm"))'));
  await click('#sp-reset');await click('#sp-cancel');assert.equal((await saved()).front,41);
  await click('#sp-reset');await click('#sp-apply');assert.equal((await saved()).front,37);
  console.log('Browser edits, paired map selection, keyboard activation, physical evidence reset, keep-outs, save/reload and invalid inputs passed.');
  for(const [selector,name] of [['#sp-csv','shelf-pin-holes.csv'],['#sp-svg','shelf-pin-panels.svg'],['#sp-backup','shelf-pin-project.json']]){
    if(existsSync(`${output}/${name}`))unlinkSync(`${output}/${name}`);await click(selector);for(let n=0;n<100&&!existsSync(`${output}/${name}`);n++)await sleep(50);assert.ok(existsSync(`${output}/${name}`));
  }
  assert.equal(readFileSync(`${output}/shelf-pin-holes.csv`,'utf8').trim().split('\r\n').length,69);
  assert.ok(readFileSync(`${output}/shelf-pin-panels.svg`,'utf8').includes('width="1234mm"'));
  assert.equal(JSON.parse(readFileSync(`${output}/shelf-pin-project.json`,'utf8')).height,720);
  writeFileSync(`${output}/invalid.json`,'{"version":99}');await file(`${output}/invalid.json`);await waitFor('document.querySelector("#sp-announce").textContent.includes("Import was not applied")');assert.equal((await saved()).height,720);
  const incoming={...sampleProject(),name:'Imported cabinet',height:800};writeFileSync(`${output}/incoming.json`,JSON.stringify(incoming));
  await file(`${output}/incoming.json`);await waitFor('document.querySelector("#sp-review").open');assert.ok(await evaluate('document.querySelector("#sp-review-copy").textContent.includes("800")'));await click('#sp-cancel');assert.equal((await saved()).height,720);
  await file(`${output}/incoming.json`);await waitFor('document.querySelector("#sp-review").open');await click('#sp-apply');assert.equal((await saved()).height,800);
  await evaluate('window.print=()=>{window.__printRequested=true}');await click('#sp-print');assert.equal(await evaluate('window.__printRequested'),true);
  console.log('Actual CSV/SVG/JSON downloads, rejected imports, replacement preview/cancel/apply and print action passed.');
  const {identifier}=await send('Page.addScriptToEvaluateOnNewDocument',{source:'Storage.prototype.getItem=function(){throw Error("blocked")};Storage.prototype.setItem=function(){throw Error("blocked")};'});
  await navigate('/shelf-pin-layout/');await fill('[name=front]',40);assert.ok(await evaluate('document.querySelector("#sp-storage").textContent.includes("unavailable")'));assert.equal(await evaluate('document.querySelector("#sp-csv").disabled'),false);
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier});await navigate('/shelf-pin-layout/');assert.equal((await saved()).height,800);
  const responsive=[];
  for(const width of [320,390,768,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width<600?844:1000,deviceScaleFactor:1,mobile:width<600});
    for(const route of ['/shelf-pin-layout/',...guides.map(g=>`/shelf-pin-layout/${g.slug}/`)]){
      await navigate(route);const dimensions=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');assert.ok(dimensions.scroll<=dimensions.width,`${route} overflows at ${width}: ${dimensions.scroll}`);responsive.push({route,...dimensions});
    }
    if(width===390){await navigate('/shelf-pin-layout/');await screenshot('mobile-hero');await screenshot('mobile-form','#sp-form');await screenshot('mobile-map','#sp-results');await click('[data-map-view="Right"]');await screenshot('mobile-single-panel','.sp-map-controls');await navigate('/shelf-pin-layout/drill-depth-and-test-coupon/');await screenshot('mobile-guide');}
  }
  await send('Emulation.setEmulatedMedia',{media:'print'});await navigate('/shelf-pin-layout/');assert.equal(await evaluate('getComputedStyle(document.querySelector(".sp-hero")).display'),'none');await send('Emulation.setEmulatedMedia',{media:''});
  assert.deepEqual(errors,[]);writeFileSync(`${output}/results.json`,JSON.stringify({responsive,errors,checks:'interaction, evidence, persistence, input errors, downloads, imports, storage fallback, keyboard, print'},null,2));
  console.log(`Storage fallback, print styles, ${responsive.length} responsive route/viewport checks and zero runtime exceptions passed. Screenshots: ${output}`);
} finally {await send('Page.close').catch(()=>{});ws.close();}
