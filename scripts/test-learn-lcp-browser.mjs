import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// --capture records the unmodified page styles for an optional before/after
// comparison. Ordinary runs assert the deployed generation contract instead.
const capture = process.argv.includes("--capture");
const baseline = process.env.WCT_LEARN_BASELINE;
const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4194";
const port = process.env.WCT_CDP_PORT || "9355";
const output = process.env.WCT_LEARN_QA_OUTPUT || "/tmp/wct-learn-lcp-qa";
const routes = ["/learn/material-substitution-approval-workflow/", "/learn/custom-wardrobe-planning-guide/", "/learn/how-to-reduce-plywood-waste/", "/learn/", "/learn/topics/cabinet-planning/", "/learn/plywood/"];
mkdirSync(output, { recursive: true });
const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
let id = 0;
const pending = new Map(), errors = [];
ws.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
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
async function navigate(route, script = true) {
  const response = await fetch(origin + route, { method: "HEAD" });
  assert(response.ok, `${route}: HTTP ${response.status}`);
  await send("Page.navigate", { url: origin + route });
  await waitFor(`document.readyState === "complete"${script ? ' && !!document.querySelector(".site-header")' : ""}`);
  await waitFor('[...document.querySelectorAll("main img[loading=eager]")].every(img => img.complete && img.naturalWidth > 0)');
}
const snapshot = `(() => {
  const seen = new Set();
  const props = ["display", "position", "fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "backgroundImage", "margin", "padding", "border", "borderRadius", "maxWidth", "minHeight", "gap", "gridTemplateColumns", "flexDirection", "alignItems", "justifyContent", "objectFit", "aspectRatio", "overflow", "boxShadow"];
  return [...document.querySelectorAll("main, main *, .site-header, .site-header *, .mega-menu, .mega-menu *")].filter(e => {
    const key = (e.closest("main") ? "main:" : "chrome:") + e.tagName + "." + e.className;
    if (["SCRIPT", "STYLE", "SVG", "PATH"].includes(e.tagName) || seen.has(key)) return false;
    seen.add(key); return true;
  }).map(e => ({scope: e.closest("main") ? "main" : "chrome", tag: e.tagName, className: e.className, styles: Object.fromEntries(props.map(p => [p, getComputedStyle(e)[p]]))}));
})()`;
const rows = [], noScript = [], images = [], languages = [];
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: 'localStorage.setItem("woodcuttool-lang", "en")' });
  for (const width of [360, 390, 430, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: width < 980 });
    for (const route of routes) {
      await navigate(route);
      assert.equal(await evaluate('Math.max(0, document.documentElement.scrollWidth-innerWidth)'), 0, `${route}: overflow at ${width}`);
      if (!capture) assert.equal(await evaluate('document.querySelectorAll("link[rel=stylesheet]").length'), 0, route);
      const styles = await evaluate(snapshot);
      if (width < 980) {
        await evaluate('document.querySelector(".mobile-nav-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'), "true");
      }
      await evaluate('document.querySelector(".nav-menu-toggle").click()');
      await waitFor('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
      const menuStyles = await evaluate(snapshot);
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
      assert.equal(await evaluate('document.querySelectorAll(".nav-menu-item.is-open").length'), 0);
      if (route === "/learn/" && width < 980) {
        const expanded = await evaluate('document.querySelector(".learn-section-toggle").getAttribute("aria-expanded")');
        await evaluate('document.querySelector(".learn-section-toggle").click()');
        assert.equal(await evaluate('document.querySelector(".learn-section-toggle").getAttribute("aria-expanded")'), expanded === "true" ? "false" : "true");
        await evaluate('document.querySelector(".learn-section-toggle").click()');
      }
      rows.push({ route, width, styles, menuStyles });
      if ([390, 1440].includes(width)) {
        await evaluate('window.scrollTo({top:0,behavior:"instant"})');
        const shot = await send("Page.captureScreenshot", { format: "png" });
        writeFileSync(`${output}/${route.split("/").filter(Boolean).join("-")}-${width}.png`, Buffer.from(shot.data, "base64"));
      }
    }
  }
  for (const route of routes) {
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await navigate(route, false);
    const styles = await evaluate(snapshot);
    const normalMain = rows.find(row => row.route === route && row.width === 1440).styles.filter(row => row.scope === "main");
    // Directory controls are inserted by JS. Compare each retained content
    // element with its styled version, without requiring generated controls.
    for (const row of styles.filter(row => row.scope === "main")) {
      assert.deepEqual(row, normalMain.find(other => other.tag === row.tag && other.className === row.className), `${route}: no-script ${row.tag}.${row.className}`);
    }
    noScript.push(route);
    await send("Emulation.setScriptExecutionDisabled", { value: false });
  }
  for (const dpr of [1, 2, 3]) {
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: dpr, mobile: true });
    for (const route of routes.slice(0, 3)) {
      await navigate(route);
      const data = await evaluate(`(() => {const img=document.querySelector(".article-wood-photo-hero img"); const paths=performance.getEntriesByType("resource").filter(e => new URL(e.name).pathname.startsWith(img.getAttribute("src").replace(".webp", ""))).map(e=>new URL(e.name).pathname);return {src:img.currentSrc, paths};})()`);
      assert.equal(data.paths.length, 1, `${route}: duplicate hero at DPR ${dpr}`);
      images.push({route, dpr, ...data});
    }
  }
  for (const route of [routes[0], "/learn/"]) {
    await navigate(route);
    await evaluate('const select=document.querySelector(".language-picker select"); select.value="zh-CN"; select.dispatchEvent(new Event("change",{bubbles:true}))');
    await waitFor('!!window.WCTAppInitialized && document.documentElement.lang === "zh-CN"');
    languages.push({ route, text: await evaluate('document.querySelector("main").innerText'), nav: await evaluate('document.querySelector(".site-header").innerText') });
  }
  if (baseline) {
    const before = JSON.parse(readFileSync(baseline, "utf8"));
    assert.deepEqual(rows, before.rows, "Learn computed styles changed from baseline");
    assert.deepEqual(languages, before.languages, "Learn translation behavior changed");
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ rows, noScript, images, languages, errors }, null, 2));
  console.log(`Passed ${rows.length} Learn responsive/menu checks, no-script content styles, ${images.length} responsive image request checks and Chinese switching${baseline ? "; computed styles and translations match baseline" : ""}. Results: ${output}/results.json`);
} finally {
  await send("Emulation.setScriptExecutionDisabled", { value: false });
  await send("Page.close"); ws.close();
}
