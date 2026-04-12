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

function literalRefs(addr) {
  const lo = addr & 0xff;
  const hi = (addr >> 8) & 0xff;
  const hits = [];
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === lo && bytes[i + 1] === hi) hits.push(i);
  }
  return hits;
}

const targets = [0x3E2E, 0x3DFE, 0x3E0A, 0x3DE6, 0x3DF2, 0x3CF5, 0x3DDA, 0x3DCE];
const out = [];

out.push("# Soldier Blade State Consumer Probe");
out.push("");

for (const t of targets) {
  const refs = literalRefs(t);
  out.push(`## $${hex(t, 4)} refs (${refs.length})`);
  out.push(refs.slice(0, 120).map((x) => `0x${hex(x, 6)}`).join(", "));
  out.push("");
  for (const r of refs.slice(0, 8)) {
    out.push(`### around 0x${hex(r, 6)}`);
    out.push("```text");
    out.push(dump(Math.max(0, r - 0x20), 0x80));
    out.push("```");
  }
}

const outPath = path.join(__dirname, "..", "analysis", "soldier-blade-state-consumer-probe.md");
fs.writeFileSync(outPath, out.join("\n"));
console.log(outPath);
