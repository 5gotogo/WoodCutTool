import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4189";
const port = Number(process.env.WCT_CDP_PORT || 9350);
const output = process.env.WCT_CWV_ROUTE_QA_OUTPUT || "/tmp/wct-cwv-route-qa-1009";
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});
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
  for (let attempt = 0; attempt < 200; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout: ${expression}`);
}
async function navigate(route) {
  await send("Page.navigate", { url: origin + route });
  await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header")');
}
const routes = ["/", "/cabinet-studio/", "/apps/ductlab-hvac-duct-layout/", "/wood/norway-spruce/", "/finishing-planner/", "/wood/east-indian-rosewood/", "/edge-banding/finished-size-to-cut-size/", "/edge-banding/", "/glossary/countersink/", "/wood/alder/", "/wood/osage-orange/", "/wood/maple/", "/wood/oak/", "/wood/port-orford-cedar/", "/legal/cutlist/privacy/", "/glossary/trim-allowance/"];
const rows = [];
try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", {cacheDisabled: true});
  await send("Page.addScriptToEvaluateOnNewDocument", {source: 'localStorage.setItem("woodcuttool-lang", "en")'});
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", {width, height: 844, deviceScaleFactor: 1, mobile: width < 980});
    for (const route of routes) {
      await navigate(route);
      const metrics = await evaluate(`(() => ({
        overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        heading: document.querySelector("main h1")?.textContent,
        styles: getComputedStyle(document.querySelector("main h1")).fontSize,
        cssLoaded: [...document.querySelectorAll('link[rel="stylesheet"]')].every(link => !!link.sheet),
        blockingCss: document.querySelectorAll('link[rel="stylesheet"]').length,
      }))()`);
      assert.equal(metrics.overflow, 0, `${route} at ${width}px overflow`);
      assert(metrics.heading && metrics.cssLoaded, `${route}: missing content/styles`);
      if (/^\/(?:glossary|finishing-planner|edge-banding|cabinet-studio)\//.test(route)) assert.equal(metrics.blockingCss, 0, route);
      if (route === "/finishing-planner/") assert(await evaluate('document.querySelectorAll("#fp-parts fieldset").length > 0 && !!document.querySelector(".fp-result-card")'));
      if (route === "/edge-banding/") assert(await evaluate('document.querySelectorAll("#eb-parts fieldset").length > 0 && !!document.querySelector(".eb-success")'));
      if (route === "/cabinet-studio/") assert(await evaluate('!!document.querySelector("#cs-model polygon")'));
      if (width < 980) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
      } else {
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
        await waitFor('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
        assert(await evaluate('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")'));
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
      }
      rows.push({route, width, ...metrics});
      if ([390, 1440].includes(width) && /^\/(?:glossary\/countersink|finishing-planner|edge-banding\/finished-size-to-cut-size|cabinet-studio)\/$/.test(route)) {
        const screenshot = await send("Page.captureScreenshot", {format: "png"});
        writeFileSync(`${output}/${route.split("/").filter(Boolean).join("-")}-${width}.png`, Buffer.from(screenshot.data, "base64"));
      }
    }
  }
  // Exercise a real Cabinet Studio edit, save, reload and model control.
  await navigate("/cabinet-studio/");
  await evaluate('const input=document.querySelector("#cs-design-form [name=width]");input.value="1100";input.dispatchEvent(new Event("input",{bubbles:true}))');
  await waitFor('document.querySelector("#cs-model-size").textContent.startsWith("1,100")');
  await waitFor('JSON.parse(localStorage.getItem("woodcuttool.cabinet-studio.v1")).config.width === 1100');
  await navigate("/cabinet-studio/");
  assert.equal(await evaluate('document.querySelector("#cs-design-form [name=width]").value'), "1100");
  await evaluate('document.querySelector("#cs-explode").click()');
  assert.equal(await evaluate('document.querySelector("#cs-explode").getAttribute("aria-pressed")'), "true");
  await evaluate('document.querySelector("#cs-explode").click()');
  const noScript = [];
  for (const route of ["/glossary/countersink/", "/edge-banding/finished-size-to-cut-size/", "/finishing-planner/", "/cabinet-studio/"]) {
    await send("Emulation.setScriptExecutionDisabled", {value: true});
    await send("Page.navigate", {url: origin + route});
    await waitFor('document.readyState === "complete"');
    const size = await evaluate('getComputedStyle(document.querySelector("main h1")).fontSize');
    assert.equal(size, rows.find(row => row.route === route && row.width === 1440).styles, route);
    noScript.push({route, size});
    await send("Emulation.setScriptExecutionDisabled", {value: false});
  }
  await navigate("/glossary/countersink/");
  await evaluate('const select=document.querySelector(".language-picker select");select.value="zh-CN";select.dispatchEvent(new Event("change",{bubbles:true}))');
  await waitFor('!!window.WCTAppInitialized');
  assert.equal(await evaluate('document.documentElement.lang'), "zh-CN");
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({rows, noScript, cabinetEditAndSave: true, languageSwitch: true, errors}, null, 2));
  console.log(`Passed ${rows.length} responsive/menu checks, planner initialization, no-script styles, and language switching. Screenshots: ${output}`);
} finally {
  await send("Emulation.setScriptExecutionDisabled", {value: false});
  await send("Page.close");
  ws.close();
}
