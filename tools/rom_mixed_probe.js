const fs = require("fs");
const path = require("path");

const romPath = path.join(__dirname, "..", "analysis", "Soldier Blade (Japan).pce");
const bytes = fs.readFileSync(romPath);

function hex(v, w = 2) {
  return v.toString(16).toUpperCase().padStart(w, "0");
}

function grid(start, width, rows) {
  const out = [];
  for (let r = 0; r < rows; r++) {
    const off = start + r * width;
    const slice = bytes.slice(off, off + width);
    out.push(`${hex(off, 6)}  ${[...slice].map((b) => hex(b)).join(" ")}`);
  }
  return out.join("\n");
}

function compare(a, b, len) {
  const changes = [];
  let same = 0;
  let diff = 0;
  for (let i = 0; i < len; i++) {
    const av = bytes[a + i];
    const bv = bytes[b + i];
    if (av === bv) {
      same++;
    } else {
      diff++;
      if (changes.length < 64) changes.push({ i, av, bv });
    }
  }
  return { same, diff, changes };
}

function strideStats(start, end, stride) {
  const rows = [];
  for (let off = start; off + stride <= end; off += stride) {
    rows.push([...bytes.slice(off, off + stride)]);
  }
  const columns = [];
  for (let c = 0; c < stride; c++) {
    const vals = rows.map((r) => r[c]);
    const uniq = new Set(vals);
    columns.push({
      column: c,
      unique: uniq.size,
      sample: vals.slice(0, 16),
    });
  }
  return columns;
}

const base = 0x026300;
const variants = [0x026300, 0x026380, 0x026400, 0x026480];
const out = [];

out.push("# Soldier Blade Mixed-Data Probe");
out.push("");

for (const v of variants) {
  out.push(`## Region 0x${hex(v, 6)}`);
  out.push("```text");
  out.push(grid(v, 16, 8));
  out.push("```");
  out.push("");
}

out.push("## Variant comparisons (0x80-byte windows)");
for (let i = 1; i < variants.length; i++) {
  const c = compare(base, variants[i], 0x80);
  out.push(`- 0x${hex(base, 6)} vs 0x${hex(variants[i], 6)}: same=${c.same}, diff=${c.diff}`);
  for (const ch of c.changes.slice(0, 24)) {
    out.push(`  - +0x${hex(ch.i, 4)}: ${hex(ch.av)} -> ${hex(ch.bv)}`);
  }
}

out.push("");
out.push("## Column uniqueness assuming 16-byte records from 0x026300-0x0263FF");
for (const col of strideStats(0x026300, 0x026400, 16)) {
  out.push(`- col ${col.column}: unique=${col.unique} sample=${col.sample.map((v) => hex(v)).join(" ")}`);
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-mixed-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
