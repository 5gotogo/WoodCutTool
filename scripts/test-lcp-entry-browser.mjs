import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4196";
const port = process.env.WCT_CDP_PORT || "9357";
const output = process.env.WCT_ENTRY_QA_OUTPUT || "/tmp/wct-entry-qa";
const baseline = process.env.WCT_ENTRY_BASELINE;
const reference = process.env.WCT_ENTRY_REFERENCE ? JSON.parse(readFileSync(process.env.WCT_ENTRY_REFERENCE, "utf8")) : null;
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
const routes = ["/", "/crown-molding-angle-calculator/", "/cabinet-cut-list-calculator/", "/shelf-spacing-calculator/", "/roof-pitch-calculator/", "/blog/"];
const styleSnapshot = `(() => {
  const selectors = ["main h1", ".lead", ".hero-subtitle", ".hero-actions", ".hero-planner", ".hero-cut-form", ".lab-stats", ".page-hero", ".visual-frame", ".tool-panel", ".input-grid", ".result-panel", ".section", ".article-panel", ".site-header", ".site-footer", ".mega-menu", ".blog-main", "main input", "main button", "main table"];
  const props = ["display", "color", "background-color", "font-size", "font-weight", "line-height", "padding", "margin", "border-radius", "grid-template-columns", "max-width"];
  return Object.fromEntries(selectors.map(selector => [selector, [...document.querySelectorAll(selector)].slice(0, 4).map(element => {
    const css = getComputedStyle(element);
    return Object.fromEntries(props.map(prop => [prop, css.getPropertyValue(prop)]));
  })]));
})()`;
const rows = [];
try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setExtraHTTPHeaders", { headers: { DNT: "1" } });
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'localStorage.setItem("woodcuttool-lang", "en")' });
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: width < 980 });
    for (const route of routes) {
      await navigate(route);
      assert.equal(await evaluate('Math.max(0, document.documentElement.scrollWidth - innerWidth)'), 0, `${route}: ${width}px overflow`);
      if (!baseline) assert.equal(await evaluate('document.querySelectorAll("link[rel=stylesheet]").length'), 0, route);
      if (width < 980) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "false");
      } else {
        await evaluate('document.querySelector(".nav-menu-toggle").click()');
        await waitFor('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
      }
      const styles = await evaluate(styleSnapshot);
      if (reference) assert.deepEqual(styles, reference.rows.find(row => row.route === route && row.width === width).styles, `${route}: computed styles changed at ${width}px`);
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
      rows.push({ route, width, styles });
      if ([390, 1440].includes(width) && ["/", "/crown-molding-angle-calculator/", "/blog/"].includes(route)) {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(`${output}/${route === "/" ? "home" : route.split("/")[1]}-${width}.png`, Buffer.from(shot.data, "base64"));
      }
      if (route === "/crown-molding-angle-calculator/") {
        const before = await evaluate('document.querySelector("[data-construction-result]").textContent');
        await evaluate('const input=document.querySelector("input[name=corner]");input.value="100";input.dispatchEvent(new Event("input",{bubbles:true}))');
        await waitFor(`document.querySelector("[data-construction-result]").textContent !== ${JSON.stringify(before)}`);
        assert(await evaluate('!document.querySelector("[data-construction-result]").textContent.includes("NaN")'));
      }
      if (route === "/") {
        await evaluate('document.querySelector("[data-preset=shelves]").click()');
        assert(await evaluate('document.querySelector("[data-preset=shelves]").classList.contains("active")'));
      }
    }
  }
  await navigate("/blog/");
  await evaluate('const input=document.querySelector("[data-blog-search-input]");input.value="plywood";input.dispatchEvent(new Event("input",{bubbles:true}))');
  await waitFor('/matches/i.test(document.querySelector("[data-blog-search-status]").textContent)');
  assert(await evaluate('document.querySelectorAll("[data-blog-search-results] a").length > 0'));
  const densityImages = [];
  if (!baseline) for (const dpr of [1, 2, 3]) {
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: dpr, mobile: true });
    for (const route of ["/crown-molding-angle-calculator/", "/cabinet-cut-list-calculator/", "/roof-pitch-calculator/"]) {
      await navigate(route);
      const image = await evaluate(`(() => {
        const img = document.querySelector(".visual-frame img");
        const source = img.closest('picture')?.querySelector('source[type="image/avif"]');
        const candidates = (source?.srcset || img.srcset).split(", ").map(item => new URL(item.split(" ")[0], location.href).href);
        return { src: img.currentSrc, loaded: img.complete && img.naturalWidth > 0,
          requests: performance.getEntriesByType("resource").filter(entry => candidates.includes(entry.name)).map(entry => new URL(entry.name).pathname) };
      })()`);
      assert(image.loaded, route);
      assert.equal(image.requests.length, 1, `${route}: duplicate preload at DPR ${dpr}`);
      assert(image.src.endsWith(dpr === 1 ? "-480.avif" : dpr === 2 ? "-800.avif" : "-1200.avif"), `${route}: wrong image at DPR ${dpr}`);
      densityImages.push({ route, dpr, ...image });
    }
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 844, deviceScaleFactor: 1, mobile: false });
  const noScript = [];
  for (const route of routes) {
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await send("Page.navigate", { url: origin + route });
    await waitFor('document.readyState === "complete"');
    const size = await evaluate('getComputedStyle(document.querySelector("main h1")).fontSize');
    assert.equal(size, rows.find(row => row.route === route && row.width === 1440).styles["main h1"][0]["font-size"]);
    noScript.push({ route, size });
    await send("Emulation.setScriptExecutionDisabled", { value: false });
  }
  await navigate("/crown-molding-angle-calculator/");
  await evaluate('const select=document.querySelector(".language-picker select");select.value="zh-CN";select.dispatchEvent(new Event("change",{bubbles:true}))');
  await waitFor('window.WCTAppInitialized === true');
  assert.equal(await evaluate('document.documentElement.lang'), "zh-CN");
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, noScript, densityImages, calculatorEdit: true, homePreset: true, blogSearch: true, languageSwitch: true, errors }, null, 2));
  console.log(`Passed ${rows.length} responsive/style/menu checks, ${densityImages.length} responsive preload checks, real calculator edits, homepage presets, Blog search, no-script styles and language switch.`);
} finally {
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  await send("Page.close");
  ws.close();
}
