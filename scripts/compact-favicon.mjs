import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

// Retain the original tab-sized frames byte-for-byte. Large launcher artwork
// remains in apple-touch-icon.png and the manifest's separate app icons.
const path = new URL("../favicon.ico", import.meta.url);
const input = readFileSync(path);
assert.equal(input.readUInt16LE(0), 0);
assert.equal(input.readUInt16LE(2), 1);
const frames = [];
for (let i = 0; i < input.readUInt16LE(4); i++) {
  const entry = Buffer.from(input.subarray(6 + i * 16, 22 + i * 16));
  const width = entry[0] || 256, height = entry[1] || 256;
  if (width > 48 || height > 48) continue;
  const offset = entry.readUInt32LE(12), size = entry.readUInt32LE(8);
  assert(offset + size <= input.length);
  frames.push({ entry, data: input.subarray(offset, offset + size) });
}
assert.deepEqual(frames.map(({ entry }) => entry[0]), [16, 32, 48]);
const header = Buffer.from(input.subarray(0, 6));
header.writeUInt16LE(frames.length, 4);
let offset = 6 + frames.length * 16;
for (const frame of frames) {
  frame.entry.writeUInt32LE(offset, 12);
  offset += frame.data.length;
}
const output = Buffer.concat([header, ...frames.map(f => f.entry), ...frames.map(f => f.data)]);
assert(output.length < 8_000);
if (!input.equals(output)) writeFileSync(path, output);
console.log(`Tab icon: ${input.length} -> ${output.length} bytes; original 16/32/48px artwork retained.`);
