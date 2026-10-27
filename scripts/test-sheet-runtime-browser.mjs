import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4196";
const port = process.env.WCT_CDP_PORT || "9357";
const output = process.env.WCT_SHEET_QA_OUTPUT || "/tmp/wct-sheet-qa";
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (!message.id) return;
  const job = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) job.reject(new Error(JSON.stringify(message.error)));
  else job.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, { resolve, reject });
    ws.send(JSON.stringify({ id: key, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout: ${expression}`);
}
async function navigate(route) {
  await send("Page.navigate", { url: origin + route });
  await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header")');
}

const rows = [], languages = [];
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Network.setExtraHTTPHeaders", { headers: { DNT: "1" } });
  const english = await send("Page.addScriptToEvaluateOnNewDocument", { source: 'localStorage.setItem("woodcuttool-lang", "en")' });
  const submit = async (values, expected) => {
    const metrics = await evaluate(`(async () => {
      const form = document.getElementById("sheet-form"), result = document.getElementById("sheet-result");
      for (const [key, value] of Object.entries(${JSON.stringify(values)})) form.elements[key].value = value;
      let renders = 0;
      const observer = new MutationObserver(records => { renders += records.filter(r => r.target === result).length; });
      observer.observe(result, {childList:true});
      form.requestSubmit();
      await new Promise(resolve => requestAnimationFrame(resolve));
      observer.disconnect();
      return {values:[...result.querySelectorAll(".metric strong")].map(e => e.textContent), renders};
    })()`);
    assert.deepEqual(metrics.values, expected);
    assert.equal(metrics.renders, 1, "One submit must produce one render, including after translation loading");
  };
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: width < 980 });
    await navigate("/sheet-calculator/");
    await waitFor('document.getElementById("sheet-form").dataset.sheetCalculatorBound === "true"');
    assert.equal(await evaluate('performance.getEntriesByType("resource").some(e => new URL(e.name).pathname === "/assets/app.js")'), false);
    assert.equal(await evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'), 0);
    await submit({sheetLength:96,sheetWidth:48,partLength:30,partWidth:18,qty:8,wastePercent:15,sheetPrice:50}, ["2","30 ft²","34 ft²","$100"]);
    await submit({sheetLength:12,sheetWidth:12,partLength:12,partWidth:12,qty:1,wastePercent:0,sheetPrice:12.5}, ["1","1 ft²","0 ft²","$12.5"]);
    assert(await evaluate('[...document.querySelectorAll("#sheet-form input, .tool-panel, #sheet-result")].every(e => { const r=e.getBoundingClientRect();return r.left >= 0 && r.right <= innerWidth; })'), "Form and results must remain visible, even when body hides overflow");
    await evaluate(`document.querySelector(${JSON.stringify(width < 980 ? ".mobile-nav-toggle" : ".nav-menu-toggle")}).click()`);
    await waitFor(width < 980 ? 'document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded") === "true"' : '!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
    await send("Input.dispatchKeyEvent", { type:"keyDown", key:"Escape", code:"Escape" });
    await evaluate('document.querySelector("main h1").click();new Promise(resolve => setTimeout(resolve,200))');
    assert.equal(await evaluate('document.querySelectorAll(".adjacent-app-cta").length'), 1);
    assert.equal(await evaluate('document.querySelector("#sheet-result .cta-row a").getAttribute("href")'), "/apps/cutlist/");
    rows.push({width, calculation:true, singleRender:true, menu:true, overflow:0, fullAppRequested:false});
    if ([390,1440].includes(width)) {
      const shot = await send("Page.captureScreenshot", {format:"png"});
      writeFileSync(`${output}/sheet-${width}.png`,Buffer.from(shot.data,"base64"));
    }
  }
  // The full app is still the authoritative localization runtime. Loading it
  // after a calculation must preserve the result and avoid duplicate handlers.
  for (const lang of ["zh-CN","zh-TW","es","pt","fr","de","nl","it","ar","ja","en"]) {
    await evaluate(`(() => { const picker = document.querySelector(".language-picker select");picker.value=${JSON.stringify(lang)};picker.dispatchEvent(new Event("change",{bubbles:true})); })()`);
    await waitFor(`window.WCTAppInitialized === true && document.documentElement.lang === ${JSON.stringify(lang)}`);
    await submit({sheetLength:96,sheetWidth:48,partLength:30,partWidth:18,qty:8,wastePercent:15,sheetPrice:50}, ["2","30 ft²","34 ft²","$100"]);
    assert.equal(await evaluate('document.documentElement.dir'), lang === "ar" ? "rtl" : "ltr");
    languages.push(lang);
  }
  assert.equal(await evaluate('document.querySelector("#sheet-result h2").textContent'),"Sheet estimate");
  // A returning visitor with saved language also keeps a single calculator.
  await evaluate('localStorage.setItem("woodcuttool-lang","zh-CN")');
  // The initial audit injection resets to English; remove it for the saved-language case.
  await send("Page.removeScriptToEvaluateOnNewDocument", {identifier:english.identifier});
  const saved = await send("Page.addScriptToEvaluateOnNewDocument", {source:'localStorage.setItem("woodcuttool-lang","zh-CN")'});
  await navigate("/sheet-calculator/");
  await waitFor('window.WCTAppInitialized === true && document.documentElement.lang === "zh-CN"');
  await submit({sheetLength:96,sheetWidth:48,partLength:30,partWidth:18,qty:8,wastePercent:15,sheetPrice:50}, ["2","30 ft²","34 ft²","$100"]);
  assert.equal(await evaluate('document.querySelector(".nav-download-cta").textContent.trim()'),"下载 CutList App");
  await send("Page.removeScriptToEvaluateOnNewDocument", {identifier:saved.identifier});
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({rows,languages,savedLanguage:true,errors},null,2));
  console.log(`Sheet calculator passed ${rows.length} responsive/menu checks, numerical results, ${languages.length} language switches, saved language and single-render guards.`);
} finally { await send("Page.close"); ws.close(); }
