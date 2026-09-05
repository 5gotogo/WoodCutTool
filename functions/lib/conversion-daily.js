import { conversionRoutes } from './conversion-routes.js';

export const scenarios = ['none', 'bookshelf', 'garage-shelves', 'base-cabinet'];
const devices = ['desktop', 'iphone', 'ipad', 'android', 'mobile-other'];
export function aggregateRecord(input, now = new Date()) {
  if (!conversionRoutes.has(input.path)) throw new Error('invalid-route');
  const candidate = input.details?.scenario;
  if (candidate !== undefined && !scenarios.includes(candidate)) throw new Error('invalid-scenario');
  const source = input.details?.placement || input.details?.source || '';
  const placement = /result/.test(source) ? 'result' : ['hero', 'content', 'navigation', 'footer'].includes(source) ? source : 'other';
  return {
    date: now.toISOString().slice(0, 10),
    route: input.path,
    scenario: candidate || 'none',
    event: input.event,
    device: devices.includes(input.device) ? input.device : 'unknown',
    placement,
  };
}

export async function incrementDaily(db, row) {
  const result = await db.prepare(`INSERT INTO conversion_daily
    (date, route, scenario, event, device, placement, count) VALUES (?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(date, route, scenario, event, device, placement)
    DO UPDATE SET count = count + 1`).bind(row.date, row.route, row.scenario, row.event, row.device, row.placement).run();
  if (result.success === false) throw new Error('aggregate-write-failed');
}

export function reportRange(url) {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!valid(from) || !valid(to) || to < from || (Date.parse(to) - Date.parse(from)) / 86400000 > 30) throw new Error('Use from/to UTC dates covering at most 31 days.');
  return [from, to];
}

export function summarizeDaily(rows) {
  const groups = new Map();
  for (const row of rows) {
    // A scenario spans source and calculator pages; unassigned traffic stays page-specific.
    const key = JSON.stringify([row.date, row.scenario, row.scenario === 'none' ? row.route : 'all-scenario-routes', row.device]);
    if (!groups.has(key)) groups.set(key, { date: row.date, scenario: row.scenario, route: row.scenario === 'none' ? row.route : 'all-scenario-routes', device: row.device, events: {}, resultCtaImpressions: 0, resultAppClicks: 0 });
    const item = groups.get(key);
    item.events[row.event] = (item.events[row.event] || 0) + row.count;
    if (row.placement === 'result' && row.event === 'cta_impression') item.resultCtaImpressions += row.count;
    if (row.placement === 'result' && row.event === 'app_store_click') item.resultAppClicks += row.count;
  }
  const ratio = (n, d) => d ? n / d : null;
  return [...groups.values()].map(item => ({ ...item, completionPerSubmit: ratio(item.events.calculator_complete || 0, item.events.calculator_submit || 0), exportPerCompletion: ratio(item.events.cut_list_export || 0, item.events.calculator_complete || 0), resultAppClickPerImpression: ratio(item.resultAppClicks, item.resultCtaImpressions) }));
}

export function dailyCsv(rows) {
  const keys = ['date', 'route', 'scenario', 'event', 'device', 'placement', 'count'];
  return [keys.join(','), ...rows.map(row => keys.map(key => `"${String(row[key]).replaceAll('"', '""')}"`).join(','))].join('\n') + '\n';
}
