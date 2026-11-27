import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Run with the local dev server and a Chrome remote debugging port.
const origin = process.env.WCT_BOOKCASE_ORIGIN || 'http://127.0.0.1:4175';
const port = process.env.WCT_CDP_PORT || 9337;
const studio = '/cabinet-studio/';
const bookcase = `${studio}?project=bookcase#cs-workspace`;
const entries = ['/templates/bookcase-cut-list/', '/templates/bookshelf-cut-list/', '/blog/cutlist-bookcase-from-one-sheet/'];
const genericKey = 'woodcuttool.cabinet-studio.v1';
const bookcaseKey = 'woodcuttool.cabinet-studio.bookcase.v1';
const outputDir = mkdtempSync(join(tmpdir(), 'wct-bookcase-qa-'));

const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
const pending = new Map();
const errors = [];
let nextId = 0;
let sessionId;
let browserContextId;
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown' && message.sessionId === sessionId) {
    errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  }
  const job = pending.get(message.id);
  if (!job) return;
  pending.delete(message.id);
  clearTimeout(job.timeout);
  if (message.error) job.reject(new Error(message.error.message));
  else job.resolve(message.result);
});
function send(method, params = {}, targetSession = sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Chrome command timed out: ${method}`));
    }, 15000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params, sessionId: targetSession ?? undefined }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await evaluate(expression)) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${expression}`);
}
function readyAt(route) {
  return waitFor(`location.pathname + location.search + location.hash === ${JSON.stringify(route)} && document.readyState === 'complete'`);
}
async function navigate(route) {
  const { errorText } = await send('Page.navigate', { url: origin + route });
  assert.equal(errorText, undefined);
  await readyAt(route);
}
async function click(selector) {
  const point = await evaluate(`(() => {
    const target = document.querySelector(${JSON.stringify(selector)});
    if (!target) throw new Error('Missing click target');
    target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    const bounds = target.getBoundingClientRect();
    if (!bounds.width || !bounds.height) throw new Error('Click target is hidden');
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  })()`);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function fill(name, value) {
  const selector = `#cs-design-form [name="${name}"]`;
  await click(selector);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).select()`);
  await send('Input.insertText', { text: String(value) });
  await waitFor(`document.querySelector(${JSON.stringify(selector)}).value === ${JSON.stringify(String(value))}`);
}
const stored = key => `JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`;
const partLength = id => evaluate(`document.querySelector('[data-row="${id}"] td:nth-child(2)').textContent`);
async function screenshot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outputDir, name), Buffer.from(data, 'base64'));
}

function extractPdfText(path) {
  const poppler = spawnSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' });
  if (poppler.status === 0) return poppler.stdout;
  if (process.platform === 'darwin' && poppler.error?.code === 'ENOENT') {
    const script = `ObjC.import('Foundation'); ObjC.import('PDFKit');
      function run(args) {
        const pdf = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(args[0]));
        return ObjC.unwrap(pdf.string);
      }`;
    return execFileSync('osascript', ['-l', 'JavaScript', '-e', script, path], { encoding: 'utf8' });
  }
  throw new Error(poppler.stderr || 'PDF text verification requires pdftotext (Poppler) or macOS PDFKit.');
}

try {
  ({ browserContextId } = await send('Target.createBrowserContext', { disposeOnDetach: true }));
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
  ({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.print = () => { window.wctPrintCalls = (window.wctPrintCalls || 0) + 1; };' });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

  await navigate(studio);
  await fill('width', 760);
  await waitFor(`${stored(genericKey)}?.config.width === 760`);
  const genericDraft = await evaluate(stored(genericKey));
  assert.equal(await evaluate(stored(bookcaseKey)), null);

  for (const [index, entry] of entries.entries()) {
    await navigate(entry);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `${entry} overflows at 390px`);
    await click(`main a[href="${bookcase}"]`);
    await readyAt(bookcase);
    await waitFor('!!document.querySelector("#cs-bookcase-heading")?.getClientRects().length');
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Bookcase Studio overflows at 390px');
    assert.equal(await partLength('top'), index === 0 ? '864' : '922');
    assert.deepEqual(await evaluate(stored(genericKey)), genericDraft);
    if (index === 0) {
      assert.equal(await evaluate('document.querySelector("#cs-model-size").textContent'), '900 × 1,800 × 360 mm');
      assert.ok(await evaluate(`(() => {
        const editor = document.querySelector('#cs-design-form [name="width"]').getBoundingClientRect();
        return editor.top > 0 && editor.bottom <= innerHeight && editor.top < document.querySelector('#cs-view-model').getBoundingClientRect().top;
      })()`), 'The first dimension should be visible before the preview at 390px');
      await screenshot('bookcase-mobile-entry.png');
      await fill('width', 960);
      await fill('height', 1740);
      await fill('depth', 370);
      await fill('shelves', 3);
      await fill('thickness', 19);
      await waitFor(`${stored(bookcaseKey)}?.config.thickness === 19`);
      const draft = (await evaluate(stored(bookcaseKey))).config;
      assert.deepEqual([draft.width, draft.height, draft.depth, draft.thickness, draft.shelves], [960, 1740, 370, 19, 3]);
    }
  }

  await evaluate('window.wctBeforeReload = true');
  await send('Page.reload');
  await readyAt(bookcase);
  await waitFor('!window.wctBeforeReload && document.querySelector("#cs-model-size")?.textContent === "960 × 1,740 × 370 mm"');
  assert.equal(await partLength('top'), '922');
  assert.match(await evaluate('document.querySelector("#cs-sheets [data-part=top]").getAttribute("aria-label")'), /922 by 364/);
  assert.equal(await evaluate('document.querySelectorAll("#cs-cut-rows tr").length'), 8);
  assert.match(await evaluate('document.querySelector("#cs-workshop-content").textContent'), /Shelf supports12 pieces/);

  await fill('width', 2400);
  await waitFor('document.querySelector("#cs-print").disabled && !!document.querySelector("#cs-sheets [data-kind=error]")');
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  assert.ok(await evaluate('!!document.querySelector(".cs-print-warning")?.getClientRects().length'));
  assert.equal(await evaluate('document.querySelector("#cs-workshop").getClientRects().length'), 0);
  await send('Emulation.setEmulatedMedia', { media: '' });
  await fill('width', 960);
  await waitFor('!document.querySelector("#cs-print").disabled');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Bookcase Studio overflows at 1440px');
  await evaluate('document.querySelector("#cs-workspace").scrollIntoView({ block: "start", behavior: "instant" })');
  await waitFor('Array.from(document.querySelectorAll("#cs-dimensions text")).some(label => label.textContent === "960 mm")');
  await screenshot('bookcase-desktop-workspace.png');
  await click('#cs-tab-parts');

  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: outputDir, browserContextId }, null);
  for (const [selector, filename, content] of [
    ['#cs-export-csv', 'cabinet-studio-cut-list.csv', '"Top","922.0","364.0","19"'],
    ['#cs-purchase-csv', 'cabinet-shopping-list.csv', '"Shelf supports","12","pieces"'],
  ]) {
    const path = join(outputDir, filename);
    await click(selector);
    for (let attempt = 0; attempt < 100 && !existsSync(path); attempt++) await sleep(50);
    assert.ok(existsSync(path), `Missing download: ${filename}`);
    assert.ok(readFileSync(path, 'utf8').includes(content), `Outdated download: ${filename}`);
  }

  await click('#cs-print');
  await waitFor('window.wctPrintCalls === 1');

  const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true });
  const output = join(outputDir, 'bookcase-workshop-pack.pdf');
  writeFileSync(output, Buffer.from(data, 'base64'));
  const pdf = extractPdfText(output).replace(/\s+/g, ' ');
  assert.match(pdf, /Open bookcase workshop pack/);
  assert.match(pdf, /960\s*×\s*1,740\s*×\s*370 mm/);
  assert.match(pdf, /Sheet 1\s*\/\s*19 mm body stock/);
  assert.match(pdf, /Top\s+922\s+364\s+19/);
  assert.ok(pdf.replace(/\s+/g, '').includes('Shelfsupports12pieces'), 'The PDF should include all 12 shelf supports');
  assert.match(pdf, /Check, assemble & finish/);

  await navigate(studio);
  assert.equal(await evaluate('document.querySelector("#cs-design-form [name=width]").value'), '760');
  assert.deepEqual(await evaluate(stored(genericKey)), genericDraft);
  assert.equal(await evaluate(`${stored(bookcaseKey)}.config.width`), 960);
  assert.deepEqual(errors, []);
  console.log(`Bookcase browser checks passed. Workshop PDF: ${output}`);
} finally {
  if (browserContextId) await send('Target.disposeBrowserContext', { browserContextId }, null).catch(() => {});
  socket.close();
}
