import { writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

const output = args.output || "/tmp/woodcuttool-performance.json";
const origin = args.origin || process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4175";
const cdpPort = Number(args["cdp-port"] || process.env.WCT_CDP_PORT || 9337);
const runs = Math.max(1, Number(args.runs || process.env.WCT_PERF_RUNS || 3));
const deviceScaleFactor = Math.max(1, Number(args.dpr || process.env.WCT_PERF_DPR || 1));
const language = args.lang || "en";
const maxLcp = Number(args["max-lcp"] || 0);
const maxLoad = Number(args["max-load"] || 0);
const viewportWidth = Math.max(320, Number(args.width || 390));
const viewportHeight = Math.max(400, Number(args.height || 844));
const cacheDisabled = args.cache !== "warm";
const cpuRate = Math.max(1, Number(args.cpu || 4));
const latency = Math.max(0, Number(args.latency || 150));
const downloadThroughput = Math.max(1000, Number(args["download-kbps"] || 200) * 1000);
const routes = (args.routes || process.env.WCT_PERF_ROUTES || [
  "/",
  "/blog/",
  "/blog/record-actual-yield-after-project/",
  "/learn/",
  "/learn/plywood-cut-list-guide/",
  "/templates/",
  "/templates/bookshelf-cut-list/",
  "/glossary/",
  "/glossary/kerf/",
  "/troubleshooting/",
  "/checklists/",
  "/worksheets/",
  "/projects/",
  "/tools/",
  "/apps/",
  "/plywood-cut-calculator/",
].join(",")).split(",").map((route) => route.trim()).filter(Boolean);

// Truncated analytics labels are easy to map to nonexistent routes. A styled
// 404 is not evidence about the intended page's loading performance.
for (const route of args.preflight === "false" ? [] : routes) {
  const response = await fetch(`${origin}${route}`, { method: "HEAD", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}; refusing to measure an error page`);
}

const tab = await (await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
let documentStatus = 0;
let documentResponse = null;
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Network.responseReceived" && message.params.type === "Document") {
    documentStatus = message.params.response.status;
    const response = message.params.response;
    const headers = Object.fromEntries(Object.entries(response.headers).map(([key, value]) => [key.toLowerCase(), value]));
    documentResponse = { status: response.status, protocol: response.protocol, fromDiskCache: response.fromDiskCache || false,
      cacheControl: headers["cache-control"] || "", contentEncoding: headers["content-encoding"] || "",
      cacheStatus: headers["cf-cache-status"] || "", ray: headers["cf-ray"] || "" };
  }
  if (!message.id) return;
  const job = pending.get(message.id);
  if (!job) return;
  pending.delete(message.id);
  if (message.error) job.reject(new Error(JSON.stringify(message.error)));
  else job.resolve(message.result);
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression, awaitPromise = false) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Page evaluation failed");
  return result.result.value;
}

async function waitForReady() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (await evaluate('document.readyState === "complete" && location.href !== "about:blank" && performance.getEntriesByType("navigation")[0]?.loadEventEnd > 0')) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for page load");
}

await send("Page.enable");
await send("Network.enable");
await send("Network.setExtraHTTPHeaders", { headers: { DNT: "1" } });
await send("Network.setCacheDisabled", { cacheDisabled });
await send("Emulation.setDeviceMetricsOverride", { width: viewportWidth, height: viewportHeight, deviceScaleFactor, mobile: viewportWidth < 980 });
await send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency,
  downloadThroughput,
  uploadThroughput: 100_000,
  connectionType: "cellular4g",
});
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    try { localStorage.setItem("woodcuttool-lang", ${JSON.stringify(language)}); } catch {}
    window.__wctPerformance = { lcp: 0, lcpElement: "", lcpUrl: "", lcpSize: 0, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__wctPerformance.lcp = entry.startTime;
        window.__wctPerformance.lcpUrl = entry.url || "";
        window.__wctPerformance.lcpSize = entry.size;
        const element = entry.element;
        window.__wctPerformance.lcpElement = element
          ? [element.tagName.toLowerCase(), element.id ? "#" + element.id : "", element.className ? "." + String(element.className).trim().replace(/\\s+/g, ".") : ""].join("")
          : "";
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__wctPerformance.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__wctPerformance.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
  `,
});

const rows = [];
try {
  for (let run = 1; run <= runs; run += 1) {
    for (const route of routes) {
      await send("Page.navigate", { url: "about:blank" });
      await send("Page.bringToFront");
      await new Promise((resolve) => setTimeout(resolve, 100));
      documentStatus = 0;
      documentResponse = null;
      await send("Page.navigate", { url: `${origin}${route}` });
      await send("Page.bringToFront");
      await waitForReady();
      if (documentStatus < 200 || documentStatus >= 400) throw new Error(`${route}: document HTTP ${documentStatus}; refusing to measure an error page`);
      await new Promise((resolve) => setTimeout(resolve, 1_800));

      const data = await evaluate(`(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const paint = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]));
        const resources = performance.getEntriesByType("resource").map((entry) => ({
          path: new URL(entry.name).pathname,
          origin: new URL(entry.name).origin,
          type: entry.initiatorType,
          start: entry.startTime,
          responseStart: entry.responseStart,
          responseEnd: entry.responseEnd,
          transfer: entry.transferSize,
          encoded: entry.encodedBodySize,
          duration: entry.duration,
        }));
        const lcpResource = performance.getEntriesByType("resource").find(entry => entry.name === window.__wctPerformance.lcpUrl);
        const ttfb = navigation?.responseStart || 0;
        // Use the web.dev four-phase definition. Text has no resource phases;
        // its post-TTFB time includes HTML download and layout/paint work.
        // A preload can start before responseStart, so keep phases nonnegative.
        const loadStart = lcpResource ? Math.max(ttfb, lcpResource.startTime) : ttfb;
        const loadEnd = lcpResource ? Math.max(loadStart, lcpResource.responseEnd) : ttfb;
        const breakdown = {
          ttfb,
          resourceLoadDelay: loadStart - ttfb,
          resourceLoadDuration: loadEnd - loadStart,
          elementRenderDelay: Math.max(0, window.__wctPerformance.lcp - loadEnd),
        };
        const longTasks = window.__wctPerformance.longTasks;
        return {
          ...window.__wctPerformance,
          lcpBreakdown: breakdown,
          fcp: paint["first-contentful-paint"] || 0,
          ttfb: navigation?.responseStart || 0,
          htmlDownload: navigation ? navigation.responseEnd - navigation.responseStart : 0,
          navigationTiming: navigation ? {
            redirect: navigation.redirectEnd - navigation.redirectStart,
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            connection: navigation.connectEnd - navigation.connectStart,
            tcp: (navigation.secureConnectionStart || navigation.connectEnd) - navigation.connectStart,
            tls: navigation.secureConnectionStart ? navigation.connectEnd - navigation.secureConnectionStart : 0,
            requestWait: navigation.responseStart - navigation.requestStart,
            responseEnd: navigation.responseEnd,
            protocol: navigation.nextHopProtocol,
          } : null,
          domReady: navigation?.domContentLoadedEventEnd || 0,
          load: navigation?.loadEventEnd || 0,
          htmlTransfer: navigation?.transferSize || 0,
          resourceTransfer: resources.reduce((sum, entry) => sum + entry.transfer, 0),
          cssJsTransfer: resources.filter((entry) => /\\.(?:css|js)$/.test(entry.path)).reduce((sum, entry) => sum + entry.transfer, 0),
          imageTransfer: resources.filter((entry) => entry.type === "img").reduce((sum, entry) => sum + entry.transfer, 0),
          resourceCount: resources.length,
          domNodes: document.getElementsByTagName("*").length,
          horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
          overflowElements: [...document.querySelectorAll("body *")]
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return box.width > 0 && (box.right > innerWidth + 1 || box.left < -1);
            })
            .slice(0, 8)
            .map((element) => element.tagName.toLowerCase() + (element.id ? "#" + element.id : "") + (element.className ? "." + String(element.className).trim().replace(/\s+/g, ".") : "")),
          longTaskCount: longTasks.length,
          longTaskTotal: longTasks.reduce((sum, duration) => sum + duration, 0),
          longTaskMax: Math.max(0, ...longTasks),
          resources,
        };
      })()`);

      if (!data.lcp || !data.fcp) throw new Error(`${route}: no paint measurement; keep the audit tab in the foreground and rerun`);

      if (route === "/blog/") {
        data.blogSearchResponse = await evaluate(`new Promise((resolve) => {
          const input = document.querySelector("[data-blog-search-input]");
          if (!input) return resolve(0);
          const start = performance.now();
          input.value = "plywood";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const check = () => {
            const text = document.querySelector("[data-blog-search-status]")?.textContent || "";
            if (/matches|unavailable/i.test(text) || performance.now() - start > 5_000) return resolve(performance.now() - start);
            requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        })`, true);
      }

      rows.push({ route, run, documentResponse, ...data });
      console.log(`${route} run ${run}: LCP ${Math.round(data.lcp)} ms; load ${Math.round(data.load)} ms; TTFB ${Math.round(data.ttfb)} ms; transfer ${data.htmlTransfer + data.resourceTransfer} B`);
    }
  }

  const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const summary = routes.map(route => {
    const samples = rows.filter(row => row.route === route);
    return { route, lcp: median(samples.map(row => row.lcp)), load: median(samples.map(row => row.load)),
      lcpMax: Math.max(...samples.map(row => row.lcp)), loadMax: Math.max(...samples.map(row => row.load)),
      ttfb: median(samples.map(row => row.ttfb)),
      passed: (!maxLcp || samples.every(row => row.lcp < maxLcp)) && (!maxLoad || samples.every(row => row.load > 0 && row.load < maxLoad)) };
  });
  writeFileSync(output, `${JSON.stringify({
    scope: `${origin}; ${language} language, ${viewportWidth}x${viewportHeight} at ${deviceScaleFactor}x DPR, ${cacheDisabled ? "browser cache disabled" : "browser cache enabled"}, ${cpuRate}x CPU, ${latency}ms configured latency, ${downloadThroughput / 1000}KB/s download. DNS/TLS connections may be reused between navigations. Synthetic evidence, not production RUM.`,
    origin,
    routes,
    runs,
    budgets: { maxLcp, maxLoad, policy: "Every run must be below the enabled limit; 0 disables a limit." },
    summary,
    rows,
  }, null, 2)}\n`);
  if (summary.some(row => !row.passed)) {
    console.error("Performance budget exceeded:", summary.filter(row => !row.passed));
    process.exitCode = 1;
  }
} catch (error) {
  // Failed runs must remain inspectable, including any successfully collected
  // samples. Never silently replace a failed production audit with local data.
  writeFileSync(output, JSON.stringify({ origin, routes, runs, complete: false, error: error.message, rows }, null, 2) + "\n");
  throw error;
} finally {
  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await send("Page.close");
  ws.close();
}
