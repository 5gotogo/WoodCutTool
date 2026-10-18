import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4196";
const port = process.env.WCT_CDP_PORT || "9357";
const output = process.env.WCT_LOADING_QA_OUTPUT || "/tmp/wct-loading-qa";
const routes = ["/checklists/", "/privacy-policy/", "/apps/cutlist/", "/learn/entryway-shoe-cabinet-planning-guide/", "/blog/record-actual-yield-after-project/", "/projects/base-cabinet/", "/templates/bookshelf-cut-list/", "/board-foot-calculator/"];
const originals = new Map(routes.map(route => [route, execFileSync("git", ["show", `HEAD:${route.slice(1)}index.html`]).toString("base64")]));
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
let id = 0, baseline = false, fallback = false;
const pending = new Map(), errors = [];
ws.addEventListener("message", async ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === "Fetch.requestPaused") {
    const { requestId, request, resourceType } = message.params;
    const path = new URL(request.url).pathname;
    if (baseline && resourceType === "Document" && originals.has(path)) {
      await send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/html; charset=utf-8" }], body: originals.get(path) });
    } else if (fallback && resourceType === "Document") {
      // Match older browsers that skip typed AVIF preload hints as well as
      // picture sources. CDP's disabled image types alone affects only picture.
      const html = await (await fetch(request.url)).text();
      await send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "text/html; charset=utf-8" }], body: Buffer.from(html.replace(/<link\b[^>]*rel="preload"[^>]*type="image\/avif"[^>]*>/g, "")).toString("base64") });
    } else await send("Fetch.continueRequest", { requestId });
    return;
  }
  if (!message.id) return;
  const job = pending.get(message.id);
  if (!job) return;
  pending.delete(message.id);
  if (message.error) job.reject(Error(JSON.stringify(message.error))); else job.resolve(message.result);
});
function send(method, params = {}) { return new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); }); }
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 50)); }
  throw Error(`Timeout: ${expression}`);
}
async function navigate(route) {
  await send("Page.navigate", { url: "about:blank" });
  await send("Page.navigate", { url: origin + route });
  await waitFor('location.href !== "about:blank" && document.readyState === "complete" && !!document.querySelector(".site-header")');
  await waitFor('[...document.querySelectorAll("main img[loading=eager]")].every(img => img.complete && img.naturalWidth > 0)');
}
const snapshot = `(() => {
  const seen = new Set(), props = ["display", "position", "fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "margin", "padding", "border", "borderRadius", "maxWidth", "minHeight", "gap", "gridTemplateColumns", "objectFit", "aspectRatio"];
  return [...document.querySelectorAll("main, main *, .site-header, .site-header *")].filter(e => {
    const key = e.tagName + "." + e.className;
    if (["SCRIPT", "STYLE", "LINK", "PICTURE", "SOURCE", "SVG", "PATH"].includes(e.tagName) || seen.has(key)) return false;
    seen.add(key); return true;
  }).map(e => ({ tag: e.tagName, className: String(e.className), styles: Object.fromEntries(props.map(p => [p, getComputedStyle(e)[p]])) }));
})()`;
const rows = [], images = [];
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*", resourceType: "Document" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'try { localStorage.setItem("woodcuttool-lang", "en"); } catch {}' });
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 980 });
    for (const route of routes) {
      baseline = true; await navigate(route);
      const before = await evaluate(snapshot);
      baseline = false; await navigate(route);
      const after = await evaluate(snapshot);
      if (JSON.stringify(after) !== JSON.stringify(before)) writeFileSync(`${output}/style-mismatch.json`, JSON.stringify({ route, width, before, after }, null, 2));
      assert(JSON.stringify(after) === JSON.stringify(before), `${route}: computed styles changed at ${width}px; inspect ${output}/style-mismatch.json`);
      assert.equal(await evaluate('document.querySelectorAll("link[rel=stylesheet]").length'), 0, route);
      assert.equal(await evaluate('Math.max(0, document.documentElement.scrollWidth - innerWidth)'), 0, route);
      assert(await evaluate(`(() => {
        const entries = performance.getEntriesByType("resource");
        const logos = entries.filter(e => new URL(e.name).pathname === "/assets/icons/brand-icon.webp");
        return logos.length === 1 && logos[0].initiatorType === "link" && logos[0].startTime < performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd;
      })()`), `${route}: the parser must preload the logo with one request`);
      assert(await evaluate(`(() => {
        const bootstrap = performance.getEntriesByType("resource").filter(e => new URL(e.name).pathname === "/assets/site-navigation.js");
        return bootstrap.length === 1 && bootstrap[0].initiatorType === "link";
      })()`), `${route}: navigation preload must be reused by its deferred script`);
      assert(await evaluate(`(() => {
        if (!document.querySelector('script[src="/assets/app.js"]')) return true;
        const app = performance.getEntriesByType("resource").filter(e => new URL(e.name).pathname === "/assets/app.js");
        return app.length === 1 && app[0].initiatorType === "link";
      })()`), `${route}: calculator preload must be reused by its deferred script`);
      rows.push({ route, width, stylesMatch: true });
      if (width === 1440 && route.includes("entryway")) {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(`${output}/entryway-desktop.png`, Buffer.from(shot.data, "base64"));
      }
    }
  }
  for (fallback of [false, true]) {
    await send("Emulation.setDisabledImageTypes", { imageTypes: fallback ? ["avif"] : [] });
    for (const dpr of [1, 2, 3]) {
      await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: dpr, mobile: true });
      for (const route of [...routes.slice(2, 5), routes[6]]) {
        await navigate(route);
        const image = await evaluate(`(() => {
          const img = document.querySelector(".article-wood-photo-hero img, .cutlist-hero-shot img, .template-page-visual img"), source = img.closest("picture").querySelector("source");
          const sets = [img.srcset, ...[...img.closest("picture").querySelectorAll("source")].map(s => s.srcset)].filter(Boolean).join(", ");
          const candidates = [img.src, ...sets.split(", ").filter(Boolean).map(item => new URL(item.split(" ")[0], location.href).href)];
          const preload = document.querySelector("link[rel=preload][as=image]");
          return { src: img.currentSrc, loaded: img.complete && img.naturalWidth > 0,
            requests: performance.getEntriesByType("resource").filter(entry => candidates.includes(entry.name)).map(entry => entry.name),
            preloadMatches: ${fallback} || (preload.imageSrcset ? preload.imageSrcset === source.srcset && preload.imageSizes === source.sizes : preload.href === new URL(source.srcset, location.href).href) };
        })()`);
        assert(image.loaded && image.preloadMatches, route);
        assert.equal(image.requests.length, 1, `${route}: duplicate hero`);
        assert.equal(image.requests[0], image.src, route);
        assert(image.src.endsWith(fallback ? ".webp" : ".avif"), route);
        images.push({ route, dpr, fallback, ...image });
      }
    }
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, images, errors }, null, 2));
  console.log(`Passed ${rows.length} before/after computed-style checks and ${images.length} AVIF/WebP single-request checks.`);
} finally {
  await send("Emulation.setDisabledImageTypes", { imageTypes: [] });
  await send("Fetch.disable"); await send("Page.close"); ws.close();
}
