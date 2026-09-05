export const HANDOFF_KEY = 'woodcuttool.plywood.handoff.v1';
export const DRAFT_KEY = 'woodcuttool.plywood.draft.v1';
export const SCENARIOS = ['none', 'bookshelf', 'garage-shelves', 'base-cabinet'];
const finite = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
const text = (value, max = 100) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validateProject(value) {
  if (!value || value.version !== 1 || !SCENARIOS.includes(value.scenario) || !['in', 'mm'].includes(value.unit)) throw new Error('This saved list has an unsupported version, scenario or unit.');
  if (!Array.isArray(value.groups) || !value.groups.length || value.groups.length > 10 || !Array.isArray(value.parts) || !value.parts.length || value.parts.length > 100) throw new Error('Use 1–10 material groups and 1–100 panel rows.');
  const limit = value.unit === 'mm' ? 254000 : 10000;
  const ids = new Set();
  for (const group of value.groups) {
    if (!text(group.id, 40) || ids.has(group.id) || !text(group.material) || !finite(group.thickness, 0.001, limit) || !finite(group.sheetLength, 0.01, limit) || !finite(group.sheetWidth, 0.01, limit) || !finite(group.kerf, 0, limit) || !finite(group.trim, 0, limit) || !finite(group.price, 0, 1000000) || typeof group.allowRotate !== 'boolean') throw new Error('Check each material group: name, thickness, sheet size, kerf, trim and price must be valid.');
    if (group.trim * 2 >= Math.min(group.sheetLength, group.sheetWidth) || group.kerf >= Math.min(group.sheetLength, group.sheetWidth)) throw new Error('Trim must leave usable stock, and kerf must be smaller than the sheet.');
    ids.add(group.id);
  }
  let count = 0;
  for (const part of value.parts) {
    if (!text(part.label) || !ids.has(part.group) || !finite(part.length, 0.01, limit) || !finite(part.width, 0.01, limit) || !Number.isInteger(part.qty) || part.qty < 1 || typeof part.allowRotate !== 'boolean') throw new Error('Check every panel: name, dimensions, whole quantity and material group are required.');
    count += part.qty;
  }
  if (count > 500) throw new Error('This browser planner supports up to 500 individual panels. Split the job into smaller batches.');
  if (!Array.isArray(value.exclusions) || value.exclusions.length > 10 || !value.exclusions.every(item => text(item, 300))) throw new Error('Unsupported list limitations.');
  // Return only supported fields so constraints can never silently survive as ignored data.
  const topKeys = ['version', 'scenario', 'unit', 'groups', 'parts', 'exclusions'];
  const groupKeys = ['id', 'material', 'thickness', 'sheetLength', 'sheetWidth', 'kerf', 'trim', 'price', 'allowRotate'];
  const partKeys = ['label', 'length', 'width', 'qty', 'group', 'allowRotate'];
  if (Object.keys(value).some(k => !topKeys.includes(k)) || value.groups.some(g => Object.keys(g).some(k => !groupKeys.includes(k))) || value.parts.some(p => Object.keys(p).some(k => !partKeys.includes(k)))) throw new Error('This list contains constraints this calculator does not support. Use its original planner.');
  return structuredClone(value);
}
export function convertProject(project, unit) {
  const next = validateProject(project);
  if (!['in', 'mm'].includes(unit)) throw new Error('Unsupported unit.');
  const factor = next.unit === unit ? 1 : unit === 'mm' ? 25.4 : 1 / 25.4;
  next.unit = unit;
  for (const group of next.groups) for (const key of ['thickness', 'sheetLength', 'sheetWidth', 'kerf', 'trim']) group[key] *= factor;
  for (const part of next.parts) for (const key of ['length', 'width']) part[key] *= factor;
  return next;
}
export function calculateProject(project, pack) {
  const input = convertProject(project, 'in');
  const groups = input.groups.filter(group => input.parts.some(part => part.group === group.id)).map(group => {
    const parts = input.parts.filter(part => part.group === group.id);
    const length = group.sheetLength - 2 * group.trim;
    const width = group.sheetWidth - 2 * group.trim;
    const plan = pack(parts, length, width, group.kerf, group.allowRotate);
    return { group, parts, plan, length, width };
  });
  return { input, groups, complete: groups.every(g => g.plan.rejected.length === 0), sheets: groups.reduce((n, g) => n + g.plan.sheets.length, 0), rejected: groups.reduce((n, g) => n + g.plan.rejected.length, 0) };
}
export function cutListCsv(project, result) {
  const complete = result.complete ? 'complete-panel-layout' : 'incomplete-panel-layout';
  const headers = ['part', 'length', 'width', 'quantity', 'unit', 'material_group', 'material', 'thickness', 'rotation_allowed', 'sheet_length', 'sheet_width', 'kerf', 'edge_trim', 'layout_status', 'limitations'];
  const rows = project.parts.map(part => {
    const g = project.groups.find(g => g.id === part.group);
    return [part.label, part.length, part.width, part.qty, project.unit, g.id, g.material, g.thickness, part.allowRotate && g.allowRotate, g.sheetLength, g.sheetWidth, g.kerf, g.trim, complete, project.exclusions.join(' | ')];
  });
  const cell = value => {
    let s = String(value);
    if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
    return `"${s.replaceAll('"', '""')}"`;
  };
  return [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

// Existing component snapshots use base inches, regardless of their display unit.
export function componentHandoff(instances) {
  if (!Array.isArray(instances) || !instances.length) throw new Error('Add a component before opening its layout.');
  const groups = [], parts = [];
  const groupKeys = new Map();
  for (const instance of instances) for (const part of instance.parts || []) {
    if (!['Cabinet back panel', 'Cabinet panel', 'Finished drawer-front panel', 'Finished exterior panel', 'Finished filler panel', 'Shelf panel'].includes(part.materialGroup)) throw new Error('This component includes lumber or unspecified stock. Review it in the component planner; only explicitly named sheet-panel materials can be transferred.');
    if (!['Any', 'Lengthwise', 'Lengthwise across cabinet width'].includes(part.grain)) throw new Error('This component has a project-specific or vertical grain rule. Resolve that orientation in the component planner before using a sheet layout; it cannot be dropped during transfer.');
    const key = JSON.stringify([part.materialGroup, part.thickness]);
    if (!groupKeys.has(key)) {
      const id = `component-${groups.length + 1}`; groupKeys.set(key, id);
      groups.push({ id, material: part.materialGroup, thickness: part.thickness, sheetLength: 96, sheetWidth: 48, kerf: 0.125, trim: 0, price: 0, allowRotate: true });
    }
    parts.push({ label: part.name, length: part.length, width: part.width, qty: part.quantity, group: groupKeys.get(key), allowRotate: part.grain === 'Any' });
  }
  return validateProject({ version: 1, unit: 'in', scenario: 'none', groups, parts, exclusions: ['Transferred component rectangles only. Review component joinery, hardware and structural checks in the source planner before cutting.', 'Actual material thickness and supported grain locks are retained. Sheet size defaults to 96 × 48 inches, kerf to 1/8 inch and trim to zero; review these before calculating.'] });
}
