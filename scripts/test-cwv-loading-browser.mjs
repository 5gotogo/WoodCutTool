import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4188";
const port = Number(process.env.WCT_CDP_PORT || 9348);
const output = process.env.WCT_CWV_QA_OUTPUT || "/tmp/wct-cwv-loading-qa";
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
const routes = ["/wood/beech/", "/wood/east-indian-rosewood/", "/wood/elm/", "/plywood-cut-calculator/", "/apps/ductlab-hvac-duct-layout/", "/checklists/plywood-order-release/", "/legal/Casework/privacy/", "/blog/plywood-thickness-chart-guide/"];
const rows = [];
try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'localStorage.setItem("woodcuttool-lang", "en")' });
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: width < 980 });
    for (const route of routes) {
      await navigate(route);
      // Complete lazy images only after actually bringing each rail item into
      // view; document load does not wait for offscreen images.
      const imageCount = await evaluate('document.querySelectorAll(".app-screenshot-strip img").length');
      for (let index = 0; index < imageCount; index++) {
        await evaluate(`document.querySelectorAll(".app-screenshot-strip img")[${index}].scrollIntoView({behavior:"instant", block:"center", inline:"center"})`);
        await waitFor(`(() => {const img=document.querySelectorAll(".app-screenshot-strip img")[${index}]; return img.complete && img.naturalWidth > 0;})()`);
      }
      await evaluate('const rail=document.querySelector(".app-screenshot-strip"); if(rail) rail.scrollTo({left:0,behavior:"instant"}); window.scrollTo({top:0,behavior:"instant"})');
      const metrics = await evaluate(`(() => ({
        overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        heading: document.querySelector("main h1")?.textContent,
        cssLoaded: [...document.querySelectorAll('link[rel="stylesheet"]')].every(link => !!link.sheet),
        styles: getComputedStyle(document.querySelector("main h1")).fontSize,
        images: [...document.querySelectorAll(".app-screenshot-strip img")].map(img => ({
          src: img.currentSrc, complete: img.complete && img.naturalWidth > 0,
          width: img.getBoundingClientRect().width, naturalWidth: img.naturalWidth,
          aspect: Number(img.getAttribute("width")) / Number(img.getAttribute("height")),
          naturalAspect: img.naturalWidth / img.naturalHeight,
        })),
      }))()`);
      assert.equal(metrics.overflow, 0, `${route} at ${width}px overflow`);
      assert(metrics.heading && metrics.cssLoaded, `${route}: missing content/styles`);
      if (route.startsWith("/wood/")) {
        assert(await evaluate('!!document.querySelector("style[data-wood-styles]") && !document.querySelector("link[href=\\"/assets/wood.css\\"]")'));
      }
      for (const img of metrics.images) {
        assert(img.complete, `Screenshot failed: ${img.src}`);
        const pixelWidth = Number(img.src.match(/\/(\d+)x\d+bb\./)?.[1]);
        assert(pixelWidth <= 1080, `Oversized screenshot: ${img.src}`);
        assert(pixelWidth >= img.width, `Screenshot undersized for display: ${img.src}`);
        assert(Math.abs(img.aspect - img.naturalAspect) < 0.005, `Screenshot distorted: ${img.src}`);
      }
      if (width < 980) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
      } else {
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
        assert(await evaluate('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")'));
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
      }
      rows.push({ route, width, ...metrics });
      if ((route === "/wood/beech/" || route.startsWith("/apps/ductlab")) && (width === 390 || width === 1440)) {
        const screenshot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(`${output}/${route.startsWith("/wood") ? "beech" : "ductlab"}-${width}.png`, Buffer.from(screenshot.data, "base64"));
      }
    }
  }
  const densityChecks = [];
  for (const dpr of [2, 3]) {
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: dpr, mobile: true });
    await navigate("/apps/ductlab-hvac-duct-layout/");
    await evaluate('document.querySelector(".app-screenshot-strip img").scrollIntoView({behavior:"instant",block:"center"})');
    await waitFor('document.querySelector(".app-screenshot-strip img").complete && document.querySelector(".app-screenshot-strip img").naturalWidth > 0');
    const img = await evaluate('(() => {const img=document.querySelector(".app-screenshot-strip img");return {src:img.currentSrc,width:img.getBoundingClientRect().width};})()');
    const pixelWidth = Number(img.src.match(/\/(\d+)x\d+bb\./)?.[1]);
    assert(pixelWidth >= img.width * dpr && pixelWidth <= 1080, `Incorrect ${dpr}x screenshot: ${img.src}`);
    densityChecks.push({ dpr, ...img, pixelWidth });
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 844, deviceScaleFactor: 1, mobile: false });
  // Complete inline Wood styling remains available without JavaScript.
  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", { url: origin + "/wood/beech/" });
  await waitFor('document.readyState === "complete"');
  assert.equal(await evaluate('getComputedStyle(document.querySelector("h1")).fontSize'), rows.find(row => row.route === "/wood/beech/" && row.width === 1440).styles);
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  // On-demand language loader still binds the shared header and footer.
  await navigate("/wood/beech/");
  await evaluate('const select=document.querySelector(".language-picker select"); select.value="zh-CN"; select.dispatchEvent(new Event("change", {bubbles:true}))');
  await waitFor('!!window.WCTAppInitialized');
  assert.equal(await evaluate('localStorage.getItem("woodcuttool-lang")'), "zh-CN");
  assert.equal(await evaluate('document.documentElement.lang'), "zh-CN");
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, densityChecks, noScriptStyles: true, languageSwitch: true, errors }, null, 2));
  console.log(`Passed ${rows.length} responsive/image/menu checks, 2x/3x screenshot selection, no-script Wood styling, and on-demand language switch. Screenshots: ${output}`);
} finally {
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  await send("Page.close");
  ws.close();
}
