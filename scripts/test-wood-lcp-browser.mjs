import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4192";
const port = Number(process.env.WCT_CDP_PORT || 9353);
const output = process.env.WCT_WOOD_QA_OUTPUT || "/tmp/wct-wood-qa-1010";
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
  await waitFor('document.readyState === "complete" && !!document.querySelector(".site-header") && document.querySelector(".nav-links-mega").dataset.boundMegaNavigation === "true"');
}
const routes = ["/wood/", "/wood/rosewood/", "/wood/hackberry/", "/wood/paulownia/", "/wood/khaya/", "/wood/oak/", "/wood/east-indian-rosewood/", "/wood/brazilian-rosewood/"];
const rows = [], languages = [], races = [];
const fullApp = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const sharedChrome = readFileSync(new URL("../assets/site-chrome.js", import.meta.url), "utf8");
const snapshot = `(() => {
  const roots = [...document.querySelectorAll('.site-header, main, .site-footer')];
  return {lang:document.documentElement.lang,dir:document.documentElement.dir,
    text: roots.map(root => {
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return ['STYLE','SCRIPT','OPTION'].includes(node.parentElement?.tagName)||!node.textContent.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
      const text=[];while(walker.nextNode())text.push(walker.currentNode.textContent.trim());return text;
    }), attributes: roots.map(root => [...root.querySelectorAll('[aria-label],[title]')].map(el=>[el.getAttribute('aria-label'),el.getAttribute('title')]))};
})()`;
const clickMenu = 'document.querySelectorAll(".nav-menu-toggle")[0].click()';
const noOpen = '!document.querySelector(".nav-menu-item.is-open")';
async function language(lang) {
  await evaluate(`(() => {const s=document.querySelector('.language-picker select');s.value=${JSON.stringify(lang)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await waitFor(`(!!window.WCTWoodLanguageInitialized || !!window.WCTAppInitialized) && document.documentElement.lang === ${JSON.stringify(lang)}`);
}
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setCacheDisabled", {cacheDisabled:true});
  const init = await send("Page.addScriptToEvaluateOnNewDocument", {source:'try {localStorage.setItem("woodcuttool-lang","en")} catch {}'});
  for (const width of [360,390,430,1440]) {
    await send("Emulation.setDeviceMetricsOverride", {width,height:844,deviceScaleFactor:1,mobile:width<980});
    for (const route of routes) {
      await navigate(route);
      const metrics = await evaluate(`({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),h1:document.querySelector('h1').textContent,font:getComputedStyle(document.querySelector('h1')).fontSize,requests:performance.getEntriesByType('resource').map(e=>new URL(e.name).pathname)})`);
      assert.equal(metrics.overflow,0,`${route} ${width}px`);
      assert(!metrics.requests.some(path=>/app\.js|site-chrome\.js|wood-menus\.json|wood-language\.js/.test(path)), `${route}: eager optional runtime`);
      assert(await evaluate('!!document.querySelector("style[data-wood-styles]") && document.querySelectorAll(".site-header").length === 1 && document.querySelectorAll(".site-footer").length === 1'));
      if(width<980) await evaluate('document.querySelector(".mobile-nav-toggle").click()');
      await evaluate(clickMenu);
      await waitFor('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
      assert(await evaluate('getComputedStyle(document.querySelector(".nav-menu-item.is-open .mega-menu")).display !== "none"'));
      await evaluate('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
      assert(await evaluate(noOpen));
      assert.equal(await evaluate('document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")'),"false");
      if(route!=="/wood/") {
        assert(await evaluate('document.querySelectorAll("details").length>0'));
        await evaluate('document.querySelector("details").open=true');
        assert(await evaluate('document.querySelector("details").open'));
      }
      rows.push({route,width,...metrics});
      if([390,1440].includes(width) && ["/wood/","/wood/rosewood/","/wood/hackberry/"].includes(route)) {
        await evaluate('Promise.all(document.getAnimations().map(animation=>animation.finished.catch(()=>{})))');
        const shot=await send("Page.captureScreenshot",{format:"png"});
        writeFileSync(`${output}/${route.split('/').filter(Boolean).join('-')}-${width}.png`,Buffer.from(shot.data,'base64'));
      }
    }
  }
  await navigate('/wood/');
  assert.equal(await evaluate('document.querySelectorAll(".wood-row").length'),200);
  for(const filter of [
    {search:'rosewood',group:'',price:''}, {search:'',group:'Softwood',price:''},
    {search:'',group:'Hardwood',price:'Low'}, {search:'zzzz-no-species',group:'',price:''},
    {search:'',group:'',price:''}
  ]) {
    await evaluate(`(() => {const f=${JSON.stringify(filter)}; for(const [id,key] of [['wood-search','search'],['wood-group','group'],['wood-price','price']]) {const el=document.getElementById(id);el.value=f[key];el.dispatchEvent(new Event(id==='wood-search'?'input':'change',{bubbles:true}));}})()`);
    const result=await evaluate(`(() => {const f=${JSON.stringify(filter)}, all=[...document.querySelectorAll('.wood-row')];return {actual:all.filter(r=>!r.hidden).map(r=>r.dataset.name),expected:all.filter(r=>(!f.search||r.dataset.name.includes(f.search))&&(!f.group||r.dataset.group===f.group)&&(!f.price||r.dataset.price===f.price)).map(r=>r.dataset.name),count:document.querySelector('#wood-count').textContent}})()`);
    assert.deepEqual(result.actual,result.expected); assert.equal(result.count,`${result.actual.length} species shown`);
  }
  // Match the existing full app's observable translation behavior, including
  // menus inserted after switching languages and restoration to English.
  const locales=['en','zh-CN','zh-TW','es','pt','fr','de','nl','it','ar','ja'];
  for(const route of ['/wood/','/wood/rosewood/','/wood/oak/']) {
    const expected={};
    await send('Emulation.setScriptExecutionDisabled',{value:true});
    await send('Page.navigate',{url:origin+route}); await waitFor('document.readyState === "complete"');
    await send('Emulation.setScriptExecutionDisabled',{value:false});
    await evaluate('localStorage.setItem("woodcuttool-lang","en")');
    await evaluate(sharedChrome); await evaluate(fullApp);
    for(const lang of [...locales,'en']) {
      await language(lang);
      // Materialize every menu using keyboard focus, which also exercises
      // the original translation observer's late-insertion behavior.
      await evaluate('[...document.querySelectorAll(".nav-menu-item")].forEach(item=>item.dispatchEvent(new FocusEvent("focusin",{bubbles:true})))');
      await waitFor('document.querySelectorAll(".mega-menu").length === document.querySelectorAll(".nav-menu-item").length');
      expected[lang]=await evaluate(snapshot);
    }
    await navigate(route);
    for(const lang of [...locales,'en']) {
      await language(lang);
      await evaluate('[...document.querySelectorAll(".nav-menu-item")].forEach(item=>item.dispatchEvent(new FocusEvent("focusin",{bubbles:true})))');
      await waitFor('document.querySelectorAll(".mega-menu").length === document.querySelectorAll(".nav-menu-item").length');
      assert.deepEqual(await evaluate(snapshot),expected[lang],`${route} language ${lang}`);
    }
    languages.push({route,locales,restoresEnglish:true,lateMenus:true});
  }
  // Loading races: Escape, outside clicks, toggle cancellation, and selecting
  // another menu before the first fetch completes must not reopen stale menus.
  for(const action of ['escape','outside','toggle','switch']) {
    await navigate('/wood/rosewood/');
    await send('Network.emulateNetworkConditions',{offline:false,latency:450,downloadThroughput:200000,uploadThroughput:100000});
    await evaluate(clickMenu);
    if(action==='escape') await evaluate('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape"}))');
    if(action==='outside') await evaluate('document.querySelector("h1").click()');
    if(action==='toggle') await evaluate(clickMenu);
    if(action==='switch') await evaluate('document.querySelectorAll(".nav-menu-toggle")[1].click()');
    await waitFor('!!document.querySelector(".mega-menu")');
    if(action==='switch') {
      await waitFor('document.querySelectorAll(".nav-menu-item")[1].classList.contains("is-open")');
      assert.equal(await evaluate('document.querySelectorAll(".nav-menu-item.is-open").length'),1);
    } else assert(await evaluate(noOpen),action);
    races.push(action);
    await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  }
  await navigate('/wood/hackberry/');
  await send('Network.setBlockedURLs',{urls:['*/assets/wood-menus.json']});
  await evaluate(clickMenu);
  await waitFor('performance.getEntriesByType("resource").some(e=>e.name.endsWith("wood-menus.json"))');
  assert(await evaluate(noOpen));
  await send('Network.setBlockedURLs',{urls:[]});
  await evaluate(clickMenu); await waitFor('!!document.querySelector(".nav-menu-item.is-open .mega-menu a")');
  races.push('menu failure retry');
  await navigate('/wood/hackberry/');
  await send('Network.setBlockedURLs',{urls:['*/assets/wood-language.js']});
  await evaluate('const s=document.querySelector(".language-picker select");s.value="zh-CN";s.dispatchEvent(new Event("change",{bubbles:true}))');
  await waitFor(`!document.querySelector('script[src="/assets/wood-language.js"]')`);
  assert.equal(await evaluate('!!window.WCTWoodLanguageInitialized'),false);
  await send('Network.setBlockedURLs',{urls:[]});
  await language('zh-CN'); await waitFor('!!window.WCTWoodLanguageInitialized');
  races.push('language failure retry');
  // Native FAQ and the full article remain available without script execution.
  await send('Emulation.setScriptExecutionDisabled',{value:true});
  await send('Page.navigate',{url:origin+'/wood/rosewood/'}); await waitFor('document.readyState === "complete"');
  assert.equal(await evaluate('getComputedStyle(document.querySelector("h1")).fontSize'),rows.find(r=>r.route==='/wood/rosewood/'&&r.width===1440).font);
  assert(await evaluate('document.querySelector(".site-footer a").getAttribute("href").startsWith("/")'));
  await evaluate('document.querySelector("details").open=true'); assert(await evaluate('document.querySelector("details").open'));
  await send('Emulation.setScriptExecutionDisabled',{value:false});
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:init.identifier});
  const denied=await send('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"localStorage",{get(){throw new DOMException("Storage blocked","SecurityError")}})'});
  await navigate('/wood/rosewood/'); await language('zh-CN'); await language('ar'); await language('en');
  assert.equal(await evaluate('document.documentElement.dir'),'ltr');
  assert(await evaluate('!window.WCTAppInitialized'));
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:denied.identifier});
  assert.deepEqual(errors,[]);
  writeFileSync(`${output}/results.json`,JSON.stringify({rows,languages,races,filters:true,noScript:true,storageDenied:true,errors},null,2));
  console.log(`Passed ${rows.length} responsive/menu/FAQ checks, 3 routes x 11-language parity, filters, async races/retries, no-script rendering and denied storage. ${output}`);
} finally {
  await send('Emulation.setScriptExecutionDisabled',{value:false});
  await send('Page.close'); ws.close();
}
