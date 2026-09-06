import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
const origin = process.env.P1_ORIGIN || 'http://127.0.0.1:4190';
const debuggerOrigin = process.env.P0_CDP || 'http://127.0.0.1:9337';
const output = process.env.P1_OUTPUT || '/tmp/woodcuttool-p1-browser';
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
async function overflow() { return evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll("main *")].filter(e=>e.getBoundingClientRect().width && e.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(e=>e.tagName+"."+e.className)})'); }
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
  const results = [];
  for (const width of [360, 390, 430, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 600 });
    await navigate('/');
    assert.equal(await evaluate('document.querySelectorAll("[data-pilot-paths] a").length'), 6);
    assert.ok(await evaluate('document.querySelector(".demo-disclosure").textContent.includes("simulated")'));
    assert.ok(await evaluate('document.querySelector(".lab-stats").textContent.includes("Simulated savings")'));
    await click('[data-preset=shelves]');
    assert.ok(await evaluate('document.querySelector(".lab-stats").textContent.includes("Demo sheets")'));
    await evaluate('document.querySelector("[data-pilot-paths]").scrollIntoView({behavior:"instant",block:"center"})');
    assert.ok((await overflow()).scroll <= width);
    if (width < 600) {
      assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-pilot-paths]")).gridTemplateColumns.split(" ").length'), 1);
      await click('.mobile-nav-toggle');
      assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), 'true');
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
      assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), 'false');
    } else {
      await click('.nav-menu-toggle');
      assert.equal(await evaluate('document.querySelector(".nav-menu-toggle").getAttribute("aria-expanded")'), 'true');
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    }
    if (width === 390) { await evaluate('document.querySelector("[data-pilot-paths]").scrollIntoView({behavior:"instant"})'); const shot = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/home-projects-390.png`, Buffer.from(shot.data, 'base64')); }
    for (const route of ['/examples/bookshelf-cut-list/', '/examples/base-cabinet-cut-list/', '/templates/bookshelf-cut-list/', '/templates/base-cabinet-cut-list/', '/templates/garage-shelving-cut-list/']) {
      await navigate(route + '#use-cut-list');
      await wait('document.querySelector("[data-send-cut-list]")');
      assert.equal(await evaluate('document.querySelectorAll("#use-cut-list").length'), 1);
      assert.ok((await overflow()).scroll <= width, route + ' overflow');
      assert.ok(await evaluate('const b=document.querySelector("[data-send-cut-list]").getBoundingClientRect();b.width<=innerWidth && b.height>=44'));
      results.push({ route, width });
    }
    await click('[data-send-cut-list]'); await wait('document.querySelector("[data-accept-import]")');
    await click('[data-accept-scope]'); await click('[data-accept-import]');
    // Actual key input + Enter tests the native form path and custom summary focus.
    await evaluate('const input=document.querySelector("[data-part] [name=qty]");input.value="";input.focus()');
    await send('Input.insertText', { text: '501' });
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await wait('document.querySelector("[data-input-error]").textContent.includes("500")');
    assert.ok(await evaluate('document.activeElement.matches("[data-input-error]")'));
    assert.ok(await evaluate('const box=document.activeElement.getBoundingClientRect();box.top>=0 && box.bottom<innerHeight'));
    await evaluate('const input=document.querySelector("[data-part] [name=qty]");input.value="5";input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));document.querySelector("#plywood-form").requestSubmit()');
    await wait('document.querySelector("[data-export-csv]")');
    assert.ok(await evaluate('document.activeElement.matches("#plywood-result h2")'));
    assert.ok(await evaluate('const box=document.querySelector("[data-export-csv]").getBoundingClientRect();box.top>=0 && box.bottom<innerHeight'));
    assert.ok(await evaluate('document.querySelector(".plywood-next-step").textContent.includes("lumber")'));
    await click('[data-export-csv]');
    await click('.plywood-export-options summary'); await click('[data-export-json]');
    assert.ok((await overflow()).scroll <= width);
    if (width === 390) { const shot = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${output}/result-390.png`, Buffer.from(shot.data, 'base64')); }
    console.log(`P1 mobile/keyboard/navigation checks: ${width}px`);
  }
  // Language loading is lazy and must not reset an edited plywood draft.
  await navigate('/plywood-cut-calculator/'); await wait('document.querySelector("#plywood-form[data-workflow-ready]")');
  assert.ok(await evaluate('!performance.getEntriesByType("resource").some(r=>new URL(r.name).pathname==="/assets/app.js")'));
  const length = await evaluate('document.querySelector("[data-part] [name=length]").value');
  await evaluate('const select=document.querySelector(".language-picker select");select.value="zh-CN";select.dispatchEvent(new Event("change",{bubbles:true}))');
  await wait('window.WCTAppInitialized === true');
  assert.equal(await evaluate('document.querySelector("[data-part] [name=length]").value'), length);
  assert.equal(await evaluate('performance.getEntriesByType("resource").filter(r=>new URL(r.name).pathname==="/assets/app.js").length'), 1);
  await evaluate('const select=document.querySelector(".language-picker select");select.value="en";select.dispatchEvent(new Event("change",{bubbles:true}))');
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/qa.json`, JSON.stringify({ surfaces: results, errors, checks: ['demo labels', '3 visible pilot starts', 'mobile menu and Escape', 'source action anchors', 'actual keyboard submission', 'focused validation summary', 'visible primary export', 'contextual next step', 'CSV/JSON', 'lazy language preserves draft'] }, null, 2));
} finally { ws.close(); }
