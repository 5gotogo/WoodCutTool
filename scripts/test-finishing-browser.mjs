import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { sampleProject } from '../assets/finishing-core.js';
import { STORAGE_KEY } from '../assets/finishing-core.js';

// Run against an isolated Chrome profile and the local dev server.
const origin = process.env.WCT_FINISHING_ORIGIN || 'http://127.0.0.1:4175';
const port = process.env.WCT_CDP_PORT || 9337;
const output = process.env.WCT_FINISHING_OUTPUT || '/tmp/wct-finishing-qa';
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
  const { root } = await send('DOM.getDocument'); const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#fp-import' });
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
  await navigate('/finishing-planner/'); await evaluate('localStorage.removeItem(' + JSON.stringify(STORAGE_KEY) + ')'); await navigate('/finishing-planner/');
  await waitFor('document.querySelectorAll("[data-part]").length === 2');
  assert.ok(await evaluate('document.querySelector("[data-area]").textContent.includes("1.4832")'));
  await screenshot('desktop-hero'); await screenshot('desktop-products', '#fp-products'); await screenshot('desktop-parts', '#fp-parts'); await screenshot('desktop-results', '#fp-results');
  await click('[data-part="0"] [name="top"]'); assert.deepEqual((await saved()).parts[0].surfaces, ['front', 'back']);
  await click('[data-part="0"] [name="stage1"]'); assert.equal((await saved()).parts[0].products[1], true);
  assert.ok(await evaluate('document.querySelectorAll(".fp-result-card")[1].textContent.includes("1.44 m²")'));
  await fill('[data-part="0"] [name="length"]', 800); await navigate('/finishing-planner/');
  assert.equal((await saved()).parts[0].length, 800);
  await select('#fp-unit', 'us');
  assert.ok(await evaluate('document.querySelector("#fp-products").textContent.includes("ft²/US gal")'));
  assert.ok(Math.abs(await evaluate('Number(document.querySelector("[data-part] [name=length]").value)') - 800 / 25.4) < 1e-8);
  await select('#fp-unit', 'metric'); assert.ok(Math.abs((await saved()).parts[0].length - 800) < 1e-6);
  await fill('[data-product="0"] [name="stock"]', 100); assert.ok(await evaluate('document.querySelector(".fp-total strong").textContent === "0"'));
  await fill('[data-product="0"] [name="stock"]', 0);
  await fill('[data-part="0"] [name="qty"]', '');
  assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), true);
  assert.equal((await saved()).parts[0].qty, 4);
  await select('#fp-unit', 'us'); assert.equal(await evaluate('document.querySelector("#fp-unit").value'), 'metric');
  await fill('[data-part="0"] [name="qty"]', 1.1); assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), true);
  await fill('[data-part="0"] [name="qty"]', 4); assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), false);
  await click('#fp-add'); assert.equal(await evaluate('document.querySelectorAll("[data-part]").length'), 3);
  await fill('[data-part="1"] [name="qty"]', ''); await click('[data-remove="1"]');
  assert.equal(await evaluate('document.querySelectorAll("[data-part]").length'), 2);
  assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), false);
  await click('[data-remove="1"]'); assert.equal(await evaluate('document.querySelectorAll("[data-part]").length'), 1);
  for (const s of ['front', 'back']) await click('[data-part="0"] [name="' + s + '"]');
  assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), true);
  await click('[data-part="0"] [name="front"]');
  assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), false);
  console.log('Browser editing, surface/stage toggles, units, save/reload, inventory, invalid inputs and row removal passed.');
  for (const [selector, filename] of [['#fp-csv', 'finishing-purchase-list.csv'], ['#fp-backup', 'finishing-project.json']]) {
    if (existsSync(output + '/' + filename)) unlinkSync(output + '/' + filename);
    await click(selector); for (let n = 0; n < 100 && !existsSync(output + '/' + filename); n++) await sleep(50);
    assert.equal(existsSync(output + '/' + filename), true, 'Missing download ' + filename);
  }
  assert.equal(JSON.parse(readFileSync(output + '/finishing-project.json', 'utf8')).parts[0].length > 799.9999, true);
  assert.ok(readFileSync(output + '/finishing-purchase-list.csv', 'utf8').includes('Coverage m2/L per coat'));
  const incoming = sampleProject(); incoming.parts[0].qty = 7;
  writeFileSync(output + '/incoming.json', JSON.stringify(incoming)); writeFileSync(output + '/invalid.json', '{"version":99}');
  await file(output + '/invalid.json'); await waitFor('document.querySelector("#fp-status").textContent.includes("Import was not applied")');
  assert.equal((await saved()).parts[0].qty, 4);
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#fp-import-review").hidden');
  await click('#fp-import-cancel'); assert.equal((await saved()).parts[0].qty, 4);
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#fp-import-review").hidden');
  await click('#fp-import-apply'); assert.equal((await saved()).parts[0].qty, 7);
  console.log('CSV/JSON downloads and invalid/canceled/confirmed imports passed.');
  const responsive = [];
  for (const width of [320, 390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 844 : 1000, deviceScaleFactor: 1, mobile: width < 600 });
    for (const route of ['/finishing-planner/', '/finishing-planner/surface-area-from-cut-list/', '/finishing-planner/coverage-coats-and-pack-sizes/', '/finishing-planner/finish-plan-before-assembly/']) {
      await navigate(route); assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), route + ' overflows at ' + width);
      responsive.push({ width, route, overflow: false });
      if (width === 390) { await screenshot(route === '/finishing-planner/' ? 'mobile-hero' : 'mobile-' + route.split('/')[2]); if (route === '/finishing-planner/') { await screenshot('mobile-products', '#fp-products'); await screenshot('mobile-parts', '#fp-parts'); await screenshot('mobile-results', '#fp-results'); } }
    }
  }
  await navigate('/finishing-planner/');
  await fill('[data-part="0"] [name="label"]', '<script>bad</script>' + 'X'.repeat(70));
  await fill('[data-product="0"] [name="label"]', 'Y'.repeat(100));
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Long labels overflow');
  assert.equal(await evaluate('document.querySelector(".fp-result-card script") === null'), true);
  await evaluate('localStorage.setItem(' + JSON.stringify(STORAGE_KEY) + ', "{bad")'); await navigate('/finishing-planner/');
  assert.ok(await evaluate('document.querySelector("#fp-status").textContent.includes("preserved")'));
  await fill('[data-part="0"] [name="length"]', 700);
  assert.equal(await evaluate('localStorage.getItem(' + JSON.stringify(STORAGE_KEY) + ')'), '{bad');
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#fp-import-review").hidden'); await click('#fp-import-apply');
  assert.equal((await saved()).parts[0].qty, 7);
  const patch = await send('Page.addScriptToEvaluateOnNewDocument', { source: 'Storage.prototype.getItem = function(){throw Error("blocked")}; Storage.prototype.setItem = function(){throw Error("blocked")};' });
  await navigate('/finishing-planner/'); await fill('[data-part="0"] [name="length"]', 650);
  assert.ok(await evaluate('document.querySelector("#fp-status").textContent.includes("unavailable")'));
  assert.equal(await evaluate('document.querySelector("#fp-csv").disabled'), false);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: patch.identifier });
  assert.deepEqual(errors, []);
  writeFileSync(output + '/results.json', JSON.stringify({ responsive, errors, downloads, interactions: 'passed' }, null, 2));
  console.log('Storage recovery, unavailable storage, escaping and all 16 responsive route/width checks passed.');
} finally { await send('Page.close').catch(() => {}); ws.close(); }
