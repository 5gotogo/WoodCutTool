import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";

const upstreamOrigin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4198";
const port = process.env.WCT_CDP_PORT || "9359";
const output = process.env.WCT_PREFETCH_OUTPUT || "/tmp/wct-navigation-prefetch.json";
const source = "/troubleshooting/base-cabinets-uneven-floor/";
const target = "/learn/field-measurement-checklist-before-cut-list/";
const documentDelay = 1200;
const targetBody = readFileSync(new URL(`..${target}index.html`, import.meta.url), "utf8")
  .replace("</body>", '<script>window.__prefetchExecutionCount = (window.__prefetchExecutionCount || 0) + 1;</script></body>');
// Speculative document fetches run in the browser process and do not pass
// through a page target's Fetch interception. Measure at a real HTTP server.
const requests = [], errors = [], rows = [], preloading = [];
const server = createServer(async (request, response) => {
  const row = { path: new URL(request.url, "http://localhost").pathname, purpose: request.headers["sec-purpose"] || "", completed: false };
  requests.push(row);
  try {
    if (row.path === target) {
      await new Promise(resolve => setTimeout(resolve, documentDelay));
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate", "Content-Encoding": "gzip" });
      response.end(gzipSync(targetBody));
    } else if (/^\/(?:go|api)\//.test(row.path)) {
      response.writeHead(403); response.end();
    } else {
      const upstream = await fetch(upstreamOrigin + request.url, { headers: { DNT: "1", "Accept-Encoding": "identity" } });
      response.writeHead(upstream.status, { "Content-Type": upstream.headers.get("content-type") || "application/octet-stream", "Cache-Control": "public, max-age=0, must-revalidate" });
      response.end(Buffer.from(await upstream.arrayBuffer()));
    }
    row.completed = true;
  } catch (error) { errors.push(error.message); response.writeHead(502); response.end(); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method?.startsWith("Preload.")) preloading.push({ method: message.method, ...message.params });
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (!message.id) return;
  const job = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) job.reject(Error(JSON.stringify(message.error))); else job.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw Error(`Timeout: ${expression}`);
}
async function navigate(path) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 0, y: 0 });
  await send("Page.navigate", { url: origin + path });
  await send("Page.bringToFront");
  await waitFor(`location.pathname === ${JSON.stringify(path)} && document.readyState === "complete"`);
  await evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
}
async function hover(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
  const box = await evaluate(`(() => { const a = document.querySelector(${JSON.stringify(selector)}); const b = a.getBoundingClientRect(); const x=b.x+b.width/2,y=b.y+b.height/2; return {x,y,hit:document.elementFromPoint(x,y)?.closest('a')===a}; })()`);
  assert(box.hit, `Hover must hit the actual link: ${selector}`);
  delete box.hit;
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...box });
}
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Preload.enable");
  await send("Network.setExtraHTTPHeaders", { headers: { DNT: "1" } });
  await send("Network.setCacheDisabled", { cacheDisabled: false });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    try {
      localStorage.setItem('woodcuttool-lang','en');
      const mode = sessionStorage.getItem('wct-prefetch-test');
      if (mode === 'unsupported') HTMLScriptElement.supports = () => false;
      if (mode === 'saveData' || mode === '2g') Object.defineProperty(navigator, 'connection', {value:{saveData:mode==='saveData',effectiveType:mode==='2g'?'2g':'4g'}});
    } catch {}
    window.__testLcp = 0;
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.__testLcp = e.startTime; }).observe({type:'largest-contentful-paint',buffered:true});
  ` });

  // Eligibility is exercised through real browser hovers, not a copy of the
  // matching code. None may reach download/API endpoints or an external host.
  await navigate(source);
  await waitFor("!!document.querySelector('script[data-navigation-prefetch]')");
  assert.equal(requests.filter(r => r.purpose.includes("prefetch")).length, 0, "Initial load must not prefetch");
  // Use a distinct destination: Chromium can coalesce candidates when another
  // eligible link on the page points at the same URL as an excluded link.
  const blockedTarget = "/learn/prefetch-excluded-test/";
  const excluded = [
    { href: "/go/cutlist/" }, { href: "/api/conversion-report/" }, { href: "/" },
    { href: source }, { href: `${blockedTarget}?source=test` }, { href: `${blockedTarget}#steps` },
    { href: `https://example.com${blockedTarget}` }, { href: blockedTarget, download: "guide" },
    { href: blockedTarget, target: "_blank" }, { href: blockedTarget, rel: "nofollow" },
    { href: blockedTarget, "data-no-prefetch": "" }, { href: "/assets/test.json" },
  ];
  for (const attributes of excluded) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 0, y: 0 });
    await evaluate(`(() => { document.querySelector('#prefetch-exclusion')?.remove(); const a=document.createElement('a'); a.id='prefetch-exclusion'; a.textContent='Test link'; for(const [key,value] of Object.entries(${JSON.stringify(attributes)})) a.setAttribute(key,value); a.style.cssText='position:fixed;top:150px;left:50px;z-index:9999;background:white;padding:20px'; document.body.appendChild(a); })()`);
    await evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
    await hover("#prefetch-exclusion");
    await new Promise(resolve => setTimeout(resolve, 350));
    assert.equal(requests.filter(r => r.purpose.includes("prefetch")).length, 0, JSON.stringify(attributes));
  }
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 0, y: 0 });
  await evaluate("document.querySelector('#prefetch-exclusion').remove()");

  for (const mode of ["unsupported", "saveData", "2g"]) {
    await evaluate(`sessionStorage.setItem('wct-prefetch-test',${JSON.stringify(mode)})`);
    await navigate(source);
    assert.equal(await evaluate("!!document.querySelector('script[data-navigation-prefetch]')"), false, mode);
  }

  for (let run = 1; run <= 3; run++) for (const prefetch of [false, true]) {
    await evaluate(`sessionStorage.setItem('wct-prefetch-test',${JSON.stringify(prefetch ? "" : "unsupported")})`);
    await send("Network.clearBrowserCache");
    await navigate(source);
    const start = requests.length;
    const link = `main a[href='${target}']`;
    if (prefetch) {
      await waitFor("!!document.querySelector('script[data-navigation-prefetch]')");
      await hover(link);
      for (let i = 0; i < 200 && !requests.slice(start).some(r => r.path === target && r.completed); i++) await new Promise(resolve => setTimeout(resolve, 50));
      assert(requests.slice(start).some(r => r.path === target && r.purpose.includes("prefetch") && r.completed), "A real hover must prefetch the document");
      assert.equal(await evaluate("window.__prefetchExecutionCount || 0"), 0, "Prefetch must not execute the destination's scripts");
    }
    await evaluate(`document.querySelector(${JSON.stringify(link)}).click()`);
    await waitFor(`location.pathname === ${JSON.stringify(target)} && document.readyState === "complete"`);
    await new Promise(resolve => setTimeout(resolve, 350));
    const result = await evaluate(`(() => { const n=performance.getEntriesByType('navigation')[0]; return {ttfb:n.responseStart,lcp:window.__testLcp,deliveryType:n.deliveryType,executionCount:window.__prefetchExecutionCount,overflow:document.documentElement.scrollWidth-innerWidth}; })()`);
    assert.equal(result.executionCount, 1);
    assert.equal(result.overflow, 0);
    assert(result.lcp > 0);
    const targetRequests = requests.slice(start).filter(r => r.path === target);
    assert.equal(targetRequests.length, 1, "Click must reuse a completed prefetch without a second HTML request");
    assert.equal(result.deliveryType === "navigational-prefetch", prefetch);
    if (prefetch) assert(result.ttfb < documentDelay / 2, "Navigation still waited for the controlled HTML response");
    else assert(result.ttfb >= documentDelay, "Baseline must include the controlled response wait");
    rows.push({ run, prefetch, htmlRequests: targetRequests.length, ...result });
  }
  // Both generated runtimes must install the same rules, including mobile Wood.
  await evaluate("sessionStorage.removeItem('wct-prefetch-test')");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate("/wood/mun-ebony/");
  await waitFor("!!document.querySelector('script[data-navigation-prefetch]')");
  assert.equal(await evaluate("document.documentElement.scrollWidth-innerWidth"), 0);
  assert.deepEqual(errors, []);
  writeFileSync(output, JSON.stringify({ scope: "Controlled 1200ms HTML response delay; same bytes and must-revalidate headers; one foreground Chrome client. Prefetch does not speed up a cold external landing.", documentDelay, excluded, disabledModes: ["unsupported", "saveData", "2g"], rows, errors }, null, 2) + "\n");
  console.log(`Passed 12 excluded link types, unsupported/Save-Data/2G fallback, Wood mobile, and six real navigations: ${JSON.stringify(rows)}`);
} catch (error) {
  writeFileSync(output, JSON.stringify({ complete: false, error: error.message, requests, rows, errors, preloading }, null, 2) + "\n");
  throw error;
} finally {
  await send("Page.close"); ws.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
