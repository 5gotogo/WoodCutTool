// Cold connections and connection reuse are different experiments. Each route
// gets its own curl process; its second transfer reuses the first connection
// when the server permits it. Public URLs only: no browser cookies or credentials.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const exec = promisify(execFile);
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [key, ...value] = arg.replace(/^--/, "").split("="); return [key, value.join("=")];
}));
const origin = new URL(args.origin || "https://woodcuttool.com").origin;
const routes = (args.routes || "/wood/african-mahogany/,/troubleshooting/,/compare/track-saw-vs-table-saw-sheet-goods/,/learn/storage-bench-hinge-clearance-guide/").split(",");
const rounds = Math.max(1, Number(args.runs || 3));
const output = args.output || "/tmp/wct-static-delivery.json";
const directory = mkdtempSync(join(tmpdir(), "wct-delivery-"));
const rows = [], failures = [];
const pickHeaders = headers => Object.fromEntries([...headers.matchAll(/^([^:\r\n]+):\s*([^\r\n]*)/gm)]
  .map(([, key, value]) => [key.toLowerCase(), value])
  .filter(([key]) => ["content-type", "content-encoding", "cache-control", "cf-cache-status", "cf-ray", "etag", "age", "location", "link"].includes(key)));
try {
  for (const route of routes) {
    if (!route.startsWith("/") || route.startsWith("//")) throw Error("Routes must be same-origin paths");
    const url = new URL(route, origin).href;
    for (let run = 1; run <= rounds; run++) {
      const options = [];
      for (let request = 0; request < 2; request++) {
        if (request) options.push("--next");
        options.push("--silent", "--show-error", "--compressed", "--max-time", "25", "--dump-header", join(directory, `headers-${request}`),
          "--output", join(directory, `body-${request}`), "--write-out", "%{json}\\n", url);
      }
      const { stdout, stderr } = await exec("curl", options, { maxBuffer: 2_000_000 }).catch(error => ({ stdout: error.stdout || "", stderr: error.stderr || error.message }));
      const transfers = stdout.trim().split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
      for (let request = 0; request < transfers.length; request++) {
        const timing = transfers[request];
        // curl can emit timings for DNS/TLS/connection failures without creating
        // a response body. Keep the real failure instead of masking it with ENOENT.
        const readResponse = name => existsSync(join(directory, name)) ? readFileSync(join(directory, name), "utf8") : "";
        const headers = pickHeaders(readResponse(`headers-${request}`));
        const body = readResponse(`body-${request}`);
        const ms = value => Math.round(value * 1000);
        const row = { route, run, request: request + 1, newConnections: timing.num_connects,
          status: timing.http_code, protocol: timing.http_version, remoteIp: timing.remote_ip,
          dns: ms(timing.time_namelookup), tcp: ms(timing.time_connect - timing.time_namelookup),
          tls: ms(timing.time_appconnect ? timing.time_appconnect - timing.time_connect : 0),
          requestWait: ms(timing.time_starttransfer - Math.max(timing.time_appconnect, timing.time_connect)),
          ttfb: ms(timing.time_starttransfer), download: ms(timing.time_total - timing.time_starttransfer),
          bytes: timing.size_download, headers,
          content: { hasMain: /<main\b/.test(body), hasInlineStyles: /<style data-/.test(body),
            oldChrome: /src="\/assets\/site-chrome\.js"/.test(body), splitNavigation: /src="\/assets\/site-navigation\.js"/.test(body),
            edgeInjection: /\/cdn-cgi\/(?:challenge-platform|scripts)/.test(body) },
          error: timing.errormsg || "" };
        rows.push(row);
        if (row.status !== 200 || row.error || !row.content.hasMain) failures.push({ route, run, request: request + 1, status: row.status, error: row.error || "Invalid HTML/status" });
        console.log(`${route} run ${run}/${request + 1}: ${row.status}, TTFB ${row.ttfb}ms, DNS/TCP/TLS/wait ${row.dns}/${row.tcp}/${row.tls}/${row.requestWait}ms, connections ${row.newConnections}`);
      }
      if (transfers.length !== 2) failures.push({ route, run, error: stderr || "Missing transfer" });
    }
  }
} finally {
  writeFileSync(output, JSON.stringify({ origin, rounds, scope: "Single-client public HTTP probe, not field LCP. Request 1 starts a new curl process; request 2 may reuse connections (see newConnections). No retries or discarded outliers.", rows, failures }, null, 2) + "\n");
  rmSync(directory, { recursive: true, force: true });
}
if (failures.length) process.exitCode = 1;
