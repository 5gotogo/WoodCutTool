import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4198";
const port = process.env.WCT_CDP_PORT || "9359";
const output = process.env.WCT_NAV_QA_OUTPUT || "/tmp/wct-navigation-qa";
mkdirSync(output, { recursive: true });
const original = readFileSync(new URL("../assets/site-chrome.js", import.meta.url)).toString("base64");
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
const pending = new Map(), errors = [], rows = [], races = [];
let id = 0, baseline = false, pauseMenu = false, failMenu = false, paused = null;
ws.addEventListener("message", async ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === "Fetch.requestPaused") {
    const event = message.params;
    const path = new URL(event.request.url).pathname;
    if (baseline && path === "/assets/site-navigation.js") await send("Fetch.fulfillRequest", { requestId: event.requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/javascript" }], body: original });
    else if (path === "/assets/site-menus.js" && failMenu) { failMenu = false; await send("Fetch.failRequest", { requestId: event.requestId, errorReason: "Failed" }); }
    else if (path === "/assets/site-menus.js" && pauseMenu) paused = event.requestId;
    else await send("Fetch.continueRequest", { requestId: event.requestId });
    return;
  }
  if (!message.id) return;
  const job = pending.get(message.id); pending.delete(message.id);
  if (message.error) job.reject(Error(JSON.stringify(message.error))); else job.resolve(message.result);
});
function send(method, params = {}) { return new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); }); }
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 25)); }
  throw Error(`Timeout: ${expression}`);
}
async function navigate(route) {
  paused = null;
  await send("Page.navigate", { url: "about:blank" });
  await send("Page.navigate", { url: origin + route }); await send("Page.bringToFront");
  await waitFor('location.pathname === ' + JSON.stringify(route) + ' && document.readyState === "complete" && document.querySelector(".nav-links-mega")?.dataset.boundMegaNavigation === "true"');
}
const snapshot = `(() => ({header:document.querySelector('.site-header').outerHTML, footer:document.querySelector('.site-footer').outerHTML}))()`;
const requestCount = `performance.getEntriesByType('resource').filter(e=>new URL(e.name).pathname==='/assets/site-menus.js').length`;
const clickMenu = index => `document.querySelectorAll('.nav-menu-toggle')[${index}].click()`;
async function expand(index) { await evaluate(clickMenu(index)); await waitFor(`document.querySelectorAll('.nav-menu-item')[${index}].classList.contains('is-open') && !!document.querySelectorAll('.nav-menu-item')[${index}].querySelector('.mega-menu a')`); }
async function release() { const requestId = paused; paused = null; await send("Fetch.continueRequest", { requestId }); }
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setExtraHTTPHeaders", { headers: { DNT: "1" } });
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/assets/site-navigation.js*" }, { urlPattern: "*/assets/site-menus.js*" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'try { localStorage.setItem("woodcuttool-lang", "en"); } catch {}' });
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 980 });
    for (const route of ["/troubleshooting/", "/compare/track-saw-vs-table-saw-sheet-goods/", "/plywood-cut-calculator/", "/apps/moodloop-mood-tracker-journal/", "/legal/Tinnitus/privacy/"]) {
      const before = [];
      for (baseline of [true, false]) {
        await navigate(route);
        if (!baseline) assert.equal(await evaluate(requestCount), 0, "Hidden menus must not be fetched on initial load");
        if (width < 980) await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        for (let index = 0; index < 5; index++) {
          await expand(index);
          const state = await evaluate(snapshot);
          if (baseline) before.push(state); else assert.deepEqual(state, before[index], `${route} ${width}px menu ${index}: links, active states, labels, CTA or footer changed`);
        }
      }
      assert.equal(await evaluate(requestCount), 1, "All five menus must share one module request");
      assert.equal(await evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'), 0, route);
      rows.push({ width, route, menus: 5, identicalChrome: true, oneLazyRequest: true });
    }
  }
  // Hold the real module response while users dismiss or switch menus.
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  for (const action of ["escape", "outside", "toggle", "switch"]) {
    pauseMenu = true; await navigate("/troubleshooting/");
    await evaluate('document.querySelector(".mobile-nav-toggle").click()');
    await evaluate(clickMenu(0));
    for (let i = 0; !paused && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 25));
    assert(paused, "Menu module did not request");
    if (action === "escape") await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
    if (action === "outside") await evaluate('document.querySelector("main h1").click()');
    if (action === "toggle") await evaluate(clickMenu(0));
    if (action === "switch") await evaluate(clickMenu(1));
    pauseMenu = false; await release();
    await waitFor('!!document.querySelector(".mega-menu")');
    // Let queued expansion continuations run before asserting their final state.
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    assert.equal(await evaluate('document.querySelector(".nav-menu-item.is-open")?.dataset.menuKey || ""'), action === "switch" ? "Projects" : "", action);
    races.push(action);
  }
  failMenu = true; await navigate("/troubleshooting/");
  await evaluate('document.querySelector(".mobile-nav-toggle").click()'); await evaluate(clickMenu(0));
  for (let i = 0; failMenu && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 25));
  await evaluate('new Promise(resolve => setTimeout(resolve,100))');
  await expand(0);
  assert(await evaluate('performance.getEntriesByType("resource").some(e=>e.name.includes("site-menus.js?retry=1"))'), "A failed module must be retryable");
  const translated = [];
  for (baseline of [true, false]) {
    await navigate("/troubleshooting/");
    await evaluate('const selector=document.querySelector(".language-picker select");selector.value="zh-CN";selector.dispatchEvent(new Event("change",{bubbles:true}))');
    await waitFor('document.documentElement.lang === "zh-CN" && !!window.WCTTranslation');
    await expand(2);
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    translated.push(await evaluate(snapshot));
  }
  assert.deepEqual(translated[1], translated[0], "Lazy menus must preserve existing Chinese translation behavior");
  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${output}/navigation-mobile.png`, Buffer.from(screenshot.data, "base64"));
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, races, retry: true, lazyMenuTranslation: true, errors }, null, 2));
  console.log(`Passed ${rows.length} layouts, 100 menu comparisons, four pending-load races, network retry and lazy-menu translation.`);
} finally {
  if (paused) await release();
  await send("Fetch.disable"); await send("Page.close"); ws.close();
}
