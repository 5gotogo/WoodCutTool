// Token is an environment variable, never a URL parameter or CLI argument.
const [origin, from, to, format = 'json'] = process.argv.slice(2);
if (!origin || !from || !to || !process.env.CONVERSION_REPORT_TOKEN) throw new Error('Usage: CONVERSION_REPORT_TOKEN=... node scripts/export-conversion-report.mjs <origin> <from> <to> [json|csv]');
const url = new URL('/api/conversion-report', origin);
if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Remote reports require HTTPS.');
for (const [key, value] of Object.entries({ from, to, format })) url.searchParams.set(key, value);
const response = await fetch(url, { headers: { Authorization: `Bearer ${process.env.CONVERSION_REPORT_TOKEN}` }, redirect: 'error' });
if (!response.ok) throw new Error(`Report request failed (${response.status})`);
process.stdout.write(await response.text());
