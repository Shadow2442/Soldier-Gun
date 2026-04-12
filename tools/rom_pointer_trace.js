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

function findStoreTo(zp) {
  const hits = [];
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0x85 && bytes[i + 1] === zp) hits.push(i); // STA zp
    if (bytes[i] === 0x64 && bytes[i + 1] === zp) hits.push(i); // STZ zp
    if (bytes[i] === 0xA5 && bytes[i + 1] === zp) hits.push(i); // LDA zp context
  }
  return hits;
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

const patterns = {
  sta_e3: findPattern([0x85, 0xE3]),
  sta_e4: findPattern([0x85, 0xE4]),
  lda_table_then_sta_e3: findPattern([0xB9, null, null, 0x85, 0xE3]),
  lda_table_then_sta_e4: findPattern([0xB9, null, null, 0x85, 0xE4]),
  decoder_entry: findPattern([0xB1, 0xE3, 0xC9, 0xFB]),
};

const interestingOffsets = new Set([
  ...patterns.sta_e3,
  ...patterns.sta_e4,
  ...patterns.lda_table_then_sta_e3,
  ...patterns.lda_table_then_sta_e4,
  ...patterns.decoder_entry,
]);

const nearDecoder = [...interestingOffsets]
  .filter((x) => x >= 0x02CF00 && x <= 0x02D100)
  .sort((a, b) => a - b);

const out = [];
out.push("# Soldier Blade Pointer Trace");
out.push("");

for (const [name, hits] of Object.entries(patterns)) {
  out.push(`## ${name}`);
  out.push(`count=${hits.length}`);
  out.push(hits.slice(0, 120).map((x) => `0x${hex(x, 6)}`).join(", "));
  out.push("");
}

out.push("## Context near decoder region");
for (const off of nearDecoder) {
  out.push(`### around 0x${hex(off, 6)}`);
  out.push("```text");
  out.push(dump(Math.max(0, off - 0x20), 0x80));
  out.push("```");
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-pointer-trace.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
