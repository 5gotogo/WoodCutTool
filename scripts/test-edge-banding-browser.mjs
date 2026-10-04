import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { sampleProject } from '../assets/edge-banding-core.js';
import { STORAGE_KEY } from '../assets/edge-banding-core.js';
import { DRAFT_KEY, HANDOFF_KEY } from '../assets/cut-handoff-model.js';

// Run against an isolated Chrome profile and the local dev server.
const origin = process.env.WCT_EDGE_ORIGIN || 'http://127.0.0.1:4175';
const port = process.env.WCT_CDP_PORT || 9337;
const output = process.env.WCT_EDGE_OUTPUT || '/tmp/wct-edge-banding-qa';
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
  const { root } = await send('DOM.getDocument'); const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#eb-import' });
  await send('DOM.setFileInputFiles', { nodeId, files: [path] });
}
async function screenshot(name, selector = null) {
  if (selector) await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`); else await evaluate('scrollTo(0,0)');
  await sleep(150); const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/${name}.png`, Buffer.from(data, 'base64'));
}
const saved = () => evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}))`);
try {
  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output, eventsEnabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/edge-banding/'); await evaluate(`localStorage.removeItem(${JSON.stringify(STORAGE_KEY)})`); await navigate('/edge-banding/');
  await waitFor('document.querySelectorAll("[data-part]").length === 2');
  assert.ok(await evaluate('document.querySelector("#eb-results").textContent.includes("716 × 396")'));
  await screenshot('desktop-hero'); await screenshot('desktop-parts', '#eb-parts'); await screenshot('desktop-results', '#eb-results');
  await click('[data-part="0"] [data-cycle="left"]');
  assert.equal((await saved()).parts[0].edges.left, 'A');
  assert.ok(await evaluate('document.querySelectorAll("[data-part-result]")[0].textContent.includes("599 × 299")'));
  await click('[data-part="0"] [data-cycle="left"]'); assert.equal((await saved()).parts[0].edges.left, 'B');
  await click('[data-part="0"] [data-cycle="left"]'); assert.equal((await saved()).parts[0].edges.left, '');
  await fill('[data-part="0"] [name="length"]', 800);
  await navigate('/edge-banding/'); assert.equal((await saved()).parts[0].length, 800);
  await select('#eb-unit', 'in'); assert.ok(await evaluate('document.querySelector("#eb-results").textContent.includes("31.4961")'));
  await select('#eb-mode', 'blank'); assert.ok(await evaluate('Number(document.querySelector("#eb-parts fieldset:first-child [name=width]").value) < 11.78'));
  await select('#eb-mode', 'finished'); await select('#eb-unit', 'mm');
  assert.ok(Math.abs((await saved()).parts[0].width - 300) < 1e-5);
  await click('.eb-settings summary'); await fill('[name="preMill"]', 0.5);
  assert.ok(await evaluate('document.querySelector("#eb-results").textContent.includes("717 × 397")'));
  await fill('[data-profile="A"] [name="width"]', 19);
  assert.equal(await evaluate('document.querySelector("[data-export=parts]").disabled'), true);
  assert.ok(await evaluate('document.querySelector("#eb-results").textContent.includes("too narrow")'));
  await fill('[data-profile="A"] [name="width"]', 22);
  await fill('[data-part="0"] [name="qty"]', '');
  assert.equal(await evaluate('!!document.querySelector("[data-export=parts]")'), false);
  await fill('[data-part="0"] [name="qty"]', 3.0000001);
  assert.equal(await evaluate('!!document.querySelector("[data-export=parts]")'), false);
  await fill('[data-part="0"] [name="qty"]', 3);
  await click('#eb-add'); assert.equal(await evaluate('document.querySelectorAll("[data-part]").length'), 3);
  await click('[data-remove="2"]'); assert.equal(await evaluate('document.querySelectorAll("[data-part]").length'), 2);
  console.log('Browser geometry, edge clicks, save/reload, units, input basis, allowances, errors and add/remove passed.');
  for (const [selector, filename] of [['[data-export=parts]', 'edge-banding-parts.csv'], ['[data-export=supplies]', 'edge-banding-supplies.csv'], ['#eb-backup', 'edge-banding-project.json']]) {
    if (existsSync(`${output}/${filename}`)) unlinkSync(`${output}/${filename}`);
    await click(selector); for (let n = 0; n < 100 && !existsSync(`${output}/${filename}`); n++) await sleep(50);
    assert.equal(existsSync(`${output}/${filename}`), true, `Missing download ${filename}`);
  }
  const backup = JSON.parse(readFileSync(`${output}/edge-banding-project.json`, 'utf8')); assert.equal(backup.parts[0].length, 800);
  assert.ok(readFileSync(`${output}/edge-banding-parts.csv`, 'utf8').includes('"717","397"'));
  const incoming = sampleProject(); incoming.parts[0].qty = 4;
  writeFileSync(`${output}/incoming.json`, JSON.stringify(incoming)); writeFileSync(`${output}/invalid.json`, '{"version":99}');
  await file(`${output}/invalid.json`); await waitFor('document.querySelector("#eb-status").textContent.includes("Import was not applied")'); assert.equal((await saved()).parts[0].length, 800);
  await file(`${output}/incoming.json`); await waitFor('!document.querySelector("#eb-import-review").hidden'); await click('#eb-import-cancel'); assert.equal((await saved()).parts[0].length, 800);
  await file(`${output}/incoming.json`); await waitFor('!document.querySelector("#eb-import-review").hidden'); await click('#eb-import-apply'); assert.equal((await saved()).parts[0].qty, 4);
  console.log('CSV/JSON downloads and invalid/canceled/applied import flows passed.');
  const responsive = [];
  for (const width of [320, 390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 844 : 1000, deviceScaleFactor: 1, mobile: width < 600 });
    for (const route of ['/edge-banding/', '/edge-banding/finished-size-to-cut-size/', '/edge-banding/tape-width-and-roll-allowance/', '/edge-banding/shop-release-checklist/']) {
      await navigate(route);
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `${route} overflows at ${width}`);
      responsive.push({ width, route, overflow: false });
      if (width === 390) { await screenshot(route === '/edge-banding/' ? 'mobile-hero' : `mobile-${route.split('/')[2]}`); if (route === '/edge-banding/') { await screenshot('mobile-parts', '#eb-parts'); await screenshot('mobile-results', '#eb-results'); } }
    }
  }
  await navigate('/edge-banding/');
  await fill('[data-part="0"] [name="label"]', 'X'.repeat(100)); await fill('[data-profile="A"] [name="label"]', 'Y'.repeat(100));
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Long names overflow');
  await evaluate(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)},'{bad')`); await navigate('/edge-banding/');
  assert.ok(await evaluate('document.querySelector("#eb-status").textContent.includes("preserved")'));
  await fill('[data-part="0"] [name="length"]', 900); assert.equal(await evaluate(`localStorage.getItem(${JSON.stringify(STORAGE_KEY)})`), '{bad');
  await evaluate(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)},${JSON.stringify(JSON.stringify(sampleProject()))})`); await navigate('/edge-banding/');
  const injection = await send('Page.addScriptToEvaluateOnNewDocument', { source: `const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===${JSON.stringify(STORAGE_KEY)})throw Error('QA blocked storage');return original.call(this,k,v)};` });
  await navigate('/edge-banding/'); assert.ok(await evaluate('document.querySelector("#eb-status").textContent.includes("storage is unavailable")'));
  assert.equal(await evaluate('document.querySelector("[data-export=parts]").disabled'), false);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });
  await navigate('/edge-banding/');
  const existing = { version: 1, scenario: 'none', unit: 'mm', groups: [{ id: 'keep', material: 'Existing stock', thickness: 18, sheetLength: 2440, sheetWidth: 1220, kerf: 3.2, trim: 10, price: 0, allowRotate: true }], parts: [{ label: 'Existing draft', length: 100, width: 100, qty: 1, group: 'keep', allowRotate: true }], exclusions: [] };
  await evaluate(`localStorage.setItem(${JSON.stringify(DRAFT_KEY)},${JSON.stringify(JSON.stringify(existing))})`);
  await click('#eb-layout'); await waitFor('location.pathname === "/plywood-cut-calculator/" && !!document.querySelector("[data-accept-import]")');
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(DRAFT_KEY)})).parts[0].label`), 'Existing draft');
  assert.equal(await evaluate(`JSON.parse(sessionStorage.getItem(${JSON.stringify(HANDOFF_KEY)})).parts[1].length`), 716);
  await click('[data-accept-scope]'); await click('[data-accept-import]');
  await waitFor('document.querySelectorAll("#plywood-rows [data-part]").length === 2');
  assert.equal(await evaluate('document.querySelector("#plywood-rows [data-part]:nth-child(2) [name=length]").value'), '716');
  assert.equal(await evaluate('document.querySelector("#plywood-rows [data-part]:first-child [name=allowRotate]").value'), 'no');
  assert.equal(errors.length, 0, errors.join('\n'));
  writeFileSync(`${output}/results.json`, JSON.stringify({ scope: 'Local isolated headless Chrome; actual mouse/text events and DOM assertions; no deployment', responsive, downloads, errors, handoff: 'Incoming review preserves existing draft; accepted saw blanks and grain lock verified', storage: 'Normal, unavailable and malformed preserved draft checked' }, null, 2));
  console.log(`Browser QA passed: 16 responsive cases, exports/imports, storage fallback, invalid draft preservation and receiving layout review. Evidence: ${output}`);
} finally { await send('Page.close'); ws.close(); }
