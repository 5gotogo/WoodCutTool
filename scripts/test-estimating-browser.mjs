import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
const origin = process.env.P1_ORIGIN || 'http://127.0.0.1:4192';
const debuggerOrigin = process.env.P0_CDP || 'http://localhost:9337';
const output = process.env.P1_OUTPUT || '/tmp/woodcuttool-estimating-browser';
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`${debuggerOrigin}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0; const pending = new Map(); const errors = []; const conversions = [];
ws.addEventListener('message', ({ data }) => {
  const item = JSON.parse(data);
  if (item.id) { const task = pending.get(item.id); pending.delete(item.id); if (item.error) task.reject(new Error(JSON.stringify(item.error))); else task.resolve(item.result); }
  if (item.method === 'Runtime.exceptionThrown') errors.push(item.params.exceptionDetails.text + ' ' + (item.params.exceptionDetails.exception?.description || ''));
  if (item.method === 'Network.responseReceived' && item.params.response.url.includes('/api/conversion-event')) conversions.push(item.params.response.status);
});
function send(method, params = {}) { return new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); }); }
async function evaluate(expression) { const r = await send('Runtime.evaluate', { expression: `(function(){return eval(${JSON.stringify(expression)})})()`, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; }
async function wait(expression) { for (let i = 0; i < 100; i++) { try { if (await evaluate(expression)) return; } catch {} await new Promise(r => setTimeout(r, 100)); } throw new Error(`Timeout: ${expression}`); }
async function navigate(path) { await send('Page.navigate', { url: origin + path }); await wait('document.readyState === "complete"'); }
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function overflow() { return evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll("main *")].filter(e=>e.getBoundingClientRect().width && e.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(e=>e.tagName+"."+e.className+":"+e.getBoundingClientRect().width)})'); }
try {
 await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
 const routes=['','bookshelf/','kitchen-cabinet/','wardrobe/','workbench/','under-stair-storage/','laundry-fit-out/'];
 for(const width of [360,390,430,1440]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
  for(const route of routes) {
   await navigate('/estimating/'+route);
   await wait('document.querySelector(".site-header")');
   assert.ok((await overflow()).scroll<=width,route+' overflow '+width+JSON.stringify(await overflow()));
   if(route) {
    await click('#panel-estimate-form button');
    await wait('!document.querySelector("[data-estimate-result]").hidden');
    assert.ok(await evaluate('document.querySelector("[data-estimate-result]").textContent.includes("Partial cost subtotal")'));
    assert.ok(await evaluate('document.querySelector("[data-estimate-next] a[data-app-store-link]").getAttribute("href").includes("/go/cutlist/")'));
    assert.ok((await overflow()).scroll<=width,route+' result overflow '+width);
   }
  }
  await navigate('/estimating/bookshelf/');await click('#panel-estimate-form button');
  const before=await evaluate('document.querySelector("[data-estimate-result]").textContent');
  await evaluate('const e=document.querySelector("[name=unit]");e.value="in";e.dispatchEvent(new Event("change",{bubbles:true}))');
  await click('#panel-estimate-form button');
  assert.equal(await evaluate('document.querySelector("[data-estimate-result]").textContent'),before);
  await evaluate('const e=document.querySelector("[name=length]");e.value=999999;e.dispatchEvent(new Event("input",{bubbles:true}))');
  assert.ok(await evaluate('document.querySelector("[data-estimate-result]").hidden'));
  await click('#panel-estimate-form button');
  assert.ok(await evaluate('document.querySelector("[data-estimate-result]").textContent.includes("does not fit")'));
  if(width===390||width===1440) {
   await navigate('/estimating/');const shot=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/hub-${width}.png`,Buffer.from(shot.data,'base64'));
   await navigate('/estimating/bookshelf/#estimate');const calc=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/calculator-${width}.png`,Buffer.from(calc.data,'base64'));
  }
  console.log('Estimating browser checks passed at '+width+'px');
 }
 assert.deepEqual(errors,[]);
 assert.ok(conversions.includes(204),'local conversion API success');
 console.log(JSON.stringify({routes:7,widths:[360,390,430,1440],errors,conversionStatuses:[...new Set(conversions)]}));
} finally {ws.close(); await fetch(`${debuggerOrigin}/json/close/${tab.id}`);}
