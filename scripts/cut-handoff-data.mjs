import { projectBenchmarks } from './plywood-benchmark-data.mjs';
const group = (id, material) => ({ id, material, thickness: 0.75, sheetLength: 96, sheetWidth: 48, kerf: 0.125, trim: 0, price: 0, allowRotate: false });
export function exampleHandoff(project) {
  if (!['bookshelf', 'base-cabinet'].includes(project.slug)) return null;
  return {
    version: 1, scenario: project.slug, unit: 'in',
    groups: [group('body', 'Plywood body'), group('back', 'Plywood back — separate stock')],
    parts: project.parts.map(part => ({ ...part, group: part.label === 'Back' ? 'back' : 'body', allowRotate: false })),
    exclusions: ['Planning dimensions only. Verify joinery, hardware, loads and finished sizes before cutting.', 'The benchmark does not specify thickness. This editable draft assumes 3/4 inch plywood for both groups, zero edge trim and locked rotation. Confirm actual stock; grouping may increase the sheet count.'],
  };
}
export const garageHandoff = {
  version: 1, scenario: 'garage-shelves', unit: 'in', groups: [group('shelves', 'Plywood shelves and cleats')],
  parts: [
    { label: 'Shelf', length: 96, width: 16, qty: 5, group: 'shelves', allowRotate: false },
    { label: 'Back cleat', length: 96, width: 3, qty: 5, group: 'shelves', allowRotate: false },
  ],
  exclusions: ['Panel layout only. Four 72-inch 2x4 uprights and eight 16 × 13-inch cross braces are not included in this plywood calculation. Confirm brace material and design separately; use the linear cut calculator for lumber.', 'The imported shelves and cleats assume 3/4 inch plywood, 1/8 inch kerf, zero edge trim and locked rotation. Three 16-inch shelves cannot fit across 48 inches once positive kerf is included.'],
};
export function handoffMarkup(project) {
  if (!project) return '';
  const json = JSON.stringify(project).replaceAll('<', '\\u003c');
  return `<section id="use-cut-list" data-cut-handoff data-scenario="${project.scenario}"><p class="eyebrow">Edit → Calculate → Export</p><h2>Make this list fit your project</h2><p>Review the material groups, thickness and orientation before calculating. Your edited list stays in this browser.</p><button class="button" type="button" data-send-cut-list>Customize and calculate this list</button><p role="status" data-handoff-status></p><noscript>Enable JavaScript to transfer the list, or use the visible parts table.</noscript><script type="application/json" data-handoff-payload>${json}</script></section><link rel="stylesheet" href="/assets/cut-handoff.css"><script type="module" src="/assets/cut-handoff.js"></script>`;
}
export const pilotProjects = [...projectBenchmarks.filter(p => ['bookshelf', 'base-cabinet'].includes(p.slug)).map(exampleHandoff), garageHandoff];
