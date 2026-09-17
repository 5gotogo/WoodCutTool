import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4188";
const cdpPort = Number(process.env.WCT_CDP_PORT || 9337);
const output = process.env.WCT_LOADING_QA_OUTPUT || "/tmp/wct-loading-qa";
mkdirSync(output, { recursive: true });
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
const routes = ["/worksheets/project-closeout-record/", "/cabinet-door-calculator/", "/templates/plywood-chair-cut-list/", "/blog/french-cleat-wall-plywood-layout/", "/troubleshooting/finished-parts-chip-during-handling/"];
const rows = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await sleep(100);
  }
  throw new Error(`Timed out: ${expression}`);
}
async function navigate(route) {
  await send("Page.navigate", { url: "about:blank" });
  await send("Page.navigate", { url: origin + route });
  await waitForReady();
  await waitFor('!!document.querySelector(".site-header")');
}
try {
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
    for (const route of routes) {
      await navigate(route);
      const result = await evaluate(`({
        overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
        h1: document.querySelector("h1")?.textContent,
        cssLoaded: [...document.querySelectorAll('link[rel="stylesheet"]')].every(l => !!l.sheet),
        fontSize: getComputedStyle(document.querySelector("h1")).fontSize
      })`);
      assert.equal(result.overflow, 0, `${route} overflow at ${width}`);
      assert.deepEqual(result.brokenImages, [], `${route} image failed`);
      assert(result.cssLoaded && result.h1, `${route} missing styles/content`);
      if (width < 500) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
      }
      if (width === 390 || width === 1440) {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(`${output}/${route.split("/").filter(Boolean).pop()}-${width}.png`, Buffer.from(shot.data, "base64"));
      }
      rows.push({ route, width, ...result });
    }
  }
  for (const route of ["/cabinet-door-calculator/", "/cabinet-cut-list-calculator/", "/drawer-box-calculator/"]) {
    await navigate(route);
    assert.equal(await evaluate('!!globalThis.WoodCutToolComponentProject'), false, 'Project script loaded before interaction');
    assert.equal(await evaluate('performance.getEntriesByType("resource").some(r => r.name.endsWith("/component-builder.js"))'), false);
    await evaluate('localStorage.removeItem("woodcuttool-component-project-v1")');
    assert(await evaluate('!!document.querySelector("[data-cut-list]")?.textContent.trim()'), 'Missing calculated parts');
    if (route.includes("cabinet-door")) {
      assert(await evaluate('document.querySelector("[data-construction-result]").textContent.includes("15.44")'), 'Wrong door width');
      await evaluate('const field=document.querySelector("[name=openingWidth]");field.value="40";field.dispatchEvent(new Event("input",{bubbles:true}))');
      assert(await evaluate('document.querySelector("[data-construction-result]").textContent.includes("20.44")'), 'Door result did not update');
    }
    // A failed first request must leave a usable retry and persist exactly once.
    await send("Network.setBlockedURLs", { urls: ["*/assets/component-builder.js"] });
    await evaluate('document.querySelector("[data-add-component-external]").click()');
    await waitFor('document.querySelector("[data-add-component-external]").textContent.includes("try again")');
    assert.equal(await evaluate('document.querySelector("[data-add-component-external]").disabled'), false);
    await send("Network.setBlockedURLs", { urls: [] });
    await evaluate('document.querySelector("[data-add-component-external]").click();document.querySelector("[data-add-component-external]").click()');
    await waitFor('document.querySelector("[data-add-component-external]").textContent === "Added to component project"');
    const saved = await evaluate('JSON.parse(localStorage.getItem("woodcuttool-component-project-v1"))');
    assert.equal(saved.instances.length, 1, 'Double click saved duplicate components');
    assert(saved.instances[0].parts.length > 0);
    await navigate(route);
    assert.equal(await evaluate('JSON.parse(localStorage.getItem("woodcuttool-component-project-v1")).instances.length'), 1);
  }
  writeFileSync(`${output}/results.json`, JSON.stringify(rows, null, 2));
  console.log(`Passed ${rows.length} responsive checks, three calculator save/retry/reload flows. Screenshots: ${output}`);
} finally {
  await send("Network.setBlockedURLs", { urls: [] });
  await send("Page.close");
  ws.close();
}
