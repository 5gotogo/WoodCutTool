import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { onRequest as recordConversion } from "../functions/api/conversion-event.js";
import { onRequest as redirectCutList } from "../functions/go/cutlist.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultPort = Number(process.env.PORT || 4175);
const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : defaultPort);
const host = "0.0.0.0";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

function requestUrl(request) {
  const authority = request.headers.host || `127.0.0.1:${port}`;
  return new URL(request.url || "/", `http://${authority}`);
}

async function requestBody(request) {
  if (request.method === "GET" || request.method === "HEAD") return undefined;
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error("Request body is too large");
    chunks.push(chunk);
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function webRequest(request, url) {
  const body = await requestBody(request);
  return new Request(url, {
    method: request.method,
    headers: request.headers,
    ...(body ? { body } : {}),
  });
}

async function sendWebResponse(response, outgoing) {
  outgoing.statusCode = response.status;
  response.headers.forEach((value, name) => outgoing.setHeader(name, value));
  if (!response.body) {
    outgoing.end();
    return;
  }
  outgoing.end(Buffer.from(await response.arrayBuffer()));
}

function staticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return "";
  }

  const relative = decoded.endsWith("/")
    ? `${decoded.slice(1)}index.html`
    : decoded.slice(1);
  const candidate = resolve(root, normalize(relative));
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return "";
  return candidate;
}

async function serveFile(request, response, path, statusCode = 200) {
  const details = await stat(path);
  response.statusCode = statusCode;
  response.setHeader("Content-Type", contentTypes.get(extname(path).toLowerCase()) || "application/octet-stream");
  response.setHeader("Content-Length", details.size);
  response.setHeader("Cache-Control", "no-cache");
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(path).pipe(response);
}

async function serveStatic(request, response, url) {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let path = staticPath(url.pathname);
  if (path && existsSync(path) && (await stat(path)).isDirectory()) {
    path = join(path, "index.html");
  }

  if (path && existsSync(path) && (await stat(path)).isFile()) {
    await serveFile(request, response, path);
    return;
  }

  const notFound = join(root, "404.html");
  if (existsSync(notFound)) {
    await serveFile(request, response, notFound, 404);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
}

async function handle(request, response) {
  const url = requestUrl(request);

  if (url.pathname === "/__health") {
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(JSON.stringify({
      status: "ok",
      staticRoot: root,
      functions: ["/go/cutlist/", "/api/conversion-event"],
    }));
    return;
  }

  if (url.pathname === "/go/cutlist" || url.pathname === "/go/cutlist/") {
    const result = await redirectCutList({
      request: await webRequest(request, url),
      env: { APPLE_PROVIDER_TOKEN: process.env.APPLE_PROVIDER_TOKEN || "" },
    });
    await sendWebResponse(result, response);
    return;
  }

  if (url.pathname === "/api/conversion-event") {
    const result = await recordConversion({
      request: await webRequest(request, url),
      env: {},
    });
    await sendWebResponse(result, response);
    return;
  }

  await serveStatic(request, response, url);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${process.argv[portFlag + 1] || defaultPort}`);
}

const server = createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("Local preview server error");
  });
});

server.listen(port, host, () => {
  console.log(`WoodCutTool local preview: http://127.0.0.1:${port}/`);
  console.log("Cloudflare-compatible routes: /go/cutlist/ and /api/conversion-event");
});

