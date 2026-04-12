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

function findPattern(pattern) {
  const hits = [];
  for (let i = 0; i <= bytes.length - pattern.length; i++) {
    let ok = true;
    for (let j = 0; j < pattern.length; j++) {
      const p = pattern[j];
      if (p !== null && bytes[i + j] !== p) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(i);
  }
  return hits;
}

function findCmpImm(value) {
  const hits = [];
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0xC9 && bytes[i + 1] === value) hits.push(i);
  }
  return hits;
}

function nearbyPointerReads(windowStart, windowEnd) {
  const hits = [];
  for (let i = windowStart; i < windowEnd - 1; i++) {
    if (bytes[i] === 0xB1) {
      hits.push({ offset: i, zp: bytes[i + 1] });
    }
  }
  return hits;
}

const interesting = [
  { name: "cmp_FE", hits: findCmpImm(0xFE) },
  { name: "cmp_FF", hits: findCmpImm(0xFF) },
  { name: "cmp_EF", hits: findCmpImm(0xEF) },
  { name: "cmp_F0", hits: findCmpImm(0xF0) },
  { name: "cmp_F7", hits: findCmpImm(0xF7) },
  { name: "cmp_F8", hits: findCmpImm(0xF8) },
  { name: "cmp_F9", hits: findCmpImm(0xF9) },
  { name: "cmp_FA", hits: findCmpImm(0xFA) },
];

const pointerPatterns = [
  { name: "stream_read_39", hits: findPattern([0xB1, 0x39]) },
  { name: "stream_read_37", hits: findPattern([0xB1, 0x37]) },
  { name: "stream_read_3B", hits: findPattern([0xB1, 0x3B]) },
  { name: "cmp_then_branch", hits: findPattern([0xC9, null, 0xF0, null]) },
  { name: "cmp_then_bne", hits: findPattern([0xC9, null, 0xD0, null]) },
];

const focusRanges = [
  [0x00C000, 0x00D400],
  [0x00E000, 0x00F400],
  [0x010000, 0x012800],
];

const out = [];
out.push("# Soldier Blade Decoder Probe");
out.push("");

out.push("## Marker compares");
for (const item of interesting) {
  out.push(`- ${item.name}: ${item.hits.length} hits`);
  out.push(`  ${item.hits.slice(0, 80).map((x) => `0x${hex(x, 6)}`).join(", ")}`);
}
out.push("");

out.push("## Pointer-read patterns");
for (const item of pointerPatterns) {
  out.push(`- ${item.name}: ${item.hits.length} hits`);
  out.push(`  ${item.hits.slice(0, 80).map((x) => `0x${hex(x, 6)}`).join(", ")}`);
}
out.push("");

out.push("## Pointer reads in focus ranges");
for (const [start, end] of focusRanges) {
  out.push(`### 0x${hex(start, 6)}-0x${hex(end, 6)}`);
  const hits = nearbyPointerReads(start, end);
  out.push(hits.slice(0, 120).map((h) => `0x${hex(h.offset, 6)}: ($${hex(h.zp)})`).join(", "));
}
out.push("");

out.push("## Dumps around selected FE/FF compares");
const selected = [...new Set([...findCmpImm(0xFE), ...findCmpImm(0xFF), ...findCmpImm(0xEF)])].slice(0, 24);
for (const off of selected) {
  out.push(`### around 0x${hex(off, 6)}`);
  out.push("```text");
  out.push(dump(Math.max(0, off - 0x20), 0x60));
  out.push("```");
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-decoder-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
