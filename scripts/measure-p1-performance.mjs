import { writeFileSync } from 'node:fs';
const [out = '/tmp/wct-p1-performance.json'] = process.argv.slice(2);
const origin = process.env.P1_ORIGIN || 'http://127.0.0.1:4190';
const tab = await (await fetch('http://127.0.0.1:9337/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const jobs = new Map();
ws.addEventListener('message', ({ data }) => { const m = JSON.parse(data); if (m.id) { const j = jobs.get(m.id); jobs.delete(m.id); m.error ? j.reject(new Error(JSON.stringify(m.error))) : j.resolve(m.result); } });
function send(method, params = {}) { return new Promise((resolve, reject) => { const key = ++id; jobs.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); }); }
async function evaluate(expression) { const r = await send('Runtime.evaluate', { expression, returnByValue: true }); return r.result.value; }
await send('Page.enable'); await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000, connectionType: 'cellular4g' });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__metrics={lcp:0,cls:0,longTasks:[]};new PerformanceObserver(l=>{for(const e of l.getEntries()){__metrics.lcp=e.startTime;__metrics.lcpElement=e.element?.tagName+'.'+e.element?.className}}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)__metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())__metrics.longTasks.push(e.duration)}).observe({type:'longtask',buffered:true});` });
const rows = [];
try {
  for (let run = 1; run <= 3; run++) for (const route of ['/', '/plywood-cut-calculator/', '/examples/bookshelf-cut-list/']) {
    await send('Page.navigate', { url: 'about:blank' }); await new Promise(r => setTimeout(r, 100));
    await send('Page.navigate', { url: origin + route });
    for (let i = 0; i < 150; i++) { if (await evaluate('document.readyState === "complete"')) break; await new Promise(r => setTimeout(r, 100)); }
    await new Promise(r => setTimeout(r, 1800));
    const data = await evaluate(`({...__metrics,resources:performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/')&&/\\.(js|css)(\\?|$)/.test(e.name)).map(e=>({path:new URL(e.name).pathname,transfer:e.transferSize,encoded:e.encodedBodySize})),domReady:performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd})`);
    rows.push({ route, run, ...data }); console.log(`${route} run ${run}: LCP ${Math.round(data.lcp)} ms; CLS ${data.cls}`);
  }
  writeFileSync(out, JSON.stringify({ scope: 'Local gzip preview; 390x844, cold cache, 4x CPU, 150ms latency, 200KB/s download. Synthetic evidence, not real-user P75 or INP.', rows }, null, 2));
} finally { await send('Emulation.setCPUThrottlingRate', { rate: 1 }); await send('Page.close'); ws.close(); }
