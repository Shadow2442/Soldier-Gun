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

function compareBlocks(a, b, length) {
  let same = 0;
  let diff = 0;
  const changes = [];
  for (let i = 0; i < length; i++) {
    const av = bytes[a + i];
    const bv = bytes[b + i];
    if (av === bv) {
      same++;
    } else {
      diff++;
      if (changes.length < 64) {
        changes.push({ offset: i, a: av, b: bv });
      }
    }
  }
  return { same, diff, changes };
}

function findRepeatedWindows(start, end, windowSize) {
  const map = new Map();
  for (let off = start; off <= end - windowSize; off += windowSize) {
    const key = bytes.slice(off, off + windowSize).toString("hex");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(off);
  }
  return [...map.entries()]
    .filter(([, offs]) => offs.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 32)
    .map(([key, offs]) => ({ key: key.slice(0, 32), offs }));
}

const regions = [
  { name: "candidate_a", start: 0x0232F0, width: 16, rows: 8 },
  { name: "candidate_b", start: 0x02333C, width: 16, rows: 8 },
  { name: "candidate_c", start: 0x0234F0, width: 16, rows: 8 },
  { name: "candidate_d", start: 0x026300, width: 16, rows: 8 },
];

const comparisons = [
  [0x0232F0, 0x02333C, 0x80],
  [0x0232F0, 0x0234F0, 0x80],
  [0x02333C, 0x0234F0, 0x80],
];

const out = [];
out.push("# Soldier Blade Screen Probe");
out.push("");

for (const region of regions) {
  out.push(`## ${region.name} @ 0x${hex(region.start, 6)}`);
  out.push("```text");
  out.push(grid(region.start, region.width, region.rows));
  out.push("```");
  out.push("");
}

out.push("## Block comparisons");
for (const [a, b, len] of comparisons) {
  const cmp = compareBlocks(a, b, len);
  out.push(`- 0x${hex(a, 6)} vs 0x${hex(b, 6)} over 0x${hex(len, 4)} bytes: same=${cmp.same}, diff=${cmp.diff}`);
  for (const ch of cmp.changes.slice(0, 20)) {
    out.push(`  - +0x${hex(ch.offset, 4)}: ${hex(ch.a)} -> ${hex(ch.b)}`);
  }
}
out.push("");

out.push("## Repeated 16-byte windows in 0x023000-0x0235FF");
for (const item of findRepeatedWindows(0x023000, 0x023600, 0x10)) {
  out.push(`- ${item.offs.map((x) => `0x${hex(x, 6)}`).join(", ")}`);
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-screen-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
