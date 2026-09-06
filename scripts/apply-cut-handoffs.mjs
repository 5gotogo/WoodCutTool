import { readFileSync, writeFileSync } from 'node:fs';
import { garageHandoff, handoffMarkup } from './cut-handoff-data.mjs';
const path = new URL('../templates/garage-shelving-cut-list/index.html', import.meta.url);
let html = readFileSync(path, 'utf8');
const start = '<!-- garage-handoff:start -->', end = '<!-- garage-handoff:end -->';
const block = `${start}\n${handoffMarkup(garageHandoff)}\n${end}`;
html = html.replace(/\s*<!-- garage-handoff:start -->[\s\S]*?<!-- garage-handoff:end -->\s*/g, "\n");
html = html.replace(/(<p class="lead">[\s\S]*?<\/p>)/, `$1\n${block}`);
writeFileSync(path, html);
