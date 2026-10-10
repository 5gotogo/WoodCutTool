import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4191";
const port = Number(process.env.WCT_CDP_PORT || 9352);
const output = process.env.WCT_CWV_REFERENCE_QA_OUTPUT || "/tmp/wct-cwv-reference-qa-1010";
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
const routes = ["/plywood-cut-calculator/", "/legal/PoolPilot/support/", "/apps/cutlist/", "/wood/chestnut/", "/", "/wood/honduran-mahogany/", "/wood-weight-calculator/", "/compare/baltic-birch-vs-plywood/", "/wood-database/", "/wood/elm/", "/wood/paulownia/", "/cabinet-cut-list-calculator/", "/wood/khaya/", "/wood/beech/", "/shelf-spacing-calculator/", "/compare/", "/compare/plywood-vs-mdf/", "/compare/cutlist-vs-excel-for-woodworking/", "/compare/porcelain-vs-ceramic-tile/", "/compare/quiltfit-vs-graph-paper-for-quilt-planning/"];
const inlineRoute = route => /^\/(?:compare|wood-database|legal|plywood-cut-calculator)\//.test(route);
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
        images: [...document.querySelectorAll(".comparison-hero-visual img, .article-lead-visual img, .visual-hub-hero img")].map(img => ({src: img.currentSrc, loaded: img.complete && img.naturalWidth > 0, width: img.clientWidth})),
      }))()`);
      assert.equal(metrics.overflow, 0, `${route} at ${width}px overflow`);
      assert(metrics.heading && metrics.cssLoaded, `${route}: missing content/styles`);
      if (inlineRoute(route)) assert.equal(metrics.blockingCss, 0, route);
      if (route.startsWith("/compare/")) assert(metrics.images.length && metrics.images.every(img => img.loaded), `${route}: lead image failed`);
      if (route === "/plywood-cut-calculator/") assert(await evaluate('document.querySelector("#plywood-form").dataset.workflowReady === "true"'));
      if (width < 980) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
      } else {
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
        assert(await evaluate('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")'));
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
      }
      rows.push({route, width, ...metrics});
      if ([390, 1440].includes(width) && inlineRoute(route)) {
        const screenshot = await send("Page.captureScreenshot", {format: "png"});
        writeFileSync(`${output}/${route.split("/").filter(Boolean).join("-")}-${width}.png`, Buffer.from(screenshot.data, "base64"));
      }
    }
  }
  const noScript = [];
  for (const route of routes.filter(inlineRoute)) {
    await send("Emulation.setScriptExecutionDisabled", {value: true});
    await send("Page.navigate", {url: origin + route});
    await waitFor('document.readyState === "complete"');
    const size = await evaluate('getComputedStyle(document.querySelector("main h1")).fontSize');
    assert.equal(size, rows.find(row => row.route === route && row.width === 1440).styles, route);
    noScript.push({route, size});
    await send("Emulation.setScriptExecutionDisabled", {value: false});
  }
  const densityImages = [];
  for (const dpr of [1, 2, 3]) {
    await send("Emulation.setDeviceMetricsOverride", {width: 390, height: 844, deviceScaleFactor: dpr, mobile: true});
    for (const route of ["/compare/baltic-birch-vs-plywood/", "/compare/", "/compare/plywood-vs-mdf/"]) {
      await send("Network.clearBrowserCache");
      await navigate(route);
      const images = await evaluate(`(() => {
        const img = document.querySelector('.comparison-hero-visual img, .article-lead-visual img, .visual-hub-hero img');
        const candidates = [img.src, img.src.replace('.webp', '-800.webp')];
        const paths = performance.getEntriesByType('resource').filter(e => candidates.includes(e.name)).map(e => new URL(e.name).pathname);
        return {src: img.currentSrc, original: img.getAttribute('src'), srcset: img.srcset, width: img.clientWidth, loaded: img.complete && img.naturalWidth > 0, paths};
      })()`);
      assert(images.loaded && images.srcset.includes('800w'));
      assert.equal(images.paths.length, 1, `${route}: duplicate image request at DPR ${dpr}`);
      assert(images.src.endsWith(dpr === 3 ? images.original : '-800.webp'));
      densityImages.push({route, dpr, ...images});
    }
  }
  await send("Emulation.setDeviceMetricsOverride", {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
  const languages = [];
  for (const route of ["/compare/baltic-birch-vs-plywood/", "/wood-database/", "/legal/PoolPilot/support/", "/plywood-cut-calculator/"]) {
    await navigate(route);
    await evaluate('const select=document.querySelector(".language-picker select");select.value="zh-CN";select.dispatchEvent(new Event("change",{bubbles:true}))');
    await waitFor('!!window.WCTAppInitialized');
    assert.equal(await evaluate('document.documentElement.lang'), "zh-CN");
    languages.push(route);
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({rows, noScript, densityImages, languages, errors}, null, 2));
  console.log(`Passed ${rows.length} responsive/menu checks, no-script styles, responsive preload requests and Chinese language switching. Screenshots: ${output}`);
} finally {
  await send("Emulation.setScriptExecutionDisabled", {value: false});
  await send("Page.close");
  ws.close();
}
