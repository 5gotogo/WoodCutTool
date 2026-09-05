import { readFileSync, writeFileSync } from 'node:fs';
import { garageHandoff, handoffMarkup } from './cut-handoff-data.mjs';
const path = new URL('../templates/garage-shelving-cut-list/index.html', import.meta.url);
let html = readFileSync(path, 'utf8');
const start = '<!-- garage-handoff:start -->', end = '<!-- garage-handoff:end -->';
const block = `${start}\n${handoffMarkup(garageHandoff)}\n${end}`;
if (html.includes(start)) html = html.slice(0, html.indexOf(start)) + block + html.slice(html.indexOf(end) + end.length);
else html = html.replace('      <section>\n        <h2>Garage shelving parts list', block + '\n      <section>\n        <h2>Garage shelving parts list');
writeFileSync(path, html);
