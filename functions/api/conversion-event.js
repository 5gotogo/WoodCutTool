import { conversionEventSchemas, sanitizeConversionDetails } from '../lib/conversion-event-schema.js';
import { aggregateRecord, incrementDaily } from '../lib/conversion-daily.js';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
export async function onRequest({ request, env = {} }) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });
  if (request.headers.get('DNT') === '1') return new Response(null, { status: 204, headers });
  const origin = request.headers.get('Origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return new Response(null, { status: 403, headers });
  let input, row;
  try {
    if (Number(request.headers.get('content-length')) > 4096) return new Response(null, { status: 413, headers });
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400, headers });
    let size = 0, chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return new Response(null, { status: 413, headers }); }
      chunks.push(value);
    }
    input = JSON.parse(await new Blob(chunks).text());
    if (!Object.hasOwn(conversionEventSchemas, input?.event)) throw new Error('unknown-event');
    const sanitized = sanitizeConversionDetails(input.event, input.details);
    if (!sanitized.ok) throw new Error('invalid-details');
    row = aggregateRecord({ ...input, details: sanitized.details });
  } catch { return new Response(null, { status: 400, headers }); }
  // Persist only bounded routing dimensions and counters. Never log client payloads.
  if (!env.CONVERSION_DB) return new Response(null, { status: 503, headers });
  try { await incrementDaily(env.CONVERSION_DB, row); }
  catch { console.error('conversion-aggregate-write-failed'); return new Response(null, { status: 503, headers }); }
  return new Response(null, { status: 204, headers });
}
