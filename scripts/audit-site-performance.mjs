import { writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

const output = args.output || "/tmp/woodcuttool-performance.json";
const origin = args.origin || process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4175";
const cdpPort = Number(args["cdp-port"] || process.env.WCT_CDP_PORT || 9337);
const runs = Math.max(1, Number(args.runs || process.env.WCT_PERF_RUNS || 3));
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

const tab = await (await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
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
    if (await evaluate('document.readyState === "complete"')) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for page load");
}

await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Emulation.setCPUThrottlingRate", { rate: 4 });
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: 200_000,
  uploadThroughput: 100_000,
  connectionType: "cellular4g",
});
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    window.__wctPerformance = { lcp: 0, lcpElement: "", cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__wctPerformance.lcp = entry.startTime;
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      await send("Page.navigate", { url: `${origin}${route}` });
      await waitForReady();
      await new Promise((resolve) => setTimeout(resolve, 1_800));

      const data = await evaluate(`(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const paint = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]));
        const resources = performance.getEntriesByType("resource").map((entry) => ({
          path: new URL(entry.name).pathname,
          type: entry.initiatorType,
          transfer: entry.transferSize,
          encoded: entry.encodedBodySize,
          duration: entry.duration,
        }));
        const longTasks = window.__wctPerformance.longTasks;
        return {
          ...window.__wctPerformance,
          fcp: paint["first-contentful-paint"] || 0,
          ttfb: navigation?.responseStart || 0,
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
          resources: resources.filter((entry) => entry.path.startsWith("/assets/")),
        };
      })()`);

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

      rows.push({ route, run, ...data });
      console.log(`${route} run ${run}: LCP ${Math.round(data.lcp)} ms; FCP ${Math.round(data.fcp)} ms; long tasks ${Math.round(data.longTaskTotal)} ms; transfer ${data.htmlTransfer + data.resourceTransfer} B`);
    }
  }

  writeFileSync(output, `${JSON.stringify({
    scope: "Local gzip preview; 390x844, cold cache, 4x CPU, 150ms latency, 200KB/s download. Synthetic evidence, not production RUM.",
    origin,
    routes,
    runs,
    rows,
  }, null, 2)}\n`);
} finally {
  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await send("Page.close");
  ws.close();
}
