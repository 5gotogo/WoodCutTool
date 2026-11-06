import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");

export function homeRuntimeSource() {
  return '// Generated from scripts/home-planner-runtime.js.\n' + readFileSync(resolve(root, 'scripts/home-planner-runtime.js'), 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = homeRuntimeSource();
  writeFileSync(resolve(root, "assets/home.js"), source);
  console.log(`Built home runtime: ${Buffer.byteLength(source)} bytes.`);
}
