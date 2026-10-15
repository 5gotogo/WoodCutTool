import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4198";
const port = process.env.WCT_CDP_PORT || "9359";
const output = process.env.WCT_IMAGE_QA_OUTPUT || "/tmp/wct-lcp-image-qa";
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map(), errors = [], rows = [];
let emulateLegacyPreload = false;
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Fetch.requestPaused") {
    (async () => {
      const { requestId, responseStatusCode, responseHeaders } = message.params;
      const response = await send("Fetch.getResponseBody", { requestId });
      let body = response.base64Encoded ? Buffer.from(response.body, "base64").toString() : response.body;
      // Chrome's disabled-image-types switch affects picture selection but
      // not typed preloads. Model the legacy browser ignoring that unsupported
      // preload too; leave source selection to the browser's own image parser.
      if (emulateLegacyPreload) body = body.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*type="image\/avif")[^>]*>/g, "");
      await send("Fetch.fulfillRequest", { requestId, responseCode: responseStatusCode,
        responseHeaders: responseHeaders.filter(header => !/^(?:content-length|content-encoding)$/i.test(header.name)),
        body: Buffer.from(body).toString("base64") });
    })().catch(error => errors.push(error.message));
    return;
  }
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (!message.id) return;
  const job = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) job.reject(new Error(JSON.stringify(message.error)));
  else job.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const key = ++id; pending.set(key, { resolve, reject });
    ws.send(JSON.stringify({ id: key, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout: ${expression}`);
}
const routes = ["/cabinet-cut-list-calculator/", "/crown-molding-angle-calculator/", "/roof-pitch-calculator/", "/compare/track-saw-vs-panel-saw/", "/compare/track-saw-vs-circular-saw/", "/compare/", "/compare/porcelain-vs-ceramic-tile/", "/compare/quiltfit-vs-graph-paper-for-quilt-planning/"];
try {
  await send("Page.enable"); await send("Network.enable"); await send("Runtime.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'try {localStorage.setItem("woodcuttool-lang","en")} catch {}' });
  await send("Fetch.enable", { patterns: [{ resourceType: "Document", requestStage: "Response" }] });
  for (const fallback of [false, true]) {
    emulateLegacyPreload = fallback;
    // Emulate browsers that do not advertise AVIF support, including preload.
    await send("Emulation.setDisabledImageTypes", { imageTypes: fallback ? ["avif"] : [] });
    for (const dpr of [1, 2, 3]) {
      await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: dpr, mobile: true });
      for (const route of routes) {
        await send("Page.navigate", { url: "about:blank" });
        await send("Page.navigate", { url: origin + route });
        await waitFor('document.readyState === "complete" && !!document.querySelector(".visual-frame img")');
        const data = await evaluate(`(() => {
          const img = document.querySelector('.visual-frame img'), picture = img.closest('picture');
          const source = picture.querySelector('source'), preload = document.querySelector('link[rel=preload][as=image]');
          const candidates = ${fallback} ? img.srcset : source.srcset;
          const options = candidates.split(', ').map(item => {const [path, width] = item.split(' '); return {url:new URL(path, location.href).href, width:parseInt(width)};});
          const all = new Set((img.srcset + ', ' + source.srcset).split(', ').map(item=>new URL(item.split(' ')[0], location.href).href));
          return {src:img.currentSrc, loaded:img.complete && img.naturalWidth>0,
            expected:options.find(item=>item.width>=358*devicePixelRatio)?.url || options.at(-1).url,
            matchingPreload:${fallback} ? !preload : source.srcset===preload.imageSrcset && source.sizes===preload.imageSizes && preload.type==='image/avif',
            requests:performance.getEntriesByType('resource').filter(entry=>all.has(entry.name)).map(entry=>entry.name),
            overflow:Math.max(0, document.documentElement.scrollWidth-innerWidth),
            fillsFigure:Math.abs(img.getBoundingClientRect().width-img.closest('figure').clientWidth)<2};
        })()`);
        assert(data.loaded && data.matchingPreload && data.fillsFigure, `${route}: image rendering`);
        assert.equal(data.src, data.expected, `${route} DPR ${dpr}, fallback ${fallback}`);
        assert.deepEqual(data.requests, [data.src], `${route}: duplicate/unsupported hero request`);
        assert.equal(data.overflow, 0, route);
        rows.push({ route, dpr, fallback, ...data });
      }
    }
  }
  await send("Emulation.setDisabledImageTypes", { imageTypes: [] });
  await send("Fetch.disable");
  for (const width of [390,1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width<980 });
    for (const route of [routes[0], routes[3]]) {
      await send("Page.navigate", { url: origin + route });
      await waitFor('document.readyState === "complete" && !!document.querySelector(".visual-frame img")');
      const shot = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(`${output}/${route.split('/').filter(Boolean).join('-')}-${width}.png`, Buffer.from(shot.data, "base64"));
    }
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, errors }, null, 2));
  console.log(`Passed ${rows.length} AVIF/WebP fallback, DPR, single-request and layout checks. ${output}`);
} finally {
  await send("Emulation.setDisabledImageTypes", { imageTypes: [] });
  await send("Page.close"); ws.close();
}
