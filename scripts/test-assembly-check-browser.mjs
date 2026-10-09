import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { sampleProject } from '../assets/assembly-check-core.js';
import { STORAGE_KEY } from '../assets/assembly-check-core.js';

// Run against an isolated Chrome profile and the local dev server.
const origin = process.env.WCT_ASSEMBLY_ORIGIN || 'http://127.0.0.1:4175';
const port = process.env.WCT_CDP_PORT || 9339;
const output = process.env.WCT_ASSEMBLY_OUTPUT || '/tmp/wct-assembly-qa';
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let id = 0; const jobs = new Map(), errors = [], downloads = [];
ws.addEventListener('message', ({ data }) => {
  const m = JSON.parse(data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Browser.downloadWillBegin') downloads.push(m.params.suggestedFilename);
  const job = jobs.get(m.id); if (!job) return; jobs.delete(m.id);
  if (m.error) job.reject(Error(JSON.stringify(m.error))); else job.resolve(m.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; jobs.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(expression) { for (let n = 0; n < 150; n++) { if (await evaluate(expression)) return; await sleep(50); } throw Error(`Timed out: ${expression}`); }
async function navigate(route) { await send('Page.navigate', { url: origin + route }); await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header")'); }
async function click(selector) {
  const point = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing target');e.scrollIntoView({block:'center',inline:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await sleep(80);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function fill(selector, value) {
  await click(selector); await evaluate(`document.querySelector(${JSON.stringify(selector)}).select()`);
  await send('Input.insertText', { text: String(value) });
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).dispatchEvent(new Event('change',{bubbles:true}))`);
}
async function select(selector, value) { await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`); }
async function file(path) {
  const { root } = await send('DOM.getDocument'); const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#ac-import' });
  await send('DOM.setFileInputFiles', { nodeId, files: [path] });
}
async function screenshot(name, selector = null) {
  if (selector) await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`); else await evaluate('scrollTo(0,0)');
  await sleep(150); const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/${name}.png`, Buffer.from(data, 'base64'));
}
const saved = () => evaluate('JSON.parse(localStorage.getItem(' + JSON.stringify(STORAGE_KEY) + '))');
try {
  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output, eventsEnabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/assembly-check/'); await evaluate('localStorage.removeItem(' + JSON.stringify(STORAGE_KEY) + ')'); await navigate('/assembly-check/');
  await waitFor('document.querySelector("#ac-result").classList.contains("borderline")');
  await screenshot('desktop-hero');
  await fill('#ac-diagonalB',1000.5);
  assert.ok(await evaluate('document.querySelector("#ac-result").classList.contains("within")'));
  for(const gate of ['sides','plane','references','fit']) await click('#ac-'+gate);
  assert.ok(await evaluate('document.querySelector("#ac-result").textContent.includes("Recorded checks complete")'));
  await fill('#ac-name','Front opening · dry fit'); await click('#ac-save');
  assert.equal((await saved()).records.length,1);
  assert.equal((await saved()).records[0].checks.fit,true);
  await screenshot('desktop-checks','#ac-form'); await screenshot('desktop-records','#ac-records');
  await fill('#ac-diagonalB',1004);
  assert.equal((await saved()).draft.checks.fit,false);
  assert.ok(await evaluate('document.querySelector("#ac-result").classList.contains("outside")'));
  await click('#ac-save'); assert.equal((await saved()).records.length,2);
  await navigate('/assembly-check/');
  assert.equal(await evaluate('document.querySelectorAll(".ac-record").length'),2);
  await click('[data-load="1"]'); assert.equal((await saved()).draft.diagonalB,1000.5);
  // Canonical values survive repeated display-unit switches without rounded-input drift.
  const before=(await saved()).draft;
  for(let n=0;n<4;n++){await select('#ac-unit','in');await select('#ac-unit','mm');}
  assert.deepEqual((await saved()).draft,before);
  await fill('#ac-width',''); assert.equal(await evaluate('document.querySelector("#ac-save").disabled'),true);
  assert.equal(await evaluate('document.querySelector("#ac-backup").disabled'),true);
  await select('#ac-unit','in'); assert.equal(await evaluate('document.querySelector("#ac-unit").value'),'mm');
  await fill('#ac-width',600); assert.equal(await evaluate('document.querySelector("#ac-save").disabled'),false);
  for(const [selector,name] of [['#ac-csv','assembly-check-records.csv'],['#ac-backup','assembly-check-backup.json']]){
    if(existsSync(output+'/'+name)) unlinkSync(output+'/'+name);
    await click(selector);for(let n=0;n<100&&!existsSync(output+'/'+name);n++)await sleep(50);
    assert.ok(existsSync(output+'/'+name),'Missing download '+name);
  }
  assert.ok(readFileSync(output+'/assembly-check-records.csv','utf8').includes('Front opening'));
  assert.equal(JSON.parse(readFileSync(output+'/assembly-check-backup.json','utf8')).records.length,2);
  const incoming=sampleProject();incoming.draft.name='Imported inspection';
  writeFileSync(output+'/incoming.json',JSON.stringify(incoming));writeFileSync(output+'/invalid.json','{"version":99}');
  await file(output+'/invalid.json');await waitFor('document.querySelector("#ac-status").textContent.includes("Import was not applied")');
  assert.equal((await saved()).records.length,2);
  await file(output+'/incoming.json');await waitFor('!document.querySelector("#ac-import-review").hidden');
  await click('#ac-import-cancel');assert.equal((await saved()).records.length,2);
  await file(output+'/incoming.json');await waitFor('!document.querySelector("#ac-import-review").hidden');
  await click('#ac-import-apply');assert.equal((await saved()).draft.name,'Imported inspection');
  assert.equal((await saved()).records.length,0);
  await click('#ac-save');
  // Native deletion confirmation: cancel preserves the snapshot; accept removes it.
  let dialog;
  ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Page.javascriptDialogOpening')dialog=m.params;});
  const clickDelete=async accept=>{dialog=null;const job=click('[data-delete="0"]');for(let n=0;n<80&&!dialog;n++)await sleep(25);assert.ok(dialog);await send('Page.handleJavaScriptDialog',{accept});await job;};
  await clickDelete(false);assert.equal((await saved()).records.length,1);
  await clickDelete(true);assert.equal((await saved()).records.length,0);
  const responsive=[];
  for(const width of [320,390,768,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:width<800});
    for(const route of ['/assembly-check/','/assembly-check/measure-diagonals/','/assembly-check/tolerance-and-repeatability/','/assembly-check/dry-fit-release/']){
      await navigate(route);
      const layout=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
      assert.ok(layout.scroll<=layout.width,JSON.stringify({route,...layout}));responsive.push({route,...layout});
      if(width===390&&route==='/assembly-check/') { await screenshot('mobile-hero');await screenshot('mobile-checker','#ac-form'); }
    }
  }
  await navigate('/assembly-check/');await send('Emulation.setEmulatedMedia',{media:'print'});
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".ac-toolbar")).display'),'none');
  await screenshot('print-view','#ac-form');await send('Emulation.setEmulatedMedia',{media:''});
  // Unreadable saved data is not silently overwritten.
  await evaluate('localStorage.setItem('+JSON.stringify(STORAGE_KEY)+', "broken-json")');await navigate('/assembly-check/');
  await fill('#ac-name','Recovery draft');await click('#ac-save');
  assert.equal(await evaluate('localStorage.getItem('+JSON.stringify(STORAGE_KEY)+')'),'broken-json');
  assert.ok(await evaluate('document.querySelector("#ac-status").textContent.includes("preserved")'));
  // Storage failure keeps a usable draft, snapshots and export actions.
  await evaluate('localStorage.removeItem('+JSON.stringify(STORAGE_KEY)+'); Storage.prototype.setItem = function(){throw new Error("blocked storage")}');
  await fill('#ac-name','In-memory record');await click('#ac-save');
  assert.ok(await evaluate('document.querySelector("#ac-status").textContent.includes("preserved")'));
  // Clear preservation using a reviewed import, then the failing storage path is exercised.
  await file(output+'/incoming.json');await waitFor('!document.querySelector("#ac-import-review").hidden');await click('#ac-import-apply');
  await fill('#ac-name','In-memory record');await click('#ac-save');
  assert.ok(await evaluate('document.querySelector("#ac-status").textContent.includes("could not be saved")'));
  assert.equal(await evaluate('document.querySelector("#ac-backup").disabled'),false);
  assert.equal(await evaluate('document.querySelectorAll(".ac-record").length'),1);
  assert.deepEqual(errors,[]);
  writeFileSync(output+'/results.json',JSON.stringify({responsive,errors,downloads},null,2));
  console.log('Assembly browser checks passed: readings, gates, edits, unit stability, reload, CSV/JSON, import review, deletion, storage failures, print, and four routes at 320/390/768/1440px.');
} finally {
  ws.close();await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`);
}
