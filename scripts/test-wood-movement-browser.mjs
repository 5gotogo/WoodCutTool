import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { sampleProject, STORAGE_KEY } from '../assets/wood-movement-core.js';
import { movementGuides } from './wood-movement-data.mjs';

// Run against an isolated Chrome profile and the local dev server.
const origin = process.env.WCT_MOVEMENT_ORIGIN || 'http://127.0.0.1:4175';
const port = process.env.WCT_CDP_PORT || 9341;
const output = process.env.WCT_MOVEMENT_OUTPUT || '/tmp/wct-movement-qa';
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
  const { root } = await send('DOM.getDocument'); const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#wm-import' });
  await send('DOM.setFileInputFiles', { nodeId, files: [path] });
}
async function screenshot(name, selector = null) {
  if (selector) await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`); else await evaluate('scrollTo(0,0)');
  await sleep(150); const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/${name}.png`, Buffer.from(data, 'base64'));
}
const saved = () => evaluate('JSON.parse(localStorage.getItem(' + JSON.stringify(STORAGE_KEY) + '))');
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output, eventsEnabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/wood-movement/'); await evaluate('localStorage.removeItem(' + JSON.stringify(STORAGE_KEY) + ')'); await navigate('/wood-movement/');
  await waitFor('!!document.querySelector(".wm-scenario")');
  assert.ok(await evaluate('document.querySelector("#wm-result").textContent.includes("13.536 mm")'));
  await screenshot('desktop-hero'); await screenshot('desktop-workspace', '#planner');
  await fill('[name=width]', 800); assert.equal((await saved()).width, 800);
  await navigate('/wood-movement/'); assert.equal(await evaluate('Number(document.querySelector("[name=width]").value)'), 800);
  await select('#wm-unit', 'in'); assert.ok(Math.abs(await evaluate('Number(document.querySelector("[name=width]").value)') - 800 / 25.4) < 1e-10);
  await select('#wm-unit', 'mm'); assert.ok(Math.abs((await saved()).width - 800) < 1e-9);
  await evaluate('document.querySelector("[name=reserve]").value="";document.querySelector("[name=reserve]").dispatchEvent(new Event("input",{bubbles:true}))');
  assert.equal(await evaluate('document.querySelector("#wm-csv").disabled'), true);
  assert.equal((await saved()).reserve, 2);
  await select('#wm-unit', 'in'); assert.equal(await evaluate('document.querySelector("#wm-unit").value'), 'mm');
  await fill('[name=reserve]', 2); await fill('[name=high]', 15);
  assert.ok(await evaluate('document.querySelector("#wm-error").textContent.includes("6–14")'));
  assert.equal(await evaluate('document.querySelectorAll(".wm-scenario").length'), 0);
  await fill('[name=high]', 12); await click('[data-example="0"]');
  await select('[name=direction]', 'both'); assert.equal(await evaluate('document.querySelectorAll(".wm-scenario").length'), 2);
  assert.ok(await evaluate('document.querySelector("#wm-result").textContent.includes("6.984 mm")'));
  await select('[name=anchor]', 'edge'); assert.ok(await evaluate('document.querySelector("#wm-result").textContent.includes("9.024 mm toward wet")'));
  await fill('[name=opening]', 600); assert.equal(await evaluate('document.querySelectorAll(".wm-review").length'), 2);
  await click('[data-example="1"]'); assert.equal((await saved()).species, 'sugar-maple');
  await click('[data-example="2"]'); assert.equal((await saved()).species, 'black-walnut');
  await click('[data-example="0"]');
  for (const name of ['wood-movement-project.json', 'wood-movement-review.csv']) if (existsSync(output + '/' + name)) unlinkSync(output + '/' + name);
  await click('#wm-backup'); await click('#wm-csv');
  for (let i = 0; i < 100 && !existsSync(output + '/wood-movement-review.csv'); i++) await sleep(50);
  assert.equal(JSON.parse(readFileSync(output + '/wood-movement-project.json', 'utf8')).width, 600);
  assert.ok(readFileSync(output + '/wood-movement-review.csv', 'utf8').includes('609.024'));
  const incoming = { ...sampleProject(), label: 'Imported walnut review', species: 'black-walnut', width: 700 };
  writeFileSync(output + '/incoming.json', JSON.stringify(incoming));
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#wm-import-review").hidden');
  assert.equal((await saved()).width, 600);
  await click('#wm-import-cancel'); assert.equal((await saved()).width, 600);
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#wm-import-review").hidden');
  await click('#wm-import-apply'); assert.equal((await saved()).width, 700);
  writeFileSync(output + '/invalid.json', JSON.stringify({ ...incoming, current: 20 }));
  await file(output + '/invalid.json'); await waitFor('document.querySelector("#wm-status").textContent.includes("not applied")');
  assert.equal((await saved()).width, 700);
  await fill('[name=label]', '<script>window.wmInjected=true</script>');
  assert.equal(await evaluate('window.wmInjected === undefined && !document.querySelector("#wm-result script")'), true);
  assert.ok(await evaluate('document.querySelector("#wm-result").textContent.includes("<script>")'));
  await evaluate('localStorage.setItem(' + JSON.stringify(STORAGE_KEY) + ', "{bad")'); await navigate('/wood-movement/');
  assert.ok(await evaluate('document.querySelector("#wm-status").textContent.includes("preserved")'));
  await fill('[name=width]', 750); assert.equal(await evaluate('localStorage.getItem(' + JSON.stringify(STORAGE_KEY) + ')'), '{bad');
  await file(output + '/incoming.json'); await waitFor('!document.querySelector("#wm-import-review").hidden'); await click('#wm-import-apply');
  assert.equal((await saved()).width, 700);
  const patch = await send('Page.addScriptToEvaluateOnNewDocument', { source: 'Storage.prototype.getItem=function(){throw Error("blocked")};Storage.prototype.setItem=function(){throw Error("blocked")};' });
  await navigate('/wood-movement/'); await fill('[name=width]', 650);
  assert.ok(await evaluate('document.querySelector("#wm-status").textContent.includes("unavailable")'));
  assert.equal(await evaluate('document.querySelector("#wm-csv").disabled'), false);
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: patch.identifier });
  await navigate('/wood-movement/'); await click('[data-example="0"]');
  await fill('[name=low]', 8); await fill('[name=high]', 8);
  assert.ok(await evaluate('document.querySelector(".wm-scenario h3").textContent.includes("0 mm")'));
  assert.equal(await evaluate('document.querySelector(".wm-chart").innerHTML.includes("NaN")'), false);
  await click('[data-example="0"]'); await select('[name=direction]', 'both');
  const responsive = [];
  for (const width of [360, 390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    for (const route of ['/wood-movement/', ...movementGuides.map(g => '/wood-movement/' + g.slug + '/')]) {
      await navigate(route); await sleep(100);
      const overflow = await evaluate('document.documentElement.scrollWidth-innerWidth');
      assert.ok(overflow <= 1, `${route} @${width}: ${overflow}px overflow`);
      responsive.push({ route, width, overflow });
      if (width === 390 && route === '/wood-movement/') { await screenshot('mobile-hero'); await screenshot('mobile-form', '#wm-form'); await screenshot('mobile-results', '#wm-result'); }
      if (width === 1440 && route.includes('clearance-and')) await screenshot('desktop-guide');
      if (width === 390 && route.includes('clearance-and')) await screenshot('mobile-guide');
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
  await navigate('/wood-movement/'); await click('.mobile-nav-toggle');
  await click('.nav-menu-item:has(.nav-trigger[href="/tools/"]) .nav-menu-toggle');
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify('#site-navigation a[href="/wood-movement/"]')}).getBoundingClientRect().height > 0`), true);
  await click('#site-navigation a[href="/wood-movement/"]');
  await waitFor('location.pathname === "/wood-movement/" && !!document.querySelector(".wm-scenario")');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/wood-movement/'); await click('[data-example="0"]');
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".site-header")).display'), 'none');
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector("#wm-form")).display'), 'none');
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".wm-print-note")).display'), 'none');
  const pdf = await send('Page.printToPDF', { printBackground: true }); writeFileSync(output + '/print-review.pdf', Buffer.from(pdf.data, 'base64'));
  await send('Emulation.setEmulatedMedia', { media: '' });
  await send('Emulation.setScriptExecutionDisabled', { value: true }); await send('Page.navigate', { url: origin + '/wood-movement/' }); await sleep(500);
  const staticHTML = await (await fetch(origin + '/wood-movement/')).text();
  assert.ok(staticHTML.includes('609.024 mm')); assert.ok(staticHTML.includes('example-review.csv')); assert.ok(staticHTML.includes('<noscript>'));
  await screenshot('no-javascript'); await send('Emulation.setScriptExecutionDisabled', { value: false });
  assert.deepEqual(errors, []);
  writeFileSync(output + '/results.json', JSON.stringify({ responsive, errors, downloads, interactions: 'passed', noJavaScript: 'static example and CSV', print: 'form and result visible' }, null, 2));
  console.log('Wood movement browser checks passed: live geometry, units, invalid input, examples, CSV/JSON, import review, storage recovery/failure, escaping, 16 responsive checks, print and static fallback.');
} finally { await send('Page.close').catch(() => {}); ws.close(); }
