const fs = require("fs");
const path = require("path");

const romPath = path.join(__dirname, "..", "analysis", "Soldier Blade (Japan).pce");
const bytes = fs.readFileSync(romPath);

function hex(v, w = 2) {
  return v.toString(16).toUpperCase().padStart(w, "0");
}

function dump(start, length) {
  const out = [];
  for (let i = start; i < start + length; i += 16) {
    const s = bytes.slice(i, Math.min(i + 16, bytes.length));
    const hx = [...s].map((b) => hex(b)).join(" ");
    const asc = [...s].map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ".")).join("");
    out.push(`${hex(i, 6)}  ${hx.padEnd(47, " ")}  ${asc}`);
  }
  return out.join("\n");
}

function read16(off) {
  return bytes[off] | (bytes[off + 1] << 8);
}

const tableLo = 0x5B92;
const tableHi = 0x5B93;
const count = 32;
const entries = [];

for (let i = 0; i < count; i++) {
  const lo = bytes[tableLo + i * 2];
  const hi = bytes[tableHi + i * 2];
  const ptr = lo | (hi << 8);
  entries.push({ index: i, lo, hi, ptr });
}

function markerStats(start, len) {
  const slice = bytes.slice(start, Math.min(start + len, bytes.length));
  const markers = [0xFB, 0xFC, 0xFD, 0xFE, 0xFF, 0xEF, 0xF0, 0xF7, 0xF8, 0xF9, 0xFA];
  const counts = {};
  for (const m of markers) counts[hex(m)] = 0;
  for (const b of slice) {
    if (counts[hex(b)] !== undefined) counts[hex(b)]++;
  }
  return counts;
}

const out = [];
out.push("# Soldier Blade Stream Table Probe");
out.push("");
out.push("## Raw pointer table entries");
for (const e of entries) {
  out.push(`- idx ${e.index.toString().padStart(2, " ")}: lo=${hex(e.lo)} hi=${hex(e.hi)} ptr=$${hex(e.ptr, 4)}`);
}
out.push("");

out.push("## Sample pointed-to regions");
for (const e of entries.slice(0, 16)) {
  out.push(`### idx ${e.index} -> $${hex(e.ptr, 4)}`);
  out.push(`marker stats: ${JSON.stringify(markerStats(e.ptr, 0x40))}`);
  out.push("```text");
  out.push(dump(e.ptr, 0x40));
  out.push("```");
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-stream-table-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
