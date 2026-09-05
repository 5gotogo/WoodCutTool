import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
const origin = process.env.P0_ORIGIN || 'http://127.0.0.1:4186';
const debuggerOrigin = process.env.P0_CDP || 'http://127.0.0.1:9337';
const output = process.env.P0_OUTPUT || '/tmp/woodcuttool-p0-browser';
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
async function evaluate(expression) { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; }
async function wait(expression) { for (let i = 0; i < 100; i++) { try { if (await evaluate(expression)) return; } catch {} await new Promise(r => setTimeout(r, 100)); } throw new Error(`Timeout: ${expression}`); }
async function navigate(path) { await send('Page.navigate', { url: origin + path }); await wait('document.readyState === "complete"'); }
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function overflow() { return evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll("main *")].filter(e=>e.getBoundingClientRect().width && e.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(e=>e.tagName+"."+e.className)})'); }
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  await navigate('/plywood-cut-calculator/'); await wait('document.querySelector("#plywood-form[data-workflow-ready]")');
  await evaluate('localStorage.clear(); sessionStorage.clear()');
  const pilots = [['bookshelf', '/examples/bookshelf-cut-list/'], ['garage-shelves', '/templates/garage-shelving-cut-list/'], ['base-cabinet', '/examples/base-cabinet-cut-list/']];
  for (const [scenario, path] of pilots) {
    await navigate(path); await wait('document.querySelector("[data-send-cut-list]")'); await click('[data-send-cut-list]');
    await wait('location.pathname === "/plywood-cut-calculator/" && document.querySelector("[data-accept-import]")');
    await click('[data-accept-import]'); assert.ok(await evaluate('document.querySelector("[data-import-error]").textContent.length>0'));
    await click('[data-accept-scope]'); await click('[data-accept-import]');
    assert.equal(await evaluate('document.querySelector("#plywood-form").dataset.scenario'), scenario);
    await evaluate('document.querySelector("#plywood-form").requestSubmit()');
    await wait('document.querySelector("[data-export-csv]")');
    assert.equal(await evaluate('document.querySelector("#plywood-result h2").textContent'), 'All listed panels placed');
    await click('[data-export-csv]');
    await click('[data-export-json]');
    await new Promise(r => setTimeout(r, 200));
    assert.equal(JSON.parse(readFileSync(`${output}/woodcuttool-project.json`, 'utf8')).scenario, scenario);
    assert.ok(readFileSync(`${output}/woodcuttool-cut-list.csv`, 'utf8').includes('complete-panel-layout'));
    // Exercise the tracked result CTA without leaving the local test site.
    await evaluate('document.querySelector("#plywood-result [data-conversion-cta]").scrollIntoView({behavior:"instant",block:"center"})');
    await new Promise(r => setTimeout(r, 250));
    await evaluate('document.querySelector("#plywood-result [data-app-store-link]").addEventListener("click",event=>event.preventDefault(),{once:true});document.querySelector("#plywood-result [data-app-store-link]").click()');
    for (const width of [360, 390, 430, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      await new Promise(r => setTimeout(r, 100));
      const check = await overflow(); assert.ok(check.scroll <= width, `${scenario}: ${JSON.stringify(check)}`);
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    await evaluate('document.querySelector("#plywood-result").scrollIntoView({behavior:"instant",block:"start"})');
    await new Promise(r => setTimeout(r, 150));
    const screenshot = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/${scenario}-390.png`, Buffer.from(screenshot.data, 'base64'));
    // Actual unit switch, not just a model-level conversion.
    const original = await evaluate('Number(document.querySelector("[data-part] [name=length]").value)');
    await evaluate('const unit=document.querySelector("[name=unit]"); unit.value="mm"; unit.dispatchEvent(new Event("change",{bubbles:true}))');
    assert.ok(Math.abs(await evaluate('Number(document.querySelector("[data-part] [name=length]").value)') - original * 25.4) < 1e-5);
    await evaluate('document.querySelector("#plywood-form").requestSubmit()'); await wait('document.querySelector("[data-export-csv]")');
    // Draft survives a reload.
    await navigate('/plywood-cut-calculator/'); await wait('document.querySelector("#plywood-form[data-workflow-ready]")');
    assert.equal(await evaluate('document.querySelector("[name=unit]").value'), 'mm');
    console.log(`Browser workflow passed: ${scenario}`);
  }
  // Existing sheet components transfer real thickness and stay grouped by stock.
  await navigate('/tools/components/fixed-shelf-cut-list-calculator/');
  await wait('document.querySelector("[data-component-layout]")');
  await click('[data-component-layout]');
  await wait('location.pathname === "/plywood-cut-calculator/" && document.querySelector("[data-accept-import]")');
  await click('[data-accept-scope]'); await click('[data-accept-import]');
  await evaluate('document.querySelector("#plywood-form").requestSubmit()');
  await wait('document.querySelector("[data-export-csv]")');
  assert.equal(await evaluate('document.querySelector("#plywood-result h2").textContent'), 'All listed panels placed');
  // Restore a named pilot so the following cancellation has a distinct old draft.
  await navigate('/examples/base-cabinet-cut-list/'); await click('[data-send-cut-list]');
  await wait('document.querySelector("[data-accept-import]")'); await click('[data-accept-scope]'); await click('[data-accept-import]');
  await evaluate('const unit=document.querySelector("[name=unit]");unit.value="mm";unit.dispatchEvent(new Event("change",{bubbles:true}))');
  // Incoming list cancellation preserves the previous draft, including edited units.
  await navigate('/examples/bookshelf-cut-list/'); await click('[data-send-cut-list]'); await wait('document.querySelector("[data-cancel-import]")'); await click('[data-cancel-import]');
  assert.equal(await evaluate('document.querySelector("#plywood-form").dataset.scenario'), 'base-cabinet');
  assert.equal(await evaluate('document.querySelector("[name=unit]").value'), 'mm');
  // Oversize panels explicitly result in an incomplete layout.
  await evaluate('const length=document.querySelector("[data-part] [name=length]");length.value="99999";length.dispatchEvent(new Event("change",{bubbles:true}));document.querySelector("#plywood-form").requestSubmit()');
  assert.equal(await evaluate('document.querySelector("#plywood-result h2").textContent'), 'Incomplete panel layout');
  await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 1, mobile: false }); assert.ok((await overflow()).scroll <= 360);
  // DNT prevents the client from sending any event.
  const before = conversions.length;
  await evaluate('Object.defineProperty(navigator,"doNotTrack",{value:"1",configurable:true});window.WCTConversion.track("example_open",{scenario:"bookshelf"})');
  await new Promise(r => setTimeout(r, 300)); assert.equal(conversions.length, before);
  // Storage-denied transfer produces a visible fallback, without navigation or clobbering.
  await navigate('/examples/bookshelf-cut-list/');
  await evaluate('Storage.prototype.setItem = function(){throw new DOMException("denied","SecurityError")}'); await click('[data-send-cut-list]');
  assert.equal(await evaluate('location.pathname'), '/examples/bookshelf-cut-list/');
  assert.ok(await evaluate('document.querySelector("[data-handoff-status]").textContent.includes("could not transfer")'));
  const files = readdirSync(output).filter(f => f.startsWith('woodcuttool-cut-list') && f.endsWith('.csv'));
  assert.ok(files.length > 0); assert.ok(readFileSync(`${output}/${files[0]}`, 'utf8').includes('material_group'));
  assert.ok(conversions.length >= 15, `Only ${conversions.length} events`);
  assert.ok(conversions.every(status => status === 204), JSON.stringify(conversions));
  assert.deepEqual(errors, []);
  const report = { pilots: 3, widths: [360, 390, 430, 1440], eventResponses: conversions.length, eventStatus: 204, consoleExceptions: errors, downloads: files.length, checks: ['import review', 'calculate', 'CSV/JSON download', 'units', 'reload', 'cancel import', 'oversize', 'DNT', 'denied storage', 'existing component transfer'] };
  writeFileSync(`${output}/qa.json`, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report));
} finally { ws.close(); }
