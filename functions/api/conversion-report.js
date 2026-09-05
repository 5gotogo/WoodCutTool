import { dailyCsv, reportRange, summarizeDaily } from '../lib/conversion-daily.js';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Content-Type': 'application/json' };
export async function onRequest({ request, env = {} }) {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET' } });
  if (!env.CONVERSION_REPORT_TOKEN) return new Response('{"error":"report-not-configured"}', { status: 503, headers });
  if (request.headers.get('Authorization') !== `Bearer ${env.CONVERSION_REPORT_TOKEN}`) return new Response('{"error":"unauthorized"}', { status: 401, headers });
  if (!env.CONVERSION_DB) return new Response('{"error":"database-not-configured"}', { status: 503, headers });
  const url = new URL(request.url);
  let range;
  try { range = reportRange(url); } catch (error) { return new Response(JSON.stringify({ error: error.message }), { status: 400, headers }); }
  try {
    const result = await env.CONVERSION_DB.prepare('SELECT * FROM conversion_daily WHERE date BETWEEN ? AND ? ORDER BY date, route, scenario, event, device, placement LIMIT 100001').bind(...range).all();
    if (result.success === false) throw new Error('query-failed');
    const rows = result.results;
    if (rows.length > 100000) return new Response('{"error":"narrow-date-range"}', { status: 413, headers });
    if (url.searchParams.get('format') === 'csv') return new Response(dailyCsv(rows), { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="conversion-daily.csv"' } });
    return new Response(JSON.stringify({ timezone: 'UTC', from: range[0], to: range[1], measurement: 'Event counts and ratios, not unique people, sessions or installs. Repeated actions count again; DNT traffic is absent. Zero denominators are null.', rows, summary: summarizeDaily(rows) }), { headers });
  } catch { return new Response('{"error":"report-query-failed"}', { status: 503, headers }); }
}
