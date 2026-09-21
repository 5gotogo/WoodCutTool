import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
const origin = process.env.WCT_PERF_ORIGIN || "http://127.0.0.1:4191";
const cdpPort = Number(process.env.WCT_CDP_PORT || 9337);
const output = process.env.WCT_INTERACTION_OUTPUT || "/tmp/wct-interaction-qa";
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

const baseline = process.env.WCT_INTERACTION_BASELINE === "1";
let failSearchIndex = false;
let failedIndexRequests = 0;
const originals = new Map(baseline ? ['blog-index.js', 'plywood-workflow.js'].map(name => [name, execFileSync('git', ['show', `HEAD:assets/${name}`]).toString('base64')]) : []);
ws.addEventListener('message', async ({ data }) => {
  const message = JSON.parse(data);
  if (message.method !== 'Fetch.requestPaused') return;
  const { requestId, request } = message.params;
  const name = new URL(request.url).pathname.split('/').pop();
  if (name === 'blog-search-index.json') {
    if (failSearchIndex) {failedIndexRequests++;await send('Fetch.failRequest',{requestId,errorReason:'Failed'});}
    else await send('Fetch.continueRequest',{requestId});
  } else await send('Fetch.fulfillRequest', {requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'text/javascript'}],body:originals.get(name)});
});
await send('Fetch.enable',{patterns:[...originals.keys(),'blog-search-index.json'].map(name=>({urlPattern:`*/assets/${name}`}))});
await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:output});
await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", {cacheDisabled:true});
await send("Emulation.setDeviceMetricsOverride", {width:390,height:844,deviceScaleFactor:1,mobile:true});
await send("Emulation.setCPUThrottlingRate", {rate:4});
await send("Page.addScriptToEvaluateOnNewDocument", {source:`
window.__metrics={events:[],tasks:[]};
new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(e.interactionId)window.__metrics.events.push({name:e.name,duration:e.duration,id:e.interactionId})})).observe({type:'event',buffered:true,durationThreshold:16});
new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__metrics.tasks.push(e.duration))).observe({type:'longtask',buffered:true});
`});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitFor(expr){for(let i=0;i<200;i++){if(await evaluate(expr))return;await sleep(50);}throw Error('Timed out: '+expr);}
async function navigate(route){await send('Page.navigate',{url:origin+route});await waitForReady();await waitFor('!!document.querySelector(".site-header")');await sleep(200);}
async function click(selector){const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing target');e.scrollIntoView({behavior:'instant',block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});}
async function key(key, code = key, text) {
  const windowsVirtualKeyCode = ({Backspace:8, Enter:13, End:35, Home:36, ArrowDown:40})[key] || key.toUpperCase().charCodeAt(0);
  await send('Input.dispatchKeyEvent', {type:'keyDown', key, code, windowsVirtualKeyCode, ...(text ? {text} : {})});
  await send('Input.dispatchKeyEvent', {type:'keyUp', key, code, windowsVirtualKeyCode});
}
async function type(text) { for (const char of text) await key(char, 'Key' + char.toUpperCase(), char); }
async function selectAll() {
  await send('Input.dispatchKeyEvent', {type:'keyDown', key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:4,commands:['selectAll']});
  await send('Input.dispatchKeyEvent', {type:'keyUp', key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:4});
}
async function replaceSearch(text) {
  await evaluate('document.querySelector("[data-blog-search-input]").select()');
  await key('Backspace');
  if (text) await type(text);
}
const rows=[];
const behavior = {};
let traceComplete;
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Tracing.tracingComplete')traceComplete?.(m.params.stream);});

async function measure(name,action,done='true'){await sleep(100);await evaluate('window.__metrics.events=[];window.__metrics.tasks=[]');const start=performance.now();await action();await waitFor(done);const completionMs=Math.round(performance.now()-start);await sleep(150);const metrics=await evaluate('window.__metrics');rows.push({name,completionMs,eventMax:Math.max(0,...metrics.events.map(e=>e.duration)),longTaskMax:Math.max(0,...metrics.tasks),...metrics});console.log(JSON.stringify(rows.at(-1)));}
try{
 await navigate('/');await evaluate('localStorage.clear()');
 for(let run=1;run<=3;run++){
  for(const count of [2,50,100]){
   const project={version:1,scenario:'none',unit:'in',groups:[{id:'panels',material:'Plywood',thickness:0.75,sheetLength:96,sheetWidth:48,kerf:0.125,trim:0,price:0,allowRotate:true}],parts:Array.from({length:count},(_,i)=>({label:'Panel '+i,length:12+i%19,width:6+i%13,qty:count===100?5:1,group:'panels',allowRotate:true})),exclusions:[]};
   await evaluate(`localStorage.setItem('woodcuttool.plywood.draft.v1',${JSON.stringify(JSON.stringify(project))})`);
   await navigate('/plywood-cut-calculator/');await waitFor('document.querySelector("#plywood-form").dataset.workflowReady');
   if(count===100&&run===1)await send('Tracing.start',{categories:'devtools.timeline',transferMode:'ReturnAsStream'});
   await measure(`plywood-${count}-run${run}`,()=>click('#plywood-form button[type=submit]'),'!!document.querySelector("[data-export-csv]")');
   assert.equal(await evaluate('document.querySelector("#plywood-result h2").textContent'),'All listed panels placed');
   if(count===100&&run===1){const completed=new Promise(resolve=>{traceComplete=resolve;});await send('Tracing.end');const handle=await completed;let trace='';for(;;){const chunk=await send('IO.read',{handle});trace+=chunk.data;if(chunk.eof)break;}await send('IO.close',{handle});writeFileSync(`${output}/large-calculation-trace.json`,trace);}

  }
  await navigate('/blog/');await click('[data-blog-directory-panel] > summary');await sleep(100);await click('[data-blog-search-input]');
  await measure(`search-run${run}`,()=>type('plywood'),'document.querySelector("[data-blog-search-status]").textContent.includes("matches")');
  await measure(`clear-search-run${run}`,()=>replaceSearch(''),'document.querySelector("[data-blog-search-status]").textContent.includes("articles")');
  behavior.clearRemovesResults = await evaluate(`document.querySelector("[data-blog-search-results]").children.length === 1 && !!document.querySelector('[data-blog-search-results] a[href="/blog/archive/"]')`);
  if (!baseline) assert(behavior.clearRemovesResults, 'Cleared query retained stale results');
  await measure(`menu-run${run}`,()=>click('.mobile-nav-toggle'),'document.querySelector(".mobile-nav-toggle").getAttribute("aria-expanded")==="true"');
 }
 failSearchIndex = true;
 await navigate('/blog/');
 await click('[data-blog-directory-panel] > summary');await sleep(100);await click('[data-blog-search-input]');await type('maple');await sleep(600);
 behavior.failedSearchShowsError = await evaluate('document.querySelector("[data-blog-search-status]").textContent.includes("unavailable")');
 assert(failedIndexRequests > 0,'Failure injection missed search request');failSearchIndex = false;await replaceSearch('plywood');await sleep(600);
 behavior.failedSearchCanRetry = await evaluate('document.querySelector("[data-blog-search-results]").children.length > 1');
 if (!baseline) {assert(behavior.failedSearchShowsError);assert(behavior.failedSearchCanRetry);}
 await navigate('/plywood-cut-calculator/');
 await measure('recalculate',()=>click('#plywood-form button[type=submit]'),'!!document.querySelector("[data-export-csv]")');
 await click('[data-sheet-selector]');await key('End');await key('Enter');
 behavior.lastSheetSelected = await evaluate('(()=>{const s=document.querySelector("[data-sheet-selector]");return s.selectedIndex === s.options.length - 1})()');
 assert(behavior.lastSheetSelected);
 const resizeWrites = await evaluate(`new Promise(resolve=>{let n=0;const observer=new MutationObserver(entries=>n+=entries.length);observer.observe(document.querySelector('[data-group-canvas]'),{attributes:true,attributeFilter:['width','height']});for(let i=0;i<50;i++)window.dispatchEvent(new Event('resize'));requestAnimationFrame(()=>requestAnimationFrame(()=>{observer.disconnect();resolve(n)}));})`,true);
 behavior.resizeCanvasWrites = resizeWrites;
 if (!baseline) assert(resizeWrites <= 2, 'Resize burst redrew a canvas more than once per frame');
 await click('[data-part] input[name=length]');await selectAll();await type('200');assert.equal(await evaluate('document.querySelector("[data-part] input[name=length]").value'),'200');
 await measure('unplaced-panel',()=>click('#plywood-form button[type=submit]'),'document.querySelector("#plywood-result h2").textContent.includes("Incomplete")');
 assert(await evaluate('document.querySelector("[data-unplaced]").textContent.includes("Panel 0")'));
 await measure('csv-export',()=>click('[data-export-csv]'),'document.querySelector("[data-export-status]").textContent.includes("CSV prepared")');
 await sleep(200);assert(existsSync(`${output}/woodcuttool-cut-list.csv`));assert(readFileSync(`${output}/woodcuttool-cut-list.csv`,'utf8').includes('incomplete-panel-layout'));
 for (const width of [360,390,430,1440]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
  for (const route of ['/wood/maple/','/wood/red-oak/','/wood-weight-calculator/','/cabinet-door-calculator/']) {
   await navigate(route);
   assert.equal(await evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'),0,`${route} overflow at ${width}`);
   if (width===390 || width===1440) {const shot=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${route.split('/').filter(Boolean).at(-1)}-${width}.png`,Buffer.from(shot.data,'base64'));}
   if (route==='/wood-weight-calculator/') {await click('#wood-weight-form button[type=submit]');await waitFor('document.querySelector("#wood-weight-result").textContent.includes("72 lb")');}
   if (route==='/cabinet-door-calculator/') assert(await evaluate('document.querySelector("[data-construction-result]").textContent.includes("15.44")'));
  }
 }
 if (!baseline) {
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await navigate('/');await click('.mobile-nav-toggle');
  await evaluate('document.querySelector("#language-select").focus()');
  await key('Home');await key('ArrowDown');await key('Enter');
  await waitFor('document.documentElement.lang === "zh-CN"');
  behavior.languageSwitch = true;
  await evaluate('localStorage.removeItem("woodcuttool-lang")');
 }
 console.log(JSON.stringify({behavior,responsiveChecks:16}));
 writeFileSync(`${output}/results.json`,JSON.stringify({scope:'Local gzip preview, 390x844, 4x CPU, cold browser cache, unthrottled local network; real CDP input; event timing is laboratory evidence, not field INP',baseline,behavior,responsiveChecks:16,rows},null,2));
}catch(error){console.error(await evaluate('({active:document.activeElement?.tagName + ":" + document.activeElement?.getAttribute("name"), error:document.querySelector("[data-input-error]")?.textContent, result:document.querySelector("#plywood-result h2")?.textContent})'));throw error;}finally{await send('Network.setBlockedURLs',{urls:[]});await send('Emulation.setCPUThrottlingRate',{rate:1});await send('Page.close');ws.close();}
